const Category = require("../models/category.model")
const Game = require("../models/game.model")
const Play = require("../models/play.model")
const ApiError = require("../models/apiError.model")

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
                Game
                    .find()
                    .then(games => {
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
                    })

                    //When the game-group has been set up, we need to calculate the average score per category per game
                    .then(() => {
                        Play
                            .find({ finished: true })
                            .select(["pin", "scores"])
                            .then(plays => {
                                plays.forEach(p => {
                                    //Fetch the object in the map which correspondents to this play's game.
                                    let mapObject = map.find(m => m.name == p.pin)

                                    //Create a temporary array datastructure in the map to store the individual score values
                                    //We do not calculate the average here, we're simply adding numbers to an array from a category
                                    //This is needed because we need to know by what number we need to devide the sum of the array
                                    p.scores.forEach(sc => {
                                        const c = categories.find(c => String(c._id) == String(sc.category))
                                        const s = mapObject.series.find(s => s.name == c.name)
                                        s.scores.push(sc.score)
                                    })
                                })
                            })
                            
                            //After that, we can calculate the average score by using .reduce()
                            .then(() => {
                                map.forEach(m => {
                                    m.series.forEach(s => {
                                        //We create a new value property inside the object which holds the average value
                                        s.value = s.scores.reduce((total, current) => total + current) / s.scores.length
                                        delete s.scores //And we delete the temporary datastructure which hold oud individual values
                                    })
                                })
                            })

                            //Because of async database calls, the response has to be after the final database call
                            .then(() => res.status(200).json(map).end())
                    })
            })
    }
}