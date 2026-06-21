import { supabase } from '@/lib/supabase';
export default async function Page(){const {data}=await supabase.from('users').select('*').limit(50);return <div><h1 className="text-3xl font-bold mb-4">Users</h1><div className="card"><pre className="whitespace-pre-wrap text-sm">{JSON.stringify(data,null,2)}</pre></div></div>}
