import { handleInput, handleOperator, calculate, resetCalculator } from "../logic/input";

export function setupEventListeners() {
    const buttons = document.querySelectorAll<HTMLButtonElement>(".btn");
    const clearBtn = document.getElementById("clear") as HTMLButtonElement;
    const equalBtn = document.getElementById("equal") as HTMLButtonElement;

    buttons.forEach((btn) => {
        btn.addEventListener("click", () => {
            const value = btn.getAttribute("data-value");
            if (!value) return;

            if (btn.classList.contains("operator")) {
                handleOperator(value);
            } else {
                handleInput(value);
            }
        });
    });

    clearBtn.addEventListener("click", resetCalculator);
    equalBtn.addEventListener("click", calculate);
}
