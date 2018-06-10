import React from 'react';
import './App.css';
import logoimg from "./imgs/logo.jpg";

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
    
    console.log(this.state);
    this.state._id_ = props._id_;
    this.state.idCliente = props.idCliente;
    this.state.desc = props.desc;
    this.state.dtAbertura = props.dtAbertura;
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
            <input type="hidden" name="idCliente" value={this.props.idCliente} />
            <p className="nome-cliente">{this.props.idCliente}</p>
            <p className="desc-chamado">{this.props.desc}</p>
          </div>
          <div>
            <button
              onClick={this.handleOnClick}
              className="waves-effect waves-light btn btn-fechar-chamado">Fechar</button>
            <p>Aberto em <span className="dt-abertura">{this.props.dtAbertura}</span></p>  
          </div>
        </li>
      : null
    );
  }
}



class ListaChamados extends React.Component {
  render() {
    return (
      <ul className="ul-chamados">
        <ItemChamado _id_="801" osNumber="1005" idCliente="1" desc="desccham1" dtAbertura="21/01/2018" />
        <ItemChamado _id_="802" osNumber="1006" idCliente="2" desc="desccham2" dtAbertura="21/02/2018" />
        <ItemChamado _id_="803" osNumber="1007" idCliente="3" desc="desccham3" dtAbertura="21/03/2018" />
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


