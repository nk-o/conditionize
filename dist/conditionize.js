/*!
 * Name    : Conditionize - jQuery conditions for forms
 * Version : 1.0.1
 * Author  : nK <https://nkdev.info>
 * GitHub  : https://github.com/nk-o/conditionize
 */
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var win;

if (typeof window !== "undefined") {
    win = window;
} else if (typeof global !== "undefined") {
    win = global;
} else if (typeof self !== "undefined") {
    win = self;
} else {
    win = {};
}

module.exports = win;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5)))

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(2);


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _throttleDebounce = __webpack_require__(3);

var _rafl = __webpack_require__(4);

var _rafl2 = _interopRequireDefault(_rafl);

var _global = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var $ = _global.window.jQuery;
var instanceID = 0;

// https://gist.github.com/aaditmshah/6683499
/* eslint-disable */
function Parser(e) {
    this.table = e;
}Parser.prototype.parse = function (e) {
    for (var r = e.length, t = this.table, s = [], a = [], h = 0; r > h;) {
        var i = e[h++];switch (i) {case "(":
                a.unshift(i);break;case ")":
                for (; a.length;) {
                    var i = a.shift();if ("(" === i) break;s.push(i);
                }if ("(" !== i) throw new Error("Mismatched parentheses.");break;default:
                if (t.hasOwnProperty(i)) {
                    for (; a.length;) {
                        var f = a[0];if ("(" === f) break;var n = t[i],
                            o = n.precedence,
                            c = t[f].precedence;if (o > c || o === c && "right" === n.associativity) break;s.push(a.shift());
                    }a.unshift(i);
                } else s.push(i);}
    }for (; a.length;) {
        var i = a.shift();if ("(" === i) throw new Error("Mismatched parentheses.");s.push(i);
    }return s;
};
/* eslint-enable */

var sortRelational = {
    precedence: 3,
    associativity: 'left'
};
var sortEquality = {
    precedence: 2,
    associativity: 'left'
};

// available relations
var relations = {
    '==': {
        eval: function _eval(a, b) {
            return a == b; // eslint-disable-line
        },

        sort: sortEquality
    },
    '!=': {
        eval: function _eval(a, b) {
            return a != b; // eslint-disable-line
        },

        sort: sortEquality
    },
    '===': {
        eval: function _eval(a, b) {
            return a === b;
        },

        sort: sortEquality
    },
    '!==': {
        eval: function _eval(a, b) {
            return a !== b;
        },

        sort: sortEquality
    },
    '*=': {
        eval: function _eval(a, b) {
            return a.indexOf(b) !== -1;
        },

        sort: sortEquality
    },
    '<=': {
        eval: function _eval(a, b) {
            return a <= b;
        },

        sort: sortRelational
    },
    '>=': {
        eval: function _eval(a, b) {
            return a >= b;
        },

        sort: sortRelational
    },
    '<': {
        eval: function _eval(a, b) {
            return a < b;
        },

        sort: sortRelational
    },
    '>': {
        eval: function _eval(a, b) {
            return a > b;
        },

        sort: sortRelational
    },
    '&&': {
        eval: function _eval(a, b) {
            return a && b;
        },

        sort: {
            precedence: 1,
            associativity: 'right'
        }
    },
    '||': {
        eval: function _eval(a, b) {
            return a || b;
        },

        sort: {
            precedence: 0,
            associativity: 'right'
        }
    }
};

// Conditionize class

