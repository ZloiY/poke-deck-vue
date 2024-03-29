<script setup lang="ts">
import { defineProps } from 'vue';
import LoaderIcon from '@icons/loader.svg?component';
const props = defineProps<{
  isLoading: boolean
}>()
</script>

<template>
  <div v-if="props.isLoading" class="loader-wrapper">
    <LoaderIcon />
  </div>
  <slot v-else></slot>
</template>

<style lang="scss" scoped>
  .loader-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    color: var(--color-accent);
    animation: spin 2s linear 0s infinite;
  }
  
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>

