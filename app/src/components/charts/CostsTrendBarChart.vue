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
  name: 'CostsTrendBarChart',
  components: {Bar},
  props: {
    costData: {
      type: Array,
      required: true
    }
  },
  setup(props) {
    const myStyle = reactive({
      width: '100%',
      height: '100%',
    });

    function generateRandomColor() {
      const r = Math.floor(Math.random() * 256);
      const g = Math.floor(Math.random() * 256);
      const b = Math.floor(Math.random() * 256);
      return `rgb(${r},${g},${b})`;
    }


    const chartData = computed(() => {
      const labels = props.costData.map(item => `Year ${item.index}`);
      const datasets = [];

      const colorPalette = [
        '#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6',
        '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
        '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A',
        '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
        '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC',
        '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
        '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680'
      ];

      props.costData.forEach((yearData, index) => {
        // Filter out the unwanted keys
        const filteredValues = yearData.values.filter(val => !['period', 'costs_sum', 'costs_cum_sum'].includes(val.name));

        filteredValues.forEach((val, valIndex) => {
          let dataset = datasets.find(d => d.label === val.name);
          if (!dataset) {
            const colorIndex = valIndex % colorPalette.length; // Loop over the color palette
            const color = colorPalette[colorIndex]; // Use a color from the predefined palette
            dataset = {
              label: val.name,
              data: new Array(props.costData.length).fill(0),
              backgroundColor: color,
              borderColor: color,
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
            text: 'Cost Value'
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
        title: { // Adding title configuration here
          display: true, // Ensure the title is displayed
          text: 'Costs over time', // Set your chart title text
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
