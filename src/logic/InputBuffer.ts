import { Config } from "../Config";

export class InputBuffer {
    private value: string;
    private maxDigits: number;

    constructor(value: string) {
        /**現在の入力値(文字列で保持) */
        this.value = value;
        /**最大入力桁数(Configから取得) */
        this.maxDigits = Config.MAX_DIGITS;
    }
    // 「もし現在の桁数が Config.MAX_DIGITS 以上なら追加しない」


    /**
     * 入力中の値(this.value)に、数字dを文字として追加する。
     * 電卓の入力は文字列で管理されるため、dは末尾に連結される。
     * 最大桁数(maxDigits)を超える場合は追加されない。
     * @param digit 今入力された数字(0～9)
     */
    public pushDigit(digit: number): void {
        const currentDigits = this.digitCount();
        if (currentDigits >= this.maxDigits)  {
            return;
        }

        const result = this.value + digit;
        this.value = result;
    }

    // 

    /**
     * 現在の入力値に小数点(".")を追加する。
     * 既に小数点を含む場合は何も追加しない。
     * "." 単独入力は "0." に変換。
     */
    public pushDecimal(): void {
        if (this.value.includes(".")) {
            return;
        }

        if (this.value === "") {
            this.value = "0.";
            return;
        }
        const currentDigits = this.digitCount();
        if (currentDigits >= this.maxDigits) {
            return;
        }

        const result = this.value + ".";
        this.value = result;
    }

    /**
     * 現在の入力値を空文字にしてリセットする。
     */
    public clear(): void {
        this.value = "";
    }

    /**
     * 現在の入力値(文字列)を数値に変換する。
     * toNumber()は、入力中の文字列を「計算できる数値」に変換するために使う。
     * @returns 文字列をNumber型にした値
     */
    public toNumber(): number {
        const result = Number(this.value);
        return result;
    }

    /**
     * 現在の入力値が空文字かどうかを判定する。
     * @returns 入力値が空("")の場合はtrue,そうじゃない場合はfalse
     */
    public isEmpty(): boolean {
        return this.value === "";
    }

    /**
     * 現在の入力値の桁数(文字数)を返す。
     * この関数は「桁数を数える」だけで、桁数制限の判断は別の関数が行う。
     * @returns 数字だけの桁数
     */
    public digitCount(): number {
        const digitOnly = this.value.replace("-", "").replace(".", "");
        const result = digitOnly.length;
        return result;
    }

    /**
     * 現在の入力値をそのまま文字列として返す。
     * this.value は privateの為、toString() 経由で取り出せるように。
     * @returns 
     */
    public toString(): string {
        return this.value;
    }

    /**
     * 入力バッファに新しい数字を追加できるかを判定する。
     * 現在のバッファ内容から、小数点（"."）と符号（"-"）を除いた
     * 「純粋な数字の桁数」を計算し、その桁数が最大桁数（8桁）未満であれば true を返す。
     * @returns 数字を追加できる場合は true、これ以上追加できない場合は false。
     */
    public canAddDigit(): boolean {
        const s = this.toString().replace(".", "").replace("-", "");
        return s.length < 8;
    }

    public pushMinus(): void {
    if (this.value === "") {
        this.value = "-";
    }
}
}