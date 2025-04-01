<template>
  <div>
    <h4
      class="py-0 px-3 text-center text-primary text-md-start container contact-heading"
    >
      {{ $t("contactUs.ourLocation") }}
    </h4>
    <div class="map-container">
      <div v-if="googleMap" class="map-content" v-html="googleMap"></div>
      <iframe
        v-else
        class="map-content"
        src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d4585.82860797275!2d102.64978557517848!3d17.97089578301926!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTfCsDU4JzE1LjIiTiAxMDLCsDM5JzA4LjUiRQ!5e1!3m2!1sth!2sla!4v1735799360468!5m2!1sth!2sla"
        style="border: 0"
        allowfullscreen=""
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  </div>
</template>

<script>
import LogoPartner from "../views/PartnerLogo.vue";
import { useLocationInfo } from "../APIs/LocationAPIs";

export default {
  name: "GoogleMab",
  components: {
    LogoPartner,
  },
  setup() {
    const { googleMap } = useLocationInfo();

    return {
      googleMap,
    };
  },
};
</script>

<style>
.contact-heading {
  margin-bottom: 1rem;
}
.text-primary {
  color: #00adef !important;
}
.map-container {
  position: relative;
  width: 100vw;
  height: 400px;
  margin-left: calc(-50vw + 50%);
  margin-right: calc(-50vw + 50%);
  overflow: hidden;
}

.map-content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 0;
}

iframe {
  width: 100vw !important;
  height: 100% !important;
  display: block;
}
</style>
