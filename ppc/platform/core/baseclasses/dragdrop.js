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

ppc.__DRAGDROP__ = 1 << 5;

// #ifdef __WITH_DRAGDROP

/**
 * All elements inheriting from this {@link term.baseclass baseclass} have drag & drop 
 * features. 
 *
 * This baseclass operates on the bound data of this element. 
 * When a rendered item is dragged and dropped, the bound data is moved or 
 * copied from one element to another, or to the same element but at a different 
 * position. This is possible because the rendered item has a 
 * {@link term.smartbinding bidirectional connection} to the data. Drag & drop can 
 * be turned on with a simple boolean, or by specifying detailed rules to set 
 * which data can be dragged and dropped and where.
 *
 *
 * #### Example
 *
 * This is a simple example, enabling drag & drop for a list:
 *
 * ```xml
 *  <a:list
 *    drag     = "true"
 *    drop     = "true"
 *    dragcopy = "true" />
 * ```
 *
 *
 * #### Example
 *
 * This example shows a smartbinding that represents files and folders. It uses a
 * {@link term.datainstruction data instruction} to communicate to the webdav
 * server when an item is copied or moved.
 *
 * ```xml
 *  <a:smartbinding>
 *      <a:bindings>
 *          <a:caption match="[@filename]" />
 *          <a:each match="[file|folder]" />
 *
 *          <a:drag 
 *            match = "[person]" 
 *            copy  = "event.ctrlKey" />
 *          <a:drop
 *            match  = "[file]"
 *            target = "[folder]"
 *            action = "tree-append"
 *            copy   = "event.ctrlKey" />
 *          <a:drop
 *            match  = "[folder]"
 *            target = "[folder]"
 *            action = "insert-before"
 *            copy   = "event.ctrlKey" />
 *      </a:bindings>
 *      <a:actions>
 *          <a:move
 *              match = "[folder]"
 *              set   = "{myWebdav.move([@path], [../@path])}" />
 *          <a:copy
 *              match = "[file]"
 *              set   = "{myWebdav.copy([@path], [../@path])}" />
 *      </a:actions>
 *  </a:smartbinding>
 * ```
 *
 * #### Example 
 *
 * This example shows a small mail application. The tree element displays a root
 * node, accounts and folders in a tree. The datagrid contains the mails. This
 * rule specifies which data nodes can be dropped where. Folders can be dropped 
 * in folders and accounts. Mails can be dropped in folders.
 *
 * ```xml
 *
 *  <a:tree align="left" width="200">
 *      <a:each match="[root|account|folder|mail]">
 *          <a:caption match="[@name]" />
 *          <a:drag match  = "[folder]" />
 *          <a:drop match  = "[folder]" 
 *                  target = "[folder|account]"
 *                  action = "tree-append" />
 *          <a:drop match  = "[mail]" 
 *                  target = "[folder]"
 *                  action = "tree-append" />
 *      </a:each>
 *      <a:model>
 *          <data>
 *              <root name="Root">
 *                  <account name="Account 1">
 *                      <folder name="Folder 1"></folder>
 *                  </account>
 *              </root>
 *           </data>
 *      </a:model>
 *  </a:tree>
 *  <a:datagrid align="right">
 *      <a:each match="[mail]">
 *          <a:column 
 *            caption = "Name" 
 *            value   = "[@name]"
 *            width   = "100%" /> 
 *          <a:drag match="[mail]" />
 *      </a:each>
 *      <a:model>
 *          <data>
 *              <mail name="Mail 1"></mail>
 *          </data>
 *      </a:model>
 *  </a:datagrid>
 *```
 * 
 * @class ppc.DragDrop
 * @baseclass
 * @author      Ruben Daniels (ruben AT ajax DOT org)
 * @version     %I%, %G%
 * @since       0.5
 * @define dragdrop
 * @allowchild drop, drag
 * @define drag 
 */
/**
 * @event  dragdata  Fires before a drag & drop operation is started to determine the data that is dragged.
 * @param {Object} e The standard event object. It contains the following property:
 *   - `data` ([[XMLElement]]): The default data for the drag & drop operation
 */
/**
 * @event  dragstart Fires before a drag operation is started.
 * @cancelable Prevents the drag operation to start.
 * @param {Object} e The standard event object. It contains the following properties:
 *   - `data` ([[XMLElement]]): The data for the drag & drop operation
 *   - `selection` ([[XMLElement]]): The selection at the start of the drag operation
 *   - `indicator` ([[HTMLElement]]): The HTML element that is shown while dragging the data
 *   - `host` ([[ppc.AmlElement]]): The AML source element.
 */
/**
 * @event  dragover Fires when the users drags over this AML element.
 * @cancelable Prevents the possibility to drop.
 * @param {Object} e The standard event object. It contains the following properties:
 *   {XMLElement}  data      The data for the drag & drop operation
 *   {XMLElement}  selection The selection at the start of the drag operation
 *   {HTMLElement} indicator The HTML element that is shown while dragging the data
 *   {ppc.AmlElement}  host      the AML source element.
 */
/**
 * @event  dragout  Fires when the user moves away from this AML element.
 * @param {Object} e The standard event object. It contains the following properties:
 *   {XMLElement}  data      the data for the drag & drop operation
 *   {XMLElement}  selection the selection at the start of the drag operation
 *   {HTMLElement} indicator the HTML element that is shown while dragging the data
 *   {ppc.AmlElement}  host      the aml source element.
 */
/**
 * @event  dragdrop  Fires when the user drops an item on this aml element.
 * @cancelable Prevents the possibility to drop.
 * @param {Object} e The standard event object. It contains the following properties:
 *   {XMLElement}  data      The data for the drag & drop operation
 *   {XMLElement}  selection The selection at the start of the drag operation
 *   {HTMLElement} indicator The html element that is shown while dragging the data
 *   {ppc.AmlElement}  host      The AML source element.
 *   {Boolean}     candrop   Specifies whether the data can be inserted at the point hovered over by the user
 *
 *
 */
/**
 * @attribute {String} match           An XPath statement querying the
 *                                     {@link term.datanode data node} that is
 *                                     dragged. If the query matches a node it
 *                                     is allowed to be dropped. The XPath is
 *                                     automatically prefixed by `'self::'`.
 */
/**
 * @attribute {String} copy            A JavaScript expression that determines
 *                                     whether the dragged element is a copy or
 *                                     a move. Use event.ctrlKey to use the Ctrl
 *                                     key to determine whether the element is copied.
 *
 */
