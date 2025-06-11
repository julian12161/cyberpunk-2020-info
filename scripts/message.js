const button = document.querySelector("#generalMessages");

button.addEventListener("click", () => {
    window.location.href = 'generalMessages.html'
})

// Temporary sample messages
const secretMessages = {
  "HOTSTUF": "Meet me at Totentanz. Midnight. Bring the chip.",
  "NETRUN2": "Target located. Contract confirmed. Stay low.",
  "CODE999": "Package delivered. Await instructions."
};

function retrieveMessage() {
  const codeInput = document.getElementById("retrieveCode").value.trim().toUpperCase();
  const outputBox = document.getElementById("retrievedMessage");

  const message = secretMessages[codeInput];
  if (message) {
    outputBox.innerHTML = `<strong>Message:</strong><br>${message}`;
    outputBox.classList.remove("error");
  } else {
    outputBox.innerHTML = "ACCESS DENIED. NO MESSAGE FOUND.";
    outputBox.classList.add("error");
  }
}

const textarea = document.getElementById("message");
const counter = document.getElementById("show");

textarea.addEventListener("input", () => {
    const words = textarea.value.trim().split(/\s+/).filter(Boolean);
    counter.textContent = words.length;

    if (words.length > 50) {
        counter.style.color = "red";
        textarea.value = words.slice(0, 50).join(" ");
    } else {
        counter.style.color = "limegreen";
    }
});
