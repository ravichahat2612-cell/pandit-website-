import {createClient} from '@supabase/supabase-js'
const url=import.meta.env.VITE_SUPABASE_URL,key=import.meta.env.VITE_SUPABASE_ANON_KEY
export const configured=!!(url&&key)
export const sb=configured?createClient(url,key):null
export async function upload(file){
  const ext=file.name.split('.').pop()
  const path=`${Date.now()}-${Math.random().toString(36).slice(2,8)}.${ext}`
  const {error}=await sb.storage.from('media').upload(path,file)
  if(error)throw error
  return sb.storage.from('media').getPublicUrl(path).data.publicUrl
}
