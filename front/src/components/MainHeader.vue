<script setup lang="ts">
import { User, Car, Star } from 'lucide-vue-next';
</script>

<template>
  <div class="main-image-header">
    <div class="main-center-text">
      <div class="main-name-div">
        <p class="main-name">Paulo Proni</p>
      </div>
      <h1 class="main-title">300cdub</h1>
      <p class="main-subtitle">Vivendo na fast lane: potência, velocidade e liberdade sobre rodas!</p>
      <div class="main-icons">
        <div>
          <User color="rgba(23, 241, 4, 0.7)" :size="30" />
          <p class="icon-label">50K+</p>          
          <p class="icon-text">Followers</p>
        </div>
        <div>
          <Car color="rgba(23, 241, 4, 0.7)" :size="30" />
          <p class="icon-label">20+</p>          
          <p class="icon-text">Products</p>
        </div>
        <div>
          <Star color="rgba(23, 241, 4, 0.7)" :size="30" />
          <p class="icon-label">4.9</p>          
          <p class="icon-text">Rating</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.main-image-header {
  background-image: linear-gradient(to right, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0.6)), url('@/assets/images/main-img.jpeg');
  background-size: cover;
  background-position: center;
  width: 100%;
  padding: 1rem;
  height: 100vh;
}
.main-center-text {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
}
.main-name-div {
  background-color: rgba(23, 241, 4, 0.7);
  padding: 0.3rem;
  border-radius: 0.5rem;
}
.main-name {
  font-size: 0.9rem;
  color: black;
}
.main-title {
  font-size: 4.5rem;
  font-weight: bold;
  text-transform: uppercase;
  background-image: linear-gradient(to right, rgb(255, 255, 255, 0.8), rgba(23, 241, 4, 0.9));
  background-clip: text;
  color: transparent;
}
.main-subtitle {
  font-size: 1.25rem;
  background-image: linear-gradient(to right, rgb(255, 255, 255, 0.8), rgb(255, 255, 255, 0.5));
  background-clip: text;
  color: transparent;
}
.main-icons {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3rem;
  margin-top: 1rem;
}
.icon-label {
  font-size: 1.6rem;
  font-weight: bold;
  color: var(--asphalt-100);
}
.icon-text {
  font-size: 0.8rem;
  color: var(--asphalt-300);
}
</style>
