<template>
  <v-container class="fill-height pt-0" fluid>
    <v-responsive class="fill-height">
      <upload-response v-if="uploadResponse" :main-tab="'one'" :upload-response="uploadResponse"
                       @uploadResponseUpdated="handleUploadResponse"></upload-response>
      <v-sheet v-else>
        <v-row align="center" class="mb-3">
          <v-col cols="11">
            <v-tabs v-model="currentTabIndex" background-color="primary">
              <v-tab v-for="(form, index) in forms" :key="`form-${index}`"
                     :append-icon="selectedTemplates[index]?.scenarioType && applyFormClickedState[index] && formValidities[index] === false ? 'mdi-exclamation-thick' : null"
                     :class="{ 'error-tab': selectedTemplates[index]?.scenarioType && applyFormClickedState[index] && formValidities[index] === false }">
                <v-tooltip location="top">
                  <template v-slot:activator="{ props }">
                    <!--                  button to remove tab-->
                    <v-btn v-if="forms.length > 1" class="mr-3" rounded size="18" small v-bind="props" variant="text"
                           @click.stop="removeTab(index)">
                      <v-icon size="18">mdi-trash-can-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>Remove Scenario</span>
                </v-tooltip>
                {{ featureNames[index] || `NBS Example Name ${index + 1}` }}
              </v-tab>
              <v-tooltip location="top">
                <template v-slot:activator="{ props }">
                  <!--button to add new tab-->
                  <v-tab v-bind="props" @click="addNewForm">
                    <v-icon>mdi-plus</v-icon>
                  </v-tab>
                </template>
                <span>Add New Scenario</span>
              </v-tooltip>
            </v-tabs>
          </v-col>
          <!--Button to call API-->
        </v-row>
        <v-window v-model="currentTabIndex">
          <!-- Dynamically Generated Forms -->
          <v-window-item v-for="(form, formIndex) in forms" :key="`formItem-${formIndex}`">
            <v-row align="center" class="mb-3" justify="start">
              <v-col cols="4" sm="3">
                <v-select
                  v-model="safeSelectedTemplates[formIndex].scenarioType"
                  :items="formOptions"
                  class="pt-0 pl-0"
                  hide-details
                  item-title="text"
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
                  class="pt-0 pl-0"
                  hide-details
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
                <v-btn v-if="shouldShowForm" :disabled="!isCurrentFormValid" color="primary"
                       @click="downloadJson">Download
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
                    border="start" elevation="5" variant="outlined">
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
                              v-if="section.title !== 'Constraints' && section.title !== 'Unit Costs' && section.title !== 'Features'"
                              :disabled="forms[currentTabIndex].dynamicSections[sectionIndex].fields.length >= 2 && section.title === 'Others'"
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
                          <v-text-field v-if="section.title !== 'Others'" v-model="fieldSet.name"
                                        :readonly="fieldSet.disabled" :rules="[rules.required]" density="compact"
                                        label="Name"
                                        variant="outlined"></v-text-field>
                          <v-select v-if="section.title === 'Features'" v-model="fieldSet.objective"
                                    :items="objectiveOptions"
                                    :rules="[rules.required]" label="Objective Type" outlined></v-select>
                          <v-textarea v-if="section.title !== 'Others'" v-model="fieldSet.description"
                                      density="compact"
                                      label="Description" variant="outlined"></v-textarea>
                          <v-text-field v-if="section.title !== 'Others' && section.title !== 'Constraints'"
                                        v-model="fieldSet.value"
                                        :label="section.title === 'Features' ? 'Discount rate' : 'Value'"
                                        :rules="[rules.required]"
                                        :step="section.title === 'Features' ? '0.01' : '100'" density="compact"
                                        type="number" variant="outlined"></v-text-field>
                          <v-text-field v-if="section.hasStartingPeriod" v-model="fieldSet.startingPeriod"
                                        :rules="[rules.required]" class="w-50 d-inline-block pr-1"
                                        density="compact" label="Starting Period" type="number"
                                        variant="outlined"></v-text-field>
                          <v-text-field v-if="section.hasEndingPeriod" v-model="fieldSet.endingPeriod"
                                        :rules="[v => rules.validateEndingPeriod(v, form, section, fieldSet)]"
                                        class="w-50 d-inline-block"
                                        density="compact" label="Ending Period" type="number"
                                        variant="outlined"></v-text-field>
                          <v-range-slider
                            v-if="fieldSet.inputType === 'slider'"
                            v-model="fieldSet.value"
                            :max="10"
                            :min="1"
                            :tick-labels="['0', '10']"
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
                              :items="['parameter', 'variable']"
                              label="Type"
                              @update:modelValue="handleTypeChange($event, sectionIndex, fieldSetIndex)"
                            ></v-select>

                            <!-- Conditional Value Field -->
                            <v-text-field
                              v-if="section.title === 'Others'"
                              v-model="fieldSet.value"
                              :label="fieldSet.type === 'parameter' ? 'Value' : 'Value (NonNegativeReals)'"
                              :readonly="fieldSet.type === 'variable'"
                              :rules="[rules.required]"
                              :type="fieldSet.type === 'parameter' ? 'number' : 'text'"
                            ></v-text-field>

                          </div>
                          <v-tooltip>
                            <template v-slot:activator="{ props }">
                              <v-btn
                                v-if="section.title !== 'Constraints' && section.title !== 'Features' && section.title !== 'Unit Costs'"
                                :disabled="forms[formIndex].dynamicSections[sectionIndex].fields.length === 1"
                                color="red"
                                icon="mdi-minus"
                                size="36" v-bind="props" @click="removeField(sectionIndex, fieldSetIndex)">
                              </v-btn>
                            </template>
                            <span>Remove {{ fieldSet.name === '' ? section.title : fieldSet.name }}</span>
                          </v-tooltip>
                          <v-divider v-if="section.title !== 'Features'" class="my-3"></v-divider>
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
        {{ snackbarText }}
        <v-btn color="white" variant="text" @click="snackbar = false">Close</v-btn>
      </v-snackbar>
    </v-responsive>
  </v-container>
