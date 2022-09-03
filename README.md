# eslint-plugin-jsx-no-leaked-values

Avoid accidentally rendering `0` or `NaN`. Requires `@typescript-eslint/parser`.

## Examples

```tsx
function MyComponent() {
  return (
    <div>
      {0 && <ComponentX /> /* error */}
      {NaN && <ComponentX /> /* error */}
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

The (jsx-no-leaked-render)[https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-no-leaked-render.md] react plugin rule looks for all uses of `&&` that do not start with `Boolean(value)` or `!!value` and reports an error. This means that all values have to be coerced at the condition as it is not type aware, even booleans!

On my code base it reported a lint error almost all uses of `&&` and meant those cases had to be made a ternary or converted via Boolean at the expression.

This plugin uses type information via typescript-eslint to only show an error for `number`, `0` or `NaN`.

Seeing as `undefined`, `null` and `''` do not render on screen, I deemed it unnecessary to report errors for those cases.

## Credit

Inspired by:
https://github.com/jeremy-deutsch/eslint-plugin-jsx-falsy
https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-no-leaked-render.md
