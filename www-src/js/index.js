var React = require('react')
var ReactDOM = require('react-dom')
var Router = require('react-router').Router
var Route = require('react-router').Route
var IndexRoute = require('react-router').IndexRoute
var browserHistory = require('react-router').hashHistory
var MuiThemeProvider = require('material-ui/styles').MuiThemeProvider
var getMuiTheme = require('material-ui/styles').getMuiTheme
var AppBar = require('material-ui').AppBar
var Divider = require('material-ui').Divider
var Drawer = require('material-ui').Drawer
var MenuItem = require('material-ui').MenuItem
var {Card, CardHeader,CardText, CardMedia} = require('material-ui/Card')

// Utils and Custom
var customTheme = require('../js/config').theme
var closeActiveSession = require('../js/utils').closeActiveSession
var isNotLoggedIn = require('../js/utils').isNotLoggedIn

// Views
var Login = require('../js/views/login')
var Home = require('../js/views/home')
var validar_entrada = require('../js/views/validar_entrada')
var validar_salida = require('../js/views/validar_salida')
var historial = require('../js/views/prestador_historial')
var patients = require('../js/views/patients')

var injectTapEventPlugin = require('react-tap-event-plugin')

require('es6-promise').polyfill();
injectTapEventPlugin();

class App extends React.Component {
    constructor(props) {
        super(props);
        this.signOut = this.signOut.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.goHome = this.goHome.bind(this);
        this.goPrestadorHistorial = this.goPrestadorHistorial.bind(this);
        // this.refresh = this.refresh.bind(this);
        this.state = {
            open: false
        };
    }

    componentDidMount(){
        // para que el drawer pueda abrirse de las vistas hijos, llamando a esta funcion global
        window.toggleDrawer = this.handleToggle.bind(this);
    }

    handleToggle(){
        this.setState({open: !this.state.open});
    }
    
    handleClose(){
        this.setState({open: false});
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

    goPrestadorHistorial(event){
        this.handleClose();
        browserHistory.push("/historial");
    }
    render(){
        return(
            <MuiThemeProvider muiTheme={getMuiTheme(customTheme)}>
                <div>
                    { !isNotLoggedIn() && (  
                        <Drawer
                        docked={false}
                        width={250}
                        open={this.state.open}
                        onRequestChange={(open) => this.setState({open})}
                        >
                        <Card>
                            <CardHeader
                                title={sessionStorage.loggedIn}
                                subtitle={sessionStorage.loggedName}
                            />
                        </Card>
                        <Divider/>
                        <MenuItem onTouchTap={this.goHome} primaryText="Bandeja de entrada" />
                        <MenuItem onTouchTap={this.goPrestadorHistorial} primaryText="Prestaciones realizadas" />
                        <Divider/>
                        <MenuItem onTouchTap={this.signOut} primaryText="Cerrar Sesión" />
                        </Drawer>
                    )}
                    <div className="content">
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
             <Route path='historial' component={historial}/>
             <Route path='patients/:id' component={patients}/>
             <Route path='validar_entrada/:id' component={validar_entrada}/>
             <Route path='validar_salida/:id' component={validar_salida}/>
          </Route>
      </Router>
), document.getElementById("root"))
