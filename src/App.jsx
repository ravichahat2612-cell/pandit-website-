import {useEffect,useState} from 'react'
import {sb,configured} from './supabase'
import {DEMO_SETTINGS,DEMO_PUJAS,SLOKAS,SUVICHAR,MANTRAS,AARTI,TYOHAR} from './data'
import Admin from './Admin'

const digits=s=>(s||'').replace(/\D/g,'')
const clean=o=>Object.fromEntries(Object.entries(o).filter(([,v])=>v!==null&&v!==''))

export default function App(){
  const [h,setH]=useState(location.hash)
  useEffect(()=>{const f=()=>setH(location.hash);addEventListener('hashchange',f);return()=>removeEventListener('hashchange',f)},[])
  return h==='#/admin'?<Admin/>:<Site/>
}

function Site(){
  const [s,setS]=useState(DEMO_SETTINGS),[pujas,setP]=useState(DEMO_PUJAS),[gal,setG]=useState([]),[rev,setR]=useState([]),[sel,setSel]=useState(null),[menu,setMenu]=useState(false)
  useEffect(()=>{if(!configured)return;(async()=>{
    const a=await sb.from('settings').select('*').eq('id',1).maybeSingle();if(a.data)setS({...DEMO_SETTINGS,...clean(a.data)})
    const b=await sb.from('pujas').select('*').order('sort');if(b.data&&b.data.length)setP(b.data)
    const c=await sb.from('gallery').select('*').order('id',{ascending:false});if(c.data)setG(c.data)
    const d=await sb.from('reviews').select('*').eq('approved',true).order('id',{ascending:false});if(d.data)setR(d.data)
  })()},[])
  const nav=[['home','होम'],['about','हमारे बारे में'],['pooja','पूजा सेवाएँ'],['book','पूजा बुकिंग'],['dharm','सनातन ज्ञान'],['contact','संपर्क']]
  const wa=`https://wa.me/${digits(s.whatsapp)}?text=${encodeURIComponent('जय श्री राम। मुझे पूजा के बारे में जानकारी चाहिए।')}`
  const Logo=s.logo_url?<img src={s.logo_url} className="h-10 w-10 rounded-full object-cover"/>:<span className="text-3xl">🕉️</span>
  return <div>
    {s.festival_msg&&<div className="bg-maroon text-cream text-center py-2 px-3 text-sm">🪔 {s.festival_msg} 🪔</div>}
    <header className="sticky top-0 z-30 bg-ivory/95 backdrop-blur border-b-2 border-gold">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-2">
        <a href="#home" className="flex items-center gap-2 fh text-xl text-maroon">{Logo}{s.name}</a>
        <nav className="hidden md:flex gap-5">{nav.map(([i,t])=><a key={i} href={'#'+i} className="hover:text-kesar">{t}</a>)}</nav>
        <button className="md:hidden text-3xl" onClick={()=>setMenu(!menu)} aria-label="मेनू">☰</button>
      </div>
      {menu&&<nav className="md:hidden flex flex-col px-4 pb-3">{nav.map(([i,t])=><a key={i} href={'#'+i} onClick={()=>setMenu(false)} className="py-2 border-t border-gold/30">{t}</a>)}</nav>}
    </header>

    <section id="home" className="relative text-center text-white py-20 px-4" style={{background:s.hero_url?`linear-gradient(#4a1a0acc,#4a1a0a99),url(${s.hero_url}) center/cover`:'radial-gradient(circle at 50% 0%,#F4A259,#E8731A 45%,#6B1F12)'}}>
      <div className="max-w-3xl mx-auto">
        <div className="fh text-6xl om">ॐ</div>
        <h1 className="fh text-3xl md:text-5xl mt-4">ॐ सर्वे भवन्तु सुखिनः</h1>
        <p className="mt-4 text-lg md:text-xl">सनातन संस्कृति, वैदिक परंपरा और शास्त्रोक्त पूजा विधि के साथ आपकी सेवा में।</p>
        <img src={s.pandit_photo||'data:image/svg+xml;utf8,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="#FFF6E3"/><text x="100" y="120" font-size="80" text-anchor="middle">🙏</text></svg>')} className="mx-auto mt-8 h-44 w-44 rounded-full object-cover border-4 border-gold shadow-2xl" alt={s.name}/>
        <p className="fh text-2xl mt-3">{s.name}</p><p>{s.tagline}</p>
        <div className="flex flex-wrap gap-3 justify-center mt-7">
          <a href="#pooja" className="btn-k">पूजा बुक करें</a>
          <a href={wa} target="_blank" rel="noreferrer" className="btn-g">WhatsApp पर संपर्क करें</a>
        </div>
      </div>
    </section>

    <Sec id="about" t="पंडित जी का परिचय">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <img src={s.pandit_photo||'data:image/svg+xml;utf8,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect width="400" height="400" fill="#FFF6E3"/><text x="200" y="240" font-size="160" text-anchor="middle">🙏</text></svg>')} className="bord rounded-3xl w-full max-h-96 object-cover"/>
        <div className="space-y-3 text-lg">
          <h3 className="text-2xl text-maroon">{s.name}</h3>
          <p>{s.intro}</p>
          <p><b>अनुभव:</b> {s.experience}</p><p><b>विशेषज्ञता:</b> {s.speciality}</p>
          <p><b>पूजा का स्थान:</b> {s.location}</p><p><b>संपर्क:</b> {s.phone}</p>
        </div>
      </div>
    </Sec>

    <Sec id="pooja" t="पूजा सेवाएँ" bg>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {pujas.map(p=><div key={p.id} className="bord rounded-3xl bg-ivory overflow-hidden flex flex-col shadow-md hover:-translate-y-1 transition">
          {p.photo_url?<img src={p.photo_url} className="h-44 w-full object-cover"/>:<div className="h-44 grid place-items-center text-7xl bg-gradient-to-br from-bhagwa to-gold/60">{p.emoji||'🪔'}</div>}
          <div className="p-5 flex flex-col gap-2 flex-1">
            <h3 className="text-xl text-maroon">{p.name}</h3><p className="flex-1">{p.description}</p>
            <p className="text-kesar font-bold text-xl">{p.fee>0?`₹ ${p.fee}`:'संपर्क करें'}</p>
            <button className="btn-k" onClick={()=>setSel(p)}>बुकिंग करें</button>
          </div></div>)}
      </div>
    </Sec>

    <Sec id="book" t="पूजा बुकिंग कैसे करें">
      <ol className="max-w-xl mx-auto space-y-2 text-lg list-decimal pl-6">
        <li>ऊपर से अपनी पूजा चुनें और "बुकिंग करें" दबाएँ।</li><li>फीस देखें और QR कोड स्कैन करके UPI से भुगतान करें।</li>
        <li>अपना UTR नंबर लिखें और जानकारी भरें।</li><li>"WhatsApp पर भेजें" दबाएँ, भुगतान का स्क्रीनशॉट भी WhatsApp में भेजें।</li>
        <li>पंडित जी भुगतान देखकर आपकी बुकिंग की पुष्टि करेंगे।</li></ol>
      {s.available_dates&&<p className="mt-6 text-center bg-cream rounded-2xl p-4"><b>उपलब्ध तारीखें:</b> {s.available_dates}</p>}
    </Sec>

    <Sec id="dharm" t="सनातन धर्म विशेष" bg>
      <div className="grid md:grid-cols-2 gap-6">
        <Card t="🚩 गीता के श्लोक">{SLOKAS.map(([a,b])=><p key={a} className="mb-3"><b className="fh">{a}</b><br/>{b}</p>)}</Card>
        <Card t="🌅 दैनिक सुविचार & आज का पंचांग"><p className="mb-3">{SUVICHAR[new Date().getDate()%SUVICHAR.length]}</p><p>{new Date().toLocaleDateString('hi-IN',{dateStyle:'full'})}</p><p className="mt-2">{s.panchang}</p></Card>
        <Card t="🕉️ मंत्र एवं चालीसा">{MANTRAS.map(([a,b])=><p key={a} className="mb-3 whitespace-pre-line"><b>{a}</b><br/>{b}</p>)}</Card>
        <Card t="🪔 आरती संग्रह">{AARTI.map(([a,b])=><p key={a} className="mb-3 whitespace-pre-line"><b>{a}</b><br/>{b}</p>)}</Card>
        <Card t="🎉 प्रमुख त्योहार"><p>{TYOHAR.join(' • ')}</p></Card>
      </div>
    </Sec>

    {gal.length>0&&<Sec id="gallery" t="फोटो गैलरी"><div className="grid grid-cols-2 md:grid-cols-4 gap-3">{gal.map(g=><img key={g.id} src={g.url} className="rounded-2xl aspect-square object-cover bord"/>)}</div></Sec>}

    <Sec id="review" t="ग्राहक समीक्षा" bg>
      <div className="grid md:grid-cols-3 gap-4 mb-8">{rev.map(r=><div key={r.id} className="bg-ivory rounded-2xl p-4 border border-gold/40"><p>{'⭐'.repeat(r.rating||5)}</p><p>{r.text}</p><p className="mt-2 font-semibold">— {r.name}</p></div>)}
        {!rev.length&&<p className="md:col-span-3 text-center">अभी कोई समीक्षा नहीं है। पहली समीक्षा आप दें।</p>}</div>
      <ReviewForm/>
    </Sec>

    <footer id="contact" className="bg-maroon text-cream text-center py-10 px-4 space-y-2">
      <p className="fh text-2xl">{s.name}</p><p>{s.tagline}</p><p>📞 {s.phone}</p>
      <a href={wa} target="_blank" rel="noreferrer" className="btn-k mt-2">WhatsApp पर संपर्क करें</a>
      <p className="text-sm pt-4 opacity-70">जय श्री राम 🙏</p>
    </footer>
    {sel&&<BookModal p={sel} s={s} onClose={()=>setSel(null)}/>}
  </div>
}
const Sec=({id,t,bg,children})=><section id={id} className={`py-14 px-4 ${bg?'bg-cream':''}`}><div className="max-w-6xl mx-auto"><h2 className="text-3xl text-maroon text-center mb-2">{t}</h2><div className="mx-auto w-24 h-1 bg-gold rounded mb-8"/>{children}</div></section>
const Card=({t,children})=><div className="bord rounded-3xl bg-ivory p-5"><h3 className="text-xl text-maroon mb-3">{t}</h3>{children}</div>

