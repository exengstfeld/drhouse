const React = require('react')
const ReactDOM = require('react-dom')
const Router = require('react-router').Router
const Route = require('react-router').Route
const IndexRoute = require('react-router').IndexRoute
const Link = require('react-router').Link
const browserHistory = require('react-router').hashHistory

const NavBar = require('react-ratchet').NavBar
const Title = require('react-ratchet').Title
const NavButton = require('react-ratchet').NavButton
const TableView = require('react-ratchet').TableView
const TableViewCell = require('react-ratchet').TableViewCell
const Button = require('react-ratchet').Button
const Badge = require('react-ratchet').Badge
const Icon = require('react-ratchet').Icon
const Toggle = require('react-ratchet').Toggle

const MuiThemeProvider = require('material-ui/styles').MuiThemeProvider
const getMuiTheme = require('material-ui/styles').getMuiTheme

const RaisedButton = require('material-ui').RaisedButton
const TextField = require('material-ui').TextField
const Dialog = require('material-ui').Dialog
const FlatButton = require('material-ui').FlatButton
const AppBar = require('material-ui').AppBar
const Paper = require('material-ui').Paper
const Divider = require('material-ui').Divider
const Drawer = require('material-ui').Drawer

const IconButton = require('material-ui').IconButton
const IconMenu = require('material-ui').IconMenu
const MenuItem = require('material-ui').MenuItem
const {Card, CardActions, CardTitle, CardHeader, CardText, CardMedia} = require('material-ui/Card')
const {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} = require('material-ui/Table')
const SvgIcon = require('material-ui').SvgIcon
const {amber500, red700} = require('material-ui/styles/colors');
const {cyan700, grey600, pinkA100, pinkA200, pinkA400, fullWhite} = require('material-ui/styles/colors')
const {fade} = require('material-ui/utils/colorManipulator')
const spacing = require('material-ui/styles/spacing')
const injectTapEventPlugin = require('react-tap-event-plugin')
injectTapEventPlugin();

//const api_base_url = "http://192.168.50.14:8001/api/v1.3";
//const api_base_url = "http://gt-api-staging.msa:8001/api/v1.3";
const api_base_url = "http://caba2.msa.com.ar:18001/api/v1.3";

const input_style = {
  marginLeft: 13,
};

const form_style = {
  padding: 16,
};

const logo_style= {
  heigh: "40px",
  width: "40px"
};

const darkBaseTheme = getMuiTheme({
      spacing: spacing,
      fontFamily: 'Roboto, sans-serif',
      palette: {
        primary1Color: cyan700,
        primary2Color: cyan700,
        primary3Color: grey600,
        accent1Color: pinkA200,
        accent2Color: pinkA400,
        accent3Color: pinkA100,
        textColor: fullWhite,
        secondaryTextColor: fade(fullWhite, 0.7),
        alternateTextColor: '#303030',
        canvasColor: '#303030',
        borderColor: fade(fullWhite, 0.3),
        disabledColor: fade(fullWhite, 0.3),
        pickerHeaderColor: fade(fullWhite, 0.12),
        clockCircleColor: fade(fullWhite, 0.12),
    },
});

function isNotLoggedIn(){
    return (sessionStorage.loggedIn == "") || (sessionStorage.loggedIn == undefined)
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

function Notification(props){
    return (
      <Dialog
       title="Atención"
       actions={[
           <FlatButton
             label="Volver"
             primary={true}
             onTouchTap={props.onRequestClose}
           />
       ]}
       {...props}
       modal={false}
      >
       {props.children}
      </Dialog>
   )
}

function ShowCard(props){
    return (
        <Card>
          <CardHeader
            title={props.show.nombre}
            subtitle= {props.show.lugar}
            actAsExpander={true}
            showExpandableButton={true}
          />
          <CardText expandable={true}>
              Será en {props.show.lugar_domicilio} en la sala {props.show.sala} el día {props.show.fecha} a las {props.show.hora}hs. Se puede marcar entrada hasta el {props.show.fecha_baja} a las {props.show.hora_baja}hs
          </CardText>
          <CardActions>
            <FlatButton href={"index.html#/scan/"+props.show.id} label="Leer Ticket" />
          </CardActions>
        </Card>
    )
}

function VTIcon(props){
    return (
        <img src={"img/Viaticket_2017_2.png"} />
    )
}

function MoreIcon(props){
    return (
        <SvgIcon>
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
        </SvgIcon>
    )
}

function CloseIcon(props){
    return (
        <SvgIcon>
            <path d="M15 8.25H5.87l4.19-4.19L9 3 3 9l6 6 1.06-1.06-4.19-4.19H15v-1.5z"/>
        </SvgIcon>
    )
}

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            shows: []
        };
    }

    componentDidMount(){
        if (sessionStorage.shows.length > 0){
            this.setState({shows: JSON.parse(sessionStorage.shows)});
        } else {
            this.loadFunctions()
        }
    }

    loadFunctions(){ 
        fetch(api_base_url + '/mobile/funciones/'+sessionStorage.loggedIn).then(response => response.json()).then(function(response){
            if (response.success){
                this.setState({shows: response.data});
                sessionStorage.shows = JSON.stringify(response.data);
            } else {
               this.setState({feedback: response.data});
            }
        }.bind(this))
    }
    
    render(){
        return(
            <div>
                <Paper style={form_style} zDepth={2}>
                    {
                        this.state.shows.map((v, i) => (
                            <div key={i}>
                                <ShowCard show={v} />
                                <br/>
                            </div>
                          )
                        )
                    }
                </Paper>
            </div>
       )
    }
}

