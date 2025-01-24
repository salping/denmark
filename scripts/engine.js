import * as THREE from 'three';
import * as ENGINE from './classes.js';
import { drawImageActualSize, image, imgScale } from "./ui.js";

export const canvas = document.getElementById("canvas");
export const ctx = canvas.getContext('2d');

let circlePos = new ENGINE.Vector2(canvas.width/2, canvas.height/2);
let circlePosOld = new ENGINE.Vector2(canvas.width/2, canvas.height/2);

fetch('/files.json')
    .then(response => response.json())
    .then(files => {
        console.log(files);
    })
    .catch(error => console.error('Fetch error:', error));

function runtime() {
    switch(ENGINE.skybox) {
        default:
            ctx.fillStyle = ENGINE.skybox;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            break;
        case "grid":
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            document.getElementsByClassName("body")[0].style.background = "radial-gradient(ellipse at center, var(--dark-secondary) 0%, var(--dark-secondary) 25%, transparent 25%, transparent 100%) center repeat-x"
            document.getElementsByClassName("body")[0].style.backgroundRepeat = "repeat";
            document.getElementsByClassName("body")[0].style.backgroundPosition = `${ENGINE.camPos.x}px ${ENGINE.camPos.y}px`;
            document.getElementsByClassName("body")[0].style.backgroundSize = `${ENGINE.camPos.z*12}px ${ENGINE.camPos.z*12}px`;
            break;
        case "stripes":
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            document.getElementsByClassName("body")[0].style.background = "repeating-linear-gradient(-45deg, transparent, transparent 25%, var(--dark-secondary) 25%, var(--dark-secondary) 50%)";
            document.getElementsByClassName("body")[0].style.backgroundRepeat = "repeat";
            document.getElementsByClassName("body")[0].style.backgroundPosition = `${ENGINE.camPos.x}px ${ENGINE.camPos.y}px`;
            document.getElementsByClassName("body")[0].style.backgroundSize = `${ENGINE.camPos.z*12}px ${ENGINE.camPos.z*12}px`;
            break;
    }

    ctx.save();
    ctx.translate(ENGINE.camPos.x, ENGINE.camPos.y);
    ctx.scale(ENGINE.camPos.z, ENGINE.camPos.z);

    drawImageActualSize(image);
    if (circlePos.linearVelocity !== new ENGINE.Vector2()) {
        circlePos.x += circlePos.linearVelocity.x;
        circlePos.y += circlePos.linearVelocity.y;
        circlePos.linearVelocity.y += ENGINE.gravity;

        if (circlePos.x > canvas.width - 20 || circlePos.x < 22) {
            circlePos.linearVelocity.x = -circlePos.linearVelocity.x;
        }

        if (circlePos.y > canvas.height - 16) {
            if (circlePos.dropHeight > 0) {
                circlePos.dropHeight--;
                circlePos.linearVelocity.y = circlePos.dropHeight * -ENGINE.gravity;
            } else {
                circlePos.linearVelocity.y = 0;
                circlePos.y = canvas.height - 16;
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
        ctx.arc(circlePos.x, circlePos.y, 16, 0, 2 * Math.PI);
        // ctx.moveTo(Math.round(circlePosOld.x +ENGINE.camPos.x), Math.round(circlePosOld.y + ENGINE.camPos.y));
        // ctx.lineTo(Math.round(circlePos.x + ENGINE.camPos.x), Math.round(circlePos.y + ENGINE.camPos.y));
        // console.log(circlePos.x + camPos.x, circlePosOld.x + camPos.x);
        ctx.fillStyle = "red";
        // ctx.strokeStyle = "red";
        // ctx.lineWidth = 16;
        // ctx.closePath();
        ctx.fill();
        // ctx.stroke();

        circlePosOld = circlePos;
    }

    ctx.restore();
    window.requestAnimationFrame(runtime);
}

circlePos.setLinearVelocity(new ENGINE.Vector2(20, 0));
circlePos.dropHeight = 9;
window.requestAnimationFrame(runtime);

export function moveCam(e, axis, bool, pos) {
    if (bool === false) {
        return;
    }

    if (e.type.includes("pointer") && ENGINE.mouseButtons.z === 0 && axis === undefined) {
        return;
    }

    if (e.ctrlKey && !e.type.includes("pointer")) {
        const worldPos = new ENGINE.Vector2((e.offsetX - ENGINE.camPos.x) / ENGINE.camPos.z, (e.offsetY - ENGINE.camPos.y) / ENGINE.camPos.z);
        ENGINE.camPos.z += e.deltaY * -0.01;
        ENGINE.camPos.z = Math.max(0.25, Math.min(10, ENGINE.camPos.z));

        ENGINE.camPos.x = e.offsetX - worldPos.x * ENGINE.camPos.z;
        ENGINE.camPos.y = e.offsetY - worldPos.y * ENGINE.camPos.z;
    } else {
        if (e.deltaX !== undefined && e.deltaY !== undefined) {
            console.log("ME");
            ENGINE.camPos.sub(new ENGINE.Vector3(e.deltaX, e.deltaY, 0));
        }
    }

    if (e.deltaX === undefined) {
        console.log("MES");
        ENGINE.camPos.sub(new ENGINE.Vector3(-e.movementX, -e.movementY, 0));
    }
}

document.body.onkeyup = function (e) {
    if (e.key === " ") {
        ENGINE.camPos.set(0, 0, 1);
        ENGINE.saveLayout();
    }
}