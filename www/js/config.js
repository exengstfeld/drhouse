var React = require('react')
var getMuiTheme = require('material-ui/styles').getMuiTheme
var {cyan700, grey600, pinkA100, pinkA200, pinkA400, fullWhite} = require('material-ui/styles/colors')
var {fade} = require('material-ui/utils/colorManipulator')
var spacing = require('material-ui/styles/spacing')
var {amber500, redA700} = require('material-ui/styles/colors');

module.exports = {
    // api_base_url: "http://192.168.50.14:8001/api/v1.3",
    api_base_url: "http://gt-api-staging.msa:8001/api/v1.3",
    // api_base_url: "http://caba2.msa.com.ar:18001/api/v1.3",

    input_style: {
      marginLeft: 13
    },

    form_style: {
      padding: 16,
    },

    app_bar_style: {
      backgroundColor: "rgb(174, 36, 36)"
    },

    app_bar_strong_style: {
      color: amber500
    },

    logo_style: {
      heigh: "40px",
      width: "40px"
    },

    darkBaseTheme: getMuiTheme({
          spacing: spacing,
          fontFamily: 'Roboto, sans-serif',
          palette: {
            primary1Color: cyan700,
            primary2Color: cyan700,
            primary3Color: grey600,
            accent1Color: pinkA200,
            accent2Color: pinkA400,
            accent3Color: pinkA100,
            textColor: fullWhite,
            secondaryTextColor: fade(fullWhite, 0.7),
            alternateTextColor: '#303030',
            canvasColor: '#303030',
            borderColor: fade(fullWhite, 0.3),
            disabledColor: fade(fullWhite, 0.3),
            pickerHeaderColor: fade(fullWhite, 0.12),
            clockCircleColor: fade(fullWhite, 0.12),
        },
    })
}