class Login extends React.Component {

    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.processLoginError= this.processLoginError.bind(this);
        this.processLoginResponse = this.processLoginResponse.bind(this);
        this.state = {
            feedback: "",
            error: false,
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

    processLoginResponse(response) {
        if (response.success){
            sessionStorage.loggedIn = this.state.username;
            sessionStorage.user = JSON.stringify(response.data);
            browserHistory.push('/home');
        } else {
           this.setState({feedback: response.data, error: true});
        }
    }

    processLoginError(error) {
        this.setState({feedback: error, error: true})
    }
    handleClose(error) {
        this.setState({feedback: "", error: false, username: "", password: ""})
    }
    
    handleSubmit() {
        fetch(api_base_url + '/mobile/usuario/login', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({"id_usuario": this.state.username, "password": this.state.password})
        }).then((response) => {
            if (response.status == 200) {
                return response.json()
            }
            throw Error("Error de conexion, por favor, intente más tarde: "+ response.statusText)
        }).then(
            this.processLoginResponse 
        ).catch(
            this.processLoginError
        )     
    }

    render(){
        return ( 
            <div>
                 <Notification open={this.state.error} onRequestClose={this.handleClose}>{this.state.feedback}</Notification>
                 <Card>
                   <CardMedia>
                     <img src="img/Viaticket_2017_2.png" />
                   </CardMedia>
                   <CardTitle title="Login" subtitle="Acceda con sus credenciales habituales de boletería" />
                   <CardText>
                     <TextField style={input_style} underlineShow={false} floatingLabelText="Username" id="username-field" value={this.state.username} onChange={this.handleUsernameChange} />
                     <Divider />
                     <TextField style={input_style} underlineShow={false} floatingLabelText="Password" id="password-field" value={this.state.password} type="password" onChange={this.handlePasswordChange} />
                   </CardText>
                   <CardActions>
                     <RaisedButton label="Login" onTouchTap={this.handleSubmit} fullWidth={true}/>
                   </CardActions>
                 </Card>
            </div>
        )
    }
}

class ScanTicket extends React.Component {

    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.processFetchError = this.processFetchError.bind(this);
        this.processMarcarResponse = this.processMarcarResponse.bind(this);
        this.processValidationResponse = this.processValidationResponse.bind(this);
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
            all_marked: false,
            feedback: "",
            eticket_validated: false,
            eticket_error: false
        };
    }

    componentDidMount() {
        this.setState({id_funcion: this.props.params.id});
        cordova.plugins.barcodeScanner.scan(
            ((result) => this.setState({code: result.text})),
            ((error) => this.setState({eticket_error: true, feedback: error})),
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
        }).then((response) => {
            if (response.status == 200) {
                return response.json();
            }
            throw Error("Error de conexion, por favor, intente más tarde: "+ response.statusText);
        }).then(
            this.processValidationResponse 
        ).catch( 
            this.processFetchError 
        );     
    }

    processValidationResponse(response) {
        if (response.success){
            this.setState({eticket_validated: true, eticket: response.data, eticket_error: false, all_marked: response.data.tickets.map((ticket, i) => (ticket.ingreso != "" && ticket.ingreso != undefined)).reduce( (vAnt, vAct, i, vector) => (vAnt && vAct))});
        } else {
            this.setState({eticket_validated: true, feedback: response.data, eticket_error: true});
        }
    }

    processMarcarResponse(response){
        if (response.success){
            this.setState({feedback: "Se ha marcado la entrada con exito", eticket_error: true});
        } else {
            this.setState({feedback: response.data, eticket_error: true});
        }
    }

    processFetchError(error){
       this.setState({feedback: error, eticket_error: true});
    }

    handleSubmit() {
        fetch(api_base_url + '/mobile/eticket/marcar', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({"hash": this.state.code, "id_funcion": this.state.id_funcion})
        }).then((response) => {
            if (response.status == 200) {
                return response.json();
            }
            throw Error("Error de conexion, por favor, intente más tarde: "+ response.statusText);
        }).then( 
            this.processMarcarResponse 
        ).catch(
            this.processFetchError 
        );     
    }
    
    handleClose(){
        this.setState({feedback: "", eticket_error: false});
        browserHistory.push('/home');
    }

    render(){
        return ( 
            <div>
              <Notification open={this.state.eticket_error} onRequestClose={this.handleClose}>{this.state.feedback}</Notification>
              <Paper style={form_style} zDepth={2}>
                  <TextField style={input_style} underlineShow={false} floatingLabelText="Operación" id="operacion-field" value={this.state.eticket.id_operacion} disabled />
                  <Divider />
                  <TextField style={input_style} underlineShow={false} floatingLabelText="Importe" id="importe-field" value={this.state.eticket.importe_total} disabled />
                  <Divider />
                  <TextField style={input_style} underlineShow={false} floatingLabelText="Nombre" id="nombre-field" value={this.state.eticket.nombre + " " + this.state.eticket.apellido} disabled />
                  <Divider />
                  <TextField style={input_style} underlineShow={false} floatingLabelText="Documento" id="documento-field" value={this.state.eticket.tipo_documento + " " + this.state.eticket.nro_documento} disabled />
                  <Divider />
                  { this.state.eticket_validated && (
                      <Table allRowsSelected={this.state.all_marked}>
                        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                          <TableRow>
                            <TableHeaderColumn>Nro Ticket</TableHeaderColumn>
                            <TableHeaderColumn>Categoria</TableHeaderColumn>
                            <TableHeaderColumn>Fila</TableHeaderColumn>
                            <TableHeaderColumn>Butaca</TableHeaderColumn>
                          </TableRow>
                        </TableHeader>
                        <TableBody displayRowCheckbox={false}>
                        { this.state.eticket.tickets.map((ticket, i) => (
                              <TableRow key={i} selectable={false}>
                                <TableRowColumn>{ticket.nro_ticket}</TableRowColumn>
                                <TableRowColumn>{ticket.categoria}</TableRowColumn>
                                <TableRowColumn>{ticket.fila == "0" ? "-": ticket.fila}</TableRowColumn>
                                <TableRowColumn>{ticket.butaca == "0" ? "-": ticket.butaca}</TableRowColumn>
                              </TableRow>
                            )
                        )}
                        </TableBody>
                      </Table>
                  )}
                  <Divider />
                  <RaisedButton label="Marcar Acceso" disabled={this.state.all_marked} onTouchTap={this.handleSubmit} fullWidth={true}/>
              </Paper>
            </div>
        )
    }
}


