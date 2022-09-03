# eslint-plugin-jsx-no-leaked-values

Avoid accidentally rendering `0` or `NaN`. Requires `@typescript-eslint/parser`.

## Examples

```tsx
function MyComponent() {
  return (
    <div>
      {0 && <ComponentX /> /* error */}
      {NaN && <ComponentX /> /* error */}
      {undefined && <ComponentX /> /* no error */}
      {null && <ComponentX /> /* no error */}
      {'' && <ComponentX /> /* no error */}
      {false && <ComponentX /> /* no error */}
    </div>
  );
}
```

## Installation

```sh
npm i -D eslint-plugin-jsx-no-leaked-values
```

## Usage

Install and enable typescript-eslint with type checking, see:

- https://typescript-eslint.io/docs
- https://typescript-eslint.io/docs/linting/typed-linting

```sh
npm install -d @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint typescript
```

```json
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "tsconfigRootDir": ".",
    "project": ["./tsconfig.json"]
  },
  "plugins": ["@typescript-eslint"],
```

Configure the plugin in your `.eslintrc`:

```json
{
  "extends": ["plugin:jsx-no-leaked-values/recommended"]
}
```

This essentially expands to:

```json
{
  "plugins": ["jsx-no-leaked-values"],
  "rules": {
    "jsx-no-leaked-values/jsx-no-leaked-values": "error"
  }
}
```

## Differences to jsx-no-leaked-render

The [jsx-no-leaked-render](https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-no-leaked-render.md) react plugin reports an error for all uses of `&&` that do not start with `Boolean(value)` or `!!value`. This means that all values have to be coerced at the expression as it is not type aware, even booleans!

On my codebase it reported a lint error for almost all uses of `&&` and meant those cases had to be made a ternary or converted via Boolean at the expression.

This plugin uses type information via typescript-eslint to only show an error for `number`, `0` or `NaN`.

Seeing as `undefined`, `null` and `''` do not render on screen, I deemed it unnecessary to report errors for those cases.

## Credit

Inspired by:

- https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-no-leaked-render.md
- https://github.com/jeremy-deutsch/eslint-plugin-jsx-falsy
