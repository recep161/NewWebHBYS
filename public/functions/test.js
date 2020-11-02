const { popper } = require('popper.js');
const { JSDOM } = require("jsdom");
const { window } = new JSDOM("");
const { document } = window.document;
const $ = require('jquery');

function showSelectedDivAndHideOthers(showDivId, hideDiv) {
  var showDiv = document.getElementById(showDivId),
    hideDiv = $('#' + hideDiv);
  $(hideDiv).fadeOut('slow', function () {
    $(showDiv).fadeIn('slow');
  });
}

module.exports.showSelectedDivAndHideOthers = showSelectedDivAndHideOthers();