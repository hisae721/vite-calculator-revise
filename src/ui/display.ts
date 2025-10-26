import { isTooLongNumber } from "../logic/calculator";

const display = document.getElementById("display") as HTMLDivElement;

/**
 * 値が8桁を超えていれば指数表記（小数点以下5桁）に変換して表示する。
 * 
 * @param value 表示する数値の文字列
 */
export function updateDisplay(value: string): void {
    if (isTooLongNumber(value)) {
        const num = parseFloat(value);
        display.textContent = num.toExponential(5);
    } else {
        display.textContent = value;
    }
}

/**
 * 画面に表示されている現在の値を取得する。
 * 
 * - `display` 要素の `textContent` を返す。
 * - 表示が空の場合は空文字列を返す。
 * 
 * @returns 現在画面に表示されている文字列
 */
export function getDisplayValue(): string {
    return display.textContent || "";
}