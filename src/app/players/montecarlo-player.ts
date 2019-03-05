import { Move } from './move';
import { Role } from './role';
import { State } from './state';
import { BasePlayer } from './base-player';

const LIMIT = 3;
const PROBE = 6;

export class MontecarloPlayer<S> extends BasePlayer<S> {

  public selectMove(): Move {
    const legalMoves = this.stateMachine.getLegalMoves(this.stateMachine.getCurrentState(), this.stateMachine.getRole());
    let selection = legalMoves[0];
    if (legalMoves.length > 1) {
      let score = Number.MIN_SAFE_INTEGER;
      for (const move of legalMoves) {
        const result = this.miniScore(this.stateMachine.getCurrentState(), move, this.stateMachine.getRole(), 0);
        if (result > score) {
          score = result;
          selection = move;
        }
      }
    }
    return selection;
  }

  private miniScore(state: State<S>, move: Move, role: Role, level: number): number {
    const jointMoves = this.stateMachine.getLegalJointMovesByRoleMove(state, role, move);
    let score = Number.MAX_SAFE_INTEGER;
    for (const moves of jointMoves) {
      const nextState = this.stateMachine.getNextState(state, moves);
      const result = this.maxScore(nextState, role, level + 1);
      if (result < score) {
        score = result;
      }
    }
    return score;
  }

  private maxScore(state: State<S>, role: Role, level: number): number {
    if (this.stateMachine.isTerminal(state)) {
      return this.stateMachine.getGoal(state, role);
    }

    if (level > LIMIT) {
      return this.monteCarlo(state, role, PROBE);
    }

    const legalMoves = this.stateMachine.getLegalMoves(state, role);
    let score = Number.MIN_SAFE_INTEGER;
    for (const move of legalMoves) {
      const result = this.miniScore(state, move, role, level);
      if (result > score) {
        score = result;
      }
    }
    return score;
  }

  private monteCarlo(state: State<S>, role: Role, probe: number): number {
    let total = 0;
    for (let i = 0; i < probe; i++) {
      total += this.depthCharge(state, role);
    }
    return total / probe;
  }

  private depthCharge(state: State<S>, role: Role): number {
    if (this.stateMachine.isTerminal(state)) {
      return this.stateMachine.getGoal(state, role);
    }

    const randomJointMoves = this.stateMachine.getRandomJointMove(state);
    const nextState = this.stateMachine.getNextState(state, randomJointMoves);
    return this.depthCharge(nextState, role);
  }
}


