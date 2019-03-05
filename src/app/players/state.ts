export class State<S> {
  constructor(protected content: S) {}

  getContent(): S {
    return this.content;
  }
}
