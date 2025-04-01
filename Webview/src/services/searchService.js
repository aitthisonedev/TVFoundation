import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

// Helper function to get all text fields from an object
const getAllTextFields = (obj, prefix = '') => {
  let fields = [];
  if (!obj) return fields;

  const processValue = (value, key) => {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'string') {
      fields.push({ key: fullKey, value });
    } else if (value && typeof value === 'object') {
      if (Array.isArray(value)) {
        // Handle array values
        value.forEach((item, index) => {
          if (typeof item === 'object') {
            fields = fields.concat(getAllTextFields(item, `${fullKey}[${index}]`));
          } else if (typeof item === 'string') {
            fields.push({ key: `${fullKey}[${index}]`, value: item });
          }
        });
      } else {
        // Handle nested objects
        fields = fields.concat(getAllTextFields(value, fullKey));
      }
    }
  };

  // Process all enumerable properties
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      processValue(obj[key], key);
    }
  }

  return fields;
};

// Helper function to normalize text for searching
const normalizeText = (text) => {
  if (!text) return '';
  return text.toString().toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s]/g, " ")
    .trim();
};

const searchInArray = (items, query, type, isEnglish = true) => {
  if (!items || !Array.isArray(items)) return [];
  
  // Split query into words and normalize each
  const searchTerms = query.split(/\s+/).map(term => normalizeText(term));
  console.log('Searching for terms:', searchTerms);
  
  return items.map(item => {
    // Get all searchable text fields from the item
    const allFields = getAllTextFields(item);

    // Create normalized versions of all text for searching
    const searchableTexts = allFields.map(field => ({
      ...field,
      normalized: normalizeText(field.value)
    }));

    // Calculate a match score based on the number of terms matched and position
    let matchScore = 0;
    let exactMatchFound = false;
    let titleMatchFound = false;
    
    const matches = searchableTexts.filter(({ normalized, key }) => {
      const termMatches = searchTerms.filter(term => {
        // Check if this is a title field
        const isTitleField = key.toLowerCase().includes('title') || key.toLowerCase().includes('name');
        
        if (normalized === term) {
          matchScore += isTitleField ? 4 : 2; // Higher score for exact title matches
          exactMatchFound = true;
          if (isTitleField) titleMatchFound = true;
          return true;
        } else if (normalized.includes(term)) {
          matchScore += isTitleField ? 2 : 1; // Higher score for partial title matches
          if (isTitleField) titleMatchFound = true;
          return true;
        } else if (term.includes(normalized)) {
          matchScore += isTitleField ? 1.5 : 0.5;
          return true;
        }
        return false;
      });
      return termMatches.length > 0;
    });

    // Store matches and create excerpts
    item.matches = matches.map(match => {
      const searchTerm = searchTerms.find(term => 
        normalizeText(match.value).includes(term) || term.includes(normalizeText(match.value))
      );
      return {
        field: match.key,
        value: match.value,
        searchTerm,
        excerpt: createExcerpt(match.value, searchTerm)
      };
    });

    // Add match metadata to the item
    item.matchScore = matchScore;
    item.exactMatchFound = exactMatchFound;
    item.titleMatchFound = titleMatchFound;

    return item;
  }).filter(item => {
    // Set a minimum score threshold
    const MIN_SCORE_THRESHOLD = 1;
    return item.matchScore >= MIN_SCORE_THRESHOLD;
  }).sort((a, b) => {
    // Primary sort: exact title matches first
    if (a.titleMatchFound && !b.titleMatchFound) return -1;
    if (!a.titleMatchFound && b.titleMatchFound) return 1;
    
    // Secondary sort: exact matches
    if (a.exactMatchFound && !b.exactMatchFound) return -1;
    if (!a.exactMatchFound && b.exactMatchFound) return 1;
    
    // Tertiary sort: match score
    if (a.matchScore !== b.matchScore) {
      return b.matchScore - a.matchScore;
    }
    
    // Final sort: alphabetical by title
    const titleA = (isEnglish ? (a.name_en || a.title_en) : (a.name_lo || a.title_lo)) || '';
    const titleB = (isEnglish ? (b.name_en || b.title_en) : (b.name_lo || b.title_lo)) || '';
    return titleA.localeCompare(titleB);
  }).slice(0, 10) // Limit to top 10 matches
  .map(item => {
    // Prepare the display data
    const getBestFields = () => {
      const titleFields = ['name_en', 'title_en', 'name_lo', 'title_lo'].filter(f => item[f]);
      const descFields = ['description_en', 'description_lo', 'content_en', 'content_lo'].filter(f => item[f]);
      
      const title = isEnglish 
        ? (item.name_en || item.title_en || item.name_lo || item.title_lo)
        : (item.name_lo || item.title_lo || item.name_en || item.title_en);
        
      const description = isEnglish
        ? (item.description_en || item.content_en || item.description_lo || item.content_lo)
        : (item.description_lo || item.content_lo || item.description_en || item.content_en);

      return { title, description };
    };

    const { title, description } = getBestFields();

    const result = {
      ...item,
      type,
      title,
      description,
      matches: item.matches,
      highlights: item.matches.map(match => ({
        field: match.field,
        text: match.excerpt || match.value,
        searchTerm: match.searchTerm
      })),
      link: getItemLink(item, type)
    };

    return result;
  });
};

