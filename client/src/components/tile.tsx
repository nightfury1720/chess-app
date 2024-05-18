import React from "react";
import styled from "styled-components";

interface TileProps {
  bgcolor: string;
  position: string;
  pieceIcon?: string;
  isSelected?: boolean;
  handleClick?: () => void; // Added back handleClick prop
  handlePieceDrop: (fromPosition: string, toPosition: string) => void;
}

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

  return (
    <TileWrapper
      $bgcolor={bgcolor}
      $isSelected={isSelected}
      onClick={handleClick} // Added back onClick handler
      onDrop={handleDrop}
      onDragOver={allowDrop}
    >
      {position[1] === "8" && <LabelX>{position[0]}</LabelX>}
      {position[0] === "a" && <LabelY>{position[1]}</LabelY>}
      {pieceIcon && (
        <PieceIcon
          src={`/chessIcon/${pieceIcon}.png`}
          alt={pieceIcon}
          draggable
          onDragStart={handleDragStart}
        />
      )}
    </TileWrapper>
  );
};

const TileWrapper = styled.div<{
  $bgcolor: string;
  $isSelected: boolean;
}>`
  position: relative;
  width: 50px;
  height: 50px;
  background-color: ${({ $bgcolor, $isSelected }) =>
    $isSelected ? "red" : $bgcolor};
  cursor: pointer; // Added cursor pointer for clickable tiles
`;

const LabelX = styled.div`
  position: absolute;
  bottom: 2px;
  right: 2px;
  font-size: 12px;
  color: black;
`;

const LabelY = styled.div`
  position: absolute;
  top: 2px;
  left: 2px;
  font-size: 12px;
  color: black;
`;

const PieceIcon = styled.img`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  height: auto;
`;

export default Tile;
