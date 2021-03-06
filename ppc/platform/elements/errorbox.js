/*
 * See the NOTICE file distributed with this work for additional
 * information regarding copyright ownership.
 *
 * This is free software; you can redistribute it and/or modify it
 * under the terms of the GNU Lesser General Public License as
 * published by the Free Software Foundation; either version 2.1 of
 * the License, or (at your option) any later version.
 *
 * This software is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this software; if not, write to the Free
 * Software Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA
 * 02110-1301 USA, or see the FSF site: http://www.fsf.org.
 *
 */

// #ifdef __AMLERRORBOX || __INC_ALL

/**
 * An element showing an error message when the attached element 
 * is in erroneous state and has the `invalidmsg=""` attribute specified.
 *
 * In most cases, the errorbox element is implicit and will be created 
 * automatically. 
 * 
 * #### Example
 *
 * ```xml
 *  <a:errorbox>
 *      Invalid e-mail address entered.
 *  </a:errorbox>
 * ```
 * 
 * #### Remarks
 *
 * In most cases the errorbox element is not created directly, but implicitly
 * by a validationgroup. An element that goes into an error state will
 * show the errorbox.
 * 
 * ```xml
 *  <a:bar validgroup="vgForm">
 *      <a:label>Phone number</a:label>
 *      <a:textbox id="txtPhone"
 *          required   = "true" 
 *          pattern    = "(\d{3}) \d{4} \d{4}" 
 *          invalidmsg = "Incorrect phone number entered" />
 *
 *      <a:label>Password</a:label>
 *      <a:textbox 
 *          required   = "true" 
 *          mask       = "password"
 *          minlength  = "4"
 *          invalidmsg = "Please enter a password of at least four characters" />
 *      <a:button onclick="vgForm.validate()">Validate</a:button>
 *  </a:bar>
 * ```
 *
 * To check if the element has valid information entered, leaving the textbox
 * (focussing another element) will trigger a check. A programmatic check
 * can be done using the following code:
 * 
 * ```javascript
 *  txtPhone.validate();
 * 
 *  //Or use the html5 syntax
 *  txtPhone.checkValidity();
 * ```
 *
 * To check for the entire group of elements use the validation group. For only 
 * the first non-valid element the errorbox is shown. That element also receives
 * focus.
 * 
 * ```javascript
 *  vgForm.validate();
 * ```
 *
 * @class ppc.errorbox
 * @define errorbox
 * 
 * @allowchild {anyxhtml}
 *
 *
 * @inherits ppc.Presentation
 *
 * @author      Ruben Daniels (ruben AT ajax DOT org)
 * @version     %I%, %G%
 * @since       0.4
 */
ppc.errorbox = function(struct, tagName){
    this.$init(tagName || "errorbox", ppc.NODE_VISIBLE, struct);
};

(function(){
    this.$positioning = "basic";
    this.display = function(host){
        this.host = host;

        var refHtml = 
            //#ifdef __WITH_HTML5
            host.validityState && host.validityState.$errorHtml ||
            //#endif
            host.$ext;

        document.body.appendChild(this.$ext);
        /*var pos = ppc.getAbsolutePosition(refHtml, document.body);

        if (document != refHtml.ownerDocument) {
            var pos2 = ppc.getAbsolutePosition(refHtml.ownerDocument.parentWindow.frameElement, document.body);
            pos[0] += pos2[0];
            pos[1] += pos2[1];
        }*/

        var x = (parseFloat(host.$getOption && host.$getOption("main", "erroffsetx") || 0)),
            y = (parseFloat(host.$getOption && host.$getOption("main", "erroffsety") || 0));
        //this.$ext.style.left = x + "px"
        //this.$ext.style.top  = y + "px"

        this.show();
        ppc.popup.show(this.$uniqueId, {
            x       : x,
            y       : y,
            animate : false,
            ref     : refHtml,
            allowTogether: true
        });

        this.$setStyleClass(this.$ext,
            x + this.$ext.offsetWidth > this.$ext.offsetParent.offsetWidth
                ? "rightbox"
                : "leftbox", ["leftbox", "rightbox"]);
    };
    
    /**
     * Sets the message of the errorbox.
     * @param {String} value The message to set.
     */
    this.setMessage = function(value){
        if (value && value.indexOf(";") > -1) {
            value = value.split(";");
            value = "<strong>" + value.shift() + "</strong>" + value.join(";");
        }
        this.$int.innerHTML = value || "";
    };
    
    this.$draw = function(){
        //Build Main Skin
        this.$ext   = this.$getExternal(); 
        this.$int   = this.$getLayoutNode("main", "container", this.$ext);
        this.oClose = this.$getLayoutNode("main", "close", this.$ext);
        
        if (this.oClose) {
            var _self = this;
            this.oClose.onclick = function(){
                _self.hide();

                if (ppc.document.activeElement)
                    ppc.document.activeElement.focus(true, {mouse:true});
            };
        }
        
        this.$ext.onmousedown = function(e){
            (e || event).cancelBubble = true;
            
            //#ifdef __WITH_WINDOW_FOCUS
            if (ppc.hasFocusBug)
                ppc.window.$focusfix();
            //#endif
        }

        ppc.popup.setContent(this.$uniqueId, this.$ext, "", null, null);
    };
    
    this.$loadAml = function(x){
        if (!ppc.isTrue(this.getAttribute("visible")))
            this.hide();
    };
    
    this.$destroy = function(){
        if (this.oClose)
            this.oClose.onclick = null;
        
        this.$ext.onmousedown = null;
        
        ppc.popup.removeContent(this.$uniqueId);
    };
}).call(ppc.errorbox.prototype = new ppc.Presentation());

ppc.aml.setElement("errorbox", ppc.errorbox);
// #endif