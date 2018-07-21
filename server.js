const express = require('express');
const mongodb = require('mongodb');
const nodemailer = require('nodemailer');
const app = express();

const port = process.env.PORT || 5000;
const dbUrl = "mongodb://localhost:27017/";
const chamadosCollection = "chamados";



const EmailManager = {
  sendCloseMail : function (target, osNumber, openingUser, description, solution){
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
        Olá!

        Informamos que o chamado de <b>número ${osNumber}</b> vai ser encerrado. 

        <br/><b>Usuário Solicitante:</b>${openingUser}

        <br/><b>Descrição inicial:</b>${description}

        <br/><b>Solução:</b>${solution}

        <br/><b>Responda este e-mail caso possamos ajudar em algo mais.</b>
        <br/>Controle de Qualidade - ClickTI Informática`
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
  fecharChamado : (_id, osNumber, openingUser, mailTo, solution, res, callBack) => {
    try{
      console.log("|---    Iniciando método fecharChamado    ---|");
      console.log("Parâmetro recebidos : (_id, openingUser, mailTo, solution):");
      console.log((_id + " - " + openingUser + " - " + mailTo + " - " + solution));
      var MongoClient = mongodb.MongoClient;
      
      MongoClient.connect(dbUrl, function (err, db) {
        console.log("Iniciando processamento do método MongoClient.connect");
        if (err) throw err;
        var dbo = db.db("local");
        console.log("Tentando realizar o update... - método fecharChamado");
        var myquery =  { "osNumber" : parseInt(osNumber) };
        var newvalues = { $set: {"status" : 1, 
                                "openingUser" : openingUser,
                                "mailTo" : mailTo,
                                "solution" : solution} };
        dbo.collection("chamados").updateOne(myquery, newvalues, function(err, res) {
          if (err) throw err;
          console.log("1 document updated");
          db.close();
        });
      });
      console.log("Finalizando fechamento");  
    } catch (ex){
      console.log("Erro finalizando fechamento.");  
      console.log(ex);
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
  console.log("|---    Iniciando processamento da requisição GET em: /chamados/close    ---|");
  var _id = req.query._id;
  var osNumber = req.query.osNumber;
  var openingUser = req.query.openingUser;
  var mailTo = req.query.mailTo;
  var solution = req.query.solution;
  console.log(req.query);

  var chamado = ChamadosCrud.fecharChamado(_id, osNumber, openingUser, mailTo, solution, res, (chamado)=>{
    console.log("Chamado atualizado: ");
    console.log(chamado);
  });
  res.send({ success : true });
  
  //EmailManager.sendCloseMail(mailTo, chamado);
  
  
});

app.get('/chamados/getAll', (req, res) => {
  console.log("---------> /chamados/getAll <-------------")
  var MongoClient = mongodb.MongoClient;
  MongoClient.connect(dbUrl, (err, db)=>{
    if(err) throw err;
    let dbo = db.db('local')
    dbo.collection(chamadosCollection).find().toArray(function(err, items) {
      console.log("Finalizada recuperação dos chamados.  get-'/chamados/getAll' ");
      console.log(items);
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
      console.log("Finalizada recuperação dos chamados.  get-'/chamados/getOpeneds' ");
      console.log(items);
      res.send(items);
    });
  })
});

app.listen(port, () => console.log(`Aplicação Iniciada. \n Listening on port ${port}`));