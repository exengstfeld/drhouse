var React = require('react')
var browserHistory = require('react-router').hashHistory
var Divider = require('material-ui').Divider
var TextField = require('material-ui').TextField
var RaisedButton = require('material-ui').RaisedButton
var {Card, CardActions, CardTitle, CardHeader, CardText, CardMedia} = require('material-ui/Card')
var Notification = require('../js/common').Notification
var input_style = require('../js/config').input_style
var api_base_url = require('../js/config').api_base_url
var closeActiveSession = require('../js/utils').closeActiveSession

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
            sessionStorage.loggedToken = response.data.token;
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
        fetch(api_base_url + '/login', {
                method: 'POST',
                headers: { "Content-Type": "application/json"},
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
                   <CardTitle title="Login" subtitle="Acceda con sus credenciales" />
                   <CardText>
                     <TextField style={input_style} underlineShow={false} floatingLabelText="Usuario" id="username-field" value={this.state.username} onChange={this.handleUsernameChange} />
                     <Divider />
                     <TextField style={input_style} underlineShow={false} floatingLabelText="Contraseña" id="password-field" value={this.state.password} type="password" onChange={this.handlePasswordChange} />
                   </CardText>
                   <CardActions>
                     <RaisedButton label="Login" onTouchTap={this.handleSubmit} fullWidth={true}/>
                   </CardActions>
                   <CardMedia>
                     <img src="img/todo.jpg" />
                   </CardMedia>
                 </Card>
            </div>
        )
    }
}
