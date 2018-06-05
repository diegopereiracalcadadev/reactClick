const express = require('express');
const mongodb = require('mongodb');
const nodemailer = require('nodemailer');
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




const EmailManager = {
  sendCloseMail : function (target, osNumber){
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
      subject: `Finalização do chamado nº  ${osNumber}`, 
      text: `Seu chamado de  nº ${osNumber} foi finalizado. Caso tenha alguma dúvida ou solicitação, pode responder este email.`
    };
  
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  }
};

const ChamadosCrud = {
  fecharChamado : (osNumber, res) => {
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
        console.log("Update com sucesso -  " + new Date());
      });
      console.log("Finalizando fechamento");  
      res.send({ status: 1 });
    } catch (ex){
      console.log(ex);
      //res.send({ status: -1 });
    }
  }
};

app.get('/chamados/close', (req, res) => {
  console.log("Iniciando fechmaento");
  var osNumber = req.query.osNumber;
  console.log(`os recegida ${osNumber}`);

  EmailManager.sendCloseMail("diegopereiracalcada@gmail.com", osNumber);
  ChamadosCrud.fecharChamado(osNumber, res);
  
});

app.listen(port, () => console.log(`Listening on port ${port}`));