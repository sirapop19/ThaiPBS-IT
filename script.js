// =======================================
// 1. ตัวแปรระบบหลักและข้อมูลจำลองรายปี
// =======================================
const YEARS = [2013, 2017, 2019, 2022, 2025];
let currentYear = YEARS[YEARS.length - 1];
const MOCK_DATA = {
    2013: { extent: 1350000, affected: 25000, severity: "รุนแรง" },
    2017: { extent: 1580000, affected: 34000, severity: "วิกฤต" },
    2019: { extent: 1200000, affected: 19000, severity: "ปานกลาง" },
    2022: { extent: 1650000, affected: 48000, severity: "วิกฤตสูงสุด" },
    2025: { extent: 1100000, affected: 12000, severity: "เฝ้าระวัง" }
};

// ภูมิศาสตร์รายลุ่มน้ำ
const basinRegions = {
    mekong: { title: "ลุ่มน้ำโขงตะวันออกเฉียงเหนือ", color: "#D95C3C" },
    chi:    { title: "ลุ่มน้ำชี", color: "#E67E53" },
    mun:    { title: "ลุ่มน้ำมูล", color: "#F29F6B" }
};

// ข้อมูลสถิติและงบประมาณแผ่นดิน (อิงตามรายงานงบประมาณ สทนช. และ Rocket Media Lab)
const provinceYearlyData = {
    // ================= ลุ่มน้ำชี =================
    "chaiyaphum": {
        nameTH: "ชัยภูมิ", basin: "chi", 
        budget: "1,266.59", // จัดอันดับงบระดับบน
        yearly: { 2013: 124000, 2017: 185000, 2019: 140000, 2022: 210000, 2025: 95000 }
    },
    "khon kaen": {
        nameTH: "ขอนแก่น", basin: "chi", 
        budget: "1,134.17", 
        yearly: { 2013: 210000, 2017: 310000, 2019: 190000, 2022: 340000, 2025: 115000 }
    },
    "maha sarakham": {
        nameTH: "มหาสารคาม", basin: "chi", 
        budget: "850.40", 
        yearly: { 2013: 115000, 2017: 195000, 2019: 130000, 2022: 225000, 2025: 80000 }
    },
    "kalasin": {
        nameTH: "กาฬสินธุ์", basin: "chi", 
        budget: "179.25", // ⚠️ ติดอันดับงบน้อยที่สุดอันดับ 7 ของประเทศ
        yearly: { 2013: 98000, 2017: 160000, 2019: 110000, 2022: 185000, 2025: 65000 }
    },
    "roi et": {
        nameTH: "ร้อยเอ็ด", basin: "chi", 
        budget: "920.15", 
        yearly: { 2013: 165000, 2017: 275000, 2019: 175000, 2022: 290000, 2025: 102000 }
    },
    "yasothon": {
        nameTH: "ยโสธร", basin: "chi", 
        budget: "450.80", 
        yearly: { 2013: 85000, 2017: 145000, 2019: 98000, 2022: 165000, 2025: 55000 }
    },
    "nong bua lam phu": {
        nameTH: "หนองบัวลำภู", basin: "chi", 
        budget: "107.14", // ⚠️ ติดอันดับงบน้อยที่สุดอันดับ 2 ของประเทศ
        yearly: { 2013: 20000, 2017: 45000, 2019: 31000, 2022: 55000, 2025: 15000 }
    },

    // ================= ลุ่มน้ำมูล =================
    "ubon ratchathani": {
        nameTH: "อุบลราชธานี", basin: "mun", 
        budget: "1,937.38", // ⭐ อันดับ 1 ของอีสาน / อันดับ 2 ของประเทศ
        yearly: { 2013: 380000, 2017: 580000, 2019: 410000, 2022: 620000, 2025: 195000 }
    },
    "nakhon ratchasima": {
        nameTH: "นครราชสีมา", basin: "mun", 
        budget: "985.45", 
        yearly: { 2013: 290000, 2017: 420000, 2019: 310000, 2022: 460000, 2025: 150000 }
    },
    "buri ram": {
        nameTH: "บุรีรัมย์", basin: "mun", 
        budget: "512.30", 
        yearly: { 2013: 110000, 2017: 180000, 2019: 120000, 2022: 195000, 2025: 68000 }
    },
    "surin": {
        nameTH: "สุรินทร์", basin: "mun", 
        budget: "489.60", 
        yearly: { 2013: 130000, 2017: 215000, 2019: 140000, 2022: 230000, 2025: 72000 }
    },
    "si sa ket": {
        nameTH: "ศรีสะเกษ", basin: "mun", 
        budget: "720.50", 
        yearly: { 2013: 180000, 2017: 290000, 2019: 195000, 2022: 310000, 2025: 90000 }
    },

    // ================= ลุ่มน้ำโขงตะวันออกเฉียงเหนือ =================
    "nakhon phanom": {
        nameTH: "นครพนม", basin: "mekong", 
        budget: "1,477.46", // ⭐ อันดับ 4 ของประเทศ
        yearly: { 2013: 105000, 2017: 150200, 2019: 120000, 2022: 165000, 2025: 62000 }
    },
    "bueng kan": {
        nameTH: "บึงกาฬ", basin: "mekong", 
        budget: "1,385.70", // ⭐ อันดับ 5 ของประเทศ
        yearly: { 2013: 60000, 2017: 85000, 2019: 68000, 2022: 95000, 2025: 38000 }
    },
    "nong khai": {
        nameTH: "หนองคาย", basin: "mekong", 
        budget: "1,313.61", // ⭐ อันดับ 7 ของประเทศ
        yearly: { 2013: 80000, 2017: 120500, 2019: 95000, 2022: 135000, 2025: 48000 }
    },
    "loei": {
        nameTH: "เลย", basin: "mekong", 
        budget: "1,266.59", // ⭐ อันดับ 8 ของประเทศ
        yearly: { 2013: 45000, 2017: 65000, 2019: 52000, 2022: 78000, 2025: 29000 }
    },
    "udon thani": {
        nameTH: "อุดรธานี", basin: "mekong", 
        budget: "780.40", 
        yearly: { 2013: 120000, 2017: 185000, 2019: 135000, 2022: 198000, 2025: 70000 }
    },
    "sakon nakhon": {
        nameTH: "สกลนคร", basin: "mekong", 
        budget: "810.90", 
        yearly: { 2013: 140000, 2017: 210000, 2019: 155000, 2022: 240000, 2025: 85000 }
    },
    "mukdahan": {
        nameTH: "มุกดาหาร", basin: "mekong", 
        budget: "395.20", 
        yearly: { 2013: 50000, 2017: 95000, 2019: 62000, 2022: 110000, 2025: 31000 }
    },
    "amnat charoen": {
        nameTH: "อำนาจเจริญ", basin: "mekong", 
        budget: "310.50", 
        yearly: { 2013: 420000, 2017: 78000, 2019: 55000, 2022: 89000, 2025: 24000 }
    }
};

