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

  *
  
