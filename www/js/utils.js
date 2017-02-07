call = function(url, options){
    return fetch(url, options).then((response) => {
        if (response.status == 200) {
            return response.json()
        }
        throw Error("Ha ocurrido un error grave: "+ response.statusText)
    })
}

module.exports = {
    isNotLoggedIn: function(){
        return (sessionStorage.loggedIn == "") || (sessionStorage.loggedIn == undefined)
    },

    closeActiveSession: function(){
        sessionStorage.loggedIn = "";
        sessionStorage.shows = "";
        sessionStorage.user = "";
    },

    locateFunction: function(id_funcion){
        funciones = JSON.parse(sessionStorage.shows);
        for (i = 0; i < funciones.length; i++) {  
            if (funciones[i].id == id_funcion){
                return funciones[i];
            }
        }
        throw Error("No se ha localizado la funcion "+ id_funcion);
    },
    post: function(url, body){
        options = {
            "method": "POST",
            "headers":{
                "Content-Type": "application/json",
                "session-token": sessionStorage.loggedToken
            },
            "body": JSON.stringify(body)
        }
        return call(url, options);    
    },
    get: function(url){
        options = {
            "method": "GET",
            "headers":{
                "session-token": sessionStorage.token
            }
        }
        return call(url, options);    
    }
}
