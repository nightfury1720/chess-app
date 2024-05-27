export enum Square {
    a8, b8, c8, d8, e8, f8, g8, h8,
    a7, b7, c7, d7, e7, f7, g7, h7,
    a6, b6, c6, d6, e6, f6, g6, h6,
    a5, b5, c5, d5, e5, f5, g5, h5,
    a4, b4, c4, d4, e4, f4, g4, h4,
    a3, b3, c3, d3, e3, f3, g3, h3,
    a2, b2, c2, d2, e2, f2, g2, h2,
    a1, b1, c1, d1, e1, f1, g1, h1, no_sq,
}

export const enum PieceType {
    Pawn, Knight, Bishop, Rook, Queen, King,
}

export const enum Color {
    White,
    Black,
}

export const enum CastlingRights {
    WhiteKingside = 1,
    WhiteQueenside,
    BlackKingside = 4,
    BlackQueenside = 8,
}

export const enum Direction {
    NORTH = 8,
    SOUTH = -8,
    EAST = 1,
    WEST = -1,
    NORTHWEST = 9,
    NORTHEAST = 7,
    SOUTHEAST = -9,
    SOUTHWEST = -7,
}

export const enum MoveFlag {
    Promotion = 8,
    Capture = 4,
    Special_1 = 2,
    Special_0 = 1,
}

export const enum MoveType {
    Quiet,
    DoublePawnPush,
    KingCastle,
    QueenCastle,
    Capture,
    EPCapture,
    KnightPromotion = 8,
    BishopPromotion,
    RookPromotion,
    QueenPromotion,
    KnightPromotionCapture,
    BishopPromotionCapture,
    RookPromotionCapture,
    QueenPromotionCapture,
}

const enum HashFlag {
    Exact,
    Alpha,
    Beta,
}

/**
 * INTERFACES
 */

export interface Piece {
    Type: PieceType
    Color: Color
}

export interface BoardState {
    PiecesBB: BigUint64Array
    OccupanciesBB: BigUint64Array
    Squares: (Piece | undefined)[]
    CastlingRights: number
    SideToMove: Color
    EnPassSq: Square
    HalfMoves: number
    Ply: number
    Hash: bigint
    PawnHash: bigint
    Phase: number
    CastlingPaths: bigint[]
    CastlingRookSquares: Square[]
    CastlingSquaresMask: Square[]
}

interface StateCopy {
    CastlingRights: CastlingRights
    EnPassSq: Square
    Captured?: Piece
    Hash: bigint
    PawnHash: bigint
    HalfMoves: number
    Phase: number
}

interface Zobrist {
    Pieces: bigint[][][]
    EnPassant: BigUint64Array
    Castle: BigUint64Array
    SideToMove: bigint
}

interface TTEntry {
    Hash: bigint // 8 bytes
    Move: number // 2 bytes
    Depth: number // 1 bytes
    Score: number // 2 bytes
    Flag: HashFlag // 1 byte
}

interface PawnEntry {
    Hash: bigint
    Mg: number
    Eg: number
    SideToMove: Color
}

