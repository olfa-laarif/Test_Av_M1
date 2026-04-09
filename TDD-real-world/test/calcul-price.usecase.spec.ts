import { describe, test, expect, beforeEach } from "vitest";

describe ("CalculatePriceUseCase", ()=>{


    //1 er test
    test("firstTest",()=>{
        expect(true).toBeTruthy;
    });


    //test failed ReferenceError: CalculatePriceUseCase is not defined
    test("For CalculatePriceUseCase", () => {
        let calculatePrice= new CalculatePriceUseCase();
        expect(calculatePrice.execute([])).toBe(0);
    });


});