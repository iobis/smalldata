export const languages = [{
  code:  'en',
  title: 'English'
}, {
  code:  'nl',
  title: 'Dutch'
}, {
  code:  'fr',
  title: 'French'
}, {
  code:  'es',
  title: 'Spanish'
}]

export function findLanguageCodeByTitle(title) {
  return languages.find(language => language.title === title).code
}
