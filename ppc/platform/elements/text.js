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

// #ifdef __AMLTEXT || __INC_ALL

/**
 * This element displays a rectangle containing arbitrary (X)HTML.
 *
 * This element can be databound and use databounding rules to
 * convert data into (X)HTML using--for instance--XSLT or JSLT.
 *
 * #### Example: Some simple text
 * 
 * ```xml, demo
 * <a:application xmlns:a="https://github.com/pylonide/pylon">
 *   <!-- startcontent -->
 *   <a:text width="300">
 *   Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur congue, nunc sed convallis gravida, justo nunc egestas nisi, eu iaculis nunc ipsum vel orci. Morbi mauris urna, rutrum at imperdiet at, molestie eu risus. Curabitur eu tincidunt eros. Donec in massa ut dolor vulputate commodo. Cras pulvinar urna ut ipsum pulvinar mollis sit amet in dui. Nam lobortis ligula sed tortor dapibus eget tincidunt dui pretium. 
 *   </a:text>
 *   <!-- endcontent -->
 * </a:application>
 * ```
 * 
 * #### Example: Using Scrolldown
 * 
 * ```xml, demo
 * <a:application xmlns:a="https://github.com/pylonide/pylon">
 *   <!-- startcontent -->
 *   <a:text id="txtExample"
 *     width      = "300"
 *     height     = "100" 
 *     scrolldown = "true">
 *       Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur congue, nunc sed convallis gravida, justo nunc egestas nisi, eu iaculis nunc ipsum vel orci. Morbi mauris urna, rutrum at imperdiet at, molestie eu risus. Curabitur eu tincidunt eros. Donec in massa ut dolor vulputate commodo. Cras pulvinar urna ut ipsum pulvinar mollis sit amet in dui. Nam lobortis ligula sed tortor dapibus eget tincidunt dui pretium. Quisque semper sem dignissim quam ullamcorper et lobortis arcu eleifend. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Fusce ac commodo mi. Pellentesque sit amet magna sed velit volutpat volutpat. Nam lobortis sem sed tortor accumsan dictum. Donec scelerisque rhoncus cursus. Mauris dui dolor, vehicula quis lacinia quis, facilisis et eros. Nulla facilisi. Donec urna velit, adipiscing non sollicitudin at, sodales id lorem. Fusce fringilla, magna id pellentesque egestas, neque risus luctus mauris, vel porttitor libero tortor et augue. Integer euismod porttitor mi, at viverra nulla pharetra vel. Etiam odio elit, volutpat a porttitor eu, posuere nec augue. Phasellus placerat lacus ut augue tempor consectetur. 
 *   </a:text>
 *   <a:button 
 *     onclick="txtExample.setValue(txtExample.getValue() + '&lt;br />A new line!')">
 *       Add a line
 *   </a:button>
 *   <!-- endcontent -->
 * </a:application>
 * ```
 * 
 * @class ppc.text
 * @define text
 *
 * @form
 * @inherits ppc.Cache
 * @inherits ppc.StandardBinding
 *
 * @author      Ruben Daniels (ruben AT ajax DOT org)
 * @version     %I%, %G%
 * @since       0.1
 * 
 */
// @todo Please refactor this object
ppc.text = function(struct, tagName){
    this.$init(tagName || "text", ppc.NODE_VISIBLE, struct);
    
    this.$nodes = [];
};

