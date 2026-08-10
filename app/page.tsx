import { supabase } from "@/lib/supabase";

export default async function Home() {
  const { data } = await supabase.from("projects").select("*");

  return (
    <main style={{ padding: 40 }}>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </main>
  );
}