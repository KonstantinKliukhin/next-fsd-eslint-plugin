/**
 * @fileoverview restricts imports not from public api
 * @author Konstantin Kliukhin
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/public-api-imports"),
  RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parserOptions: { ecmaVersion: 6, sourceType: 'module'}
});

ruleTester.run("public-api-imports", rule, {
  valid: [
    {
      code: "import { Some } from 'entities/Some'",
      errors: [],
    },
    {
      code: "import { Some } from 'react-redux/some/deep/module'",
      errors: [],
    },
    {
      code: "import { Some } from '../../../../entities/Some/model/some.js'",
      errors: [],
    },
    {
      code: "import { Some } from 'entities/Some/@x/article.js'",
      errors: [],
    },
    {
      code: "import { SomeDecorator } from 'shared/config/storybook/someDecorator.tsx'",
      filename: 'src/entities/Some/ui/SomeComponent.stories.tsx',
      options: [
        {
          ignorePatterns: ['**/*.stories.(tsx|ts)']
        },
      ],
      errors: [],
    },
    {
      code: "import { renderComponent } from 'shared/config/tests'",
      filename: 'src/entities/Some/ui/SomeComponent.test.tsx',
      options: [
        {
          testFilesPatterns: ['**/*.test.(tsx|ts)']
        },
      ],
      errors: [],
    },
    {
      filename: 'some/pc/path/src/features/ManageArticleBlock/ui/ManageArticleBlock/ManageArticleBlock.tsx',
      options: [
        {
          alias: "@"
        }
      ],
      code: "import { anything } from '@/features/ManageArticleBlock/ui/blockForms/ArticleBlockFormPicker/ArticleBlockFormPicker'",
    },
    {
      filename: 'some/pc/path/src/features/ManageArticleBlock/ui/ManageArticleBlock/ManageArticleBlock.tsx',
      options: [
        {
          alias: "@"
        }
      ],
      code: "import { anything } from '@/features/ManageArticleBlock/server.ts'",
    },
  ],
  invalid: [
    {
      code: "import { Some } from 'entities/Some/model/some.js'",
      errors: [{ messageId: "invalid-import", type: "ImportDeclaration" }],
      output: "import { Some } from 'entities/Some'"
    },
    {
      code: "import { Some } from 'features/Some/model/some.js'",
      errors: [{ messageId: "invalid-import", type: "ImportDeclaration" }],
      output: "import { Some } from 'features/Some'"
    },
    {
      code: "import { Some } from '@/widgets/Some/model/some.js'",
      options: [{
        alias: '@'
      }],
      errors: [{ messageId: "invalid-import", type: "ImportDeclaration" }],
      output: "import { Some } from '@/widgets/Some'"
    }
  ],
});
