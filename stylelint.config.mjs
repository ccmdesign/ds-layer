// Baseline Stylelint config. Custom DS rules land in DS-6.
export default {
  extends: ['stylelint-config-standard'],
  ignoreFiles: [
    '**/node_modules/**',
    '**/.nuxt/**',
    '**/.output/**',
    '**/dist/**',
    // Generated from tokens/ by scripts/build-tokens.mjs; Utopia names like
    // --text-step--2 are intentional and trip custom-property-pattern.
    'app/assets/css/tokens.css',
  ],
  overrides: [
    {
      files: ['**/*.vue'],
      customSyntax: 'postcss-html',
    },
  ],
  rules: {
    // Tailwind CSS v4 requires string imports: @import "tailwindcss";
    'import-notation': 'string',
    // Tailwind CSS v4 at-rules.
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'theme',
          'source',
          'utility',
          'variant',
          'custom-variant',
          'apply',
          'reference',
          'config',
          'plugin',
        ],
      },
    ],
  },
}
