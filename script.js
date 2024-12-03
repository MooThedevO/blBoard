// Initialize variables for drawing modes, color, and line thickness
let drawMode = null;
let currentColor = '#f57c00'; // Default color 
let lineThickness = 2; // Default thickness for lines and arrows
let isDrawing = false;
let startX, startY, endX, endY, currentDiv, currentSVG;
let arrowAngle = 45; // Angle of the arrowhead (can be adjusted)

const drawingArea = document.getElementById('drawingArea');

// Function to handle showing and hiding the dropdown menu on hover
function handleDropdownMenu(dropdownButton, menuId) {
  const menu = document.getElementById(menuId);

  // Show the menu when hovering over the button
  dropdownButton.addEventListener('mouseenter', () => {
    menu.style.display = 'block'; // Show the dropdown menu
  });

  // Keep the menu open when hovering over the menu itself
  menu.addEventListener('mouseenter', () => {
    menu.style.display = 'block'; // Keep the menu open
  });

  // Hide the menu when the mouse leaves the button or the menu
  dropdownButton.addEventListener('mouseleave', () => {
    if (!menu.matches(':hover')) {
      menu.style.display = 'none'; // Hide the menu when the mouse leaves
    }
  });

  menu.addEventListener('mouseleave', () => {
    menu.style.display = 'none'; // Hide the menu when mouse leaves the menu
  });
}

// Attach event listeners to each option for selection and closing the menu
function setupOptionClickHandlers(menuId) {
  document.querySelectorAll(`#${menuId} .option`).forEach(item => {
    item.addEventListener('click', () => {
      const selectedOption = item.innerText;
      console.log('Selected option:', selectedOption, menuId); // Log selected option
      document.getElementById(menuId).style.display = 'none'; // Close the menu after selection
    });
  });
}

// Array of button and corresponding menu IDs
const menuConfig = [
  { buttonId: 'rectangleBtn', menuId: 'rectangleMenu' },
  { buttonId: 'circleBtn', menuId: 'circleMenu' },
  { buttonId: 'lineBtn', menuId: 'lineMenu' },
  { buttonId: 'arrowBtn', menuId: 'arrowMenu' },
  { buttonId: 'colorPickerBtn', menuId: 'colorPickerMenu' }
];

// Apply the dropdown handling to each button-menu pair
menuConfig.forEach(({ buttonId, menuId }) => {
  const button = document.getElementById(buttonId);
  if (button) {
    handleDropdownMenu(button, menuId);
    setupOptionClickHandlers(menuId); // Setup click handler for each menu
  }
});

// Handle option selection from the toolbar
document.getElementById('rectangleFilled').addEventListener('click', () => {
  drawMode = 'rectangle';
  hideOptions();
});

document.getElementById('rectangleBorder').addEventListener('click', () => {
  drawMode = 'rectangle-border';
  hideOptions();
});

document.getElementById('circleFilled').addEventListener('click', () => {
  drawMode = 'circle';
  hideOptions();
});

document.getElementById('circleBorder').addEventListener('click', () => {
  drawMode = 'circle-border';
  hideOptions();
});

document.getElementById('lineSmall').addEventListener('click', () => {
  lineThickness = 2;
  drawMode = 'line';
  hideOptions();
});

document.getElementById('lineMedium').addEventListener('click', () => {
  lineThickness = 4;
  drawMode = 'line';
  hideOptions();
});

document.getElementById('lineLarge').addEventListener('click', () => {
  lineThickness = 6;
  drawMode = 'line';
  hideOptions();
});

document.getElementById('arrowSmall').addEventListener('click', () => {
  lineThickness = 2;
  drawMode = 'arrow';
  hideOptions();
});

document.getElementById('arrowMedium').addEventListener('click', () => {
  lineThickness = 4;
  drawMode = 'arrow';
  hideOptions();
});

document.getElementById('arrowLarge').addEventListener('click', () => {
  lineThickness = 6;
  drawMode = 'arrow';
  hideOptions();
});

