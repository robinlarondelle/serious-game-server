//Requiring the correct env files by checking NODE_ENV
const dev = process.env.NODE_ENV == "development"
if (dev) require('dotenv').config({ path: "./env/dev.env" })
else require('dotenv').config({ path: "./env/prod.env" })


//npm dependencies
const express = require('express')
const morgan = require("morgan") //HTTP request logger
const bodyParser = require('body-parser') //Pase request body to JSON
const cors = require("cors") // Access control
const mongoose = require('mongoose')
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs")


//custom properties and imports
const port = process.env.PORT || "3000"
const dbConfig = require("./config/database-config.json")
const ApiError = require("./models/apiError.model")
const dbBaseUrl = process.env.dbBaseUrl
const swaggerDoc = YAML.load("./config/swagger.yaml")
const swaggerOptions = {
    explorer: true
}

//MongoDB database connection
let databaseString = `${dbBaseUrl}${dbConfig.dbName}`
mongoose.connect(databaseString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})
    .then(() => console.log('successfully connected to the database'))
    .catch(err => {
        console.log('error connecting to the database')
        console.log(err);

        //Kill the service on error
        process.exit()
    })


//Server setup    
const app = express()
app.use(bodyParser.json())
app.use(cors('*'))
if (dev) app.use(morgan("dev")) //dont show all logs when in production mode
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc, swaggerOptions));


//Middleware imports
const organisationMiddleware = require("./middlewares/organisation.middleware")


//Middleware handlers
app.param('orgID', organisationMiddleware.findOrganisationByID)


//Routes imports
const organisationRoute = require("./routes/organisation.route")
const departmentRoute = require("./routes/department.route")
const questionRoute = require("./routes/question.route")


//Route Handlers
app.use("/organisation", organisationRoute)
app.use("/organisation/:orgID/department", departmentRoute)
app.use("/organisation/:orgID/question", questionRoute)


//Catch all non existing endpoints
app.use("*", function (req, res, next) {
    next(new ApiError("ServerError", "Endpoint not found", 404))
})


//Error middleware
app.use(function (err, req, res, next) {
    console.log(err);

    res.status(err.code || 500).json(err).send();
})


//Run server
app.listen(port, () => console.log(`Server is running on port: ${port}`))