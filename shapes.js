function Shape(position, color, size) {
    //position.x, position.y
    this.position = position;
    this.color = color;
    this.size = size;
}

Shape.prototype.render = function () {};
Shape.prototype.move = function (position) {
    this.position = position;
};
Shape.prototype.resize = function () {};

function Rectangle(position, width, height, color, lineWidth, fillOrStroke) {
    Shape.call(this, position, color);
    this.width = width;
    this.height = height;
    this.color = color;
    this.lineWidth = lineWidth;
    this.fillOrStroke = fillOrStroke;
}

//Assign prototype
Rectangle.prototype = Object.create(Shape.prototype);
Rectangle.prototype.constructor = Rectangle;

Rectangle.prototype.render = function() {
    if (this.fillOrStroke === 'stroke') {
        drawio.context.strokeStyle = this.color;
        drawio.context.lineWidth = this.lineWidth;
        drawio.context.strokeRect(this.position.x, this.position.y, this.width, this.height);
    }
    else {
        drawio.context.fillStyle = this.color;
        drawio.context.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
};

Rectangle.prototype.resize = function (x, y) {
    this.width = x - this.position.x;
    this.height = y - this.position.y;
};

Rectangle.prototype.contains = function (x, y) {
    if(this.position.x < x && x < this.position.x + this.width && this.position.y < y && y < this.position.y + this.height){
        return true
    }
};


function Circle(position, center, radius, angle, color, width, fillOrStroke) {
    Shape.call(this, position);
    this.center = center;
    this.radius = radius;
    this.color = color;
    this.width = width;
    this.fillOrStroke = fillOrStroke;
}

Circle.prototype = Object.create(Shape.prototype);
Circle.prototype.constructor = Circle;
Circle.prototype.render = function() {
    if (this.fillOrStroke === 'stroke') {
        drawio.context.beginPath();
        drawio.context.strokeStyle = this.color;
        drawio.context.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
        drawio.context.lineWidth = this.width;
        drawio.context.stroke();
    }
    else {
        drawio.context.beginPath();
        drawio.context.fillStyle = this.color;
        drawio.context.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
        drawio.context.fill();
    }
};

Circle.prototype.resize = function (x, y) {
    const a = this.position.x - x;
    const b = this.position.y - y;
    this.radius = Math.sqrt(a*a + b*b);
};


function Line(position, color, width, position2) {
    Shape.call(this, position, position2);
    this.width = width;
    this.color = color;
    drawio.context.moveTo(this.position.x, this.position.y);
    this.position = position
    this.position2 = position2
}

Line.prototype = Object.create(Shape.prototype);
Line.prototype.constructor = Line;
Line.prototype.render = function() {
    drawio.context.strokeStyle = this.color;
    drawio.context.beginPath();
    drawio.context.moveTo(this.position.x, this.position.y);
    drawio.context.lineTo(this.position2.x, this.position2.y);
    drawio.context.lineWidth = this.width;
    drawio.context.stroke();
    
};
Line.prototype.resize = function (x, y) {
    this.position2 = {x,y}
};


// this one save the drawing
function Pencil(position, color, size) {
    Shape.call(this, position, color, size);
    this.pathArray = [];
    this.color = color;
    this.width = size ;
}   

Pencil.prototype = Object.create(Shape.prototype);
Pencil.prototype.constructor = Pencil;
Pencil.prototype.render = function() {
    for (let i = 0; i < this.pathArray.length; i++) {
        const point = this.pathArray[i];
         if (i>=1) {
            const lastPoint = this.pathArray[i-1];
            drawio.context.lineTo(point.x, point.y);
            drawio.context.lineWidth = this.width;
         }
        drawio.context.strokeStyle = this.color;
        drawio.context.stroke();
        drawio.context.beginPath();
        drawio.context.fillStyle = this.color;
        drawio.context.arc(point.x, point.y, this.width/2, 0, Math.PI * 2); 
        drawio.context.fill();
        drawio.context.beginPath();
        drawio.context.moveTo(point.x, point.y);
    }
};
Pencil.prototype.resize = function (x, y) {
    this.position2 = {x,y}
};


function Text(position, font, size, color, textContent, fillOrStroke) {
    Shape.call(this, position, size, color);
    this.font = font;
    this.size = size;
    this.color = color;
    this.textContent = textContent;
    this.fillOrStroke = fillOrStroke;
}

Text.prototype = Object.create(Shape.prototype);
Text.prototype.constructor = Text;

Text.prototype.render = function() {
    drawio.context.fillRect(this.position.x, this.position.y, this.width, this.height);
    var form = this.size+"px "+this.font;
    drawio.context.font = form;
    if (this.fillOrStroke === 'stroke') {
        drawio.context.strokeStyle = this.color;
        drawio.context.strokeText(this.textContent, this.position.x, this.position.y);
    }
    else {
        drawio.context.fillStyle = this.color;
        drawio.context.fillText(this.textContent, this.position.x, this.position.y);
    }
};