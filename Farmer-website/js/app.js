/**
 * AgriMitra AI - Main Application Coordinator & Multilingual Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all sub-modules
  if (window.WeatherModule) window.WeatherModule.init();
  if (window.ScannerModule) window.ScannerModule.init();
  if (window.ChatbotModule) window.ChatbotModule.init();
  if (window.FarmingGuideModule) window.FarmingGuideModule.init();
  if (window.ModelsDatasetsModule) window.ModelsDatasetsModule.init();

  setupGlobalLanguageSelector();
  setupMobileNav();
  setupAccessibilityControls();
});

// Multilingual UI Translations Dictionary
const UI_TRANSLATIONS = {
  'en': {
    brandTag: 'Empowering Every Farmer',
    navWeather: 'Upcoming Weather',
    navScanner: 'Crop AI Scanner',
    navChatbot: 'Farmers AI-Chatbot',
    navGuides: 'Farming Blueprints',
    navMandi: 'Mandi Rates',
    heroKicker: '🌾 Certified Smart Agricultural Intelligence Portal',
    heroTitle: 'Smart Farming for <span class="gradient-text">Small & Large Farmers</span>',
    heroDesc: 'Plan according to upcoming microclimate weather forecasts, scan and diagnose crop diseases with instant treatment solutions, and consult your multilingual Voice & Text AI Assistant in any language.',
    heroCtaScan: '📸 Scan Crop Disease',
    heroCtaWeather: '🌦️ Check Weather Advisory',
    heroCtaChat: '🎙️ Speak to Agri-AI',
    scanHeading: 'AI Crop Disease Scanner & Pathology',
    scanSub: 'Upload or drop any crop foliage image. Our agronomic neural net scans leaf tissue, detects pathogens, and prescribes organic & chemical cures.',
    weatherHeading: 'Upcoming Weather & Microclimate Advisory',
    weatherSub: 'Precision 7-day agricultural forecasts tailored for spraying, irrigation timing, and fungal risk prevention.',
    chatHeading: 'Farmers Multilingual AI-Chatbot',
    chatSub: 'Ask anything by voice or text in any language. Learn how to plant any crop, diagnose issues, and get verified solutions.'
  },
  'hi': {
    brandTag: 'हर किसान की समृद्धि का साथी',
    navWeather: 'मौसम पूर्वानुमान',
    navScanner: 'फसल रोग स्कैनर',
    navChatbot: 'किसान एआई चैटबॉट',
    navGuides: 'खेती मार्गदर्शिका',
    navMandi: 'मंडी भाव',
    heroKicker: '🌾 प्रमाणित स्मार्ट कृषि एवं किसान पोर्टल',
    heroTitle: 'छोटे और बड़े किसानों के लिए <span class="gradient-text">स्मार्ट आधुनिक खेती</span>',
    heroDesc: 'आने वाले मौसम के अनुसार खेती करें, फसल की पत्तियों की फोटो स्कैन करके रोग का तुरंत इलाज पाएं और किसी भी भाषा में बोलकर या लिखकर एआई से खेती की पूरी जानकारी लें।',
    heroCtaScan: '📸 फसल रोग स्कैन करें',
    heroCtaWeather: '🌦️ मौसम परामर्श देखें',
    heroCtaChat: '🎙️ एआई से बोलकर पूछें',
    scanHeading: 'एआई फसल रोग स्कैनर एवं निदान',
    scanSub: 'किसी भी फसल की पत्ती की फोटो अपलोड करें। हमारा एआई स्कैनर रोग पहचानकर जैविक और रासायनिक उपचार बताएगा।',
    weatherHeading: 'आगामी मौसम एवं कृषि परामर्श',
    weatherSub: 'छिड़काव, सिंचाई और फफूंद से बचाव के लिए 7 दिनों का सटीक मौसम पूर्वानुमान।',
    chatHeading: 'किसान बहुभाषी एआई चैटबॉट व वॉइस असिस्टेंट',
    chatSub: 'किसी भी भाषा में बोलकर या लिखकर पूछें। किसी भी फसल की बुवाई, रोग निवारण और खाद प्रबंधन की पूरी जानकारी पाएं।'
  },
  'pa': {
    brandTag: 'ਹਰ ਕਿਸਾਨ ਦੀ ਤਰੱਕੀ ਦਾ ਸਾਥੀ',
    navWeather: 'ਮੌਸਮ ਜਾਣਕਾਰੀ',
    navScanner: 'ਫਸਲ ਰੋਗ ਸਕੈਨਰ',
    navChatbot: 'ਕਿਸਾਨ ਏਆਈ ਚੈਟਬੋਟ',
    navGuides: 'ਖੇਤੀਬਾੜੀ ਗਾਈਡ',
    navMandi: 'ਮੰਡੀ ਭਾਅ',
    heroKicker: '🌾 ਸਮਾਰਟ ਖੇਤੀਬਾੜੀ ਅਤੇ ਕਿਸਾਨ ਪੋਰਟਲ',
    heroTitle: 'ਕਿਸਾਨਾਂ ਲਈ <span class="gradient-text">ਸਮਾਰਟ ਆਧੁਨਿਕ ਖੇਤੀ</span>',
    heroDesc: 'ਆਉਣ ਵਾਲੇ ਮੌਸਮ ਅਨੁਸਾਰ ਖੇਤੀ ਕਰੋ, ਪੱਤੇ ਦੀ ਫੋਟੋ ਸਕੈਨ ਕਰਕੇ ਬਿਮਾਰੀ ਦਾ ਹੱਲ ਲੱਭੋ ਅਤੇ ਪੰਜਾਬੀ ਵਿੱਚ ਬੋਲ ਕੇ ਏਆਈ ਸਹਾਇਕ ਤੋਂ ਸਲਾਹ ਲਵੋ।',
    heroCtaScan: '📸 ਬਿਮਾਰੀ ਸਕੈਨ ਕਰੋ',
    heroCtaWeather: '🌦️ ਮੌਸਮ ਦੇਖੋ',
    heroCtaChat: '🎙️ ਬੋਲ ਕੇ ਪੁੱਛੋ',
    scanHeading: 'ਏਆਈ ਫਸਲ ਰੋਗ ਸਕੈਨਰ',
    scanSub: 'ਫਸਲ ਦੀ ਫੋਟੋ ਅੱਪਲੋਡ ਕਰੋ। ਸਾਡਾ ਸਿਸਟਮ ਬਿਮਾਰੀ ਸਕੈਨ ਕਰਕੇ ਦੇਸੀ ਅਤੇ ਰਸਾਇਣਕ ਹੱਲ ਦੱਸੇਗਾ।',
    weatherHeading: 'ਆਗਾਮੀ ਮੌਸਮ ਅਤੇ ਖੇਤੀਬਾੜੀ ਸਲਾਹ',
    weatherSub: 'ਸਪਰੇਅ ਅਤੇ ਪਾਣੀ ਦੇਣ ਲਈ 7 ਦਿਨਾਂ ਦਾ ਸਹੀ ਮੌਸਮ ਅਨੁਮਾਨ।',
    chatHeading: 'ਕਿਸਾਨ ਬਹੁਭਾਸ਼ਾਈ ਏਆਈ ਚੈਟਬੋਟ',
    chatSub: 'ਪੰਜਾਬੀ ਵਿੱਚ ਬੋਲ ਕੇ ਜਾਂ ਲਿਖ ਕੇ ਪੁੱਛੋ। ਕਿਸੇ ਵੀ ਫਸਲ ਦੀ ਬਿਜਾਈ ਅਤੇ ਦੇਖਭਾਲ ਬਾਰੇ ਜਾਣੋ।'
  },
  'mr': {
    brandTag: 'बळीराजाच्या प्रगतीचा विश्वासू साथीदार',
    navWeather: 'हवामान अंदाज',
    navScanner: 'पीक रोग स्कॅनर',
    navChatbot: 'शेतकरी एआय चॅटबॉट',
    navGuides: 'लागवड तंत्रज्ञान',
    navMandi: 'बाजार भाव',
    heroKicker: '🌾 प्रगत शेती आणि शेतकरी व्यासपीठ',
    heroTitle: 'सर्व शेतकऱ्यांसाठी <span class="gradient-text">स्मार्ट आधुनिक शेती</span>',
    heroDesc: 'हवामानाच्या अंदाजानुसार शेतीचे नियोजन करा, पिकांचे फोटो स्कॅन करून रोगांवर उपाय मिळवा आणि मराठीत बोलून मार्गदर्शन मिळवा.',
    heroCtaScan: '📸 पीक रोग स्कॅन करा',
    heroCtaWeather: '🌦️ हवामान सल्ला',
    heroCtaChat: '🎙️ एआय शी बोला',
    scanHeading: 'एआय पीक रोग स्कॅनर व निदान',
    scanSub: 'पिकांच्या पानांचे फोटो अपलोड करा. आमचे एआय तंत्रज्ञान रोगाचे अचूक निदान करून सेंद्रिय व रासायनिक उपाय सांगेल.',
    weatherHeading: 'आगामी हवामान व कृषी सल्ला',
    weatherSub: 'फवारणी आणि पाणी व्यवस्थापनासाठी ७ दिवसांचा अचूक हवामान अंदाज.',
    chatHeading: 'शेतकरी बहुभाषिक एआय चॅटबॉट',
    chatSub: 'कोणत्याही भाषेत बोलून किंवा लिहून प्रश्न विचारा. पिकांची लागवड व खत नियोजनाची संपूर्ण माहिती मिळवा.'
  },
  'es': {
    brandTag: 'Potenciando a Cada Agricultor',
    navWeather: 'Clima Agrícola',
    navScanner: 'Escáner de Cultivos',
    navChatbot: 'Chatbot Agrícola IA',
    navGuides: 'Guías de Siembra',
    navMandi: 'Precios de Mercado',
    heroKicker: '🌾 Portal Certificado de Inteligencia Agrícola',
    heroTitle: 'Agricultura Inteligente para <span class="gradient-text">Pequeños y Grandes Productores</span>',
    heroDesc: 'Planifique con pronósticos microclimáticos, escanee enfermedades foliares con soluciones inmediatas y consulte a su Asistente IA por voz o texto en cualquier idioma.',
    heroCtaScan: '📸 Escanear Cultivo',
    heroCtaWeather: '🌦️ Ver Pronóstico',
    heroCtaChat: '🎙️ Hablar con la IA',
    scanHeading: 'Escáner IA de Enfermedades de Cultivos',
    scanSub: 'Suba una foto foliar. Nuestra red neuronal detecta patógenos y prescribe tratamientos orgánicos y químicos.',
    weatherHeading: 'Pronóstico y Asesoría Microclimática',
    weatherSub: 'Pronóstico de 7 días adaptado para momentos óptimos de fumigación y riego.',
    chatHeading: 'Asistente Multilingüe por Voz y Chat',
    chatSub: 'Pregunte lo que desee por voz o texto en español. Aprenda a sembrar cualquier cultivo paso a paso.'
  },
  'hinglish': {
    brandTag: 'Har Kisan Ki Pragati Ka Sathi',
    navWeather: 'Mausam Forecast',
    navScanner: 'Fasal Rog Scanner',
    navChatbot: 'Kisan AI Chatbot',
    navGuides: 'Kheti Blueprint',
    navMandi: 'Mandi Bhav',
    heroKicker: '🌾 Certified Smart Agriculture Portal',
    heroTitle: 'Small & Large Farmers Ke Liye <span class="gradient-text">Smart Kheti</span>',
    heroDesc: 'Upcoming mausam ke hisab se kheti karein, fasal ki bimari scan karke organic & chemical upchar payein aur voice ya chat se kisi bhi bhasha me kheti ki jankari lein.',
    heroCtaScan: '📸 Fasal Rog Scan Karein',
    heroCtaWeather: '🌦️ Mausam Advisory Dekhein',
    heroCtaChat: '🎙️ Agri-AI Se Bolkar Poochein',
    scanHeading: 'AI Fasal Rog Scanner & Pathology',
    scanSub: 'Kisi bhi fasal ki patti ki photo upload karein. Hamara AI scanner rog pehchan kar turant dawa aur ilaj batayega.',
    weatherHeading: 'Upcoming Mausam & Krishi Salah',
    weatherSub: 'Spray, sinchai aur fungal risk se bachav ke liye 7-din ka precision mausam forecast.',
    chatHeading: 'Farmers Multilingual Voice & AI Chatbot',
    chatSub: 'Mic dabakar boliye ya type karein. Har fasal ki buwai, khad aur rog roktham ki verified kisan salah.'
  },
  'te': {
    brandTag: 'ప్రతి రైతు అభివృద్ధి కోసం',
    navWeather: 'వాతావరణం',
    navScanner: 'పంట రోగ స్కానర్',
    navChatbot: 'రైతు AI చాట్‌బాట్',
    navGuides: 'సాగు పద్ధతులు',
    navMandi: 'మార్కెట్ ధరలు',
    heroKicker: '🌾 ఆధునిక వ్యవసాయ AI వేదిక',
    heroTitle: 'రైతుల కోసం <span class="gradient-text">స్మార్ట్ వ్యవసాయం</span>',
    heroDesc: 'రాబోయే వాతావరణ సమాచారం తెలుసుకోండి, పంట తెగుళ్లను ఫోటో ద్వారా గుర్తించండి మరియు తెలుగులో మాట్లాడి AI సలహాలు పొందండి.',
    heroCtaScan: '📸 పంట రోగం స్కాన్ చేయండి',
    heroCtaWeather: '🌦️ వాతావరణం చూడండి',
    heroCtaChat: '🎙️ మాట్లాడండి',
    scanHeading: 'AI పంట తెగుళ్ల స్కానర్',
    scanSub: 'ఆకుల ఫోటో అప్‌లోడ్ చేయండి. మా AI వ్యవస్థ తెగుళ్లను గుర్తించి సేంద్రియ మరియు రసాయన మందులను సిఫార్సు చేస్తుంది.',
    weatherHeading: 'వాతావరణ సూచనలు & సలహాలు',
    weatherSub: 'స్ప్రే మరియు నీటి తడుల కోసం 7 రోజుల ఖచ్చితమైన వాతావరణ సమాచారం.',
    chatHeading: 'రైతు బహుభాషా AI సహాయకుడు',
    chatSub: 'తెలుగులో మాట్లాడి లేదా రాసి వ్యవసాయ సమాచారం తెలుసుకోండి.'
  },
  'ta': {
    brandTag: 'விவசாயிகளின் வாழ்வாதார தோழன்',
    navWeather: 'வானிலை தகவல்',
    navScanner: 'பயிர் நோய் ஸ்கேனர்',
    navChatbot: 'விவசாய AI சாட்பாட்',
    navGuides: 'சாகுபடி முறைகள்',
    navMandi: 'சந்தை விலை',
    heroKicker: '🌾 நவீன வேளாண்மை டிஜிட்டல் தளம்',
    heroTitle: 'விவசாயிகளுக்கான <span class="gradient-text">ஸ்மார்ட் நவீன விவசாயம்</span>',
    heroDesc: 'வானிலை முன்னறிவிப்பு, பயிர் நோய்களை ஸ்கேன் செய்து உடனடி தீர்வுகள் மற்றும் தமிழில் பேசி ஆலோசனைகளைப் பெறுங்கள்.',
    heroCtaScan: '📸 நோய் ஸ்கேன் செய்',
    heroCtaWeather: '🌦️ வானிலை பார்',
    heroCtaChat: '🎙️ பேசி உதவி பெறு',
    scanHeading: 'AI பயிர் நோய் ஸ்கேனர்',
    scanSub: 'இலை படத்தை பதிவேற்றி பூச்சி மற்றும் நோய்களை உடனே கண்டறிந்து இயற்கை மற்றும் ரசாயன மருந்துகளை அறியுங்கள்.',
    weatherHeading: '7 நாள் வானிலை முன்னறிவிப்பு',
    weatherSub: 'மருந்து தெளிப்பு மற்றும் பாசனத்திற்கான துல்லியமான வானிலை தகவல்.',
    chatHeading: 'விவசாயி குரல் & உரை AI உதவியாளர்',
    chatSub: 'தமிழில் பேசி அல்லது தட்டச்சு செய்து விவசாய தகவல்களை அறியுங்கள்.'
  },
  'bn': {
    brandTag: 'প্রতিটি কৃষকের আস্থার সঙ্গী',
    navWeather: 'আবহাওয়ার খবর',
    navScanner: 'ফসলের রোগ স্ক্যানার',
    navChatbot: 'কৃষক এআই চ্যাটবট',
    navGuides: 'চাষের নিয়মাবলী',
    navMandi: 'বাজার দর',
    heroKicker: '🌾 আধুনিক কৃষি তথ্য ও সমাধান পোর্টাল',
    heroTitle: 'কৃষকদের জন্য <span class="gradient-text">স্মার্ট আধুনিক কৃষি</span>',
    heroDesc: 'আবহাওয়ার পূর্বাভাস জেনে চাষের পরিকল্পনা করুন, ফসলের পাতার ছবি স্ক্যান করে রোগ নির্ণয় করুন এবং বাংলায় কথা বলে সমাধান পান।',
    heroCtaScan: '📸 রোগ স্ক্যান করুন',
    heroCtaWeather: '🌦️ আবহাওয়া দেখুন',
    heroCtaChat: '🎙️ বাংলায় বলুন',
    scanHeading: 'এআই ফসলের রোগ নির্ণয় ব্যবস্থা',
    scanSub: 'পাতার ছবি আপলোড করে রোগ শনাক্ত করুন এবং তাৎক্ষণিক জৈব ও রাসায়নিক নিরাময় জানুন।',
    weatherHeading: 'সাত দিনের আবহাওয়া পূর্বাভাস',
    weatherSub: 'কীটনাশক ছিটানো ও সেচ দেওয়ার সঠিক সময় নির্ধারণ করুন।',
    chatHeading: 'কৃষক বহুভাষিক এআই চ্যাটবট',
    chatSub: 'মাইকে বাংলায় কথা বলুন বা লিখে প্রশ্ন করে ফসলের সঠিক যত্ন জানুন।'
  },
  'gu': {
    brandTag: 'ખેડૂત મિત્ર સમૃદ્ધિનું માધ્યમ',
    navWeather: 'હવામાન આગાહી',
    navScanner: 'પાક રોગ સ્કેનર',
    navChatbot: 'ખેડૂત એઆઈ ચેટબોટ',
    navGuides: 'વાવણી માર્ગદર્શિકા',
    navMandi: 'બજાર ભાવ',
    heroKicker: '🌾 સ્માર્ટ ડિજિટલ કૃષિ પ્લેટફોર્મ',
    heroTitle: 'ખેડૂતો માટે <span class="gradient-text">સ્માર્ટ આધુનિક ખેતી</span>',
    heroDesc: 'હવામાનની સ્થિતિ જાણીને આયોજન કરો, પાકના રોગ સ્કેન કરીને તાત્કાલિક ઉપાય મેળવો અને ગુજરાતીમાં બોલીને સલાહ લો.',
    heroCtaScan: '📸 પાક રોગ સ્કેન કરો',
    heroCtaWeather: '🌦️ હવામાન જુઓ',
    heroCtaChat: '🎙️ બોલીને પૂછો',
    scanHeading: 'એઆઈ પાક રોગ સ્કેનર',
    scanSub: 'પાંદડાનો ફોટો અપલોડ કરીને રોગ ઓળખો અને દેશી તેમજ દવાઓનું પ્રમાણ જાણો.',
    weatherHeading: '૭ દિવસની સચોટ હવામાન આગાહી',
    weatherSub: 'દવા છંટકાવ અને પિયત આયોજન માટે ઉપયોગી માહિતી.',
    chatHeading: 'ખેડૂત બહુભાષી એઆઈ ચેટબોટ',
    chatSub: 'ગુજરાતીમાં બોલીને કે લખીને પાક વિશે સંપૂર્ણ માહિતી મેળવો.'
  }
};

function setupGlobalLanguageSelector() {
  const langBtn = document.getElementById('globalLangBtn');
  const langDropdown = document.getElementById('globalLangDropdown');
  const langOptions = document.querySelectorAll('.lang-option');

  if (langBtn && langDropdown) {
    langBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      langDropdown.classList.toggle('show');
    });

    document.addEventListener('click', () => {
      langDropdown.classList.remove('show');
    });
  }

  langOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      const selectedLang = opt.getAttribute('data-lang');
      langOptions.forEach(o => o.classList.remove('active'));
      opt.classList.add('active');

      const currentLangText = document.getElementById('currentLangLabel');
      if (currentLangText) {
        currentLangText.textContent = opt.textContent.trim().split(' ')[0];
      }

      applyLanguageTranslations(selectedLang);

      // Sync chatbot module language & voice state
      if (window.ChatbotModule && window.ChatbotModule.setLanguage) {
        window.ChatbotModule.setLanguage(selectedLang);
      }
      if (window.ChatbotModule && window.ChatbotModule.greetInLanguage) {
        window.ChatbotModule.greetInLanguage(selectedLang);
      }
    });
  });
}

function applyLanguageTranslations(lang) {
  const dict = UI_TRANSLATIONS[lang] || UI_TRANSLATIONS['en'];

  const mapping = {
    'brandTagline': dict.brandTag,
    'navWeatherLink': dict.navWeather,
    'navScannerLink': dict.navScanner,
    'navChatbotLink': dict.navChatbot,
    'navGuidesLink': dict.navGuides,
    'navMandiLink': dict.navMandi,
    'heroKicker': dict.heroKicker,
    'heroTitle': dict.heroTitle,
    'heroDesc': dict.heroDesc,
    'heroCtaScan': dict.heroCtaScan,
    'heroCtaWeather': dict.heroCtaWeather,
    'heroCtaChat': dict.heroCtaChat,
    'scanSectionHeading': dict.scanHeading,
    'scanSectionSub': dict.scanSub,
    'weatherSectionHeading': dict.weatherHeading,
    'weatherSectionSub': dict.weatherSub,
    'chatSectionHeading': dict.chatHeading,
    'chatSectionSub': dict.chatSub
  };

  for (const [id, value] of Object.entries(mapping)) {
    const el = document.getElementById(id);
    if (el && value) {
      el.innerHTML = value;
    }
  }
}

function setupMobileNav() {
  const toggle = document.getElementById('mobileNavToggle');
  const navLinks = document.querySelector('.nav-links');

  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      const isVisible = navLinks.style.display === 'flex';
      if (isVisible) {
        navLinks.style.display = 'none';
      } else {
        navLinks.style.display = 'flex';
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '4.75rem';
        navLinks.style.left = '0';
        navLinks.style.right = '0';
        navLinks.style.background = 'white';
        navLinks.style.padding = '1.5rem';
        navLinks.style.boxShadow = '0 10px 25px rgba(0,0,0,0.15)';
        navLinks.style.zIndex = '999';
      }
    });

    // Close when link clicked
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          navLinks.style.display = 'none';
        }
      });
    });
  }
}

function setupAccessibilityControls() {
  const contrastBtn = document.getElementById('textSizeToggleBtn');
  if (contrastBtn) {
    contrastBtn.addEventListener('click', () => {
      document.body.classList.toggle('large-text');
      const isLarge = document.body.classList.contains('large-text');
      contrastBtn.textContent = isLarge ? '🔍 A-' : '🔍 A+';
      contrastBtn.title = isLarge ? 'Reset Text Size' : 'Increase Text Size for Readability';
    });
  }
}
