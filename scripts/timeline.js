document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("addEventForm");
  const tbody = document.querySelector("tbody");

  loadEvents();

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const date = this["event-date"].value;
    const title = this["event-title"].value.trim();
    const notes = this["event-notes"].value.trim();

    if (!date || !title) return alert("Date and title are required.");

    const newEvent = { date, title, notes };
    const events = JSON.parse(localStorage.getItem("timelineEvents") || "[]");

    events.push(newEvent);
    events.sort((a, b) => new Date(a.date) - new Date(b.date));
    localStorage.setItem("timelineEvents", JSON.stringify(events));

    this.reset();
    renderEvents(events);
  });

  function loadEvents() {
    const events = JSON.parse(localStorage.getItem("timelineEvents") || "[]");
    renderEvents(events);
  }

  function renderEvents(events) {
    tbody.innerHTML = "";
    events.forEach((event, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${event.date}</td>
        <td>${event.title}</td>
        <td>${event.notes || ""}</td>
        <td><button onclick="deleteEvent(${index})">🗑️</button></td>
      `;
      tbody.appendChild(row);
    });
  }

  window.deleteEvent = function (index) {
    const events = JSON.parse(localStorage.getItem("timelineEvents") || "[]");
    events.splice(index, 1);
    localStorage.setItem("timelineEvents", JSON.stringify(events));
    renderEvents(events);
  };
});

function downloadTimeline() {
  const events = JSON.parse(localStorage.getItem("timelineEvents") || "[]");
  const blob = new Blob([JSON.stringify(events, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "cyberpunk-timeline.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function loadTimelineFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const importedEvents = JSON.parse(e.target.result);

      if (!Array.isArray(importedEvents)) throw new Error("Invalid format");

      // Optional: ask whether to append or replace
      const existing = JSON.parse(localStorage.getItem("timelineEvents") || "[]");
      const combined = existing.concat(importedEvents);
      combined.sort((a, b) => new Date(a.date) - new Date(b.date));

      localStorage.setItem("timelineEvents", JSON.stringify(combined));
      renderEvents(combined);
    } catch (err) {
      alert("Failed to import: " + err.message);
    }
  };

  reader.readAsText(file);
}
