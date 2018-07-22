const express = require('express');
const mongodb = require('mongodb');
const nodemailer = require('nodemailer');
const app = express();

const port = process.env.PORT || 5000;
const dbUrl = "mongodb://localhost:27017/";
const chamadosCollection = "chamados";



const EmailManager = {
  sendCloseMail : function (chamado){
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'atendimentochamado@gmail.com',
        pass: 'gerasamba'
      }
    });
  
    var mailOptions = {
      from: 'atendimentochamado@gmail.com',
      to: chamado.mailTo,
      bcc: "clickticonsultoria@gmail.com",
      subject: `Fechamento do chamado ${chamado.osNumber} - ClickTI Informática`, 
      html: `
        Olá! <br/><br/>

        Informamos que o chamado de <b>número ${chamado.osNumber}</b> foi fechado e a demanda referente a ele atendida com sucesso. <br/>
        Caso possamos ajudar em algo mais, responda este email por favor. <br/><br/>

        -------------------------- <br/><br/>

        <b>Usuário Solicitante:</b> ${chamado.openingUser}<br/>

        <b>Descrição inicial:</b> ${chamado.description}<br/>

        <b>Solução executada:</b> ${chamado.solution}<br/><br/>

        -------------------------- <br/><br/>

        ClickTI Informática`
    };
  
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log("Email enviado. Reponse: " + info.response);
        console.log("MailOptions:");
        console.log( mailOptions);
      }
    });
  }
};

const ChamadosCrud = {
  fecharChamado : (chamado, res, callBack) => {
    try{
      console.log("|---    Iniciando método fecharChamado    ---|");
      console.log("Parâmetro recebidos : (_id, openingUser, mailTo, solution):");
      console.log((chamado._id + " - " + chamado.openingUser + " - " + chamado.mailTo + " - " + chamado.solution));
      var MongoClient = mongodb.MongoClient;
      
      MongoClient.connect(dbUrl, function (err, db) {
        console.log("Iniciando processamento do método MongoClient.connect");
        if (err) throw err;
        var dbo = db.db("local");
        console.log("Tentando realizar o update... - método fecharChamado");
        var myquery =  { "osNumber" : parseInt(chamado.osNumber) };
        var newvalues = { $set: {"status" : 1, 
                                "openingUser" : chamado.openingUser,
                                "mailTo" : chamado.mailTo,
                                "solution" : chamado.solution,
                                "closingDate" : new Date() } };
        dbo.collection("chamados").updateOne(myquery, newvalues, function(err, res) {
          if (err) throw err;
          console.log("1 document updated");
          db.close();
          callBack();
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
  console.log("|---    Requisição GET =>     /chamados/new    ---|");
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
  console.log("|---    Requisição GET =>     /chamados/close    ---|");
  console.log(req.query);
  var chamado = req.query;
  ChamadosCrud.fecharChamado(chamado, res, ()=>{
    console.log("Respondendo requisição...");
    res.send({ success : true });
  });
  EmailManager.sendCloseMail(chamado);
});

app.get('/chamados/getAll', (req, res) => {
  console.log("|---    Requisição GET =>     /chamados/getAll    ---|");
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