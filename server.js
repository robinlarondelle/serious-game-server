if (process.env.NODE_ENV == "development") require('dotenv').config({ path: "../env/dev.env" })
else require('dotenv').config({ path: "./environment/prod.env" })

const express = require('express')
const morgan = require("morgan") //HTTP request logger
const bodyParser = require('body-parser') //Pase request body to JSON
const cors = require("cors") // Access control
const mongoose = require('mongoose')
const port = process.env.PORT || "3000"
const dbConfig = require("./config/database-config.json")

//MongoDB database connection
let databaseString = `${dbConfig.localhostDbString}${dbConfig.dbName}`
mongoose.connect(databaseString, {
    useNewUrlParser: true,
    useUnifiedTopology: true
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
if (process.env.NODE_ENV == "development") app.use(morgan("dev")) //dont show all logs when in production mode

//Routes imports
const testRoute = require("./routes/test.route")

//Assign Routes
app.use("/", testRoute)

//Catch all non existing endpoints
app.use("*", function (req, res, next) {
    next(new ApiError("Endpoint not found", 404))
})

//Error middleware
app.use(function (err, req, res, next) {
    res.status(err.code || 500).json(err).send();
})

app.listen(port, () => console.log(`Server is running on port: ${port}`))