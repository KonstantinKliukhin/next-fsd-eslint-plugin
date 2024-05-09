# eslint-plugin-next-fsd

eslint plugin for next.js project with FSD architecture

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Next, install `eslint-plugin-next-fsd`:

```sh
npm install eslint-plugin-next-fsd --save-dev
```

## Usage

Add `next-fsd` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "next-fsd"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "next-fsd/rule-name": 2
    }
}
```

## Rules

### layer-imports

checks the vertical relationships of the FSD on imports

Options:
- alias
- ignoreImportPatterns
- ignoreFilesPatterns

How I use these options in my projects:

```json
{
  "rules": {
    "next-fsd/layer-imports": [
      "error",
      {
        "alias": "@",
        "ignoreImportPatterns": [
          "**/@x/**"
        ],
        "ignoreFilesPatterns": [
          "**/middleware.ts",
          "**/src/shared/config/**/*.(ts|tsx)",
          "**/src/shared/api/**/*.(ts|tsx)"
        ]
      }
    ]
  }
}
```
- ignoreImportPatterns - allows import files that matches this pattern from any place 
- ignoreFilesPatterns - allows import from files that matches these patter (E.g. in my case in file @/shared/config/auth-options.ts I can import from file @features/login )

### path-checker

Checks relative imports in one slice

Options:
- alias

How I use this option in my projects:

```json
{
  "rules": {
    "alias": "@",
    "ignorePatterns": ["**/src/shared/*.(ts|tsx)", "**/middleware.ts"]
  }
}
```

### public-api-imports
Checks the correctness of imports from the public API

Options:
- alias
- ignorePatterns
- testFilesPatterns

How I use these options in my projects:

```json
{
  "rules": {
    "alias": "@",
    "ignorePatterns": ["**/src/shared/*.(ts|tsx)", "**/middleware.ts"],
    "testFilesPatterns": ["**/*.test.(ts|tsx)", "**/*.stories.(ts|tsx)"]
  }
}
```

- ignorePatterns - ignores public imports rule in files that matches pattern
- testFilesPatterns - allows one more level in imports for files that matches pattern.<br>
E.g. in file ``shared/tests/some-fn.test.ts`` 
```ts
 import i18n from "shared/conig/i18n"
```

