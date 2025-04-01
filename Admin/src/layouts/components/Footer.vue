<template>
  <div class="h-100 d-flex align-center justify-space-between">
    <!-- 👉 Footer: left content -->
    <span class="d-flex align-center">
      &copy;
      {{ currentYear }}
      All rights reserved Developed by
      <VIcon icon="bx-heart" color="error" size="1.25rem" class="mx-1" />
      <a
        href="https://aitthisone.com"
        target="_blank"
        rel="noopener noreferrer"
        class="text-secondary ms-1"
        ><b> 👉 <strong>Aitthisone DSP</strong></b></a
      >
    </span>
    <div class="d-flex align-center">
      Date: {{ currentDate }} Time: {{ currentTime }}
      <VIcon icon="bx-heart" color="error" size="1.25rem" class="mx-1" />
    </div>
    <!-- 👉 Footer: right content -->
    <span class="d-md-flex gap-x-4 text-success d-none">
      <a
        href="https://aitthisone.com"
        class="text-secondary"
        target="noopener noreferrer"
        ><b>If you need create the Website</b></a
      >
    </span>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentYear: new Date().getFullYear(),
      currentTime: this.getCurrentTime(),
      currentDate: this.getCurrentDate(),
    };
  },
  mounted() {
    this.updateTime(); // Start updating time on component mount
  },
  methods: {
    getCurrentTime() {
      // Return the current time in HH:MM:SS format
      const now = new Date();
      return now.toLocaleTimeString();
    },
    getCurrentDate() {
      // Return the current date in DD-MM-YYYY format
      const now = new Date();
      const day = String(now.getDate()).padStart(2, '0');
      const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-based
      const year = now.getFullYear();
      return `${day}-${month}-${year}`;
    },
    updateTime() {
      // Update the currentTime and currentDate every second
      setInterval(() => {
        this.currentTime = this.getCurrentTime();
        this.currentDate = this.getCurrentDate();
      }, 1000);
    },
  },
};
</script>
