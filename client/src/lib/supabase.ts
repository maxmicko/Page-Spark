import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jywagmhjzivnjzxgpeuo.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5d2FnbWhqeml2bmp6eGdwZXVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1NDk2NjUsImV4cCI6MjA4NTEyNTY2NX0.mpxLPKWRPAqRiIdWbRI-JQVX6YD5HOvngimurbbouzU'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)