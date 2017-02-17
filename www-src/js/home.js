var React = require('react')
var browserHistory = require('react-router').hashHistory
var {Card, CardActions, CardTitle, CardHeader, CardText, CardMedia} = require('material-ui/Card')
var Paper = require('material-ui').Paper
var FlatButton = require('material-ui').FlatButton
var form_style = require('../js/config').form_style
var locateFunction = require ('../js/utils').locateFunction 
var isNotLoggedIn = require('../js/utils').isNotLoggedIn
var get = require('../js/utils').get

var RaisedButton = require('material-ui').RaisedButton
var TextField = require('material-ui').TextField
var Divider = require('material-ui').Divider
// var Notification = require('../js/common').Notification

function getPriorizationIcon(_status){
    avatar_path = ""
    if (_status == 1){
        avatar_path = "img/danger.png"
    }             
    if (_status == 2){
        avatar_path = "img/ok.png"
    }             
    if (_status == 3){
        avatar_path = "img/alert.png"
    }   
    return avatar_path
}

module.exports = class Home extends React.Component {
    constructor(props) {
        super(props);
        this.refresh = this.refresh.bind(this);
        this.state = {
            shows: [],
            expanded: false,
        };
    }
        
    refresh(event){
        sessionStorage.shows = "";
        this.loadFunctions()
        // browserHistory.push("/home");
    }

    componentDidMount(){
        if (isNotLoggedIn()){
            browserHistory.push('/');
        } else {
            if (sessionStorage.shows.length > 0){
                this.setState({shows: JSON.parse(sessionStorage.shows)});
            } else {
                this.loadFunctions()
            }
        }
    }

    loadFunctions(){ 
        get('/home').then(function(response){
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
                <RaisedButton label="Actualizar Listado" onTouchTap={this.refresh} fullWidth={true}/>
                <Paper style={form_style} zDepth={2}>
                    {
                        this.state.shows.map((v, i) => (
                            <div key={i}>

                                <Card>
                                    <CardHeader
                                        avatar = {getPriorizationIcon(v.status)}
                                        title= {v.BuscarComo} 
                                        subtitle= {<div>{v.DescProducto} ({v.HoraDesde} - {v.HoraHasta})</div>}
                                        actAsExpander={true}
                                        showExpandableButton={true}
                                    />
                                    <CardText expandable={true}>
                                        <div>
                                            <b> Horario: </b> {v.HoraDesde} - {v.HoraHasta}.
                                        </div><div>
                                            <b> Telefono: </b> {v.Telefono1}.
                                        </div><div>
                                            <b> Direccion: </b> {v.Domicilio}.
                                        </div>   
                                    </CardText>
                                    <CardActions>
                                        <FlatButton href={"index.html#/patients/" + i} label="Detalle" />
                                    </CardActions>
                                </Card>
                                <br/>
                                <Divider/>
                            </div>
                          )
                        )
                    }
                </Paper>
            </div>
       )
    }
}

