import React from 'react';
import {$, jQuery} from 'jquery';
import {Modal} from 'react-materialize';
import './App.css';
import logoimg from "./imgs/logo.jpg";
import axios from 'axios';


class Header extends React.Component {
  render() {
    return (
      <nav className="topbar">
        <a href="#" data-target="slide-out" className="sidenav-trigger show-on-large">
          <i className="material-icons">menu</i>
        </a>
        <span>Chamados Abertos</span>
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
    
    this.state._id = props._id;
    this.state.osNumber = props.osNumber;
    this.state.status = props.status;
    this.state.clientId = props.clientId;
    this.state.clientName = props.clientName;
    this.state.description = props.description;
    this.state.solution = props.solution;
    this.state.comments = props.comments;
    this.state.openingDate = props.openingDate;
    this.state.closingDate = props.closingDate;
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
            <input type="hidden" name="clientId" value={this.props.clientId} />
            <p className="os-number">OS-{this.props.osNumber}</p>
            <p className="nome-cliente">{this.props.clientName}</p>
            <p className="desc-chamado">{this.props.description}</p>
          </div>
          
          <div className="status-chamado">
            <div className="infs-abertura" style={{marginBottom: 10}}>
              <p>Aberto em</p> 
              <p className="dt-abertura">{this.props.openingDate}</p>
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
      osBeingClosed : 0
  }

  constructor(props) {
    super(props);
    this.tryToCloseOs = this.tryToCloseOs.bind(this);
  }
  
  componentDidMount() {
    axios.get(`chamados/getOpeneds`)
      .then(res => {
        console.log("axios.get(`chamados/getOpeneds`) executado com sucesso");
        console.log(res)
        const chamados = res.data;
        this.setState({ chamados });
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
      <div>
        <SimpleModal 
            showModal={this.state.showModal} 
            osBeingClosed={this.state.osBeingClosed} />
        <ul className="ul-chamados">
          {this.state.chamados.map(chamado =>
              <ItemChamado _id_={chamado.id}
                  osNumber = {chamado.osNumber}
                  status = {chamado.status}
                  clientId = {chamado.clientId}
                  clientName = {chamado.clientName}
                  description = {chamado.description}
                  solution = {chamado.solution}
                  comments = {chamado.comments}
                  openingDate = {chamado.openingDate}
                  closingDate = {chamado.closingDate}
                  tryToCloseOs = {this.tryToCloseOs}
                  />
            )}
        </ul>
      </div>
    );
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
  }

  componentWillReceiveProps(nextProps){
    console.log("componentWillReceiveProps chamado");
      this.setState({
        showModal : nextProps.showModal,
        osBeingClosed : nextProps.osBeingClosed
      });
  }

  
  fecharChamado = () => {
    console.log("Botão de fechamento de chamado clicado. State atual do SimpleModal:");
    console.log(this.state);

    let chamado = this.state;
    if(!chamado.osNumber) {
      alert("osnumber nulo");
      return false;
    }

    this.sendCloseRequest(chamado.osNumber)
        .then(res => {
          //this.setState({ response: res.status });
          if(res.status == 1){
            this.setState({ show: false });
            alert(`Solicitação de encerramento do chamado ${chamado.osNumber} finalizada.`);
          } else {
            alert("Erro ao tentar fechar o chamado");
          }
        })
        .catch(err => alert(err));
  }

  sendCloseRequest = async (osNumber) => {
    console.log("Enviando solicitação de fechamento para a OS: " + osNumber);
    const response = await fetch(`chamados/close?osNumber=${osNumber}`);
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
          <div className="simple-modal-header">
            Fechando OS {this.state.osBeingClosed.osNumber}
            <button className="close-simple-modal" onClick={() => {this.setState({showModal : false})}}>X</button></div>
          <div className="simple-modal-body">
            <textarea></textarea>
          </div>
          <div className="simple-modal-footer">
            <button className="btn" onClick={this.fecharChamado}>Confirmar Fechamento</button>
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



