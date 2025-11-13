const params = new URLSearchParams(window.location.search);
if (params.get("gm") !== "1") {
  document.body.innerHTML = "<h1>ACCESS DENIED</h1><p>This area requires Zeta level clearance.</p>";
}

const roles = {
  Solo: { ability: "Combat Sense" },
  Netrunner: { ability: "Interface" },
  Cop: { ability: "Authority" },
  Nomad: { ability: "Family" },
  Techie: { ability: "Jury Rig" },
  Medtech: { ability: "Medical Tech" },
  Fixer: { ability: "Streetdeal" },
  Media: { ability: "Credibility" },
  Corporate: { ability: "Resources" },
  Rockerboy: { ability: "Charismatic Leadership" }
};

function setupRoleSkillDisplay(card, difficulty = "tough") {
  const roleSelect = card.querySelector('.role');
  const roleSkillDisplay = card.querySelector('.role-skill-display');

  const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  // Helper to get a number based on difficulty
  const diffToRange = {
    basic: [2, 5],
    tough: [4, 7],
    veteran: [6, 10]
  };

  const [min, max] = diffToRange[difficulty] || [3, 7];

  function updateRoleSkill() {
    const selected = roleSelect.value;
    const roleName = Object.keys(roles).find(r => r.toLowerCase() === selected.toLowerCase());
    const role = roles[roleName];

    if (role) {
      const level = rand(min, max);
      roleSkillDisplay.textContent = `${role.ability} ${level}`;
    } else {
      roleSkillDisplay.textContent = "";
    }
  }

  // Initialize and set up listener
  updateRoleSkill();
  roleSelect.addEventListener("change", updateRoleSkill);
}


let weaponData = [];
let weaponDataLoaded = false;
let deferredNpcGroup = null;
let cyberwareData = {};

fetch('data/cyberware.json')
  .then(res => res.json())
  .then(data => cyberwareData = data)
  .catch(err => console.error("Failed to load cyberware.json:", err));

let equipmentData = {};

fetch('data/equipment.json')
  .then(res => res.json())
  .then(data => equipmentData = data)
  .catch(err => console.error("Failed to load equipment.json:", err));

fetch('data/weapons.json')
  .then(response => response.json())
  .then(data => {
    weaponData = data;
    weaponDataLoaded = true;
    populateAllWeaponSelects();

    // If NPCs were loaded before weapons were ready, load them now
    if (deferredNpcGroup) {
      loadGroup(deferredNpcGroup);
      deferredNpcGroup = null;
    }
  })
  .catch(err => {
    console.error("Failed to load weapons.json:", err);
});

function populateWeaponSelect(card) {
  const select = card.querySelector('.weapon-select');
  const display = card.querySelector('.weapon-damage-display');

  weaponData.forEach(weapon => {
    const option = document.createElement("option");
    option.value = weapon.name;
    option.textContent = weapon.name;
    select.appendChild(option);
  });

  select.addEventListener("change", function () {
    const selected = weaponData.find(w => w.name === this.value);
    if (selected) {
      display.textContent = `Damage: ${selected.damage}, ROF: ${selected.rof}, Ammo: ${selected.ammo}`;
    } else {
      display.textContent = "";
    }
  });
}

function populateAllWeaponSelects() {
  document.querySelectorAll('.npc-card').forEach(card => {
    populateWeaponSelect(card);
  });
}

