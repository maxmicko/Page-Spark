import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://gfpidktpzubpcsqlvxcq.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmcGlka3RwenVicGNzcWx2eGNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzMDk4NzYsImV4cCI6MjA4MTg4NTg3Nn0.lujAhtphHMLMVXSS6XMEGfoBbPo6jNeTyXJoiBO7RJY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)