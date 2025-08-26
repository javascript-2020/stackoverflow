





(function () {
	'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var printableCharacters = createCommonjsModule(function (module) {

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	const ansiEscapeCode = '[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-PRZcf-nqry=><]',
	      zeroWidthCharacterExceptNewline = '\u0000-\u0008\u000B-\u0019\u001b\u009b\u00ad\u200b\u2028\u2029\ufeff\ufe00-\ufe0f',
	      zeroWidthCharacter = '\n' + zeroWidthCharacterExceptNewline,
	      zeroWidthCharactersExceptNewline = new RegExp('(?:' + ansiEscapeCode + ')|[' + zeroWidthCharacterExceptNewline + ']', 'g'),
	      zeroWidthCharacters = new RegExp('(?:' + ansiEscapeCode + ')|[' + zeroWidthCharacter + ']', 'g'),
	      partition = new RegExp('((?:' + ansiEscapeCode + ')|[\t' + zeroWidthCharacter + '])?([^\t' + zeroWidthCharacter + ']*)', 'g');

	module.exports = {

	    zeroWidthCharacters,

	    ansiEscapeCodes: new RegExp(ansiEscapeCode, 'g'),

	    strlen: s => Array.from(s.replace(zeroWidthCharacters, '')).length, // Array.from solves the emoji problem as described here: http://blog.jonnew.com/posts/poo-dot-length-equals-two

	    isBlank: s => s.replace(zeroWidthCharacters, '').replace(/\s/g, '').length === 0,

	    blank: s => Array.from(s.replace(zeroWidthCharactersExceptNewline, '')) // Array.from solves the emoji problem as described here: http://blog.jonnew.com/posts/poo-dot-length-equals-two
	    .map(x => x === '\t' || x === '\n' ? x : ' ').join(''),

	    partition(s) {
	        for (var m, spans = []; partition.lastIndex !== s.length && (m = partition.exec(s));) {
	            spans.push([m[1] || '', m[2]]);
	        }
	        partition.lastIndex = 0; // reset
	        return spans;
	    },

	    first(s, n) {

	        let result = '',
	            length = 0;

	        for (const _ref of module.exports.partition(s)) {
	            var _ref2 = _slicedToArray(_ref, 2);

	            const nonPrintable = _ref2[0];
	            const printable = _ref2[1];

	            const text = Array.from(printable).slice(0, n - length); // Array.from solves the emoji problem as described here: http://blog.jonnew.com/posts/poo-dot-length-equals-two
	            result += nonPrintable + text.join('');
	            length += text.length;
	        }

	        return result;
	    }
	};


	});
	printableCharacters.zeroWidthCharacters;
	printableCharacters.ansiEscapeCodes;
	printableCharacters.strlen;
	printableCharacters.isBlank;
	printableCharacters.blank;
	printableCharacters.partition;
	printableCharacters.first;

	const { blank } = printableCharacters;

	var string_bullet = (bullet, arg) => {

	                    const isArray = Array.isArray (arg),
	                          lines   = isArray ? arg : arg.split ('\n'),
	                          indent  = blank (bullet),
	                          result  = lines.map ((line, i) => (i === 0) ? (bullet + line) : (indent + line));
	                    
	                    return isArray ? result : result.join ('\n')
	                };

	function _objectValues(obj) {
	    var values = [];
	    var keys = Object.keys(obj);

	    for (var k = 0; k < keys.length; ++k) values.push(obj[keys[k]]);

	    return values;
	}

	function _objectEntries(obj) {
	    var entries = [];
	    var keys = Object.keys(obj);

	    for (var k = 0; k < keys.length; ++k) entries.push([keys[k], obj[keys[k]]]);

	    return entries;
	}

	const isBrowser = typeof window !== 'undefined' && window.window === window && window.navigator,
	      isURL = x => typeof URL !== 'undefined' && x instanceof URL,
	      maxOf = (arr, pick) => arr.reduce((max, s) => Math.max(max, pick ? pick(s) : s), 0),
	      isInteger = Number.isInteger || (value => typeof value === 'number' && isFinite(value) && Math.floor(value) === value),
	      isTypedArray = x => x instanceof Float32Array || x instanceof Float64Array || x instanceof Int8Array || x instanceof Uint8Array || x instanceof Uint8ClampedArray || x instanceof Int16Array || x instanceof Int32Array || x instanceof Uint32Array;

	const assignProps = (to, from) => {
	    for (const prop in from) {
	        Object.defineProperty(to, prop, Object.getOwnPropertyDescriptor(from, prop));
	    }return to;
	};

	const escapeStr = x => x.replace(/\n/g, '\\n').replace(/\'/g, "\\'").replace(/\"/g, '\\"');

	const { first, strlen } = printableCharacters; // handles ANSI codes and invisible characters

	const limit = (s, n) => s && (strlen(s) <= n ? s : first(s, n - 1) + '…');

	const configure = cfg => {

	    const stringify = x => {

	        const state = Object.assign({ parents: new Set(), siblings: new Map() }, cfg);

	        if (cfg.pretty === 'auto') {
	            const oneLine = stringify.configure({ pretty: false, siblings: new Map() })(x);
	            return oneLine.length <= cfg.maxLength ? oneLine : stringify.configure({ pretty: true, siblings: new Map() })(x);
	        }

	        var customFormat = cfg.formatter && cfg.formatter(x, stringify);

	        if (typeof customFormat === 'string') {
	            return customFormat;
	        }

	        if (typeof jQuery !== 'undefined' && x instanceof jQuery) {
	            x = x.toArray();
	        } else if (isTypedArray(x)) {
	            x = Array.from(x);
	        } else if (isURL(x)) {
	            x = x.toString();
	        }

	        if (isBrowser && x === window) {
	            return 'window';
	        } else if (!isBrowser && typeof commonjsGlobal !== 'undefined' && x === commonjsGlobal) {
	            return 'global';
	        } else if (x === null) {
	            return 'null';
	        } else if (x instanceof Date) {
	            return state.pure ? x.getTime() : "📅  " + x.toString();
	        } else if (x instanceof RegExp) {
	            return state.json ? '"' + x.toString() + '"' : x.toString();
	        } else if (state.parents.has(x)) {
	            return state.pure ? undefined : '<cyclic>';
	        } else if (!state.pure && state.siblings.has(x)) {
	            return '<ref:' + state.siblings.get(x) + '>';
	        } else if (x && typeof Symbol !== 'undefined' && (customFormat = x[Symbol.for('String.ify')]) && typeof customFormat === 'function' && typeof (customFormat = customFormat.call(x, stringify.configure(state))) === 'string') {

	            return customFormat;
	        } else if (typeof x === 'function') {
	            return cfg.pure ? x.toString() : x.name ? '<function:' + x.name + '>' : '<function>';
	        } else if (typeof x === 'string') {
	            return '"' + escapeStr(limit(x, cfg.pure ? Number.MAX_SAFE_INTEGER : cfg.maxStringLength)) + '"';
	        } else if (x instanceof Promise && !state.pure) {
	            return '<Promise>';
	        } else if (typeof x === 'object') {

	            state.parents.add(x);
	            state.siblings.set(x, state.siblings.size);

	            const result = stringify.configure(Object.assign({}, state, { pretty: state.pretty === false ? false : 'auto', depth: state.depth + 1 })).object(x);

	            state.parents.delete(x);

	            return result;
	        } else if (typeof x === 'number' && !isInteger(x) && cfg.precision > 0) {
	            return x.toFixed(cfg.precision);
	        } else {
	            return String(x);
	        }
	    };

	    /*  API  */

	    assignProps(stringify, {

	        state: cfg,

	        configure: newConfig => configure(Object.assign({}, cfg, newConfig)),

	        /*  TODO: generalize generation of these chain-style .configure helpers (maybe in a separate library, as it looks like a common pattern)    */

	        get pretty() {
	            return stringify.configure({ pretty: true });
	        },
	        get noPretty() {
	            return stringify.configure({ pretty: false });
	        },
	        get noFancy() {
	            return stringify.configure({ fancy: false });
	        },
	        get noRightAlignKeys() {
	            return stringify.configure({ rightAlignKeys: false });
	        },

	        get json() {
	            return stringify.configure({ json: true, pure: true });
	        },
	        get pure() {
	            return stringify.configure({ pure: true });
	        },

	        maxStringLength(n = Number.MAX_SAFE_INTEGER) {
	            return stringify.configure({ maxStringLength: n });
	        },
	        maxArrayLength(n = Number.MAX_SAFE_INTEGER) {
	            return stringify.configure({ maxArrayLength: n });
	        },
	        maxObjectLength(n = Number.MAX_SAFE_INTEGER) {
	            return stringify.configure({ maxObjectLength: n });
	        },
	        maxDepth(n = Number.MAX_SAFE_INTEGER) {
	            return stringify.configure({ maxDepth: n });
	        },
	        maxLength(n = Number.MAX_SAFE_INTEGER) {
	            return stringify.configure({ maxLength: n });
	        },
	        indentation(n) {
	            return stringify.configure({ indentation: n });
	        },

	        precision(p) {
	            return stringify.configure({ precision: p });
	        },
	        formatter(f) {
	            return stringify.configure({ formatter: f });
	        },

	        /*  Some undocumented internals    */

	        limit,

	        rightAlign: strings => {
	            var max = maxOf(strings, s => s.length);
	            return strings.map(s => ' '.repeat(max - s.length) + s);
	        },

	        object: x => {

	            if (x instanceof Set) {
	                x = Array.from(x.values());
	            } else if (x instanceof Map) {
	                x = Array.from(x.entries());
	            }

	            const isArray = Array.isArray(x);

	            if (isBrowser) {

	                if (x instanceof Element) {
	                    return '<' + (x.tagName.toLowerCase() + (x.id && '#' + x.id || '') + (x.className && '.' + x.className || '')) + '>';
	                } else if (x instanceof Text) {
	                    return '@' + stringify.limit(x.wholeText, 20);
	                }
	            }

	            const entries = _objectEntries(x);

	            const tooDeep = cfg.depth > cfg.maxDepth,
	                  tooBig = isArray ? entries.length > cfg.maxArrayLength : entries.length > cfg.maxObjectLength;

	            if (!cfg.pure && (tooDeep || tooBig)) {
	                return '<' + (isArray ? 'array' : 'object') + '[' + entries.length + ']>';
	            }

	            const quoteKey = cfg.json ? k => '"' + escapeStr(k) + '"' : k => /^[A-z][A-z0-9]*$/.test(k) ? k : "'" + escapeStr(k) + "'";

	            if (cfg.pretty) {

	                const values = _objectValues(x),
	                      right = cfg.rightAlignKeys && cfg.fancy,
	                      printedKeys = (right ? stringify.rightAlign : x => x)(Object.keys(x).map(k => quoteKey(k) + ': ')),
	                      printedValues = values.map(stringify),
	                      brace = isArray ? '[' : '{',
	                      endBrace = isArray ? ']' : '}';

	                if (cfg.fancy) {

	                    const leftPaddings = printedValues.map((x, i) => !right ? 0 : x[0] === '[' || x[0] === '{' ? 3 : typeof values[i] === 'string' ? 1 : 0),
	                          maxLeftPadding = maxOf(leftPaddings),
	                          items = leftPaddings.map((padding, i) => {
	                        const value = ' '.repeat(maxLeftPadding - padding) + printedValues[i];
	                        return isArray ? value : string_bullet(printedKeys[i], value);
	                    }),
	                          printed = string_bullet(brace + ' ', items.join(',\n')),
	                          lines = printed.split('\n'),
	                          lastLine = lines[lines.length - 1];

	                    return printed + (' '.repeat(maxOf(lines, l => l.length) - lastLine.length) + ' ' + endBrace);
	                } else {

	                    const indent = cfg.indentation.repeat(cfg.depth);

	                    return brace + '\n' + printedValues.map((x, i) => indent + (isArray ? x : printedKeys[i] + x)).join(',\n') + '\n' + cfg.indentation.repeat(cfg.depth - 1) + endBrace;
	                }
	            } else {

	                const items = entries.map(kv => (isArray ? '' : quoteKey(kv[0]) + ': ') + stringify(kv[1])),
	                      content = items.join(', ');

	                return isArray ? '[' + content + ']' : '{ ' + content + ' }';
	            }
	        }
	    });

	    return stringify;
	};

	var string_ify = configure({

	    depth: 0,
	    pure: false,
	    json: false,
	    //  color:           false, // not supported yet
	    maxDepth: 5,
	    maxLength: 50,
	    maxArrayLength: 60,
	    maxObjectLength: 200,
	    maxStringLength: 60,
	    precision: undefined,
	    formatter: undefined,
	    pretty: 'auto',
	    rightAlignKeys: true,
	    fancy: true,
	    indentation: '    '
	});



	// entry.js

	window.stringify = function(v){
    
        var str   = string_ify(v);
        var str   = stringify(v);
        str       = str.replace('{','{\n\n ');
        str       = str.replace(/^([^:\n]*?):/gm, '$1  :');
        str       = str.replace('}','\n\n}');
        return str;
        
  }//stringify2




})();
