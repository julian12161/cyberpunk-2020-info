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

    // Prompt death save if conditions are met
    if (Math.floor(hpField.value) < 28 && effectiveDmg > 0) {
        const save = parseInt(card.querySelector('.save').value) || 0;
        const roll = Math.ceil(Math.random() * 10);
        const deathMod = Math.floor(hpField.value / 4) - 6;
        const passed = roll <= save + deathMod;

        const log = card.querySelector('.log');
        const msg = `Death Save: Hit ${location.toUpperCase()} for ${effectiveDmg} (Rolled ${roll} vs ${save}+${deathMod}) → ${passed ? 'PASS' : 'DIED'}`;
        log.innerHTML += msg + '<br>';

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
            weapon: card.querySelector('.weapon-name').value,
            ammo: card.querySelector('.ammo').value,
            initiative: card.querySelector('.init-result').textContent
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
        const contents = e.target.result;
        try {
            const npcGroup = JSON.parse(contents);
            loadGroup(npcGroup);
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
        card.querySelector('.int').value = npc.int || '';
        card.querySelector('.ref').value = npc.ref || '';
        card.querySelector('.tech').value = npc.ref || '';
        card.querySelector('.cool').value = npc.ref || '';
        card.querySelector('.attr').value = npc.ref || '';
        card.querySelector('.luck').value = npc.ref || '';
        card.querySelector('.ma').value = npc.ref || '';
        card.querySelector('.body').value = npc.ref || '';
        card.querySelector('.emp').value = npc.ref || '';
        card.querySelector('.save').value = npc.save || '';
        card.querySelector('.btm').value = npc.btm || '';
        card.querySelector('[name="sp-head"]').value = npc.sp?.head || '';
        card.querySelector('[name="sp-torso"]').value = npc.sp?.torso || '';
        card.querySelector('[name="sp-rarm"]').value = npc.sp?.rarm || '';
        card.querySelector('[name="sp-larm"]').value = npc.sp?.larm || '';
        card.querySelector('[name="sp-rleg"]').value = npc.sp?.rleg || '';
        card.querySelector('[name="sp-lleg"]').value = npc.sp?.lleg || '';
        card.querySelector('.hp-current').value = npc.hp || '40';
        card.querySelector('.weapon-name').value = npc.weapon || '';
        card.querySelector('.ammo').value = npc.ammo || '';
        card.querySelector('.init-result').textContent = npc.initiative || '0';

        container.appendChild(clone);
    });
}
