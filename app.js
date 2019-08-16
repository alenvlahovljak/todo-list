//Modules config
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const {MongoClient, ObjectID} = require("mongodb");
const methodOverride = require("method-override");

//Serving usage config
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json())
app.use(methodOverride("_method"));

//INDEX route
app.get("/", (req, res)=>{
    MongoClient.connect("mongodb://127.0.0.1", {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, (err, client)=>{
        if(err)
            return console.log(err);
        const db = client.db("Todo_List");
        db.collection("todos").find({}).toArray((err, todos)=>{
            if(err)
                return console.log(err);
            res.render("index", {todos});
        });
    });
    
});

//CREATE route
app.post("/", (req, res)=>{
    MongoClient.connect("mongodb://127.0.0.1", {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, (err, client)=>{
        if(err)
            return console.log(err);
        const db = client.db("Todo_List");
        db.collection("todos").insertOne({
            todo: req.body.todo
        }).then((user)=>{
            console.log(user.insertedCount + "user inserted!");
            return res.redirect("/");
        }).catch((err)=>{
            console.log(err);
        });
    });
});

//DESTROY route
app.delete("/:id", (req, res)=>{
    MongoClient.connect("mongodb://127.0.0.1", {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, (err, client)=>{
        if(err)
            return console.log(err);
        const db = client.db("Todo_List");
        db.collection("todos").deleteOne({
            _id: new ObjectID(req.params.id)
        }).then((todo)=>{
            console.log(todo);
            res.redirect("/");
        }).catch((err)=>{
            console.log(err);
        })
    });
});

app.listen(3000, ()=>{
    console.log("Server has started.");
});