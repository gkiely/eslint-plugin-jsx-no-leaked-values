# eslint-plugin-jsx-no-leaked-values

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

## Credit

Inspired by: https://github.com/jeremy-deutsch/eslint-plugin-jsx-falsy