function BookModal({p,s,onClose}){
  const [f,setF]=useState({name:'',mobile:'',date:'',place:'',pin:'',note:'',utr:''}),[busy,setBusy]=useState(false)
  const set=k=>e=>setF({...f,[k]:e.target.value})
  const upi=p.upi_id||s.upi_id,qr=p.qr_url||s.qr_url
  async function send(e){e.preventDefault();setBusy(true)
    if(configured)await sb.from('bookings').insert({name:f.name,mobile:f.mobile,puja_name:p.name,puja_date:f.date,place:f.place,pincode:f.pin,note:f.note,fee:p.fee,utr:f.utr})
    const msg=`जय श्री राम।\n\nमुझे पूजा बुक करवानी है।\n\nनाम: ${f.name}\nमोबाइल नंबर: ${f.mobile}\nपूजा का नाम: ${p.name}\nपूजा की तारीख: ${f.date}\nपूजा का स्थान: ${f.place}\nपिन कोड: ${f.pin}\nविशेष जानकारी: ${f.note}\n\nपूजा की फीस: ₹${p.fee}\nUTR नंबर: ${f.utr||'(भुगतान के बाद भेजूँगा)'}\n\nकृपया मेरी बुकिंग की पुष्टि करें।`
    window.open(`https://wa.me/${digits(s.whatsapp)}?text=${encodeURIComponent(msg)}`,'_blank');setBusy(false);onClose()}
  return <div className="fixed inset-0 z-40 bg-black/60 grid place-items-center p-3 overflow-y-auto" onClick={onClose}>
    <form onSubmit={send} onClick={e=>e.stopPropagation()} className="bg-ivory rounded-3xl p-5 w-full max-w-md space-y-3 my-6">
      <div className="flex justify-between"><h3 className="text-xl text-maroon">{p.name}</h3><button type="button" onClick={onClose} className="text-2xl">✕</button></div>
      <p className="text-kesar text-2xl font-bold">फीस: {p.fee>0?`₹ ${p.fee}`:'संपर्क करें'}</p>
      <div className="bg-cream rounded-2xl p-3 text-center">{qr?<img src={qr} className="mx-auto h-44"/>:<p>QR कोड एडमिन पैनल से जोड़ा जाएगा</p>}<p className="mt-2">UPI ID: <b>{upi}</b></p>
        <p className="text-sm">भुगतान के बाद UTR नंबर नीचे लिखें और स्क्रीनशॉट WhatsApp में भेजें।</p></div>
      <input required className="inp" placeholder="आपका नाम" value={f.name} onChange={set('name')}/>
      <input required className="inp" inputMode="tel" placeholder="मोबाइल नंबर" value={f.mobile} onChange={set('mobile')}/>
      <input required type="date" className="inp" value={f.date} onChange={set('date')}/>
      <input required className="inp" placeholder="पूजा का स्थान / पता" value={f.place} onChange={set('place')}/>
      <input className="inp" inputMode="numeric" placeholder="पिन कोड" value={f.pin} onChange={set('pin')}/>
      <input className="inp" placeholder="UTR नंबर (भुगतान के बाद)" value={f.utr} onChange={set('utr')}/>
      <textarea className="inp" placeholder="विशेष जानकारी" value={f.note} onChange={set('note')}/>
      <button disabled={busy} className="btn-k w-full">WhatsApp पर भेजें</button>
      <p className="text-xs text-center">भुगतान की पुष्टि पंडित जी स्वयं करेंगे।</p>
    </form></div>
}
function ReviewForm(){
  const [f,setF]=useState({name:'',text:'',rating:5}),[ok,setOk]=useState(false)
  async function go(e){e.preventDefault();if(configured)await sb.from('reviews').insert({...f,approved:false});setOk(true);setF({name:'',text:'',rating:5})}
  return <form onSubmit={go} className="max-w-md mx-auto space-y-3"><h3 className="text-xl text-center text-maroon">अपना अनुभव लिखें</h3>
    <input required className="inp" placeholder="आपका नाम" value={f.name} onChange={e=>setF({...f,name:e.target.value})}/>
    <select className="inp" value={f.rating} onChange={e=>setF({...f,rating:+e.target.value})}>{[5,4,3,2,1].map(n=><option key={n} value={n}>{'⭐'.repeat(n)}</option>)}</select>
    <textarea required className="inp" placeholder="आपका अनुभव" value={f.text} onChange={e=>setF({...f,text:e.target.value})}/>
    <button className="btn-k w-full">समीक्षा भेजें</button>{ok&&<p className="text-center">धन्यवाद! पंडित जी की स्वीकृति के बाद यह दिखेगी।</p>}</form>
}
