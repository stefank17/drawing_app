window.drawio = {
    shapes: [],
    selectedShape: 'pencil', //rectangle by default
    canvas: document.getElementById('my-canvas'),
    context: document.getElementById('my-canvas').getContext('2d'),
    selectedElement: null, // <== to use when we, we start moving or selecting element
    availableShapes: { //til að geta notað const í staðinn f strengi
        RECTANGLE: 'rectangle',
        CIRCLE: 'circle',
        LINE: 'line',
        PENCIL: 'pencil',
        TEXT: 'text',
        SAVE: 'save',
    },
    colorOfShape: function () {
        return document.getElementById('colorOfShape').value;
    },
    lineWidth: function () {
        var width = document.getElementById('lineWidth');
        return width.options[width.selectedIndex].value;
    },
    font: function() {
        var width = document.getElementById('fontSelection');
        return width.options[width.selectedIndex].value;
    },
    fillOrStroke: function () {
        var fill = document.getElementById('fill').checked;
        if (fill) {
            return 'fill'
        }
        return 'stroke';
    },
    textSize: function() {
        var width = document.getElementById('textSize');
        return width.options[width.selectedIndex].value;
    }

};


$(function () {
    //Document is loaded and parsed at this time
    function drawCanvas() {
        if (drawio.selectedElement) {
            drawio.selectedElement.render();
        }
        for (var i = 0; i < drawio.shapes.length; i++) {
            drawio.shapes[i].render();
        }
    }
    // updates when clicking the icon
    $('.icon').on('click', function () {
        $('.icon').removeClass('selected');
        $(this).addClass('selected');
        drawio.selectedShape = $(this).data('shape')
    });

    $('#my-canvas').on('input', function(evt) {
        drawCanvas();
    });

    //mousedown
    $('#my-canvas').on('mousedown', function(mouseEvent) {
        if (drawio.selectedShape === 'move') {
            drawio.shapes.forEach(shape => {
                if(shape.contains(mouseEvent.offsetX, mouseEvent.offsetY)) {
                    console.log("contains works");
                    drawio.selectedElement = shape;
                    drawio.selectedElementClickOffset = {x: mouseEvent.offsetX - shape.positionX, y: mouseEvent.offsetY - shape.positionY}
                }
            })
        }
        else {
            switch (drawio.selectedShape) {
                // Rectangle
                case drawio.availableShapes.RECTANGLE: //if rectangle
                    drawio.selectedElement = new Rectangle({x: mouseEvent.offsetX, y: mouseEvent.offsetY}, 0, 0, drawio.colorOfShape(), drawio.lineWidth(), drawio.fillOrStroke());
                    break;

                // Circle
                case drawio.availableShapes.CIRCLE: //if circle
                    drawio.selectedElement = new Circle({x: mouseEvent.offsetX, y: mouseEvent.offsetY}, 10, 0, 2 * Math.PI, drawio.colorOfShape(), drawio.lineWidth(), drawio.fillOrStroke());
                    break;

                // Line
                case drawio.availableShapes.LINE: //if circle
                    drawio.selectedElement = new Line({x: mouseEvent.offsetX, y: mouseEvent.offsetY}, drawio.colorOfShape(), drawio.lineWidth(), {x: mouseEvent.offsetX, y: mouseEvent.offsetY});
                    break;
                // Pen
                case drawio.availableShapes.PENCIL: //if circle
                    drawio.selectedElement = new Pencil({x: mouseEvent.offsetX, y: mouseEvent.offsetY}, drawio.colorOfShape(), drawio.lineWidth());
                    break;
                // Text
                case drawio.availableShapes.TEXT: //if text
                    text = document.getElementById("textSelected");
                    drawio.selectedElement = new Text({x: mouseEvent.offsetX, y: mouseEvent.offsetY}, drawio.font(), drawio.textSize(), drawio.colorOfShape(), text.value, drawio.fillOrStroke());
                    break;
                case drawio.availableShapes.SAVE: //if SAVE
                    alert("Choose another icon");
                break;
        }
        drawCanvas();
    }
    });

    //mousemove
    $('#my-canvas').on('mousemove', function (mouseEvent) {
        if (drawio.selectedShape === 'move') {
            if (drawio.selectedElement != null) {
                drawio.context.clearRect(0, 0, drawio.canvas.width, drawio.canvas.height);
                drawio.selectedElement.move({x: mouseEvent.offsetX - drawio.selectedElementClickOffset.x,
                                                        y: mouseEvent.offsetY - drawio.selectedElement.y});
                drawCanvas()
            }
        }
        else {
            if (drawio.selectedElement) {
                switch(drawio.selectedShape) {
                    case 'rectangle':
                        drawio.selectedElement.resize(mouseEvent.offsetX, mouseEvent.offsetY);
                        break;
                    case 'circle':
                        drawio.selectedElement.resize(mouseEvent.offsetX, mouseEvent.offsetY);
                        break;
                    case 'line':
                        drawio.context.clearRect(0, 0, drawio.canvas.width, drawio.canvas.height);
                        drawio.context.beginPath();
                        drawio.context.lineCap = "round";
                        drawio.context.moveTo(drawio.selectedElement.position.x, drawio.selectedElement.position.y);
                        drawio.context.lineTo(mouseEvent.offsetX, mouseEvent.offsetY);
                        drawio.selectedElement.position2 = {x:mouseEvent.offsetX, y:mouseEvent.offsetY};
                        drawio.context.stroke();
                        break;
                    case 'pencil':
                        drawio.selectedElement.pathArray.push({x:mouseEvent.offsetX, y:mouseEvent.offsetY});
                        break;
                    case 'text':
                        canvas = document.getElementById("my-canvas");
                        break;
                    default:
                        console.log("DIDNT FIND ANY");
                }
                drawio.context.clearRect(0, 0, drawio.canvas.width, drawio.canvas.height);
                drawCanvas();
            }
        };
        });

    //mouseup
    $('#my-canvas').on('mouseup', function () {
        if (drawio.selectedShape !== 'move') {
            drawio.shapes.push(drawio.selectedElement);
            drawio.selectedElement = null;
            drawCanvas();
        }
        console.log("MOUSE UP ");
        if (drawio.selectedElement != null) {
            drawio.shapes.push(drawio.selectedElement);
        }
        console.log(drawio.shapes);
        drawio.selectedElement = null;
        drawio.context.beginPath();

    })
});