import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import SearchBar from '@/components/molecules/SearchBar';
import FilterDropdown from '@/components/molecules/FilterDropdown';
import CampaignCard from '@/components/molecules/CampaignCard';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import CampaignModal from '@/components/organisms/CampaignModal';
import ApperIcon from '@/components/ApperIcon';
import { campaignService } from '@/services/api/campaignService';

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [channelFilter, setChannelFilter] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [showModal, setShowModal] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);

  useEffect(() => {
    loadCampaigns();
  }, []);

  useEffect(() => {
    filterCampaigns();
  }, [campaigns, searchTerm, statusFilter, channelFilter]);

  const loadCampaigns = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await campaignService.getAll();
      setCampaigns(data);
    } catch (err) {
      setError('Failed to load campaigns. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filterCampaigns = () => {
    let filtered = campaigns;

    if (searchTerm) {
      filtered = filtered.filter(campaign =>
        campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.channel.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(campaign => campaign.status === statusFilter);
    }

    if (channelFilter) {
      filtered = filtered.filter(campaign => campaign.channel === channelFilter);
    }

    setFilteredCampaigns(filtered);
  };

  const handleCreateCampaign = () => {
    setEditingCampaign(null);
    setShowModal(true);
  };

  const handleEditCampaign = (campaign) => {
    setEditingCampaign(campaign);
    setShowModal(true);
  };

  const handleDeleteCampaign = async (campaignId) => {
    if (window.confirm('Are you sure you want to delete this campaign?')) {
      try {
        await campaignService.delete(campaignId);
        setCampaigns(campaigns.filter(c => c.Id !== campaignId));
        toast.success('Campaign deleted successfully');
      } catch (err) {
        toast.error('Failed to delete campaign');
      }
    }
  };

  const handleViewDetails = (campaign) => {
    // Navigate to campaign details or show details modal
    console.log('View campaign details:', campaign);
    toast.info(`Viewing details for ${campaign.name}`);
  };

  const handleSaveCampaign = async (campaignData) => {
    try {
      if (editingCampaign) {
        const updated = await campaignService.update(editingCampaign.Id, campaignData);
        setCampaigns(campaigns.map(c => c.Id === editingCampaign.Id ? updated : c));
        toast.success('Campaign updated successfully');
      } else {
        const created = await campaignService.create(campaignData);
        setCampaigns([created, ...campaigns]);
        toast.success('Campaign created successfully');
      }
      setShowModal(false);
    } catch (err) {
      toast.error('Failed to save campaign');
    }
  };

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'active', label: 'Active' },
    { value: 'paused', label: 'Paused' },
    { value: 'draft', label: 'Draft' },
    { value: 'completed', label: 'Completed' }
  ];

  const channelOptions = [
    { value: '', label: 'All Channels' },
    { value: 'email', label: 'Email' },
    { value: 'social', label: 'Social Media' },
    { value: 'search', label: 'Search' },
    { value: 'display', label: 'Display' },
    { value: 'video', label: 'Video' }
  ];

  if (loading) return <Loading type="cards" count={6} />;
  if (error) return <Error message={error} onRetry={loadCampaigns} />;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold gradient-text mb-2">
            Marketing Campaigns
          </h1>
          <p className="text-gray-600">
            Manage and track all your marketing campaigns in one place
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <Button
            variant="secondary"
            icon={<ApperIcon name="Download" size={16} />}
          >
            Export
          </Button>
          <Button
            variant="primary"
            onClick={handleCreateCampaign}
            icon={<ApperIcon name="Plus" size={16} />}
          >
            New Campaign
          </Button>
        </div>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-card border border-gray-100 p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 items-end">
          <div className="lg:col-span-2">
            <SearchBar
              placeholder="Search campaigns..."
              onSearch={setSearchTerm}
            />
          </div>
          <FilterDropdown
            label="Status"
            options={statusOptions}
            value={statusFilter}
            onChange={setStatusFilter}
          />
          <FilterDropdown
            label="Channel"
            options={channelOptions}
            value={channelFilter}
            onChange={setChannelFilter}
          />
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              icon={<ApperIcon name="Grid3X3" size={16} />}
            />
            <Button
              variant={viewMode === 'list' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              icon={<ApperIcon name="List" size={16} />}
            />
          </div>
        </div>

        {/* Active Filters */}
        {(searchTerm || statusFilter || channelFilter) && (
          <div className="flex items-center space-x-2 mt-4 pt-4 border-t border-gray-100">
            <span className="text-sm text-gray-500">Active filters:</span>
            {searchTerm && (
              <span className="inline-flex items-center px-2 py-1 bg-primary/10 text-primary text-sm rounded-md">
                Search: {searchTerm}
                <button
                  onClick={() => setSearchTerm('')}
                  className="ml-1 hover:text-primary/70"
                >
                  <ApperIcon name="X" size={12} />
                </button>
              </span>
            )}
            {statusFilter && (
              <span className="inline-flex items-center px-2 py-1 bg-primary/10 text-primary text-sm rounded-md">
                Status: {statusOptions.find(s => s.value === statusFilter)?.label}
                <button
                  onClick={() => setStatusFilter('')}
                  className="ml-1 hover:text-primary/70"
                >
                  <ApperIcon name="X" size={12} />
                </button>
              </span>
            )}
            {channelFilter && (
              <span className="inline-flex items-center px-2 py-1 bg-primary/10 text-primary text-sm rounded-md">
                Channel: {channelOptions.find(c => c.value === channelFilter)?.label}
                <button
                  onClick={() => setChannelFilter('')}
                  className="ml-1 hover:text-primary/70"
                >
                  <ApperIcon name="X" size={12} />
                </button>
              </span>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('');
                setChannelFilter('');
              }}
              className="text-xs"
            >
              Clear All
            </Button>
          </div>
        )}
      </motion.div>

      {/* Results Summary */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex items-center justify-between"
      >
        <p className="text-gray-600">
          Showing {filteredCampaigns.length} of {campaigns.length} campaigns
        </p>
        <div className="text-sm text-gray-500">
          Updated {new Date().toLocaleTimeString()}
        </div>
      </motion.div>

      {/* Campaigns Grid/List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {filteredCampaigns.length === 0 ? (
          <Empty
            type={searchTerm || statusFilter || channelFilter ? 'search' : 'campaigns'}
            onAction={searchTerm || statusFilter || channelFilter ? 
              () => {
                setSearchTerm('');
                setStatusFilter('');
                setChannelFilter('');
              } : 
              handleCreateCampaign
            }
          />
        ) : (
          <div className={
            viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }>
            {filteredCampaigns.map((campaign, index) => (
              <motion.div
                key={campaign.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <CampaignCard
                  campaign={campaign}
                  onEdit={handleEditCampaign}
                  onDelete={handleDeleteCampaign}
                  onViewDetails={handleViewDetails}
                />
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Campaign Modal */}
      {showModal && (
        <CampaignModal
          campaign={editingCampaign}
          onSave={handleSaveCampaign}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default Campaigns;