const Category = require("../models/category.model")
const Game = require("../models/game.model")
const Play = require("../models/play.model")
const ApiError = require("../models/apiError.model")

module.exports = {
    avgScorePerCat(req, res, next) {
        let map = []

        Category
            .find()
            .select("name")
            .then(categories => {
                categories.map(c => c.toObject())
                Game
                    .find()
                    .then(games => {
                        games.forEach(g => map.push({
                            name: g.pin,
                            series: []
                            }
                        ))

                        games.forEach(g => {
                            g.questions.forEach(q => {                                
                                const c = categories.find(c => String(c._id) == String(q.category))                                                                
                                const mapIndex = map.findIndex(m => m.name == g.pin)
                                const mapObject = map[mapIndex]
                                let add = true

                                mapObject.series.forEach(s => {
                                    if (s.name == c.name) add = false
                                })

                                if (add) mapObject.series.push({ name: c.name })

                                map[mapIndex] = mapObject
                            })
                        }) 
                    })
                    .then(() => {

                    })
                    .then(() => res.status(200).json(map).end())
            })
    }
}