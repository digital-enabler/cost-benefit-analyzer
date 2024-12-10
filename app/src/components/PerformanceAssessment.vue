<template>
  <v-container class="fill-height background pt-0" fluid>
    <v-navigation-drawer
      temporary
      border
      class="pa-2"
      :scrim="false"
      v-model="showSidebar"
      location="right"
      width="500"
      elevation="0"
    >
      <v-card elevation="0">
        <v-card-title class="text-h5 d-flex align-center justify-space-between w-100">
          {{ guideTitle }}
          <v-btn variant="text" @click="showSidebar = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <component :is="getGuideContent"></component>
          <p class="mt-4 text-caption">Hint: To stop this guide from automatically showing up, navigate to your Profile Settings and turn it off.</p>
        </v-card-text>
      </v-card>
    </v-navigation-drawer>

    <v-btn
      v-if="!showSidebar"
      variant="text"
      color="primary"
      class="position-absolute"
      style="top: 75px; right: 10px; z-index: 1000;"
      @click="showSidebar = true"
    >
      <v-icon size="36">mdi-information-outline</v-icon>
    </v-btn>

    <v-responsive class="fill-height">
      <v-tabs v-model="activeTab" slider-color="secondary">
        <v-tab v-for="tab in tabs" :key="tab">{{ tab }}</v-tab>
      </v-tabs>
      <v-window v-model="activeTab">
        <v-window-item v-for="(tab, index) in tabs" :key="tab" :value="index">
          <component :show-sidebar="showSidebar" :is="getComponent(tab)"></component>
        </v-window-item>
      </v-window>
    </v-responsive>
  </v-container>
</template>

<script>
import {computed, ref, watch} from 'vue';
import TabOne from '@/components/NbsToIndicators.vue';
import TabTwo from '@/components/IndicatorsToNbs.vue';
import GuideTabOne from '@/components/guides/NbsToIndicator.vue';
import GuideTabTwo from '@/components/guides/IndicatorToNbs.vue';

export default {
  name: "PerformanceAssessment",
  setup() {
    const activeTab = ref(0);
    const showSidebar = ref(sessionStorage.getItem('showSidebar') !== 'false');
    const tabs = ['From NBS to Indicators', 'From Indicator to NBS'];

    const getComponent = (tab) => {
      switch (tab) {
        case 'From NBS to Indicators':
          return TabOne;
        case 'From Indicator to NBS':
          return TabTwo;
        default:
          return null;
      }
    };

    watch(activeTab, (newTab) => {
      if (newTab < 0 || newTab >= tabs.length) {
        activeTab.value = 0; // Reset to default tab if invalid
      }
    });

    const getGuideContent = computed(() => {
      if (activeTab.value === 0) {
        return GuideTabOne;
      } else if (activeTab.value === 1) {
        return GuideTabTwo;
      }
      return null; // Return null if no guide is available for the active tab
    });

    const guideTitle = computed(() => {
      switch (activeTab.value) {
        case 0:
          return 'About the Performance Assessment tool';
        case 1:
          return 'About the Performance Assessment tool';
        default:
          return 'Welcome';
      }
    });

    return {
      showSidebar,
      activeTab,
      tabs,
      getComponent,
      getGuideContent,
      guideTitle
    };
  },
};
</script>
