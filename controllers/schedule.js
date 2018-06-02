//Get Empty bracket
const scheduleRouter = require('express').Router()
const request = require('request')

const url = "https://raw.githubusercontent.com/lsv/fifa-worldcup-2018/master/data.json"

//TODO kerralla koko data vai vain teams, groups jne.?

scheduleRouter.get('/', async (req, res) => {
  request({
    url: url,
    json: true
  }, function (error, response, body) {
  
    if (!error && response.statusCode === 200) {
      //console.log(body)
      res.json(body)
    }
  })
})

   
module.exports = scheduleRouter

//})
