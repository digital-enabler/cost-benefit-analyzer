<template>
  <v-row :align="'center'" :align-content="'center'" :dense="true"
         :no-gutters="true">
    <v-col cols="12">
      <v-card class="" elevation="0">
        <v-row :align="'start'" :dense="true" :no-gutters="true">
          <v-col cols="8" sm="6">
            <v-tabs v-model="currentTab" class="mb-5" @update:modelValue="panel = 0">
              <v-tab v-for="(response, index) in uploadResponse" :key="`tab-${index}`" :value="`tab-${index}`">
                {{ response.label }}
              </v-tab>
            </v-tabs>
          </v-col>
          <v-col class="text-right" cols="4" sm="6">
            <v-btn v-if="mainTab === 'one'" class="bg-primary text-uppercase mr-2" color="white"
                   prepend-icon="mdi-refresh"
                   variant="text" @click="rerunSimulation">RERUN
            </v-btn>
            <v-btn class="bg-primary text-uppercase" color="white" prepend-icon="mdi-download"
                   variant="text" @click="downloadReport">download report
            </v-btn>
          </v-col>
        </v-row>
        <div ref="reportContent">
          <v-window v-model="currentTab">
            <v-window-item v-for="(response, index) in uploadResponse" :key="`tab-item-${index}`"
                           :value="`tab-${index}`">
              <v-card-text>
                <v-row>
                  <v-col cols="6">
                    <v-card class="pa-2" outlined>
                      <v-expansion-panels v-model="panel">
                        <v-expansion-panel class="mb-2" elevation="0">
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

                  <v-col cols="6">
                    <v-card class="pa-2" outlined>
                      <present-value-bar-chart
                        :present-value-data="response?.features.present_value"></present-value-bar-chart>
                    </v-card>
                  </v-col>
                  <v-col cols="6">
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
              </v-card-text>
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
import {ref} from "vue";
import html2pdf from "html2pdf.js";

export default {
  name: "UploadResponse",
  components: {PresentValueBarChart, CostsTrendBarChart, BenefitsTrendBarChart, CostBenefitChart},
  emits: ['uploadResponseUpdated'],
  props: {
    uploadResponse: {
      type: Array,
      required: true
    },
    mainTab: {
      type: String,
      required: false
    },
  },
  setup(props, context) {
    const currentTab = ref('');
    const {optimization} = useApp();
    const files = ref(null);
    const panel = ref(0);
    const reportContent = ref(null);


    const downloadReport = () => {
      if (reportContent.value) {
        const options = {
          margin: 10,
          filename: 'report.pdf',
          image: {type: 'jpeg', quality: 0.98},
          html2canvas: {scale: 2},
          pagebreak: {mode: 'avoid-all', before: '#page2el'},
          jsPDF: {unit: 'pt', format: 'tabloid', orientation: 'landscape'},
        };
        html2pdf().from(reportContent.value).set(options).save();
      }
    };

    const rerunSimulation = () => {
      context.emit('uploadResponseUpdated');
    }


    return {
      files,
      optimization,
      reportContent,
      downloadReport,
      panel,
      currentTab,
      rerunSimulation
    };
  }
};

</script>

<style scoped>


</style>
