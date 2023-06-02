<template>
  <main class="view">
    <ControlPanel />
    <TheScene />
  </main>
</template>

<script setup lang="ts">
import TheScene from 'components/TheScene.vue';
import ControlPanel from 'components/ControlPanel.vue';
</script>

<style lang="scss" scoped>
.view {
  display: flex;
}
</style>
