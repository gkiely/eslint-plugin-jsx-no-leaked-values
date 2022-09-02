import {
  ESLintUtils,
  AST_NODE_TYPES,
} from '@typescript-eslint/experimental-utils';
import * as ts from 'typescript';
import * as tsutils from 'tsutils';

const createRule = ESLintUtils.RuleCreator(name => name);

export const rule = createRule<[], 'jsxNumber&&'>({
  name: 'jsx-no-leaked-values',
  defaultOptions: [],
  meta: {
    type: 'problem',
    docs: {
      description:
        'Prevent boolean expressions from adding unwanted falsy numbers to your JSX',
      category: 'Possible Errors',
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

        let isLeftNodeNumber = tsutils.isTypeFlagSet(
          type,
          ts.TypeFlags.NumberLike
        );

        let isLeftNodeAny = tsutils.isTypeFlagSet(type, ts.TypeFlags.Any);

        if (!isLeftNodeNumber && !isLeftNodeAny && tsutils.isUnionType(type)) {
          for (const ty of type.types) {
            if (tsutils.isTypeFlagSet(ty, ts.TypeFlags.NumberLike)) {
              isLeftNodeNumber = true;
              break;
            }
            if (tsutils.isTypeFlagSet(ty, ts.TypeFlags.Any)) {
              isLeftNodeAny = true;
              break;
            }
          }
        }

        if (isLeftNodeNumber || isLeftNodeAny) {
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
