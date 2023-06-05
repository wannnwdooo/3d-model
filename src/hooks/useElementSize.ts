import { computed, onMounted, onUnmounted, Ref, ref } from 'vue';

export function useElementSize(componentRef: Ref<HTMLElement | null>) {
  const width = ref(0);
  const height = ref(0);

  const measureSize = () => {
    const rect = componentRef.value?.getBoundingClientRect() as DOMRect;
    width.value = rect.width;
    height.value = rect.height;
  };

  onMounted(() => {
    measureSize();
    window.addEventListener('resize', measureSize);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', measureSize);
  });

  const windowWidth = computed(() => width.value);
  const windowHeight = computed(() => height.value);

  return { windowWidth, windowHeight };
}
