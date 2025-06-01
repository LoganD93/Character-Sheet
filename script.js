const spdInput = document.getElementById('spd');
const hpInput = document.getElementById('hp');
const mpInput = document.getElementById('mp');
const spInput = document.getElementById('sp');
const strInput = document.getElementById('str');
const dexInput = document.getElementById('dex');
const aglInput = document.getElementById('agl');
const wisInput = document.getElementById('wis');
const perInput = document.getElementById('per');
const chaInput = document.getElementById('cha');
const fortInput = document.getElementById('fort');
const refInput = document.getElementById('ref');
const willInput = document.getElementById('will');

function getStatTotal(statName) {
  const baseEl = document.getElementById(statName);
  const bonusEl = document.getElementById(`${statName}-bonus`);
  
  const base = baseEl && baseEl.value !== "" ? parseFloat(baseEl.value) : 0;
  const bonus = bonusEl && bonusEl.value !== "" ? parseFloat(bonusEl.value) : 0;
  
  return base + bonus;
}
function getStatBonus(statName) {
  const bonusEl = document.getElementById(`${statName}-bonus`);
  return bonusEl && bonusEl.value !== "" ? parseFloat(bonusEl.value) : 0;
}
function updateHP() {
  const totalCon = getStatTotal("con");
  const hp = (totalCon * 10 + 10).toFixed(0);
  document.getElementById("hp").value = hp;
}

function updateMP() {
  const totalWis = getStatTotal("wis");
  const mp = (totalWis * 10).toFixed(0);
  document.getElementById("mp").value = mp;
}

function updateSP() {
  const totalCon = getStatTotal("con");
  const sp = (totalCon * 10).toFixed(0);
  document.getElementById("sp").value = sp;
}
function updateSPD() {
  const totalAgl = getStatTotal("agl");
  const spd = (Math.floor(totalAgl) * 5 + 25).toFixed(0);
  document.getElementById("spd").value = spd;
}

function updateFORT() {
  const totalCon = getStatTotal("con");
  const totalStr = getStatTotal("str");
  const fortBonus = getStatBonus("fort");
  const fort = Math.floor(((totalCon + totalStr) / 2) + fortBonus);
  document.getElementById("fort").value = fort;
}
function updateREF() {
  const totalDex = getStatTotal("dex");
  const totalAgl = getStatTotal("agl");
  const refBonus = getStatBonus("ref");
  const ref = Math.floor(((totalDex + totalAgl) / 2) + refBonus); // Round down
  document.getElementById("ref").value = ref;
}
function updateWILL() {
  const totalWis = getStatTotal("wis");
  const totalPer = getStatTotal("per");
  const totalCha = getStatTotal("cha");
  const willBonus = getStatBonus("will");
  const will = Math.floor(((totalWis + totalPer + totalCha) / 3) + willBonus); // Round down
  document.getElementById("will").value = will;
}



function updateDerivedStats() {
  updateHP();
  updateMP();
  updateSP();
  updateSPD();
  updateFORT();
  updateREF();
  updateWILL();
}




function makeDraggable(el) {
  let offsetX, offsetY, isDragging = false;

  el.addEventListener('mousedown', function (e) {
    isDragging = true;
    offsetX = e.clientX - el.offsetLeft;
    offsetY = e.clientY - el.offsetTop;
    el.style.zIndex = 1000;
  });

  window.addEventListener('mousemove', function (e) {
    if (!isDragging) return;
    el.style.left = (e.clientX - offsetX) + 'px';
    el.style.top = (e.clientY - offsetY) + 'px';
  });

  window.addEventListener('mouseup', function () {
    if (isDragging) {
      isDragging = false;
      console.log(`${el.id} => top: ${el.style.top}, left: ${el.style.left}`);
    }
  });
}

function formatStatTotal(baseId, bonusId, displayId) {
  const baseVal = document.getElementById(baseId).value;
  const bonusVal = document.getElementById(bonusId).value;
  const base = baseVal === "" ? 0 : parseFloat(baseVal);
  const bonus = bonusVal === "" ? 0 : parseFloat(bonusVal);
  const total = base + bonus;

  const whole = Math.trunc(total); // ✅ handles negative correctly
  const decimal = (Math.abs(total - whole)).toFixed(1).replace(/^0/, '');

  document.getElementById(displayId).innerHTML =
    `<span class="whole">${whole}</span><span class="decimal">${decimal}</span>`;
}

