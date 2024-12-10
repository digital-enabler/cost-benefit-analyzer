<template>
  <v-container fluid>
    <v-row :justify="showSidebar === true ? 'start' : 'center'">
      <v-col :cols="8" class="text-right">
        <v-switch
          color="primary"
          v-model="showHints"
          label="Show Hints"
          hide-details
          @click="handleHints"
        ></v-switch>
      </v-col>
    </v-row>
    <v-row :justify="showSidebar === true ? 'start' : 'center'">
      <v-col :cols="8">
        <v-form ref="form" v-model="isValid" lazy-validation>
          <v-card>
            <v-card-title>Compare a feature among different NBS</v-card-title>
            <v-card-text>
              <v-select
                density="compact"
                v-model="selectedFeature"
                :items="nbsFeatures"
                class="mb-10"
                hint="Select the ecosystem service to analyze across NBSs"
                :persistent-hint="showHints"
                label="Select a feature"
                variant="outlined"
                :rules="[v => !!v || 'Feature is required']"
              ></v-select>
              <v-slider
                v-model="topMostNbs"
                :min="3"
                :max="10"
                label="#Top Most NBS"
                class="mb-4"
                hint="Specify the number of top-performing NBS to include in the analysis (minimum 3)."
                :persistent-hint="showHints"
                step="1"
                thumb-label="always"
              ></v-slider>
              <v-btn class="mt-2 mr-2" color="primary" @click="handleExtractMostSignificantNBS">Extract Most Significant NBS</v-btn>
              <v-btn
                class="mt-2"
                color="primary"
                @click="resetFields"
              >
                Start Over
              </v-btn>
            </v-card-text>
          </v-card>
        </v-form>
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
      <!-- Chart -->
      <v-col cols="8" v-else-if="showChart && !loading">
        <v-card outlined>
          <v-card-title>Extracted NBS</v-card-title>
          <v-card-text>
            <v-alert v-if="chartData.labels.length === 0" type="info">No data available</v-alert>
            <ReusableChart v-else type="radar" :data="chartData" :options="chartOptions" />
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
  name: 'TabThree',
  components: {
    ReusableChart,
  },
  props: {
    showSidebar:{
      type: Boolean
    }
  },
  setup() {
    const { getNbsMapInfo, extractMostSignificantNBS } = useApp();

    const nbsFeatures = ref([]);
    const selectedFeature = ref('');
    const topMostNbs = ref(5);
    const chartData = ref({
      labels: [],
      datasets: [],
    });

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
        },
      },
    });

    const isValid = ref(false);
    const showChart = ref(false);
    const loading = ref(false);
    const form = ref(null);
    const showHints = ref(sessionStorage.getItem('toNbsHints') !== 'true');

    const handleHints = ()  => {
      sessionStorage.setItem('toNbsHints', String(showHints.value));
    }

    const fetchNbsMapInfo = async () => {
      try {
        const data = await getNbsMapInfo();
        nbsFeatures.value = data.nbs_features;
      } catch (error) {
        console.error('Error fetching NBS map info:', error);
      }
    };

    onMounted(() => {
      fetchNbsMapInfo();
    });

    const handleExtractMostSignificantNBS = async () => {
      const {valid} = await form.value.validate();
      showChart.value = false;
      if (valid) {
        loading.value = true;
        try {
          const payload = {
            indicator: selectedFeature.value,
            top_k: topMostNbs.value,
          };
          const data = await extractMostSignificantNBS(payload);
          if (data && data.nbs) {
            const labels = Object.keys(data.nbs);
            const values = Object.values(data.nbs);

            // Ensure at least 3 data points for radar chart
            while (labels.length < 3) {
              labels.push('');
              values.push(0);
            }

            chartData.value = {
              labels,
              datasets: [
                {
                  label: 'Extracted NBS',
                  data: values,
                  backgroundColor: 'rgba(54, 162, 235, 0.2)',
                  borderColor: 'rgba(54, 162, 235, 1)',
                  borderWidth: 1,
                },
              ],
            };
            showChart.value = true;
          } else {
            chartData.value = {
              labels: [],
              datasets: [],
            };
            showChart.value = true;
          }
        } catch (error) {
          console.error('Error extracting most significant NBS:', error);
        } finally {
          loading.value = false;
        }
      }
    };

    const resetFields = () => {
      selectedFeature.value = '';
      topMostNbs.value = 5;
      chartData.value = { labels: [], datasets: [] };
      showChart.value = false;
      form.value.reset();
    };

    return {
      showHints,
      nbsFeatures,
      selectedFeature,
      topMostNbs,
      chartData,
      chartOptions,
      isValid,
      showChart,
      loading,
      form,
      handleExtractMostSignificantNBS,
      resetFields,
      handleHints
    };
  },
};
</script>
