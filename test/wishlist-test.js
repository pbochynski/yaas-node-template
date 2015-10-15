var request = require('supertest');
var config = require('config');
var should = require('should');
var nock = require('nock');
var app = require('../wishlist').app;
var example = require('../public/api-console/raml/wishlist-example.json');
var testTenant = config.get('testTenant');

function repoUrl(tenant) {
	return config.get('repoUrl')+'/'+tenant+'/'+config.get('oauth.yaas_client')+'/data/wishlists';
}

describe('Whishlist contract test', function(){
	var listId;
	it('should create new wishlist', function(done){
		nock(config.get('oauth.tokenUrl')).post('').reply(200, {access_token: "abc"});
		nock('https://api.yaas.io').filteringPath(function(path) {
			return '/AA';
		})
			.put('/AA').reply(200);

		request(app)
			.post('/'+testTenant+'/wishlists')
			.send(example)
			.expect(200)
			.end(function (err, res){
				if (err) throw err;
				listId = res.body.id;
				done();
			})
	});
	it('should get example wishlist', function(done){
		nock(repoUrl(testTenant))
			.get('/'+listId).reply(200,{'id':listId,'owner':'345MWyh7w4hY98W6', 'title':"Floyd's Birthday Wishlist"});
		request(app)
			.get('/'+testTenant+'/wishlists/'+listId)
			.expect(200)
			.end(function (err, res){
				if (err) throw err;
				res.body.should.have.property('id',listId);
				res.body.should.have.property('owner','345MWyh7w4hY98W6');
				res.body.should.have.property('title',"Floyd's Birthday Wishlist");
				done();
			})
	});
	it('should find at least one wishlist', function(done){
		nock(repoUrl(testTenant))
			.get('').reply(200,[{'id':listId,'owner':'345MWyh7w4hY98W6', 'title':"Floyd's Birthday Wishlist"}]);
		request(app)
			.get('/'+testTenant+'/wishlists')
			.expect(200)
			.end(function (err, res){
				if (err) throw err;
				if (res.body.length<1){
					throw "At least one element expected";
				}
				done();
			})
	});
	it('should update wishlist', function(done){
		nock(repoUrl(testTenant))
			.put('/'+listId +'?upsert=true').reply(200);
		request(app)
			.put('/'+testTenant+'/wishlists/'+listId)
			.send({owner:"me",title:"myList"})
			.expect(200)
			.end(function (err, res){
				if (err) throw err;
				res.body.should.have.property('id',listId);
				done();
			})
	});
	it('should get updated wishlist', function(done){
		nock(repoUrl(testTenant))
			.get('/'+listId ).reply(200,{id:listId,owner:'me', title:'myList'});
		request(app)
			.get('/'+testTenant+'/wishlists/'+listId)
			.expect(200)
			.end(function (err, res){
				if (err) throw err;
				res.body.should.have.property('id',listId);
				res.body.should.have.property('owner','me');
				res.body.should.have.property('title','myList');
				done();
			})
	});
	it('should delete wishlist', function(done){
		nock(repoUrl(testTenant))
			.delete('/'+listId ).reply(200);
		request(app)
			.del('/'+testTenant+'/wishlists/'+listId)
			.expect(200, done);
	});
	it('should return 404 for not existing wishlist', function(done){
		nock(repoUrl(testTenant))
			.get('/notexisting').reply(404);
		request(app)
			.get('/'+testTenant+'/wishlists/notexisting')
			.expect(404, done);
	});
	it('should return 403 for wrong tenant in header', function(done){
		request(app)
			.get('/'+testTenant+'/wishlists/notexisting')
			.set('hybris-tenant','wrong')
			.expect(403, done);
	});

});