function generateName() {
  const pools = {
    western: {
      firstStart: ["Al", "Ben", "Car", "Dan", "El", "Fran", "Jen", "Mar", "Rob", "Sam", "Tom", "Wil", "Ash", "Kat", "Luc"],
      firstEnd: ["a", "an", "ie", "en", "on", "ar", "y", "o", "e", "us"],
      lastStart: ["Smith", "Brown", "Miller", "Wilson", "Carter", "Cooper", "Turner", "Hunter", "Mason", "Walker"],
      lastEnd: ["", "", "", "", "son", "er", "man"] // subtle variation
    },
    japanese: {
      firstStart: ["Aki", "Hiro", "Kazu", "Masa", "Nao", "Rin", "Sato", "Taka", "Yuki", "Ren", "Aya", "Kiyo"],
      firstEnd: ["", "ko", "shi", "ta", "mi", "ka", "ru"],
      lastStart: ["Tan", "Nak", "Suz", "Mor", "Fuj", "Kob", "Tak", "Yam", "Ino", "Kaw"],
      lastEnd: ["aka", "ashi", "ura", "yama", "moto", "zawa", "uchi", "da"]
    },
    latino: {
      firstStart: ["Ale", "Car", "Die", "Fer", "Isa", "Jav", "Lor", "Mig", "Nico", "Rafa", "San", "Tomi"],
      firstEnd: ["o", "a", "e", "i"],
      lastStart: ["Gar", "Rod", "Fern", "Gon", "Ram", "Tor", "Dia", "Men", "Var"],
      lastEnd: ["ez", "es", "o", "as", "ia", "ado"]
    },
    russian: {
      firstStart: ["Ale", "Mik", "Iv", "Nat", "Ser", "Vik", "Yel", "Tat", "Kir", "And"],
      firstEnd: ["a", "o", "i", "ei", "ya", "an", "y"],
      lastStart: ["Petro", "Ivan", "Volk", "Moroz", "Dimitr", "Kuzn", "Baran", "Nov"],
      lastEnd: ["ov", "ev", "in", "ski", "ovitch"]
    },
    street: {
      firstStart: ["Zero", "Jinx", "Echo", "Razor", "Crash", "Moth", "Pulse", "Nova", "Chrome", "Wisp", "Grin", "Ash", "Lock"],
      firstEnd: [""],
      lastStart: ["", "", "", "", "X", "9", "99", "13", "One", "Chrome", "Ghost"],
      lastEnd: [""]
    }
  };

  const types = Object.keys(pools);
  const type = types[Math.floor(Math.random() * types.length)];
  const p = pools[type];

  const first =
    p.firstStart[Math.floor(Math.random() * p.firstStart.length)] +
    p.firstEnd[Math.floor(Math.random() * p.firstEnd.length)];

  const last =
    p.lastStart[Math.floor(Math.random() * p.lastStart.length)] +
    p.lastEnd[Math.floor(Math.random() * p.lastEnd.length)];

  // 20% chance of using just one name for style
  if (Math.random() < 0.2) return first;

  return `${first} ${last}`;
}

function calculateBTM(body) {
  if (body >= 11) return -5;
  if (body === 10) return -4;
  if (body >= 8) return -3;
  if (body >= 5) return -2;
  if (body >= 3) return -1;
  if (body === 2) return 0;
  return 0;
}

function setupBTMAutoCalc(card) {
  const bodyInput = card.querySelector('.body');
  const btmInput = card.querySelector('.btm');

  bodyInput.addEventListener('input', () => {
    const bodyVal = parseInt(bodyInput.value) || 0;
    btmInput.value = calculateBTM(bodyVal);
  });
}

function addNPC() {
    const template = document.querySelector('#npcTemplate');
    const content = document.querySelector('#content');
    const clone = template.content.firstElementChild.cloneNode(true);

    clone.querySelector('h3').textContent = "Unnamed NPC";
    clone.querySelector('.log').innerHTML = '';
    clone.querySelector('.skill-list').value = "";
    clone.querySelector('.hp-current').value = "40"; // Ensure starting HP

    content.appendChild(clone);

    const nameField = clone.querySelector('h3[contenteditable="true"]');

    // Focus and select all the content
    nameField.focus();

    // Select text after a slight delay to ensure focus is set
    setTimeout(() => {
        const range = document.createRange();
        range.selectNodeContents(nameField);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    }, 10);

    populateWeaponSelect(clone); // To populate weapon options on this new card
    setupBTMAutoCalc(clone);
    setupRoleSkillDisplay(clone);

}

function shootWeapon(button, mode) {
    const card = button.closest('.npc-card');
    const ammoField = card.querySelector('.ammo');
    let ammo = parseInt(ammoField.value) || 0;
    const weaponName = card.querySelector('.weapon-select').value || "weapon";
    const log = card.querySelector('.log');

    let shots = 1;

    if (mode === 3) {
        shots = 3; // burst fire
    } else if (mode === "auto") {
        // Ask GM how many rounds to dump
        shots = parseInt(prompt("Enter number of rounds for full auto:", "10")) || 0;
    }

    if (ammo >= shots) {
        ammoField.value = ammo - shots;
        log.innerHTML += `Fired ${shots} round(s) from ${weaponName} → Ammo left: ${ammo - shots}<br>`;
    } else {
        log.innerHTML += `CLICK! (${weaponName} is out of ammo)<br>`;
    }
}

