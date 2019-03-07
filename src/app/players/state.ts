import { Role } from './role';
import { Move } from './move';

export abstract class State {
  constructor(protected roles: Role[], protected controller: Role) {}

  abstract clone(): State;

  abstract getRepresentation(): string;

  abstract getLegalMoves(): Move[];

  abstract updateController(): void;

  abstract hash(): string;

  isController(role: Role): boolean {
    return this.getController().equals(role);
  }

  getControllerIndex(): number {
    return this.roles.findIndex(role => this.controller.equals(role));
  }

  getController(): Role {
    return this.controller;
  }

  getRole(index: number): Role {
    return this.roles[index];
  }

  getRoles(): Role[] {
    return this.roles;
  }
}
