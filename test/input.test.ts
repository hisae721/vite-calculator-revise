


import { describe, it, expect, vi, beforeEach } from "vitest";
import {
    handleInput,
    handleOperator,
    calculate,
    resetCalculator,
    shouldStartNegative,
    isInputEmpty,
} from "../src/logic/input";


// モック関数を用意
const mockState: any = {
    currentInput: "",
    previousValue: "",
    operator: null,
    resultCalculated: false,
    lastOperatorPressed: false,
};

vi.mock("../src/logic/state", () => ({
    getState: () => mockState,
    setState: (newState: Partial<typeof mockState>) =>
        Object.assign(mockState, newState),
    resetState: () => {
        mockState.currentInput = "";
        mockState.previousValue = "";
        mockState.operator = null;
        mockState.resultCalculated = false;
        mockState.lastOperatorPressed = false;
    },
}));

vi.mock("../src/logic/calculator", () => ({
    canAddInput: vi.fn(() => true),
    shouldCalculate: vi.fn(() => true),
    parseInputs: vi.fn((a, b) => [Number(a), Number(b)]),
    calculateStrategy: vi.fn((a, b, op) => {
        if (op === "+") return a + b;
        if (op === "-") return a - b;
        return "エラー";
    }),
}));

vi.mock("../src/ui/display", () => ({
    updateDisplay: vi.fn(),
    getDisplayValue: vi.fn(() => "123"),
}));

// モックをインポート
import { updateDisplay, getDisplayValue } from "../src/ui/display";
import { calculateStrategy } from "../src/logic/calculator";


describe("input.ts 関数テスト", () => {
    beforeEach(() => {
        // 状態をリセット
        mockState.currentInput = "";
        mockState.previousValue = "";
        mockState.operator = null;
        mockState.resultCalculated = false;
        mockState.lastOperatorPressed = false;
        vi.clearAllMocks();
    });

    describe("handleInput", () => {
        it("新しい数字が入力されたら state と display を更新する", () => {
            handleInput("5");
            expect(mockState.currentInput).toBe("5");
            expect(updateDisplay).toHaveBeenCalledWith("5");
        });

        it("計算が終わっていたらリセットして新しい入力を開始する", () => {
            mockState.resultCalculated = true;
            mockState.currentInput = "99";

            handleInput("7");
            expect(mockState.currentInput).toBe("7");
            expect(mockState.resultCalculated).toBe(false);
        });
    });

    describe("handleOperator", () => {
        it("負の数の開始なら startNegativeInput を呼ぶ", () => {
            mockState.currentInput = "";
            mockState.previousValue = "";
            handleOperator("-");
            expect(mockState.currentInput).toBe("-");
            expect(updateDisplay).toHaveBeenCalledWith("-");
        });

        it("通常の演算子入力なら state を更新して表示する", () => {
            mockState.currentInput = "5";
            handleOperator("+");
            expect(mockState.operator).toBe("+");
            expect(updateDisplay).toHaveBeenCalled();
        });
    });

    describe("calculate", () => {
        it("state が不十分なら何もしない", () => {
            calculate();
            expect(updateDisplay).not.toHaveBeenCalled();
        });

        it("有効な state があれば計算を実行する", () => {
            mockState.previousValue = "2";
            mockState.currentInput = "3";
            mockState.operator = "+";

            calculate();
            expect(calculateStrategy).toHaveBeenCalledWith(2, 3, "+");
            expect(updateDisplay).toHaveBeenCalledWith("5");
            expect(mockState.resultCalculated).toBe(true);
        });
    });

    describe("resetCalculator", () => {
        it("状態をリセットして display を0に更新する", () => {
            mockState.currentInput = "123";
            resetCalculator();
            expect(mockState.currentInput).toBe("");
            expect(updateDisplay).toHaveBeenCalledWith("0");
        });
    });

    describe("shouldStartNegative", () => {
        it("前の値も現在の値も空で、opが-ならtrue", () => {
            mockState.previousValue = "";
            mockState.currentInput = "";
            expect(shouldStartNegative("-")).toBe(true);
        });

        it("条件を満たさなければfalse", () => {
            mockState.previousValue = "1";
            expect(shouldStartNegative("-")).toBe(false);
        });
    });

    describe("isInputEmpty", () => {
        it("前も現在も空ならtrue", () => {
            mockState.previousValue = "";
            mockState.currentInput = "";
            expect(isInputEmpty()).toBe(true);
        });

        it("どちらかに値があればfalse", () => {
            mockState.previousValue = "1";
            mockState.currentInput = "";
            expect(isInputEmpty()).toBe(false);
        });
    });
});