import { debounce } from 'throttle-debounce';
import { window } from 'global';

const $ = window.jQuery;
let instanceID = 0;

// https://gist.github.com/aaditmshah/6683499
/* eslint-disable */
function Parser(e){this.table=e}Parser.prototype.parse=function(e){for(var r=e.length,t=this.table,s=[],a=[],h=0;r>h;){var i=e[h++];switch(i){case"(":a.unshift(i);break;case")":for(;a.length;){var i=a.shift();if("("===i)break;s.push(i)}if("("!==i)throw new Error("Mismatched parentheses.");break;default:if(t.hasOwnProperty(i)){for(;a.length;){var f=a[0];if("("===f)break;var n=t[i],o=n.precedence,c=t[f].precedence;if(o>c||o===c&&"right"===n.associativity)break;s.push(a.shift())}a.unshift(i)}else s.push(i)}}for(;a.length;){var i=a.shift();if("("===i)throw new Error("Mismatched parentheses.");s.push(i)}return s};
/* eslint-enable */

const sortRelational = {
    precedence: 3,
    associativity: 'left',
};
const sortEquality = {
    precedence: 2,
    associativity: 'left',
};

// available relations
const relations = {
    '==': {
        eval(a, b) {
            return a == b; // eslint-disable-line
        },
        sort: sortEquality,
    },
    '!=': {
        eval(a, b) {
            return a != b; // eslint-disable-line
        },
        sort: sortEquality,
    },
    '===': {
        eval(a, b) {
            return a === b;
        },
        sort: sortEquality,
    },
    '!==': {
        eval(a, b) {
            return a !== b;
        },
        sort: sortEquality,
    },
    '*=': {
        eval(a, b) {
            return a.indexOf(b) !== -1;
        },
        sort: sortEquality,
    },
    '<=': {
        eval(a, b) {
            return a <= b;
        },
        sort: sortRelational,
    },
    '>=': {
        eval(a, b) {
            return a >= b;
        },
        sort: sortRelational,
    },
    '<': {
        eval(a, b) {
            return a < b;
        },
        sort: sortRelational,
    },
    '>': {
        eval(a, b) {
            return a > b;
        },
        sort: sortRelational,
    },
    '&&': {
        eval(a, b) {
            return a && b;
        },
        sort: {
            precedence: 1,
            associativity: 'right',
        },
    },
    '||': {
        eval(a, b) {
            return a || b;
        },
        sort: {
            precedence: 0,
            associativity: 'right',
        },
    },
};

// Conditionize class
class Conditionize {
    constructor(container, userOptions) {
        const self = this;

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
            onCheck: null, // function( $item, show ) {}
        };

        self.options = {
            ...self.defaults,
            ...userOptions,
        };

        self.runCheck = debounce(self.options.checkDebounce, self.runCheck);

        self.init();
    }

    init() {
        const self = this;

        // hide all controls by default
        if (self.options.customToggle) {
            self.options.customToggle.call(self, self.$container.find(self.options.selector), false);
        } else {
            self.$container.find(self.options.selector).hide();
        }

        // event listener
        self.$container.on('change.conditionize', 'input, select, textarea', () => {
            self.runCheck(self.$container.find(self.options.selector));
        });

        self.runCheck(self.$container.find(self.options.selector));

        // call onInit event
        if (self.options.onInit) {
            self.options.onInit.call(self);
        }
    }

    runCheck($items) {
        const self = this;

        $items.each(function () {
            const $this = $(this);
            const conditionString = $this.attr(self.options.conditionAttr).toString();
            const conditionResult = self.checkCondition(conditionString);

            if (self.options.customToggle) {
                self.options.customToggle.call(self, $this, conditionResult);
            } else {
                $this[conditionResult ? 'show' : 'hide']();
            }

            if (self.options.onCheck) {
                self.options.onCheck($this, conditionResult);
            }
        });
    }

    // parse condition
    checkCondition(str) {
        const self = this;
        let tokens = str.match(/[^\s]+/g);
        let token;
        const parserRelations = {};

        Object.keys(relations).forEach((k) => {
            parserRelations[k] = relations[k].sort;
        });

        const parser = new Parser(parserRelations);

        tokens = parser.parse(tokens);

        const stack = [];
        let index = 0;

        while (index < tokens.length) {
            token = tokens[index++];

            if (token in relations) {
                const b = stack.pop();
                const a = stack.pop();
                stack.push([a, token, b]);
            } else {
                stack.push(token);
            }
        }

        return self.compare(stack.length && stack[0]);
    }

    // check if is valid jquery selector
    isValidSelector(selector) {
        if (
            typeof selector !== 'string'
            || $.isNumeric(selector)
            || selector === 'false'
            || selector === 'true'
            || selector == false // eslint-disable-line
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
    condition(a, operator, b) {
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
    compare(arr) {
        const self = this;

        if (arr instanceof Array) {
            if (arr.length === 3) {
                arr[0] = self.compare(arr[0]);
                if (arr[2] instanceof Array) {
                    arr[2] = self.compare(arr[2]);
                }

                return self.condition(arr[0], arr[1], arr[2]);
            }

            return arr.length === 1 ? self.compare(arr[0]) : false;
        }

        if (self.isValidSelector(arr)) {
            const $listenTo = $(arr);
            let result = false;

            if ($listenTo.is('[type=checkbox]')) {
                result = $listenTo.is(':checked');
            } else if ($listenTo.is('[type=radio]')) {
                result = $listenTo.filter(':checked').val();
            } else if ($listenTo.is('textarea, select, input')) {
                result = $listenTo.val();
            }

            return result;
        }

        return arr;
    }

    destroy() {
        const self = this;

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
}

// global definition
const plugin = function (items) {
    // check for dom element
    // thanks: http://stackoverflow.com/questions/384286/javascript-isdom-how-do-you-check-if-a-javascript-object-is-a-dom-object
    if (typeof HTMLElement === 'object' ? items instanceof HTMLElement : items && typeof items === 'object' && items !== null && items.nodeType === 1 && typeof items.nodeName === 'string') {
        items = [items];
    }

    const options = arguments[1];
    const args = Array.prototype.slice.call(arguments, 2);
    const len = items.length;
    let k = 0;
    let ret;

    for (k; k < len; k++) {
        if (typeof options === 'object' || typeof options === 'undefined') {
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

window.Conditionize = Conditionize;

const jQueryPlugin = function () {
    const args = arguments || [];
    Array.prototype.unshift.call(args, this);
    const res = plugin.apply(window, args);
    return typeof res !== 'object' ? res : this;
};
jQueryPlugin.constructor = plugin.constructor;

// no conflict
const oldJqPlugin = $.fn.conditionize;
$.fn.conditionize = jQueryPlugin;
$.fn.conditionize.noConflict = function () {
    $.fn.conditionize = oldJqPlugin;
    return this;
};
