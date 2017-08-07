var React = require('react')
var browserHistory = require('react-router').hashHistory
var RaisedButton = require('material-ui').RaisedButton
var {Card, CardActions, CardTitle, CardHeader, CardText, CardMedia} = require('material-ui/Card')
var AppBar = require('material-ui').AppBar
var IconButton = require('material-ui').IconButton
var ArrowBackIcon = require('material-ui/svg-icons/navigation/arrow-back').default

// Utils
var closeActiveSession = require('../utils').closeActiveSession
var get = require('../utils').get

function ShowCard(props){
    return (props.show.TipoMovimiento != "E" && (
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

module.exports = class HistorialPrestaciones extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            prestaciones: []
        }
    }

    componentDidMount(){
        this.loadData()
    }

    loadData(){ 
        get('/prestaciones_historial').then(function(response){
            if (response.success){
                this.setState({prestaciones: response.data});
            } else {
               this.setState({feedback: response.data});
            }
        }.bind(this))
    }

    render(){
        return(
            <span>
                <AppBar
                    title="Prestaciones realizadas"
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

