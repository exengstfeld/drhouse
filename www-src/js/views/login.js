var React = require('react')
var browserHistory = require('react-router').hashHistory
var Divider = require('material-ui').Divider
var Paper = require('material-ui').Paper
var TextField = require('material-ui').TextField
var AppBar = require('material-ui').AppBar
var RaisedButton = require('material-ui').RaisedButton
var FlatButton = require('material-ui').FlatButton
var {Card, CardActions, CardTitle, CardHeader, CardText, CardMedia} = require('material-ui/Card')

// Utils and Custom
var Notification = require('../common').Notification
var login_input_style = require('../config').login_input_style
var closeActiveSession = require('../utils').closeActiveSession
var post = require('../utils').post

module.exports = class Login extends React.Component {

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
            sessionStorage.loggedName = response.data.user.nombre;
            sessionStorage.loggedToken = response.data.token;
            sessionStorage.loggedBusy = JSON.stringify(response.data.busy);
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
        post('/login', {"id_usuario": this.state.username, "password": this.state.password}).then(
            this.processLoginResponse 
        ).catch(
            this.processLoginError
        )     
    }

    render(){
        return ( 
            <div>
                <AppBar
                    title={"SW Prestaciones"}
                />
                  <Notification open={this.state.error} onRequestClose={this.handleClose}>{this.state.feedback}</Notification>
                  <Card>
                    <CardTitle title="Bienvenido" subtitle="Ingrese sus credenciales de acceso" />
                    <CardText>
                      <Paper style={{"padding": "10px"}}>
                          <TextField style={login_input_style} 
                                    underlineShow={false} 
                                    floatingLabelText="Usuario" 
                                    id="username-field" 
                                    value={this.state.username} 
                                    onChange={this.handleUsernameChange} 
                                    />
                          <Divider />
                          <TextField style={login_input_style} 
                                      underlineShow={false} 
                                      floatingLabelText="Contraseña" 
                                      id="password-field" 
                                      value={this.state.password} 
                                      type="password" 
                                      onChange={this.handlePasswordChange} 
                                    />
                      </Paper>
                    </CardText>
                    <CardActions style={{"text-align": "right"}}>
                      <RaisedButton label="Acceder" onTouchTap={this.handleSubmit} />,
                    </CardActions>
                 </Card>
            </div>
        )
    }
}
