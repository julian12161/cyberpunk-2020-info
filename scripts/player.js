window.addEventListener('DOMContentLoaded', () => {
    const parent1 = document.getElementById('parent1');
    const parent2 = document.getElementById('parent2');
    const children = document.querySelectorAll('.generation.children .person');
    const svg = document.getElementById('tree-lines');
    const svgRect = svg.getBoundingClientRect();

    // Get parent positions
    const p1Rect = parent1.getBoundingClientRect();
    const p2Rect = parent2.getBoundingClientRect();

    // Parent horizontal line
    const parentLine = document.createElementNS("http://www.w3.org/2000/svg","line");
    parentLine.setAttribute("x1", p1Rect.left + p1Rect.width/2 - svgRect.left);
    parentLine.setAttribute("y1", p1Rect.bottom - svgRect.top);
    parentLine.setAttribute("x2", p2Rect.left + p2Rect.width/2 - svgRect.left);
    parentLine.setAttribute("y2", p2Rect.bottom - svgRect.top);
    parentLine.setAttribute("stroke", "#888");
    parentLine.setAttribute("stroke-width", 2);
    svg.appendChild(parentLine);

    // Midpoint between parents
    const midX = (p1Rect.left + p1Rect.width/2 + p2Rect.left + p2Rect.width/2)/2 - svgRect.left;
    const midY = p1Rect.bottom - svgRect.top;

    // Vertical line down from parent line to horizontal child line
    const verticalToChildren = document.createElementNS("http://www.w3.org/2000/svg","line");
    verticalToChildren.setAttribute("x1", midX);
    verticalToChildren.setAttribute("y1", midY);
    verticalToChildren.setAttribute("x2", midX);
    verticalToChildren.setAttribute("y2", svgRect.height - 40); // 40px above children
    verticalToChildren.setAttribute("stroke", "#888");
    verticalToChildren.setAttribute("stroke-width", 2);
    svg.appendChild(verticalToChildren);

    // Horizontal line for children
    const firstChild = children[0].getBoundingClientRect();
    const lastChild = children[children.length - 1].getBoundingClientRect();
    const horizontalChildren = document.createElementNS("http://www.w3.org/2000/svg","line");
    horizontalChildren.setAttribute("x1", firstChild.left + firstChild.width/2 - svgRect.left);
    horizontalChildren.setAttribute("y1", svgRect.height - 40);
    horizontalChildren.setAttribute("x2", lastChild.left + lastChild.width/2 - svgRect.left);
    horizontalChildren.setAttribute("y2", svgRect.height - 40);
    horizontalChildren.setAttribute("stroke", "#888");
    horizontalChildren.setAttribute("stroke-width", 2);
    svg.appendChild(horizontalChildren);

    // Vertical lines from horizontal line to each child
    children.forEach(child => {
        const cRect = child.getBoundingClientRect();
        const line = document.createElementNS("http://www.w3.org/2000/svg","line");
        line.setAttribute("x1", cRect.left + cRect.width/2 - svgRect.left);
        line.setAttribute("y1", svgRect.height - 40);
        line.setAttribute("x2", cRect.left + cRect.width/2 - svgRect.left);
        line.setAttribute("y2", cRect.top - svgRect.top);
        line.setAttribute("stroke", "#888");
        line.setAttribute("stroke-width", 2);
        svg.appendChild(line);
    });
});
