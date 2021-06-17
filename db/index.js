const { BelongsTo } = require('sequelize');
const Sequelize = require('sequelize');
const { STRING, UUID, UUIDV4, TIME } = Sequelize.DataTypes;

const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/acme_tdd');

const Artist = conn.define('artist', {
  id: {
    type: UUID,
    defaultValue: UUIDV4,
    primaryKey: true
  },
  name: STRING
});

const Album = conn.define('album', {
  id: {
    type: UUID,
    defaultValue: UUIDV4,
    primaryKey: true
  },
  name: STRING
});

const Song = conn.define('song', {
  id: {
    type: UUID,
    defaultValue: UUIDV4,
    primaryKey: true
  },
  name: STRING,
  duration: TIME
});

const Track = conn.define('track', {
  id: {
    type: UUID,
    defaultValue: UUIDV4,
    primaryKey: true
  }
});


Album.belongsTo(Artist)
Artist.hasMany(Album)

Song.belongsTo(Artist)
Artist.hasMany(Song)

Track.belongsTo(Song)
Song.hasMany(Track)

Track.belongsTo(Album)
Album.hasMany(Track)

const syncAndSeed = async()=> {
  await conn.sync({ force: true });

  const [weeknd, metalica, adele] = await Promise.all([
    Artist.create({ name: 'The Weeknd'}),
    Artist.create({ name: 'Metalica'}),
    Artist.create({ name: 'Adele'})
  ]); 

  const [album1, album2, album3] = await Promise.all([
    Album.create({ name: 'Album1', artistId: weeknd.id}),
    Album.create({ name: 'Album2', artistId: metalica.id}),
    Album.create({ name: 'Album3', artistId: adele.id})
  ]); 

  const [song1, song2, song3] = await Promise.all([
    Song.create({ name: 'Song1', artistId: weeknd.id, duration: '00:05:05'}),
    Song.create({ name: 'Song2', artistId: metalica.id, duration: '00:05:06'}),
    Song.create({ name: 'Song3', artistId: adele.id,duration: '00:05:07'})
  ]); 

  const [track1, track2, track3] = await Promise.all([
    Track.create({ name: 'Track1', songId: song1.id, albumId: album1.id}),
    Track.create({ name: 'Track2', songId: song2.id, albumId: album2.id}),
    Track.create({ name: 'Track3', songId: song3.id, albumId: album3.id})
  ]); 

  return {
    artists: {
      weeknd,
      metalica,
      adele
    },
    albums: {
      album1,
      album2,
      album3
    },
    songs: {
      song1,
      song2,
      song3
    },
    tracks: {
      track1,
      track2,
      track3
    }
  };

};


module.exports = {
  syncAndSeed,
  models: {
    Artist,
    Album,
    Song,
    Track
  }
};
