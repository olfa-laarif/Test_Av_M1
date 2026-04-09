import { describe, test, expect, beforeEach } from "vitest";

class CalculatePriceUseCase {
    execute(param: any[]) {
        return 0;
    }
}

describe ("CalculatePriceUseCase", ()=>{


    //1 er test
    test("firstTest",()=>{
        expect(true).toBeTruthy;
    });


    //test failed ReferenceError: CalculatePriceUseCase is not defined
    //test pass CalculatePriceUseCase > For CalculatePriceUseCase
    test("For CalculatePriceUseCase", () => {
        let calculatePrice= new CalculatePriceUseCase();
        expect(calculatePrice.execute([])).toBe(0);
    });


});