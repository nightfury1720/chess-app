"use client";
import React, { useEffect, useMemo, useState } from "react";
import Tile from "./tile";
import {
  validMoveChecker,
  movePlayed,
  initializeChessboardPieces,
} from "../lib/helper";
import { Board } from "../models/boardState";

const xAxis = ["a", "b", "c", "d", "e", "f", "g", "h"];
const yAxis = ["1", "2", "3", "4", "5", "6", "7", "8"];

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

  // useEffect(() => {
  //   console.log("Board", board.pieces);
  // }, [board]);

  const parsedBoard = useMemo(() => board.parseBoardStateIn2DArray(), [board]);

  return (
    <div
      style={{
        display: "inline-grid",
        gridTemplateColumns: "repeat(8, 50px)",
        gridTemplateRows: "repeat(8, 50px)",
      }}
    >
      {parsedBoard.map((row, rowIndex) =>
        row.map((piece, colIndex) => {
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
        })
      )}
    </div>
  );
};

export default Chessboard;
