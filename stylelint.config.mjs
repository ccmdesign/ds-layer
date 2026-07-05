// Baseline Stylelint config. Custom DS rules land in DS-6.
export default {
  extends: ['stylelint-config-standard'],
  ignoreFiles: [
    '**/node_modules/**',
    '**/.nuxt/**',
    '**/.output/**',
    '**/dist/**',
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
