'use client'
import React, { useContext } from "react";
import { WebSocketContext } from "../providers/webSocket";
function GameStart() {
  const { send: sendMessage } = useContext(WebSocketContext);
  const onGameStart = () => {
    sendMessage(JSON.stringify({ type: "startGame" }));
  };
  return <button onClick={onGameStart}>Start Game</button>;
}

export default GameStart;
