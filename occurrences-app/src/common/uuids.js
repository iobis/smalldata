import uuid from 'uuid/v4'

export function addUuid(obj) {
  return !obj.uuid
    ? { uuid: uuid(), ...obj }
    : obj
}

export function removeUuid(original) {
  const { uuid, ...obj } = original
  return obj
}
