import Image from "next/legacy/image";
import Chessboard from "@/components/chess-board";
import GameStart from "@/components/game-start";

export default function Home() {
  
  return (
    <>
      <Chessboard />
      <GameStart />
    </>
  );
}
