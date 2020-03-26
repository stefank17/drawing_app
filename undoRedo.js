var undoButton = document.getElementById('undoButton');
undoButton.addEventListener('click', undo);

var redoList = []; //shapes we 'undo' go into this list

function undo() {
    redoList.push(drawio.shapes.pop());
    drawio.context.clearRect(0, 0, drawio.canvas.width, drawio.canvas.height);
    for(var i = 0; i < drawio.shapes.length; i++) {
        drawio.shapes[i].render(); //all shapes except the one popped
    }
}

var redoButton = document.getElementById('redoButton');
redoButton.addEventListener('click', redo);

function redo() {
    drawio.shapes.push(redoList.pop());
    drawio.context.clearRect(0, 0, drawio.canvas.width, drawio.canvas.height);
    for(var i = 0; i < drawio.shapes.length; i++) {
        drawio.shapes[i].render();
    }
}