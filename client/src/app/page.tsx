import Image from "next/image";
import Chessboard from "@/components/chess-board";
export const initialGameState = {
  whitePieces: {
    king: BigInt("1" + "0".repeat(60)),
    queen: BigInt("0" + "1".padEnd(63, "0")),
    rooks: BigInt("1" + "0".repeat(63)),
    knights: BigInt("0" + "10".padEnd(63, "0")),
    bishops: BigInt("0" + "100".padEnd(63, "0")),
    pawns: BigInt("0" + "1000000000000000".padEnd(63, "0"))
  },
  blackPieces: {
    king: BigInt("0".repeat(60) + "1"),
    queen: BigInt("0".padEnd(63, "1") + "0"),
    rooks: BigInt("0".repeat(63) + "1"),
    knights: BigInt("0".padEnd(63, "0") + "01"),
    bishops: BigInt("0".padEnd(63, "0") + "001"),
    pawns: BigInt("0".padEnd(63, "0") + "0000000010000000")
  }
};

export default function Home() {
  console.log(initialGameState);
  return (
    <><Chessboard /></>
  );
}
