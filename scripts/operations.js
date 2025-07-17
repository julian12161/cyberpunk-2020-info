function saveNewSession() {
  const title = document.getElementById("sessionTitle").value.trim();
  if (!title) {
    alert("Enter a session title before saving.");
    return;
  }

  const session = {
    title,
    overview: document.getElementById("overview").value,
    objectives: document.getElementById("objectives").value,
    clues: document.getElementById("clues").value,
    npcs: document.getElementById("npcs").value,
    gmnotes: document.getElementById("gmnotes").value,
    savedAt: new Date().toISOString()
  };

  // Save to localStorage
  const sessions = JSON.parse(localStorage.getItem("allSessions") || "[]");
  sessions.push(session);
  localStorage.setItem("allSessions", JSON.stringify(sessions));

  renderSavedSessions();
  clearPlanner();
}

function renderSavedSessions() {
  const container = document.getElementById("savedSessions");
  const sessions = JSON.parse(localStorage.getItem("allSessions") || "[]");

  container.innerHTML = ""; // Clear previous render

  sessions.forEach((session, index) => {
    const div = document.createElement("div");
    div.className = "session-card";
    div.setAttribute("draggable", "true");
    div.setAttribute("data-index", index);
    div.innerHTML = `
      <h3>${session.title}</h3>
      <p><strong>Overview:</strong> ${session.overview}</p>
      <p><strong>Objectives:</strong> ${session.objectives}</p>
      <p><strong>Clues:</strong> ${session.clues}</p>
      <p><strong>NPCs:</strong> ${session.npcs}</p>
      <p><strong>GM Notes:</strong> ${session.gmnotes}</p>
      <button onclick="loadSession(${index})">✏️ Edit</button>
      <button onclick="deleteSession(${index})">🗑 Delete</button>
    `;

    // ✅ Attach drag listeners
    div.addEventListener("dragstart", handleDragStart);
    div.addEventListener("dragover", handleDragOver);
    div.addEventListener("drop", handleDrop);
    div.addEventListener("dragend", handleDragEnd);

    container.appendChild(div);
  });
}

function clearPlanner() {
  document.getElementById("sessionTitle").value = "";
  document.getElementById("overview").value = "";
  document.getElementById("objectives").value = "";
  document.getElementById("clues").value = "";
  document.getElementById("npcs").value = "";
  document.getElementById("gmnotes").value = "";
}

function deleteSession(index) {
  const sessions = JSON.parse(localStorage.getItem("allSessions") || "[]");
  if (!confirm(`Delete session "${sessions[index].title}"?`)) return;
  sessions.splice(index, 1);
  localStorage.setItem("allSessions", JSON.stringify(sessions));
  renderSavedSessions();
}

function loadSession(index) {
  const sessions = JSON.parse(localStorage.getItem("allSessions") || "[]");
  const session = sessions[index];

  document.getElementById("sessionTitle").value = session.title;
  document.getElementById("overview").value = session.overview;
  document.getElementById("objectives").value = session.objectives;
  document.getElementById("clues").value = session.clues;
  document.getElementById("npcs").value = session.npcs;
  document.getElementById("gmnotes").value = session.gmnotes;

  // Optional: remove and replace if re-saving
  sessions.splice(index, 1);
  localStorage.setItem("allSessions", JSON.stringify(sessions));
  renderSavedSessions();
}

// Load on page load
window.addEventListener("DOMContentLoaded", renderSavedSessions);

function downloadAllSessions() {
  const sessions = JSON.parse(localStorage.getItem("allSessions") || "[]");
  const blob = new Blob([JSON.stringify(sessions, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "cyberpunk-sessions.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

let dragSrcIndex = null;

function handleDragStart(e) {
  dragSrcIndex = +this.dataset.index;
  this.style.opacity = 0.5;
}

function handleDragOver(e) {
  e.preventDefault();
}

function handleDrop(e) {
  const targetIndex = +this.dataset.index;
  if (dragSrcIndex === targetIndex) return;

  const sessions = JSON.parse(localStorage.getItem("allSessions") || "[]");
  const [moved] = sessions.splice(dragSrcIndex, 1);
  sessions.splice(targetIndex, 0, moved);
  localStorage.setItem("allSessions", JSON.stringify(sessions));
  renderSavedSessions();
}

function handleDragEnd(e) {
  this.style.opacity = 1;
}

function loadSessionsFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const importedSessions = JSON.parse(e.target.result);
      if (!Array.isArray(importedSessions)) {
        alert("Invalid session file.");
        return;
      }

      const existing = JSON.parse(localStorage.getItem("allSessions") || "[]");

      const merged = [...existing];
      importedSessions.forEach(newSession => {
        const isDuplicate = existing.some(
          session => session.title === newSession.title && session.overview === newSession.overview
        );
        if (!isDuplicate) {
          merged.push(newSession);
        }
      });

      localStorage.setItem("allSessions", JSON.stringify(merged));
      renderSavedSessions();
      alert("Sessions loaded and merged successfully!");
    } catch (err) {
      alert("Error loading file: " + err.message);
    }
  };

  reader.readAsText(file);
}
