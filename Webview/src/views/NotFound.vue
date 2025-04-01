<template>
  <div class="not-found">
    <div class="container">
      <div class="error-content">
        <div class="logo-container">
          <img src="../assets/logo.png" alt="Logo" class="logo" />
        </div>
        <h2>{{ $t('notFound.title') }}</h2>
        <p>{{ $t('notFound.description') }}</p>
        <router-link to="/" class="home-link">
          {{ $t('notFound.returnHome') }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotFound'
}
</script>

<style scoped>
.not-found {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.container {
  padding: 20px;
  text-align: center;
}

.error-content {
  background: white;
  padding: 3rem;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  margin: 0 auto;
}

.logo-container {
  margin-bottom: 2rem;
}

.logo {
  max-width: 250px;
  height: auto;
}

h2 {
  font-size: 2rem;
  color: #333;
  margin: 1rem 0;
}

p {
  color: #666;
  margin-bottom: 2rem;
  font-size: 1.1rem;
}

.home-link {
  display: inline-block;
  padding: 12px 30px;
  background-color: #0056b3;
  color: white;
  text-decoration: none;
  border-radius: 25px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.home-link:hover {
  background-color: #003d82;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 86, 179, 0.2);
}
</style> 