</template>

<script>

import {useApp} from "@/mixins/app";
import UploadResponse from "@/components/UploadResponse.vue";
import mangroveForestsTemplate from "@/helpers/templates/mangroveForestsTemplate";
import newNbs from "@/helpers/templates/newNbs";
import reefEcosystemsTemplate from "@/helpers/templates/reefEcosystemsTemplate";
import urbanGreenTemplate from "@/helpers/templates/urbanGreenTemplate";
import riverFloodPlainTemplate from "@/helpers/templates/riverFloodPlainTemplate";
import inlandWetlandsTemplate from "@/helpers/templates/inlandWetlandsTemplate";

export default {
  components: {UploadResponse},
  mixins: [useApp()],
  data() {
    return {
      valid: true,
      snackbar: false,
      snackbarText: '',
      objectiveOptions: ['bep_estimation', 'net_benefit_maximization'],
      othersNameOptions: ['units_resource', 'period'],
      currentTabIndex: 0,
      applyFormClickedState: [],
      formValidities: [],
      uploadResponse: null,
      selectedTemplates: [{scenarioType: null, templateType: null}],
      templateOptions: [
        {text: 'Inland Wetlands', value: 'inland-wetlands'},
        {text: 'Mangrove Forests', value: 'mangrove-forests'},
        {text: 'Reef ecosystems', value: 'reef-ecosystems'},
        {text: 'Urban green', value: 'urban-green'},
        {text: 'River and floodplain', value: 'river-floodplain'},
        // Add more template options as needed
      ],
      forms: [this.createFormStructure()],
      formOptions: [
        {text: 'Create New Scenario', value: 'new'},
        {text: 'NBS Template', value: 'nbsTemplate'},
        // Add more templates as needed
      ],
      rules: {
        required: value => value !== null && value !== undefined && value !== '' || 'Required',
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
    'forms': {
      handler() {
        this.forms.forEach((form, index) => {
          this.formValidities[index] = this.checkFormValidity(form);
        });
      },
      deep: true,
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
    isCurrentFormValid() {
      return this.formValidities[this.currentTabIndex];
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
    shouldShowForm() {
      const scenarioType = this.selectedTemplates[this.currentTabIndex]?.scenarioType ?? null;

      // Show form if scenarioType is 'new' or if 'nbsTemplate' is selected and a templateType is also selected.
      return scenarioType === 'new' || (scenarioType === 'nbsTemplate' && this.selectedTemplates[this.currentTabIndex]?.templateType);
    },
  },
  methods: {
    handleUploadResponse() {
      this.selectedTemplates = this.forms.map(() => ({scenarioType: null, templateType: null}));

      // Reset the upload response
      this.uploadResponse = null;

      // reset forms to their initial state
      this.forms = [this.createFormStructure()];
      this.currentTabIndex = 0;
      this.applyFormClickedState = this.forms.map(() => false);
      this.formValidities = this.forms.map(() => false);

    },
    checkFormValidity(form) {
      // Ensure form.dynamicSections is defined and is an array
      if (form.dynamicSections && Array.isArray(form.dynamicSections)) {
        return form.dynamicSections.every(section => {
          return section.fields.every(field => {
            // Your validation logic
            return field.name.trim() !== '' && field.value !== null;
          });
        });
      }
      // Return false or some default validity state if dynamicSections is not as expected
      return false;
    },
    removeTab(index) {
      // Remove the tab at the specified index
      this.forms.splice(index, 1);
      this.selectedTemplates.splice(index, 1);
      this.formValidities.splice(index, 1);

      // Adjust currentTabIndex if necessary
      if (this.currentTabIndex >= this.forms.length) {
        this.currentTabIndex = Math.max(this.forms.length - 1, 0);
      }
    },
    validateForm(formIndex) {
      // Retrieve the form to validate using the formIndex
      const form = this.forms[formIndex];

      // Check if all required fields have values
      const isValid = form.dynamicSections.every(section => {
        return section.fields.every(field => {
          // Add your specific field validation logic here
          return field.name.trim() !== '' && field.value !== null;
        });
      });

      // Update the validity state for the specific form
      this.formValidities[formIndex] = isValid;

      return isValid;
    },
    createFormStructure() {
      return {
        dynamicSections: newNbs,
      };
    },
    addNewForm() {
      // Create a new form structure and add it to the forms array
      const newFormName = `NBS Example Name ${this.forms.length + 1}`;
      const newForm = this.createFormStructure(newFormName);
      this.selectedTemplates.push({scenarioType: null, templateType: null});
      this.forms.push(newForm);
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
      switch (templateType) {
        case 'inland-wetlands':
          currentForm.dynamicSections = inlandWetlandsTemplate;
          break;
        case 'mangrove-forests':
          currentForm.dynamicSections = mangroveForestsTemplate;
          break;
        case 'reef-ecosystems':
          currentForm.dynamicSections = reefEcosystemsTemplate;
          break;
        case 'urban-green':
          currentForm.dynamicSections = urbanGreenTemplate;
          break;
        case 'river-floodplain':
          currentForm.dynamicSections = riverFloodPlainTemplate;
          break;
        default:
          console.error('Selected template data not found');
          break;
      }
    },
    resetForm(formIndex) {
      // Reset the dynamic sections of the current form to the initial structure
      const currentForm = this.forms[formIndex];

      currentForm.dynamicSections = [
        {
          title: 'Features',
          fields: [{name: '', description: '', value: 0, objective: null}],
        },
        {
          title: 'Starting Costs',
          fields: [{name: '', description: '', value: 0}],
        },
        {
          title: 'Unit Costs',
          fields: [{name: '', description: '', value: 0}],
        },
        {
          title: 'Periodic Costs',
          fields: [{name: '', description: '', value: 0, startingPeriod: 0, endingPeriod: 0}],
          hasStartingPeriod: true,
          hasEndingPeriod: true,
        },
        {
          title: 'Starting Benefits',
          fields: [{name: '', description: '', value: 0}],
        },
        {
          title: 'Periodic Benefits',
          fields: [{name: '', description: '', value: 0, startingPeriod: 0, endingPeriod: 0}],
          hasStartingPeriod: true,
          hasEndingPeriod: true,
        },
        {
          title: 'Others',
          fields: [{name: '', description: '', value: 0, type: 'parameter'}],
          hasType: true,
        },
      ];
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
        value: [0, 10],
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
        if (section.hasEndingPeriod) newField.endingPeriod = 0;

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
          objective: '',
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

      // Your logic to process each section and update finalData accordingly
      form.dynamicSections.forEach(section => {
        switch (section.title) {
          // Handle each section type and push data into the respective arrays in finalData.features
          case 'Features':
            finalData.label = section.fields.map(field => field.name).join(', ');
            finalData.description = section.fields.map(field => field.description).join(', ');
            finalData.features.objective = section.fields.map(field => field.objective).join(', ');
            finalData.features.discount_rate = Number(section.fields.map(field => field.value));
            break;
          case 'Starting Costs':
            finalData.features.starting_costs = section.fields.map(field => ({
              name: field.name,
              description: field.description,
              value: Number(field.value)
            }));
            break;

          case 'Unit Costs':
            finalData.features.units_costs = section.fields.map(field => ({
              name: field.name,
              description: field.description,
              value: Number(field.value)
            }));
            break;

          case 'Periodic Costs':
            finalData.features.periodic_costs = section.fields.map(field => ({
              name: field.name,
              description: field.description,
              value: Number(field.value),
              starting_period: field.startingPeriod,
              ending_period: field.endingPeriod
            }));
            break;

          case 'Starting Benefits':
            finalData.features.starting_benefits = section.fields.map(field => ({
              name: field.name,
              description: field.description,
              value: Number(field.value)
            }));
            break;

          case 'Periodic Benefits':
            finalData.features.periodic_benefits = section.fields.map(field => ({
              name: field.name,
              description: field.description,
              value: Number(field.value),
              starting_period: field.startingPeriod,
              ending_period: field.endingPeriod
            }));
            break;

          case 'Others':
            finalData.features.others = section.fields.map(field => ({
              name: field.name,
              description: field.description,
              value: field.type === 'parameter' ? Number(field.value) : field.value,
              type: field.type
            }));
            break;

          case 'Constraints':
            finalData.features.constraints = section.fields.map(field => ({
              name: field.name,
              description: field.description,
              value: `(${field.value[0]}, cst, ${field.value[1]})`
            }));
            break;
        }
      })

      return finalData;
    },
    prepareFormDataForDownload() {
      const finalArrayData = this.forms.map(form => this.formatFormData(form));
      return JSON.stringify(finalArrayData, null, 2); // Convert the array to a JSON string
    },
    downloadJson() {
      const jsonData = this.prepareFormDataForDownload(); // Prepare the data

      // Logic to create a Blob from jsonData and trigger the download
      const file = new Blob([jsonData], {type: 'application/json'});
      const fileURL = URL.createObjectURL(file);

      const downloadLink = document.createElement('a');
      downloadLink.href = fileURL;
      downloadLink.download = 'data.json';
      document.body.appendChild(downloadLink);
      downloadLink.click();

      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(fileURL);
    },
    applyForm() {
      this.formValidities = this.forms.map((form, formIndex) => this.validateForm(formIndex));
      let allValid = this.formValidities.every(isValid => isValid);
      this.applyFormClickedState[this.currentTabIndex] = true;

      this.forms.map((_, index) => {
        const formRef = this.$refs['form-' + index];
        if (formRef) {
          return formRef[0].validate();
        }
        return Promise.resolve(true);
      });

      if (allValid) {
        // Proceed with applying form data if all forms are valid
        const finalArrayData = this.forms.map(form => this.formatFormData(form));
        // Convert the finalArrayData to JSON & format it
        const jsonData = JSON.stringify(finalArrayData, null, 2);

        // Create a Blob from the JSON string
        const file = new Blob([jsonData], {type: 'application/json'});

        // Create a FormData object
        const formData = new FormData();
        formData.append('file', file, 'data.json');
        // Call the API with formData
        this.useApp.optimization(formData).then((value) => {
          this.uploadResponse = value;
        });
      } else {
        // add snackbar if the form that has error is not the current tab
        const invalidFormIndex = this.formValidities.findIndex(isValid => !isValid);

        if (invalidFormIndex !== -1) {
          if (invalidFormIndex !== this.currentTabIndex) {
            // Show snackbar with a message indicating the issue
            this.snackbarText = `There's an error in another section. Please review all sections.`;
            this.snackbar = true;
          }
        }
      }
    },
  },
};
</script>

<style scoped>
.error-tab .v-tab--active {
  color: rgb(176, 0, 32) !important; /* For active tab */
}

.error-tab {
  color: rgb(176, 0, 32) !important; /* For inactive tabs */
}
</style>
