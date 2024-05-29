import React from "react";
import Image from "next/legacy/image";
import { PieceType } from "../models/piece";

interface TileProps {
  bgcolor: string;
  position: string;
  pieceIcon?: string;
  isSelected?: boolean;
  draggable?: boolean;
  handleClick?: () => void;
  handlePieceDrop: (pieceType: PieceType, from: string, to: string) => void;
}

const labelXStyle: React.CSSProperties = {
  position: "absolute",
  bottom: "2px",
  right: "2px",
  fontSize: "12px",
  color: "black",
};

const labelYStyle: React.CSSProperties = {
  position: "absolute",
  top: "2px",
  left: "2px",
  fontSize: "12px",
  color: "black",
};

const pieceIconWrapperStyle: React.CSSProperties = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  height: "80%",
};

const Tile: React.FC<TileProps> = ({
  bgcolor,
  position,
  pieceIcon,
  isSelected = false,
  draggable = false,
  handleClick,
  handlePieceDrop,
}) => {
  const handleDragStart = (e: React.DragEvent<HTMLImageElement>) => {
    if (draggable) {
      e.dataTransfer.setData("position", position);
      e.dataTransfer.setData("pieceType", pieceIcon ? pieceIcon[1] : "");

      // Set opacity while dragging
      e.currentTarget.style.opacity = "1";
      // Set cursor style
      e.currentTarget.style.cursor = "grabbing";
    } else {
      e.preventDefault();
    }
  };

  const handleDragEnd = (e: React.DragEvent<HTMLImageElement>) => {
    // Reset opacity and cursor style when dragging ends
    e.currentTarget.style.opacity = "1";
    e.currentTarget.style.cursor = "pointer";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const fromPosition = e.dataTransfer.getData("position");
    const pieceType = e.dataTransfer.getData("pieceType") as PieceType;
    if (pieceType && fromPosition) {
      handlePieceDrop(pieceType, fromPosition, position);
    }
  };

  const allowDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const tileStyle: React.CSSProperties = {
    position: "relative",
    width: "50px",
    height: "50px",
    backgroundColor: isSelected ? "red" : bgcolor,
    cursor: "pointer",
  };

  return (
    <div
      style={tileStyle}
      onClick={handleClick}
      onDrop={handleDrop}
      onDragOver={allowDrop}
    >
      {position[1] === "8" && <div style={labelXStyle}>{position[0]}</div>}
      {position[0] === "a" && <div style={labelYStyle}>{position[1]}</div>}
      {pieceIcon && (
        <div style={pieceIconWrapperStyle}>
          <Image
            src={`/chessIcon/${pieceIcon}.png`}
            alt={pieceIcon}
            layout="fill"
            sizes="(max-width: 50px) 100vw, 50px"
            draggable={draggable}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            priority
          />
        </div>
      )}
    </div>
  );
};

export default Tile;