// Clear button functionality
document.getElementById('clearBtn').addEventListener('click', () => {
  const whiteboard = document.getElementById('whiteboard');
  
  // Check if the whiteboard exists
  if (drawingArea) {
    while (drawingArea.firstChild) {
      // Ensure we are not trying to remove the toolbar
      if (!drawingArea.firstChild.classList.contains('toolbar')) {
        drawingArea.removeChild(drawingArea.firstChild); // Remove only drawings
      } else {
        break; // Stop if the first child is the toolbar (don't remove toolbar)
      }
    }
  } else {
    console.log('Whiteboard not found');
  }

  console.log('Whiteboard cleared');
});

// Helper function to hide options menus after selection
function hideOptions() {
  document.querySelectorAll('.dropdown-content').forEach(menu => {
    menu.style.display = 'none';
  });
}

// Color Selection
document.getElementById('colorPickerMenu').addEventListener('click', (event) => {
  if (event.target && event.target.dataset.color) {
    currentColor = event.target.dataset.color; // Set selected color
    console.log('Color selected:', currentColor);
  }
});

// Drawing functionality
drawingArea.addEventListener('mousedown', (event) => {
  if (!drawMode) return; // Don't draw if no mode is selected

  isDrawing = true;
  startX = event.clientX;
  startY = event.clientY;

  if (drawMode !== 'line' && drawMode !== 'arrow'){
    currentDiv = document.createElement('div');
    currentDiv.style.position = 'absolute';
    currentDiv.style.backgroundColor = currentColor; // For lines and arrows, the background will be transparent
    currentDiv.style.zIndex = 5; // Ensure it stays on top
    currentDiv.style.backgroundColor = drawMode.includes('border') ? 'transparent' : currentColor; // No fill for border shapes
    currentDiv.style.borderRadius = drawMode === 'circle' || drawMode === 'circle-border' ? '50%' : '0';
    currentDiv.style.border = drawMode.includes('border') ? `2px solid ${currentColor}` : 'none';  
    
    // Adjust for rounded rectangles and circles
    if (drawMode === 'rectangle' || drawMode === 'rectangle-border') {
      currentDiv.style.borderRadius = '25px'; // Make rectangles more rounded (increase value for more rounding)
    } else if (drawMode === 'circle' || drawMode === 'circle-border') {
      currentDiv.style.borderRadius = '50%'; // Ensures perfect circles
    }

    // Add thicker border for border shapes (rectangle-border, circle-border)
    if (drawMode === 'rectangle-border' || drawMode === 'circle-border') {
      currentDiv.style.border = `4px solid ${currentColor}`; // Increase border width for border shapes
    } else {
      currentDiv.style.border = 'none'; // No border for filled shapes
    }

    drawingArea.appendChild(currentDiv);
    addDraggableToShape(currentDiv);
  } else {
      // Create the SVG element for the drawing (we'll append it to the drawing area)
  currentSVG = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
  currentSVG.setAttribute('width', '100%');
  currentSVG.setAttribute('height', '100%');
  currentSVG.style.position = 'absolute';
  currentSVG.style.left = '0';
  currentSVG.style.top = '0';
  currentSVG.style.pointerEvents = 'all'; // Ensure the SVG does not interfere with other UI elements

  drawingArea.appendChild(currentSVG);
  addDraggableToSVG(currentSVG);
  }
});

