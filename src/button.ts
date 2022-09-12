import { getCanvas, getContext, Sprite, Text, keyPressed } from 'kontra';

const { max } = Math;

const button = ({ text, keyName, handler }) => Sprite({
  color: "lime",
  children: [Text({
    text,
    color: "black",
    font: '30px monospace, sans-serif'
  }),
  Text({
    text: `[${keyName}]`,
    color: "black",
    font: '12px monospace, sans-serif'
  })],
  update: function () {
    const canvas = getCanvas();
    const me = this;
    let w = 0
    let h = 25;
    me.children.map((o: Text) => {
      w = max(w, o.width)
      o.x = (me.width - o.width) / 2
      o.y = h
      h += o.height + 25
    })

    me.width = w + 50
    me.height = h

    me.x = (canvas.clientWidth - me.width) / 2
    me.y = (canvas.clientHeight - me.height) / 2
    if (keyPressed(keyName)) {
      me.ttl = 0
      handler()
    }
  }
})

export default button