var Conditionize = function () {
    function Conditionize(container, userOptions) {
        _classCallCheck(this, Conditionize);

        var self = this;

        self.instanceID = instanceID++;

        self.$container = $(container);

        self.defaults = {
            selector: '[data-cond]',
            conditionAttr: 'data-cond',
            checkDebounce: 150,

            // custom toggle function
            customToggle: null, // function( $item, show ) { $item[ show ? 'show' : 'hide' ](); }

            // events
            onInit: null, // function() {}
            onDestroy: null, // function() {}
            onCheck: null // function( $item, show ) {}
        };

        self.options = Object.assign({}, self.defaults, userOptions);

        self.runCheck = (0, _throttleDebounce.debounce)(self.options.checkDebounce, self.runCheck);

        self.init();
    }

    _createClass(Conditionize, [{
        key: 'init',
        value: function init() {
            var self = this;

            // hide all controls by default
            if (self.options.customToggle) {
                self.options.customToggle.call(self, self.$container.find(self.options.selector), false);
            } else {
                self.$container.find(self.options.selector).hide();
            }

            // event listener
            self.$container.on('change.conditionize', 'input, select, textarea', function () {
                self.runCheck(self.$container.find(self.options.selector));
            });

            self.runCheck(self.$container.find(self.options.selector));

            // call onInit event
            if (self.options.onInit) {
                self.options.onInit.call(self);
            }
        }
    }, {
        key: 'runCheck',
        value: function runCheck($items) {
            var self = this;

            (0, _rafl2.default)(function () {
                $items.each(function () {
                    var $this = $(this);
                    var conditionString = $this.attr(self.options.conditionAttr).toString();
                    var conditionResult = self.checkCondition(conditionString);

                    if (self.options.customToggle) {
                        self.options.customToggle.call(self, $this, conditionResult);
                    } else {
                        $this[conditionResult ? 'show' : 'hide']();
                    }

                    if (self.options.onCheck) {
                        self.options.onCheck($this, conditionResult);
                    }
                });
            });
        }

        // parse condition

    }, {
        key: 'checkCondition',
        value: function checkCondition(str) {
            var self = this;
            var tokens = str.match(/[^\s]+/g);
            var token = void 0;
            var parserRelations = {};

            Object.keys(relations).forEach(function (k) {
                parserRelations[k] = relations[k].sort;
            });

            var parser = new Parser(parserRelations);

            tokens = parser.parse(tokens);

            var stack = [];
            var index = 0;

            while (index < tokens.length) {
                token = tokens[index++];

                if (token in relations) {
                    var b = stack.pop();
                    var a = stack.pop();
                    stack.push([a, token, b]);
                } else {
                    stack.push(token);
                }
            }

            return self.compare(stack.length && stack[0]);
        }

        // check if is valid jquery selector

    }, {
        key: 'isValidSelector',
        value: function isValidSelector(selector) {
            if (typeof selector !== 'string' || $.isNumeric(selector) || selector === 'false' || selector === 'true' || selector == false // eslint-disable-line
            || selector == true // eslint-disable-line
            ) {
                    return false;
                }
            try {
                $(selector);
            } catch (error) {
                return false;
            }
            return true;
        }

        // eval

    }, {
        key: 'condition',
        value: function condition(a, operator, b) {
            if (operator in relations) {
                if (a === 'false') {
                    a = false;
                } else if (a === 'true') {
                    a = true;
                }

                if (b === 'false') {
                    b = false;
                } else if (b === 'true') {
                    b = true;
                }

                return relations[operator].eval(a, b);
            }
            return false;
        }

        // compare items

    }, {
        key: 'compare',
        value: function compare(arr) {
            var self = this;

            if (arr instanceof Array) {
                if (arr.length === 3) {
                    arr[0] = self.compare(arr[0]);
                    if (arr[2] instanceof Array) {
                        arr[2] = self.compare(arr[2]);
                    }

                    return self.condition(arr[0], arr[1], arr[2]);
                } else if (arr.length === 1) {
                    return self.compare(arr[0]);
                }
                return false;
            } else if (self.isValidSelector(arr)) {
                var $listenTo = $(arr);
                var result = false;

                if ($listenTo.is('[type=radio], [type=checkbox]')) {
                    result = $listenTo.is(':checked');
                } else if ($listenTo.is('textarea, select, input')) {
                    result = $listenTo.val();
                }

                return result;
            }
            return arr;
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            var self = this;

            // call onDestroy event
            if (self.options.onDestroy) {
                self.options.onDestroy.call(self);
            }

            // disable event.
            self.$container.off('change.conditionize');

            // show all controls
            if (self.options.customToggle) {
                self.options.customToggle.call(self, self.$container.find(self.options.selector), true);
            } else {
                self.$container.find(self.options.selector).show();
            }

            // delete Conditionize instance from container
            delete self.$container.Conditionize;
        }
    }]);

    return Conditionize;
}();

