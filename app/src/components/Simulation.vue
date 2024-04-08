<template>
  <v-container class="fill-height background pt-0" fluid>
    <v-responsive class="fill-height">
      <v-card title="SIMULATION"></v-card>
    </v-responsive>
  </v-container>
</template>

<script>
import {ref} from "vue";
import {useApp} from "@/mixins/app.js";


export default {
  name: "CostBenefitAnalyzer",
  setup() {
    const {optimization} = useApp();
    const tab = ref('one');
    const files = ref(null);
    const uploadResponse = ref(null);
    const currentTab = ref('');
    const panel = ref(0);


    const handleFileUpload = async () => {
      const formData = new FormData();

      // If multiple files can be selected, iterate over them
      for (let file of files.value) {
        formData.append("file", file); // Adjust the name "files[]" based on your API endpoint's expectation
      }

      try {
        uploadResponse.value = await optimization(formData);
        console.log("uploadResponse", uploadResponse)
        // Handle response here (e.g., show a success message)
      } catch (error) {
        console.error("Error uploading file:", error);
        // Handle error here (e.g., show an error message)
      }
    };

    return {
      tab,
      handleFileUpload,
      files,
      uploadResponse,
      optimization,
      currentTab,
      panel
    };
  }
};

</script>
