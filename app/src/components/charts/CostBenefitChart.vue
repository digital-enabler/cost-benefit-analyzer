<template>
  <v-card class="bg-transparent" height="400px" variant="flat">
    <Line :data="chartData" :options="chartOptions" :style="myStyle"/>
  </v-card>
</template>

<script>
import {defineComponent, reactive, computed} from 'vue';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Filler,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import {Line} from 'vue-chartjs';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Filler, Title, Tooltip, Legend);

export default defineComponent({
  name: 'CostBenefitChart',
  components: {Line},
  props: {
    costData: {
      type: Array,
      required: true
    },
    benefitData: {
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
      const labels = []; // Assuming your data has a 'year' or similar field for labels
      const costsData = []; // Data points for your chart
      const benefitsData = []; // Data points for your chart

      props.costData?.forEach(item => {
        labels.push(`Year ${item.index}`);
        costsData.push(item.values.find(val => val.name === 'costs_cum_sum').value);
      });

      props.benefitData?.forEach(item => {
        benefitsData.push(item.values.find(val => val.name === 'benefits_cum_sum').value);
      });


      return {
        labels,
        datasets: [
          {
            label: 'Costs',
            data: costsData,
            borderColor: 'rgb(255, 99, 132)', // Change to red
            backgroundColor: 'rgba(255, 99, 132, 0.2)', // Change to red with lower opacity

          },
          {
            label: 'Benefits',
            data: benefitsData,
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgb(54, 162, 235)',
          },
        ]
      };
    });

    const chartOptions = reactive({
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          title: {
            display: true,
            text: 'Value'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Year'
          }
        },
      },
      plugins: {
        legend: {
          display: true,
          position: 'right'
        },
        title: { // Adding title configuration here
          display: true, // Ensure the title is displayed
          text: 'Cost and benefit trends', // Set your chart title text
          font: {
            size: 20 // Adjust the font size as needed
          },
          padding: {
            top: 10,
            bottom: 20 // Adjust padding around the title as needed
          },
          color: '#666' // Set the color of the title text
        }
      }

    });

    return {chartData, chartOptions, myStyle};
  }
});
</script>