// ข้อมูลจำลองรายละเอียด 3 ลุ่มน้ำ (อ้างอิงข้อมูลพื้นที่และขอบเขตภูมิศาสตร์จากภาพ 2, 3, 4, 5)
const BASIN_DESCRIPTIONS = {
    chi: {
        title: "ลุ่มน้ำชี",
        area: "49,273.86 ตร.กม.",
        projects: "1,425 โครงการ",
        origin: "แนวเทือกเขาเพชรบูรณ์ อ.เกษตรสมบูรณ์ จ.ชัยภูมิ"
    },
    mun: {
        title: "ลุ่มน้ำมูล",
        area: "71,060 ตร.กม.",
        projects: "2,632 โครงการ",
        origin: "ทิวเขาสันกำแพงบริเวณเขื่อนมูลบน อ.ครบุรี จ.นครราชสีมา"
    },
    mekong: {
        title: "ลุ่มน้ำโขงตะวันออกเฉียงเหนือ",
        area: "47,161.97 ตร.กม.",
        projects: "1,824 โครงการ",
        origin: "ที่ราบสูงธิเบต ไหลผ่านจีน พม่า ไทย ลาว กัมพูชา เวียดนาม"
    }
};

// =======================================
// 2. ระบบวาดแผนที่ประเทศไทย (D3.js Map)
// =======================================
// ประกาศตัวแปรเก็บสถานะจังหวัดที่เลือกปัจจุบัน (เพื่อให้อัปเดตอัตโนมัติเมื่อเลื่อนปี)
let selectedProvinceKey = null;

