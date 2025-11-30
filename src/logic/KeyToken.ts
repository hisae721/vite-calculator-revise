import type { OperationType } from "./Operation";

export type KeyToken =
    | { kind: "digit"; value: number }
    | { kind: "decimal" }
    | { kind: "op"; value: OperationType }
    | { kind: "equal" }
    | { kind: "clear" };


