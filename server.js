var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Sets index.html to the homepage
app.use(express.static(__dirname));

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/CreativoMusano", function (err) {
    if (err) {
        console.log("Error: " + err);
    }
    else {
        console.log("Connected to MongoDB")
    }
});

// Mongoose Schema - New User
var User = mongoose.model("User", {
    name: String,
    email: String,
    password: String,
    videos: [],
});

// New user registretion
app.post("/register", function (request, response) {
    // Using the User Schema, we make a new user with user supplied details

    var newUser = new User(request.body);
    newUser.save(function (err) {
        if (err) {
            response.status(404);
            response.send();
        }
    });
    response.send(newUser);
});

// LOGIN
app.post("/login", function (request, response) {
    // Loking for the User in DB
    User.findOne({
        email: request.body.email,
        password: request.body.password
    })
		// If there is an error the program stops and the error is logged in the console
		.exec(function (err, user) {
		    if (err) {
		        console.log("Error: " + err);
		    }
		        // If there is no error
		    else {
		        // if there is no user
		        if (user === null) {
		            var notRegistered = [{ "registered": false }];
		            response.send(JSON.stringify(notRegistered));
		        }
		            // If the user exists in the DB
		        else {
		            // We send back to the controller an object with the value true, the users name and email to be saved in session storage
		            var registered = [{ "registered": true, "name": user.name, "id": user._id }];
		            response.send(JSON.stringify(registered));
		        }
		    }
		});
});

// CREATE
app.post("/addVideo", function (request, response) {
    var newVideo = request.body;
   console.log(newVideo);
    User.update({ _id: newVideo.userID },
				{ $push: { videos: newVideo } },
				{ upsert: true },

		function (err) {

		    if (err) {
		        console.log("Error: " + err);
		    }
		    else {
		        console.log("Added!");
		    }
		});
});

// READ
app.post("/getUserVideos", function (request, response) {
    var id = request.body;
    var idForFind = id.userID;
    User.findOne({ _id: idForFind },
		function (err, videos) {
		    if (err) {
		        console.log("Err: " + err)
		    }
		    else {
		        response.send(videos);
		    }
		});
});

// UPDATE
app.patch("/updateVideoDetails", function (request, response) {

    var newVideoEdit = request.body;
      console.log(newVideoEdit);

    User.update({ 'videos.title': newVideoEdit.videoToEditTitle }, {
        '$set': {
            'videos.$.title': newVideoEdit.title,
            'videos.$.category': newVideoEdit.category,
            'videos.$.description': newVideoEdit.description,
            'videos.$.link': newVideoEdit.link
        }
    }, function (err, success) {
        if (err) {
            console.log("Err: " + err);
        }
        else {
            if (success === false) {
                var notUpdated = [{ "updated": false }];
                response.send(JSON.stringify(notUpdated));
            }
            else {
                var updated = [{ "updated": true }];
                response.send(JSON.stringify(updated));
            }
        }
    });
});

// DELETE
app.delete("/removeVideo", function (request, response) {

    var videoToRemove = request.body;
    // console.log(videoToRemove);
    User.update(

		{ _id: videoToRemove.userID },
		{ $pull: { videos: { link: videoToRemove.link } } },
		{ safe: true },

		function (err) {

		    if (err) {
		        console.log("Error: " + err);
		    }
		    else {
		        var deleted = [{ "status": true }];
		        response.send(JSON.stringify(deleted));
		        //    console.log("Deleted!");
		    }
		});
});

// Sets up express to run on port 3000
app.listen(3000, function () {
    console.log("Running on http://localhost:3000");
});
