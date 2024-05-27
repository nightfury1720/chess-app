import { Piece, Position, PieceType, TeamType } from "./piece";
import {
  getPossiblePawnMoves,
  getPossibleKnightMoves,
  getPossibleBishopMoves,
  getPossibleRookMoves,
  getPossibleQueenMoves,
  getPossibleKingMoves,
  initializeChessboardPieces,
  validMoveChecker,
  movePlayed,
} from "../lib/helper";

export class Board {
  pieces: Piece[];
  totalTurns: number;
  winningTeam?: TeamType;

  constructor(pieces: Piece[], totalTurns: number = 0) {
    this.pieces = pieces;
    this.totalTurns = totalTurns;
  }

  get currentTeam(): TeamType {
    return this.totalTurns % 2 === 0 ? TeamType.White : TeamType.Black;
  }

  calculateAllMoves() {
    const currentTeam = this.currentTeam;
    let movePossible = false;

    for (const piece of this.pieces) {
      if (currentTeam === piece.team) {
        piece.possibleMoves = this.getValidMoves(piece, this.pieces);
        if (piece.possibleMoves.length > 0) movePossible = true;
      }
    }

    if (!movePossible) {
      this.winningTeam =
        this.currentTeam === TeamType.White ? TeamType.Black : TeamType.White;
    }
  }

  getValidMoves(piece: Piece, boardState: Piece[]): Position[] {
    switch (piece.type) {
      case PieceType.Pawn:
        return getPossiblePawnMoves(piece, boardState);
      case PieceType.Knight:
        return getPossibleKnightMoves(piece, boardState);
      case PieceType.Bishop:
        return getPossibleBishopMoves(piece, boardState);
      case PieceType.Rook:
        return getPossibleRookMoves(piece, boardState);
      case PieceType.Queen:
        return getPossibleQueenMoves(piece, boardState);
      case PieceType.King:
        return getPossibleKingMoves(piece, boardState);
      default:
        return [];
    }
  }

  //   playMove(
  //     enPassantMove: boolean,
  //     validMove: boolean,
  //     playedPiece: Piece,
  //     destination: Position
  //   ): boolean {
  //     const pawnDirection = playedPiece.team === TeamType.White ? 1 : -1;
  //     const destinationPiece = this.pieces.find(
  //       (p) => p.position.bitboard === destination.bitboard
  //     );

  //     if (
  //       playedPiece.type === PieceType.King &&
  //       destinationPiece?.type === PieceType.Rook &&
  //       destinationPiece.team === playedPiece.team
  //     ) {
  //       const direction =
  //         destinationPiece.position.bitboard - playedPiece.position.bitboard > 0
  //           ? 1
  //           : -1;
  //       const newKingXPosition =
  //         playedPiece.position.bitboard + BigInt(direction * 2);
  //       this.pieces = this.pieces.map((p) => {
  //         if (p.samePiecePosition(playedPiece)) {
  //           p.position.bitboard = newKingXPosition;
  //         } else if (p.samePiecePosition(destinationPiece)) {
  //           p.position.bitboard = newKingXPosition - BigInt(direction);
  //         }
  //         return p;
  //       });

  //       this.calculateAllMoves();
  //       return true;
  //     }

  //     if (enPassantMove) {
  //       this.pieces = this.pieces.reduce((results, piece) => {
  //         if (piece.samePiecePosition(playedPiece)) {
  //           if (piece.type === PieceType.Pawn) (piece as Pawn).enPassant = false;
  //           piece.position = destination;
  //           piece.hasMoved = true;
  //           results.push(piece);
  //         } else if (
  //           !piece.samePosition(
  //             new Position(destination.bitboard - BigInt(pawnDirection))
  //           )
  //         ) {
  //           if (piece.type === PieceType.Pawn) (piece as Pawn).enPassant = false;
  //           results.push(piece);
  //         }
  //         return results;
  //       }, [] as Piece[]);

  //       this.calculateAllMoves();
  //     } else if (validMove) {
  //       this.pieces = this.pieces.reduce((results, piece) => {
  //         if (piece.samePiecePosition(playedPiece)) {
  //           if (piece.type === PieceType.Pawn) {
  //             (piece as Pawn).enPassant =
  //               Math.abs(
  //                 Number(playedPiece.position.bitboard - destination.bitboard)
  //               ) === 2;
  //           }
  //           piece.position = destination;
  //           piece.hasMoved = true;
  //           results.push(piece);
  //         } else if (!piece.samePosition(destination)) {
  //           if (piece.type === PieceType.Pawn) {
  //             (piece as Pawn).enPassant = false;
  //           }
  //           results.push(piece);
  //         }
  //         return results;
  //       }, [] as Piece[]);

  //       this.calculateAllMoves();
  //     } else {
  //       return false;
  //     }

  //     this.totalTurns++;
  //     return true;
  //   }

  parseBoardStateIn2DArray = (): string[][] => {
    const boardArray: string[][] = Array.from({ length: 8 }, () =>
      Array(8).fill(null)
    );

    this.pieces.forEach((piece) => {
      const bitboard = piece.position.bitboard;

      for (let i = 0n; i < 64n; i++) {
        if ((bitboard & (1n << i)) !== 0n) {
          const row = Number(i / 8n);
          const col = Number(i % 8n);

          boardArray[row][col] = piece.team[0] + piece.type;
        }
      }
    });

    return boardArray;
  };

  clone(): Board {
    return new Board(
      this.pieces.map((p) => p.clone()),
      this.totalTurns
    );
  }
}
