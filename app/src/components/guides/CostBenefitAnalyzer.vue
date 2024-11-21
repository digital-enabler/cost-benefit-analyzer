<template>
  <div>
    <p class="mb-4">This tool helps you define Nature-Based Solution (NBS) scenarios, upload configurations, and review detailed results with charts and summaries. Here's how to get started:</p>

    <!-- Overview Section -->
    <v-card-title class="text-h6">Overview</v-card-title>
    <v-divider class="mb-2"></v-divider>
    <ul class="mb-4">
      <li><strong>Define Scenarios:</strong> Use the "Define NBS" tab to create and manage NBS scenarios.</li>
      <li><strong>Upload Configuration:</strong> Use the "Upload File" tab to upload a pre-configured JSON file and review results.</li>
      <li>View results, download JSON files, or generate PDF reports.</li>
    </ul>

    <!-- Define NBS Section -->
    <v-card-title class="text-h6">Define NBS</v-card-title>
    <v-divider class="mb-2"></v-divider>
    <ol class="mb-4">
      <li><strong>Create New Scenarios:</strong> Use the "Add new" option from the dropdown to create a scenario.</li>
      <li><strong>Rename Scenarios:</strong> Click the scenario name to rename it directly.</li>
      <li><strong>Duplicate Scenarios:</strong> Use the "Duplicate" option to copy an existing scenario.</li>
      <li><strong>Remove Scenarios:</strong> Use the "Remove" option to delete a scenario.</li>
    </ol>

    <!-- Dynamic Forms Section -->
    <v-card-title class="text-h6">Sections</v-card-title>
    <v-divider class="mb-2"></v-divider>
    <ul class="mb-4">
      Each scenario includes sections like:
      <li><strong>Features:</strong> Define the name, currency, and objectives.</li>
      <li><strong>Costs:</strong> Add starting costs, unit costs, and periodic costs.</li>
      <li><strong>Benefits:</strong> Specify starting and periodic benefits.</li>
      <li><strong>Constraints:</strong> Define constraints for the scenario.</li>
    </ul>
    Use "+" and "-" buttons to add or remove fields in a section.

    <!-- Actions Section -->
    <v-card-title class="text-h6">Actions</v-card-title>
    <v-divider class="mb-2"></v-divider>
    <ul class="mb-4">
      <li><strong>Calculate:</strong> Validate and process your scenario.</li>
      <li><strong>Download:</strong> Save scenarios as JSON files.</li>
      <li><strong>Start Over:</strong> Reset all data and start fresh.</li>
    </ul>

    <!-- Upload File Section -->
    <v-card-title class="text-h6">Upload File</v-card-title>
    <v-divider class="mb-2"></v-divider>
    <ul class="mb-4">
      <li>Use the "Upload File" tab to upload JSON files. Each tab corresponds to an uploaded scenario.</li>
      <li class="mb-2">Switch between scenarios using the tabs at the top.</li>
      Each scenario tab includes:
      <li><strong>Description:</strong> View details of the uploaded scenario.</li>
      <li><strong>Summary & Advanced Information:</strong> Use expansion panels for quick or detailed insights.</li>
      <li><strong>Charts:</strong> Visualize data like Present Value, Costs Trend, and Benefits Trend.</li>
      <li><strong>Cost-Benefit Analysis:</strong> Compare costs and benefits.</li>
    </ul>

    <!-- Validation Rules Section -->
    <v-card-title class="text-h6">Validation Rules</v-card-title>
    <v-divider class="mb-2"></v-divider>
    <ul class="mb-4">
      <li>All required fields must be filled before submitting.</li>
      <li>Period fields must follow logical rules:
        <ul>
          <li>The ending period must be greater than or equal to the starting period.</li>
        </ul>
      </li>
      <li><strong>Features:</strong> Discount rates must be decimals (e.g., 0.05).</li>
      <li><strong>Costs/Benefits:</strong> Values must be numeric and positive.</li>
      <li><strong>Constraints:</strong> Constraints must align with defined variables.</li>
    </ul>

    <!-- Data Visualization Section -->
    <v-card-title class="text-h6">Data Visualization</v-card-title>
    <v-divider class="mb-2"></v-divider>
    <ul>
      <li>Expand panels for quick access to summaries and advanced parameters.</li>
      <li>Switch between scenarios using the tabs at the top of the results section.</li>
      <li>Analyze trends and compare costs and benefits using charts:</li>
      <li><strong>Present Value:</strong> Visualize scenario value over time.</li>
      <li><strong>Costs Trend:</strong> Analyze cost trends.</li>
      <li><strong>Benefits Trend:</strong> Review benefit trends.</li>
      <li><strong>Cost-Benefit Chart:</strong> Compare costs and benefits side by side.</li>
    </ul>
    <p class="mt-4 text-caption">Hint: To stop this guide from automatically showing up, navigate to your Profile Settings and turn it off.</p>
  </div>
</template>

<script>
export default {
  name: "CostBenefitAnalyzerGuide",
};
</script>
