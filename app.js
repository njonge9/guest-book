var http = require("http");
var path = require("path");
var express = require("express");
var logger = require("morgan");
var bodyParser = require("body-parser");

var app = express();

//
app.set(express.static("public"));

//Tell express that the views are in the view folder
app.set("views", path.resolve(__dirname, "views"));

//Tell express that views will use the EJS engine
app.set("view engine", "ejs");

//create a global array that store all your entries
var entries = [];
//makes this entries array available in all views
app.locals.entries = entries;

//use morgan to log every request
app.use(logger("dev"));

//populates a variable called req.body if the user is submitting a form
app.use(bodyParser.urlencoded({ extended: false }));

//Render the homepage
app.get("/", (req, res) => {
  res.render("index");
});

//render the new entry page
app.get("/new-entry", (req, res) => {
  res.render("new-entry");
});

//Define a route handler when you POST to new-entry
app.post("/new-entry", (req, res) => {
  //if user submits a form with no title or content respond with a 400 error
  if (!req.body.title || !req.body.content) {
    res.status(400).send("Entries must have a title and a body");
    return;
  }
  //Adds a new entry to the list of entries
  entries.push({
    title: req.body.title,
    content: req.body.content,
    published: new Date(),
  });
  res.redirect("/");
});

app.use((req, res) => {
  res.status(404).render("404");
});

http.createServer(app).listen(3000, (req, res) => {
  console.log("GuestApp started at http://localhost:3000");
});
