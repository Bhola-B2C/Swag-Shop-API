var express = require('express');
var router = express.Router();

var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/swag-shop', { useMongoClient: true });

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: false}));

var Product = require('./model/product');
var WishList = require('./model/wishlist');

/* Routes for adding and seeing new product */
router.post('/product', function(req,res){
	var product = new Product();
	product.title = req.body.title;
	product.price = req.body.price;
	product.save(function(err, savedProduct){
		if(err){
			res.status(500).send({error: "Couldn't save product"});
		}
		else{
			res.status(200).send(savedProduct);
		}
	});
});

router.get('/product', function(req,res){
	Product.find({}, function(err, products){
		if(err)
		{
			res.status(500).send({error: "Couldn't find"});
		}
		else
		{
			res.status(200).send(products);
		}
	});
});

/* Routes for creating wishlist*/
router.post('/wishlist', function(req,res){
	var wishList = new WishList;
	wishList.title = req.body.title;
	wishList.save(function(err, newWishList){
		if(err)
		{
			res.status(500).send({error: "Couldn't create WishList"});
		}
		else
		{
			res.status(200).send(newWishList);
		}
	});
});

router.get('/wishlist', function(req,res){
	WishList.find({}).populate({path: 'products', model: 'Product'}).exec(function(err,wishList){
		if(err){
			res.status(500).send("Couldn't find WishList");
		}
		else{
			res.status(200).send(wishList);
		}
	});
});

router.put('/wishlist/product/add', function(req,res){
	Product.findOne({_id: req.body.productId}, function(err, product){
		if(err){
			res.status(500).send("Product Not Found");
		}
		else{
			WishList.update({_id: req.body.wishListId}, {$addToSet: {products: product._id}}, function(err, wishList){
				if(err){
					res.status(500).send({error: "Couldn't add to Wishlist"});
				}
				else{
					res.status(200).send("Successfully added to wishList");
				}
			});
		}
	});
});
module.exports = router
