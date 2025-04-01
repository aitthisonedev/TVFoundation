<template>
  <div class="share-section mt-5">
    <h4 class="widget-title mb-4 text-start">
      {{ $t("newsCardDetail.contentSection.share") }}
    </h4>
    <div class="social-share d-flex flex-wrap gap-2">
      <a
        :href="getShareUrl('facebook')"
        target="_blank"
        class="btn btn-outline-primary"
      >
        <i class="bi bi-facebook me-2"></i
        >{{ $t("newsCardDetail.contentSection.facebook") }}
      </a>
      <a
        :href="getShareUrl('whatsapp')"
        target="_blank"
        class="btn btn-outline-success"
      >
        <i class="bi bi-whatsapp me-2"></i
        >{{ $t("newsCardDetail.contentSection.whatsapp") }}
      </a>
      <a
        :href="getShareUrl('line')"
        target="_blank"
        class="btn btn-outline-success"
      >
        <i class="bi bi-line me-2"></i
        >{{ $t("newsCardDetail.contentSection.line") }}
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ShareSection',
  props: {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    location: {
      type: String,
      default: ''
    },
    url: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: true
    }
  },
  methods: {
    getShareUrl(platform) {
      const data = {
        url: encodeURIComponent(this.url),
        title: encodeURIComponent(this.title),
        description: encodeURIComponent(this.description),
        image: encodeURIComponent(this.image),
      };

      const locationText = this.location ? `\nLocation: ${this.location}` : '';

      switch (platform) {
        case "facebook":
          return `https://www.facebook.com/sharer/sharer.php?u=${data.url}`;
        case "whatsapp":
          return `https://api.whatsapp.com/send?text=${encodeURIComponent(
            `${this.title}\n${this.description}${locationText}\n${this.url}`
          )}`;
        case "line":
          return `https://social-plugins.line.me/lineit/share?url=${data.url}`;
        default:
          return "";
      }
    }
  }
}
</script>

<style scoped>
.widget-title {
  position: relative;
  padding-bottom: 15px;
}

.widget-title::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  width: 50px;
  height: 3px;
  background: #ed207b;
}
</style> 