import { init, getCanvas, getContext, GameLoop, Sprite, Pool, Animation, Button, Text, collides, initKeys, initPointer, keyPressed, onKey } from 'kontra';
const { max, random } = Math;

const pool = Pool({
    create: Sprite
});

interface PlatformOptions {
  clientWidth:number;
  clientHeight:number;
  width:number;
  count:number;
  onLoop():void;
}

export const platform = (options:PlatformOptions) => {
  let { clientWidth, clientHeight, width, count, onLoop } = options;
  return {
    init: () => {
        pool.clear();
        let d = 0;
        for (let i = 0; i < count; i++) {
            let dx = width + random() * width >> 0
            let w = i ? 5 + width * random() >> 0 : clientWidth
            let h = (clientHeight / 4 + random() * clientHeight / 4) >> 0
            pool.get({
                x: d,
                y: clientHeight - h,
                width: w,
                height: 15,
                color: 'red',
                dx: -1,
                children: [Sprite({
                    x: 0,
                    y: 15,
                    width: w,
                    height: clientHeight - 15,
                    color: 'orange'
                })]
            });
            d += w + dx;
        }

    },
    update: () => {
        pool.update()
        let d = max(...pool.objects.map((obj:Sprite) => {
            obj.color = "red";
            return obj.x + obj.width;
        }))
        let index:number = pool.objects.findIndex((obj:Sprite) => obj.x < -obj.width)
        let obj:Sprite = index > -1 ? pool.objects[index] as Sprite: undefined

        if (obj) {
            obj.x = d + width + random() * width >> 0
            obj.y = clientHeight - ((clientHeight / 4 + random() * clientHeight / 4) >> 0)
        }
        if (index === count - 1) {
            onLoop()
            pool.getAliveObjects().map((o:Sprite) => o.dx -= 1)
        }
    },
    render: () => {
        pool.render()

    },
    map: (cb) => pool.getAliveObjects().map(cb),
    find: (cb) => pool.getAliveObjects().find(cb) as Sprite,
    findIndex: (cb) => pool.getAliveObjects().findIndex(cb),
    walls: () => pool.getAliveObjects().map((o:Sprite) => o.children[0] as Sprite)
}
}
