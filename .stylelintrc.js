module.exports = {
    extends: [
        "stylelint-config-idiomatic-order",
        require.resolve("stylelint-config-recommended"),
        require.resolve("stylelint-config-standard-scss"),
        require.resolve("stylelint-config-sass-guidelines"),
        require.resolve("stylelint-config-prettier"),
    ],
    customSyntax: require.resolve("postcss-scss"),
    rules: {
        "selector-no-qualifying-type": null,
        "max-nesting-depth": 6,
        "selector-max-compound-selectors": 10,
        "function-parentheses-space-inside": "never-single-line",
        "property-no-unknown": [
            true,
            {
                ignoreProperties: ["composes"],
            },
        ],
        "order/properties-alphabetical-order": null,
        "selector-class-pattern": /[A-Za-z]+/,
        "selector-pseudo-class-no-unknown": [
            true,
            {
                ignorePseudoClasses: ["global"],
            },
        ],
    },
    overrides: [
        {
            files: ["**/*.{js,jsx,ts,tsx}"],
            customSyntax: require.resolve("@stylelint/postcss-css-in-js"),
            rules: {
                "value-keyword-case": null,
            },
        },
    ],
};
