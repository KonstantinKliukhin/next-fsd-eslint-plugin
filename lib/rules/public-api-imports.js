/**
 * @fileoverview restricts imports not from public api
 * @author Kliukhin Konstantin
 */
"use strict";
const { isPathRelative, getIsIgnoredFile, getCurrentFileSlice, getCurrentFileLayer} = require('../helpers')
const micromatch = require('micromatch');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const serverClientFileReexportsName = ['client', 'server']

const INVALID_IMPORT_ERROR = 'invalid-import';
/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: "restricts imports not from public api ",
      recommended: false,
      url: null,
    },
    fixable: 'code',
    messages: {
      [INVALID_IMPORT_ERROR]: 'You can import only from public api',
    },
    schema: [
      {
        type: 'object',
        properties: {
          aliases: {
            type: 'string',
            default: '',
          },
          ignorePatterns: {
            type: 'array',
            default: [],
          },
          testFilesPatterns: {
            type: 'array',
            default: [],
          },
        },
      },
    ],
  },
  create(context) {
    const alias = context.options[0]?.alias ?? '';
    const ignorePatterns = context.options[0]?.ignorePatterns ?? [];
    const testFilesPatterns = context.options[0]?.testFilesPatterns ?? [];

    return {
      ImportDeclaration(node) {
        //app/entities/Article
        const value = node.source.value;
        const isStartsWithAlias = alias && value.startsWith(alias)
        const importTo = isStartsWithAlias ? value.replace(`${alias}/`, '') : value;
        const fromFilename = context.getFilename();


        if (isPathRelative(importTo)) return;

        const isFileIgnored = getIsIgnoredFile(ignorePatterns, fromFilename)
        if (isFileIgnored) return;

        const segments = importTo.split('/');

        const toLayer = segments[0];
        const toSlice = segments[1];
        const currentFileLayer = getCurrentFileLayer(fromFilename);
        const currentFileSlice = getCurrentFileSlice(fromFilename);

        if (!availableLayers[toLayer]) return;
        if (hasIgnoreSegments(segments, ignorePatterns)) return;
        if (currentFileLayer === toLayer && currentFileSlice === toSlice) return;

        const isFromTestFile = getIsFromTestFile(fromFilename, testFilesPatterns)
        const isLastSegmentServerOrClientReexport = getIsServerClientReexportSegment(segments[2])
        const shouldAllowOneMoreSegment = isLastSegmentServerOrClientReexport || isFromTestFile
        const allowedSegmentsCount = shouldAllowOneMoreSegment ? 3 : 2;
        const isImportNotFromPublicApi = segments.length > allowedSegmentsCount;

        if (isImportNotFromPublicApi) {
          return context.report({
            node,
            messageId: INVALID_IMPORT_ERROR,
            fix: (fixer) => {
              return fixer.replaceText(node.source, `'${alias ? `${alias}/` : ''}${toLayer}/${toSlice}'${isLastSegmentServerOrClientReexport ? `/${segments[2]}` : ''}`)
            }
          })
        }
      }
    };
  },
};

function getIsServerClientReexportSegment(segment) {
  if (!segment) return false

  const segmentWithoutExtension = segment.replace(/\.(tsx?|jsx?)$/, '')

  return serverClientFileReexportsName.includes(segmentWithoutExtension)
}

function getIsFromTestFile(fromFilename, testFilesPatterns) {
  return testFilesPatterns.some(testFilesPattern => micromatch.isMatch(fromFilename, testFilesPattern));
}

function hasIgnoreSegments (segments) {
  return segments.some(
      (segment) => ignoreImportSegments.some(
      (ignoreSegment) => ignoreSegment === segment
    )
  )
}

const ignoreImportSegments = ['@x'];

const availableLayers = {
  entities: 'entities',
  features: 'features',
  widgets: 'widgets',
  "pages-layer": 'pages-layer',
}
