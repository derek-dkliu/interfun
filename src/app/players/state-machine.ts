import { Role } from './role';
import { Move } from './move';
import { State } from './state';

export abstract class StateMachine<S> {
  protected state: State<S>;
  protected role: Role;

  constructor(content: S, role: string) {
    this.state = new State<S>(content);
    this.role = Role.create(role);
  }

  abstract getLegalMoves(state: State<S>, role: Role): Move[];

  abstract getNextState(state: State<S>, moves: Move[]): State<S>;

  abstract isTerminal(state: State<S>): boolean;

  abstract getGoal(state: State<S>, role: Role): number;

  abstract getRoles(): Role[];

  getRole(): Role {
    return this.role;
  }

  getCurrentState(): State<S> {
    return this.state;
  }

  getLegalJointMovesByRoleMove(state: State<S>, role: Role, move: Move): Move[][] {
    const legals: Move[][] = [];
    for (const r of this.getRoles()) {
      if (r.equals(role)) {
        const m: Move[] = [];
        m.push(move);
        legals.push(m);
      } else {
        legals.push(this.getLegalMoves(state, r));
      }
    }

    const crossProduct: Move[][] = [];
    this.crossProductLegalMoves(legals, crossProduct, []);
    return crossProduct;
  }

  private crossProductLegalMoves(legals: Move[][], crossProduct: Move[][], partial: Move[]): void {
    if (partial.length === legals.length) {
      crossProduct.push(partial.slice());
    } else {
      for (const move of legals[partial.length]) {
        partial.push(move);
        this.crossProductLegalMoves(legals, crossProduct, partial);
        partial.pop();
      }
    }
  }
}
