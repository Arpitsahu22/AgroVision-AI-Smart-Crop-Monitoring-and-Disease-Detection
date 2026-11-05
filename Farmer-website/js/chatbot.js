/**
 * AgriMitra AI - Farmers Multilingual AI Chatbot & Voice Assistant Engine
 * 
 * Capabilities:
 *  - Full Multilingual Speech Recognition (Speech-to-Text) in 10 languages:
 *    Hindi (हिन्दी), Hinglish, Punjabi (ਪੰਜਾਬੀ), Marathi (मराठी), Telugu (తెలుగు),
 *    Tamil (தமிழ்), Bengali (বাংলা), Gujarati (ગુજરાતી), English, Spanish (Español)
 *  - Native Farmer Conversational Chatting Style for each language
 *  - Automatic Language & Dialect Detection (Devanagari, Gurmukhi, Dravidian scripts & Romanized keywords)
 *  - Interactive Voice Assistant Overlay Modal with glowing pulse rings, live sound waves,
 *    live real-time speech transcription, one-tap language switcher pills, and quick voice prompts
 *  - Multilingual Speech Synthesis (Text-to-Speech) matching native language accents
 *  - Dynamic Quick Suggestion Chips updating per chosen language
 */

const ChatbotModule = (() => {
  // Module State
  let recognition = null;
  let isListening = false;
  let currentLanguage = 'hi';
  let isAudioEnabled = true;
  let currentTranscript = '';

  // Multilingual Configuration & Voice Telemetry
  const LANG_CONFIG = {
    'hi': {
      code: 'hi-IN',
      name: 'हिन्दी',
      synthLang: 'hi-IN',
      statusTitle: '🔴 Listening in Hindi... बोलिए!',
      statusSub: 'राम-राम किसान भाई, बोलिए हम सुन रहे हैं...',
      placeholder: 'माइक (🎙️) दबाकर बोलें या हिन्दी में लिखें...',
      suggestions: [
        { text: '🌾 गेहूं की अधिक पैदावार', query: 'गेहूं की अधिक पैदावार और पहला पानी कब लगाएं?' },
        { text: '🍅 टमाटर झुलसा रोग इलाज', query: 'टमाटर का झुलसा रोग (Blight) कैसे ठीक करें?' },
        { text: '🌱 घर पर देसी जीवामृत', query: 'घर पर प्राकृतिक जीवामृत कैसे बनाएं?' },
        { text: '☁️ कपास में गुलाबी सुंडी', query: 'कपास में गुलाबी सुंडी का पक्का इलाज क्या है?' },
        { text: '🍚 धान पानी व खाद नियम', query: 'धान में पानी और यूरिया देने का सही समय क्या है?' },
        { text: '📞 किसान हेल्पलाइन नंबर', query: 'किसान हेल्पलाइन और पीएम किसान का नंबर क्या है?' }
      ]
    },
    'hinglish': {
      code: 'hi-IN',
      name: 'Hinglish',
      synthLang: 'hi-IN',
      statusTitle: '🔴 Listening in Hinglish... Boliye!',
      statusSub: 'Kisan bhai, boliye hum sun rahe hain...',
      placeholder: 'Type ya mic dabakar boliye in Hinglish...',
      suggestions: [
        { text: '🌾 Gehu me kalle badhana', query: 'Gehu me kalle aur paidawar kaise badhayein?' },
        { text: '🍅 Tamatar me jhulsa upchar', query: 'Tamatar me jhulsa rog ka ilaj kya hai?' },
        { text: '🌱 Ghar par Jeevamrut', query: 'Ghar par Jeevamrut khad kaise banayein?' },
        { text: '☁️ Kapas me sundi roktham', query: 'Kapas me gulabi sundi se kaise bachein?' },
        { text: '🍚 Dhan me paani aur khad', query: 'Dhan me paani aur urea schedule batao' }
      ]
    },
    'pa': {
      code: 'pa-IN',
      name: 'ਪੰਜਾਬੀ',
      synthLang: 'pa-IN',
      statusTitle: '🔴 ਸੁਣ ਰਹੇ ਹਾਂ... ਬੋਲੋ ਜੀ!',
      statusSub: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਵੀਰ ਜੀ, ਆਪਣੀ ਫਸਲ ਬਾਰੇ ਪੁੱਛੋ...',
      placeholder: 'ਮਾਈਕ ਦਬਾ ਕੇ ਬੋਲੋ ਜਾਂ ਪੰਜਾਬੀ ਵਿੱਚ ਲਿਖੋ...',
      suggestions: [
        { text: '🌾 ਕਣਕ ਦਾ ਵੱਧ ਝਾੜ ਕਿਵੇਂ ਲਈਏ', query: 'ਕਣਕ ਦਾ ਵੱਧ ਝਾੜ ਲੈਣ ਦੇ ਨੁਕਤੇ' },
        { text: '🍅 ਟਮਾਟਰ ਦਾ ਝੁਲਸਾ ਰੋਗ ਹੱਲ', query: 'ਟਮਾਟਰ ਦੇ ਝੁਲਸਾ ਰੋਗ ਦਾ ਇਲਾਜ' },
        { text: '🌱 ਦੇਸੀ ਜੀਵਾਮ੍ਰਿਤ ਖਾਦ ਬਣਾਓ', query: 'ਦੇਸੀ ਜੀਵਾਮ੍ਰਿਤ ਬਣਾਉਣ ਦਾ ਤਰੀਕਾ' },
        { text: '☁️ ਨਰਮੇ ਦੀ ਗੁਲਾਬੀ ਸੁੰਡੀ ਰੋਕਥਾਮ', query: 'ਨਰਮੇ ਦੀ ਗੁਲਾਬੀ ਸੁੰਡੀ ਤੋਂ ਬਚਾਅ' },
        { text: '🍚 ਝੋਨੇ ਦੀ ਕਾਸ਼ਤ ਅਤੇ ਖਾਦ', query: 'ਝੋਨੇ ਵਿੱਚ ਪਾਣੀ ਅਤੇ ਖਾਦ ਪਾਉਣ ਦਾ ਸਮਾਂ' }
      ]
    },
    'mr': {
      code: 'mr-IN',
      name: 'मराठी',
      synthLang: 'mr-IN',
      statusTitle: '🔴 ऐकत आहोत... बोला शेतकरी मित्रा!',
      statusSub: 'राम राम शेतकरी मित्रांनो, पिकाविषयी बोला...',
      placeholder: 'माईक दाबून बोला किंवा मराठीत टाईप करा...',
      suggestions: [
        { text: '🌾 गव्हाचे भरघोस उत्पादन उपाय', query: 'गव्हाचे भरघोस उत्पादन व खत व्यवस्थापन' },
        { text: '🍅 टोमॅटो करपा रोग नियंत्रण', query: 'टोमॅटोवरील करपा रोगासाठी औषध सांगा' },
        { text: '🌱 सेंद्रिय जीवामृत खत बनवणे', query: 'घरच्या घरी जीवामृत खत कसे बनवावे' },
        { text: '☁️ कापूस बोंडअळी नियंत्रण उपाय', query: 'कापूस बोंडअळी नियंत्रण औषध' },
        { text: '🍚 भात शेती पाणी नियोजन', query: 'भात पिकाला पाणी कधी व कसे द्यावे' }
      ]
    },
    'te': {
      code: 'te-IN',
      name: 'తెలుగు',
      synthLang: 'te-IN',
      statusTitle: '🔴 వింటున్నాము... మాట్లాడండి రైతు సోదరా!',
      statusSub: 'నమస్కారం రైతు సోదరులారా, మీ ప్రశ్న చెప్పండి...',
      placeholder: 'మైక్ నొక్కి మాట్లాడండి లేదా తెలుగులో రాయండి...',
      suggestions: [
        { text: '🌾 వరి పంటలో అధిక దిగుబడి', query: 'వరి పంటలో అధిక దిగుబడి కోసం ఏం చేయాలి' },
        { text: '🍅 టమోటా తెగులు నివారణ మందులు', query: 'టమోటా ఆకు ఎండు తెగులు నివారణ' },
        { text: '🌱 సహజ జీవామృతం తయారీ', query: 'ఇంట్లోనే సహజ జీవామృతం ఎలా తయారు చేయాలి' },
        { text: '☁️ ప్రత్తిలో గులాబీ రంగు పురుగు', query: 'ప్రత్తిలో గులాబీ రంగు పురుగు నివారణ' }
      ]
    },
    'ta': {
      code: 'ta-IN',
      name: 'தமிழ்',
      synthLang: 'ta-IN',
      statusTitle: '🔴 கேட்கிறோம்... பேசுங்கள் விவசாய நண்பரே!',
      statusSub: 'வணக்கம் விவசாய நண்பரே, பயிர் பிரச்சனை கூறுங்கள்...',
      placeholder: 'மைக் அழுத்தி பேசவும் அல்லது தமிழில் எழுதவும்...',
      suggestions: [
        { text: '🌾 நெல் அதிக மகசூல் பெற வழிகள்', query: 'நெல் சாகுபடி மற்றும் உர மேலாண்மை' },
        { text: '🍅 தக்காளி இலைக்கருகல் மருந்து', query: 'தக்காளி இலைக்கருகல் நோய் கட்டுப்பாடு' },
        { text: '🌱 இயற்கை ஜீவாமிர்தம் உரம்', query: 'இயற்கை ஜீவாமிர்தம் தயாரிக்கும் முறை' },
        { text: '☁️ பருத்தி காய்ப்புழு கட்டுப்பாடு', query: 'பருத்தி காய்ப்புழு பூச்சிக்கொல்லி' }
      ]
    },
    'bn': {
      code: 'bn-IN',
      name: 'বাংলা',
      synthLang: 'bn-IN',
      statusTitle: '🔴 শুনছি... বলুন কৃষক ভাই!',
      statusSub: 'নমস্কার কৃষক ভাই, ফসলের সমস্যার কথা বলুন...',
      placeholder: 'মাইক চেপে কথা বলুন বা বাংলায় লিখুন...',
      suggestions: [
        { text: '🌾 গমের বাম্পার ফলন পদ্ধতি', query: 'গমে বেশি ফলন পেতে প্রথম সেচ কখন দেবেন' },
        { text: '🍅 টমেটো ব্লাইট রোগের চিকিৎসা', query: 'টমেটোর ব্লাইট রোগের ওষুধ কি' },
        { text: '🌱 খাঁটি জীবামৃত সার তৈরি', query: 'প্রাকৃতিক জীবামৃত সার বানানোর উপায়' },
        { text: '☁️ তুলার পোকা দমন ঔষধ', query: 'তুলার গোলাপী পোকা দমন' }
      ]
    },
    'gu': {
      code: 'gu-IN',
      name: 'ગુજરાતી',
      synthLang: 'gu-IN',
      statusTitle: '🔴 સાંભળી રહ્યા છીએ... બોલો ખેડૂત મિત્ર!',
      statusSub: 'રામ રામ ખેડૂત મિત્રો, તમારા પાક વિશે કહો...',
      placeholder: 'માઈક દબાવીને બોલો અથવા ગુજરાતીમાં લખો...',
      suggestions: [
        { text: '🌾 ઘઉંનું બમ્પર ઉત્પાદન અને પાણી', query: 'ઘઉંમાં પહેલું પાણી ક્યારે આપવું' },
        { text: '🍅 ટામેટામાં સુકારો રોગ ઉપાય', query: 'ટામેટામાં સુકારો રોગ માટે શું કરવું' },
        { text: '🌱 ઘરે દેશી જીવામૃત બનાવવાની રીત', query: 'ઘરે જીવામૃત ખાતર કેવી રીતે બનાવવું' },
        { text: '☁️ કપાસમાં ગુલાબી ઈયળ નિયંત્રણ', query: 'કપાસમાં ગુલાબી ઈયળ દવા' }
      ]
    },
    'en': {
      code: 'en-IN',
      name: 'English',
      synthLang: 'en-IN',
      statusTitle: '🔴 Listening to your voice... Speak now!',
      statusSub: 'Hello Farmer, we are listening to your voice...',
      placeholder: 'Type or click microphone to speak in English...',
      suggestions: [
        { text: '🌾 High Yield in Wheat', query: 'How to increase wheat yield and first CRI water?' },
        { text: '🍅 Tomato Blight Remedy', query: 'How to treat tomato blight disease organically?' },
        { text: '🌱 Home-made Jeevamrut', query: 'How to prepare organic Jeevamrut at home?' },
        { text: '☁️ Cotton Pink Bollworm', query: 'How to control pink bollworm in cotton?' },
        { text: '🍚 Rice / Paddy Water Guide', query: 'Best water and fertilizer schedule for paddy' }
      ]
    },
    'es': {
      code: 'es-ES',
      name: 'Español',
      synthLang: 'es-ES',
      statusTitle: '🔴 Escuchando... ¡Hable ahora agricultor!',
      statusSub: 'Saludos agricultor, escuchamos su consulta...',
      placeholder: 'Escriba o toque el micrófono para hablar en español...',
      suggestions: [
        { text: '🌾 Rendimiento en Trigo', query: 'Guía de siembra y rendimiento en trigo' },
        { text: '🍅 Tratar tizón en tomate', query: 'Cómo curar el tizón foliar en tomate' },
        { text: '🌱 Biol orgánico fermentado', query: 'Cómo hacer biol orgánico fermentado' },
        { text: '☁️ Plagas en algodón', query: 'Control de gusano cogollero en algodón' }
      ]
    }
  };

  // Comprehensive Multilingual Agricultural Knowledge Base
  const KNOWLEDGE_RESPONSES = [
    // 1. Greetings & Chit-Chat in Native Rural Farmer Style
    {
      keywords: ['hi', 'hello', 'hey', 'namaste', 'namaskar', 'ram ram', 'sat sri akal', 'kaise ho', 'help', 'madad', 'start', 'kisan', 'khedut', 'shetkari', 'raithu', 'vivasayi'],
      reply: {
        'hi': "🌾 **राम-राम किसान भाई! नमस्ते!** 🙏\n\nमैं आपका अपना एआई कृषि मित्र हूँ। आप मुझसे अपनी सरल भाषा में किसी भी फसल के बारे में पूछ सकते हैं:\n- 🌦️ **मौसम और छिड़काव का सही समय**\n- 🌿 **फसलों के रोग, पीली पत्तियां और उनका पक्का इलाज**\n- 🌾 **गेहूं, धान, टमाटर, आलू, कपास की अधिक पैदावार के नुस्खे**\n- 🧪 **यूरिया, डीएपी की सही मात्रा और जैविक जीवामृत**\n\nआप माइक (🎙️) दबाकर बोल सकते हैं या नीचे लिखकर पूछ सकते हैं!",
        'hinglish': "🌾 **Ram Ram Kisan Bhai! Namaste!** 🙏\n\nMain aapka AI Kheti Sahayak hoon. Aap mujhse kisi bhi fasal (Gehu, Dhan, Tamatar, Kapas, Aalu, etc.) ke baare me pooch sakte hain:\n- 🌿 **Faslon ki bimari aur unka sahi upchar**\n- 🌦️ **Mausam aur spray karne ka sahi time**\n- 🧪 **Khad (Urea, DAP, Potash) ki sahi matra aur Jeevamrut**\n- 🌾 **Bumper paidawar lene ke tarike**\n\nAap mic (🎙️) dabakar bol sakte hain ya Hindi/English/Hinglish me type karke pooch sakte hain!",
        'pa': "🌾 **ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਵੀਰ ਜੀ!** 🙏\n\nਮੈਂ ਤੁਹਾਡਾ ਆਪਣਾ ਖੇਤੀਬਾੜੀ ਏਆਈ ਸਹਾਇਕ ਹਾਂ। ਤੁਸੀਂ ਮੇਰੇ ਨਾਲ ਪੰਜਾਬੀ ਵਿੱਚ ਬੋਲ ਕੇ ਜਾਂ ਲਿਖ ਕੇ ਫਸਲਾਂ ਦੇ ਰੋਗ, ਕਣਕ-ਝੋਨੇ ਦਾ ਵੱਧ ਝਾੜ, ਖਾਦਾਂ ਅਤੇ ਮੌਸਮ ਬਾਰੇ ਪੁੱਛ ਸਕਦੇ ਹੋ। ਦੱਸੋ ਜੀ, ਅੱਜ ਤੁਹਾਡੀ ਕੀ ਸੇਵਾ ਕਰੀਏ?",
        'mr': "🌾 **राम राम शेतकरी मित्रांनो!** 🙏\n\nमी तुमचा डिजिटल कृषी सल्लागार आहे. तुम्ही मला मराठीत बोलून किंवा लिहून पिकांचे रोग, खतांचे योग्य प्रमाण, पाणी व्यवस्थापन व हवामानाविषयी विचारू शकता. सांगा, आज कोणती मदत हवी आहे?",
        'te': "🌾 **నమస్కారం రైతు సోదరులారా!** 🙏\n\nనేను మీ వ్యవసాయ AI సహాయకుడిని. పంట తెగుళ్లు, నివారణ చర్యలు, ఎరువుల మోతాదు మరియు విత్తే పద్ధతుల గురించి మీరు నన్ను అడగవచ్చు. చెప్పండి, మీకు ఏ సమాచారం కావాలి?",
        'ta': "🌾 **வணக்கம் விவசாய நண்பரே!** 🙏\n\nநான் உங்கள் AI வேளாண்மை உதவியாளர். பயிர் நோய்கள், பூச்சி கட்டுப்பாடு, உர மேலாண்மை மற்றும் வானிலை பற்றி என்னிடம் கேளுங்கள். உங்களுக்கு என்ன உதவி தேவை?",
        'bn': "🌾 **নমস্কার কৃষক ভাই!** 🙏\n\nআমি আপনার এআই কৃষি পরামর্শদাতা। ফসলের রোগবালাই, সার প্রয়োগ ও আবহাওয়ার সঠিক তথ্য জানতে যেকোনো প্রশ্ন করুন। বলুন, আজ আপনাকে কি সাহায্য করতে পারি?",
        'gu': "🌾 **રામ રામ ખેડૂત મિત્રો!** 🙏\n\nહું તમારો એઆઈ કૃષિ મિત્ર છું. તમે મને ગુજરાતીમાં બોલીને કે લખીને પાકના રોગો, ખાતરનું પ્રમાણ અને વાવણી વિશે પૂછી શકો છો. બોલો, આજે શી મદદ કરું?",
        'en': "🌾 **Hello Farmer! Welcome to your AI Agriculture Assistant.** 🙏\n\nI can assist you in **any language** (Hindi, Hinglish, Punjabi, Marathi, Telugu, Tamil, Gujarati, Bengali, Spanish, English) with:\n- 🌦️ **Upcoming Weather & Spray Windows**\n- 📸 **Crop Disease Diagnosis & Treatment**\n- 🌾 **How to plant and grow Wheat, Rice, Tomato, Cotton, Potato, etc.**\n- 🧪 **Fertilizer dosage (NPK/Urea) & organic Jeevamrut preparation**\n\nYou can **type** your question or tap the **microphone (🎙️)** to speak in your language!",
        'es': "🌾 **¡Saludos Agricultor!** 🙏\n\nSoy su Asistente Agrícola de Inteligencia Artificial. Puede hablarme o escribirme en español sobre enfermedades foliares, siembra, fertilización y clima."
      }
    },

    // 2. Tomato Cultivation & Early/Late Blight Disease (टमाटर झुलसा रोग)
    {
      keywords: ['tomato', 'tamatar', 'blight', 'jhulsa', 'leaf spot', 'leaf curl', 'patti', 'patte', 'tameta', 'thakkali', 'tamata'],
      reply: {
        'hi': "🍅 **टमाटर की फसल: रोग एवं सटीक समाधान:**\n\n1. **झुलसा रोग (Early/Late Blight):** पत्तियों पर गोल-गोल भूरे छल्ले और पीलापन दिखाई देता है।\n   - 🌿 **जैविक उपाय:** 5ml नीम का तेल (10,000 ppm) प्रति लीटर पानी में शैम्पू मिलाकर हर 7 दिन में स्प्रे करें। साथ ही ट्राइकोडर्मा विरिडी (5 ग्राम/लीटर) छिड़कें।\n   - 🧪 **रासायनिक उपाय:** मेंकोजेब 75% WP (2.5 ग्राम/लीटर) या एज़ोक्सीस्ट्रोबिन + डिफेनोकोनाज़ोल (1 मिली/लीटर) का छिड़काव करें।\n2. **पत्ता मरोड़ रोग (Leaf Curl):** यह सफेद मक्खी से फैलता है। इमिडाक्लोप्रिड 17.8% SL (0.5 मिली/लीटर) छिड़कें।\n3. **किसान सलाह:** पौधे की निचली सूखी पत्तियों को जमीन से 6 इंच ऊपर तक काट दें ताकि मिट्टी से फफूंद न फैले!",
        'hinglish': "🍅 **Tamatar me Jhulsa Rog aur Sahi Upchar:**\n\n1. **Early Blight (Jhulsa Rog):** Niche ki pattiyon par gole bhoore daag bante hain.\n   - 🌿 **Organic Upay:** Neem oil (5ml/L) + halka detergent milakar har 7 din par spray karein. Sath me Trichoderma (5g/L) dein.\n   - 🧪 **Chemical Dawa:** Mancozeb 75% WP (2.5g/L) ya Azoxystrobin (1ml/L) ka spray karein.\n2. **Pattiya mudna (Leaf Curl):** Safed makkhi se hota hai. Imidacloprid (0.5ml/L) ka spray karein.\n3. **Khas Tip:** Niche ki kharab pattiya kaat kar hata dein aur paani hamesha subah drip se dein!",
        'pa': "🍅 **ਟਮਾਟਰ ਦੀ ਫਸਲ ਅਤੇ ਝੁਲਸਾ ਰੋਗ ਦਾ ਇਲਾਜ:**\n\n1. **ਝੁਲਸਾ (Blight):** ਹੇਠਲੇ ਪੱਤਿਆਂ 'ਤੇ ਭੂਰੇ ਗੋਲ ਧੱਬੇ ਬਣਦੇ ਹਨ।\n   - **ਜੈਵਿਕ:** ਨਿੰਮ ਦਾ ਤੇਲ (5 ਮਿ.ਲੀ./ਲਿਟਰ) ਜਾਂ ਟ੍ਰਾਈਕੋਡਰਮਾ ਛਿੜਕੋ।\n   - **ਰਸਾਇਣਕ:** ਮੈਨਕੋਜ਼ੇਬ 75% WP (2.5 ਗ੍ਰਾਮ/ਲਿਟਰ) ਦਾ ਸਪਰੇਅ ਕਰੋ।\n2. ਪੌਦੇ ਦੇ ਹੇਠਲੇ ਸੁੱਕੇ ਪੱਤੇ ਤੁਰੰਤ ਕੱਟ ਦਿਓ ਤਾਂ ਜੋ ਜ਼ਮੀਨ ਤੋਂ ਉੱਲੀ ਨਾ ਫੈਲੇ।",
        'mr': "🍅 **टोमॅटोवरील करपा (Blight) व कीड नियंत्रण:**\n\n1. **करपा रोग:** पानांवर तपकिरी वाटोळे डाग पडतात.\n   - **सेंद्रिय:** कडुनिंब तेल (5 मिली/लिटर) किंवा ट्रायकोडर्मा विरिडी (5 ग्रॅम/लिटर) फवारा.\n   - **रासायनिक:** मॅन्कोझेब 75% WP (2.5 ग्रॅम/लिटर) फवारा.\n2. झाडांना आधार (स्टेकिंग) द्या आणि ठिबक सिंचनानेच पाणी द्या.",
        'te': "🍅 **టమోటా ఆకు ఎండు తెగులు (Blight) నివారణ:**\n\n1. **తెగులు లక్షణాలు:** ఆకులపై ముదురు గోధుమ రంగు వలయాకార మచ్చలు ఏర్పడతాయి.\n   - **సేంద్రియ నివారణ:** వేప నూనె (5 మి.లీ./లీటరు) లేదా ట్రైకోడెర్మా విరిడే (5 గ్రా./లీటరు) పిచికారీ చేయండి.\n   - **రసాయన నివారణ:** మాంకోజెబ్ 75% WP (2.5 గ్రా./లీటరు) లేదా అజోక్సిస్ట్రోబిన్ పిచికారీ చేయండి.\n2. క్రింది పాడైపోయిన ఆకులను కత్తిరించి తీసివేయండి.",
        'ta': "🍅 **தக்காளி இலைக்கருகல் (Blight) நோய் கட்டுப்பாடு:**\n\n1. **அறிகுறிகள்:** கீழ் இலைகளில் வட்டமான பழுப்பு நிற புள்ளிகள் தோன்றும்.\n   - **இயற்கை முறை:** வேப்ப எண்ணெய் (5 மி.லி./லிட்டர்) அல்லது டிரைக்கோடெர்மா விரிடி தெளிக்கவும்.\n   - **இரசாயன முறை:** மேன்கோசெப் 75% WP (2.5 கிராம்/லிட்டர்) தெளிக்கவும்.\n2. தரையோடு ஒட்டியுள்ள காய்ந்த இலைகளை அகற்றி விடுங்கள்.",
        'bn': "🍅 **টমেটোর ব্লাইট বা নাবি ধসা রোগের প্রতিকার:**\n\n১. **লক্ষণ:** পাতায় গোল বাদামী দাগ ও হলদে ভাব দেখা যায়।\n   - **জৈব উপায়:** নিম তেল (৫ মিলি/লিটার) ও ট্রাইকোডার্মা স্প্রে করুন।\n   - **রাসায়নিক ওষুধ:** ম্যানকোজেব ৭৫% WP (২.৫ গ্রাম/লিটার) স্প্রে করুন।\n২. গাছের নিচের শুকনো পাতা ছাঁটাই করুন।",
        'gu': "🍅 **ટામેટામાં સુકારો (Blight) રોગનું નિયંત્રણ:**\n\n૧. પાન પર ગોળ કથ્થઈ ડાઘ દેખાય છે.\n   - **જૈવિક ઉપાય:** લીમડાનું તેલ (5 મિલી/લિટર) અને ટ્રાઈકોડર્મા (5 ગ્રામ/લિટર) છાંટો.\n   - **રાસાયણિક દવા:** મેન્કોઝેબ 75% WP (2.5 ગ્રામ/લિટર) નો છંટકાવ કરો.\n૨. નીચેના સુકા પાન કાપીને હટાવી દો.",
        'en': "🍅 **Tomato Farming & Blight Disease Management:**\n\n1. **Early Blight (Alternaria solani):** Concentric brown rings with yellow margins on lower leaves.\n   - 🌿 **Organic Treatment:** Spray cold-pressed Neem Oil (5ml/L) with soap emulsifier every 7 days, or biofungicide *Trichoderma viride* (5g/L).\n   - 🧪 **Chemical Treatment:** Spray **Mancozeb 75% WP** (2.5g/L) or **Azoxystrobin + Difenoconazole** (1ml/L).\n2. **Leaf Curl (Viral):** Spread by whiteflies. Spray Imidacloprid (0.5ml/L).\n3. **Farmer Pro-Tip:** Prune lower leaves up to 6 inches from the soil to prevent soil-splashed fungal spores!",
        'es': "🍅 **Cultivo de Tomate y Control de Tizón:** Aplique Mancozeb 75% WP (2.5g/L) o biofungicida Trichoderma (5g/L). Pode hojas bajas a 15 cm para evitar salpicaduras."
      }
    },

    // 3. Wheat Cultivation, Sowing & First Water (गेहूं / ਕਣਕ / गहू / గోధుమ / ઘઉં)
    {
      keywords: ['wheat', 'gehu', 'gehun', 'kanak', 'gahu', 'godhuma', 'ghau', 'sowing', 'buwai', 'ratuwa', 'rust', 'cri', 'kalle'],
      reply: {
        'hi': "🌾 **गेहूं की वैज्ञानिक खेती और बंपर पैदावार:**\n\n- **बुवाई का सही समय:** 1 नवंबर से 25 नवंबर (बीज दर: 40-45 किग्रा प्रति एकड़)।\n- **पहला पानी (CRI स्टेज):** बुवाई के **21 दिन बाद** पहला पानी देना सबसे जरूरी है। इसी समय जड़ें और कल्ले फूटते हैं।\n- **खाद की सही मात्रा:** बुवाई के समय 1 बैग DAP + आधा बैग पोटाश दें। यूरिया को पहले और दूसरे पानी से पहले 45-45 किग्रा दें।\n- **पीला रतुआ (Yellow Rust):** पत्ती पर पीली हल्दी जैसा पाउडर दिखे तो प्रोपिकोनाज़ोल 25% EC (1ml/लीटर) का स्प्रे करें।",
        'hinglish': "🌾 **Gehu (Wheat) ki Unnat Kheti & Bumper Yield Formula:**\n\n- **Sowing Time:** 1 se 25 November best time hai. Seed rate 40-45 kg/acre rakhein.\n- **Pehla Paani (CRI Stage):** Sowing ke **21 din baad** pehla paani zaroor dein. Isse kalle (tillers) zyada nikalte hain.\n- **Khad Schedule:** Sowing ke time 1 bag DAP + aadha bag Potash dein. Urea pehle aur doosre paani par aadha-aadha baant kar dein.\n- **Peela Ratuwa (Rust):** Agar patti pe peela powder dikhe to Propiconazole (1ml/L) ka spray karein.",
        'pa': "🌾 **ਕਣਕ ਦੀ ਕਾਸ਼ਤ ਅਤੇ ਵੱਧ ਝਾੜ ਦੇ ਨੁਕਤੇ:**\n\n- **ਬਿਜਾਈ:** 1 ਤੋਂ 25 ਨਵੰਬਰ (40-45 ਕਿਲੋ ਬੀਜ ਪ੍ਰਤੀ ਏਕੜ)।\n- **ਪਹਿਲਾ ਪਾਣੀ (CRI):** ਬਿਜਾਈ ਤੋਂ **21 ਦਿਨਾਂ ਬਾਅਦ** ਪਹਿਲਾ ਪਾਣੀ ਦੇਣਾ ਲਾਜ਼ਮੀ ਹੈ।\n- **ਖਾਦ:** ਬਿਜਾਈ ਸਮੇਂ ਡੀਏਪੀ ਅਤੇ ਪੋਟਾਸ਼ ਪਾਓ। ਯੂਰੀਆ ਪਹਿਲੇ ਅਤੇ ਦੂਜੇ ਪਾਣੀ 'ਤੇ ਵੰਡ ਕੇ ਦਿਓ।\n- **ਪੀਲੀ ਕੁੰਗੀ:** ਪੱਤਿਆਂ 'ਤੇ ਪੀਲਾ ਪਾਊਡਰ ਦਿੱਸਣ 'ਤੇ ਪ੍ਰੋਪੀਕੋਨਾਜ਼ੋਲ (1 ਮਿ.ਲੀ./ਲਿਟਰ) ਛਿੜਕੋ।",
        'mr': "🌾 **गहू भरघोस उत्पादन व खत व्यवस्थापन:**\n\n- **पेरणी:** नोव्हेंबरच्या पहिल्या पंधरवड्यात करावी (बियाणे: 40-45 किलो/एकर).\n- **पहिले पाणी (CRI):** पेरणीनंतर **21 व्या दिवशी** मुकुटमुळे फुटताना पाणी देणे आवश्यक आहे.\n- **खते:** 1 पोते DAP + अर्धे पोते पोटॅश पेरणीवेळी; युरिया विभागून द्यावा.\n- **तांबेरा रोग:** प्रोपिकोनाझोल (1 मिली/लिटर) फवारावे.",
        'te': "🌾 **గోధుమ సాగు మరియు అధిక దిగుబడి:**\n\n- **విత్తే సమయం:** నవంబర్ మొదటి వారం.\n- **మొదటి తడి (CRI):** విత్తిన **21 రోజుల తర్వాత** తప్పనిసరిగా నీరు ఇవ్వాలి.\n- **ఎరువులు:** ఎకరాకు 1 బస్తా డీఏపీ, యూరియాను రెండు విడతలుగా వేయండి.",
        'ta': "🌾 **கோதுமை சாகுபடி முறைகள்:**\n\n- **விதைப்பு:** நவம்பர் மாதம் விதைக்க உகந்தது.\n- **முதல் பாசனம் (CRI):** விதைத்த **21 வது நாளில்** முதல் தண்ணீர் பாய்ச்சுவது மிக முக்கியம்.",
        'bn': "🌾 **গমের বাম্পার ফলন নির্দেশিকা:**\n\n- **বপনের সময়:** নভেম্বর মাস।\n- **প্রথম সেচ (CRI):** বীজ বোনার **২১ দিন পর** প্রথম সেচ দেওয়া জরুরি, তখন কুশি বের হয়।\n- **সার:** ডিএপি ও পটাশ বপনের সময় দিন এবং ইউরিয়া ভাগ করে দিন।",
        'gu': "🌾 **ઘઉંની વૈજ્ઞાનિક ખેતી અને બમ્પર ઉત્પાદન:**\n\n- **વાવણી સમય:** 1 થી 20 નવેમ્બર.\n- **પહેલું પાણી (CRI):** વાવણીના **21 દિવસ પછી** પહેલું પાણી આપવું સૌથી મહત્વનું છે.\n- **ખાતર:** વાવણી વખતે ડીએપી અને પોટાશ આપો. યુરિયા બે હપ્તામાં આપવું.",
        'en': "🌾 **Wheat High-Yield Cultivation Blueprint:**\n\n- **Ideal Sowing:** Nov 1 to Nov 25 (Seed rate: 40-45 kg/acre).\n- **First Irrigation (CRI Stage):** Critical at **21 days after sowing**. Skipping this reduces yield by up to 30%!\n- **Fertilizer Dosage:** 1 bag DAP + 1/2 bag MOP (Potash) at sowing. Top-dress Urea in two splits.\n- **Yellow Rust:** Spray Propiconazole 25% EC @ 1ml/L if turmeric-like yellow powder appears on leaves.",
        'es': "🌾 **Guía de Cultivo de Trigo:** Siembre con 40-45 kg/acre. Primer riego obligatorio a los **21 días** (etapa CRI para enraizamiento). Aplique nitrógeno fraccionado."
      }
    },

    // 4. Rice / Paddy Cultivation (धान / ਝੋਨਾ / भात / వరి / நெல் / ধান / ડાંગર)
    {
      keywords: ['rice', 'paddy', 'dhan', 'dhaan', 'jhona', 'bhat', 'vari', 'nel', 'dangar', 'chawal', 'transplanting', 'blast', 'ropai'],
      reply: {
        'hi': "🍚 **धान (Paddy) की वैज्ञानिक खेती व रोग नियंत्रण:**\n\n- **रोपाई:** 21-25 दिन की पौध की रोपाई 20x15 सेमी की दूरी पर (2-3 पौधे प्रति थान) करें।\n- **जल प्रबंधन:** रोपाई के पहले 15 दिन खेत में 2-3 सेमी हल्का पानी रखें। इसके बाद पानी सुखाकर फिर पानी दें (AWD विधि)।\n- **तना छेदक (Stem Borer):** कार्टाप हाइड्रोक्लोराइड 4G (7.5 किग्रा/एकड़) का प्रयोग करें।\n- **झोंका रोग (Blast):** पत्तियों पर आंख जैसे धब्बे दिखने पर ट्राइसाइक्लाज़ोल 75% WP (0.6 ग्राम/लीटर) का स्प्रे करें।",
        'hinglish': "🍚 **Dhan (Paddy) ki Kheti aur Rog Roktham:**\n\n- **Ropai:** 21-25 din ki nursery se 2-3 paudhe prati hill lagayein (20x15 cm spacing).\n- **Paani Management:** Shuru ke 15 din 2-3 cm halka paani rakhein, fir Alternate Wetting & Drying karein.\n- **Tana Chhedak (Stem Borer):** Cartap Hydrochloride 4G (7.5 kg/acre) daalein.\n- **Blast Rog:** Tricyclazole (0.6g/L) ka chhidkaw karein.",
        'pa': "🍚 **ਝੋਨੇ ਦੀ ਕਾਸ਼ਤ ਅਤੇ ਸਾਂਭ-ਸੰਭਾਲ:**\n\n- **ਪਨੀਰੀ:** 21-25 ਦਿਨਾਂ ਦੀ ਪਨੀਰੀ 2-3 ਬੂਟੇ ਪ੍ਰਤੀ ਥਾਂ ਲਗਾਓ।\n- **ਤਣਾ ਛੇਦਕ:** ਕਾਰਟਾਪ ਹਾਈਡਰੋਕਲੋਰਾਈਡ (7.5 ਕਿਲੋ/ਏਕੜ) ਪਾਓ।\n- ਖੇਤ ਵਿੱਚ ਬਹੁਤਾ ਪਾਣੀ ਖੜ੍ਹਾ ਨਾ ਰੱਖੋ, ਹਵਾ ਲੱਗਣ ਦਿਓ।",
        'mr': "🍚 **भात शेती तंत्रज्ञान:**\n\n- **पुनर्लागवड:** 20-25 दिवसांची रोपे 20x15 सेमी अंतरावर लावावीत.\n- **खोडकीड:** कार्टाप हायड्रोक्लोराईड 4G (7.5 किलो/एकर) वापरावे.\n- **करपा:** ट्रायसायक्लॅझोल (0.6 ग्रॅम/लिटर) फवारावे.",
        'te': "🍚 **వరి సాగు మరియు తెగుళ్ల యాజమాన్యం:**\n\n- **నాట్లు:** 20-25 రోజుల నారును కుదురుకు 2-3 మొక్కల చొప్పున నాటండి.\n- **కాండం తొలుచు పురుగు:** కార్టాప్ హైడ్రోక్లోరైడ్ 4G (ఎకరాకు 7.5 కేజీలు) వేయండి.\n- **అగ్గి తెగులు (Blast):** ట్రైసైక్లాజోల్ (0.6 గ్రా./లీటరు) పిచికారీ చేయండి.",
        'ta': "🍚 **நெல் சாகுபடி மற்றும் பாதுகாப்பு:**\n\n- **நடவு:** 20-25 நாள் நாற்றுகளை நடவு செய்யவும்.\n- **குருத்துப்பூச்சி:** கார்டாப் ஹைட்ரோகுளோரைடு பயன்படுத்தவும்.\n- **குலைநோய் (Blast):** ட்ரைசைக்ளசோல் தெளிக்கவும்.",
        'bn': "🍚 **ধান চাষের সঠিক নিয়ম:**\n\n- ২১-২৫ দিনের চারা রোপণ করুন।\n- মাজরা পোকার জন্য কার্টাপ হাইড্রোক্লোরাইড ব্যবহার করুন।\n- ব্লাস্ট রোগের জন্য ট্রাইসাইক্লাজোল স্প্রে করুন।",
        'gu': "🍚 **ડાંગરની ખેતી અને રોગ નિયંત્રણ:**\n\n- ૨૧-૨૫ દિવસના ધરુ રોપવા.\n- ગાભમારાની ઈયળ માટે કાર્ટાપ હાઈડ્રોક્લોરાઈડ આપવું.\n- પાનનો કરપો રોગ જણાય તો ટ્રાઈસાયક્લાઝોલ છાંટવું.",
        'en': "🍚 **Paddy / Rice High-Yield Cultivation:**\n\n- **Transplanting:** Transplant 21-25 day old seedlings (2-3 seedlings/hill) with 20x15 cm spacing.\n- **Watering:** Keep shallow 2-3 cm water for first 15 days, then practice Alternate Wetting and Drying (AWD) to save water.\n- **Stem Borer Control:** Apply Cartap Hydrochloride 4G @ 7.5 kg/acre.\n- **Blast Disease:** Spray Tricyclazole 75% WP @ 0.6g/L if spindle-shaped spots appear.",
        'es': "🍚 **Cultivo de Arroz:** Transplante plántulas de 20-25 días con 20x15 cm de espaciado. Para el tizón foliar use Triciclazol."
      }
    },

    // 5. Cotton & Pink Bollworm (कपास / गुलाबी सुंडी / ਨਰਮਾ / कापूस / ప్రత్తి / કપાસ)
    {
      keywords: ['cotton', 'kapas', 'narma', 'bollworm', 'sundi', 'sundee', 'gulabi', 'paththi', 'paruthi', 'tula'],
      reply: {
        'hi': "☁️ **कपास की खेती एवं गुलाबी सुंडी से बचाव:**\n\n- **फेरोमोन ट्रैप:** बुवाई के 45 दिन बाद प्रति एकड़ 5-8 फेरोमोन ट्रैप अवश्य लगाएं ताकि पतंगों का पता चले।\n- **नीम तेल:** कली और फूल बनने पर नीम तेल (1500 ppm) 5 मिली/लीटर का छिड़काव करें।\n- **रासायनिक कीटनाशक:** यदि सुंडी का प्रकोप अधिक हो तो **इमामेक्टिन बेंजोएट 5% SG** (0.5 ग्राम/लीटर) या **स्पाइनोटोरम 11.7% SC** (1 मिली/लीटर) का शाम को स्प्रे करें।",
        'hinglish': "☁️ **Kapas (Cotton) aur Gulabi Sundi se Bachav:**\n\n- **Pheromone Traps:** Sowing ke 45 din baad 5-8 trap prati acre zaroor lagayein.\n- **Neem Spray:** Phool aane par Neem oil (5ml/L) ka spray karein.\n- **Bollworm Attack:** Agar sundi dikhe to **Emamectin Benzoate** (0.5g/L) ya **Spinetoram** (1ml/L) shaam ke waqt spray karein.",
        'pa': "☁️ **ਨਰਮੇ ਦੀ ਗੁਲਾਬੀ ਸੁੰਡੀ ਤੋਂ ਰੋਕਥਾਮ:**\n\n- ਖੇਤ ਵਿੱਚ 5-8 ਫੇਰੋਮੋਨ ਟਰੈਪ ਲਗਾਓ।\n- ਫੁੱਲ ਡੋਡੀ ਵੇਲੇ ਨਿੰਮ ਦੇ ਤੇਲ ਦਾ ਸਪਰੇਅ ਕਰੋ।\n- ਸੁੰਡੀ ਦਿਖਣ 'ਤੇ ਇਮਾਮੈਕਟਿਨ ਬੈਂਜੋਏਟ (0.5 ਗ੍ਰਾਮ/ਲਿਟਰ) ਸ਼ਾਮ ਨੂੰ ਛਿੜਕੋ।",
        'mr': "☁️ **कापूस लागवड व बोंडअळी नियंत्रण:**\n\n- एकरी 5 कामगंध सापळे लावा.\n- निंबोळी अर्क 5% फवारा. तीव्र प्रादुर्भावासाठी इमामेक्टिन बेन्झोएट (0.5 ग्रॅम/लिटर) सायंकाळी फवारा.",
        'te': "☁️ **ప్రత్తిలో గులాబీ రంగు పురుగు నివారణ:**\n\n- ఎకరాకు 5-8 లింగాకర్షక బుట్టలు (Pheromone Traps) అమర్చండి.\n- పూత సమయంలో వేప నూనె (5 మి.లీ./లీటరు) పిచికారీ చేయండి.\n- పురుగు ఉధృతి ఉంటే ఇమామెక్టిన్ బెంజోయేట్ (0.5 గ్రా./లీటరు) సాయంత్రం వేళ పిచికారీ చేయండి.",
        'ta': "☁️ **பருத்தி காய்ப்புழு கட்டுப்பாடு:**\n\n- இனக்கவர்ச்சி பொறிகள் 5 வைக்கவும்.\n- வேப்ப எண்ணெய் தெளிக்கவும். இமாமெக்டின் பென்சோயேட் தெளிக்கவும்.",
        'bn': "☁️ **তুলার গোলাপী পোকা দমন:**\n\n- জমিতে ফেরোমোন ফাঁদ পাতুন। নিম তেল বা ইমমেকটিন বেনজয়েট স্প্রে করুন।",
        'gu': "☁️ **કપાસમાં ગુલાબી ઈયળનું નિયંત્રણ:**\n\n- એકરે ૫-૮ ફેરોમોન ટ્રેપ લગાવો.\n- ફૂલ-ઝીંડવા સમયે લીમડાનું તેલ છાંટો.\n- વધુ ઉપદ્રવમાં ઇમામેક્ટીન બેન્ઝોએટ (0.5 ગ્રામ/લિટર) નો સાંજે છંટકાવ કરો.",
        'en': "☁️ **Cotton Cultivation & Pink Bollworm Management:**\n\n- **Pheromone Traps:** Install 5-8 pheromone traps per acre at 45 days after sowing.\n- **Neem Spray:** Spray cold-pressed Neem formulation (1500 ppm) @ 5ml/L during early square/flower formation.\n- **Chemical Control:** If green boll damage exceeds 5%, spray **Emamectin Benzoate 5% SG** (0.5g/L) or **Spinetoram 11.7% SC** (1ml/L) in late afternoon.",
        'es': "☁️ **Cultivo de Algodón:** Instale trampas de feromonas (5 por acre). Aplique Emamectina Benzoato (0.5g/L) al detectar larvas."
      }
    },

    // 6. Potato Farming & Earthing Up (आलू / बटाटा / బంగాళాదుంప / உருளை / બટાટા)
    {
      keywords: ['potato', 'aalu', 'aaloo', 'batata', 'alu', 'earthing', 'mitti chadhana', 'tuber'],
      reply: {
        'hi': "🥔 **आलू की वैज्ञानिक खेती और सावधानियां:**\n\n- **मिट्टी चढ़ाना (Earthing Up):** बुवाई के **30 दिन और 50 दिन बाद** पौधों पर मिट्टी अवश्य चढ़ाएं ताकि कंद धूप से हरे न हों (हरा आलू जहरीला सोलेनाइन बनाता है)।\n- **पछेती झुलसा (Late Blight) से बचाव:** कोहरे व बदली के मौसम में मैंकोजेब (2.5 ग्राम/लीटर) छिड़कें। रोग आने पर साइमोक्सानिल + मैंकोजेब दें।\n- **बेल कटाई:** खुदाई से 10-12 दिन पहले डंठल काट दें ताकि आलू का छिलका मजबूत हो जाए।",
        'hinglish': "🥔 **Aalu (Potato) ki Kheti aur Zaroori Tips:**\n\n- **Mitti Chadhana:** Sowing ke **30 din aur 50 din baad** mitti zaroor chadhayein taaki aalu dhoop se hara na ho.\n- **Late Blight se Bachav:** Kohre me Mancozeb (2.5g/L) spray karein. Rog aane par Cymoxanil + Mancozeb dein.\n- **Khudaai Se Pehle:** Khudaai se 10-12 din pehle bel kaat dein taaki aalu ka chhilka hard ho sake.",
        'pa': "🥔 **ਆਲੂ ਦੀ ਕਾਸ਼ਤ:** 30 ਅਤੇ 50 ਦਿਨਾਂ ਬਾਅਦ ਮਿੱਟੀ ਚੜ੍ਹਾਉਣੀ ਲਾਜ਼ਮੀ ਹੈ। ਕੋਹਰੇ ਸਮੇਂ ਝੁਲਸੇ ਤੋਂ ਬਚਾਅ ਲਈ ਮੈਨਕੋਜ਼ੇਬ ਛਿੜਕੋ।",
        'mr': "🥔 **बटाटा शेती:** लागवडीनंतर 30 व 50 दिवसांनी भर देणे गरजेचे आहे. ढगाळ हवामानात करपा प्रतिबंधासाठी बुरशीनाशक फवारा.",
        'te': "🥔 **బంగాళాదుంప సాగు:** నాటిన 30 మరియు 50 రోజులకు దుంపలపై మట్టి కప్పాలి. మంచు సమయంలో తెగులు రాకుండా మ్యాంకోజెబ్ పిచికారీ చేయాలి.",
        'ta': "🥔 **உருளைக்கிழங்கு சாகுபடி:** 30 மற்றும் 50 நாட்களில் மண் அணைப்பது அவசியம். இலைக்கருகல் நோய்க்கு மேன்கோசெப் தெளிக்கவும்.",
        'bn': "🥔 **আলু চাষের যত্ন:** বপনের ৩০ ও ৫০ দিন পর মাটি তুলে দিন। কুয়াশার সময় ব্লাইট থেকে বাঁচাতে ম্যানকোজেব স্প্রে করুন।",
        'gu': "🥔 **બટાટાની ખેતી:** વાવણી પછી 30 અને 50 દિવસે પાળા ચઢાવવા (માટી ચઢાવવી). ધુમ્મસમાં સુકારાથી બચવા મેન્કોઝેબ છાંટવું.",
        'en': "🥔 **Potato Production Guide:**\n\n- **Earthing Up:** Essential at **30 days** and **50 days** to keep developing tubers covered in soil, preventing greening and toxic solanine buildup.\n- **Late Blight Protection:** Spray Mancozeb 75% WP (2.5g/L) preventively during foggy weather. If disease starts, spray Cymoxanil + Mancozeb.\n- **Dehaulming:** Cut aerial foliage 10-12 days before harvest to harden tuber skin.",
        'es': "🥔 **Cultivo de Papa:** Realice aporques a los 30 y 50 días para evitar el enverdecimiento de los tubérculos."
      }
    },

    // 7. Fertilizers, NPK, Urea, DAP & Organic Jeevamrut (खाद / उर्वरक / जीवामृत)
    {
      keywords: ['fertilizer', 'khad', 'khaad', 'urea', 'dap', 'potash', 'npk', 'jeevamrut', 'organic', 'jaivik', 'compost', 'zinc', 'boron', 'khatar', 'eruvulu', 'uram'],
      reply: {
        'hi': "🧪 **उर्वरक एवं जैविक खाद प्रबंधन:**\n\n- **संतुलित खाद (NPK):** अनाज वाली फसलों में 4:2:1 का अनुपात रखें (जैसे गेहूं में 120:60:40 किग्रा/हेक्टेयर)।\n- **यूरिया का सही नियम:** पूरा यूरिया एक साथ कभी न डालें! इसे पानी देने से पहले 2-3 बार में बांटकर दें ताकि नाइट्रोजन हवा में न उड़े।\n- **घर पर जीवामृत बनाने की विधि:** 200 लीटर पानी में 10 किग्रा देसी गाय का गोबर + 10 लीटर गोमूत्र + 2 किग्रा गुड़ + 2 किग्रा बेसन + 1 मुट्ठी मेड़ की मिट्टी मिलाएं। 5-7 दिन छाया में डंडे से चलाएं। 200 लीटर प्रति एकड़ खेत में दें।",
        'hinglish': "🧪 **Khad aur Jeevamrut Management:**\n\n- **Balanced NPK:** Anaaj wali faslon me N:P:K ka ratio 4:2:1 rakhein.\n- **Urea ka Sahi Tarika:** Saara Urea ek saath kabhi mat daalein! Paani lagane se pehle 2 se 3 bar me divide karke dein.\n- **Ghar Par Jeevamrut:** 200L paani me 10kg Gobar + 10L Gomutra + 2kg Gur + 2kg Besan + 1 mutthi mitti milayein. 5-7 din dande se ghumayein. Drip ya naali ke paani ke sath 200L prati acre dein!",
        'pa': "🌱 **ਦੇਸੀ ਜੀਵਾਮ੍ਰਿਤ ਬਣਾਉਣ ਦਾ ਤਰੀਕਾ:** 200 ਲਿਟਰ ਪਾਣੀ ਵਿੱਚ 10 ਕਿਲੋ ਗੋਹਾ + 10 ਲਿਟਰ ਗਊ ਮੂਤਰ + 2 ਕਿਲੋ ਗੁੜ + 2 ਕਿਲੋ ਬੇਸਣ ਪਾਓ। 5 ਦਿਨ ਹਿਲਾਓ ਤੇ ਏਕੜ ਪਿੱਛੇ ਸਿੰਚਾਈ ਨਾਲ ਦਿਓ।",
        'mr': "🌱 **सेंद्रिय खत व जीवामृत:** 200 लिटर पाण्यात 10 किलो शेण + 10 लिटर गोमूत्र + 2 किलो गूळ + 2 किलो बेसन मिसळून 5 दिवस ढवळावे. एकरी 200 लिटर द्यावे.",
        'te': "🌱 **సహజ జీవామృతం తయారీ:** 200 లీటర్ల నీటిలో 10 కేజీల ఆవు పేడ + 10 లీటర్ల ఆవు మూత్రం + 2 కేజీల బెల్లం + 2 కేజీల శనగపిండి కలపండి. 5-7 రోజులు నీడలో ఉంచి రోజుకు రెండుసార్లు తిప్పాలి. ఎకరాకు 200 లీటర్లు అందించాలి.",
        'ta': "🌱 **இயற்கை ஜீவாமிர்தம் தயாரிப்பு:** 200 லிட்டர் நீரில் 10 கிலோ பசுஞ்சாணம் + 10 லிட்டர் கோமியம் + 2 கிலோ வெல்லம் + 2 கிலோ கடலை மாவு கலந்து 5 நாட்கள் வைக்கவும். ஏக்கருக்கு 200 லிட்டர் பாய்ச்சவும்.",
        'bn': "🌱 **প্রাকৃতিক জীবামৃত সার তৈরি:** ২০০ লিটার পানিতে ১০ কেজি গোবর + ১০ লিটার গোমূত্র + ২ কেজি গুড় + ২ কেজি বেসন মিশিয়ে ৫ দিন ছায়ায় রাখুন। একরে ২০০ লিটার প্রয়োগ করুন।",
        'gu': "🌱 **ઘરે દેશી જીવામૃત ખાતર બનાવવાની રીત:** 200 લિટર પાણીમાં 10 કિલો ગાયનું છાણ + 10 લિટર ગૌમૂત્ર + 2 કિલો ગોળ + 2 કિલો ચણાનો લોટ + 1 મુઠ્ઠી માટી ભેળવવી. 5-7 દિવસ છાંયડે હલાવવું. એકરે 200 લિટર પિયત સાથે આપવું.",
        'en': "🧪 **Fertilizer & Organic Nutrient Management:**\n\n- **Balanced NPK:** Always use soil testing. General cereal ratio is 4:2:1 (N:P:K).\n- **Urea Application Rule:** Never apply all Urea at once! Split into 2-3 doses before watering to prevent nitrogen volatilization into the air.\n- **Home-made Jeevamrut:** Mix 10 kg cow dung + 10L cow urine + 2 kg jaggery + 2 kg gram flour (besan) + 1 handful fertile farm soil in 200L water. Stir daily for 5-7 days under shade. Apply 200L/acre via irrigation canal or drip!",
        'es': "🌱 **Fertilización y Biol Orgánico:** Fraccione la aplicación de nitrógeno para evitar pérdidas por lixiviación. El biol fermentado activa microorganismos benéficos."
      }
    },

    // 8. Weather, Spraying Time & Irrigation (मौसम / छिड़काव / पानी)
    {
      keywords: ['weather', 'mausam', 'barish', 'rain', 'spray', 'chhidkaw', 'pani', 'paani', 'water', 'sinchai', 'wind', 'hawa', 'havaman'],
      reply: {
        'hi': "🌦️ **मौसम एवं छिड़काव/सिंचाई परामर्श:**\n\n- **स्प्रे का सही समय:** सुबह 6:30 से 10:00 बजे तक या शाम 4 बजे के बाद जब हवा शांत (10 किमी/घंटा से कम) हो।\n- **बारिश का ध्यान:** यदि अगले 6 घंटे में बारिश की संभावना 40% से अधिक हो तो स्प्रे टाल दें।\n- **सिंचाई:** सुबह के समय पानी देने से वाष्पीकरण कम होता है। ऊपर दिए गए 7-दिवसीय मौसम बॉक्स में अपने जिले का मौसम तुरंत देखें!",
        'hinglish': "🌦️ **Mausam aur Spray/Sinchai Advisory:**\n\n- **Spray ka Best Time:** Subah 6:30 se 10 AM ya shaam ko 4 PM ke baad karein, jab hawa shant ho (wind speed < 10 km/h).\n- **Barish Alert:** Agar agle 6 ghante me barish ka chance 40% se zyada hai to spray na karein, dawa beh jayegi.\n- **Paani Lagana:** Subah thande waqt paani lagane se paani ki bachat hoti hai. Upar live 7-day mausam forecast dekhein!",
        'pa': "🌦️ **ਮੌਸਮ ਅਤੇ ਸਪਰੇਅ:** ਸਵੇਰੇ ਜਾਂ ਸ਼ਾਮ ਨੂੰ ਸਪਰੇਅ ਕਰੋ ਜਦੋਂ ਹਵਾ ਸ਼ਾਂਤ ਹੋਵੇ। ਮੀਂਹ ਪੈਣ ਦੀ ਸੰਭਾਵਨਾ ਹੋਵੇ ਤਾਂ ਸਪਰੇਅ ਰੋਕ ਦਿਓ।",
        'mr': "🌦️ **हवामान व फवारणी सल्ला:** सकाळी 10 च्या आत किंवा संध्याकाळी 4 नंतर फवारणी करावी. पाऊस पडण्याची शक्यता असल्यास फवारणी टाळा.",
        'te': "🌦️ **వాతావరణం మరియు పిచికారీ సలహా:** ఉదయం లేదా సాయంత్రం గాలి వేగం తక్కువగా ఉన్నప్పుడు పిచికారీ చేయండి. వర్షం పడే సూచన ఉంటే మందులు కొట్టవద్దు.",
        'ta': "🌦️ **வானிலை ஆலோசனை:** காலை அல்லது மாலை வேளையில் காற்று அமைதியாக இருக்கும் போது மருந்து தெளிக்கவும். மழை வாய்ப்பு இருந்தால் தெளிக்க வேண்டாம்.",
        'bn': "🌦️ **আবহাওয়া ও স্প্রে করার পরামর্শ:** বাতাস শান্ত থাকলে সকাল বা বিকেলে স্প্রে করুন। বৃষ্টির সম্ভাবনা থাকলে কীটনাশক ছিটানো বন্ধ রাখুন।",
        'gu': "🌦️ **હવામાન અને છંટકાવ સલાહ:** સવારે 10 પહેલાં અથવા સાંજે પવન શાંત હોય ત્યારે દવાનો છંટકાવ કરવો. વરસાદની સંભાવના હોય તો છંટકાવ ટાળવો.",
        'en': "🌦️ **Agricultural Weather & Spray Advisory:**\n\n- **Optimal Spraying Window:** Early morning (6:30 AM - 10:00 AM) or late afternoon when winds are under 10 km/h and temperatures are moderate.\n- **Rain Warning:** Hold all foliar sprays if rain probability exceeds 40% in the next 6 hours to prevent chemical wash-off.\n- **Irrigation:** Water during cool morning hours to reduce evaporation loss by up to 25%. Check the 7-day forecast above for live local microclimate!",
        'es': "🌦️ **Clima y Ventana de Fumigación:** Fumigue en la mañana con vientos menores a 10 km/h para evitar deriva del producto."
      }
    },

    // 9. Kisan Helpline, Schemes & Mandi (हेल्पलाइन व मंडी भाव)
    {
      keywords: ['helpline', 'call center', 'number', 'pm kisan', 'kcc', 'scheme', 'yojana', 'mandi', 'rate', 'price', 'bhav', 'sahayata'],
      reply: {
        'hi': "📞 **किसान हेल्पलाइन एवं प्रमुख सरकारी योजनाएं:**\n\n- **राष्ट्रीय किसान कॉल सेंटर (टोल-फ्री):** **1800-180-1551** (सुबह 6 से रात 10 बजे तक, 22 भाषाओं में मुफ्त कृषि सलाह)।\n- **पीएम-किसान सम्मान निधि:** सालाना ₹6,000 की किस्त (pmkisan.gov.in पर स्थिति देखें)।\n- **किसान क्रेडिट कार्ड (KCC):** समय पर चुकाने पर मात्र 4% ब्याज दर पर फसली ऋण मिलता है।\n- **मंडी भाव:** नीचे मंडी रेट सेक्शन में आज के गेहूं, धान, कपास और टमाटर के थोक भाव देखें!",
        'hinglish': "📞 **Kisan Helpline aur Sarkari Yojanaen:**\n\n- **National Kisan Call Center (Toll Free):** **1800-180-1551** (Subah 6 se Raat 10 baje tak, 22 bhashaon me muft kheti salaah).\n- **PM-Kisan Nidhi:** Saal ke ₹6,000 ki sahayata rashi.\n- **KCC (Kisan Credit Card):** Matra 4% interest rate par fasal loan.\n- **Mandi Bhav:** Niche diye gaye Mandi section me live wheat, paddy, cotton aur tomato ke daam dekhein!",
        'pa': "📞 **ਕਿਸਾਨ ਕਾਲ ਸੈਂਟਰ:** **1800-180-1551** 'ਤੇ ਮੁਫਤ ਖੇਤੀਬਾੜੀ ਸਲਾਹ ਲਈ ਫੋਨ ਕਰੋ। ਪੀਐਮ ਕਿਸਾਨ ਸਨਮਾਨ ਨਿਧੀ ਬਾਰੇ ਜਾਣਕਾਰੀ ਲਵੋ।",
        'mr': "📞 **किसान कॉल सेंटर:** **1800-180-1551** मोफत कृषी सल्लागार क्रमांक आहे. पीएम-किसान व पीक कर्जाविषयी माहिती घ्या.",
        'te': "📞 **రైతు కాల్ సెంటర్ (టోల్ ఫ్రీ):** **1800-180-1551** ఉదయం 6 నుండి రాత్రి 10 వరకు ఉచిత వ్యవసాయ సలహాలు పొందండి.",
        'ta': "📞 **விவசாயி உதவி எண்:** **1800-180-1551** கட்டணமில்లా தொலைபேசி எண் மூலம் இலவச விவசாய ஆலோசனை பெறலாம்.",
        'bn': "📞 **কিষাণ কল সেন্টার (টোল-ফ্রি):** **১৮০০-১৮০-১৫৫১** নম্বরে ফোন করে যেকোনো কৃষি পরামর্শ বিনামূল্যে পান।",
        'gu': "📞 **કિસાન કોલ સેન્ટર:** **1800-180-1551** (ટોલ-ફ્રી) પર ફોન કરીને ૨૨ ભાષાઓમાં મફત કૃષિ સલાહ મેળવો.",
        'en': "📞 **Farmer Government Schemes & Emergency Helpline:**\n\n- **National Kisan Call Center (Toll-Free):** **1800-180-1551** (Open 6:00 AM - 10:00 PM in 22 languages).\n- **PM-Kisan Samman Nidhi:** ₹6,000/year assistance. Check status at pmkisan.gov.in.\n- **Kisan Credit Card (KCC):** Low-interest agricultural crop loans at 4% effective interest.\n- **Mandi Rates:** Check our live wholesale market prices in the Mandi Rates section below!",
        'es': "📞 **Línea de Asistencia Agrícola:** Llame a su centro de extensión agrícola local para información sobre subsidios y precios de mercado."
      }
    },

    // 10. AI Models & Datasets (प्री-ट्रेन्ड मॉडल्स व डेटासेट्स)
    {
      keywords: ['model', 'pre-trained', 'dataset', 'plantvillage', 'plantdoc', 'weights', 'mobilenet', 'vit', 'onnx', 'tflite'],
      reply: {
        'hi': "🧠 **प्री-ट्रेन्ड मॉडल्स और कृषि डेटासेट्स:**\n- **उपलब्ध मॉडल्स:** मोबाइलनेटV3 (PlantVillage, 98.4% सटीकता), रेसनेट50 (खेतों के प्राकृतिक वातावरण के लिए), और ViT-Agri विज़न ट्रांसफॉर्मर।\n- **प्रमुख डेटासेट्स:** PlantVillage (54,000+ पत्ती छवियां), PlantDoc, और भारतीय कृषि अनुसंधान परिषद (ICAR) डेटासेट।\n- **कस्टम मॉडल:** आप स्कैनर में अपना स्वयं का `.onnx` या `.tflite` मॉडल भी लोड कर सकते हैं!",
        'hinglish': "🧠 **Pre-Trained Models aur Krishi Datasets:**\n- **Models Available:** MobileNetV3 (PlantVillage, 18ms fast speed, 98.4% accuracy), ResNet50 (Field Clutter) aur ViT-Agri Vision Transformer.\n- **Datasets:** PlantVillage (54,000+ photos), PlantDoc aur ICAR India.\n- Aap scanner me apna custom `.onnx` ya `.tflite` model bhi upload kar sakte hain!",
        'pa': "🧠 **ਪ੍ਰੀ-ਟ੍ਰੇਨਡ ਮਾਡਲ ਅਤੇ ਡੇਟਾਸੈੱਟ:** ਮੋਬਾਈਲਨੈੱਟV3 ਅਤੇ PlantVillage ਡੇਟਾਸੈੱਟ ਸਕੈਨਰ ਵਿੱਚ ਉਪਲਬਧ ਹਨ।",
        'mr': "🧠 **मॉडेल्स व डेटासेट्स:** PlantVillage व ICAR डेटासेटवर आधारित मॉडेल उपलब्ध आहेत.",
        'te': "🧠 **AI మోడల్స్ & డేటాసెట్లు:** PlantVillage మరియు మొబైల్ నెట్ మోడల్స్ అందుబాటులో ఉన్నాయి.",
        'ta': "🧠 **AI மாதிரிகள் & தரவுத்தொகுப்புகள்:** PlantVillage மாதிரிகள் நோய்களை கண்டறிய பயன்படுகின்றன.",
        'bn': "🧠 **এআই মডেল ও ডেটাসেট:** মোবাইলনেট ও PlantVillage ডেটাসেট দ্বারা রোগ শনাক্তকরণ করা হয়।",
        'gu': "🧠 **પ્રિ-ટ્રેઇન્ડ મોડેલ્સ અને ડેટાસેટ્સ:** PlantVillage અને મોબાઈલનેટ મોડેલ સ્કેનરમાં ઉપલબ્ધ છે.",
        'en': "🧠 **Pre-Trained Models & Agricultural Datasets Support:**\n- **Available Models:** MobileNetV3 (PlantVillage, 98.4% Acc, 18ms latency), ResNet50 (Field Clutter, 99.1% Acc), and ViT-Agri Vision Transformer (99.6% Acc).\n- **Integrated Datasets:** PlantVillage (54,306 images across 38 classes), PlantDoc (real outdoor field noise), and ICAR-AgriData India (Tropical crops).\n- **Custom Models:** Upload your own `.onnx`, `.tflite`, or TensorFlow.js model weights in the Crop Scanner, or view PyTorch fine-tuning code in the Datasets Hub below!",
        'es': "🧠 **Modelos y Datasets:** MobileNetV3 y ResNet50 entrenados en PlantVillage (54,306 imágenes). Puede cargar modelos personalizados en el escáner."
      }
    }
  ];

  // Default fallback responses in all 10 languages
  const DEFAULT_RESPONSES = {
    'hi': "🌾 **किसान मित्र सहायक:** आपके सवाल के लिए धन्यवाद! अच्छी फसल और पैदावार के लिए:\n1. मिट्टी की जांच करवाकर संतुलित मात्रा में जैविक खाद और NPK उर्वरक डालें।\n2. कीटों से बचाव के लिए पीले चिपचिपे कार्ड और 5ml नीम के तेल का छिड़काव करें।\n3. सुबह या शाम के ठंडे समय ही सिंचाई करें।\n\nआप किसी भी फसल (गेहूं, धान, टमाटर, कपास, आलू) के बारे में बोलकर या लिखकर बेझिझक पूछें!",
    'hinglish': "🌾 **Kisan Mitra Sahayak:** Aapke sawaal ke liye dhanyawad! Achhi fasal aur bumper yield ke liye:\n1. Mitti ki jaanch karwake santulit khad (Urea, DAP, Potash) dalein.\n2. Keedo se bachav ke liye Neem oil (5ml/L) ka spray karein.\n3. Sinchai subah ya shaam ke thande waqt karein.\n\nAap kisi bhi fasal (Gehu, Dhan, Tamatar, Kapas, Aalu) ke rog ya khad ke baare me pooch sakte hain!",
    'pa': "🌾 **ਕਿਸਾਨ ਮਿੱਤਰ ਸਹਾਇਕ:** ਤੁਹਾਡੇ ਸਵਾਲ ਲਈ ਧੰਨਵਾਦ! ਵਧੀਆ ਝਾੜ ਲਈ ਸੰਤੁਲਿਤ ਖਾਦ ਪਾਓ ਅਤੇ ਸਵੇਰ ਵੇਲੇ ਪਾਣੀ ਦਿਓ। ਤੁਸੀਂ ਮਾਈਕ ਦਬਾ ਕੇ ਪੰਜਾਬੀ ਵਿੱਚ ਹੋਰ ਸਵਾਲ ਵੀ ਪੁੱਛ ਸਕਦੇ ਹੋ!",
    'mr': "🌾 **शेतकरी मित्र सहाय्यक:** तुमच्या शेती प्रश्नासाठी धन्यवाद! उत्तम उत्पन्नासाठी संतुलित खतांचा वापर करा आणि कीड नियंत्रणासाठी सेंद्रिय कडुनिंब अर्क वापरा. आणखी काही विचारायचे असल्यास नक्की विचारा!",
    'te': "🌾 **రైతు మిత్ర సహాయకుడు:** మీ ప్రశ్నకు ధన్యవాదాలు! పంట దిగుబడి పెంచడానికి సమతుల్య ఎరువులు వాడండి మరియు పురుగుల నివారణకు వేప నూనె పిచికారీ చేయండి.",
    'ta': "🌾 **விவசாயி உதவியாளர்:** உங்கள் கேள்விக்கு நன்றி! அதிக மகசூல் பெற சரியான நேரத்தில் நீர் மற்றும் உர மேலாண்மை செய்யுங்கள்.",
    'bn': "🌾 **কৃষক বন্ধু সহায়ক:** আপনার প্রশ্নের জন্য ধন্যবাদ! ভালো ফলনের জন্য সুষম সার ও সঠিক সময়ে সেচ দিন।",
    'gu': "🌾 **ખેડૂત મિત્ર સહાયક:** તમારા પ્રશ્ન બદલ આભાર! સારા ઉત્પાદન માટે જમીન ચકાસણી મુજબ ખાતર આપો અને લીમડાના તેલનો છંટકાવ કરો.",
    'en': "🌾 **Farmer Advisory Assistant:** Thank you for your question! For optimal crop health:\n1. Maintain balanced soil testing and NPK organic nutrition.\n2. Practice integrated pest management (IPM) using yellow sticky traps and bio-pesticides (Neem oil).\n3. Water during cooler morning hours.\n\nYou can click the **microphone (🎙️)** to speak or ask about any specific crop (Wheat, Rice, Tomato, Cotton, Potato) in any language!",
    'es': "🌾 **Asistente Agrícola:** ¡Gracias por su consulta! Para un cultivo exitoso mantenga nutrición balanceada y monitoreo constante de plagas. ¡Hable o escriba en cualquier momento!"
  };

  /**
   * Detects if the user is asking to change or speak in a specific language
   */
  function checkLanguageSwitchIntent(text) {
    if (!text) return null;
    const lower = text.toLowerCase().trim();

    if (/\b(hindi|हिन्दी|हिंदी)\b/.test(lower) || /hindi me bolo|speak in hindi|talk in hindi|hindi me batao/.test(lower)) return 'hi';
    if (/\b(hinglish)\b/.test(lower) || /hinglish me bolo|roman hindi/.test(lower)) return 'hinglish';
    if (/\b(punjabi|ਪੰਜਾਬੀ|पंजाबी)\b/.test(lower) || /punjabi vich|speak in punjabi|punjabi me bolo|punjabi daso/.test(lower)) return 'pa';
    if (/\b(marathi|मराठी)\b/.test(lower) || /marathi madhe|speak in marathi|marathi me bolo|marathi sanga/.test(lower)) return 'mr';
    if (/\b(telugu|తెలుగు|तेलुगु)\b/.test(lower) || /telugu lo|speak in telugu|telugu matladu|telugu cheppandi/.test(lower)) return 'te';
    if (/\b(tamil|தமிழ்|तमिल)\b/.test(lower) || /tamil la|speak in tamil|tamil pesunga|tamil sollunga/.test(lower)) return 'ta';
    if (/\b(bengali|বাংলা|बंगाली|bangla)\b/.test(lower) || /bangla te|speak in bengali|bangla bolun/.test(lower)) return 'bn';
    if (/\b(gujarati|ગુજરાતી|गुजराती)\b/.test(lower) || /gujarati ma|speak in gujarati|gujarati kaho/.test(lower)) return 'gu';
    if (/\b(english|अंग्रेजी|ਅੰਗਰੇਜ਼ੀ)\b/.test(lower) || /speak in english|talk in english|english please/.test(lower)) return 'en';
    if (/\b(spanish|español|espanol)\b/.test(lower) || /habla espanol|habla español/.test(lower)) return 'es';

    return null;
  }

  /**
   * Intelligently detects language and conversational style from the text
   */
  function detectLanguage(text) {
    if (!text) return currentLanguage;
    const trimmed = text.trim();

    // 1. Check explicit language switch intent
    const switchTarget = checkLanguageSwitchIntent(trimmed);
    if (switchTarget) return switchTarget;

    // 2. Specific non-Latin scripts
    // Gurmukhi (Punjabi)
    if (/[\u0A00-\u0A7F]/.test(trimmed)) return 'pa';
    // Telugu
    if (/[\u0C00-\u0C7F]/.test(trimmed)) return 'te';
    // Tamil
    if (/[\u0B80-\u0BFF]/.test(trimmed)) return 'ta';
    // Bengali
    if (/[\u0980-\u09FF]/.test(trimmed)) return 'bn';
    // Gujarati
    if (/[\u0A80-\u0AFF]/.test(trimmed)) return 'gu';

    // Devanagari script: Check if Marathi or Hindi
    if (/[\u0900-\u097F]/.test(trimmed)) {
      const marathiTokens = ['आहे', 'करावे', 'पिकावर', 'शेतकरी', 'पाणी', 'लागवड', 'खते', 'करपा', 'फवारणी', 'सांगा', 'उपाय', 'कीड', 'औषध', 'काय', 'कसे', 'भाजीपाला', 'तांबेरा'];
      for (const m of marathiTokens) {
        if (trimmed.includes(m)) return 'mr';
      }
      return 'hi';
    }

    const lower = trimmed.toLowerCase();

    // 3. Romanized Dialect Keywords
    // Roman Punjabi
    const romanPunjabiTokens = ['kanak', 'jhaad', 'kive', 'vadhaiye', 'jhona', 'narma', 'sundi', 'daso', 'tusi', 'sat sri akal', 'paani', 'kheti'];
    let paCount = 0;
    for (const t of romanPunjabiTokens) {
      if (new RegExp('\\b' + t + '\\b', 'i').test(lower)) paCount++;
    }
    if (paCount >= 2) return 'pa';

    // Roman Marathi
    const romanMarathiTokens = ['shetkari', 'pikaver', 'karpa', 'aushadh', 'sanga', 'kiti', 'ahe', 'dyayche', 'tomatola', 'gavhala', 'favarani'];
    let mrCount = 0;
    for (const t of romanMarathiTokens) {
      if (new RegExp('\\b' + t + '\\b', 'i').test(lower)) mrCount++;
    }
    if (mrCount >= 2) return 'mr';

    // Roman Telugu
    const romanTeluguTokens = ['raithu', 'panta', 'tegulu', 'mandhu', 'cheppandi', 'ela', 'vesukovali', 'tamata', 'vari', 'paththi'];
    let teCount = 0;
    for (const t of romanTeluguTokens) {
      if (new RegExp('\\b' + t + '\\b', 'i').test(lower)) teCount++;
    }
    if (teCount >= 2) return 'te';

    // Roman Tamil
    const romanTamilTokens = ['vivasayi', 'thakkali', 'payir', 'marunthu', 'eppadi', 'sollunga', 'nel', 'paruthi', 'noi'];
    let taCount = 0;
    for (const t of romanTamilTokens) {
      if (new RegExp('\\b' + t + '\\b', 'i').test(lower)) taCount++;
    }
    if (taCount >= 2) return 'ta';

    // Roman Gujarati
    const romanGujaratiTokens = ['khedut', 'kheti', 'kem', 'pak', 'aushadh', 'kaho', 'ghau', 'tameta', 'khatar'];
    let guCount = 0;
    for (const t of romanGujaratiTokens) {
      if (new RegExp('\\b' + t + '\\b', 'i').test(lower)) guCount++;
    }
    if (guCount >= 2) return 'gu';

    // Romanized Hinglish (Latin letters but Hindi farming words)
    const hinglishTokens = [
      'kheti', 'kaise', 'kare', 'karein', 'karega', 'rog', 'bimari', 'bimaari', 'pani', 'paani',
      'khad', 'khaad', 'dawa', 'dawai', 'dawaii', 'tamatar', 'gehu', 'gehun', 'dhan', 'dhaan',
      'aalu', 'aaloo', 'keeda', 'kida', 'batao', 'bataye', 'kisan', 'kisaan', 'beej', 'fasal',
      'faslon', 'upchar', 'ilaaj', 'ilaj', 'jhulsa', 'sundee', 'sundi', 'chawal', 'spray', 'namaste',
      'bhai', 'bhaiya', 'patti', 'patte', 'sukhi', 'peeli', 'pili', 'kitna', 'daale', 'dale',
      'bimar', 'upay', 'koshish', 'paudha', 'paudhe', 'mausam', 'barish', 'baat', 'bolo', 'kya',
      'kyu', 'kyun', 'kab', 'kaha', 'kahan', 'accha', 'achha', 'paidawar', 'rakhe', 'rakhein', 'kalle'
    ];
    let hinglishCount = 0;
    for (const token of hinglishTokens) {
      if (new RegExp('\\b' + token + '\\b', 'i').test(lower)) hinglishCount++;
    }
    if (hinglishCount >= 1) return 'hinglish';

    // Spanish words
    const spanishTokens = ['hola', 'como', 'cultivo', 'siembra', 'plaga', 'enfermedad', 'riego', 'trigo', 'tomate', 'papa', 'maiz', 'ayuda', 'abono'];
    for (const st of spanishTokens) {
      if (new RegExp('\\b' + st + '\\b', 'i').test(lower)) return 'es';
    }

    // 4. Default to currently selected dropdown language so preferences are respected
    const dropdownLang = document.getElementById('chatLanguageSelect')?.value;
    if (dropdownLang) return dropdownLang;

    return currentLanguage || 'hi';
  }

  function init() {
    setupRecognitionEngine();
    setupEventListeners();
    setupVoiceModalEvents();
    setupQuickChipsListeners();
    updateQuickChips(currentLanguage);
  }

  /**
   * Initializes the browser SpeechRecognition engine
   */
  function setupRecognitionEngine() {
    try {
      const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRec) {
        console.warn('SpeechRecognition API not available in this browser environment.');
        return;
      }

      recognition = new SpeechRec();
      recognition.continuous = false;
      recognition.interimResults = true;

      const config = LANG_CONFIG[currentLanguage] || LANG_CONFIG['hi'];
      recognition.lang = config.code;

      recognition.onstart = () => {
        isListening = true;
        currentTranscript = '';
        updateUIListeningState(true);
      };

      recognition.onspeechstart = () => {
        const ring = document.querySelector('.voice-pulse-ring .voice-ring-wave');
        if (ring) ring.style.background = 'rgba(34, 197, 94, 0.4)';
      };

      recognition.onresult = (event) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            final += transcript;
          } else {
            interim += transcript;
          }
        }

        const combined = (final || interim).trim();
        currentTranscript = combined;

        // Update live transcript in modal
        const liveText = document.getElementById('transcriptLiveText');
        const placeholder = document.getElementById('transcriptPlaceholder');
        if (liveText && placeholder) {
          if (combined) {
            placeholder.style.display = 'none';
            liveText.textContent = combined;
            liveText.classList.add('active');
          }
        }

        // Also update chat input in background
        const chatInput = document.getElementById('chatInput');
        if (chatInput && combined) {
          chatInput.value = combined;
        }
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition status:', event.error);
        if (event.error === 'not-allowed') {
          showVoiceErrorTip("⚠️ Microphone permission was blocked. Please click the lock icon in your browser URL bar and allow Microphone access.");
        } else if (event.error === 'network') {
          showVoiceErrorTip("🌐 Speech recognition service could not be reached. Tap any of the voice question buttons below to ask instantly!");
        } else if (event.error === 'no-speech') {
          const placeholder = document.getElementById('transcriptPlaceholder');
          if (placeholder) {
            placeholder.textContent = "Didn't hear any speech. Tap mic and speak clearly near your microphone.";
          }
        }
      };

      recognition.onend = () => {
        isListening = false;
        updateUIListeningState(false);

        // If we captured valid voice input, auto submit after short pause
        if (currentTranscript && currentTranscript.trim().length > 1) {
          setTimeout(() => {
            closeVoiceModal();
            const chatInput = document.getElementById('chatInput');
            if (chatInput) chatInput.value = currentTranscript;
            submitUserMessage();
            currentTranscript = '';
          }, 450);
        }
      };
    } catch (e) {
      console.warn('SpeechRecognition init error:', e);
    }
  }

  /**
   * Opens the Voice Assistant Modal tuned to the specified or active language
   */
  function openVoiceModal(langKey) {
    const targetLang = langKey || currentLanguage || 'hi';
    setLanguage(targetLang);

    const overlay = document.getElementById('voiceModalOverlay');
    if (overlay) overlay.classList.add('active');

    // Reset transcription display
    const liveText = document.getElementById('transcriptLiveText');
    const placeholder = document.getElementById('transcriptPlaceholder');
    if (liveText && placeholder) {
      liveText.textContent = '';
      liveText.classList.remove('active');
      placeholder.style.display = 'block';
    }

    // Render quick voice suggestion chips in modal
    renderModalVoiceSuggestions(targetLang);

    // Launch speech recognition
    startVoiceRecognition(targetLang);
  }

  function closeVoiceModal() {
    stopVoiceRecognition();
    const overlay = document.getElementById('voiceModalOverlay');
    if (overlay) overlay.classList.remove('active');
  }

  function startVoiceRecognition(langKey) {
    const config = LANG_CONFIG[langKey] || LANG_CONFIG['hi'];

    // Update modal header text
    const title = document.getElementById('voiceModalStatusTitle');
    const sub = document.getElementById('voiceModalStatusSub');
    if (title) title.textContent = config.statusTitle;
    if (sub) sub.textContent = config.statusSub;

    // Update listening banner text
    const listeningBannerText = document.getElementById('voiceListeningText');
    if (listeningBannerText) {
      listeningBannerText.textContent = `🔴 Listening in ${config.name}... Speak now!`;
    }

    if (!recognition) {
      setupRecognitionEngine();
    }

    if (recognition) {
      try {
        recognition.lang = config.code;
        recognition.start();
        updateUIListeningState(true);
      } catch (err) {
        // Recognition might already be running
        console.log('Recognition start note:', err.message);
        updateUIListeningState(true);
      }
    } else {
      showVoiceErrorTip("🎙️ Speech Recognition is not supported by your current browser. You can tap any of the voice questions below!");
    }
  }

  function stopVoiceRecognition() {
    if (recognition) {
      try { recognition.stop(); } catch (e) {}
    }
    isListening = false;
    updateUIListeningState(false);
  }

  function updateUIListeningState(active) {
    const micBtn = document.getElementById('chatMicBtn');
    const banner = document.getElementById('voiceListeningBanner');
    const modalMic = document.getElementById('voiceModalMicToggle');

    if (micBtn) {
      if (active) micBtn.classList.add('listening');
      else micBtn.classList.remove('listening');
    }

    if (banner) {
      if (active) banner.classList.add('active');
      else banner.classList.remove('active');
    }

    if (modalMic) {
      if (active) modalMic.classList.add('active');
      else modalMic.classList.remove('active');
    }
  }

  function showVoiceErrorTip(message) {
    const placeholder = document.getElementById('transcriptPlaceholder');
    if (placeholder) {
      placeholder.style.display = 'block';
      placeholder.style.color = '#dc2626';
      placeholder.textContent = message;
    }
  }

  /**
   * Switches the active language across chat, dropdowns, voice pills, and placeholders
   */
  function setLanguage(langKey) {
    if (!LANG_CONFIG[langKey]) langKey = 'hi';
    currentLanguage = langKey;

    // Update chat select element
    const chatSelect = document.getElementById('chatLanguageSelect');
    if (chatSelect && chatSelect.value !== langKey) {
      chatSelect.value = langKey;
    }

    // Update global nav label
    const globalLabel = document.getElementById('currentLangLabel');
    if (globalLabel) {
      globalLabel.textContent = LANG_CONFIG[langKey].name.split(' ')[0];
    }

    // Update voice modal language pills
    const pills = document.querySelectorAll('.voice-lang-pill');
    pills.forEach(p => {
      if (p.getAttribute('data-lang') === langKey) p.classList.add('active');
      else p.classList.remove('active');
    });

    // Update input placeholder
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
      chatInput.placeholder = LANG_CONFIG[langKey].placeholder;
    }

    // Update quick chips in chat bar
    updateQuickChips(langKey);

    // Update recognition language if active
    if (recognition) {
      recognition.lang = LANG_CONFIG[langKey].code;
    }
  }

  function renderModalVoiceSuggestions(langKey) {
    const container = document.getElementById('voiceSuggestionsChips');
    if (!container) return;
    const config = LANG_CONFIG[langKey] || LANG_CONFIG['hi'];

    container.innerHTML = config.suggestions.map(item => `
      <button class="voice-chip-btn" data-query="${escapeHtml(item.query)}">
        🎙️ ${escapeHtml(item.text)}
      </button>
    `).join('');

    // Attach click events
    container.querySelectorAll('.voice-chip-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const query = btn.getAttribute('data-query');
        closeVoiceModal();
        sendExternalQuery(query);
      });
    });
  }

  function updateQuickChips(langKey) {
    const container = document.getElementById('chatQuickPromptsBar');
    if (!container) return;
    const config = LANG_CONFIG[langKey] || LANG_CONFIG['hi'];

    container.innerHTML = config.suggestions.map(item => `
      <button class="quick-chip" data-query="${escapeHtml(item.query)}">
        ${escapeHtml(item.text)}
      </button>
    `).join('');

    setupQuickChipsListeners();
  }

  function setupQuickChipsListeners() {
    const chips = document.querySelectorAll('.quick-chip');
    chips.forEach(chip => {
      chip.onclick = () => {
        const query = chip.getAttribute('data-query') || chip.textContent;
        sendExternalQuery(query);
      };
    });
  }

  function setupEventListeners() {
    // Microphone button in chat input bar -> Opens Voice Assistant Modal
    const micBtn = document.getElementById('chatMicBtn');
    if (micBtn) {
      micBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openVoiceModal(currentLanguage);
      });
    }

    // Quick Voice button in top navigation -> Scrolls and opens Voice Modal
    const quickVoiceBtn = document.getElementById('quickVoiceNavBtn');
    if (quickVoiceBtn) {
      quickVoiceBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const chatbotSection = document.getElementById('chatbot');
        if (chatbotSection) chatbotSection.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
          openVoiceModal(currentLanguage);
        }, 350);
      });
    }

    // Send button
    const sendBtn = document.getElementById('chatSendBtn');
    if (sendBtn) {
      sendBtn.addEventListener('click', submitUserMessage);
    }

    // Enter key submission
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
      chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          submitUserMessage();
        }
      });
    }

    // Chat Language Select dropdown change
    const langSelect = document.getElementById('chatLanguageSelect');
    if (langSelect) {
      langSelect.addEventListener('change', (e) => {
        const selected = e.target.value;
        setLanguage(selected);
        greetInLanguage(selected);
      });
    }

    // Sound toggle
    const audioBtn = document.getElementById('chatSoundToggle');
    if (audioBtn) {
      audioBtn.addEventListener('click', () => {
        isAudioEnabled = !isAudioEnabled;
        audioBtn.textContent = isAudioEnabled ? '🔊' : '🔇';
        audioBtn.title = isAudioEnabled ? 'Voice readout enabled' : 'Voice readout muted';
      });
    }
  }

  function setupVoiceModalEvents() {
    // Modal close button
    const closeBtn = document.getElementById('voiceModalCloseBtn');
    if (closeBtn) closeBtn.addEventListener('click', closeVoiceModal);

    // Modal cancel button
    const cancelBtn = document.getElementById('voiceModalCancelBtn');
    if (cancelBtn) cancelBtn.addEventListener('click', closeVoiceModal);

    // Modal send button
    const sendBtn = document.getElementById('voiceModalSendBtn');
    if (sendBtn) {
      sendBtn.addEventListener('click', () => {
        closeVoiceModal();
        if (currentTranscript && currentTranscript.trim().length > 0) {
          const chatInput = document.getElementById('chatInput');
          if (chatInput) chatInput.value = currentTranscript;
          submitUserMessage();
          currentTranscript = '';
        }
      });
    }

    // Modal microphone toggle button
    const modalMic = document.getElementById('voiceModalMicToggle');
    if (modalMic) {
      modalMic.addEventListener('click', () => {
        if (isListening) {
          stopVoiceRecognition();
        } else {
          startVoiceRecognition(currentLanguage);
        }
      });
    }

    // Voice Modal Language Switcher Pills
    const pills = document.querySelectorAll('.voice-lang-pill');
    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        const lang = pill.getAttribute('data-lang');
        setLanguage(lang);
        renderModalVoiceSuggestions(lang);
        startVoiceRecognition(lang);
      });
    });

    // Close on overlay backdrop click
    const overlay = document.getElementById('voiceModalOverlay');
    if (overlay) {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeVoiceModal();
      });
    }
  }

  function greetInLanguage(lang) {
    const greetings = {
      'hi': "🌾 **राम-राम किसान भाई! नमस्ते!** 🙏\n\nमैं आपका एआई कृषि सलाहकार हूँ। आप मुझसे बोलकर या लिखकर अपनी भाषा में सवाल पूछ सकते हैं!",
      'hinglish': "🌾 **Ram Ram Kisan Bhai!** 🙏\n\nMain aapka AI Kheti Sahayak hoon. Boliye ya type karein kisi bhi fasal ke baare me!",
      'pa': "🌾 **ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਕਿਸਾਨ ਵੀਰੋ!** 🙏\n\nਮੈਂ ਤੁਹਾਡਾ ਏਆਈ ਖੇਤੀਬਾੜੀ ਸਹਾਇਕ ਹਾਂ। ਤੁਸੀਂ ਮੇਰੇ ਨਾਲ ਪੰਜਾਬੀ ਵਿੱਚ ਬੋਲ ਕੇ ਜਾਂ ਲਿਖ ਕੇ ਫਸਲਾਂ ਬਾਰੇ ਪੁੱਛ ਸਕਦੇ ਹੋ!",
      'mr': "🌾 **राम राम शेतकरी मित्रांनो!** 🙏\n\nमी तुमचा डिजिटल कृषी सल्लागार आहे. पिकांचे रोग, खते व शेतीविषयी मराठीत काहीही विचारा!",
      'te': "🌾 **నమస్కారం రైతు సోదరులారా!** 🙏\n\nపంటల సాగు మరియు వ్యాధుల నివారణ గురించి అడగండి.",
      'ta': "🌾 **வணக்கம் விவசாய நண்பரே!** 🙏\n\nபயிர் பாதுகாப்பு மற்றும் சாகுபடி முறைகள் பற்றி கேளுங்கள்.",
      'bn': "🌾 **নমস্কার কৃষক ভাই!** 🙏\n\nফসলের রোগবালাই ও চাষের পদ্ধতি সম্পর্কে জানতে প্রশ্ন করুন।",
      'gu': "🌾 **રામ રામ ખેડૂત મિત્રો!** 🙏\n\nતમારા પાક, ખાતર અને દવાઓ વિશે ગુજરાતીમાં પૂછો.",
      'en': "🌾 **Hello Farmer!** 🙏\n\nI am your AI Agriculture Assistant. You can speak into the microphone or write to me in any language!",
      'es': "🌾 **¡Hola Agricultor!** 🙏\n\nSoy su Asistente Agrícola IA. Puede hablar o escribir en español sobre sus cultivos."
    };

    const text = greetings[lang] || greetings['hi'];
    addMessage('bot', text);
  }

  function submitUserMessage() {
    const chatInput = document.getElementById('chatInput');
    if (!chatInput) return;
    const text = chatInput.value.trim();
    if (!text) return;

    // Display user message in chat
    addMessage('user', text);
    chatInput.value = '';

    // Show simulated AI thinking and produce response in detected language
    simulateTyping(() => {
      const response = generateAIResponse(text);
      addMessage('bot', response);
      if (isAudioEnabled) {
        speakText(response);
      }
    });
  }

  function sendExternalQuery(queryText) {
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
      chatInput.value = queryText;
      submitUserMessage();
    }
  }

  function extractCityFromQuery(query) {
    const stopWords = [
      'weather', 'mausam', 'havaman', 'abohawa', 'vatavaranam', 'vanilai', 'climate',
      'kaisa', 'kaise', 'hai', 'hoga', 'rahega', 'batao', 'bataye', 'daso', 'sanga', 'cheppandi',
      'sollunga', 'bolun', 'kaho', 'in', 'of', 'for', 'today', 'tomorrow', 'live', 'farm',
      'khet', 'me', 'mein', 'par', 'pe', 'ka', 'ki', 'ke', 'da', 'di', 'de', 'cha', 'chi',
      'what', 'is', 'the', 'how', 'tell', 'show', 'check', 'spray', 'sinchai', 'pani', 'barish',
      'please', 'city', 'location', 'area', 'district'
    ];
    const words = query.trim().split(/\s+/);
    const cleaned = words.filter(w => {
      const clean = w.toLowerCase().replace(/[^a-zA-Z\u0900-\u0D7F]/g, '');
      return clean.length > 2 && !stopWords.includes(clean);
    });
    if (cleaned.length > 0) {
      return cleaned.join(' ');
    }
    return null;
  }

  function formatWeatherReply(cityName, wData, lang) {
    if (!wData) {
      return `🌦️ **${cityName}** का मौसम लोड हो रहा है... ऊपर मौसम बॉक्स में 7-दिवसीय पूर्वानुमान देखें!`;
    }

    const { name, temp, condition, icon, humidity, wind, rainChance, sprayStatus, sprayNote, irrigationStatus, diseaseAlert } = wData;

    if (lang === 'pa') {
      return `🌦️ **${name} ਦਾ ਲਾਈਵ ਖੇਤੀ ਮੌਸਮ:** ${icon} **${temp}°C** (${condition})\n\n- 💧 ਨਮੀ: **${humidity}%** | ਹਵਾ: **${wind}** | ਮੀਂਹ ਸੰਭਾਵਨਾ: **${rainChance}%**\n- 🚜 **ਸਪਰੇਅ ਸਲਾਹ:** **${sprayStatus}** - ${sprayNote}\n- 💧 **ਸਿੰਚਾਈ:** ${irrigationStatus}\n- 🔬 **ਰੋਗ ਚੇਤਾਵਨੀ:** ${diseaseAlert}\n\n💡 *ਉੱਪਰ ਮੌਸਮ ਬਾਕਸ ਵਿੱਚ 7 ਦਿਨਾਂ ਦਾ ਵਿਸਤ੍ਰਿਤ ਪੂਰਵ-ਅਨੁਮਾਨ ਦੇਖੋ! ਤੁਸੀਂ '⚙️ Customize Weather' ਦਬਾ ਕੇ ਆਪਣੇ ਖੇਤ ਦਾ ਤਾਪਮਾਨ ਵੀ ਸੈੱਟ ਕਰ ਸਕਦੇ ਹੋ।*`;
    }
    if (lang === 'mr') {
      return `🌦️ **${name} चे थेट कृषी हवामान:** ${icon} **${temp}°C** (${condition})\n\n- 💧 आर्द्रता: **${humidity}%** | वारा: **${wind}** | पाऊस शक्यता: **${rainChance}%**\n- 🚜 **फवारणी सल्ला:** **${sprayStatus}** - ${sprayNote}\n- 💧 **पाणी व्यवस्थापन:** ${irrigationStatus}\n- 🔬 **रोग धोका:** ${diseaseAlert}\n\n💡 *वर दिलेल्या हवामान सेक्शनमध्ये ७ दिवसांचा सविस्तर अंदाज पहा! '⚙️ Customize Weather' ने स्वतः हवामान बदलून पाहू शकता.*`;
    }
    if (lang === 'te') {
      return `🌦️ **${name} ప్రత్యక్ష వ్యవసాయ వాతావరణం:** ${icon} **${temp}°C** (${condition})\n\n- 💧 తేమ: **${humidity}%** | గాలి: **${wind}** | వర్ష సూచన: **${rainChance}%**\n- 🚜 **పిచికారీ సలహా:** **${sprayStatus}**\n- 💧 **నీటి యాజమాన్యం:** ${irrigationStatus}\n- 🔬 **తెగులు హెచ్చరిక:** ${diseaseAlert}\n\n💡 *పై వాతావరణ విభాగంలో 7 రోజుల వివరాలు చూడండి!*`;
    }
    if (lang === 'ta') {
      return `🌦️ **${name} நேரடி விவசாய வானிலை:** ${icon} **${temp}°C** (${condition})\n\n- 💧 ஈரப்பதம்: **${humidity}%** | காற்று: **${wind}** | மழை வாய்ப்பு: **${rainChance}%**\n- 🚜 **தெளிப்பு ஆலோசனை:** **${sprayStatus}**\n- 💧 **பாசனம்:** ${irrigationStatus}\n\n💡 *மேலே உள்ள வானிலை பகுதியில் 7 நாள் முன்னறிவிப்பை பாருங்கள்!*`;
    }
    if (lang === 'bn') {
      return `🌦️ **${name} এর লাইভ কৃষি আবহাওয়া:** ${icon} **${temp}°C** (${condition})\n\n- 💧 আর্দ্রতা: **${humidity}%** | বাতাস: **${wind}** | বৃষ্টির সম্ভাবনা: **${rainChance}%**\n- 🚜 **স্প্রে পরামর্শ:** **${sprayStatus}** - ${sprayNote}\n- 💧 **সেচ পরামর্শ:** ${irrigationStatus}\n\n💡 *উপরে আবহাওয়া বক্সে ৭ দিনের বিস্তারিত তথ্য দেখুন!*`;
    }
    if (lang === 'gu') {
      return `🌦️ **${name} નું લાઈવ કૃષિ હવામાન:** ${icon} **${temp}°C** (${condition})\n\n- 💧 ભેજ: **${humidity}%** | પવન: **${wind}** | વરસાદ સંભાવના: **${rainChance}%**\n- 🚜 **છંટકાવ સલાહ:** **${sprayStatus}** - ${sprayNote}\n- 💧 **પિયત:** ${irrigationStatus}\n\n💡 *ઉપર હવામાન બોક્સમાં ૭ દિવસની આગાહી જુઓ! '⚙️ Customize Weather' દબાવીને તમારા ખેતરનું હવામાન પણ સેટ કરી શકો છો.*`;
    }
    if (lang === 'en') {
      return `🌦️ **Live Agricultural Weather for ${name}:** ${icon} **${temp}°C** (${condition})\n\n- 💧 Humidity: **${humidity}%** | Wind: **${wind}** | Rain Probability: **${rainChance}%**\n- 🚜 **Field Spraying:** **${sprayStatus}** - ${sprayNote}\n- 💧 **Irrigation:** **${irrigationStatus}**\n- 🔬 **Disease Risk:** **${diseaseAlert}**\n\n💡 *The full 7-day microclimate forecast is updated above. You can also click '⚙️ Customize Weather' to simulate custom temperature and rain for your farm!*`;
    }
    if (lang === 'hinglish') {
      return `🌦️ **${name} ka Live Agricultural Mausam:** ${icon} **${temp}°C** (${condition})\n\n- 💧 Humidity: **${humidity}%** | Wind: **${wind}** | Rain Chance: **${rainChance}%**\n- 🚜 **Spray Window:** **${sprayStatus}** - ${sprayNote}\n- 💧 **Sinchai:** **${irrigationStatus}**\n- 🔬 **Disease Alert:** **${diseaseAlert}**\n\n💡 *Upar Mausam section me 7-day forecast load ho gaya hai. Aap '⚙️ Customize Weather' daba kar apne khet ka custom weather bhi test kar sakte hain!*`;
    }

    // Default Hindi
    return `🌦️ **${name} का लाइव कृषि मौसम:** ${icon} **${temp}°C** (${condition})\n\n- 💧 आर्द्रता (Humidity): **${humidity}%** | हवा: **${wind}** | बारिश संभावना: **${rainChance}%**\n- 🚜 **स्प्रे परामर्श:** **${sprayStatus}** - ${sprayNote}\n- 💧 **सिंचाई परामर्श:** **${irrigationStatus}**\n- 🔬 **रोग अलर्ट:** **${diseaseAlert}**\n\n💡 *ऊपर मौसम बॉक्स में 7-दिवसीय विस्तृत पूर्वानुमान लोड हो चुका है। आप '⚙️ Customize Weather' बटन दबाकर अपने खेत का तापमान और बारिश खुद भी सेट कर सकते हैं!*`;
  }

  /**
   * Intelligently selects or crafts the response in the user's detected language and chatting style
   */
  function generateAIResponse(query) {
    const lower = query.toLowerCase();

    // 1. Check if user asked to change/talk in a language
    const explicitLangSwitch = checkLanguageSwitchIntent(query);
    if (explicitLangSwitch) {
      setLanguage(explicitLangSwitch);
      const switchAcks = {
        'hi': "🌾 **जी किसान भाई! राम-राम!** 🙏 अब मैं आपसे **हिन्दी** में बात करूँगा। बताइए, आपकी फसल में क्या समस्या है या किस फसल के बारे में जानना चाहते हैं?",
        'hinglish': "🌾 **Haan bilkul Kisan Bhai! Ram Ram!** 🙏 Ab hum **Hinglish** me baat karenge. Boliye, aapko kaun si fasal ya kheti ke baare me janna hai?",
        'pa': "🌾 **ਹਾਂਜੀ ਵੀਰ ਜੀ! ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ!** 🙏 ਹੁਣ ਅਸੀਂ **ਪੰਜਾਬੀ** ਵਿੱਚ ਗੱਲਬਾਤ ਕਰਾਂਗੇ। ਦੱਸੋ ਜੀ, ਤੁਹਾਡੀ ਕਣਕ, ਝੋਨੇ ਜਾਂ ਹੋਰ ਫਸਲ ਬਾਰੇ ਕੀ ਜਾਣਕਾਰੀ ਚਾਹੀਦੀ ਹੈ?",
        'mr': "🌾 **होय शेतकरी मित्रांनो! राम राम!** 🙏 आता आपण **मराठीत** बोलूया. सांगा, आपल्या पिकाविषयी किंवा शेतीविषयी काय मदत हवी आहे?",
        'te': "🌾 **అవును రైతు సోదరా! నమస్కారం!** 🙏 ఇకపై మనం **తెలుగులోనే** మాట్లాడదాం. మీ పంట సమస్య ఏమిటో చెప్పండి?",
        'ta': "🌾 **ஆம் விவசாய நண்பரே! வணக்கம்!** 🙏 இனி **தமிழில்** பேசுவோம். உங்கள் பயிர் பற்றி என்ன தெரிந்து கொள்ள வேண்டும்?",
        'bn': "🌾 **হ্যাঁ কৃষক ভাই! নমস্কার!** 🙏 এখন থেকে **বাংলায়** কথা হবে। আপনার ফসলের বিষয়ে কি জানতে চান বলুন?",
        'gu': "🌾 **હા ખેડૂત મિત્ર! રામ રામ!** 🙏 હવે આપણે **ગુજરાતીમાં** વાત કરીશું. તમારા પાક વિશે શું માહિતી જોઈએ છે કહો?",
        'en': "🌾 **Certainly Farmer! Hello!** 🙏 Switching to **English**. How may I assist with your crops, weather, or pest management today?",
        'es': "🌾 **¡Por supuesto agricultor!** 🙏 Ahora conversaremos en **español**. ¿En qué puedo ayudarle hoy con sus cultivos?"
      };
      return switchAcks[explicitLangSwitch] || switchAcks['hi'];
    }

    // 2. Detect language based on script, tokens, or active preference
    const detectedLang = detectLanguage(query);

    // Sync dropdown with detected language so everything stays aligned
    setLanguage(detectedLang);

    // 3. Check if query is asking for weather of ANY city, village, or state
    const weatherWords = ['weather', 'mausam', 'havaman', 'abohawa', 'vatavaranam', 'vanilai', 'climate', 'barish', 'rain', 'tapman', 'temperature'];
    const isWeatherQuery = weatherWords.some(w => lower.includes(w));
    if (isWeatherQuery) {
      const cityFound = extractCityFromQuery(query);
      if (cityFound && window.WeatherModule) {
        window.WeatherModule.searchLocation(cityFound);
        const wData = window.WeatherModule.getCurrentWeatherData();
        return formatWeatherReply(cityFound, wData, detectedLang);
      }
    }

    // 4. Match against agricultural knowledge base
    for (const item of KNOWLEDGE_RESPONSES) {
      for (const kw of item.keywords) {
        if (lower.includes(kw)) {
          if (item.reply[detectedLang]) {
            return item.reply[detectedLang];
          }
          if (detectedLang === 'hinglish' && item.reply['hi']) {
            return item.reply['hi'];
          }
          return item.reply['hi'] || item.reply['en'];
        }
      }
    }

    // 4. Fallback response in user's detected language and chatting style
    return DEFAULT_RESPONSES[detectedLang] || DEFAULT_RESPONSES['hi'];
  }

  function addMessage(sender, text) {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;

    const row = document.createElement('div');
    row.className = `message-row ${sender}`;
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (sender === 'bot') {
      row.innerHTML = `
        <div class="msg-avatar">
          <img src="assets/farmer_portrait.jpg" alt="AI Agri-Assistant">
        </div>
        <div class="msg-bubble">
          <div class="msg-text">${formatMarkdown(text)}</div>
          <div class="msg-footer">
            <span>${timeStr}</span>
            <button class="tts-btn" onclick="ChatbotModule.speakRaw('${escapeForTTS(text)}')">
              🔊 Listen / सुनें
            </button>
          </div>
        </div>
      `;
    } else {
      row.innerHTML = `
        <div class="msg-bubble">
          <div class="msg-text">${escapeHtml(text)}</div>
          <div class="msg-footer">
            <span>${timeStr}</span>
          </div>
        </div>
      `;
    }

    chatMessages.appendChild(row);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function simulateTyping(callback) {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) {
      callback();
      return;
    }

    const typingRow = document.createElement('div');
    typingRow.id = 'botTypingIndicator';
    typingRow.className = 'message-row bot';
    typingRow.innerHTML = `
      <div class="msg-avatar">
        <img src="assets/farmer_portrait.jpg" alt="AI Agri-Assistant">
      </div>
      <div class="msg-bubble" style="padding: 0.75rem 1.25rem;">
        <span style="color: #64748b; font-size: 0.85rem; font-style: italic;">🌾 Kisan-AI is preparing advice in your language...</span>
      </div>
    `;
    chatMessages.appendChild(typingRow);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    setTimeout(() => {
      const el = document.getElementById('botTypingIndicator');
      if (el) el.remove();
      callback();
    }, 450);
  }

  // Text-To-Speech Synthesis with matching language voice
  function speakText(markdownText) {
    if (!window.speechSynthesis) return;

    try {
      window.speechSynthesis.cancel();

      // Clean markdown tags
      const plainText = markdownText
        .replace(/[*_#`~>]/g, '')
        .replace(/•/g, '')
        .replace(/\n+/g, ' ');

      const utterance = new SpeechSynthesisUtterance(plainText);
      const config = LANG_CONFIG[currentLanguage] || LANG_CONFIG['hi'];
      utterance.lang = config.synthLang;
      utterance.rate = 0.95;
      utterance.pitch = 1.0;

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('SpeechSynthesis error:', e);
    }
  }

  function speakRaw(text) {
    try {
      speakText(decodeURIComponent(text));
    } catch (e) {
      speakText(text);
    }
  }

  function formatMarkdown(text) {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');
  }

  function escapeHtml(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  }

  function escapeForTTS(str) {
    return encodeURIComponent(str);
  }

  return {
    init,
    sendExternalQuery,
    speakRaw,
    greetInLanguage,
    submitUserMessage,
    openVoiceModal,
    closeVoiceModal,
    setLanguage,
    detectLanguage
  };
})();

// Attach explicitly to window for global and onclick access
window.ChatbotModule = ChatbotModule;

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => window.ChatbotModule.init());
} else {
  window.ChatbotModule.init();
}
