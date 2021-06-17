const { expect } = require('chai');
const { syncAndSeed } = require('./db');
const supertest = require('supertest');
const app = supertest(require('./app'));

describe('The API', ()=> {
  let seed;
  beforeEach(async()=> {
    seed = await syncAndSeed();
  });
  describe('seeded data', ()=> {
    it('The Weeknd is one of the artists', ()=> {
      const weeknd = seed.artists.weeknd;
      expect(weeknd).to.be.ok;
    });
    it('Metalica is one of the artists', ()=> {
      expect(seed.artists.metalica.name).to.equal('Metalica');
    });
  });
  describe('artists routes', ()=> {
    describe('GET /api/artists', ()=> {
      it('returns the artists', async()=> {
        const response = await app.get('/api/artists');
        expect(response.status).to.equal(200);
        expect(response.body.length).to.equal(3);
        const names = response.body.map( artist => artist.name);
        expect(names).to.eql(['Adele', 'Metalica', 'The Weeknd']);
      });
    });
  });
  describe('albums routes', ()=> {
    describe('GET /api/albums', ()=> {
      it('returns all albums with their artists', async()=> {
        const response = await app.get('/api/albums');
        expect(response.status).to.equal(200);
        expect(response.body.length).to.equal(3);
        const names = response.body.map( album => album.name);
        expect(names).to.eql(['Album1', 'Album2', 'Album3']);
      });
    });
  });

  describe('search album routes', ()=> {
    describe('GET /api/albums/bum1', ()=> {
      it('returns all albums with the :term in the albums name', async()=> {
        const response = await app.get('/api/albums/bum1');
        expect(response.status).to.equal(200);
        expect(response.body.length).to.equal(1);
        const names = response.body.map( album => album.name);
        expect(names).to.eql(['Album1']);
      });
    });
  });

  describe('search track routes', ()=> {
    describe('GET /api/albums/track', ()=> {
      it('returns the tracks of an album each track should incude the song. The tracks should be in order based on idx', async()=> {
        const response = await app.get('/api/albums/track1');
        expect(response.status).to.equal(200);
        expect(response.body.length).to.equal(1);
        const names = response.body.map( track => track.name);
        expect(names).to.eql(['Track1']);
      });
    });
  });

});
