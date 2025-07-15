// Renders the timeline table from a list of events
function renderEvents(events) {
  const tbody = document.querySelector("tbody");
  tbody.innerHTML = "";
  events.forEach((event, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${formatDate(event.date)}</td>
      <td>${event.title}</td>
      <td>${event.notes || ""}</td>
      <td><button onclick="deleteEvent(${index})">🗑️</button></td>
    `;
    tbody.appendChild(row);
  });
}

// Deletes a specific event and re-renders the list
function deleteEvent(index) {
  const events = JSON.parse(localStorage.getItem("timelineEvents") || "[]");
  events.splice(index, 1);
  localStorage.setItem("timelineEvents", JSON.stringify(events));
  renderEvents(events);
}

// Handles loading events from localStorage on page load
function loadEvents() {
  const events = JSON.parse(localStorage.getItem("timelineEvents") || "[]");
  renderEvents(events);
}

// Handles importing from a JSON file
function loadTimelineFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const importedEvents = JSON.parse(e.target.result);
      if (!Array.isArray(importedEvents)) throw new Error("Invalid format");

      const existing = JSON.parse(localStorage.getItem("timelineEvents") || "[]");

      // Only add events that don't already exist (match on date + title)
      const combined = [...existing];
      importedEvents.forEach(newEvent => {
        const isDuplicate = existing.some(
          oldEvent => oldEvent.date === newEvent.date && oldEvent.title === newEvent.title
        );
        if (!isDuplicate) {
          combined.push(newEvent);
        }
      });

      combined.sort((a, b) => new Date(a.date) - new Date(b.date));
      localStorage.setItem("timelineEvents", JSON.stringify(combined));
      renderEvents(combined);
    } catch (err) {
      alert("Failed to import: " + err.message);
    }
  };

  reader.readAsText(file);
}

// Downloads the current events as a JSON file
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

// On page load: set up form and load any saved events
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("addEventForm");

  loadEvents();

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const date = this["event-date"].value;
    const title = this["event-title"].value.trim();
    const notes = this["event-notes"].value.trim();

    if (!date || !title) {
      alert("Date and title are required.");
      return;
    }

    const newEvent = { date, title, notes };
    const events = JSON.parse(localStorage.getItem("timelineEvents") || "[]");
    events.push(newEvent);
    events.sort((a, b) => new Date(a.date) - new Date(b.date));

    localStorage.setItem("timelineEvents", JSON.stringify(events));
    renderEvents(events);
    this.reset();
  });
});

function formatDate(isoDate) {
  const date = new Date(isoDate);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-based
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}
