const buttons = document.querySelectorAll(".mobileButton");

let prefix;
if (window.location.pathname.includes("/edgerunners/") || window.location.pathname.includes("/locations/")) {
  prefix = "../";
} else {
  prefix = './'
}

const links = [
  `${prefix}npc-manager.html`,
  `${prefix}index.html`,
  `${prefix}nightcity.html`,
  `${prefix}corporations.html`,
  `${prefix}message.html`,
  `${prefix}NCPD.html`,
  `${prefix}Edgerunners.html`,
  `${prefix}combat.html`,
  `${prefix}resources.html`
];

// skip the first button (ACCESS BLOCKED)
buttons.forEach((button, i) => {
    if (i === 0) {
        button.addEventListener("click", checkAccess); // password logic
    } else {
        button.addEventListener("click", () => {
            window.location.href = links[i];
        });
    }
})

document.documentElement.classList.remove("no-js");

function checkAccess() {
  const pw = prompt("Zeta Security Clearance Required:");

  if (pw.toUpperCase().replaceAll(' ', '') === "ZETAPROTOCOL") {
    // Navigate to your NPC Manager
    window.location.href = `${prefix}gm-hub.html?gm=1`;
  } else {
    alert("ACCESS DENIED. Incident logged With NetWatch.");
  }
}
