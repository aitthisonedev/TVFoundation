<template>
  <div class="social-links d-flex gap-2 text-decoration-none">
    <a :href="facebook" class="social-link text-decoration-none" target="_blank">
      <i class="fab fa-facebook"></i>
    </a>
    <a :href="whatsapp" class="social-link text-decoration-none" target="_blank">
      <i class="fab fa-whatsapp"></i>
    </a>
    <a :href="line" class="social-link text-decoration-none" target="_blank">
      <i class="fab fa-line"></i>
    </a>
    <a :href="telephone" class="social-link text-decoration-none" target="_blank">
      <i class="bi bi-telephone-fill"></i>
    </a>
  </div>
</template>

<script>
import { useSocialLinks } from '@/APIs/SocialLinksAPIs';

export default {
  name: 'SocialLinks',
  setup() {
    const { facebook, whatsapp, line, telephone } = useSocialLinks();
    return { facebook, whatsapp, line, telephone };
  }
}
</script>

<style scoped>
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

.social-link:hover {
  transform: translateY(-5px);
}

.social-link:has(.fa-facebook):hover {
  background: #ed207b;
  box-shadow: 0 5px 15px rgba(24, 119, 242, 0.4);
}

.social-link:has(.fa-whatsapp):hover {
  background: #25d366;
  box-shadow: 0 5px 15px rgba(37, 211, 102, 0.4);
}

.social-link:has(.fa-line):hover {
  background: #00b900;
  box-shadow: 0 5px 15px rgba(0, 185, 0, 0.4);
}

.social-link:has(.bi-telephone-fill):hover {
  background: #ed207b;
  box-shadow: 0 5px 15px rgba(10, 102, 194, 0.4);
}

.social-link:hover i {
  color: white;
  transform: scale(1.2);
}
</style> 