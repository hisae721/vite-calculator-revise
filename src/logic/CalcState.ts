
/**
 * 電卓の状態を表すコンストアサーション
 */
export const CalcState = {
    /**まだ何も入力していない初期状態 */
    Ready : "Ready",
    /**左オペランド(最初の数字)を入力中 */
    InputtingFirst : "InputtingFirst",
    /**演算子を押した直後、右オペランドの入力を待っている状態 */
    OperatorEntered : "OperatorEntered",
    /**右オペランド(2つ目の数字)を入力中 */
    InputtingSecond : "InputtingSecond", 
    /**計算結果が表示されている状態 */
    ResultShown : "ResultShown",
    /**0除算などのエラー状態 */
    Error : "Error"
} as const;

export type CalcStateType = typeof CalcState[keyof typeof CalcState];