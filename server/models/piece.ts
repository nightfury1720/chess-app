export enum PieceType {
  Pawn = "P",
  Knight = "N",
  Bishop = "B",
  Rook = "R",
  Queen = "Q",
  King = "K",
}

export enum TeamType {
  White = "white",
  Black = "black",
}

export class Position {
  bitboard: bigint;

  constructor(bitboard: bigint) {
    this.bitboard = bitboard;
  }

  isSet(index: number): boolean {
    const position = BigInt(1) << BigInt(index);
    return (this.bitboard & position) !== BigInt(0);
  }

  setPosition(index: number) {
    const position = BigInt(1) << BigInt(index);
    this.bitboard |= position;
  }

  clearPosition(index: number) {
    const position = BigInt(1) << BigInt(index);
    this.bitboard &= ~position;
  }

  clone(bitboard: bigint = this.bitboard): Position {
    return new Position(bitboard);
  }
}

export abstract class Piece {
  possibleMoves: Position[] = [];
  hasMoved: boolean = false;

  constructor(
    public type: PieceType,
    public team: TeamType,
    public position: Position
  ) {}

  abstract clone(): Piece;
}

export class Pawn extends Piece {
  enPassant: boolean = false;

  constructor(team: TeamType, position: Position) {
    super(PieceType.Pawn, team, position);
  }

  clone(): Pawn {
    const clone = new Pawn(this.team, new Position(this.position.bitboard));
    clone.enPassant = this.enPassant;
    clone.hasMoved = this.hasMoved;
    return clone;
  }
}

export class Knight extends Piece {
  constructor(team: TeamType, position: Position) {
    super(PieceType.Knight, team, position);
  }

  clone(): Knight {
    return new Knight(this.team, new Position(this.position.bitboard));
  }
}

export class Bishop extends Piece {
  constructor(team: TeamType, position: Position) {
    super(PieceType.Bishop, team, position);
  }

  clone(): Bishop {
    return new Bishop(this.team, new Position(this.position.bitboard));
  }
}

export class Rook extends Piece {
  constructor(team: TeamType, position: Position) {
    super(PieceType.Rook, team, position);
  }

  clone(): Rook {
    const clone = new Rook(this.team, new Position(this.position.bitboard));
    clone.hasMoved = this.hasMoved;
    return clone;
  }
}

export class Queen extends Piece {
  constructor(team: TeamType, position: Position) {
    super(PieceType.Queen, team, position);
  }

  clone(): Queen {
    return new Queen(this.team, new Position(this.position.bitboard));
  }
}

export class King extends Piece {
  constructor(team: TeamType, position: Position) {
    super(PieceType.King, team, position);
  }

  clone(): King {
    const clone = new King(this.team, new Position(this.position.bitboard));
    clone.hasMoved = this.hasMoved;
    return clone;
  }
}
