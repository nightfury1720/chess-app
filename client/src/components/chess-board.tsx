"use client";
import React, { useMemo, useState } from "react";
import styled from "styled-components";
import Tile from "./tile";
import { validMoveChecker, movePlayed } from "../lib/helper";

const Container = styled.div`
  display: inline-grid;
  grid-template-columns: repeat(8, 50px);
  grid-template-rows: repeat(8, 50px);
`;

const xAxis = ["a", "b", "c", "d", "e", "f", "g", "h"];
const yAxis = ["1", "2", "3", "4", "5", "6", "7", "8"];

const pieceIcons: { [key: string]: string } = {
  p: "bP", // Black Pawn
  n: "bN", // Black Knight
  b: "bB", // Black Bishop
  r: "bR", // Black Rook
  q: "bQ", // Black Queen
  k: "bK", // Black King
  P: "wP", // White Pawn
  N: "wN", // White Knight
  B: "wB", // White Bishop
  R: "wR", // White Rook
  Q: "wQ", // White Queen
  K: "wK", // White King
};

const initialBoardState = [
  ["br", "bn", "bb", "bq", "bk", "bb", "bn", "br"],
  ["bp", "bp", "bp", "bp", "bp", "bp", "bp", "bp"],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  ["wp", "wp", "wp", "wp", "wp", "wp", "wp", "wp"],
  ["wr", "wn", "wb", "wq", "wk", "wb", "wn", "wr"],
];

interface ChessBoardProps {}

const Chessboard: React.FC<ChessBoardProps> = () => {
  const [selectedPiece, setSelectedPiece] = useState<string | null>(null);
  const [board, setBoard] = useState(initialBoardState);

  const movePiece = (from: string, to: string) => {
    if (validMoveChecker(from, to)) {
      movePlayed(from, to);
    }
    console.log(`Move piece from ${from} to ${to}`);
  };

  const tiles = useMemo(() => {
    const tempTiles: JSX.Element[] = [];
    board.forEach((row, rowIndex) => {
      row.forEach((piece, colIndex) => {
        const isBlack = (rowIndex + colIndex) % 2 === 1;
        const bgColor = isBlack ? "#b58863" : "#f0d9b5";
        const position = xAxis[colIndex] + yAxis[rowIndex];
        const tileKey = `${rowIndex}-${colIndex}`;
        const pieceIcon = piece ? pieceIcons[piece.charAt(1)] : undefined;
        tempTiles.push(
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
    });
    return tempTiles;
  }, [board, selectedPiece]);

  return (
    <Container>
      {board.map((row, rowIndex) => {
        return row.map((piece, colIndex) => {
          const isBlack = (rowIndex + colIndex) % 2 === 1;
          const bgColor = isBlack ? "#b58863" : "#f0d9b5";
          const position = xAxis[colIndex] + yAxis[rowIndex];
          const tileKey = `${rowIndex}-${colIndex}`;
          const pieceIcon = piece ? pieceIcons[piece.charAt(1)] : undefined;
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
