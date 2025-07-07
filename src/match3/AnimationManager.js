export default class AnimationManager {
  constructor() {
    this.list = [];
  }

  add(a) {
    this.list.push(a);
  }

  update(now) {
    this.list.forEach((a) => a.tick(now));
    this.list = this.list.filter((a) => !a.done);
  }

  isAnimating() {
    return this.list.length > 0;
  }
}
