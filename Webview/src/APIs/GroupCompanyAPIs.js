import { ref, onMounted } from "vue";
import axios from "axios";



export const useGroupCompany = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const groupCompanyList = ref([]);

  const fetchGroupCompany = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/groupComPanies`);
      groupCompanyList.value = response.data.map((company) => ({
        ...company,
        src: company.logo,
        imageName: company.name ? company.name.split("/").pop() : "",
      }));
    } catch (error) {
      console.error("Error fetching Group Company:", error);
    }
  };

  onMounted(() => {
    fetchGroupCompany();
  });

  return { groupCompanyList };
};
