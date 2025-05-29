<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="app">
    <nav class="nav">
      <router-link to="/label-studio">Label Studio</router-link>
    </nav>
    <RouterView />
  </div>
</template>

<style>
.app {
  min-height: 100vh;
}

.nav {
  padding: 1rem;
  background-color: #f8f9fa;
  display: flex;
  gap: 1rem;
}

.nav a {
  color: #2c3e50;
  text-decoration: none;
}

.nav a.router-link-active {
  color: #409eff;
}
</style> 