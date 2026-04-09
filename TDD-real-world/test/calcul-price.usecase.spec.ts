import { describe, test, expect, beforeEach } from "vitest";

class CalculatePriceUseCase {
    execute(products:{ price: number; name: string ,quantity: number }[]) {
        //Retourne le prix total des produits
        return products.reduce((sum, product) => sum + product.price * product.quantity , 0);
    }
}

describe ("CalculatePriceUseCase", ()=>{
    //4.deplacer le calculatePrice
    let calculatePrice= new CalculatePriceUseCase();
    // Premier test
    test("firstTest",()=>{
        expect(true).toBeTruthy;
    });

    //1. Test échoue : ReferenceError CalculatePriceUseCase non définie
    //2.Test passe
    test("For CalculatePriceUseCase", () => {

        expect(calculatePrice.execute([{price: 1, name: "product1",quantity: 1}])).toBe(1);
    });

    //3.Test échoue : calculatePrice non défini
    //5. Test passe avec erreur de la syntaxe (Expected 0 arguments, but got 1
    //6 test passe: Implémentation minimale : retourner le prix du produit
    test("For one product", () => {
        expect(calculatePrice.execute([{price: 100, name: "product1",quantity: 1}])
        ).toBe(100);
    });

    //7.Test échoue : gestion de plusieurs produits manquante
    //8.  Modification de la méthode execute pour accepter un tableau
    //9. test passe
    test("For two products", () => {
        expect(calculatePrice.execute([{price: 100, name: "product1",quantity: 1},{price: 100, name: "product2",quantity: 1}])
        ).toBe(200);
    });

    //10.Test échoue : la propriété quantity n'existe pas
    //11.Test passe : ajout de quantity dans le Product et Mise à jour du calcul pour prendre en compte la quantité
    test("For two products with quantity", () => {
        expect(calculatePrice.execute([{price: 100, name: "product1",quantity: 1,},{price: 100, name: "product2",quantity: 2}])
        ).toBe(300);
    });

});