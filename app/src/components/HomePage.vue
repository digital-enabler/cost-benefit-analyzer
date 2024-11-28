<template>
  <v-container
    class="h-100 homepage-cover d-flex flex-column"
    fluid
  >
    <!-- Header Section -->
    <v-row align="start" justify="start" class="text-white flex-grow-1" dense>
      <v-col cols="6">
        <h1 class="text-h3 font-weight-medium text-primary">
          The economics of nature-based solutions.
        </h1>
      </v-col>
      <v-col offset="1">
        <p class="text-body-2 text-justify">
          Invest4Nature is an EU-funded project that contributes to the creation of a
          market for nature-based solutions. A group of 15 partners from 11 European
          countries prepare the grounds for investments in nature-based solutions by
          evaluating its benefits and economic performance.
        </p>
        <p class="text-body-1 text-justify mt-1" v-if="!isLoggedIn">
          If you are already a registered user, you can
          <span class="text-primary font-weight-bold text-decoration-none cursor-pointer" @click="handleLoginClick">
            login here
          </span>.
        </p>
      </v-col>
    </v-row>

    <!-- Cards Section -->
    <v-row justify="space-around" dense>
      <!-- First Card -->
      <v-col cols="12" md="4">
        <v-card
          height="520"
          class="pa-3 tool"
          elevation="2"
        >
          <v-img
            src="cost-benefit-analyzer.png"
            height="150px"
            contain
          ></v-img>
          <v-card-title class="text-subtitle-1 font-weight-bold">Costs - Benefit Analyzer</v-card-title>
          <v-card-text class="text-body-2 mb-10">
            <h4 class="text-caption font-weight-medium mb-1">Purpose</h4>
            <p>
              The tool supports typical financial decision support methods, such as Cost-Benefit Analysis (CBA) and Cost-Effectiveness Analysis (CEA), providing advanced insights and investment guidelines.
            </p>
            <h4 class="text-caption font-weight-medium mb-1 mt-1">Typical Users</h4>
            <p>
              Urban and consultancy agencies planners; companies working with biodiversity; Nature-Based Enterprise; professional users.
            </p>
            <h4 class="text-caption font-weight-medium mb-1 mt-1">Prerequisites</h4>
            <p>
              An economic and financial background is a nice to have.
            </p>
          </v-card-text>
          <v-card-actions class="mt-auto">
            <v-btn color="primary" href="/cost-benefit-analyzer" block>
              Open Cost Benefit Analyzer
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <!-- Second Card -->
      <v-col cols="12" md="4">
        <v-card
          height="520"
          class="pa-3 tool"
          elevation="2"
        >
          <v-img
            src="performance-assessment.webp"
            height="150px"
            contain
          ></v-img>
          <v-card-title class="text-subtitle-1 font-weight-bold">Performance Assessment</v-card-title>
          <v-card-text class="text-body-2 text-justify">
            <h4 class="text-caption font-weight-medium mb-1">Purpose</h4>
            <p>
              The tool allows for the exploration and analysis of qualitative indicators related to the benefits of an NBS solution. It is an effective approach to demonstrate how specific features and solutions are linked to addressing environmental or sustainability challenges.
            </p>
            <h4 class="text-caption font-weight-medium mb-1 mt-1">Typical Users</h4>
            <p>
              Urban and consultancy agencies planners; companies working with biodiversity; non-professional users.
            </p>
            <h4 class="text-caption font-weight-medium mb-1 mt-1">Prerequisites</h4>
            <p>
              No prerequisites needed.
            </p>
          </v-card-text>
          <v-card-actions class="mt-auto">
            <v-btn color="primary" href="/assessment" block>
              Open Performance Assessment
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <!-- Third Card -->
      <v-col cols="12" md="4">
        <v-card
          height="520"
          class="pa-3 tool"
          elevation="2"
        >
          <v-img
            src="recommender.webp"
            height="150px"
            contain
          ></v-img>
          <v-card-title class="text-subtitle-1 font-weight-bold">Recommender System</v-card-title>
          <v-card-text class="text-body-2 mb-10">
            <h4 class="text-caption font-weight-medium mb-1">Purpose</h4>
            <p>
              The tool enables the exploration and analysis of recommendations for Nature-Based Solutions based on a simple free-text description of the NBS.
            </p>
            <h4 class="text-caption font-weight-medium mb-1 mt-1">Typical Users</h4>
            <p>
              Urban and consultancy agencies planners; companies working with biodiversity; non-professional users; researchers.
            </p>
            <h4 class="text-caption font-weight-medium mb-1 mt-1">Prerequisites</h4>
            <p>
              Just curiosity and desire to learn.
            </p>
          </v-card-text>
          <v-card-actions class="mt-auto">
            <v-btn color="primary" href="/recommender" block>
              Open Recommender
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <!-- Contact Section -->
    <v-row justify="center" dense>
      <v-col cols="12">
        <v-card
          elevation="1"
          style="background: rgba(0, 0, 0, 0.8); color: white;"
        >
          <v-card-title class="text-subtitle-1">
            Support
          </v-card-title>
          <v-card-text class="text-body-2">
            If you have any questions or need assistance, please reach out to our
            support team at:
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
import {onMounted, ref} from "vue";
import {useAuth} from "@/mixins/authStatus";

const isLoggedIn = ref(false);
const {checkStatus } = useAuth();

const checkLoginStatus = async () => {
  isLoggedIn.value = await checkStatus();
};

function handleLoginClick() {
  // Redirect to login page
  window.location.href = apiUrl + "/invest4nature/auth/login";
}

onMounted(() => {
  checkLoginStatus();
})
</script>

<style scoped>
/* Optional additional styling for better aesthetics */
.tool {
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.homepage-cover{
  background: url('/i4n-keyvisuals-2022.jpg') no-repeat fixed center;
  background-size: cover;
  display: flex;
  flex-direction: column;
}
</style>
