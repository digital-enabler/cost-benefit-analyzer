// Water Management.js
const waterManagement = [
  {
    title: 'Features',
    fields: [{
      name: 'NBS Water Management',
      description: 'NBS Sample Description',
      value: 0.03,
      currency: 'euro',
      objective: 'net_benefit_maximization'
    }],
  },
  {
    title: 'Starting Costs',
    fields: [
      {
        name: "Overhead labour costs",
        description: "",
        value: 100
      },
      {
        name: "Overhead material costs",
        description: "",
        value: 50
      },
      {
        name: "Material costs of landers",
        description: "",
        value: 10000
      },
      {
        name: "Labour costs of landers",
        description: "",
        value: 10000
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
        startingPeriod: 1,
        endingPeriod: 1
      },
      {
        name: "Material costs",
        description: "",
        type: {
          description: "",
          trend: "",
          cumulative: 0
        },
        value: 500,
        startingPeriod: 1,
        endingPeriod: 1
      },
      {
        name: "Equipment costs",
        description: "",
        type: {
          description: "",
          trend: "",
          cumulative: 0
        },
        value: 6500,
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
        startingPeriod: 2,
        endingPeriod: 2
      },
      {
        name: "Material costs phase2",
        description: "",
        type: {
          description: "",
          trend: "",
          cumulative: 0
        },
        value: 1000,
        startingPeriod: 2,
        endingPeriod: 2
      },
      {
        name: "Equipment costs phase2",
        description: "",
        type: {
          description: "",
          trend: "",
          cumulative: 0
        },
        value: 5000,
        startingPeriod: 2,
        endingPeriod: 2
      },
      {
        name: "Labour costs phase3-PostRestoration",
        description: "",
        type: {
          description: "",
          trend: "",
          cumulative: 0
        },
        value: 17500,
        startingPeriod: 3,
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
        value: 2500,
        startingPeriod: 3,
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
        value: 40000,
        startingPeriod: 3,
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
        description: "",
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

export default waterManagement;
