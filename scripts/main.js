const buttons = document.querySelectorAll(".mobileButton");
const links = ["index.html", "nightcity.html", "corporations.html", "message.html", "NCPD.html", "combat.html"];

buttons.forEach((button, i) => {
    button.addEventListener("click", () => {
        window.location.href = links[i];
    })
})

document.documentElement.classList.remove("no-js");

function checkAccess() {
  const pw = prompt("Zeta Security Clearance Required:");

  if (pw === "ZETAPROTOCOL") {
    // Navigate to your NPC Manager
    window.location.href = "npc-manager.html?gm=1";
  } else {
    alert("ACCESS DENIED. Incident logged With NetWatch.");
  }
}
