module.exports = {
  extends: 'react-app',
  plugins: ['react'],
  rules:   {
    'jsx-a11y/anchor-is-valid':           0,
    'jsx-quotes':                         [2, 'prefer-double'],
    'react/jsx-closing-bracket-location': [2, {
      'nonEmpty':    'after-props',
      'selfClosing': 'after-props'
    }],
    'react/no-array-index-key':           2,
    'react/jsx-curly-spacing':            2,
    'react/jsx-first-prop-new-line':      [2, 'multiline'],
    'react/jsx-no-duplicate-props':       2,
    'react/jsx-sort-default-props':       2,
    'react/jsx-tag-spacing':              [2, {
      'beforeSelfClosing': 'never'
    }],
    'react/jsx-sort-props':               [2, { 'ignoreCase': true }],
    'react/jsx-uses-react':               2,
    'react/jsx-uses-vars':                2,
    'react/jsx-wrap-multilines':          [2, { 'return': 'parens-new-line' }],
    'react/prefer-stateless-function':    2,
    'react/prop-types':                   2,
    'react/sort-comp':                    [1, {
      'order': ['lifecycle', 'render', 'static-methods', 'everything-else']
    }],
    'react/sort-prop-types':              [2, { 'ignoreCase': true }]
  }
}
