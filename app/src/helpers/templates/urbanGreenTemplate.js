// urbanGreenTemplate.js
const urbanGreenTemplate = [
  {
    title: 'Features',
    fields: [{
      name: 'NBS Urban Green',
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
    title: 'Unit Costs',
    fields: [],
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
        endingPeriod: 0
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
        endingPeriod: 0
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
        value: 0
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
        endingPeriod: 0
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

export default urbanGreenTemplate;
