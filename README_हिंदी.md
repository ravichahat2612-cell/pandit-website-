# पंडित दीपक पाठक वेबसाइट — चलाने का आसान तरीका (Android मोबाइल से)

## Step 1: Supabase खाता
1. supabase.com खोलें → Sign up → "New project" बनाएँ (नाम: pandit, एक पासवर्ड डालें)।
2. बाईं तरफ **SQL Editor** → New query → `supabase.sql` फाइल का पूरा कोड पेस्ट करें → **Run**।

## Step 2: एडमिन (पंडित जी) का लॉगिन
1. **Authentication → Users → Add user → Create new user**: पंडित जी की ईमेल + मजबूत पासवर्ड डालें (Auto confirm चालू रखें)।
2. **Authentication → Sign In / Providers → Email** में **"Allow new users to sign up" बंद (OFF)** करें। यह बहुत जरूरी है, वरना कोई भी एडमिन बन सकता है।

## Step 3: दो जानकारियाँ कॉपी करें
**Project Settings → API** में: **Project URL** और **anon public key**।
(⚠️ `service_role` / secret key कभी कहीं न डालें।)

## Step 4: GitHub पर फाइलें डालें
1. github.com पर खाता बनाएँ → New repository। 
2. ZIP को फोन में खोलकर सारी फाइलें-फोल्डर उस repository में Upload करें। (`node_modules` नहीं चाहिए)

## Step 5: Netlify पर पब्लिश
1. netlify.com → Add new site → Import from GitHub → अपना repository चुनें (Build command `npm run build`, Publish `dist` अपने आप आ जाएगा)।
2. **Site configuration → Environment variables** में दो चीजें जोड़ें:
   - `VITE_SUPABASE_URL` = आपका Project URL
   - `VITE_SUPABASE_ANON_KEY` = आपकी anon key
3. **Deploys → Trigger deploy**। 2-3 मिनट में वेबसाइट चालू।

## एडमिन पैनल
वेबसाइट का पता + `/#/admin` (जैसे `https://aapka-site.netlify.app/#/admin`)। लॉगिन करके: फोटो, लोगो, बैकग्राउंड, WhatsApp नंबर, UPI, QR, फीस, पूजा जोड़ना/हटाना, बुकिंग, भुगतान पुष्टि, रिव्यू, गैलरी सब बदलें। पहली बार **पूजाएँ** टैब में "14 डेमो पूजाएँ डालें" दबाएँ।

## ध्यान रखें
- WhatsApp लिंक से मैसेज अपने आप बनता है, पर **स्क्रीनशॉट ग्राहक को खुद WhatsApp में जोड़कर भेजना होगा** (WhatsApp लिंक फोटो अपने आप नहीं जोड़ने देता)।
- भुगतान अपने आप सफल नहीं होता; पंडित जी बैंक/UPI देखकर बुकिंग में "भुगतान पुष्टि" दबाएँगे।
- डेमो नंबर `919999999999`, UPI `demo@upi` हैं — पहले इन्हें बदलें।
- **दूसरे पंडितों को बेचने के लिए**: हर पंडित के लिए अलग Supabase प्रोजेक्ट + अलग Netlify साइट बनाएँ। इससे डेटा और लॉगिन अलग रहेंगे।
