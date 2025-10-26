// 前の値
let previousValue = "";
// 今の入力
let currentInput = "";
let operator: string | null = null;
// 計算結果が既に出ているかどうか
let resultCalculated = false;
// 直前に演算子ボタンが押されたかどうか
let lastOperatorPressed = false;

/**
 * 現在の電卓の状態をまとめて返す
 * @returns 
 */
export function getState() {
    return { previousValue, currentInput, operator, resultCalculated, lastOperatorPressed };
}

export function setState(newState: Partial<ReturnType<typeof getState>>) {
    previousValue = newState.previousValue ?? previousValue;
    currentInput = newState.currentInput ?? currentInput;
    operator = newState.operator ?? operator;
    resultCalculated = newState.resultCalculated ?? resultCalculated;
    lastOperatorPressed = newState.lastOperatorPressed ?? lastOperatorPressed;
}

/**
 * 電卓の状態を初期化する。
 * 入力中の値や演算子、計算結果のフラグをリセットし、
 * ディスプレイを「0」に更新する?
 */
export function resetState(): void {
    previousValue = "";
    currentInput = "";
    operator = null;
    resultCalculated = false;
    lastOperatorPressed = false;
}
