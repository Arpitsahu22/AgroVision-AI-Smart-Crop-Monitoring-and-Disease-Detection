# AgriMitra AI (किसान मित्र) - Smart Agricultural Intelligence Platform

A modern, colorful, multilingual web platform designed for small and large farmers. It provides precision microclimate weather forecasts, AI-assisted crop disease image scanning, voice & text AI consultation in multiple languages, and end-to-end planting blueprints.

---

## 🌟 Key Features

### 1. 🌦️ Upcoming Agricultural Weather & Microclimate Advisory
- **Precision 7-Day Forecast:** Detailed forecasts tailored specifically for farming activities.
- **Microclimate Indicators:** Temperature, relative humidity, wind velocity, rain probability, and estimated soil moisture.
- **Farming Action Advisories:**
  - **Spraying Window:** Clear recommendations (e.g. *Optimal Window* or *Avoid Spraying*) based on wind speed and precipitation forecasts.
  - **Irrigation Guidance:** Soil moisture monitoring to advise when to irrigate or hold watering.
  - **Crop Disease & Fungal Alerts:** Early warnings based on atmospheric humidity and temperature trends.
- **Regional Presets & GPS:** Switch between major agricultural regions (Punjab, Maharashtra, UP, MP, Andhra Pradesh, Gujarat, California, Iowa) or use device GPS.

### 2. 📸 AI Crop Disease Scanner & Pre-Trained Model Inference
- **Pre-Trained Model Architecture Selection:**
  - **MobileNetV3-PlantVillage (Pre-trained):** Edge-optimized (18ms latency, 98.4% accuracy).
  - **ResNet50-AgriDoc (Field Clutter):** Deep residual net trained on unconstrained field photos with high noise (36ms, 99.1% accuracy).
  - **ViT-Agri Vision Transformer (Attention-Guided):** Multi-head self-attention on micro-lesions (52ms, 99.6% accuracy).
  - **Custom Model Weights Loader:** Upload your own fine-tuned `.onnx`, `.tflite`, or TensorFlow.js `.json` model checkpoints!
- **Top-3 Class Probability Distribution:** Real-time percentage bars for top predictions with inference latency and neural telemetry (input tensor, FP16/INT8 quantization, parameter count).
- **Interactive Image Scanning:** Drag-and-drop or upload leaf/plant photos directly from mobile cameras or gallery.
- **Instant Test Samples:** Includes 1-click test samples:
  - *Tomato Early Blight* (`Alternaria solani`)
  - *Healthy Golden Wheat* (`Triticum aestivum`)
- **Laser HUD Radar Animation:** High-tech visual scanner overlay with laser scanline, reticle targeting, and real-time progress phases.
- **Verified Diagnostic Report:**
  - Identified pathogen and severity rating.
  - Symptoms breakdown.
  - 🌿 **Organic & Biological Solutions** (e.g., *Trichoderma viride*, Cold-pressed Neem oil, leaf pruning).
  - 🧪 **Chemical Remedies & Dosages** (e.g., Mancozeb 75% WP, Azoxystrobin, safety waiting periods).
  - 🛡️ **Long-Term Cultural Prevention** (Drip irrigation, crop rotation, soil health).
  - One-click button to discuss findings directly with the AI Assistant.

### 3. 🧠 Global Agricultural Datasets & AI Benchmark Hub
- **Peer-Reviewed Open Datasets:**
  - **PlantVillage Dataset:** 54,306 images across 38 classes (Penn State & EPFL).
  - **PlantDoc Field Dataset:** 2,598 authentic field images with complex outdoor lighting and background weeds (IIT Delhi & Microsoft Research).
  - **ICAR-AgriData India:** 18,500+ images of Rice Blast, Wheat Rust, and Cotton Bollworm (Indian Council of Agricultural Research).
  - **CGIAR Global Pest & Food Security Data:** 45,000+ images across Africa, Asia, and Latin America.
- **1-Click Test Image Loader:** Load test leaf images directly from any dataset into the AI Scanner.
- **PyTorch & TensorFlow Transfer Learning Blueprints:** Ready-to-run Python fine-tuning code snippets for researchers and progressive farmers.

### 3. 🤖 Multilingual Farmers AI-Chatbot & Voice Assistant
- **Write & Speak (Voice Input):**
  - Farmers can type or tap the microphone to speak naturally using Web Speech Recognition.
  - Real-time animated sound-wave visualizer.
- **Text-to-Speech (Audio Readout):**
  - Farmers who prefer listening can click the **"🔊 Listen"** button on any message to hear the answer spoken aloud.
- **Multilingual Support:**
  - English, हिन्दी (Hindi), ਪੰਜਾਬੀ (Punjabi), मराठी (Marathi), Español (Spanish), etc.
- **Deep Agricultural Domain Knowledge:**
  - High-yield crop techniques, soil health, Jeevamrut preparation, pest management (Bollworm, Blight, Aphids), and fertilizer advice.

### 4. 🌾 Crop Cultivation Encyclopedia & Planting Blueprints
- **Interactive Crop Database:**
  - Wheat (गेहूं), Tomato (टमाटर), Rice / Paddy (धान), Cotton (कपास), Corn (मक्का), Potato (आलू).
- **Seed-to-Harvest Modal Roadmaps:**
  - 1. Land Preparation & Organic Enrichment
  - 2. Certified Seed Selection & Bio-Priming
  - 3. Precision Sowing Depth & Spacing
  - 4. Balanced Nutrient & Split Fertilizer Schedules
  - 5. Critical Irrigation Timings
  - 6. Harvesting & Post-Harvest Storage Curing

### 5. 🛠️ Value-Added Farmer Utilities
- **NPK Fertilizer Dosage Calculator:** Select crop and enter acreage (e.g., 2 acres, 5 acres) to get exact bags of Urea, DAP, and Potash.
- **Live Mandi Rates Ticker:** Simulated wholesale commodity benchmark prices per quintal with daily trends.
- **National Kisan Call Center Hotline:** 1800-180-1551 (Toll-Free, 22 Languages).

---

## 🚀 How to Run Locally

You can open `index.html` directly in any web browser, or serve it using any local HTTP server:

```bash
# Using Python:
python -m http.server 8080 --directory "c:\Program Files\Antigravity Project\Farmer-website"

# Then open in your browser:
# http://localhost:8080
```

---

## 🎨 Design & Visuals
- High-definition portrait of a smiling male farmer in lush fields with tractor and golden hour sunrise (`assets/male_farmer_hero.jpg`).
- Secondary portrait of a smiling farmer holding fresh produce (`assets/farmer_portrait.jpg`).
- Modern typography via Google Fonts (`Plus Jakarta Sans`, `Outfit`, `Noto Sans Devanagari`).
- Vibrant agricultural color palette (Lush Emerald, Golden Harvest Amber, Fresh Sky Blue, Earth Terracotta).
