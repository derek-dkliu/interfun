import { StateMachine } from '../../players/state-machine';
import { Role } from 'src/app/players/role';
import { Move } from 'src/app/players/move';
import { Board } from './dou-shou-qi-rule';
import { Qi } from './dou-shou-qi-data';

export class DouShouQiMachine extends StateMachine<Board> {

  getLegalMoves(state: Board, role: Role): Move[] {
    return state.getLegalMoves(role);
  }

  getNextState(state: Board, moves: Move[]): Board {
    const board = state.clone();
    for (const move of moves) {
      board.takeMove(move);
    }

    return board;
  }

  isTerminal(state: Board): boolean {
    const winner = state.getWinner();
    return winner !== Qi.empty;
  }

  getGoal(state: Board, role: Role): number {
    const winner = state.getWinner();
    if (role.is(winner)) {
      return 1 + 1 / state.getRound();
    } else {
      return 0;
    }
  }

  getRoles(): Role[] {
    return this.getCurrentState().getRoles();
  }
}
