const { Router } = require('express');
const { getDistance } = require('geolib');
const baby = require('babyparse')
const request = require('request');

const fileUrl = 'https://raw.githubusercontent.com/Rirax/adot-api-test/master/api/ressources/events.csv'

const router = Router();

async function getCsv() {
  return new Promise(resolve => {
    let req = request(fileUrl, function (error, response, body) {
      parsed = baby.parse(body, {
        header: true,
        delimiter: ",",
        complete: function(results) {
          resolve(results.data)
        }
      });
    });
    req.end();
  })
}

function bind(pois, events) {
  pois.map(poi => {
    poi.impressions = 0;
    poi.clicks = 0;
    events.map(_event => {
      let dist = getDistance(
        { latitude: poi.lat, longitude: poi.lon },
        { latitude: _event.lat, longitude: _event.lon})
      if (dist < 1000 && _event.event_type == "imp") {
        poi.impressions++
      } else if (dist < 1000 && _event.event_type == "click") {
        poi.clicks++
      }
      console.log(poi);
    })
  })
}

router.post('/binds', async (req, res) => {
  let pois = JSON.parse(req.body)
  let events = await getCsv()
  console.log(events);
  bind(pois, events)
});

module.exports = router;