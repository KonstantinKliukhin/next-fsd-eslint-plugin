"use strict";
const { isPathRelative, getNormalizedCurrentPath, getRelativePath } = require('../helpers')

const INVALID_ABSOLUTE_IMPORT_ERROR_ID = 'invalid-absolute-import';
/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem', // `problem`, `suggestion`, or `layout`
    docs: {
      description: "feature sliced relative path checker",
      recommended: false,
      url: null, // URL to the documentation page for this rule
    },
    messages: {
      [INVALID_ABSOLUTE_IMPORT_ERROR_ID]: 'All imports should be relative in one slice',
    },
    fixable: 'code', // Or `code` or `whitespace`
    schema: [
      {
        type: 'object',
        properties: {
          alias: {
            type: 'string',
            default: '',
          },
        },
      },
    ], // Add a schema if the rule has options
  },

  create(context) {
    const alias = context.options[0]?.alias ?? '';

    function handleImportExport(node) {
      //app/entities/Article
      const value = node.source.value;
      const isStartsWithAlias = alias && value.startsWith(alias)
      const to = isStartsWithAlias ? value.replace(`${alias}/`, '') : value;

      // C:/Users/Kostya/Desktop/projects/ulbi-course
      const fromFilename = context.getFilename();

      if (shouldBeRelative(fromFilename, to)) {
        context.report({
          node: node,
          messageId: INVALID_ABSOLUTE_IMPORT_ERROR_ID,
          fix: (fixer) => {
            const penultimateImportPart = to.split('/').slice(-2, -1)[0];
            const isPenultimateImportPartLayer = penultimateImportPart in layers;
            if (isPenultimateImportPartLayer) return null;

            const normalizedPath = getNormalizedCurrentPath(fromFilename)
                .split('/')
                .slice(0, -1)
                .join('/');
            const relativePath = getRelativePath(normalizedPath, to)
            return fixer.replaceText(node.source, `'${relativePath}'`)
          }
        })
      }
    }
    return {
      ExportNamedDeclaration(node) {
        handleImportExport(node)
      },
      ImportDeclaration(node) {
        handleImportExport(node)
      }
    };
  },
};

const layers = {
  shared: 'shared',
  entities: 'entities',
  features: 'features',
  widgets: 'widgets',
  'pages-layer': 'pages-layer',
}

function shouldBeRelative(from, to) {
  if (isPathRelative(to) || !from || !to) {
    return false
  }

  const toArray = to.split('/');
  const toLayer = toArray[0]; // entities
  const toSlice = toArray[1]; // Article

  if (!toLayer || !toSlice || !layers[toLayer]) {
    return false;
  }

  const projectFrom = getNormalizedCurrentPath(from);
  if (!projectFrom) return false;

  const fromArray = projectFrom.split('/');
  const fromLayer = fromArray[1];
  const fromSlice = fromArray[2];

  if (!fromLayer || !fromSlice || !layers[fromLayer]) {
    return false;
  }
  const isSharedLayers = fromLayer === 'shared' && toLayer === 'shared'

  return ((toLayer === fromLayer) && (fromSlice === toSlice)) || isSharedLayers;
}