function renderThailandMap() {
    const container = d3.select("#thailand-d3-map");
    if (container.node() === null) return;
    
    container.html(""); 
    const width = container.node().getBoundingClientRect().width || 800;
    const height = 650; 

    const svg = container.append("svg")
        .attr("width", "100%")
        .attr("height", height)
        .attr("viewBox", `0 0 ${width} ${height}`);
        
    const defs = svg.append("defs");
    const glowFilter = defs.append("filter")
        .attr("id", "neon-glow")
        .attr("x", "-20%")
        .attr("y", "-20%")
        .attr("width", "140%")
        .attr("height", "140%");
    glowFilter.append("feGaussianBlur")
        .attr("stdDeviation", "4")
        .attr("result", "blur");
    glowFilter.append("feComposite")
        .attr("in", "SourceGraphic")
        .attr("in2", "blur")
        .attr("operator", "over");

    const g = svg.append("g");

    // 💡 พิกัดซูมเจาะเฉพาะภาคอีสาน
    const projection = d3.geoMercator()
        .center([103.6, 15.8]) 
        .scale(4800)           
        .translate([width / 2, height / 2]);
        
    const path = d3.geoPath().projection(projection);

    const IsanColorScale = d3.scaleLinear()
        .domain([0, 50000, 150000, 350000, 600000])
        .range(["#141122", "#4F3B99", "#9471FF", "#FF5DA0", "#FF0055"]); 

    // 🌟 ฟังก์ชันอัจฉริยะ: ดึงข้อความทั้งหมดมาสแกนหาชื่อจังหวัด (แก้ปัญหา NAME_1 หาย)
    function getSafeMatchedKey(geojsonFeature) {
        if (!geojsonFeature || !geojsonFeature.properties) return null;
        
        // ดึงค่าทุกตัวอักษรใน properties มาต่อกันแล้วล้างช่องว่างทิ้ง
        const propsStr = Object.values(geojsonFeature.properties).join(" ").toLowerCase();
        const cleanPropsStr = propsStr.replace(/[-_ \s]/g, "");

        // สแกนว่ามีชื่อจังหวัดใน provinceYearlyData ซ่อนอยู่ในนั้นหรือไม่
        return Object.keys(provinceYearlyData).find(key => {
            const cleanKey = key.replace(/[-_ \s]/g, "");
            return cleanPropsStr.includes(cleanKey);
        });
    }

    d3.json("https://raw.githubusercontent.com/apisit/thailand.json/master/thailand.json")
    .then(function(topoData) {
        
        // 💡 กรองวาดเฉพาะภาคอีสาน (ดึงเฉพาะ Feature ที่หาชื่อเจอในฐานข้อมูล 20 จังหวัดของเรา)
        const isanFeatures = topoData.features.filter(d => {
            const matchedKey = getSafeMatchedKey(d);
            return matchedKey !== null && matchedKey !== undefined;
        });

        // วาดรูปทรงจังหวัด
        g.selectAll("path")
            .data(isanFeatures)
            .enter().append("path")
            .attr("d", path)
            .attr("class", "thai-province")
            .attr("stroke", "rgba(148, 113, 255, 0.4)") 
            .attr("stroke-width", 1.2)
            .attr("fill", function(d) {
                const matchedKey = getSafeMatchedKey(d);
                const prov = provinceYearlyData[matchedKey];
                
                if (prov) {
                    const floodArea = prov.yearly[currentYear] || 0;
                    return IsanColorScale(floodArea);
                }
                return "#191624"; 
            })
            .style("cursor", "pointer")
            .on("mouseover", function(event, d) {
                d3.select(this)
                  .attr("stroke", "#FFF")
                  .attr("stroke-width", 2)
                  .style("filter", "url(#neon-glow) brightness(1.2)")
                  .raise();
            })
            .on("mouseout", function(event, d) {
                d3.select(this)
                  .attr("stroke", "rgba(148, 113, 255, 0.4)")
                  .attr("stroke-width", 1.2)
                  .style("filter", "none");
            })
            .on("click", function(event, d) {
                const matchedKey = getSafeMatchedKey(d);
                if (matchedKey) {
                    selectedProvinceKey = matchedKey;
                    showProvinceInfo(matchedKey, currentYear);
                }
            });
    });
}

