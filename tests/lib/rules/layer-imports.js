/**
 * @fileoverview restricts layer imports from upper layers to lower
 * @author Konstantin Kliukhin
 */
"use strict";

const rule = require("../../../lib/rules/layer-imports"),
    RuleTester = require("eslint").RuleTester;

const aliasOptions = [
  {
    alias: '@'
  }
]
const ruleTester = new RuleTester({
  parserOptions: { ecmaVersion: 6, sourceType: 'module' },
});
ruleTester.run("layer-imports", rule, {
  valid: [
    {
      filename: 'C:/Users/tim/Desktop/javascript/production_project/src/features/Article',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/shared/Button.tsx'",
      errors: [],
      options: aliasOptions,
    },
    {
      filename: 'C:/Users/tim/Desktop/javascript/production_project/src/features/Article',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article'",
      errors: [],
      options: aliasOptions,
    },
    {
      filename: 'C:/Users/tim/Desktop/javascript/production_project/src/app/providers',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/widgets/Articl'",
      errors: [],
      options: aliasOptions,
    },
    {
      filename: 'C:/Users/tim/Desktop/javascript/production_project/src/widgets/some-widget',
      code: "import { useLocation } from 'react-router-dom'",
      errors: [],
      options: aliasOptions,
    },
    {
      filename: 'C:/Users/tim/Desktop/javascript/production_project/src/app/providers',
      code: "import { addCommentFormActions, addCommentFormReducer } from 'redux'",
      errors: [],
      options: aliasOptions,
    },
    {
      filename: 'C:/Users/tim/Desktop/javascript/production_project/src/index.tsx',
      code: "import { StoreProvider } from '@/app/providers/StoreProvider';",
      errors: [],
      options: aliasOptions,
    },
    {
      filename: 'C:/Users/tim/Desktop/javascript/production_project/src/entities/Article.tsx',
      code: "import { StateSchema } from '@/app/providers/StoreProvider'",
      errors: [],
      options: [
        {
          alias: '@',
          ignoreImportPatterns: ['**/StoreProvider']
        }
      ],
    },
    {
      filename: 'C:/Users/tim/Desktop/javascript/Ulbi/src/shared/config/storybook/StoreDecorator/StoreDecorator.tsx',
      code: "import { StoreProvider } from '@/app/providers/StoreProvider'",
      errors: [],
      options: [
        {
          alias: '@',
          ignoreFilesPatterns: ['**/src/shared/config/storybook/**/*.(ts|tsx)']
        }
      ],
    }
  ],

  invalid: [
    {
      filename: 'C:/Users/tim/Desktop/javascript/production_project/src/entities/providers',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/features/Article'",
      errors: [{ messageId: "incorrect-layer-import"}],
      options: aliasOptions,
    },
    {
      filename: 'C:/Users/tim/Desktop/javascript/production_project/src/features/providers',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/widgets/Article'",
      errors: [{ messageId: "incorrect-layer-import"}],
      options: aliasOptions,
    },
    {
      filename: 'C:/Users/tim/Desktop/javascript/production_project/src/entities/providers',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/widgets/Article'",
      errors: [{ messageId: "incorrect-layer-import"}],
      options: aliasOptions,
    },
  ],
});
