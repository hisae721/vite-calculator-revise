import { getState, setState, resetState } from "./state";
import { updateDisplay, getDisplayValue } from "../ui/display";
import { canAddInput as canAdd, shouldCalculate, parseInputs, calculateStrategy } from "./calculator";

const operatorDisplayMap: { [key: string]: string } = {
    "+": "+",
    "-": "-",
    "*": "×",
    "/": "÷",
};


/**
 * 
 * 数字や小数点を画面に表示できるように入力を処理する
 * @param value 入力された文字（数字や小数点）
 * @returns 
 * 
 */
export function handleInput(value: string): void {
    const state = getState();

    // 計算が終わっていたら新しい計算開始
    if (state.resultCalculated) {
        setState({ currentInput: "", resultCalculated: false });
    }

    if (!canAdd(state.currentInput, value)) return;

    let newInput = "";
    if (state.currentInput === "0" && value !== ".") {
        newInput = value;
    } else {
        newInput = state.lastOperatorPressed ? value : state.currentInput + value;
    }

    setState({ currentInput: newInput, lastOperatorPressed: false });

    const symbol = operatorDisplayMap[state.operator || ""] || state.operator || "";
    updateDisplay(state.previousValue + symbol + newInput);
}

/**
 * 演算子が押されたときに、計算や状態の更新、表示を行う
 * @param op 
 * @returns 
 */
export function handleOperator(op: string): void {
    const state = getState();

    // 「-」だけは負の数の開始として扱う
    if (shouldStartNegative(op)) {
        return startNegativeInput();
    }

    // 「-」だけの入力は演算子として無効
    if (state.currentInput === "-") {
        return;
    }

    if (isInputEmpty()) {
        return;
    }
    // 計算結果が表示されていたらリセット
    if (state.resultCalculated) {
        setState({ resultCalculated: false });
    }

    // 直前の数値と現在の数値が揃っていたら計算
    if (shouldCalculate(state.previousValue, state.currentInput)) {
        calculate();
        setState({ previousValue: getDisplayValue() });
    } else {
        setState({ previousValue: state.currentInput || state.previousValue });
    }

    setState({ operator: op, currentInput: "", lastOperatorPressed: true });
    // 画面に「数字＋演算子」を表示
    showOperatorOnDisplay(getState().previousValue, op);
}

/**
 * 入力された数値に対して計算処理を実行し、結果を画面に表示する。
 * 
 * - `canCalculate()` で計算可能な状態かを確認し、無効な場合は処理を終了する。
 * - `parseInputs()` によって2つの数値を取得し、
 *   `calculateStrategy(a, b)` を使って計算を実行する。
 * - 計算結果は `updateResult(result)` を通じて画面に反映される。
 */
export function calculate(): void {
    const state = getState();
    if (!state.previousValue || !state.currentInput || !state.operator) return;

    const [a, b] = parseInputs(state.previousValue, state.currentInput);
    const result = calculateStrategy(a, b, state.operator);

    updateResult(result);
}

/**
 * 計算結果を画面に表示し、状態を更新する。
 *
 * @param result - 計算結果（数値またはエラーを示す文字列）
 */
function updateResult(result: number | string): void {
    if (result === "エラー") {
        updateDisplay("エラー");
        setState({ resultCalculated: true });
        return;
    }
    const resultStr = result.toString();
    updateDisplay(resultStr);

    setState({
        previousValue: resultStr,
        currentInput: "",
        operator: null,
        resultCalculated: true,
    });
}

/**
 * リセット（AC）
 * 電卓の状態を初期化する。
 * ディスプレイを「0」に更新する。
 */
export function resetCalculator(): void {
    resetState();
    updateDisplay("0");
}


/**
 * マイナス記号を負の数として入力許可
 * @param op 
 * @returns 
 */
export function shouldStartNegative(op: string): boolean {
    const { previousValue, currentInput } = getState();
    return op === "-" && previousValue === "" && currentInput === "";
}

/**
 * マイナス記号を負の数としてディスプレイに表示させる
 */
function startNegativeInput(): void {
    setState({ currentInput: "-" });
    updateDisplay("-");
}

/**
 * 現在の入力が空かどうか判定
 * @returns 
 */
export function isInputEmpty(): boolean {
    const { previousValue, currentInput } = getState();
    return previousValue === "" && currentInput === "";
}

/**
 * 現在の入力値と演算子を画面に表示する。
 * * → ×, / → ÷ のように変換
 * - 演算子は `operatorDisplayMap` を参照して記号に変換される。
 * - 変換できない場合はそのままの文字列を表示する。
 * - `value`（現在の数値入力）と演算子の記号を連結して表示を更新する。
 * 
 * @param value - 現在の数値入力（文字列）
 * @param op - 演算子の文字列（例: "+", "-", "*", "/"）
 */
function showOperatorOnDisplay(value: string, op: string): void {
    const symbol = operatorDisplayMap[op] || op;
    updateDisplay(value + symbol);
}