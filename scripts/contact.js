function updateCost() {
    // Get selected values
    const cap = parseInt(getRadioValue("capability")) || 0;
    const rep = parseFloat(getRadioValue("reputation")) || 1;
    const avail = parseFloat(getRadioValue("availability")) || 1;
    const reliab = parseFloat(getRadioValue("reliability")) || 1;

    // Final cost = base cost × all modifiers
    const totalCost = Math.round(cap * rep * avail * reliab * 10) / 10;

    document.getElementById("costResult").innerHTML = `<strong>Total Contact Cost:</strong> ${totalCost} points`;

    const capabilityLabels = {
    5: "Snitch (5 pts)",
    10: "Incapable (10 pts)",
    15: "Capable (15 pts)",
    25: "Very Capable (25 pts)",
    40: "Super Capable (40 pts)"
    };

    const reputationLabels = {
    0.5: "Reputation 0–2 (x0.5)",
    1: "Reputation 3–5 (x1.0)",
    1.5: "Reputation 6–8 (x1.5)",
    2: "Reputation 9–10 (x2.0)"
    };

    const availabilityLabels = {
    0.5: "Seldom Available (x0.5)",
    1: "Sometimes Available (x1.0)",
    1.5: "Often Available (x1.5)",
    2: "Always Available (x2.0)",
    };

    const reliabilityLabels = {
    0.5: "Unreliable (x0.5)",
    1: "Reliable (x1.0)",
    1.5: "Very Reliable (x1.5)",
    2: "Super Reliable (x2.0)"
    };

    document.getElementById("summaryOutput").innerHTML = `
    <strong>Selected Contact Profile:</strong><br>
    Capability: ${capabilityLabels[cap] || "–"}<br>
    Reputation: ${reputationLabels[rep] || "–"}<br>
    Availability: ${availabilityLabels[avail] || "–"}<br>
    Reliability: ${reliabilityLabels[reliab] || "–"}<br>
    `;

    const summaryBox = document.getElementById("summaryOutput");
    const costBox = document.getElementById("costResult");

    // Toggle visibility based on whether there’s content
    if (summaryBox.innerHTML.trim()) {
        summaryBox.classList.remove("hiddenBorder");
    } else {
        summaryBox.classList.add("hiddenBorder");
    }

    if (costBox.innerHTML.trim()) {
        costBox.classList.remove("hiddenBorder");
    } else {
        costBox.classList.add("hiddenBorder");
    }

}

// Helper function to get selected value from a group
function getRadioValue(groupName) {
    const radios = document.getElementsByName(groupName);
    for (let radio of radios) {
        if (radio.checked) return radio.value;
    }
    return null;
}

// Add event listeners to all radio buttons
window.addEventListener("DOMContentLoaded", () => {
    const groups = ["capability", "reputation", "availability", "reliability"];
    groups.forEach(group => {
        const radios = document.getElementsByName(group);
        radios.forEach(radio => {
            radio.addEventListener("change", updateCost);
        });
    });
});
