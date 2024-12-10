<template>
  <div class="text-justify">
    <p class="mb-4">The tool allows for the exploration and analysis of qualitative indicators related to the benefits of an NBS solution. It is useful both as a standalone tool and when combined with a cost-benefit analyzer to perform a multicriteria analysis. It provides two utilities:
    </p>
    <p>
      <strong>1: Explore the ecosystem services provided by an NBS</strong><br><br>
      This feature calculates the ecosystem services provided by a single or a combination of NBS typology components.
      <br><br>
    </p>
    <p>
      <strong>2: Compare an ecosystem service among different NBS</strong><br><br>
      This feature is useful for identifying the top NBSs that yield the highest score for the selected ecosystem service. It’s a good approach to show how specific features and solutions are connected to addressing environmental or sustainability challenges.
      An additional toolkit is the NBS Natural Language Extractor a facilitator tool which, thanks to natural language processing techniques (NLP), aims to extract the NBS components from the textual description of the entire solution itself.
      The ecosystem services provided by the tool span a range of provisioning services (food provision), regulating services (maintenance of carbon stocks, mitigation of poor air quality, noise, heat, water quality, flooding), and cultural services linked to delivery of physical and mental wellbeing (providing opportunities for physical health, social interaction, restoring capacities), as well as the potential to support biodiversity.
    </p>
    <br>
    <p>
      <strong>Additional notes:</strong>
    </p>
    <br>
    <ul>
      <li><strong>Reference</strong>: “A typology for urban Green Infrastructure to guide multifunctional</li>
      <li>planning of nature-based solutions” https://doi.org/10.1016/j.nbsj.2022.100041</li>
      <li><strong>Coverage</strong>: Indicators are specific for Urban Landscape.</li>
      <li><strong>The score number</strong>: the reference assessment is based on the following principles. Ecosystem service delivery is considered as if it represents a quantity per unit area of the Urban Green Infrastructure, e.g. per m2. This allows direct comparability across different components. The service delivery mapping is the following:</li>
    </ul>
    <br>
    <ol>
      <li>Negligible - zero or almost none</li>
      <li>Low</li>
      <li>Medium or extremely variable</li>
      <li>High</li>
      <li>Very high</li>
    </ol>
    <br>
    Here's how to get started:
    <v-card-title class="text-h6">Overview</v-card-title>
    <ul>
      <li><strong>Choose the type of analysis</strong>: select between “From NBS to indicators” or “From indicators to NBS” based on your task</li>
      <li><strong>Select the desired options</strong>: choose the input and outputs info to be shown.</li>
      <li><strong>Set Calculation Policy:</strong> Define the aggregation method (e.g., mean, max).</li>
      <li><strong>View Results</strong>: Analyze the output graphs.</li>
    </ul>
    <v-card-title class="text-h6 text-center">From NBS to indicators</v-card-title>
    <v-divider class="mb-2"></v-divider>
    <v-card-title class="text-h6">Steps</v-card-title>
    <ul>
      <li><strong>Select an NBS</strong>: use the dropdown to select one or a combination of NBS.</li>
      <li><strong>Select Services</strong>choose the ecosystem services outcome scores to display (e.g., Provisioning, Regulating).</li>
      <li><strong>Set Calculation Policy</strong>: define the aggregation method for a combination of NBSs. In the case of the Mean policy, each output ecosystem score is the average (across NBS) of the scores. For Min policy the final score is the minumum and for Max policy is the maximum respectively.</li>
      <li><strong>Calculate Indicators</strong>: click the button to generate results and visualize them in dedicated charts.</li>
    </ul>
    <v-card-title class="text-h6">NBS NL Extractor</v-card-title>
    <p>The NBS Natural Language Extractor helps identify relevant NBS components based on a complete description of the overall planned activity.</p>
    <ul>
      <li>Provide a description to extract and add NBS to your selection automatically by clicking the button “Extract NBS”.</li>
      <li>Click the button “Calculate Indicators” to generate results.</li>
    </ul>
    <v-card-title class="text-h6">Actions</v-card-title>
    <ul>
      <li><strong>Calculate Indicators</strong>: trigger the calculation of scores and the generation of charts.</li>
      <li><strong>Start Over</strong>: Reset all inputs settings.</li>
    </ul>
    <v-card-title class="text-h6">Results</v-card-title>
    <span>The results are organised into interactive radar charts for each of the ecosystem family groups: provisioning, regulation, cultural/social, biodiversity.</span>
  </div>
</template>
<script setup lang="ts">
</script>
