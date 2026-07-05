// Stylelint config: stylelint-config-standard baseline + the DS-6 doctrine
// rules (PRO-232) — ccm-layer CSS is plain CSS on the design tokens, so raw
// hex and raw px are banned outside the token surfaces (the generated
// tokens.css is ignored below; the DTCG sources are JSON and the sanctioned
// channel-brand hex lives in app/utils/channels.ts — both outside Stylelint).
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
    // Deliberate violations, linted programmatically by test/lint/lint-gate.spec.ts.
    'test/lint/fixtures/**',
  ],
  overrides: [
    {
      files: ['**/*.vue'],
      customSyntax: 'postcss-html',
    },
  ],
  rules: {
    // DS-6 doctrine (PRO-232): no raw hex — colors come from tokens.
    'color-no-hex': [
      true,
      {
        message:
          'Raw hex color — use a design token (var(--color-*) / the themed --ui-* aliases). Platform brand hex lives only in app/utils/channels.ts, the sanctioned exception.',
      },
    ],
    // DS-6 doctrine (PRO-232): no raw px — sizes ride the Utopia scales.
    'unit-disallowed-list': [
      ['px'],
      {
        message:
          'Raw px — use the Utopia tokens (var(--spacing-*), var(--text-step-*)) or rem so values stay fluid and themable.',
      },
    ],
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
