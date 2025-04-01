import { ref, onMounted, watch } from "vue";
import axios from "axios";
import { useI18n } from "vue-i18n";
import { projects as defaultProjects } from "../data/projects.js";

export function useProjects() {
  const { locale } = useI18n();
  const apiUrl = import.meta.env.VITE_API_URL;
  const projects = ref([]);
  const projectStatuses = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const logImagePath = (path) => {
    if (!path) return '/images/default-project-image.jpg';
    
    // Remove any leading slashes
    const cleanPath = path.replace(/^\/+/, '');
    
    // Construct the full URL using /ImageUpload path
    const fullPath = `${apiUrl}/ImageUpload/${cleanPath}`;
    return fullPath;
  };

  const calculateDaysLeft = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    
    if (today > end) return 0;
    
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Fetch all projects
  const fetchProjects = async () => {
    try {
      loading.value = true;
      error.value = null;

      const [projectsResponse, statusesResponse] = await Promise.all([
        axios.get(`${apiUrl}/api/projects`),
        axios.get(`${apiUrl}/api/project-status`)
      ]);

      if (projectsResponse.data && projectsResponse.data.length > 0) {
        // Map status to each project and handle i18n
        projects.value = projectsResponse.data.map(project => {
          const status = statusesResponse.data.find(s => s.id === project.status_id) || {
            id: 1,
            status_name_en: 'On Process',
            status_name_lo: 'ກຳລັງດຳເນີນການ',
            name: 'On Process'
          };
          

          const fullCoverImage = logImagePath(project.coverImage);
          const fullImages = project.subImages && Array.isArray(project.subImages)
            ? project.subImages.map(img => logImagePath(img))
            : [];


          const daysLeft = calculateDaysLeft(project.start_date, project.end_date);
          
          // Keep original API status
          const apiStatus = {
            id: status.id,
            name: locale.value === 'en' ? status.status_name_en : status.status_name_lo,
            originalName: status.status_name_en
          };

          return {
            ...project,
            id: project.project_id,
            title: locale.value === 'en' ? project.title_en : project.title_lo,
            description: locale.value === 'en' ? project.description_en : project.description_lo,
            content: locale.value === 'en' ? project.content_en : project.content_lo,
            location: locale.value === 'en' ? project.location_en : project.location_lo,
            coverImage: fullCoverImage,
            images: fullImages,
            status: apiStatus,
            daysLeft,
            supporters: project.supporters || 0,
            currentAmount: project.currentAmount || 0,
            targetAmount: project.targetAmount || 0,
            raw: {
              title_en: project.title_en,
              title_lo: project.title_lo,
              description_en: project.description_en,
              description_lo: project.description_lo,
              content_en: project.content_en,
              content_lo: project.content_lo,
              location_en: project.location_en,
              location_lo: project.location_lo
            }
          };
        }).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      }

      if (statusesResponse.data) {
        projectStatuses.value = statusesResponse.data;
      }
    } catch (err) {
      console.error("Error fetching projects:", err);
      error.value = "Failed to fetch projects.";
    } finally {
      loading.value = false;
    }
  };

  // Get project by ID
  const getProjectById = async (id) => {
    try {
      loading.value = true;
      error.value = null;
      
      const [projectResponse, statusesResponse] = await Promise.all([
        axios.get(`${apiUrl}/api/projects/getById/${id}`),
        axios.get(`${apiUrl}/api/project-status`)
      ]);

      if (!projectResponse.data) {
        console.error('No project data received');
        return null;
      }

      console.log('Raw project data:', {
        coverImage: projectResponse.data.coverImage,
        subImages: projectResponse.data.subImages,
        apiUrl: apiUrl
      });

      const status = statusesResponse.data.find(s => s.id === projectResponse.data.status_id) || {
        id: 1,
        status_name_en: 'Open',
        status_name_lo: 'ເປີດ'
      };

      // Add console.log to debug image paths
      console.log('Project coverImage:', projectResponse.data.coverImage);
      console.log('Project subImages:', projectResponse.data.subImages);
      
      const fullCoverImage = logImagePath(projectResponse.data.coverImage);
      const fullImages = projectResponse.data.subImages && Array.isArray(projectResponse.data.subImages)
        ? projectResponse.data.subImages.map(img => logImagePath(img))
        : [];

      // Log processed image paths
      console.log('Processed image paths:', {
        fullCoverImage,
        fullImages
      });

      const processedProject = {
        ...projectResponse.data,
        id: projectResponse.data.project_id,
        title: locale.value === 'en' ? projectResponse.data.title_en : projectResponse.data.title_lo,
        description: locale.value === 'en' ? projectResponse.data.description_en : projectResponse.data.description_lo,
        content: locale.value === 'en' ? projectResponse.data.content_en : projectResponse.data.content_lo,
        location: locale.value === 'en' ? projectResponse.data.location_en : projectResponse.data.location_lo,
        coverImage: fullCoverImage,
        images: fullImages,
        status: {
          id: status.id,
          name: locale.value === 'en' ? status.status_name_en : status.status_name_lo
        },
        daysLeft: calculateDaysLeft(projectResponse.data.start_date, projectResponse.data.end_date),
        supporters: projectResponse.data.supporters || 0,
        currentAmount: projectResponse.data.currentAmount || 0,
        targetAmount: projectResponse.data.targetAmount || 0
      };

      console.log('Processed project data:', processedProject);
      return processedProject;

    } catch (err) {
      console.error('Error in getProjectById:', err);
      return null;
    } finally {
      loading.value = false;
    }
  };

  // Watch for locale changes
  watch(locale, () => {
    fetchProjects();
  });

  // Utility functions
  const formatCurrency = (amount) => {
    if (!amount) return '0';
    return new Intl.NumberFormat('en-US').format(amount);
  };

  const calculateProgress = (current, target) => {
    if (!target || target === 0) return 0;
    return Math.min(Math.round((current / target) * 100), 100);
  };

  // Initialize data
  onMounted(() => {
    fetchProjects();
  });

  return {
    projects,
    projectStatuses,
    loading,
    error,
    fetchProjects,
    getProjectById,
    formatCurrency,
    calculateProgress
  };
}
