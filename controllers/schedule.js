//Get Empty bracket
const scheduleRouter = require('express').Router()
const request = require('request')

const teamRouter = require('express').Router()
const groupRouter = require('express').Router()
const knockoutRouter = require('express').Router()

const url = "https://raw.githubusercontent.com/lsv/fifa-worldcup-2018/master/data.json"

//TODO kerralla koko data vai vain teams, groups jne.?

const subRequest = (res, subpart) => {
  request({
    url: url,
    json: true
  }, function (error, response, body) {
  
    if (!error && response.statusCode === 200) {
      console.log(body)
      switch (subpart) {
        case "teams":
          res.json(body.teams)    
          break;
        case "groups":
          res.json(body.groups)    
          break; 
        case "knockout":
          res.json(body.knockout)    
          break;
        default:
          res.json(body)
          break;
      }
      
    }
  })
}


scheduleRouter.get('/', async (req, res) => {
  subRequest(res)
  /* request({
    url: url,
    json: true
  }, function (error, response, body) {
  
    if (!error && response.statusCode === 200) {
      console.log(body.teams)
      res.json(body)
    }
  })*/
}) 

teamRouter.get('/', async (req, res) => {
  subRequest(res, "teams")
}) 

groupRouter.get('/', async (req, res) => {
  subRequest(res, "groups")
}) 

knockoutRouter.get('/', async (req, res) => {
  subRequest(res, "knockout")
}) 
   
module.exports = { 
  scheduleRouter,
  teamRouter,
  groupRouter,
  knockoutRouter
}

//})
