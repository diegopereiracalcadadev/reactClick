const express = require('express');
const mongodb = require('mongodb');
const nodemailer = require('nodemailer');
const app = express();

const port = process.env.PORT || 5000;
const dbUrl = "mongodb://localhost:27017/";
const chamadosCollection = "chamados";



const EmailManager = {
  sendCloseMail : function (target, osNumber, clientName, solicitante, description, solution){
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
      subject: `Encerramento do chamado OS-${osNumber} - ClickTI Informática`, 
      html: `
        Informamos que o chamado  <b>OS-${osNumber}</b> está sendo encerrado. 

        <b>Empresa:</b>${clientName}
        <b>Usuário Solicitante:</b>${solicitante}

        <b>Descrição inicial:</b>${description}

        <b>Solução:</b>${solution}

        <b>Responda este e-mail caso possamos ajudar em algo mais.</b>
        Controle de Qualidade - ClickTI Informática`
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
  fecharChamado : (osNumber, solution, res) => {
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
                    "status" : 1,
                    "solution" : solution
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
      throw ex;
    }
  }
};

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
  res.send({ success: true });
});

app.get('/chamados/close', (req, res) => {
  console.log("Iniciando fechmaento");
  console.log(`os recegida ${osNumber}`);
  var osNumber = req.query.osNumber;
  var description = req.query.description;
  var solution = req.query.solution;
  var targetEmail = req.query.targetEmail; // TODO

  EmailManager.sendCloseMail("tarapi007@gmail.com", osNumber, clientName, description, solution);
  ChamadosCrud.fecharChamado(osNumber, solution, res);
  res.send({ success : true });
  
});

app.get('/chamados/getAll', (req, res) => {
  console.log("---------> /chamados/getAll <-------------")
  var MongoClient = mongodb.MongoClient;
  MongoClient.connect(dbUrl, (err, db)=>{
    if(err) throw err;
    let dbo = db.db('local')
    dbo.collection(chamadosCollection).find().toArray(function(err, items) {
      res.send(items);
    });
  })
});

app.get('/chamados/getOpeneds', (req, res) => {
  console.log("---------> /chamados/getOpeneds <-------------")
  var MongoClient = mongodb.MongoClient;
  MongoClient.connect(dbUrl, (err, db)=>{
    if(err) throw err;
    let dbo = db.db('local')
    dbo.collection(chamadosCollection).find({status : 0}).toArray(function(err, items) {
      res.send(items);
    });
  })
});

app.listen(port, () => console.log(`Aplicação Iniciada. \n Listening on port ${port}`));