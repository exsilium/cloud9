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
//#ifdef __AMLSTATE || __INC_ALL

/**
 * @private
 */
ppc.StateServer = {
    states: {},
    groups: {},
    locs  : {},

    removeGroup: function(name, elState){
        this.groups[name].remove(elState);
        if (!this.groups[name].length) {
            if (self[name]) {
                self[name].destroy();
                self[name] = null;
            }

            delete this.groups[name];
        }
    },

    addGroup: function(name, elState, pNode){
        if (!this.groups[name]) {
            this.groups[name] = [];

            var pState = new ppc.state({
                id : name
            });
            pState.parentNode = pNode;
            //pState.implement(ppc.AmlNode);
            //pState.name   = name;
            pState.toggle = function(){
                for (var next = 0, i = 0; i < ppc.StateServer.groups[name].length; i++) {
                    if (ppc.StateServer.groups[name][i].active) {
                        next = i + 1;
                        break;
                    }
                }

                ppc.StateServer.groups[name][
                    (next == ppc.StateServer.groups[name].length) ? 0 : next
                  ].activate();
            }

            this.groups[name].pState = self[name] = pState;
        }

        if (elState)
            this.groups[name].push(elState);

        return this.groups[name].pState;
    },

    removeState: function(elState){
        delete this.states[elState.name];
    },

    addState: function(elState){
        this.states[elState.name] = elState;
    }
}

/**
 * This element specifies a certain state of (a part of) the application. By
 * "state", we mean a collection of properties on objects that have a certain
 * value at one time. 
 * 
 * This element allows you to specify which properties on
 * which elements should be set when a state is activated. This element can
 * belong to a state-group containing multiple elements with a default state.
 * 
 * #### Example
 * 
 * ```xml, demo
 * <a:application xmlns:a="https://github.com/pylonide/pylon">
 *   <!-- startcontent -->
 *   <a:state 
 *     group   = "stRole" 
 *     id      = "stUser" 
 *     caption = "You are a user" 
 *     active  = "true" />
 *   <a:state 
 *      group   = "stRole" 
 *      id      = "stAdmin" 
 *      caption = "You have super powers" />
 *   <a:label caption="{stRole.caption}" />
 *   <a:hbox height="34" width="200" margin="10 0 0 0">
 *       <a:button 
 *         width   = "100" 
 *         onclick = "stUser.activate()">State - User</a:button>
 *       <a:button 
 *         width   = "100" 
 *         onclick = "stAdmin.activate()">State - Admin</a:button>
 *   </a:hbox>
 *   <!-- endcontent -->
 * </a:application>
 * ```
 *
 * @class ppc.state
 * @define state
 *
 * @logic
 * @inherits ppc.AmlElement
 *
 * @author      Ruben Daniels (ruben AT ajax DOT org)
 * @version     %I%, %G%
 * @since       0.9
 */
/**
 * @event change Fires when the active property of this element changes.
 *
 */
ppc.state = function(struct, tagName){
    this.$init(tagName || "state", ppc.NODE_HIDDEN, struct);
    
    this.$signalElements = [];
    this.$groupAdded     = {};
    this.$locationAdded  = '';
};

(function(){
    // *** Properties and Attributes *** //

    this.$supportedProperties.push("active");
    this.$booleanProperties["active"] = true;
    
    /**
     * @attribute {Boolean} active whether this state is the active state
     */
    this.$propHandlers["active"] = function(value){
        //Activate State
        if (ppc.isTrue(value)) {
            if (this.group) {
                var nodes = ppc.StateServer.groups[this.group];
                if (!nodes) {
                    ppc.StateServer.addGroup(this.group, this);
                    nodes = ppc.StateServer.groups[this.group];
                }
                
                for (var i = 0; i < nodes.length; i++) {
                    if (nodes[i] != this && nodes[i].active !== false)
                        nodes[i].deactivate();
                }
            }

            var q = this.$signalElements;
            for (var i = 0; i < q.length; i++) {
                if (!self[q[i][0]] || !self[q[i][0]].setProperty) {
                    //#ifdef __DEBUG
                    /*throw new Error(ppc.formatErrorString(1013, this,
                        "Setting State",
                        "Could not find object to give state: '"
                        + q[i][0] + "' on property '" + q[i][1] + "'"));*/
                    ppc.console.warn("Could not find object to give state: " 
                        + q[i][0] + "' on property '" + q[i][1] + "'");
                    //#endif
                    
                    continue;
                }

                self[q[i][0]].setProperty(q[i][1], this[q[i].join(".")]);
            }

            if (this.group) {
                var attr = this.attributes;
                for (var i = 0; i < attr.length; i++) {
                    if (attr[i].nodeName.match(/^on|^(?:group|id)$|^.*\..*$/))
                        continue;
                    self[this.group].setProperty(attr[i].nodeName,
                        attr[i].nodeValue);
                }
                ppc.StateServer.groups[this.group].pState.dispatchEvent("change");
            }

            this.dispatchEvent("activate");

            //#ifdef __DEBUG
            ppc.console.info("Setting state '" + this.name + "' to ACTIVE");
            //#endif
        }

        //Deactivate State
        else {
            this.setProperty("active", false);
            this.dispatchEvent("deactivate");

            //#ifdef __DEBUG
            ppc.console.info("Setting state '" + this.name + "' to INACTIVE");
            //#endif
        }
    };


    // *** Public methods *** //

    //#ifdef __WITH_CONVENIENCE_API

    /**
     * Sets the value of this element. This should be one of the values
     * specified in the values attribute.
     * @param {String} value Sets the new value of this element
     */
    this.setValue = function(value){
        this.active = 9999;
        this.setProperty("active", value, false, true);
    };

    /**
     * Actives this state, setting all the properties on the elements that
     * were specified.
     */
    this.activate = function(){
        this.active = 9999;
        this.setProperty("active", true, false, true);
    };

    /**
     * Deactivates the state of this element. This is mostly a way to let all
     * elements that have property bound to this state know it is no longer
     * active.
     */
    this.deactivate = function(){
        this.setProperty("active", false, false, true);
    };
    
    //#endif

    // *** Init *** //

    this.$propHandlers["group"] = function(value){  
        if (value) {
            ppc.StateServer.addGroup(value, this);
            this.$groupAdded = {'value' : value, elState : this};
        }
        else {
            ppc.StateServer.removeGroup(this.$groupAdded.value, this.$groupAdded.elState);
            this.$groupAdded     = {};
        }
    }

    this.$propHandlers["location"] = function(value){
        if (value) {
            ppc.StateServer.locs[value] = this;
            this.$locationAdded = value;
        }
        else {
            delete ppc.StateServer.locs[this.$locationAdded];
            this.$locationAdded = '';
        }
    }
    
    this.addEventListener("DOMNodeInsertedIntoDocument", function(e){
        ppc.StateServer.addState(this);

        //Properties initialization
        var attr = this.attributes;
        for (var s, i = 0; i < attr.length; i++) {
            s = attr[i].nodeName.split(".");
            if (s.length == 2)
                this.$signalElements.push(s);
        }
    });

    this.addEventListener("DOMNodeRemovedFromDocument", function(){
        this.$signalElements = null;
        ppc.StateServer.removeState(this);
        if (this.group)
            ppc.StateServer.removeGroup(this.group, this);
    });
}).call(ppc.state.prototype = new ppc.AmlElement());

ppc.aml.setElement("state", ppc.state);
// #endif
