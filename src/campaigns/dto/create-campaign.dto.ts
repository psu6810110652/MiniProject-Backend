import { IsString, IsNumber, IsDateString } from 'class-validator';

export class CreateCampaignDto {
    @IsString()
    campaign_name: string;

    @IsDateString()
    start_date: string;

    @IsDateString()
    end_date: string;

    @IsNumber()
    discount_rate: number;
}