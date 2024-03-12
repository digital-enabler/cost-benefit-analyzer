// newNbs.js
const newNbs = [
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
    fields: [{name: '', description: '', value: 0, startingPeriod: 0, endingPeriod: 'None'}],
    hasStartingPeriod: true,
    hasEndingPeriod: true,
  },
  {
    title: 'Starting Benefits',
    fields: [{name: '', description: '', value: 0}],
  },
  {
    title: 'Periodic Benefits',
    fields: [{name: '', description: '', value: 0, startingPeriod: 0, endingPeriod: 'None'}],
    hasStartingPeriod: true,
    hasEndingPeriod: true,
  },
  {
    title: 'Others',
    fields: [{name: '', description: '', value: 0, type: 'parameter'}],
    hasType: true,
  },
]
export default newNbs;
