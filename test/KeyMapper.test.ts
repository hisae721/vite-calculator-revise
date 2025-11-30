import { describe, it, expect, vi } from "vitest";
import { KeyMapper } from "../src/logic/KeyMapper"
import { resolve } from "path";

describe("KeyMapperクラスresolve関数",() => {
    it("対応するキーが存在する場合、KeyToken がちゃんと返るか？", () => {
        const mapper = new KeyMapper();
        const el = document.createElement("button");
        el.textContent = "5";
        const result = mapper.resolve(el);
        expect(result).not.toBeNull();
    })

    it("keyMap に存在しない文字なら、null が返るか？", () => {
        const mapper = new KeyMapper();
        const el = document.createElement("button");
        el.textContent = "#";
        const result = mapper.resolve(el);
        expect(result).toBe(null);
    })
})