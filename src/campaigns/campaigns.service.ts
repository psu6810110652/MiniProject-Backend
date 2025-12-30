import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { Campaign } from './entities/campaign.entity';
import { v4 as uuid } from 'uuid';

@Injectable()
export class CampaignsService {
  private campaigns: Campaign[] = [];

  create(createCampaignDto: CreateCampaignDto): Campaign {
    const newCampaign: Campaign = {
      campaign_id: uuid(),
      ...createCampaignDto,
      start_date: new Date(createCampaignDto.start_date),
      end_date: new Date(createCampaignDto.end_date),
    };
    this.campaigns.push(newCampaign);
    return newCampaign;
  }

  findAll(): Campaign[] {
    return this.campaigns;
  }

  findOne(id: string): Campaign {
    const campaign = this.campaigns.find(c => c.campaign_id === id);
    if (!campaign) {
      throw new NotFoundException(`Campaign with ID ${id} not found`);
    }
    return campaign;
  }

  update(id: string, updateCampaignDto: UpdateCampaignDto): Campaign {
    const index = this.campaigns.findIndex(c => c.campaign_id === id);
    if (index === -1) throw new NotFoundException(`Campaign ID ${id} not found`);

    const updated = { ...this.campaigns[index], ...updateCampaignDto };
    this.campaigns[index] = updated as Campaign;
    return updated as Campaign;
  }

  remove(id: string): void {
    const index = this.campaigns.findIndex(c => c.campaign_id === id);
    if (index === -1) throw new NotFoundException(`Campaign ID ${id} not found`);
    this.campaigns.splice(index, 1);
  }
}