export default {
    "env": {
        "es2021": true,
        "node": true,
        "jest": true,
    },
    "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "standard-with-typescript",
        "plugin:prettier/recommended",
        "plugin:import/errors",
        "plugin:import/warnings",
        "plugin:import/typescript"
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "plugins": [
        "@typescript-eslint",
        "import",
        "prettier"
    ],
    "rules": {
        "prettier/prettier": "error",
        "import/extensions": "off",
        "import/no-unresolved": "error",
        "no-console": "off",
        "import/order": [
            "error",
            {
                "newlines-between": "never",
                groups: [
                    ["builtin", "external"], 
                    ["internal", "parent", "sibling", "index"],
                ],
            }
        ],
    },
    "settings": {
        "import/parsers": {
            "@typescript-eslint/parser": [".ts", ".tsx"]
        },  
        "import/resolver": {
            "typescript": {
                alwaysTryTypes: true,
                "project": "./tsconfig.json"
            }
        }
    }
}
