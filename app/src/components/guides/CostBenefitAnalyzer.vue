<template>
  <div class="text-justify">
    <p class="mb-3">
      The tool helps to define Nature-Based Solution (NBS) scenarios, compare them, and review detailed results with charts and summaries.
      The tool enables the implementation of some typical decision support approaches, such as  <strong>Cost-Benefit Analysis </strong>(CBA) and <strong>Cost-Effectiveness Analysis</strong> (CEA),
      as well as providing useful outputs such as <strong>Net Present Value</strong> (NPV) and <strong>Sensitivity Analysis</strong> to extract advanced information and investment guidance.
    </p>
    <span>Here's how to get started:</span>
    <section>
      <h3 class="my-2">Overview</h3>
      <ul>
        <li>
         <strong>Choose the type of analysis</strong>: select between CBA and CEA based on the availability or not of monetary values ​​on the benefits.
          CBA requires both costs and benefits values while in CEA only costs are required.
        </li>
        <li><strong>Define NBS</strong>: use the "Define NBS" tab to create and manage NBS scenarios from scrath or from landscape templates.</li>
        <li>
          <strong>Upload Configuration</strong>: use the "Upload File" tab to upload a pre-configured JSON file and use it as starting point for your analysis.
        </li>
        <li>
          <strong>View Results</strong>: Analyze graphs and output summaries, download them as a .csv file or PDF report.
        </li>
      </ul>
    </section>

    <section>
      <h3 class="my-1">Define NBS</h3>
      <ul>
        <li>
          <strong>Create New Scenario</strong>: from the “Select scenario type” dropdown menu select the "Create New Scenario" option.
          Then fill the required sections inputs to define your own NBS features.
        </li>
        <li>
          <strong>NBS Lanscape Template</strong>: from the “Select scenario type” dropdown menu select the "NBS Template” option.
          Then select one of the provided landscape templates (Coastals, Mountains, Agriculture, Forest, Urban, Water Management)
          to get a pre-populated form with typical cost and benefit categories already entered.
          You can modify these predefined entries before launching the analysis.
        </li>
      </ul>
      <ul class="my-3">
        For each already defined NBS scenario you can:
        <li><strong>Rename Scenario</strong>: click the scenario name to rename it directly.</li>
        <li><strong>Duplicate Scenario</strong>: click the three vertical dots near the scenario label and use the "Duplicate" option to copy an existing scenario setting.</li>
        <li><strong>Add New</strong>: click the three vertical dots near the scenario label and use the "Add new" option to enable a new scenario setting form.</li>
      </ul>
      You can define multiple scenarios and start the analysis simultaneously. This feature facilitates the analysis of alternative approaches
      such as comparisons between green/grey solutions.
    </section>

    <section>
      <h3 class="my-1">Upload Configuration</h3>
      <ul>
        <li>
          The tab allows you to load a previously saved JSON scenario configuration. It also allows you to load a configuration made by other people,
          effectively enabling the sharing functionality. When the file is selected a preview is available to validate visually the file itself.
          The Apply button triggers the start on the analysis.
        </li>
      </ul>
    </section>

    <section>
      <h3 class="my-1">Form Sections</h3>
      <ul class="mb-2">
        Each scenario includes sections like:
        <li>
          <strong>Features</strong>: define the name, a description, the currency and other features for the particular study.
          Each feature is described by dedicated hints on the user interface.
        </li>
        <li><strong>Costs</strong>: add implementation and establishment costs (initial costs), and maintenance and operation cost (recurrent costs).</li>
        <li><strong>Benefits</strong>: specify initial and recurrent benefits. The section is available only in a CBA decision approach.</li>
        <li class="mb-2">
          <strong>Others</strong>: define a specific entry for the scenario, such as the length of the analysis period in years.
        </li>
          Use "+" and "-" buttons to add or remove fields in a section. Some fields are strictly required,
          and the hints and warning messages help you to fill each of them correctly.
      </ul>
    </section>

    <section>
      <h3 class="my-1">Actions</h3>
      <ul>
        <li><strong>Calculate</strong>: Validate and process your scenario. The results are shown through graphs and tables.</li>
        <li><strong>Download</strong>: Save the input scenarios as JSON files or export the output results as PDF or csv file.</li>
        <li><strong>Start Over</strong>: Reset all data and start a new fresh configuration setting.</li>
      </ul>
    </section>

    <section>
      <h3 class="my-1">Results</h3>
      <ul>
        The results are shown in a tabular representations and in a graphical format.
        <li class="mt-3">
          <strong>Summary</strong>: the table shows the most relevant analysis information such as the resulting Net Present Value (NPV),
          the Benefit-Cost Ratio (BCR), and the actual settings for discount rate and currency.
        </li>
        <li class="mb-3"><strong>Advanced Information</strong>: this section lists all the scenario input settings for a quick check after the calculation.</li>
        The following chart are also provided:
        <li class="mt-3">
          <strong>Present Values</strong>: shows the Present Value (PV) ​​for costs and benefits of the project over its lifetime.
          It also shows the Net Present Value (NPV) as the difference of the two PV. The output is calculated with the discount rate (ds) and project life-cycle selected in the setup phase.
        </li>
        <li>
          <strong>Costs over time</strong>
          : shows the distribution of costs for each year through a multiple bar chart. The interactive graph facilitates the analytical phase,
          and it is also possible to filter the interest costs by selecting them directly on the legend.
        </li>
        <li><strong>Benefits over time</strong>: same as the previous one but for benefits. Only present in a CBA setting.</li>
        <li>
          <strong>Cost-Benefit trend</strong>: Compare costs and benefits side by side through two trend charts. The value of each year corresponds to the value of the sum
          of the respective values ​​for costs and benefits. The graph is useful in identifying the break-even point. Only present in a CBA setting.
        </li>
        <li>
         <strong>Sensitivity analysis</strong> : The First-order and Total-order Sobol’s indicators are shown for each input feature in relation to the Net Present Value target model.
          The output is available if the sensitivity analysis checkbox is enabled.
        </li>
      </ul>
      <p>
        It is possible to switch between the several scenarios outputs using the tabs at the top of the results section.
        This streamlines the comparative analysis between different input settings.
      </p>
    </section>

    <section class="mb-5">
      <h3 class="my-1">Useful Definitions</h3>
      <ul>
        <li><strong>Cost-Benefit Analysis</strong> (CBA): is a widely used economic method for evaluating investment options by directly comparing the costs and benefits of an investment in monetary terms. Conducting a CBA involves identifying and monetizing (putting a value to) all costs and benefits over the period of time in which they occur.
        </li>
        <li><strong>Cost-Effectiveness Analysis</strong> (CEA): is a method for decision-making that involves selecting between alternative options to achieve a single specific goal (for example, a target flood protection standard) for the lowest cost over a project lifetime. CEA requires that all costs be measured in monetary terms.
        </li>
        <li><strong>Multicriteria Analysis </strong>(MCA): provides a framework for integrating and comparing information that is measured in different metrics; it is particularly useful when considering effects that cannot be expressed in monetary terms.
        </li>
        <li><strong>Present Value </strong>(PV): costs and benefits occurring at different times are made comparable by converting them into "present values" using an appropriate discount rate. This rate reflects society's time preference and the opportunity cost of capital.
        </li>
        <li><strong>Discount rate </strong>(dr): by considering the value of future costs and benefits in today's terms, decision-makers can compare costs and benefits that occur at different times. This method of converting future values into present terms is known as discounting. Discounting involves choosing an appropriate discount rate, which dictates the degree to which future costs and benefits are diminished when expressed in present terms. Applying this rate across the entire project lifecycle yields the present value of both the costs and the benefits. The discount rate is commonly expressed either in absolute terms (e.g. 0.03) or percentages (e.g. 3%).
        </li>
        <li><strong>Net Present Value </strong>(NPV): represents the difference between the present value of all expected benefits and costs of the project over its lifetime. This can provide insight into the total net economic benefits that a measure generates in the long term. A positive NPV indicates that the project is expected to generate more benefits than costs and is considered financially favourable. Conversely, a negative NPV suggests that the project is likely to result in more costs than benefits.
        </li>
        <li><strong>Benefit Costs Ratio </strong>(BCR): shows the relative benefits generated per unit of investment. It is determined by dividing the total present value of benefits by the total present value of costs. A BCR greater than 1 indicates that the project is anticipated to produce more benefits than costs, making it economically favorable. In contrast, a BCR less than 1 implies that the project's costs are expected to exceed its benefits.
        </li>
        <li><strong>Sensitivity Analysis</strong>: this is a common approach to address uncertainty into a decision support frameworks. It involves testing the robustness of the analytical results by varying the input parameters, values, and assumptions. Sensitivity analysis is often applied as a stress test to verify the robustness of results under different scenarios of future economic development, climate change, or the assumed discount rate. Technically the sensitivity analysis is “the study of how the uncertainty in the output of a mathematical model or system (numerical or otherwise) can be apportioned to different sources of uncertainty in its inputs”. The sensitivity of each input is often represented by a numeric value, called the sensitivity index. As a typical result it produces indicators that reflect the importance of each input in explaining the variability of the output.
        </li>
        <li><strong>Landscape</strong>: the term landscape refers to a broad area of land that includes various ecosystems, habitats, and human-affected areas, and how these interact with each other. It is an integrated, multi-dimensional space that considers not only the natural environment but also the influence of human activities on that environment.
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
export default {
  name: "Guide",
};
</script>

<style>
ul li {
  margin-left: 50px;
}
</style>
