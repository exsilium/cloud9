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
//#ifdef __AMLSTATEGROUP || __INC_ALL

/**
 * An element that groups state elements together and
 * provides a way to set a default state.
 * 
 * #### Example
 *
 * ```xml
 *  <a:state-group
 *    loginMsg.visible  = "false"
 *    winLogin.disabled = "false">
 *      <a:state id="stFail"
 *          loginMsg.value   = "Username or password incorrect"
 *          loginMsg.visible = "true" />
 *      <a:state id="stError"
 *          loginMsg.value   = "An error has occurred. Please check your network."
 *          loginMsg.visible = "true" />
 *      <a:state id="stLoggingIn"
 *          loginMsg.value    = "Please wait while logging in..."
 *          loginMsg.visible  = "true"
 *          winLogin.disabled = "true" />
 *      <a:state id="stIdle" />
 *  </a:state-group>
 * ```
 *
 * @class ppc.stateGroup
 * @define state-group
 * @logic
 * @inherits ppc.AmlElement
 *
 * @see ppc.state
 *
 * @author      Ruben Daniels (ruben AT ajax DOT org)
 * @version     %I%, %G%
 * @since       0.4
 */
ppc.stateGroup = function(){
    this.$init("state-group", ppc.NODE_HIDDEN);
};
ppc.aml.setElement("state-group", ppc.stateGroup);

(function(){
    this.$handlePropSet = function(prop, value, force){
        if (prop == "id")
            return;
        
        var node, nodes = this.childNodes;
        for (var i = 0, l = nodes.length; i < l; i++){
            node = nodes[i];
        
            if (node.nodeType != 1 || node.localName != "state")
                continue;

            if (!node[prop] || node.$inheritProperties[prop] == 2) {
                node.$inheritProperties[prop] = 2;
                node.setProperty(prop, value);
            }
        }
    };
    
    //@todo this should use text node insertion
    this.addEventListener("DOMNodeInsertedIntoDocument", function(e){
        if (!this.id)
            this.id = "stategroup" + this.$uniqueId;
        
        //ppc.StateServer.addGroup(this.id, null, this.parentNode); //@todo rearch this
        
        var nodes = this.childNodes;
        for (var i = 0, l = nodes.length; i < l; i++){
            nodes[i].setProperty("group", this.id);
        }
    });
}).call(ppc.stateGroup.prototype = new ppc.AmlElement());

// #endif
