<template>
  <v-app-bar :flat="true">
    <template v-slot:prepend>
      <v-btn
        v-if="isLoggedIn"
        color="primary"
        icon="mdi-menu"
        variant="text"
        @click.stop="rail = !rail"
      ></v-btn>
      <img v-if="!rail" alt="logo" class="mr-5" height="50" src="/img.png"/>
    </template>
    <template v-slot:append>
      <v-btn v-if="!isLoggedIn" @click="login" class="bg-primary" color="white" variant="text">
        <v-icon>mdi-login</v-icon>
        Login
      </v-btn>
    </template>
    <v-app-bar-title class="font-weight-bold text-h5 text-dark">
      <template v-slot:text>
        <v-icon class="mb-1" size="36">
          {{ title === 'Home' ? 'mdi-home' : title === 'Performance Assessment' ? 'mdi-chart-line' : title === 'Recommender' ? 'mdi-checkbox-multiple-marked-outline' : 'mdi-chart-bar'}}
        </v-icon>
        {{ title }}
      </template>
    </v-app-bar-title>
  </v-app-bar>
  <v-navigation-drawer v-if="isLoggedIn" disable-route-watcher v-model="drawer" :rail="rail" class="border-e-0" color="primary" permanent>
    <v-divider opacity="0.5"></v-divider>
    <v-list ref="navDrawer" :nav="true" dense>
      <template v-for="(item, index) in navItems" :key="index">
        <v-tooltip v-if="rail" location="right">
          <template v-slot:activator="{ props }">
            <v-list-item :active="false" :link="true" :prepend-icon="item.icon"
                         :title="rail ? item.title : ''"
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
    <template v-slot:append>
      <v-divider></v-divider>
      <v-menu v-if="isLoggedIn" location="right">
        <template v-slot:activator="{ props }">
          <v-list class="mb-8">
            <v-list-item class="px-2" v-bind="props">
              <template v-slot:prepend>
                <v-avatar size="36">
                  <v-icon size="x-large" class="opacity-60" color="white">mdi-face-man</v-icon>
                </v-avatar>
              </template>
              <v-list-item-title v-if="isLoggedIn.username">
                {{ isLoggedIn.username }}
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ isLoggedIn.email }}
              </v-list-item-subtitle>
            </v-list-item>
            <v-divider></v-divider>
          </v-list>
        </template>
        <v-list class="mb-3">
          <v-menu location="right">
            <template v-slot:activator="{ props }">
              <v-list>
                <v-list-item v-bind="props">
                  <template v-slot:prepend>
                        <v-icon v-bind="props">mdi-apps</v-icon>
                  </template>

                  <v-list-item-title>
                    Settings
                  </v-list-item-title>
                  <template v-slot:append>
                    <v-icon>mdi-chevron-right</v-icon>
                  </template>
                </v-list-item>
              </v-list>
            </template>
            <v-list>
              <v-list-item @click="hideGuide">
                <v-list-item-title>
                  <v-icon>mdi-eye-off</v-icon>
                  Disable guide on startup
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          <v-menu
            v-model="menu"
            :close-on-content-click="false"
            min-width="460"
            location="right"
          >
            <template v-slot:activator>
              <v-list-item @click="logout">
                <template v-slot:prepend>
                  <v-icon>mdi-logout</v-icon>
                </template>

                <v-list-item-title>Logout</v-list-item-title>
              </v-list-item>
            </template>
          </v-menu>
        </v-list>
      </v-menu>
    </template>

  </v-navigation-drawer>
  <v-snackbar location="top right" color="primary" v-model="showSnackbar" :timeout="3000">
    {{ snackbarMessage }}
    <template v-slot:actions>
      <v-btn color="white" variant="text" @click="showSnackbar = false">
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>

import {onMounted, ref, watch} from "vue";
import {useRoute} from "vue-router";
import {useAuth} from "@/mixins/authStatus";

export default {
  name: "AppBar",
  setup() {
    const route = useRoute();
    const {checkStatus, logout,login } = useAuth(); // Import the logout function
    const title = ref(route.meta.title || 'Cost benefit analyzer'); // Default title
    const drawer = ref(true);
    const menu = ref(false);
    const rail = ref(true);
    const navItems = ref([
      {title: 'Home', icon: 'mdi-home', route: '/home'},
      {title: 'Cost benefit analyzer', icon: 'mdi-chart-bar', route: '/cost-benefit-analyzer'},
      {title: 'Performance Assessment', icon: 'mdi-chart-line', route: '/assessment'},
      {title: 'Recommender', icon: 'mdi-checkbox-multiple-marked-outline', route: '/recommender'},
    ]);

    const isLoggedIn = ref(false);
    const showSnackbar = ref(false);
    const snackbarMessage = ref('');

    const checkLoginStatus = async () => {
      isLoggedIn.value = await checkStatus();
    };

    const hideGuide = () => {
      sessionStorage.setItem('showSidebar', 'false');
    };

    onMounted(() => {
      checkLoginStatus();
    });

    watch(route, (newRoute) => {
      title.value = newRoute.meta.title || 'Cost benefit analyzer'; // Update title based on current route
    });

    return {
      hideGuide,
      showSnackbar,
      snackbarMessage,
      logout,
      menu,
      login,
      isLoggedIn,
      title,
      drawer,
      rail,
      navItems,
    };
  }
};


</script>
