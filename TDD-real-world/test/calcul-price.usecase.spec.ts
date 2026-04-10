import { describe, test, expect, beforeEach,vi,afterEach } from "vitest";
import {
    CalculatePriceUseCase, DateProvider,
    Product,
    Reduction,
    StubDateProvider,
    StubReductionGateway
} from "@/calcul-price.usecase";

describe ("CalculatePriceUseCase", ()=>{
    //4.deplacer le calculatePrice
    let reductionGateway: StubReductionGateway;
    let dateProvider: StubDateProvider;
    let calculatePrice: CalculatePriceUseCase;
    beforeEach(() => {
        reductionGateway = new StubReductionGateway();
        dateProvider = new StubDateProvider();
        calculatePrice = new CalculatePriceUseCase(reductionGateway,dateProvider);
    });
    function givenReduction(code: string, reduction: Reduction) {
        reductionGateway.reductions[code] = reduction;
    }

    test("firstTest",()=>{
        expect(true).toBeTruthy();
    });

    //1. Test échoue : ReferenceError CalculatePriceUseCase non définie
    //2.Test passe
    test("For CalculatePriceUseCase", async () => {
        const product: Product = { price: 1, name: "product1", quantity: 1,type: "TSHIRT" }
        expect(await calculatePrice.execute([product])).toBe(1);
    });

    //3.Test échoue : calculatePrice non défini
    //5. Test passe avec erreur de la syntaxe (Expected 0 arguments, but got 1
    //6 test passe: Implémentation minimale : retourner le prix du produit
    test("For one product", async () => {
        const product: Product = { price: 100, name: "product1", quantity: 1 ,type: "TSHIRT"}
        expect(await calculatePrice.execute([product])
        ).toBe(100);
    });

    //7.Test échoue : gestion de plusieurs produits manquante
    //8.  Modification de la méthode execute pour accepter un tableau
    //9. test passe
    test("For two products", async () => {
        const products: Product[] = [
            { price: 100, name: "product1", quantity: 1,type: "TSHIRT" },
            { price: 100, name: "product2", quantity: 1,type: "TSHIRT" },
        ];
        expect(await calculatePrice.execute(products)
        ).toBe(200);
    });

    //10.Test échoue : la propriété quantity n'existe pas
    //11.Test passe : ajout de quantity dans le Product et Mise à jour du calcul pour prendre en compte la quantité
    test("For two products with quantity", async () => {
        const products: Product[] = [
            { price: 100, name: "product1", quantity: 1 ,type: "TSHIRT"},
            { price: 100, name: "product2", quantity: 2,type: "TSHIRT" },
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
        givenReduction("code10",reduction);
        const product: Product = { price: 100, name: "product1", quantity: 1,type: "TSHIRT" }
        // When
        const result = await calculatePrice.execute([product],  ["code10"]);
        // Then
        expect(result).toBe(90);
    });
    //16.Test échoue : la réduction en pourcentage n'est pas encore appliquée
    //17.test passe: la réduction est appliquée
    test("For one product with percentage reduction", async () => {
        // Given
        const reduction: Reduction =  { type: "PERCENTAGE", amount: 20 };
        givenReduction("PERCENT20",reduction);
        const product: Product = { price: 120, name: "product1", quantity: 1,type: "TSHIRT" }
        // When
        const result = await calculatePrice.execute([product], ["PERCENT20"]);
        // Then
        expect(result).toBe(96);
    });

    // 18. Test : type de réduction inconnu → total inchangé
    test("For one product with unknown reduction type", async () => {
        // Given
        const reduction: Reduction={ type: "UNKNOWN", amount: 10 };
        givenReduction("UNKNOWN",reduction);
        const product: Product = { price: 100, name: "product1", quantity: 1 ,type: "TSHIRT"};
        // When
        const result = await calculatePrice.execute([product], ["UNKNOWN"]);
        // Then
        expect(result).toBe(100); // total inchangé
    });

    // 19. Test : amount absent → total inchangé grâce au ?? 0
    test("For one product with missing amount", async () => {
        // Given
        const reduction: Reduction={ type: "PRICE_REDUCTION" };
        givenReduction("code10",reduction);
        const product: Product = { price: 100, name: "product1", quantity: 1 ,type: "TSHIRT"};
        // When
        const result = await calculatePrice.execute([product], ["code10"]);
        // Then
        expect(result).toBe(100); // total inchangé car amount ?? 0
    });

    //20.Test échoue : l'offre "1 produit acheté = 1 offert" n'est pas encore appliquée
    //21. test passe: l'offre est appliquée
    test("2 produits achetés = 1 offert", async () => {
        // Given
        const reduction: Reduction={ type: "PRODUIT" };
        givenReduction("ONEFREEPULL",reduction);
        const product: Product = { price: 100, name: "product1", quantity: 2 ,type: "TSHIRT"};
        // When
        const result = await calculatePrice.execute([product], ["ONEFREEPULL"]);
        // Then
        expect(result).toBe(100);
    });

    // 22. Test échoue : execute() n'accepte pas plusieurs codes promo
    //23. test passe
    test("For one product with multiple promo codes", async () => {
        // Given
        reductionGateway.reductions = {
            "code10": { type: "PRICE_REDUCTION", amount: 10 },
            "PERCENT10": { type: "PERCENTAGE", amount: 10 },
        };
        const product: Product = { price: 100, name: "product1", quantity: 1,type: "TSHIRT" };
        // When
        const result = await calculatePrice.execute([product], ["code10", "PERCENT10"]);
        // Then
        // 100 - 10 = 90 → 90 - 10% = 81
        expect(result).toBe(81);
    });
    // 24. Test échoue : ONE_FOR_ONE uniquement sur les PULL
    //25. test passe
    test("2 pulls achetés = 1 offert uniquement sur PULL", async () => {
        // Given
        givenReduction("ONEFREEPULL", { type: "PRODUIT", applicableTo: "PULL" });
        const products: Product[] = [
            { price: 100, name: "pull", quantity: 2, type: "PULL" },
            { price: 100, name: "tshirt", quantity: 2, type: "TSHIRT" },
        ];
        // When
        const result = await calculatePrice.execute(products, ["ONEFREEPULL"]);
        // Then
        // pull: 1 offert → 100, tshirt: aucune réduction → 200 = 300
        expect(result).toBe(300);
    });

    // 26. Test échoue : réduction descend sous 1€
    //27. Test passe : réduction ne descend pas sous 1€
    test("For reduction cannot go below 1€", async () => {
        // Given
        givenReduction("EURO30", { type: "PRICE_REDUCTION", amount: 30 });
        const product: Product = { price: 5, name: "product1", quantity: 1, type: "TSHIRT" };
        // When
        const result = await calculatePrice.execute([product], ["EURO30"]);
        // Then
        expect(result).toBe(1); // 5 - 30 = -25 → plancher à 1€
    });

    // 28. Test échoue : le total descend sous 0
    //29. test passe: le total ne descend jamais sous 0
    test("For total should never go below 0", async () => {
        // Given
        givenReduction("PERCENT200", { type: "PERCENTAGE", amount: 200 });
        const product: Product = { price: 100, name: "product1", quantity: 1, type: "TSHIRT" };
        // When
        const result = await calculatePrice.execute([product], ["PERCENT200"]);
        // Then
        expect(result).toBe(0); // 100 - 200% → plancher à 0
    });

    // 30. Test échoue : BLACKFRIDAY non implémenté
    //31.test passe
    test("For 50% off during Black Friday weekend", async () => {
        // Given
        dateProvider.setDate(new Date("2025-11-28T12:00:00"));
        givenReduction("BLACKFRIDAY", { type: "BLACKFRIDAY" });
        const product: Product = { price: 100, name: "product1", quantity: 1, type: "TSHIRT" };
        // When
        const result = await calculatePrice.execute([product], ["BLACKFRIDAY"]);
        // Then
        expect(result).toBe(50);
    });

    // 32. Test échoue : ordre d'application des réductions non respecté
    //33. test passe
    test("For reductions are applied in the correct order", async () => {
        // Given — PRODUIT → PRICE_REDUCTION → BLACKFRIDAY
        givenReduction("ONEFREEPULL", { type: "PRODUIT", applicableTo: "PULL" });
        givenReduction("EURO10", { type: "PRICE_REDUCTION", amount: 10 });
        givenReduction("BLACKFRIDAY", { type: "BLACKFRIDAY" });
        dateProvider.setDate(new Date("2025-11-28T12:00:00"));
        const product: Product = { price: 100, name: "pull", quantity: 2, type: "PULL" };
        // When — ordre inversé intentionnellement
        const result = await calculatePrice.execute([product], ["BLACKFRIDAY", "EURO10", "ONEFREEPULL"]);
        // Then
        // PRODUIT → 100 → PRICE_REDUCTION → 90 → BLACKFRIDAY 50% → 45
        expect(result).toBe(45);
    });
    //34.Test echoue :vi.setSystemTime(new Date("2025-12-01T00:00:00")) donne 2025-11-30T23:00:00.000Z en UTC
    //35.test passe pour vi.setSystemTime(new Date("2025-12-02T00:00:00"))
    //36. refactor
    test("For Black Friday inactive outside the period", async () => {
        // Given
        dateProvider.setDate(new Date("2025-12-02T00:00:00"));
        givenReduction("BLACKFRIDAY", { type: "BLACKFRIDAY" });
        const product: Product = { price: 100, name: "product1", quantity: 1, type: "TSHIRT" };
        // When
        const result = await calculatePrice.execute([product], ["BLACKFRIDAY"]);
        // Then
        expect(result).toBe(100);
    });

});