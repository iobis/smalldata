import uuid from 'uuid/v4'

export function addUuid(measurment) {
  return !measurment.uuid
    ? { uuid: uuid(), ...measurment }
    : measurment
}

export function removeUuid(original) {
  const { uuid, ...measurement } = original
  return measurement
}
