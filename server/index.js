const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose')
const moment = require('moment')
const url = 'mongodb://127.0.0.1:27017/node-mongo-hw' // change this as needed

mongoose.connect(url, { useNewUrlParser: true })

const db = mongoose.connection
db.once('open', _ => {
  console.log('Database connected:', url)
})

db.on('error', err => {
  console.error('connection error:', err)
})



const Schema = mongoose.Schema

const item = new Schema({
  url: String,
	title: String,
	description: String,
	date: String,
  fav: String
})

const IMAGE = mongoose.model("favorite_image", item)



const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

var router = express.Router();

app.use('/api', router); // API Root url at: http://localhost:8080/api

// The method of the root url. Be friendly and welcome our user :)
router.get('/', function(req, res) {
    res.json({ message: 'Welcome to the APOD app.' });   
});

router.route("/images")
  .get((req, res) => {
    IMAGE.find().then((images) => {
      res.json({ message: 'Return all images.', images: images});
    })
  })
  .post((req, res) => {
    const image = new IMAGE({        // Create IMAGE item with the appropriate fields
      url: req.body.url,
      title: req.body.title,
      description: req.body.description,
      date: req.body.date,
      fav: req.body.fav,
    })
    image.save((error, document) => {
      if (error) {
        res.json({ status: "failure" })
      } else {
        res.json({               // Save image item to the database
          status: "success",
          id: image._id,
          content: req.body
        })
      }
    })
  })

// All HTTP methods under the /images/:image_id URL.
// The /:image_id is a parameter within the URL that specifies a particular image.
router.route('/images/:image_id')
  // This GET method is used to get the content from a specific image.
  .get(function(req, res) {
	  // get a certain item from the db
	  const id = req.params.image_id;
		IMAGE.findById(id, (error, image) => {
			if (error) {
					res.json({ status: "failure" });
			} else {
					res.json(image)
	    }
	  })
  })
  // DELETE method is used to delete a image.
  .delete(function(req, res) {
		IMAGE.findByIdAndDelete(req.params.image_id, (error, image) => {
			if (error) {
				res.json({ status: "failure"})
			} else {
				res.json(image)
			}
  	})
  })

router.get('/get-random', function (req, res) {
  var yesterday = moment(req.body.date).add(-1, 'days').format("MM-DD-YYYY");
  IMAGE.findOne({"date": {$eq: yesterday}}, (error, image) => {
    if (error) {
      res.json({status: "failure"})
    } else {
      res.json(image)
    }
  })
});

router.put('/images/update', function (req, res) {
  IMAGE.findOneAndUpdate({
    "url": req.body.url,
    "fav": "1",
  }, {"fav": req.body.fav }, (error, image) => {
    if (error) {
      res.json({status: "failure"})
    } else {
      res.json(image)
    }
  })
});

app.use(express.static('../client'))

app.listen(port);
console.log('Server listening on port ' + port);