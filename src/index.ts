import {
  ESLintUtils,
  AST_NODE_TYPES,
} from '@typescript-eslint/experimental-utils';
import ts from 'typescript';
import * as tsutils from 'tsutils';
import { match } from 'ts-pattern';

const createRule = ESLintUtils.RuleCreator(name => name);

const checkError = (type: ts.Type): boolean => {
  return match({
    numberLike: tsutils.isTypeFlagSet(type, ts.TypeFlags.NumberLike),
    literal: tsutils.isLiteralType(type),
    falsy: tsutils.isFalsyType(type),
    any: tsutils.isTypeFlagSet(type, ts.TypeFlags.Any),
  })
    .with(
      {
        any: true,
      },
      () => true
    )
    .with(
      // Generic numbers
      {
        numberLike: true,
        literal: false,
        falsy: false,
      },
      () => true
    )
    .with(
      // falsy literals
      {
        numberLike: true,
        literal: true,
        falsy: true,
      },
      () => true
    )
    .otherwise(() => false);
};

export const rule = createRule<[], 'jsxNumber&&'>({
  name: 'jsx-no-leaked-values',
  defaultOptions: [],
  meta: {
    type: 'problem',
    docs: {
      description:
        'Prevent boolean expressions from adding unwanted falsy numbers to your JSX',
      recommended: 'error',
      requiresTypeChecking: true,
    },
    messages: {
      'jsxNumber&&': 'This expression could evaluate to 0 or NaN.',
    },
    schema: [],
  },
  create(context) {
    return {
      LogicalExpression: expr => {
        if (expr.operator !== '&&') return;
        if (
          !expr.parent ||
          expr.parent.type !== AST_NODE_TYPES.JSXExpressionContainer
        ) {
          return;
        }
        const service = context.parserServices;
        const checker = service?.program?.getTypeChecker();
        const tsNode = service?.esTreeNodeToTSNodeMap?.get(expr.left);
        if (!checker || !tsNode) {
          throw new Error('Parser service not available!');
        }
        const leftNodeType = checker.getTypeAtLocation(tsNode);
        const constrainedType = checker.getBaseConstraintOfType(leftNodeType);
        const type = constrainedType ?? leftNodeType;

        // Testing
        // console.log(
        //   tsutils.isTypeFlagSet(type, ts.TypeFlags.NumberLike),
        //   tsutils.isLiteralType(type),
        //   tsutils.isFalsyType(type),
        //   tsutils.isTypeFlagSet(type, ts.TypeFlags.Any)
        // );

        let isError = checkError(type);
        if (!isError && tsutils.isUnionType(type)) {
          for (const t of type.types) {
            if (checkError(t)) {
              isError = true;
              break;
            }
          }
        }

        if (isError) {
          context.report({
            node: expr.left,
            messageId: 'jsxNumber&&',
          });
        }
      },
    };
  },
});

export const configs = {
  recommended: {
    plugins: ['jsx-no-leaked-values'],
    rules: {
      'jsx-no-leaked-values/jsx-no-leaked-values': 'error',
    },
  },
};

export const rules = {
  'jsx-no-leaked-values': rule,
};
