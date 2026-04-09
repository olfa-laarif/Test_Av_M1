import { describe, test, expect, beforeEach } from "vitest";
import {CalculatePriceUseCase, Product, Reduction, StubReductionGateway} from "@/calcul-price.usecase";

describe ("CalculatePriceUseCase", ()=>{
    //4.deplacer le calculatePrice
    let reductionGateway: StubReductionGateway;
    let calculatePrice: CalculatePriceUseCase;
    beforeEach(() => {
        reductionGateway = new StubReductionGateway();
        calculatePrice = new CalculatePriceUseCase(reductionGateway);
    });

    function givenReduction(reduction: Reduction) {
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
    //15. Refactor : extraction de givenReduction() et déplacement dans calcul-price.usecase.ts
    test("For one production with price reduction", async () => {
        // Given
        const reduction: Reduction = { type: "PRICE_REDUCTION", amount: 10 }
        givenReduction(reduction);
        const product: Product = { price: 100, name: "product1", quantity: 1 }
        // When
        const result = await calculatePrice.execute([product], "code10");
        // Then
        expect(result).toBe(90);
    });
    //16.Test échoue : la réduction en pourcentage n'est pas encore appliquée
    //17.test passe: la réduction est appliquée
    test("For one product with percentage reduction", async () => {
        // Given
        const reduction: Reduction =  { type: "PERCENTAGE", amount: 20 };
        givenReduction(reduction);
        const product: Product = { price: 120, name: "product1", quantity: 1 }
        // When
        const result = await calculatePrice.execute([product], "PERCENT20");
        // Then
        expect(result).toBe(96);
    });

    // 18. Test : type de réduction inconnu → total inchangé
    test("For one product with unknown reduction type", async () => {
        // Given
        const reduction: Reduction={ type: "UNKNOWN", amount: 10 };
        givenReduction(reduction);
        const product: Product = { price: 100, name: "product1", quantity: 1 };
        // When
        const result = await calculatePrice.execute([product], "UNKNOWN");
        // Then
        expect(result).toBe(100); // total inchangé
    });

    // 19. Test : amount absent → total inchangé grâce au ?? 0
    test("For one product with missing amount", async () => {
        // Given
        givenReduction({ type: "PRICE_REDUCTION" });
        const product: Product = { price: 100, name: "product1", quantity: 1 };
        // When
        const result = await calculatePrice.execute([product], "code10");
        // Then
        expect(result).toBe(100); // total inchangé car amount ?? 0
    });


});