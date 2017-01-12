const React = require('react')
const ReactDOM = require('react-dom')
const Router = require('react-router').Router
const Route = require('react-router').Route
const Link = require('react-router').Link
const browserHistory = require('react-router').hashHistory

//const api_base_url = "http://192.168.50.14:8001/api/v1.3";
//const api_base_url = "http://gt-api-staging.msa:8001/api/v1.3";
const api_base_url = "http://caba2.msa.com.ar:18001/api/v1.3";

function isNotLoggedIn(){
    return (sessionStorage.loggedIn == "") || (sessionStorage.loggedIn == undefined)
}

function closeActiveSession(){
    sessionStorage.loggedIn = "";
    sessionStorage.shows = "";
    sessionStorage.user = "";
}

function locateFunction(id_funcion){
    funciones = JSON.parse(sessionStorage.shows);
    for (i = 0; i < funciones.length; i++) {  
        if (funciones[i].id == id_funcion){
            return funciones[i];
        }
    }
    throw Error("No se ha localizado la funcion "+ id_funcion);
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
                { !isNotLoggedIn() && (
                    <Link onClick={closeActiveSession} className="tab-item" to="/">
                        <span className="icon icon-person-nav pull-right">{sessionStorage.loggedIn}</span>
                    </Link>
                )}
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
                { !isNotLoggedIn() && (
                    <nav className="bar bar-tab">
                        <Link onClick={closeActiveSession} className="tab-item" to="/">
                            <span className="tab-label">Cerrar Sesión</span>
                        </Link>
                        <span className="tab-item">
                            <span className="icon icon-person"></span>
                            <span className="tab-label">{sessionStorage.loggedIn}</span>
                        </span>
                    </nav>
                )}
            </div>
        )
    }
}

class Home extends SecuredView {

    constructor(props) {
        super(props);
        this.state = {
            shows: []
        };
    }

    componentDidMount(){
        console.log(sessionStorage.shows);
        if (sessionStorage.shows.length > 0){
            this.setState({shows: JSON.parse(sessionStorage.shows)});
        } else {
            this.loadFunctions();
        }
    }

    loadFunctions(){
        fetch(api_base_url + '/mobile/funciones', {
                method: 'GET'
        }).then(function(response) {
            return response.json();
        }).then(function(response) {
            if (response.success){
                this.setState({shows: response.data});
                sessionStorage.shows = JSON.stringify(response.data);
            } else {
               this.setState({feedback: response.data});
            }
        }.bind(this));
    }

    render(){
        return(
            <div>
                <Header back="true"/>
                <div className="bar bar-standard bar-header-secondary">
                    <h2 className="title">Funciones</h2>
                    <span onClick={this.loadFunctions.bind(this)} className="icon icon-refresh pull-right"></span>
                </div>
                <div className="content">
                    <ul className="table-view">
                    {
                        this.state.shows.map(function(show, i){
                          return (
                              <li key={i} value={show.id} className="table-view-cell media">
                                  <Link className="navigate-right" to={'workspace/'+show.id}>
                                          <img className="media-object pull-left" src={"http://placehold.it/42x42"} />
                                          <div className="media-body">
                                            {show.nombre}
                                            <p>Sala: {show.sala} - Inicio: {show.fecha} - {show.hora}</p>
                                            <p>Hasta: {show.fecha_baja} - {show.hora_baja}hs</p>
                                          </div>
                                  </Link>
                              </li>
                          )
                        })
                    }
                    </ul>
                </div>
            </div>
           )
    }
}

class Workspace extends SecuredView {

    constructor(props) {
        super(props);
        this.state = {
            feedback: "",
            funcion: {
                "id": "",
                "nombre": "",
                "sala": "",
                "fecha_baja": "",
                "hora_baja": "",
                "hora": "",
                "fecha": ""
            }
        };
    }

    componentDidMount(){
        this.setState({funcion: locateFunction(this.props.params.id)});
    }

    render(){
        return(
            <div>
                <Header back="true"/>
                <SubHeader text={this.state.funcion.nombre} />
                <div className="content">
                    <div className="card">
                        <ul className="table-view">
                          <li className="table-view-cell media">
                              <Link className="navigate-right" to={'scan/' + this.state.funcion.id}>
                                      <span className="media-object pull-left icon icon-plus"></span>
                                      <div className="media-body">
                                         Leer comprobante
                                         <p>Basado en el código QR ticket electrónico identifica la entrada</p>
                                      </div>
                              </Link>
                          </li>
                          <li className="table-view-cell media">
                            <div className="media-body">
                              <p>Sala: {this.state.funcion.sala}</p>
                              <p>Inicio: {this.state.funcion.fecha} - {this.state.funcion.hora}</p>
                              <p>Hasta: {this.state.funcion.fecha_baja} - {this.state.funcion.hora_baja}hs</p>
                            </div>
                          </li>
                          <li className="table-view-cell">
                                <p>Aqui va el plano</p>
                          </li>
                        </ul>
                    </div>
                </div>
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
        fetch(api_base_url + '/mobile/usuario/login', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({"id_usuario": this.state.username, "password": this.state.password})
        }).then(function(response) {
            if (response && response.status == 200) {
                return response.json();
            }
            throw Error(response.statusText);
        }.bind(this)).then(function(response) {
            if (response.success){
                sessionStorage.loggedIn = this.state.username;
                sessionStorage.user = JSON.stringify(response.data);
                browserHistory.push('/home');
            } else {
               this.setState({feedback: response.data});
            }
        }.bind(this)).catch(function(error) {
           this.setState({feedback: "Error de conexion, por favor, intente más tarde: "+ error});
        }.bind(this));     
    }

