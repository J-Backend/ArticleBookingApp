

export interface Layaway {
    layawayId: number;
    opening: Date;
    closing: Date;
    state: string;
    total:number;
    customerId:number;
    articles: {
        articleId: number;
        description: string;
        price: number;
        quantity: number;
        subtotal: number;

    }[];
}