/**
 * @attribute {String} match           An XPath statement querying the
 *                                     {@link term.datanode data node} that is
 *                                     dragged. If the query matches a node it
 *                                     is allowed to be dropped. The XPath is
 *                                     automatically prefixed by `'self::'`.
 */
/**
 * @attribute {String} target          An XPath statement determining the new
 *                                     parent of the dropped {@link term.datanode data node}.
 *                                     The XPath is automatically prefixed by `'self::'`.
 */
/**
 * @attribute {String} action          The action to perform when the
 *                                     {@link term.datanode data node} is inserted.
 *   The possible values include:
 *
 *   - `tree-append`:    Appends the {@link term.datanode data node} to the element its dropped on.
 *   - `list-append`:    Appends the {@link term.datanode data node} to the root element of this element.
 *   - `insert-before`:  Inserts the {@link term.datanode data node} before the elements its dropped on.
 */
/**
 * @attribute {String} copy            A JavaScript expression that determines
 *                                     whether the drop is a copy or a move.
 *                                     Use event.ctrlKey to use the [[keys: Ctrl]] key to
 *                                     determine whether the element is copied.
 */
ppc.DragDrop = function(){
    this.$regbase = this.$regbase | ppc.__DRAGDROP__;

    this.$dragInited = false;

    /* **********************
            Actions
    ***********************/

    /**
     * Copies a {@link term.datanode data node} to the bound data of this element.
     *
     * @action
     * @param  {XMLElement} xmlNode      The {@link term.datanode data node} which is copied.
     * @param  {XMLElement} [pNode]        The new parent element of the copied
     *                                   {@link term.datanode data node}. If none is
     *                                   specified the root element of the data
     *                                   loaded in this element is used.
     * @param  {XMLElement} [beforeNode] The position where the {@link term.datanode data node}
     *                                   is inserted.
     */
    this.copy = function(nodeList, pNode, beforeNode, isMove){
        if (nodeList.nodeType)
            nodeList = [nodeList];
        
        var exec,
            changes = [],
            i       = 0,
            l       = nodeList.length;
        for (; i < l; i++) {
            changes.push({
                action : isMove ? "moveNode" : "appendChild",
                args   : [pNode, isMove
                    ? nodeList[i]
                    : nodeList[i] = nodeList[i].cloneNode(true), beforeNode]
            });
        }
        
        if (this.$actions[(isMove ? "movegroup" : "copygroup")]) {
            exec = this.$executeAction("multicall", changes, 
                (isMove ? "movegroup" : "copygroup"), nodeList[0]);
        }
        else {
            exec = this.$executeAction("multicall", changes, 
                (isMove ? "move" : "copy"), nodeList[0], null, null, 
                nodeList.length > 1 ? nodeList : null);
        }

        if (exec !== false)
            return nodeList;

        return false;
    };

    /**
     * Moves a {@link term.datanode data node} to the bound data of this element.
     *
     * @action
     * @param  {XMLElement}  xmlNode      The {@link term.datanode data node} which is copied.
     * @param  {XMLElement}  [pNode]      The new parent element of the moved
     *                                    {@link term.datanode data node}. If none
     *                                    specified the root element of the data
     *                                    loaded in this element is used.
     * @param  {XMLElement}  [beforeNode] The position where the
     *                                    {@link term.datanode data node} is inserted.
     */
    this.move = function(nodeList, pNode, beforeNode){
        return this.copy(nodeList, pNode, beforeNode, true);
    };
    
    /**
     * Determines whether the user is allowed to drag the passed 
     * {@link term.datanode data node}. 
     *
     * For instance, imagine a mail application with a root
     * node, accounts and folders in a tree, and mails in a datagrid. The rules
     * would specify you can drag & drop folders within an account, and emails between
     * folders, but not on accounts or the root.
     *
     * @param  {XMLElement} dataNode The {@link term.datanode data node} subject to the test.
     * @return {Boolean} The result of the test
     * @see ppc.DragDrop.isDragAllowed
     */
    this.isDragAllowed = function(x, data){
        //#ifdef __WITH_OFFLINE
        if (typeof ppc.offline != "undefined" && !ppc.offline.canTransact())
            return false;
        //#endif
        
        if(!this.dragroot && this.xmlRoot.firstChild == x[0])
            return false;
        
        if (this.disabled || !x || !x.length || !x[0])
            return false;

        if (this.drag || this.dragcopy) {
            if (data)
                data.merge(x);
            return true;
        }

        /*var rules = this.$bindings["drag"]
          || this.$attrBindings && this.$attrBindings["drag"];
        if (!rules || !rules.length)
            return false;*/

        var d, 
            ruleList = [],
            j        = 0,
            l        = x.length;
        for (; j < l; j++) {
            d = this.$getDataNode("drag", x[j], null, ruleList);
            if (!d) return false; //It's all or nothing
            if (data)
                data.push(d);
        }

        return ruleList.length ? ruleList : false;
    };

    /**
     * Determines whether the user is allowed to drop the passed 
     * {@link term.datanode data node}. 
     * 
     * For instance, imagine a mail application with a root
     * node, accounts and folders in a tree, and mails in a datagrid. The rules
     * would specify you can drag & drop folders within an account, and emails between
     * folders, but not on accounts or the root.
     *
     * @param  {XMLElement} dataNode The {@link term.datanode data node} subject
     *                               to the test.
     * @param  {XMLElement} target   The {@link term.datanode data node} on which
     *                               the dragged data node is dropped.
     * @return {Boolean} The result of the test
     * @see ppc.DragDrop.isDragAllowed
     */
    this.isDropAllowed = function(x, target){
        //#ifdef __WITH_OFFLINE
        if(typeof ppc.offline != "undefined" && !ppc.offline.canTransact())
            return false;
        //#endif

        if (this.disabled || !x || !x.length || !target) //!x[0] ???
            return false;
            
        if (!this.dragroot == false && this.xmlRoot.firstChild == x[0])
            return false;
        
        for (var i = x.length - 1; i >= 0; i--)
            if (ppc.isChildOf(x[i], target, true))
                return false;
        
        var data, tgt, hasDropRule = this.$attrBindings && this.$attrBindings["drop"];
        if (this.drop && (!hasDropRule || hasDropRule.value == "true")) {
            this.$setDynamicProperty("drop", this.hasFeature(ppc.__MULTISELECT__)
              ? "[" + this.each + "]"
              : "[node()]"); //@todo ppc3.0 make sure each is without {}
            hasDropRule = true;
        }

        if (hasDropRule) {
            for (var j = 0, l = x.length; j < l; j++) {
                data = this.$getDataNode("drop", x[j]);
                if (!data)
                    break;
            }
            if (j == l && target && !ppc.isChildOf(data, target, true))
                return [target, null];
        }

        var rules = this.$bindings["drop"];
        if (!rules || !rules.length)
            return false;

        //@todo this can be optimized when needed
        var rule, strTgt,
            i  = 0,
            rl = rules.length;
        for (; i < rl; i++) {
            rule = this.$bindings.getRuleIndex("drop", i);

            for (var j = 0, l = x.length; j < l; j++) {
                data = rule.cvalue ? rule.cvalue(x[j]) : rule.cmatch(x[j]);
                if (!data)
                    break;
            }
            if (j != l)
                continue;
            
            strTgt = rule.target;//node.getAttribute("target");
            if (!strTgt || strTgt == ".") {
                //op = node.getAttribute("action") 
                  //|| (this.$isTreeArch ? "tree-append" : "list-append");
                tgt = target;/*(op == "list-append" || target == this.xmlRoot
                  ? this.xmlRoot
                  : null);*/
            }
            else {
                tgt = (rule.ctarget || rule.compile("target"))(target);
            }
            
            if (tgt && !ppc.isChildOf(data, tgt, true))
                return [tgt, rule];
        }

        return false;
    };

    this.$dragDrop = function(xmlReceiver, xmlNodeList, rule, defaction, isParent, srcRule, event, forceCopy){
        /*
            Possibilities:

            tree-append [default]: xmlNode.appendChild(movedNode);
            list-append          : xmlNode.parentNode.appendChild(movedNode);
            insert-before        : xmlNode.parentNode.insertBefore(movedNode, xmlNode);
        */
        var action = rule && rule.action;//node && node.getAttribute("action");

        if (action)
            action = (rule.caction || rule.compile("action"))(xmlNodeList[0]);
        else
            action = defaction;
            
        // @todo ppc3.0 action not known here yet... should be moved down?
        if (action == "tree-append" && isParent) 
            return false;

        if (!event)
            event = {};

        //copy convenience variables
        var context = {
              internal : ppc.DragServer.dragdata && ppc.DragServer.dragdata.host == this,
              ctrlKey  : event.ctrlKey,
              keyCode  : event.keyCode
          },
          //@todo ppc3.0 below should actually be compileNode with with_options
          ifcopy = rule && rule.copy;//.getAttribute("copy");

        if (typeof forceCopy == "boolean")
            ifcopy = forceCopy;
        else if (ifcopy) {
            context.event = event || {};
            ifcopy = !ppc.isFalse((rule.ccopy || rule.compile("copy"))(xmlNodeList[0], context));
        }
        else if (typeof this.dragcopy == "boolean" || typeof this.dropcopy == "boolean") { //@todo ppc3.0 boolean here?
            if (this.dropcopy) {
                ifcopy = this.dropcopy;
            }
            else if (this.dragcopy) {
                ifcopy = event.ctrlKey;
            }
            else {
                //@todo read this from src
                var copyRule = this.$attrBindings && this.$attrBindings["dragcopy"];
                if (copyRule) {
                    ifcopy = !ppc.isFalse((copyRule.cvalue2
                      || copyRule.compile("value", {
                        withopt : true
                      }))(xmlNodeList[0], context));
                }
            }
        }

        if (!ifcopy && srcRule) { //Implemented one copy is all copy
            for (var i = 0, l = srcRule.length; i < l; i++) {
                ifcopy = typeof srcRule[i] == "object" && srcRule[i].copy
                    ? !ppc.isFalse((srcRule[i].ccopy || srcRule[i].compile("copy"))(xmlNodeList[0], context))
                    : event.ctrlKey;
                if (ifcopy) break;
            }
        }

        var sNode,
            actRule     = ifcopy ? "copy" : "move",
            parentXpath = rule ? rule.getAttribute("parent") : null; //@todo ppc3.0 Should be lm syntax
        switch (action) {
            case "list-append":
                xmlReceiver = (isParent 
                  ? xmlReceiver
                  : this.getTraverseParent(xmlReceiver));
                if (parentXpath) {
                    if (xmlReceiver.selectSingleNode(parentXpath))
                        xmlReceiver = xmlReceiver.selectSingleNode(parentXpath);
                    else {
                        xmlReceiver.appendChild(xmlReceiver.ownerDocument.createElement(parentXpath));
                        xmlReceiver = xmlReceiver.selectSingleNode(parentXpath);
                    }
                }
                sNode = this[actRule](xmlNodeList, xmlReceiver);
                break;
            case "insert-before":
                sNode = isParent
                    ? this[actRule](xmlNodeList, xmlReceiver)
                    : this[actRule](xmlNodeList, xmlReceiver.parentNode, xmlReceiver);
                break;
            case "tree-append":
                if (parentXpath) {
                    if (xmlReceiver.selectSingleNode(parentXpath))
                        xmlReceiver = xmlReceiver.selectSingleNode(parentXpath);
                    else {
                        xmlReceiver.appendChild(xmlReceiver.ownerDocument.createElement(parentXpath));
                        xmlReceiver = xmlReceiver.selectSingleNode(parentXpath);
                    }
                }
                sNode = this[actRule](xmlNodeList, xmlReceiver);
                break;
        }

        if (this.selectable && sNode) {
            this.selectList(sNode);//, null, null, null, true);
            this.setCaret(sNode[0]);
            this.focus();
        }

        return sNode;
    };

    /* **********************
            Init
    ***********************/

    /*
     * Loads the dragdrop rules from the dragdrop element
     *
     * @param  {Array}      rules     The rules array created using {@link core.ppc.method.getrules}
     * @param  {XMLElement} [node] The reference to the drag & drop element
     * @see  SmartBinding
     * @private
     */
    this.enableDragDrop = function(){
        //#ifdef __DEBUG
        ppc.console.info("Initializing Drag&Drop for " + this.localName
            + "[" + (this.name || '') + "]");
        //#endif

        //Set cursors
        //SHOULD come from skin
        this.icoAllowed = "";//this.xmlDragDrop.getAttribute("allowed");
        this.icoDenied  = "";//this.xmlDragDrop.getAttribute("denied");

        //Setup External Object
        this.$ext.dragdrop = false;

        var _self = this;

        this.$ext[ppc.isIphone ? "ontouchstart" : "onmousedown"] = function(e){
            if (_self.disabled)
                return;

            e = e || window.event;
            // #ifdef __SUPPORT_IPHONE
            if (ppc.isIphone) {
                if (e.touches.length == 1) return;
                var old_e = e;
                e = e.touches[0];
                var pos = ppc.getAbsolutePosition(e.target, this);
                e.offsetX = pos[0];
                e.offsetY = pos[1];
            }
            //#endif

            var fEl,
                srcEl       = e.originalTarget || e.srcElement || e.target,
                multiselect = _self.hasFeature(ppc.__MULTISELECT__);
            if (multiselect && srcEl == _self.$container)
                return;
            _self.dragging = 0;

            try{ //Firefox can crash here because of some chrome permission issue 
                if (!ppc.isIphone && _self.allowdeselect
                  && (srcEl == this || srcEl.getAttribute(ppc.xmldb.htmlIdTag) 
                  && _self.$getLayoutNode("item", "select", this) != this))
                    return; //This broke making a selection with the mouse in rename:  _self.clearSelection(); //@todo hacky - should detect what element has the select from the skin
            }catch(e) {return;}

            //MultiSelect must have carret behaviour AND deselect at clicking white
            if (_self.$findValueNode)
                fEl = _self.$findValueNode(srcEl);
            var el = (fEl
                ? ppc.xmldb.getNode(fEl)
                : ppc.xmldb.findXmlNode(srcEl));
            if (multiselect && (!_self.selected || !el || el == _self.xmlRoot))
                return;

            if (_self.isDragAllowed(multiselect ? _self.$getSelection() : el)) {
                // #ifdef __SUPPORT_IPHONE
                if (ppc.isIphone)
                    old_e.preventDefault();
                //#endif

                ppc.DragServer.start(_self, srcEl, e);
            }

            //e.cancelBubble = true;
        };

        this.$ext[ppc.isIphone ? "ontouchmove" : "onmousemove"] = function(e){
            if (this.host.dragging != 1 || _self.disabled) return;
        };

        // #ifdef __SUPPORT_IPHONE
        if (ppc.isIphone) {
            this.$ext.ontouchend = this.$ext.ontouchcancel = function(){
                if (_self.disabled)
                    return;
                
                this.host.dragging = 0;
            };
        }
        else 
        //#endif
        {
            this.$ext.onmouseup = function(){
                if (_self.disabled)
                    return;
                    
                this.host.dragging = 0;
            };

            this.$ext.ondragcopy  =
            this.$ext.ondragstart = function(){return false;};
        }

        if (document.elementFromPointAdd)
            document.elementFromPointAdd(this.$ext);

        if (this.$initDragDrop && !this.$dragInited) {
            this.$initDragDrop();
            this.$dragInited = 2;
        }
        else {
            this.$dragInited = true;
        }
    };
    
    function disableDragDrop(){
        this.$dragInited = false; //@todo solve oExt event conflicts
        
        // #ifdef __SUPPORT_IPHONE
        if (ppc.isIphone) {
            this.$ext.ontouchstart = this.$ext.ontouchmove
                = this.$ext.ontouchend = this.$ext.ontouchcancel = null;
        }
        else 
        //#endif
        {
            this.$ext.onmousedown = this.$ext.onmousemove
                = this.$ext.onmouseup = null;
        }

        if (document.elementFromPointRemove)
            document.elementFromPointRemove(this.$ext);
    }
    
    this.implement(
      // #ifdef __WITH_MULTISELECT
      this.hasFeature(ppc.__MULTISELECT__)
        ? ppc.MultiselectDragDrop : 
      // #endif
        ppc.StandardDragDrop);
    
    //this.$booleanProperties["drag"]     = true;
    //this.$booleanProperties["dragcopy"] = true;
    this.$supportedProperties.push("drop", "drag", "dragcopy");

    /**
     * @attribute  {Boolean}  drag   Sets or gets whether the element allows dragging of its items.
     *
     * #### Example
     *
     * ```xml
     *
     *  <a:list drag="true">
     *      <a:item>item 1</a:item>
     *      <a:item>item 2</a:item>
     *      <a:item>item 3</a:item>
     *  </a:list>
     *```
     *
     */
    /**
     * @attribute  {Boolean}  dragcopy   whether dragged items are copied.
     *
     * #### Example
     *
     * ```xml
     *  <a:list 
     *    drag    = "true" 
     *    align   = "right" 
     *    height  = "300" 
     *    caption = "[@name]" 
     *    each    = "[mail]">
     *      <a:model>
     *          <data>
     *              <mail name="Mail 1"></mail>
     *              <mail name="Mail 2"></mail>
     *              <mail name="Mail 3"></mail>
     *          </data>
     *      </a:model>
     *  </a:list>
     * ```
     *
     * #### Example
     *
     * Items are only copied when the user holds the [[keys: Ctrl]] key
     *
     * ```xml
     *  <a:list dragcopy="[ctrlKey]">
     *      <a:item>item 1</a:item>
     *      <a:item>item 2</a:item>
     *      <a:item>item 3</a:item>
     *  </a:list>
     * ```
     */
    /**
     * @attribute  {Boolean}  drop       Sets or gets whether the element allows items to be dropped.
     *
     * #### Example
     *
     *
     * ```xml
     *  <a:list drop="true">
     *      <a:item>item 1</a:item>
     *      <a:item>item 2</a:item>
     *      <a:item>item 3</a:item>
     *  </a:list>
     * ```
     * @attribute  {String}   dragdrop    Sets or gets the name of the dragdrop element for this element.
     *
     * ```xml
     *  <a:tree align="left" width="200" height="300">
     *      <a:each match="[root|account|folder|mail]">
     *          <a:caption match  = "[@name]" />
     *          <a:drag    match  = "[folder|mail]" />
     *          <a:drop    match  = "[folder]" 
     *                     target = "[folder|account]"
     *                     action = "tree-append" />
     *           <a:drop   match  = "[mail]" 
     *                     target = "[folder]"
     *                     action = "tree-append" />
     *      </a:each>
     *      <a:model>
     *          <data>
     *              <root name="Root">
     *                  <account name="Account 1">
     *                      <folder name="Folder 1">
     *                          <mail name="Mail drag drop"></mail>
     *                      </folder>
     *                  </account>
     *              </root>
     *          </data>
     *      </a:model>
     *  </a:tree>
     * 
     *  <a:list bindings="bndDragdrop" align="right">
     *      <a:model>
     *          <data>
     *              <mail name="Mail 1"></mail>
     *              <mail name="Mail 2"></mail>
     *              <mail name="Mail 3"></mail>
     *          </data>
     *      </a:model>
     *  </a:list>
     * 
     *  <a:bindings id="bndDragdrop">
     *      <a:caption match="[@name]" />
     *      <a:each match="[mail]" />
     *      <a:drag match = "[mail]" />
     *      <a:drop
     *        match = "[mail]"
     *        action = "list-append" />
     *   </a:bindings>
     * ```
     */
    this.$propHandlers["dragcopy"] =
    this.$propHandlers["dropcopy"] =
    this.$propHandlers["drag"]     =
    this.$propHandlers["drop"]     = function(value, prop){
        this[prop] = ppc.isTrue(value);

        if (this.$dragInited && prop == "drag" && value && this.$dragInited != 2) {
            this.$initDragDrop();
            this.$dragInited = 2;
            return;
        }

        if (prop == "dragcopy" || prop == "dropcopy")
            return;
        
        if (!value && !this.drag && !this.drop && !this.$bindings 
          && (this.$attrBindings && (!this.$attrBindings["drag"] || !this.$attrBindings["drop"])))
            disableDragDrop.call(this);
        else if (value && !this.$dragInited)
            this.enableDragDrop();
    };

    this.addEventListener("DOMNodeRemovedFromDocument", function(e){
        disableDragDrop.call(this);
        
        if (this.oDrag) {
            ppc.destroyHtmlNode(this.oDrag);
            this.oDrag = null;
        }
    });
};

