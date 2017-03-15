Atlas
=====

Requirements
- NPM
- Bower
- Grunt
- Java JRE (needed to run protractor)

Installation
- Create a local file "grunt/config/credentials.js", use credentials.sample.js as a template. Usernames and passwords
are stored in Rattic. These credentials are used when running E2E tests.
- npm install
- bower install
- grunt
- Open the server at http://localhost:8000/

Other useful commands
- npm test
- grunt build-release
- npm run clean

Techniques used
- AngularJS
- Redux
- Leaflet
- D3

Conventions used
- John Papa Angular styleguide (https://github.com/johnpapa/angular-styleguide/tree/master/a1)
- EditorConfig (http://editorconfig.org/)
- BEM (http://csswizardry.com/2013/01/mindbemding-getting-your-head-round-bem-syntax/)
- BEMIT (http://csswizardry.com/2015/08/bemit-taking-the-bem-naming-convention-a-step-further/)
- BEM namespaces (http://csswizardry.com/2015/03/more-transparent-ui-code-with-namespaces/)
