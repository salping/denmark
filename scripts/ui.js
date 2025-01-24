import * as THREE from 'three';
import * as ENGINE from './classes.js';
import { moveCam, canvas, ctx } from "./engine.js";

document.body.oncontextmenu = (e) => {
    e.preventDefault();
}

canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

function resizeCanvas() {
    ENGINE.saveLayout();
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    ctx.save();
    ctx.translate(ENGINE.camPos.x, ENGINE.camPos.y);
    ctx.scale(ENGINE.camPos.z, ENGINE.camPos.z);

    drawImageActualSize(image);
    ctx.restore();
}

document.body.onresize = resizeCanvas;

export const image = new Image();
export let imgScale = new THREE.Vector2(0.25,0.25);
image.src = "img/its-all-canvas-v5.png";

export function drawImageActualSize(image) {
    // if (image && ENGINE.objInCanvas(canvas, ENGINE.camPos.x+(image.naturalHeight*imgScale.y*ENGINE.camPos.z)/2, ENGINE.camPos.y+(image.naturalWidth*imgScale.x*ENGINE.camPos.z)/2, image.naturalWidth*imgScale.x, image.naturalHeight*imgScale.y)) {

    if (image) {
        ctx.drawImage(image,
            canvas.width/2 - image.naturalWidth*imgScale.x/2,
            canvas.height/2 - image.naturalHeight*imgScale.y/2,
            image.naturalWidth*imgScale.x,
            image.naturalHeight*imgScale.y
        );
    }
}

document.body.onload = () => {
    ENGINE.loadLayout();
};

image.onload = () => {
    ctx.save();
    ctx.translate(ENGINE.camPos.x, ENGINE.camPos.y);
    ctx.scale(ENGINE.camPos.z, ENGINE.camPos.z);
    drawImageActualSize(image);
    ctx.restore();
};

const layout = document.getElementsByClassName("layout")[0];
let resizeLayout = null;
let bodyScalePos = null;

let uiElementClicking = null;

layout.onpointerdown = (e) => {
    uiElementClicking = e.target;
    if (uiElementClicking === document.getElementById("view")) {
        ENGINE.switchSkybox();
    }

    if (e.which === 3 && e.target.className === "body") {
        ENGINE.mouseButtons.z = 1;
    }

    resizeIdle(e);
    layout.onpointermove = resize;
    layout.setPointerCapture(e.pointerId);
}

layout.onpointermove = resizeIdle;

function resizeIdle(e) {
    if (!e.target.classList.contains('header') && !e.target.closest('.header') && !e.target.classList.contains('footer') && !e.target.closest('.footer') && !e.target.classList.contains('layout') && e.target.tagName === "DIV") {
        if (e.offsetX < 2 || e.offsetX > e.target.clientWidth - 4 || (e.pressure > 0 && layout.style.cursor === "col-resize")) {
            if (bodyScalePos === null) {
                if (e.offsetX > e.target.clientWidth - 4) {
                    bodyScalePos = "right";
                } else if (e.offsetX < 2) {
                    bodyScalePos = "left";
                }
            }

            if (resizeLayout === null) {
                resizeLayout = e.target.className;
            }

            layout.style.cursor = "col-resize";
        } else if ((e.offsetY < 2) && e.target.className !== "leftSide" && e.target.className !== "rightSide" && e.target.className !== "body" || (e.offsetY > e.target.clientHeight - 4) && e.target.className !== "leftSide" && e.target.className !== "rightSide" && e.target.className !== "body2" || (e.pressure > 0 && layout.style.cursor === "row-resize")) {
            if (resizeLayout === null) {
                resizeLayout = e.target.className;
            }

            layout.style.cursor = "row-resize";
        } else {
            resizeLayout = null;
            layout.style.cursor = "default";
        }
    }

    if (!e.pressure > 0) {
        bodyScalePos = null;
        resizeLayout = null;
        // layout.style.cursor = "default";
    } else {
        if (uiElementClicking && uiElementClicking.tagName === "A" && e.target === uiElementClicking) {
            layout.style.cursor = "pointer";
        } // else {
            // layout.style.cursor = "default";
        // }
    }
}

