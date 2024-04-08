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
      const datasets = [];

      // Predefined color palette
      const colorPalette = [
        '#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6',
        '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
        '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A',
        '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
        '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC',
        '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
        '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680'
      ];

      props.benefitsData.forEach((yearData, index) => {
        // Filter out the unwanted keys
        const filteredValues = yearData.values.filter(val => !['period', 'benefits_sum', 'benefits_cum_sum'].includes(val.name));

        filteredValues.forEach((val, valIndex) => {
          let dataset = datasets.find(d => d.label === val.name);
          if (!dataset) {
            const colorIndex = valIndex % colorPalette.length; // Loop over the color palette
            const color = colorPalette[colorIndex]; // Use a color from the predefined palette
            dataset = {
              label: val.name,
              data: new Array(props.benefitsData.length).fill(0),
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
