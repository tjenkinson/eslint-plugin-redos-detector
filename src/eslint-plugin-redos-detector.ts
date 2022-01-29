import { Rule } from 'eslint';
import { isSafePattern, RedosDetectorResult, toFriendly } from 'redos-detector';
import * as ESTree from 'estree';

export type Options = {
  maxSteps?: number;
  maxResults?: number;
  timeout?: number;
  ignoreError?: boolean;
};

export const rules: Record<string, Rule.RuleModule> = {
  'no-unsafe-regex': {
    meta: {
      type: 'problem',
      docs: {
        description: 'disallow regex that is susceptible to ReDoS attacks',
        url: 'https://github.com/tjenkinson/eslint-plugin-redos-detector',
      },
      schema: [
        {
          type: 'object',
          properties: {
            maxSteps: {
              type: 'number',
              minimum: 1,
            },
            maxResults: {
              type: 'number',
              minimum: 1,
            },
            timeout: {
              type: 'number',
              minimum: 1,
            },
            ignoreError: {
              type: 'boolean',
            },
          },
          additionalProperties: false,
        },
      ],
    },
    create: (context: Rule.RuleContext) => {
      const {
        maxSteps,
        maxResults,
        timeout,
        ignoreError = false,
      }: Options = context.options[0] || {};

      return {
        Literal(node) {
          const regexNode = node as ESTree.RegExpLiteral;
          if (!regexNode.regex) {
            return;
          }
          const { pattern, flags } = regexNode.regex;

          let unicode = false;

          for (const flag of flags.split('')) {
            if (flag === 'u') {
              unicode = true;
            } else {
              if (!ignoreError) {
                context.report({
                  node,
                  message: `Flag "${flag}" is not supported.`,
                });
              }
              return;
            }
          }

          let result: RedosDetectorResult;
          try {
            result = isSafePattern(pattern, {
              maxSteps,
              maxResults,
              timeout,
              unicode,
            });
          } catch (e: any) {
            if (!ignoreError) {
              context.report({
                node,
                message: `Error checking regex.\n\n${e.message || '[Unknown]'}`,
              });
            }
            return;
          }
          if (result.safe) {
            return;
          }
          let report = !!result.trails.length || (result.error && !ignoreError);
          if (report) {
            context.report({ node, message: toFriendly(result) });
          }
        },
      };
    },
  },
};
