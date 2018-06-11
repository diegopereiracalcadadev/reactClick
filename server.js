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
        user: 'atendimentochamado@gmail.com',
        pass: 'gerasamba'
      }
    });
  
    var mailOptions = {
      from: 'atendimentochamado@gmail.com',
      to: target,
      subject: `Encerramento do chamado nº ${osNumber} - ClickTI Informática`, 
      text: `
        Informamos que o chamado  <b>${osNumber}</b> está sendo encerrado. 

        Descrição inicial:

        Solução:

        Responda este e-mail em caso de dúvidas ou solicitações.
        Atenciosamente, ClickTI Informática`
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
      res.send({ status: -1 });
    }
  }
};

app.get('/chamados/close', (req, res) => {
  console.log("Iniciando fechmaento");
  var osNumber = req.query.osNumber;
  console.log(`os recegida ${osNumber}`);

  EmailManager.sendCloseMail("tarapi007@gmail.com", osNumber);
  ChamadosCrud.fecharChamado(osNumber, res);
  
});

app.get('/chamados/getAll', (req, res) => {
  console.log("---------> /chamados/getAll <-------------")
  var MongoClient = mongodb.MongoClient;
  MongoClient.connect(dbUrl, (err, db)=>{
    if(err) throw err;
    let dbo = db.db('local')
    console.log("Vai comecar a baixaria...");
    //dbo.collection(chamadosCollection).find({}).toArray();
    dbo.collection(chamadosCollection).find().toArray(function(err, items) {
      console.log(items);
      res.send(items);
    });
    //console.log(arr);
    
  })
});

app.listen(port, () => console.log(`Listening on port ${port}`));