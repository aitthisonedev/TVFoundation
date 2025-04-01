<template>
  <v-card fluid class="h-100">
    <!-- Metrics Cards -->
    <v-row>
      <v-col cols="12" md="3" v-for="metric in metrics" :key="metric.title">
        <v-card class="pa-3">
          <v-card-title>
            <router-link v-if="metric.link" :to="metric.link" class="d-flex align-center">
              <v-icon left size="large" color="primary" class="mr-2">{{ metric.icon }}</v-icon>
              {{ metric.title }}
            </router-link>
            <span v-else class="d-flex align-center">
              <v-icon left color="primary" size="large" class="mr-2">{{ metric.icon }}</v-icon>
              {{ metric.title }}
            </span>
          </v-card-title>
          <v-card-text color="primary" size="large" class="display-2">{{ metric.value }} {{ metric.suffix }}</v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Data Visualization -->
    <v-row>
      <v-col cols="12">
        <v-card class="pa-3" outlined>
          <v-card-title>
            <v-icon color="primary">mdi-chart-line</v-icon>
            Visitor Analytics
          </v-card-title>
          <v-card-text>
            <canvas id="visitorChart"></canvas>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import axios from "axios";
import Chart from "chart.js/auto";

const apiUrl = import.meta.env.VITE_API_URL;
const WebapiUrl = import.meta.env.WEBSITE_API_URL;

// console.log("Local API URL:", apiUrl);
console.log("Test Website API URL:", WebapiUrl);

export default {
  data() {
    return {
      metrics: [
        { title: "News", value: 0, suffix: "Articles", icon: "mdi-newspaper", link: "/news" },
        { title: "Projects", value: 0, suffix: "Active", icon: "mdi-folder-open", link: "/project" },
        { title: "Users", value: 0, suffix: "Registered", icon: "mdi-account", link: "/users" },
        { title: "Visitors", value: 1200, suffix: "Today", icon: "mdi-eye", link: "/dashboard" }, // No link for visitors
      ],
      newsItems: [],
      projects: [],
      visitorChart: null,
    };
  },
  methods: {
    async fetchData() {
      try {
        // Fetch users
        const usersResponse = await axios.get(`${apiUrl}/api/users`);
        this.metrics[2].value = usersResponse.data.length;

        // Fetch projects
        const projectsResponse = await axios.get(`${apiUrl}/api/projects`);
        this.projects = projectsResponse.data;
        this.metrics[1].value = this.projects.length;

        // Fetch news
        const newsResponse = await axios.get(`${apiUrl}/api/news`);
        this.newsItems = newsResponse.data;
        this.metrics[0].value = this.newsItems.length;

        // Simulate fetching visitor data
        this.metrics[3].value = 150; // Simulated visitor count
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    getStatusColor(status) {
      switch (status) {
        case "Active":
          return "primary";
        case "Pending":
          return "orange";
        case "Completed":
          return "blue";
        default:
          return "grey";
      }
    },
    async fetchVisitorData(period) {
      try {
        const response = await axios.get(`${WebapiUrl}/api/visitors/${period}`);
        return response.data;
      } catch (error) {
        console.error(`Error fetching ${period} data:`, error);
        return { labels: [], data: [] };
      }
    },
    async renderChart(period = 'daily') {
      const visitorData = await this.fetchVisitorData(period) || { labels: [], data: [] };
      const ctx = document.getElementById("visitorChart")?.getContext("2d");
      if (!ctx) {
        console.error("Canvas context not found");
        return;
      }

      // Destroy any existing chart instance to avoid duplication
      if (this.visitorChart) this.visitorChart.destroy();

      console.log("Initializing chart with data:", visitorData);

      this.visitorChart = new Chart(ctx, {
        type: "line",
        data: {
          labels: visitorData.labels,
          datasets: [
            {
              label: "Visitors",
              data: visitorData.data,
              fill: true,
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgb(75, 192, 192)",
              tension: 0.3,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
        },
      });
    },
  },
  async mounted() {
    await this.fetchData();
    await this.renderChart('daily');
  },
};

</script>

<style scoped>
.pa-3 {
  padding: 16px;
}

.pa-5 {
  padding: 24px;
}

.gray-rient {
  background: linear-gradient(135deg, #f5f5f5, #e0e0e0);
}
</style>