function resize(e) {
    if (!e.target.classList.contains('header') && !e.target.closest('.header') && !e.target.classList.contains('footer') && !e.target.closest('.footer')) {
        resizeIdle(e);

        if (e.pressure > 0 && resizeLayout) {
            if (layout.style.cursor === "col-resize") {
                switch (resizeLayout) {
                    case "body":
                        switch (bodyScalePos) {
                            case "left":
                                ENGINE.setUiScale("leftSide", ENGINE.getUiScale("leftSide") + e.movementX);
                                // moveCam(e,"x", ENGINE.getUiLimit("leftSide", ENGINE.getUiScale("leftSide") + e.movementX), "left");
                                break;
                            case "right":
                                ENGINE.setUiScale("rightSide",ENGINE.getUiScale("rightSide") - e.movementX);
                                // moveCam(e,"x", ENGINE.getUiLimit("rightSide",ENGINE.getUiScale("rightSide") - e.movementX));
                                break;
                        }
                        break;
                    case "leftSide":
                        ENGINE.setUiScale("leftSide", ENGINE.getUiScale("leftSide") + e.movementX);
                        // moveCam(e,"x", ENGINE.getUiLimit("leftSide", ENGINE.getUiScale("leftSide") + e.movementX), "left");
                        break;
                    case "rightSide":
                        ENGINE.setUiScale("rightSide",ENGINE.getUiScale("rightSide") - e.movementX);
                        // moveCam(e,"x", ENGINE.getUiLimit("rightSide",ENGINE.getUiScale("rightSide") - e.movementX));
                        break;
                }
                layout.style.gridTemplateColumns = `calc(15vw + ${ENGINE.getUiScale("leftSide")}px) calc(70vw - ${ENGINE.getUiScale("rightSide")}px - ${ENGINE.getUiScale("leftSide")}px) calc(15vw + ${ENGINE.getUiScale("rightSide")}px)`;
                resizeCanvas();
            } else if (layout.style.cursor === "row-resize") {
                switch (resizeLayout) {
                    case "body":
                        ENGINE.setUiScale("body2", ENGINE.getUiScale("body2") + e.movementY);
                        // moveCam(e,"y", ENGINE.getUiLimit("body2", ENGINE.getUiScale("body2") + e.movementY));
                        break;
                    case "body2":
                        ENGINE.setUiScale("body2",ENGINE.getUiScale("body2") + e.movementY);
                        // moveCam(e,"y", ENGINE.getUiLimit("body2",ENGINE.getUiScale("body2") + e.movementY));
                        break;
                }
                layout.style.gridTemplateRows = `1.25em calc(-1.25em + 75vh + ${ENGINE.getUiScale("body2")}px) calc(-1.25em + 25vh - ${ENGINE.getUiScale("body2")}px) 1.25em`;
                resizeCanvas();
            }
        } else {
            // if (ENGINE.objInCanvas(canvas, e.pageX-canvas.getBoundingClientRect().x, e.pageY-canvas.getBoundingClientRect().y, 0, 0)) {
                moveCam(e);
            // }

            resizeLayout = null;
            bodyScalePos = null;
            ENGINE.saveLayout();
        }
    } else {
        resizeLayout = null;
        bodyScalePos = null;
        if (uiElementClicking && uiElementClicking.tagName === "A") {
            layout.style.cursor = "pointer";
        } else {
            layout.style.cursor = "default";
        }
    }
}

layout.onpointerup = (e) => {
    layout.onpointermove = resizeIdle;
    layout.releasePointerCapture(e.pointerId);
    resizeIdle(e);

    if (e.which === 3) {
        ENGINE.mouseButtons.z = 0;
    }
}

document.getElementsByClassName("body")[0].onwheel = (e) => {
    moveCam(e);
    ENGINE.saveLayout();
}

document.addEventListener(
    'wheel',
    function touchHandler(e) {
        if (e.ctrlKey) {
            e.preventDefault();
        }
    },
    { passive: false }
);

// https://stackoverflow.com/questions/5916900/how-can-you-detect-the-version-of-a-browser
navigator.sayswho = (function(){
    const ua = navigator.userAgent;
    let tem;
    let M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if(/trident/i.test(M[1])){
        tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
        return 'IE '+(tem[1] || '');
    }
    if(M[1]=== 'Chrome'){
        tem= ua.match(/\b(OPR|Edge)\/(\d+)/);
        if(tem!= null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
    }
    M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
    if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);
    return M.join(' ');
})();

if (navigator.userAgentData) {
    if (navigator.userAgentData.brands.length > 2) {
        document.getElementsByClassName("footer")[0].innerText = `Running on ${navigator.userAgentData.brands[2].brand} (${navigator.userAgentData.brands[1].brand}) ${navigator.userAgentData.brands[2].version}, ${navigator.userAgentData.platform}, ${navigator.language}`;
    } else {
        document.getElementsByClassName("footer")[0].innerText = `Running on ${navigator.userAgentData.brands[0].brand} ${navigator.userAgentData.brands[0].version}, ${navigator.platform}, ${navigator.language}`;
    }

    if (navigator.userAgentData.mobile) {
        document.getElementsByClassName("footer")[0].innerText += ", Mobile"
    }
} else {
    document.getElementsByClassName("footer")[0].innerText = `Running on ${navigator.sayswho}, ${navigator.platform}, ${navigator.language}`;
}