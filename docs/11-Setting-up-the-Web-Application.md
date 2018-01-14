# Setting Up the Web Application

    * [React and Redux Sagas](https://start.jcolemorrison.com/react-and-redux-sagas-authentication-app-tutorial/)


## Setting Up the React Project
    * Download the project, change the name `web`, `cd web`
    * `git init`
    * `git add .`
    * `git commit -m "initial commit"`
    * `mkdir dockerfiles/dev`
    * `touch dockerfiles/dev/Dockerfile` see the code
    * `touch .env` with all the DB and other needed enviranment variables
    * `docker build -t awsdevops/web-dev ./dockerfiles/dev/`
    * `touch docker-compose.yml` see the code
    * `docker-compose run web yarn`
    * `docker-compose up`

## Testing Environment and Tools
  * Overview
    1. Testing our front end
    2. enforcing a level of testing converage
    3. giving a visual and map of what still needs to be convered

  * `docker-compose run web yarn`
  * add `"coverage": "react-scripts test --env=jsdom --coverage --collectCoverageFrom='[\"src/**/*.{js,jsx}\"]'; rm -rf .nyc_output; mv coverage .nyc_output;"` to `package.json`
  * `docker-compose exec web yarn add nyv -D` add `nyc` to as a development tool
  * add `"coverage:check": "nyc check-coverage --statements 90 --functions 90 --branches 90 --lines 90"` to `package.json` to check for 90% coverage
  * `mkdir .nyc_output`
  * `docker-compose exec web yarn coverage && yarn coverage:check`
  * `"coverage:report": "open ./.nyc_output/lcov-report/index.html"`
  * yarn coverage:report



## Snapshot Testing The Front End
  * create a new test file for widgets `src/widgets/index.test.js` see the code
  * add `enzyme`, `react-addons-test-utils`, and `react-test-renderer` in to devDependancies in the `package.json`
  * `docker-compose exec web yarn`
  * Let the test file know that `jest` is avaiable by adding the following lines into `package.json`
    ```
    "env": {
      "jest": true
    },
    ```
