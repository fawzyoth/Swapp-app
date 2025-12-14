const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://wlitiuzirsayfizwjaye.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhsd3pudWRqa2xlempraXR6cWVnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTU1ODkwMCwiZXhwIjoyMDgxMTM0OTAwfQ.22rXuFtDRrT0SPDm8592tgDgLSk_v_7PZ5e5EoJzL1U';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testInsert() {
  console.log('Testing insert with service role...');
  
  const { data, error } = await supabase
    .from('merchants')
    .insert({
      name: 'Test Merchant',
      email: 'test' + Date.now() + '@test.com',
      phone: '+216 11 111 111',
    })
    .select()
    .single();

  if (error) {
    console.log('ERROR:', error);
  } else {
    console.log('SUCCESS:', data);
  }
}

testInsert();
