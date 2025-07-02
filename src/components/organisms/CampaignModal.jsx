import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import FilterDropdown from '@/components/molecules/FilterDropdown';
import ApperIcon from '@/components/ApperIcon';
import { format } from 'date-fns';

const CampaignModal = ({ campaign, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    status: 'draft',
    startDate: '',
    endDate: '',
    budget: '',
    channel: '',
    impressions: 0,
    clicks: 0,
    conversions: 0,
    spent: 0
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (campaign) {
      setFormData({
        name: campaign.name,
        status: campaign.status,
        startDate: campaign.startDate.split('T')[0],
        endDate: campaign.endDate.split('T')[0],
        budget: campaign.budget.toString(),
        channel: campaign.channel,
        impressions: campaign.impressions,
        clicks: campaign.clicks,
        conversions: campaign.conversions,
        spent: campaign.spent
      });
    }
  }, [campaign]);

  const statusOptions = [
    { value: 'draft', label: 'Draft' },
    { value: 'active', label: 'Active' },
    { value: 'paused', label: 'Paused' },
    { value: 'completed', label: 'Completed' }
  ];

  const channelOptions = [
    { value: 'email', label: 'Email' },
    { value: 'social', label: 'Social Media' },
    { value: 'search', label: 'Search' },
    { value: 'display', label: 'Display' },
    { value: 'video', label: 'Video' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Campaign name is required';
    }

    if (!formData.channel) {
      newErrors.channel = 'Channel is required';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (formData.startDate && formData.endDate && formData.startDate >= formData.endDate) {
      newErrors.endDate = 'End date must be after start date';
    }

    if (!formData.budget || parseFloat(formData.budget) <= 0) {
      newErrors.budget = 'Budget must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const campaignData = {
        ...formData,
        budget: parseFloat(formData.budget),
        startDate: formData.startDate + 'T00:00:00.000Z',
        endDate: formData.endDate + 'T23:59:59.999Z'
      };

      await onSave(campaignData);
    } catch (error) {
      console.error('Failed to save campaign:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {campaign ? 'Edit Campaign' : 'Create New Campaign'}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {campaign ? 'Update your campaign details' : 'Set up a new marketing campaign'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ApperIcon name="X" size={20} className="text-gray-500" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            <div className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Input
                      label="Campaign Name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter campaign name"
                      error={errors.name}
                      required
                    />
                  </div>
                  <FilterDropdown
                    label="Status"
                    options={statusOptions}
                    value={formData.status}
                    onChange={(value) => handleInputChange('status', value)}
                  />
                  <FilterDropdown
                    label="Channel"
                    options={channelOptions}
                    value={formData.channel}
                    onChange={(value) => handleInputChange('channel', value)}
                    placeholder="Select channel"
                  />
                  {errors.channel && (
                    <p className="text-sm text-error mt-1">{errors.channel}</p>
                  )}
                </div>
              </div>

              {/* Schedule */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Schedule</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Start Date"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    error={errors.startDate}
                    required
                  />
                  <Input
                    label="End Date"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                    error={errors.endDate}
                    required
                  />
                </div>
              </div>

              {/* Budget */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Budget</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Total Budget"
                    type="number"
                    value={formData.budget}
                    onChange={(e) => handleInputChange('budget', e.target.value)}
                    placeholder="0.00"
                    error={errors.budget}
                    icon={<ApperIcon name="DollarSign" size={16} />}
                    required
                  />
                  <Input
                    label="Amount Spent"
                    type="number"
                    value={formData.spent}
                    onChange={(e) => handleInputChange('spent', parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    icon={<ApperIcon name="DollarSign" size={16} />}
                    disabled={!campaign}
                  />
                </div>
              </div>

              {/* Performance Metrics (only show for existing campaigns) */}
              {campaign && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Metrics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                      label="Impressions"
                      type="number"
                      value={formData.impressions}
                      onChange={(e) => handleInputChange('impressions', parseInt(e.target.value) || 0)}
                      placeholder="0"
                      icon={<ApperIcon name="Eye" size={16} />}
                    />
                    <Input
                      label="Clicks"
                      type="number"
                      value={formData.clicks}
                      onChange={(e) => handleInputChange('clicks', parseInt(e.target.value) || 0)}
                      placeholder="0"
                      icon={<ApperIcon name="MousePointer" size={16} />}
                    />
                    <Input
                      label="Conversions"
                      type="number"
                      value={formData.conversions}
                      onChange={(e) => handleInputChange('conversions', parseInt(e.target.value) || 0)}
                      placeholder="0"
                      icon={<ApperIcon name="Target" size={16} />}
                    />
                  </div>
                </div>
              )}
            </div>
          </form>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
            <Button
              variant="secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              loading={loading}
              icon={<ApperIcon name={campaign ? "Save" : "Plus"} size={16} />}
            >
              {campaign ? 'Update Campaign' : 'Create Campaign'}
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CampaignModal;