import { motion } from 'framer-motion';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';
import ProgressBar from '@/components/atoms/ProgressBar';
import ApperIcon from '@/components/ApperIcon';
import { format } from 'date-fns';

const CampaignCard = ({ campaign, onEdit, onDelete, onViewDetails }) => {
  const getStatusVariant = (status) => {
    const variants = {
      active: 'active',
      paused: 'paused',
      draft: 'draft',
      completed: 'completed'
    };
    return variants[status] || 'default';
  };
  
  const getChannelIcon = (channel) => {
    const icons = {
      email: 'Mail',
      social: 'Share2',
      search: 'Search',
      display: 'Monitor',
      video: 'Video'
    };
    return icons[channel] || 'Target';
  };
  
  const budgetUsed = (campaign.spent / campaign.budget) * 100;
  const ctr = campaign.impressions > 0 ? (campaign.clicks / campaign.impressions * 100).toFixed(2) : 0;
  const cvr = campaign.clicks > 0 ? (campaign.conversions / campaign.clicks * 100).toFixed(2) : 0;
  
  return (
    <Card className="p-6 h-full flex flex-col">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate mb-2">
            {campaign.name}
          </h3>
          <div className="flex items-center space-x-3">
            <Badge variant={getStatusVariant(campaign.status)} size="sm">
              {campaign.status}
            </Badge>
            <div className="flex items-center text-sm text-gray-500">
              <ApperIcon name={getChannelIcon(campaign.channel)} size={14} className="mr-1" />
              <span className="capitalize">{campaign.channel}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2 ml-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(campaign)}
            icon={<ApperIcon name="Edit2" size={14} />}
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(campaign.Id)}
            icon={<ApperIcon name="Trash2" size={14} />}
          />
        </div>
      </div>
      
      <div className="space-y-4 mb-6 flex-1">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500 mb-1">Budget</p>
            <p className="text-lg font-semibold text-gray-900">
              ${campaign.budget.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Spent</p>
            <p className="text-lg font-semibold text-gray-900">
              ${campaign.spent.toLocaleString()}
            </p>
          </div>
        </div>
        
        <ProgressBar
          value={campaign.spent}
          max={campaign.budget}
          label="Budget Usage"
          showValue
          color={budgetUsed > 90 ? 'warning' : budgetUsed > 75 ? 'accent' : 'success'}
        />
        
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-sm text-gray-500">Impressions</p>
            <p className="text-lg font-semibold text-gray-900">
              {campaign.impressions.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">CTR</p>
            <p className="text-lg font-semibold text-gray-900">{ctr}%</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">CVR</p>
            <p className="text-lg font-semibold text-gray-900">{cvr}%</p>
          </div>
        </div>
        
        <div className="text-sm text-gray-500">
          <div className="flex justify-between">
            <span>Start: {format(new Date(campaign.startDate), 'MMM dd, yyyy')}</span>
            <span>End: {format(new Date(campaign.endDate), 'MMM dd, yyyy')}</span>
          </div>
        </div>
      </div>
      
      <Button
        variant="primary"
        onClick={() => onViewDetails(campaign)}
        className="w-full"
      >
        View Details
      </Button>
    </Card>
  );
};

export default CampaignCard;