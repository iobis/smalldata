export function ignoreActWarning() {
  const originalError = console.error

  beforeAll(() => {
    console.error = (...args) => {
      if (/Warning.*not wrapped in act/.test(args[0])) return
      originalError.call(console, ...args)
    }
  })

  afterAll(() => {
    console.error = originalError
  })
}

export function flushPromises() {
  return new Promise(resolve => setImmediate(resolve))
}
