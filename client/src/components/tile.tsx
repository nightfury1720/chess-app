"use client";

import React from "react";
import styled from "styled-components";

interface TileProps {
  bgcolor: string;
  labelx?: string;
  labely?: string;
}

const Tile: React.FC<TileProps> = ({ bgcolor, labelx, labely }) => {
  return (
    <TileWrapper $bgcolor={bgcolor}>
      {labelx && <LabelX>{labelx}</LabelX>}
      {labely && <LabelY>{labely}</LabelY>}
    </TileWrapper>
  );
};

const TileWrapper = styled.div<{ $bgcolor: string }>`
  position: relative;
  width: 50px;
  height: 50px;
  background-color: ${({ $bgcolor }) => $bgcolor};
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

export default Tile;
