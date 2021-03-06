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

//#ifdef __WITH_RDB

/**
 * Element allowing data synchronization between multiple clients using the same
 * application or application part. This element is designed as thecore of
 * collaborative application logic for Pylon Platform Code. The children of this
 * element specify how the uniqueness of {@link term.datanode data nodes} is determined. By pointing
 * models to this element, all changes to their data will be streamed through
 * this element to all listening client over a choosen protocol.
 * Example:
 * This example shows a small application which is editable by all clients that
 * have started it. Any change to the data is synchronized to all participants.
 * <code>
 *  <a:teleport>
 *      <a:xmpp id="myXMPP"
 *        url           = "http://ajax.org:5280/http-bind"
 *        model         = "mdlRoster"
 *        connection    = "bosh"
 *  </a:teleport>
 *
 *  <a:remote transport="myXMPP" id="rmtPersons" />
 *
 *  <a:model id="mdlPersons" remote="rmtPersons">
 *      <persons>
 *          <person id="1">mike</person>
 *          <person id="2">ruben</person>
 *      </persons>
 *  </a:model>
 *
 *  <a:list id="lstPersons" model="mdlPersons" width="200" height="100">
 *      <a:bindings>
 *          <a:each match="[person]" />
 *          <a:caption match="[text()]" />
 *          <a:icon value="icoUsers.gif" />
 *      </a:bindings>
 *  </a:list>
 *
 *  <a:button action="remove" target="lstPersons">Remove</a:button>
 *  <a:button action="rename" target="lstPersons">Rename</a:button>
 *
 *  <a:button onclick="myXMPP.connect('testuser@ajax.org', 'testpass')">
 *      Login
 *  </a:button>
 * </code>
 * Remarks:
 * Although locking is solved in smartbindings it is directly connected
 * to remote databindings. When multiple people are working within the same
 * application it's important to have a system that prevents corruption of data
 * and data loss by either user overwriting records edited during the same period.
 * Pylon Platform Code has built in support for optimistic and pessimistic locking
 * in smartbindings. For more information please see {@link term.locking}.
 *
 * Advanced:
 * There is a very small theoretical risk that a user initiates and finishes an
 * action during the latency period of the rdb communication. Usually this
 * latency is no more than 100 to 300ms which is near impossible for such action
 * to be performed. Therefor this is deemed acceptable.
 *
 * Working in a multi user environment usually implies that data has a high
 * probability of changing. This might become a problem when syncing offline
 * changes after several hours. This should be a consideration for the
 * application architect.
 *
 * Another concern for offline use is the offline messaging feature of certain
 * collaborative protocols (i.e. xmpp). In many cases offline rdb messages should
 * not be stored after the user has been offline for longer then a certain time.
 * For instance 10 minutes. An accumulation of change messages would create a
 * serious scaling problem and is not preferred. ppc.offline has built in support
 * for this type of timeout. By setting the rdb-timeout attribute it is aware
 * of when the server has timed out. When this timeout is reached the application
 * will reload all its data from the server and discard all offline rdb
 * messages before reconnecting to the server.
 *
 * @attribute {String} transport the name of the teleport element that provides a
 * bidirectional connection to (a pool of) other clients.
 *
 * 
 *
 * @define remote
 * @allowchild unique, {any}
 *
 *
 * @define unique Element defining what is unique about a set of data elements.
 * This enables remote databindings to point to xml data in  the same way on all
 * clients. This way changes that happen to these elements are described
 * non-ambiguously. The tagName can be replaced by the tagName of the
 * {@link term.datanode data node} for which the uniqueness is specified.
 * Example:
 * This example shows a complex data set and a remote databinding that
 * specifies the uniqueness of all nodes concerned.
 * <code>
 *  <a:model id="mdlPersons" remote="rmtPersons">
 *      <universe>
 *          <galaxy name="milkyway">
 *              <planet id="ALS-3947">
 *                  <species>3564</species>
 *                  <species>8104</species>
 *              </planet>
 *              <planet id="Earth">
 *                  <person number="802354897">Mike</person>
 *                  <person number="836114798">Rik</person>
 *              </planet>
 *          </galaxy>
 *      </universe>
 *  </a:model>
 *
 *  <a:remote transport="myXMPP" id="rmtPersons" />
 * </code>
 * @attribute {String} transport   ID of a Teleport element that is able to serve
 *                                 as a transport for RDB message like xmpp
 */
/**
 * @author      Mike de Boer (mike AT ajax DOT org)
 * @version     %I%, %G%
 * @since       3.0
 *
 * @default_private
 * @constructor
 *
 * @todo Think about wrapping multiple messages in a single call
 * @todo Make RDB support different encoding protocols (think REX)
 */
