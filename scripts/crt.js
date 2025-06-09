window.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("main");
    const elements = container.children;

    let delay = 0;

    for (let i = 0; i < elements.length; i++) {
        const el = elements[i];

        setTimeout(() => {
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
        }, delay);

        delay += 150; // delay between lines (ms)
    }

    // Apply final class to indicate full load if you want
    container.classList.add("crt-reveal");
});
