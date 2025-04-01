<template>
  <div class="card h-100 shadow-sm">
    <img
      src="https://via.placeholder.com/300x200"
      class="card-img-top"
      alt="Tourist Destination"
    />
    <div class="card-body">
      <h5 class="card-title">Destination Name</h5>
      <p class="card-text">Brief description of the tourist destination...</p>
      <div class="d-flex justify-content-between align-items-center">
        <div class="location">
          <i class="fas fa-map-marker-alt text-primary"></i>
          <span class="ms-2">Location</span>
        </div>
        <router-link
          :to="{ name: 'news' }"
          class="btn btn-link text-primary p-0"
        >
          Learn More
        </router-link>
      </div>
    </div>
  </div>
</template> 