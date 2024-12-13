<template>
  <v-container fluid>
    <v-navigation-drawer
      temporary
      border
      class="pa-2"
      :scrim="false"
      v-model="showSidebar"
      location="right"
      width="500"
      elevation="0"
    >
      <v-card>
        <v-card-title class="text-h5 d-flex align-center justify-space-between w-100">
            Recommender system tool
          <v-btn variant="text" @click="showSidebar = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="mb-5">
          <component :is="getGuideContent()"></component>
        </v-card-text>
      </v-card>
    </v-navigation-drawer>

    <v-btn
      v-if="!showSidebar"
      variant="text"
      color="primary"
      class="position-absolute"
      style="top: 75px; right: 10px; z-index: 1000;"
      @click="showSidebar = true"
    >
      <v-icon size="36">mdi-information-outline</v-icon>
    </v-btn>
    <v-row :justify="showSidebar === true ? 'start' : 'center'">
      <v-col :cols="8" class="text-right">
        <v-switch
          color="primary"
          v-model="showHints"
          @click="handleHint"
          label="Show Hints"
          hide-details
        ></v-switch>
      </v-col>
    </v-row>
    <v-row :justify="showSidebar === true ? 'start' : 'center'" v-if="!isLoading">
      <v-col :cols="8">
          <v-card class="mr-2">
            <v-card-text>
            <v-textarea
              v-model="description"
              label="NBS Description"
              variant="outlined"
              class="my-3"
              hint="Provide a brief description of the Nature-Based Solution (NBS) for which you are looking for a recommendation."
              :persistent-hint="showHints"
              rows="4"
              persistent-placeholder
              placeholder="You will get more accurate results if you provide a NBS description"
            ></v-textarea>
            <v-number-input
              density="compact"
              width="250"
              hint="Specify the desired number of results to display. Choose a number between 5 and 15."
              :persistent-hint="showHints"
              :max="15"
              :min="5"
              class="mb-5"
              variant="outlined"
              v-model="outputCount"
              label="Desired Number of Output"
            ></v-number-input>
              <v-card class="pa-3 border-t">
                <v-card-title>Narrow your search</v-card-title>
                <v-divider></v-divider>
                <br>
                <v-text-field
                  density="compact"
                  v-model="searchKeywords"
                  label="Focus on sentence"
                  hint="Enter specific keyword or phrase to refine the results, such as 'ocean environment'."
                  :persistent-hint="showHints"
                  placeholder="ocean environment"
                  persistent-placeholder
                  variant="outlined"
                  width="250"
                ></v-text-field>
              </v-card>
            <v-btn :disabled="isLoading" @click="applySettings" color="primary" class="mt-4 mr-2">
              Search
            </v-btn>
            <v-btn
              class="mt-4"
              color="primary"
              @click="resetFields"
            >
              Start Over
            </v-btn>
            </v-card-text>
          </v-card>
      </v-col>
    </v-row>

    <v-row v-if="!isLoading">
      <v-col :offset="showSidebar === true ? 1 : 3" cols="6" v-if="responseData.length === 0 && applyClicked">
        <v-alert type="info">
          {{ responseData.length }} results found.
        </v-alert>
      </v-col>
      <v-col :cols="showSidebar === true ? 6 : 9" v-if="responseData.length > 0">
        <div class="map-container">
          <l-map ref="mapRef" :zoom="mapZoom" :center="mapCenter" :options="{ scrollWheelZoom: false }">
            <l-tile-layer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"></l-tile-layer>
            <l-marker
              @click="openDialog(marker.marker)"
              @mouseover="showMarkerTitle(marker)"
              :scrollWheelZoom="false"
              v-for="(marker, index) in markers"
              :key="index"
              :lat-lng="[marker.lat, marker.lng]"
              ref="markerRefs"
            >
              <l-popup>{{ marker.title }}</l-popup>
            </l-marker>
          </l-map>
        </div>
      </v-col>
      <v-col :cols="showSidebar === true ? 2 : 3" class="cards-container py-8 px-0 pr-5" v-if="responseData.length > 0">
        <v-row>
          <v-col cols="12">
            <v-alert type="success">
              {{ responseData.length }} results found
            </v-alert>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" v-for="(item, index) in responseData" :key="index">
            <v-card max-width="100%" :class="{ 'highlighted-card': item.metadatas === highlightedCard }" @click="centerMapOnMarker(item.metadatas)">
              <v-card-title class="text-subtitle-2 text-pre-wrap">{{ item.metadatas.title }}</v-card-title>
              <v-card-text class="text-caption text-justify">
                {{ item.documents.substring(0, 290) }}... <!-- Show first 290 characters -->
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions>
                <v-btn @click="openDialog(item)" class="text-caption text-uppercase bg-primary" color="white">
                  More Details
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-snackbar
      v-model="snackbar"
      class="text-center"
      width="150"
      color="primary"
      timeout="5000"
      location="top"
    >
      {{ snackbarText }}
    </v-snackbar>

    <v-row v-if="isLoading" class="loader-container">
      <v-col cols="12" class="d-flex justify-center">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </v-col>
    </v-row>

    <!-- Dialog for detailed view -->
    <v-dialog v-model="dialog" max-width="800px">
      <v-card>
        <v-card-title class="bg-primary">{{ selectedCard.metadatas?.title }}</v-card-title>
        <v-card-text class="text-justify py-0">
          <v-list>
            <v-list-item class="mb-3">
              <v-list-item-title>Case study URL</v-list-item-title>
              <v-list-item-subtitle><a v-bind="{ href: safeLink || '#' }" target="_blank" rel="noopener noreferrer">{{ selectedCard.metadatas?.link }}</a></v-list-item-subtitle>
            </v-list-item>
            <v-list-item class="mb-3">
              <v-list-item-title>Description</v-list-item-title>
              <v-list-item-subtitle class="text-caption d-inline">{{ selectedCard.documents }}</v-list-item-subtitle>
            </v-list-item>
            <v-list-item class="mb-3" v-if="selectedCard.metadatas?.goals">
              <v-list-item-title>Goals</v-list-item-title>
              <v-list-item-subtitle class="text-caption d-inline">{{ selectedCard.metadatas.goals }}</v-list-item-subtitle>
            </v-list-item>
            <v-list-item class="mb-3" v-if="selectedCard.metadatas?.nbs_actions">
              <v-list-item-title>NBS Actions</v-list-item-title>
              <v-list-item-subtitle class="text-caption d-inline">{{ selectedCard.metadatas.nbs_actions }}</v-list-item-subtitle>
            </v-list-item>
            <v-list-item class="mb-3" v-if="selectedCard.metadatas?.financing">
              <v-list-item-title>Financing</v-list-item-title>
              <v-list-item-subtitle class="text-caption d-inline">{{ selectedCard.metadatas.financing }}</v-list-item-subtitle>
            </v-list-item>
            <v-list-item class="mb-3" v-if="selectedCard.metadatas?.potential_impacts_benefits">
              <v-list-item-title>Potential Impacts & Benefits</v-list-item-title>
              <v-list-item-subtitle class="text-caption d-inline">{{ selectedCard.metadatas.potential_impacts_benefits }}</v-list-item-subtitle>
            </v-list-item>
            <v-list-item class="mb-3" v-if="selectedCard.metadatas?.ecosystems">
              <v-list-item-title>Ecosystems</v-list-item-title>
              <v-list-item-subtitle class="text-caption d-inline">{{ selectedCard.metadatas.ecosystems }}</v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="dialog = false" variant="text" class="bg-primary" color="white">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import GuideMapRecommendation from '@/components/guides/Recommender.vue';
