import React from 'react';
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
    console.log("constucto chamado");
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
    console.log(this.state);
    
    this.fecharChamado = this.fecharChamado.bind(this);
  }

  sendCloseRequest = async (osNumber) => {
    console.log("sendCloseRequest chamado. os: " + osNumber);
    const response = await fetch(`chamados/close?osNumber=${osNumber}`);
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
  
    return body;
  }

  fecharChamado = () => {
    console.log("Botão de fechar chamado apertado: ");
    let chamado = this.props;
    console.log(chamado);
    if(!chamado.osNumber) {
      alert("osnumber nulo");
      return false;
    }
    // TODO mostraR modal aguarde
    this.sendCloseRequest(chamado.osNumber)
        .then(res => {
          //this.setState({ response: res.status });
          if(res.status == 1){
            this.setState({ show: false });
            console.log(`Solicitação de encerramento do chamado ${chamado.osNumber} finalizada.`);
          } else {
            alert("Erro ao tentar fechar o chamado");
          }
        })
        .catch(err => alert(err));
  }

  handleOnClick = ()=>{
    if(window.confirm(`Tem certeza de que deseja fechar o chamado ${this.props.osNumber} ?`)){
      this.fecharChamado();
    }
  }

  render() {
    return (
      this.state.show ?
        <li className="li-chamado">
          <div className="infs-chamado">
            <input type="hidden" name="clientId" value={this.props.clientId} />
            <p class="os-number">OS-{this.props.osNumber}</p>
            <p className="nome-cliente">{this.props.clientName}</p>
            <p className="desc-chamado">{this.props.description}</p>
          </div>
          
          <div class="status-chamado">
            <div class="infs-abertura" style={{marginBottom: 10}}>
              <p>Aberto em</p> 
              <p class="dt-abertura">{this.props.openingDate}</p>
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
  constructor(props) {
    super(props);

    this.state = {
      chamados: []
    };
  }

  componentDidMount() {
    axios.get(`chamados/getOpeneds`)
      .then(res => {
        console.log("did mounted");
        console.log(res)
        const chamados = res.data;
        this.setState({ chamados });
      });
  }

  render() {
    return (
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
                />
          )}
      </ul>
    );
  }
}

class Body extends React.Component {
  render() {
    return (
      <section className="body-componente">
        <ListaChamados />
      </section>
    );
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
        <Header className="header" />
        <Body className="body" />
        <Footer className="footer" />
      </div>
    );
  }
}

export default App;


