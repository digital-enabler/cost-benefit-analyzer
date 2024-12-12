<template>
  <v-container fluid>
    <v-row :justify="showSidebar === true ? 'start' : 'center'">
      <v-col :cols="showSidebar || !showNbsExtractor ? 8 : 12" class="text-right">
        <v-switch
          color="primary"
          v-model="showHints"
          label="Show Hints"
          @click="handleHints"
          hide-details
        ></v-switch>
      </v-col>
    </v-row>
    <v-row :justify="showSidebar === true ? 'start' : 'center'">
      <v-col :cols="8">
        <v-form ref="form" v-model="isValid" lazy-validation>
          <v-card>
            <v-card-title>Explore the features of NBS</v-card-title>
            <v-card-text>
              <v-autocomplete
                class="mt-2 mb-8"
                density="compact"
                hint="Select one or more NBS components for the scoring analysis."
                :persistent-hint="showHints"
                v-model="selectedNbs"
                :items="nbsList"
                label="Select an NBS or a composition of NBS"
                multiple
                variant="outlined"
                :rules="[v => !!v && v.length > 0 || 'At least one NBS must be selected']"
              >
                <template v-slot:details>
                  <div style="line-height: 16px" class="text-grey">
                    or input text for the <span class="cursor-pointer text-blue" @click="toggleNbsExtractor">NBS natural language extractor</span>
                  </div>
                </template>
              </v-autocomplete>
              <v-select
                class="mt-2 mb-8"
                density="compact"
                v-model="selectedServices"
                hint="Choose the ecosystem services group to visualize"
                :persistent-hint="showHints"
                :items="nbsServices"
                multiple
                label="Select the information to visualize"
                variant="outlined"
                :rules="[v => !!v && v.length > 0 || 'At least one service must be selected']"
              ></v-select>
              <v-select
                density="compact"
                class="mt-2 mb-5"
                hint="Choose the calculation policy for the combination of NBS"
                :persistent-hint="showHints"
                v-model="selectedCalculationPolicy"
                :items="calculationPolicies"
                label="Select the calculation policy"
                variant="outlined"
                :rules="[v => !!v || 'Calculation policy is required']"
              ></v-select>
              <v-btn class="mt-2 mr-2" color="primary" @click="handleCalculateIndicators">Calculate Indicators</v-btn>
              <v-btn
                class="mt-2"
                color="primary"
                @click="resetFields"
              >
                Start Over
              </v-btn>
           <div class="text-caption mt-2">
             * Indicators are specific for Urban Landscape.
           </div>
            </v-card-text>
          </v-card>
        </v-form>
      </v-col>

      <v-col :cols="showSidebar===true?8:4" v-if="showNbsExtractor">
        <v-expand-transition>
          <v-alert
            color="primary"
            border="start" elevation="1" variant="outlined">
          <v-form ref="extractorForm" v-model="isExtractorValid" lazy-validation>
            <v-card
            >
              <v-card-title class="mb-2">NBS Natural Language Extractor</v-card-title>
              <v-card-text>
                <v-textarea
                  label="NBS description"
                  v-model="inputText"
                  placeholder="Input your NBS description"
                  persistent-placeholder
                  :persistent-hint="showHints"
                  hint="Describe your NBS solution in a natural way. Be as descriptive as possible about the planned actions and the components used."
                  variant="outlined"
                  rows="9"
                  :rules="[v => !!v || 'Description is required']"
                ></v-textarea>
                <h4 v-if="extractedNbsData" class="mb-2">The tool found these similarity scores:</h4>
                <v-code v-if="extractedNbsData">
                  {{extractedNbsData?.nbs_found}}
                </v-code>
              </v-card-text>
              <v-card-actions class="mt-0 pt-0">
                <v-spacer></v-spacer>
                <v-btn class="mt-2 text-white bg-primary" @click="extractNBSData">Extract NBS</v-btn>
              </v-card-actions>
            </v-card>
          </v-form>
          </v-alert>
        </v-expand-transition>
      </v-col>

      <!-- Progress Circular -->
      <v-col cols="12" v-if="loading" class="d-flex justify-center align-center">
        <v-progress-circular
          :size="70"
          :width="7"
          indeterminate
          color="primary"
          class="mx-auto"
        ></v-progress-circular>
      </v-col>
    </v-row>

    <v-row :justify="showSidebar === true ? 'start' : 'center'">
      <!-- Charts for Calculate Indicators result -->
      <v-col :cols="8"  v-for="(chart, index) in chartDataList" :key="index">
        <v-card v-if="!loading">
          <v-card-title>{{ chart.title }}</v-card-title>
          <v-card-text>
            <v-alert v-if="chart.data.labels.length === 0" type="info">No data available</v-alert>
            <ReusableChart v-else type="radar" :data="chart.data" :options="chartOptions" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { ref, onMounted } from 'vue';
