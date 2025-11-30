
import { CalcState, type CalcStateType } from "./CalcState";
import { type OperationType } from "./Operation";
import { InputBuffer } from "./InputBuffer";
import { Evaluator } from "./Evaluator";
import { NumberFormatter } from "./NumberFormatter";
import type { IDisplay } from "../IDisplay";
import type { KeyToken } from "./KeyToken";
import { Config } from "../Config";


export class Calculator {
    /**現在の状態(ステートマシン) */
    private state: CalcStateType;
    /**左オペランド */
    private left: number;
    /**現在の演算子(+ - ×　÷) */
    private operator: OperationType | null;
    /**入力中の数字を管理するバッファ */
    private buffer: InputBuffer;
    /**計算ロジックを担当 */
    private evaluator: Evaluator;
    /**表示フォーマットを担当 */
    private formatter: NumberFormatter;
    /**画面表示インターフェース */
    private display: IDisplay;
    /**一時的に右オペランドを保存するためのもの */
    private lastRightOperand: number | null;
    /**一時的に左オペランドを保存するためのもの */
    private lastLeftOperand: number | null;

    /**
     * Calculatorの生成。
     * 初期状態(state)と表示用インターフェース(display)を受け取り、
     * 電卓内部のコンポーネント(buffer,evaluator,formatter)を初期化する。
     * 
     * @param state 初期状態
     * @param display 表示処理を担当するインターフェース
     */
    constructor(state: CalcStateType, display: IDisplay) {
        this.state = state;
        this.evaluator = new Evaluator();
        this.left = 0;
        this.operator = null;
        this.buffer = new InputBuffer("");
        this.formatter = new NumberFormatter();
        this.display = display;
        this.lastRightOperand = null;
        this.lastLeftOperand = null;
    }

    /**
     * 数字ボタンが押された時の処理。
     * 今のstateに応じてバッファを更新し、表示を切り替える。
     * @param digit 押された数字("0"～"9")
     */
    private handleDigit(digit: string): void {
        if ((this.state === CalcState.InputtingFirst ||
            this.state === CalcState.InputtingSecond) &&
            !this.buffer.canAddDigit()) {
            return;
        }
        switch (this.state) {
            case CalcState.Ready:
                this.firstInput(digit);
                this.state = CalcState.InputtingFirst;
                this.displayBuffer();
                return;
            case CalcState.OperatorEntered:
                this.firstInput(digit);
                this.state = CalcState.InputtingSecond;
                this.display.render(this.left + this.toDisplaySymbol(this.operator!) + digit);
                return;
            case CalcState.InputtingFirst:
            case CalcState.InputtingSecond:
                this.continueInput(digit);
                return;
            case CalcState.ResultShown:
                this.restart(digit);
                this.displayBuffer();
                return;
            case CalcState.Error:
                this.restart(digit);
                this.display.render(this.buffer.toString());
                return;
        }
    }

    /**
     * Ready OperatorEntered
     * これから最初の1桁を入れる状態
     */
    private firstInput(digit: string): void {
        this.buffer.clear();
        this.buffer.pushDigit(Number(digit));
    }

    /**
     * InputtingFirst InputtingSecond
     * すでに数字を入れ始めていて、続きを入力している状態
     */
    private continueInput(digit: string) {
        this.buffer.pushDigit(Number(digit));
        this.displayBuffer();
    }

    /**
     * ResultShown Error
     * 一度確定・失敗したあとで、最初からやり直す状態
     */
    private restart(digit: string) {
        this.buffer.clear();
        this.buffer.pushDigit(Number(digit));
        this.state = CalcState.InputtingFirst;
    }

    /**
     * 現在の InputBuffer の内容を整形して、画面に表示する。
     */
    private displayBuffer(): void {
        this.display.render(this.formatter.formatForDisplay(this.buffer.toNumber()));
    }

    /**
     * 小数点ボタンが押された時の処理。
     * 現在のstateに応じてbufferに小数点を追加し、表示を更新する。
     */
    private handleDecimalPoint(): void {
        switch (this.state) {
            case CalcState.Ready:
            case CalcState.Error:
                this.firstDecimalPoint();
                return;
            case CalcState.InputtingFirst:
            case CalcState.InputtingSecond:
                this.buffer.pushDecimal();
                this.display.render(this.buffer.toString());
                return;
            case CalcState.OperatorEntered:
            case CalcState.ResultShown:
                return;
        }
    }


    // 小数点から新規入力を始める専用の関数
    private firstDecimalPoint() {
        this.buffer = new InputBuffer("");
        this.buffer.pushDecimal();
        this.state = CalcState.InputtingFirst;
        this.display.render(this.buffer.toString());
        return;
    }


