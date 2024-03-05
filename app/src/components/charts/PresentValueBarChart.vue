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
  name: 'PresentValueBarChart',
  components: {Bar},
  props: {
    presentValueData: {
      type: Array,
      required: true
    }
  },
  setup(props) {
    const myStyle = reactive({
      width: '100%',
      height: '100%',
    });
    const discountRate = props.presentValueData.map(item => item.values.find(val => val.name === 'Discount Rate%')?.value || 0);
    const horizon = props.presentValueData.map(item => item.values.find(val => val.name === 'Horizon')?.value || 0);


    const chartData = computed(() => {
      const labels = [''];
      const costsData = props.presentValueData.map(item => item.values.find(val => val.name === 'Costs')?.value || 0);
      const benefitsData = props.presentValueData.map(item => item.values.find(val => val.name === 'Benefits')?.value || 0);
      const netBenefitData = props.presentValueData.map(item => item.values.find(val => val.name === 'Net Benefit')?.value || 0);

      return {
        labels: labels,
        datasets: [
          {
            label: 'Costs',
            data: [costsData], // Only provide value for 'Costs', set others to null
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            borderColor: 'rgb(255, 99, 132)',
            borderWidth: 1,
          },
          {
            label: 'Benefits',
            data: [benefitsData], // Only provide value for 'Benefits', set others to null
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgb(54, 162, 235)',
            borderWidth: 1,
          },
          {
            label: 'Net Benefit',
            data: [netBenefitData], // Only provide value for 'Net Benefit', set others to null
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
            borderColor: 'rgb(75, 192, 192)',
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
            text: 'Present value - (' + discountRate + '% discount rate, ' + horizon + 'year horizon, ' + ')',
          }
        },
      },
      plugins: {
        legend: {
          display: true,
          position: 'right'
        },
        title: {
          display: true,
          text: 'Present Value Analysis',
          font: {
            size: 16
          },
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              // Extract the label and value
              const label = context.dataset.label;
              const value = context.parsed.y;
              // Return the custom tooltip label
              return `${label}: ${value}`;
            }
          }
        }
      }
    });

    return {chartData, chartOptions, myStyle};
  }
});
</script>

<style scoped>
/* Additional styling if needed */
</style>
