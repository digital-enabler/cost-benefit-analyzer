<template>
  <v-container
    class="homepage-cover"
    fluid
  >
    <!-- Header Section -->
    <v-row align="center" justify="start" class="text-white pa-15 mt-15" dense>
      <v-col cols="12" offset-md="1" md="2">
        <v-img height="250px" src="cropped-i4n-icon-01.png"></v-img>
      </v-col>
      <v-col cols="12" md="8">
        <h1 class="text-h3 font-weight-medium text-center text-primary">
          Invest4Nature Decision Support Service
        </h1>
        <p class="text-h5 text-center">
          A tool to aid effective investment decision making.
        </p>
        <v-row justify="center">
          <v-btn v-if="!isLoggedIn" prepend-icon="mdi-adjust" color="primary" class="mt-15" @click="handleLoginClick">Get Started</v-btn>
        </v-row>
      </v-col>
    </v-row>

    <!-- Cost-Benefit Analyzer Section -->
    <v-row align="center" class="pa-15">
      <v-col cols="12" md="4" class="tool-opacity rounded-pill">
        <v-img
          src="cost-benefit-analyzer-removebg-preview.png"
          alt="Cost Benefit Analyzer"
          contain
        ></v-img>
      </v-col>
      <v-col cols="12" md="8" class="text-white pl-15">
        <h2 class="text-h4 font-weight-bold mb-3">Costs – Benefit Analyzer</h2>
        <h3 class="font-weight-bold mb-2">Purpose</h3>
        <p class="text-body-1">
          The tool supports typical financial decision support methods, such as
          Cost-Benefit Analysis (CBA) and Cost-Effectiveness Analysis (CEA),
          providing advanced insights and investment guidelines.
        </p>
        <h3 class="font-weight-bold mt-4">Typical Users</h3>
        <p class="text-body-1">
          Urban and consultancy agency planners; companies working with
          biodiversity; Nature-Based Enterprises; professional users.
        </p>
        <h3 class="font-weight-bold mt-4">Prerequisites</h3>
        <p class="text-body-1">An economic and financial background is a nice to have.</p>
        <v-btn color="primary" href="/cost-benefit-analyzer" class="mt-4">
          Open Cost Benefit Analyzer
        </v-btn>
      </v-col>
    </v-row>
    <v-divider color="primary" opacity="0.5"></v-divider>

    <!-- Performance Assessment Section -->
    <v-row align="center" justify="center" class="pa-15">
      <v-col cols="12" md="8" class="pr-15 text-white">
        <h2 class="text-h4 font-weight-bold mb-3">Performance Assessment</h2>
        <h3 class="font-weight-bold mb-2">Purpose</h3>
        <p class="text-body-1">
          The tool allows for exploration and analysis of qualitative indicators
          related to the benefits of an NBS solution. It is an effective
          approach to demonstrate how specific features and solutions address
          environmental challenges.
        </p>
        <h3 class=" font-weight-bold mt-4">Typical Users</h3>
        <p class="text-body-1">
          Urban and consultancy agency planners; companies working with
          biodiversity; non-professional users.
        </p>
        <h3 class=" font-weight-bold mt-4">Prerequisites</h3>
        <p class="text-body-1">No prerequisites needed.</p>
        <v-btn color="primary" href="/assessment" class="mt-4">
          Open Performance Assessment
        </v-btn>
      </v-col>
      <v-col cols="12" md="4" class="rounded tool-opacity">
        <v-img
          src="performance-assessment-removebg-preview.png"
          alt="Performance Assessment"
          contain
        ></v-img>
      </v-col>
    </v-row>
    <v-divider color="primary" opacity="0.5"></v-divider>

    <!-- Recommender System Section -->
    <v-row align="center" justify="center" class="pa-15">
      <v-col cols="12" md="4" class=" rounded-shaped rounded-circle tool-opacity">
        <v-img
          src="recommender-removebg-preview.png"
          alt="Recommender System"
          contain
        ></v-img>
      </v-col>
      <v-col cols="12" md="8" class="pl-15 text-white">
        <h2 class="text-h4 font-weight-bold mb-3">Recommender System</h2>
        <h3 class=" font-weight-bold mb-2">Purpose</h3>
        <p class="text-body-1">
          Enables the exploration and analysis of recommendations for
          Nature-Based Solutions based on a simple free-text description of the
          NBS.
        </p>
        <h4 class="text-subtitle-1 font-weight-bold mt-4">Typical Users</h4>
        <p class="text-body-1">
          Urban and consultancy agency planners; companies working with
          biodiversity; non-professional users; researchers.
        </p>
        <h3 class=" font-weight-bold mt-4">Prerequisites</h3>
        <p class="text-body-1">Just curiosity and desire to learn.</p>
        <v-btn color="primary" href="/recommender" class="mt-4">
          Open Recommender
        </v-btn>
      </v-col>
    </v-row>

    <!-- Contact Section -->
    <v-row justify="center">
      <v-col cols="12">
        <v-card
          elevation="1"
          style="background: rgba(0, 0, 0, 0.8); color: white;"
        >
          <v-card-text class="text-body-2 text-center">
            <a
              href="mailto:support@invest4nature.eu"
              style="color: #53b475; text-decoration: none; font-weight: bold;"
            >
              support@invest4nature.eu
            </a>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import {apiUrl} from "@/mixins/app";
import {ref, onMounted} from "vue";
import {useAuth} from "@/mixins/authStatus";

const isLoggedIn = ref(false);
const {checkStatus} = useAuth();

const checkLoginStatus = async () => {
  isLoggedIn.value = await checkStatus();
};

function handleLoginClick() {
  window.location.href = `${apiUrl}/invest4nature/auth/login`;
}

onMounted(() => {
  checkLoginStatus();
});
</script>

<style scoped>
.homepage-cover {
  background: url('/i4n-keyvisuals-2022.jpg') no-repeat center center fixed;
  background-size: cover;
}

.tool-opacity{
  background-color: rgba(83, 180, 117, 0.6);
}

</style>
