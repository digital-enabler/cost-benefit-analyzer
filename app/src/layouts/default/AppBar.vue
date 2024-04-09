<template>
  <v-app-bar :flat="true">
    <template v-slot:prepend>
      <v-btn
        color="primary"
        icon="mdi-menu"
        variant="text"
        @click.stop="rail = !rail"
      ></v-btn>
      <img alt="logo" class="mr-15" height="50" src="/img.png"/>
    </template>
    <template v-slot:append>
      <v-btn color="primary" variant="tonal">
        <v-icon>mdi-login</v-icon>
        Login
      </v-btn>
    </template>
    <v-app-bar-title class="font-weight-bold text-h5">
      <v-icon class="mb-1" size="36">
        {{ title === 'Home' ? 'mdi-home' : title === 'Simulation' ? 'mdi-xml' : 'mdi-chart-bar' }}
      </v-icon>
      {{ title }}
    </v-app-bar-title>
  </v-app-bar>
  <v-navigation-drawer v-model="drawer" :rail="rail" class="border-e-0" color="primary" permanent @click="rail = false">
    <v-list ref="navDrawer" :nav="true" dense>
      <template v-for="(item, index) in navItems" :key="index">
        <v-tooltip v-if="rail" location="right">
          <template v-slot:activator="{ props }">
            <v-list-item :active="false" :link="true" :prepend-icon="item.icon" :title="rail ? item.title : 'test'"
                         :to="item.route" v-bind="props">
            </v-list-item>
          </template>
          <span>{{ item.title }}</span>
        </v-tooltip>
        <v-list-item v-else :active="false" :link="true" :prepend-icon="item.icon" :title="item.title"
                     :to="item.route">
        </v-list-item>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<script>

import {ref, watch} from "vue";
import {useRoute} from "vue-router";

export default {
  name: "AppBar",
  setup() {
    const route = useRoute();
    const title = ref(route.meta.title || 'Cost benefit analyzer'); // Default title
    const drawer = ref(true);
    const rail = ref(true);
    const navItems = ref([
      {title: 'Home', icon: 'mdi-home', route: '/home'},
      {title: 'Cost benefit analyzer', icon: 'mdi-chart-bar', route: '/cost-benefit-analyzer'},
      {title: 'Simulation', icon: 'mdi-xml', route: '/simulation'},
    ]);

    watch(route, (newRoute) => {
      title.value = newRoute.meta.title || 'Cost benefit analyzer'; // Update title based on current route
    });

    return {
      title,
      drawer,
      rail,
      navItems
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
