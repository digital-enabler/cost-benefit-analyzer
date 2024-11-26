<template>
  <v-row :align="'center'" :align-content="'center'">
    <v-col :cols="showSidebar === true ? 8 : 12">
      <v-card class="" elevation="0">
        <v-row>
          <v-col :cols="showSidebar === true ? 7 : 8">
            <v-tabs v-model="currentTab" class="mb-5" @update:modelValue="panel = 0">
              <v-tab v-for="(response, index) in uploadResponse" :key="`tab-${index}`"
                     v-model="activeTab"
                     :value="`${index}`"
                     @click="setTabName(response.label)">
                {{ response.label }}
              </v-tab>
            </v-tabs>
          </v-col>
          <v-col class="text-right" :cols="showSidebar === true ? 5 : 4">
            <v-btn class="bg-primary text-uppercase mr-2" color="white" prepend-icon="mdi-refresh"
                   variant="text" @click="emitStartOver">start over
            </v-btn>
            <v-menu v-model="menu" transition="scale-transition" offset-y>
              <template v-slot:activator="{ props }">
                <v-btn
                  color="primary"
                  v-bind="props"
                  :append-icon="menu ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                  class="text-uppercase mr-1"
                >
                  Download
                </v-btn>
              </template>
              <v-list>
                <v-list-item prepend-icon="mdi-download" v-if="downloadData" @click="downloadJson">
                  <v-list-item-title>JSON</v-list-item-title>
                </v-list-item>
                <v-list-item prepend-icon="mdi-download" @click="downloadReport">
                  <v-list-item-title>PDF</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>

          </v-col>
        </v-row>
        <div ref="reportContent">
          <v-window v-model="currentTab">
            <v-window-item v-for="(response, index) in uploadResponse" :key="`tab-item-${index}`"
                           :value="`${index}`">
              <v-card class="ma-2">
                <v-row>
                  <!-- First Half of the Description -->
                  <v-col cols="6">
                    <v-card-text>
                      {{ firstHalfOfDescription }}
                    </v-card-text>
                  </v-col>

                  <!-- Second Half of the Description -->
                  <v-col cols="6">
                    <v-card-text>
                      {{ secondHalfOfDescription }}
                    </v-card-text>
                  </v-col>
                </v-row>
              </v-card>
              <v-row>
                <v-col :cols="showSidebar === true ? 12 : 6">
                  <v-card class="ma-2 pa-2" height="416px">
                    <v-expansion-panels v-model="panel">
                      <v-expansion-panel class="mb-0" elevation="0">
                        <v-expansion-panel-title class="bg-blue text-h6 rounded py-2 pl-3 pr-2"
                                                 collapse-icon="mdi-minus" expand-icon="mdi-plus">
                          Summary
                        </v-expansion-panel-title>
                        <v-expansion-panel-text>
                          <v-list density="compact">
                            <v-list-item v-for="item in response.features.model_summary[0].values"
                                         :key="item.index" class="px-3"
                                         max-height="25"
                                         min-height="25">
                              <div class="d-flex justify-space-between align-center my-0 py-0">
                                <v-list-item-title class="text-caption">{{ item.name }}</v-list-item-title>
                                <v-list-item-subtitle class="text-caption">{{
                                    item.value
                                  }}
                                </v-list-item-subtitle>
                              </div>
                              <v-divider></v-divider>
                            </v-list-item>
                          </v-list>
                        </v-expansion-panel-text>
                      </v-expansion-panel>
                      <v-expansion-panel elevation="0">
                        <v-expansion-panel-title class="bg-yellow-darken-4 text-h6 rounded py-2 pl-3 pr-2"
                                                 collapse-icon="mdi-minus" expand-icon="mdi-plus">
                          Show Advanced Information
                        </v-expansion-panel-title>
                        <v-expansion-panel-text>
                          <v-list density="compact">
                            <v-virtual-scroll :items="response.features.model_params[0].values" height="248">
                              <template v-slot:default="{item}">
                                <v-list-item class="px-3" max-height="25" min-height="25">
                                  <div class="d-flex justify-space-between align-center my-0 py-0">
                                    <v-list-item-title class="text-caption">{{
                                        item.name
                                      }}
                                    </v-list-item-title>
                                    <v-list-item-subtitle class="text-caption">{{
                                        item.value
                                      }}
                                    </v-list-item-subtitle>
                                  </div>
                                  <v-divider></v-divider>
                                </v-list-item>
                              </template>


                            </v-virtual-scroll>
                          </v-list>
                        </v-expansion-panel-text>
                      </v-expansion-panel>
                    </v-expansion-panels>
                  </v-card>
                </v-col>

                <v-col :cols="showSidebar === true ? 12 : 6">
                  <v-card class="pa-2 ma-2">
                    <present-value-bar-chart
                      :present-value-data="response?.features.present_value"></present-value-bar-chart>
                  </v-card>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-card class="pa-3 mb-5" elevation="0">
                    <v-card-title class="bg-primary rounded">Costs & Benefits</v-card-title>
                    <v-divider></v-divider>
                    <v-card-text>
                      <v-row>
                        <v-col cols="12">
                          <costs-trend-bar-chart
                            :cost-data="response?.features.costs_trend"></costs-trend-bar-chart>
                        </v-col>
                        <v-col cols="12">
                          <benefits-trend-bar-chart
                            :benefits-data="response?.features.benefits_trend"></benefits-trend-bar-chart>
                        </v-col>
                        <v-col cols="12">
                          <CostBenefitChart :benefit-data="response?.features.benefits_trend"
                                            :cost-data="response?.features.costs_trend"></CostBenefitChart>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-window-item>
          </v-window>
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>

