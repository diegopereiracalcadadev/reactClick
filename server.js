const express = require('express');
const mongodb = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;
const dbUrl = "mongodb://localhost:27017/";
const chamadosCollection = "chamados";


app.get('/chamados/new', (req, res) => {
  console.log("Iniciando novo chamado");

  var MongoClient = mongodb.MongoClient;
  var chamado = { "desc": "viaapi" };
  console.log("vai conectar;");
  MongoClient.connect(dbUrl, function (err, db) {
    if (err) throw err;
    var dbo = db.db("local");
    dbo.collection(chamadosCollection).insertOne(chamado, function (err, res) {
      if (err) throw err;
      console.log("1 document inserted");
      db.close();
    });
  });
  res.send({ express: 'Hello From Express' });
});


function sendmail(){
  var nodemailer = require('nodemailer');

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'tarapi007@gmail.com',
      pass: 'generalize'
    }
  });

  var mailOptions = {
    from: 'tarapi007@gmail.com',
    to: 'diegopereiracalcada@gmail.com',
    subject: 'Sending Email using Node.js',
    text: 'That was easy!'
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });


}
sendmail();
app.get('/chamados/close', (req, res) => {
  console.log("Iniciando fechmaento");
    var osNumber = req.query.osNumber;
    console.log(`os recegida ${osNumber}`);

    try{
      var MongoClient = mongodb.MongoClient;
      console.log("vai conectar;");
      
      MongoClient.connect(dbUrl, function (err, db) {
        if (err) throw err;
        var dbo = db.db("local");
        dbo.collection(chamadosCollection).update(
            { 
              "osNumber": parseInt(osNumber) 
            },
            {
              $currentDate: 
                  {
                    closeDate: true
                  },
              $set:
                  {
                    "status" : 1 
                  }
            },
            {
              "upsert": false,  // insert a new document, if no existing document match the query 
              "multi": false  // update only one document 
            }
        );
        console.log("ocorreu um update no banco as " + new Date());
      });
      console.log("Finalizando fechamento");  
      res.send({ status: 1 });
    } catch (ex){
      console.log("erro no fechamento!!!!!!!!!!!!!!!!!!!!!!!");
      console.log(ex);
      res.send({ status: -1 });
    }
  
});

app.listen(port, () => console.log(`Listening on port ${port}`));