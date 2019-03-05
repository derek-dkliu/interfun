import { StateMachine } from './state-machine';
import { Move } from './move';

export abstract class BasePlayer<S> {
  protected stateMachine: StateMachine<S>;

  abstract selectMove(): Move;

  constructor(stateMachine: StateMachine<S>) {
    this.stateMachine = stateMachine;
  }
}
