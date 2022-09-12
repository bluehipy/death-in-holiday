import DAETH_PNG from "./death.png"
import { init, getCanvas, getContext, SpriteSheet, GameLoop, Sprite, Pool, Animation, Button, Text, collides, initKeys, initPointer, keyPressed, onKey } from 'kontra';


const crop = (image, x, y, width, height) => new Promise((resolve, reject) => {

    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(image, x, y, width, height, 0, 0, width, height);
    let img = new Image()
    img.src = canvas.toDataURL();
    img.onload = () => resolve(img)
    img.onerror = () => reject(img)
})


let image = new Image();
image.src = DAETH_PNG
let spriteSheet = null;

let coinSheet = null
let resolver = null;
let promise = new Promise((resolve, reject) => {
    resolver = resolve;
})

let coinImg: HTMLImageElement
let deathImg: HTMLImageElement
let godImg: HTMLImageElement
let ghostImg: HTMLImageElement
let heartImg: HTMLImageElement

image.onload = async () => {
    spriteSheet = SpriteSheet({
        image: image,
        frameWidth: 220,
        frameHeight: 210,
        animations: {
            walk: {
                frames: [0, 1],
                loop: true,
                frameRate: 4
            }
        }
    });

    coinSheet = SpriteSheet({
        image: (await crop(image, 0, 220, 220, 120)) as HTMLImageElement,
        frameWidth: 110,
        frameHeight: 140,
        animations: {
            flip: {
                frames: [0, 1],
                frameRate: 4
            }
        }
    });
    coinImg = (await crop(image, 0, 220, 110, 120)) as HTMLImageElement
    deathImg = (await crop(image, 0, 0, 220, 210)) as HTMLImageElement
    godImg = (await crop(image, 220, 210, 220, 210)) as HTMLImageElement
    ghostImg = (await crop(image, 220, 250, 220, 160)) as HTMLImageElement
    heartImg = (await crop(image, 0, 340, 110, 140)) as HTMLImageElement
    resolver()
};




export const heroAnimations = () => {
    if (spriteSheet) {
        return spriteSheet.animations;
    }
};

export const coinAnimations = () => {
    if (coinSheet) {
        return coinSheet.animations;
    }
};

export const ready = async (callback) => {
    promise.then(callback)
}

export const coinImage = () => coinImg
export const deathImage = () => deathImg
export const godImage = () => godImg
export const ghostImage = () => ghostImg
export const heartImage = () => heartImg
