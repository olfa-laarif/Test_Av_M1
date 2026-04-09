import { describe, test, expect, beforeEach } from "vitest";

class CalculatePriceUseCase {
    execute() {
        return 0;
    }
}

describe ("CalculatePriceUseCase", ()=>{

    //1 er test
    test("firstTest",()=>{
        expect(true).toBeTruthy;
    });

    //1.test failed ReferenceError: CalculatePriceUseCase is not defined
    //2.test pass CalculatePriceUseCase > For CalculatePriceUseCase
    test("For CalculatePriceUseCase", () => {
        let calculatePrice= new CalculatePriceUseCase();
        expect(calculatePrice.execute()).toBe(0);
    });

    //3. test failed CalculatePriceUseCase > For one product → calculatePrice is not defined
    test("For one product", () => {
        expect(calculatePrice.execute({price: 1, name: "product1",},),
        ).toBe(1);
    });


});