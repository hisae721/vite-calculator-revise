import { describe, it, expect, vi } from "vitest";
import { InputBuffer } from "../src/logic/InputBuffer";


describe("InputBuffer.tsテスト", () => {
    describe("pushDigit8桁制限", () => {
        it("8桁までは追加できる", () => {
            const buffer = new InputBuffer("");
            for(let i=1;i<=8;i++){
                buffer.pushDigit(i);
            }
            expect(buffer.toString()).toBe("12345678");
            
        })

        it("9桁目は追加されない",() => {
            const buffer = new InputBuffer("");
            for(let i=1;i<=8;i++){
                buffer.pushDigit(i);
            }
            expect(buffer.toString()).toBe("12345678")

            const before = buffer.toString();

            buffer.pushDigit(9);

            const after = buffer.toString();
            expect(after).toBe(before);
        })

        it("小数点が入っても8桁制限が正しく効くか", () => {
            const buffer = new InputBuffer("");
            buffer.pushDigit(1);
            buffer.pushDigit(2);
            buffer.pushDecimal();
            buffer.pushDigit(3);
            buffer.pushDigit(4);
            buffer.pushDigit(5);
            buffer.pushDigit(6);
            buffer.pushDigit(7);
            buffer.pushDigit(8);
            const before = buffer.toString();
            buffer.pushDigit(9);
            const after = buffer.toString();
            expect(after).toBe(before);
        })
    })

    describe("pushDecimal", () => {
        it("数字の後に小数点が追加されるか", () => {
            const buffer = new InputBuffer("");
            buffer.pushDigit(1);
            buffer.pushDecimal();
            expect(buffer.toString()).toBe("1.")
        })

        it("小数点は連続で2回押しても1つのままか", () => {
            const buffer = new InputBuffer("");
            buffer.pushDigit(3);
            buffer.pushDecimal();
            buffer.pushDecimal();
            expect(buffer.toString()).toBe("3.");
        })

        it("小数点の後に数字を入れても、2回目は入らないか",() => {
            const buffer = new InputBuffer("");
            buffer.pushDigit(3);
            buffer.pushDecimal();
            buffer.pushDigit(1);
            buffer.pushDecimal();
            expect(buffer.toString()).toBe("3.1");
        })

        it("何もない状態で小数点を押すと0.になるか",() => {
            const buffer = new InputBuffer("");
            buffer.pushDecimal();
            expect(buffer.toString()).toBe("0.");
        })
    })

    describe("clear",() => {
        it("数字を入力した後、clearすると初期状態に戻るか",() => {
            const buffer = new InputBuffer("");
            buffer.pushDigit(2);
            buffer.clear();
            expect(buffer.isEmpty()).toBe(true);
        })

        it("小数入力のあと clear すると初期状態に戻るか",() => {
            const buffer = new InputBuffer("");
            buffer.pushDigit(5);
            buffer.pushDecimal();
            buffer.pushDigit(4);
            buffer.clear();
            expect(buffer.isEmpty()).toBe(true);
        })

        it("空の状態で clear しても問題ないか",() => {
            const buffer = new InputBuffer("");
            buffer.clear();
            expect(buffer.isEmpty()).toBe(true);
        })
    })

    describe("toNumber",() => {
        it("整数を数値に変換できるか",() => {
            const buffer = new InputBuffer("");
            buffer.pushDigit(5);
            expect(buffer.toNumber()).toBe(5);
        })

        it("小数を数値に変換できるか",() => {
            const buffer = new InputBuffer("");
            buffer.pushDigit(7);
            buffer.pushDecimal();
            buffer.pushDigit(3);
            expect(buffer.toNumber()).toBe(7.3);
        })

        it("空のときに toNumber するとどうなるか",() => {
            const buffer = new InputBuffer("");
            expect(buffer.toNumber()).toBe(0);
        })
    })

    describe("isEmpty",() => {
        it("初期状態では isEmpty が true になる", () => {
            const buffer = new InputBuffer("");
            expect(buffer.isEmpty()).toBe(true);
        })

        it("数字を1つ入れたとき、isEmpty は false になる",() => {
            const buffer = new InputBuffer("");
            buffer.pushDigit(6);
            expect(buffer.isEmpty()).toBe(false);
        })

        it("一度入力した後にclearするとisEmptyは true に戻る",() => {
            const buffer = new InputBuffer("");
            buffer.pushDigit(3);
            buffer.clear();
            expect(buffer.isEmpty()).toBe(true);
        })
    })

    describe("digitCount",() => {
        it("入力が空の時、桁数は0になるか", () => {
            const buffer = new InputBuffer("");
            expect(buffer.digitCount()).toBe(0);
        })

        it("複数の整数を入れたら、その桁数になるか", () => {
            const buffer = new InputBuffer("");
            buffer.pushDigit(6);
            buffer.pushDigit(3);
            buffer.pushDigit(0);
            expect(buffer.digitCount()).toBe(3);
        })

        it("小数点を含んでも「. を数えない」か",() => {
            const buffer = new InputBuffer("");
            buffer.pushDigit(2);
            buffer.pushDecimal();
            buffer.pushDigit(1);
            expect(buffer.digitCount()).toBe(2);
        })
    })

    describe("toString", () => {
        it("入力が空の時、空文字になる", () => {
            const buffer = new InputBuffer("");
            expect(buffer.toString()).toBe("");
        })

        it("整数を入れた時数値に変換されず文字としてそのまま返るか", () => {
            const buffer = new InputBuffer("");
            buffer.pushDigit(3);
            expect(buffer.toString()).toBe("3");
        })

        it("小数を含んだ時「.」も含めてそのまま返るか", () => {
            const buffer = new InputBuffer("");
            buffer.pushDigit(9);
            buffer.pushDecimal();
            buffer.pushDigit(5);
            expect(buffer.toString()).toBe("9.5");
        })
    })

    describe("canAddDigit", () => {
        it("入力が空の時、trueになる", () => {
            const buffer = new InputBuffer("");
            expect(buffer.canAddDigit()).toBe(true);
        })

        it("入力が7桁の時はtrueになる", () => {
            const buffer = new InputBuffer("");
            buffer.pushDigit(1);
            buffer.pushDigit(2);
            buffer.pushDigit(3);
            buffer.pushDigit(4);
            buffer.pushDigit(5);
            buffer.pushDigit(6);
            buffer.pushDigit(7);
            expect(buffer.canAddDigit()).toBe(true);
        })

        it("入力が8桁の時はfalseになる", () => {
            const buffer = new InputBuffer("");
            buffer.pushDigit(1);
            buffer.pushDigit(2);
            buffer.pushDigit(3);
            buffer.pushDigit(4);
            buffer.pushDigit(5);
            buffer.pushDigit(6);
            buffer.pushDigit(7);
            buffer.pushDigit(8);
            expect(buffer.canAddDigit()).toBe(false);
        })
    })
})


