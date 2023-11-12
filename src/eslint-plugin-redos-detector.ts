import { Rule } from 'eslint';
import { isSafePattern, RedosDetectorResult, toFriendly } from 'redos-detector';
import * as ESTree from 'estree';

export type Options = {
  maxSteps?: number;
  maxBacktracks?: number;
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
            maxBacktracks: {
              type: 'number',
              minimum: 0,
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
        maxBacktracks,
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

          let caseInsensitive = false;
          let unicode = false;
          let dotAll = false;
          let multiLine = false;

          for (const flag of flags.split('')) {
            if (flag === 'i') {
              caseInsensitive = true;
            } else if (flag === 'u') {
              unicode = true;
            } else if (flag === 's') {
              dotAll = true;
            } else if (flag === 'm') {
              multiLine = true;
            } else if (flag !== 'g') {
              if (!ignoreError) {
                context.report({
                  node,
                  message: `Flag "${flag}" is not supported.`,
                });
              }
              return;
            }
          }

          if (caseInsensitive && unicode) {
            if (!ignoreError) {
              context.report({
                node,
                message: `Flag "i" and "u" are not supported together.`,
              });
            }
            return;
          }

          let result: RedosDetectorResult;
          try {
            result = isSafePattern(pattern, {
              maxSteps,
              maxBacktracks,
              timeout,
              caseInsensitive,
              unicode,
              dotAll,
              multiLine,
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
