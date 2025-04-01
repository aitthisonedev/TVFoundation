export default {
  watch: {
    title: {
      immediate: true,
      handler(newTitle) {
        if (newTitle) {
          document.title = newTitle;
          document.querySelector('meta[property="og:title"]').setAttribute('content', newTitle);
          document.querySelector('meta[name="twitter:title"]').setAttribute('content', newTitle);
        }
      }
    },
    description: {
      immediate: true,
      handler(newDesc) {
        if (newDesc) {
          document.querySelector('meta[property="og:description"]').setAttribute('content', newDesc);
          document.querySelector('meta[name="twitter:description"]').setAttribute('content', newDesc);
        }
      }
    },
    image: {
      immediate: true,
      handler(newImage) {
        if (newImage) {
          document.querySelector('meta[property="og:image"]').setAttribute('content', newImage);
          document.querySelector('meta[name="twitter:image"]').setAttribute('content', newImage);
        }
      }
    }
  },
  mounted() {
    // Set the current URL
    document.querySelector('meta[property="og:url"]').setAttribute('content', window.location.href);
  }
} 