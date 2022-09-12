let singleton = null;
const now = () => new Date().getTime()
interface Jump {
  type: string;
  active: boolean;
  t0: number;
  y0: number;
  y: number;
  duration: number;
  obj: any;
  constructor(): void;
  update(): void;
}
class Jump implements Jump {
  constructor(obj, { maxHeight, duration }) {
    if (singleton) {
      singleton.active = false
    }
    this.type = "jump";
    this.active = true
    this.t0 = now()
    this.y0 = obj.y
    this.y = obj.y - maxHeight
    this.duration = duration
    this.obj = obj
    singleton = this;
    obj.velocity.y = -Math.sqrt(2 * obj.acceleration.y * maxHeight)
  }
  update() {
    if (this.active) {
      let { obj, y0, y, duration, t0 } = this
      let t = now()
      if (t - t0 >= duration * 1000 || obj.y <= y) {
        this.active = false;
      }
    }
  }

}

export default Jump
