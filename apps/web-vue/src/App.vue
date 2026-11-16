<script setup lang="ts">
import { ref } from 'vue'
import { getApiHealth } from './api/client'

const apiStatus = ref('Not checked')

async function checkApi() {
  apiStatus.value = 'Checking…'
  try {
    const health = await getApiHealth()
    apiStatus.value = `${health.service}: ${health.status}`
  } catch {
    apiStatus.value = 'API unavailable'
  }
}
</script>

<template>
  <main class="workspace">
    <span class="eyebrow">PROJECT SETUP</span>
    <h1>HyperLocal</h1>
    <p>Vue client is ready. Product screens and flows will be built from the Figma design.</p>
    <button type="button" @click="checkApi">Check API connection</button>
    <p class="status" aria-live="polite">{{ apiStatus }}</p>
  </main>
</template>
