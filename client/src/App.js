import React from 'react';
import {$, jQuery} from 'jquery';
import {Modal} from 'react-materialize';
import './App.css';
import logoimg from "./imgs/logo.jpg";
import loadingImgSrc from "./imgs/loading-plasma.gif";
import axios from 'axios';
import Moment from 'react-moment';


class Header extends React.Component {
  render() {
    return (
      <nav className="topbar">
        <a href="#" data-target="slide-out" className="sidenav-trigger show-on-large">
          <i className="material-icons">menu</i>
        </a>
        <span>Chamados Abertos</span>
        <a class="btn-refresh right" href="javascript:window.location.reload()">
          <i className="material-icons">refresh</i>
        </a>
        <ul id="slide-out" className="sidenav">
          <div className="menu-container-logo">
            <img className="logo-img" src={logoimg} alt="Logo ClickTI" />
          </div>
          <li>
            <a className="waves-effect" href="#!">Abrir Chamado (Em Breve)</a>
          </li>
          <li>
            <a className="waves-effect" href="#!">Chamados Abertos</a>
          </li>
        </ul>
      </nav>
    );
  }
}

class ItemChamado extends React.Component {
  state = {
    response: '',
    show: true
  };

  constructor(props) {
    console.log("ItemChamado Constuctor invoked");
    super(props);
    
    this.state._id = props.chamado._id;
    this.state.osNumber = props.chamado.osNumber;
    this.state.status = props.chamado.status;
    this.state.clientId = props.chamado.clientId;
    this.state.clientName = props.chamado.clientName;
    this.state.openingUser = props.chamado.openingUser;
    this.state.openingDate = props.chamado.openingDate;
    this.state.description = props.chamado.description;
    this.state.comments = props.chamado.comments;
    this.state.mailTo = props.chamado.mailTo;
    this.state.closingDate = props.chamado.closingDate;
    this.state.solution = props.chamado.solution;

    this.handleOnClick = this.handleOnClick.bind(this);
  }

  handleOnClick = ()=>{
    console.log("ItemChamado - handleOnClick invoked");
    console.log(this.state);
    this.props.tryToCloseOs(this.state);
  }

  render() {
    return (
      this.state.show ?
        <li className="li-chamado">
          <div className="infs-chamado">
            <input type="hidden" name="clientId" value={this.state.clientId} />
            <p className="os-number">OS-{this.state.osNumber}</p>
            <p className="nome-cliente">{this.state.clientName}</p>
            <p className="desc-chamado">{this.state.description}</p>
          </div>
          
          <div className="status-chamado">
            <div className="infs-abertura" style={{marginBottom: 10}}>
              <p>Aberto em</p> 
              <p className="dt-abertura"><Moment locale="pt-br" format="DD/MM/YYYY">{this.state.openingDate}</Moment></p>
            </div>
            <div style={{marginLeft: 8}}>
              <button 
                onClick={this.handleOnClick}
                className="waves-effect waves-light btn btn-fechar-chamado">Fechar</button>
            </div>
          </div>
        </li>
        : null
    );
  }
}

class ListaChamados extends React.Component {
  state = {
    chamados : [],
    showModal : false,
    modalTitle : "",
    modalBody : "",
    osBeingClosed : 0,
    isLoading: true,
    isInError: false
  }

  constructor(props) {
    super(props);
    this.tryToCloseOs = this.tryToCloseOs.bind(this);
  }

  componentDidMount() {
    axios.get(`chamados/getOpeneds`)
      .then(res => {
        console.log("axios.get(`chamados/getOpeneds`) retornou com sucesso");
        console.log(res)
        if(res.data.length === 0){
          this.setState({ chamados : res.data, isLoading : false });
        } else {
          this.setState({ chamados : res.data, isLoading : false });
        }
      })
      .catch((error) => {
        this.setState({isLoading : false, isInError : true});
      });
  }

  tryToCloseOs(chamado){
    console.log("tryToCloseOs invoked");
    console.log(chamado);
    this.setState({
      showModal : true,
      osBeingClosed : chamado
    })
  }

  render() {
    return (
      this.state.isLoading === true || this.state.isInError === true  
      ?
      this.state.isLoading ? <LoadingGif /> : <ErrorLoadingOrders />
      :
      <div>
        <SimpleModal 
            showModal={this.state.showModal} 
            osBeingClosed={this.state.osBeingClosed} />
        <ul className="ul-chamados">
          {
            this.state.chamados.length === 0 ?
              <div style={{height: 60, background: "#cccccc80", textAlign: "center", fontSize: 20, paddingTop: 10}}>Não há chamados abertos</div>
            :
              this.state.chamados.map(chamado =>
                <ItemChamado chamado={chamado} 
                tryToCloseOs = {this.tryToCloseOs}/>
              )
          }
        </ul>
      </div>
    );
  }
}