import PresentValueBarChart from "@/components/charts/PresentValueBarChart.vue";
import CostsTrendBarChart from "@/components/charts/CostsTrendBarChart.vue";
import BenefitsTrendBarChart from "@/components/charts/BenefitsTrendChart.vue";
import CostBenefitChart from "@/components/charts/CostBenefitChart.vue";
import {useApp} from "@/mixins/app";
import {computed, onMounted, ref} from "vue";
import html2pdf from "html2pdf.js";

export default {
  name: "UploadResponse",
  components: {PresentValueBarChart, CostsTrendBarChart, BenefitsTrendBarChart, CostBenefitChart},
  emits: ['startOver'],
  props: {
    uploadResponse: {
      type: Array,
      required: true
    },
    downloadData: {
      type: String,
      required: false
    },
    showSidebar: {
      type: Boolean,
      required: false
    }
  },
  setup(props, {emit}) {
    const currentTab = ref('');
    const activeTab = ref('');
    const {optimization} = useApp();
    const files = ref(null);
    const panel = ref(0);
    const reportContent = ref(null);
    const splitThreshold = 100;
    const menu = ref(false);

    // Set the active tab to the first tab on mount
    onMounted(() => {
      setTabName(props.uploadResponse[0].label);
    });

    const currentResponse = computed(() => {
      console.log(currentTab.value);
      return props.uploadResponse[currentTab.value] || {};
    });

    // Computed property for the first half of the description
    const firstHalfOfDescription = computed(() => {
      if (currentResponse.value.description?.length <= splitThreshold) {
        return currentResponse.value.description;
      }
      const breakpoint = Math.floor(currentResponse.value.description?.length / 2);
      const lastSpace = currentResponse.value.description.lastIndexOf(' ', breakpoint);
      return currentResponse.value.description.substring(0, lastSpace);
    });

    const secondHalfOfDescription = computed(() => {
      if (currentResponse.value.description?.length <= splitThreshold) {
        return ''; // Return empty string if the description is too short to split
      }
      const breakpoint = Math.floor(currentResponse.value.description?.length / 2);
      const lastSpace = currentResponse.value.description.lastIndexOf(' ', breakpoint);
      return currentResponse.value.description.substring(lastSpace + 1);
    });

    const emitStartOver = () => {
      emit('startOver');
    }

    // Set the active tab name
    const setTabName = (label) => {
      activeTab.value = label;
    };
    // Download the JSON data
    const downloadJson = () => {
      const blob = new Blob([props.downloadData], {type: 'application/json'});
      const url = URL.createObjectURL(blob);

      // Create a temporary link to trigger the download
      const link = document.createElement('a');
      link.href = url;
      link.download = activeTab.value; // Name of the file to be downloaded
      document.body.appendChild(link); // Append to the document
      link.click(); // Trigger the download

      // Clean up by removing the link and revoking the object URL
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    };
    // Download the report as a PDF
    const downloadReport = () => {
      if (reportContent.value) {
        const options = {
          margin: 10,
          filename: activeTab.value + ' report',
          image: {type: 'jpeg', quality: 0.98},
          html2canvas: {scale: 2},
          pagebreak: {mode: 'avoid-all', before: '#page2el'},
          jsPDF: {unit: 'pt', format: 'tabloid', orientation: 'landscape'},
        };
        html2pdf().from(reportContent.value).set(options).save();
      }
    };

    return {
      files,
      menu,
      optimization,
      reportContent,
      downloadReport,
      panel,
      currentTab,
      activeTab,
      downloadJson,
      setTabName,
      firstHalfOfDescription,
      secondHalfOfDescription,
      splitThreshold,
      emitStartOver
    };
  }
};

</script>
