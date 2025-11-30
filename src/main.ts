import { Calculator } from "./logic/Calculator";
import { KeyMapper } from "./logic/KeyMapper";
import { CalcState } from "./logic/CalcState";
import { DomDisplay } from "./ui/DomDisplay";

// HTML の要素 → displayElem
// DomDisplay インスタンス → display

const displayElem = document.getElementById("display")as HTMLDivElement;
const display = new DomDisplay(displayElem);
const buttons : NodeListOf<HTMLElement> = document.querySelectorAll(".btn");


const calc = new Calculator(CalcState.Ready,display);
const mapper = new KeyMapper();


buttons.forEach((btn) => {
    
    btn.addEventListener("click",()=>{
        const token = mapper.resolve(btn);
        if(!token){
            return;
        }

        calc.handleKey(token);

    })
});