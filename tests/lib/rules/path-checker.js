/**
 * @fileoverview feature sliced relative path checker
 * @author Konstantin Kliukhin
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/path-checker"),
  RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parserOptions: { ecmaVersion: 6, sourceType: 'module'}
});
ruleTester.run("path-checker", rule, {
  valid: [
    {
      filename: '/src/entities/Article/some.js',
      code: "import { Button } from 'shared/ui'",
      errors: [],
    },
    {
      filename: '/src/entities/Article/some.js',
      code: "import { Article } from './model.js'",
      errors: [],
    },
  ],

  invalid: [
    {
      filename: 'my/pc/path/src/entities/Article/some.js',
      code: "import { article } from 'entities/Article'",
      errors: [{ message: "All imports should be relative in one slice", type: "ImportDeclaration", }],
      output: null
    },
    {
      filename: '/src/entities/Article/some.js',
      options: [
        {
          alias: "@"
        }
      ],
      code: "import { article } from '@/entities/Article'",
      errors: [{ message: "All imports should be relative in one slice", type: "ImportDeclaration" }],
      output: null,
    },
    {
      filename: '/src/shared/lib/some/some.js',
      options: [
        {
          alias: "@"
        }
      ],
      code: "import { anything } from '@/shared/constants/anything.js'",
      errors: [{ message: "All imports should be relative in one slice", type: "ImportDeclaration" }],
      output: "import { anything } from '../../constants/anything.js'"
    },
    {
      filename: 'some/pc/path/src/features/ManageArticleBlock/ui/ManageArticleBlock/ManageArticleBlock.tsx',
      options: [
        {
          alias: "@"
        }
      ],
      code: "import { anything } from '@/features/ManageArticleBlock/ui/blockForms/ArticleBlockFormPicker/ArticleBlockFormPicker'",
      errors: [{ message: "All imports should be relative in one slice", type: "ImportDeclaration" }],
      output: "import { anything } from '../blockForms/ArticleBlockFormPicker/ArticleBlockFormPicker'"
    },
  ],
});
