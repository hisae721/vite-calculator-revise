
import { Operation } from "./Operation";
import { type OperationType } from "./Operation";
import { DivisionByZeroError } from "./DivisionByZeroError";


export class Evaluator {

    /**
     * 左オペランド、演算子、右オペランドを受け取り、四則演算を実行する。
     * 0で割られた場合は例外を投げる。
     * @param a 左オペランド
     * @param op 演算子(+、-、×、÷)
     * @param b 右オペランド
     * @returns 計算結果
     */
    public compute(a: number, op: OperationType, b: number): number {
        switch (op) {
            case Operation.Add:
                return a + b;
            case Operation.Subtract:
                return a - b;
            case Operation.Multiply:
                return a * b;
            case Operation.Divide:
                if (b === 0) {
                    throw new DivisionByZeroError("0で割られました");
                }
                return a / b;
            default:
                throw new Error("不明な演算子");
        }
    }
}