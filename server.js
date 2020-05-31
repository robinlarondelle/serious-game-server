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


//custom properties and imports
const port = process.env.PORT || "3000"
const dbConfig = require("./config/database-config.json")
const ApiError = require("./models/apiError.model")
const dbBaseUrl = process.env.dbBaseUrl


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

const app = express()
app.use(bodyParser.json()) //Parse request body to JSON
app.use(cors('*'))
if (dev) app.use(morgan("dev")) //dont show all logs when in production mode

//Routes imports
const organisationRoute = require("./routes/organisation.route")
const departmentRoute = require("./routes/department.route")

//Assign Routes
app.use("/organisation", organisationRoute)
app.use("/organisation", departmentRoute)

//Catch all non existing endpoints
app.use("*", function (req, res, next) {
    next(new ApiError("ServerError", "Endpoint not found", 404))
})

//Error middleware
app.use(function (err, req, res, next) { 
    console.log(err);
      
    res.status(err.code || 500).json(err).send();
})

app.listen(port, () => console.log(`Server is running on port: ${port}`))