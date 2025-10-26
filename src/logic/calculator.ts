
// 計算に直接関わる関数だけをまとめる

// テストの中心になる部分

// 最大の桁は8桁 定数。
export const MAX_DIGITS = 8;

/**
 * 文字列が数値として有効であり、
 * 小数点を除いた桁数が8桁を超えているか判定する。
 * @param value 判定する数値の文字列
 * @returns 桁数が8桁を超えていればtrue、それ以外はfalse
 */
export function isTooLongNumber(value: string): boolean {
    const isNumeric = !isNaN(Number(value));
    const digitsOnly = value.replace(".", "");
    return isNumeric && digitsOnly.length > MAX_DIGITS;
}

/**
 * 計算できる状態かどうか判定　前の値と今の入力の両方に値がある状態なら計算可能
 * @param prev 前の値
 * @param curr 今の入力
 * @returns 
 */
export function shouldCalculate(prev: string, curr: string): boolean {
    return prev !== "" && curr !== "";
}

/**
 * 前の値と今の入力値を数値に変換して返す。
 * @param prev 前の値
 * @param curr 今の入力
 * @returns 
 */
export function parseInputs(prev: string, curr: string): [number, number] {
    return [parseFloat(prev), parseFloat(curr)];
}

/**
 * 与えられた2つの数値に対して、現在の演算子（operator）に応じた計算を行う。
 * 
 * @param a - 最初の数値
 * @param b - 次の数値
 * @returns 計算結果（数値）またはエラー時は文字列 "エラー"
 */
export function calculateStrategy(a: number, b: number, operator: string): number | string {
    switch (operator) {
        case "+":
            return a + b;
        case "-":
            return a - b;
        case "*":
            return a * b;
        case "/":
            if(b === 0) {
                console.error(`0で割ろうとしました: a=${a},b =${b}`);
                return "エラー";
            }
            return a / b;
        default:
            console.error(`符号に不明な値が代入されました operator=${operator}`);
            return "エラー";
    }
}

/**
 * 現在の入力文字列に対して新しい入力値を追加できるか判定する。
 * 数値が未入力の場合、小数点は無視する
 * 小数点入力は 1個目のみ有効、それ以降は無視する
 * 小数点を除いた数字の桁数が8桁超えていたら無視する
 * @param prev 前の値(現在の入力文字列)
 * @param curr 今の入力（新しい入力値）
 * @returns 追加してよければtrue、ダメならfalse
 */
export function canAddInput(prev: string, curr: string): boolean {
    const isStartingWithDot = curr === "." && prev === "";
    const hasDotAlready = curr === "." && prev.includes(".");
    const isOverMaxDigits = prev.replace(".", "").length >= MAX_DIGITS;

    return !(isStartingWithDot || hasDotAlready || isOverMaxDigits);
}