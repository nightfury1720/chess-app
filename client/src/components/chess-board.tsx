"use client";
import React, { useMemo, useState } from "react";
import styled from "styled-components";
import Tile from "./tile";

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

interface ChessBoardProps {
  fen?: string;
}

const Chessboard: React.FC<ChessBoardProps> = ({
  fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
}) => {
  const [selectedPiece, setSelectedPiece] = useState<string | null>(null);

  const movePiece = (from: string, to: string) => {
    // Implement your logic to move the piece
    console.log(`Move piece from ${from} to ${to}`);
  };


  const tiles = useMemo(() => {
    const tempTiles: JSX.Element[] = [];
    if (fen) {
      const rows = fen.split(" ")[0].split("/");
      rows.forEach((row, rowIndex) => {
        let colIndex = 0;
        row.split("").forEach((char) => {
          const isBlack = (rowIndex + colIndex) % 2 === 1;
          const bgColor = isBlack ? "#b58863" : "#f0d9b5";
          if (!isNaN(parseInt(char, 10))) {
            for (let i = 0; i < parseInt(char, 10); i++) {
              const isBlack = (rowIndex + colIndex) % 2 === 1;
              const bgColor = isBlack ? "#b58863" : "#f0d9b5";
              const position = xAxis[colIndex]+yAxis[rowIndex];
              tempTiles.push(
                <Tile
                  key={`${rowIndex}-${colIndex}`}
                  bgcolor={bgColor}
                  position={position}
                  movePiece={movePiece}
                />
              );
              colIndex++;
            }
          } else {
            const pieceIcon = pieceIcons[char];
            const tileKey = `${rowIndex}-${colIndex}`;
            const position = xAxis[colIndex]+yAxis[rowIndex];
            tempTiles.push(
              <Tile
                key={tileKey}
                bgcolor={bgColor}
                position={position}
                pieceIcon={pieceIcon}
                isSelected={selectedPiece === tileKey}
                handleClick={() => setSelectedPiece(tileKey)}
                movePiece={movePiece}
              />
            );
            colIndex++;
          }
        });
      });
    }
    return tempTiles;
  }, [fen, selectedPiece]);

  return <Container>{tiles}</Container>;
};

export default Chessboard;
