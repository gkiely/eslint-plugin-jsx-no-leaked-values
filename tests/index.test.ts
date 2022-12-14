import { TSESLint } from '@typescript-eslint/utils';
import { rule } from '../src';

const parserOptions: TSESLint.ParserOptions = {
  sourceType: 'module',
  ecmaVersion: 'latest',
  ecmaFeatures: {
    jsx: true,
  },
};

const ruleTester = new TSESLint.RuleTester({
  parser: require.resolve('@typescript-eslint/parser'),
  parserOptions,
});

ruleTester.run('jsx-no-leaked-values', rule, {
  valid: [
    {
      code: `
        const t = 1;
        const Component = () => {
          return <>{t && <p>test</p>}</>;
        };
      `,
    },
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
    {
      code: `<>{1 && <></>}</>`,
    },
  ],
  invalid: [
    {
      code: `
      const t = NaN;
      const Component = () => {
        return <>{t && <p>test</p>}</>;
      };
    `,
      errors: [
        {
          messageId: 'jsxNumber&&',
        },
      ],
    },
    {
      code: `
      const t = 0;
      const Component = () => {
        return <>{t && <p>test</p>}</>;
      };
    `,
      errors: [
        {
          messageId: 'jsxNumber&&',
        },
      ],
    },
    {
      code: `const t = 0; <>{t && <></>}</>
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
      code: `<>{NaN && <></>}</>`,
      errors: [
        {
          messageId: 'jsxNumber&&',
        },
      ],
    },
    {
      code: `const t = NaN; <>{t && <></>}</>`,
      errors: [
        {
          messageId: 'jsxNumber&&',
        },
      ],
    },
  ],
});
