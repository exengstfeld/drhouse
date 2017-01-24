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
var {Card, CardHeader, CardMedia} = require('material-ui/Card')
var injectTapEventPlugin = require('react-tap-event-plugin')
var Login = require('../js/login')
var ScanTicket = require('../js/eticket')
var Home = require('../js/home')
var darkBaseTheme = require('../js/config').darkBaseTheme
var closeActiveSession = require('../js/utils').closeActiveSession
var isNotLoggedIn = require('../js/utils').isNotLoggedIn
var app_bar_style = require('../js/config').app_bar_style 
var app_bar_strong_style = require('../js/config').app_bar_strong_style

injectTapEventPlugin();

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
                                title={<span className="app-bar-text"><strong style={app_bar_strong_style}>bo</strong>letero</span>}
                                onLeftIconButtonTouchTap={this.handleToggle}
                                style={app_bar_style}
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
          </Route>
      </Router>
), document.getElementById("root"))
