// src/APIs/TeamAPIs.js
import { ref, onMounted, watch, computed } from "vue";
import axios from "axios";
import { useI18n } from "vue-i18n";

export function useTeamData() {
  const { locale } = useI18n();
  const apiUrl = import.meta.env.VITE_API_URL;
  const teamList = ref([]);
  const loading = ref(false);
  const error = ref(null);

  // Update fallback team members with more realistic data
  const teamMembers = [
    {
      id: 1,
      name: "Aitthisone Duangsompheang",
      position: "CFO",
      description: "Responsible for overall finances",
      facebook: "https://www.facebook.com/itsarkhone",
      whatsapp: "https://api.whatsapp.com/send?phone=8562078866695",
      phone: "https://line.me/ti/p/dVra1dIvXy",
      image: "/assets/img/avatars/t1.jpg"
    },
    {
      id: 2,
      name: "Phengphet Vongphachanh",
      position: "Marketing Director",
      description: "Oversees all marketing strategies",
      facebook: "https://www.facebook.com/phengphetv",
      whatsapp: "https://api.whatsapp.com/send?phone=8562078765432",
      phone: "https://line.me/ti/p/abc1234567",
      image: "/assets/img/avatars/t2.jpg"
    }
  ];

  const fetchTeamData = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.get(`${apiUrl}/api/team`);
      if (response.data && response.data.length > 0) {
        teamList.value = response.data.map((member) => ({
          id: member.id,
          name: member[`name_${locale.value}`],
          position: member[`position_${locale.value}`],
          description: member[`description_${locale.value}`],
          facebook: member.facebook || '',
          whatsapp: member.whatsapp || '',
          phone: member.phone || '',
          image: member.image?.startsWith('/') ? `${apiUrl}${member.image}` : member.image,
          createdAt: member.createdAt,
          updatedAt: member.updatedAt
        }));
      } else {
        teamList.value = teamMembers;
      }
    } catch (err) {
      console.error("Error fetching team data:", err);
      error.value = "Failed to fetch team data.";
      teamList.value = teamMembers;
    } finally {
      loading.value = false;
    }
  };

  // Watch for locale changes
  watch(locale, () => {
    fetchTeamData();
  });

  // Initial fetch
  onMounted(() => {
    fetchTeamData();
  });

  // Add a computed property to get the last description by date
  const lastDescriptionByDate = computed(() => {
    if (!teamList.value.length) return null;
    
    const sortedTeamList = [...teamList.value].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    return sortedTeamList[0]?.description || null;
  });

  return {
    teamList,
    loading,
    error,
    fetchTeamData,
    lastDescriptionByDate
  };
}
