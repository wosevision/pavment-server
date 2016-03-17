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
  	'status':'200'
  }

  // respond with json data
  res.json(jsonData)
});

// simple route to show an HTML page
router.get('/sample-page', function(req,res){
  res.render('sample.html')
});

// /**
//  * GET '/hills'
//  * Receives a GET request to get all Hill details
//  * @return {Object} JSON
//  */

router.get('/hills', function(req, res){

  // mongoose method to find all, see http://mongoosejs.com/docs/api.html#model_Model.find
  Hill.find(function(err, data){

    // if err or no user found, respond with error 
    if(err){
      var error = {status:'400', message: 'Error retrieving hills'};
       return res.json(error);
    }
    if(data == null){
      var error = {status:'404', message: 'No hills saved'};
       return res.json(error);
    }

    // otherwise, respond with the data 

    var jsonData = {
      status: '200',
      data: data
    } 

    res.json(jsonData);

  })

})

// /**
//  * GET '/hills/:id'
//  * Receives a GET request specifying the Hill to retrieve
//  * @param  {String} req.param('id'). The HillId
//  * @return {Object} JSON
//  */

router.get('/hills/:id', function(req, res){

  var requestedId = req.param('id');

  // mongoose method, see http://mongoosejs.com/docs/api.html#model_Model.findById
  Hill.findById(requestedId, function(err,data){

    // if err or no user found, respond with error 
    if(err){
      var error = {status:'400', message: 'Error retrieving hill'};
       return res.json(error);
    }
    if(data == null){
      var error = {status:'404', message: 'Could not locate hill'};
       return res.json(error);
    }
    // otherwise respond with JSON data of the hill
    var jsonData = {
      status: '200',
      data: data
    }

    return res.json(jsonData);
  
  })
});

// /**
//  * POST '/hills'
//  * Receives a POST request of the new hill, saves Hill to db, responds back
//  * @param  {Object} req. An object containing the different attributes of the Hill
//  * @return {Object} JSON
//  */

router.post('/hills', function(req, res){

    // pull out the information from the req.body
    var name = req.body.name;
    var locale = req.body.locale;
    var tags = req.body.tags.split(","); // split string into array
    var type = req.body.type;
    var coordinates = req.body.coordinates.split(",");
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
        coordinates: [ [ parseFloat(coordinates[0]), parseFloat(coordinates[1]) ], [ parseFloat(coordinates[2]), parseFloat(coordinates[3]) ] ]
      },
      distance: distance,
      steepness: steepness,
      notes: notes
    };

    // create a new hill model instance, passing in the object
    var hill = new Hill(hillObj);

    // now, save that hill instance to the database
    // mongoose method, see http://mongoosejs.com/docs/api.html#model_Model-save    
    hill.save(function(err,data){
      // if err saving, respond back with error
      if (err){
        var error = {status:'400', message: 'Error saving hill'};
        return res.json(error);
      }

      console.log('saved a new hill!');
      console.log(data);

      // now return the json data of the new hill
      var jsonData = {
        status: '200',
        data: data
      }

      return res.json(jsonData);

    })  
});

// /**
//  * PUT '/hills/:id'
//  * Receives a PUT request with data of the Hill to update, updates db, responds back
//  * @param  {String} req.param('id'). The HillId to update
//  * @param  {Object} req. An object containing the different attributes of the Hill
//  * @return {Object} JSON
//  */

router.put('/hills/:id', function(req, res) {

    var requestedId = req.param('id');

    var dataToUpdate = {}; // a blank object of data to update

    // pull out the information from the req.body and add it to the object to update
    var name, locale, distance, steepness, notes; 
    var tags, coordinates = []; // blank array to hold tags

    // we only want to update any field if it actually is contained within the req.body
    // otherwise, leave it alone.
    if(req.body.name) {
      name = req.body.name;
      dataToUpdate.name = name;
    }
    if(req.body.locale) {
      locale = req.body.locale;
      dataToUpdate.locale = locale;
    }
    if(req.body.distance) {
      distance = parseFloat(req.body.distance);
      dataToUpdate.distance = distance;
    }
    if(req.body.steepness) {
      distance = parseFloat(req.body.distance);
      dataToUpdate.distance = distance;
    }
    if(req.body.coordinates) {
      coordinates = req.body.coordinates.split(",");
      dataToUpdate.path = {};
      dataToUpdate.path.coordinates = [ [ parseFloat(coordinates[0]), parseFloat(coordinates[1]) ], [ parseFloat(coordinates[2]), parseFloat(coordinates[3]) ] ];
    }
    if(req.body.tags){
      tags = req.body.tags.split(",");
      dataToUpdate.tags = tags;
    }
    if(req.body.notes) {
      notes = req.body.notes;
      dataToUpdate.notes = notes;
    }


    console.log('the data to update is ' + JSON.stringify(dataToUpdate));

    // now, update that Hill
    // mongoose method findByIdAndUpdate, see http://mongoosejs.com/docs/api.html#model_Model.findByIdAndUpdate  
    Hill.findByIdAndUpdate(requestedId, dataToUpdate, function(err,data){

      // if err or no user found, respond with error 
      if(err){
        var error = {status:'400', message: 'Error updating hill'};
         return res.json(error);
      }
      if(data == null){
        var error = {status:'404', message: 'Could not locate hill'};
         return res.json(error);
      }

      console.log('Hill updated!');
      console.log(data);

      // now return the json data of the new person
      var jsonData = {
        status: '200',
        data: data
      }

      return res.json(jsonData);

    });

});

/**
 * DELETE '/hills/:id'
 * Receives a DELETE request specifying the Hill to delete
 * @param  {String} req.param('id'). The HillId
 * @return {Object} JSON
 */

router.delete('/hills/:id', function(req, res) {

  var requestedId = req.param('id');

  // Mongoose method to remove, http://mongoosejs.com/docs/api.html#model_Model.findByIdAndRemove
  Hill.findByIdAndRemove(requestedId,function(err, data){

    // if err or no user found, respond with error 
    if(err){
      var error = {status:'400', message: 'Error deleting hill'};
       return res.json(error);
    }
    if(data == null){
      var error = {status:'404', message: 'Could not locate hill'};
       return res.json(error);
    }

    // otherwise, respond back with success
    var jsonData = {
      status: '200',
      message: 'Successfully deleted hill ID ' + requestedId
    }

    res.json(jsonData);

  });

});

module.exports = router;