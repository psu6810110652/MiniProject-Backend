export class Campaign {
    campaign_id: string;    // รหัสแคมเปญ
    campaign_name: string;  // ชื่อโปรโมชัน
    start_date: Date;       // วันที่เริ่ม
    end_date: Date;         // วันที่สิ้นสุด
    discount_rate: number;  // เปอร์เซ็นต์ส่วนลด
    description?: string;   // รายละเอียด
}