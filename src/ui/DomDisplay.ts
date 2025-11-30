import type { IDisplay } from "../IDisplay";

/**
 * 電卓の画面に文字を表示するためのクラス。
 * HTMLの要素を受け取り、その中に数字や計算結果、
 * エラーメッセージなどを表示する。
 */
export class DomDisplay implements IDisplay {
    private el:HTMLElement;
    private historyEl:HTMLElement;

    constructor(el:HTMLElement){
        this.el = el;
        this.historyEl = document.getElementById("history")!as HTMLDivElement;
    }

    /**
     * 画面に表示させる関数
     * Calculator が渡してきた文字列を、
     * HTML 要素（el）の textContent に反映する。
     * @param text 表示したい文字（数字・結果・式など）
     */
    public render(text: string): void {
        this.el.textContent = text;
    }

    /**
     * エラーメッセージを電卓の画面に表示する関数。
     * @param message 表示したいエラー内容
     */
    public renderError(message: string): void {
        this.el.textContent = `${message}`;
    }

    /**
     * 計算履歴を画面に表示させる関数
     * @param expression 表示したい文字
     */
    public renderHistory(expression:string){
        this.historyEl.textContent = `${expression}`;
    }
}