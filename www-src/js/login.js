var React = require('react')
var browserHistory = require('react-router').hashHistory
var Divider = require('material-ui').Divider
var TextField = require('material-ui').TextField
var AppBar = require('material-ui').AppBar
var RaisedButton = require('material-ui').RaisedButton
var Dialog = require('material-ui').Dialog
var FlatButton = require('material-ui').FlatButton
var {Card, CardActions, CardTitle, CardHeader, CardText, CardMedia} = require('material-ui/Card')
var Notification = require('../js/common').Notification
var input_style = require('../js/config').input_style
var closeActiveSession = require('../js/utils').closeActiveSession
var post = require('../js/utils').post

module.exports = class Login extends React.Component {

    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleDialogClose = this.handleDialogClose.bind(this);
        this.openLogin = this.openLogin.bind(this);
        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.processLoginError= this.processLoginError.bind(this);
        this.processLoginResponse = this.processLoginResponse.bind(this);
        this.state = {
            feedback: "",
            error: false,
            username: "",
            password: "",
            show_login: false
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

    handleDialogClose(){
        this.setState({show_login: false, username: "", password: ""})
    }

    openLogin(){
        this.setState({
          show_login: true,
        })
    }

    render(){
        return ( 
            <div>
                <AppBar
                    title={"Dr. House App"}
                    iconElementRight={
                        <FlatButton label="Acceder" onTouchTap={this.openLogin} />
                    }
                />
                  <Notification open={this.state.error} onRequestClose={this.handleClose}>{this.state.feedback}</Notification>
                  <Card>
                    <CardTitle title="Bienvenido" subtitle="Descubra más acerca de Dr. House App" />
                    <CardText>
                      <p><strong>Dr. House App</strong> Es una aplicación diseñada para optimizar los trabajos de internación domiciliaria. Permite llevar un tracking de la prestación realizada, cargar insumos, consultar la hoja de admisión y detectar el momento de entrada y salida al momento de realizar la prestación verificando y validando la geolocalización</p>
                    </CardText>
                 </Card>
                    <Dialog
                      title="Login"
                      actions={[
                          <RaisedButton label="Acceder" onTouchTap={this.handleSubmit} />,
                      ]}
                      modal={false}
                      open={this.state.show_login}
                      onRequestClose={this.handleDialogClose}
                    >
                      <TextField style={input_style} 
                                underlineShow={false} 
                                floatingLabelText="Usuario" 
                                id="username-field" 
                                value={this.state.username} 
                                onChange={this.handleUsernameChange} 
                                />
                      <Divider />
                      <TextField style={input_style} 
                                  underlineShow={false} 
                                  floatingLabelText="Contraseña" 
                                  id="password-field" 
                                  value={this.state.password} 
                                  type="password" 
                                  onChange={this.handlePasswordChange} 
                                />
                    </Dialog>
            </div>
        )
    }
}
