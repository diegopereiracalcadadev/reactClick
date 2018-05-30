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
  render() {
    return (
      <li className="li-chamado">
        <div className="infs-chamado">
          <p className="nome-cliente">Qualityfisio</p>
          <p className="desc-chamado">Pc nao liga</p>
          <p>Aberto em<span className="dt-abertura">21/21/2121</span></p>
        </div>
        <button className="btn-fechar-chamado"></button>
      </li>
    );
  }
}

class ListaChamados extends React.Component {
  render() {
    return (
      <ul className="ul-chamados">
        <ItemChamado />
        <ItemChamado />
        <ItemChamado />
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


