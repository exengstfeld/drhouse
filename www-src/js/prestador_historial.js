var React = require('react')
var browserHistory = require('react-router').hashHistory
var Divider = require('material-ui').Divider
var Paper = require('material-ui').Paper
var form_style = require('../js/config').form_style
var TextField = require('material-ui').TextField
var RaisedButton = require('material-ui').RaisedButton
var {Card, CardActions, CardTitle, CardHeader, CardText, CardMedia} = require('material-ui/Card')
var Notification = require('../js/common').Notification
var input_style = require('../js/config').input_style
var closeActiveSession = require('../js/utils').closeActiveSession
var get = require('../js/utils').get


function ShowCard(props){
    return (          
        <Card>
            <CardHeader
                title= {props.show.BuscarComo} 
                subtitle= {<div>{props.show.DescProducto}</div>}
                actAsExpander={true}
                showExpandableButton={true}
            />
            <CardText expandable={true}>
                <div>
                    <b> Fecha: </b> {props.show.direccion}
                </div><div>
                    <b> Observacion: </b> {props.show.Observacion}
                </div>   
            </CardText>
        </Card>
    )
}
module.exports = class DatosUtiles extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            prestaciones: []
        }
    }

    componentDidMount(){
        if (sessionStorage.prestaciones.length > 0){
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
            <div>
                <Card>
                    <CardTitle title="Prestaciones Realizadas"/>
                 </Card>

                <Paper style={form_style} zDepth={2}>
                    {
                        this.state.prestaciones.map((v, i) => (
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

