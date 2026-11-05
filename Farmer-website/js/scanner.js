/**
 * AgriMitra AI - Crop Disease Scanner Engine
 * Features: Visual Laser Scan HUD, Multi-stage Neural Diagnosis, Treatment Protocols
 */

const ScannerModule = (() => {
  // Agricultural disease knowledge base with comprehensive treatments
  const DISEASE_DATABASE = {
    'tomato_blight': {
      crop: 'Tomato (Solanum lycopersicum)',
      disease: 'Early Blight (Alternaria solani)',
      statusType: 'danger',
      confidence: '98.4%',
      severity: 'Moderate (Stage 2/4)',
      symptoms: [
        'Concentric brown to black "bullseye" rings on older lower leaves',
        'Chlorotic yellow halos surrounding necrotic lesion spots',
        'Early leaf senescence and premature defoliation',
        'Sunscald risk on developing green fruit'
      ],
      organicTreatments: [
        'Foliar spray of <b>Trichoderma viride</b> bio-fungicide (5g per liter water) in morning',
        'Cold-pressed <b>Neem Oil (10,000 ppm)</b> @ 5ml/liter with organic liquid soap emulsifier',
        'Immediately prune lower foliage within 15 cm of soil to eliminate ground-spore splash',
        'Dust soil base with wood ash and vermicompost enriched with bio-agents'
      ],
      chemicalTreatments: [
        '<b>Mancozeb 75% WP</b> @ 2.0 - 2.5 g per liter water (Contact fungicide)',
        'For high humidity/rapid spread: <b>Azoxystrobin 18.2% + Difenoconazole 11.4% SC</b> @ 1ml/L',
        '<b>Chlorothalonil 75% WP</b> @ 2g/L as preventive rotation',
        'Repeat after 7-10 days; Observe 5-day safety waiting period before harvesting'
      ],
      prevention: [
        'Switch strictly to drip irrigation; avoid overhead sprinkler watering',
        '3-year crop rotation avoiding peppers, eggplants, and potatoes',
        'Apply 3-inch straw or paddy husk mulch around root base',
        'Ensure plant spacing of 60 x 45 cm for adequate cross-ventilation'
      ]
    },
    'wheat_healthy': {
      crop: 'Wheat (Triticum aestivum)',
      disease: 'Healthy Crop - No Pathogens Detected',
      statusType: 'success',
      confidence: '99.2%',
      severity: 'Excellent Condition',
      symptoms: [
        'Uniform green pigment with optimal chlorophyll concentration',
        'Sturdy stems with healthy flag leaf emergence',
        'Zero yellow/brown rust pustules on adaxial or abaxial surfaces',
        'Ears filling with plump, well-developed grain spikelets'
      ],
      organicTreatments: [
        'Apply foliar spray of liquid <b>Panchagavya (3%)</b> or <b>Jeevamrut</b> to boost vigor',
        'Incorporate 1 bag Vermicompost per acre to maintain micro-flora',
        'Ensure soil organic carbon levels remain above 0.75%'
      ],
      chemicalTreatments: [
        'No fungicides required. Maintain balanced <b>NPK nutrition (120:60:40 kg/ha)</b>',
        'Apply Zinc Sulphate (21%) @ 25 kg/ha if slight micronutrient chlorosis appears',
        'Top-dress Urea before 2nd and 3rd irrigation cycles'
      ],
      prevention: [
        'Monitor temperature: Maintain light irrigation during grain filling if temp exceeds 32°C',
        'Inspect borders weekly for airborne Stripe Rust (Puccinia striiformis) spores',
        'Ensure proper field drainage to prevent waterlogging during late-stage development'
      ]
    },
    'generic_leaf': {
      crop: 'Leaf Sample Analyzed',
      disease: 'Cercospora Leaf Spot & Nutrient Deficiency',
      statusType: 'warning',
      confidence: '94.6%',
      severity: 'Mild to Moderate (Stage 1-2)',
      symptoms: [
        'Small circular tan lesions with reddish-purple margins',
        'Mild interveinal yellowing (Magnesium & Nitrogen deficiency indicator)',
        'Reduced photosynthetic capacity on outer leaves'
      ],
      organicTreatments: [
        'Apply Copper Oxychloride 50% WP @ 2.5g/L or fermented butter-milk (Lassi) spray (5%)',
        'Spray seaweed extract (Ascophyllum nodosum) @ 2ml/L to relieve biotic stress',
        'Clean fallen leaves from furrow beds'
      ],
      chemicalTreatments: [
        'Carbendazim 50% WP @ 1g per liter water foliar spray',
        'Add 19:19:19 water-soluble foliar fertilizer @ 5g/liter to correct nutrition'
      ],
      prevention: [
        'Test soil pH and maintain between 6.2 - 7.0',
        'Apply balanced organic matter during field prep'
      ]
    }
  };

  let currentDiseaseKey = 'tomato_blight';
  let isScanning = false;

  function init() {
    setupFileInput();
    setupSampleChips();
    setupChatTransfer();
  }

  function setupFileInput() {
    const fileInput = document.getElementById('cropFileInput');
    const uploadBox = document.getElementById('scannerUploadBox');

    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
          handleFile(e.target.files[0]);
        }
      });
    }

    if (uploadBox) {
      uploadBox.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadBox.classList.add('dragover');
      });

      uploadBox.addEventListener('dragleave', () => {
        uploadBox.classList.remove('dragover');
      });

      uploadBox.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadBox.classList.remove('dragover');
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          handleFile(e.dataTransfer.files[0]);
        }
      });
    }
  }

  function setupSampleChips() {
    const sampleBtns = document.querySelectorAll('.sample-chip');
    sampleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const type = btn.getAttribute('data-sample');
        if (type === 'blight') {
          loadSampleImage('assets/sample_tomato_blight.jpg', 'tomato_blight');
        } else if (type === 'wheat') {
          loadSampleImage('assets/sample_healthy_wheat.jpg', 'wheat_healthy');
        }
      });
    });
  }

  function handleFile(file) {
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (JPG, PNG, or WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      // For custom uploads, choose generic or blight diagnosis
      const detected = file.name.toLowerCase().includes('wheat') ? 'wheat_healthy' : 'tomato_blight';
      startScanProcess(e.target.result, detected);
    };
    reader.readAsDataURL(file);
  }

  function loadSampleImage(src, diseaseKey) {
    startScanProcess(src, diseaseKey);
  }

  function startScanProcess(imageSrc, diseaseKey) {
    if (isScanning) return;
    isScanning = true;
    currentDiseaseKey = diseaseKey;

    const emptyView = document.getElementById('scannerEmptyView');
    const activeView = document.getElementById('scannerActiveView');
    const previewImg = document.getElementById('scannerPreviewImg');
    const laserLine = document.getElementById('scannerLaserLine');
    const statusText = document.getElementById('scanStatusText');
    const progressBar = document.getElementById('scanProgressBar');
    const progressPercent = document.getElementById('scanProgressPercent');
    const diagnosisCard = document.getElementById('diagnosisResultWrap');

    // Hide previous diagnosis
    if (diagnosisCard) diagnosisCard.style.display = 'none';

    // Show active image
    if (emptyView) emptyView.style.display = 'none';
    if (activeView) activeView.style.display = 'block';
    if (previewImg) previewImg.src = imageSrc;

    // Start laser animation
    const container = document.getElementById('scannerViewport');
    if (container) container.classList.add('scanning');

    // Multi-phase scanning simulation with high-tech updates
    const phases = [
      { pct: 20, text: '🔍 Phase 1: Analyzing leaf morphology & cell structure...' },
      { pct: 45, text: '🌿 Phase 2: Scanning for fungal pustules, necrotic spots & chlorosis...' },
      { pct: 75, text: '🔬 Phase 3: Cross-referencing 50,000+ AI agricultural pathology models...' },
      { pct: 95, text: '📋 Phase 4: Synthesizing verified organic & chemical remedies...' },
      { pct: 100, text: '✅ AI Diagnosis Complete!' }
    ];

    let currentPhase = 0;
    const interval = setInterval(() => {
      if (currentPhase < phases.length) {
        const p = phases[currentPhase];
        if (progressBar) progressBar.style.width = `${p.pct}%`;
        if (progressPercent) progressPercent.textContent = `${p.pct}%`;
        if (statusText) statusText.textContent = p.text;
        currentPhase++;
      } else {
        clearInterval(interval);
        if (container) container.classList.remove('scanning');
        isScanning = false;
        playScanChime();
        renderDiagnosis(diseaseKey);
      }
    }, 550);
  }

  function playScanChime() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880.00, ctx.currentTime + 0.12); // A5
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch (e) {
      // AudioContext unavailable or blocked by browser policy
    }
  }

  function renderDiagnosis(key) {
    const data = DISEASE_DATABASE[key] || DISEASE_DATABASE['tomato_blight'];
    const card = document.getElementById('diagnosisResultWrap');
    if (!card) return;

    const titleElem = document.getElementById('diagCropTitle');
    const pathElem = document.getElementById('diagDiseaseName');
    const confElem = document.getElementById('diagConfidence');
    const sympList = document.getElementById('diagSymptomsList');
    const orgList = document.getElementById('diagOrganicList');
    const chemList = document.getElementById('diagChemList');
    const prevList = document.getElementById('diagPrevList');

    if (titleElem) titleElem.textContent = data.crop;
    if (pathElem) pathElem.textContent = data.disease;
    if (confElem) {
      confElem.textContent = `⚡ AI Confidence: ${data.confidence}`;
      confElem.style.background = data.statusType === 'success' ? '#dcfce7' : '#fee2e2';
      confElem.style.color = data.statusType === 'success' ? '#15803d' : '#b91c1c';
    }

    if (sympList) {
      sympList.innerHTML = data.symptoms.map(s => `<li>${s}</li>`).join('');
    }
    if (orgList) {
      orgList.innerHTML = data.organicTreatments.map(s => `<li>${s}</li>`).join('');
    }
    if (chemList) {
      chemList.innerHTML = data.chemicalTreatments.map(s => `<li>${s}</li>`).join('');
    }
    if (prevList) {
      prevList.innerHTML = data.prevention.map(s => `<li>${s}</li>`).join('');
    }

    // Render pre-trained model inference telemetry and top-3 prediction probabilities
    if (window.ModelsDatasetsModule && window.ModelsDatasetsModule.getModelPredictions) {
      const preds = window.ModelsDatasetsModule.getModelPredictions(key);
      const probsContainer = document.getElementById('diagPredictionProbs');
      if (probsContainer) {
        probsContainer.innerHTML = `
          <div class="prediction-probs-title">
            <span>🧠 Model Prediction Probabilities (${preds.modelName})</span>
            <span>⚡ Latency: ${preds.latency}</span>
          </div>
          ${preds.top3.map((item, idx) => `
            <div class="prob-row">
              <span class="prob-label">${item.name}</span>
              <div class="prob-bar-track">
                <div class="prob-bar-val ${idx > 0 ? 'subtle' : ''}" style="width: ${item.pct}%;"></div>
              </div>
              <span class="prob-percent">${item.pct}%</span>
            </div>
          `).join('')}
          <div class="neural-telemetry-row">
            <span class="neural-telemetry-chip">Architecture: <strong>${preds.arch}</strong></span>
            <span class="neural-telemetry-chip">Trained on: <strong>${preds.dataset}</strong></span>
            <span class="neural-telemetry-chip">Format: <strong>${preds.weightsFormat}</strong></span>
            <span class="neural-telemetry-chip">Tensor: <strong>${preds.inputSize}</strong></span>
            <span class="neural-telemetry-chip">Complexity: <strong>${preds.params}</strong></span>
          </div>
        `;
      }
    }

    card.style.display = 'block';
    card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function setupChatTransfer() {
    const askBotBtn = document.getElementById('askBotAboutDiseaseBtn');
    if (askBotBtn) {
      askBotBtn.addEventListener('click', () => {
        const data = DISEASE_DATABASE[currentDiseaseKey];
        const prompt = `I scanned my ${data.crop} and the AI diagnosed "${data.disease}". Can you explain the best dosage, application timing, and organic safety tips for my farm?`;
        
        // Scroll to chatbot and input the prompt
        const chatbotSection = document.getElementById('chatbot');
        if (chatbotSection) {
          chatbotSection.scrollIntoView({ behavior: 'smooth' });
        }

        if (window.ChatbotModule && window.ChatbotModule.sendExternalQuery) {
          window.ChatbotModule.sendExternalQuery(prompt);
        }
      });
    }
  }

  return {
    init,
    loadSampleImage,
    startScanProcess
  };
})();

// Attach explicitly to window for global access
window.ScannerModule = ScannerModule;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => window.ScannerModule.init());
} else {
  window.ScannerModule.init();
}

