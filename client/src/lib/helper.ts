import {
  Piece,
  Pawn,
  Knight,
  Bishop,
  Rook,
  Queen,
  King,
  PieceType,
  TeamType,
  Position,
} from "../models/piece";

export function parseBigIntToChessboardArray(bigIntNum: bigint, piece: string): string[] {
 
  const binaryString = bigIntNum.toString(2).padStart(64, '0');

  // Map each digit of the binary string to a corresponding piece representation
  const chessboardArray = binaryString.split('').map(char => char === '1' ? piece : '0');

  return chessboardArray;
}

export const initializeChessboardPieces = (): Piece[] => {
  const pieces: Piece[] = [];

  // Add white pieces
  pieces.push(
    new Rook(TeamType.White, new Position(BigInt("0x81"))),
    new Knight(TeamType.White, new Position(BigInt("0x42"))),
    new Bishop(TeamType.White, new Position(BigInt("0x24"))),
    new Queen(TeamType.White, new Position(BigInt("0x08"))),
    new King(TeamType.White, new Position(BigInt("0x10"))),
    new Pawn(TeamType.White, new Position(BigInt("0b1111111100000000"))),
  );

  // Add black pieces
  pieces.push(
    new Rook(TeamType.Black, new Position(BigInt("0b1000000100000000000000000000000000000000000000000000000000000000"))),
    new Knight(TeamType.Black, new Position(BigInt("0b100001000000000000000000000000000000000000000000000000000000000"))),
    new Bishop(TeamType.Black, new Position(BigInt("0b10010000000000000000000000000000000000000000000000000000000000"))),
    new Queen(TeamType.Black, new Position(BigInt("0b100000000000000000000000000000000000000000000000000000000000"))),
    new King(TeamType.Black, new Position(BigInt("0b1000000000000000000000000000000000000000000000000000000000000"))),
    new Pawn(TeamType.Black, new Position(BigInt("0b11111111000000000000000000000000000000000000000000000000")))
  );

  return pieces;
};

export const getPossiblePawnMoves = (
  piece: Piece,
  boardState: Piece[]
): Position[] => {
  // Implement the logic to calculate possible moves for a pawn
  return [];
};

export const getPossibleKnightMoves = (
  piece: Piece,
  boardState: Piece[]
): Position[] => {
  // Implement the logic to calculate possible moves for a knight
  return [];
};

export const getPossibleBishopMoves = (
  piece: Piece,
  boardState: Piece[]
): Position[] => {
  // Implement the logic to calculate possible moves for a bishop
  return [];
};

export const getPossibleRookMoves = (
  piece: Piece,
  boardState: Piece[]
): Position[] => {
  // Implement the logic to calculate possible moves for a rook
  return [];
};

export const getPossibleQueenMoves = (
  piece: Piece,
  boardState: Piece[]
): Position[] => {
  // Implement the logic to calculate possible moves for a queen
  return [];
};

export const getPossibleKingMoves = (
  piece: Piece,
  boardState: Piece[]
): Position[] => {
  // Implement the logic to calculate possible moves for a king
  return [];
};

export const validMoveChecker = (
  initialPosition: string,
  finalPosition: string,
  board: any
): boolean => {
  // Implement the logic to check if a move is valid
  return true;
};

export const movePlayed = (
  initialPosition: string,
  finalPosition: string
): void => {
  // Implement the logic when a move is played
  return;
};
