import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
}

// Helper to parse request body (handles both JSON and Blob)
async function parseRequestBody(req: Request): Promise<any> {
  const contentType = req.headers.get('content-type') || ''
  
  if (contentType.includes('application/json')) {
    return await req.json()
  }
  
  // Handle Blob (from sendBeacon)
  const blob = await req.blob()
  const text = await blob.text()
  try {
    return JSON.parse(text)
  } catch {
    throw new Error('Invalid JSON in request body')
  }
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      status: 204,
      headers: corsHeaders 
    })
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }), 
      { 
        status: 405, 
        headers: corsHeaders 
      }
    )
  }

  try {
    // Get environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase environment variables')
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }), 
        { 
          status: 500, 
          headers: corsHeaders 
        }
      )
    }

    // Parse request body
    let body: any
    try {
      body = await parseRequestBody(req)
    } catch (error) {
      console.error('Error parsing request body:', error)
      return new Response(
        JSON.stringify({ error: 'Invalid request body' }), 
        { 
          status: 400, 
          headers: corsHeaders 
        }
      )
    }

    // Extract and validate required fields
    const { session_id, user_id, event_type, event_data, url } = body

    if (!session_id || !event_type || !url) {
      return new Response(
        JSON.stringify({ 
          error: 'Missing required fields',
          required: ['session_id', 'event_type', 'url']
        }), 
        { 
          status: 400, 
          headers: corsHeaders 
        }
      )
    }

    // Get client information
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() 
      || req.headers.get('x-real-ip') 
      || req.headers.get('cf-connecting-ip') 
      || 'unknown'
    
    const userAgent = req.headers.get('user-agent') || 'unknown'

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Prepare data for insertion
    const activityData = {
      session_id,
      user_id: user_id || null,
      event_type,
      event_data: event_data || null,
      ip_address: ip,
      user_agent: userAgent,
      url,
    }

    // Insert into database
    const { data, error } = await supabase
      .from('user_activities')
      .insert(activityData)
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return new Response(
        JSON.stringify({ 
          error: 'Failed to record activity',
          details: error.message 
        }), 
        { 
          status: 500, 
          headers: corsHeaders 
        }
      )
    }

    // Success response
    return new Response(
      JSON.stringify({ 
        success: true,
        id: data?.id 
      }), 
      { 
        status: 200, 
        headers: corsHeaders 
      }
    )

  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }), 
      { 
        status: 500, 
        headers: corsHeaders 
      }
    )
  }
})
