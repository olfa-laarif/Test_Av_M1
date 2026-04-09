import { describe, test, expect, beforeEach } from "vitest";

export type Product = {
    name: string;
    quantity: number;
    price: number;
};

class CalculatePriceUseCase {
    constructor(private reductionGateway: ReductionGateway) {}

    async execute(products:Product[],code?:string) {

        const reduction = await this.reductionGateway.getReductionByCode(code!!);
        //Retourne le prix total des produits
        return products.reduce((sum, product) => sum + product.price * product.quantity , 0);
    }
}
// Implémentation minimale : ajout du ReductionGateway et d'un Stub pour simuler les réductions
interface ReductionGateway {
    getReductionByCode(code: string): Promise<{ type: string; amount: number }>;
}

class StubReductionGateway implements ReductionGateway {
    public reduction;

    getReductionByCode(code: string): Promise<{
        type: string;
        amount: number;
    }> {
        return Promise.resolve(this.reduction);
    }
}

describe ("CalculatePriceUseCase", ()=>{
    //4.deplacer le calculatePrice
    let reductionGateway: StubReductionGateway;
    let calculatePrice: CalculatePriceUseCase;
    beforeEach(() => {
        reductionGateway = new StubReductionGateway();
        calculatePrice = new CalculatePriceUseCase(reductionGateway);
    });
    test("firstTest",()=>{
        expect(true).toBeTruthy();
    });

    //1. Test échoue : ReferenceError CalculatePriceUseCase non définie
    //2.Test passe
    test("For CalculatePriceUseCase", () => {
        const product: Product = { price: 1, name: "product1", quantity: 1 }
        expect(calculatePrice.execute([product])).toBe(1);
    });

    //3.Test échoue : calculatePrice non défini
    //5. Test passe avec erreur de la syntaxe (Expected 0 arguments, but got 1
    //6 test passe: Implémentation minimale : retourner le prix du produit
    test("For one product", () => {
        const product: Product = { price: 100, name: "product1", quantity: 1 }
        expect(calculatePrice.execute([product])
        ).toBe(100);
    });

    //7.Test échoue : gestion de plusieurs produits manquante
    //8.  Modification de la méthode execute pour accepter un tableau
    //9. test passe
    test("For two products", () => {
        const products: Product[] = [
            { price: 100, name: "product1", quantity: 1 },
            { price: 100, name: "product2", quantity: 1 },
        ];
        expect(calculatePrice.execute(products)
        ).toBe(200);
    });

    //10.Test échoue : la propriété quantity n'existe pas
    //11.Test passe : ajout de quantity dans le Product et Mise à jour du calcul pour prendre en compte la quantité
    test("For two products with quantity", () => {
        const products: Product[] = [
            { price: 100, name: "product1", quantity: 1 },
            { price: 100, name: "product2", quantity: 2 },
        ];
        expect(calculatePrice.execute(products)
        ).toBe(300);
    });

    // Test échoue : la réduction n'est pas encore appliquée
    test("For one production with price reduction", () => {
        // Given
        reductionGateway.reduction = {
            type: "PRICE_REDUCTION",
            amount: 10,
        };
        const product: Product = { price: 100, name: "product1", quantity: 1 }
        // When
        const result = calculatePrice.execute([product], "code10");
        // Then
        expect(result).toBe(90);
    });

});