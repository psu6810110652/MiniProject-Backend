export class OrderItem {
    product_id: string;
    quantity: number;
    unit_price: number;
}

export class Order {
    order_id: string;
    order_date: Date;
    total_amount: number;
    shipping_fee: number;
    payment_status: string;
    user_id: string;
    items: OrderItem[];
}