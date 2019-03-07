import { StateMachine } from '../../players/state-machine';
import { Role } from 'src/app/players/role';
import { Move } from 'src/app/players/move';
import { Board, Winner } from './tic-tac-toe-rule';

export class TicTacToeMachine extends StateMachine<Board> {

  getLegalMoves(state: Board, role: Role): Move[] {
    let moves = [ Move.noop() ];  // noop only, if not this role's turn

    if (state.isController(role)) {
      moves = state.getLegalMoves();
    }

    return moves;
  }

  getNextState(state: Board, moves: Move[]): Board {
    const board = state.clone();
    for (const move of moves) {
      board.mark(move);
    }

    return board;
  }

  isTerminal(state: Board): boolean {
    const winner = state.getWinner();
    return winner !== Winner.Empty;
  }

  getGoal(state: Board, role: Role): number {
    const winner = state.getWinner();
    if (role.is(winner)) {
      return 1 + state.getLegalMoves().length * 0.1;
    } else if (winner === Winner.Tie) {
      return 0.5;
    } else {
      return 0;
    }
  }

  getRoles(): Role[] {
    return this.getCurrentState().getRoles();
  }
}
