// mangroveForestsTemplate.js
const mangroveForestsTemplate = [
  {
    title: 'Features',
    fields: [{
      name: 'NBS Mangrove Forests',
      description: 'NBS Sample Description',
      value: 0.03,
      objective: 'net_benefit_maximization'
    }],
  },
  {
    title: 'Starting Costs',
    fields: [
      {
        name: "Overhead labour costs",
        description: "",
        value: 4000
      },
      {
        name: "Overhead material costs",
        description: "",
        value: 500
      },
      {
        name: "Material costs of landers",
        description: "",
        value: 45750
      },
      {
        name: "Labour costs of landers",
        description: "",
        value: 80000
      }
    ],
  },
  {
    title: 'Units Costs',
    fields: [{
      title: 'Units Costs',
      fields: [{name: '', description: '', value: 0, required: false}],
    }],
  },
  {
    title: 'Periodic Costs',
    fields: [
      {
        name: "Labour costs",
        description: "",
        type: {
          description: "",
          trend: "",
          cumulative: 0
        },
        value: 0,
        startingPeriod: 2,
        endingPeriod: 2
      },
      {
        name: "Material costs",
        description: "",
        type: {
          description: "",
          trend: "",
          cumulative: 0
        },
        value: 4000,
        startingPeriod: 2,
        endingPeriod: 2
      },
      {
        name: "Equipment costs",
        description: "",
        type: {
          description: "",
          trend: "",
          cumulative: 0
        },
        value: 30000,
        startingPeriod: 1,
        endingPeriod: 1
      },
      {
        name: "Labour costs phase2",
        description: "",
        type: {
          description: "",
          trend: "",
          cumulative: 0
        },
        value: 0,
        startingPeriod: 4,
        endingPeriod: 4
      },
      {
        name: "Material costs phase2",
        description: "",
        type: {
          description: "",
          trend: "",
          cumulative: 0
        },
        value: 6000,
        startingPeriod: 4,
        endingPeriod: 4
      },
      {
        name: "Equipment costs phase2",
        description: "",
        type: {
          description: "",
          trend: "",
          cumulative: 0
        },
        value: 30000,
        startingPeriod: 4,
        endingPeriod: 4
      },
      {
        name: "Labour costs phase3-PostRestoration",
        description: "",
        type: {
          description: "",
          trend: "",
          cumulative: 0
        },
        value: 150000,
        startingPeriod: 6,
        endingPeriod: ''
      },
      {
        name: "Material costs phase3-PostRestoration",
        description: "",
        type: {
          description: "",
          trend: "",
          cumulative: 0
        },
        value: 20000,
        startingPeriod: 6,
        endingPeriod: ''
      }
    ],
    hasStartingPeriod: true,
    hasEndingPeriod: true,
  },
  {
    title: 'Starting Benefits',
    fields: [
      {
        name: "starting_benefits",
        description: "",
        value: 0,
        disabled: true
      }
    ],
  },
  {
    title: 'Periodic Benefits',
    fields: [
      {
        name: "annual_benefits",
        description: "",
        type: {
          description: "",
          trend: "",
          cumulative: 0
        },
        value: 240000,
        startingPeriod: 6,
        endingPeriod: ''
      }
    ],
    hasStartingPeriod: true,
    hasEndingPeriod: true,
  },
  {
    title: 'Others',
    fields: [
      {
        name: "units_resource",
        description: "it should be present even if not used",
        type: "parameter",
        value: 0
      },
      {
        name: "period",
        description: "",
        type: "parameter",
        value: 10
      }
    ],
    hasType: true,
  },
]

export default mangroveForestsTemplate;
