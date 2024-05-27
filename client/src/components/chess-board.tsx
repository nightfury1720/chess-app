"use client";
import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import Tile from "./tile";
import {
  validMoveChecker,
  movePlayed,
  initializeChessboardPieces,
  parseBigIntToChessboardArray,
} from "../lib/helper";
import { Board } from "../models/boardState";

const Container = styled.div`
  display: inline-grid;
  grid-template-columns: repeat(8, 50px);
  grid-template-rows: repeat(8, 50px);
`;

const xAxis = ["a", "b", "c", "d", "e", "f", "g", "h"];
const yAxis = ["1", "2", "3", "4", "5", "6", "7", "8"];

// const initialBoardState = [
//   ["bR", "bN", "bB", "bQ", "bK", "bB", "bN", "bR"],
//   ["bP", "bP", "bP", "bP", "bP", "bP", "bP", "bP"],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   ["wP", "wP", "wP", "wP", "wP", "wP", "wP", "wP"],
//   ["wR", "wN", "wB", "wQ", "wK", "wB", "wN", "wR"],
// ];

interface ChessBoardProps {}

const Chessboard: React.FC<ChessBoardProps> = () => {
  console.log("rendering board");
  const [selectedPiece, setSelectedPiece] = useState<string | null>(null);
  const [board, setBoard] = useState(new Board([]));

  const movePiece = (from: string, to: string) => {
    if (validMoveChecker(from, to, board)) {
      movePlayed(from, to);
    }
    console.log(`Move piece from ${from} to ${to}`);
  };

  useEffect(() => {
    const pieces = initializeChessboardPieces();
    setBoard(() => new Board(pieces, 0));
  }, []);

  useEffect(() => {
    console.log("Board", board.pieces);
  }, [board]);

  return (
    <Container>
      {board.parseBoardStateIn2DArray().map((row, rowIndex) => {
        return row.map((piece, colIndex) => {
          const isBlack = (rowIndex + colIndex) % 2 === 1;
          const bgColor = isBlack ? "#b58863" : "#f0d9b5";
          const position = xAxis[colIndex] + yAxis[rowIndex];
          const tileKey = `${rowIndex}-${colIndex}`;
          const pieceIcon = piece ? piece : undefined;
          return (
            <Tile
              key={tileKey}
              bgcolor={bgColor}
              position={position}
              pieceIcon={pieceIcon}
              isSelected={selectedPiece === tileKey}
              handleClick={() => setSelectedPiece(tileKey)}
              handlePieceDrop={movePiece}
            />
          );
        });
      })}
    </Container>
  );
};

export default Chessboard;
