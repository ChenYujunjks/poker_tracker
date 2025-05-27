// app/actions/addPlayer.ts
"use server";

import { createClient } from "@supabase/supabase-js";

export async function addPlayer(formData: FormData) {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // 服务端专用
  );

  const name = formData.get("name") as string;
  const chips = Number(formData.get("chips"));

  await supabase.from("players").insert({ name, chips });
}
