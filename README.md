# serious-game-server
This is the Node.js backend server which handles the requests and provides the data for the 'Lost in the Jungle' game. 'Lost in the Jungle' is a game for the Serious Game course by Avans Breda.

## How to start contributing?
Make sure to run `npm i` and `npm i -g concurrently` to install all dependencies. Create a new `dev.env` and `prod.env` file based on the `.sampe-env` file and fill in the missing values.

## Documentation
To document this API, we use Swagger. All the files for the Swagger doc are in the 'Docs' folder. Because of a known bug in Swagger v3, [which renderes multifile swagger docs useless because relative referencing is broken](https://github.com/swagger-api/swagger-editor/issues/1409), we use a auto-generated (ag) swagger JSON file, based on the swagger.yaml.

The package we use to develop our Swagger Docs is swagger-ui-watcher. All this package does is watch your YAML Swagger files for updates and update the UI accordingly, which makes developing the docs easier.

If you want to update the swagger docs, run `npm run update-docs` command. This will open a new browser window with the swagger docs which will get updated immediately if the .yaml files are updated.

The docs can be found under `/docs`. If you have edited the Swagger docs, *make sure to update them by running the `swagger-ui-watcher --build=./docs/ag-swagger.json ./docs/swagger.yaml` command in a separate terminal.

## Project Contributors
This project is a collaboration between 6 students for a school assignment