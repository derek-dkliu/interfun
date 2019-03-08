export enum Qi {
  title = 'Jungle (Dou Shou Qi)',
  empty = '',
  row = 9,
  col = 7,
  separator = ',',
  play_time = 5,    // in seconds
  black = 'black',
  white = 'white',
  black_color = 'lightgreen',
  white_color = 'lightgoldenrodyellow',
  black_den = 'black_den',
  white_den = 'white_den',
  black_trap = 'black_trap',
  white_trap = 'white_trap',
  river = 'river',
  land = 'land',
  den_color = 'Maroon',
  trap_color = 'grey',
  river_color = 'SteelBlue',
  land_color = 'black',
  rat = 0,
  cat = 1,
  dog = 2,
  wolf = 3,
  leopard = 4,
  tiger = 5,
  lion = 6,
  elephant = 7,
  rat_text = '鼠',
  cat_text = '貓',
  dog_text = '狗',
  wolf_text = '狼',
  leopard_text = '豹',
  tiger_text = '虎',
  lion_text = '獅',
  elephant_text = '象',
  piece_border = 'black',
  piece_active = 'cyan',
}

export const ROLE_NAMES = [Qi.black.toString(), Qi.white.toString()];

export const BLACK_DEN = {row: 0, col: 3, type: Qi.white_den, color: Qi.den_color};
export const WHITE_DEN = {row: 8, col: 3, type: Qi.black_den, color: Qi.den_color};

export const DENS = [BLACK_DEN, WHITE_DEN];

export const BLACK_TRAPS = [
  {row: 0, col: 2, type: Qi.black_trap, color: Qi.trap_color},
  {row: 0, col: 4, type: Qi.black_trap, color: Qi.trap_color},
  {row: 1, col: 3, type: Qi.black_trap, color: Qi.trap_color}
];
export const WHITE_TRAPS = [
  {row: 8, col: 2, type: Qi.white_trap, color: Qi.trap_color},
  {row: 8, col: 4, type: Qi.white_trap, color: Qi.trap_color},
  {row: 7, col: 3, type: Qi.white_trap, color: Qi.trap_color}
];
export const RIVERS = [
  {row: 3, col: 1, type: Qi.river, color: Qi.river_color},
  {row: 4, col: 1, type: Qi.river, color: Qi.river_color},
  {row: 5, col: 1, type: Qi.river, color: Qi.river_color},
  {row: 3, col: 2, type: Qi.river, color: Qi.river_color},
  {row: 4, col: 2, type: Qi.river, color: Qi.river_color},
  {row: 5, col: 2, type: Qi.river, color: Qi.river_color},
  {row: 3, col: 4, type: Qi.river, color: Qi.river_color},
  {row: 4, col: 4, type: Qi.river, color: Qi.river_color},
  {row: 5, col: 4, type: Qi.river, color: Qi.river_color},
  {row: 3, col: 5, type: Qi.river, color: Qi.river_color},
  {row: 4, col: 5, type: Qi.river, color: Qi.river_color},
  {row: 5, col: 5, type: Qi.river, color: Qi.river_color}
];

export const SETTINGS = [DENS, BLACK_TRAPS, WHITE_TRAPS, RIVERS];

export const ANIMALS = [
  {row: 2, col: 0, owner: Qi.white, type: Qi.rat, text: Qi.rat_text, color: Qi.white_color, border: Qi.piece_border},
  {row: 1, col: 5, owner: Qi.white, type: Qi.cat, text: Qi.cat_text, color: Qi.white_color, border: Qi.piece_border},
  {row: 1, col: 1, owner: Qi.white, type: Qi.dog, text: Qi.dog_text, color: Qi.white_color, border: Qi.piece_border},
  {row: 2, col: 4, owner: Qi.white, type: Qi.wolf, text: Qi.wolf_text, color: Qi.white_color, border: Qi.piece_border},
  {row: 2, col: 2, owner: Qi.white, type: Qi.leopard, text: Qi.leopard_text, color: Qi.white_color, border: Qi.piece_border},
  {row: 0, col: 6, owner: Qi.white, type: Qi.tiger, text: Qi.tiger_text, color: Qi.white_color, border: Qi.piece_border},
  {row: 0, col: 0, owner: Qi.white, type: Qi.lion, text: Qi.lion_text, color: Qi.white_color, border: Qi.piece_border},
  {row: 2, col: 6, owner: Qi.white, type: Qi.elephant, text: Qi.elephant_text, color: Qi.white_color, border: Qi.piece_border},
  {row: 6, col: 6, owner: Qi.black, type: Qi.rat, text: Qi.rat_text, color: Qi.black_color, border: Qi.piece_border},
  {row: 7, col: 1, owner: Qi.black, type: Qi.cat, text: Qi.cat_text, color: Qi.black_color, border: Qi.piece_border},
  {row: 7, col: 5, owner: Qi.black, type: Qi.dog, text: Qi.dog_text, color: Qi.black_color, border: Qi.piece_border},
  {row: 6, col: 2, owner: Qi.black, type: Qi.wolf, text: Qi.wolf_text, color: Qi.black_color, border: Qi.piece_border},
  {row: 6, col: 4, owner: Qi.black, type: Qi.leopard, text: Qi.leopard_text, color: Qi.black_color, border: Qi.piece_border},
  {row: 8, col: 0, owner: Qi.black, type: Qi.tiger, text: Qi.tiger_text, color: Qi.black_color, border: Qi.piece_border},
  {row: 8, col: 6, owner: Qi.black, type: Qi.lion, text: Qi.lion_text, color: Qi.black_color, border: Qi.piece_border},
  {row: 6, col: 0, owner: Qi.black, type: Qi.elephant, text: Qi.elephant_text, color: Qi.black_color, border: Qi.piece_border},
];
