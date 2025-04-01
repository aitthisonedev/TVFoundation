<template>
  <footer class="footer text-light py-4">
    <div class="container">
      <div class="row gy-4">
        <!-- About Section -->
        <div class="col-12 col-sm-6 col-lg-4 text-start">
          <img
              :src="logo2"
              :onerror="handleLogoError"
              alt="Meathoayaithongvanh logo"
              class="footer-logo"
            />
          <p class="mb-4">{{ footerContent || defaultFooterContent }}</p>
        </div>

        <!-- Latest Projects Section -->
        <div class="col-12 col-sm-6 col-lg-2">
          <h5 class="fw-bold mb-4 text-start">{{ $t("footer.latestProjects") }}</h5>
          <div class="footer-project-grid">
            <div
              v-for="project in latestProjects"
              :key="project.id"
              class="footer-project-item"
              @click="goToProject(project.id)"
            >
              <img
                :src="project.coverImage"
                :alt="project.title"
                class="img-fluid rounded"
              />
            </div>
          </div>
        </div>

        <!-- Contact Info -->
        <div class="col-12 col-sm-6 col-lg-3">
          <h5 class="fw-bold mb-4 text-start">{{ $t("footer.contactInfo") }}</h5>
          <ul class="list-unstyled contact-info text-start">
            <li class="mb-3">
              <i class="fas fa-map-marker-alt"></i>
              {{ addressInfo }}
            </li>
            <li class="mb-3">
              <i class="fas fa-envelope me-2"></i>{{ officeEmail }}
            </li>
            <li class="mb-3">
              <i class="fas fa-phone me-2"></i>{{ phoneOffice }}
            </li>
          </ul>
        </div>

        <!-- Newsletter -->
        <div class="col-12 col-sm-6 col-lg-3">
          <h5 class="fw-bold mb-4 text-start">{{ $t("nav.contactUs") }}</h5>
          
          <!-- Alert Message -->
          <div
            v-if="showAlert"
            :class="`alert alert-${alertType} alert-dismissible fade show`"
            role="alert"
          >
            {{ alertMessage }}
            <button
              type="button"
              class="btn-close"
              @click="showAlert = false"
              aria-label="Close"
            ></button>
          </div>

          <form class="newsletter-form" @submit.prevent="handleSubscribe">
            <div class="input-group">
              <input
                type="email"
                class="form-control rounded-start"
                :class="{ 'is-invalid': emailError }"
                :placeholder="$t('footer.emailPlaceholder')"
                v-model.trim="subscriberEmail"
                required
              />
              <button 
                class="btn btn-danger text-center py-2" 
                type="submit"
                :disabled="isSubmitting"
              >
                <i class="fas fa-paper-plane pb-5" v-if="!isSubmitting"></i>
                <i class="fas fa-spinner fa-spin pb-5 text-danger" v-else></i>
              </button>
            </div>
            <div v-if="emailError" class="text-danger mt-2 text-start">
              {{ $t('footer.invalidEmail', 'Please enter a valid email address') }}
            </div>
          </form>

          <SocialLinks class="py-4" />
          
        </div>
      </div>

      <!-- Copyright -->
      <div class="row">
        <div class="col-12">
          <hr class="bg-light opacity-25" />
          <p class="text-center mb-0">
            © {{ new Date().getFullYear() }} {{ $t("footer.copyright") }}
            <a href="https://admin.tv-foundation.com" target="_blank" class="btn btn-danger btn-sm ms-2">{{ $t("footer.login") }}</a>
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
import { projects } from '@/data/projects';
import { computed, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import emailjs from '@emailjs/browser';
import { useEmail } from '@/APIs/EmailAPIs';
import { usePhoneNumber } from '@/APIs/PhoneAPIs';
import { useLogo } from '@/APIs/LogoAPIs';
import { useAddressInfo } from '@/APIs/AddressAPIs';
import { useFooterContent } from '@/APIs/FooterContentAPIs';
import SocialLinks from '@/components/Common/SocialLinks.vue';
import { useProjects } from '@/APIs/ProjectsAPIs';
import defaultLogo from "@/assets/logo.png";  // Import logo using @ alias

export default {
  name: "Footer",
  components: {
    SocialLinks
  },
  setup() {
    const router = useRouter();
    const subscriberEmail = ref('');
    const emailError = ref(false);
    const isSubmitting = ref(false);
    const showAlert = ref(false);
    const alertMessage = ref('');
    const alertType = ref('');
    const { officeEmail } = useEmail();
    const { phoneNumber, phoneOffice } = usePhoneNumber();
    const { logo2 } = useLogo();
    const { addressInfo } = useAddressInfo();
    const { footerContent } = useFooterContent();
    const { projects } = useProjects();
    const defaultFooterContent = "Welcome to Meathoayaithongvanh Foundation";
    
    // Initialize EmailJS at component setup
    emailjs.init('0w86rxLFycBrARg5Q');

    const validateEmail = (email) => {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleSubscribe = async (e) => {
      e.preventDefault();
      
      if (!validateEmail(subscriberEmail.value)) {
        emailError.value = true;
        return;
      }
      
      emailError.value = false;
      isSubmitting.value = true;

      try {
        await emailjs.send(
          'service_0syqfq3',
          'template_ihwjsww',
          {
            to_email: subscriberEmail.value,
            from_name: 'Newsletter Subscription',
            message: `New newsletter subscription request from ${subscriberEmail.value}`,
          },
          '0w86rxLFycBrARg5Q'
        );

        // Show success message
        alertType.value = 'success';
        alertMessage.value = 'Thank you for subscribing!';
        showAlert.value = true;
        subscriberEmail.value = '';
      } catch (error) {
        console.error('Subscription failed:', error);
        alertType.value = 'danger';
        alertMessage.value = 'Subscription failed. Please try again.';
        showAlert.value = true;
      } finally {
        isSubmitting.value = false;
        // Auto hide alert after 5 seconds
        setTimeout(() => {
          showAlert.value = false;
        }, 5000);
      }
    };

    const latestProjects = computed(() => {
      return [...projects.value]
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        .slice(0, 4);
    });
    
    const goToProject = (id) => {
      router.push({ 
        name: 'ProjectDetail',
        params: { id: id }
      });
    };

    const handleLogoError = (e) => {
      e.target.src = defaultLogo;
    };

    // Load logo
    onMounted(async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/logo`);
        if (response.ok) {
          const data = await response.json();
          logo2.value = data.logo_url;
        } else {
          logo2.value = defaultLogo;
        }
      } catch (error) {
        console.error('Error loading logo:', error);
        logo2.value = defaultLogo;
      }
    });
    
    return {
      latestProjects,
      goToProject,
      subscriberEmail,
      emailError,
      isSubmitting,
      showAlert,
      alertMessage,
      alertType,
      handleSubscribe,
      officeEmail,
      phoneNumber,
      phoneOffice,
      logo2,
      addressInfo,
      footerContent,
      defaultFooterContent,
      handleLogoError
    };
  }
};
</script>

<style scoped>
.footer {
  background-color: #00adef;
  position: relative;
  width: 100%;
  margin-left: calc(-50% + 50%);
  margin-right: calc(-50% + 50%);
  
}

/* Updated social links styling */
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
  background: rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}
.text-danger{
  color: #ed207b !important;
}
.btn-danger{
  background-color: #ed207b !important;
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
  background: #ed207b;
  box-shadow: 0 5px 15px rgba(10, 102, 194, 0.4);
}

/* Make icons slightly larger on hover */
.social-link:hover i {
  transform: scale(1.2);
}

/* Newsletter form styling */
.newsletter-form .form-control {
  border: none;
}




/* Responsive adjustments */
@media (max-width: 991px) {
  .social-link {
    width: 35px;
    height: 35px;
    font-size: 1rem;
  }
}

/* Add logo styling */
.footer-logo {
  max-height: 150px;
  object-fit: contain;
}

/* Add these new styles */
.footer-project-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.footer-project-item {
  aspect-ratio: 1;
  overflow: hidden;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.footer-project-item:hover {
  transform: scale(1.05);
}

.footer-project-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Add to existing styles */
.social-link:has(.bi-telephone-fill):hover {
  background: #ed207b;
  box-shadow: 0 5px 15px rgba(10, 102, 194, 0.4);
}

.newsletter-form .is-invalid {
  border-color: #ed207b !important;
  background-color: rgba(220, 53, 69, 0.1) !important;
}

.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.text-danger {
  font-size: 0.575rem;
}

.alert {
  position: relative;
  padding: 1rem;
  margin-bottom: 1rem;
  border: 1px solid transparent;
  border-radius: 0.25rem;
  animation: fadeIn 0.5s;
}

.alert-success {
  color: #fff;
  background-color: #ed207b;
  border-color: #ed207b;
}

.alert-danger {
  color: #fff;
  background-color: #ed207b;
  border-color: #ed207b;
}

.btn-close {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
