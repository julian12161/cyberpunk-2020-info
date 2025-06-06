const buttons = document.querySelectorAll(".mobileButton");
const links = ["index.html", "nightcity.html", "corporations.html", "message.html", "NCPD.html", "combat.html"];

buttons.forEach((button, i) => {
    button.addEventListener("click", () => {
        window.location.href = links[i];
    })
})
