const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const request = require('request');
const https = require('https');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));

//this lets you reference static pages (css)
app.use(express.static("public"));


app.get('/', function(req, res){
  res.sendFile(__dirname + "/signup.html");
});

app.post('/', function(req, res){
  const firstName = req.body.first;
  const lastName = req.body.last;
  const email = req.body.email;
  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };



  const jsonData = JSON.stringify(data);
  const listId = "21a40bf31b"
  const url = "https://us7.api.mailchimp.com/3.0/lists/" + listId;
  const options = {
    method: "POST",
    auth: "michael:6ae608d33651462f8d80907fd407e128-us7"
  }

  const request = https.request(url, options, function(response){
    response.on("data", function(data){
      console.log(JSON.parse(data));


      if(response.statusCode === 200){
        res.sendFile(__dirname + "/success.html");}
        else{
          res.sendFile(__dirname + "/failure.html");
        }
    });

  });
  request.write(jsonData);
  request.end();
});

app.post('/failure', function(req, res){
  res.redirect('/');
});



app.listen(port, function(){
  console.log(`Connection is established on port: ${port}`);
});

// // API KEY
// 6ae608d33651462f8d80907fd407e128-us7