function updateFormattedStats() {
  formatStatTotal("str", "str-bonus", "str-total");
  formatStatTotal("dex", "dex-bonus", "dex-total");
  formatStatTotal("agl", "agl-bonus", "agl-total");
  formatStatTotal("con", "con-bonus", "con-total");
  formatStatTotal("wis", "wis-bonus", "wis-total");
  formatStatTotal("per", "per-bonus", "per-total");
  formatStatTotal("cha", "cha-bonus", "cha-total");
}

// Attach listeners to formatted stats
["str", "dex", "agl", "con", "wis", "per", "cha"].forEach(stat => {
  document.getElementById(stat).addEventListener("input", () => {
    updateFormattedStats();
    updateDerivedStats(); // still run your hp/mp/sp logic
  });
  document.getElementById(`${stat}-bonus`).addEventListener("input", () => {
    updateFormattedStats();
    updateDerivedStats();
  });
	document.getElementById("fort-bonus").addEventListener("input", updateDerivedStats);
	document.getElementById("ref-bonus").addEventListener("input", updateDerivedStats);
	document.getElementById("will-bonus").addEventListener("input", updateDerivedStats);
});

// Ensure both types of updates run on load
window.addEventListener("load", () => {
  updateDerivedStats();
  updateFormattedStats();
});

makeDraggable(con);
makeDraggable(hpInput);

document.getElementById("download-json").addEventListener("click", () => {
  const data = getCharacterData();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "character.json";
  a.click();
  URL.revokeObjectURL(url);
});

document.getElementById("upload-json").addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = e => {
    try {
      const json = JSON.parse(e.target.result);
      setCharacterData(json);
    } catch (err) {
      alert("Invalid JSON file.");
    }
  };
  reader.readAsText(file);
});
function getCharacterData() {
  const statIds = [
    "spd", "hp", "mp", "sp",
    "str", "str-bonus", "dex", "dex-bonus",
    "agl", "agl-bonus", "con", "con-bonus",
    "wis", "wis-bonus", "per", "per-bonus",
    "cha", "cha-bonus",
    "fort-bonus", "ref-bonus", "will-bonus",
    "hpedit", "mpedit", "spedit", "xpedit",
    "dr", "mr",
    "player-name", "char-name",
    "BGperk", "attribute", "inventory"
  ];

  const data = {};

  statIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) data[id] = el.value;
  });

  // Save skills table
  const skillsTable = document.getElementById("skills-table");
  if (skillsTable) {
    data.skillsTable = [];
    Array.from(skillsTable.querySelectorAll("tbody tr")).forEach(row => {
      const cells = Array.from(row.querySelectorAll("td"));
      data.skillsTable.push(cells.map(cell => cell.textContent.trim()));
    });
  }

  // Save spells table
  const spellsTable = document.getElementById("spells-table");
  if (spellsTable) {
    data.spellsTable = [];
    Array.from(spellsTable.querySelectorAll("tbody tr")).forEach(row => {
      const cells = Array.from(row.querySelectorAll("td"));
      data.spellsTable.push(cells.map(cell => cell.textContent.trim()));
    });
  }

  return data;
}

function setCharacterData(data) {
  for (const id in data) {
    const el = document.getElementById(id);
    if (el && typeof data[id] === "string") {
      el.value = data[id];
    }
  }

  // Restore skills table
  if (Array.isArray(data.skillsTable)) {
    const table = document.getElementById("skills-table");
    const tbody = table.querySelector("tbody");
    tbody.innerHTML = ""; // Clear existing rows
    data.skillsTable.forEach(rowData => {
      const tr = document.createElement("tr");
      rowData.forEach(cellData => {
        const td = document.createElement("td");
        td.contentEditable = "true";
        td.textContent = cellData;
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
  }

  // Restore spells table
  if (Array.isArray(data.spellsTable)) {
    const table = document.getElementById("spells-table");
    const tbody = table.querySelector("tbody");
    tbody.innerHTML = ""; // Clear existing rows
    data.spellsTable.forEach(rowData => {
      const tr = document.createElement("tr");
      rowData.forEach(cellData => {
        const td = document.createElement("td");
        td.contentEditable = "true";
        td.textContent = cellData;
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
  }

  updateFormattedStats();
  updateDerivedStats();
}
