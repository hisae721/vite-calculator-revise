import { Config } from "../Config";

/**
 * 数字を表示用のきれいな形に整えるクラス。
 */
export class NumberFormatter {

    private maxDigits: number;

    constructor() {
        this.maxDigits = Config.MAX_DIGITS;
    }
    /**
     * 
     * 入力中または計算結果の数値を、画面に表示しやすい形に整える。
     * @param value 画面に表示したい数値
     * @returns 表示に使う文字列
     */
    public formatForDisplay(value: number): string {
        if (isNaN(value) || value === Infinity || value === -Infinity) {
            return "ERROR";
        }
        if (this.fits(value)) {
            return String(value);
        }
        return this.formatExponential(value);
    }

    /**
     * 渡された数値nが、電卓の画面に収まる桁数か判定する。
     * 小数点や符号を除いた数字部分の桁数が
     * 8桁以内かどうかで判断する。
     * @param value 判定したい数値
     * @returns 表示可能な桁数ならtrue,超えていたらfalse
     */
    private fits(value: number): boolean {
        const numberStr = String(value);

        const withoutSign = numberStr.replace("-", "");

        const digitOnly = withoutSign.replace(".", "");

        return digitOnly.length <= this.maxDigits;
    }

    /**
     * 数字を「指数表記（1e+3 など）」の形に変換し、
     * 表示できる最大文字数（maxDigits）に収まる形式を探して返す。
     * 
     * 小数点以下の桁数を 0 〜 9 まで順番に増やしながら、
     * 文字数が制限内に収まった時点の指数表記を返す。
     * 
     * もしどれも収まらない場合は、小数点以下 0 桁の指数表記を返す。
     * 
     * @param n 指数表記に変換したい数値
     * @returns 表示桁数の制限内に収まった指数表記の文字列
     */
    private formatExponential(n: number): string {
        for (let k = 0; k < 10; k++) {
            const exp = n.toExponential(k);
            if (exp.length <= this.maxDigits) {
                return exp;
            }
        }
        return n.toExponential(0);
    }
}