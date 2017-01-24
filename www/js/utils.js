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
}
