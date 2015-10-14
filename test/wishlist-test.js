var request = require('supertest');
var should = require('should');
var app = require('../wishlist').app;
var example = require('../public/api-console/raml/wishlist-example.json');


describe('Whishlist contract test', function(){
	var listId;
	it('should create new wishlist', function(done){
		request(app)
			.post('/sampletenant/wishlists')
			.send(example)
			.expect(200)
			.end(function (err, res){
				if (err) throw err;
				listId = res.body.id;
				done();
			})
	});
	it('should get example wishlist', function(done){
		request(app)
			.get('/sampletenant/wishlists/'+listId)
			.expect(200)
			.end(function (err, res){
				if (err) throw err;
				res.body.should.have.property('id',listId);
				res.body.should.have.property('owner','345MWyh7w4hY98W6');
				res.body.should.have.property('title',"Floyd's Birthday Wishlist");
				done();
			})
	});
	it('should update wishlist', function(done){
		request(app)
			.put('/sampletenant/wishlists/'+listId)
			.send({owner:"me",title:"myList"})
			.expect(200)
			.end(function (err, res){
				if (err) throw err;
				res.body.should.have.property('id',listId);
				done();
			})
	});
	it('should get updated wishlist', function(done){
		request(app)
			.get('/sampletenant/wishlists/'+listId)
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
		request(app)
			.del('/sampletenant/wishlists/'+listId)
			.expect(200, done);
	});
	it('should return 404 for not existing wishlist', function(done){
		request(app)
			.get('/sampletenant/wishlists/notexisting')
			.expect(404, done);
	});

});