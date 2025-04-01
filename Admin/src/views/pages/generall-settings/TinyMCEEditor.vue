<template>
  <editor
    v-model="content"
    api-key="your-api-key"  <!-- Replace this string with your actual API key -->
    :init="{
      height: 300,
      menubar: false,
      plugins: [
        'advlist autolink lists link image charmap print preview anchor',
        'searchreplace visualblocks code fullscreen',
        'insertdatetime media table paste code help wordcount'
      ],
      toolbar: 'undo redo | formatselect | bold italic backcolor | \
                alignleft aligncenter alignright alignjustify | \
                bullist numlist outdent indent | removeformat | help'
    }"
  ></editor>
</template>

<script setup>
import { ref } from 'vue'
import { Editor } from '@tinymce/tinymce-vue'

const content = ref('')
</script>

<style>
/* You can add custom styles here */
</style>
