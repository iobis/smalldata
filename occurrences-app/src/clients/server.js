export function getDatasetMock() {
  return [{
    id:          0,
    description: 'HAB Region 2: Occurrences of harmful (toxic) algal taxa within an area of interest to El Salvador compiled as part of a literature search project.'
  }, {
    id:          1,
    description: 'NPPSD Short-tailed Albatross Sightings'
  }, {
    id:          2,
    description: 'PANGAEA - Data from Christian-Albrechts-University Kiel'
  }, {
    id:          3,
    description: 'NSIS: List of marine benthic algae from Magdalen Islands, Quebec as recorded in 1979'
  }, {
    id:          4,
    description: 'Seguimiento de 10 crías de tortuga boba nacidas en 2016 en el litoral valenciano, en el marco del Proyecto LIFE 15 IPE ES 012 (aggregated per 1-degree cell)'
  }, {
    id:          5,
    description: 'Waved Albatross Tracking (aggregated per 1-degree cell)'
  }]
}

export function getOccurrenceMock() {
  return [{
    id:             1,
    addedDate:      '2011-12-01',
    scientificName: 'Abra Alba',
    dataset:        'NPPSD Short-tailed Albatross Sightings',
    occurrenceDate: '2011-12-09'
  }, {
    id:             2,
    addedDate:      '2011-12-01',
    scientificName: 'Abra Alba',
    dataset:        'NPPSD Short-tailed Albatross Sightings',
    occurrenceDate: '2011-12-09'
  }]
}