function showProvinceInfo(provinceKey, year) {
    const provInfo = provinceYearlyData[provinceKey];
    const callout = document.getElementById('basin-data-callout');
    if (!callout || !provInfo) return;

    const floodArea = provInfo.yearly[year] || 0;
    const basinData = BASIN_DESCRIPTIONS[provInfo.basin];

    // ตรวจสอบสถานะสีป้ายและอันดับไฮไลต์ตามความวิกฤตของตัวเลขงบประมาณในอินโฟกราฟิก
    let badgeStyle = "background: #60A5FA;";
    let rankingTag = "";
    if (provInfo.budget === "1,937.38") {
        badgeStyle = "background: #FF0055; font-weight: bold; box-shadow: 0 0 10px rgba(255,0,85,0.5);";
        rankingTag = " <span style='color:#FF5DA0; font-size:0.85rem;'>(งบน้ำท่วมสูงสุดอันดับ 2 ของประเทศ!)</span>";
    } else if (provInfo.budget === "107.14" || provInfo.budget === "179.25") {
        badgeStyle = "background: #4B5563;";
        rankingTag = " <span style='color:#94A3B8; font-size:0.85rem;'>(กลุ่มจังหวัดที่ได้รับงบประมาณน้อยที่สุด)</span>";
    }

    callout.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 15px;">
            <div>
                <h4 style="color: #fff; font-size: 2.2rem; margin: 0 0 5px 0;">จังหวัด${provInfo.nameTH}</h4>
                <span style="color:white; padding:4px 12px; border-radius:20px; font-size:0.85rem; display:inline-block; ${badgeStyle}">
                    📍 ระบบ${basinData.title}
                </span>
            </div>
            <div style="text-align: right; min-width: 150px;">
                <p style="margin:0; font-size:0.85rem; color:var(--text-muted);">งบประมาณรวมจังหวัด (ปี 2568):</p>
                <p style="font-size: 1.8rem; font-weight: 800; color: var(--accent); margin:0;">${provInfo.budget} <span style="font-size:1rem; font-weight:normal;">ล้านบาท</span></p>
                ${rankingTag}
            </div>
        </div>

        <hr style="border:none; border-top:1px solid rgba(255,255,255,0.1); margin:20px 0;">

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px;">
            <div style="background: rgba(255,255,255,0.03); padding: 15px; border-radius: 12px; border-left: 4px solid var(--primary);">
                <p style="margin:0 0 5px 0; font-size:0.85rem; color:var(--text-muted);">พื้นที่น้ำท่วมปี พ.ศ. ${parseInt(year)+543}:</p>
                <p style="font-size: 1.8rem; font-weight: bold; margin:0; color:#fff;">${floodArea.toLocaleString()} <span style="font-size:1rem; font-weight:normal; color:var(--text-muted);">ไร่</span></p>
            </div>

            <div style="background: rgba(0,0,0,0.2); padding: 15px; border-radius: 12px; font-size: 0.9rem; color: #e2e8f0;">
                <p style="margin:0 0 5px 0; color:var(--primary); font-weight:bold;">🌐 บริบทข้อมูล${basinData.title}:</p>
                <p style="margin:2px 0;">• ขนาดพื้นที่ลุ่มน้ำทั้งหมด: ${basinData.area}</p>
                <p style="margin:2px 0;">• แหล่งกำเนิด: ${basinData.origin}</p>
                <p style="margin:2px 0;">• โครงการพัฒนาแหล่งน้ำ: ${basinData.projects}</p>
            </div>
        </div>
        
        <div style="text-align: right; margin-top: 15px;">
            <a href="https://rocketmedialab.co/flood-budget/" target="_blank" style="font-size: 0.8rem; color: rgba(255,255,255,0.4); text-decoration: none; transition: 0.3s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='rgba(255,255,255,0.4)'">
                🙏 ขอขอบคุณข้อมูลและสถิติจาก Rocket Media Lab
            </a>
        </div>
    `;
}

function updateTimelineData(year) {
    const data = MOCK_DATA[year];
    const callout = document.getElementById('basin-data-callout');
    if (!data || !callout) return;

    callout.innerHTML = `
        <h4 style="color: var(--accent); font-size: 1.8rem;">ข้อมูลภาพรวมปี พ.ศ. ${year + 543}</h4>
        <div style="background: rgba(0,0,0,0.2); padding: 15px; border-radius: 12px; margin-top: 15px;">
            <p style="margin:0; color:var(--text-muted);">พื้นที่น้ำท่วมทั้งภูมิภาค:</p>
            <p style="font-size: 2rem; font-weight: 800; color: #fff; margin: 0;">${data.extent.toLocaleString()} ไร่</p>
        </div>
        <p style="margin-top: 15px;">สถานการณ์โดยรวม: <strong>${data.severity}</strong></p>
        
        <div style="text-align: right; margin-top: 25px;">
            <a href="https://rocketmedialab.co/flood-budget/" target="_blank" style="font-size: 0.8rem; color: rgba(255,255,255,0.4); text-decoration: none; transition: 0.3s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='rgba(255,255,255,0.4)'">
                🙏 ขอขอบคุณข้อมูลและสถิติจาก Rocket Media Lab
            </a>
        </div>
    `;
}

// =======================================
// 3. ระบบควบคุม UI และเอฟเฟกต์แอนิเมชัน
// =======================================
function createRain() {
    const overlay = document.getElementById('weather-overlay');
    if (!overlay) return;
    overlay.innerHTML = '';
    for (let i = 0; i < 80; i++) {
        const drop = document.createElement('div');
        drop.className = 'rain-drop';
        drop.style.left = Math.random() * 100 + 'vw';
        drop.style.animationDuration = 0.5 + Math.random() * 0.5 + 's';
        drop.style.animationDelay = Math.random() * -5 + 's';
        overlay.appendChild(drop);
    }
}

function scrollCarousel(id, direction) {
    const carousel = document.getElementById(id);
    if (carousel) carousel.scrollTo({ left: carousel.scrollLeft + (direction * carousel.offsetWidth), behavior: 'smooth' });
}

function openLightbox(imgSrc) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    
    if (lightbox && lightboxImg) {
        lightboxImg.src = imgSrc;
        lightbox.showModal();
    }
}

// =======================================
// 4. บูตระบบเมื่อโหลดหน้าเว็บสำเร็จ
// =======================================
document.addEventListener('DOMContentLoaded', () => {
    createRain();
    renderThailandMap();

    const weatherBtn = document.getElementById('weather-toggle-btn');
    const weatherOverlay = document.getElementById('weather-overlay');
    const rainAudio = document.getElementById('rain-audio');
    let isRaining = true; // สถานะเริ่มต้นคือฝนตก
    const timelineSlider = document.getElementById('timeline-slider');

    if (rainAudio) {
        rainAudio.volume = 0.4; 
    }

    if (weatherBtn) {
        weatherBtn.addEventListener('click', () => {
            isRaining = !isRaining; 
            
            if (isRaining) {
                createRain();
                weatherBtn.textContent = '🌧️';
                if (rainAudio) rainAudio.play(); // 🔊 เปิดเสียงฝน
            } else {
                if (weatherOverlay) weatherOverlay.innerHTML = '';
                weatherBtn.textContent = '☀️';
                if (rainAudio) rainAudio.pause(); // 🔇 ปิดเสียงฝน
            }
        });
    }
    if (timelineSlider) {
        // แก้ไขโค้ดในจุดทำปุ่ม Timeline Slider (ภายในโปรแกรม DOMContentLoaded)
YEARS.forEach(year => {
    const item = document.createElement('div');
    item.className = 'timeline-item';
    item.innerHTML = `<button class="timeline-btn">${year}</button><div class="timeline-line"></div>`;
    
    item.querySelector('.timeline-btn').onclick = (e) => {
        document.querySelectorAll('.timeline-item').forEach(i => i.classList.remove('active-year'));
        item.classList.add('active-year');
        
        currentYear = year;
        renderThailandMap();
        
        if (selectedProvinceKey) {
            // ถ้าระบุเลือกจังหวัดคาไว้ ให้รีเฟรชข้อมูลจังหวัดเป็นของปีนั้นๆ
            showProvinceInfo(selectedProvinceKey, currentYear);
        } else {
            // ถ้ายังไม่ได้เลือกจังหวัด ให้แสดงภาพรวมระบบภูมิภาค
            updateTimelineData(currentYear);
        }
    };
    timelineSlider.appendChild(item);
});
        
        // เปิดใช้งานปีล่าสุดเป็นดีฟอลต์
        const items = document.querySelectorAll('.timeline-item');
        if (items.length > 0) {
            items[items.length - 1].classList.add('active-year');
            updateTimelineData(YEARS[YEARS.length - 1]);
        }
    }

   const scrollBtn = document.querySelector('.scroll-down-btn');
    if (scrollBtn) {
        scrollBtn.addEventListener('click', (e) => {
            e.preventDefault(); // ป้องกันการกระตุก
            
            // 🔊 เมื่อผู้ใช้คลิกเริ่มสำรวจ ให้เริ่มเล่นเสียงฝน (หลบเงื่อนไขเบราว์เซอร์บล็อกเสียง)
            if (isRaining && rainAudio) {
                rainAudio.play().catch(err => console.log("รอผู้ใช้ตอบสนองก่อนเล่นเสียง"));
            }

            const target = document.querySelector('#section-1');
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }
});

const scenarios = {
    'A': { text: "ถูกต้อง! ยาเป็นสิ่งสำคัญมากในสถานการณ์น้ำท่วมเพื่อป้องกันโรคทางน้ำ... ต่อไป ถ้าไฟดับ คุณจะทำอย่างไร?", choiceA: "จุดเทียน", choiceB: "ใช้ไฟฉายสำรอง" },
    'B': { text: "เอกสารสำคัญก็จำเป็น แต่ถ้าต้องเลือกระหว่างชีวิตกับทรัพย์สิน... ต่อไป ถ้าไฟดับ คุณจะทำอย่างไร?", choiceA: "จุดเทียน", choiceB: "ใช้ไฟฉายสำรอง" }
};

function nextScenario(choice) {
    const gameContent = document.getElementById('game-content');
    const result = scenarios[choice];
    gameContent.innerHTML = `
        <p style="font-size: 1.3rem; margin-bottom: 30px; color: #00d4ff;">${result.text}</p>
        <div class="choice-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <button class="game-btn" style="padding: 20px; border-radius: 15px; border: none; background: #333;">${result.choiceA}</button>
            <button class="game-btn" style="padding: 20px; border-radius: 15px; border: none; background: #333;">${result.choiceB}</button>
        </div>
    `;
}

