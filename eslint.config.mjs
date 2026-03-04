import eslint from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    {
        ignores: ['dist', 'node_modules'],
    },
    {
        files: [
            '**/*.ts',
            '**/*.tsx',
            '**/*.cts',
            '**/*.mts',
            '**/*.js',
            '**/*.jsx',
            '**/*.cjs',
            '**/*.mjs',
        ],
        rules: {
            'semi': ['error', 'always'],
            'eol-last': ['error', 'always'],
            'no-unused-expressions': 'error',
            'no-var': 'error',
            'no-eval': 'error',
            'no-fallthrough': 'error',
            'no-new-func': 'error',
            'no-new-wrappers': 'error',
            'no-return-await': 'error',
            'no-self-assign': ['error', { props: true }],
            'no-self-compare': 'error',
            'no-sequences': 'error',
            'no-throw-literal': 'error',
            'no-useless-catch': 'error',
            'no-useless-concat': 'error',
            'no-useless-escape': 'error',
            'no-useless-return': 'error',
            'no-void': 'error',
            'yoda': 'error',
            'no-buffer-constructor': 'error',
            'for-direction': 'error',
            'no-empty': 'error',
            'no-extra-boolean-cast': 'error',
            'no-unreachable': 'error',
        },
    },
    eslintConfigPrettier
);
