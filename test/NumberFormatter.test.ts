import { describe, it, expect, vi } from "vitest";
import { NumberFormatter } from "../src/logic/NumberFormatter";

describe("formatForDisplay,fits,formatExponential", () => {
    it("NaNの時ERRORになるか", () => {
        const display = new NumberFormatter();
        expect(display.formatForDisplay(NaN)).toBe("ERROR");
    })

    it("InfinityのときERRORになるか", () => {
        const display = new NumberFormatter();
        expect(display.formatForDisplay(Infinity)).toBe("ERROR");
    })

    it("-InfinityのときERRORになるか", () => {
        const display = new NumberFormatter();
        expect(display.formatForDisplay(-Infinity)).toBe("ERROR");
    })

    it("通常の数値のとき、文字列として表示されるか", () => {
        const display = new NumberFormatter();
        expect(display.formatForDisplay(12345678)).toBe("12345678");
    })

    it("表示桁に収まらない数のとき、指数表記になるか", () => {
        const display = new NumberFormatter();
        expect(display.formatForDisplay(99999999 + 1)).toContain("e");
    })

    it("指数表記になった結果が、maxDigits 以内にちゃんと収まっているか",() => {
        const display = new NumberFormatter();
        const result = display.formatForDisplay(99999999 + 1)
        expect(result.length<=8).toBe(true);
    })
})
