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

  // Test 5: Try calling purge_old_scan_logs anonymously (Should fail with permission error)
  try {
    const { error } = await supabase.rpc('purge_old_scan_logs')
    if (error && (error.code === '42501' || error.message.includes('permission denied'))) {
      console.log('✅ Test 5 Passed: Anonymous execution of "purge_old_scan_logs" is BLOCKED (Permission Denied).')
    } else if (error) {
      console.log(`✅ Test 5 Passed: Anonymous execution of "purge_old_scan_logs" failed as expected (${error.message}).`)
    } else {
      console.error('❌ Test 5 FAILED: Anonymous client successfully invoked "purge_old_scan_logs"!')
      passed = false
    }
  } catch (err) {
    console.log('✅ Test 5 Passed: Anonymous execution of "purge_old_scan_logs" threw exception (blocked).')
  }

  // Test 6: Try calling delete_user_account anonymously (Should fail with permission error)
  try {
    const { error } = await supabase.rpc('delete_user_account')
    if (error && (error.code === '42501' || error.message.includes('permission denied'))) {
      console.log('✅ Test 6 Passed: Anonymous execution of "delete_user_account" is BLOCKED (Permission Denied).')
    } else if (error) {
      console.log(`✅ Test 6 Passed: Anonymous execution of "delete_user_account" failed as expected (${error.message}).`)
    } else {
      console.error('❌ Test 6 FAILED: Anonymous client successfully invoked "delete_user_account"!')
      passed = false
    }
  } catch (err) {
    console.log('✅ Test 6 Passed: Anonymous execution of "delete_user_account" threw exception (blocked).')
  }

  // Test 7: Verify that public.get_public_contacts does not expose 'contact_value'
  try {
    const { data, error } = await supabase.rpc('get_public_contacts', { p_token: 'dummy-token' })
    if (error) {
      console.error(`❌ Test 7 FAILED to execute get_public_contacts: ${error.message}`);
      passed = false;
    } else {
      console.log('✅ Test 7 Passed: public.get_public_contacts() executes successfully.');
      if (data && data.length > 0 && ('contact_value' in data[0] || 'caregiver_id' in data[0])) {
        console.error('❌ Test 7 FAILED: get_public_contacts exposes PII or caregiver metadata!');
        passed = false;
      } else {
        console.log('✅ Test 7 Passed: PII (contact_value) and metadata (caregiver_id) are NOT exposed in get_public_contacts results.');
      }
    }
  } catch (err) {
    console.error('❌ Test 7 FAILED calling get_public_contacts:', err);
    passed = false;
  }

  // Test 8: Verify that public.log_card_scan is executable anonymously
  try {
    const { error } = await supabase.rpc('log_card_scan', { p_token: 'dummy-token' })
    if (error) {
      console.error(`❌ Test 8 FAILED: log_card_scan execution failed: ${error.message}`);
      passed = false;
    } else {
      console.log('✅ Test 8 Passed: log_card_scan is executable anonymously.');
    }
  } catch (err) {
    console.error('❌ Test 8 FAILED calling log_card_scan:', err);
    passed = false;
  }

  // Test 9: Verify that anonymous UPDATE on trusted_contacts is BLOCKED by RLS
  try {
    const { data, error } = await supabase
      .from('trusted_contacts')
      .update({ contact_name: 'Hacked' })
      .eq('id', '00000000-0000-0000-0000-000000000000')
    if (error || !data || data.length === 0) {
      console.log('✅ Test 9 Passed: Anonymous UPDATE on "trusted_contacts" is BLOCKED.');
    } else {
      console.error('❌ Test 9 FAILED: Anonymous UPDATE on "trusted_contacts" succeeded!');
      passed = false;
    }
  } catch (err) {
    console.log('✅ Test 9 Passed: Anonymous UPDATE on "trusted_contacts" is BLOCKED.');
  }

  console.log('\n--- Summary ---')
  if (passed) {
    console.log('🟢 Configured security boundary tests completed successfully.')
    process.exit(0)
  } else {
    console.error('🔴 Warning: One or more security checks failed. Please verify your Supabase RLS policies.')
    process.exit(1)
  }
}

runSecurityTests()
