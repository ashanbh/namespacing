/*********************************************************
 * The namespace.js contains
 * Definition of namespacing
 * inheritance: extends
 *
 *********************************************************/
(function () {
    /*****************
     * Definition
     *****************/
    var ROOT_NAME_SPACE = {};
    var root = this; //window or global space.
    var ROOTNSNAME;
    var assertRootName = function () {
        if (!ROOTNSNAME) {
            throw "No Root Name configured for the namespace. Try calling \namespace.init(\"MyNameSpace\");"
        }
    }


    /*************************************************************************
     * Declares a namespace, given a namespace name as an argument
     * Modelled after YUI namespace declaration
     *
     * The Convention is that Namespaces are UPPERCASE or TitleCase but not
     * lowercase.
     *
     * The format of any Javascript file(namespace) should be as shown below.
     *
     * Format 1:
     * ---------
     * This first example assumes that your code has public as well as private members.
     *
     * namespace("RNS.x.y");
     * function($){
     *    var privateVariable = ...;
     *    $.publicFunction = function(){
     *    }
     *    $.publicVariable = 12345;
     * }(RNS.x.y);
     *
     * Format 2:
     * ---------
     * If your Namespace Does not have private members,
     * (or does not include any complex interdependent expressions) just
     * declare your members in a simple way, as follows.
     *
     * RNS.namespace("SIS.x.y");
     * RNS.x.y.publicFunction = function(){
     *   .....
     * }
     *
     * @param list of namespaces to be created
     * @returns {null}
     ***************************************************************************/
    var namespace = function () {
        "use strict";
        assertRootName();
        var a = arguments;
        for (var i = 0; i < a.length; i = i + 1) {
            // console.log("RNS.namespace defining: "+a[i]);
            var d = a[i].split(".");
            var o = root[ROOTNSNAME];
            var s = (d[0] === ROOTNSNAME) ? 1 : 0;
            var n = ROOTNSNAME;
            for (var j = s; j < d.length; j = j + 1) {
                n = n + "." + d[j];
                o[d[j]] = o[d[j]] ||
                    /**
                     * This is the real definition of a namespaced object
                     */
                    (function (ns) {
                        var _parent; //parent of the name space
                        var _nsName = n; //name space name
                        ns.extend = ROOT_NAME_SPACE.extend;
                        ns.getChildren = function () {
                            return ROOT_NAME_SPACE.getChildren(ns)
                        };
                        ns.setParent = function (p) {
                            _parent = p;
                        };
                        ns.getNSName = function () {
                            return _nsName;
                        };
                        ns.toString = function () {
                            return _nsName;
                        };
                        ns.isNamespace = true;
                        /**
                         * Returns ths parent if no arguments are passed
                         * Else, returns property from parent.
                         *
                         * Some interpreters do not like "parent"
                         * @param propertyName
                         * @returns {*}
                         */
                        ns.parent = function (propertyName) {
                            if (propertyName) {
                                return _parent[propertyName];
                            }
                            return _parent;
                        };
                        return ns;
                    })({});
                o[d[j]].setParent(o);
                o = o[d[j]];
            }
        }
        return o;
    };
    ROOT_NAME_SPACE.namespace = namespace;
    //Manually declare the other functions
    ROOT_NAME_SPACE.setParent = function () {
        assertRootName();
        //This basically gets ignored
        //Parent of RNS is _ST_GLOBAL_.
    };
    ROOT_NAME_SPACE.isNamespace = true;
    ROOT_NAME_SPACE.getNSName = function () {
        assertRootName()
        return ROOTNSNAME;
    };
    ROOT_NAME_SPACE.toString = ROOT_NAME_SPACE.getNSName;
    ROOT_NAME_SPACE.parent = function (propertyName) {
        return propertyName ? root[propertyName] : root;
    };
    ROOT_NAME_SPACE.getChildren = function (me) {
        var result = [];
        me = me || this;
        for (var k in me) {
            if (me[k] && me[k].isNamespace) {
                var addChild = true;
                //add unique
                for (var rKey in result) {
                    if (result[rKey] === me[k]) addChild = false;
                }
                if (addChild) {
                    result.push(me[k]);
                }
            }
        }
        return result === [] ? undefined : result;
    };

    /*************************************************************************
     * Recursively deep copies properties from parent to child,
     * while following rules of classical inheritance
     * The "extend" function also sets up access to the parent
     * via use of
     *
     *  parent() // returns the parent object
     *  parent(propertyName) //essentially returns parent()[propertyName]
     *
     * So e.g. if the child class has a method called methodX() and the parent has the same method
     * and within methodX, you want to call the parent's function.
     *
     * ns.methodX = function( arg1, arg2) {
     *          this.base(arg1,arg2)
     * }
     *
     *  [[ NOTE ]]   if you wish to use the "base()" function,s make sure that "extend" is called
     *              AFTER the object is created.
     *  (function(ns){
     *         ns.x = function(o){
     *             this.base(o);
     *         }
     *   })("child");
     *  child.extend(parent); //Its critical that "extends" is aware of "parent.x"
     *
     *
     * @param child  The child object
     * @param parent  The parent object
     * @param override if true, forces the methods to be copied from parent to child, ignoring the rules of classical inheritance
     * @returns {*}
     *************************************************************************/
    ROOT_NAME_SPACE.extend = function (c, p, o) {
        "use strict";
        var _BASE_ = 'base';
        var override = false;
        var child;
        var parent;
        //figure out what the parent and child objects are..
        //if the child is not specified.. then child is "this"
        if (arguments.length > 2) {
            child = c;
            parent = p;
            override = ((typeof arguments[2]) === "boolean") ? o : override;
        }
        if (arguments.length == 2) {
            if ((typeof arguments[1]) === "boolean") {
                child = this;
                parent = c;
                override = p;
            } else {
                child = c;
                parent = p;
            }
        }
        if (arguments.length == 1) {
            child = this;
            parent = c;
        }
        if (!child || !parent) {
            throw new Error("Insufficient arguments for extend");
        }
        if (!(typeof child === "object") || !(typeof parent === "object")) {
            console.warn("Both child and parent must be objects, naughty, naughty");
            return child;
        }
        if (child === parent) {
            console.warn("Child and parent are the same, naughty, naughty");
            return;
        }

        //All error conditions have been checked.
        //Now for the fun part
        var property;
        for (property in parent) {
            if (property in child) {
                if (override) {
                    // OVERRIDE IS VERY DANGEROUS
                    // It Wipes Out everything
                    // And it goes deep
                    var to = child[property];
                    var from = parent[property];
                    var temp;
                    if (Array.isArray(from)) {
                        temp = (to && Array.isArray(to)) ? to : [];
                        child[property] = e(temp, from, override);
                    } else if (typeof from === "object") {
                        temp = (to && ((typeof to) === "object")) ? to : {};
                        child[property] = e(temp, from, override);
                    } else {
                        child[property] = parent[property];
                    }
                } else {
                    //OK, so the property exists in both parent and child
                    //"override" is false..so usually the child's property will take precedence.
                    var to = child[property];
                    var from = parent[property];
                    if ((typeof to === "function") && (typeof from === "function")) {
                        if (Object.keys(ROOT_NAME_SPACE).indexOf(property) === -1) {
                            //But if the property is a function, the child needs to have a way of calling the parent
                            //we setup a closure, and a function called "base" that can be used to call the parent.
                            var assignBase = function (t, f) {
                                // if the child function calls base(), they will in essence be calling the parent's function
                                return function () {
                                    var temp = this[_BASE_] ? this[_BASE_] : undefined;
                                    this[_BASE_] = f;
                                    var result = t.apply(this, arguments);
                                    if (temp) {
                                        this[_BASE_] = temp;
                                    }
                                    return result;
                                };
                            };
                            child[property] = assignBase(to, from);
                        }
                    }
                }
            } else {
                //kill circular references
                if (!(child === parent[property]) && !(typeof parent[property] === "object" && parent[property].isNamespace)) {
                    child[property] = parent[property];
                }
            }
        }
        child.setParent(parent);
        return child;
    };
    ROOT_NAME_SPACE.API_VERSION = "v1";


    /**
     * Gibe the namespace a root name like "YUI" or "google" or "myAwesomeApp"
     * @param rootName
     */
    namespace.init = function(rootName){
        if(ROOTNSNAME ){
            if(rootName !== ROOTNSNAME){
                throw "Root Namespace is already set. You cannot change the root NameSpace from: "+ROOTNSNAME+" to: "+rootName;
            }else{
                console.warn("Root Namespace is already set to: "+ROOTNSNAME);
            }
        }
        ROOTNSNAME = rootName ||ROOTNSNAME;
        root[ROOTNSNAME] = ROOT_NAME_SPACE;
    }


    //noConflict
    ROOT_NAME_SPACE.noConflict = function () {
        assertRootName();
        var previous_RNS;
        if (root != null) {
            previous_RNS = root[ROOTNSNAME];
        }
        root[ROOTNSNAME] = previous_RNS;
        return ROOT_NAME_SPACE;
    };

    // Node.js
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = namespace;
    }
    // AMD / RequireJS
    else if (typeof define !== 'undefined' && define.amd) {
        define("namespace",[], function () {
            return namespace;
        });
    }
    //i realize this some may frown upon this. But i want a global object.
    root.namespace = namespace;
}());