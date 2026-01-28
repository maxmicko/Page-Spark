import { createClient } from '@supabase/supabase-js'
import nodemailer from 'nodemailer'
import type { VercelRequest, VercelResponse } from '@vercel/node'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

const smtpConfig = {
  host: process.env.SMTP_HOST!,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER!,
    pass: process.env.SMTP_PASS!,
  },
}

const transporter = nodemailer.createTransporter(smtpConfig)

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    console.log('Lead signup API called with body:', JSON.stringify(req.body, null, 2))
    
    const { first_name, business_name, phone, email, city, issue } = req.body

    // Validation - check for missing or empty required fields
    const missingFields: string[] = []
    
    if (!first_name || first_name.trim() === '') {
      missingFields.push('first_name')
    }
    if (!business_name || business_name.trim() === '') {
      missingFields.push('business_name')
    }
    if (!phone || phone.trim() === '') {
      missingFields.push('phone')
    }
    if (!email || email.trim() === '') {
      missingFields.push('email')
    }
    if (!issue || issue.trim() === '') {
      missingFields.push('issue')
    }

    if (missingFields.length > 0) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        missing_fields: missingFields
      })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' })
    }

    // Generate temporary password
    const tempPassword = Math.random().toString(36).slice(-12) + 'A1!'

    // Create user
    const { data: userData, error: userError } = await supabase.auth.admin.createUser({
      email,
      password: tempPassword,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        first_name,
        business_name,
        phone,
        city: city || '',
        issue,
      }
    })

    if (userError) {
      console.error('User creation error:', userError)
      if (userError.message.includes('already registered')) {
        return res.status(409).json({ error: 'Email already registered' })
      }
      return res.status(500).json({ error: 'Failed to create user' })
    }

    const userId = userData.user.id

    // Save lead signup data to lead_signups table
    console.log('Attempting to insert lead signup data:', { first_name, business_name, phone, email, city, issue })
    
    const { data: leadSignupData, error: leadSignupError } = await supabase
      .from('lead_signups')
      .insert({
        first_name,
        business_name,
        phone,
        email,
        city: city || null,
        issue,
      })
      .select()
      .single()

    if (leadSignupError) {
      console.error('Lead signup data save error:', leadSignupError)
      console.error('Error details:', JSON.stringify(leadSignupError, null, 2))
      // Don't fail the request, but log the error for debugging
      // The user is still created, which is the most important part
    } else {
      console.log('Lead signup data saved successfully:', leadSignupData?.id)
    }

    // Generate password reset link
    const { data: resetData, error: resetError } = await supabase.auth.admin.generateLink({
      type: 'recovery',
      email,
    })

    if (resetError) {
      console.error('Reset link generation error:', resetError)
      // Continue anyway, as user is created
    }

    const resetLink = resetData?.properties?.action_link || '#'

    // Send welcome email
    const mailOptions = {
      from: `"OrbitL Dash" <noreply@orbitl-dash.us>`,
      to: email,
      subject: 'Welcome to OrbitL Dash - Set Up Your Password',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to OrbitL Dash</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="https://orbitl-dash.us/favicon.png" alt="OrbitL Dash" style="width: 50px; height: 50px;">
            <h1 style="color: #2563eb; margin: 10px 0;">Welcome to OrbitL Dash, ${first_name}!</h1>
          </div>

          <p>Thank you for your interest in our free booking form. We've created your account and are excited to help you professionalize your mobile detailing business.</p>

          <p>To get started, please set up your password by clicking the button below:</p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Set Up Your Password</a>
          </div>

          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #2563eb;">${resetLink}</p>

          <p>Once you've set your password, you'll have access to:</p>
          <ul>
            <li>Customizable booking forms</li>
            <li>Customer management tools</li>
            <li>Appointment scheduling</li>
            <li>Business analytics</li>
          </ul>

          <p>If you have any questions, feel free to reply to this email or contact our support team.</p>

          <p>Best regards,<br>The OrbitL Dash Team</p>

          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

          <p style="font-size: 12px; color: #666; text-align: center;">
            This email was sent to ${email}. If you didn't request this, please ignore this email.
          </p>
        </body>
        </html>
      `,
    }

    try {
      await transporter.sendMail(mailOptions)
    } catch (emailError) {
      console.error('Email sending error:', emailError)
      // Continue anyway, as user and data are saved
    }

    // Optionally create customer record (if customers table exists)
    try {
      const { error: customerError } = await supabase
        .from('customers')
        .insert({
          user_id: userId,
          first_name,
          business_name,
          phone,
          email,
          city: city || null,
          notes: issue,
          created_at: new Date().toISOString(),
        })

      if (customerError) {
        console.error('Customer creation error:', customerError)
        // Continue anyway
      }
    } catch (customerTableError) {
      // Table might not exist, that's okay
      console.log('Customers table may not exist, skipping customer record creation')
    }

    // Get free plan and create subscription
    try {
      const { data: freePlan, error: planError } = await supabase
        .from('plans')
        .select('id')
        .eq('name', 'Free')
        .single()

      if (!planError && freePlan) {
        // Create subscription
        const { error: subscriptionError } = await supabase
          .from('subscriptions')
          .insert({
            user_id: userId,
            plan_id: freePlan.id,
            status: 'active',
            current_period_start: new Date().toISOString(),
            current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })

        if (subscriptionError) {
          console.error('Subscription creation error:', subscriptionError)
        }
      } else if (planError) {
        console.error('Free plan lookup error:', planError)
      }
    } catch (subscriptionError) {
      // Subscription creation is optional, log but don't fail
      console.error('Subscription setup error:', subscriptionError)
    }

    res.status(201).json({
      message: 'Account created successfully. Check your email for password setup instructions.',
      user_id: userId,
      lead_signup_id: leadSignupData?.id || null,
      lead_signup_saved: !!leadSignupData?.id,
    })

  } catch (error) {
    console.error('Lead signup error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}