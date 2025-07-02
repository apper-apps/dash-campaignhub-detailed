import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import MetricCard from '@/components/molecules/MetricCard';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import ApperIcon from '@/components/ApperIcon';
import { campaignService } from '@/services/api/campaignService';
import Chart from 'react-apexcharts';

const Dashboard = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await campaignService.getAll();
      setCampaigns(data);
    } catch (err) {
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading type="metrics" />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;

  // Calculate metrics
  const totalBudget = campaigns.reduce((sum, c) => sum + c.budget, 0);
  const totalSpent = campaigns.reduce((sum, c) => sum + c.spent, 0);
  const totalImpressions = campaigns.reduce((sum, c) => sum + c.impressions, 0);
  const totalClicks = campaigns.reduce((sum, c) => sum + c.clicks, 0);
  const totalConversions = campaigns.reduce((sum, c) => sum + c.conversions, 0);
  
  const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
  const ctr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100) : 0;
  const cvr = totalClicks > 0 ? ((totalConversions / totalClicks) * 100) : 0;
  const roas = totalSpent > 0 ? (totalConversions * 50 / totalSpent) : 0; // Assuming $50 per conversion

  const recentCampaigns = campaigns.slice(0, 5);

  // Chart data
  const chartOptions = {
    chart: {
      type: 'line',
      height: 300,
      toolbar: { show: false },
      fontFamily: 'Inter, sans-serif'
    },
    colors: ['#5B21B6', '#8B5CF6', '#F59E0B'],
    stroke: {
      curve: 'smooth',
      width: 3
    },
    grid: {
      borderColor: '#e5e7eb',
      strokeDashArray: 3
    },
    xaxis: {
      categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      labels: {
        style: { colors: '#6b7280', fontSize: '12px' }
      }
    },
    yaxis: {
      labels: {
        style: { colors: '#6b7280', fontSize: '12px' }
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right'
    },
    tooltip: {
      theme: 'light'
    }
  };

  const chartSeries = [
    {
      name: 'Impressions',
      data: [12000, 15000, 18000, 16000, 22000, 25000, 28000]
    },
    {
      name: 'Clicks',
      data: [480, 600, 720, 640, 880, 1000, 1120]
    },
    {
      name: 'Conversions',
      data: [24, 30, 36, 32, 44, 50, 56]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold gradient-text mb-2">
            Campaign Dashboard
          </h1>
          <p className="text-gray-600">
            Monitor your marketing campaign performance and metrics
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <Button
            variant="secondary"
            icon={<ApperIcon name="Download" size={16} />}
          >
            Export Report
          </Button>
          <Button
            variant="primary"
            icon={<ApperIcon name="Plus" size={16} />}
          >
            New Campaign
          </Button>
        </div>
      </motion.div>

      {/* Metrics Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <MetricCard
          title="Active Campaigns"
          value={activeCampaigns}
          change={12}
          changeType="positive"
          icon="Target"
          color="primary"
        />
        <MetricCard
          title="Total Budget"
          value={totalBudget}
          change={8}
          changeType="positive"
          icon="DollarSign"
          color="success"
          format="currency"
        />
        <MetricCard
          title="Click-through Rate"
          value={ctr.toFixed(2)}
          change={-2.1}
          changeType="negative"
          icon="MousePointer"
          color="accent"
          format="percentage"
        />
        <MetricCard
          title="ROAS"
          value={roas.toFixed(2)}
          change={15.3}
          changeType="positive"
          icon="TrendingUp"
          color="secondary"
        />
      </motion.div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Performance Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="xl:col-span-2"
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Performance Overview
              </h3>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">Last 7 days</Button>
                <ApperIcon name="MoreHorizontal" size={20} className="text-gray-400" />
              </div>
            </div>
            <Chart
              options={chartOptions}
              series={chartSeries}
              type="line"
              height={300}
            />
          </Card>
        </motion.div>

        {/* Recent Campaigns */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 h-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Recent Campaigns
              </h3>
              <Button variant="ghost" size="sm">View All</Button>
            </div>
            
            {recentCampaigns.length === 0 ? (
              <Empty 
                type="campaigns"
                title="No campaigns yet"
                description="Create your first campaign to get started"
              />
            ) : (
              <div className="space-y-4">
                {recentCampaigns.map((campaign, index) => (
                  <motion.div
                    key={campaign.Id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {campaign.name}
                      </p>
                      <div className="flex items-center mt-1">
                        <Badge 
                          variant={campaign.status === 'active' ? 'success' : 'warning'} 
                          size="sm"
                        >
                          {campaign.status}
                        </Badge>
                        <span className="text-sm text-gray-500 ml-2">
                          {campaign.channel}
                        </span>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-sm font-medium text-gray-900">
                        ${campaign.spent.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        of ${campaign.budget.toLocaleString()}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </Card>
        </motion.div>
      </div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <Card className="p-6 text-center" gradient>
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl mb-4">
            <ApperIcon name="Eye" size={24} className="text-primary" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {totalImpressions.toLocaleString()}
          </h3>
          <p className="text-gray-600">Total Impressions</p>
        </Card>

        <Card className="p-6 text-center" gradient>
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-accent/10 to-yellow-500/10 rounded-xl mb-4">
            <ApperIcon name="MousePointer" size={24} className="text-accent" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {totalClicks.toLocaleString()}
          </h3>
          <p className="text-gray-600">Total Clicks</p>
        </Card>

        <Card className="p-6 text-center" gradient>
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-success/10 to-emerald-600/10 rounded-xl mb-4">
            <ApperIcon name="Target" size={24} className="text-success" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {totalConversions.toLocaleString()}
          </h3>
          <p className="text-gray-600">Conversions</p>
        </Card>
      </motion.div>
    </div>
  );
};

export default Dashboard;