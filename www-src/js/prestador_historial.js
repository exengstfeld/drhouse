var React = require('react')
var browserHistory = require('react-router').hashHistory
var Divider = require('material-ui').Divider
var Paper = require('material-ui').Paper
var TextField = require('material-ui').TextField
var RaisedButton = require('material-ui').RaisedButton
var {Card, CardActions, CardTitle, CardHeader, CardText, CardMedia} = require('material-ui/Card')
var Notification = require('../js/common').Notification
var closeActiveSession = require('../js/utils').closeActiveSession
var get = require('../js/utils').get

var AppBar = require('material-ui').AppBar
var IconButton = require('material-ui').IconButton
var ArrowBackIcon = require('material-ui/svg-icons/navigation/arrow-back').default

var form_style = require('../js/config').form_style
var indigo50_style = require('../js/config').indigo50_style
var lightBlue50_style = require('../js/config').lightBlue50_style

function ShowCard(props){
    return (
            props.show.TipoMovimiento != "E" && (
        <Card>
            <CardHeader title={props.show.BuscarComo} 
                subtitle={props.show.Fecha}
                actAsExpander={true}/>
            <CardText>
                {props.show.Observaciones}
            </CardText>
        </Card>
        )
    )
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
        this.loadData()
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
                    iconElementLeft={<IconButton onTouchTap={() => browserHistory.push("/home")}><ArrowBackIcon /></IconButton>}
                />

                {
                    this.state.prestaciones.map((v, i) => (
                        <div key={i}>
                            <ShowCard show={v} />
                        </div>
                      )
                    )
                }
            </span>
        )
    }
}

