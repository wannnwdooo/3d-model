<template>
  <q-card>
    <q-card-section>
      <h2 class="text-h6">Control Panel</h2>
    </q-card-section>

    <q-separator />

    <q-card-section>
      <q-btn color="primary" label="Load 3D model" @click="selectFile" />
      <input
        ref="fileInputRef"
        type="file"
        style="display: none"
        @change="downloadModel"
      />
    </q-card-section>

    <q-separator />

    <q-card-section>
      <p class="text-subtitle">Resize Model:</p>
      <q-input
        class="q-mb-xs"
        v-for="(value, key) in sizeValues"
        :key="key"
        outlined
        type="number"
        :label="key.toUpperCase()"
        v-model="sizeValues[key]"
        @input="updateSizeModel"
        min="0.1"
      />
    </q-card-section>
    <q-card-section>
      <q-btn color="negative" label="Remove Model" @click="removeModel" />
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { MutationTypes as ModelsMutationTypes } from 'src/store/modules/models/mutations';
import { ref, watch } from 'vue';
import { useStore } from 'src/store';

const store = useStore();

const fileInputRef = ref<HTMLInputElement | null>(null);
const sizeValues = ref({ x: 1, y: 1, z: 1 });

function selectFile() {
  if (!fileInputRef.value) {
    return;
  }

  fileInputRef.value.accept = '.3mf, .stl';
  fileInputRef.value.click();
}

function downloadModel(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) {
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    const type = file.name.endsWith('3mf') ? '3mf' : 'stl';
    const link = URL.createObjectURL(new Blob([file]));
    store.commit(
      ModelsMutationTypes.ADD_MODEL,
      {
        link,
        type,
        name: file.name,
      },
      { root: true }
    );
  };
  reader.readAsArrayBuffer(file);
}

function removeModel() {
  store.commit(ModelsMutationTypes.REMOVE_MODEL, { root: true });
  resetForm();
}

function updateSizeModel() {
  const newSize = {
    x: +sizeValues.value.x,
    y: +sizeValues.value.y,
    z: +sizeValues.value.z,
  };
  store.commit(ModelsMutationTypes.UPDATE_SIZE_MODEL, newSize, { root: true });
}

function resetForm() {
  sizeValues.value = { x: 1, y: 1, z: 1 };

  if (fileInputRef.value) {
    fileInputRef.value.value = '';
  }
}
watch(sizeValues.value, () => {
  updateSizeModel();
});
</script>