drawingArea.addEventListener('mousemove', (event) => {
  if (!isDrawing || (!currentDiv && !currentSVG)) return;

  if (drawMode === 'line' || drawMode === 'arrow') {
    endX = event.clientX;
    endY = event.clientY;
  
    var width = endX - startX;
    var height = endY - startY;
    var angle = Math.atan2(height, width); // Calculate the angle of the line  
  } else {
  var width = Math.abs(event.clientX - startX);
  var height = Math.abs(event.clientY - startY);
}

  // Handle line drawing
if (drawMode === 'line') {
    // Remove previous line if it exists
    const existingLine = currentSVG.querySelector('line');
    if (existingLine) {
      existingLine.remove();
    }

    // Draw a new line from start to current mouse position
    const line = document.createElementNS("http://www.w3.org/2000/svg", 'line');
    line.setAttribute('x1', startX);
    line.setAttribute('y1', startY);
    line.setAttribute('x2', endX);
    line.setAttribute('y2', endY);
    line.setAttribute('stroke', currentColor);
    line.setAttribute('stroke-width', lineThickness);
    currentSVG.appendChild(line);
}

// Handle arrow drawing
if (drawMode === 'arrow') {
    // Remove previous arrow (both line and arrowhead) if it exists
    const existingLine = currentSVG.querySelector('line');
    const existingArrowhead = currentSVG.querySelector('polygon');

      if (existingLine) {
        existingLine.remove();
      }
      if (existingArrowhead) {
      existingArrowhead.remove();
    }

    // Draw a new line for the arrow body
    const line = document.createElementNS("http://www.w3.org/2000/svg", 'line');
    line.setAttribute('x1', startX);
    line.setAttribute('y1', startY);
    line.setAttribute('x2', endX);
    line.setAttribute('y2', endY);
    line.setAttribute('stroke', currentColor);
    line.setAttribute('stroke-width', lineThickness);
    currentSVG.appendChild(line);

    // Arrowhead calculations
    const arrowheadSize = lineThickness * 4;
    // Move the arrowhead slightly further along the line (adding 10 pixels to the length)
    const arrowheadDistance = 10; // Extra distance to move the arrowhead forward
    const arrowLength = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2);
    const adjustedEndX = endX + (arrowheadDistance * Math.cos(angle));
    const adjustedEndY = endY + (arrowheadDistance * Math.sin(angle));

    // Calculate the arrowhead points, with the adjusted position
    const arrowheadX1 = adjustedEndX - Math.cos(angle - Math.PI / 6) * arrowheadSize;
    const arrowheadY1 = adjustedEndY - Math.sin(angle - Math.PI / 6) * arrowheadSize;
    const arrowheadX2 = adjustedEndX - Math.cos(angle + Math.PI / 6) * arrowheadSize;
    const arrowheadY2 = adjustedEndY - Math.sin(angle + Math.PI / 6) * arrowheadSize;

    // Draw arrowhead as a triangle
    const arrowhead = document.createElementNS("http://www.w3.org/2000/svg", 'polygon');
    arrowhead.setAttribute('points', `${adjustedEndX},${adjustedEndY} ${arrowheadX1},${arrowheadY1} ${arrowheadX2},${arrowheadY2}`);
    arrowhead.setAttribute('fill', currentColor);
    currentSVG.appendChild(arrowhead);
}

if (drawMode === 'rectangle' || drawMode === 'rectangle-border') {
    currentDiv.style.width = `${width}px`;
    currentDiv.style.height = `${height}px`;
    currentDiv.style.left = `${event.clientX < startX ? event.clientX : startX}px`;
    currentDiv.style.top = `${event.clientY < startY ? event.clientY : startY}px`;
  } else if (drawMode === 'circle' || drawMode === 'circle-border') {
    const radius = Math.sqrt(width * width + height * height);
    currentDiv.style.width = `${radius * 2}px`;
    currentDiv.style.height = `${radius * 2}px`;
    currentDiv.style.left = `${startX - radius}px`;
    currentDiv.style.top = `${startY - radius}px`;
  }
});

