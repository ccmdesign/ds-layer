/**
 * eslint-plugin-ccm — local flat-config plugin for the @ccm/ds steering
 * doctrine (DS-6, PRO-232). Not published separately; imported directly by
 * eslint.config.mjs. Consuming apps can wire it too:
 *
 *   import ccm from '@ccm/ds/lint/eslint-plugin-ccm/index.mjs'
 *   // { plugins: { ccm }, rules: { 'ccm/class-budget': 'error', ... } }
 *
 * Both rules walk the Vue template AST via vue-eslint-parser's
 * defineTemplateBodyVisitor parser service, so they only do anything on
 * files parsed by vue-eslint-parser (.vue).
 */

/** Get vue-eslint-parser's template-body visitor hook, if this file has one. */
function templateVisitor(context, visitor) {
  const services = context.sourceCode?.parserServices ?? context.parserServices
  if (!services?.defineTemplateBodyVisitor) return {}
  return services.defineTemplateBodyVisitor(visitor)
}

/**
 * ccm/class-budget
 *
 * Doctrine: pages compose components; class strings live only inside
 * Tailwind Variants definitions (component files). Outside components/,
 * a static `class` attribute gets a utility budget (default 6 — roughly one
 * layout concern plus modifiers). More than that is a component boundary:
 * reach for a Ccm composition component or extract a component.
 *
 * Heuristic scope (documented): only STATIC `class` attributes are counted.
 * Dynamic `:class` bindings are ignored — they are usually state maps, and
 * counting expressions would guess. Path scoping (exempting components/)
 * belongs to the config layer, not the rule.
 */
const classBudget = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'enforce a utility-count budget on static class attributes (doctrine: pages compose components; props, not classes)',
    },
    schema: [
      {
        type: 'object',
        properties: {
          budget: { type: 'integer', minimum: 1 },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      overBudget:
        '{{count}} utilities on one class attribute (budget {{budget}}). This is a component boundary: compose a Ccm layout component (CcmStack/CcmCluster/CcmGrid/…) or extract a component and put the classes in its Tailwind Variants definition. See manifest.json / llms.txt.',
    },
  },
  create(context) {
    const budget = context.options[0]?.budget ?? 6
    return templateVisitor(context, {
      VAttribute(node) {
        if (node.directive || node.key.name !== 'class') return
        const value = node.value?.value
        if (typeof value !== 'string') return
        const count = value.trim().split(/\s+/).filter(Boolean).length
        if (count > budget) {
          context.report({ node, messageId: 'overBudget', data: { count: String(count), budget: String(budget) } })
        }
      },
    })
  },
}

/**
 * ccm/no-bespoke-widgets
 *
 * Doctrine: don't rebuild widgets the system already owns. Raw
 * button/input/select/table/dialog elements in a template are the start of a
 * bespoke widget; Nuxt UI ships the accessible, themed version. Escape hatch
 * for the rare legitimate case: an eslint-disable comment with a reason.
 *
 * Only raw (lowercase) HTML elements are flagged — <UButton> or a local
 * <Button> component resolve differently in the AST (rawName casing) and
 * pass through.
 */
const WIDGET_REPLACEMENTS = {
  button: 'UButton',
  input: 'UInput (or UCheckbox/URadioGroup/USwitch for those input types)',
  select: 'USelect / USelectMenu',
  table: 'UTable',
  dialog: 'UModal (or UPopover for anchored overlays)',
}

const noBespokeWidgets = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow raw button/input/select/table/dialog elements (widget-duplication rule) — Nuxt UI owns the widgets',
    },
    schema: [],
    messages: {
      bespokeWidget:
        'Raw <{{element}}> is a bespoke widget in the making — use {{replacement}} from Nuxt UI (themed via app.config, accessible out of the box). If this raw element is genuinely required, add an eslint-disable comment with the reason.',
    },
  },
  create(context) {
    return templateVisitor(context, {
      VElement(node) {
        const replacement = WIDGET_REPLACEMENTS[node.rawName]
        if (!replacement) return
        context.report({
          node: node.startTag,
          messageId: 'bespokeWidget',
          data: { element: node.rawName, replacement },
        })
      },
    })
  },
}

export default {
  meta: {
    name: 'eslint-plugin-ccm',
    version: '1.0.0',
  },
  rules: {
    'class-budget': classBudget,
    'no-bespoke-widgets': noBespokeWidgets,
  },
}
