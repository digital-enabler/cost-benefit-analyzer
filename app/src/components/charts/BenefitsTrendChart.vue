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

    const generateRandomColor = () => {
      const r = Math.floor(Math.random() * 256);
      const g = Math.floor(Math.random() * 256);
      const b = Math.floor(Math.random() * 256);
      return `rgb(${r},${g},${b})`;
    }

    const chartData = computed(() => {
      const labels = props.benefitsData.map(item => `Year ${item.index}`);
      const datasets = [];

      props.benefitsData.forEach((yearData, index) => {
        // Filter out the unwanted keys
        const filteredValues = yearData.values.filter(val => !['period', 'benefits_sum', 'benefits_cum_sum'].includes(val.name));

        filteredValues.forEach(val => {
          let dataset = datasets.find(d => d.label === val.name);
          if (!dataset) {
            const color = generateRandomColor(); // Generate a random color for the dataset
            dataset = {
              label: val.name,
              data: new Array(props.benefitsData.length).fill(0),
              backgroundColor: color, // Use the generated random color for the bar
              borderColor: color, // Use the same color for the border
            };
            datasets.push(dataset);
          }
          dataset.data[index] = val.value;
        });
      });

      return {labels, datasets};
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
