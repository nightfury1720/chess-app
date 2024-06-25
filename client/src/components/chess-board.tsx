"use client";
import React, { useEffect, useMemo, useState, useContext } from "react";
import Tile from "./tile";
import { initializeChessboardPieces } from "../lib/helper";
import { PieceType } from "../models/piece";
import { Board } from "../models/boardState";
import { WebSocketContext } from "../providers/webSocket";

const xAxis = ["a", "b", "c", "d", "e", "f", "g", "h"];
const yAxis = ["1", "2", "3", "4", "5", "6", "7", "8"];

interface ChessBoardProps {
  id?: string;
}

const Chessboard: React.FC<ChessBoardProps> = () => {
  console.log("rendering board");
  const [selectedPiece, setSelectedPiece] = useState<string | null>(null);
  const [board, setBoard] = useState(new Board([]));
  const [possibleMoves, setPossibleMoves] = useState({});
  const { send: sendMessage } = useContext(WebSocketContext);

  const movePiece = (pieceType: PieceType, from: string, to: string) => {
    const destRowIndex = yAxis.indexOf(to[1]);
    const destColIndex = xAxis.indexOf(to[0]);

    const pieceTypeDest = parsedBoard[destRowIndex][destColIndex];
    if (board.movePlayedValidityCheck(pieceType, from, to, [])) {
      setBoard(() => board.playMove(pieceType, from, to, pieceTypeDest));
      sendMessage(
        JSON.stringify({ pieceType, from, to, turns: board.totalTurns })
      );
    } else {
      console.log("KAT GAYA");
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
          const draggable = pieceIcon
            ? pieceIcon[0] === "w"
              ? board.totalTurns % 2 === 0
              : board.totalTurns % 2 === 1
            : false;
          return (
            <Tile
              key={tileKey}
              bgcolor={bgColor}
              position={position}
              pieceIcon={pieceIcon}
              isSelected={selectedPiece === tileKey}
              handleClick={() => setSelectedPiece(tileKey)}
              handlePieceDrop={movePiece}
              draggable={draggable}
            />
          );
        })
      )}
    </div>
  );
};

export default Chessboard;
