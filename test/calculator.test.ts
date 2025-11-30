import { describe, it, expect, vi, beforeEach } from "vitest";
import { Calculator } from "../src/logic/Calculator";
import { CalcState } from "../src/logic/CalcState";
import { Operation } from "../src/logic/Operation";
import { Config } from "../src/Config";


const mockDisplay = {
    render: vi.fn(),
    renderError: vi.fn(),
    renderHistory: vi.fn(),
};


beforeEach(() => {
    mockDisplay.render.mockClear();
    mockDisplay.renderError.mockClear();
});

describe("Calculator", () => {
    describe("handleDigit", () => {
        it("最初の1桁が正しく入るか", () => {
            const calculator = new Calculator(CalcState.Ready, mockDisplay);
            const key = { kind: "digit" as const, value: 7 };
            calculator.handleKey(key);
            expect(mockDisplay.render).toHaveBeenCalledWith("7");
        })

        it("数字が連結されるか", () => {
            const calculator = new Calculator(CalcState.InputtingFirst, mockDisplay);
            const firstKey = { kind: "digit" as const, value: 1 };
            const secondKey = { kind: "digit" as const, value: 2 };
            calculator.handleKey(firstKey);
            calculator.handleKey(secondKey);
            expect(mockDisplay.render).toHaveBeenCalledWith("12");
        })

        it("第2項が正しく始まるか", () => {
            const calculator = new Calculator(CalcState.Ready, mockDisplay);
            const firstKey = { kind: "digit" as const, value: 1 };
            calculator.handleKey(firstKey);
            const plusKey = { kind: "op" as const, value: Operation.Add };
            calculator.handleKey(plusKey);
            const secondKey = { kind: "digit" as const, value: 2 };
            calculator.handleKey(secondKey);
            console.log(mockDisplay.render.mock.calls);
            expect(mockDisplay.render).toHaveBeenLastCalledWith("1+2");
        })

        it("ResultShown のとき、新しい入力でリスタートできるか", () => {
            const calculator = new Calculator(CalcState.Ready, mockDisplay);
            const firstKey = { kind: "digit" as const, value: 1 };
            calculator.handleKey(firstKey);
            const plusKey = { kind: "op" as const, value: Operation.Add };
            calculator.handleKey(plusKey);
            const secondKey = { kind: "digit" as const, value: 2 };
            calculator.handleKey(secondKey);
            const equalKey = { kind: "equal" as const };
            calculator.handleKey(equalKey);
            const restartKey = { kind: "digit" as const, value: 5 };
            calculator.handleKey(restartKey);
            expect(mockDisplay.render).toHaveBeenLastCalledWith("5");
        })

        it("canAddDigit が false のとき、何も起きないか（9桁目は無視される）", () => {
            const calculator = new Calculator(CalcState.Ready, mockDisplay);
            const keys = [
                { kind: "digit" as const, value: 1 },
                { kind: "digit" as const, value: 2 },
                { kind: "digit" as const, value: 3 },
                { kind: "digit" as const, value: 4 },
                { kind: "digit" as const, value: 5 },
                { kind: "digit" as const, value: 6 },
                { kind: "digit" as const, value: 7 },
                { kind: "digit" as const, value: 8 },
            ];
            for (const key of keys) {
                calculator.handleKey(key);
            }
            expect(mockDisplay.render).toHaveBeenLastCalledWith("12345678");
            const overflowKey = { kind: "digit" as const, value: 9 };
            calculator.handleKey(overflowKey);
            expect(mockDisplay.render).toHaveBeenLastCalledWith("12345678");
        })
    })

    describe("handleDecimalPoint", () => {
        it("何も入力していない状態で . を押したら、0. から始まるか？", () => {
            const calculator = new Calculator(CalcState.Ready, mockDisplay);
            const key = { kind: "decimal" as const };
            calculator.handleKey(key);
            expect(mockDisplay.render).toHaveBeenLastCalledWith("0.");
        })
        it("すでに数値が入っている状態で . を押したら、後ろに . が付くか？", () => {
            const calculator = new Calculator(CalcState.Ready, mockDisplay);
            const firstKey = { kind: "digit" as const, value: 1 };
            calculator.handleKey(firstKey);
            const secondKey = { kind: "decimal" as const };
            calculator.handleKey(secondKey);
            expect(mockDisplay.render).toHaveBeenLastCalledWith("1.");
        })
        it("OperatorEntered のとき . を押しても何も起きない", () => {
            const calculator = new Calculator(CalcState.Ready, mockDisplay);
            const oneKey = { kind: "digit" as const, value: 1 };
            calculator.handleKey(oneKey);
            const plusKey = { kind: "op" as const, value: Operation.Add };
            calculator.handleKey(plusKey);
            const lastCallCount = mockDisplay.render.mock.calls.length;
            const decimalKey = { kind: "decimal" as const };
            calculator.handleKey(decimalKey);
            expect(mockDisplay.render).toHaveBeenCalledTimes(lastCallCount);
        });
        it("ResultShown のとき . を押しても何も起きない", () => {
            const calculator = new Calculator(CalcState.Ready, mockDisplay);
            const oneKey = { kind: "digit" as const, value: 1 };
            calculator.handleKey(oneKey);
            const plusKey = { kind: "op" as const, value: Operation.Add };
            calculator.handleKey(plusKey);
            const twoKey = { kind: "digit" as const, value: 2 };
            calculator.handleKey(twoKey);
            const equalKey = { kind: "equal" as const };
            calculator.handleKey(equalKey);
            const lastCallCount = mockDisplay.render.mock.calls.length;
            const decimalKey = { kind: "decimal" as const };
            calculator.handleKey(decimalKey);
            expect(mockDisplay.render).toHaveBeenCalledTimes(lastCallCount);
        });
    })

    describe("handleOperator", () => {
        it("Ready で演算子を押しても、何も変わらないか？", () => {
            const calculator = new Calculator(CalcState.Ready, mockDisplay);
            const key = { kind: "op" as const, value: Operation.Add };
            calculator.handleKey(key);
            expect(mockDisplay.render).toHaveBeenCalledTimes(0);
        })
        it("InputtingFirst のとき、演算子を押すと第1項が確定して OperatorEntered になるか", () => {
            const calculator = new Calculator(CalcState.Ready, mockDisplay);
            const firstKey = { kind: "digit" as const, value: 1 };
            calculator.handleKey(firstKey);
            const plusKey = { kind: "op" as const, value: Operation.Add };
            calculator.handleKey(plusKey);
            expect(mockDisplay.render).toHaveBeenLastCalledWith("1");
            expect((calculator as any).state).toBe(CalcState.OperatorEntered);
            expect(mockDisplay.renderHistory).toHaveBeenLastCalledWith("1+");
        });
        it("OperatorEntered のとき、演算子を上書きできるか", () => {
            const calculator = new Calculator(CalcState.Ready, mockDisplay);
            const oneKey = { kind: "digit" as const, value: 1 };
            calculator.handleKey(oneKey);
            const plusKey = { kind: "op" as const, value: Operation.Add };
            calculator.handleKey(plusKey);
            const minusKey = { kind: "op" as const, value: Operation.Subtract };
            calculator.handleKey(minusKey);
            expect(mockDisplay.render).toHaveBeenLastCalledWith("1");
            expect(mockDisplay.renderHistory).toHaveBeenLastCalledWith("1-");
        });
        it("InputtingSecond のとき、計算して次の演算に進めるか", () => {
            const calculator = new Calculator(CalcState.Ready, mockDisplay);
            calculator.handleKey({ kind: "digit" as const, value: 1 });
            calculator.handleKey({ kind: "op" as const, value: Operation.Add });
            calculator.handleKey({ kind: "digit" as const, value: 2 });
            calculator.handleKey({ kind: "op" as const, value: Operation.Multiply });
            expect(mockDisplay.render).toHaveBeenLastCalledWith("3");
            expect(mockDisplay.renderHistory).toHaveBeenLastCalledWith("3×");
            expect((calculator as any).state).toBe(CalcState.OperatorEntered);
        });
        it("ResultShown のとき、結果を left にして次の演算に進めるか", () => {
            const calculator = new Calculator(CalcState.Ready, mockDisplay);
            calculator.handleKey({ kind: "digit" as const, value: 1 });
            calculator.handleKey({ kind: "op" as const, value: Operation.Add });
            calculator.handleKey({ kind: "digit" as const, value: 2 });
            calculator.handleKey({ kind: "equal" as const });
            calculator.handleKey({ kind: "op" as const, value: Operation.Add });
            expect(mockDisplay.render).toHaveBeenLastCalledWith("3");
            expect(mockDisplay.renderHistory).toHaveBeenLastCalledWith("3+");
            expect((calculator as any).state).toBe(CalcState.OperatorEntered);
        });
    })

    describe("handleEqual", () => {
        let calculator: Calculator;
        let computeSpy: any;
        let clearSpy: any;
        beforeEach(() => {
            calculator = new Calculator(CalcState.InputtingSecond, mockDisplay);
            computeSpy = vi.spyOn(
                (calculator as any).evaluator,
                "compute"
            );
            clearSpy = vi.spyOn(
                (calculator as any).buffer,
                "clear"
            );
        });

        it("「第2オペランド入力中」以外では 何も起きない", () => {
            (calculator as any).state = CalcState.Ready;
            const beforeState = (calculator as any).state;
            const beforeLeft = (calculator as any).left;
            calculator.handleEqual();
            expect(computeSpy).not.toHaveBeenCalled();
            expect(clearSpy).not.toHaveBeenCalled();
            expect(mockDisplay.render).not.toHaveBeenCalled();
            expect(mockDisplay.renderError).not.toHaveBeenCalled();
            expect((calculator as any).state).toBe(beforeState);
            expect((calculator as any).left).toBe(beforeLeft);
        });

        it("正常な計算が成功する（表示・state・left・履歴・buffer）", () => {
            (calculator as any).left = 10;
            (calculator as any).operator = Operation.Add;
            (calculator as any).buffer.pushDigit(5); // 第2オペランド = 5
            const historySpy = vi.spyOn(
                calculator as any,
                "buildHistory"
            );
            computeSpy.mockReturnValue(15);
            calculator.handleEqual();
            expect(computeSpy).toHaveBeenCalledWith(10, Operation.Add, 5);
            expect(mockDisplay.render).toHaveBeenCalledWith("15");
            expect((calculator as any).left).toBe(15);
            expect((calculator as any).state).toBe(CalcState.ResultShown);
            expect(historySpy).toHaveBeenCalled();
            expect(clearSpy).toHaveBeenCalled();
        });

        it("フォーマット結果が 'ERROR' のときは Error 状態になり、renderError が呼ばれる", () => {
            (calculator as any).left = 10;
            (calculator as any).operator = Operation.Add;
            (calculator as any).buffer.pushDigit(5);
            computeSpy.mockReturnValue(999999999);
            const formatSpy = vi.spyOn(
                (calculator as any).formatter,
                "formatForDisplay"
            ).mockReturnValue("ERROR");
            const historySpy = vi.spyOn(
                calculator as any,
                "buildHistory"
            );
            calculator.handleEqual();
            expect(mockDisplay.renderError).toHaveBeenCalledWith(Config.ERROR_MESSAGE);
            expect((calculator as any).state).toBe(CalcState.Error);
            expect((calculator as any).left).toBe(10);
            expect(historySpy).not.toHaveBeenCalled();
            expect(clearSpy).toHaveBeenCalled();
            formatSpy.mockRestore();
        });

        it("compute が例外を投げたときは Error 状態になり、renderError が呼ばれる", () => {
            (calculator as any).left = 10;
            (calculator as any).operator = Operation.Divide;
            (calculator as any).buffer.pushDigit(0);
            computeSpy.mockImplementation(() => {
                throw new Error("0では割り算できません");
            });
            const historySpy = vi.spyOn(
                calculator as any,
                "buildHistory"
            );
            calculator.handleEqual();
            expect(mockDisplay.renderError).toHaveBeenCalledWith(Config.ERROR_MESSAGE);
            expect((calculator as any).state).toBe(CalcState.Error);
            expect((calculator as any).left).toBe(10);
            expect(historySpy).not.toHaveBeenCalled();
            expect(clearSpy).toHaveBeenCalled();
        });

        it("finally によって buffer.clear() が必ず呼ばれる", () => {
            (calculator as any).left = 10;
            (calculator as any).operator = Operation.Add;
            (calculator as any).buffer.pushDigit(5);
            computeSpy.mockImplementation(() => {
                throw new Error("強制エラー");
            });
            calculator.handleEqual();
            expect(clearSpy).toHaveBeenCalled();
        });

    })

    describe("handleClear", () => {
        let calculator: Calculator;
        let clearSpy: any;

        beforeEach(() => {
            calculator = new Calculator(CalcState.InputtingFirst, mockDisplay);

            clearSpy = vi.spyOn(
                (calculator as any).buffer,
                "clear"
            );

            mockDisplay.render.mockClear();
            mockDisplay.renderError.mockClear();
        })

        it("InputtingFirst のときは buffer をクリアして '0' を表示する", () => {
            (calculator as any).state = CalcState.InputtingFirst;
            calculator.handleClear();
            expect(clearSpy).toHaveBeenCalled();
            expect(mockDisplay.render).toHaveBeenCalledWith("0");
        });

        it("InputtingSecond のときは buffer をクリアして '0' を表示する", () => {
            (calculator as any).state = CalcState.InputtingSecond;
            calculator.handleClear();
            expect(clearSpy).toHaveBeenCalled();
            expect(mockDisplay.render).toHaveBeenCalledWith("0");
        });

        it("ResultShown のときは handleAllClear が呼ばれる", () => {
            (calculator as any).state = CalcState.ResultShown;
            const allClearSpy = vi.spyOn(
                calculator as any,
                "handleAllClear"
            );
            calculator.handleClear();
            expect(allClearSpy).toHaveBeenCalled();
        });

        it("④ Error のときは handleAllClear が呼ばれる", () => {
            (calculator as any).state = CalcState.Error;
            const allClearSpy = vi.spyOn(
                calculator as any,
                "handleAllClear"
            );
            calculator.handleClear();
            expect(allClearSpy).toHaveBeenCalled();
        });
    })

    describe("handleAllClear", () => {
        let calculator: Calculator;
        let clearSpy: any;

        beforeEach(() => {
            calculator = new Calculator(CalcState.InputtingSecond, mockDisplay);

            clearSpy = vi.spyOn(
                (calculator as any).buffer,
                "clear"
            );

            mockDisplay.render.mockClear();
            mockDisplay.renderHistory.mockClear();
        });

        it("すべての状態を初期化する（buffer, left, operator, display, history, state）", () => {
            (calculator as any).left = 123;
            (calculator as any).operator = Operation.Add;
            (calculator as any).state = CalcState.Error;
            calculator.handleAllClear();
            expect(clearSpy).toHaveBeenCalled();
            expect((calculator as any).left).toBe(0);
            expect((calculator as any).operator).toBeNull();
            expect(mockDisplay.render).toHaveBeenCalledWith("0");
            expect(mockDisplay.renderHistory).toHaveBeenCalledWith("");
            expect((calculator as any).state).toBe(CalcState.Ready);
        });
    });

    describe("buildHistory", () => {
        let calculator: Calculator;
        beforeEach(() => {
            calculator = new Calculator(CalcState.Ready, mockDisplay);
            mockDisplay.renderHistory.mockClear();
        });
        it("OperatorEntered のとき「left + operator」が履歴に表示される", () => {
            (calculator as any).state = CalcState.OperatorEntered;
            (calculator as any).left = 10;
            (calculator as any).operator = Operation.Add;
            (calculator as any).buildHistory();
            expect(mockDisplay.renderHistory).toHaveBeenCalledWith("10+");
        });
        it("InputtingSecond のときは履歴に「left + operator」だけが表示される", () => {
            mockDisplay.renderHistory.mockClear();
            (calculator as any).state = CalcState.InputtingSecond;
            (calculator as any).left = 10;
            (calculator as any).operator = Operation.Add;
            (calculator as any).buffer.pushDigit(5);
            (calculator as any).buildHistory();
            expect(mockDisplay.renderHistory).toHaveBeenLastCalledWith("10+");
        });
        it("ResultShown のとき「lastLeft + operator + lastRight + =」が履歴に表示される", () => {
            (calculator as any).state = CalcState.ResultShown;
            (calculator as any).lastLeftOperand = 8;
            (calculator as any).operator = Operation.Multiply;
            (calculator as any).lastRightOperand = 7;
            (calculator as any).buildHistory();
            expect(mockDisplay.renderHistory).toHaveBeenCalledWith("8×7=");
        });
    })

    describe("handleKey", () => {
        let calculator: Calculator;
        beforeEach(() => {
            calculator = new Calculator(CalcState.Ready, mockDisplay);
            vi.spyOn(calculator as any, "handleDigit");
            vi.spyOn(calculator as any, "handleDecimalPoint");
            vi.spyOn(calculator as any, "handleOperator");
            vi.spyOn(calculator as any, "handleEqual");
            vi.spyOn(calculator as any, "handleClear");
        });
        it("digit のとき handleDigit が呼ばれる", () => {
            const token = { kind: "digit", value: 5 } as any;

            calculator.handleKey(token);

            expect((calculator as any).handleDigit).toHaveBeenCalledWith("5");
        });
        it("decimal のとき handleDecimalPoint が呼ばれる", () => {
            const token = { kind: "decimal" } as any;

            calculator.handleKey(token);

            expect((calculator as any).handleDecimalPoint).toHaveBeenCalled();
        });
        it("op のとき handleOperator が呼ばれる", () => {
            const token = { kind: "op", value: Operation.Add } as any;

            calculator.handleKey(token);

            expect((calculator as any).handleOperator).toHaveBeenCalledWith(Operation.Add);
        });
        it("equal のとき handleEqual が呼ばれる", () => {
            const token = { kind: "equal" } as any;

            calculator.handleKey(token);

            expect((calculator as any).handleEqual).toHaveBeenCalled();
        });
        it("clear のとき handleClear が呼ばれる", () => {
            const token = { kind: "clear" } as any;

            calculator.handleKey(token);

            expect((calculator as any).handleClear).toHaveBeenCalled();
        });
    });
})
