<template>
  <v-container class="fill-height background pt-0" fluid>
    <v-responsive class="fill-height">
    <v-tabs v-model="activeTab"
            slider-color="secondary">
      <v-tab v-for="tab in tabs" :key="tab">{{ tab }}</v-tab>
    </v-tabs>
    <v-window v-model="activeTab">
      <v-window-item v-for="(tab, index) in tabs" :key="tab" :value="index">
        <component :is="getComponent(tab)"></component>
      </v-window-item>
    </v-window>
    </v-responsive>
  </v-container>
</template>

<script>
import { ref } from 'vue';
import TabOne from '@/components/NbsToIndicators.vue';
import TabTwo from '@/components/IndicatorsToNbs.vue';

export default {
  name: "PerformanceAssessment",
  setup() {
    const activeTab = ref(0);
    const tabs = ['From NBS to Indicators', 'From Indicator to NBS'];

    const getComponent = (tab) => {
      switch (tab) {
        case 'From NBS to Indicators':
          return TabOne;
        case 'From Indicator to NBS':
          return TabTwo;
        // Add cases for other tabs
        default:
          return null;
      }
    };

    return {
      activeTab,
      tabs,
      getComponent,
    };
  }
};
</script>

<style>
</style>

