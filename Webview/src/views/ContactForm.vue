<template>
  <div>
    <div class="contact-section container">
      <div class="row h-auto">
        <!-- Left Side - Contact Info -->
        <div class="col-lg-6 contact-info-wrapper p-0">
          <div class="contact-info-overlay">
            <div class="info-card">
              <div class="info-item">
                <i class="bi bi-telephone-fill"></i>
                <div class="info-content text-start">
                  <h3>{{ $t("contactUs.phoneNumber") }}</h3>
                  <p>{{ phoneNumber }}</p>
                  <p>{{ phoneOffice }}</p>
                </div>
              </div>

              <div class="info-item">
                <i class="bi bi-envelope-fill"></i>
                <div class="info-content text-start">
                  <h3>{{ $t("contactUs.emailAddress") }}</h3>
                  <p>{{ contactEmail }}</p>
                  <p>{{ officeEmail }}</p>
                </div>
              </div>

              <div class="info-item">
                <i class="bi bi-geo-alt-fill"></i>
                <div class="info-content text-start">
                  <h3>{{ $t("contactUs.address") }}</h3>
                  <p>{{ addressInfo }}</p>
                </div>
              </div>

              <!-- Replace social links with imported component -->
              <SocialLinks />
            </div>
          </div>
        </div>

        <!-- Right Side - Contact Form -->
        <div class="col-lg-6 contact-form-wrapper">
          <div class="form-content">
            <h3 class="customers-label">{{ $t("contactUs.giveUsSupport") }}</h3>
            <h2 class="contact-heading">{{ $t("contactUs.wantToAsk") }}</h2>
            <form
              @submit.prevent="validateAndSubmit"
              @keyup.enter="validateAndSubmit"
              class="contact-form"
              novalidate
            >
              <div class="row g-3">
                <div class="col-md-6">
                  <input
                    type="text"
                    class="form-control"
                    :class="{ 'is-invalid': submitted && !form.name }"
                    :placeholder="$t('contactUs.yourName')"
                    v-model.trim="form.name"
                    required
                  />
                </div>
                <div class="col-md-6">
                  <input
                    type="email"
                    class="form-control"
                    :class="{
                      'is-invalid': (submitted && !form.email) || emailError,
                    }"
                    :placeholder="$t('contactUs.emailAddress')"
                    v-model.trim="form.email"
                    required
                  />
                  <div v-if="emailError" class="invalid-feedback">
                    {{
                      $t(
                        "contactUs.invalidEmail",
                        "Please enter a valid email address"
                      )
                    }}
                  </div>
                </div>
                <div class="col-md-6">
                  <input
                    type="tel"
                    class="form-control"
                    :class="{
                      'is-invalid': (submitted && !form.phone) || phoneError,
                    }"
                    :placeholder="$t('contactUs.phoneNumber')"
                    v-model.trim="form.phone"
                    required
                  />
                  <div v-if="phoneError" class="invalid-feedback text-danger">
                    {{ $t("contactUs.invalidPhone") }}
                  </div>
                </div>
                <div class="col-md-6">
                  <input
                    type="text"
                    class="form-control"
                    :class="{ 'is-invalid': submitted && !form.subject }"
                    :placeholder="$t('contactUs.subject')"
                    v-model.trim="form.subject"
                    required
                  />
                </div>
                <div class="col-12">
                  <textarea
                    class="form-control"
                    :class="{ 'is-invalid': submitted && !form.message }"
                    rows="5"
                    :placeholder="$t('contactUs.messageHere')"
                    v-model.trim="form.message"
                    required
                  ></textarea>
                </div>
                <div class="col-12">
                  <button type="submit" class="btn btn-success cursor-pointer">
                    {{ $t("contactUs.sendMail") }}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading Dialog -->
    <div
      class="modal fade"
      id="loadingModal"
      data-bs-backdrop="static"
      tabindex="-1"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-body text-center p-4">
            <div class="spinner-border text-danger mb-3" role="status">
              <span class="visually-hidden">{{
                $t("loading.loadingText")
              }}</span>
            </div>
            <h5>{{ $t("loading.sending") }}</h5>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Dialog -->
    <div class="modal fade" id="successModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-body text-center p-4">
            <i
              class="bi bi-check-circle-fill text-danger"
              style="font-size: 3rem"
            ></i>
            <h5 class="mt-3">{{ $t("loading.success.title") }}</h5>
            <p>{{ $t("loading.success.description") }}</p>
            <button
              type="button"
              class="btn btn-success"
              @click="closeSuccessModal"
            >
              {{ $t("loading.success.close") }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import emailjs from "@emailjs/browser";
import { Modal } from "bootstrap";
import SocialLinks from "@/components/Common/SocialLinks.vue";
import { useEmail } from '@/APIs/EmailAPIs';
import { usePhoneNumber } from '@/APIs/PhoneAPIs';
import { useAddressInfo } from '@/APIs/AddressAPIs';

export default {
  name: "ContactSection",
  components: {
    SocialLinks,
  },
  setup() {
    const { phoneNumber, phoneOffice } = usePhoneNumber();
    const { contactEmail, officeEmail } = useEmail();
    const { addressInfo } = useAddressInfo();

    return {
      phoneNumber,
      phoneOffice,
      contactEmail,
      officeEmail,
      addressInfo,
    };
  },
  data() {
    return {
      form: {
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      },
      submitted: false,
      phoneError: false,
      emailError: false,
      loadingModal: null,
      successModal: null,
    };
  },
  mounted() {
    // Initialize Bootstrap modals using the imported Modal class
    this.loadingModal = new Modal(document.getElementById("loadingModal"));
    this.successModal = new Modal(document.getElementById("successModal"));
  },
  methods: {
    validatePhone(phone) {
      // Remove any non-digit characters except plus sign at start
      const cleanPhone = phone.replace(/[^\d+]/g, "");
      // Check if phone matches either format: +8562xxxxxxxx or 02xxxxxxxx
      return /^(\+856|0)\d{9,}$/.test(cleanPhone);
    },
    validateEmail(email) {
      // Basic email validation regex
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },

    validateAndSubmit() {
      this.submitted = true;

      // Add email validation
      if (!this.validateEmail(this.form.email)) {
        this.emailError = true;
        return;
      }
      this.emailError = false;

      // Phone validation
      if (!this.validatePhone(this.form.phone)) {
        this.phoneError = true;
        return;
      }
      this.phoneError = false;

      // Rest of validation
      if (
        !this.form.name ||
        !this.form.email ||
        !this.form.phone ||
        !this.form.subject ||
        !this.form.message
      ) {
        return;
      }

      this.handleSubmit();
    },
    async handleSubmit() {
      try {
        // Show loading dialog
        this.loadingModal.show();

        // Send email
        await emailjs.send(
          "service_0syqfq3",
          "template_ihwjsww",
          {
            name: this.form.name,
            email: this.form.email,
            phone: this.form.phone,
            subject: this.form.subject,
            message: this.form.message,
          },
          "0w86rxLFycBrARg5Q"
        );

        // Hide loading dialog
        this.loadingModal.hide();

        // Reset form and submitted flag
        this.form = {
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        };
        this.submitted = false; // Reset the submitted flag

        // Show success dialog
        this.successModal.show();
      } catch (error) {
        console.error("Failed to send message:", error);
        this.loadingModal.hide();
        alert("Failed to send message. Please try again.");
      }
    },
    closeSuccessModal() {
      this.successModal.hide();
    },
  },
};
</script>

<style scoped>
/* Copy all the relevant styles from ContactUs.vue */
/* .contact-section {
  position: relative;
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  margin-right: calc(-50vw + 50%);
} */

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
  background: linear-gradient(135deg, #ed207b, #00adef);
  transition: transform 0.3s ease;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.4);
}

.info-item:hover {
  transform: translateX(5px);
}
.text-danger {
  color: #ed207b !important;
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

.customers-label {
  color: #ed207b;
  font-size: 2.2rem;
  margin-bottom: 1rem;
}

.contact-heading {
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  color: #00adef;
}

.form-control {
  background: #00adef;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.4);
  border: none;
  padding: 1rem;
  margin-bottom: 1rem;
}

.form-control::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.btn-success {
  background: #00adef;
  border: none;
  padding: 0.7rem 2rem;
  font-weight: 600;
}

@media (max-width: 768px) {
  .contact-form-wrapper {
    padding: 0rem 1.5rem 1rem 1.5rem;
  }

  .info-card {
    padding-top: 0;
    padding: 1rem;
  }
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.is-invalid {
  border-color: #ed207b !important;
  background-color: rgba(220, 53, 69, 0.1) !important;
}

.form-control:focus {
  box-shadow: none;
}

.form-control.is-invalid:focus {
  box-shadow: 0 0 0 0.25rem rgba(220, 53, 69, 0.25);
}
</style>
