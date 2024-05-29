import { Piece, Position, PieceType, TeamType } from "./piece";
import {
  getPossiblePawnMoves,
  getPossibleKnightMoves,
  getPossibleBishopMoves,
  getPossibleRookMoves,
  getPossibleQueenMoves,
  getPossibleKingMoves,
  positionMap,
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

  playMove(
    pieceType: PieceType,
    sourcePos: string,
    destinationPos: string,
    pieceTypeDest: string | null
  ): Board {
    const currentTeam = this.currentTeam;
    // console.log(
    //   currentTeam,
    //   pieceType,
    //   pieceTypeDest,
    //   sourcePos,
    //   destinationPos
    // );
    if (pieceTypeDest !== null) {
      const destPieceType = pieceTypeDest[1];
      const destPieceIndex = this.pieces.findIndex(
        (piece) =>
          piece.type === (destPieceType as PieceType) &&
          piece.team !== currentTeam
      );
      this.pieces[destPieceIndex].position.clearPosition(
        positionMap[destinationPos]
      );
    }
    const currentPieceIndex = this.pieces.findIndex(
      (piece) => piece.type === pieceType && piece.team === currentTeam
    );
    const updatedPosition = this.pieces[currentPieceIndex].position;
    updatedPosition.clearPosition(positionMap[sourcePos]);
    updatedPosition.setPosition(positionMap[destinationPos]);

    const noOfTurns = this.totalTurns + 1;
    const clone = this.clone(noOfTurns);
    clone.calculateAllMoves();
    return clone;
  }

  movePlayedValidityCheck(
    pieceType: PieceType,
    sourcePos: string,
    destinationPos: string
  ): boolean {
    const currentTeam = this.currentTeam;
    const currentPieceIndex = this.pieces.findIndex(
      (piece) => piece.type === pieceType && piece.team === currentTeam
    );
    console.log(this.pieces);
    console.log(
      currentTeam,
      pieceType,
      currentPieceIndex,
      sourcePos,
      destinationPos
    );
    const updatedPosition = this.pieces[currentPieceIndex].position.clone();
    updatedPosition.clearPosition(positionMap[sourcePos]);
    updatedPosition.setPosition(positionMap[destinationPos]);
    // return this.pieces[currentPieceIndex].possibleMoves.some((pos) => pos.bitboard === updatedPosition.bitboard);
    return true;
  }

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

  clone(totalTurns: number): Board {
    return new Board(
      this.pieces.map((p) => p.clone()),
      totalTurns
    );
  }
}
