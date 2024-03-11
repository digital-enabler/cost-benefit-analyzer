<template>
  <v-card class="bg-transparent" height="400px" variant="flat">
    <Bar :data="chartData" :options="chartOptions" :style="myStyle"/>
  </v-card>
</template>

<script>
import {defineComponent, reactive, computed} from 'vue';
import {Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend} from 'chart.js';
import {Bar} from 'vue-chartjs';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default defineComponent({
  name: 'BenefitsTrendBarChart',
  components: {Bar},
  props: {
    benefitsData: {
      type: Array,
      required: true
    }
  },
  setup(props) {
    const myStyle = reactive({
      width: '100%',
      height: '100%',
    });

    const chartData = computed(() => {
      const labels = props.benefitsData.map(item => `Year ${item.index}`);
      const annualBenefitsData = props.benefitsData.map(item => item.values.find(val => val.name === 'annual_benefits')?.value || 0);
      const startingBenefitsData = props.benefitsData.map(item => item.values.find(val => val.name === 'starting_benefits')?.value || 0);

      return {
        labels,
        datasets: [
          {
            label: 'Annual Benefits',
            data: annualBenefitsData,
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgb(54, 162, 235)',
            borderWidth: 1,
          },
          {
            label: 'Starting Benefits',
            data: startingBenefitsData,
            backgroundColor: 'rgba(255, 206, 86, 0.5)',
            borderColor: 'rgb(255, 206, 86)',
            borderWidth: 1,
          }
        ]
      };
    });

    const chartOptions = reactive({
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Benefits Value'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Year'
          }
        }
      },
      plugins: {
        legend: {
          display: true,
          position: 'right'
        },
        title: {
          display: true,
          text: 'Benefits over time',
          font: {
            size: 20
          },
          padding: {
            top: 20,
            bottom: 30
          }
        }
      }
    });

    return {chartData, chartOptions, myStyle};
  }
});
</script>

<style scoped>
/* Add any additional styling you need here */
</style>