(function(){
    this.implement(
        // #ifdef __WITH_CACHE
        ppc.Cache,
        // #endif
        ppc.ChildValue
    );

    this.$focussable       = true; // This object can't get the focus
    this.focussable        = false;
    this.textselect        = true;
    this.$hasStateMessages = true;

    this.$textTimer = this.$lastMsg = this.$lastClass = this.$changedHeight = null;

    // *** Properties and Attributes *** //

    /**
     * @attribute {Boolean} scrolldown  Sets or gets whether this element's viewport is always
     *                                  scrolled down. This is especially useful
     *                                  when this element is used to displayed
     *                                  streaming content such as a chat conversation.
     *
     */
    /**
     * @attribute {Boolean} secure      Sets or gets whether the content loaded in this element
     *                                  should be filtered in order for it to not
     *                                  be able to execute JavaScript. This is
     *                                  especially useful when the content does
     *                                  not come from a trusted source, like a
     *                                  web service or xmpp feed.
     */
    this.$booleanProperties["scrolldown"] = true;
    this.$booleanProperties["secure"]     = true;
    this.$booleanProperties["textselect"] = true;
    this.$supportedProperties.push("behavior", "scrolldown", "secure", "value");

    this.$isTextInput = function(){
        return this.textselect;
    }

    this.$propHandlers["scrolldown"] = function(value){
        var _self = this;
        
        if (value) {
            //this.addEventListener("resize", this.$resize);
            this.$scrolldown = true;
            ppc.addListener(this.$scrollArea, "scroll", this.$scrollFunc = function(){
                _self.$scrolldown = this.scrollTop >= this.scrollHeight
                    - this.offsetHeight + ppc.getVerBorders(this);
            });
            this.addEventListener("scroll", this.$scroll);
            this.addEventListener("afterload", this.$scroll);
            this.addEventListener("resize", function(){
                if (_self.$scrollArea && _self.$scrolldown && _self.scrolldown)
                    _self.$scrollArea.scrollTop = _self.$scrollArea.scrollHeight;
            });
            clearInterval(this.$textTimer);
            this.$textTimer = setInterval(function(){
                if (_self.$scrollArea && _self.$scrolldown && _self.scrolldown)
                    _self.$scrollArea.scrollTop = _self.$scrollArea.scrollHeight;
            }, 200);
        }
        else {
            //this.removeEventListener("resize", this.$resize);
            
            this.removeEventListener("scroll", this.$scroll);
            this.removeEventListener("afterload", this.$scroll);
            clearInterval(this.$textTimer);
            if (this.$scrollArea)
                ppc.removeListener(this.$scrollArea, "scoll", this.$scrollFunc);
        }
    }
    
    this.$scroll = function(e){
        var html = this.$scrollArea;
        
        if (e.name == "afterload") {
            this.$scrolldown = true;
            html.scrollTop = html.scrollHeight;
            return;
        }
        
        this.$scrolldown = html.scrollTop >= html.scrollHeight
            - html.offsetHeight + ppc.getVerBorders(html);
    };
    
    /*this.$resize = function(){
        if (this.scrolldown && this.$scrolldown)
            this.$scrollArea.scrollTop = this.$scrollArea.scrollHeight;
    }*/

    /**
     * @attribute {String} value Sets or gets the contents of this element. This can be text, html, xhtml.
     */
    this.$propHandlers["value"] = function(value, prop, force, forceAdd){
        if (this.each)
            return;
        
        if (typeof value != "string") {
            if (value.nodeType)
                value = value.nodeType > 1 && value.nodeType < 5
                    ? value.nodeValue
                    : value.firstChild && value.firstChild.nodeValue || "";
            else
                value = value ? value.toString() : "";
        }

        if (this.secure) {
            value = value.replace(/<a /gi, "<a target='_blank' ")
                .replace(/<object.*?\/object>/g, "")
                .replace(/<script.*?\/script>/g, "")
                .replace(new RegExp("ondblclick|onclick|onmouseover|onmouseout"
                    + "|onmousedown|onmousemove|onkeypress|onkeydown|onkeyup|onchange"
                    + "|onpropertychange", "g"), "ona");
        }

        value = value.replace(/\<\?xml version="1\.0" encoding="UTF-16"\?\>/, "");
        
        if (forceAdd) {
            ppc.insertHtmlNodes(null, this.$container, null, value);
            if (!this.value) this.value = "";
            this.value += value;
        }
        else
            this.$container.innerHTML = value;//.replace(/<img[.\r\n]*?>/ig, "")

        //Iframe bug fix for IE (leaves screen white);
        if (ppc.cannotSizeIframe && this.oIframe)
            this.oIframe.style.width = this.oIframe.offsetWidth + "px";

        if (this.scrolldown && this.$scrolldown)
            this.$scrollArea.scrollTop = this.$scrollArea.scrollHeight;
    };
    
    this.$eachHandler = function(value) {
        this.$attrExcludePropBind = ppc.extend({}, this.$attrExcludePropBind);
        this.$attrExcludePropBind.value = value ? 2 : 0;
    };
    this.addEventListener("prop.each", this.$eachHandler);
    
    this.addEventListener("$clear", function(){
        this.$container.innerHTML = "";
        this.value = "";
        this.dispatchEvent("prop.value", {value: ""});
    });

    // @todo replace this stub with something that does something
    this.$moveNode = function() {};

    // *** Public methods *** //

    //#ifdef __WITH_CONVENIENCE_API

    this.addValue = function(value){
        this.$propHandlers["value"].call(this, value, null, null, true);
        this.dispatchEvent("prop.value", {value: this.value});
    };

    /**
     * Sets the value of this element. This should be one of the values
     * specified in the `values` attribute.
     * @param {String} value The new value of this element
     */
    this.setValue = function(value){
        this.setProperty("value", value, false, true);
    };

    /**
     * Returns the current value of this element.
     * @return {String} The current value.
     */
    this.getValue = function(){
        return this.$container.innerHTML;
    };
    
    //#endif

    // *** Keyboard Support *** //

    //#ifdef __WITH_KEYBOARD
    this.addEventListener("keydown", function(e){
        var key      = e.keyCode;

        switch (key) {
            case 33:
                //PGUP
                this.$container.scrollTop -= this.$container.offsetHeight;
                break;
            case 34:
                //PGDN
                this.$container.scrollTop += this.$container.offsetHeight;
                break;
            case 35:
                //END
                this.$container.scrollTop = this.$container.scrollHeight;
                break;
            case 36:
                //HOME
                this.$container.scrollTop = 0;
                break;
            case 38:
                this.$container.scrollTop -= 10;
                break;
            case 40:
                this.$container.scrollTop += 10;
                break;
            default:
                return;
        }

        return false;
    }, true);
    //#endif

    // *** Private methods *** //

    this.$canLoadData = function(){
        return this.$attrBindings.value ? true : false;
    }

    this.$add = function(xmlNode, Lid, xmlParentNode, htmlParentNode, beforeNode){
        var f = this.$attrBindings.value.cvalue;
        var html = f(xmlNode);
        html = "<div id='" + Lid + "'>" + html + "</div>";
        if (htmlParentNode) {
            if (beforeNode)
                beforeNode.insertAdjacentHTML("beforebegin", html);
            else 
                this.$container.insertAdjacentHTML("beforeend", html);
            //ppc.insertHtmlNode(oItem, htmlParentNode, beforeNode);
            
            //Iframe bug fix for IE (leaves screen white);
            if (ppc.cannotSizeIframe && this.oIframe)
                this.oIframe.style.width = this.oIframe.offsetWidth + "px";
    
            if (this.scrolldown && this.$scrolldown)
                this.$scrollArea.scrollTop = this.$scrollArea.scrollHeight;
        }
        else
            this.$nodes.push(html);
    }
    
    this.$fill = function(){
        //ppc.insertHtmlNode(null, this.$container, null, this.$nodes.join(""));
        this.$container.insertAdjacentHTML("beforeend", this.$nodes.join(""));
        this.$nodes = [];
    }
    
    this.$deInitNode = 
    this.$updateNode =
    this.$moveNode   = ppc.K;

    // *** Init *** //

    this.$draw = function(){
        this.$ext = this.$getExternal();
        this.$container = this.$getLayoutNode("main", "container", this.$ext);

        if (ppc.hasCssUpdateScrollbarBug && !ppc.getStyle(this.$container, "padding"))
            this.$fixScrollBug();

        this.$scrollArea = this.oFocus ? this.oFocus.parentNode : this.$container;

        if (this.$container.tagName.toLowerCase() == "iframe") {
            if (ppc.isIE) {
                this.oIframe = this.$container;
                var iStyle = this.skin.selectSingleNode("iframe_style");
                this.oIframe.contentWindow.document.write(
                    "<!DOCTYPE html>\
                    <head>\
                        <style>" + (iStyle ? iStyle.firstChild.nodeValue : "") + "</style>\
                        <script>\
                            document.onkeydown = function(e){\
                                if (!e) e = event;\
                                if (" + 'top.ppc.disableF5' + " && e.keyCode == 116) {\
                                    e.keyCode = 0;\
                                    return false;\
                                }\
                            }\
                        </script>\
                    </head>\
                    <body oncontextmenu='return false'></body>");
                this.$container = this.oIframe.contentWindow.document.body;
            }
            else {
                var node = document.createElement("div");
                this.$ext.parentNode.replaceChild(node, this.$ext);
                node.className = this.$ext.className;
                this.$ext = this.$container = node;
            }
        }
        
        if (this.getAttribute("each"))
            this.$eachHandler();
    };

    this.addEventListener("DOMNodeRemovedFromDocument", function() {
        clearInterval(this.$textTimer);
        ppc.destroyHtmlNode(this.oDrag);
        
        if (this.$scrollArea)
            this.$scrollArea.onscoll = this.$scrollArea = null;

        this.oDrag = this.oIframe = this.oFocus = this.$container = this.$ext = null;
    });
}).call(ppc.text.prototype = new ppc.StandardBinding());

ppc.aml.setElement("text", ppc.text);
// #endif
