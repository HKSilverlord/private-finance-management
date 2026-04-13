import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const results: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    env_url: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'MISSING',
    env_key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'MISSING',
  };

  // Step 1: Create client
  try {
    const supabase = await createClient();
    results.step1_client = 'OK';

    // Step 2: Get user
    try {
      const { data, error } = await supabase.auth.getUser();
      results.step2_auth = error ? `ERROR: ${error.message}` : 'OK';
      results.step2_user = data?.user?.email ?? 'no user';
    } catch (err) {
      results.step2_auth = `THREW: ${String(err)}`;
    }

    // Step 3: Query profiles
    try {
      const { data, error } = await supabase.from('profiles').select('*').limit(1);
      results.step3_profiles = error ? `ERROR: ${error.message} (${error.code})` : `OK (${data?.length ?? 0} rows)`;
    } catch (err) {
      results.step3_profiles = `THREW: ${String(err)}`;
    }

    // Step 4: Query households
    try {
      const { data, error } = await supabase.from('households').select('*').limit(1);
      results.step4_households = error ? `ERROR: ${error.message} (${error.code})` : `OK (${data?.length ?? 0} rows)`;
    } catch (err) {
      results.step4_households = `THREW: ${String(err)}`;
    }

    // Step 5: Query debts (test other tables exist)
    try {
      const { data, error } = await supabase.from('debts').select('*').limit(1);
      results.step5_debts = error ? `ERROR: ${error.message} (${error.code})` : `OK (${data?.length ?? 0} rows)`;
    } catch (err) {
      results.step5_debts = `THREW: ${String(err)}`;
    }

  } catch (err) {
    results.step1_client = `THREW: ${String(err)}`;
  }

  return NextResponse.json(results, { status: 200 });
}
