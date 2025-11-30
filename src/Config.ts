
/**
 * 電卓アプリ全体で使う設定値をまとめたクラス。
 * 桁数制限やエラーメッセージの共通設定。
 */
export class Config {
    /**表示できる最大桁数は8桁 */
    static readonly MAX_DIGITS: number = 8;
    /**0除算時に表示するエラーメッセージ */
    static  readonly ERROR_MESSAGE:string="エラー";
}

