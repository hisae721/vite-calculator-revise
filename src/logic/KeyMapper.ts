import type { KeyToken } from "./KeyToken";
import { Operation } from "./Operation";

/**
 * ボタンのキー("1","+","="など)を
 * 電卓が処理できる形式(KeyToken)に変換するクラス。
 * 
 * UIから渡される文字をKeyType(Number,Operator,Decimalなど)の
 * 種類に分類し、必要に応じて演算子の種類(加算・減算など)もセットする。
 */
export class KeyMapper {
    private keyMap: Map<string, KeyToken>;

    constructor() {
        this.keyMap = new Map<string, KeyToken>();
        for(let d=0;d<=9;d++){
            this.keyMap.set(String(d),{ kind: "digit",value: d})
        }
        this.keyMap.set(".", { kind: "decimal" });
        this.keyMap.set("+", { kind: "op", value: Operation.Add });
        this.keyMap.set("-", { kind: "op", value: Operation.Subtract });
        this.keyMap.set("×", { kind: "op", value: Operation.Multiply });
        this.keyMap.set("÷", { kind: "op", value: Operation.Divide });
        this.keyMap.set("=", { kind: "equal" });
        this.keyMap.set("C", { kind: "clear" });
    }

    /**
     * 押されたボタン(EventTarget)からラベル文字を取得し、
     * それに対応するKeyTokenを返す。
     * 
     * 対応するボタンが存在しない場合はnullを返す。
     * 
     * @param target 押されたボタン要素(EventTarget)
     * @returns 対応するKeyToken、なければnull
     */
    public resolve(target: HTMLElement): KeyToken | null {
        const value = target.textContent;
        const result = this.keyMap.get(value);
        if (result) {
            return result;
        }
        return null;
    }
}