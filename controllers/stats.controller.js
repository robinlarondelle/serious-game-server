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

                                if (add) mapObject.series.push({ name: c.name, scores: [] })

                                map[mapIndex] = mapObject
                            })
                        })
                    })
                    .then(() => {
                        Play
                            .find({ finished: true })
                            .select(["pin", "scores"])
                            .then(plays => {
                                plays.map(p => p.toObject())

                                plays.forEach(p => {
                                    let mapObject = map.find(m => m.name == p.pin)

                                    p.scores.forEach(sc => {
                                        console.log(sc);

                                        const c = categories.find(c => String(c._id) == String(sc.category))
                                        const s = mapObject.series.find(s => s.name == c.name)
                                        s.scores.push(sc.score)
                                    })
                                })
                            })
                            .then(() => {
                                map.forEach(m => {
                                    m.series.forEach(s => {
                                        s.scores = s.scores.reduce((total, current) => total + current) / s.scores.length
                                    })
                                })
                            })
                            .then(() => res.status(200).json(map).end())
                    })
            })
    }
}