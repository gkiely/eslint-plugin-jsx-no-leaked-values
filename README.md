# eslint-plugin-jsx-no-leaked-render

Avoid accidentally rendering `0` or `NaN`. Only works with `@typescript-eslint/parser`.

## Examples

```tsx
function MyComponent() {
  return (
    <div>
      {0 && <ComponentX /> /* error */}
      {NaN && <ComponentX /> /* error */}
    </div>
  );
}
```

## Installation

```sh
npm i -D eslint-plugin-jsx-no-leaked-render
```

## Usage

```json
{
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "project": ["./tsconfig.json"]
  },
  "plugins": ["jsx-no-leaked-render"]
}
```

Then enable the rule under the rules section.

```json
{
  "rules": {
    "jsx-no-leaked-render": "error"
  }
}
```

## Credit

Inspired by: https://github.com/jeremy-deutsch/eslint-plugin-jsx-falsy
