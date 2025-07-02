import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import FilterDropdown from '@/components/molecules/FilterDropdown';
import MetricCard from '@/components/molecules/MetricCard';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import ApperIcon from '@/components/ApperIcon';
import { campaignService } from '@/services/api/campaignService';
import Chart from 'react-apexcharts';

const Analytics = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dateRange, setDateRange] = useState('7d');
  const [channelFilter, setChannelFilter] = useState('');
  const [selectedMetric, setSelectedMetric] = useState('impressions');

  useEffect(() => {
    loadAnalytics();
  }, [dateRange, channelFilter]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await campaignService.getAll();
      setCampaigns(data);
    } catch (err) {
      setError('Failed to load analytics data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading type="chart" />;
  if (error) return <Error message={error} onRetry={loadAnalytics} />;

  // Filter campaigns based on filters
  const filteredCampaigns = channelFilter 
    ? campaigns.filter(c => c.channel === channelFilter)
    : campaigns;

  // Calculate metrics
  const totalImpressions = filteredCampaigns.reduce((sum, c) => sum + c.impressions, 0);
  const totalClicks = filteredCampaigns.reduce((sum, c) => sum + c.clicks, 0);
  const totalConversions = filteredCampaigns.reduce((sum, c) => sum + c.conversions, 0);
  const totalSpent = filteredCampaigns.reduce((sum, c) => sum + c.spent, 0);
  
  const ctr = totalImpressions > 0 ? (totalClicks / totalImpressions * 100) : 0;
  const cvr = totalClicks > 0 ? (totalConversions / totalClicks * 100) : 0;
  const cpc = totalClicks > 0 ? (totalSpent / totalClicks) : 0;
  const roas = totalSpent > 0 ? (totalConversions * 50 / totalSpent) : 0;

  // Chart configurations
  const performanceChartOptions = {
    chart: {
      type: 'area',
      height: 350,
      toolbar: { show: false },
      fontFamily: 'Inter, sans-serif'
    },
    colors: ['#5B21B6', '#8B5CF6', '#F59E0B', '#10B981'],
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.3,
        opacityTo: 0.1,
      }
    },
    stroke: {
      curve: 'smooth',
      width: 2
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

  const performanceChartSeries = [
    {
      name: 'Impressions',
      data: [28000, 31000, 35000, 32000, 38000, 42000, 45000]
    },
    {
      name: 'Clicks',
      data: [1120, 1240, 1400, 1280, 1520, 1680, 1800]
    },
    {
      name: 'Conversions',
      data: [56, 62, 70, 64, 76, 84, 90]
    }
  ];

  const channelChartOptions = {
    chart: {
      type: 'donut',
      height: 300,
      fontFamily: 'Inter, sans-serif'
    },
    colors: ['#5B21B6', '#8B5CF6', '#F59E0B', '#10B981', '#EF4444'],
    labels: ['Email', 'Social', 'Search', 'Display', 'Video'],
    legend: {
      position: 'bottom'
    },
    plotOptions: {
      pie: {
        donut: {
          size: '70%'
        }
      }
    },
    tooltip: {
      theme: 'light'
    }
  };

  const channelData = [35, 25, 20, 15, 5]; // Sample data

  const campaignPerformanceOptions = {
    chart: {
      type: 'bar',
      height: 300,
      toolbar: { show: false },
      fontFamily: 'Inter, sans-serif'
    },
    colors: ['#5B21B6'],
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: true,
        dataLabels: {
          position: 'top'
        }
      }
    },
    dataLabels: {
      enabled: true,
      offsetX: -6,
      style: {
        fontSize: '12px',
        colors: ['#fff']
      }
    },
    xaxis: {
      categories: filteredCampaigns.slice(0, 5).map(c => c.name),
      labels: {
        style: { colors: '#6b7280', fontSize: '12px' }
      }
    },
    yaxis: {
      labels: {
        style: { colors: '#6b7280', fontSize: '12px' }
      }
    },
    grid: {
      borderColor: '#e5e7eb'
    },
    tooltip: {
      theme: 'light'
    }
  };

  const campaignPerformanceData = [{
    name: 'Conversions',
    data: filteredCampaigns.slice(0, 5).map(c => c.conversions)
  }];

  const dateRangeOptions = [
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' },
    { value: '1y', label: 'Last Year' }
  ];

  const channelOptions = [
    { value: '', label: 'All Channels' },
    { value: 'email', label: 'Email' },
    { value: 'social', label: 'Social Media' },
    { value: 'search', label: 'Search' },
    { value: 'display', label: 'Display' },
    { value: 'video', label: 'Video' }
  ];

  if (filteredCampaigns.length === 0) {
    return (
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold gradient-text mb-2">
              Campaign Analytics
            </h1>
            <p className="text-gray-600">
              Deep insights into your campaign performance and ROI
            </p>
          </div>
        </motion.div>
        <Empty 
          type="analytics"
          onAction={() => window.location.href = '/campaigns'}
        />
      </div>
    );
  }

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
            Campaign Analytics
          </h1>
          <p className="text-gray-600">
            Deep insights into your campaign performance and ROI
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <Button
            variant="secondary"
            icon={<ApperIcon name="Download" size={16} />}
          >
            Export Report
          </Button>
          <Button
            variant="primary"
            icon={<ApperIcon name="Share" size={16} />}
          >
            Share Report
          </Button>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-card border border-gray-100 p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FilterDropdown
            label="Date Range"
            options={dateRangeOptions}
            value={dateRange}
            onChange={setDateRange}
          />
          <FilterDropdown
            label="Channel"
            options={channelOptions}
            value={channelFilter}
            onChange={setChannelFilter}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quick Actions
            </label>
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm">Compare</Button>
              <Button variant="ghost" size="sm">Schedule</Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <MetricCard
          title="Click-through Rate"
          value={ctr.toFixed(2)}
          change={12.5}
          changeType="positive"
          icon="MousePointer"
          color="primary"
          format="percentage"
        />
        <MetricCard
          title="Conversion Rate"
          value={cvr.toFixed(2)}
          change={-2.3}
          changeType="negative"
          icon="Target"
          color="accent"
          format="percentage"
        />
        <MetricCard
          title="Cost Per Click"
          value={cpc.toFixed(2)}
          change={8.1}
          changeType="negative"
          icon="DollarSign"
          color="warning"
          format="currency"
        />
        <MetricCard
          title="Return on Ad Spend"
          value={roas.toFixed(2)}
          change={18.7}
          changeType="positive"
          icon="TrendingUp"
          color="success"
        />
      </motion.div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Performance Trend */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Performance Trend
              </h3>
              <div className="flex items-center space-x-2">
                <Button
                  variant={selectedMetric === 'impressions' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setSelectedMetric('impressions')}
                >
                  Impressions
                </Button>
                <Button
                  variant={selectedMetric === 'clicks' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setSelectedMetric('clicks')}
                >
                  Clicks
                </Button>
              </div>
            </div>
            <Chart
              options={performanceChartOptions}
              series={performanceChartSeries}
              type="area"
              height={350}
            />
          </Card>
        </motion.div>

        {/* Channel Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Channel Distribution
              </h3>
              <Button variant="ghost" size="sm">
                <ApperIcon name="MoreHorizontal" size={16} />
              </Button>
            </div>
            <Chart
              options={channelChartOptions}
              series={channelData}
              type="donut"
              height={300}
            />
          </Card>
        </motion.div>
      </div>

      {/* Campaign Performance Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Top Performing Campaigns
            </h3>
            <Button variant="ghost" size="sm">View All</Button>
          </div>
          <Chart
            options={campaignPerformanceOptions}
            series={campaignPerformanceData}
            type="bar"
            height={300}
          />
        </Card>
      </motion.div>

      {/* Detailed Metrics Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Campaign Details
            </h3>
            <Button
              variant="secondary"
              icon={<ApperIcon name="Download" size={16} />}
              size="sm"
            >
              Export CSV
            </Button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Campaign</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Channel</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">Impressions</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">Clicks</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">CTR</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">Conversions</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">Spent</th>
                </tr>
              </thead>
              <tbody>
                {filteredCampaigns.map((campaign, index) => {
                  const campaignCtr = campaign.impressions > 0 ? (campaign.clicks / campaign.impressions * 100).toFixed(2) : '0.00';
                  
                  return (
                    <motion.tr
                      key={campaign.Id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-4 px-4">
                        <div className="font-medium text-gray-900">{campaign.name}</div>
                        <div className="text-sm text-gray-500 capitalize">{campaign.status}</div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="capitalize text-gray-700">{campaign.channel}</span>
                      </td>
                      <td className="py-4 px-4 text-right font-medium">
                        {campaign.impressions.toLocaleString()}
                      </td>
                      <td className="py-4 px-4 text-right font-medium">
                        {campaign.clicks.toLocaleString()}
                      </td>
                      <td className="py-4 px-4 text-right font-medium">
                        {campaignCtr}%
                      </td>
                      <td className="py-4 px-4 text-right font-medium">
                        {campaign.conversions.toLocaleString()}
                      </td>
                      <td className="py-4 px-4 text-right font-medium">
                        ${campaign.spent.toLocaleString()}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Analytics;