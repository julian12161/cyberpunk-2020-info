fetch("data/general-messages.json")
  .then(response => response.json())
  .then(messages => {
    const container = document.getElementById("content");
    messages.reverse().forEach(text => {
      const div = document.createElement("div");
      div.className = "message";
      div.textContent = text;
      container.appendChild(div);
    });
  })
  .catch(err => {
    console.error("Failed to load messages:", err);
  });
