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
  isSet(x: number, y: number): boolean {
    const position = BigInt(1) << BigInt(y * 8 + x);
    return (this.bitboard & position) !== BigInt(0);
  }

  // Set a particular position in the bitboard
  setPosition(x: number, y: number) {
    const position = BigInt(1) << BigInt(y * 8 + x);
    this.bitboard |= position;
  }

  // Clear a particular position in the bitboard
  clearPosition(x: number, y: number) {
    const position = BigInt(1) << BigInt(y * 8 + x);
    this.bitboard &= ~position;
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

  samePiecePosition(other: Piece): boolean {
    return (
      this.position.bitboard === other.position.bitboard &&
      this.type === other.type &&
      this.team === other.team
    );
  }
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
    return new Rook(this.team, new Position(this.position.bitboard));
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
    return new King(this.team, new Position(this.position.bitboard));
  }
}
