document.body.oncontextmenu = function (e) {
    e.preventDefault();
}

const gravity = 9.8;

class Vector2 {
    constructor(x, y) {
        if (x) {
            this.x = x;
        } else {
            this.x = 0;
        }

        if (y) {
            this.y = y;
        } else {
            this.y = 0;
        }
    }

    setLinearVelocity(vec2) {
        this.linearVelocity = vec2;
    }
}

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');

canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

document.body.onresize = function () {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
}

const image = new Image();
image.src = "img/its-all-canvas.jpg";

let camPos = new Vector2(0, 0);
function drawImageActualSize(image) {
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;

    ctx.drawImage(image, camPos.x, camPos.y);
}

image.onload = () => {
    drawImageActualSize(image);
};

document.body.onresize  = () => {
    drawImageActualSize(image);
};

const layout = document.getElementsByClassName("layout")[0];
let resizeLayout = null;

layout.onpointermove = (e) => {
    if (e.target.className !== "header" && e.target.className !== "footer") {
        if (e.offsetX < 2 || e.offsetX > e.target.clientWidth - 4) {
            layout.style.cursor = "col-resize";
        } else if ((e.offsetY < 2) && e.target.className !== "leftSide" && e.target.className !== "rightSide" && e.target.className !== "body" || (e.offsetY > e.target.clientHeight - 4) && e.target.className !== "leftSide" && e.target.className !== "rightSide" && e.target.className !== "body2") {
            layout.style.cursor = "row-resize";
        } else {
            layout.style.cursor = "default";
        }

        if (e.pressure > 0) {
            if (resizeLayout === null) {
                resizeLayout = e.target.className;
            }
            console.log("dragging ui: "+resizeLayout);
        } else {
            resizeLayout = null;
        }
    } else {
        layout.style.cursor = "default";
    }
}

let circlePos = new Vector2(canvas.width/2, canvas.height/2);

function runtime() {
    drawImageActualSize(image);
    circlePos.x += circlePos.linearVelocity.x;
    circlePos.y += circlePos.linearVelocity.y;
    circlePos.linearVelocity.y += gravity;

    if (circlePos.x > canvas.width || circlePos.x < 0) {
        circlePos.linearVelocity.x = -circlePos.linearVelocity.x;
    }

    if (circlePos.y > canvas.height - 24) {
        if (circlePos.dropHeight > 0) {
            circlePos.dropHeight--;
            circlePos.linearVelocity.y = circlePos.dropHeight * -gravity;
        } else {
            circlePos.linearVelocity.y = 0;
        }
    }

    if (Math.floor(Math.abs(circlePos.linearVelocity.x))) {
        if (circlePos.linearVelocity.x > 0) {
            circlePos.linearVelocity.x -= 0.1;
        } else {
            circlePos.linearVelocity.x += 0.1;
        }
    } else {
        circlePos.linearVelocity.x = 0;
    }

    ctx.beginPath();
    ctx.arc(circlePos.x + camPos.x, circlePos.y + camPos.y, 16, 0, 2 * Math.PI);
    ctx.fillStyle = "red";
    ctx.closePath();
    ctx.fill();

    window.requestAnimationFrame(runtime);
}

document.getElementById("start").onclick = function () {
    document.getElementById("start").remove();
    circlePos.setLinearVelocity(new Vector2(20, 0));
    circlePos.dropHeight = 9;

    window.requestAnimationFrame(runtime);
}

document.getElementsByClassName("body")[0].onpointermove = function (e) {
    if (e.pressure > 0) {
        camPos.x += e.movementX;
        camPos.y += e.movementY;
    }
}

document.body.onkeyup = function (e) {
    if (e.key === " ") {
        camPos = new Vector2();
    }
}