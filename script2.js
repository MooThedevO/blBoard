const canvas = document.createElement('canvas');
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');

// Set the canvas to take up the full viewport
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let currentShape = 'rectangle'; // Default shape
let drawing = false;
let dragging = false;
let selectedShape = null;
let startX, startY;
let shapes = [];
let isTextInput = false; // Track if we're in text input mode
let currentShapeObj = null;
let buttons = []; // Store buttons for easy tracking

// Set initial background color to black
ctx.fillStyle = 'black';
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Button data (position, size, label, color)
const buttonData = [
    { x: 20, y: canvas.height - 50, width: 100, height: 40, label: 'Rectangle', color: '#444' },
    { x: 140, y: canvas.height - 50, width: 100, height: 40, label: 'Circle', color: '#444' },
    { x: 260, y: canvas.height - 50, width: 100, height: 40, label: 'Line', color: '#444' },
    { x: 380, y: canvas.height - 50, width: 100, height: 40, label: 'Arrow', color: '#444' },
    { x: 500, y: canvas.height - 50, width: 100, height: 40, label: 'Text', color: '#444' },
];

// Draw the toolbar buttons on the canvas
function drawButtons() {
    buttonData.forEach((button, index) => {
        ctx.fillStyle = button.color;
        ctx.fillRect(button.x, button.y, button.width, button.height);
        ctx.fillStyle = 'white';
        ctx.font = '16px Arial';
        ctx.fillText(button.label, button.x + 10, button.y + 25);
        buttons.push(button); // Store the button for later
    });
}

// Check if the mouse click is inside a button
function isInsideButton(x, y, button) {
    return x >= button.x && x <= button.x + button.width && y >= button.y && y <= button.y + button.height;
}

// Handle button clicks to change the current shape tool
canvas.addEventListener('mousedown', (e) => {
    const mouseX = e.offsetX;
    const mouseY = e.offsetY;

    // Check if a button is clicked
    buttonData.forEach((button) => {
        if (isInsideButton(mouseX, mouseY, button)) {
            switch (button.label) {
                case 'Rectangle':
                    currentShape = 'rectangle';
                    break;
                case 'Circle':
                    currentShape = 'circle';
                    break;
                case 'Line':
                    currentShape = 'line';
                    break;
                case 'Arrow':
                    currentShape = 'arrow';
                    break;
                case 'Text':
                    currentShape = 'text';
                    isTextInput = true; // Turn on text input mode
                    break;
            }
        }
    });

    // Start drawing the selected shape
    startX = mouseX;
    startY = mouseY;
    if (isTextInput) {
        // Create a text box and allow typing
        currentShapeObj = {
            type: 'text',
            x: startX,
            y: startY,
            width: 200,
            height: 50,
            color: 'white',
            text: '',
            dragging: false
        };
        shapes.push(currentShapeObj);
        isTextInput = false; // Disable text input mode after creating the text box
    } else {
        currentShapeObj = {
            type: currentShape,
            x: startX,
            y: startY,
            width: 0,
            height: 0,
            color: 'white',
            dragging: false
        };
        shapes.push(currentShapeObj);
    }
    drawing = true;
});

// Mouse move to update shape size
canvas.addEventListener('mousemove', (e) => {
    if (!drawing) return;

    const mouseX = e.offsetX;
    const mouseY = e.offsetY;

    if (currentShapeObj) {
        if (currentShapeObj.type === 'text') {
            currentShapeObj.width = mouseX - startX;
            currentShapeObj.height = mouseY - startY;
        } else {
            // Update width and height of other shapes
            currentShapeObj.width = mouseX - startX;
            currentShapeObj.height = mouseY - startY;
        }

        redrawCanvas();
    }

    if (dragging && selectedShape) {
        selectedShape.x = e.offsetX - selectedShape.width / 2;
        selectedShape.y = e.offsetY - selectedShape.height / 2;
        redrawCanvas();
    }
});

// Mouse up to finalize shape or stop drawing
canvas.addEventListener('mouseup', () => {
    drawing = false;
    if (selectedShape) {
        selectedShape.dragging = false;
    }
    currentShapeObj = null;
    canvas.style.cursor = 'default';
});

// Check if the mouse is inside the shape (for dragging)
function isInsideShape(x, y, shape) {
    return x >= shape.x && x <= shape.x + shape.width && y >= shape.y && y <= shape.y + shape.height;
}

// Select a shape by clicking on it
canvas.addEventListener('click', (e) => {
    const mouseX = e.offsetX;
    const mouseY = e.offsetY;

    selectedShape = null;

    // Check if we clicked on an existing shape to select it
    for (let shape of shapes) {
        if (isInsideShape(mouseX, mouseY, shape)) {
            selectedShape = shape;
            selectedShape.dragging = true;
            break;
        }
    }

    if (selectedShape) {
        canvas.style.cursor = 'move'; // Change cursor when dragging
    } else {
        canvas.style.cursor = 'default'; // Default cursor when nothing is selected
    }
});

// Redraw all shapes
function redrawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Black background

    // Redraw the buttons
    drawButtons();

    // Redraw all shapes
    shapes.forEach(shape => {
        ctx.fillStyle = shape.color;
        ctx.strokeStyle = shape.color;

        if (shape.type === 'rectangle') {
            ctx.fillRect(shape.x, shape.y, shape.width, shape.height);
        } else if (shape.type === 'circle') {
            ctx.beginPath();
            ctx.arc(shape.x, shape.y, Math.sqrt(shape.width**2 + shape.height**2), 0, Math.PI * 2);
            ctx.fill();
        } else if (shape.type === 'line') {
            ctx.beginPath();
            ctx.moveTo(shape.x, shape.y);
            ctx.lineTo(shape.x + shape.width, shape.y + shape.height);
            ctx.stroke();
        } else if (shape.type === 'arrow') {
            ctx.beginPath();
            ctx.moveTo(shape.x, shape.y);
            ctx.lineTo(shape.x + shape.width, shape.y + shape.height);
            ctx.stroke();
            // Draw arrowhead
            const angle = Math.atan2(shape.height, shape.width);
            ctx.beginPath();
            ctx.moveTo(shape.x + shape.width, shape.y + shape.height);
            ctx.lineTo(shape.x + shape.width - 10 * Math.cos(angle - Math.PI / 6), shape.y + shape.height - 10 * Math.sin(angle - Math.PI / 6));
            ctx.lineTo(shape.x + shape.width - 10 * Math.cos(angle + Math.PI / 6), shape.y + shape.height - 10 * Math.sin(angle + Math.PI / 6));
            ctx.closePath();
            ctx.fill();
        } else if (shape.type === 'text') {
            ctx.font = "30px Arial"; // Large enough font size
            ctx.fillText(shape.text || "Type here", shape.x + 10, shape.y + 30);
        }
    });
}

// Initialize the canvas and draw the buttons
redrawCanvas();
    