import ReusableChart from '@/components/charts/AssessmentReusableChart.vue';
import { useApp } from '@/mixins/app';

export default {
  name: 'TabTwo',
  components: {
    ReusableChart,
  },
  props: {
    showSidebar:{
      type: Boolean
    }
  },
  setup() {
    const {getNbsMapInfo, calculateIndicators, extractNBS} = useApp();

    const nbsList = ref([]);
    const nbsServices = ref([]);
    const calculationPolicies = ref(['min', 'mean', 'max']);
    const selectedNbs = ref([]);
    const selectedServices = ref(['Provisioning', 'Regulating', 'Cultural/Social', 'Biodiversity']);
    const selectedCalculationPolicy = ref('mean');
    const chartDataList = ref([]);
    const isValid = ref(false);
    const isExtractorValid = ref(false);
    const showChart = ref(false);
    const extractedNbsData = ref(null);
    const loading = ref(false);
    const showNbsExtractor = ref(false);
    const inputText = ref('');
    const form = ref(null);
    const extractorForm = ref(null);
    const showHints = ref(sessionStorage.getItem('nbsToHints') !== 'true');
    const chartOptions = ref({
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Values',
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: 'Calculated Indicators',
        },
      },
    });

    const handleHints = ()  => {
      sessionStorage.setItem('nbsToHints', String(showHints.value));
    }

    const fetchNbsMapInfo = async () => {
      try {
        const data = await getNbsMapInfo();
        nbsList.value = data.nbs_list;
        nbsServices.value = data.nbs_services;
      } catch (error) {
        console.error('Error fetching NBS map info:', error);
      }
    };

    onMounted(() => {
      fetchNbsMapInfo();
    });

    const toggleNbsExtractor = () => {
      showNbsExtractor.value = !showNbsExtractor.value;
    };

    const handleCalculateIndicators = async () => {
      const {valid} = await form.value.validate();
      showChart.value = false;
      if (valid) {
        loading.value = true;
        try {
          const payload = {
            nbs: selectedNbs.value,
            services: selectedServices.value,
            policy: selectedCalculationPolicy.value,
          };
          const data = await calculateIndicators(payload);
          if (data && data.indicators) {
            chartDataList.value = Object.entries(data.indicators).map(([service, indicators]) => {
              const labels = Object.keys(indicators);
              const values = Object.values(indicators);

              // Ensure at least 3 data points for radar chart
              while (labels.length < 3) {
                labels.push('');
                values.push(0);
              }

              return {
                title: service,
                data: {
                  labels,
                  datasets: [
                    {
                      label: service,
                      data: values,
                      backgroundColor: 'rgba(54, 162, 235, 0.2)',
                      borderColor: 'rgba(54, 162, 235, 1)',
                      borderWidth: 1,
                    },
                  ],
                },
              };
            });
            showChart.value = true;
          } else {
            chartDataList.value = [];
            showChart.value = true;
          }
        } catch (error) {
          console.error('Error calculating indicators:', error);
        } finally {
          loading.value = false;
        }
      }
    };

    const extractNBSData = async () => {
      const {valid} = await extractorForm.value.validate();
      if (valid) {
        loading.value = true;
        try {
          extractedNbsData.value = await extractNBS(inputText.value);
          selectedNbs.value = Object.keys(extractedNbsData.value.nbs_found); // Populate the selectedNbs array with keys from the API response
        } catch (error) {
          console.error('Error extracting NBS:', error);
        } finally {
          loading.value = false;
        }
      }
    };
    const resetFields = () => {
      selectedServices.value = ['Provisioning', 'Regulating', 'Cultural/Social', 'Biodiversity'];
      selectedNbs.value = [];
      selectedCalculationPolicy.value = 'mean';
      showChart.value = false;
    };

    return {
      showHints,
      nbsList,
      nbsServices,
      calculationPolicies,
      selectedNbs,
      selectedServices,
      selectedCalculationPolicy,
      chartDataList,
      chartOptions,
      isValid,
      isExtractorValid,
      resetFields,
      showChart,
      loading,
      showNbsExtractor,
      extractNBSData,
      handleCalculateIndicators,
      toggleNbsExtractor,
      inputText,
      form,
      extractorForm,
      extractedNbsData,
      handleHints
    }
  },
}
</script>
