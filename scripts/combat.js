const targetTable = {
    pointBlank: 10,
    close: 15,
    medium: 20,
    long: 25,
    extreme: 30
};

function getRangeBand(weapon, dist) {
    const ranges = {
        handgun: 50,
        smg: 150,
        shotgun: 50,
        rifle: 400,
        thrown: 30
    };
    const r = ranges[weapon];
    dist = parseInt(dist);

    if (dist <= 0) return null;
    if (dist <= 1) return 'pointBlank';
    if (dist <= r / 4) return 'close';
    if (dist <= r / 2) return 'medium';
    if (dist <= r) return 'long';
    if (dist <= r * 2) return 'extreme';
    return null;
}

function calculateModifiers() {
    const modifiers = document.querySelectorAll('.mods');
    let total = 0;
    modifiers.forEach(mod => {
        if (mod.checked) {
            total += parseInt(-mod.dataset.mod || 0);
        }
    });
    return total;
}

function updateTargetInfo() {
    const weapon = document.getElementById("weapon-type").value;
    const dist = parseInt(document.getElementById("distance-band").value) || 0;
    const rounds = parseInt(document.getElementById("rounds-fired").value) || 0;

    const bandSpan = document.getElementById("range-band");
    const targetSpan = document.getElementById("target-result");
    const modSpan = document.getElementById("modifier-total");
    const finalSpan = document.getElementById("final-tn");
    const fullAutoSpan = document.getElementById("full-auto-target");
    const faModSpan = document.getElementById("fa-modifier");

    // Get range band
    const band = getRangeBand(weapon, dist);
    const baseTN = targetTable[band] || null;

    // Modifiers
    const modTotal = calculateModifiers();

    // Full auto adjustment
    let faMod = 0;
    if (rounds > 0) {
        faMod = dist <= 20 ? Math.floor(rounds / 10) : -Math.floor(rounds / 10);    // if distance is less than or equal to 20, positive mod else negative
    }
    faModSpan.textContent = faMod >= 0 ? `+${faMod}` : faMod;   // if faMod >= 0, return +faMod otherwise faMod

    // Output
    bandSpan.textContent = band || "—";
    targetSpan.textContent = baseTN !== null ? baseTN : "—";
    modSpan.textContent = modTotal;

    if (baseTN !== null) {
        const finalTN = baseTN + modTotal;
        finalSpan.textContent = finalTN;
        fullAutoSpan.textContent = finalTN + -faMod;
    } else {
        finalSpan.textContent = "—";
        fullAutoSpan.textContent = "—";
    }
}

// Recalculate on any change
document.getElementById("weapon-type").addEventListener("change", updateTargetInfo);
document.getElementById("distance-band").addEventListener("input", updateTargetInfo);
document.getElementById("rounds-fired").addEventListener("input", updateTargetInfo);
document.querySelectorAll(".mods").forEach(box =>
    box.addEventListener("change", updateTargetInfo)
);
window.addEventListener('DOMContentLoaded', () => {
  if (window.innerWidth >= 801) {
    document.querySelectorAll('details.combat-section').forEach(d => {
      d.open = true;
    });
  }
});
