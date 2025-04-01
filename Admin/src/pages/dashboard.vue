<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import AnalyticsCongratulations from "@/views/dashboard/AnalyticsCongratulations.vue";
import AnalyticsProfitReport from "@/views/dashboard/AnalyticsProfitReport.vue";
import AnalyticsTotalRevenue from "@/views/dashboard/AnalyticsTotalRevenue.vue";
import AnalyticsVisitors from "./dashboardNews.vue";

// 👉 Images
import News from "@images/cards/News.png";
import Visitors from "@images/cards/Visitors.png";
import Users from "@images/cards/Users.png";
import Projects from "@images/cards/Projects.png";


const apiUrl = import.meta.env.VITE_API_URL;
// Define reactive variables for metrics and status
const metrics = ref([
  { title: "News", value: 0, status: 0 },
  { title: "Projects", value: 0, status: 0 },
  { title: "Users", value: 0, status: 5 },
  { title: "Visitors", value: 0, status: 0 }, // Simulated visitor count
]);

// Function to set status and calculate change
function calculateChange(index) {
  const status = metrics.value[index].status; // Status fetched from API
  const defaultValue = 100; // Fixed default value
  return (status / defaultValue) * 100; // Calculate change as a percentage
}

// Fetch data function
async function fetchData() {
  try {
    // Fetch users
    const usersResponse = await axios.get(`${apiUrl}/api/users`);
    metrics.value[2].value = usersResponse.data.length;
    metrics.value[2].status = calculateAverageStatus(usersResponse.data);

    // Fetch projects
    const projectsResponse = await axios.get(`${apiUrl}/api/projects`);
    metrics.value[1].value = projectsResponse.data.length;
    metrics.value[1].status = calculateAverageStatus(projectsResponse.data);

    // Fetch news
    const newsResponse = await axios.get(`${apiUrl}/api/news`);
    metrics.value[0].value = newsResponse.data.length;
    metrics.value[0].status = calculateAverageStatus(newsResponse.data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Function to calculate average status
function calculateAverageStatus(data) {
  if (data.length === 0) return 0;

  const totalStatus = data.reduce((sum, item) => sum + (item.status || 0), 0);

  return totalStatus / data.length;
}

// Call fetchData on component mount
onMounted(() => {
  fetchData();
});
</script>

<template>
  <VRow>
    <!-- 👉 Congratulations -->
    <VCol cols="12" md="8">
      <AnalyticsCongratulations />
    </VCol>

    <VCol cols="12" sm="4">
      <VRow>
        <!-- 👉 News -->
        <VCol cols="12" md="6">
          <router-link to="/news">
            <CardStatisticsVertical
              v-bind="{
                title: metrics[0].title,
                image: News,
                stats: metrics[0].value,
                change: calculateChange(0),
              }"
            />
          </router-link>
        </VCol>

        <!-- 👉 Projects -->
        <VCol cols="12" md="6">
          <router-link to="/project">
            <CardStatisticsVertical
              v-bind="{
                title: metrics[1].title,
                image: Projects,
                stats: metrics[1].value,
                change: calculateChange(1),
              }"
            />
          </router-link>
        </VCol>
      </VRow>
    </VCol>

    <!-- 👉 Total Visitors -->
    <VCol cols="12" md="8" order="2" order-md="1">
      <AnalyticsTotalRevenue />
    </VCol>

    <VCol cols="12" sm="8" md="4" order="1" order-md="2">
      <VRow>
        <!-- 👉 Users -->
        <VCol cols="12" sm="6">
          <router-link to="/users">
            <CardStatisticsVertical
              v-bind="{
                title: metrics[2].title,
                image: Users,
                stats: metrics[2].value,
                change: calculateChange(2),
              }"
            />
          </router-link>
        </VCol>

        <!-- 👉 Visitors -->
        <VCol cols="12" sm="6">
          <router-link to="/dashboard">
            <CardStatisticsVertical
              v-bind="{
                title: 'Visitors',
                image: Visitors,
                stats: metrics[3].value,
                change: calculateChange(3),
              }"
            />
          </router-link>
        </VCol>
      </VRow>

      <VRow>
        <!-- 👉 Profit Report -->
        <VCol cols="12" sm="12">
          <AnalyticsProfitReport />
        </VCol>
      </VRow>
    </VCol>

    <!-- 👉 Order Statistics -->
    <VCol cols="12" order="3">
      <AnalyticsVisitors />
    </VCol>
    <!-- <VCol
      cols="12"
      md="4"
      sm="6"
      order="3"
    >
      <AnalyticsOrderStatistics />
    </VCol> -->

    <!-- 👉 Tabs News -->
    <!-- <VCol
      cols="12"
      md="4"
      sm="6"
      order="3"
    >
      <AnalyticsFinanceTabs />
    </VCol> -->

    <!-- 👉 Transactions -->
    <!-- <VCol
      cols="12"
      md="4"
      sm="6"
      order="3"
    >
      <AnalyticsTransactions />
    </VCol> -->
  </VRow>
</template>