drawingArea.addEventListener('mouseup', () => {
  if ((currentDiv || currentSVG) && isDrawing) {
    if (drawMode === 'line' || drawMode === 'arrow') {
      adjustSVGSizeToFitContent(currentSVG);
      isDrawing = false;
      drawMode = null;
    } else {
    // Add editable text directly inside the shape
    currentDiv.contentEditable = true;
    currentDiv.classList.add('text');

    // Set text color based on the shape type (filled or border)
    currentDiv.style.color = drawMode.includes('border') ? currentColor : 'black'; // Text color matches the border

    // Apply styles to the div directly
    currentDiv.style.display = 'flex';
    currentDiv.style.justifyContent = 'center';
    currentDiv.style.alignItems = 'center';
    currentDiv.style.whiteSpace = 'pre-wrap';
    currentDiv.style.wordBreak = 'break-word';
    currentDiv.style.overflowWrap = 'break-word';
    currentDiv.style.overflow = 'hidden';
    currentDiv.style.textOverflow = 'ellipsis';
    currentDiv.style.flexDirection = 'column';
    currentDiv.style.overflowY = 'auto'; // Allow vertical scroll
    currentDiv.style.textAlign = 'center';  // Align text in the center horizontally

    // Ensure the div is focusable
    currentDiv.setAttribute('tabindex', '0'); // Make sure it's focusable before trying to focus it.

    // When the shape is clicked, focus the div for editing
    currentDiv.addEventListener('click', () => {
      if (currentDiv) {
        currentDiv.focus();
      }
    });

    // Apply dynamic text styling
    currentDiv.style.fontSize = '21px';          // Set font size
    currentDiv.style.fontFamily = '"Courier New", Courier, monospace'; // Set font family
    currentDiv.style.fontWeight = '700';          // Set font weight to bold (700)
    currentDiv.style.lineHeight = '1.5';          // Line height for readability
    currentDiv.style.padding = '10px';            // Padding inside the div
    currentDiv.style.textAlign = 'center';        // Center text alignment

    // Handle arrow key navigation within the text div
    currentDiv.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault(); // Prevent default arrow key behavior (moving between divs)

        const scrollAmount = 30; // Define how much to scroll per arrow key press

        // Scroll down within the text div
        if (event.key === 'ArrowDown') {
          currentDiv.scrollTop += scrollAmount; // Scroll down
        } 
        // Scroll up within the text div
        else if (event.key === 'ArrowUp') {
          currentDiv.scrollTop -= scrollAmount; // Scroll up
        }
      }
    });

    // Ensure focus remains inside the div when clicked
    currentDiv.addEventListener('focus', () => {
      currentDiv.setAttribute('tabindex', '0'); // Ensure the div can be focused
    });

    // Remove tabindex when the div loses focus
    currentDiv.addEventListener('blur', () => {
      currentDiv.removeAttribute('tabindex'); // Remove tabindex when focus is lost
    });
  }

  isDrawing = false;
  //currentDiv = null;
  drawMode = null;
}});

// Scrollbar styling for the text in the div
const style = document.createElement('style');
style.innerHTML = `
  .text::-webkit-scrollbar {
    display: none; /* Hide scrollbar for Chrome, Safari, and Opera */
  }
`;
document.head.appendChild(style);

document.getElementById('drawingArea').addEventListener('keydown', (event) => {
  if(event.key === "Enter"){
    event.preventDefault();
    const range = window.getSelection().getRangeAt(0);
    const tab = document.createTextNode("\n\n");
    range.insertNode(tab);
    range.setStartAfter(tab);
  }
});

// Add event listener for the save button
document.getElementById('saveImageBtn').addEventListener('click', () => {
  // Capture the drawingArea element
  html2canvas(drawingArea, {
    useCORS: true, // This is important for loading external images (if any) properly
    logging: false, // Disable logging for better performance
    allowTaint: true, // Allow tainted canvas (in case of cross-origin images)
    scale: 2, // Optional: increase the scale for better resolution of the image
    backgroundColor: '#000000'
  }).then((canvas) => {
    // Create an image from the canvas
    const imageUrl = canvas.toDataURL("image/png"); // Convert canvas to PNG data URL

    // Create a temporary link to download the image
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'drawing.png'; // Name the file as 'drawing.png'
    
    // Trigger a click on the link to start the download
    link.click();

    alert('Image saved!');
  }).catch((error) => {
    console.error('Error capturing the drawing area:', error);
  });
});

let draggedElement = null;
let offsetX, offsetY;

