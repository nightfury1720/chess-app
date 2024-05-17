"use client";

import React, { useMemo } from "react";
import styled from "styled-components";
import Tile from "./tile";

const Container = styled.div`
  display: inline-grid;
  grid-template-columns: repeat(8, 50px);
  grid-template-rows: repeat(8, 50px);
`;

const xAxis = ["a", "b", "c", "d", "e", "f", "g", "h"];
const yAxis = ["1", "2", "3", "4", "5", "6", "7", "8"];

interface ChessBoardProps {
  gameState?: any
}

const pieceIcons: { [key: string]: string } = {
  "p": "bP", // Black Pawn
  "n": "bN", // Black Knight
  "b": "bB", // Black Bishop
  "r": "bR", // Black Rook
  "q": "bQ", // Black Queen
  "k": "bK", // Black King
  "P": "wP", // White Pawn
  "N": "wN", // White Knight
  "B": "wB", // White Bishop
  "R": "wR", // White Rook
  "Q": "wQ", // White Queen
  "K": "wK", // White King
};

const Chessboard: React.FC<ChessBoardProps> = ({gameState}) => {

  const tiles = useMemo(() => {
    const tempTiles = [];
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const isBlack = (row + col) % 2 === 1;
        const bgColor = isBlack ? "#b58863" : "#f0d9b5";
        const labelX = row === 7 ? xAxis[col] : "";
        const labelY = col === 0 ? yAxis[row] : "";
        tempTiles.push(
          <Tile
            key={`${row}-${col}`}
            bgcolor={bgColor}
            labelx={labelX}
            labely={labelY}
          />
        );
      }
    }
    return tempTiles;
  }, []);

  return <Container>{tiles}</Container>;
};

export default Chessboard;
