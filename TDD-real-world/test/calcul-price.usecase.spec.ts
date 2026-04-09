import { describe, test, expect, beforeEach } from "vitest";

class CalculatePriceUseCase {
    execute(products:{ price: number; name: string }[]) {
        //return total price of products
        return products.reduce((sum, product) => sum + product.price, 0);
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

        expect(calculatePrice.execute([{price: 1, name: "product1"}])).toBe(1);
    });

    //3. test failed CalculatePriceUseCase > For one product → calculatePrice is not defined
    //5. test pass with syntaxe error Expected 0 arguments, but got 1
    //6 test pass return product price
    test("For one product", () => {
        expect(calculatePrice.execute([{price: 100, name: "product1"}])
        ).toBe(100);
    });

    //7.test failed CalculatePriceUseCase > For two products :expected undefined to be 200
    //8. modification de la signature de execute() pour accepter un tableau de produits
    //9. test pass
    test("For two products", () => {
        expect(calculatePrice.execute([{price: 100, name: "product1"},{price: 100, name: "product2"}])
        ).toBe(200);
    });

    //10.test failed with error syntaxe quantity does not exist in type { price: number; name: string;}
    test("For two products with quantity", () => {
        expect(calculatePrice.execute([{price: 100, name: "product1",quantity: 1,},{price: 100, name: "product2",quantity: 2}])
        ).toBe(300);
    });

});