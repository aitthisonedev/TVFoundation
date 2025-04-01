<template>
  <section class="wrapper bg-gray">
    <div class="container py-12 py-md-14">
      <div class="row gx-lg-8 gx-xl-12 gy-8">
        <div
          class="col-md-6 col-lg-4"
          v-for="(feature, index) in features"
          :key="index"
        >
          <div class="d-flex flex-row">
            <div>
              <img
                :src="feature.iconSrc"
                class="icon-svg icon-svg-sm solid-mono text-navy me-4"
                alt="photo"
              />
            </div>
            <div>
              <h4 class="mb-1">{{ feature.title }}</h4>
              <p class="mb-0">{{ feature.description }}</p>
            </div>
          </div>
        </div>
        <!--/column -->
      </div>
      <!--/.row -->
    </div>
    <!-- /.container -->
  </section>
</template>

<script setup>
const features = [
  {
    id: 1,
    iconSrc: "/assets/img/icons/solid/shipment.svg",
    title: "Free Shipping",
    description:
      "Duis mollis gravida commodo id luctus erat porttitor ligula, eget lacinia odio sem.",
  },
  {
    id: 2,
    iconSrc: "/assets/img/icons/solid/push-cart.svg",
    title: "30 Days Return",
    description:
      "Duis mollis gravida commodo id luctus erat porttitor ligula, eget lacinia odio sem.",
  },
  {
    id: 3,
    iconSrc: "/assets/img/icons/solid/verify.svg",
    title: "2-Years Warranty",
    description:
      "Duis mollis gravida commodo id luctus erat porttitor ligula, eget lacinia odio sem.",
  },
];
</script>

<style lang="scss" scoped>
.d-flex {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
  
  .icon-svg {
    width: 3rem;
    height: 3rem;
  }
  
  h4 {
    color: #343f52;
  }
  
  p {
    color: #60697b;
    line-height: 1.5;
  }
}
</style>