import {computed, ref} from 'vue';
import 'leaflet/dist/leaflet.css';
import {LMap, LMarker, LPopup, LTileLayer} from '@vue-leaflet/vue-leaflet';
import {Icon} from 'leaflet';
import DOMPurify from "dompurify";
// Importing icon files directly
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import {useApp} from "@/mixins/app";

const description = ref('');
const showHints = ref(sessionStorage.getItem('rHints') !== 'true');
const outputCount = ref(10); // Default value set to 10
const searchKeywords = ref('');
const mapCenter = ref([50.8503, 4.3517]);
const mapZoom = ref(3); // Initial zoom level
const markers = ref([]);
const responseData = ref([]);
const dialog = ref(false);
const selectedCard = ref({});
const markerRefs = ref([]);
const isLoading = ref(false);
const applyClicked = ref(false);
const snackbar = ref(false);
const snackbarText = ref('');
const mapRef = ref(null);
const highlightedCard = ref(null);
const getGuideContent = () => GuideMapRecommendation;
const showSidebar = ref(sessionStorage.getItem('showSidebar') !== 'false');

// Setting default icon for markers
delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const handleHint = () =>{
  sessionStorage.setItem('rHints', String(showHints.value));
}

const safeLink = computed(() => {
  const link = selectedCard.value.metadatas?.link || "";
  try {
    const sanitized = DOMPurify.sanitize(link, { ALLOWED_ATTR: ["href"], ALLOWED_TAGS: ["a"] });
    const url = new URL(sanitized);
    return url.href;
  } catch (error) {
    console.error("Invalid URL:", link);
    return null;
  }
});

