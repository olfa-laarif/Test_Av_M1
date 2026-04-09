import { describe, test, expect, beforeEach } from "vitest";
import {CalculatePriceUseCase, Product, StubReductionGateway} from "@/calcul-price.usecase";

describe ("CalculatePriceUseCase", ()=>{
    //4.deplacer le calculatePrice
    let reductionGateway: StubReductionGateway;
    let calculatePrice: CalculatePriceUseCase;
    beforeEach(() => {
        reductionGateway = new StubReductionGateway();
        calculatePrice = new CalculatePriceUseCase(reductionGateway);
    });

    function givenReduction(reduction: { type: string; amount: number }) {
        reductionGateway.reduction = reduction;
    }

    test("firstTest",()=>{
        expect(true).toBeTruthy();
    });

    //1. Test échoue : ReferenceError CalculatePriceUseCase non définie
    //2.Test passe
    test("For CalculatePriceUseCase", async () => {
        const product: Product = { price: 1, name: "product1", quantity: 1 }
        expect(await calculatePrice.execute([product])).toBe(1);
    });

    //3.Test échoue : calculatePrice non défini
    //5. Test passe avec erreur de la syntaxe (Expected 0 arguments, but got 1
    //6 test passe: Implémentation minimale : retourner le prix du produit
    test("For one product", async () => {
        const product: Product = { price: 100, name: "product1", quantity: 1 }
        expect(await calculatePrice.execute([product])
        ).toBe(100);
    });

    //7.Test échoue : gestion de plusieurs produits manquante
    //8.  Modification de la méthode execute pour accepter un tableau
    //9. test passe
    test("For two products", async () => {
        const products: Product[] = [
            { price: 100, name: "product1", quantity: 1 },
            { price: 100, name: "product2", quantity: 1 },
        ];
        expect(await calculatePrice.execute(products)
        ).toBe(200);
    });

    //10.Test échoue : la propriété quantity n'existe pas
    //11.Test passe : ajout de quantity dans le Product et Mise à jour du calcul pour prendre en compte la quantité
    test("For two products with quantity", async () => {
        const products: Product[] = [
            { price: 100, name: "product1", quantity: 1 },
            { price: 100, name: "product2", quantity: 2 },
        ];
        expect(await calculatePrice.execute(products)
        ).toBe(300);
    });

    // 12.Test échoue : la réduction n'est pas encore appliquée
    //13.ajout du ReductionGateway et d'un Stub pour simuler les réductions
    //14.test passe: la réduction est appliquée
    test("For one production with price reduction", async () => {
        // Given
        givenReduction({ type: "PRICE_REDUCTION", amount: 10 });
        const product: Product = { price: 100, name: "product1", quantity: 1 }
        // When
        const result = await calculatePrice.execute([product], "code10");
        // Then
        expect(result).toBe(90);
    });

});