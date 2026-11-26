import {useEffect,useState} from 'react'
import {sb,configured,upload} from './supabase'
import {DEMO_SETTINGS} from './data'

const TXT=[['name','वेबसाइट / पंडित जी का नाम'],['tagline','टैगलाइन'],['whatsapp','WhatsApp नंबर (91 के साथ, जैसे 919876543210)'],['phone','दिखाने वाला संपर्क नंबर'],['upi_id','UPI ID'],['experience','अनुभव'],['speciality','विशेषज्ञता'],['location','पूजा कराने का स्थान'],['festival_msg','त्योहार का संदेश (वेबसाइट के ऊपर दिखेगा)'],['available_dates','उपलब्ध तारीखें'],['panchang','आज का पंचांग']]
const IMG=[['pandit_photo','पंडित जी की फोटो'],['logo_url','लोगो'],['hero_url','मुख्य बैकग्राउंड फोटो'],['qr_url','UPI QR कोड']]

export default function Admin(){
  const [user,setUser]=useState(null),[ready,setReady]=useState(false),[tab,setTab]=useState('s')
  useEffect(()=>{if(!configured){setReady(true);return}
    sb.auth.getSession().then(({data})=>{setUser(data.session?.user||null);setReady(true)})
    const {data}=sb.auth.onAuthStateChange((_,s)=>setUser(s?.user||null));return()=>data.subscription.unsubscribe()},[])
  if(!ready)return <p className="p-6">लोड हो रहा है…</p>
  if(!configured)return <Box><p>Supabase जुड़ा नहीं है। README में दिए Step 2-3 पूरे करें।</p></Box>
  if(!user)return <Login/>
  const tabs=[['s','सेटिंग्स'],['p','पूजाएँ'],['b','बुकिंग'],['r','रिव्यू'],['g','गैलरी']]
  return <div className="min-h-screen bg-cream">
    <div className="bg-maroon text-cream p-3 flex justify-between items-center"><b>एडमिन पैनल</b><span><a href="#home" className="underline mr-4">वेबसाइट</a><button onClick={()=>sb.auth.signOut()} className="underline">लॉगआउट</button></span></div>
    <div className="flex overflow-x-auto gap-2 p-3">{tabs.map(([k,t])=><button key={k} onClick={()=>setTab(k)} className={`px-4 py-2 rounded-full whitespace-nowrap ${tab===k?'bg-kesar text-white':'bg-white border'}`}>{t}</button>)}</div>
    <div className="max-w-3xl mx-auto p-3">{tab==='s'&&<Settings/>}{tab==='p'&&<Pujas/>}{tab==='b'&&<Bookings/>}{tab==='r'&&<Reviews/>}{tab==='g'&&<Gallery/>}</div></div>
}
const Box=({children})=><div className="min-h-screen grid place-items-center p-4 bg-cream"><div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-3">{children}</div></div>

function Login(){
  const [e,setE]=useState(''),[p,setP]=useState(''),[m,setM]=useState('')
  async function go(ev){ev.preventDefault();const {error}=await sb.auth.signInWithPassword({email:e,password:p});if(error)setM('ईमेल या पासवर्ड गलत है।')}
  return <Box><form onSubmit={go} className="space-y-3"><h1 className="text-2xl text-maroon">🔐 एडमिन लॉगिन</h1>
    <input className="inp" type="email" placeholder="ईमेल" value={e} onChange={x=>setE(x.target.value)}/>
    <input className="inp" type="password" placeholder="पासवर्ड" value={p} onChange={x=>setP(x.target.value)}/>
    <button className="btn-k w-full">लॉगिन करें</button><p className="text-red-600">{m}</p></form></Box>
}

function Pick({label,value,onChange}){
  const [busy,setBusy]=useState(false)
  async function pick(ev){const f=ev.target.files[0];if(!f)return;setBusy(true);try{onChange(await upload(f))}catch(x){alert('फोटो अपलोड नहीं हुई: '+x.message)}setBusy(false)}
  return <div className="space-y-1"><p className="font-semibold">{label}</p>{value&&<img src={value} className="h-24 rounded-xl"/>}
    <label className="btn-g cursor-pointer text-sm">{busy?'अपलोड हो रहा है…':'📷 फोटो चुनें'}<input type="file" accept="image/*" className="hidden" onChange={pick}/></label></div>
}

function Settings(){
  const [v,setV]=useState({...DEMO_SETTINGS}),[m,setM]=useState('')
  useEffect(()=>{sb.from('settings').select('*').eq('id',1).maybeSingle().then(({data})=>data&&setV(o=>({...o,...Object.fromEntries(Object.entries(data).filter(([,x])=>x!==null))})))},[])
  async function save(){const {error}=await sb.from('settings').upsert({id:1,...v});setM(error?'सेव नहीं हुआ: '+error.message:'✅ सेव हो गया')}
  return <div className="space-y-4">{IMG.map(([k,l])=><Pick key={k} label={l} value={v[k]} onChange={u=>setV({...v,[k]:u})}/>)}
    {TXT.map(([k,l])=><label key={k} className="block"><span className="font-semibold">{l}</span><input className="inp" value={v[k]||''} onChange={e=>setV({...v,[k]:e.target.value})}/></label>)}
    <label className="block"><span className="font-semibold">पंडित जी का परिचय</span><textarea rows={5} className="inp" value={v.intro||''} onChange={e=>setV({...v,intro:e.target.value})}/></label>
    <button onClick={save} className="btn-k w-full">सेव करें</button><p>{m}</p></div>
}