// Method to handle the Apply button click
const applySettings = async () => {
  isLoading.value = true;
  mapZoom.value = 2; // Adjust the zoom level as needed
  mapCenter.value = [50.8503, 4.3517]; // Center of the map set to Belgium
  markerRefs.value.forEach(x =>{
    x.leafletObject.closePopup();
  });
  const payload = {
    query: description.value,
    features: {
      n_results: outputCount.value,
      distance_thr: 1,
      filter_on_document: searchKeywords.value,
      search_type: 1,
      order_by_chunk: "False",
      find_near_chunk: "True",
      link_chunk_ids: "True",
      chunk_ext_results: 5,
      metadatas_filter: {
        native: {},
        extended: {}
      }
    }
  };
  if(payload.query === ''){
    snackbarText.value = 'Fill in the description to get better results';
    snackbar.value = true;
  }
  try {
    const response = await useApp().recommend(payload);
    markers.value = [];
    // Process the response to extract locations and update markers
    response.forEach(item => {
      const locationString = item.metadatas.location;
      const [latString, lngString] = locationString.split(' Longitude: ');
      const lat = parseFloat(latString.replace('Latitude: ', ''));
      const lng = parseFloat(lngString);
      markers.value.push({ lat, lng, title: item.metadatas.title, marker: item });
    });
    responseData.value = response;
    applyClicked.value = true;
  } catch (error) {
    console.error('Error:', error);
  }
  finally {
    isLoading.value = false; // Set loading to false after data is fetched
  }
};

const openDialog = (item) => {
  event.preventDefault();
  event.stopPropagation();
  selectedCard.value = item;
  dialog.value = true;
};

const showMarkerTitle = (marker) => {
  const markerIndex = markers.value.findIndex(m => m.lat === marker.lat && m.lng === marker.lng);
  if (markerIndex !== -1 && markerRefs.value[markerIndex]) {
    markerRefs.value[markerIndex].leafletObject.openPopup()
  }
};

// Method to center and zoom the map on the marker corresponding to the clicked card
const centerMapOnMarker = (marker) => {
  const locationString = marker.location;
  const [latString, lngString] = locationString.split(' Longitude: ');
  const lat = parseFloat(latString.replace('Latitude: ', ''));
  const lng = parseFloat(lngString);

  if (lat && lng) {
    if (mapRef.value) {
      mapRef.value.leafletObject.setView([lat, lng], 5); // Set view with desired zoom level
    }
    document.querySelector('.map-container').scrollIntoView({ behavior: 'smooth' });
    const markerIndex = markers.value.findIndex(m => m.lat === lat && m.lng === lng);
    if (markerIndex !== -1 && markerRefs.value[markerIndex]) {
      markerRefs.value[markerIndex].leafletObject.openPopup()
    }
    highlightedCard.value = marker;
  } else {
    console.error('Invalid coordinates:', { lat, lng });
  }
};

const resetFields = () => {
  description.value = '';
  outputCount.value = 10; // Reset to default
  searchKeywords.value = '';
  responseData.value = [];
  markers.value = [];
  applyClicked.value = false;
  highlightedCard.value = null;
  mapCenter.value = [50.8503, 4.3517]; // Reset to initial map center
  mapZoom.value = 3; // Reset zoom
};

</script>

<style scoped>

.map-container {
  padding: 20px 0;
  height: 700px;
  width: 100%;
}

.cards-container {
  height: 722px;
  overflow-y: auto;
}

.loader-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.highlighted-card {
  border: 2px solid #53b475; /* Vuetify primary color */
  box-shadow: 0 0 10px rgba(83, 180, 117, 0.5); /* Add a subtle shadow */
}
</style>


