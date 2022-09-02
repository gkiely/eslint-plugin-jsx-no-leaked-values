import { TSESLint } from '@typescript-eslint/experimental-utils';
import { rule } from '../src';

const parserOptions: TSESLint.ParserOptions = {
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true,
  },
};

const ruleTester = new TSESLint.RuleTester({
  parser: require.resolve('@typescript-eslint/parser'),
  parserOptions,
});

ruleTester.run('jsx-no-leaked-render', rule, {
  valid: [
    {
      code: `<>{true ? <></> : ''}</>`,
    },
    {
      code: `<>{true && <></>}</>`,
    },
    {
      code: `<>{undefined && <></>}</>`,
    },
    {
      code: `<>{'' && <></>}</>`,
    },
  ],
  invalid: [
    {
      code: `
        const t = 0;
        <>{t && <></>}</>
      `,
      errors: [
        {
          messageId: 'jsxNumber&&',
        },
      ],
    },
    {
      code: `<>{0 && <></>}</>`,
      errors: [
        {
          messageId: 'jsxNumber&&',
        },
      ],
    },
    {
      code: ` const t = NaN; <>{t && <></>}</>`,
      errors: [
        {
          messageId: 'jsxNumber&&',
        },
      ],
    },
  ],
});