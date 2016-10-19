module.exports = {
    "parserOptions": {
        "ecmaVersion": 6,       // specify the version of ECMAScript syntax you want to use
        "sourceType": "script", // set to "script" (default) or "module" if your code is in ECMAScript modules
    },
    "env": {
        "browser": true,        // browser global variables
        "es6": true,            // enable all ECMAScript 6 features except for modules, ecmaVersion parser option to 6
        "jasmine": true         // adds all of the Jasmine testing global variables for version 1.3 and 2.0
    },
    "extends": [
        "standard",             // Shareable config for JavaScript Standard Style
        "eslint:recommended",   // enables rules that report common problems
        "angular"               // // Linting rules to adhere to the John Papa's Angular Styleguide
    ],
    "rules": {
        // For further info see http://eslint.org/docs/rules/
        // To run eslint from the command line use .\node_modules\.bin\eslint modules
        // The --fix option on the command line can automatically fixes some problems

        // The following options might be set to error in the future...
        // "one-var": "off",            // enforce variables to be declared either together or separately in functions
        // "strict": "off",             // enforce consistent linebreak style
        // "linebreak-style": "off",    // enforce consistent linebreak style

        "one-var-declaration-per-line": [   // require or disallow newlines around variable declarations
            "error", "always"
        ],
        "eol-last": "error",            //require or disallow newline at the end of files
        "no-shadow": "error",           // disallow variable declarations shadowing outer scope variables
        "angular/json-functions": "error",    // use angular.fromJson/toJson instead of JSON.parse and JSON.stringify
        "angular/log": 0,
        "spaced-comment": "error",      // enforce consistent spacing after the // or /* in a comment
        "indent": [                     // enforce consistent indentation
            "error",
            4,
            {
                "SwitchCase": 1,
                // Case statements should be indented:
                // switch(a){
                //     case "a":
                //         break;
                //     case "b":
                //         break;
                // },
                "MemberExpression": 1,
                // foo
                //     .bar
                //     .baz();
                "FunctionDeclaration": {
                    "body": 1,
                    "parameters": "first"
                },
                "FunctionExpression": {
                    "body": 1,
                    "parameters": "first"
                }
                // var foo = function(bar,
                //                    baz,
                //                    qux) {
                //     qux();
                // }
            }
        ],
        "no-unused-vars": "error",          // disallow unused variables
        "semi": ["error", "always"],        // require or disallow semicolons instead of ASI
        "comma-dangle": ["error", "never"], // require or disallow trailing commas
        "angular/document-service": "off",  // prefer the AngularJS wrapper service $document over document object
        "angular/on-watch": "error",        // assign Watch/On methods on the scope to a variable, for $destroy handler
        "no-tabs": "error",                 // disallow tabs in file
        "angular/no-service-method": "error",   // You should prefer the factory() method instead of service()
        "no-multiple-empty-lines": "error", // disallow multiple empty lines
        "no-trailing-spaces": "error",      // disallow trailing whitespace at the end of lines
        "semi-spacing": "error",            // enforce consistent spacing before and after semicolons
        "comma-spacing": "error",           // enforce consistent spacing before and after commas
        "keyword-spacing": "error",         // enforce consistent spacing before and after keywords
        "space-before-function-paren": "error",   // consistent spacing before function definition opening parenthesis
        "operator-linebreak": "error",      // enforce consistent linebreak style for operators
        "padded-blocks": "error",           // require or disallow padding within blocks
        "space-before-blocks": "error",     // enforce consistent spacing before blocks
        "space-infix-ops": "error",         // require spacing around infix operators
        "no-multi-spaces": "error",         // disallow multiple spaces
        "space-in-parens": "error",         // enforce consistent spacing inside parentheses
        "space-unary-ops": "error",         // enforce consistent spacing before or after unary operators
        "key-spacing": "error",             // enforce consistent spacing between keys and values in object literal
        "brace-style": "error",             // enforce consistent brace style for blocks
        "standard/object-curly-even-spacing": "error",  // enforce consistent spacing inside braces of object literals
        "standard/array-bracket-even-spacing": "error", // enforces consistent spacing inside array brackets
        "array-bracket-spacing": ["error", "never"],
        "no-bitwise": "error",              // disallow bitwise operators
        "camelcase": [                      // enforce camelcase naming convention
            "error",
            {
                "properties": "never"       // Set to "always" to check for properties (440 errors)
            }
        ],
        "curly": "error",                   // enforce consistent brace style for all control statements
        "eqeqeq": "error",                  // require the use of === and !==
        "guard-for-in": "error",            // require for-in loops to include an if statement
        "no-extend-native": "error",        // disallow extending native types
        "wrap-iife": ["error", "any"],      // require parentheses around immediate function invocations
        "max-params": ["error", 10],        // enforce a maximum number of parameters in function definitions
        "max-depth": ["error", 5],          // enforce a maximum depth that blocks can be nested
        "max-statements": ["error", 40],    // enforce a maximum number of statements allowed in function blocks
        "complexity": ["error", 8],         // enforce a maximum cyclomatic complexity allowed in a program
        "max-len": [                        // enforce a maximum line length, also for comments
            "error",
            {
                "code": 120,
                "ignoreComments": false
            }
        ],
        "no-use-before-define": [           // disallow the use of variables before they are defined
            "error",
            {
                "functions": false
            }
        ],
        "new-cap": "error",                 // require constructor names to begin with a capital letter
        "no-caller": "error",               // disallow the use of arguments.caller or arguments.callee
        "no-empty": "error",                // disallow empty block statements
        "no-irregular-whitespace": "error", // disallow irregular whitespace outside of strings and comments
        "no-new": "error",                  // disallow new operators outside of assignments or comparisons
        "quotes": ["error", "single"],      // enforce the consistent use of either backticks, double, or single quotes
        "no-undef": "error",                // disallow the use of undeclared variables unless in /*global */ comments
        "no-cond-assign": "error",          // disallow assignment operators in conditional expressions
        "no-debugger": "error",             // disallow the use of debugger
        "no-eq-null": "error",              // disallow null comparisons without type-checking operators
        "no-eval": "error",                 // disallow the use of eval()
        "no-unused-expressions": "error",   // disallow unused expressions
        "block-scoped-var": "error",        // enforce the use of variables within the scope they are defined
        "no-iterator": "error",             // disallow the use of the __iterator__ property
        "no-loop-func": "error",            // disallow function declarations and expressions inside loop statements
        "no-multi-str": "error",            // disallow multiline strings
        "valid-typeof": "error",            // enforce comparing typeof expressions against valid strings
        "no-proto": "error",                // disallow the use of the __proto__ property
        "no-script-url": "error",           // disallow javascript: urls
        "dot-notation": "error",            // enforce dot notation whenever possible
        "no-new-func": "error",             // disallow new operators with the Function object
        "no-new-wrappers": "error",         // disallow new operators with the String, Number, and Boolean objects
        "no-invalid-this": "error",         // disallow this keywords outside of classes or class-like objects
        "require-yield": "error",            // require generator functions to contain yield
        "no-console": ["error", { allow: ["warn", "log"] }],

    },
    "plugins": [
        "standard",                         // Shareable config for JavaScript Standard Style
        "angular"                           // Linting rules to adhere to the John Papa's Angular Styleguide
    ]
};
