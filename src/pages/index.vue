<template>
  <v-tabs v-model="tab" align-tabs="center" color="deep-purple-accent-4">
    <v-tab :value="1">Üben</v-tab>
    <v-tab :value="2">Auswertung</v-tab>
    <v-tab :value="3">Fragenkatalog</v-tab>
  </v-tabs>

  <v-tabs-window v-model="tab">
    <v-tabs-window-item v-for="n in 3" :key="n" :value="n">
      <PractiveView v-if="n === 1" />
      <EvaluationView v-if="n === 2" />
      <div v-if="n === 3">Fragenkatalog</div>
    </v-tabs-window-item>
  </v-tabs-window>
</template>

<script lang="ts" setup>
const tab = ref<number>();
</script>
