import { Sprite, Pool, Text } from 'kontra';
const { abs, min, max, random } = Math;

interface RevealOptions {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    count: number;
    dt: number;
    messages: string[]
}

export const reveal = (options: RevealOptions) => {
    let { canvas, context, count, dt, messages } = options;
    const pool = Pool({ create: Sprite })
    const summary = Pool({ create: () => Text({ x: 0, y: 0, text: "" }) })
    const w = canvas.clientWidth / count
    const h = canvas.clientHeight / count
    messages = messages || [];


    return {
        pool: pool,
        init: () => {
            pool.clear()
            summary.clear()
            for (let i = 0; i < count; i++) {
                for (let j = 0; j < count; j++) {
                    pool.get({
                        x: i * w,
                        y: j * h,
                        width: w + 1,
                        height: h + 1,
                        color: "black",
                        ttl: dt + i * 2 + j * count

                    })
                }

            }
            messages.map(msg => summary.get({
                x: 0,
                y: 0,
                font: '42px monospace, sans-serif',
                color: 'white',
                text: msg,
                ttl: dt
            }))
        },
        update: () => {
            pool.update()
            summary.update()
            let y = 0
            summary.getAliveObjects().map((msg: Text) => {
                msg.y = y + 5
                y += msg.height
                msg.x = (canvas.clientWidth - msg.width) / 2
            })

        },
        render: () => {
            pool.render()
            summary.render()
        }
    }

}