// Helper function to create an excerpt around the matched text
const createExcerpt = (text, searchTerm, contextLength = 50) => {
  if (!text || !searchTerm) return text;
  
  const normalizedText = text.toLowerCase();
  const index = normalizedText.indexOf(searchTerm.toLowerCase());
  
  if (index === -1) return text;
  
  const start = Math.max(0, index - contextLength);
  const end = Math.min(text.length, index + searchTerm.length + contextLength);
  
  let excerpt = text.slice(start, end);
  
  if (start > 0) excerpt = '...' + excerpt;
  if (end < text.length) excerpt = excerpt + '...';
  
  return excerpt;
};

// Helper function to get the correct link for each item type
const getItemLink = (item, type) => {
  switch (type) {
    case 'news':
      return { name: 'NewsCardDetail', params: { id: item.news_id || item.id } };
    case 'projects':
      return { name: 'ProjectDetail', params: { id: item.project_id || item.id } };
    case 'products':
      return { name: 'ProductDetail', params: { id: item.product_id || item.id } };
    case 'attractions':
      return { name: 'TouristDetail', params: { id: item.attraction_id || item.id } };
    case 'team':
    case 'coreValues':
      return { name: 'AboutUs' };
    default:
      return { name: 'Home' };
  }
};

export const searchData = async (query, isEnglish = true) => {
  if (!query?.trim()) return {};

  try {
    console.log('Starting search with query:', query);
    
    // Define all API endpoints to search
    const endpoints = [
      { path: '/api/products', type: 'products' },
      { path: '/api/news', type: 'news' },
      { path: '/api/projects', type: 'projects' },
      { path: '/api/tourist-attractions', type: 'attractions' },
      { path: '/api/team', type: 'team' },
      { path: '/api/content-ones', type: 'contentOne' },
      { path: '/api/content-twos', type: 'contentTwo' },
      { path: '/api/content-threes', type: 'contentThree' },
      { path: '/api/performances', type: 'performance' },
      { path: '/api/core-values', type: 'coreValues' },
      { path: '/api/about', type: 'about' },
      { path: '/api/supportcompanies', type: 'supporters' },
      { path: '/api/head-contents', type: 'headContent' },
      { path: '/api/impact', type: 'impact' },
      { path: '/api/vision-mission', type: 'visionMission' },
      { path: '/api/bank-accounts', type: 'bankAccounts' },
      { path: '/api/product-categories', type: 'productCategories' },
      { path: '/api/tourist-attraction-categories', type: 'attractionCategories' },
      { path: '/api/news-categories', type: 'newsCategories' },
      { path: '/api/project-status', type: 'projectStatus' },
      { path: '/api/sliders-home', type: 'homeSliders' },
      { path: '/api/sliders-news', type: 'newsSliders' },
      { path: '/api/sliders-project', type: 'projectSliders' },
      { path: '/api/sliders-support', type: 'supportSliders' },
      { path: '/api/product-slides', type: 'productSlides' },
      { path: '/api/product-ads', type: 'productAds' },
      { path: '/api/tourist-attraction-slides', type: 'attractionSlides' },
      { path: '/api/tourist-attraction-ads', type: 'attractionAds' }
    ];

    const responses = await Promise.all(
      endpoints.map(async endpoint => {
        try {
          console.log(`Fetching data from ${endpoint.path}`);
          const response = await axios.get(`${apiUrl}${endpoint.path}`);
          console.log(`Received ${response.data?.length || 0} items from ${endpoint.type}`);
          return { type: endpoint.type, data: response.data || [] };
        } catch (error) {
          console.error(`Error fetching ${endpoint.type}:`, error.message);
          return { type: endpoint.type, data: [] };
        }
      })
    );

    const results = responses.reduce((acc, { type, data }) => {
      const searchResults = searchInArray(data, query, type, isEnglish);
      console.log(`Found ${searchResults.length} matches in ${type}`);
      acc[type] = searchResults;
      return acc;
    }, {});

    const totalResults = Object.values(results).reduce((sum, arr) => sum + arr.length, 0);
    console.log(`Total results found: ${totalResults}`);

    return results;
  } catch (error) {
    console.error('Error in searchData:', error);
    return {
      news: [],
      projects: [],
      products: [],
      attractions: [],
      team: [],
      contentOne: [],
      contentTwo: [],
      contentThree: [],
      performance: [],
      coreValues: [],
      about: [],
      supporters: [],
      headContent: [],
      impact: [],
      visionMission: [],
      bankAccounts: [],
      productCategories: [],
      attractionCategories: [],
      newsCategories: [],
      projectStatus: [],
      homeSliders: [],
      newsSliders: [],
      projectSliders: [],
      supportSliders: [],
      productSlides: [],
      productAds: [],
      attractionSlides: [],
      attractionAds: []
    };
  }
}; 