ppc.GuiElement.propHandlers["dragcopy"] =
ppc.GuiElement.propHandlers["dropcopy"] =
ppc.GuiElement.propHandlers["drop"]     =
ppc.GuiElement.propHandlers["drag"]     = function(value, prop) {
    if (!ppc.isFalse(value)) {
        if (!this.hasFeature(ppc.__DRAGDROP__)) {
            this.implement(ppc.DragDrop);
            this.enableDragDrop();
        }
        
        this[prop] = ppc.isTrue(value);
    }
};

/*
 * Central object for dragdrop handling.
 * @private
 */
ppc.DragServer = {
    Init : function(){
        // #ifdef __SUPPORT_IPHONE
        if (ppc.isIphone) {
            this.ontouchmove = this.onmousemove;
            this.ontouchend = this.ontouchcancel = this.onmouseup;
        }
        //#endif

        ppc.addEventListener("hotkey", function(e){
            if (ppc.window.dragging && e.keyCode == 27) {
                if (document.body.lastHost && document.body.lastHost.dragOut)
                    document.body.lastHost.dragOut(ppc.dragHost);

                return ppc.DragServer.stopdrag();
            }
        });
    },

    start : function(amlNode, srcEl, e, customNode){
        if (document.elementFromPointReset)
            document.elementFromPointReset();
        
        amlNode.dragging = 1;

        var d = window.document;
        d = (!d.compatMode || d.compatMode == "CSS1Compat")
            ? d.html || d.documentElement
            : d.body

        var scrollX = (ppc.isIE ? d.scrollLeft : window.pageXOffset),
            scrollY = (ppc.isIE ? d.scrollTop  : window.pageYOffset),
            oParent = amlNode.$ext.offsetParent,
            pos
        while (oParent && oParent != d && oParent.tagName != "BODY") {
            scrollX -= oParent.scrollLeft;
            scrollY -= oParent.scrollTop;
            oParent = oParent.offsetParent;
        }

        //The coordinates need to be relative to the html element that 
        //represents the xml data node.
        if (!srcEl && customNode) {
            pos = [0, 0];
        }
        else {
            var loopEl = srcEl, lastId;
            while (loopEl && loopEl.nodeType == 1 
              && !(lastId = loopEl.getAttribute(ppc.xmldb.htmlIdTag))) {
                loopEl = loopEl.parentNode;
            }
            if (!lastId)
                return;
            pos = ppc.getAbsolutePosition(loopEl);
        }

        //Set coordinates object
        ppc.DragServer.coordinates = {
            srcElement : srcEl,
            doc        : d,
            scrollX    : scrollX,
            scrollY    : scrollY,
            offsetX    : e.clientX - pos[0],
            offsetY    : e.clientY - pos[1],
            clientX    : e.pageX ? e.pageX - window.pageXOffset : e.clientX,
            clientY    : e.pageY ? e.pageY - window.pageYOffset : e.clientY
        };
        
        //Create Drag Data Object
        var selection = customNode || amlNode.hasFeature(ppc.__MULTISELECT__) 
                ? amlNode.getSelection()
                : [amlNode.xmlRoot],
            data      = [],
            srcRules  = amlNode.isDragAllowed(selection, data);
        if (!srcRules) return;

        if (amlNode.hasEventListener("dragdata"))
            data = amlNode.dispatchEvent("dragdata", {data : data});
        
        /*for(var i = 0, l = data.length; i < l; i++) {
            data[i] = ppc.getCleanCopy(data[i]);
        }*/

        this.dragdata = {
            rules       : srcRules,
            selection   : selection,
            data        : data,
            indicator   : amlNode.$showDragIndicator(selection, this.coordinates),
            host        : amlNode
        };

        //EVENT - cancelable: ondragstart
        if (amlNode.dispatchEvent("dragstart", this.dragdata) === false)
            return false;//(this.amlNode.$tempsel ? select(this.amlNode.$tempsel) : false);
        
        amlNode.dragging = 2;

        ppc.dragMode         = true;
        document.onmousemove = this.onmousemove;
        document.onmouseup   = this.onmouseup;
    },

    stop : function(runEvent, success, e){
        if (this.last) this.dragout();
        
        this.dragdata.host.dispatchEvent("dragstop", ppc.extend(this.dragdata, {
            success: success
        }));
        
        //Reset Objects
        this.dragdata.host.dragging = 0;
        this.dragdata.host.$hideDragIndicator(success);
        
        /*if (runEvent && this.dragdata.host.$dragstop) 
            this.dragdata.host.$dragstop();*/
        
        ppc.dragMode         = false;
        document.onmousemove = 
        document.onmouseup   = null;
        
        this.dragdata = null;
    },

    dragover : function(o, el, e){
        var _self      = this,
            originalEl = el;
        
        function checkPermission(targetEl) {
            return o.isDropAllowed && o.xmlRoot
                ? o.isDropAllowed(_self.dragdata.data, targetEl)
                : ppc.isTrue(ppc.getInheritedAttribute(o, "", function(p){
                      if (p.drop) {
                          o = p;
                          if (o == ppc.DragServer.last)
                            return false;
                          return true;
                      }
                   }));
        }
        
        e = e || window.event;

        //@todo optimize by not checking the same node dragged over twice in a row
        var fEl;
        if (o.$findValueNode)
            fEl = o.$findValueNode(el);

        if (this.lastFel && this.lastFel == fEl 
          || !this.lastFel && this.last == o) //optimization
            return;

        //Check Permission
        var elSel = (fEl
                ? ppc.xmldb.getNode(fEl)
                : ppc.xmldb.findXmlNode(el)),
            candrop = checkPermission(elSel || o.xmlRoot);

        if (this.last && this.last != o)
            this.dragout(this.last, e);

        this.last = o;
        this.lastFel = fEl;

        if (!candrop) {
            if (o && o.$dragover) {
                var parentNode = (elSel || o.xmlRoot).parentNode;
                if(parentNode && (el = ppc.xmldb.findHtmlNode(parentNode, o))) {                   
                    if (o.$findValueNode)
                        fEl = o.$findValueNode(el);
                    
                    elSel = (fEl
                        ? ppc.xmldb.getNode(fEl)
                        : ppc.xmldb.findXmlNode(el));
                            
                    candrop = checkPermission(parentNode);
                    this.lastFel = el;
                    
                    
                    if(!candrop)
                        return;
                }
                else
                    return;
            }
            else
                return;
        }
        
        //EVENT - cancelable: ondragover
        if (o.dispatchEvent("dragover", this.dragdata, {
            target     : (elSel || o.xmlRoot), 
            lastEl     : o.lastel,
            originalEl : originalEl
        }) === false)
            candrop = false;

        //Set Cursor
        var srcEl = e.originalTarget || e.srcElement || e.target;
        /*srcEl.style.cursor = (candrop ? o.icoAllowed : o.icoDenied);
        if (srcEl.onmouseout != this.m_out) {
            srcEl.$onmouseout = srcEl.onmouseout;
            srcEl.onmouseout   = this.m_out;
        }
        o.$ext.style.cursor = (candrop ? o.icoAllowed : o.icoDenied);*/

        //REQUIRED INTERFACE: __dragover()
        if (o && o.$dragover)
            o.$dragover(el, this.dragdata, candrop);
    },

    dragout : function(o, e){
        //if (this.last == o) 
            //return false;

        this.lastFel = null;

        //EVENT: ondragout
        if (o) {
            this.dragdata.htmlEvent = e;
            o.dispatchEvent("dragout", this.dragdata);
        }

        //REQUIRED INTERFACE: __dragout()
        if (this.last && this.last.$dragout)
            this.last.$dragout(null, this.dragdata);

        //Reset Cursor
        //o.$ext.style.cursor = "default";
        this.last = null;
    },

    dragdrop : function(o, el, srcO, e){
        var _self = this;
        
        function checkPermission(targetEl) {
            return o.isDropAllowed && o.xmlRoot
            ? o.isDropAllowed(_self.dragdata.data, targetEl)
            : ppc.isTrue(ppc.getInheritedAttribute(o, "", function(p){
                if (p.drop) {
                    o = p;
                    return true;
                }
            }));
        }
        
        //Check Permission
        var isParent, lastTop,
            elSel   = (o.$findValueNode
              ? ppc.xmldb.getNode(o.$findValueNode(el))
              : ppc.xmldb.findXmlNode(el)),
            candrop = checkPermission(elSel || o.xmlRoot);
         
        if (this.dragdata.indicator) {
            lastTop = this.dragdata.indicator.style.top;
            this.dragdata.indicator.style.top = "10000px";
        }
         
        if (!candrop) {
            if (o && o.$dragover) {
                var parentNode = (elSel || o.xmlRoot).parentNode,
                    htmlParentNode;
                if (parentNode && (htmlParentNode = ppc.xmldb.findHtmlNode(parentNode, o))) {
                    isParent = true;
                    candrop = checkPermission(parentNode);
                    el = htmlParentNode;
                }
            }
        }

        //EVENT - cancelable: ondragdrop
        if (candrop) {
            if (o.dispatchEvent("dragdrop", ppc.extend({candrop : candrop, htmlEvent : e, top: lastTop},
              this.dragdata)) === false) {
                candrop = false;
            }
            else {
                if (!o.xmlRoot) {
                    var m = o.getModel 
                      ? o.getModel(true) 
                      :
                      //#ifdef __WITH_NAMESERVER
                      ppc.nameserver.get("model", o.model)
                      /* #else
                      {}
                      #endif */
                    if (m)
                        m.load(this.dragdata.data[0])
                    //else warn??
                    return true;
                }
                else {
                    var action = candrop[1]
                        && candrop[1].action
                        || (o.$isTreeArch ? "tree-append" : "list-append");
                    if (action == "list-append" && (!o.$isTreeArch && o == this.dragdata.host))
                        candrop = false;
                }
            }
        }
        
        if (this.dragdata.indicator)
            this.dragdata.indicator.style.top = lastTop;

        //Exit if not allowed
        if (!candrop) {
            this.dragout(o, e);
            return false;
        }

        if (o.$dragDrop) {
            //Move XML
            var rNode = o.$dragDrop(candrop[0], this.dragdata.data, candrop[1],
                action, isParent || candrop[0] == o.xmlRoot, this.dragdata.rules, e);
            this.dragdata.resultNode = rNode;
        }
        
        if (o.$dragdrop) {
            o.$dragdrop(el, ppc.extend({
                htmlEvent : e,
                xmlNode   : rNode
            }, this.dragdata), candrop);
        }

        //Reset Cursor
        //o.$ext.style.cursor = "default";
        this.last    = null;
        this.lastFel = null;
        
        return true;
    },

    /* **********************
        Mouse Movements
    ***********************/

    onmousemove : function(e){
        if (!ppc.DragServer.dragdata) return;
        e = e || window.event;
        // #ifdef __SUPPORT_IPHONE
        if (ppc.isIphone) {
            e.preventDefault();
            if (!e.touches)
                return ppc.DragServer.stop(true, null, e);
            e = e.touches[0];
        }
        //#endif
        
        var dragdata = ppc.DragServer.dragdata,
            c = {
                clientX: e.pageX ? e.pageX - window.pageXOffset : e.clientX,
                clientY: e.pageY ? e.pageY - window.pageYOffset : e.clientY
            };

        if (!dragdata.started
          && Math.abs(ppc.DragServer.coordinates.clientX - c.clientX) < 6
          && Math.abs(ppc.DragServer.coordinates.clientY - c.clientY) < 6)
            return;

        if (!dragdata.started) {
            if (dragdata.host.$dragstart)
                dragdata.host.$dragstart(null, dragdata);
            dragdata.started = true;
        }
        
        //dragdata.indicator.style.top = e.clientY+"px";
        //dragdata.indicator.style.left = e.clientX+"px";

        if (dragdata.indicator) {
            var storeIndicatorTopPos = dragdata.indicator.style.top;
            //console.log("INDICATOR BEFORE: "+dragdata.indicator.style.top+" "+dragdata.indicator.style.left);
            //get Element at x, y
            dragdata.indicator.style.display = "block";
                dragdata.indicator.style.top = "10000px";
        }
        ppc.DragServer.dragdata.x = e.pageX ? e.pageX - (!ppc.isIE
            ? window.pageXOffset
            : 0) : c.clientX;
        ppc.DragServer.dragdata.y = e.pageY ? e.pageY - (!ppc.isIE
            ? window.pageYOffset
            : 0) : c.clientY;
        var el = document.elementFromPoint(ppc.DragServer.dragdata.x,
            ppc.DragServer.dragdata.y);
            if (!el) {
                el = document.elementFromPoint(ppc.DragServer.dragdata.x,
                ppc.DragServer.dragdata.y);
            }
        
        if (dragdata.indicator)
            dragdata.indicator.style.top = storeIndicatorTopPos;
        //console.log("INDICATOR AFTER: "+dragdata.indicator.style.top+" "
        //+dragdata.indicator.style.left+" "+ppc.DragServer.dragdata.x+" "+ppc.DragServer.dragdata.y);
        //Set Indicator
        dragdata.host.$moveDragIndicator(c);

        //get element and call events
        var receiver = ppc.findHost(el);

        //Run Events
        if (receiver)
            ppc.DragServer.dragover(receiver, el, e);
        else if (ppc.DragServer.last)
            ppc.DragServer.dragout(ppc.DragServer.last, e);

        ppc.DragServer.lastTime = new Date().getTime();
    },

    onmouseup : function(e){
        e = e || window.event;
        // #ifdef __SUPPORT_IPHONE
        if (ppc.isIphone) {
            e.preventDefault();
            if (!e.changedTouches)
                return ppc.DragServer.stop(true, null, e);
            e = e.changedTouches[0];
        }
        //#endif

        var c = {
            clientX: e.pageX ? e.pageX - window.pageXOffset : e.clientX,
            clientY: e.pageY ? e.pageY - window.pageYOffset : e.clientY
        };

        if (!ppc.DragServer.dragdata.started
          && Math.abs(ppc.DragServer.coordinates.clientX - c.clientX) < 6
          && Math.abs(ppc.DragServer.coordinates.clientY - c.clientY) < 6) {
            ppc.DragServer.stop(true, null, e)
            return;
        }

        //get Element at x, y
        var indicator            = ppc.DragServer.dragdata.indicator,
            storeIndicatorTopPos = indicator.style.top;
        //ppc.console.info("INDICATOR UP BEFORE: "+indicator.style.top+" "+indicator.style.left);
        if (indicator)
            indicator.style.top = "10000px";

        ppc.DragServer.dragdata.x = e.pageX ? e.pageX - (!ppc.isIE
            ? window.pageXOffset
            : 0) : c.clientX;
        ppc.DragServer.dragdata.y = e.pageY ? e.pageY - (!ppc.isIE
            ? window.pageYOffset
            : 0) : c.clientY;

        var el = document.elementFromPoint(ppc.DragServer.dragdata.x,
            ppc.DragServer.dragdata.y);
        if (!el) {
            el = document.elementFromPoint(ppc.DragServer.dragdata.x,
            ppc.DragServer.dragdata.y);
        }

        indicator.style.top = storeIndicatorTopPos;
        //ppc.console.info("INDICATOR UP AFTER: "+indicator.style.top+" "+indicator.style.left);

        //get element and call events
        var host = ppc.findHost(el);

        //Run Events
        if (ppc.DragServer.host && host != ppc.DragServer.host)
            ppc.DragServer.dragout(ppc.DragServer.host, e);
        var success = ppc.DragServer.dragdrop(host, el, ppc.DragServer.dragdata.host, e);
        ppc.DragServer.stop(true, success, e);
    }
};