    /**
     * 演算子ボタン(+ - ×　÷)が押された時の処理。
     * 状態遷移とオペランド更新を行う。
     * @param op 押された演算子
     */
    private handleOperator(op: OperationType): void {
        switch (this.state) {
            case CalcState.Ready:
                if (op === "-") {
                    this.buffer.clear();
                    this.buffer.pushMinus();
                    this.state = CalcState.InputtingFirst;
                    this.display.render("-");
                }
                return;
            case CalcState.Error:
                return;
            case CalcState.InputtingFirst:
                this.commitOperator(op, this.buffer.toNumber());
                return;
            case CalcState.OperatorEntered:
                this.buffer.clear();
                this.operator = op;
                this.state = CalcState.OperatorEntered;
                this.buildHistory();
                this.state = CalcState.InputtingSecond;
                return;
            case CalcState.InputtingSecond:
                const result = this.evaluator.compute(this.left, this.operator!, this.buffer.toNumber());
                this.display.render(String(result));
                this.commitOperator(op, result);
                return;
            case CalcState.ResultShown:
                this.operator = op;
                this.state = CalcState.OperatorEntered;
                this.buildHistory();
                return;
        }
    }

    /**
     * 演算子と左オペランドを確定し、状態と履歴を更新する。
     * @param op 次に使用する演算子
     * @param nextLeft 左オペランドとして確定する数値
     */
    private commitOperator(op: OperationType, nextLeft: number) {
        this.left = nextLeft;
        this.operator = op;
        this.state = CalcState.OperatorEntered;
        this.buildHistory();
    }

    /**
     * イコールボタンが押された時の処理。
     * 現在のleft、operator、bufferの内容に基づいて計算を行い、
     * 結果を表示して状態をResultShownに遷移させる。
     */
    public handleEqual(): void {
        if (this.state !== CalcState.InputtingSecond) {
            return;
        }
        try {
            this.lastLeftOperand = this.left;
            this.lastRightOperand = this.buffer.toNumber();
            const result = this.evaluator.compute(this.left, this.operator!, this.buffer.toNumber());
            const formatted = this.formatter.formatForDisplay(result);

            if (formatted === "ERROR") {
                this.state = CalcState.ResultShown;
                this.buildHistory();
                this.state = CalcState.Error;
                this.display.renderError(Config.ERROR_MESSAGE);
                return;
            }
            this.display.render(formatted);
            this.left = result;
            this.state = CalcState.ResultShown;
            this.buildHistory();

        } catch (error) {
            if (error instanceof Error) {
                console.error(error.message);
            }
            this.state = CalcState.ResultShown;
            this.buildHistory();
            this.state = CalcState.Error;
            this.display.renderError(Config.ERROR_MESSAGE);
        } finally {
            this.buffer.clear();
        }
    }


    /**
     * 入力中は現在の入力のみをクリアし、結果表示中やエラー時は全体を初期化する。
     */
    public handleClear(): void {
        if (this.state === CalcState.InputtingFirst || this.state === CalcState.InputtingSecond) {
            this.buffer.clear();
            this.display.render("0");
        } else if (this.state === CalcState.ResultShown || this.state === CalcState.Error) {
            this.handleAllClear();

        }
    };


    /**
     * 電卓の状態をすべて初期化し、初期表示に戻す。
     */
    public handleAllClear(): void {
        this.buffer.clear();
        this.left = 0;
        this.operator = null;
        this.display.render("0");
        this.display.renderHistory("");
        this.state = CalcState.Ready;
    };

    /**
     * 演算子を画面表示用の記号に変換する。
     * @param op 内部で使用している演算子（"+", "-", "*", "/"）
     * @returns 画面に表示するための演算子記号
     */
    private toDisplaySymbol(op: OperationType): string {
        if (op === "/") {
            return "÷";
        }
        if (op === "*") {
            return "×";
        }
        return op;
    }


    /**
     * 電卓の現在の状態に応じて、履歴エリアに表示する計算式を更新する。
     * 
     * 表示専用の処理であり、計算や状態の変更は行わない。
     */
    private buildHistory(): void {
        switch (this.state) {
            case CalcState.OperatorEntered: {
                const history = this.left + this.toDisplaySymbol(this.operator!);
                this.display.renderHistory(history);
                return;
            }

            case CalcState.InputtingSecond: {
                const history = this.left + this.toDisplaySymbol(this.operator!);
                this.display.renderHistory(history);
                return;
            }
            case CalcState.ResultShown: {
                const history = this.lastLeftOperand + this.toDisplaySymbol(this.operator!) + this.lastRightOperand + "=";
                this.display.renderHistory(history);
                return;
            }
        }
    }

    /**
     * 押されたボタンに対応するKeyTokenを受け取り、
     * kind(種類)ごとに正しい処理を実行する。
     * @param token 押されたボタンに対応する入力トークン(数字、小数点etc)
     */
    public handleKey(token: KeyToken): void {
        switch (token.kind) {
            case "digit":
                this.handleDigit(String(token.value));
                break;
            case "decimal":
                this.handleDecimalPoint();
                break;
            case "op":
                this.handleOperator(token.value);
                break;
            case "equal":
                this.handleEqual();
                break;
            case "clear":
                this.handleClear();
                break;
        }
    }
}

