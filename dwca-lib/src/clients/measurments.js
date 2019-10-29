export function getGeneralMeasurements() {
  return [{
    type:   'Pressure',
    typeId: 'http://vocab.nerc.ac.uk/collection/P01/current/PRESPS02/',
    units:  [
      { name: 'Decibars', id: 'http://vocab.nerc.ac.uk/collection/P06/current/UPDB/' }
    ]
  }, {
    type:   'Temperature',
    typeId: 'http://vocab.nerc.ac.uk/collection/P01/current/TEMPCU01/',
    units:  [{ name: 'Degrees Celsius', id: 'http://vocab.nerc.ac.uk/collection/P06/current/UPAA' }]
  }, {
    type:   'Salinity',
    typeId: 'http://vocab.nerc.ac.uk/collection/P01/current/PSALCU01/',
    units:  [
      { name: 'Grams per kilogram', id: 'http://vocab.nerc.ac.uk/collection/P06/current/UGKG' },
      { name: 'PSU (dimensionless)', id: 'http://vocab.nerc.ac.uk/collection/P06/current/UUUU/' }
    ]
  }]
}

export function getSpecificMeasurements() {
  return [{
    type:   'ObservedIndividualCount',
    typeId: 'http://vocab.nerc.ac.uk/collection/P01/current/OCOUNT01',
    units:  [{ name: 'Dimensionless', id: 'http://vocab.nerc.ac.uk/collection/P06/current/UUUU/' }]
  }, {
    type:   'Abundance category of biological entity specified elsewhere',
    typeId: 'http://vocab.nerc.ac.uk/collection/P01/current/SDBIOL06',
    units:  [{ name: 'Dimensionless', id: 'http://vocab.nerc.ac.uk/collection/P06/current/UUUU/' }]
  }, {
    type:   'Abundance of biological entity specified elsewhere per unit area of the bed',
    typeId: 'http://vocab.nerc.ac.uk/collection/P01/current/SDBIOL02',
    units:  [{ name: 'Number per square meter', id: 'http://vocab.nerc.ac.uk/collection/P06/current/UPMS/' }]
  }, {
    type:   'Abundance of biological entity specified elsewhere per unit volume of the sediment',
    typeId: 'http://vocab.nerc.ac.uk/collection/P01/current/USPBIOSV',
    units:  [{ name: 'Number per cubic meter', id: 'http://vocab.nerc.ac.uk/collection/P06/current/UPMM/' }]
  }, {
    type:   'Abundance of biological entity specified elsewhere per unit volume of the water body',
    typeId: 'http://vocab.nerc.ac.uk/collection/P01/current/SDBIOL01',
    units:  [{ name: 'Number per cubic meter', id: 'http://vocab.nerc.ac.uk/collection/P06/current/UPMM/' }]
  }, {
    type:   'Ash-free dry weight biomass (as carbon) of biological entity specified elsewhere per unit volume of the sediment',
    typeId: 'http://vocab.nerc.ac.uk/collection/P01/current/USPBICBM',
    units:  [{ name: 'Milligrams per cubic meter', id: 'http://vocab.nerc.ac.uk/collection/P06/current/UMMC/' }]
  }, {
    type:   'Ash-free dry weight biomass of biological entity specified elsewhere per unit area of the bed',
    typeId: 'http://vocab.nerc.ac.uk/collection/P01/current/SDBIOL03',
    units:  [{ name: 'Milligrams per square meter', id: 'http://vocab.nerc.ac.uk/collection/P06/current/UMMS/' }]
  }, {
    type:   'Ash-free dry weight biomass of biological entity specified elsewhere per unit volume of the water body',
    typeId: 'http://vocab.nerc.ac.uk/collection/P01/current/SDBIOL07',
    units:  [{ name: 'Milligrams per cubic meter', id: 'http://vocab.nerc.ac.uk/collection/P06/current/UMMC/' }]
  }, {
    type:   'Length of biological entity specified elsewhere',
    typeId: 'http://vocab.nerc.ac.uk/collection/P01/current/OBSINDLX/',
    units:  [{ name: 'Meter', id: 'http://vocab.nerc.ac.uk/collection/P06/current/KGXX/' }]
  }, {
    type:   'Specimen weight of biological entity specified elsewhere',
    typeId: 'http://vocab.nerc.ac.uk/collection/P01/current/SPWGXX01/',
    units:  [{ name: 'Grams', id: 'http://vocab.nerc.ac.uk/collection/P06/current/UGRM/' }]
  }]
}

export function findTypeAndUnitIdByNames(typeName, unitName) {
  const measurement = [...getGeneralMeasurements(), ...getSpecificMeasurements()]
    .find(measurment => measurment.type === typeName)
  const unit = measurement.units.find(unit => unit.name === unitName)
  return {
    typeId: measurement.typeId,
    unitId: unit.id
  }
}

export function findUnitsByTypeId(typeId) {
  const measurement = [...getGeneralMeasurements(), ...getSpecificMeasurements()]
    .find(measurment => measurment.typeId === typeId)
  return measurement ? measurement.units : []
}
