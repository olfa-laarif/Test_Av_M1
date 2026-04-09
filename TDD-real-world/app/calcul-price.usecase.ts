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
    applicableTo?: ProductsType;

};

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
    const order: Record<string, number> = {
        PRODUIT: 0,
        PRICE_REDUCTION: 1,
        PERCENTAGE: 1,
        BLACKFRIDAY: 2
    };

    const sorted = [...reductions].sort((a, b) =>
        (order[a.type] ?? 0) - (order[b.type] ?? 0)
    );
    for (const reduction of sorted) {
        switch (reduction?.type) {
            case "PRICE_REDUCTION":
                total = Math.max(total - (reduction.amount ?? 0), 1);
                break;
            case "PERCENTAGE":
                total -= total * ((reduction.amount ?? 0) / 100);
                break;
            case "PRODUIT":
                for (const product of products) {
                    if (!reduction.applicableTo || product.type === reduction.applicableTo) {
                        const freeQty = Math.floor(product.quantity / 2);
                        total -= freeQty * product.price;
                    }
                }
                break;
            case "BLACKFRIDAY": {
                if (isBlackFridayPeriod(new Date())) {
                    total = Math.max(total * 0.5, 1);
                }
                break;
            }
        }
    }

    return Math.max(total, 0);
}

function getBlackFridayPeriod(): { start: Date; end: Date } {
    const year = new Date().getFullYear();
    // Black Friday = 4ème vendredi de novembre
    const november = new Date(year, 10, 1); // 1er novembre
    const firstDayOfWeek = november.getDay(); // 0=dimanche, 5=vendredi
    const firstFriday = firstDayOfWeek <= 5
        ? 5 - firstDayOfWeek + 1
        : 7 - firstDayOfWeek + 6;
    const blackFriday = firstFriday + 21; // 4ème vendredi

    const start = new Date(year, 10, blackFriday, 0, 0, 0);
    const end   = new Date(year, 10, blackFriday + 3, 23, 59, 59); // lundi

    return { start, end };
}

function isBlackFridayPeriod(date: Date) {
    const { start, end } = getBlackFridayPeriod();
    return date >= start && date <= end;
}


