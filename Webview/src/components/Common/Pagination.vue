<template>
  <div class="bg-none d-flex justify-content-end align-items-center">
    <button
      :disabled="currentPage === 1"
      @click="updatePage(currentPage - 1)"
      class="pagination-btn"
    >
      <i class="fas fa-arrow-left"></i>
    </button>
    
    <div class="page-numbers">
      <button
        v-for="page in totalPages"
        :key="page"
        @click="updatePage(page)"
        class="page-number-btn"
        :class="{ active: currentPage === page }"
      >
        {{ page }}
      </button>
    </div>

    <button
      :disabled="currentPage === totalPages"
      @click="updatePage(currentPage + 1)"
      class="pagination-btn"
    >
      <i class="fas fa-arrow-right"></i>
    </button>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  totalPages: {
    type: Number,
    required: true,
    default: 1
  },
  modelValue: {
    type: Number,
    required: true,
    default: 1
  },
  currentPage: {
    type: Number,
    required: true,
    default: 1
  }
});

const emit = defineEmits(['update:modelValue']);

const updatePage = (newPage) => {
  if (newPage >= 1 && newPage <= props.totalPages) {
    emit('update:modelValue', newPage);
  }
};
</script>

<style scoped>
.pagination-btn {
  padding: 0.5rem 1rem;
  background-color: #ed207b;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.pagination-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.pagination-btn:hover {
  background-color: #00adef;
}

.page-numbers {
  display: flex;
  gap: 0.5rem;
  margin: 0 1rem;
}

.page-number-btn {
  padding: 0.5rem 1rem;
  background-color: #ccc;
  border: none;
  color: #00adef;
  border-radius: 4px;
  cursor: pointer;
}

.page-number-btn:hover {
  background-color: #f0f0f0;
}

.page-number-btn.active {
  background-color: #00adef;
  color: white;
}
</style> 