    render(){
        return ( 
            <div>
                <Header back="false"/>
                <div className="bar bar-standard bar-header-secondary">
                    { this.state.feedback != "" && (  
                    <div className="card">
                        <ul className="table-view">
                            <li className="table-view-cell">
                                <p><span className="badge badge-negative badge-inverted">{this.state.feedback}</span></p>
                            </li>
                        </ul>
                    </div>
                    )}
                    <form className="input-group" onSubmit={this.handleSubmit.bind(this)}>
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
            code: "",
            id_funcion: "",
            eticket: {
                "tipo_documento": "",
                "nombre": "",
                "importe_total": "", 
                "id_operacion": "",
                "nro_documento": "",
                "apellido": "",
                "tickets": []
            },
            feedback: "",
            eticket_validated: false,
            eticket_error: false
        };
    }

    componentDidMount() {
        this.setState({id_funcion: this.props.params.id});
        this.handleScan();
    }

    componentDidUpdate(){
        if ((this.state.code != "") && !(this.state.eticket_validated)){
            this.validateETicket();
        }
    }

    validateETicket(){
        fetch(api_base_url + '/mobile/eticket/validar', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({"hash": this.state.code, "id_funcion": this.state.id_funcion})
        }).then(function(response) {
            if (response && response.status == 200) {
                return response.json();
            }
            throw Error(response.statusText);
        }.bind(this)).then(function(response) {
            console.log(response.data);
            this.setState({eticket_validated: true});
            if (response.success){
               this.setState({eticket: response.data});
            } else {
               this.setState({feedback: response.data, eticket_error: true});
            }
        }.bind(this)).catch(function(error) {
           this.setState({feedback: "Error de conexion, por favor, intente más tarde: "+ error});
        }.bind(this));     
    }

    handleScan(){
          cordova.plugins.barcodeScanner.scan(
              function (result) {
                  this.setState({code: result.text});
              }.bind(this), 
              function (error) {
                  this.setState({feedback: error});
              }.bind(this),
              {
                  "preferFrontCamera" : false, // iOS and Android
                  "showFlipCameraButton" : true, // iOS and Android
                  "prompt" : "Lleve el recuadro hacia el código QR del ticket electrónico", // supported on Android only
                  "formats" : "QR_CODE", // default: all but PDF_417 and RSS_EXPANDED
                  "orientation" : "landscape", // Android only (portrait|landscape), default unset so it rotates with the device
                  "resultDisplayDuration": 0
              }
          );
    }

    handleSubmit(event) {
        event.preventDefault();
        fetch(api_base_url + '/mobile/eticket/marcar', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({"hash": this.state.code, "id_funcion": this.state.id_funcion})
        }).then(function(response) {
            if (response && response.status == 200) {
                return response.json();
            }
            throw Error(response.statusText);
        }.bind(this)).then(function(response) {
            if (response.success){
                for (i = 0; i < this.state.eticket.tickets.length; i++) {  
                    this.state.eticket.tickets[i].ingreso = response.data 
                }
                this.setState({feedback: "Se ha marcado la entrada con exito", eticket_error: false});
            } else {
                this.setState({feedback: response.data, eticket_error: false});
            }
        }.bind(this)).catch(function(error) {
           this.setState({feedback: "Error de conexion, por favor, intente más tarde: "+ error});
        }.bind(this));     
    }


    render(){

        return ( 
            <div>
                <Header back="true"/>
                <SubHeader text="Marcar Entrada" />
                <div className="content">
                    { this.state.eticket_feedback != "" && (  
                        <p className={"content-padded " + (this.state.eticket_error ? "badge-negative":"badge-positive" ) + " badge-inverted badge"}>
                           {this.state.feedback}
                        </p>
                    )}
                    {this.state.eticket_validated && !this.state.eticket_error && (
                        <form className="input-group" onSubmit={this.handleSubmit.bind(this)}>
                            <div className="input-row">
                                <label>Operacion</label>
                                <input readOnly type="text" name="id_operacion" value={this.state.eticket.id_operacion} />
                            </div>
                            <div className="input-row">
                                <label>Importe</label>
                                <input readOnly type="text" name="importe" value={"$ "+this.state.eticket.importe_total}/>
                            </div>
                            <div className="input-row">
                                <label>Nombre</label>
                                <input readOnly type="text" name="name" value={this.state.eticket.nombre + " " + this.state.eticket.apellido}/>
                            </div>
                            <div className="input-row">
                                <label>Documento</label>
                                <input readOnly type="text" name="document" value={this.state.eticket.tipo_documento + " " + this.state.eticket.nro_documento}/>
                            </div>
                            <div className="card">
                                <ul className="table-view">
                                {
                                    this.state.eticket.tickets.map(function(ticket, i){
                                    return (
                                        <li key={i} value={ticket.nro_ticket} className="table-view-cell table-view-divider">
                                                <p><span className={"badge " + (ticket.ingreso == "" || ticket.ingreso == undefined ? "badge-positive":"badge-negative") + " badge-inverted"}>Nro Ticket: {ticket.nro_ticket} - Categoría: {ticket.categoria}{(ticket.fila != 0 && " - Fila: "+ ticket.fila )}{(ticket.butaca != 0 && " - Butaca: "+ ticket.butaca )}</span></p>
                                        </li>
                                    )
                                    })
                                }
                                </ul>
                            </div>
                            <div>
                                <button type="submit" className="btn btn-primary btn-block">Marcar Acceso</button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        )
    }
}


const NoMatch = React.createClass({

    render(){
        return (
            <div className="content">
                <p className="content-padded">Lo sentimos pero esta vista no esta definida. <Link to='/home' >Volver al inicio</Link>
                </p>
            </div>
        )    
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
