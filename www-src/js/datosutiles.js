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
                title= {props.show.nombre} 
                subtitle= {<div>{props.show.direccion}, {props.show.localidad}</div>}
                actAsExpander={true}
                showExpandableButton={true}
            />
            <CardText expandable={true}>
                <div>
                    <b> Telefono: </b> {props.show.telefono}
                </div><div>
                    <b> Direccion: </b> {props.show.direccion}
                </div><div>
                    <b> Localidad: </b> {props.show.localidad}
                </div>   
            </CardText>
        </Card>
    )
}
module.exports = class DatosUtiles extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            datos_utiles: []
        }
    }

    componentDidMount(){
        if (sessionStorage.datos_utiles != undefined && sessionStorage.datos_utiles.length > 0){
            this.setState({datos_utiles: JSON.parse(sessionStorage.datos_utiles)});
        } else {
            this.loadData()
        }
    }
    loadData(){ 
        get('/datos_utiles').then(function(response){
            if (response.success){
                this.setState({datos_utiles: response.data});
                sessionStorage.datos_utiles = JSON.stringify(response.data);
            } else {
               this.setState({feedback: response.data});
            }
        }.bind(this))
    }
    render(){
        return(
            <div>
                <Card>
                    <CardTitle title="Datos útiles"/>
                 </Card>

                <Paper style={form_style} zDepth={2}>
                    {
                        this.state.datos_utiles.map((v, i) => (
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

