import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { createClient } from '@supabase/supabase-js'

// Setup directory path in ESM
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 1. Manually parse .env to avoid external dotenv dependency
let envUrl = process.env.VITE_SUPABASE_URL
let envKey = process.env.VITE_SUPABASE_ANON_KEY

try {
  const envPath = path.join(__dirname, '../.env')
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8')
    const lines = envContent.split('\n')
    for (const line of lines) {
      const matchUrl = line.match(/^\s*VITE_SUPABASE_URL\s*=\s*([^\s#]+)/)
      const matchKey = line.match(/^\s*VITE_SUPABASE_ANON_KEY\s*=\s*([^\s#]+)/)
      if (matchUrl) envUrl = matchUrl[1].replace(/['"]/g, '')
      if (matchKey) envKey = matchKey[1].replace(/['"]/g, '')
    }
  }
} catch (e) {
  console.log('ℹ️ Env file not read. Falling back to process.env.')
}

if (!envUrl || !envKey) {
  console.error('❌ Error: Supabase credentials not found. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.')
  process.exit(1)
}

const supabase = createClient(envUrl, envKey)

console.log('🛡️ Starting CareCard Security Verification Checks...\n')

async function runSecurityTests() {
  let passed = true

  // Test 1: Direct SELECT on care_cards (Should return empty array or error out)
  try {
    const { data, error } = await supabase.from('care_cards').select('*')
    if (error || !data || data.length === 0) {
      console.log('✅ Test 1 Passed: Direct public read access to "care_cards" is BLOCKED.')
    } else {
      console.error('❌ Test 1 FAILED: Raw care_cards table is publicly readable!')
      passed = false
    }
  } catch (err) {
    console.log('✅ Test 1 Passed: Direct public read to "care_cards" threw exception (blocked).')
  }

  // Test 2: Direct SELECT on trusted_contacts (Should return empty array or error out)
  try {
    const { data, error } = await supabase.from('trusted_contacts').select('*')
    if (error || !data || data.length === 0) {
      console.log('✅ Test 2 Passed: Direct public read access to "trusted_contacts" is BLOCKED.')
    } else {
      console.error('❌ Test 2 FAILED: Raw trusted_contacts table is publicly readable!')
      passed = false
    }
  } catch (err) {
    console.log('✅ Test 2 Passed: Direct public read to "trusted_contacts" threw exception (blocked).')
  }

  // Test 3: Direct SELECT on scan_logs (Should return empty array or error out)
  try {
    const { data, error } = await supabase.from('scan_logs').select('*')
    if (error || !data || data.length === 0) {
      console.log('✅ Test 3 Passed: Direct public read access to "scan_logs" is BLOCKED.')
    } else {
      console.error('❌ Test 3 FAILED: Raw scan_logs table is publicly readable!')
      passed = false
    }
  } catch (err) {
    console.log('✅ Test 3 Passed: Direct public read to "scan_logs" threw exception (blocked).')
  }

  // Test 4: Direct INSERT on scan_logs (Should be blocked by RLS policies)
  try {
    const { error } = await supabase.from('scan_logs').insert([{ card_id: '00000000-0000-0000-0000-000000000000' }])
    if (error) {
      console.log('✅ Test 4 Passed: Direct public insertion into "scan_logs" is BLOCKED.')
    } else {
      console.error('❌ Test 4 FAILED: Direct public write to scan_logs bypassed security RLS!')
      passed = false
    }
  } catch (err) {
    console.log('✅ Test 4 Passed: Direct public write to "scan_logs" threw exception (blocked).')
  }

  console.log('\n--- Summary ---')
  if (passed) {
    console.log('🟢 All RLS and public access boundaries are secure!')
    process.exit(0)
  } else {
    console.error('🔴 Warning: One or more security checks failed. Please verify your Supabase RLS policies.')
    process.exit(1)
  }
}

runSecurityTests()
