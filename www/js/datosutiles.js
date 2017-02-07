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
var api_base_url = require('../js/config').api_base_url
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
            Datos_Utiles: []
        }
    }

    componentDidMount(){
        if (sessionStorage.Datos_Utiles.length > 0){
            this.setState({Datos_Utiles: JSON.parse(sessionStorage.Datos_Utiles)});
        } else {
            this.loadData()
        }
    }
    loadData(){ 
        get(api_base_url + '/datos_utiles').then(function(response){
            if (response.success){
                this.setState({Datos_Utiles: response.data});
                sessionStorage.Datos_Utiles = JSON.stringify(response.data);
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
                        this.state.Datos_Utiles.map((v, i) => (
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

