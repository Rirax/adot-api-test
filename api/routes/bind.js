const { Router } = require('express');
const { getDistance } = require('geolib');
const papa = require('papaparse');
const rp = require('request-promise');

const fileUrl = 'https://raw.githubusercontent.com/Rirax/adot-api-test/master/api/ressources/events.csv';

const router = Router();

function checkEvent(event) {
  if (typeof event.lat != "undefined" && typeof event.lon != "undefined" && typeof event.event_type != "undefined")
    return true;
  else
    return false;
}

async function checkPois(body) {
  return new Promise((resolve, reject) => {
    let pois;
    try {
        pois = JSON.parse(body);
    } catch(e) {
        reject('The body of the request is invalid');
    }
    if (!pois.length) reject('No POS found in the request');
    pois.map((poi, i) => {
      if (typeof poi.lat == "undefined" || typeof poi.lon == "undefined" || typeof poi.name == "undefined")
        reject(`The POS object in position ${i} is invalid`);
    });
    resolve(pois);
  });
}

async function getEventsCsv() {
  return new Promise(resolve => {
    rp(fileUrl).then(data => {
      papa.parse(data, {
        header: true,
        delimiter: ",",
        complete: function(results) {
          resolve(results.data);
        }
      });
    });
  });
}

function initRes(pois) {
  let res = {};
  pois.map(poi => {
    poi.impressions = 0;
    poi.clicks = 0;
    res[poi.name] = poi;
  })
  return res;
}

function bind(pois, events) {
  let res = initRes(pois);

  events.map(ev => {
    if (checkEvent(ev)) {
      let nearest = {};
      nearest.dist = null;
      pois.map(poi => {
        let dist = getDistance(
          { latitude: poi.lat, longitude: poi.lon },
          { latitude: ev.lat, longitude: ev.lon });
        if (!isNaN(dist) && (!nearest.dist || dist < nearest.dist)) {
          nearest.name = poi.name;
          nearest.dist = dist;
        }
      })
      if (ev.event_type == "imp") {
        res[nearest.name].impressions = res[nearest.name].impressions + 1;
      } else if (ev.event_type == "click") {
        res[nearest.name].clicks = res[nearest.name].clicks + 1;
      }
    }
  })
  return res
}

router.post('/binds', async (req, res) => {
  try {
    let pois = await checkPois(req.body);
    try {
      let events = await getEventsCsv();
      let binds = bind(pois, events);
      return res.json(binds);
    } catch(e) {
      return res.status(500).send({ error: 'Something failed!' });
    }
  } catch(e) {
    return res.status(400).send({ error: `Bad Request : ${e}` });
  }
});

module.exports = router;
