import { Move } from './move';
import { Role } from './role';
import { State } from './state';
import { BasePlayer } from './base-player';

export class MinimaxPlayer<S> extends BasePlayer<S> {

  public selectMove(): Move {
    const legalMoves = this.stateMachine.getLegalMoves(this.stateMachine.getCurrentState(), this.stateMachine.getRole());
    let selection = legalMoves[0];
    if (legalMoves.length > 1) {
      let score = Number.MIN_SAFE_INTEGER;
      for (const move of legalMoves) {
        const result = this.miniScore(this.stateMachine.getCurrentState(), move, this.stateMachine.getRole(),
                                      Number.MIN_SAFE_INTEGER , Number.MAX_SAFE_INTEGER);
        if (result > score) {
          score = result;
          selection = move;
        }
      }
    }
    return selection;
  }

  private miniScore(state: State<S>, move: Move, role: Role, alpha: number, beta: number): number {
    const jointMoves = this.stateMachine.getLegalJointMovesByRoleMove(state, role, move);
    for (const moves of jointMoves) {
      const nextState = this.stateMachine.getNextState(state, moves);
      const result = this.maxScore(nextState, role, alpha, beta);
      beta = Math.min(beta, result);
      if (beta <= alpha) { return alpha; }
    }
    return beta;
  }

  private maxScore(state: State<S>, role: Role, alpha: number, beta: number): number {
    if (this.stateMachine.isTerminal(state)) {
      const goal = this.stateMachine.getGoal(state, role);
      return goal;
    }

    const legalMoves = this.stateMachine.getLegalMoves(state, role);
    for (const move of legalMoves) {
      const result = this.miniScore(state, move, role, alpha, beta);
      alpha = Math.max(alpha, result);
      if (alpha >= beta) { return beta; }
    }
    return alpha;
  }

}
