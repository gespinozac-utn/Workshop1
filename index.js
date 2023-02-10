const express = require("express");
const app = express();
const mongoose = require("mongoose");
const db = mongoose.connect("mongodb+srv://TavoAdmin:fmwvls4ZQXCX26ik@cluster0.tnetvvs.mongodb.net/fifapp");
const TeamModel = require("./models/team");

const bodyParser = require("body-parser");
const { send } = require("express/lib/response");
app.use(bodyParser.json());


app.post('/team', function (req, res) {

  const team = new TeamModel();

  team.name = req.body.name;
  team.description = req.body.description;
  if (team.name && team.description) {
    team.save(function (err) {
      if (err) {
        res.status(422);
        console.log('error while saving the team', err);
        res.json({
          error: 'There was an error saving the team'
        });
      }
      res.status(201);//CREATED
      res.header({
        'location': `http://localhost:3000/team/?id=${team.id}`
      });
      res.json(team);
    });
  } else {
    res.status(422);
    console.log('error while saving the team')
    res.json({
      error: 'No valid data provided for team'
    });
  }
});

app.get('/team', function(req, res){
  TeamModel.find({},function(err,teams){
    if(err){
      res.send({Error: err})
    }
    res.json(teams)
  })
});

app.patch('/team',function(req,res){
  TeamModel.findByIdAndUpdate(req.query.id,{name:req.body.name, description:req.body.description}, {new:true},(err,teamUpdated)=>{
    if(err){
      res.send({error : err})
    }
    res.status(200).send(teamUpdated)
  })
});

app.delete('/team',function(req,res){
  TeamModel.findByIdAndDelete(req.query.id,(err,teamDeleted)=>{
    if(err){
      res.send({Error: err})
    }
    res.send(teamDeleted).status(204)
  })
});

app.listen(3000, () => console.log(`Fifa app listening on port 3000!`))

