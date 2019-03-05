import { StateMachine } from '../../players/state-machine';
import { Role } from 'src/app/players/role';
import { Move } from 'src/app/players/move';
import { State } from 'src/app/players/state';
import { Board, Winner } from './tic-tac-toe-rule';
import { Utils } from 'src/app/shares/utils';

export class TicTacToeMachine extends StateMachine<Board> {

  getLegalMoves(state: State<Board>, role: Role): Move[] {
    let moves = [ Move.noop() ];  // noop only, if not this role's turn

    const board = state.getContent();
    if (board.isController(role)) {
      moves = board.getLegalMoves();
    }

    return moves;
    // return Utils.shuffle(moves);
  }

  getNextState(state: State<Board>, moves: Move[]): State<Board> {
    const board = state.getContent().clone();
    for (const move of moves) {
      board.mark(move);
    }

    return new State<Board>(board);
  }

  isTerminal(state: State<Board>): boolean {
    const winner = state.getContent().getWinner();
    return winner !== Winner.Empty;
  }

  getGoal(state: State<Board>, role: Role): number {
    const winner = state.getContent().getWinner();
    if (role.is(winner)) {
      return 100;
    } else if (winner === Winner.Tie) {
      return 50;
    } else {
      return 0;
    }
  }

  getRoles(): Role[] {
    return this.getCurrentState().getContent().getRoles();
  }
}
