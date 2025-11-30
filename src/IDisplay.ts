
/**
 * 電卓の表示処理を行うためのインターフェース。
 * Calculatorはこのインターフェースを通じて画面表示を行う。
 */
export interface IDisplay {
    /**通常の文字(数字や結果)などを画面に表示する */
    render(text:string):void;
    /**エラーメッセージを画面に表示する */
    renderError(message:string):void;
    /**履歴エリアに計算履歴を表示する */
    renderHistory(expression:string):void;
}