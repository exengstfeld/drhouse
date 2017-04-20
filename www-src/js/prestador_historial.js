var React = require('react')
var browserHistory = require('react-router').hashHistory
var Divider = require('material-ui').Divider
var Paper = require('material-ui').Paper
var form_style = require('../js/config').form_style
var TextField = require('material-ui').TextField
var RaisedButton = require('material-ui').RaisedButton
var {Card, CardActions, CardTitle, CardHeader, CardText, CardMedia} = require('material-ui/Card')
var Notification = require('../js/common').Notification
var closeActiveSession = require('../js/utils').closeActiveSession
var get = require('../js/utils').get

var AppBar = require('material-ui').AppBar
var IconButton = require('material-ui').IconButton
var NavigationClose = require('material-ui/svg-icons/navigation/close').default

var {lightBlue50, lightBlue100} = require('material-ui/styles/colors')


function ShowCard(props){
    if(props.show.TipoMovimiento == 'E'){
        var row =(<Card>
            <CardText style={lightBlue100}>
                <b>{props.show.BuscarComo} </b> ( {props.show.DescProducto} )<br/>
                <b>Entrada:</b> {props.show.Fecha} 
            </CardText>
        </Card>)
    }else{
        var row =(<Card>
            <CardText style={lightBlue50}>
                <b>{props.show.BuscarComo} </b> ( {props.show.DescProducto} )<br/>
                <b>Salida:</b> {props.show.Fecha} <br/>
                {props.show.Observaciones}
            </CardText>
        </Card>)
    }
    return row
}
module.exports = class DatosUtiles extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            prestaciones: [],
            value: "Prestaciones realizadas"
        }
    }

    componentDidMount(){
        if (sessionStorage.prestaciones != undefined && sessionStorage.prestaciones.length > 0){
            this.setState({prestaciones: JSON.parse(sessionStorage.prestacionesx)});
        } else {
            this.loadData()
        }
    }

    loadData(){ 
        get('/prestaciones_historial').then(function(response){
            if (response.success){
                this.setState({prestaciones: response.data});
                sessionStorage.prestaciones = JSON.stringify(response.data);
            } else {
               this.setState({feedback: response.data});
            }
        }.bind(this))
    }

    render(){
        return(
            <span>
                <AppBar
                    title={this.state.value}
                    iconElementLeft={<IconButton onTouchTap={() => browserHistory.push("/home")}><NavigationClose /></IconButton>}
                />

                <Paper style={form_style} zDepth={2}>
                    {
                        this.state.prestaciones.map((v, i) => (
                            <div key={i}>
                                <ShowCard show={v} />
                            </div>
                          )
                        )
                    }
                </Paper>
            </span>
        )
    }
}