const NoMatch = React.createClass({

    render(){
        return (
            <div className="content-padded">
                <p>Lo sentimos pero esta vista no esta definida. <Link to='/home' >Volver al inicio</Link></p>
            </div>
        )
    }
})

function closeActiveSession(){
    sessionStorage.loggedIn = "";
    sessionStorage.shows = "";
    sessionStorage.user = "";
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.handleToggle = this.handleToggle.bind(this);
        this.signOut = this.signOut.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.goHome = this.goHome.bind(this);
        this.refresh = this.refresh.bind(this);
        this.state = {
            open: false
        };
    }

    componentDidMount(){
        console.log(darkBaseTheme);
    }

    handleToggle(){
        this.setState({open: !this.state.open});
    }
    
    handleClose(){
        this.setState({open: false});
    }
    
    refresh(event){
        this.handleClose();
        sessionStorage.shows = "";
        browserHistory.push("/home");
    }

    signOut(event){
        this.handleClose();
        closeActiveSession();
        browserHistory.push("/");
    }

    goHome(event){
        this.handleClose();
        browserHistory.push("/home");
    }

    render(){
        return(
            <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
                <div>
                    { !isNotLoggedIn() && (  
                        <Drawer
                          docked={false}
                          width={250}
                          open={this.state.open}
                          onRequestChange={(open) => this.setState({open})}
                        >
                                <Card>
                                    <CardMedia>
                                        <img src="img/Viaticket_2017_2.png" />
                                    </CardMedia>
                                    <CardHeader
                                       title={sessionStorage.loggedIn}
                                       subtitle="Usuario logeado"
                                    />
                                </Card>
                                <Divider/>
                                <MenuItem onTouchTap={this.goHome} primaryText="Principal" />
                                <Divider/>
                                <MenuItem onTouchTap={this.refresh} primaryText="Actualizar" />
                                <Divider/>
                                <MenuItem onTouchTap={this.signOut} primaryText="Cerrar Sesión" />
                        </Drawer>
                    )}
                    <div className="content">
                        { !isNotLoggedIn() && (  
                            <AppBar
                                title={<span className="app-bar-text"><strong style={{ color: amber500 }}>bo</strong>letero</span>}
                                onLeftIconButtonTouchTap={this.handleToggle}
                                style={{
                                    backgroundColor: red700,
                                    height: 55
                                }}
                            />
                        )}
                        {this.props.children}
                    </div>
                </div>
            </MuiThemeProvider>
       )
    }
}


ReactDOM.render((
      <Router history={browserHistory}>
          <Route path="/" component={App} >
             <IndexRoute component={Login}/>
             <Route path='home' component={Home}/>
             <Route path='scan/:id' component={ScanTicket}/>
             <Route path='*' component={NoMatch}/>
          </Route>
      </Router>
), document.getElementById("root"))
