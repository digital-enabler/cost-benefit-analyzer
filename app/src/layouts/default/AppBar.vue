<template>
  <v-app-bar :flat="true">
    <template v-slot:prepend>
      <v-btn
        color="primary"
        icon="mdi-menu"
        variant="text"
        @click.stop="rail = !rail"
      ></v-btn>
      <img alt="logo" class="mr-15" height="50" src="../../assets/img.png"/>
    </template>
    <template v-slot:append>
      <v-btn color="primary" variant="tonal">
        <v-icon>mdi-logout</v-icon>
        Logout
      </v-btn>
    </template>
    <v-app-bar-title class="font-weight-bold text-h5">
      <v-icon class="mb-1" size="36">
        {{ title === 'Home' ? 'mdi-home' : title === 'Simulation' ? 'mdi-xml' : 'mdi-chart-bar' }}
      </v-icon>
      {{ title }}
    </v-app-bar-title>
  </v-app-bar>
  <v-navigation-drawer v-model="drawer" :rail="rail" color="primary" permanent @click="rail = false">
    <v-list ref="navDrawer" :nav="true">
      <v-list-item :active="false" :link="true" prepend-icon="mdi-home" title="Home" to="/"
                   @click="updateTitle('Home')"/>
      <v-list-item :active="false" :link="true" prepend-icon="mdi-xml" title="Simulation"
                   to="/simulation" @click="updateTitle('Simulation')"/>
      <v-list-item :active="false" :link="true" prepend-icon="mdi-chart-bar"
                   title="Cost benefit analyzer" to="/cost-benefit-analyzer" @click="updateTitle('Cost benefit analyzer')"/>
    </v-list>
  </v-navigation-drawer>
</template>

<script>

import {ref} from "vue";

export default {
  name: "AppBar",
  setup() {
    const title = ref('Home');
    const drawer = ref(true);
    const rail = ref(true);

    const updateTitle = (value) => {
      title.value = value;
    }
    return {
      title,
      updateTitle,
      drawer,
      rail
    };
  }
};


</script>

<style>
.v-toolbar__prepend {
  margin: 0 0 0 5px !important;
  width: 250px !important;
}
</style>
