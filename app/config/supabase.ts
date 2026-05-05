import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://fhhrijytqchdzanurqfj.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZoaHJpanl0cWNoZHphbnVycWZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5OTY4NjYsImV4cCI6MjA5MzU3Mjg2Nn0.ysss7n-Opok6fRVHC1X7LGRKG9ZY90R72bE2MEajveI'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
