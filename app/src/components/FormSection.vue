<template>
  <v-container class="fill-height pt-0" fluid>
    <v-responsive class="fill-height">
      <upload-response v-if="uploadResponse"
                       :download-data="finalArrayData" :upload-response="uploadResponse" @startOver="startOver"></upload-response>
      <v-sheet v-else>
        <v-row align="center" class="mb-5">
          <v-col cols="11">
            <v-tabs v-model="currentTabIndex" background-color="primary">
              <v-tab v-for="(form, index) in forms" :key="`form-${index}`">
                <div v-if="editableTabIndex !== index">
                  <v-tooltip location="top">
                    <template v-slot:activator="{ props }">
                      <span v-bind="props" @click="enableEdit(index)" class="edit-cursor">
                        {{ featureNames[index] || `NBS Example Name ${index + 1}` }}
                      </span>
                    </template>
                    <span>Rename Scenario</span> <!-- Tooltip text -->
                  </v-tooltip>
                </div>
                <v-text-field
                  v-else
                  @keyup.enter="saveEdit(index)"
                  min-width="150px"
                  v-model="featureNames[index]"
                  dense
                  variant="plain"
                  ref="editFields"
                  @blur="saveEdit(index)"
                ></v-text-field>
                <v-menu :location="'bottom'" v-if="editableTabIndex === null">
                  <template v-slot:activator="{ props }">
                    <v-btn
                      icon="mdi-dots-vertical"
                      size="small"
                      v-bind="props"
                      variant="text"
                    >
                    </v-btn>
                  </template>

                  <v-list>
                    <v-list-item prepend-icon="mdi-plus" @click="addNewForm">
                      <v-list-item-title>Add new</v-list-item-title>
                    </v-list-item>
                    <v-list-item v-if="forms.length > 1" prepend-icon="mdi-trash-can-outline"
                                 @click.stop="removeTab(index)">
                      <v-list-item-title>Remove</v-list-item-title>
                    </v-list-item>
                    <v-list-item v-if="selectedTemplates[index].scenarioType" prepend-icon="mdi-content-copy"
                                 @click="copyForm(index)">
                      <v-list-item-title>Duplicate</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-tab>
            </v-tabs>
          </v-col>
          <!--Button to call API-->
        </v-row>
        <v-window v-model="currentTabIndex">
          <!-- Dynamically Generated Forms -->
          <v-window-item v-for="(form, formIndex) in forms" :key="`formItem-${formIndex}`">
            <v-row align="center" class="pt-2" justify="start">
              <v-col cols="4" sm="3">
                <v-select
                  v-model="safeSelectedTemplates[formIndex].scenarioType"
                  :items="formOptions"
                  class="pl-0"
                  hide-details
                  item-title="text"
                  density="compact"
                  variant="outlined"
                  item-value="value"
                  label="Select scenario type"
                  @update:modelValue="handleFormSelection($event, formIndex, form)"
                ></v-select>
              </v-col>
              <!-- Template Type Dropdown, shown only for NBS Template scenario -->
              <v-col v-if="selectedTemplates[formIndex]?.scenarioType === 'nbsTemplate'" cols="4" sm="3">
                <v-select
                  v-model="selectedTemplates[formIndex].templateType"
                  :items="templateOptions"
                  class="pl-0"
                  hide-details
                  density="compact"
                  variant="outlined"
                  item-title="text"
                  item-value="value"
                  label="Select template"
                  @update:modelValue="handleTemplateSelection($event, formIndex)"
                ></v-select>
              </v-col>
              <v-col class="text-left" cols="3" sm="6">
                <v-btn v-if="shouldShowForm" class="mr-2" color="primary"
                       @click="applyForm">Apply
                </v-btn>
                <v-btn v-if="shouldShowForm" :disabled="!isFormValid(currentTabIndex)"
                       color="primary" @click="downloadJson">Download
                </v-btn>
              </v-col>
            </v-row>
            <v-form v-if="shouldShowForm"
                    :ref="'form-' + formIndex">
              <!-- Dynamically Generated Sections -->
              <v-row v-for="(section, sectionIndex) in form.dynamicSections"
                     :key="`section-${formIndex}-${sectionIndex}`"
                     justify="center">
                <v-col v-if="section.fields.length > 0" cols="12">
                  <v-alert
                    :color="section.title.includes('Costs') ? 'red-lighten-1' : section.title.includes('Benefits') ? 'blue-lighten-1' : 'primary'"
                    border="start" elevation="1" variant="outlined">
                    <v-card border="none" class="mb-4" elevation="0" variant="elevated">
                      <template v-slot:prepend>
                        <v-card-title class="text-black"
                        >{{ section.title }}
                        </v-card-title>
                      </template>
                      <template v-slot:append>
                        <v-tooltip>
                          <template v-slot:activator="{ props }">
                            <v-btn
                              v-if="section.title !== 'Constraints' && section.title !== 'Units Costs' && section.title !== 'Features' && section.title !== 'Others'"
                              class="ml-2"
                              color="primary"
                              icon="mdi-plus" size="36" v-bind="props" @click="addField(sectionIndex)"></v-btn>
                          </template>
                          <span>Add more {{ section.title }}</span>
                        </v-tooltip>
                      </template>

                      <v-card-text class="text-black">
                        <!--section fields -->
                        <div v-for="(fieldSet, fieldSetIndex) in section.fields"
                             :key="`fieldSet-${sectionIndex}-${fieldSetIndex}`">
                          <v-text-field v-if="section.title !== 'Others'"
                                        v-model="fieldSet.name"
                                        :rules="section.title === 'Units Costs' || section.title === 'Starting Costs' || section.title === 'Starting Benefits' ? [rules.nameRequiredIfValueFilled(fieldSet.value)] : [rules.required]"
                                        density="compact"
                                        :label="section.title === 'Features' ? 'Scenario Name' : 'Name'"
                                        variant="outlined"></v-text-field>
                          <v-select v-if="section.title === 'Features'"
                                    v-model="fieldSet.currency"
                                    :items="currencyOptions"
                                    :rules="[rules.required]"
                                    class="mt-2"
                                    density="compact"
                                    label="Currency" outlined variant="outlined"></v-select>
                          <v-select v-if="section.title === 'Features'"
                                    v-model="fieldSet.objective"
                                    class="mt-2"
                                    density="compact"
                                    variant="outlined"
                                    :items="objectiveOptions"
                                    :rules="[rules.required]" label="Objective Type" outlined></v-select>
                          <v-textarea v-if="section.title !== 'Others'" v-model="fieldSet.description"
                                      density="compact"
                                      class="mt-2"
                                      label="Description" variant="outlined"></v-textarea>
                          <!--                          period cost and periodic benefit are required-->
                          <v-text-field v-if="section.title !== 'Others' && section.title !== 'Constraints'"
                                        v-model="fieldSet.value"
                                        :rules="section.title === 'Features' || section.title === 'Units Costs' || section.title === 'Starting Costs' || section.title === 'Starting Benefits' ? [] : [rules.required]"
                                        :label="section.title === 'Features' ? 'Discount rate' : 'Value'"
                                        class="mb-2"
                                        :step="section.title === 'Features' ? '0.01' : '100'" density="compact"
                                        type="number" variant="outlined"></v-text-field>
                          <v-text-field v-if="section.hasStartingPeriod" v-model="fieldSet.startingPeriod"
                                        :rules="[rules.required]" class="w-50 d-inline-block pr-1"
                                        density="compact" label="Starting Period" type="number"
                                        variant="outlined"></v-text-field>
                          <v-text-field v-if="section.hasEndingPeriod"
                                        v-model="fieldSet.endingPeriod"
                                        :rules="[v => rules.validateEndingPeriod(v, form, section, fieldSet)]"
                                        class="w-50 d-inline-block"
                                        density="compact" label="Ending Period"
                                        placeholder="None"
                                        type="number"
                                        variant="outlined">
                          </v-text-field>
                          <v-range-slider
                            v-if="fieldSet.inputType === 'slider'"
                            v-model="fieldSet.value"
                            :max="50"
                            :min="1"
                            :tick-labels="['1', '50']"
                            class="mt-4 ml-0 pl-0 v-col-6"
                            label="Value"
                            thumb-label="always"
                          ></v-range-slider>
                          <!--Others section-->
                          <div v-if="section.title === 'Others'">
                            <v-select
                              v-model="fieldSet.name"
                              :items="availableOthersOptions[sectionIndex]"
                              :rules="[rules.required]"
                              density="compact"
                              label="Name"
                              variant="outlined"
                              @update:model-value="handleNameChange($event, sectionIndex, fieldSetIndex)"
                            ></v-select>
                            <v-textarea v-model="fieldSet.description" density="compact" label="Description"
                                        variant="outlined"></v-textarea>
                            <v-select
                              v-model="fieldSet.type"
                              density="compact"
                              variant="outlined"
                              :items="['parameter']"
                              label="Type"
                              @update:modelValue="handleTypeChange($event, sectionIndex, fieldSetIndex)"
                            ></v-select>

                            <!-- Conditional Value Field -->
                            <v-text-field
                              v-if="section.title === 'Others'"
                              v-model="fieldSet.value"
                              variant="outlined"
                              :label="fieldSet.type === 'parameter' ? 'Value' : 'Value (NonNegativeReals)'"
                              :readonly="fieldSet.type === 'variable'"
                              :rules="[rules.required]"
                              :type="fieldSet.type === 'parameter' ? 'number' : 'text'"
                            ></v-text-field>

                          </div>
                          <v-tooltip>
                            <template v-slot:activator="{ props }">
                              <v-btn
                                v-if="section.title !== 'Constraints' && section.title !== 'Features' && section.title !== 'Units Costs' && section.title !== 'Others' "
                                :disabled="forms[formIndex].dynamicSections[sectionIndex].fields.length === 1"
                                color="red"
                                icon="mdi-minus"
                                size="36" v-bind="props" @click="removeField(sectionIndex, fieldSetIndex)">
                              </v-btn>
                            </template>
                            <span>Remove {{ fieldSet.name === '' ? section.title : fieldSet.name }}</span>
                          </v-tooltip>
                          <v-divider
                            v-if="section.title !== 'Features' && fieldSetIndex < section.fields.length - 1"
                            :color="section.title.includes('Costs') ? 'red-lighten-1' : section.title.includes('Benefits') ? 'blue-lighten-1' : 'primary'"
                            :thickness="2"
                            class="mt-3 mb-10 border-opacity-50"></v-divider>
                        </div>
                      </v-card-text>
                    </v-card>
                  </v-alert>
                </v-col>
              </v-row>
              <v-row>
              </v-row>
            </v-form>
          </v-window-item>
        </v-window>
      </v-sheet>
      <v-snackbar v-model="snackbar" :timeout="5000" color="error" location="top right">

        <div class="text-subtitle-1 pb-2">
          ERROR
        </div>

        <p> {{ snackbarText }}</p>
        <p> {{ snackbarTextEnd }}</p>

        <template v-slot:actions>
          <v-btn class="float-right" color="white" variant="text" @click="snackbar = false">Close</v-btn>
        </template>
      </v-snackbar>
    </v-responsive>
  </v-container>
