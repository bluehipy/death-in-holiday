import { init, getCanvas, getContext, GameLoop, Sprite, Pool, Animation, Text, collides, initKeys, keyPressed, onKey } from 'kontra';
import Jump from './jump';
import Button from './button';
import startScene from './scenes/start'
import endScene from './scenes/end'
import { heroAnimations, coinAnimations, ready, godImage, ghostImage, heartImage } from './animation';
import { onKeyPressed } from './keys';
import { platform } from './platform';

init()
initKeys()

let canvas = getCanvas();
let context = getContext();
canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;
const sgn = (x: number): 0 | 1 | -1 => {
  if (x === 0) return 0
  return x < 1 ? -1 : 1;
}
const { abs, min, max, random } = Math;

const STATUS_INITIAL = 1;
const STATUS_PLAYING = 2;
const STATUS_OVER = 3;
const STATUS_WIN = 4;
const initialState = {
  active: true,
  jumping: false,
  shooting: false,
  jumps: 3,
  round: 0,
  status: STATUS_INITIAL,
  coins: 1,
  ghosts: 0,
  failed: 10
}
let state = { ...initialState }

const setState = (obj: any) => {
  state = { ...state, ...obj }
}

onKeyPressed('arrowup', () => {
  setState({ jumping: true })
})

onKeyPressed('space', () => {
  setState({ shooting: true })
})

