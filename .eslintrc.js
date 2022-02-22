module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 12,
        sourceType: 'module',
    },
    plugins: ['@typescript-eslint'],
    rules: {
        '@typescript-eslint/explicit-member-accessibility': [
            'error',
            {
                accessibility: 'no-public',
            },
        ],
        '@typescript-eslint/no-use-before-define': [
            'warn',
            { functions: false },
        ],
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        complexity: ['off', { max: 10 }],
        'prefer-const': 'off',
        '@typescript-eslint/no-inferrable-types': 'off',
        '@typescript-eslint/no-empty-function': 'off',
        'prefer-rest-params': 'off',
        'no-var': 'off',
        '@typescript-eslint/no-this-alias': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
}
