import mockCampaigns from '@/services/mockData/campaigns.json';

class CampaignService {
  constructor() {
    this.campaigns = [...mockCampaigns];
  }

  // Simulate API delay
  delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAll() {
    await this.delay();
    return [...this.campaigns];
  }

  async getById(id) {
    await this.delay();
    const campaign = this.campaigns.find(c => c.Id === id);
    if (!campaign) {
      throw new Error(`Campaign with Id ${id} not found`);
    }
    return { ...campaign };
  }

  async create(campaignData) {
    await this.delay();
    
    // Find highest existing Id and add 1
    const maxId = this.campaigns.reduce((max, campaign) => 
      Math.max(max, campaign.Id), 0);
    
    const newCampaign = {
      Id: maxId + 1,
      ...campaignData,
      impressions: campaignData.impressions || 0,
      clicks: campaignData.clicks || 0,
      conversions: campaignData.conversions || 0,
      spent: campaignData.spent || 0
    };
    
    this.campaigns.unshift(newCampaign);
    return { ...newCampaign };
  }

  async update(id, campaignData) {
    await this.delay();
    
    const index = this.campaigns.findIndex(c => c.Id === id);
    if (index === -1) {
      throw new Error(`Campaign with Id ${id} not found`);
    }
    
    const updatedCampaign = {
      ...this.campaigns[index],
      ...campaignData,
      Id: id // Ensure Id is not changed
    };
    
    this.campaigns[index] = updatedCampaign;
    return { ...updatedCampaign };
  }

  async delete(id) {
    await this.delay();
    
    const index = this.campaigns.findIndex(c => c.Id === id);
    if (index === -1) {
      throw new Error(`Campaign with Id ${id} not found`);
    }
    
    this.campaigns.splice(index, 1);
    return true;
  }

  // Get campaigns by status
  async getByStatus(status) {
    await this.delay();
    return this.campaigns.filter(c => c.status === status);
  }

  // Get campaigns by channel
  async getByChannel(channel) {
    await this.delay();
    return this.campaigns.filter(c => c.channel === channel);
  }

  // Get campaign metrics summary
  async getMetricsSummary() {
    await this.delay();
    
    const activeCampaigns = this.campaigns.filter(c => c.status === 'active');
    const totalBudget = this.campaigns.reduce((sum, c) => sum + c.budget, 0);
    const totalSpent = this.campaigns.reduce((sum, c) => sum + c.spent, 0);
    const totalImpressions = this.campaigns.reduce((sum, c) => sum + c.impressions, 0);
    const totalClicks = this.campaigns.reduce((sum, c) => sum + c.clicks, 0);
    const totalConversions = this.campaigns.reduce((sum, c) => sum + c.conversions, 0);
    
    return {
      activeCampaigns: activeCampaigns.length,
      totalCampaigns: this.campaigns.length,
      totalBudget,
      totalSpent,
      totalImpressions,
      totalClicks,
      totalConversions,
      ctr: totalImpressions > 0 ? (totalClicks / totalImpressions * 100) : 0,
      cvr: totalClicks > 0 ? (totalConversions / totalClicks * 100) : 0,
      roas: totalSpent > 0 ? (totalConversions * 50 / totalSpent) : 0 // Assuming $50 per conversion
    };
  }
}

export const campaignService = new CampaignService();