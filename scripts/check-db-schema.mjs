import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bdemuejbsvggpcktkupx.supabase.co';
const supabaseKey = 'sb_publishable_uf7Kxrr075ulUigzz4R3sA_pEJdnv8V';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDatabase() {
  console.log('--- Full Read-Only Verification of Database Tables ---');
  
  const tables = [
    'profiles',
    'students',
    'parents',
    'parent_child_links',
    'fees',
    'payments',
    'invoices',
    'payment_orders',
    'notifications',
    'notification_preferences'
  ];
  
  for (const table of tables) {
    const { data, error } = await supabase.from(table).select('*').limit(1);
    if (error) {
      console.log(`❌ Table '${table}': NOT FOUND or ERROR -> ${error.code} (${error.message})`);
    } else {
      console.log(`✅ Table '${table}': Accessible and Schema Cache active`);
    }
  }
}

checkDatabase();
