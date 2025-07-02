import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';
import Button from '@/components/atoms/Button';
import SearchBar from '@/components/molecules/SearchBar';
import FilterDropdown from '@/components/molecules/FilterDropdown';
import TemplateCard from '@/components/molecules/TemplateCard';
import TemplateModal from '@/components/organisms/TemplateModal';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import ApperIcon from '@/components/ApperIcon';
import { templateService } from '@/services/api/templateService';

const Templates = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState([]);
  const [filteredTemplates, setFilteredTemplates] = useState([]);
  const [categories, setCategories] = useState([]);
  const [featuredTemplates, setFeaturedTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadTemplates();
  }, []);

  useEffect(() => {
    filterTemplates();
  }, [templates, searchTerm, categoryFilter, difficultyFilter]);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [templatesData, categoriesData, featuredData] = await Promise.all([
        templateService.getAll(),
        templateService.getCategories(),
        templateService.getFeatured()
      ]);
      
      setTemplates(templatesData);
      setCategories(categoriesData);
      setFeaturedTemplates(featuredData);
    } catch (err) {
      setError('Failed to load templates. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filterTemplates = () => {
    let filtered = templates;

    if (searchTerm) {
      filtered = filtered.filter(template =>
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (categoryFilter) {
      filtered = filtered.filter(template => template.category === categoryFilter);
    }

    if (difficultyFilter) {
      filtered = filtered.filter(template => template.difficulty === difficultyFilter);
    }

    setFilteredTemplates(filtered);
  };

  const handlePreviewTemplate = (template) => {
    setSelectedTemplate(template);
    setShowModal(true);
  };

  const handleUseTemplate = async (template) => {
    try {
      const campaignData = await templateService.createCampaignFromTemplate(template.Id);
      
      // Navigate to campaigns page with template data
      navigate('/campaigns', { 
        state: { 
          templateData: campaignData,
          templateName: template.name 
        }
      });
      
      toast.success(`Using template: ${template.name}`);
    } catch (err) {
      toast.error('Failed to create campaign from template');
    }
    setShowModal(false);
  };

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    ...categories.map(category => ({ value: category, label: category }))
  ];

  const difficultyOptions = [
    { value: '', label: 'All Difficulties' },
    { value: 'Beginner', label: 'Beginner' },
    { value: 'Intermediate', label: 'Intermediate' },
    { value: 'Advanced', label: 'Advanced' },
    { value: 'Expert', label: 'Expert' }
  ];

  if (loading) return <Loading type="cards" count={8} />;
  if (error) return <Error message={error} onRetry={loadTemplates} />;

  return (
    <>
      <Helmet>
        <title>Campaign Templates - CampaignHub</title>
        <meta name="description" content="Browse and use pre-designed campaign templates to quickly set up your marketing campaigns with proven strategies and content." />
      </Helmet>

      <div className="space-y-6">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold gradient-text mb-2">
              Campaign Templates
            </h1>
            <p className="text-gray-600">
              Get started quickly with pre-designed campaign templates and proven strategies
            </p>
          </div>
          <div className="flex items-center space-x-3 mt-4 lg:mt-0">
            <Button
              variant="secondary"
              onClick={() => navigate('/campaigns')}
              icon={<ApperIcon name="ArrowLeft" size={16} />}
            >
              Back to Campaigns
            </Button>
            <Button
              variant="primary"
              onClick={() => navigate('/campaigns')}
              icon={<ApperIcon name="Plus" size={16} />}
            >
              Create Custom Campaign
            </Button>
          </div>
        </motion.div>

        {/* Featured Templates */}
        {featuredTemplates.length > 0 && !searchTerm && !categoryFilter && !difficultyFilter && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-card border border-gray-100 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <ApperIcon name="Star" size={20} className="text-yellow-500 mr-2" />
                Featured Templates
              </h2>
              <span className="text-sm text-gray-500">Most popular</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredTemplates.map((template) => (
                <TemplateCard
                  key={template.Id}
                  template={template}
                  onPreview={handlePreviewTemplate}
                  onUseTemplate={handleUseTemplate}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-card border border-gray-100 p-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
            <SearchBar
              placeholder="Search templates..."
              onSearch={setSearchTerm}
            />
            <FilterDropdown
              label="Category"
              options={categoryOptions}
              value={categoryFilter}
              onChange={setCategoryFilter}
            />
            <FilterDropdown
              label="Difficulty"
              options={difficultyOptions}
              value={difficultyFilter}
              onChange={setDifficultyFilter}
            />
          </div>

          {/* Active Filters */}
          {(searchTerm || categoryFilter || difficultyFilter) && (
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
              {categoryFilter && (
                <span className="inline-flex items-center px-2 py-1 bg-primary/10 text-primary text-sm rounded-md">
                  Category: {categoryFilter}
                  <button
                    onClick={() => setCategoryFilter('')}
                    className="ml-1 hover:text-primary/70"
                  >
                    <ApperIcon name="X" size={12} />
                  </button>
                </span>
              )}
              {difficultyFilter && (
                <span className="inline-flex items-center px-2 py-1 bg-primary/10 text-primary text-sm rounded-md">
                  Difficulty: {difficultyFilter}
                  <button
                    onClick={() => setDifficultyFilter('')}
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
                  setCategoryFilter('');
                  setDifficultyFilter('');
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
          transition={{ delay: 0.3 }}
          className="flex items-center justify-between"
        >
          <p className="text-gray-600">
            Showing {filteredTemplates.length} of {templates.length} templates
          </p>
          <div className="text-sm text-gray-500">
            Browse by category or search for specific templates
          </div>
        </motion.div>

        {/* Templates Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {filteredTemplates.length === 0 ? (
            <Empty
              type={searchTerm || categoryFilter || difficultyFilter ? 'search' : 'templates'}
              onAction={searchTerm || categoryFilter || difficultyFilter ? 
                () => {
                  setSearchTerm('');
                  setCategoryFilter('');
                  setDifficultyFilter('');
                } : 
                () => navigate('/campaigns')
              }
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTemplates.map((template, index) => (
                <motion.div
                  key={template.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <TemplateCard
                    template={template}
                    onPreview={handlePreviewTemplate}
                    onUseTemplate={handleUseTemplate}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Template Preview Modal */}
        {showModal && selectedTemplate && (
          <TemplateModal
            template={selectedTemplate}
            onClose={() => setShowModal(false)}
            onUseTemplate={handleUseTemplate}
          />
        )}
      </div>
    </>
  );
};

export default Templates;