ppc.remote = function(struct, tagName){
    this.$init(tagName || "remote", ppc.NODE_HIDDEN, struct);

//    this.lookup              = {};
//    this.select              = [];
    this.$sessions           = {};
    this.rdbQueue            = {};
    this.queueTimer          = null;
    this.pendingTerminations = {};
    this.offlineQueue        = [];
};

ppc.remote.SESSION_INITED     = 0x0001; //Session has not started yet.
ppc.remote.SESSION_STARTED    = 0x0002; //Session is started
ppc.remote.SESSION_TERMINATED = 0x0004; //Session is terminated

(function(){
    //#ifdef __WITH_OFFLINE
    this.discardBefore = null;
    //#endif

    this.logprefix = "";
    if (!ppc.isO3) {
        this.log = function(msg){
            ppc.console.log(msg);
        }
    }

    //1 = force no bind rule, 2 = force bind rule
    this.$attrExcludePropBind = ppc.extend({
        match : 1
    }, this.$attrExcludePropBind);

    this.$supportedProperties.push("transport");

    /* @todo move this to the rdb-xmpp transport layer
    function checkProtocol(uri) {
        if (uri.indexOf("rdb__") === 0)
            return "rdb:" + uri.substr(3).replace(/_/g, "/");
        return uri;
    } */

    this.$propHandlers["transport"] = function(value) {
        this.transport = typeof value == "object" ? value : self[this["transport"]];

        //#ifdef __DEBUG
        if (!this.transport) {
            throw new Error(ppc.formatErrorString(0, this, "RDB: Missing transport",
                "A transport element with ID '" + value + "' could not be found."));
        }
        //#endif

        var _self = this;
        this.transport.addEventListener("connect", function() {
            var uri, oSession;
            for (uri in _self.$sessions) {
                oSession = _self.$sessions[uri];
                if (oSession.state == ppc.remote.SESSION_STARTED)
                    continue;

                this.join(uri, function(uri, iTime) {
                    //_self.$startSession(uri, iTime);
                });
            }
        });

        this.transport.addEventListener("disconnect", function() {
            var uri, oSession;
            for (uri in _self.$sessions) {
                oSession       = _self.$sessions[uri];
                oSession.state = ppc.remote.SESSION_TERMINATED;
            }
        });

        this.transport.addEventListener("update", function(e){
            _self.$update(e);
        });

        this.transport.addEventListener("join", function(e) {
            if (!e.uri)
                return;

            var uri      = e.uri,
                oSession = _self.$sessions[e.uri];
            //if document isn't passed this must be a join request from a peer
            if (!e.document) {
                //#ifdef __DEBUG
                this.log && this.log(_self.logprefix + "Did not receive a document " +
                    "with the join message. Assuming a join request from a peer. " +
                    "If this message originated from the server something has gone wrong.");
                //#endif

                return _self.dispatchEvent("joinrequest", e);
            }

            //Create sesssion if it doesn't exist
            if (!oSession)
                oSession = _self.createSession(uri, null, null, e.document, e.basetime);
            else {
                oSession.model.load(e.document);
                _self.$startSession(uri, e.basetime);
            }
        });

        this.transport.addEventListener("leave", function(e) {
            _self.endSession(e.uri);
        });
    };

    this.$update = function(e){
        var sData    = e.message.args ? [e.message] : e.message;
        var oData    = typeof sData == "string"
                ? ppc.unserialize(sData)
                : sData;
        var oSession = this.$sessions[e.uri];
        var i        = 0;
        var l        = oData.length;

        for (; i < l; i++)
            this.$receiveChange(oData[i], oSession, e.annotator);
    };

    this.clear = function(){
        this.$sessions = {};
    };

    /**
     * Create a new RDB session based on a URI.
     * @param uri
     * @param model
     * @param xpath
     */
    this.createSession = function(uri, model, xpath, doc, iTime){
        this.log && this.log(this.logprefix + "Creating session for " + uri);

        if (!model)
            model = this.dispatchEvent("modelfind", {uri: uri});
        if (model) {
            delete model.src;
            //@todo if this model is in a session stop that session
        }
        else
            model = new ppc.model(); //ppc.nameserver.register("model", id, );

        model.setProperty("remote", this);
        model.rdb = this;
        model.src = uri;

        var oSession = this.$addSession(uri, model, xpath);

        //We received the document and load it
        if (doc) {
            model.load(doc);
            this.$startSession(uri, iTime);
        }
        //We did not receive a document and will issue a join request to the server
        else {
            //If the transport is already connected, let
            if (this.transport && this.transport.isConnected()) {
                var _self = this;
                this.transport.join(uri, function(uri, iTime) {
                    _self.$startSession(uri, iTime);
                });
            }
        }

        return oSession;
    };

    /**
     * Terminate an RDB session based on a URI.
     * @param uri
     */
    this.endSession = function(uri) {
        if (!this.$sessions || !this.$sessions[uri])
            return;

        var oSession = this.$sessions[uri];
        if (this.transport && this.transport.isConnected() && oSession.state != ppc.remote.SESSION_TERMINATED)
            this.transport.leave(uri);

        oSession.state = ppc.remote.SESSION_TERMINATED;

        delete this.$sessions[uri];
    };

    this.$addSession = function(uri, model, xpath){
        delete this.$sessions[uri];

        return this.$sessions[uri] = {
            uri   : uri,
            model : model,
            xpath : xpath,
            state : ppc.remote.SESSION_INITED
        };
    };

    this.$startSession = function(uri, basetime){
        var oSession = this.$sessions[uri];

        if (!oSession) {
            //#ifdef __DEBUG
            this.log && this.log(this.logprefix + "Could not find RDB session to start " + uri);
            //#endif
            return false;
        }

        oSession.state = ppc.remote.SESSION_STARTED;
        if (basetime && !oSession.basetime)
            oSession.basetime = basetime;

        // #ifdef __DEBUG
        this.log && this.log(this.logprefix + "session started: " + uri + ", " + oSession.basetime);
        // #endif
    };

    this.$queueMessage = function(args, model, qHost){
        if (!qHost.rdbQueue)
            qHost.rdbQueue = {};

        var uri      = model.src;
        var oSession = this.$sessions[uri];

        // #ifdef __DEBUG
        if (!oSession) {
            this.log && this.log(this.logprefix + ppc.formatErrorString(0, this, "RDB: sending message",
                "No RDB session found. Please make sure a session is created for this model: "
                + model.serialize()));
            return false;
        }
        // #endif

        if (!qHost.rdbQueue[uri]) {
            qHost.rdbQueue[uri] = [];
            qHost.rdbModel      = model;
        }

        for (var node, i = 0, l = args.length; i < l; ++i) {
            if ((node = args[i]) && node.nodeType) {
                //@todo some changes should not be sent to the server
                if (args[0] == "setAttribute" && args[2] == "level"
                  && args[1] == args[1].ownerDocument.documentElement)
                    return false; //@todo refactor and make configurable

                args[i] = this.xmlToXpath(args[i], model.data);
            }
            else if (node && node.dataType == ppc.ARRAY) {
                for (var j = 0; j < node.length; j++) {
                    if (node[j] && node[j].nodeType)
                        node[j] = this.xmlToXpath(node[j], model.data);
                }
            }
        }

        qHost.rdbQueue[uri].push({
            uri       : uri,
            args      : args,
            currdelta : (new Date()).toISOString() - oSession.basetime
        });
    };

    this.$processQueue = function(qHost){
        if (qHost === this)
            clearTimeout(this.queueTimer);
        if (ppc.xmldb.disableRDB)
            return;

        var list;
        for (var uri in qHost.rdbQueue) {
            if (!(list = qHost.rdbQueue[uri]).length)
                continue;

            //#ifdef __DEBUG
            this.log && this.log(this.logprefix + "Sending " + list.length + " RDB messages to " + uri);
            //#endif

            if (this.transport)
                this.transport.sendUpdate(uri, JSON.stringify(list));

            this.dispatchEvent("rdbsend", {
                uri     : uri,
                message : list
            });
        }

        qHost.rdbQueue = {};
    };

    this.$receiveChange = function(oMessage, oSession, sAnnotator){
        //if (ppc.xmldb.disableRDB) {
            this.log && this.log(this.logprefix + "Receiving change. disableRDB=" + ppc.xmldb.disableRDB);
            //return;
        //}

        //#ifdef __WITH_OFFLINE
        // @todo ppc3.0 implement proper offline support in RDB
        if (ppc.offline && ppc.offline.inProcess == 2) {
             //We're coming online, let's queue until after sync
            this.offlineQueue.push(oMessage);

            this.log && this.log(this.logprefix + "Not executing incoming change because we're offline. Action is queued.");
            return;
        }
        //#endif

        if (!oSession && oMessage.uri)
            oSession = this.$sessions[oMessage.uri];

        if (!oSession) {
            // #ifdef __DEBUG
            ppc.console.error("Could not find session while receiving data for a session with id '"
                + oMessage.uri + "'");
            // #endif
            return;
        }

        //if (oMessage.timestamp < this.discardBefore) //@todo discardBefore
            //return;

        var model = oSession.model;
        if (!model) {
            //#ifdef __DEBUG
            ppc.console.error("Remote Databinding Received: Could not find model while"
                 + " receiving data for it with identifier '" + oMessage.model + "'");
            //#endif
            return;
        }
        if (!model.$at)
            model.$at = ppc.window.$at; //@todo find better solution to the case of a missing ActionTracker...

        var oError, xmlNode, disableRDB = ppc.xmldb.disableRDB;
        ppc.xmldb.disableRDB = 2; //Feedback prevention

        // Correct timestamp with the session basetime
        var time = oSession.basetime + parseInt(oMessage.currdelta, 10);

        // #ifdef __DEBUG
        this.log && this.log(this.logprefix + "timestamp comparison (base: " + oSession.basetime + ") : "
            + new Date(new Date().getUTCTime()).toGMTString()
            + ", " + (new Date(time).toGMTString()));
        // #endif

        // Undo all items until state is equal to when message was executed on original client.
        var aUndos = []; //model.$at.getDone(time),
        var i      = 0;
        var l      = aUndos.length;
        if (l) {
            for (; i < l; ++i)
                aUndos[i].$dontapply = true;
            model.$at.undo(l);
        }

        //Fetch node based on their xpath
        var q     = oMessage.args.slice();
        var xpath = q[1];
        xmlNode = q[1] = this.xpathToXml(xpath, model.data);
        if (xmlNode) {
            var action = q.shift();

            if (action == "addChildNode")
                q[3] = this.xpathToXml(q[3], model.data);
            else if (action == "appendChild") {
                q[1] = typeof q[1] == "string" ? ppc.getXml(q[1]) : q[1];
                q[2] = q[2] ? this.xpathToXml(q[2], model.data) : null;
            }
            else if (action == "moveNode") {
                q[1] = this.xpathToXml(q[1], model.data);
                q[2] = q[2] ? this.xpathToXml(q[2], model.data) : null;
            }
            else if (action == "replaceNode") {
                q[0] = typeof q[1] == "string" ? ppc.getXml(q[1]) : q[1];
                q[1] = xmlNode;
            }
            else if (action == "removeNodeList") {
                var arr = q[0];
                for (var i = 0; i < arr.length; i++) {
                    arr[i] = this.xpathToXml(arr[i], model.data);
                }
            }
            else if (action == "setValueByXpath") {}

            // pass the action to the actiontracker to execute it
            model.$at.execute({
                action   : action,
                args     : q,
                annotator: sAnnotator,
                message  : oMessage,
                rdb      : true
            });

            this.dispatchEvent("change", {
                uri      : oMessage.uri,
                model    : model,
                xmlNode  : xmlNode,
                message  : oMessage
            });
        }
        //#ifdef __DEBUG
        else {
            oError = new Error(ppc.formatErrorString(0, this,
                "Remote Databinding Received", "Could not get XML node from \
                 model with Xpath '" + xpath + "' for URI '" + oMessage.uri + "' " + JSON.stringify(oMessage)));
        }
        //#endif

        if (l) {
            model.$at.redo(l);
            for (i = 0; i < l; ++i)
                delete aUndos[i].$dontapply;
        }

        ppc.xmldb.disableRDB = disableRDB;

        if (oError) {
            ppc.console.error(this.logprefix + oError.message)
        }
    };

    this.xmlToXpath = ppc.xmlToXpath;
    this.xpathToXml = ppc.xpathToXml;

    this.addEventListener("DOMNodeInsertedIntoDocument", function(e){
        //#ifdef __DEBUG
        this.log && this.log(this.logprefix + (this.id
            ? "Creating remote [" + this.id + "]"
            : "Creating implicitly assigned remote"));
        //#endif

        //#ifdef __WITH_OFFLINE
        if (ppc.offline && ppc.offline.enabled) {
            var _self = this;
            ppc.offline.addEventListener("afteronline", function(){
                for (var i = 0, l = _self.offlineQueue.length; i < l; i++)
                    _self.$receiveChange(_self.offlineQueue[i]);

                _self.offlineQueue.length = 0;
            });
        }
        //#endif
    });

    this.addEventListener("DOMNodeRemovedFromDocument", function(e){
        for (var i = 0, l = this.$sessions.length; i < l; ++i)
            this.endSession(this.$sessions[i].uri);
    });
}).call(ppc.remote.prototype = new ppc.AmlElement());

ppc.aml.setElement("remote", ppc.remote);

// #endif
