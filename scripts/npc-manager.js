const params = new URLSearchParams(window.location.search);
if (params.get("gm") !== "1") {
  document.body.innerHTML = "<h1>ACCESS DENIED</h1><p>This area requires Zeta level clearance.</p>";
}


function addNPC() {
    const template = document.querySelector('#npcTemplate');
    const content = document.querySelector('#content');
    const clone = template.content.firstElementChild.cloneNode(true);

    clone.querySelector('h3').textContent = "Unnamed NPC";
    clone.querySelector('.log').innerHTML = '';
    clone.querySelector('.init-result').textContent = "0";
    clone.querySelector('.hp-current').value = "40"; // Ensure starting HP

    content.appendChild(clone);
}


function rollInitiative(button) {
    const parent = button.closest('.npc-card');
    const base = parseInt(parent.querySelector('.ref').value) || 0;
    const mod = parseInt(prompt("Enter Combat Sense", "0")) || 0;
    const roll = Math.ceil(Math.random() * 10);
    const total = base + mod + roll;
    parent.querySelector('.init-result').textContent = total;
}

function applyDamage(button) {
    const card = button.closest('.npc-card');
    const dmg = parseInt(card.querySelector('.dmg-amount').value) || 0;
    const btm = parseInt(card.querySelector('.btm').value) || 0;
    const location = card.querySelector('.hit-loc').value;

    const spField = card.querySelector(`[name="sp-${location}"]`);
    const sp = parseInt(spField.value) || 0;

    const effectiveDmg = Math.max(0, dmg - sp - btm);

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

    // Prompt Stun Save if conditions are met
    if (dmg > 8 || effectiveDmg > 0) {
        const save = parseInt(card.querySelector('.save').value) || 0;
        const roll = Math.ceil(Math.random() * 10);
        const stunMod = Math.floor(hpField.value / 4) - 9;
        const passed = roll <= save + stunMod;

        setTimeout(() => {
            alert(`Stun Save: You rolled ${roll} vs save ${save + stunMod} (${save} + (${stunMod})). ${passed ? "PASS" : "FAIL"}`);
        }, 100);

        const log = card.querySelector('.log');
        const msg = `Hit ${location.toUpperCase()} for ${effectiveDmg} (Rolled ${roll} vs ${save}+${stunMod}) → ${passed ? 'PASS' : 'FAIL'}`;
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
