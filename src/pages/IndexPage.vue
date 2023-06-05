<template>
  <main class="view">
    <ControlPanel class="view__panel" />
    <TheScene class="view__scene" />
  </main>
</template>

<script setup lang="ts">
import TheScene from 'components/TheScene.vue';
import ControlPanel from 'components/ControlPanel.vue';
</script>

<style lang="scss" scoped>
.view {
  display: flex;
  height: 100vh;
  width: 100vw;

  &__panel {
    height: auto;
  }

  &__scene {
    height: auto;
    width: 100%;
  }
}
</style>
