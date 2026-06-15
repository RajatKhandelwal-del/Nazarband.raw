import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

export function getPhotoUrl(storagePath) {
  const { data } = supabase.storage.from('photos').getPublicUrl(storagePath)
  return data.publicUrl
}
