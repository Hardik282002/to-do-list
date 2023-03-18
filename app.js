const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const _ =require("lodash");
// const date=require(__dirname+"/date.js");

const app = express();
// var items=["cricket","playing","coding"];
// var workitems=[];
mongoose.connect("mongodb+srv://sindhwanihardik806:kW4p4hQVIUaeRdpU@cluster0.4z2u75s.mongodb.net/todolistdb")
    .then(function () {
        console.log("connected to db");
    })
const itemschema = mongoose.Schema({
    name: String
})
app.set('view engine', 'ejs');
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static("public"));

const Item = mongoose.model("Item", itemschema)
const item1 = new Item({
    name: "welcome"
})
const item2 = new Item({
    name: "welcome back"
})
const item3 = new Item({
    name: "welcome again"
})
const defaultitems = [item1, item2, item3];

const listschema = mongoose.Schema({
    name: String,
    items: [itemschema]
})
const List = mongoose.model("List", listschema);
// const { urlencoded } = require("body-parser");
// const https=r equire("https");
// const { log } = require("console");
// app.use(bodyparser.urlencoded({extended:true}));
app.get("/", function (req, res) {
    // let day=date.getdatee();
    Item.find({}).then(function (items) {
        if (items.length === 0) {
            Item.insertMany(defaultitems)
                .then(function () {
                    console.log("Successfully saved defult items to DB");
                })
                .catch(function (err) {
                    console.log(err);
                });
            res.redirect("/");
        } else {
            res.render("list", { worklist: "today", newlistitems: items });
        }
    })
});
app.get("/:customlistname", function (req, res) {
    const customlistname = _.capitalize(req.params.customlistname);
    // const customlistname= mongoose.Types.ObjectId(req.params.customlistname.trim());
    List.findOne({ name: customlistname }).then(function (foundlist) {
        if (!foundlist) {
            const list = new List({
                name: customlistname,
                items: defaultitems
            });
            list.save();
            res.redirect("/" + customlistname);
        } else {
            res.render("list", { worklist: foundlist.name, newlistitems: foundlist.items });
        }
    })
});


// app.get("/work",function(req,res){
//    res.render("list",{worklist:"work list",newlistitems:workitems})
// });
// app.get("/about",function(req,res){
//    res.render("about");
// });

app.post("/", function (req, res) {
    const itemname = req.body.newitem;
    const listname = req.body.list;
    const item1 = new Item({
        name: itemname,
        items: [itemschema]
    });
    if (listname === "today") {
        item1.save();
        res.redirect("/");
    } else {
        List.findOne({ name: listname }).then(function (foundlist) {
            foundlist.items.push(item1);
            foundlist.save();
            res.redirect("/" + listname);
        }).catch(function (err) {
            console.log(err);
        });
    }

});
    // if(req.body.list==="work"){
    //     workitems.push(item);
    //     res.redirect("/work");
    // }
    // else
    // { items.push(item);
    //  res.redirect("/");}
app.post("/delete", function (req, res) {
    const checkboxid = req.body.checkbox;
    const listname=req.body.listname;

    if(listname==="today"){
        Item.findByIdAndRemove(checkboxid).then(function () {
    
            console.log("succesfully deleted")
            res.redirect("/");
    
        }).catch(function (err) {
            console.log(err);
    
        });
    }else{
List.findOneAndUpdate({name:listname},{$pull:{items:{_id:checkboxid}}}).then(function(foundlist){
  res.redirect("/" + listname );
})
    }
});

    

app.listen(3000, function () {
    console.log("server started on server 4000");
});




