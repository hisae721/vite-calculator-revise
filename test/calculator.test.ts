import { describe, it, expect, vi } from "vitest";
import { isTooLongNumber, shouldCalculate, parseInputs, calculateStrategy, canAddInput } from "../src/logic/calculator";

const MAX_DIGITS = 8;

describe("calculator.ts 関数テスト", () => {

    describe("isTooLongNumber", () => {
        it("数値かつ8桁以下ならfalse", () => {
            expect(isTooLongNumber("12345678")).toBe(false);
        });

        it("数値かつ9桁以上ならtrue", () => {
            expect(isTooLongNumber("123456789")).toBe(true);
        });

        it("小数点を含めても桁数カウントから除外", () => {
            expect(isTooLongNumber("12345.678")).toBe(false);
        });

        it("数値でない場合はfalse", () => {
            expect(isTooLongNumber("abc")).toBe(false);
        });
    });

    describe("shouldCalculate", () => {
        it("前と現在の値が揃っている場合はtrue", () => {
            expect(shouldCalculate("2", "3")).toBe(true);
        });

        it("どちらかが空の場合はfalse", () => {
            expect(shouldCalculate("", "3")).toBe(false);
            expect(shouldCalculate("2", "")).toBe(false);
            expect(shouldCalculate("", "")).toBe(false);
        });
    });

    describe("parseInputs", () => {
        it("文字列を数値に変換して返す", () => {
            expect(parseInputs("2.5", "3")).toEqual([2.5, 3]);
        });
    });

    describe("calculateStrategy", () => {
        it("加算が正しく計算できる", () => {
            expect(calculateStrategy(2, 3, "+")).toBe(5);
        });

        it("減算が正しく計算できる", () => {
            expect(calculateStrategy(5, 3, "-")).toBe(2);
        });

        it("乗算が正しく計算できる", () => {
            expect(calculateStrategy(2, 3, "*")).toBe(6);
        });

        it("除算が正しく計算できる", () => {
            expect(calculateStrategy(6, 3, "/")).toBe(2);
        });

        it("0で割ろうとしたらエラー文字列を返す", () => {
            const spy = vi.spyOn(console, "error").mockImplementation(() => { });
            expect(calculateStrategy(5, 0, "/")).toBe("エラー");
            spy.mockRestore();
        });

        it("不明な演算子の場合はエラー文字列を返す", () => {
            const spy = vi.spyOn(console, "error").mockImplementation(() => { });
            expect(calculateStrategy(2, 3, "?")).toBe("エラー");
            spy.mockRestore();
        });
    });

    describe("canAddInput", () => {
        it("未入力状態で小数点を押すとfalse", () => {
            expect(canAddInput("", ".")).toBe(false);
        });

        it("すでに小数点がある場合、追加はfalse", () => {
            expect(canAddInput("1.23", ".")).toBe(false);
        });

        it("数字が8桁以上なら追加はfalse", () => {
            expect(canAddInput("12345678", "9")).toBe(false);
        });

        it("有効な数字追加はtrue", () => {
            expect(canAddInput("123", "4")).toBe(true);
        });
    });

});




