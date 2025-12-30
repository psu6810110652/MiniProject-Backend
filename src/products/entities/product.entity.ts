export class Product {
    product_id: string;
    name: string;
    price: number;
    stock_qty: number;
    category_id: string;
    supplier_id: string;
    campaign_id?: string; // เพิ่มเพื่อรองรับ Campaign
}