ready(() => {
  let start: any;
  let end: any;


  const reset = () => {
    setState({ ...initialState })
    coins.clear();
    ghosts.clear()
    platforms.init()
    hero.y = 0;
  }
  let clientWidth = canvas.clientWidth
  let clientHeight = canvas.clientHeight
  let delta = min(clientWidth, clientHeight)

  let button;

  let hero = Sprite({
    x: clientWidth / 2 - delta / 8 / 2,
    y: delta / 8 * 210 / 220,
    width: delta / 8,
    height: delta / 8 * 210 / 220,
    animations: heroAnimations()
  })
  hero.acceleration.y = .2

  let godImg = godImage()
  godImg.width = delta / 4
  godImg.height = delta / 4 * 210 / 220

  let god = Sprite({
    x: hero.x + hero.width / 2,
    y: clientHeight - godImg.height - 5,
    width: delta / 4,
    height: delta / 4 * 210 / 220,
    image: godImg,
    opacity: .8
  })

  let ghostImg = ghostImage()
  ghostImg.width = delta / 8
  ghostImg.height = delta / 8 * 210 / 220

  const ghosts = Pool({
    create: Sprite,
    maxSize: 10
  });

  let coinText = Text({
    text: '' + state.coins,
    font: (delta / 16 >> 0) + 'px monospace, sans-serif',
    color: 'gold',
    x: 5,
    y: 5,
    textAlign: 'center'
  });

  let coin = Sprite({
    x: coinText.x + coinText.width + 5,
    y: 5,
    width: delta / 16,
    height: delta / 16,
    animations: coinAnimations()
  })

  let heartText = Text({
    text: '' + state.ghosts,
    font: (delta / 16 >> 0) + 'px monospace, sans-serif',
    color: 'red',
    x: 5 + coin.x + coin.width,
    y: 5,
    textAlign: 'center'
  });


  let heartImg = heartImage()
  heartImg.width = delta / 16
  heartImg.height = delta / 16 + 9

  const heart = Sprite({
    y: 5,
    x: 5 + heartText.x + heartText.width,
    width: delta / 16,
    height: delta / 16 + 9,
    image: heartImg

  })


  const coins = Pool({
    create: Sprite
  });

  const bullets = Pool({
    create: Sprite
  });

  const platforms = platform({
    clientWidth,
    clientHeight,
    width: hero.width,
    count: 10,
    onLoop: () => setState({ round: state.round + 1 })
  })
  platforms.init()

  const floor = Sprite({
    x: 0,
    y: 7 * clientHeight / 8 + 15,
    width: clientWidth,
    height: clientHeight / 8 - 15,
    color: 'orange'
  })

  let actions: any = [];

  let flyingCoin: Sprite = null;

  const loop = GameLoop({
    update: () => {
      if (state.status === STATUS_OVER || state.status === STATUS_WIN) {
        start = null
        if (!end) {
          end = endScene(canvas, context, state, () => {
            setState({ status: STATUS_INITIAL })
          })
        }
        end.update()
      } else if (state.status === STATUS_INITIAL) {
        if (!start) {
          start = startScene(canvas, context, () => {
            reset()
            setState({ status: STATUS_PLAYING })
          })

        }
        start.update()
        end = null;
      } else {
        start = null;
        end = null;
        hero.update()
        button && button.update()
        god.image.width = delta / 4
        god.image.height = delta / 4 * 210 / 220

        heart.image.width = delta / 16
        heart.image.height = delta / 16 + 9

        if (collides(hero, floor)) {
          setState({ active: false })
          hero.velocity.y = 0
          hero.y = clientHeight - hero.height
          if (!state.coins) {
            setState({ status: STATUS_OVER, jumping: false })
            hero.y = 0
          } else {
            if (!button) {
              button = Button({
                text: 'Bail out: 1 coin',
                keyName: 'enter',
                handler: () => {
                  if (state.coins > 0) {
                    hero.y = 0
                    setState({ active: true, coins: state.coins - 1, jumping: false, jumps: initialState.jumps })
                  }
                  button = null
                }
              })
            }
          }
        }
        if (!state.active) {
          return
        }

        platforms.update()
        coin.update()
        heart.update()
        coins.update()
        ghosts.update()
        bullets.update()


        if (coins.size === 0 && 6 * random() > 5.5) {
          let coin: Sprite = coins.get({
            x: clientWidth,
            y: random() * clientHeight / 4,
            width: delta / 16,
            height: delta / 16,
            animations: coinAnimations(),
            ttl: 1000,
            dx: -2
          }) as Sprite
          coin.playAnimation('flip');
        } else {
          flyingCoin = coins.getAliveObjects()[0] as Sprite
        }
        if (flyingCoin) {
          flyingCoin.playAnimation('flip')
        }

        if (random() > .8 && ghosts.size < state.round) {
          let scale = random() * 5
          ghosts.get({
            image: ghostImg,
            width: ghostImg.width,
            height: ghostImg.height,
            x: clientWidth,
            y: clientHeight / 4 + random() * clientHeight / 4,
            dx: -1 - random() * 5 >> 0,
            rotation: random() * 360 >> 0,
            anchor: { x: .5, y: .5 },
            scaleX: (scale + 5) / 10,
            scaleY: (scale + 5) / 10,
            opacity: .5 + random() * .5

          })
        }

        if (ghosts.size) {
          ghosts.getAliveObjects().map((ghost: Sprite) => {
            ghost.rotation += Math.PI / 180
            if (ghost.x < 0) {
              ghost.ttl = 0
              setState({ failed: state.failed - 1 })
            }
          })
          let flyingGhosts = ghosts.getAliveObjects()
            .filter((ghost: Sprite) => bullets.getAliveObjects().find((bullet: Sprite) => collides(bullet, ghost)))
          if (flyingGhosts.length) {
            flyingGhosts.map((gyost: Sprite) => {
              gyost.ttl = 0
              setState({ ghosts: state.ghosts + 1 })
            })
          }
        }

        if (bullets.size) {
          bullets.getAliveObjects().map((bullet: Sprite) => {
            if (bullet.x > clientWidth) {
              bullet.ttl = 0
            }
          })
        }

        if (flyingCoin && collides(flyingCoin, hero)) {
          flyingCoin.ttl = 0;
          setState({ coins: state.coins + 1 })
        }

        let index = platforms.findIndex((obj: Sprite) => obj.x < -obj.width)
        if (index === 9) {
          setState({ round: state.round + 1 })
        }

        platforms.map((o: Sprite, i: number) => {
          o.dx = -1 - state.round * .2
        })



        let target: Sprite = platforms.walls().find((obj: Sprite) => collides(obj, hero))
        if (!target) {
          target = platforms.find((obj: Sprite) => collides(obj, hero))
          if (target) {
            setState({ jumps: initialState.jumps })
            hero.velocity.y = 0;
            hero.y = target.y - hero.height;
            target.color = "green";
          }
        }


        actions = actions.filter((action: { active: boolean }) => action.active)

        if (state.jumping && state.jumps > 0) {
          setState({ jumping: false, jumps: state.jumps - 1 })
          actions.push(new Jump(hero, {
            maxHeight: clientHeight / 4, duration: 1 / (state.round + 1
            )
          }))
        }

        actions.map((action: { update(): void }) => action.update())

        if (hero.y < 0) {
          hero.y = 0
        }

        if (hero.y > clientHeight - hero.height) {
          hero.y = clientHeight - hero.height
        }

        if (abs(hero.velocity.y) > 10) {
          hero.velocity.y = 10 * sgn(hero.velocity.y)
        }
        coinText.text = '' + state.coins;
        coin.x = coinText.x + coinText.width + 5
        heartText.text = '' + (state.ghosts + state.failed)
        heartText.x = 15 + coin.x + coin.width
        heart.x = heartText.x + heartText.width + 5

        hero.playAnimation('walk')

        if (state.shooting) {
          if (state.coins) {
            setState({ coins: state.coins - 1, jumps: initialState.jumps })
            bullets.get({
              anchor: { x: .5, y: .5 },
              x: hero.x + hero.width / 2,
              y: hero.y + hero.height / 2,
              dx: 10,
              animations: coinAnimations(),
              width: delta / 16,
              height: delta / 16
            })
          }
          setState({ shooting: false })
        }

        if (state.failed + state.ghosts <= 0) {
          setState({ status: STATUS_OVER })
        }

        if (state.failed + state.ghosts >= 20) {
          setState({ status: STATUS_WIN })
        }
      }
    },
    render: () => {
      if (state.status === STATUS_OVER || state.status === STATUS_WIN) {
        end && end.render()
      } else if (state.status === STATUS_INITIAL) {
        start && start.render()
      } else {
        floor.render()
        coins.render()
        platforms.render()
        hero.render()
        ghosts.render()
        coin.render()
        coinText.render()
        heart.render()
        heartText.render()
        god.render() // this gets philosophical :))
        button && button.render()
        bullets.render()
      }
    }
  })

  loop.start();

})
