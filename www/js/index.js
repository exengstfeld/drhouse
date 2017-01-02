const React = require('react')
const ReactDOM = require('react-dom')
const Router = require('react-router').Router
const Route = require('react-router').Route
const Link = require('react-router').Link
const browserHistory = require('react-router').hashHistory

const Header = React.createClass({
    render: function () {
        return (
            <header className="bar bar-nav">
                <h1 className="title">{this.props.text}</h1>
                <Link to='/settings'>
                      <span className="media-object pull-right icon icon-gear"></span>
                </Link>
            </header>
        )
    }
})

const Footer = React.createClass({
    render: function () {
        return (
            <div className="bar bar-standard bar-footer">
                <img style={{width: "120px", height: "40px"}} className="media-object" src={"img/logo.png"} />
                <span class="icon icon-person pull-right"></span>
            </div>
        )
    }
})

const Home = React.createClass({
    render: function(){
        return(
            <div>
                <Header text="FUNCIONES PROXIMAS" back="true"/>
                <div className="content">
                    <ul className="table-view">
                      <li className="table-view-cell media">
                          <Link className="navigate-right" to='/workspace'>
                                  <img className="media-object pull-left" src={"http://placehold.it/42x42"} />
                                  <div className="media-body">
                                    Soda Stereo
                                    <p>Sala: Principal - Inicio: 23:00hs</p>
                                  </div>
                          </Link>
                      </li>
                      <li className="table-view-cell media">
                          <Link className="navigate-right" to='/workspace'>
                                  <img className="media-object pull-left" src={"http://placehold.it/42x42"}/>
                                  <div className="media-body">
                                     INDIOS
                                     <p>Sala: Nahuel Huapi - Inicio: 17:00hs</p>
                                  </div>
                          </Link>
                      </li>
                      <li className="table-view-cell media">
                          <Link className="navigate-right" to='/workspace'>
                                  <img className="media-object pull-left" src={"http://placehold.it/42x42"}/>
                                  <div className="media-body">
                                     Yayo
                                     <p>Sala: Principal - Inicio: 20:30hs</p>
                                  </div>
                          </Link>
                      </li>
                    </ul>
                </div>
                <Footer />
            </div>
           )
    }
})

const Workspace = React.createClass({
    render: function(){
        return(
            <div>
                <Header text="INDIOS" back="true"/>
                <div className="content">
                    <ul className="table-view">
                      <li className="table-view-cell media">
                          <Link className="navigate-right" to='/scan'>
                                  <span className="media-object pull-left icon icon-pages"></span>
                                  <div className="media-body">
                                     Leer comprobante
                                     <p>Basado en el código de barras del comprobante identifica la entrada</p>
                                  </div>
                          </Link>
                      </li>
                      <li className="table-view-cell media">
                          <Link className="navigate-right" to='/synchro'>
                                  <span className="media-object pull-left icon icon-refresh"></span>
                                  <div className="media-body">
                                     Sincronizar con el servidor
                                     <p>En modo sin conexión, envía los datos escaneados al servidor</p>
                                     <span className="badge">33</span>
                                  </div>
                          </Link>
                      </li>
                      <li className="table-view-cell media">
                          <Link className="navigate-right" to='/plano'>
                                  <span className="media-object pull-left icon icon-search"></span>
                                  <div className="media-body">
                                     Plano
                                     <p>Ver plano de la Sala y el estado de sus ubicaciones</p>
                                  </div>
                          </Link>
                      </li>
                    </ul>
                </div>
                <Footer />
            </div>
           )
    }
})


class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            feedback: "",
            username: "",
            password: ""
        };
    }
    handleUsernameChange(event) {
       this.setState({username: event.target.value});
    }
    handlePasswordChange(event) {
       this.setState({password: event.target.value});
    }
    handleSubmit(event) {
        event.preventDefault();
        // this.setState({feedback: "Credenciales inválidas"});
        browserHistory.push('/home')
    }
    render(){
        return ( 
            <div>
                <Header text="VIATICKET" back="true"/>
                <div className="content">
                    <form className="LoginForm" onSubmit={this.handleSubmit.bind(this)}>
                        <div className="alert">
                            {this.state.feedback}
                        </div>
                        <input type="text" name="username" onChange={this.handleUsernameChange.bind(this)} placeholder="example@gmail.com" />
                        <input type="password" name="password" onChange={this.handlePasswordChange.bind(this)} placeholder="mypassword" />
                        <input type="submit" className="btn btn-positive btn-block" value="Ingresar" />
                    </form>
                </div>
                <Footer />
            </div>
        )
    }
}

const Settings = React.createClass({
    render(){
        return ( 
            <div>
                <Header text="PREFERENCIAS" back="true"/>
                <div className="content">
                    <ul className="table-view">
                      <li className="table-view-cell">
                        Modo sin conexión
                        <div className="toggle active">
                          <div className="toggle-handle"></div>
                        </div>
                      </li>
                    </ul>
                </div>
            </div>
        )
    }
})

const Synchro = React.createClass({
    render(){
        return ( 
            <div>
                <Header text="SINCRONIZAR" back="true"/>
                <div className="content">
                    <ul className="table-view">
                      <li className="table-view-cell">
                        Usted tiene 33 registros para enviar al servidor <button className="btn">Sicronizar</button>
                      </li>
                    </ul>
                </div>
                <Footer />
            </div>
        )
    }
})

const ScanTicket = React.createClass({

    componentDidMount() {
        this.handleScan()
    },

    handleScan(){
          cordova.plugins.barcodeScanner.scan(
              function (result) {
                  this.props.result = result.text;
              }, 
              function (error) {
                  this.props.result = error;
              },
              {
                  "preferFrontCamera" : false, // iOS and Android
                  "showFlipCameraButton" : true, // iOS and Android
                  "prompt" : "Lleve el recuadro hacia el código de barras del comprobante de compra", // supported on Android only
                  "formats" : "QR_CODE,PDF_417,CODE_128", // default: all but PDF_417 and RSS_EXPANDED
                  "orientation" : "landscape" // Android only (portrait|landscape), default unset so it rotates with the device
              }
          );
    },

    render(){
        return ( 
            <div>
                <Header text="Scanear Ticket" back="true"/>
                <div className="content">
                    <p>{this.props.result}</p>
                </div>
            </div>
        )
    }
})

const NoMatch = React.createClass({
    render(){
        return <div>Lo sentimos pero esta vista no esta definida. <Link to='/' >Volver al inicio</Link></div>    
    }
})

ReactDOM.render((
      <Router history={browserHistory}>
        <Route path='/' component={Login}/>
        <Route path='/home' component={Home}/>
        <Route path='/workspace' component={Workspace}/>
        <Route path='/scan' component={ScanTicket}/>
        <Route path='/settings' component={Settings}/>
        <Route path='/synchro' component={Synchro}/>
        <Route path='/*' component={NoMatch}/>
      </Router>
), document.getElementById("root"))
