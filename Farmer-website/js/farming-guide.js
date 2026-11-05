/**
 * AgriMitra AI - Crop Encyclopedia, Planting Blueprints & Farmer Utility Calculators
 */

const FarmingGuideModule = (() => {
  // Comprehensive Crop Encyclopedia
  const CROPS = [
    {
      id: 'wheat',
      category: 'cereals',
      name: 'Wheat (गेहूं / Triticum)',
      botanical: 'Triticum aestivum',
      tag: 'Rabi Staple',
      image: 'assets/sample_healthy_wheat.jpg',
      season: 'Rabi (Oct - Nov Sowing)',
      duration: '120 - 135 Days',
      soil: 'Well-drained Loamy (pH 6.0 - 7.5)',
      water: '4 - 6 Critical Irrigations',
      yield: '18 - 25 Quintals / Acre',
      seedRate: '40 - 45 kg / Acre',
      spacing: '20 cm row-to-row x continuous in furrow',
      steps: [
        {
          num: '1',
          title: 'Deep Land Preparation & Organic Enrichment',
          desc: 'Plough deeply using a mouldboard plough followed by 2 cross-harrowings. Incorporate 4-6 tonnes of well-decomposed Farmyard Manure (FYM) or 1 tonne of vermicompost per acre during the last harrowing to establish high soil biological activity.'
        },
        {
          num: '2',
          title: 'Certified Seed Selection & Bio-Priming',
          desc: 'Select certified high-yielding varieties (HD-2967, HD-3086, DBW-187, or PBW-550). Treat seeds with Carboxin 37.5% + Thiram 37.5% DS @ 2.5g/kg seed followed by Azotobacter and PSB bio-fertilizer cultures for atmospheric nitrogen fixation.'
        },
        {
          num: '3',
          title: 'Precision Sowing & Sowing Depth',
          desc: 'Sow between Nov 1 and Nov 25 using a zero-till seed-cum-fertilizer drill. Sowing depth should strictly be 4 to 5 cm. Deeper sowing delays coleoptile emergence and reduces productive tillers.'
        },
        {
          num: '4',
          title: 'Balanced Nutrient & Split Fertilizer Schedule',
          desc: 'Recommended dose: 120 kg N : 60 kg P2O5 : 40 kg K2O per hectare. Apply full dose of Phosphorus (DAP) and Potash (MOP) plus 1/3rd Nitrogen at sowing time. Top-dress remaining Nitrogen in two equal splits before the 1st and 2nd irrigations.'
        },
        {
          num: '5',
          title: 'Crucial Irrigation Stages',
          desc: 'Crown Root Initiation (CRI at 20-22 days after sowing) is the single most critical stage; water stress here causes 30% yield loss. Follow up at Tillering (40-45 days), Late Jointing (65-70 days), Flowering (85-90 days), and Milk/Dough stage (105-110 days).'
        },
        {
          num: '6',
          title: 'Harvesting & Storage Moisture Control',
          desc: 'Harvest when leaves turn straw-yellow and grain hardens (moisture falls below 14%). Dry harvested grain under sunlight for 2-3 days until grain moisture drops below 11-12% before airtight storage to prevent rice weevil attacks.'
        }
      ]
    },
    {
      id: 'tomato',
      category: 'vegetables',
      name: 'Tomato (टमाटर / Solanum)',
      botanical: 'Solanum lycopersicum',
      tag: 'High Value',
      image: 'assets/sample_tomato_blight.jpg',
      season: 'Autumn / Spring (Year-round in polyhouse)',
      duration: '90 - 120 Days',
      soil: 'Deep Fertile Sandy Loam (pH 6.0 - 7.0)',
      water: 'Drip Fertigation (Every 2-3 Days)',
      yield: '200 - 350 Quintals / Acre',
      seedRate: '60 - 80 g Hybrid / Acre',
      spacing: '90 x 45 cm on raised beds',
      steps: [
        {
          num: '1',
          title: 'Nursery Raising & Pro-Tray Seedlings',
          desc: 'Raise seedlings in 98-cell pro-trays using sterilized coco-peat, vermiculite, and perlite mixture (3:1:1). Seedlings are ready for field transplanting within 25 to 30 days when they have 4-5 true leaves.'
        },
        {
          num: '2',
          title: 'Raised Bed Preparation & Mulching',
          desc: 'Form raised beds of 90 cm top width, 30 cm height, and 50 cm furrow walkways. Lay inline drip laterals (16mm with 2-4 LPH drippers). Lay 25-30 micron silver-black reflective plastic mulch to suppress weeds and conserve soil moisture.'
        },
        {
          num: '3',
          title: 'Transplanting & Root Dip Treatment',
          desc: 'Transplant seedlings during late afternoon to prevent transplant shock. Dip roots in a suspension of Pseudomonas fluorescens (10g/L) and Imidacloprid (0.5ml/L) for 15 minutes before planting to guard against damping off and sucking pests.'
        },
        {
          num: '4',
          title: 'Staking & Canopy Architecture',
          desc: 'Stake indeterminate hybrid varieties with 6-foot bamboo stakes and GI wires 30 days after transplanting. Prune early side suckers up to the first flower cluster to promote upward growth, ventilation, and larger fruit sizing.'
        },
        {
          num: '5',
          title: 'Fertigation & Micronutrient Dosing',
          desc: 'Apply 19:19:19 water-soluble fertilizer through drip every 4 days during vegetative stage. Switch to 13:0:45 (Potassium Nitrate) and Calcium Nitrate + Boron during fruit setting to prevent blossom end rot and fruit splitting.'
        },
        {
          num: '6',
          title: 'Harvesting at Pink / Breaker Stage',
          desc: 'For distant markets, harvest at the "breaker" or light pink stage. For local markets, harvest when fruits achieve 90% ripe red color. Store in well-ventilated plastic crates in cool shaded areas.'
        }
      ]
    },
    {
      id: 'rice',
      category: 'cereals',
      name: 'Paddy / Rice (धान / Oryza)',
      botanical: 'Oryza sativa',
      tag: 'Kharif Staple',
      image: 'assets/sample_healthy_wheat.jpg',
      season: 'Kharif (June - July Sowing)',
      duration: '115 - 145 Days',
      soil: 'Heavy Clay Loam / Alluvial (pH 5.5 - 7.0)',
      water: 'Alternate Wetting & Drying (AWD)',
      yield: '22 - 30 Quintals / Acre',
      seedRate: '6 - 8 kg Hybrid / Acre',
      spacing: '20 x 15 cm (2-3 seedlings/hill)',
      steps: [
        {
          num: '1',
          title: 'Puddling & Land Levelling',
          desc: 'Plough field twice in standing water using a tractor cage wheel or puddler to destroy soil aggregates and create an impervious layer that restricts percolation losses. Level perfectly using a laser land leveller.'
        },
        {
          num: '2',
          title: 'Seed Priming & Salt Water Test',
          desc: 'Soak seeds in 10% brine solution to discard floating unfilled seeds. Rinse healthy seeds twice, then treat with Carbendazim 2g/kg seed. Incubate under moist gunny bags for 24 hours until tiny white sprouts emerge.'
        },
        {
          num: '3',
          title: 'Transplanting Geometry',
          desc: 'Transplant 21 to 25-day-old vigorous seedlings at shallow depth (2 to 3 cm). Deeper transplanting leads to poor tillering. Maintain plant density of 33 hills per square meter.'
        },
        {
          num: '4',
          title: 'Water Management via AWD',
          desc: 'Keep shallow water (2 cm) for the first 10 days to establish roots. Thereafter, practice Alternate Wetting and Drying (AWD) using a perforated field water pipe, which saves up to 30% water without any yield reduction.'
        },
        {
          num: '5',
          title: 'Split Fertilizer Application',
          desc: 'Apply full dose of Phosphorus and half dose of Potash during final puddling. Apply Nitrogen in 3 equal splits: 1/3 at basal, 1/3 at maximum tillering, and 1/3 at panicle initiation.'
        },
        {
          num: '6',
          title: 'Harvesting at Physiological Maturity',
          desc: 'Drain field 10-12 days before harvesting. Harvest when 80-85% of grains in the panicle turn golden yellow. Moisture content at harvest should be around 19-21%.'
        }
      ]
    },
    {
      id: 'cotton',
      category: 'cash',
      name: 'Cotton (कपास / Gossypium)',
      botanical: 'Gossypium hirsutum',
      tag: 'White Gold',
      image: 'assets/male_farmer_hero.jpg',
      season: 'Kharif (May - June)',
      duration: '150 - 180 Days',
      soil: 'Deep Black Cotton Soil (Regur, pH 7.0 - 8.5)',
      water: '5 - 6 Timed Irrigations / Drip',
      yield: '10 - 15 Quintals / Acre',
      seedRate: '1 - 2 packets (450g each) / Acre',
      spacing: '90 x 60 cm or 120 x 45 cm',
      steps: [
        {
          num: '1',
          title: 'Deep Summer Ploughing & Soil Solarization',
          desc: 'Undertake deep ploughing in April-May to expose resting pupae of Pink Bollworm and Helicoverpa to scorching heat and predatory birds.'
        },
        {
          num: '2',
          title: 'Precision Sowing & Dibbling',
          desc: 'Sow delinted seeds on ridges or raised beds after receiving pre-monsoon showers or assured irrigation. Dibble 1 seed per hill at 3-4 cm depth.'
        },
        {
          num: '3',
          title: 'Pheromone Trap Surveillance',
          desc: 'Erect 5 pheromone traps per acre at 45 days after sowing to monitor adult male moth flight. Change lures every 21 days.'
        },
        {
          num: '4',
          title: 'Growth Regulator & Detopping',
          desc: 'Apply Mepiquat Chloride (5% AS) @ 1ml/L at 75-80 days if excessive vegetative growth occurs, or manually detop the apical shoot at 90 days to redirect nutrients into boll enlargement.'
        },
        {
          num: '5',
          title: 'Targeted Bollworm Management',
          desc: 'Spray bio-fungicides and neem formulations early. For severe bollworm infestation, spray Emamectin Benzoate 5% SG or Spinetoram 11.7% SC in late afternoon.'
        },
        {
          num: '6',
          title: 'Clean Hand Picking of Bolls',
          desc: 'Pick fully opened, dry bolls in morning after dew evaporates. Keep trash and dry leaf debris separate to receive Grade-1 market prices in Mandis.'
        }
      ]
    },
    {
      id: 'corn',
      category: 'cereals',
      name: 'Corn / Maize (मक्का / Zea mays)',
      botanical: 'Zea mays',
      tag: 'Versatile Grain',
      image: 'assets/sample_healthy_wheat.jpg',
      season: 'Kharif / Rabi / Spring',
      duration: '95 - 110 Days',
      soil: 'Fertile Loam to Silt Loam (pH 6.5 - 7.5)',
      water: '4 - 5 Irrigations (Tasseling & Silking critical)',
      yield: '25 - 35 Quintals / Acre',
      seedRate: '7 - 8 kg / Acre',
      spacing: '60 x 20 cm',
      steps: [
        {
          num: '1',
          title: 'Land Preparation & Ridge Formation',
          desc: 'Plough and pulverize soil to a fine tilth. Form ridges and furrows 60 cm apart. Planting on ridges avoids waterlogging damage.'
        },
        {
          num: '2',
          title: 'Seed Inoculation',
          desc: 'Treat hybrid maize seed with Thiram (2g/kg) and Azospirillum culture (50g/kg) to maximize nitrogen absorption.'
        },
        {
          num: '3',
          title: 'Knee-High Nitrogen Application',
          desc: 'Top-dress 1/3rd Urea at knee-high stage (30 days) and 1/3rd at tasseling stage (50-55 days) along with earthing up.'
        },
        {
          num: '4',
          title: 'Fall Armyworm (FAW) Scouting',
          desc: 'Check whorls for pinholes and sawdust-like frass. Apply whorl application of sand + neem cake or Chlorantraniliprole 18.5% SC @ 0.4ml/L.'
        },
        {
          num: '5',
          title: 'Moisture at Tasseling & Silking',
          desc: 'Do not allow water deficit during pollination and grain filling stages to avoid poorly filled cob tips.'
        },
        {
          num: '6',
          title: 'Harvesting & Shelling',
          desc: 'Harvest when cob husk leaves turn brown and black layer forms at the grain base. Shell mechanically when moisture is 15%.'
        }
      ]
    },
    {
      id: 'potato',
      category: 'vegetables',
      name: 'Potato (आलू / Solanum tuberosum)',
      botanical: 'Solanum tuberosum',
      tag: 'Tuber Wealth',
      image: 'assets/sample_tomato_blight.jpg',
      season: 'Rabi (Oct - Nov Planting)',
      duration: '90 - 100 Days',
      soil: 'Loose, Well-aerated Sandy Loam (pH 5.2 - 6.5)',
      water: 'Light Frequent Irrigations',
      yield: '120 - 180 Quintals / Acre',
      seedRate: '12 - 15 Quintals / Acre (Seed Tubers)',
      spacing: '60 x 20 cm',
      steps: [
        {
          num: '1',
          title: 'Quality Seed Tuber Sprouting',
          desc: 'Remove cold-stored seed tubers (35-45g size) 10-12 days before planting. Place under diffused light in thin layers until strong 1 cm green sprouts emerge.'
        },
        {
          num: '2',
          title: 'Tuber Fungicide Dip',
          desc: 'Dip seed tubers in Mancozeb 75% WP (2.5g/L) solution for 10 minutes to protect against black scurf and rotting.'
        },
        {
          num: '3',
          title: 'Ridge Furrow Planting',
          desc: 'Plant sprouts facing upward at 5-7 cm depth on ridges 60 cm apart with 20 cm plant-to-plant distance.'
        },
        {
          num: '4',
          title: 'Earthing Up (Mitti Chadhana)',
          desc: 'First earthing up at 30 days and second at 50 days is mandatory. Uncovered tubers turn green and develop bitter solanine.'
        },
        {
          num: '5',
          title: 'Late Blight Protection',
          desc: 'Spray preventive Mancozeb (2.5g/L) during cool, humid, foggy weather. If disease spots appear, spray Cymoxanil + Mancozeb (2.5g/L).'
        },
        {
          num: '6',
          title: 'Dehaulming & Tuber Skin Curing',
          desc: 'Cut aerial foliage (dehaulming) 10-12 days prior to digging. This hardens tuber skin to prevent peeling during transit and storage.'
        }
      ]
    }
  ];

  // Mandi Wholesale Market Prices
  const MANDI_DATA = [
    { name: 'Wheat (Sharbati/Lokwan)', market: 'Khanna / Indore Mandi', min: 2450, max: 2780, modal: 2620, change: '+2.4%', isUp: true },
    { name: 'Paddy (Basmati 1121)', market: 'Karnal / Amritsar Mandi', min: 3800, max: 4450, modal: 4180, change: '+1.8%', isUp: true },
    { name: 'Cotton (Medium Staple)', market: 'Rajkot / Adilabad Mandi', min: 6900, max: 7450, modal: 7200, change: '-0.9%', isUp: false },
    { name: 'Soybean (Yellow)', market: 'Ujjain / Latur Mandi', min: 4600, max: 4950, modal: 4820, change: '+0.5%', isUp: true },
    { name: 'Tomato (Hybrid)', market: 'Nashik / Kolar Mandi', min: 1400, max: 2200, modal: 1850, change: '+6.2%', isUp: true },
    { name: 'Potato (Jyoti/Pukhraj)', market: 'Agra / Jalandhar Mandi', min: 1100, max: 1550, modal: 1380, change: '-1.4%', isUp: false },
    { name: 'Mustard (High Oil %)', market: 'Jaipur / Bharatpur Mandi', min: 5350, max: 5800, modal: 5620, change: '+1.1%', isUp: true }
  ];

  function init() {
    renderCropCards('all');
    setupFilterTabs();
    setupCalculator();
    renderMandiPrices();
    setupModal();
  }

  function setupFilterTabs() {
    const tabs = document.querySelectorAll('.guide-tab-btn');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const filter = tab.getAttribute('data-filter');
        renderCropCards(filter);
      });
    });
  }

  function renderCropCards(filter) {
    const grid = document.getElementById('cropCardsGrid');
    if (!grid) return;

    grid.innerHTML = '';
    const filtered = filter === 'all' ? CROPS : CROPS.filter(c => c.category === filter);

    filtered.forEach(crop => {
      const card = document.createElement('div');
      card.className = 'crop-card';
      card.innerHTML = `
        <div class="crop-card-img-wrap">
          <img src="${crop.image}" alt="${crop.name}">
          <span class="crop-tag">${crop.tag}</span>
        </div>
        <div class="crop-card-body">
          <h4 class="crop-card-title">${crop.name}</h4>
          <p class="crop-botanical">${crop.botanical}</p>
          <div class="crop-quick-specs">
            <div class="spec-cell">
              <span class="spec-cell-label">Season</span>
              <p class="spec-cell-val">${crop.season}</p>
            </div>
            <div class="spec-cell">
              <span class="spec-cell-label">Duration</span>
              <p class="spec-cell-val">${crop.duration}</p>
            </div>
            <div class="spec-cell">
              <span class="spec-cell-label">Avg Yield</span>
              <p class="spec-cell-val">${crop.yield}</p>
            </div>
            <div class="spec-cell">
              <span class="spec-cell-label">Seed Rate</span>
              <p class="spec-cell-val">${crop.seedRate}</p>
            </div>
          </div>
          <button class="btn-view-blueprint" onclick="FarmingGuideModule.openBlueprint('${crop.id}')">
            📖 View Complete Planting Blueprint
          </button>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  function setupModal() {
    const backdrop = document.getElementById('blueprintModalBackdrop');
    const closeBtn = document.getElementById('modalCloseBtn');

    if (closeBtn && backdrop) {
      closeBtn.addEventListener('click', () => {
        backdrop.classList.remove('open');
      });

      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) {
          backdrop.classList.remove('open');
        }
      });
    }
  }

  function openBlueprint(cropId) {
    const crop = CROPS.find(c => c.id === cropId);
    if (!crop) return;

    const modalTitle = document.getElementById('blueprintModalTitle');
    const modalSubtitle = document.getElementById('blueprintModalSubtitle');
    const roadmapContainer = document.getElementById('blueprintRoadmapSteps');
    const backdrop = document.getElementById('blueprintModalBackdrop');

    if (modalTitle) modalTitle.textContent = `${crop.name} - Complete Seed-to-Harvest Roadmap`;
    if (modalSubtitle) modalSubtitle.textContent = `Botanical: ${crop.botanical} | Spacing: ${crop.spacing} | Soil: ${crop.soil}`;

    if (roadmapContainer) {
      roadmapContainer.innerHTML = crop.steps.map(s => `
        <div class="roadmap-step">
          <div class="step-num-icon">${s.num}</div>
          <div class="step-content">
            <h5>${s.title}</h5>
            <p>${s.desc}</p>
          </div>
        </div>
      `).join('');
    }

    if (backdrop) backdrop.classList.add('open');
  }

  function setupCalculator() {
    const calcBtn = document.getElementById('calcFertilizerBtn');
    if (calcBtn) {
      calcBtn.addEventListener('click', calculateFertilizer);
    }
  }

  function calculateFertilizer() {
    const acres = parseFloat(document.getElementById('calcAcresInput')?.value) || 1;
    const crop = document.getElementById('calcCropSelect')?.value || 'wheat';

    // NPK bags calculation (Urea = 45kg bag, DAP = 50kg bag, MOP = 50kg bag)
    let ureaBags = 2.5 * acres;
    let dapBags = 1.2 * acres;
    let mopBags = 0.8 * acres;

    if (crop === 'tomato') {
      ureaBags = 3.0 * acres;
      dapBags = 1.8 * acres;
      mopBags = 1.5 * acres;
    } else if (crop === 'rice') {
      ureaBags = 2.8 * acres;
      dapBags = 1.2 * acres;
      mopBags = 0.9 * acres;
    } else if (crop === 'cotton') {
      ureaBags = 3.2 * acres;
      dapBags = 1.5 * acres;
      mopBags = 1.2 * acres;
    } else if (crop === 'potato') {
      ureaBags = 3.5 * acres;
      dapBags = 2.2 * acres;
      mopBags = 2.0 * acres;
    }

    const ureaElem = document.getElementById('calcResUrea');
    const dapElem = document.getElementById('calcResDap');
    const mopElem = document.getElementById('calcResMop');

    if (ureaElem) ureaElem.textContent = `${ureaBags.toFixed(1)} Bags`;
    if (dapElem) dapElem.textContent = `${dapBags.toFixed(1)} Bags`;
    if (mopElem) mopElem.textContent = `${mopBags.toFixed(1)} Bags`;
  }

  function renderMandiPrices() {
    const tbody = document.getElementById('mandiTableBody');
    if (!tbody) return;

    tbody.innerHTML = MANDI_DATA.map(item => `
      <tr>
        <td class="crop-name-cell">
          <span>🌾</span>
          <div>
            <strong>${item.name}</strong>
            <div style="font-size: 0.75rem; color: #64748b;">${item.market}</div>
          </div>
        </td>
        <td>₹${item.min}</td>
        <td>₹${item.max}</td>
        <td><strong>₹${item.modal}</strong> / Qtl</td>
        <td class="${item.isUp ? 'price-up' : 'price-down'}">${item.isUp ? '▲' : '▼'} ${item.change}</td>
      </tr>
    `).join('');
  }

  return {
    init,
    openBlueprint
  };
})();

// Attach explicitly to window for global access
window.FarmingGuideModule = FarmingGuideModule;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => window.FarmingGuideModule.init());
} else {
  window.FarmingGuideModule.init();
}

