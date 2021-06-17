const express = require('express');
const app = express();
const path = require('path');
const { models: { Artist, Album }} = require('./db');
const {Op} = require ('sequelize');


app.use('/dist', express.static(path.join(__dirname, 'dist')));
app.get('/', (req, res)=> res.sendFile(path.join(__dirname, 'index.html')));

app.get('/api/artists', async(req, res, next)=> {
  try {
    res.send(await Artist.findAll({
      order: [['name']]
    }));
  }
  catch(ex){
    next(ex);
  }
});

app.get('/api/albums', async(req, res, next)=> {
  try {
    res.send(await Album.findAll({
      order: [['name']]
    }));
  }
  catch(ex){
    next(ex);
  }
});

app.get('/api/albums/:term', async(req, res, next)=> {
  const searchAlbum = req.params.term
  try {
    res.send( await Album.findAll({
      where : {
        name:{[Op.substring] : searchAlbum}
      }
    }));
  }
  catch(ex){
    next(ex);
  }
});

app.get('/api/albums/:term', async(req, res, next)=> {
  const searchTrack = req.params.id
  try {
    res.send( await Album.findAll({
      where : {
        name: searchTrack
      }
    }));
  }
  catch(ex){
    next(ex);
  }
});


module.exports = app;