function Pujas(){
  const [L,setL]=useState([])
  const load=()=>sb.from('pujas').select('*').order('sort').then(({data})=>setL(data||[]));useEffect(()=>{load()},[])
  const ch=(i,k,x)=>setL(L.map((p,j)=>j===i?{...p,[k]:x}:p))
  async function save(p){const {error}=await sb.from('pujas').upsert({...p,fee:+p.fee||0});alert(error?error.message:'✅ सेव हो गया');load()}
  async function del(p){if(confirm('यह पूजा हटाएँ?')){await sb.from('pujas').delete().eq('id',p.id);load()}}
  async function add(){await sb.from('pujas').insert({name:'नई पूजा',description:'',fee:0,sort:L.length+1});load()}
  async function seed(){const {DEMO_PUJAS}=await import('./data');await sb.from('pujas').insert(DEMO_PUJAS.map((p,i)=>({name:p.name,description:p.description,fee:p.fee,sort:i+1})));load()}
  return <div className="space-y-4"><button onClick={add} className="btn-k">➕ नई पूजा जोड़ें</button>
    {!L.length&&<button onClick={seed} className="btn-g">14 डेमो पूजाएँ डालें</button>}
    {L.map((p,i)=><div key={p.id} className="bg-white rounded-2xl p-4 space-y-2 border">
      <Pick label="पूजा की फोटो" value={p.photo_url} onChange={u=>ch(i,'photo_url',u)}/>
      <input className="inp" value={p.name} onChange={e=>ch(i,'name',e.target.value)} placeholder="पूजा का नाम"/>
      <textarea className="inp" value={p.description||''} onChange={e=>ch(i,'description',e.target.value)} placeholder="विवरण"/>
      <input className="inp" inputMode="numeric" value={p.fee} onChange={e=>ch(i,'fee',e.target.value)} placeholder="फीस ₹"/>
      <input className="inp" value={p.upi_id||''} onChange={e=>ch(i,'upi_id',e.target.value)} placeholder="इस पूजा की अलग UPI ID (खाली छोड़ सकते हैं)"/>
      <Pick label="इस पूजा का अलग QR (वैकल्पिक)" value={p.qr_url} onChange={u=>ch(i,'qr_url',u)}/>
      <div className="flex gap-2"><button onClick={()=>save(p)} className="btn-k">सेव</button><button onClick={()=>del(p)} className="btn-g">हटाएँ</button></div></div>)}</div>
}

function Bookings(){
  const [L,setL]=useState([])
  const load=()=>sb.from('bookings').select('*').order('id',{ascending:false}).then(({data})=>setL(data||[]));useEffect(()=>{load()},[])
  const up=async(id,o)=>{await sb.from('bookings').update(o).eq('id',id);load()}
  return <div className="space-y-3">{!L.length&&<p>अभी कोई बुकिंग नहीं है।</p>}{L.map(b=><div key={b.id} className="bg-white rounded-2xl p-4 border space-y-1">
    <p className="font-bold">{b.puja_name} — ₹{b.fee}</p><p>{b.name} • {b.mobile}</p><p>📅 {b.puja_date} • 📍 {b.place} {b.pincode}</p>{b.note&&<p>📝 {b.note}</p>}
    <p>UTR: {b.utr||'—'}</p><p>बुकिंग: <b>{{pending:'प्रतीक्षा में',accepted:'स्वीकृत',cancelled:'रद्द'}[b.status]}</b> • भुगतान: <b>{b.payment_status==='paid'?'✅ पुष्टि हुई':'⏳ पुष्टि बाकी'}</b></p>
    <div className="flex flex-wrap gap-2 pt-2"><button className="btn-k text-sm" onClick={()=>up(b.id,{payment_status:'paid'})}>भुगतान पुष्टि</button>
      <button className="btn-g text-sm" onClick={()=>up(b.id,{status:'accepted'})}>स्वीकार</button><button className="btn-g text-sm" onClick={()=>up(b.id,{status:'cancelled'})}>रद्द</button></div></div>)}</div>
}

function Reviews(){
  const [L,setL]=useState([])
  const load=()=>sb.from('reviews').select('*').order('id',{ascending:false}).then(({data})=>setL(data||[]));useEffect(()=>{load()},[])
  return <div className="space-y-3">{!L.length&&<p>कोई रिव्यू नहीं है।</p>}{L.map(r=><div key={r.id} className="bg-white rounded-2xl p-4 border"><p>{'⭐'.repeat(r.rating)} {r.name}</p><p>{r.text}</p>
    <div className="flex gap-2 pt-2">{!r.approved&&<button className="btn-k text-sm" onClick={async()=>{await sb.from('reviews').update({approved:true}).eq('id',r.id);load()}}>स्वीकृत करें</button>}
    <button className="btn-g text-sm" onClick={async()=>{await sb.from('reviews').delete().eq('id',r.id);load()}}>हटाएँ</button></div></div>)}</div>
}

function Gallery(){
  const [L,setL]=useState([])
  const load=()=>sb.from('gallery').select('*').order('id',{ascending:false}).then(({data})=>setL(data||[]));useEffect(()=>{load()},[])
  return <div><Pick label="गैलरी में नई फोटो जोड़ें" onChange={async u=>{await sb.from('gallery').insert({url:u});load()}}/>
    <div className="grid grid-cols-3 gap-2 mt-4">{L.map(g=><div key={g.id}><img src={g.url} className="aspect-square object-cover rounded-xl"/><button className="text-red-600 text-sm" onClick={async()=>{await sb.from('gallery').delete().eq('id',g.id);load()}}>हटाएँ</button></div>)}</div></div>
}
