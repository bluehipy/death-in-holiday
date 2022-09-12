import { getCanvas, getContext, Scene, Sprite, Pool, Animation, Text, collides, initKeys, initPointer, keyPressed, onKey } from 'kontra';
import { deathImage, godImage, heartImage, coinImage } from '../animation'
import { reveal } from './reveal';
import Button from '../button'

const { abs, min, max, random } = Math;

const startScene = (canvas, context, cb) => {
  const clientWidth = canvas.clientWidth
  const clientHeight = canvas.clientHeight
  const delta = min(clientWidth, clientHeight)

  let title = Text({
    text: "DEATH in HOLLIDAY",
    font: '42px monospace, sans-serif',
    color: 'black',
    x: 5,
    y: 45,
    textAlign: 'center'
  })


  title.x = (clientWidth - title.width) / 2

  let button = Button({
    text: 'To start press',
    handler: cb,
    keyName: 'enter'
  });

  let deathImg = deathImage();
  let ratio = deathImg.naturalHeight / deathImg.naturalWidth
  deathImg.height = clientHeight - 4 * title.height
  deathImg.width = deathImg.height * ratio
  let death = Sprite({
    anchor: { x: .5, y: .5 },
    x: deathImg.width / 2,
    y: clientHeight / 2,
    width: deathImg.width,
    height: deathImg.height,
    image: deathImg
  })

  let godImg = godImage();
  ratio = godImg.naturalHeight / godImg.naturalWidth
  godImg.height = clientHeight - 4 * title.height
  godImg.width = godImg.height * ratio
  let god = Sprite({
    anchor: { x: .5, y: .5 },
    x: clientWidth - godImg.width / 2 + 45,
    y: clientHeight / 2,
    image: godImg
  })



  const scene = Scene({
    id: 'start',
    objects: [title, button, death, god]
  });
  const heartImg = heartImage()
  heartImg.width = heartImg.height = 25

  const coinImg = coinImage()
  coinImg.width = coinImg.height = 25

  const splash = reveal({
    canvas, context, count: 20, dt: 600, messages: [
      "[CONTROLS]",
      "[ arrow Up] ~ jump (max 3 jumps),",
      "[ space ] throw coins", " ",
      "[Story]",
      "God is testing you... again",
      "Youhave to save 100 souls!",
      "Every misstake costs 1 coin",
      "Every soul you miss costs 1 heart",
      "[ENTER to start]",
      " ",
      "Dedicated to my <3 son <3"
    ]
  })
  splash.init()
  return {
    update: () => {
      splash.update();
      title.x = (clientWidth - title.width) / 2
      button.x = clientWidth / 2
      button.y = (clientHeight - button.height) / 2


      scene.update()
    },
    render: () => {
      scene.render()
      splash.render()

    }
  }

}

export default startScene
