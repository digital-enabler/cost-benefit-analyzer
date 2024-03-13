<template>
  <v-container class="fill-height background pt-0" fluid>
    <v-progress-circular
      v-if="loader"
      class="progress"
      color="primary"
      indeterminate
      size="64"
      style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);"
    >
    </v-progress-circular>
    <v-responsive v-else class="fill-height">
      <v-tabs
        v-model="tab"
        bg-color="primary"
        class="mb-5"
        slider-color="secondary"
      >
        <v-tab value="one">
          <v-btn class="bg-primary" color="white" variant="text" @click="resetDefineNbs(tab)">Define NBS</v-btn>
        </v-tab>
        <v-tab value="two">Upload json</v-tab>
      </v-tabs>

      <v-window v-model="tab">
        <v-window-item value="two">
          <v-row :align="'center'" :align-content="'center'" :dense="true"
                 no-gutters>

            <v-col class="py-0" cols="4">
              <v-file-input v-model="files" accept="application/JSON" density="compact" label="Upload json"
                            prepend-icon="mdi-paperclip"
                            variant="outlined"
                            @change="handleFileUpload"></v-file-input>
            </v-col>
            <v-col cols="12">
              <upload-response v-if="uploadResponse" :main-tab="tab"
                               :upload-response="uploadResponse"></upload-response>
            </v-col>
          </v-row>
        </v-window-item>

        <v-window-item value="one">
          <form-section :reset-tab="resetTab"
          ></form-section>
        </v-window-item>

      </v-window>

      <!--   Json content dialog   -->
      <v-dialog v-model="showDialog" :persistent="false" max-width="800px">
        <v-card class="text-caption">
          <v-card-title class="bg-primary">JSON Content Preview</v-card-title>
          <v-card-text>
            <v-textarea
              v-model="jsonContent"
              :rows-max="15"
              auto-grow
              hide-details
              readonly
              rows="10"
            ></v-textarea>
          </v-card-text>
          <v-card-actions>
            <v-card :rounded="0" class="text-white" color="transparent" elevation="0" location="bottom right"
                    position="fixed">
              <v-btn color="primary" variant="text" @click="applyUpload">Apply</v-btn>
              <v-btn color="primary" variant="text" @click="closeDialog">Cancel</v-btn>
            </v-card>
          </v-card-actions>

        </v-card>
      </v-dialog>
    </v-responsive>

  </v-container>
</template>

<script>
import {ref} from "vue";
import {useApp} from "@/mixins/app.js";
import FormSection from './FormSection.vue';
import UploadResponse from "@/components/UploadResponse.vue";


export default {
  name: "CostBenefitAnalyzer",
  components: {
    UploadResponse, FormSection
  },
  setup() {
    const {optimization} = useApp();
    const tab = ref('one');
    const files = ref(null);
    const uploadResponse = ref(null);
    const panel = ref(0);
    const loader = ref(false);
    const showDialog = ref(false);
    const jsonContent = ref('');
    const resetTab = ref('');
    const resetDefineNbs = () => {
      let randomString = "";
      const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

      for (let i = 0; i < 5; i++) {
        let word = "";
        const wordLength = Math.floor(Math.random() * 5) + 3; // Word length between 3 and 7 characters
        for (let j = 0; j < wordLength; j++) {
          word += letters.charAt(Math.floor(Math.random() * letters.length));
        }
        randomString += (i === 0 ? "" : " ") + word;
      }
      resetTab.value = randomString;
    }

    // handle file upload
    const handleFileUpload = (event) => {
      const file = event.target.files[0];
      if (file && file.type.match('application/json')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          jsonContent.value = e.target.result;
          showDialog.value = true;
        };
        reader.readAsText(file);
      } else {
        // Handle the case where the file is not JSON
        alert("Please upload a JSON file.");
      }
    };
    // close the dialog
    const closeDialog = () => {
      showDialog.value = false;
      files.value = null;
    };

    // call the api
    const applyUpload = async () => {
      showDialog.value = false;
      loader.value = true;
      const formData = new FormData();
      formData.append("file", new Blob([jsonContent.value], {type: "application/json"}));

      try {
        uploadResponse.value = await optimization(formData);
        loader.value = false;
        // Handle response here (e.g., show a success message)
      } catch (error) {
        console.error("Error uploading file:", error);
        loader.value = false;
      }
    };

    return {
      tab,
      handleFileUpload,
      files,
      uploadResponse,
      optimization,
      panel,
      loader,
      applyUpload,
      showDialog,
      jsonContent,
      closeDialog,
      resetTab,
      resetDefineNbs
    };
  }
};

</script>

<style scoped>
.v-expansion-panel-text__wrapper {
  padding: 0 !important;
}
</style>