// global definition


var plugin = function plugin(items) {
    // check for dom element
    // thanks: http://stackoverflow.com/questions/384286/javascript-isdom-how-do-you-check-if-a-javascript-object-is-a-dom-object
    if ((typeof HTMLElement === 'undefined' ? 'undefined' : _typeof(HTMLElement)) === 'object' ? items instanceof HTMLElement : items && (typeof items === 'undefined' ? 'undefined' : _typeof(items)) === 'object' && items !== null && items.nodeType === 1 && typeof items.nodeName === 'string') {
        items = [items];
    }

    var options = arguments[1];
    var args = Array.prototype.slice.call(arguments, 2);
    var len = items.length;
    var k = 0;
    var ret = void 0;

    for (k; k < len; k++) {
        if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object' || typeof options === 'undefined') {
            if (!items[k].Conditionize) {
                // eslint-disable-next-line new-cap
                items[k].Conditionize = new Conditionize(items[k], options);
            }
        } else if (items[k].Conditionize) {
            // eslint-disable-next-line prefer-spread
            ret = items[k].Conditionize[options].apply(items[k].Conditionize, args);
        }
        if (typeof ret !== 'undefined') {
            return ret;
        }
    }

    return items;
};
plugin.constructor = Conditionize;

_global.window.Conditionize = Conditionize;

var jQueryPlugin = function jQueryPlugin() {
    var args = arguments || [];
    Array.prototype.unshift.call(args, this);
    var res = plugin.apply(_global.window, args);
    return (typeof res === 'undefined' ? 'undefined' : _typeof(res)) !== 'object' ? res : this;
};
jQueryPlugin.constructor = plugin.constructor;

