export function getGeneralMeasurements() {
  return [{
    type:   'Pressure',
    typeId: 'http://vocab.nerc.ac.uk/collection/P01/current/PRESPS02/',
    units:  [{ name: 'Kilogram', id: 'http://vocab.nerc.ac.uk/collection/P06/current/KGXX' }]
  }, {
    type:   'Temperature',
    typeId: 'http://vocab.nerc.ac.uk/collection/P01/current/TEMPCU01/',
    units:  [{ name: 'Degrees Celsius', id: 'http://vocab.nerc.ac.uk/collection/P06/current/UPAA' }]
  }, {
    type:   'Salinity',
    typeId: 'http://vocab.nerc.ac.uk/collection/P01/current/PSALCU01/',
    units:  [{ name: 'Degrees Celsius', id: 'http://vocab.nerc.ac.uk/collection/P06/current/UPAA' }]
  }]
}

export function getSpecificMeasurements() {
  return [{
    type:   'ObservedIndividualCount',
    typeId: 'http://vocab.nerc.ac.uk/collection/P01/current/OCOUNT01',
    units:  [{ name: 'Kilogram', id: 'http://vocab.nerc.ac.uk/collection/P06/current/KGXX' }]
  }, {
    type:   'Abundance category of biological entity specified elsewhere',
    typeId: 'http://vocab.nerc.ac.uk/collection/P01/current/SDBIOL06',
    units:  [{ name: 'Millimeter', id: 'http://vocab.nerc.ac.uk/collection/P06/current/UXMM' }]
  }, {
    type:   'Abundance of biological entity specified elsewhere per unit area of the bed',
    typeId: 'http://vocab.nerc.ac.uk/collection/P01/current/SDBIOL02',
    units:  [{ name: 'Meter', id: 'http://vocab.nerc.ac.uk/collection/P06/current/ULAA/' }]
  }, {
    type:   'Abundance of biological entity specified elsewhere per unit volume of the sediment',
    typeId: 'http://vocab.nerc.ac.uk/collection/P01/current/USPBIOSV',
    units:  [{ name: 'Grams', id: 'http://vocab.nerc.ac.uk/collection/P06/current/UGRM' }]
  }, {
    type:   'Abundance of biological entity specified elsewhere per unit volume of the water body',
    typeId: 'http://vocab.nerc.ac.uk/collection/P01/current/SDBIOL01',
    units:  [{ name: 'Micrometer', id: 'http://vocab.nerc.ac.uk/collection/P06/current/UMIC' }]
  }, {
    type:   'Ash-free dry weight biomass (as carbon) of biological entity specified elsewhere per unit volume of the sediment',
    typeId: 'http://vocab.nerc.ac.uk/collection/P01/current/USPBICBM',
    units:  [{ name: 'Grams per square meter', id: 'http://vocab.nerc.ac.uk/collection/P06/current/UGMS' }]
  }, {
    type:   'Ash-free dry weight biomass of biological entity specified elsewhere per unit area of the bed',
    typeId: 'http://vocab.nerc.ac.uk/collection/P01/current/SDBIOL03',
    units:  [{ name: 'Number per square meter', id: 'http://vocab.nerc.ac.uk/collection/P06/current/UPMS' }]
  }, {
    type:   'Ash-free dry weight biomass of biological entity specified elsewhere per unit volume of the water body',
    typeId: 'http://vocab.nerc.ac.uk/collection/P01/current/SDBIOL07',
    units:  [{ name: 'Number per liter', id: 'http://vocab.nerc.ac.uk/collection/P06/current/UCML' }]
  }, {
    type:   'Length of biological entity specified elsewhere',
    typeId: 'http://vocab.nerc.ac.uk/collection/P01/current/OBSINDLX/',
    units:  [{ name: 'Square meter', id: 'http://vocab.nerc.ac.uk/collection/P06/current/UMSQ' }]
  }, {
    type:   'Specimen weight of biological entity specified elsewhere',
    typeId: 'http://vocab.nerc.ac.uk/collection/P01/current/SPWGXX01/',
    units:  [{ name: 'Cubic metres', id: 'http://vocab.nerc.ac.uk/collection/P06/current/MCUB/' }]
  }]
}
