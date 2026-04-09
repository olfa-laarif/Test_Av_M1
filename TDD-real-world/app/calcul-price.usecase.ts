export type Product = {
    name: string;
    quantity: number;
    price: number;
};

export type Reduction = {
    type: string;
    amount?: number;
};

export class CalculatePriceUseCase {
    constructor(private reductionGateway: ReductionGateway) {}

    async execute(products:Product[],code?:string) {

        let total = products.reduce((sum, product) => sum + product.price * product.quantity , 0);
        if (!code) return total;
        const reduction = await this.reductionGateway.getReductionByCode(code);

        switch (reduction.type) {
            case "PRICE_REDUCTION":
                total -= reduction.amount?? 0;
                break;
            case "PERCENTAGE":
                total -= total * ((reduction.amount?? 0) / 100);
                break;
        }
        //Retourne le prix total des produits
        return total;
    }
}
// Implémentation minimale : ajout du ReductionGateway et d'un Stub pour simuler les réductions
interface ReductionGateway {
    getReductionByCode(code: string): Promise<Reduction>;
}

export class StubReductionGateway implements ReductionGateway {
    public reduction!: Reduction;

    getReductionByCode(code: string): Promise<Reduction> {
        return Promise.resolve(this.reduction);
    }
}