function makeDraggable(element) {
  element.addEventListener('mousedown', (event) => {
    // Set the element as the currently dragged element
    draggedElement = element;
    
    // Calculate the offset between mouse position and the element's top-left corner
    offsetX = event.clientX - element.getBoundingClientRect().left;
    offsetY = event.clientY - element.getBoundingClientRect().top;
    
    // Disable text selection while dragging
    document.body.style.userSelect = 'none';
    
    // Add event listeners for mousemove and mouseup
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });
}

function onMouseMove(event) {
  if (!draggedElement) return;
  
  // Calculate new position
  const newLeft = event.clientX - offsetX;
  const newTop = event.clientY - offsetY;
  
  // Set the new position of the dragged element
  draggedElement.style.left = `${newLeft}px`;
  draggedElement.style.top = `${newTop}px`;
}

function onMouseUp() {
  // Remove mousemove and mouseup event listeners after dragging is complete
  document.removeEventListener('mousemove', onMouseMove);
  document.removeEventListener('mouseup', onMouseUp);
  
  // Re-enable text selection
  document.body.style.userSelect = '';
  
  // Reset dragged element
  draggedElement = null;
}

// Attach draggable functionality to each drawn shape
function addDraggableToShape(currentDiv) {
  makeDraggable(currentDiv);
}
function makeSVGDraggable(svg) {
  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  // Function to handle the mouse down event (start dragging)
  function onMouseDown(e) {
    // Prevent default behavior (like text selection)
    e.preventDefault();
    
    // Calculate the offset between mouse position and SVG element's current position
    const rect = svg.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    // Set dragging flag to true
    isDragging = true;
  }

  // Function to handle the mouse move event (dragging)
  function onMouseMove(e) {
    if (!isDragging) return; // Don't move if not dragging

    // Calculate the new position based on mouse movement
    const newLeft = e.clientX - offsetX;
    const newTop = e.clientY - offsetY;

    // Set the new position of the SVG
    svg.style.left = `${newLeft}px`;
    svg.style.top = `${newTop}px`;
  }

  // Function to handle the mouse up event (end dragging)
  function onMouseUp() {
    // Reset dragging flag
    isDragging = false;
  }

  // Attach the event listeners to the SVG element
  svg.addEventListener('mousedown', onMouseDown);
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
}

// Attach draggable functionality to each SVG element (line or arrow)
function addDraggableToSVG(currentSVG) {
  makeSVGDraggable(currentSVG);

}

// Function to adjust SVG size to fit its content
function adjustSVGSizeToFitContent(svg) {
  let bbox;
  // Get the first line or polygon/arrow inside the SVG
  const line = svg.querySelector('line');
  const polygon = svg.querySelector('polygon');

    // If there's a line, use its bounding box
    if (line) {
      bbox = line.getBBox(); // Get the bounding box of the line element
    }
    // If there's a polygon, use its bounding box
    else if (polygon) {
      bbox = polygon.getBBox(); // Get the bounding box of the polygon element
    }
  
    const padding = 10; // Optional padding around the SVG content

    // Get the current position of the SVG element (left and top)
    const currentLeft = parseInt(svg.style.left, 10);
    const currentTop = parseInt(svg.style.top, 10);
    // Get the current position of the line/polygon element relative to the parent
    const elementPosition = svg.querySelector('line') || svg.querySelector('polygon') || svg.querySelector('polyline');
    const elementRect = elementPosition.getBoundingClientRect();

    // Calculate the offset position based on the element's current bounding box
    const offsetX = elementRect.left;
    const offsetY = elementRect.top;

    // Set the width and height of the SVG to fit the content's bounding box
    svg.setAttribute('width', bbox.width + padding);
    svg.setAttribute('height', bbox.height + padding);

    // Adjust the viewBox to fit the content and padding
    svg.setAttribute('viewBox', `${bbox.x - padding} ${bbox.y - padding} ${bbox.width + padding * 2} ${bbox.height + padding * 2}`);

    // Restore the position of the SVG relative to the inner element
    svg.style.left = `${currentLeft + offsetX}px`;
    svg.style.top = `${currentTop + offsetY}px`;

}
