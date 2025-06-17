window.addEventListener("DOMContentLoaded", () => {
    const boot = document.getElementById("bootScreen");
    const content = document.getElementById("content");

    content.style.display = "none";

    setTimeout(() => {
        boot.style.display = "none";
        content.style.display = "contents";
    }, 2500);

    let random = () => Math.floor(Math.random() * (15 - 0 + 1) + 0);

    const hashCode = {10: "A", 11: "B", 12: "C", 13: "D", 14: "E", 15: "F"}

    let code = "";
    for (let i = 0; i < 19; i++) {
        if (i === 4 || i === 9 || i === 14) {
            code += "-";
        } else {
            let hash = random();
            if (hashCode[hash] !== undefined) {
                hash = hashCode[hash];
            }
            code += hash;
        }
    }

    document.querySelector(".auth-code").textContent = code;

    function addHoursToTime(date) {
        const result = new Date(date);
        return result;
    }

    function formatTime(date) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }

    const now = new Date();
    const timeout = addHoursToTime(now);
    document.querySelector(".timeout").textContent = formatTime(timeout);

});
