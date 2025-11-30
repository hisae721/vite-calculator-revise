import { describe, it, expect, vi } from "vitest";
import { Evaluator } from "../src/logic/Evaluator";
import { Operation, OperationType } from "../src/logic/Operation";


describe("evaluator.tsテスト", () => {
    describe("compute", () => {
        it("1+2は3になる", () => {
            const instance = new Evaluator();
            expect(instance.compute(1, Operation.Add, 2)).toBe(3);
        })
        it("2-1は1になる", () => {
            const instance = new Evaluator();
            expect(instance.compute(2, Operation.Subtract, 1)).toBe(1);
        })
        it("1*2は2になる", () => {
            const instance = new Evaluator();
            expect(instance.compute(1, Operation.Multiply, 2)).toBe(2);
        })
        it("1/0はエラーになる", () => {
            const instance = new Evaluator();
            expect(() => {
                instance.compute(1, Operation.Divide, 0)
            }).toThrow("0で割られました");
        })
        it("不明なopを渡すとエラーになる",()=>{
            const instance = new Evaluator();
            const inValidOp = "?" as unknown as OperationType;
            expect(() => {
                instance.compute(1, inValidOp, 2)
            }).toThrow("不明な演算子");
        })
    })
})


