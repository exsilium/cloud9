/**
 * Main Module for the Cloud9 IDE
 *
 * @copyright 2012, Ajax.org B.V.
 * @license GPLv3 <http://www.gnu.org/licenses/gpl.txt>
 */

define(function(require, exports, module) {

var ide = require("core/ide");
var ext = require("core/ext");
var markup = require("text!ext/main/main.xml");
var skin = require("text!ext/main/style/skins.xml");

document.documentElement.style.display = "block";
document.body.style.display = "block"; //might wanna make this variable based on layout loading...

//Start PPC
ppc.config.resize = cloud9config.debug ? true : false;
ppc.initialize('<a:application xmlns:a="https://github.com/pylonide/pylon" />');

// OVerscroll is a complex problem. This doesn't solve it. Preferences remain unscrollable
document.body.addEventListener('touchmove',function(e) {
  if(!(e.target.className == "caption" || e.target.className == "item-fix" || e.target.className == "item-fix plus")) {
    e.preventDefault();
  }
});

module.exports = ext.register("ext/main/main", {
    dev     : "Ajax.org",
    name    : "Main",
    alone   : true,
    type    : ext.GENERAL,
    markup  : markup,
    skin    : {
        data : skin,
        "media-path" : ide.staticPrefix + "/ext/main/style/images/",
        "icon-path" : ide.staticPrefix + "/ext/main/style/icons/"
    },

    init : function(){
        ide.addEventListener("extload", function(){
            ppc.config.resize = true;
            ppc.layout.$onresize();
        });
        
        window.splitterPanelLeft = hboxMain.$handle; //Intended to be global
    }
});

    }
);