class LoadingGif extends React.Component {
  render(){
    return (
      <div className="container-loading">
        <p>Aguarde...</p>
        <img className="loading-img" src={loadingImgSrc} alt="Carregando..." />
      </div>
    )
  }
}

class ErrorLoadingOrders extends React.Component {
  errorStyle = {
    textAlign: "center",
    marginTop: 60,
    color: "white",
    fontWeight: 700,
    fontSize: 20,
    background: "#ff0000a8",
    padding: "20px 0"
  }
  render(){
    return (
      <div style={this.errorStyle}>
        <p>Erro ao listar os chamados...</p>
        <p>Tente novamente em instantes</p>
      </div>
    )
  }
}

class Body extends React.Component {
  render() {
    return (
      <section className="body-componente">
        <ListaChamados />
      </section>
    )
  }
}

class SimpleModal extends React.Component{
  state = {
    showModal : this.props.showModal,
    osBeingClosed : this.props.osBeingClosed,
    isCloseBtnActive : true
  }

  componentWillReceiveProps(nextProps){
    console.log("componentWillReceiveProps chamado");
      this.setState({
        showModal : nextProps.showModal,
        osBeingClosed : nextProps.osBeingClosed
      });
  }

  
  handleOnConfirmClick = () => {
    if(this.state.isCloseBtnActive){
      console.log("Botão de fechamento de chamado clicado."); 
      this.setState({isCloseBtnActive : false});
      console.log(" State atual do SimpleModal:");
      console.log(this.state);
      
      let osBeingClosed = this.state.osBeingClosed;
      if(!osBeingClosed.osNumber) {
        alert("osnumber nulo");
        return false;
      }
      
      this.sendCloseRequest(osBeingClosed)
      .then(res => {
        //this.setState({ response: res.status });
        if(res.success && res.success == true){
          // this.setState({ show: false });
          alert(`Chamado ${osBeingClosed.osNumber} fechado com sucesso.`);
          window.location.reload();
        } else {
          alert("Erro ao tentar fechar o chamado");
        }
      })
      .catch(err => alert(err));
    }
  }
  
  sendCloseRequest = async (osBeingClosed) => {
    console.log("Enviando solicitação de fechamento para a OS: " + osBeingClosed.osNumber);
    const response = await fetch(`chamados/close?_id=${osBeingClosed._id}&osNumber=${osBeingClosed.osNumber}&openingUser=${osBeingClosed.openingUser}&mailTo=${osBeingClosed.mailTo}&description=${osBeingClosed.description}&solution=${osBeingClosed.solution}`);
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  }

  render(){  
    return (
      this.state.showModal
      ?
      <div className="simple-modal-dimmed-bg">
        <div className="simple-modal-dialog">
          <div class="simple-modal-header">
            <div class="simple-modal-header-infs">
              <p>Fechando OS  {this.state.osBeingClosed.osNumber}</p>
              <p>{this.state.osBeingClosed.description}</p>
            </div>
            <div class="btn-area-close-modal">
              <button 
                  class="close-simple-modal"
                  onClick={() => {this.setState({showModal : false})}}>
                  X
              </button>
            </div>
          </div>
          <div className="simple-modal-body">
            <div className="opening-user-container">
              <label>Usuário solicitante</label>
              <input className="opening-user" value={this.state.osBeingClosed.openingUser} onChange={(e) =>{
                  var newOpeningUser =  e.target.value;
                  var newOsBeingClosed = this.state.osBeingClosed;
                  newOsBeingClosed.openingUser = newOpeningUser;
                  this.setState({osBeingClosed : newOsBeingClosed });
                  console.log(this.state);
                }} type="text"/>
              
              <label>Enviar e-mail de fechamento p/ ( , para + )</label>
              <input className="mail-to" value={this.state.osBeingClosed.mailTo}  onChange={(e) =>{
                  var newMailTo =  e.target.value;
                  var newOsBeingClosed = this.state.osBeingClosed;
                  newOsBeingClosed.mailTo = newMailTo;
                  this.setState({osBeingClosed : newOsBeingClosed });
                }} type="text"/>
              
              <textarea className="solution" onChange={(e) =>{
                  var newSolution =  e.target.value;
                  var newOsBeingClosed = this.state.osBeingClosed;
                  newOsBeingClosed.solution = newSolution;
                  this.setState({osBeingClosed : newOsBeingClosed });
                }} ></textarea>
            </div>
          </div>
          
          <div className="simple-modal-footer">
            <button className={this.state.isCloseBtnActive ? "btn" : "btn btn-desativado"} onClick={this.handleOnConfirmClick}>Confirmar</button>
          </div>
        </div>
      </div>
      :
      null 
    )
  }
}

class Footer extends React.Component {
  render() {
    return (
      <footer className="footer-component">
      </footer>
    );
  }
}

class App extends React.Component {
  render() {
    return (
      <div>
        <Header />
        <Body />
        <Footer />
      </div>
    );
  }
}

export default App;



