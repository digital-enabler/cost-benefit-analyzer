<template>
  <div class="text-justify">
    <p>
      This tool allows the user to explore and analyze recommendations for Nature-Based Solutions (NBS) based on a simple free-text NBS description. The search can be optimized thanks to filters on some specific attributes.
      It serves as a helpful resource for discovering and learning about NBS solutions globally. The results are also displayed on a map, with the potential of strengthening engagement and willingness to use the tool.
      <br><br>
      Here's how to get started:
    </p>

    <!-- Overview Section -->
    <v-card-title class="text-h6">Overview</v-card-title>
    <v-divider class="mb-2"></v-divider>
    <ul>
      <li><strong>Write an NBS Description</strong>: Write the description of your nbs including the information that best characterizes it such as the final purpose, the description of the desired benefits, the materials used.</li>
      <li><strong>Select the number of desired Outputs</strong>: this number represent the desired recommendation number but the actual recommendation list lenght could be lower in number because a minimum similarity threshold should be reached.</li>
      <li><strong>Narrow the search</strong>: Provide specific keywords and categories to focus your search on specific boundaries, rather than solely relying on text similarity.</li>
      <li><strong>View Results</strong>: read and analyze recommended contents both by scrolling through the list and on the interactive map.</li>
    </ul>
    <!--Steps section-->
    <v-card-title class="text-h6">Steps</v-card-title>
    <v-divider class="mb-2"></v-divider>
    <ul>
      <li><strong>Write an NBS description</strong>: enter an appropriate description to get more relevant recommendation results.</li>
      <li><strong>Select the number of desired recommendations</strong>: specify the desired number of results to be displayed in both the scrolling card list and on the map.</li>
      <li><strong>Use filters</strong>: to finalise the search on specific attributes.</li>
      <li><strong>Start the exploration</strong>: open the cards of the recommended contents.</li>
    </ul>

    <!-- Actions Section -->
    <v-card-title class="text-h6">Actions</v-card-title>
    <v-divider class="mb-2"></v-divider>
    <ul>
      <li><strong>Search:</strong> click the button to get recommendations.</li>
      <li><strong>Explore Results:</strong> view the results on the map or in the cards displayed on the right.</li>
      <li><strong>More Details:</strong> click "More Details" on any card to view detailed information.</li>
    </ul>

    <!-- Map Interaction Section -->
    <v-card-title class="text-h6">Map Interaction</v-card-title>
    <v-divider class="mb-2"></v-divider>
    <ul>
      <li><strong>Markers:</strong> hover over markers to view titles and click to open details.</li>
    </ul>

    <v-card-title class="text-h6">Results</v-card-title>
    <v-divider class="mb-2"></v-divider>
    <p>
      The recommendations are listed in the card list on the right and directly on the map. The actual number of results are also displayed.
    </p>
  </div>
</template>
<script setup lang="ts">
</script>
