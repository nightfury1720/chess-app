import React from "react";
import Image from "next/image";

interface TileProps {
  bgcolor: string;
  position: string;
  pieceIcon?: string;
  isSelected?: boolean;
  handleClick?: () => void;
  handlePieceDrop: (fromPosition: string, toPosition: string) => void;
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
  handleClick,
  handlePieceDrop,
}) => {
  const handleDragStart = (e: React.DragEvent<HTMLImageElement>) => {
    e.dataTransfer.setData("position", position);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const fromPosition = e.dataTransfer.getData("position");
    handlePieceDrop(fromPosition, position);
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
            draggable
            onDragStart={handleDragStart}
          />
        </div>
      )}
    </div>
  );
};

export default Tile;
