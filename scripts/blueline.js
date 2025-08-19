function changeFloor(floor) {
    const map = document.getElementById("warehouseMap");
    const buttons = document.querySelectorAll("#buttons button");

    // reset buttons
    buttons.forEach(btn => btn.classList.remove("active"));

    if (floor === "ground") {
        map.src = "../maps/WarehouseBaseDay.png";
        buttons[0].classList.add("active");
    } else if (floor === "first") {
        map.src = "../maps/Warehouse1stFloorDayOverlay.png";
        buttons[1].classList.add("active");
    }
}
