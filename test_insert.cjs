const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://wlitiuzirsayfizwjaye.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndsaXRpdXppcnNheWZpendqYXllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3MTEzNDQsImV4cCI6MjA3OTI4NzM0NH0.vHtlkhimiwcV6z1Hha8cLe6rOlN1919i7v7iz8ddbLQ';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testInsert() {
  console.log('Testing insert into merchants...');
  
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