function applyDamage(button) {
    const card = button.closest('.npc-card');
    const dmg = parseInt(card.querySelector('.dmg-amount').value) || 0;
    const btm = parseInt(card.querySelector('.btm').value) || 0;
    const location = card.querySelector('.hit-loc').value;

    const spField = card.querySelector(`[name="sp-${location}"]`);
    const sp = parseInt(spField.value) || 0;

    let effectiveDmg = dmg - sp + btm;

    // If it penetrates armor but damage goes ≤ 0, it still counts as 1
    if (dmg > sp) {
        effectiveDmg = Math.max(1, effectiveDmg);

        // ✅ Headshots deal *double* damage once armor is bypassed
        if (location === "head") {
            effectiveDmg *= 2;
        }
    } else {
        // No penetration → damage reduced to 0 minimum
        effectiveDmg = Math.max(0, effectiveDmg);
    }

    // Update SP if it absorbed some
    if (dmg > sp) {
        spField.value = Math.max(0, sp - (dmg - btm));
    }

    // Subtract from HP
    const hpField = card.querySelector('.hp-current');
    const hp = parseInt(hpField.value) || 0;
    hpField.value = Math.max(0, hp - effectiveDmg);

    // Armor reduction if damage penetrated
    if (effectiveDmg > 0) {
        spField.value = Math.max(0, sp - 2); // reduces by 2 if penetrates
    } else {
        spField.value = Math.max(0, sp - 1); // reduces by 1 if hits
    }

    // Prompt death save if conditions are met
    if (Math.floor(hpField.value) < 28 && effectiveDmg > 0) {
        const save = parseInt(card.querySelector('.save').value) || 0;
        const roll = Math.ceil(Math.random() * 10);
        const deathMod = Math.floor(hpField.value / 4) - 6;
        const passed = roll <= save + deathMod;

        const log = card.querySelector('.log');
        const msg = `Death Save: Hit ${location.toUpperCase()} for ${effectiveDmg} (Rolled ${roll} vs ${save}+${deathMod}) → ${passed ? 'PASS' : 'DIED'}`;
        log.innerHTML += msg + '<br>';

        if (!passed) {
          const nameField = card.querySelector('h3');
          if (!nameField.textContent.includes('(DEAD)')) {
            nameField.textContent += ' (DEAD)';
            card.style.opacity = "0.6";
            card.style.filter = "grayscale(100%)";
          }
        }

    }

    // Prompt Stun Save if conditions are met
    if (dmg > 8 || effectiveDmg > 0) {
        const save = parseInt(card.querySelector('.save').value) || 0;
        const roll = Math.ceil(Math.random() * 10);
        const stunMod = Math.floor(hpField.value / 4) - 9;
        const passed = roll <= save + stunMod;

        // setTimeout(() => {
        //     alert(`Stun Save: You rolled ${roll} vs save ${save + stunMod} (${save} + (${stunMod})). ${passed ? "PASS" : "FAIL"}`);
        // }, 100);

        const log = card.querySelector('.log');
        const msg = `Stun Save: Hit ${location.toUpperCase()} for ${effectiveDmg} (Rolled ${roll} vs ${save}+${stunMod}) → ${passed ? 'PASS' : 'FAIL'}`;
        log.innerHTML += msg + '<br>';
    }

}

function deleteNPC(button) {
    const card = button.closest('.npc-card');
    card.remove();
}

function copyNPC(button) {
    const card = button.closest('.npc-card');
    const clone = card.cloneNode(true);
    document.querySelector('#content').appendChild(clone);
}

