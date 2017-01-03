const React = require('react')
const ReactDOM = require('react-dom')
const Router = require('react-router').Router
const Route = require('react-router').Route
const Link = require('react-router').Link
const browserHistory = require('react-router').hashHistory

function isNotLoggedIn(){
    return (sessionStorage.loggedIn == "") || (sessionStorage.loggedIn == undefined)
}

function closeActiveSession(){
    sessionStorage.loggedIn = "";
}

class SecuredView extends React.Component {

    componentDidMount() {
        this.checkLoggedIn();
    }

    checkLoggedIn(){
        if (isNotLoggedIn()){
            browserHistory.push("/")
        }
    }
}

class Header extends React.Component {

    render() {
        return (
            <header className="bar bar-nav">
                {this.props.back==="true" &&
                    <span onClick={browserHistory.goBack} className="icon icon-left-nav pull-left"></span>
                }
                <h1 className="title"><img style={{width: "110px", height: "40px"}} className="media-object" src={"img/logo.jpg"} /></h1>
            </header>
        )
    }
}

class SubHeader extends React.Component {

    render() {
        return (
            <div className="bar bar-standard bar-header-secondary">
                <h2 className="title">{this.props.text}</h2>
            </div>
        )
    }
}

class Footer extends React.Component {

    render() {
        return (
            <div className="bar bar-standard bar-footer">
                <nav className="bar bar-tab">
                    <Link className="tab-item" to='/settings'>
                        <span className="icon icon-gear"></span>
                        <span className="tab-label">Opciones</span>
                    </Link>
                    { !isNotLoggedIn() &&
                        <Link onClick={closeActiveSession} className="tab-item" to="/">
                            <span className="icon icon-person"></span>
                            <span className="tab-label">{sessionStorage.loggedIn}</span>
                        </Link>
                    }
                </nav>
            </div>
        )
    }
}

class Home extends SecuredView {

    constructor(props) {
        super(props);
        this.state = {
            shows: [
                {
                    "nombre": "Nick Cave & The Bad Seeds",
                    "id": "1001",
                    "inicio": "23:00",
                    "sala": "Principal"
                }
            ]
        };
    }

    render(){
        return(
            <div>
                <Header back="true"/>
                <SubHeader text="Próximas Funciones" />
                <div className="content">
                    <ul className="table-view">
                    {
                        this.state.shows.map(function(show){
                          return (
                              <li className="table-view-cell media">
                                  <Link className="navigate-right" to={'/workspace/'+show.id}>
                                          <img className="media-object pull-left" src={"http://placehold.it/42x42"} />
                                          <div className="media-body">
                                            {show.nombre}
                                            <p>Sala: {show.sala} - Inicio: {show.inicio}hs</p>
                                          </div>
                                  </Link>
                              </li>
                          )
                        })
                    }
                    </ul>
                </div>
                <Footer />
            </div>
           )
    }
}

class Workspace extends SecuredView {

    constructor(props) {
        super(props);
        this.state = {
            id: ""
        };
    }

    componentDidMount(){
        this.setState({id: this.props.params.id});
    }

    render(){
        return(
            <div>
                <Header back="true"/>
                <SubHeader text={this.state.id} />
                <div className="content">
                    <ul className="table-view">
                      <li className="table-view-cell media">
                          <Link className="navigate-right" to={'/scan/' + this.state.id}>
                                  <span className="media-object pull-left icon icon-pages"></span>
                                  <div className="media-body">
                                     Leer comprobante
                                     <p>Basado en el código QR ticket electrónico identifica la entrada</p>
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
}


class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            feedback: "",
            username: "",
            password: ""
        };
    }
    
    componentDidMount(){
        closeActiveSession();
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
        sessionStorage.loggedIn = this.state.username;
        browserHistory.push('/home');
    }

    render(){
        return ( 
            <div>
                <Header back="false"/>
                <div className="bar bar-standard bar-header-secondary">
                    <form className="input-group" onSubmit={this.handleSubmit.bind(this)}>
                        <div className="alert">
                            {this.state.feedback}
                        </div>
                        <div className="input-row">
                            <label>Usuario</label>
                            <input type="text" name="username" onChange={this.handleUsernameChange.bind(this)} placeholder="example@gmail.com" />
                        </div>
                        <div className="input-row">
                            <label>Contraseña</label>
                            <input type="password" name="password" onChange={this.handlePasswordChange.bind(this)} placeholder="mypassword" />
                        </div>
                        <div>
                            <button type="submit" className="btn btn-primary btn-block">Ingresar</button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}

class Settings extends SecuredView {

    render(){
        return ( 
            <div>
                <Header back="true"/>
                <SubHeader text="Opciones" />
                <div className="content">
                    <ul className="table-view">
                      <li className="table-view-cell">
                      </li>
                    </ul>
                </div>
            </div>
        )
    }
}

class ScanTicket extends SecuredView {

    constructor(props) {
        super(props);
        this.state = {
            result: "",
            id: ""
        };
    }

    componentDidMount() {
        this.setState({id: this.props.params.id});
        this.handleScan()
    }

    handleScan(){
          cordova.plugins.barcodeScanner.scan(
              function (result) {
                  this.setState({result: result.text});
              }, 
              function (error) {
                  this.setState({result: error});
              },
              {
                  "preferFrontCamera" : false, // iOS and Android
                  "showFlipCameraButton" : true, // iOS and Android
                  "prompt" : "Lleve el recuadro hacia el código QR del ticket electrónico", // supported on Android only
                  "formats" : "QR_CODE,PDF_417,CODE_128", // default: all but PDF_417 and RSS_EXPANDED
                  "orientation" : "landscape" // Android only (portrait|landscape), default unset so it rotates with the device
              }
          );
    }

    render(){
        return ( 
            <div>
                <Header back="true"/>
                <SubHeader text={this.state.id} />
                <div className="content">
                    <h1>{this.state.result}</h1>
                </div>
            </div>
        )
    }
}

const NoMatch = React.createClass({

    render(){
        return <h1>Lo sentimos pero esta vista no esta definida. <Link to='/home' >Volver al inicio</Link></h1>    
    }
})

ReactDOM.render((
      <Router history={browserHistory}>
        <Route path='/' component={Login}/>
        <Route path='/home' component={Home}/>
        <Route path='/workspace/:id' component={Workspace}/>
        <Route path='/scan/:id' component={ScanTicket}/>
        <Route path='/settings' component={Settings}/>
        <Route path='/*' component={NoMatch}/>
      </Router>
), document.getElementById("root"))
