import { rules } from './eslint-plugin-redos-detector';
import { RuleTester } from 'eslint';

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 'latest' } });

describe('Eslint Plugin Redos Detector', () => {
  describe(`'no-unsafe-regex' rule`, () => {
    [true, false].forEach((ignoreError) => {
      describe(`${ignoreError ? 'with' : 'without'} "ignoreError"`, () => {
        const valid: RuleTester.ValidTestCase[] = [
          {
            code: '/a/',
            options: [{ ignoreError }],
          },
          {
            code: '/a/i',
            options: [{ ignoreError }],
          },
          {
            code: '/a/u',
            options: [{ ignoreError }],
          },
          {
            code: '/a/s',
            options: [{ ignoreError }],
          },
          ...(ignoreError
            ? [
                {
                  code: '/a{1,99999}/',
                  options: [{ ignoreError, maxSteps: 1 }],
                },
                {
                  code: '/a/iu',
                  options: [{ ignoreError, maxSteps: 1 }],
                },
              ]
            : []),
        ];

        const invalid: RuleTester.InvalidTestCase[] = [
          {
            code: '/a+a+/',
            options: [{ ignoreError }],
            errors: 1,
          },
          {
            code: '/a+A+/i',
            options: [{ ignoreError }],
            errors: 1,
          },
          ...(!ignoreError
            ? [
                {
                  code: '/a{1,99999}/',
                  options: [{ ignoreError, maxSteps: 1 }],
                  errors: 1,
                },
                {
                  code: '/a/iu',
                  options: [{ ignoreError, maxSteps: 1 }],
                  errors: 1,
                },
              ]
            : []),
        ];

        ruleTester.run('no-unsafe-regex', rules['no-unsafe-regex'], {
          valid,
          invalid,
        });
      });
    });
  });
});