function saveGroup() {
    const npcCards = document.querySelectorAll('.npc-card');
    const npcData = [];

    npcCards.forEach(card => {
        const data = {
            name: card.querySelector('h3').textContent,
            role: card.querySelector('.role').value,
            roleSkill: card.querySelector('.role-skill-display').textContent,
            int: card.querySelector('.int').value,
            ref: card.querySelector('.ref').value,
            tech: card.querySelector('.tech').value,
            cool: card.querySelector('.cool').value,
            attr: card.querySelector('.attr').value,
            luck: card.querySelector('.luck').value,
            ma: card.querySelector('.ma').value,
            body: card.querySelector('.body').value,
            emp: card.querySelector('.emp').value,
            save: card.querySelector('.save').value,
            btm: card.querySelector('.btm').value,
            sp: {
                head: card.querySelector('[name="sp-head"]').value,
                torso: card.querySelector('[name="sp-torso"]').value,
                rarm: card.querySelector('[name="sp-rarm"]').value,
                larm: card.querySelector('[name="sp-larm"]').value,
                rleg: card.querySelector('[name="sp-rleg"]').value,
                lleg: card.querySelector('[name="sp-lleg"]').value
            },
            hp: card.querySelector('.hp-current').value,
            weapon: card.querySelector('.weapon-select').value,
            ammo: card.querySelector('.ammo').value,
            equipment: card.querySelector('.equipment-list').value,
            cyberware: card.querySelector('.cyberware-list').value,
            skills: card.querySelector('.skill-list').value,
            lifepath: card.querySelector('.lifepath-list').value
        };

        npcData.push(data);
    });

    const blob = new Blob([JSON.stringify(npcData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'npc-group.json';
    a.click();

    URL.revokeObjectURL(url); // clean up
}

document.getElementById('loadGroupInput').addEventListener('change', function(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const npcGroup = JSON.parse(e.target.result);
      if (weaponDataLoaded) {
        loadGroup(npcGroup);
      } else {
        deferredNpcGroup = npcGroup;
      }
    } catch (err) {
      alert('Invalid file format!');
      console.error(err);
    }
  };
  reader.readAsText(file);
});

function loadGroup(npcGroup) {
    const container = document.getElementById('content');
    container.innerHTML = ''; // Clear existing cards

    npcGroup.forEach(npc => {
        const template = document.getElementById('npcTemplate');
        const clone = template.content.cloneNode(true);
        const card = clone.querySelector('.npc-card');

        card.querySelector('h3').textContent = npc.name || 'Unnamed NPC';
        card.querySelector('.role').value = npc.role || 'solo';
        card.querySelector('.role-skill-display').textContent = npc.roleSkill || '';
        card.querySelector('.int').value = npc.int || '';
        card.querySelector('.ref').value = npc.ref || '';
        card.querySelector('.tech').value = npc.tech || '';
        card.querySelector('.cool').value = npc.cool || '';
        card.querySelector('.attr').value = npc.attr || '';
        card.querySelector('.luck').value = npc.luck || '';
        card.querySelector('.ma').value = npc.ma || '';
        card.querySelector('.body').value = npc.body || '';
        card.querySelector('.emp').value = npc.emp || '';
        card.querySelector('.save').value = npc.save || '';
        card.querySelector('.btm').value = npc.btm || '';
        card.querySelector('[name="sp-head"]').value = npc.sp?.head || '';
        card.querySelector('[name="sp-torso"]').value = npc.sp?.torso || '';
        card.querySelector('[name="sp-rarm"]').value = npc.sp?.rarm || '';
        card.querySelector('[name="sp-larm"]').value = npc.sp?.larm || '';
        card.querySelector('[name="sp-rleg"]').value = npc.sp?.rleg || '';
        card.querySelector('[name="sp-lleg"]').value = npc.sp?.lleg || '';
        card.querySelector('.hp-current').value = npc.hp || '40';
        card.querySelector('.ammo').value = npc.ammo || '';
        card.querySelector('.equipment-list').value = npc.equipment || '';
        card.querySelector('.cyberware-list').value = npc.cyberware || '';
        card.querySelector('.skill-list').value = npc.skills || '';
        card.querySelector('.lifepath-list').value = npc.lifepath || '';

        // Append first to ensure DOM access
        container.appendChild(clone);

        // Populate weapon select and set value
        populateWeaponSelect(card);
        const weaponSelect = card.querySelector('.weapon-select');
        weaponSelect.value = npc.weapon || '';
        weaponSelect.dispatchEvent(new Event("change")); // ✅ Trigger change to update display

        setupBTMAutoCalc(card);
        setupRoleSkillDisplay(card);

    });
}

// === AUTO SAVE / AUTO RESTORE ===

// Save current NPCs to localStorage whenever they change
function autoSaveNPCs() {
  const npcCards = document.querySelectorAll('.npc-card');
  const npcData = [];

  npcCards.forEach(card => {
    const data = {
      name: card.querySelector('h3').textContent,
      role: card.querySelector('.role').value,
      roleSkill: card.querySelector('.role-skill-display').textContent,
      int: card.querySelector('.int').value,
      ref: card.querySelector('.ref').value,
      tech: card.querySelector('.tech').value,
      cool: card.querySelector('.cool').value,
      attr: card.querySelector('.attr').value,
      luck: card.querySelector('.luck').value,
      ma: card.querySelector('.ma').value,
      body: card.querySelector('.body').value,
      emp: card.querySelector('.emp').value,
      save: card.querySelector('.save').value,
      btm: card.querySelector('.btm').value,
      hp: card.querySelector('.hp-current').value,
      ammo: card.querySelector('.ammo').value,
      skills: card.querySelector('.skill-list').value,
      cyberware: card.querySelector('.cyberware-list').value,
      equipment: card.querySelector('.equipment-list').value,
      lifepath: card.querySelector('.lifepath-list').value,
      sp: {
        head: card.querySelector('[name="sp-head"]').value,
        torso: card.querySelector('[name="sp-torso"]').value,
        rarm: card.querySelector('[name="sp-rarm"]').value,
        larm: card.querySelector('[name="sp-larm"]').value,
        rleg: card.querySelector('[name="sp-rleg"]').value,
        lleg: card.querySelector('[name="sp-lleg"]').value
      }
    };
    npcData.push(data);
  });

  localStorage.setItem("npcGroupAutoSave", JSON.stringify(npcData));
}

// Auto-save every 30 seconds
setInterval(autoSaveNPCs, 30000);

// Also save when leaving page
window.addEventListener("beforeunload", autoSaveNPCs);

// Auto-load from localStorage on startup
window.addEventListener("DOMContentLoaded", () => {
  const saved = localStorage.getItem("npcGroupAutoSave");
  if (saved) {
    const npcGroup = JSON.parse(saved);
    if (npcGroup.length > 0) {
      loadGroup(npcGroup);
    }
  }
});

function deleteAllNPCs() {
  if (confirm("Delete all NPCs? This cannot be undone.")) {
    document.getElementById("content").innerHTML = "";
    localStorage.removeItem("npcGroupAutoSave");
  }
}

function getRandomCyberware(difficulty) {
  if (!cyberwareData || Object.keys(cyberwareData).length === 0) return "";

  const limits = {
    basic:   { Fashionware: [0, 2], Neuralware: [0, 1], Implants: [0, 1], Cyberoptic: [0, 1], Cyberaudio: [0, 1], Cyberarm: [0, 2], Cyberhand: [0, 1], Cyberleg: [0, 2], Cyberfoot: [0, 1] },
    tough:   { Fashionware: [0, 3], Neuralware: [0, 2], Implants: [0, 2], Cyberoptic: [0, 2], Cyberaudio: [0, 2], Cyberarm: [0, 2], Cyberhand: [0, 2], Cyberleg: [0, 2], Cyberfoot: [0, 2], BodyPlating: [0, 1] },
    veteran: { Fashionware: [0, 3], Neuralware: [0, 3], Implants: [0, 2], Cyberoptic: [0, 3], Cyberaudio: [0, 3], Cyberarm: [0, 2], Cyberhand: [0, 2], Cyberleg: [0, 2], Cyberfoot: [0, 2], LinearFrame: [0, 1], BodyPlating: [0, 2] },
  };

  const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const limit = limits[difficulty] || limits.basic;

  const expRandom = (max) => {
    // exponential bias toward 0
    const r = Math.random();
    // makes small values much more common
    return Math.floor(Math.pow(r, 2.5) * (max + 1));
  };

  const chosen = {};
  const chosenText = [];

  // 1️⃣ Pick core cyberware first
  for (const [category, range] of Object.entries(limit)) {
    const [min, max] = range;
    const options = [...(cyberwareData[category] || [])];
    const picks = [];

    // roll exponentially biased number in the range
    const count = Math.min(max, expRandom(max));

    console.log(count)
    for (let i = 0; i < count && options.length > 0; i++) {
      const index = rand(0, options.length - 1);
      picks.push(options.splice(index, 1)[0]);
    }

    if (picks.length > 0) {
      chosen[category] = picks;
      chosenText.push(`${category}: ${picks.join(", ")}`);
    }
  }

  // 2️⃣ Built-ins appear *only* if Cyberarm or Cyberleg exists
  const hasArm = !!chosen["Cyberarm"];
  const hasLeg = !!chosen["Cyberleg"];

  if (hasArm || hasLeg) {
    const builtIns = cyberwareData["Built-ins"] || [];
    const builtWeapons = cyberwareData["Built-in-weapons"] || [];

    // tougher NPCs have higher chance of built-ins
    const chance = { basic: 0.25, tough: 0.5, veteran: 0.75 }[difficulty] || 0.25;

    if (Math.random() < chance) {
      const count = rand(0, hasArm && hasLeg ? 2 : 1);
      const picks = [];
      for (let i = 0; i < count; i++) {
        picks.push(builtIns[rand(0, builtIns.length - 1)]);
      }
      chosenText.push(`Built-ins: ${picks.join(", ")}`);
    }

    // built-in weapons rarer
    if (Math.random() < chance / 2) {
      const count = rand(0, 1);
      const picks = [];
      for (let i = 0; i < count; i++) {
        picks.push(builtWeapons[rand(0, builtWeapons.length - 1)]);
      }
      if (picks.length > 0) chosenText.push(`Built-in Weapons: ${picks.join(", ")}`);
    }
  }

  return chosenText.join("\n");
}

function getRandomEquipment(difficulty, roleName = "") {
  if (!equipmentData || Object.keys(equipmentData).length === 0) return "";

  const limits = {
    basic:   { Fashion: [0, 2], Tools: [0, 1], PersonalElectronics: [0, 1], DataSystems: [0, 1], Communications: [0, 1], Surveillance: [0, 1], Medical: [0, 1], Furnishings: [0, 1] },
    tough:   { Fashion: [0, 2], Tools: [0, 2], PersonalElectronics: [0, 2], DataSystems: [0, 2], Communications: [0, 2], Surveillance: [0, 2], Medical: [0, 2], Furnishings: [0, 2], Lifestyle: [0, 1] },
    veteran: { Fashion: [0, 3], Tools: [0, 3], PersonalElectronics: [0, 3], DataSystems: [0, 3], Communications: [0, 3], Surveillance: [0, 3], Medical: [0, 3], Lifestyle: [0, 1] },
  };

  const limit = limits[difficulty] || limits.basic;
  const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  // Exponential bias to make "no equipment" common
  const expRandom = (max) => Math.floor(Math.pow(Math.random(), 2.5) * (max + 1));

  const chosenText = [];

  for (const [category, range] of Object.entries(limit)) {
    const [min, max] = range;
    const options = [...(equipmentData[category] || [])];
    const picks = [];

    // exponentially biased toward 0
    const count = Math.min(max, expRandom(max));

    for (let i = 0; i < count && options.length > 0; i++) {
      const index = rand(0, options.length - 1);
      picks.push(options.splice(index, 1)[0]);
    }

    if (picks.length > 0) {
      if (category === "Fashion") {
        // ✅ Always choose exactly one fashion style
        const singlePick = picks[rand(0, picks.length - 1)];
        chosenText.push(`Fashion: ${singlePick}`);
      } else {
        chosenText.push(`${category}: ${picks.join(", ")}`);
      }
    }
  }

  // 🎯 Optional role-based tweaks
  if (/medtech/i.test(roleName) && Math.random() < 0.6) {
    const med = equipmentData["Medical"] || [];
    const pick = med[rand(0, med.length - 1)];
    chosenText.push(`Medical (Bonus): ${pick}`);
  }

  if (/tech/i.test(roleName) && Math.random() < 0.6) {
    const tools = equipmentData["Tools"] || [];
    const pick = tools[rand(0, tools.length - 1)];
    chosenText.push(`Tools (Bonus): ${pick}`);
  }

  if (/netrunner/i.test(roleName) && Math.random() < 0.6) {
    const data = equipmentData["DataSystems"] || [];
    const pick = data[rand(0, data.length - 1)];
    chosenText.push(`DataSystems (Bonus): ${pick}`);
  }

  if (/cop|nomad/i.test(roleName) && Math.random() < 0.6) {
    const comms = equipmentData["Communications"] || [];
    const pick = comms[rand(0, comms.length - 1)];
    chosenText.push(`Communications (Bonus): ${pick}`);
  }

  return chosenText.join("\n");
}

function generateRandomNPC(difficulty, roleName) {
    let range;
    switch (difficulty) {
        case "basic":
            range = [2, 5];
            break;
        case "tough":
            range = [4, 7];
            break;
        case "veteran":
            range = [6, 10];
            break;
        default:
            range = [2, 10];
    }

    // helper function
    const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    // Pick a random role if not specified
    const role = roleName && roles[roleName] ? roles[roleName] : Object.values(roles)[rand(0, Object.keys(roles).length - 1)];
    const roleKey = roleName || Object.keys(roles).find(r => roles[r] === role);

    const npc = {
        name: `${generateName()} (${difficulty.toUpperCase()})`,
        role: roleKey,
        int: rand(...range),
        ref: rand(...range),
        tech: rand(...range),
        cool: rand(...range),
        attr: rand(...range),
        luck: rand(...range),
        ma: rand(...range),
        body: rand(...range),
        emp: rand(...range),
        save: 0,
        btm: 0,
        sp: {
            head: rand(0, 20),
            torso: rand(0, 20),
            rarm: rand(0, 20),
            larm: rand(0, 20),
            rleg: rand(0, 20),
            lleg: rand(0, 20)
        },
        hp: 40,
        weapon: weaponData.length ? weaponData[rand(0, weaponData.length - 1)].name : "Unarmed",
        ammo: 10 + rand(0, 20),
        equipment: getRandomEquipment(difficulty, roleKey),
        cyberware: getRandomCyberware(difficulty),
        skills: `Awareness ${rand(...range)}, Handgun ${rand(...range)}, Brawling ${rand(...range)}, Melee ${rand(...range)}, Athletics ${rand(...range)}, Rifle ${rand(...range)}, SMG ${rand(...range)}, Stealth ${rand(...range)}, Personal Grooming ${rand(...range)}, Style ${rand(...range)}, Streetwise ${rand(...range)}, Dodge ${rand(...range)}`,
        lifepath: ""
    };

    npc.btm = calculateBTM(npc.body);
    return npc;
}

function createRandomNPC(level) {
    const npc = generateRandomNPC(level);
    const template = document.querySelector('#npcTemplate');
    const clone = template.content.firstElementChild.cloneNode(true);
    const card = clone;

    // Fill in random NPC data
    card.querySelector('h3').textContent = npc.name;
    card.querySelector('.int').value = npc.int;
    card.querySelector('.ref').value = npc.ref;
    card.querySelector('.tech').value = npc.tech;
    card.querySelector('.cool').value = npc.cool;
    card.querySelector('.attr').value = npc.attr;
    card.querySelector('.luck').value = npc.luck;
    card.querySelector('.ma').value = npc.ma;
    card.querySelector('.body').value = npc.body;
    card.querySelector('.emp').value = npc.emp;
    card.querySelector('.save').value = npc.body;
    card.querySelector('.btm').value = npc.btm;

    // Armor
    for (const [loc, val] of Object.entries(npc.sp)) {
        card.querySelector(`[name="sp-${loc}"]`).value = val;
    }

    card.querySelector('.hp-current').value = npc.hp;
    card.querySelector('.ammo').value = npc.ammo;
    card.querySelector('.weapon-select').value = npc.weapon;
    card.querySelector('.skill-list').value = npc.skills;
    card.querySelector('.equipment-list').value = npc.equipment;
    card.querySelector('.cyberware-list').value = npc.cyberware;

    const roleSelect = card.querySelector('.role');
    roleSelect.value = npc.role.toLowerCase();

    populateWeaponSelect(card);
    setupBTMAutoCalc(card);
    setupRoleSkillDisplay(card, level);

    document.querySelector('#content').appendChild(clone);
}
