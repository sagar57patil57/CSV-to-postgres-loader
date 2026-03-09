function transformToNestedObject(flatObject) {
  const result = {};
  for (const flatKey in flatObject) {
    const value = flatObject[flatKey];
    const path = flatKey.split('.');
    let pointer = result;
    for (let i = 0; i < path.length; i++) {
      const segment = path[i];
      if (i === path.length - 1) {
        pointer[segment] = value;
      } else {
        if (!pointer[segment] || typeof pointer[segment] !== 'object') {
          pointer[segment] = {};
        }
        pointer = pointer[segment];
      }
    }
  }
  return result;
}

function parseHeaderPaths(headers) {
  const headerPaths = {};
  for (const header of headers) {
    headerPaths[header] = header.split('.');
  }
  return headerPaths;
}

class AgeDistributionTracker {
  constructor() {
    this.groups = {
      '<20': 0,
      '20-40': 0,
      '40-60': 0,
      '>60': 0
    };
  }

  update(age) {
    if (typeof age !== 'number' || isNaN(age)) return;
    if (age < 20) this.groups['<20']++;
    else if (age <= 40) this.groups['20-40']++;
    else if (age <= 60) this.groups['40-60']++;
    else this.groups['>60']++;
  }

  getDistribution(totalRecords) {
    const dist = {};
    for (const group in this.groups) {
      dist[group] = totalRecords > 0 ? Number(((this.groups[group] / totalRecords) * 100).toFixed(2)) : 0;
    }
    return dist;
  }
}

module.exports = {
  transformToNestedObject,
  parseHeaderPaths,
  AgeDistributionTracker
};
