export type ProductsType = "TSHIRT" | "PULL";

export type Product = {
    name: string;
    quantity: number;
    price: number;
    type: ProductsType;
};

export type Reduction = {
    type: string;
    amount?: number;

};

export class CalculatePriceUseCase {
    constructor(private reductionGateway: ReductionGateway) {}

    async execute(products:Product[],codes: string[] = []) {

        let total = products.reduce((sum, product) => sum + product.price * product.quantity , 0);
        const reductions = await Promise.all(
            codes.map(code => this.reductionGateway.getReductionByCode(code))
        );
        return calculatePrice(products, reductions);
        //Retourne le prix total des produits
        return total;
    }
}

// Fonction calculatePrice
export function calculatePrice(products: Product[],  reductions: Reduction[] = []): number {
    let total = products.reduce((sum, p) => sum + p.price * p.quantity, 0);
    for (const reduction of reductions) {
        switch (reduction?.type) {
            case "PRICE_REDUCTION":
                total -= reduction.amount ?? 0;
                break;
            case "PERCENTAGE":
                total -= total * ((reduction.amount ?? 0) / 100);
                break;
            case "PRODUIT":
                for (const product of products) {
                    const freeQty = Math.floor(product.quantity / 2);
                    total -= freeQty * product.price;
                }
                break;
        }
    }

    return total;
}

// Implémentation minimale : ajout du ReductionGateway et d'un Stub pour simuler les réductions
interface ReductionGateway {
    getReductionByCode(code: string): Promise<Reduction>;
}

export class StubReductionGateway implements ReductionGateway {
    public reductions: Record<string, Reduction> = {};

    getReductionByCode(code: string): Promise<Reduction> {
        return Promise.resolve(this.reductions[code]);
    }
}
