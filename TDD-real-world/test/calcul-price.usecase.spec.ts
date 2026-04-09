import { describe, test, expect, beforeEach } from "vitest";

class CalculatePriceUseCase {
    execute(product: { price: number; name: string }) {
        return product.price;
    }
}

describe ("CalculatePriceUseCase", ()=>{
    //4.deplacer le calculatePrice
    let calculatePrice= new CalculatePriceUseCase();
    //1 er test
    test("firstTest",()=>{
        expect(true).toBeTruthy;
    });

    //1.test failed ReferenceError: CalculatePriceUseCase is not defined
    //2.test pass CalculatePriceUseCase > For CalculatePriceUseCase
    test("For CalculatePriceUseCase", () => {

        expect(calculatePrice.execute({price: 1, name: "product1"})).toBe(1);
    });

    //3. test failed CalculatePriceUseCase > For one product → calculatePrice is not defined
    //5. test pass with syntaxe error Expected 0 arguments, but got 1
    //6 test pass return product price
    test("For one product", () => {
        expect(calculatePrice.execute({price: 100, name: "product1"})
        ).toBe(100);
    });

    //7.test failed CalculatePriceUseCase > For two products :expected undefined to be 200
    test("For two products", () => {
        expect(calculatePrice.execute([{price: 100, name: "product1"},{price: 100, name: "product2"}])
        ).toBe(200);
    });

});