
export const Operation = {
    Add:"+",
    Subtract:"-",
    Multiply:"*",
    Divide:"/"
} as const;

export type OperationType = typeof Operation[keyof typeof Operation];

