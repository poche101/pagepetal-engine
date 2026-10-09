import { createServerFn } from '@tanstack/react-start';
import { getRequestHeader } from '@tanstack/react-start/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { enquirySchema } from './schemas';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
import type { Database } from '@/integrations/supabase/types';
export const getContent = createServerFn({method:'GET'}).handler(async()=>{
 const key=process.env['SUPABASE_PUBLISHABLE_KEY']; const url=process.env['SUPABASE_URL'];
 if(!key || !url) throw new Error('Website content is temporarily unavailable.');
 const client=createClient<Database>(url,key,{auth:{persistSession:false},global:{fetch:(input,init)=>{const h=new Headers(init?.headers);if(key.startsWith('sb_')) h.delete('Authorization');h.set('apikey',key);return fetch(input,{...init,headers:h});}}});
 const {data,error}=await client.from('site_content').select('key,title,body,category').eq('published',true); if(error) throw new Error('Website content is temporarily unavailable.'); return data;
});
export const submitEnquiry = createServerFn({method:'POST'}).inputValidator(input=>enquirySchema.parse(input)).handler(async({data})=>{
 const {supabaseAdmin}=await import('@/integrations/supabase/client.server');
 const ip=getRequestHeader('cf-connecting-ip') || getRequestHeader('x-forwarded-for') || 'local';
 const hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(ip)))).map(x=>x.toString(16).padStart(2,'0')).join('');
 const {data:allowed,error:limitError}=await supabaseAdmin.rpc('check_request_limit',{_key:`enquiry:${hash}`,_limit:10,_seconds:3600});
 if(limitError || !allowed) throw new Error('Too many enquiries. Please contact us by email or phone.');
 const key=process.env['SUPABASE_PUBLISHABLE_KEY'];const url=process.env['SUPABASE_URL'];if(!key || !url) throw new Error('Enquiries are temporarily unavailable.');
 const client=createClient<Database>(url,key,{auth:{persistSession:false},global:{fetch:(input,init)=>{const h=new Headers(init?.headers);if(key.startsWith('sb_'))h.delete('Authorization');h.set('apikey',key);return fetch(input,{...init,headers:h});}}});
 const {website:_,...row}=data;const {error}=await client.from('enquiries').insert(row);if(error) throw new Error('Your enquiry could not be saved. Please try again or contact sales@braconwire.com.');return {success:true};
});
export const getAdminData=createServerFn({method:'GET'}).middleware([requireSupabaseAuth]).handler(async({context})=>{
 const {data:roles}=await context.supabase.from('user_roles').select('role');
 if(!roles?.length) return {allowed:false,leads:[],content:[],chats:[]};
 const [leads,content,chats]=await Promise.all([context.supabase.from('enquiries').select('*').order('created_at',{ascending:false}),context.supabase.from('site_content').select('*'),context.supabase.from('visitor_chats').select('id,messages,created_at,updated_at').order('updated_at',{ascending:false}).limit(100)]);
 return {allowed:true,leads:leads.data??[],content:content.data??[],chats:chats.data??[]};
});
export const saveContent=createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).inputValidator(input=>z.object({key:z.string().min(1).max(100),title:z.string().min(1).max(300),body:z.string().max(30000),category:z.string().max(100),published:z.boolean()}).parse(input)).handler(async({data,context})=>{
 const {error}=await context.supabase.from('site_content').upsert({...data,updated_at:new Date().toISOString()});if(error)throw new Error('You do not have permission to edit this content.');return {success:true};
});
export const updateLead=createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).inputValidator(input=>z.object({id:z.string().uuid(),status:z.enum(['New','Contacted','Qualified','Proposal Sent','Converted','Not Interested','Closed']),notes:z.string().max(5000)}).parse(input)).handler(async({data,context})=>{
 const {error}=await context.supabase.from('enquiries').update({status:data.status,notes:data.notes}).eq('id',data.id);if(error)throw new Error('Your changes could not be saved.');return {success:true};
});
