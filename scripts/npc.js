const params = new URLSearchParams(window.location.search);
const npcName = params.get("name");

fetch("/data/NPCs.json")
  .then(res => res.json())
  .then(npcs => {
    const npc = npcs[npcName];
    if (!npc) {
      document.querySelector("#content").innerHTML = `<p>No NPC found for "${npcName}"</p>`;
      return;
    }

    // Page title
    document.querySelector("header h1").textContent = `${npcName} (${npc.handle})`;

    // Handle + Role
    document.getElementById("handle").textContent = npc.handle || "";
    document.getElementById("role").textContent = npc.role || "";

    // Stats
    for (const [key, val] of Object.entries(npc.stats || {})) {
      const strongs = document.querySelectorAll("#stats li strong");
      const match = [...strongs].find(el => el.textContent.replace(":", "") === key);
      if (match) match.parentNode.innerHTML = `<strong>${key}:</strong> ${val}`;
    }

    // Skills + Cybernetics
    document.getElementById("skills").textContent = npc.skills || "";
    document.getElementById("cybernetics").textContent = npc.cybernetics || "";

    // Style
    for (const [key, val] of Object.entries(npc.style || {})) {
      const strongs = document.querySelectorAll("#style li strong");
      const match = [...strongs].find(el => el.textContent.replace(":", "") === key);
      if (match) match.parentNode.innerHTML = `<strong>${key}:</strong> ${val}`;
    }

    // Family Background
    document.getElementById("familyBackground").textContent = npc.familyBackground || "";

    // Siblings
    for (const [key, val] of Object.entries(npc.siblings || {})) {
      const strongs = document.querySelectorAll("#siblings li strong");
      const match = [...strongs].find(el => el.textContent.replace(":", "") === key);
      if (match) match.parentNode.innerHTML = `<strong>${key}:</strong> ${val}`;
    }

    // Motivations
    for (const [key, val] of Object.entries(npc.motivations || {})) {
      const strongs = document.querySelectorAll("#motivations li strong");
      const match = [...strongs].find(el => el.textContent.replace(":", "") === key);
      if (match) match.parentNode.innerHTML = `<strong>${key}:</strong> ${val}`;
    }

    // Life Events
    const lifeEventsUl = document.getElementById("lifeEvents");
    (npc.lifeEvents || []).forEach(ev => {
      const li = document.createElement("li");
      li.textContent = ev;
      lifeEventsUl.appendChild(li);
    });

    // Weapons
    const tbody = document.getElementById("weaponsTable");
    (npc.weapons || []).forEach(w => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${w.name}</td>
        <td>${w.type}</td>
        <td>${w.wa}</td>
        <td>${w.conc}</td>
        <td>${w.avail}</td>
        <td>${w.dam}</td>
        <td>${w.shots}</td>
        <td>${w.rof}</td>
        <td>${w.rel}</td>
      `;
      tbody.appendChild(row);
    });

    // Gear
    document.getElementById("gearList").textContent = npc.gear || "";

  })
  .catch(err => {
    console.error(err);
    document.querySelector("#content").innerHTML = "<p>Error loading NPCs.</p>";
  });
