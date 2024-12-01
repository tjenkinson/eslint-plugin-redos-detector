# eslint-plugin-redos-detector

An ESLint plugin that detects vulnerable regex using "[RedosDetector](https://github.com/tjenkinson/redos-detector)". It processes all [RegExp](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp) literals. I.e. `/ab+c/` but not `new RegExp('ab+c')`.

## Installation

You'll first need to install [ESLint](https://github.com/eslint/eslint):

```sh
npm i eslint --save-dev
```

Next, install [`eslint-plugin-redos-detector`](https://www.npmjs.com/package/eslint-plugin-redos-detector):

```sh
npm i --save-dev eslint-plugin-redos-detector
```

## Usage

Add `redos-detector` to the plugins section of your `.eslintrc` configuration file.

```json
{
  "plugins": ["redos-detector"]
}
```

Then configure the rule under the rules section.

```json
{
  "rules": {
    "redos-detector/no-unsafe-regex": "error"
  }
}
```

Or do the following to provide options.

```json
{
  "rules": {
    "redos-detector/no-unsafe-regex": [
      "error",
      {
        "ignoreError": true
      }
    ]
  }
}
```

### Options

- `ignoreError`: If `true` any error getting results be ignored. It's possible for the detection to fail with some patterns, or if the patten is malformed or uses unsupported features. See [this doc](https://github.com/tjenkinson/redos-detector/blob/main/README.md#options) for the type of errors. _(Default: `false`)_
- `maxSteps`: See the option in [this doc](https://github.com/tjenkinson/redos-detector/blob/main/README.md#options) with the same name. _(Default: See linked doc)_
- `maxScore`: See the option in [this doc](https://github.com/tjenkinson/redos-detector/blob/main/README.md#options) with the same name. _(Default: See linked doc)_
- `timeout`: See the option in [this doc](https://github.com/tjenkinson/redos-detector/blob/main/README.md#options) with the same name. _(Default: See linked doc)_
