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

## Credit

Inspired by: https://github.com/jeremy-deutsch/eslint-plugin-jsx-falsy
