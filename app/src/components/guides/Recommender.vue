<template>
  <div>
    <p>
      This tool allows you to explore and analyze recommendations for Nature-Based Solutions (NBS) based on a description and other input parameters.
    </p>

    <!-- Overview Section -->
    <v-card-title class="text-h6">Overview</v-card-title>
    <v-divider class="mb-2"></v-divider>
    <ul>
      <li><strong>NBS Description:</strong> Enter a description for better accuracy in results.</li>
      <li><strong>Max Number of Outputs:</strong> Specify the maximum number of results to display.</li>
      <li><strong>Focus on Sentence:</strong> Provide keywords to focus the search on specific contexts.</li>
    </ul>

    <!-- Actions Section -->
    <v-card-title class="text-h6">Actions</v-card-title>
    <v-divider class="mb-2"></v-divider>
    <ul>
      <li><strong>Calculate:</strong> Click the "Calculate" button to generate recommendations.</li>
      <li><strong>Explore Results:</strong> View the results on a map or in the cards displayed on the right.</li>
      <li><strong>More Details:</strong> Click "More Details" on any card to view detailed information.</li>
    </ul>

    <!-- Map Interaction Section -->
    <v-card-title class="text-h6">Map Interaction</v-card-title>
    <v-divider class="mb-2"></v-divider>
    <ul>
      <li><strong>Markers:</strong> Hover over markers to view titles and click to open details.</li>
      <li><strong>Center Map:</strong> Click a card to center the map on the corresponding marker.</li>
    </ul>
  </div>
</template>
