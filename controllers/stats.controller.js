const Category = require("../models/category.model")
const Game = require("../models/game.model")
const Play = require("../models/play.model")
const ApiError = require("../models/apiError.model")
const moment = require("moment");

module.exports = {

    //Calculate the average score per game per category. The function is most suited to be displayed in a grouped bar char
    avgScorePerCat(req, res, next) {
        let map = [] //The map in which we'll store the stats

        //First find all the categories in the database. This is needed because .populate() doesnt work.
        //If .populate() would work, we wouldn't need to search for all the categories first.
        Category
            .find()
            .select("name") // We only need the name property
            .then(categories => {
                if (categories.length > 0) {
                    categories.map(c => c.toObject())

                    Game
                        .find()
                        .then(games => {
                            if (games.length > 0) {
                                games.map(g => g.toObject())

                                //First we need to group the data based on the game PIN
                                //Each group has a name and a 'series' property, which will hold the categories belonging to a game
                                games.forEach(g => map.push({
                                    name: g.pin,
                                    series: []
                                }
                                ))

                                //After that we'll add the categories from that game to the map
                                games.forEach(g => {
                                    g.questions.forEach(q => {

                                        //Transform the category ID from a question to a name
                                        const c = categories.find(c => String(c._id) == String(q.category))
                                        const mapIndex = map.findIndex(m => m.name == g.pin)
                                        const mapObject = map[mapIndex]
                                        let add = true

                                        //Check if the category name already exists
                                        mapObject.series.forEach(s => {
                                            if (s.name == c.name) add = false
                                        })

                                        //Only add if the name is distinct
                                        if (add) mapObject.series.push({ name: c.name, scores: [] })

                                        map[mapIndex] = mapObject
                                    })
                                })
                            } else next(new ApiError("NotFound", "No Game objects found in the database", 404))
                        })

                        //When the game-group has been set up, we need to calculate the average score per category per game
                        .then(() => {
                            Play
                                .find({ finished: true })
                                .select(["pin", "scores"])
                                .then(plays => {                                    
                                    if (plays.length > 0) {
                                        plays.map(p => p.toObject())

                                        plays.forEach(p => {

                                            //Fetch the object in the map which correspondents to this play's game.
                                            let mapObject = map.find(m => m.name == p.pin)
                                            
                                            //Create a temporary array datastructure in the map to store the individual score values
                                            //We do not calculate the average here, we're simply adding numbers to an array from a category
                                            //This is needed because we need to know by what number we need to devide the sum of the array
                                            p.scores.forEach(sc => {
                                                const c = categories.find(c => String(c._id) == String(sc.category))
                                                const s = mapObject.series.find(s => s.name == c.name)
                                                
                                                if (sc.score != 0) s.scores.push(sc.score)
                                            })
                                        })
                                    } else next(new ApiError("NotFound", "No Plays objects found in the database", 404))
                                })

                                //After that, we can calculate the average score by using .reduce()
                                .then(() => {
                                    // map.forEach(m => {
                                    //     m.series.forEach(s => {
                                    //         console.log(Math.round(s.scores.reduce((a, b) => a + b) / s.scores.length))
                                    //     })
                                    // })
                                    

                                    map.forEach(m => {
                                        m.series.forEach(s => {

                                            if (s.scores.length == 0) {
                                                s.value = 0
                                                delete s.scores
                                            } else if (s.scores.length == 1) {
                                                s.value = s.scores[0]
                                                delete s.scores
                                            } else {
                                                //We create a new value property inside the object which holds the average value
                                                s.value = Math.round(s.scores.reduce((total, current) => total + current) / s.scores.length)
                                                delete s.scores //And we delete the temporary datastructure which hold oud individual values
                                            }
                                        })
                                    })
                                   
                                    map.forEach(m => {
                                        const updatedSeries = []

                                        m.series.forEach(s =>{
                                            if (s.value != 0) updatedSeries.push(s)
                                        })

                                        m.series = updatedSeries
                                    })

                                    const updatedMap = []
                                    map.forEach(m => {
                                        if (m.series.length != 0) updatedMap.push(m)
                                    })
                                    map = updatedMap 
                                })

                                //Because of async database calls, the response has to be after the final database call
                                .then(() => res.status(200).json(map).end())
                        }).catch(err => next(new ApiError("ServerError", err, 400)))
                } else next(new ApiError("NotFound", "No categories found in the database", 404))
            }).catch(err => next(new ApiError("ServerError", err, 400)))
    },

    avgPlayer(req, res, next) {
        let map = {
            name: "Gemiddelde speler",
            series: []
        }
        const { limit } = req.query        

        Category
            .find()
            .select("name")
            .then(categories => {
                if (categories.length > 0) {
                    categories.map(c => c.toObject())

                    Play
                        .find({ finished: true })
                        .select(["scores"])
                        .sort({ createdAt: -1 })
                        .limit(parseInt(limit))
                        .then(plays => {
                            
                            if (plays.length > 0) {
                                plays.map(p => p.toObject())

                                plays.forEach(p => {
                                    
                                    p.scores.forEach(sc => {
                                        if (sc.score != 0) {
                                            const c = categories.find(c => String(c._id) == String(sc.category))
                                            let s = map.series.find(s => s.name == c.name)

                                            if (s == null) map.series.push({name: c.name, scores: []})
                                            s = map.series.find(s => s.name == c.name)
                                            
                                            s.scores.push(sc.score)
                                        }
                                    })
                                })

                                map.series.forEach(s => {
                                    if (s.scores.length == 1) s.value = s.scores[0] 
                                    s.value = Math.round(s.scores.reduce((a, b) => a + b) / s.scores.length)
                                })

                                map.series.forEach(s => delete s.scores)

                                res.status(200).json([map]).end()

                            } else next(new ApiError("NotFound", "No Plays objects found in the database", 404))
                        }).catch(err => next(new ApiError("ServerError", err, 400)))
                } else next(new ApiError("NotFound", "No categories found in the database", 404))
            }).catch(err => next(new ApiError("ServerError", err, 400)))
    },

    playsPerDay(req, res, next) {
        let map = [];
        const { gameID } = req.params
        if (gameID != null && !isNaN(gameID)) {

            Play.aggregate([
                {
                    $group: {
                        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                        value: { $sum: 1 }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        name: "$_id",
                        value: 1
                    }
                }
            ]).then(results => {
                res.status(200).json(results).end()
            }).catch(err => next(new ApiError("ServerError", err, 400)))
        } else next(new ApiError("ParamError", "Please provide a valid gameID", 404))
    },

    getTopPlay(req, res, next) {
        const { pin } = req.params

        Play
            .find({pin, finished: true})
            .sort({createdAt: -1})
            .then(plays => {
                let topScore = 0
                let topPlay = null

                plays.forEach(p => {
                    let sum = 0

                    p.scores.forEach(s => {
                        sum = sum + s.score
                    })

                    if (sum >= topScore) {
                        topScore = sum
                        topPlay = p
                    }
                })

                res.status(200).json(topPlay).end()
            })
    },

    getMinPlay(req, res, next) {
        const { pin } = req.params

        Play
            .find({pin, finished: true})
            .sort({createdAt: -1})
            .then(plays => {
                let minScore = null
                let minPlay = null

                plays.forEach(p => {
                    let sum = 0

                    p.scores.forEach(s => {
                        sum = sum + s.score
                    })

                    if (minScore == null ||sum <= minScore) {
                        minScore = sum
                        minPlay = p
                    }
                })

                res.status(200).json(minPlay).end()
            })
    }
}