/*
 * @private
 */
ppc.MultiselectDragDrop = function() {
    // *** Drag & Drop *** //
    // #ifdef __WITH_DRAGDROP
    this.diffX        =
    this.diffY        = 0;
    this.multiple     = false;
    this.lastDragNode = null;
    this.lastel       = null;

    this.$showDragIndicator = function(sel, e){
        var srcEl = e.originalTarget || e.srcElement || e.target;
        
        this.multiple = sel.length > 1;
        
        if (this.multiple) {
            this.diffX = e.scrollX;
            this.diffY = e.scrollY;
        }
        else {
            var itemNode = ppc.xmldb.findHtmlNode(sel[0], this);
            this.diffX = -1 * (e.offsetX - parseInt(ppc.getStyleRecur(itemNode, "padding-left").replace(/px$/, "") - 10));
            this.diffY = -1 * e.offsetY;
        }
        
        var prefix = this.oDrag.className.split(" ")[0]
        //@todo the class should be removed here
        this.$setStyleClass(this.oDrag, (this.multiple
            ? prefix + "_multiple" : "") + (this["class"] ? " " + this["class"] : ""), [prefix + "_multiple"]);

        if (this.multiple) {
            document.body.appendChild(this.oDrag);
            return this.oDrag;
        }
        else if (this.localName == "datagrid") {
            if (this.lastDragNode)
                ppc.destroyHtmlNode(this.lastDragNode);

            sel = this.$selected || this.$caret;
            var oDrag = sel.cloneNode(true);
            oDrag.removeAttribute("onmousedown");oDrag.onmousedown = null;
            oDrag.removeAttribute("onmouseup");oDrag.onmouseup = null;
            oDrag.removeAttribute("onmouseout");oDrag.onmouseout = null;
            oDrag.removeAttribute("ondblclick");oDrag.ondblclick = null;
            document.body.appendChild(oDrag);
            
            oDrag.style.position = "absolute";
            oDrag.style.width    = sel.offsetWidth + "px";
            oDrag.style.display  = "none";
            oDrag.removeAttribute("id");
            
            this.$setStyleClass(oDrag, "draggrid");
            var nodes = sel.childNodes;
            var dragnodes = oDrag.childNodes;
            for (var i = nodes.length - 1; i >= 0; i--) {
                if (dragnodes[i].nodeType == 1)
                    dragnodes[i].style.width = ppc.getStyle(nodes[i], "width");
            }
            //@todo ppc3.0 remove all the event handlers of the children.
            return (this.lastDragNode = oDrag);
        }
        else {
            var sel = this.$selected || this.$caret,
                width = ppc.getStyle(this.oDrag, "width");
            
            if (!sel)
                return;
            
            if (!width || width == "auto")
                this.oDrag.style.width = (sel.offsetWidth - ppc.getWidthDiff(this.oDrag)) + "px";
            this.$updateNode(this.selected, this.oDrag);
        }
        
        ppc.window.zManager.set("drag", this.oDrag);
        
        return this.oDrag;
    };
    
    this.$hideDragIndicator = function(success){
        var oDrag = this.lastDragNode || this.oDrag, _self = this;
        if (!this.multiple && !success && oDrag.style.display == "block") {
            if (!this.$selected && !this.$caret)
                return;
            
            var pos = ppc.getAbsolutePosition(this.$selected || this.$caret);
            ppc.tween.multi(oDrag, {
                anim     : ppc.tween.easeInOutCubic,
                steps    : ppc.isIE ? 15 : 20,
                interval : 15,
                tweens   : [
                    {type: "left", from: oDrag.offsetLeft, to: (pos[0] + parseInt(ppc.getStyleRecur(this.$selected, "padding-left").replace(/px$/, "")))},
                    {type: "top",  from: oDrag.offsetTop,  to: pos[1]}
                ],
                onfinish : function(){
                    if (_self.lastDragNode) {
                        ppc.destroyHtmlNode(_self.lastDragNode);
                        _self.lastDragNode = null;
                    }
                    else {
                        _self.oDrag.style.display = "none";
                    }
                }
            });
        }
        else if (this.lastDragNode) {
            ppc.destroyHtmlNode(this.lastDragNode);
            this.lastDragNode = null;
        }
        else {
            this.oDrag.style.display = "none";
        }
    };
    
    this.$moveDragIndicator = function(e){
        var oDrag = this.lastDragNode || this.oDrag;
        oDrag.style.left = (e.clientX + this.diffX) + "px";// - this.oDrag.startX
        oDrag.style.top  = (e.clientY + this.diffY + (this.multiple ? 15 : 0)) + "px";// - this.oDrag.startY
    };
    
    this.addEventListener("$skinchange", function(){
        this.$initDragDrop();
    });
    
    this.$initDragDrop = function(){
        if (!this.$hasLayoutNode("dragindicator")) 
            return;

        this.oDrag = ppc.insertHtmlNode(
            this.$getLayoutNode("dragindicator"), document.body);

        ppc.window.zManager.set("drag", this.oDrag);
        
        this.oDrag.style.position = "absolute";
        this.oDrag.style.cursor   = "default";
        this.oDrag.style.display  = "none";
    };

    this.$findValueNode = function(el){
        if (!el) return null;

        while(el && el.nodeType == 1 
          && !el.getAttribute(ppc.xmldb.htmlIdTag)) {
            if (this.$isTreeArch && el.previousSibling 
              && el.previousSibling.nodeType == 1) //@todo hack!! ppc3.0 fix this.
                el = el.previousSibling;
            else
                el = el.parentNode;
        }

        return (el && el.nodeType == 1 && el.getAttribute(ppc.xmldb.htmlIdTag)) 
            ? el 
            : null;
    };
    

    this.$dragout  = function(el, dragdata, extra){
        if (this.lastel)
            this.$setStyleClass(this.lastel, "", ["dragDenied", "dragInsert",
                "dragAppend", "selected", "indicate"]);
        
        var sel = this.$getSelection(true);
        for (var i = 0, l = sel.length; i < l; i++) 
            this.$setStyleClass(sel[i], "selected", ["dragDenied",
                "dragInsert", "dragAppend", "indicate"]);
        
        this.$setStyleClass(this.$ext, "", [this.$baseCSSname + "Drop"]);
        
        this.lastel = null;
    };
    
    if (!this.$dragdrop)
        this.$dragdrop = this.$dragout;

    this.$dragover = function(el, dragdata, extra){
        this.$setStyleClass(this.$ext, this.$baseCSSname + "Drop");
        
        var sel = this.$getSelection(true);
        for (var i = 0, l = sel.length; i < l; i++) 
            this.$setStyleClass(sel[i], "", ["dragDenied",
                "dragInsert", "dragAppend", "selected", "indicate"]);
        
        if (this.lastel)
            this.$setStyleClass(this.lastel, "", ["dragDenied",
                "dragInsert", "dragAppend", "selected", "indicate"]);

        var action = extra[1] && extra[1].action;
        this.lastel = this.$findValueNode(el);
        if (this.$isTreeArch && action == "list-append") {
            var htmlNode = ppc.xmldb.findHtmlNode(this.getTraverseParent(ppc.xmldb.getNode(this.lastel)), this);
            
            this.lastel = htmlNode
                ? this.$getLayoutNode("item", "container", htmlNode)
                : this.$container;
            
            this.$setStyleClass(this.lastel, "dragInsert");
        }
        else {
            this.$setStyleClass(this.lastel, extra
                ? (action == "insert-before" 
                    ? "dragInsert" 
                    : "dragAppend") 
                : "dragDenied");
        }
    };
    // #endif
};

