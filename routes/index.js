var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

// our db model
var Hill = require("../models/model.js");

/**
 * GET '/'
 * Default home route. Just relays a success message back.
 * @param  {Object} req
 * @return {Object} json
 */
router.get('/', function(req, res) {
  
  var jsonData = {
  	'name': 'pavment-server',
  	'api-status':'OK'
  }

  // respond with json data
  res.json(jsonData)
});

// simple route to show an HTML page
router.get('/sample-page', function(req,res){
  res.render('sample.html')
})

// /**
//  * POST '/api/create'
//  * Receives a POST request of the new user and location, saves to db, responds back
//  * @param  {Object} req. An object containing the different attributes of the Person
//  * @return {Object} JSON
//  */

router.post('/api/create', function(req, res){

    console.log(req.body);

    // pull out the information from the req.body
    var name = req.body.name;
    var locale = req.body.locale;
    var tags = req.body.tags.split(","); // split string into array
    var type = req.body.type;
    var coords = req.body.coordinates.split(",");
    var distance = req.body.distance;
    var steepness = req.body.steepness;
    var notes = req.body.notes;

    // hold all this data in an object
    // this object should be structured the same way as your db model
    var hillObj = {
      name: name,
      locale: locale,
      tags: tags,
      path: {
        coordinates: [[coords[0], coords[1]], [coords[2], coords[3]]]
      },
      distance: distance,
      steepness: steepness,
      notes: notes
    };

    // create a new hill model instance, passing in the object
    var hill = new Hill(hillObj);
console.log(hill);
    // now, save that hill instance to the database
    // mongoose method, see http://mongoosejs.com/docs/api.html#model_Model-save    
    hill.save(function(err,data){
      // if err saving, respond back with error
      if (err){
        var error = {status:'ERROR', message: 'Error saving hill'};
        return res.json(error);
      }

      console.log('saved a new hill!');
      console.log(data);

      // now return the json data of the new hill
      var jsonData = {
        status: 'OK',
        hill: data
      }

      return res.json(jsonData);

    })  
});

// /**
//  * GET '/api/get/:id'
//  * Receives a GET request specifying the hill to get
//  * @param  {String} req.param('id'). The HillId
//  * @return {Object} JSON
//  */

router.get('/api/get/:id', function(req, res){

  var requestedId = req.param('id');

  // mongoose method, see http://mongoosejs.com/docs/api.html#model_Model.findById
  Hill.findById(requestedId, function(err,data){

    // if err or no user found, respond with error 
    if(err || data == null){
      var error = {status:'ERROR', message: 'Could not find that hill'};
       return res.json(error);
    }

    // otherwise respond with JSON data of the hill
    var jsonData = {
      status: 'OK',
      hill: data
    }

    return res.json(jsonData);
  
  })
})

// /**
//  * GET '/api/get'
//  * Receives a GET request to get all Hill details
//  * @return {Object} JSON
//  */

router.get('/api/get', function(req, res){

  // mongoose method to find all, see http://mongoosejs.com/docs/api.html#model_Model.find
  Hill.find(function(err, data){
    // if err or no hills found, respond with error 
    if(err || data == null){
      var error = {status:'ERROR', message: 'Could not find hills'};
      return res.json(error);
    }

    // otherwise, respond with the data 

    var jsonData = {
      status: 'OK',
      hills: data
    } 

    res.json(jsonData);

  })

})

// /**
//  * POST '/api/update/:id'
//  * Receives a POST request with data of the Hill to update, updates db, responds back
//  * @param  {String} req.param('id'). The HillId to update
//  * @param  {Object} req. An object containing the different attributes of the Hill
//  * @return {Object} JSON
//  */

router.post('/api/update/:id', function(req, res){

   var requestedId = req.param('id');

   var dataToUpdate = {}; // a blank object of data to update

    // pull out the information from the req.body and add it to the object to update
    var name, locale, path, distance, steepness, notes; 
    var tags = []; // blank array to hold tags

    // we only want to update any field if it actually is contained within the req.body
    // otherwise, leave it alone.
    if(req.body.name) {
      name = req.body.name;
      // add to object that holds updated data
      dataToUpdate['name'] = name;
    }

    if(req.body.tags){
      tags = req.body.tags.split(","); // split string into array
      // add to object that holds updated data
      dataToUpdate['tags'] = tags;
    }

    if(req.body.path) {
      path = req.body.path;
      // add to object that holds updated data
      dataToUpdate['path'] = path;
    }
    if(req.body.weight) {
      weight = req.body.weight;
      // add to object that holds updated data
      dataToUpdate['description'] = {};
      dataToUpdate['description']['weight'] = weight;
    }
    if(req.body.color) {
      color = req.body.color;
      // add to object that holds updated data
      if(!dataToUpdate['description']) dataToUpdate['description'] = {};
      dataToUpdate['description']['color'] = color;
    }
    if(req.body.url) {
      url = req.body.url;
      // add to object that holds updated data
      dataToUpdate['url'] = url;
    }


    console.log('the data to update is ' + JSON.stringify(dataToUpdate));

    // now, update that Hill
    // mongoose method findByIdAndUpdate, see http://mongoosejs.com/docs/api.html#model_Model.findByIdAndUpdate  
    Hill.findByIdAndUpdate(requestedId, dataToUpdate, function(err,data){
      // if err saving, respond back with error
      if (err){
        var error = {status:'ERROR', message: 'Error updating Hill'};
        return res.json(error);
      }

      console.log('updated the Hill!');
      console.log(data);

      // now return the json data of the new person
      var jsonData = {
        status: 'OK',
        Hill: data
      }

      return res.json(jsonData);

    })

})

/**
 * GET '/api/delete/:id'
 * Receives a GET request specifying the Hill to delete
 * @param  {String} req.param('id'). The HillId
 * @return {Object} JSON
 */

router.get('/api/delete/:id', function(req, res){

  var requestedId = req.param('id');

  // Mongoose method to remove, http://mongoosejs.com/docs/api.html#model_Model.findByIdAndRemove
  Hill.findByIdAndRemove(requestedId,function(err, data){
    if(err || data == null){
      var error = {status:'ERROR', message: 'Could not find that Hill to delete'};
      return res.json(error);
    }

    // otherwise, respond back with success
    var jsonData = {
      status: 'OK',
      message: 'Successfully deleted id ' + requestedId
    }

    res.json(jsonData);

  })

})

module.exports = router;