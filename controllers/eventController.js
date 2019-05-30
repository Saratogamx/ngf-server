var events = require('../database/events'),
  getNextId = require('./getNextId'),
  url = require('url');

var nextId = getNextId(events);

exports.getEvents = function(req, res) {
  res.send(events);
}

exports.getEvent = function(req, res) {
  var event = events.find(event => event.id === +req.params.eventId);
  res.send(event);
}

exports.getEventsByCustomer = function(req, res) {
  var customerId = +req.params.id;
  var customerEvents = events.filter(event => event.customerId === customerId);
  res.send(customerEvents);
}

exports.searchSessions = function(req, res) {
	var term = req.query.search.toLowerCase();
  var results = [];
  events.forEach(event => {
    var matchingSessions = event.sessions.filter(session => session.name.toLowerCase().indexOf(term) > -1)
    matchingSessions = matchingSessions.map(session => {
      session.eventId = event.id;
      return session;
    })
    results = results.concat(matchingSessions);
  })
  res.send(results);
}

exports.saveEvent = function(req, res) {
  var event = req.body;
  
  if (event.id) {
    var index = events.findIndex(e => e.id === event.id)
    events[index] = event
  } else {
    event.id = nextId;
    nextId++;
    event.sessions = [];
    events.push(event);
  }
  res.send(event);
  res.end(); 
}


