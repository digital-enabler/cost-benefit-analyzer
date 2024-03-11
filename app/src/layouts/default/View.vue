<template>
  <v-main>
    <router-view/>
  </v-main>

  <v-footer :app="true" color="primary" height="40">
    <v-card
      class="text-left d-flex align-center"
      color="primary"
      max-height="40"
      variant="flat"
      width="30%"
    >
      <v-card-text class="text-white text-caption">&emsp;</v-card-text>
    </v-card>
    <v-card
      class="text-center"
      color="primary"
      max-height="40"
      variant="flat"
      width="40%"
    >
      <v-card-text
        class="text-white text-caption d-flex justify-center align-center pa-1"
      >
        <v-img
          alt="eng-logo"
          max-width="38"
          src="../../assets/core-images_eng_logo_minimal_white.svg"/>
        &emsp;
        {{ normalizedCopyright }}
      </v-card-text>
    </v-card>
    <v-card
      class="text-right d-inline-flex justify-end align-center"
      color="primary"
      max-height="40"
      tile
      variant="flat"
      width="30%"
    >
      <v-card-text class="text-white d-flex align-center">
        &emsp;
      </v-card-text>
    </v-card>
  </v-footer>

</template>

<script>
import {computed} from "vue";

export default {
  name: "View",
  setup() {
    // write a computed property
    const normalizedCopyright = computed(() => {
      return " © " + new Date().getFullYear();
    });

    return {
      normalizedCopyright
    };
  }
};

</script>
