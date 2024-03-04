<template>
  <v-container class="fill-height background pt-0" fluid>
    <v-progress-circular
      v-if="loader"
      class="progress"
      color="primary"
      indeterminate
      size="64"
      style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);"
    >
    </v-progress-circular>
    <v-responsive v-else class="fill-height">
      <v-tabs
        v-model="tab"
        bg-color="primary"
        class="mb-5"
        slider-color="secondary"
      >
        <v-tab value="one">Upload json</v-tab>
        <v-tab value="two">Define NBS</v-tab>
      </v-tabs>

      <v-window v-model="tab">
        <v-window-item value="one">
          <v-col class="py-0" cols="4">
            <v-file-input v-model="files" accept="application/JSON" label="Upload json" prepend-icon="mdi-paperclip"
                          @change="handleFileUpload"></v-file-input>
          </v-col>
          <v-row v-if="uploadResponse">
            <v-col cols="12">
              <v-card class="pa-3 mb-5" elevation="0">
                <v-tabs v-model="currentTab" class="mb-5" @update:modelValue="panel = 0">
                  <v-tab v-for="(response, index) in uploadResponse" :key="`tab-${index}`" :value="`tab-${index}`">
                    {{ response.label }}
                  </v-tab>
                </v-tabs>
                <v-window v-model="currentTab">
                  <v-window-item v-for="(response, index) in uploadResponse" :key="`tab-item-${index}`"
                                 :value="`tab-${index}`">
                    <v-card-text>
                      <v-row>
                        <v-col class="d-flex justify-end" cols="12">
                          <v-btn class="bg-primary text-uppercase" color="white" prepend-icon="mdi-download"
                                 variant="text">download report
                          </v-btn>
                        </v-col>
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
                                    <v-list-item v-for="item in response.features.model_summary[0].values" :key="item.index" class="px-3"
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
                                            <v-list-item-title class="text-caption">{{ item.name }}</v-list-item-title>
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
                                                    :cost-data="uploadResponse[0]?.features.costs_trend"></CostBenefitChart>
                                </v-col>
                              </v-row>
                            </v-card-text>
                          </v-card>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-window-item>
                </v-window>
              </v-card>
            </v-col>
          </v-row>
        </v-window-item>

        <v-window-item value="two">
          Two
        </v-window-item>

      </v-window>
    </v-responsive>

  </v-container>
</template>

<script>
import {ref} from "vue";
import {useApp} from "@/mixins/app.js";
import CostBenefitChart from "@/components/charts/CostBenefitChart.vue";
import CostsTrendBarChart from "@/components/charts/CostsTrendBarChart.vue";
import BenefitsTrendBarChart from "@/components/charts/BenefitsTrendChart.vue";
import PresentValueBarChart from "@/components/charts/PresentValueBarChart.vue";


export default {
  name: "CostBenefitAnalyzer",
  components: {PresentValueBarChart, BenefitsTrendBarChart, CostsTrendBarChart, CostBenefitChart},
  setup() {
    const {optimization} = useApp();
    const tab = ref('one');
    const files = ref(null);
    const uploadResponse = ref(null);
    const currentTab = ref('');
    const panel = ref(0);
    const loader = ref(false);


    const handleFileUpload = async () => {
      loader.value = true;
      const formData = new FormData();

      // If multiple files can be selected, iterate over them
      for (let file of files.value) {
        formData.append("file", file); // Adjust the name "files[]" based on your API endpoint's expectation
      }

      try {
        uploadResponse.value = await optimization(formData);
        loader.value = false;
        // Handle response here (e.g., show a success message)
      } catch (error) {
        console.error("Error uploading file:", error);
        loader.value = false;
        // Handle error here (e.g., show an error message)
      }
    };

    return {
      tab,
      handleFileUpload,
      files,
      uploadResponse,
      optimization,
      currentTab,
      panel,
      loader
    };
  }
};

</script>

<style>
.v-expansion-panel-text__wrapper {
  padding: 0px !important;
}
</style>

