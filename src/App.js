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

function fecharChamado(chamado) {
  console.log("Iniciando fechamento de chamado...");
  console.log("chamado to persist:");
  console.log(chamado);

}

class ItemChamado extends React.Component {

  constructor(props) {
    console.log("ItemChamado props:");
    console.log(props);
    super(props);
    this.state = {
      _id_: props._id_,
      idCliente: props.idCliente,
      desc: props.desc,
      dtAbertura: props.dtAbertura
    };
    this.handleOnClick = this.handleOnClick.bind(this);
  }

  handleOnClick(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    console.log("onclick:");
    console.log(target);
    console.log(value);
    console.log(name);

    fecharChamado(this.props);

  }

  render() {
    return (
      <li className="li-chamado">
        <div className="infs-chamado">
          <input type="hidden" name="idCliente" value={this.props.idCliente} />
          <p className="nome-cliente">{this.props.idCliente}</p>
          <p className="desc-chamado">{this.props.desc}</p>
          <p>Aberto em <span className="dt-abertura">{this.props.dtAbertura}</span></p>
        </div>
        <button
          onClick={this.handleOnClick}
          className="waves-effect waves-light btn btn-fechar-chamado">Fechar</button>
      </li>
    );
  }
}

class ListaChamados extends React.Component {
  render() {
    return (
      <ul className="ul-chamados">
        <ItemChamado _id_="801" idCliente="1" desc="desccham1" dtAbertura="21/01/2018" />
        <ItemChamado _id_="802" idCliente="2" desc="desccham2" dtAbertura="21/02/2018" />
        <ItemChamado _id_="803" idCliente="3" desc="desccham3" dtAbertura="21/03/2018" />
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


