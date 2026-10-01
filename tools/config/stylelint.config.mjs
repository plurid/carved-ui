export default {
  extends: ['stylelint-config-standard'],
  ignoreFiles: ['../../**/node_modules/**', '../../**/dist/**'],
  rules: {
    'selector-class-pattern': null,
    'custom-property-pattern': null,
    'declaration-empty-line-before': null,
    'rule-empty-line-before': null,
    'at-rule-empty-line-before': null,
    'alpha-value-notation': 'number',
    'import-notation': 'string',
  },
};
