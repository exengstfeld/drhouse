var React = require('react')
var lightBaseTheme = require('material-ui/styles/baseThemes/lightBaseTheme')
var {red500, red700, pinkA200, grey100, grey300, grey400, grey500, white, darkBlack, fullBlack} = require('material-ui/styles/colors')
var {fade} = require('material-ui/utils/colorManipulator')

var customTheme = lightBaseTheme;

customTheme.palette = {
    primary1Color: red500,
    primary2Color: red700,
    primary3Color: grey400,
    accent1Color: pinkA200,
    accent2Color: grey100,
    accent3Color: grey500,
    textColor: darkBlack,
    alternateTextColor: white,
    canvasColor: white,
    borderColor: grey300,
    disabledColor: fade(darkBlack, 0.3),
    pickerHeaderColor: red500,
    clockCircleColor: fade(darkBlack, 0.07),
    shadowColor: fullBlack,
};

module.exports = {
    //api_base_url: "http://localhost:5500/api/mobile",
    api_base_url: "http://api.softwerkla.com/api/mobile",
    theme: customTheme
}

