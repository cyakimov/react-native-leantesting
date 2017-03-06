const priorities = [
  {id: 1, name: 'Low'},
  {id: 2, name: 'Medium'},
  {id: 3, name: 'High'},
  {id: 4, name: 'Critical'},
];

const severities = [
  {id: 1, name: 'Minor', order: 2},
  {id: 2, name: 'Major', order: 3},
  {id: 3, name: 'Critical', order: 4},
  {id: 4, name: 'Trivial', order: 1},
];

export const listPriorities = () => {
  return priorities;
};

export const listSeverities = () => {
  return severities.sort((a, b) => {
    return a.order - b.order
  });
};

export const getSeverity = (id) => {
  return severities.find((p) => {return p.id == id}) || {};
}

export const getPriority = (id) => {
  return priorities.find((p) => {return p.id == id}) || {};
}