// no conflict
var oldJqPlugin = $.fn.conditionize;
$.fn.conditionize = jQueryPlugin;
$.fn.conditionize.noConflict = function () {
    $.fn.conditionize = oldJqPlugin;
    return this;
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
/* eslint-disable no-undefined,no-param-reassign,no-shadow */

/**
 * Throttle execution of a function. Especially useful for rate limiting
 * execution of handlers on events like resize and scroll.
 *
 * @param  {Number}    delay          A zero-or-greater delay in milliseconds. For event callbacks, values around 100 or 250 (or even higher) are most useful.
 * @param  {Boolean}   [noTrailing]   Optional, defaults to false. If noTrailing is true, callback will only execute every `delay` milliseconds while the
 *                                    throttled-function is being called. If noTrailing is false or unspecified, callback will be executed one final time
 *                                    after the last throttled-function call. (After the throttled-function has not been called for `delay` milliseconds,
 *                                    the internal counter is reset)
 * @param  {Function}  callback       A function to be executed after delay milliseconds. The `this` context and all arguments are passed through, as-is,
 *                                    to `callback` when the throttled-function is executed.
 * @param  {Boolean}   [debounceMode] If `debounceMode` is true (at begin), schedule `clear` to execute after `delay` ms. If `debounceMode` is false (at end),
 *                                    schedule `callback` to execute after `delay` ms.
 *
 * @return {Function}  A new, throttled, function.
 */
function throttle(delay, noTrailing, callback, debounceMode) {

	/*
  * After wrapper has stopped being called, this timeout ensures that
  * `callback` is executed at the proper times in `throttle` and `end`
  * debounce modes.
  */
	var timeoutID;

	// Keep track of the last time `callback` was executed.
	var lastExec = 0;

	// `noTrailing` defaults to falsy.
	if (typeof noTrailing !== 'boolean') {
		debounceMode = callback;
		callback = noTrailing;
		noTrailing = undefined;
	}

	/*
  * The `wrapper` function encapsulates all of the throttling / debouncing
  * functionality and when executed will limit the rate at which `callback`
  * is executed.
  */
	function wrapper() {

		var self = this;
		var elapsed = Number(new Date()) - lastExec;
		var args = arguments;

		// Execute `callback` and update the `lastExec` timestamp.
		function exec() {
			lastExec = Number(new Date());
			callback.apply(self, args);
		}

		/*
   * If `debounceMode` is true (at begin) this is used to clear the flag
   * to allow future `callback` executions.
   */
		function clear() {
			timeoutID = undefined;
		}

		if (debounceMode && !timeoutID) {
			/*
    * Since `wrapper` is being called for the first time and
    * `debounceMode` is true (at begin), execute `callback`.
    */
			exec();
		}

		// Clear any existing timeout.
		if (timeoutID) {
			clearTimeout(timeoutID);
		}

		if (debounceMode === undefined && elapsed > delay) {
			/*
    * In throttle mode, if `delay` time has been exceeded, execute
    * `callback`.
    */
			exec();
		} else if (noTrailing !== true) {
			/*
    * In trailing throttle mode, since `delay` time has not been
    * exceeded, schedule `callback` to execute `delay` ms after most
    * recent execution.
    *
    * If `debounceMode` is true (at begin), schedule `clear` to execute
    * after `delay` ms.
    *
    * If `debounceMode` is false (at end), schedule `callback` to
    * execute after `delay` ms.
    */
			timeoutID = setTimeout(debounceMode ? clear : exec, debounceMode === undefined ? delay - elapsed : delay);
		}
	}

	// Return the wrapper function.
	return wrapper;
}

/* eslint-disable no-undefined */

/**
 * Debounce execution of a function. Debouncing, unlike throttling,
 * guarantees that a function is only executed a single time, either at the
 * very beginning of a series of calls, or at the very end.
 *
 * @param  {Number}   delay         A zero-or-greater delay in milliseconds. For event callbacks, values around 100 or 250 (or even higher) are most useful.
 * @param  {Boolean}  [atBegin]     Optional, defaults to false. If atBegin is false or unspecified, callback will only be executed `delay` milliseconds
 *                                  after the last debounced-function call. If atBegin is true, callback will be executed only at the first debounced-function call.
 *                                  (After the throttled-function has not been called for `delay` milliseconds, the internal counter is reset).
 * @param  {Function} callback      A function to be executed after delay milliseconds. The `this` context and all arguments are passed through, as-is,
 *                                  to `callback` when the debounced-function is executed.
 *
 * @return {Function} A new, debounced function.
 */
function debounce(delay, atBegin, callback) {
	return callback === undefined ? throttle(delay, atBegin, false) : throttle(delay, callback, atBegin !== false);
}

exports.throttle = throttle;
exports.debounce = debounce;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var global = __webpack_require__(0);

/**
 * `requestAnimationFrame()`
 */

var request = global.requestAnimationFrame || global.webkitRequestAnimationFrame || global.mozRequestAnimationFrame || fallback;

var prev = +new Date();
function fallback(fn) {
  var curr = +new Date();
  var ms = Math.max(0, 16 - (curr - prev));
  var req = setTimeout(fn, ms);
  return prev = curr, req;
}

/**
 * `cancelAnimationFrame()`
 */

var cancel = global.cancelAnimationFrame || global.webkitCancelAnimationFrame || global.mozCancelAnimationFrame || clearTimeout;

if (Function.prototype.bind) {
  request = request.bind(global);
  cancel = cancel.bind(global);
}

exports = module.exports = request;
exports.cancel = cancel;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var g;

// This works in non-strict mode
g = function () {
	return this;
}();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1, eval)("this");
} catch (e) {
	// This works if the window reference is available
	if ((typeof window === "undefined" ? "undefined" : _typeof(window)) === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;

/***/ })
/******/ ]);