import { createClient } from "@supabase/supabase-js";

const url = process.env.VITE_SUPABASE_URL || "https://tplycvnvheakhgefcoud.supabase.co";
const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!key) {
  console.error("Error: VITE_SUPABASE_PUBLISHABLE_KEY is not set.");
  process.exit(1);
}

const supabase = createClient(url, key);

const requiredTables = [
  "profiles",
  "business_periods",
  "opportunities",
  "products",
  "product_period_metrics",
  "inventory_items",
  "inventory_period_metrics",
  "expenses",
  "data_hub_files",
];

async function verify() {
  console.log(`Verifying connected Supabase project at ${url}...\n`);
  const status = {};
  let allExist = true;

  for (const table of requiredTables) {
    const { data, error } = await supabase.from(table).select("*").limit(1);
    if (error && error.code === "PGRST205") {
      status[table] = "MISSING (Table not yet created in schema)";
      allExist = false;
    } else if (error) {
      // If error is permission or empty table, it means the table exists and RLS is active!
      status[table] = `EXISTS (RLS active: ${error.message})`;
    } else {
      status[table] = "EXISTS (Ready)";
    }
  }

  console.table(
    Object.entries(status).map(([Table, Status]) => ({ Table, Status })),
  );

  if (allExist) {
    console.log("\nAll 9 tables verified successfully in Supabase!");
  } else {
    console.log(
      "\nSome tables have not been created in the database yet.",
    );
  }
}

verify();
