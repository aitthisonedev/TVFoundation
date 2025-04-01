<template>
  <div class="contact-us container">
    <!-- Full Screen Hero Section -->
    <div class="hero-section text-gray">
      <div class="hero-overlay">
        <div class="hero-content text-center">
          <h1 class="display-4 text-white">{{ $t("contactUs.getInTouch") }}</h1>
          <p class="lead text-white">
            {{ $t("contactUs.heroDescription") }}
          </p>
        </div>
      </div>
    </div>
    <div class="contact-section">
      <LogoPartner />
    </div>
    
    <!-- Replace the contact section with the new component -->
    <ContactSection />
    
    <!-- Full Screen Map -->
    <GoogleMap />
  </div>
</template>

<script>
import LogoPartner from "../views/PartnerLogo.vue";
import ContactSection from "./ContactForm.vue";
import GoogleMap from "./GoogleMab.vue";

export default {
  name: "ContactUs",
  components: {
    LogoPartner,
    ContactSection,
    GoogleMap
  }
};
</script>

<style scoped>
/* Full screen hero section */
.hero-section {
  position: relative;
  width: 100vw;
  height: 40vh;
  background-image: url("https://www.conservationlaos.com/wp-content/uploads/2024/08/IMG_1174-scaled.jpg");
  background-size: cover;
  background-position: center;
  margin-left: calc(-50vw + 50%);
  margin-right: calc(-50vw + 50%);
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1), 0 6px 10px rgba(0, 0, 0, 0.19);
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.1);
}

/* Enhanced Contact form styling */
.contact-form {
  transition: transform 0.3s ease;
}

.contact-form:hover {
  transform: translateY(-5px);
}

.form-control:focus {
  box-shadow: 0 0 0 3px rgba(0, 173, 239, 0.25);
  border-color: #00adef;
}

.btn-primary {
  background: linear-gradient(135deg, #00adef, #ed207b);
  border: none;
  padding: 15px 40px;
  border-radius: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 15px rgba(45, 118, 187, 0.2);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(45, 118, 187, 0.3);
}

/* Enhanced Contact Info styling */
.contact-info {
  background: linear-gradient(135deg, #00adef, #d32b2b);
  border-radius: 12px;
  padding: 2rem !important;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.info-item {
  padding: 1.5rem;
  background: linear-gradient(135deg, #d32b2b, #00adef);
  border-radius: 12px;
  margin-bottom: 1.5rem;
  transition: transform 0.3s ease;
  box-shadow: 0 4px 4px #00adef;
}

.info-item:hover {
  transform: translateX(5px);
}

.info-item h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.info-item p {
  margin-bottom: 0.5rem;
  opacity: 0.9;
  font-size: 1rem;
}

.info-item i {
  font-size: 1.5rem;
}

/* Typography */
.contact-label {
  color: #fff;
  font-size: 18px;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 20px;
  display: block;
}

.display-4 {
  font-size: 64px;
  font-weight: 700;
  margin-bottom: 20px;
}

.lead {
  font-size: 20px;
  opacity: 0.9;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .display-4 {
    font-size: 40px;
  }

  .hero-content {
    padding: 0 15px;
  }

  .contact-info {
    margin-top: 30px;
  }
  .map-section {
    margin-top: 0px;
  }
}

@media (max-width: 768px) {
  .container-fluid {
    padding-left: 15px;
    padding-right: 15px;
  }
  .info-card {
  padding-top: 0;
  padding: 1rem;
}
}
.info-card {
  padding: 2rem;
  margin-top: 0;
  border-radius: 15px;
}

.info-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 2rem;
  padding: 1rem;
  border-radius: 10px;
}

.info-item i {
  font-size: 2rem;
  margin-right: 1rem;
  color: white;
}

.info-content {
  color: white;
}

.info-content h3 {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

.info-content p {
  margin: 0;
  opacity: 0.8;
}

.contact-form-wrapper {
  padding: 0rem 2rem;
  padding-bottom: 4rem;
  padding-top: 5rem;
}

@media (max-width: 768px) {
  .contact-form-wrapper {
    padding: 0rem 1.5rem 1rem 1.5rem;
   
  }
}

.customers-label {
  color: #d32b2b;
  font-size: 2rem;
  margin-bottom: 1rem;
}

.contact-heading {
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: #00adef;
}

.form-control {
  background: #00adef;
  box-shadow: 0  4px 10px #00adef;
  border: none;
  padding: 1rem;
  margin-bottom: 1rem;
}

.form-control::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.btn-success {
  background: #ed207b;
  border: none;
  padding: 0.7rem 2rem;
  font-weight: 600;
}

.social-links {
  display: flex;
  justify-content: start;
  align-items: center;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: #00adef;
  margin-right: 10px;
  transition: all 0.3s ease;
}

.social-link i {
  font-size: 20px;
  color: white;

  transition: all 0.3s ease;
}

/* Brand-specific hover colors */
.social-link:hover {
  transform: translateY(-5px);
}

/* Facebook */
.social-link:has(.fa-facebook):hover {
  background: #ed207b;
  box-shadow: 0 5px 15px rgba(24, 119, 242, 0.4);
}

/* WhatsApp */
.social-link:has(.fa-whatsapp):hover {
  background: #25d366;
  box-shadow: 0 5px 15px rgba(37, 211, 102, 0.4);
}

/* Line */
.social-link:has(.fa-line):hover {
  background: #00b900;
  box-shadow: 0 5px 15px rgba(0, 185, 0, 0.4);
}

/* LinkedIn */
.social-link:has(.fa-linkedin):hover {
  background: #d32b2b;
  box-shadow: 0 5px 15px rgba(10, 102, 194, 0.4);
}

/* Make icons white on hover */
.social-link:hover i {
  color: white;
  transform: scale(1.2);
}
</style>
