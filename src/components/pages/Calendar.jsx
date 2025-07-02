import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, parseISO } from 'date-fns';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import ApperIcon from '@/components/ApperIcon';
import { campaignService } from '@/services/api/campaignService';

const Calendar = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month'); // month, week

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await campaignService.getAll();
      setCampaigns(data);
    } catch (err) {
      setError('Failed to load calendar data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getCampaignsForDate = (date) => {
    return campaigns.filter(campaign => {
      const startDate = parseISO(campaign.startDate);
      const endDate = parseISO(campaign.endDate);
      return date >= startDate && date <= endDate;
    });
  };

  const getCalendarDays = () => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    return eachDayOfInterval({ start, end });
  };

  const navigateMonth = (direction) => {
    setCurrentDate(direction === 'prev' ? subMonths(currentDate, 1) : addMonths(currentDate, 1));
  };

  const getDayEvents = (day) => {
    const dayCampaigns = getCampaignsForDate(day);
    const events = [];

    dayCampaigns.forEach(campaign => {
      const startDate = parseISO(campaign.startDate);
      const endDate = parseISO(campaign.endDate);
      
      if (isSameDay(day, startDate)) {
        events.push({ type: 'start', campaign, label: 'Starts' });
      }
      if (isSameDay(day, endDate)) {
        events.push({ type: 'end', campaign, label: 'Ends' });
      }
      if (day > startDate && day < endDate) {
        events.push({ type: 'ongoing', campaign, label: 'Ongoing' });
      }
    });

    return events;
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-success text-white',
      paused: 'bg-warning text-white',
      draft: 'bg-gray-400 text-white',
      completed: 'bg-primary text-white'
    };
    return colors[status] || 'bg-gray-400 text-white';
  };

  if (loading) return <Loading type="chart" />;
  if (error) return <Error message={error} onRetry={loadCampaigns} />;

  const calendarDays = getCalendarDays();
  const selectedDateCampaigns = getCampaignsForDate(selectedDate);

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
            Campaign Calendar
          </h1>
          <p className="text-gray-600">
            View and manage your campaign schedules and timelines
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <Button
            variant="secondary"
            icon={<ApperIcon name="Download" size={16} />}
          >
            Export Schedule
          </Button>
          <Button
            variant="primary"
            icon={<ApperIcon name="Plus" size={16} />}
          >
            Add Event
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Calendar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="xl:col-span-3"
        >
          <Card className="p-6">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  {format(currentDate, 'MMMM yyyy')}
                </h2>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigateMonth('prev')}
                    icon={<ApperIcon name="ChevronLeft" size={16} />}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentDate(new Date())}
                  >
                    Today
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigateMonth('next')}
                    icon={<ApperIcon name="ChevronRight" size={16} />}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === 'month' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('month')}
                >
                  Month
                </Button>
                <Button
                  variant={viewMode === 'week' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('week')}
                >
                  Week
                </Button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {/* Day Headers */}
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="p-3 text-center font-medium text-gray-500 border-b border-gray-100">
                  {day}
                </div>
              ))}

              {/* Calendar Days */}
              {calendarDays.map(day => {
                const dayEvents = getDayEvents(day);
                const isSelected = isSameDay(day, selectedDate);
                const isToday = isSameDay(day, new Date());

                return (
                  <motion.div
                    key={day.toISOString()}
                    className={`
                      min-h-24 p-2 border border-gray-100 cursor-pointer transition-all duration-200
                      ${isSelected ? 'bg-primary/10 border-primary' : 'hover:bg-gray-50'}
                      ${isToday ? 'bg-accent/5 border-accent/30' : ''}
                    `}
                    onClick={() => setSelectedDate(day)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className={`
                      text-sm font-medium mb-1
                      ${!isSameMonth(day, currentDate) ? 'text-gray-400' : 'text-gray-900'}
                      ${isToday ? 'text-accent font-bold' : ''}
                    `}>
                      {format(day, 'd')}
                    </div>
                    
                    <div className="space-y-1">
                      {dayEvents.slice(0, 2).map((event, index) => (
                        <div
                          key={index}
                          className={`
                            text-xs px-1 py-0.5 rounded truncate
                            ${getStatusColor(event.campaign.status)}
                          `}
                          title={`${event.campaign.name} - ${event.label}`}
                        >
                          {event.campaign.name}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <div className="text-xs text-gray-500 px-1">
                          +{dayEvents.length - 2} more
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </Card>
        </motion.div>

        {/* Selected Date Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                {format(selectedDate, 'MMM dd, yyyy')}
              </h3>
              {isSameDay(selectedDate, new Date()) && (
                <Badge variant="accent" size="sm">Today</Badge>
              )}
            </div>

            {selectedDateCampaigns.length === 0 ? (
              <Empty
                type="calendar"
                title="No events today"
                description="No campaigns are scheduled for this date."
              />
            ) : (
              <div className="space-y-4">
                {selectedDateCampaigns.map(campaign => {
                  const startDate = parseISO(campaign.startDate);
                  const endDate = parseISO(campaign.endDate);
                  const events = [];
                  
                  if (isSameDay(selectedDate, startDate)) events.push('Starts');
                  if (isSameDay(selectedDate, endDate)) events.push('Ends');
                  if (selectedDate > startDate && selectedDate < endDate) events.push('Ongoing');

                  return (
                    <motion.div
                      key={campaign.Id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-900 truncate">
                          {campaign.name}
                        </h4>
                        <Badge 
                          variant={campaign.status === 'active' ? 'success' : 'warning'} 
                          size="sm"
                        >
                          {campaign.status}
                        </Badge>
                      </div>
                      
                      <div className="text-sm text-gray-600 space-y-1">
                        <div className="flex items-center">
                          <ApperIcon name="Calendar" size={14} className="mr-1" />
                          <span>{events.join(', ')}</span>
                        </div>
                        <div className="flex items-center">
                          <ApperIcon name="Target" size={14} className="mr-1" />
                          <span className="capitalize">{campaign.channel}</span>
                        </div>
                        <div className="flex items-center">
                          <ApperIcon name="DollarSign" size={14} className="mr-1" />
                          <span>${campaign.budget.toLocaleString()}</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </Card>
        </motion.div>
      </div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <Card className="p-6 text-center" gradient>
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl mb-4">
            <ApperIcon name="Calendar" size={24} className="text-primary" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {campaigns.filter(c => c.status === 'active').length}
          </h3>
          <p className="text-gray-600">Active Campaigns</p>
        </Card>

        <Card className="p-6 text-center" gradient>
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-success/10 to-emerald-600/10 rounded-xl mb-4">
            <ApperIcon name="PlayCircle" size={24} className="text-success" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {campaigns.filter(c => {
              const startDate = parseISO(c.startDate);
              return isSameDay(startDate, new Date());
            }).length}
          </h3>
          <p className="text-gray-600">Starting Today</p>
        </Card>

        <Card className="p-6 text-center" gradient>
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-warning/10 to-yellow-500/10 rounded-xl mb-4">
            <ApperIcon name="StopCircle" size={24} className="text-warning" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {campaigns.filter(c => {
              const endDate = parseISO(c.endDate);
              return isSameDay(endDate, new Date());
            }).length}
          </h3>
          <p className="text-gray-600">Ending Today</p>
        </Card>

        <Card className="p-6 text-center" gradient>
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-accent/10 to-yellow-500/10 rounded-xl mb-4">
            <ApperIcon name="Clock" size={24} className="text-accent" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {campaigns.filter(c => c.status === 'draft').length}
          </h3>
          <p className="text-gray-600">Scheduled</p>
        </Card>
      </motion.div>
    </div>
  );
};

export default Calendar;