/*
 * @private
 */
ppc.StandardDragDrop = function() {
    this.$showDragIndicator = function(sel, e){
        var x = e.offsetX + 22,
            y = e.offsetY;
        
        this.oDrag.startX = x;
        this.oDrag.startY = y;
        
        
        document.body.appendChild(this.oDrag);
        //this.oDrag.getElementsByTagName("DIV")[0].innerHTML = this.selected.innerHTML;
        //this.oDrag.getElementsByTagName("IMG")[0].src = this.selected.parentNode.parentNode.childNodes[1].firstChild.src;
        var oInt = this.$getLayoutNode("main", "caption", this.oDrag);
        if (oInt.nodeType != 1) 
            oInt = oInt.parentNode;
        
        oInt.innerHTML = this.$applyBindRule("caption", this.xmlRoot) || "";
        
        return this.oDrag;
    };
    
    this.$hideDragIndicator = function(){
        this.oDrag.style.display = "none";
    };
    
    this.$moveDragIndicator = function(e){
        this.oDrag.style.left = (e.clientX - this.oDrag.startX
            + document.documentElement.scrollLeft) + "px";
        this.oDrag.style.top  = (e.clientY - this.oDrag.startY
            + document.documentElement.scrollTop) + "px";
    };
    
    //@todo falsely assuming only attributes are used for non multiselect widgets
    this.$initDragDrop = function(){
        if (!this.getAttribute("drag"))
            return;
        
        this.oDrag = document.body.appendChild(this.$ext.cloneNode(true));
        
        ppc.window.zManager.set("drag", this.oDrag);
        
        this.oDrag.style.position   = "absolute";
        this.oDrag.style.cursor     = "default";
        this.oDrag.style.filter     = "progid:DXImageTransform.Microsoft.Alpha(opacity=50)";
        this.oDrag.style.MozOpacity = 0.5;
        this.oDrag.style.opacity    = 0.5;
        this.oDrag.style.display    = "none";
    };
};

ppc.DragServer.Init();

// #endif
