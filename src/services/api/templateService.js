import mockTemplates from '@/services/mockData/templates.json';

class TemplateService {
  constructor() {
    this.templates = [...mockTemplates];
  }

  // Simulate API delay
  delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAll() {
    await this.delay();
    return [...this.templates];
  }

  async getById(id) {
    await this.delay();
    const template = this.templates.find(t => t.Id === id);
    if (!template) {
      throw new Error(`Template with Id ${id} not found`);
    }
    return { ...template };
  }

  async getByCategory(category) {
    await this.delay();
    return this.templates.filter(t => t.category === category);
  }

  async getCategories() {
    await this.delay();
    const categories = [...new Set(this.templates.map(t => t.category))];
    return categories.sort();
  }

  async getFeatured() {
    await this.delay();
    // Return templates with highest conversion rates or most popular
    return this.templates
      .filter(t => ['Welcome Email Series', 'E-commerce Black Friday', 'Google Ads Search Campaign'].includes(t.name))
      .slice(0, 3);
  }

  async searchTemplates(query) {
    await this.delay();
    const searchTerm = query.toLowerCase();
    return this.templates.filter(t => 
      t.name.toLowerCase().includes(searchTerm) ||
      t.description.toLowerCase().includes(searchTerm) ||
      t.category.toLowerCase().includes(searchTerm) ||
      t.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }

  // Create campaign from template
  async createCampaignFromTemplate(templateId, customization = {}) {
    await this.delay();
    const template = await this.getById(templateId);
    
    if (!template) {
      throw new Error(`Template with Id ${templateId} not found`);
    }

    // Merge template data with customization
    const campaignData = {
      ...template.template,
      ...customization,
      // Ensure dates are properly set if provided
      startDate: customization.startDate || new Date().toISOString(),
      endDate: customization.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    };

    return campaignData;
  }

  // Get template metrics
  async getTemplateMetrics(templateId) {
    await this.delay();
    const template = await this.getById(templateId);
    return template.metrics;
  }

  // Get templates by difficulty
  async getByDifficulty(difficulty) {
    await this.delay();
    return this.templates.filter(t => t.difficulty === difficulty);
  }

  // Get templates by estimated time
  async getByTimeRange(minHours, maxHours) {
    await this.delay();
    return this.templates.filter(t => {
      const hours = parseInt(t.estimatedTime);
      return hours >= minHours && hours <= maxHours;
    });
  }
}

export const templateService = new TemplateService();