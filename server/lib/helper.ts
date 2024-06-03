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
import { Board } from "../models/boardState";

export const positionMap: Record<string, number> = {
  a1: 0,
  b1: 1,
  c1: 2,
  d1: 3,
  e1: 4,
  f1: 5,
  g1: 6,
  h1: 7,
  a2: 8,
  b2: 9,
  c2: 10,
  d2: 11,
  e2: 12,
  f2: 13,
  g2: 14,
  h2: 15,
  a3: 16,
  b3: 17,
  c3: 18,
  d3: 19,
  e3: 20,
  f3: 21,
  g3: 22,
  h3: 23,
  a4: 24,
  b4: 25,
  c4: 26,
  d4: 27,
  e4: 28,
  f4: 29,
  g4: 30,
  h4: 31,
  a5: 32,
  b5: 33,
  c5: 34,
  d5: 35,
  e5: 36,
  f5: 37,
  g5: 38,
  h5: 39,
  a6: 40,
  b6: 41,
  c6: 42,
  d6: 43,
  e6: 44,
  f6: 45,
  g6: 46,
  h6: 47,
  a7: 48,
  b7: 49,
  c7: 50,
  d7: 51,
  e7: 52,
  f7: 53,
  g7: 54,
  h7: 55,
  a8: 56,
  b8: 57,
  c8: 58,
  d8: 59,
  e8: 60,
  f8: 61,
  g8: 62,
  h8: 63,
};

export const initializeChessboardPieces = (): Piece[] => {
  const pieces: Piece[] = [];

  // Add white pieces
  pieces.push(
    new Rook(TeamType.White, new Position(BigInt("0x81"))),
    new Knight(TeamType.White, new Position(BigInt("0x42"))),
    new Bishop(TeamType.White, new Position(BigInt("0x24"))),
    new Queen(TeamType.White, new Position(BigInt("0x08"))),
    new King(TeamType.White, new Position(BigInt("0x10"))),
    new Pawn(TeamType.White, new Position(BigInt("0b1111111100000000")))
  );

  // Add black pieces
  pieces.push(
    new Rook(
      TeamType.Black,
      new Position(
        BigInt(
          "0b1000000100000000000000000000000000000000000000000000000000000000"
        )
      )
    ),
    new Knight(
      TeamType.Black,
      new Position(
        BigInt(
          "0b100001000000000000000000000000000000000000000000000000000000000"
        )
      )
    ),
    new Bishop(
      TeamType.Black,
      new Position(
        BigInt(
          "0b10010000000000000000000000000000000000000000000000000000000000"
        )
      )
    ),
    new Queen(
      TeamType.Black,
      new Position(
        BigInt("0b100000000000000000000000000000000000000000000000000000000000")
      )
    ),
    new King(
      TeamType.Black,
      new Position(
        BigInt(
          "0b1000000000000000000000000000000000000000000000000000000000000"
        )
      )
    ),
    new Pawn(
      TeamType.Black,
      new Position(
        BigInt("0b11111111000000000000000000000000000000000000000000000000")
      )
    )
  );

  return pieces;
};

export const setTeamPositionInBoard = (
  whichTeam: number,
  pieces: Piece[]
): bigint => {
  const team = whichTeam ? "black" : "white";
  let bitboard: bigint = 0n;
  pieces.forEach((p) => {
    if (p.team == team) {
      bitboard = bitboard | p.position.bitboard;
    }
  });
  return bitboard;
};

export const setPositionInBoard = (pieces: Piece[]): bigint => {
  let bitboard: bigint = 0n;
  pieces.forEach((p) => (bitboard = bitboard | p.position.bitboard));
  return bitboard;
};

export const getPossiblePawnMoves = (
  currentPiece: Piece,
  pieces: Piece[]
): Position[] => {
  const teamNumber = currentPiece.team === "white" ? 0 : 1;
  const allyBitboard = setTeamPositionInBoard(teamNumber, pieces);
  const enemyBitboard = setTeamPositionInBoard(teamNumber ^ 1, pieces);
  const bitboard = currentPiece.position.bitboard;

  const possibleMoves: Position[] = [];
  const direction = currentPiece.team === "white" ? 8n : -8n;
  const startRankMask = currentPiece.team === "white" ? 0xFF00n : 0xFF000000000000n;

  // One step forward
  let move = bitboard << direction;
  if ((move & allyBitboard) === 0n && (move & enemyBitboard) === 0n) {
    possibleMoves.push(new Position(move));
  }

  // Two steps forward from the initial position
  if ((bitboard & startRankMask) !== 0n) {
    move = bitboard << (2n * direction);
    const oneStepMove = bitboard << direction;
    if (
      (move & allyBitboard) === 0n &&
      (move & enemyBitboard) === 0n &&
      (oneStepMove & allyBitboard) === 0n &&
      (oneStepMove & enemyBitboard) === 0n
    ) {
      possibleMoves.push(new Position(move));
    }
  }

  // Capture diagonally to the left
  move = bitboard << (direction + 1n);
  if ((move & enemyBitboard) !== 0n) {
    possibleMoves.push(new Position(move));
  }

  // Capture diagonally to the right
  move = bitboard << (direction - 1n);
  if ((move & enemyBitboard) !== 0n) {
    possibleMoves.push(new Position(move));
  }

  possibleMoves.forEach((p) => {
    console.log(p.bitboard)
  })

  return possibleMoves;
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