</template>

<script>

import {useApp} from "@/mixins/app";
import UploadResponse from "@/components/UploadResponse.vue";
import mountains from "@/helpers/templates/Mountains.json";
import newNbs from "@/helpers/templates/newNbs.json";
import agriculture from "@/helpers/templates/Agriculture.json";
import waterManagement from "@/helpers/templates/Water Management.json";
import forest from "@/helpers/templates/Forest.json";
import coastals from "@/helpers/templates/Coastals.json";
import urban from "@/helpers/templates/Urban.json";

export default {
  components: {UploadResponse},
  mixins: [useApp()],
  props: {
    resetTab: {
      type: String
    }
  },
  data() {
    return {
      valid: true,
      snackbar: false,
      editableTabIndex: null,
      snackbarText: '',
      snackbarTextEnd: '',
      objectiveOptions: ['net_benefit_maximization'],
      currencyOptions: ['euro', 'dollars', 'pound'],
      othersNameOptions: ['units_resource', 'period'],
      items: ['Add', 'Remove', 'Copy'],
      currentTabIndex: 0,
      uploadResponse: null,
      finalArrayData: null,
      selectedTemplates: [{scenarioType: null, templateType: null}],
      templateOptions: [
        {text: 'Coastals', value: 'coastals'},
        {text: 'Mountains', value: 'mountains'},
        {text: 'Agriculture', value: 'agriculture'},
        {text: 'Forest', value: 'forest'},
        {text: 'Urban', value: 'urban'},
        {text: 'Water Management', value: 'waterManagement'},
        // Add more template options as needed
      ],
      forms: [this.createFormStructure()],
      formOptions: [
        {text: 'Create New Scenario', value: 'new'},
        {text: 'NBS Template', value: 'nbsTemplate'},
      ],
      rules: {
        required: value => (value !== null && value !== '' && value !== undefined) || 'This field is required',
        nameRequiredIfValueFilled: (valueField) => (nameFieldValue) => {
          // Ensure valueField is parsed as a number and check if it's greater than 0
          const value = parseFloat(valueField);
          // If valueField is 0, NaN or less than 0, don't enforce this rule
          if (!value || value <= 0) {
            return true;
          }
          // If value is filled (greater than 0) and name is not, enforce rule
          return nameFieldValue ? true : 'Name is required if value is greater than 0';
        },
        min: v => v >= 0 || 'Must be positive',
        max: v => v <= 1 || 'Must be less than or equal to 1',
        validateEndingPeriod: (value, form, section, field) => {
          if (value === '' || value === null || value === undefined) return true;
          const endingPeriod = Number(value);
          const startingPeriod = Number(field.startingPeriod);
          return endingPeriod === 0 || endingPeriod >= startingPeriod || `Ending period must be greater than or equal to the starting period (${startingPeriod})`;
        },
      },
      useApp: useApp(),
      dynamicSections: newNbs
    };
  },
  watch: {
    resetTab() {
      this.handleUploadResponse();
    },
  },
  computed: {
    safeSelectedTemplates() {
      return this.forms.map((_, index) => this.selectedTemplates[index] || {scenarioType: null, templateType: null});
    },
    featureNames() {
      return this.forms.map(form => {
        // Check if dynamicSections exists and is an array before calling find
        if (Array.isArray(form.dynamicSections)) {
          const featuresSection = form.dynamicSections.find(section => section.title === 'Features');
          if (featuresSection && featuresSection.fields.length) {
            return featuresSection.fields[0].name;
          }
        }
        return `NBS Example Name`; // Default name if no name is set or if form.dynamicSections is undefined
      });
    },
    // Compute the available names for the "Others" section based on the current form
    availableOthersOptions() {
      return this.forms[this.currentTabIndex].dynamicSections.map(section => {
        if (section.title === 'Others') {
          const selectedNames = section.fields.map(f => f.name);
          return this.othersNameOptions.filter(option => !selectedNames.includes(option));
        } else {
          return [];
        }
      });
    },
    // Check if the form at the currentTabIndex should be shown
    shouldShowForm() {
      const scenarioType = this.selectedTemplates[this.currentTabIndex]?.scenarioType ?? null;

      // Show form if scenarioType is 'new' or if 'nbsTemplate' is selected and a templateType is also selected.
      return scenarioType === 'new' || (scenarioType === 'nbsTemplate' && this.selectedTemplates[this.currentTabIndex]?.templateType);
    },
  },
  methods: {
    startOver(){
      this.$emit('startOver');
    },
    // Check if the form at the specified index is valid
    isFormValid(formIndex) {
      const refName = `form-${formIndex}`;
      if (this.$refs[refName] && this.$refs[refName][0]) {
        return this.$refs[refName][0].isValid;
      }
      return false; // Assume invalid if the form ref is not found
    },
    handleUploadResponse() {
      this.selectedTemplates = this.forms.map(() => ({scenarioType: null, templateType: null}));

      // Reset the upload response
      this.uploadResponse = null;

      // reset forms to their initial state
      this.forms = [this.createFormStructure()];
      this.currentTabIndex = 0;
    },
    removeTab(index) {
      // Remove the tab at the specified index
      this.forms.splice(index, 1);
      this.selectedTemplates.splice(index, 1);

      // Adjust currentTabIndex if necessary
      if (this.currentTabIndex >= this.forms.length) {
        this.currentTabIndex = Math.max(this.forms.length - 1, 0);
      }
    },
    // Create a new form structure
    createFormStructure() {
      return {
        dynamicSections: newNbs,
      };
    },
    // Add a new form
    addNewForm() {
      // Create a new form structure and add it to the forms array
      const newFormName = `NBS Example Name ${this.forms.length + 1}`;
      const newForm = this.createFormStructure(newFormName);
      this.selectedTemplates.push({scenarioType: null, templateType: null});
      this.forms.push(newForm);
      this.currentTabIndex = this.forms.length - 1;
    },
    // Copy the form at the specified index
    copyForm(formIndex) {
      const currentForm = this.forms[formIndex];
      const newForm = JSON.parse(JSON.stringify(currentForm));

      if (newForm.dynamicSections.some(section => section.title === 'Features')) {
        const featuresSection = newForm.dynamicSections.find(section => section.title === 'Features');
        if (featuresSection.fields.length > 0) {
          featuresSection.fields[0].name += ' Copy';
        }
      }
      this.forms.push(newForm);
      this.selectedTemplates.push({...this.selectedTemplates[formIndex]});
      this.currentTabIndex = this.forms.length - 1;
    },
    // handle scenario type selection
    handleFormSelection(newScenarioType, formIndex) {
      this.selectedTemplates[formIndex].scenarioType = newScenarioType;
      // Reset templateType when changing scenarioType
      this.selectedTemplates[formIndex].templateType = null;
      if (newScenarioType === 'new') {
        this.resetForm(formIndex);
      }
    },
    // handle template selection
    handleTemplateSelection(newTemplateType, formIndex) {
      this.selectedTemplates[formIndex].templateType = newTemplateType;
      this.loadTemplateData(newTemplateType, formIndex);
    },
    // load the data for each template
    loadTemplateData(templateType, formIndex) {
      const currentForm = this.forms[formIndex];
      let templateData;
      switch (templateType) {
        case 'coastals':
          templateData = JSON.parse(JSON.stringify(coastals));
          break;
        case 'mountains':
          templateData = JSON.parse(JSON.stringify(mountains));
          break;
        case 'agriculture':
          templateData = JSON.parse(JSON.stringify(agriculture));
          break;
        case 'waterManagement':
          templateData = JSON.parse(JSON.stringify(waterManagement));
          break;
        case 'forest':
          templateData = JSON.parse(JSON.stringify(forest));
          break;
        case 'urban':
          templateData = JSON.parse(JSON.stringify(urban));
          break;
        default:
          console.error('Selected template data not found');
          break;
      }
      currentForm.dynamicSections = templateData;
    },
    resetForm(formIndex) {
      // Reset the dynamic sections of the current form to the initial structure
      const currentForm = this.forms[formIndex];
      currentForm.dynamicSections = JSON.parse(JSON.stringify(newNbs));
    },
    // Handle the name change for the 'Others' section
    handleNameChange(newName, sectionIndex, fieldIndex) {
      const currentForm = this.forms[this.currentTabIndex];

      // Set the name of the constraint linked to this others name
      const constraintsSectionIndex = currentForm.dynamicSections.findIndex(section => section.title === 'Constraints');
      if (constraintsSectionIndex !== -1) {
        currentForm.dynamicSections[constraintsSectionIndex].fields.forEach((field, index) => {
          if (field.linkedToOthersFieldIndex === fieldIndex) {
            currentForm.dynamicSections[constraintsSectionIndex].fields[index].name = newName;
          }
        });
      }
    },
    // Handle the type change for the 'Others' section
    handleTypeChange(newType, sectionIndex, fieldIndex) {
      const currentForm = this.forms[this.currentTabIndex];
      if (newType === 'variable') {
        // Add a constraint linked to this variable
        currentForm.dynamicSections[sectionIndex].fields[fieldIndex].value = 'NonNegativeReals'
        this.addConstraintForVariable(sectionIndex, fieldIndex);
      } else {
        // Remove the constraint previously linked to this variable
        currentForm.dynamicSections[sectionIndex].fields[fieldIndex].value = 0
        this.removeConstraintForVariable(sectionIndex, fieldIndex);
      }
    },
    // Add a constraint linked to the variable in the 'Others' section
    addConstraintForVariable(othersSectionIndex, othersFieldIndex) {
      const currentForm = this.forms[this.currentTabIndex];
      // Find or create the "Constraints" section
      let constraintsSectionIndex = currentForm.dynamicSections.findIndex(section => section.title === 'Constraints');
      if (constraintsSectionIndex === -1) {
        constraintsSectionIndex = currentForm.dynamicSections.length;
        currentForm.dynamicSections.push({
          title: 'Constraints',
          fields: [],
        });
      }

      // Use the name from the corresponding "Others" field
      const variableName = currentForm.dynamicSections[othersSectionIndex].fields[othersFieldIndex].name;

      // Add a new constraint field linked to the variable from the "Others" section
      currentForm.dynamicSections[constraintsSectionIndex].fields.push({
        name: variableName,
        description: '',
        value: variableName === 'period' ? [1, 50] : [0, 1000],
        inputType: 'slider',
        linkedToOthersFieldIndex: othersFieldIndex,
        disabled: true,
      });
    },

    // Remove the constraint linked to the variable in the 'Others' section
    removeConstraintForVariable(othersSectionIndex, othersFieldIndex) {
      const currentForm = this.forms[this.currentTabIndex];
      // Find the "Constraints" section index
      const constraintsSectionIndex = currentForm.dynamicSections.findIndex(section => section.title === 'Constraints');
      if (constraintsSectionIndex !== -1) {
        // Remove the constraint linked to the variable by its index in the "Others" section
        currentForm.dynamicSections[constraintsSectionIndex].fields = currentForm.dynamicSections[constraintsSectionIndex].fields.filter(
          field => field.linkedToOthersFieldIndex !== othersFieldIndex
        );

        // If there are no more fields in the "Constraints" section, remove the section
        if (currentForm.dynamicSections[constraintsSectionIndex].fields.length === 0) {
          currentForm.dynamicSections.splice(constraintsSectionIndex, 1);
        }
      }
    },
    // Add a new field to the specified section
    addField(sectionIndex) {
      const currentForm = this.forms[this.currentTabIndex];
      const section = currentForm.dynamicSections[sectionIndex];

      if (section.title === 'Others') {
        const availableNames = this.availableOthersOptions[sectionIndex] || [];

        if (availableNames.length > 0) {
          const newField = {
            name: availableNames[0], // Use the first available name
            description: '',
            value: 0,
            type: 'parameter'
          };

          // Add startingPeriod and endingPeriod properties if the section requires them
          if (section.hasStartingPeriod) newField.startingPeriod = 0;
          if (section.hasEndingPeriod) newField.endingPeriod = 0;

          // Push the new field to the section's fields array
          section.fields.push(newField);
        }
      } else {
        // Handle non-"Others" sections
        const newField = {
          name: '',
          description: '',
          value: 0,
          type: 'parameter'
        };

        if (section.hasStartingPeriod) newField.startingPeriod = 0;
        if (section.hasEndingPeriod) newField.endingPeriod = 10;

        section.fields.push(newField);
      }
    },
    // Remove the field at the specified index from the specified section
    removeField(sectionIndex, fieldSetIndex) {
      const currentForm = this.forms[this.currentTabIndex];
      const section = currentForm.dynamicSections[sectionIndex];
      const field = section.fields[fieldSetIndex];

      // Check if the field being removed is from the 'Others' section and is of type 'variable'
      if (section.title === 'Others' && field.type === 'variable') {
        // Find the corresponding constraint in the 'Constraints' section
        const constraintsSectionIndex = currentForm.dynamicSections.findIndex(s => s.title === 'Constraints');
        if (constraintsSectionIndex !== -1) {
          const constraintsSection = currentForm.dynamicSections[constraintsSectionIndex];

          // Find the index of the constraint linked to the removed 'Others' field
          const constraintIndex = constraintsSection.fields.findIndex(c => c.linkedToOthersFieldIndex === fieldSetIndex);

          if (constraintIndex !== -1) {
            // Remove the linked constraint
            constraintsSection.fields.splice(constraintIndex, 1);
          }
        }
      }

      // Remove the field from the section
      section.fields.splice(fieldSetIndex, 1);

      // Ensure there's always at least one set of fields in the section
      if (section.fields.length === 0) {
        this.addField(sectionIndex);
      }
    },
    formatFormData(form) {
      const finalData = {
        label: '',
        description: '',
        features: {
          objective: 'net_benefit_maximization',
          discount_rate: 0,
          starting_costs: [],
          units_costs: [],
          periodic_costs: [],
          starting_benefits: [],
          periodic_benefits: [],
          others: [],
          constraints: []
        }
      };

      // Iterate over each section in the form and format the data
      form.dynamicSections.forEach(section => {
        let fieldsData = [];
        if (["Starting Costs", "Units Costs", "Starting Benefits"].includes(section.title)) {
          // Check if all values in this section are 0 or empty
          const allValuesZeroOrEmpty = section.fields.every(field => !field.value || Number(field.value) === 0);
          if (allValuesZeroOrEmpty) {
            // If all values are 0 or empty, keep the corresponding array empty
            finalData.features[section.title.replace(/\s+/g, '_').toLowerCase()] = [];
            return;
          }
        }
        switch (section.title) {
          // Handle each section type and push data into the respective arrays in finalData.features
          case 'Features':
            finalData.label = section.fields.map(field => field.name).join(', ');
            finalData.description = section.fields.map(field => field.description).join(', ');
            finalData.features.objective = section.fields.map(field => field.objective).join(', ');
            finalData.features.currency = section.fields.map(field => field.currency).join(', ');
            finalData.features.discount_rate = Number(section.fields.map(field => field.value));
            break;
          case 'Starting Benefits':
          case 'Starting Costs':
          case 'Units Costs':
            fieldsData = section.fields.map(field => ({
              name: field.name,
              description: field.description,
              value: Number(field.value)
            }));
            break;
          case 'Periodic Costs':
          case 'Periodic Benefits':
            fieldsData = section.fields.map(field => ({
              name: field.name,
              description: field.description,
              value: Number(field.value),
              starting_period: Number(field.startingPeriod),
              ending_period: field.endingPeriod === '' ? 'None' : Number(field.endingPeriod)
            }));
            break;
          case 'Others':
            fieldsData = section.fields.map(field => ({
              name: field.name,
              description: field.description,
              value: field.type === 'parameter' ? Number(field.value) : field.value,
              type: field.type
            }));
            break;
          case 'Constraints':
            fieldsData = section.fields.map(field => ({
              name: field.name,
              description: field.description,
              value: `(${field.value[0]}, cst, ${field.value[1]})`
            }));
            break;
        }
        if (fieldsData.length > 0) {
          finalData.features[section.title.replace(/\s+/g, '_').toLowerCase()] = fieldsData;
        }
      });

      return finalData;
    },
    // Prepare the form data for download
    prepareFormDataForDownload() {
      const finalArrayData = this.forms.map(form => this.formatFormData(form));
      this.finalArrayData = JSON.stringify(finalArrayData, null, 2);
      return JSON.stringify(finalArrayData, null, 2); // Convert the array to a JSON string
    },
    // Download the JSON file
    downloadJson() {
      const jsonData = this.prepareFormDataForDownload(); // Prepare the data
      // Logic to create a Blob from jsonData and trigger the download
      const file = new Blob([jsonData], {type: 'application/json'});
      const fileURL = URL.createObjectURL(file);

      const downloadLink = document.createElement('a');
      downloadLink.href = fileURL;
      downloadLink.download = this.featureNames[this.currentTabIndex];
      document.body.appendChild(downloadLink);
      downloadLink.click();

      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(fileURL);
    },
    enableEdit(index) {
      this.editableTabIndex = index;
      this.featureNames[index] = this.featureNames[index] || 'NBS Example Name';
      this.$nextTick(() => {
        const editField = this.$refs.editFields[index];
        if (editField && editField.focus) {
          editField.focus();
        }
      });
    },
    saveEdit(index) {
      this.editableTabIndex = null;
      const currentForm = this.forms[index];
      const featuresSection = currentForm.dynamicSections.find(section => section.title === 'Features');
      if (featuresSection && featuresSection.fields.length > 0) {
        featuresSection.fields[0].name = this.featureNames[index];
      }
    },
    applyForm() {
      let invalidFormNames = [];
      this.snackbar = false;

      // Iterate over each form reference and validate
      this.forms.forEach((form, index) => {
        const refName = `form-${index}`;
        if (this.$refs[refName][0].validate()) {
          const isValid = this.$refs[refName][0].isValid;
          if (!isValid) {
            // If the form is invalid, add its name to the list of invalid form names
            const formName = this.featureNames[index] || `NBS Example Name ${index + 1}`;
            invalidFormNames.push(formName);
          }
        }
      });

      if (invalidFormNames.length === 0) {
        // All forms are valid
        const finalArrayData = this.forms.map(form => this.formatFormData(form));
        const jsonData = JSON.stringify(finalArrayData, null, 2);
        this.finalArrayData = jsonData;

        const file = new Blob([jsonData], {type: 'application/json'});
        const formData = new FormData();
        formData.append('file', file, 'data.json');

        this.useApp.optimization(formData).then((value) => {
          this.uploadResponse = value;
        });
      } else {
        // One or more forms are invalid
        const invalidFormsString = invalidFormNames.join(', ');
        this.snackbarText = `Errors found in:${invalidFormsString}`;
        this.snackbarTextEnd = `Please review these sections.`;
        this.snackbar = true;
      }
    },
  },
};
</script>

<style>
.edit-cursor:hover {
  cursor: text;
}
</style>
