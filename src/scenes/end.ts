import { getCanvas, getContext, Scene, Sprite, Pool, Animation, Text, collides, initKeys, initPointer, keyPressed, onKey } from 'kontra';
import { deathImage, godImage, heartImage, coinImage } from '../animation'
import Button from '../button'
import { reveal } from './reveal';
const { abs, min, max, random, PI } = Math;
const STATUS_OVER = 3;
const STATUS_WIN = 4;
const endScene = (canvas, context, state, cb) => {
    const clientWidth = canvas.clientWidth
    const clientHeight = canvas.clientHeight
    const delta = min(clientWidth, clientHeight)

    let title = Text({
        text: state.status === STATUS_OVER ? "This is the END" : "You WON my friend",
        font: '42px monospace, sans-serif',
        color: 'black',
        x: 5,
        y: 45
    })

    let subtitle = Text({
        text: state.status === STATUS_OVER ? "my UGLY friend" : "this is the end",
        font: '42px monospace, sans-serif',
        color: 'black',
        x: 5,
        y: 45
    })


    let button = Button({
        text: 'You may retry',
        handler: cb,
        keyName: 'space'
    });



    let deathImg = deathImage();
    let ratio = deathImg.naturalHeight / deathImg.naturalWidth
    if (state.status === STATUS_OVER) {
        deathImg.height = (clientHeight - 4 * title.height) / 2
        deathImg.width = deathImg.height * ratio
    } else {
        deathImg.height = clientHeight - 4 * title.height
        deathImg.width = deathImg.height * ratio
    }


    let godImg = godImage();
    ratio = godImg.naturalHeight / godImg.naturalWidth
    godImg.height = clientHeight - 4 * title.height
    godImg.width = godImg.height * ratio
    let god = Sprite({
        anchor: { x: .5, y: .5 },
        x: clientWidth - godImg.width / 2 + 45,
        y: clientHeight / 2,
        width: godImg.width,
        height: godImg.height,
        image: godImg
    })

    let death = Sprite({
        anchor: { x: .5, y: .5 },
        x: 45 + deathImg.width / 2,
        y: state.status === STATUS_OVER ? clientHeight - deathImg.height + 50 : clientHeight / 2,
        image: deathImg,
        rotation: state.status === STATUS_OVER ? -PI / 2 : 0
    })


    const scene = Scene({
        id: 'end',
        objects: [title, subtitle, button, death, god]
    });

    const splash = reveal({ canvas, context, count: 20, dt: 10, messages: [] })
    splash.init()

    return {
        update: () => {
            splash.update()
            title.x = (clientWidth - title.width) / 2
            subtitle.x = (clientWidth - subtitle.width) / 2
            subtitle.y = title.y + title.height * 2

            scene.update()
        },
        render: () => {
            scene.render()
            splash.render()

        }
    }

}

export default endScene
