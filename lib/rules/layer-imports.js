/**
 * @fileoverview restricts layer imports from upper layers to lower
 * @author Konstantin Kliukhin
 */
"use strict";
const {isPathRelative, getIsIgnoredFile, getCurrentFileLayer} = require('../helpers');
const micromatch = require('micromatch');

const INCORRECT_LAYER_IMPORT_ERROR_ID = 'incorrect-layer-import';
module.exports = {
  meta: {
    type: 'problem', // `problem`, `suggestion`, or `layout`
    docs: {
      description: "saf",
      category: "Fill me in",
      recommended: false,
      url: null, // URL to the documentation page for this rule
    },
    fixable: null, // Or `code` or `whitespace`
    schema: [
      {
        type: 'object',
        properties: {
          alias: {
            type: 'string',
          },
          ignoreImportPatterns: {
            type: 'array',
          },
          ignoreFilesPatterns: {
            type: 'array',
          }
        },
      }
    ],
    messages: {
      [INCORRECT_LAYER_IMPORT_ERROR_ID]: "Layer can't be imported from layer upper, pls follow this layers imports convention shared > entities > featured > widgets > pages-layer > app"
    }
  },

  create(context) {
    const layers = {
      'app': ['pages-layer', 'widgets', 'features', 'shared', 'entities'],
      'pages-layer': ['widgets', 'features', 'shared', 'entities'],
      'widgets': ['features', 'shared', 'entities'],
      'features': ['shared', 'entities'],
      'entities': ['shared'],
      'shared': ['shared'],
    }

    const availableLayers = {
      'app': 'app',
      'entities': 'entities',
      'features': 'features',
      'shared': 'shared',
      'pages-layer': 'pages-layer',
      'widgets': 'widgets',
    }


    const {alias = '', ignoreImportPatterns = [], ignoreFilesPatterns = []} = context.options[0] ?? {};
    const currentFilePath = context.getFilename();

    const getImportLayer = (value) => {
      const importPath = alias ? value.replace(`${alias}/`, '') : value;
      const segments = importPath?.split('/')

      return segments?.[0]
    }

    return {
      ImportDeclaration(node) {
        const importPath = node.source.value;
        const currentFileLayer = getCurrentFileLayer(currentFilePath);
        const importLayer = getImportLayer(importPath);

        if(isPathRelative(importPath)) return;

        if(!availableLayers[importLayer] || !availableLayers[currentFileLayer]) return;

        const isIgnoredImport = ignoreImportPatterns.some(pattern => {
          return micromatch.isMatch(importPath, pattern)
        });
        const isIgnoredFile = getIsIgnoredFile(ignoreFilesPatterns, currentFilePath)

        if(isIgnoredImport || isIgnoredFile) return;

        if(!layers[currentFileLayer]?.includes(importLayer)) {
          context.report({
            node,
            messageId: INCORRECT_LAYER_IMPORT_ERROR_ID
          });
        }
      }
    };
  },
};

