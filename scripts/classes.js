import * as THREE from 'three';

export const gravity = 9.8;

export function objInCanvas(canvas, x, y, width, height) {
    return (x > -width && x < canvas.width && y > -height && y < canvas.height);
}

export function objCollision(obj1, obj2) {
    return (x > -width && x < canvas.width && y > -height && y < canvas.height);
}

export class Vector2 extends THREE.Vector2 {
    setLinearVelocity(vec2) {
        this.linearVelocity = vec2;
    }

    static get zero() {
        return new Vector2(0, 0);
    }

    static get one() {
        return new Vector2(1, 1);
    }

    static get up() {
        return new Vector2(0, 1);
    }

    static get down() {
        return new Vector2(0, -1);
    }

    static get left() {
        return new Vector2(-1, 0);
    }

    static get right() {
        return new Vector2(1, 0);
    }
}

export class Vector3 extends THREE.Vector3 {
    setLinearVelocity(vec3) {
        this.linearVelocity = vec3;
    }

    static get zero() {
        return new Vector3(0, 0, 0);
    }

    static get one() {
        return new Vector3(1, 1, 1);
    }

    static get up() {
        return new Vector3(0, 1, 0);
    }

    static get down() {
        return new Vector3(0, -1, 0);
    }

    static get left() {
        return new Vector3(-1, 0, 0);
    }

    static get right() {
        return new Vector3(1, 0, 0);
    }

    static get forward() {
        return new Vector3(0, 0, 1);
    }

    static get back() {
        return new Vector3(0, 0, 1);
    }
}

export let skybox = "stripes";
export function switchSkybox() {
    switch (skybox) {
        default:
            skybox = "grid";
            break;
        case "grid":
            skybox = "stripes";
            break;
        case "stripes":
            skybox = "";
            break;
    }
}

let camPos = Vector3.back;
if (localStorage.getItem("layout")) {
    let parse = JSON.parse(localStorage.getItem("layout")).camPos;
    camPos.set(parse.x, parse.y, parse.z);
}

export { camPos };
export let mouseButtons = Vector3.zero;

export const uiLimits = [
    { class: "leftSide", min: 0, max: 250 },
    { class: "body2", min: -250, max: 0 },
    { class: "rightSide", min: 0, max: 250 }
];

export function getUiLimit(elClass, elScale) {
    if (elScale < uiLimits.find((element) => element.class === elClass).min) {
        return false;
    }

    if (elScale > uiLimits.find((element) => element.class === elClass).max) {
        return false;
    }

    return true;
}

export function setUiLimit(elClass, elScale) {
    if (elScale < uiLimits.find((element) => element.class === elClass).min) {
        elScale = uiLimits.find((element) => element.class === elClass).min;
    }

    if (elScale > uiLimits.find((element) => element.class === elClass).max) {
        elScale = uiLimits.find((element) => element.class === elClass).max;
    }

    return elScale;
}

export const uiScale = [
    { class: "leftSide", scale: 0 },
    { class: "body2", scale: 0 },
    { class: "rightSide", scale: 0 }
];

export function getUiScale(elClass, bool) {
    if (bool) {
        return uiScale.find((el) => el.class === elClass).scale !== setUiLimit(elClass, uiScale.find((el) => el.class === elClass).scale);
    } else {
        return uiScale.find((el) => el.class === elClass).scale;
    }
}

export function setUiScale(elClass, elScale) {
    uiScale.find((el) => el.class === elClass).scale = setUiLimit(elClass, elScale);
}

export function saveLayout() {
    let leftSideScale = 0;
    if (document.getElementsByClassName("layout")[0].style.gridTemplateColumns != "") {
        leftSideScale = JSON.parse(document.getElementsByClassName("layout")[0].style.gridTemplateColumns.split("calc(")[1].split("px")[0])
    }

    localStorage.setItem("layout", JSON.stringify({
        camPos: camPos,
        leftSideScale: leftSideScale
    }));
}

export function loadLayout() {
    camPos = Vector3.back;
    if (localStorage.getItem("layout")) {
        let parse = JSON.parse(localStorage.getItem("layout")).camPos;
        camPos.set(parse.x, parse.y, parse.z);
    }
}