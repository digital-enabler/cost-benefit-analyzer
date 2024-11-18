<template>
  <v-card class="bg-transparent" height="400px" variant="flat">
    <component :is="chartComponent" :data="chartData" :options="chartOptions" :style="myStyle"/>
  </v-card>
</template>

<script>
import { defineComponent, reactive, computed } from 'vue';
import { Chart as ChartJS, CategoryScale, LinearScale, RadialLinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Bar, Radar } from 'vue-chartjs';

ChartJS.register(CategoryScale, LinearScale, RadialLinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

export default defineComponent({
  name: 'AssessmentReusableChart',
  props: {
    type: {
      type: String,
      required: true,
      validator: value => ['bar', 'radar'].includes(value),
    },
    data: {
      type: Object,
      required: true,
    },
    options: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const myStyle = reactive({
      width: '100%',
      height: '100%',
    });

    const chartComponent = computed(() => {
      return props.type === 'bar' ? Bar : Radar;
    });

    const chartData = computed(() => props.data);
    const chartOptions = computed(() => props.options);

    return { chartComponent, chartData, chartOptions, myStyle };
  },
});
</script>
