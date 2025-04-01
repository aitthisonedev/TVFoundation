<template>
  <v-dialog v-model="dialog" persistent max-width="500">
    <v-card>
      <v-card-title class="headline">Session Timeout</v-card-title>
      <v-card-text>
        You have been logged out due to inactivity. Please log in again to continue your session.
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="closeDialog">OK</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data() {
    return {
      dialog: false,
    };
  },
  methods: {
    openDialog() {
      this.dialog = true;
    },
    closeDialog() {
      this.dialog = false;
      // Redirect to login or perform any other action
    },
  },
};
</script>

<style scoped>
/* Add any custom styles here */
</style>
