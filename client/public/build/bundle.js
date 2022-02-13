
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function set_store_value(store, ret, value) {
        store.set(value);
        return ret;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root && root.host) {
            return root;
        }
        return node.ownerDocument;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_style(node), style_element);
        return style_element.sheet;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }
    class HtmlTag {
        constructor() {
            this.e = this.n = null;
        }
        c(html) {
            this.h(html);
        }
        m(html, target, anchor = null) {
            if (!this.e) {
                this.e = element(target.nodeName);
                this.t = target;
                this.c(html);
            }
            this.i(anchor);
        }
        h(html) {
            this.e.innerHTML = html;
            this.n = Array.from(this.e.childNodes);
        }
        i(anchor) {
            for (let i = 0; i < this.n.length; i += 1) {
                insert(this.t, this.n[i], anchor);
            }
        }
        p(html) {
            this.d();
            this.h(html);
            this.i(this.a);
        }
        d() {
            this.n.forEach(detach);
        }
    }

    // we need to store the information for multiple documents because a Svelte application could also contain iframes
    // https://github.com/sveltejs/svelte/issues/3624
    const managed_styles = new Map();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_style_information(doc, node) {
        const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
        managed_styles.set(doc, info);
        return info;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = get_root_for_style(node);
        const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
        if (!rules[name]) {
            rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            managed_styles.forEach(info => {
                const { stylesheet } = info;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                info.rules = {};
            });
            managed_styles.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function afterUpdate(fn) {
        get_current_component().$$.after_update.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function tick() {
        schedule_update();
        return resolved_promise;
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    const null_transition = { duration: 0 };
    function create_in_transition(node, fn, params) {
        let config = fn(node, params);
        let running = false;
        let animation_name;
        let task;
        let uid = 0;
        function cleanup() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
            tick(0, 1);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            if (task)
                task.abort();
            running = true;
            add_render_callback(() => dispatch(node, true, 'start'));
            task = loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(1, 0);
                        dispatch(node, true, 'end');
                        cleanup();
                        return running = false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(t, 1 - t);
                    }
                }
                return running;
            });
        }
        let started = false;
        return {
            start() {
                if (started)
                    return;
                started = true;
                delete_rule(node);
                if (is_function(config)) {
                    config = config();
                    wait().then(go);
                }
                else {
                    go();
                }
            },
            invalidate() {
                started = false;
            },
            end() {
                if (running) {
                    cleanup();
                    running = false;
                }
            }
        };
    }
    function create_bidirectional_transition(node, fn, params, intro) {
        let config = fn(node, params);
        let t = intro ? 0 : 1;
        let running_program = null;
        let pending_program = null;
        let animation_name = null;
        function clear_animation() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function init(program, duration) {
            const d = (program.b - t);
            duration *= Math.abs(d);
            return {
                a: t,
                b: program.b,
                d,
                duration,
                start: program.start,
                end: program.start + duration,
                group: program.group
            };
        }
        function go(b) {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            const program = {
                start: now() + delay,
                b
            };
            if (!b) {
                // @ts-ignore todo: improve typings
                program.group = outros;
                outros.r += 1;
            }
            if (running_program || pending_program) {
                pending_program = program;
            }
            else {
                // if this is an intro, and there's a delay, we need to do
                // an initial tick and/or apply CSS animation immediately
                if (css) {
                    clear_animation();
                    animation_name = create_rule(node, t, b, duration, delay, easing, css);
                }
                if (b)
                    tick(0, 1);
                running_program = init(program, duration);
                add_render_callback(() => dispatch(node, b, 'start'));
                loop(now => {
                    if (pending_program && now > pending_program.start) {
                        running_program = init(pending_program, duration);
                        pending_program = null;
                        dispatch(node, running_program.b, 'start');
                        if (css) {
                            clear_animation();
                            animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                        }
                    }
                    if (running_program) {
                        if (now >= running_program.end) {
                            tick(t = running_program.b, 1 - t);
                            dispatch(node, running_program.b, 'end');
                            if (!pending_program) {
                                // we're done
                                if (running_program.b) {
                                    // intro — we can tidy up immediately
                                    clear_animation();
                                }
                                else {
                                    // outro — needs to be coordinated
                                    if (!--running_program.group.r)
                                        run_all(running_program.group.c);
                                }
                            }
                            running_program = null;
                        }
                        else if (now >= running_program.start) {
                            const p = now - running_program.start;
                            t = running_program.a + running_program.d * easing(p / running_program.duration);
                            tick(t, 1 - t);
                        }
                    }
                    return !!(running_program || pending_program);
                });
            }
        }
        return {
            run(b) {
                if (is_function(config)) {
                    wait().then(() => {
                        // @ts-ignore
                        config = config();
                        go(b);
                    });
                }
                else {
                    go(b);
                }
            },
            end() {
                clear_animation();
                running_program = pending_program = null;
            }
        };
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.46.4' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /**
     * @typedef {Object} WrappedComponent Object returned by the `wrap` method
     * @property {SvelteComponent} component - Component to load (this is always asynchronous)
     * @property {RoutePrecondition[]} [conditions] - Route pre-conditions to validate
     * @property {Object} [props] - Optional dictionary of static props
     * @property {Object} [userData] - Optional user data dictionary
     * @property {bool} _sveltesparouter - Internal flag; always set to true
     */

    /**
     * @callback AsyncSvelteComponent
     * @returns {Promise<SvelteComponent>} Returns a Promise that resolves with a Svelte component
     */

    /**
     * @callback RoutePrecondition
     * @param {RouteDetail} detail - Route detail object
     * @returns {boolean|Promise<boolean>} If the callback returns a false-y value, it's interpreted as the precondition failed, so it aborts loading the component (and won't process other pre-condition callbacks)
     */

    /**
     * @typedef {Object} WrapOptions Options object for the call to `wrap`
     * @property {SvelteComponent} [component] - Svelte component to load (this is incompatible with `asyncComponent`)
     * @property {AsyncSvelteComponent} [asyncComponent] - Function that returns a Promise that fulfills with a Svelte component (e.g. `{asyncComponent: () => import('Foo.svelte')}`)
     * @property {SvelteComponent} [loadingComponent] - Svelte component to be displayed while the async route is loading (as a placeholder); when unset or false-y, no component is shown while component
     * @property {object} [loadingParams] - Optional dictionary passed to the `loadingComponent` component as params (for an exported prop called `params`)
     * @property {object} [userData] - Optional object that will be passed to events such as `routeLoading`, `routeLoaded`, `conditionsFailed`
     * @property {object} [props] - Optional key-value dictionary of static props that will be passed to the component. The props are expanded with {...props}, so the key in the dictionary becomes the name of the prop.
     * @property {RoutePrecondition[]|RoutePrecondition} [conditions] - Route pre-conditions to add, which will be executed in order
     */

    /**
     * Wraps a component to enable multiple capabilities:
     * 1. Using dynamically-imported component, with (e.g. `{asyncComponent: () => import('Foo.svelte')}`), which also allows bundlers to do code-splitting.
     * 2. Adding route pre-conditions (e.g. `{conditions: [...]}`)
     * 3. Adding static props that are passed to the component
     * 4. Adding custom userData, which is passed to route events (e.g. route loaded events) or to route pre-conditions (e.g. `{userData: {foo: 'bar}}`)
     * 
     * @param {WrapOptions} args - Arguments object
     * @returns {WrappedComponent} Wrapped component
     */
    function wrap$1(args) {
        if (!args) {
            throw Error('Parameter args is required')
        }

        // We need to have one and only one of component and asyncComponent
        // This does a "XNOR"
        if (!args.component == !args.asyncComponent) {
            throw Error('One and only one of component and asyncComponent is required')
        }

        // If the component is not async, wrap it into a function returning a Promise
        if (args.component) {
            args.asyncComponent = () => Promise.resolve(args.component);
        }

        // Parameter asyncComponent and each item of conditions must be functions
        if (typeof args.asyncComponent != 'function') {
            throw Error('Parameter asyncComponent must be a function')
        }
        if (args.conditions) {
            // Ensure it's an array
            if (!Array.isArray(args.conditions)) {
                args.conditions = [args.conditions];
            }
            for (let i = 0; i < args.conditions.length; i++) {
                if (!args.conditions[i] || typeof args.conditions[i] != 'function') {
                    throw Error('Invalid parameter conditions[' + i + ']')
                }
            }
        }

        // Check if we have a placeholder component
        if (args.loadingComponent) {
            args.asyncComponent.loading = args.loadingComponent;
            args.asyncComponent.loadingParams = args.loadingParams || undefined;
        }

        // Returns an object that contains all the functions to execute too
        // The _sveltesparouter flag is to confirm the object was created by this router
        const obj = {
            component: args.asyncComponent,
            userData: args.userData,
            conditions: (args.conditions && args.conditions.length) ? args.conditions : undefined,
            props: (args.props && Object.keys(args.props).length) ? args.props : {},
            _sveltesparouter: true
        };

        return obj
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    function parse(str, loose) {
    	if (str instanceof RegExp) return { keys:false, pattern:str };
    	var c, o, tmp, ext, keys=[], pattern='', arr = str.split('/');
    	arr[0] || arr.shift();

    	while (tmp = arr.shift()) {
    		c = tmp[0];
    		if (c === '*') {
    			keys.push('wild');
    			pattern += '/(.*)';
    		} else if (c === ':') {
    			o = tmp.indexOf('?', 1);
    			ext = tmp.indexOf('.', 1);
    			keys.push( tmp.substring(1, !!~o ? o : !!~ext ? ext : tmp.length) );
    			pattern += !!~o && !~ext ? '(?:/([^/]+?))?' : '/([^/]+?)';
    			if (!!~ext) pattern += (!!~o ? '?' : '') + '\\' + tmp.substring(ext);
    		} else {
    			pattern += '/' + tmp;
    		}
    	}

    	return {
    		keys: keys,
    		pattern: new RegExp('^' + pattern + (loose ? '(?=$|\/)' : '\/?$'), 'i')
    	};
    }

    /* node_modules/svelte-spa-router/Router.svelte generated by Svelte v3.46.4 */

    const { Error: Error_1, Object: Object_1$1, console: console_1$1 } = globals;

    // (251:0) {:else}
    function create_else_block$2(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [/*props*/ ctx[2]];
    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    		switch_instance.$on("routeEvent", /*routeEvent_handler_1*/ ctx[7]);
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*props*/ 4)
    			? get_spread_update(switch_instance_spread_levels, [get_spread_object(/*props*/ ctx[2])])
    			: {};

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					switch_instance.$on("routeEvent", /*routeEvent_handler_1*/ ctx[7]);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(251:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (244:0) {#if componentParams}
    function create_if_block$5(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [{ params: /*componentParams*/ ctx[1] }, /*props*/ ctx[2]];
    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    		switch_instance.$on("routeEvent", /*routeEvent_handler*/ ctx[6]);
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*componentParams, props*/ 6)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*componentParams*/ 2 && { params: /*componentParams*/ ctx[1] },
    					dirty & /*props*/ 4 && get_spread_object(/*props*/ ctx[2])
    				])
    			: {};

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					switch_instance.$on("routeEvent", /*routeEvent_handler*/ ctx[6]);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(244:0) {#if componentParams}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$m(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$5, create_else_block$2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*componentParams*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error_1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$m.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function wrap(component, userData, ...conditions) {
    	// Use the new wrap method and show a deprecation warning
    	// eslint-disable-next-line no-console
    	console.warn('Method `wrap` from `svelte-spa-router` is deprecated and will be removed in a future version. Please use `svelte-spa-router/wrap` instead. See http://bit.ly/svelte-spa-router-upgrading');

    	return wrap$1({ component, userData, conditions });
    }

    /**
     * @typedef {Object} Location
     * @property {string} location - Location (page/view), for example `/book`
     * @property {string} [querystring] - Querystring from the hash, as a string not parsed
     */
    /**
     * Returns the current location from the hash.
     *
     * @returns {Location} Location object
     * @private
     */
    function getLocation() {
    	const hashPosition = window.location.href.indexOf('#/');

    	let location = hashPosition > -1
    	? window.location.href.substr(hashPosition + 1)
    	: '/';

    	// Check if there's a querystring
    	const qsPosition = location.indexOf('?');

    	let querystring = '';

    	if (qsPosition > -1) {
    		querystring = location.substr(qsPosition + 1);
    		location = location.substr(0, qsPosition);
    	}

    	return { location, querystring };
    }

    const loc = readable(null, // eslint-disable-next-line prefer-arrow-callback
    function start(set) {
    	set(getLocation());

    	const update = () => {
    		set(getLocation());
    	};

    	window.addEventListener('hashchange', update, false);

    	return function stop() {
    		window.removeEventListener('hashchange', update, false);
    	};
    });

    const location = derived(loc, $loc => $loc.location);
    const querystring = derived(loc, $loc => $loc.querystring);
    const params = writable(undefined);

    async function push(location) {
    	if (!location || location.length < 1 || location.charAt(0) != '/' && location.indexOf('#/') !== 0) {
    		throw Error('Invalid parameter location');
    	}

    	// Execute this code when the current call stack is complete
    	await tick();

    	// Note: this will include scroll state in history even when restoreScrollState is false
    	history.replaceState(
    		{
    			...history.state,
    			__svelte_spa_router_scrollX: window.scrollX,
    			__svelte_spa_router_scrollY: window.scrollY
    		},
    		undefined,
    		undefined
    	);

    	window.location.hash = (location.charAt(0) == '#' ? '' : '#') + location;
    }

    async function pop() {
    	// Execute this code when the current call stack is complete
    	await tick();

    	window.history.back();
    }

    async function replace(location) {
    	if (!location || location.length < 1 || location.charAt(0) != '/' && location.indexOf('#/') !== 0) {
    		throw Error('Invalid parameter location');
    	}

    	// Execute this code when the current call stack is complete
    	await tick();

    	const dest = (location.charAt(0) == '#' ? '' : '#') + location;

    	try {
    		const newState = { ...history.state };
    		delete newState['__svelte_spa_router_scrollX'];
    		delete newState['__svelte_spa_router_scrollY'];
    		window.history.replaceState(newState, undefined, dest);
    	} catch(e) {
    		// eslint-disable-next-line no-console
    		console.warn('Caught exception while replacing the current page. If you\'re running this in the Svelte REPL, please note that the `replace` method might not work in this environment.');
    	}

    	// The method above doesn't trigger the hashchange event, so let's do that manually
    	window.dispatchEvent(new Event('hashchange'));
    }

    function link(node, opts) {
    	opts = linkOpts(opts);

    	// Only apply to <a> tags
    	if (!node || !node.tagName || node.tagName.toLowerCase() != 'a') {
    		throw Error('Action "link" can only be used with <a> tags');
    	}

    	updateLink(node, opts);

    	return {
    		update(updated) {
    			updated = linkOpts(updated);
    			updateLink(node, updated);
    		}
    	};
    }

    // Internal function used by the link function
    function updateLink(node, opts) {
    	let href = opts.href || node.getAttribute('href');

    	// Destination must start with '/' or '#/'
    	if (href && href.charAt(0) == '/') {
    		// Add # to the href attribute
    		href = '#' + href;
    	} else if (!href || href.length < 2 || href.slice(0, 2) != '#/') {
    		throw Error('Invalid value for "href" attribute: ' + href);
    	}

    	node.setAttribute('href', href);

    	node.addEventListener('click', event => {
    		// Prevent default anchor onclick behaviour
    		event.preventDefault();

    		if (!opts.disabled) {
    			scrollstateHistoryHandler(event.currentTarget.getAttribute('href'));
    		}
    	});
    }

    // Internal function that ensures the argument of the link action is always an object
    function linkOpts(val) {
    	if (val && typeof val == 'string') {
    		return { href: val };
    	} else {
    		return val || {};
    	}
    }

    /**
     * The handler attached to an anchor tag responsible for updating the
     * current history state with the current scroll state
     *
     * @param {string} href - Destination
     */
    function scrollstateHistoryHandler(href) {
    	// Setting the url (3rd arg) to href will break clicking for reasons, so don't try to do that
    	history.replaceState(
    		{
    			...history.state,
    			__svelte_spa_router_scrollX: window.scrollX,
    			__svelte_spa_router_scrollY: window.scrollY
    		},
    		undefined,
    		undefined
    	);

    	// This will force an update as desired, but this time our scroll state will be attached
    	window.location.hash = href;
    }

    function instance$m($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Router', slots, []);
    	let { routes = {} } = $$props;
    	let { prefix = '' } = $$props;
    	let { restoreScrollState = false } = $$props;

    	/**
     * Container for a route: path, component
     */
    	class RouteItem {
    		/**
     * Initializes the object and creates a regular expression from the path, using regexparam.
     *
     * @param {string} path - Path to the route (must start with '/' or '*')
     * @param {SvelteComponent|WrappedComponent} component - Svelte component for the route, optionally wrapped
     */
    		constructor(path, component) {
    			if (!component || typeof component != 'function' && (typeof component != 'object' || component._sveltesparouter !== true)) {
    				throw Error('Invalid component object');
    			}

    			// Path must be a regular or expression, or a string starting with '/' or '*'
    			if (!path || typeof path == 'string' && (path.length < 1 || path.charAt(0) != '/' && path.charAt(0) != '*') || typeof path == 'object' && !(path instanceof RegExp)) {
    				throw Error('Invalid value for "path" argument - strings must start with / or *');
    			}

    			const { pattern, keys } = parse(path);
    			this.path = path;

    			// Check if the component is wrapped and we have conditions
    			if (typeof component == 'object' && component._sveltesparouter === true) {
    				this.component = component.component;
    				this.conditions = component.conditions || [];
    				this.userData = component.userData;
    				this.props = component.props || {};
    			} else {
    				// Convert the component to a function that returns a Promise, to normalize it
    				this.component = () => Promise.resolve(component);

    				this.conditions = [];
    				this.props = {};
    			}

    			this._pattern = pattern;
    			this._keys = keys;
    		}

    		/**
     * Checks if `path` matches the current route.
     * If there's a match, will return the list of parameters from the URL (if any).
     * In case of no match, the method will return `null`.
     *
     * @param {string} path - Path to test
     * @returns {null|Object.<string, string>} List of paramters from the URL if there's a match, or `null` otherwise.
     */
    		match(path) {
    			// If there's a prefix, check if it matches the start of the path.
    			// If not, bail early, else remove it before we run the matching.
    			if (prefix) {
    				if (typeof prefix == 'string') {
    					if (path.startsWith(prefix)) {
    						path = path.substr(prefix.length) || '/';
    					} else {
    						return null;
    					}
    				} else if (prefix instanceof RegExp) {
    					const match = path.match(prefix);

    					if (match && match[0]) {
    						path = path.substr(match[0].length) || '/';
    					} else {
    						return null;
    					}
    				}
    			}

    			// Check if the pattern matches
    			const matches = this._pattern.exec(path);

    			if (matches === null) {
    				return null;
    			}

    			// If the input was a regular expression, this._keys would be false, so return matches as is
    			if (this._keys === false) {
    				return matches;
    			}

    			const out = {};
    			let i = 0;

    			while (i < this._keys.length) {
    				// In the match parameters, URL-decode all values
    				try {
    					out[this._keys[i]] = decodeURIComponent(matches[i + 1] || '') || null;
    				} catch(e) {
    					out[this._keys[i]] = null;
    				}

    				i++;
    			}

    			return out;
    		}

    		/**
     * Dictionary with route details passed to the pre-conditions functions, as well as the `routeLoading`, `routeLoaded` and `conditionsFailed` events
     * @typedef {Object} RouteDetail
     * @property {string|RegExp} route - Route matched as defined in the route definition (could be a string or a reguar expression object)
     * @property {string} location - Location path
     * @property {string} querystring - Querystring from the hash
     * @property {object} [userData] - Custom data passed by the user
     * @property {SvelteComponent} [component] - Svelte component (only in `routeLoaded` events)
     * @property {string} [name] - Name of the Svelte component (only in `routeLoaded` events)
     */
    		/**
     * Executes all conditions (if any) to control whether the route can be shown. Conditions are executed in the order they are defined, and if a condition fails, the following ones aren't executed.
     * 
     * @param {RouteDetail} detail - Route detail
     * @returns {boolean} Returns true if all the conditions succeeded
     */
    		async checkConditions(detail) {
    			for (let i = 0; i < this.conditions.length; i++) {
    				if (!await this.conditions[i](detail)) {
    					return false;
    				}
    			}

    			return true;
    		}
    	}

    	// Set up all routes
    	const routesList = [];

    	if (routes instanceof Map) {
    		// If it's a map, iterate on it right away
    		routes.forEach((route, path) => {
    			routesList.push(new RouteItem(path, route));
    		});
    	} else {
    		// We have an object, so iterate on its own properties
    		Object.keys(routes).forEach(path => {
    			routesList.push(new RouteItem(path, routes[path]));
    		});
    	}

    	// Props for the component to render
    	let component = null;

    	let componentParams = null;
    	let props = {};

    	// Event dispatcher from Svelte
    	const dispatch = createEventDispatcher();

    	// Just like dispatch, but executes on the next iteration of the event loop
    	async function dispatchNextTick(name, detail) {
    		// Execute this code when the current call stack is complete
    		await tick();

    		dispatch(name, detail);
    	}

    	// If this is set, then that means we have popped into this var the state of our last scroll position
    	let previousScrollState = null;

    	let popStateChanged = null;

    	if (restoreScrollState) {
    		popStateChanged = event => {
    			// If this event was from our history.replaceState, event.state will contain
    			// our scroll history. Otherwise, event.state will be null (like on forward
    			// navigation)
    			if (event.state && event.state.__svelte_spa_router_scrollY) {
    				previousScrollState = event.state;
    			} else {
    				previousScrollState = null;
    			}
    		};

    		// This is removed in the destroy() invocation below
    		window.addEventListener('popstate', popStateChanged);

    		afterUpdate(() => {
    			// If this exists, then this is a back navigation: restore the scroll position
    			if (previousScrollState) {
    				window.scrollTo(previousScrollState.__svelte_spa_router_scrollX, previousScrollState.__svelte_spa_router_scrollY);
    			} else {
    				// Otherwise this is a forward navigation: scroll to top
    				window.scrollTo(0, 0);
    			}
    		});
    	}

    	// Always have the latest value of loc
    	let lastLoc = null;

    	// Current object of the component loaded
    	let componentObj = null;

    	// Handle hash change events
    	// Listen to changes in the $loc store and update the page
    	// Do not use the $: syntax because it gets triggered by too many things
    	const unsubscribeLoc = loc.subscribe(async newLoc => {
    		lastLoc = newLoc;

    		// Find a route matching the location
    		let i = 0;

    		while (i < routesList.length) {
    			const match = routesList[i].match(newLoc.location);

    			if (!match) {
    				i++;
    				continue;
    			}

    			const detail = {
    				route: routesList[i].path,
    				location: newLoc.location,
    				querystring: newLoc.querystring,
    				userData: routesList[i].userData,
    				params: match && typeof match == 'object' && Object.keys(match).length
    				? match
    				: null
    			};

    			// Check if the route can be loaded - if all conditions succeed
    			if (!await routesList[i].checkConditions(detail)) {
    				// Don't display anything
    				$$invalidate(0, component = null);

    				componentObj = null;

    				// Trigger an event to notify the user, then exit
    				dispatchNextTick('conditionsFailed', detail);

    				return;
    			}

    			// Trigger an event to alert that we're loading the route
    			// We need to clone the object on every event invocation so we don't risk the object to be modified in the next tick
    			dispatchNextTick('routeLoading', Object.assign({}, detail));

    			// If there's a component to show while we're loading the route, display it
    			const obj = routesList[i].component;

    			// Do not replace the component if we're loading the same one as before, to avoid the route being unmounted and re-mounted
    			if (componentObj != obj) {
    				if (obj.loading) {
    					$$invalidate(0, component = obj.loading);
    					componentObj = obj;
    					$$invalidate(1, componentParams = obj.loadingParams);
    					$$invalidate(2, props = {});

    					// Trigger the routeLoaded event for the loading component
    					// Create a copy of detail so we don't modify the object for the dynamic route (and the dynamic route doesn't modify our object too)
    					dispatchNextTick('routeLoaded', Object.assign({}, detail, {
    						component,
    						name: component.name,
    						params: componentParams
    					}));
    				} else {
    					$$invalidate(0, component = null);
    					componentObj = null;
    				}

    				// Invoke the Promise
    				const loaded = await obj();

    				// Now that we're here, after the promise resolved, check if we still want this component, as the user might have navigated to another page in the meanwhile
    				if (newLoc != lastLoc) {
    					// Don't update the component, just exit
    					return;
    				}

    				// If there is a "default" property, which is used by async routes, then pick that
    				$$invalidate(0, component = loaded && loaded.default || loaded);

    				componentObj = obj;
    			}

    			// Set componentParams only if we have a match, to avoid a warning similar to `<Component> was created with unknown prop 'params'`
    			// Of course, this assumes that developers always add a "params" prop when they are expecting parameters
    			if (match && typeof match == 'object' && Object.keys(match).length) {
    				$$invalidate(1, componentParams = match);
    			} else {
    				$$invalidate(1, componentParams = null);
    			}

    			// Set static props, if any
    			$$invalidate(2, props = routesList[i].props);

    			// Dispatch the routeLoaded event then exit
    			// We need to clone the object on every event invocation so we don't risk the object to be modified in the next tick
    			dispatchNextTick('routeLoaded', Object.assign({}, detail, {
    				component,
    				name: component.name,
    				params: componentParams
    			})).then(() => {
    				params.set(componentParams);
    			});

    			return;
    		}

    		// If we're still here, there was no match, so show the empty component
    		$$invalidate(0, component = null);

    		componentObj = null;
    		params.set(undefined);
    	});

    	onDestroy(() => {
    		unsubscribeLoc();
    		popStateChanged && window.removeEventListener('popstate', popStateChanged);
    	});

    	const writable_props = ['routes', 'prefix', 'restoreScrollState'];

    	Object_1$1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<Router> was created with unknown prop '${key}'`);
    	});

    	function routeEvent_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function routeEvent_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('routes' in $$props) $$invalidate(3, routes = $$props.routes);
    		if ('prefix' in $$props) $$invalidate(4, prefix = $$props.prefix);
    		if ('restoreScrollState' in $$props) $$invalidate(5, restoreScrollState = $$props.restoreScrollState);
    	};

    	$$self.$capture_state = () => ({
    		readable,
    		writable,
    		derived,
    		tick,
    		_wrap: wrap$1,
    		wrap,
    		getLocation,
    		loc,
    		location,
    		querystring,
    		params,
    		push,
    		pop,
    		replace,
    		link,
    		updateLink,
    		linkOpts,
    		scrollstateHistoryHandler,
    		onDestroy,
    		createEventDispatcher,
    		afterUpdate,
    		parse,
    		routes,
    		prefix,
    		restoreScrollState,
    		RouteItem,
    		routesList,
    		component,
    		componentParams,
    		props,
    		dispatch,
    		dispatchNextTick,
    		previousScrollState,
    		popStateChanged,
    		lastLoc,
    		componentObj,
    		unsubscribeLoc
    	});

    	$$self.$inject_state = $$props => {
    		if ('routes' in $$props) $$invalidate(3, routes = $$props.routes);
    		if ('prefix' in $$props) $$invalidate(4, prefix = $$props.prefix);
    		if ('restoreScrollState' in $$props) $$invalidate(5, restoreScrollState = $$props.restoreScrollState);
    		if ('component' in $$props) $$invalidate(0, component = $$props.component);
    		if ('componentParams' in $$props) $$invalidate(1, componentParams = $$props.componentParams);
    		if ('props' in $$props) $$invalidate(2, props = $$props.props);
    		if ('previousScrollState' in $$props) previousScrollState = $$props.previousScrollState;
    		if ('popStateChanged' in $$props) popStateChanged = $$props.popStateChanged;
    		if ('lastLoc' in $$props) lastLoc = $$props.lastLoc;
    		if ('componentObj' in $$props) componentObj = $$props.componentObj;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*restoreScrollState*/ 32) {
    			// Update history.scrollRestoration depending on restoreScrollState
    			history.scrollRestoration = restoreScrollState ? 'manual' : 'auto';
    		}
    	};

    	return [
    		component,
    		componentParams,
    		props,
    		routes,
    		prefix,
    		restoreScrollState,
    		routeEvent_handler,
    		routeEvent_handler_1
    	];
    }

    class Router extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$m, create_fragment$m, safe_not_equal, {
    			routes: 3,
    			prefix: 4,
    			restoreScrollState: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Router",
    			options,
    			id: create_fragment$m.name
    		});
    	}

    	get routes() {
    		throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set routes(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get prefix() {
    		throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set prefix(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get restoreScrollState() {
    		throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set restoreScrollState(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/simple-svelte-autocomplete/src/SimpleAutocomplete.svelte generated by Svelte v3.46.4 */

    const { Object: Object_1, console: console_1 } = globals;
    const file$k = "node_modules/simple-svelte-autocomplete/src/SimpleAutocomplete.svelte";

    const get_no_results_slot_changes = dirty => ({
    	noResultsText: dirty[0] & /*noResultsText*/ 2048
    });

    const get_no_results_slot_context = ctx => ({ noResultsText: /*noResultsText*/ ctx[11] });

    const get_create_slot_changes = dirty => ({
    	createText: dirty[0] & /*createText*/ 8192
    });

    const get_create_slot_context = ctx => ({ createText: /*createText*/ ctx[13] });

    const get_loading_slot_changes = dirty => ({
    	loadingText: dirty[0] & /*loadingText*/ 4096
    });

    const get_loading_slot_context = ctx => ({ loadingText: /*loadingText*/ ctx[12] });

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[108] = list[i];
    	child_ctx[110] = i;
    	return child_ctx;
    }

    const get_item_slot_changes = dirty => ({
    	item: dirty[0] & /*filteredListItems*/ 134217728,
    	label: dirty[0] & /*filteredListItems*/ 134217728
    });

    const get_item_slot_context = ctx => ({
    	item: /*listItem*/ ctx[108].item,
    	label: /*listItem*/ ctx[108].highlighted
    	? /*listItem*/ ctx[108].highlighted
    	: /*listItem*/ ctx[108].label
    });

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[111] = list[i];
    	return child_ctx;
    }

    const get_tag_slot_changes = dirty => ({
    	label: dirty[0] & /*selectedItem*/ 2,
    	item: dirty[0] & /*selectedItem*/ 2
    });

    const get_tag_slot_context = ctx => ({
    	label: /*safeLabelFunction*/ ctx[34](/*tagItem*/ ctx[111]),
    	item: /*tagItem*/ ctx[111],
    	unselectItem: /*unselectItem*/ ctx[41]
    });

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[110] = list[i];
    	return child_ctx;
    }

    // (1144:39) 
    function create_if_block_11(ctx) {
    	let each_1_anchor;
    	let each_value_2 = /*selectedItem*/ ctx[1];
    	validate_each_argument(each_value_2);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*valueFunction, selectedItem*/ 18 | dirty[1] & /*safeLabelFunction*/ 8) {
    				each_value_2 = /*selectedItem*/ ctx[1];
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_2.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_11.name,
    		type: "if",
    		source: "(1144:39) ",
    		ctx
    	});

    	return block;
    }

    // (1142:4) {#if !multiple && value}
    function create_if_block_10(ctx) {
    	let option;
    	let t;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(/*text*/ ctx[3]);
    			option.__value = /*value*/ ctx[2];
    			option.value = option.__value;
    			option.selected = true;
    			attr_dev(option, "class", "svelte-lduj97");
    			add_location(option, file$k, 1142, 6, 27728);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*text*/ 8) set_data_dev(t, /*text*/ ctx[3]);

    			if (dirty[0] & /*value*/ 4) {
    				prop_dev(option, "__value", /*value*/ ctx[2]);
    				option.value = option.__value;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_10.name,
    		type: "if",
    		source: "(1142:4) {#if !multiple && value}",
    		ctx
    	});

    	return block;
    }

    // (1145:6) {#each selectedItem as i}
    function create_each_block_2(ctx) {
    	let option;
    	let t0_value = /*safeLabelFunction*/ ctx[34](/*i*/ ctx[110]) + "";
    	let t0;
    	let t1;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t0 = text(t0_value);
    			t1 = space();
    			option.__value = option_value_value = /*valueFunction*/ ctx[4](/*i*/ ctx[110], true);
    			option.value = option.__value;
    			option.selected = true;
    			attr_dev(option, "class", "svelte-lduj97");
    			add_location(option, file$k, 1145, 8, 27849);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t0);
    			append_dev(option, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*selectedItem*/ 2 && t0_value !== (t0_value = /*safeLabelFunction*/ ctx[34](/*i*/ ctx[110]) + "")) set_data_dev(t0, t0_value);

    			if (dirty[0] & /*valueFunction, selectedItem*/ 18 && option_value_value !== (option_value_value = /*valueFunction*/ ctx[4](/*i*/ ctx[110], true))) {
    				prop_dev(option, "__value", option_value_value);
    				option.value = option.__value;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(1145:6) {#each selectedItem as i}",
    		ctx
    	});

    	return block;
    }

    // (1153:4) {#if multiple && selectedItem}
    function create_if_block_9(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value_1 = /*selectedItem*/ ctx[1];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*selectedItem*/ 2 | dirty[1] & /*unselectItem, safeLabelFunction*/ 1032 | dirty[2] & /*$$scope*/ 8192) {
    				each_value_1 = /*selectedItem*/ ctx[1];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_9.name,
    		type: "if",
    		source: "(1153:4) {#if multiple && selectedItem}",
    		ctx
    	});

    	return block;
    }

    // (1159:25)            
    function fallback_block_4(ctx) {
    	let div;
    	let span0;
    	let t0_value = /*safeLabelFunction*/ ctx[34](/*tagItem*/ ctx[111]) + "";
    	let t0;
    	let t1;
    	let span1;
    	let t2;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			span0 = element("span");
    			t0 = text(t0_value);
    			t1 = space();
    			span1 = element("span");
    			t2 = space();
    			attr_dev(span0, "class", "tag svelte-lduj97");
    			add_location(span0, file$k, 1160, 12, 28273);
    			attr_dev(span1, "class", "tag is-delete svelte-lduj97");
    			add_location(span1, file$k, 1161, 12, 28339);
    			attr_dev(div, "class", "tags has-addons svelte-lduj97");
    			add_location(div, file$k, 1159, 10, 28231);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span0);
    			append_dev(span0, t0);
    			append_dev(div, t1);
    			append_dev(div, span1);
    			insert_dev(target, t2, anchor);

    			if (!mounted) {
    				dispose = listen_dev(
    					span1,
    					"click",
    					prevent_default(function () {
    						if (is_function(/*unselectItem*/ ctx[41](/*tagItem*/ ctx[111]))) /*unselectItem*/ ctx[41](/*tagItem*/ ctx[111]).apply(this, arguments);
    					}),
    					false,
    					true,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty[0] & /*selectedItem*/ 2 && t0_value !== (t0_value = /*safeLabelFunction*/ ctx[34](/*tagItem*/ ctx[111]) + "")) set_data_dev(t0, t0_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t2);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block_4.name,
    		type: "fallback",
    		source: "(1159:25)            ",
    		ctx
    	});

    	return block;
    }

    // (1154:6) {#each selectedItem as tagItem}
    function create_each_block_1(ctx) {
    	let current;
    	const tag_slot_template = /*#slots*/ ctx[76].tag;
    	const tag_slot = create_slot(tag_slot_template, ctx, /*$$scope*/ ctx[75], get_tag_slot_context);
    	const tag_slot_or_fallback = tag_slot || fallback_block_4(ctx);

    	const block = {
    		c: function create() {
    			if (tag_slot_or_fallback) tag_slot_or_fallback.c();
    		},
    		m: function mount(target, anchor) {
    			if (tag_slot_or_fallback) {
    				tag_slot_or_fallback.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (tag_slot) {
    				if (tag_slot.p && (!current || dirty[0] & /*selectedItem*/ 2 | dirty[2] & /*$$scope*/ 8192)) {
    					update_slot_base(
    						tag_slot,
    						tag_slot_template,
    						ctx,
    						/*$$scope*/ ctx[75],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[75])
    						: get_slot_changes(tag_slot_template, /*$$scope*/ ctx[75], dirty, get_tag_slot_changes),
    						get_tag_slot_context
    					);
    				}
    			} else {
    				if (tag_slot_or_fallback && tag_slot_or_fallback.p && (!current || dirty[0] & /*selectedItem*/ 2)) {
    					tag_slot_or_fallback.p(ctx, !current ? [-1, -1, -1, -1] : dirty);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tag_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tag_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (tag_slot_or_fallback) tag_slot_or_fallback.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(1154:6) {#each selectedItem as tagItem}",
    		ctx
    	});

    	return block;
    }

    // (1187:4) {#if clearable}
    function create_if_block_8(ctx) {
    	let span;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "✖";
    			attr_dev(span, "class", "autocomplete-clear-button svelte-lduj97");
    			add_location(span, file$k, 1187, 6, 29082);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);

    			if (!mounted) {
    				dispose = listen_dev(span, "click", /*clear*/ ctx[45], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_8.name,
    		type: "if",
    		source: "(1187:4) {#if clearable}",
    		ctx
    	});

    	return block;
    }

    // (1234:28) 
    function create_if_block_7(ctx) {
    	let div;
    	let current;
    	const no_results_slot_template = /*#slots*/ ctx[76]["no-results"];
    	const no_results_slot = create_slot(no_results_slot_template, ctx, /*$$scope*/ ctx[75], get_no_results_slot_context);
    	const no_results_slot_or_fallback = no_results_slot || fallback_block_3(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (no_results_slot_or_fallback) no_results_slot_or_fallback.c();
    			attr_dev(div, "class", "autocomplete-list-item-no-results svelte-lduj97");
    			add_location(div, file$k, 1234, 6, 30903);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (no_results_slot_or_fallback) {
    				no_results_slot_or_fallback.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (no_results_slot) {
    				if (no_results_slot.p && (!current || dirty[0] & /*noResultsText*/ 2048 | dirty[2] & /*$$scope*/ 8192)) {
    					update_slot_base(
    						no_results_slot,
    						no_results_slot_template,
    						ctx,
    						/*$$scope*/ ctx[75],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[75])
    						: get_slot_changes(no_results_slot_template, /*$$scope*/ ctx[75], dirty, get_no_results_slot_changes),
    						get_no_results_slot_context
    					);
    				}
    			} else {
    				if (no_results_slot_or_fallback && no_results_slot_or_fallback.p && (!current || dirty[0] & /*noResultsText*/ 2048)) {
    					no_results_slot_or_fallback.p(ctx, !current ? [-1, -1, -1, -1] : dirty);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(no_results_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(no_results_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (no_results_slot_or_fallback) no_results_slot_or_fallback.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7.name,
    		type: "if",
    		source: "(1234:28) ",
    		ctx
    	});

    	return block;
    }

    // (1230:21) 
    function create_if_block_6(ctx) {
    	let div;
    	let current;
    	let mounted;
    	let dispose;
    	const create_slot_template = /*#slots*/ ctx[76].create;
    	const create_slot_1 = create_slot(create_slot_template, ctx, /*$$scope*/ ctx[75], get_create_slot_context);
    	const create_slot_or_fallback = create_slot_1 || fallback_block_2(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (create_slot_or_fallback) create_slot_or_fallback.c();
    			attr_dev(div, "class", "autocomplete-list-item-create svelte-lduj97");
    			add_location(div, file$k, 1230, 6, 30728);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (create_slot_or_fallback) {
    				create_slot_or_fallback.m(div, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div, "click", /*selectItem*/ ctx[35], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (create_slot_1) {
    				if (create_slot_1.p && (!current || dirty[0] & /*createText*/ 8192 | dirty[2] & /*$$scope*/ 8192)) {
    					update_slot_base(
    						create_slot_1,
    						create_slot_template,
    						ctx,
    						/*$$scope*/ ctx[75],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[75])
    						: get_slot_changes(create_slot_template, /*$$scope*/ ctx[75], dirty, get_create_slot_changes),
    						get_create_slot_context
    					);
    				}
    			} else {
    				if (create_slot_or_fallback && create_slot_or_fallback.p && (!current || dirty[0] & /*createText*/ 8192)) {
    					create_slot_or_fallback.p(ctx, !current ? [-1, -1, -1, -1] : dirty);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(create_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(create_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (create_slot_or_fallback) create_slot_or_fallback.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(1230:21) ",
    		ctx
    	});

    	return block;
    }

    // (1226:37) 
    function create_if_block_5(ctx) {
    	let div;
    	let current;
    	const loading_slot_template = /*#slots*/ ctx[76].loading;
    	const loading_slot = create_slot(loading_slot_template, ctx, /*$$scope*/ ctx[75], get_loading_slot_context);
    	const loading_slot_or_fallback = loading_slot || fallback_block_1(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (loading_slot_or_fallback) loading_slot_or_fallback.c();
    			attr_dev(div, "class", "autocomplete-list-item-loading svelte-lduj97");
    			add_location(div, file$k, 1226, 6, 30578);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (loading_slot_or_fallback) {
    				loading_slot_or_fallback.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (loading_slot) {
    				if (loading_slot.p && (!current || dirty[0] & /*loadingText*/ 4096 | dirty[2] & /*$$scope*/ 8192)) {
    					update_slot_base(
    						loading_slot,
    						loading_slot_template,
    						ctx,
    						/*$$scope*/ ctx[75],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[75])
    						: get_slot_changes(loading_slot_template, /*$$scope*/ ctx[75], dirty, get_loading_slot_changes),
    						get_loading_slot_context
    					);
    				}
    			} else {
    				if (loading_slot_or_fallback && loading_slot_or_fallback.p && (!current || dirty[0] & /*loadingText*/ 4096)) {
    					loading_slot_or_fallback.p(ctx, !current ? [-1, -1, -1, -1] : dirty);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(loading_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(loading_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (loading_slot_or_fallback) loading_slot_or_fallback.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(1226:37) ",
    		ctx
    	});

    	return block;
    }

    // (1195:4) {#if filteredListItems && filteredListItems.length > 0}
    function create_if_block$4(ctx) {
    	let t;
    	let if_block_anchor;
    	let current;
    	let each_value = /*filteredListItems*/ ctx[27];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	let if_block = /*maxItemsToShowInList*/ ctx[5] > 0 && /*filteredListItems*/ ctx[27].length > /*maxItemsToShowInList*/ ctx[5] && create_if_block_1(ctx);

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, t, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*highlightIndex, filteredListItems, maxItemsToShowInList*/ 201326624 | dirty[1] & /*isConfirmed, onListItemClick*/ 32800 | dirty[2] & /*$$scope*/ 8192) {
    				each_value = /*filteredListItems*/ ctx[27];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(t.parentNode, t);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (/*maxItemsToShowInList*/ ctx[5] > 0 && /*filteredListItems*/ ctx[27].length > /*maxItemsToShowInList*/ ctx[5]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_1(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(1195:4) {#if filteredListItems && filteredListItems.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (1236:48) {noResultsText}
    function fallback_block_3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*noResultsText*/ ctx[11]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*noResultsText*/ 2048) set_data_dev(t, /*noResultsText*/ ctx[11]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block_3.name,
    		type: "fallback",
    		source: "(1236:48) {noResultsText}",
    		ctx
    	});

    	return block;
    }

    // (1232:41) {createText}
    function fallback_block_2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*createText*/ ctx[13]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*createText*/ 8192) set_data_dev(t, /*createText*/ ctx[13]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block_2.name,
    		type: "fallback",
    		source: "(1232:41) {createText}",
    		ctx
    	});

    	return block;
    }

    // (1228:43) {loadingText}
    function fallback_block_1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*loadingText*/ ctx[12]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*loadingText*/ 4096) set_data_dev(t, /*loadingText*/ ctx[12]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block_1.name,
    		type: "fallback",
    		source: "(1228:43) {loadingText}",
    		ctx
    	});

    	return block;
    }

    // (1197:8) {#if listItem && (maxItemsToShowInList <= 0 || i < maxItemsToShowInList)}
    function create_if_block_2(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*listItem*/ ctx[108] && create_if_block_3(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*listItem*/ ctx[108]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*filteredListItems*/ 134217728) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_3(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(1197:8) {#if listItem && (maxItemsToShowInList <= 0 || i < maxItemsToShowInList)}",
    		ctx
    	});

    	return block;
    }

    // (1198:10) {#if listItem}
    function create_if_block_3(ctx) {
    	let div;
    	let div_class_value;
    	let current;
    	let mounted;
    	let dispose;
    	const item_slot_template = /*#slots*/ ctx[76].item;
    	const item_slot = create_slot(item_slot_template, ctx, /*$$scope*/ ctx[75], get_item_slot_context);
    	const item_slot_or_fallback = item_slot || fallback_block(ctx);

    	function click_handler() {
    		return /*click_handler*/ ctx[79](/*listItem*/ ctx[108]);
    	}

    	function pointerenter_handler() {
    		return /*pointerenter_handler*/ ctx[80](/*i*/ ctx[110]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (item_slot_or_fallback) item_slot_or_fallback.c();

    			attr_dev(div, "class", div_class_value = "autocomplete-list-item " + (/*i*/ ctx[110] === /*highlightIndex*/ ctx[26]
    			? 'selected'
    			: '') + " svelte-lduj97");

    			toggle_class(div, "confirmed", /*isConfirmed*/ ctx[46](/*listItem*/ ctx[108].item));
    			add_location(div, file$k, 1198, 12, 29548);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (item_slot_or_fallback) {
    				item_slot_or_fallback.m(div, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div, "click", click_handler, false, false, false),
    					listen_dev(div, "pointerenter", pointerenter_handler, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (item_slot) {
    				if (item_slot.p && (!current || dirty[0] & /*filteredListItems*/ 134217728 | dirty[2] & /*$$scope*/ 8192)) {
    					update_slot_base(
    						item_slot,
    						item_slot_template,
    						ctx,
    						/*$$scope*/ ctx[75],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[75])
    						: get_slot_changes(item_slot_template, /*$$scope*/ ctx[75], dirty, get_item_slot_changes),
    						get_item_slot_context
    					);
    				}
    			} else {
    				if (item_slot_or_fallback && item_slot_or_fallback.p && (!current || dirty[0] & /*filteredListItems*/ 134217728)) {
    					item_slot_or_fallback.p(ctx, !current ? [-1, -1, -1, -1] : dirty);
    				}
    			}

    			if (!current || dirty[0] & /*highlightIndex*/ 67108864 && div_class_value !== (div_class_value = "autocomplete-list-item " + (/*i*/ ctx[110] === /*highlightIndex*/ ctx[26]
    			? 'selected'
    			: '') + " svelte-lduj97")) {
    				attr_dev(div, "class", div_class_value);
    			}

    			if (dirty[0] & /*highlightIndex, filteredListItems*/ 201326592 | dirty[1] & /*isConfirmed*/ 32768) {
    				toggle_class(div, "confirmed", /*isConfirmed*/ ctx[46](/*listItem*/ ctx[108].item));
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(item_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(item_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (item_slot_or_fallback) item_slot_or_fallback.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(1198:10) {#if listItem}",
    		ctx
    	});

    	return block;
    }

    // (1212:16) {:else}
    function create_else_block$1(ctx) {
    	let html_tag;
    	let raw_value = /*listItem*/ ctx[108].label + "";
    	let html_anchor;

    	const block = {
    		c: function create() {
    			html_tag = new HtmlTag();
    			html_anchor = empty();
    			html_tag.a = html_anchor;
    		},
    		m: function mount(target, anchor) {
    			html_tag.m(raw_value, target, anchor);
    			insert_dev(target, html_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*filteredListItems*/ 134217728 && raw_value !== (raw_value = /*listItem*/ ctx[108].label + "")) html_tag.p(raw_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(html_anchor);
    			if (detaching) html_tag.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(1212:16) {:else}",
    		ctx
    	});

    	return block;
    }

    // (1210:16) {#if listItem.highlighted}
    function create_if_block_4(ctx) {
    	let html_tag;
    	let raw_value = /*listItem*/ ctx[108].highlighted + "";
    	let html_anchor;

    	const block = {
    		c: function create() {
    			html_tag = new HtmlTag();
    			html_anchor = empty();
    			html_tag.a = html_anchor;
    		},
    		m: function mount(target, anchor) {
    			html_tag.m(raw_value, target, anchor);
    			insert_dev(target, html_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*filteredListItems*/ 134217728 && raw_value !== (raw_value = /*listItem*/ ctx[108].highlighted + "")) html_tag.p(raw_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(html_anchor);
    			if (detaching) html_tag.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(1210:16) {#if listItem.highlighted}",
    		ctx
    	});

    	return block;
    }

    // (1209:85)                  
    function fallback_block(ctx) {
    	let if_block_anchor;

    	function select_block_type_2(ctx, dirty) {
    		if (/*listItem*/ ctx[108].highlighted) return create_if_block_4;
    		return create_else_block$1;
    	}

    	let current_block_type = select_block_type_2(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_2(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block.name,
    		type: "fallback",
    		source: "(1209:85)                  ",
    		ctx
    	});

    	return block;
    }

    // (1196:6) {#each filteredListItems as listItem, i}
    function create_each_block$2(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*listItem*/ ctx[108] && (/*maxItemsToShowInList*/ ctx[5] <= 0 || /*i*/ ctx[110] < /*maxItemsToShowInList*/ ctx[5]) && create_if_block_2(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*listItem*/ ctx[108] && (/*maxItemsToShowInList*/ ctx[5] <= 0 || /*i*/ ctx[110] < /*maxItemsToShowInList*/ ctx[5])) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*filteredListItems, maxItemsToShowInList*/ 134217760) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_2(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(1196:6) {#each filteredListItems as listItem, i}",
    		ctx
    	});

    	return block;
    }

    // (1221:6) {#if maxItemsToShowInList > 0 && filteredListItems.length > maxItemsToShowInList}
    function create_if_block_1(ctx) {
    	let div;
    	let t0;
    	let t1_value = /*filteredListItems*/ ctx[27].length - /*maxItemsToShowInList*/ ctx[5] + "";
    	let t1;
    	let t2;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text("...");
    			t1 = text(t1_value);
    			t2 = text(" results not shown");
    			attr_dev(div, "class", "autocomplete-list-item-no-results svelte-lduj97");
    			add_location(div, file$k, 1221, 8, 30378);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, t1);
    			append_dev(div, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*filteredListItems, maxItemsToShowInList*/ 134217760 && t1_value !== (t1_value = /*filteredListItems*/ ctx[27].length - /*maxItemsToShowInList*/ ctx[5] + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(1221:6) {#if maxItemsToShowInList > 0 && filteredListItems.length > maxItemsToShowInList}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$l(ctx) {
    	let div2;
    	let select;
    	let t0;
    	let div0;
    	let t1;
    	let input_1;
    	let input_1_class_value;
    	let input_1_id_value;
    	let input_1_autocomplete_value;
    	let input_1_readonly_value;
    	let t2;
    	let t3;
    	let div1;
    	let current_block_type_index;
    	let if_block3;
    	let div1_class_value;
    	let div2_class_value;
    	let current;
    	let mounted;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (!/*multiple*/ ctx[6] && /*value*/ ctx[2]) return create_if_block_10;
    		if (/*multiple*/ ctx[6] && /*selectedItem*/ ctx[1]) return create_if_block_11;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block0 = current_block_type && current_block_type(ctx);
    	let if_block1 = /*multiple*/ ctx[6] && /*selectedItem*/ ctx[1] && create_if_block_9(ctx);
    	let if_block2 = /*clearable*/ ctx[31] && create_if_block_8(ctx);
    	const if_block_creators = [create_if_block$4, create_if_block_5, create_if_block_6, create_if_block_7];
    	const if_blocks = [];

    	function select_block_type_1(ctx, dirty) {
    		if (/*filteredListItems*/ ctx[27] && /*filteredListItems*/ ctx[27].length > 0) return 0;
    		if (/*loading*/ ctx[30] && /*loadingText*/ ctx[12]) return 1;
    		if (/*create*/ ctx[7]) return 2;
    		if (/*noResultsText*/ ctx[11]) return 3;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type_1(ctx))) {
    		if_block3 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			select = element("select");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			div0 = element("div");
    			if (if_block1) if_block1.c();
    			t1 = space();
    			input_1 = element("input");
    			t2 = space();
    			if (if_block2) if_block2.c();
    			t3 = space();
    			div1 = element("div");
    			if (if_block3) if_block3.c();
    			attr_dev(select, "name", /*selectName*/ ctx[19]);
    			attr_dev(select, "id", /*selectId*/ ctx[20]);
    			select.multiple = /*multiple*/ ctx[6];
    			attr_dev(select, "class", "svelte-lduj97");
    			add_location(select, file$k, 1140, 2, 27641);
    			attr_dev(input_1, "type", "text");

    			attr_dev(input_1, "class", input_1_class_value = "" + ((/*inputClassName*/ ctx[16]
    			? /*inputClassName*/ ctx[16]
    			: '') + " input autocomplete-input" + " svelte-lduj97"));

    			attr_dev(input_1, "id", input_1_id_value = /*inputId*/ ctx[17] ? /*inputId*/ ctx[17] : '');
    			attr_dev(input_1, "autocomplete", input_1_autocomplete_value = /*html5autocomplete*/ ctx[22] ? 'on' : 'some-other-text');
    			attr_dev(input_1, "placeholder", /*placeholder*/ ctx[14]);
    			attr_dev(input_1, "name", /*name*/ ctx[18]);
    			input_1.disabled = /*disabled*/ ctx[25];
    			attr_dev(input_1, "title", /*title*/ ctx[21]);
    			input_1.readOnly = input_1_readonly_value = /*readonly*/ ctx[23] || /*lock*/ ctx[8] && /*selectedItem*/ ctx[1];
    			add_location(input_1, file$k, 1168, 4, 28507);
    			attr_dev(div0, "class", "input-container svelte-lduj97");
    			add_location(div0, file$k, 1151, 2, 27987);

    			attr_dev(div1, "class", div1_class_value = "" + ((/*dropdownClassName*/ ctx[24]
    			? /*dropdownClassName*/ ctx[24]
    			: '') + " autocomplete-list " + (/*showList*/ ctx[32] ? '' : 'hidden') + " is-fullwidth" + " svelte-lduj97"));

    			add_location(div1, file$k, 1190, 2, 29176);

    			attr_dev(div2, "class", div2_class_value = "" + ((/*className*/ ctx[15] ? /*className*/ ctx[15] : '') + " " + (/*hideArrow*/ ctx[9] || !/*items*/ ctx[0].length
    			? 'hide-arrow'
    			: '') + " " + (/*multiple*/ ctx[6] ? 'is-multiple' : '') + " autocomplete select is-fullwidth " + /*uniqueId*/ ctx[33] + " svelte-lduj97"));

    			toggle_class(div2, "show-clear", /*clearable*/ ctx[31]);
    			toggle_class(div2, "is-loading", /*showLoadingIndicator*/ ctx[10] && /*loading*/ ctx[30]);
    			add_location(div2, file$k, 1134, 0, 27381);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, select);
    			if (if_block0) if_block0.m(select, null);
    			append_dev(div2, t0);
    			append_dev(div2, div0);
    			if (if_block1) if_block1.m(div0, null);
    			append_dev(div0, t1);
    			append_dev(div0, input_1);
    			/*input_1_binding*/ ctx[77](input_1);
    			set_input_value(input_1, /*text*/ ctx[3]);
    			append_dev(div0, t2);
    			if (if_block2) if_block2.m(div0, null);
    			append_dev(div2, t3);
    			append_dev(div2, div1);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(div1, null);
    			}

    			/*div1_binding*/ ctx[81](div1);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(window, "click", /*onDocumentClick*/ ctx[37], false, false, false),
    					listen_dev(input_1, "input", /*input_1_input_handler*/ ctx[78]),
    					listen_dev(input_1, "input", /*onInput*/ ctx[40], false, false, false),
    					listen_dev(input_1, "focus", /*onFocusInternal*/ ctx[43], false, false, false),
    					listen_dev(input_1, "blur", /*onBlurInternal*/ ctx[44], false, false, false),
    					listen_dev(input_1, "keydown", /*onKeyDown*/ ctx[38], false, false, false),
    					listen_dev(input_1, "click", /*onInputClick*/ ctx[42], false, false, false),
    					listen_dev(input_1, "keypress", /*onKeyPress*/ ctx[39], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block0) {
    				if_block0.p(ctx, dirty);
    			} else {
    				if (if_block0) if_block0.d(1);
    				if_block0 = current_block_type && current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(select, null);
    				}
    			}

    			if (!current || dirty[0] & /*selectName*/ 524288) {
    				attr_dev(select, "name", /*selectName*/ ctx[19]);
    			}

    			if (!current || dirty[0] & /*selectId*/ 1048576) {
    				attr_dev(select, "id", /*selectId*/ ctx[20]);
    			}

    			if (!current || dirty[0] & /*multiple*/ 64) {
    				prop_dev(select, "multiple", /*multiple*/ ctx[6]);
    			}

    			if (/*multiple*/ ctx[6] && /*selectedItem*/ ctx[1]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty[0] & /*multiple, selectedItem*/ 66) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_9(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div0, t1);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty[0] & /*inputClassName*/ 65536 && input_1_class_value !== (input_1_class_value = "" + ((/*inputClassName*/ ctx[16]
    			? /*inputClassName*/ ctx[16]
    			: '') + " input autocomplete-input" + " svelte-lduj97"))) {
    				attr_dev(input_1, "class", input_1_class_value);
    			}

    			if (!current || dirty[0] & /*inputId*/ 131072 && input_1_id_value !== (input_1_id_value = /*inputId*/ ctx[17] ? /*inputId*/ ctx[17] : '')) {
    				attr_dev(input_1, "id", input_1_id_value);
    			}

    			if (!current || dirty[0] & /*html5autocomplete*/ 4194304 && input_1_autocomplete_value !== (input_1_autocomplete_value = /*html5autocomplete*/ ctx[22] ? 'on' : 'some-other-text')) {
    				attr_dev(input_1, "autocomplete", input_1_autocomplete_value);
    			}

    			if (!current || dirty[0] & /*placeholder*/ 16384) {
    				attr_dev(input_1, "placeholder", /*placeholder*/ ctx[14]);
    			}

    			if (!current || dirty[0] & /*name*/ 262144) {
    				attr_dev(input_1, "name", /*name*/ ctx[18]);
    			}

    			if (!current || dirty[0] & /*disabled*/ 33554432) {
    				prop_dev(input_1, "disabled", /*disabled*/ ctx[25]);
    			}

    			if (!current || dirty[0] & /*title*/ 2097152) {
    				attr_dev(input_1, "title", /*title*/ ctx[21]);
    			}

    			if (!current || dirty[0] & /*readonly, lock, selectedItem*/ 8388866 && input_1_readonly_value !== (input_1_readonly_value = /*readonly*/ ctx[23] || /*lock*/ ctx[8] && /*selectedItem*/ ctx[1])) {
    				prop_dev(input_1, "readOnly", input_1_readonly_value);
    			}

    			if (dirty[0] & /*text*/ 8 && input_1.value !== /*text*/ ctx[3]) {
    				set_input_value(input_1, /*text*/ ctx[3]);
    			}

    			if (/*clearable*/ ctx[31]) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block_8(ctx);
    					if_block2.c();
    					if_block2.m(div0, null);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_1(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block3) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block3 = if_blocks[current_block_type_index];

    					if (!if_block3) {
    						if_block3 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block3.c();
    					} else {
    						if_block3.p(ctx, dirty);
    					}

    					transition_in(if_block3, 1);
    					if_block3.m(div1, null);
    				} else {
    					if_block3 = null;
    				}
    			}

    			if (!current || dirty[0] & /*dropdownClassName*/ 16777216 | dirty[1] & /*showList*/ 2 && div1_class_value !== (div1_class_value = "" + ((/*dropdownClassName*/ ctx[24]
    			? /*dropdownClassName*/ ctx[24]
    			: '') + " autocomplete-list " + (/*showList*/ ctx[32] ? '' : 'hidden') + " is-fullwidth" + " svelte-lduj97"))) {
    				attr_dev(div1, "class", div1_class_value);
    			}

    			if (!current || dirty[0] & /*className, hideArrow, items, multiple*/ 33345 && div2_class_value !== (div2_class_value = "" + ((/*className*/ ctx[15] ? /*className*/ ctx[15] : '') + " " + (/*hideArrow*/ ctx[9] || !/*items*/ ctx[0].length
    			? 'hide-arrow'
    			: '') + " " + (/*multiple*/ ctx[6] ? 'is-multiple' : '') + " autocomplete select is-fullwidth " + /*uniqueId*/ ctx[33] + " svelte-lduj97"))) {
    				attr_dev(div2, "class", div2_class_value);
    			}

    			if (dirty[0] & /*className, hideArrow, items, multiple*/ 33345 | dirty[1] & /*clearable*/ 1) {
    				toggle_class(div2, "show-clear", /*clearable*/ ctx[31]);
    			}

    			if (dirty[0] & /*className, hideArrow, items, multiple, showLoadingIndicator, loading*/ 1073776193) {
    				toggle_class(div2, "is-loading", /*showLoadingIndicator*/ ctx[10] && /*loading*/ ctx[30]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block1);
    			transition_in(if_block3);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block1);
    			transition_out(if_block3);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);

    			if (if_block0) {
    				if_block0.d();
    			}

    			if (if_block1) if_block1.d();
    			/*input_1_binding*/ ctx[77](null);
    			if (if_block2) if_block2.d();

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d();
    			}

    			/*div1_binding*/ ctx[81](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$l.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function safeStringFunction(theFunction, argument) {
    	if (typeof theFunction !== "function") {
    		console.error("Not a function: " + theFunction + ", argument: " + argument);
    	}

    	let originalResult;

    	try {
    		originalResult = theFunction(argument);
    	} catch(error) {
    		console.warn("Error executing Autocomplete function on value: " + argument + " function: " + theFunction);
    	}

    	let result = originalResult;

    	if (result === undefined || result === null) {
    		result = "";
    	}

    	if (typeof result !== "string") {
    		result = result.toString();
    	}

    	return result;
    }

    function numberOfMatches(listItem, searchWords) {
    	if (!listItem) {
    		return 0;
    	}

    	const itemKeywords = listItem.keywords;
    	let matches = 0;

    	searchWords.forEach(searchWord => {
    		if (itemKeywords.includes(searchWord)) {
    			matches++;
    		}
    	});

    	return matches;
    }

    function defaultItemSortFunction(obj1, obj2, searchWords) {
    	return numberOfMatches(obj2, searchWords) - numberOfMatches(obj1, searchWords);
    }

    function removeAccents(str) {
    	return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    function instance$l($$self, $$props, $$invalidate) {
    	let showList;
    	let clearable;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SimpleAutocomplete', slots, ['tag','item','loading','create','no-results']);
    	let { items = [] } = $$props;
    	let { searchFunction = false } = $$props;
    	let { labelFieldName = undefined } = $$props;
    	let { keywordsFieldName = labelFieldName } = $$props;
    	let { valueFieldName = undefined } = $$props;

    	let { labelFunction = function (item) {
    		if (item === undefined || item === null) {
    			return "";
    		}

    		return labelFieldName ? item[labelFieldName] : item;
    	} } = $$props;

    	let { keywordsFunction = function (item) {
    		if (item === undefined || item === null) {
    			return "";
    		}

    		return keywordsFieldName
    		? item[keywordsFieldName]
    		: labelFunction(item);
    	} } = $$props;

    	let { valueFunction = function (item, forceSingle = false) {
    		if (item === undefined || item === null) {
    			return item;
    		}

    		if (!multiple || forceSingle) {
    			return valueFieldName ? item[valueFieldName] : item;
    		} else {
    			return item.map(i => valueFieldName ? i[valueFieldName] : i);
    		}
    	} } = $$props;

    	let { keywordsCleanFunction = function (keywords) {
    		return keywords;
    	} } = $$props;

    	let { textCleanFunction = function (userEnteredText) {
    		return userEnteredText;
    	} } = $$props;

    	let { beforeChange = function (oldSelectedItem, newSelectedItem) {
    		return true;
    	} } = $$props;

    	let { onChange = function (newSelectedItem) {
    		
    	} } = $$props;

    	let { onFocus = function () {
    		
    	} } = $$props;

    	let { onBlur = function () {
    		
    	} } = $$props;

    	let { onCreate = function (text) {
    		if (debug) {
    			console.log("onCreate: " + text);
    		}
    	} } = $$props;

    	let { selectFirstIfEmpty = false } = $$props;
    	let { minCharactersToSearch = 1 } = $$props;
    	let { maxItemsToShowInList = 0 } = $$props;
    	let { multiple = false } = $$props;
    	let { create = false } = $$props;
    	let { ignoreAccents = true } = $$props;
    	let { matchAllKeywords = true } = $$props;
    	let { sortByMatchedKeywords = false } = $$props;
    	let { itemFilterFunction = undefined } = $$props;
    	let { itemSortFunction = undefined } = $$props;
    	let { lock = false } = $$props;
    	let { delay = 0 } = $$props;
    	let { localFiltering = true } = $$props;
    	let { hideArrow = false } = $$props;
    	let { showClear = false } = $$props;
    	let { showLoadingIndicator = false } = $$props;
    	let { noResultsText = "No results found" } = $$props;
    	let { loadingText = "Loading results..." } = $$props;
    	let { createText = "Not found, add anyway?" } = $$props;
    	let { placeholder = undefined } = $$props;
    	let { className = undefined } = $$props;
    	let { inputClassName = undefined } = $$props;
    	let { inputId = undefined } = $$props;
    	let { name = undefined } = $$props;
    	let { selectName = undefined } = $$props;
    	let { selectId = undefined } = $$props;
    	let { title = undefined } = $$props;
    	let { html5autocomplete = undefined } = $$props;
    	let { readonly = undefined } = $$props;
    	let { dropdownClassName = undefined } = $$props;
    	let { disabled = false } = $$props;
    	let { debug = false } = $$props;
    	let { selectedItem = multiple ? [] : undefined } = $$props;
    	let { value = undefined } = $$props;
    	let { highlightedItem = undefined } = $$props;

    	// --- Internal State ----
    	const uniqueId = "sautocomplete-" + Math.floor(Math.random() * 1000);

    	// HTML elements
    	let input;

    	let list;

    	// UI state
    	let opened = false;

    	let loading = false;
    	let highlightIndex = -1;
    	let { text } = $$props;
    	let filteredTextLength = 0;

    	// view model
    	let filteredListItems;

    	let listItems = [];

    	// requests/responses counters
    	let lastRequestId = 0;

    	let lastResponseId = 0;

    	// other state
    	let inputDelayTimeout;

    	function safeLabelFunction(item) {
    		// console.log("labelFunction: " + labelFunction);
    		// console.log("safeLabelFunction, item: " + item);
    		return safeStringFunction(labelFunction, item);
    	}

    	function safeKeywordsFunction(item) {
    		// console.log("safeKeywordsFunction");
    		const keywords = safeStringFunction(keywordsFunction, item);

    		let result = safeStringFunction(keywordsCleanFunction, keywords);
    		result = result.toLowerCase().trim();

    		if (ignoreAccents) {
    			result = removeAccents(result);
    		}

    		if (debug) {
    			console.log("Extracted keywords: '" + result + "' from item: " + JSON.stringify(item));
    		}

    		return result;
    	}

    	function prepareListItems() {
    		let timerId;

    		if (debug) {
    			timerId = `Autocomplete prepare list ${inputId ? `(id: ${inputId})` : ""}`;
    			console.time(timerId);
    			console.log("Prepare items to search");
    			console.log("items: " + JSON.stringify(items));
    		}

    		if (!Array.isArray(items)) {
    			console.warn("Autocomplete items / search function did not return array but", items);
    			$$invalidate(0, items = []);
    		}

    		const length = items ? items.length : 0;
    		listItems = new Array(length);

    		if (length > 0) {
    			items.forEach((item, i) => {
    				const listItem = getListItem(item);

    				if (listItem == undefined) {
    					console.log("Undefined item for: ", item);
    				}

    				listItems[i] = listItem;
    			});
    		}

    		if (debug) {
    			console.log(listItems.length + " items to search");
    			console.timeEnd(timerId);
    		}
    	}

    	function getListItem(item) {
    		return {
    			// keywords representation of the item
    			keywords: safeKeywordsFunction(item),
    			// item label
    			label: safeLabelFunction(item),
    			// store reference to the origial item
    			item
    		};
    	}

    	function onSelectedItemChanged() {
    		$$invalidate(2, value = valueFunction(selectedItem));
    		$$invalidate(3, text = !multiple ? safeLabelFunction(selectedItem) : "");
    		$$invalidate(27, filteredListItems = listItems);
    		onChange(selectedItem);
    	}

    	function prepareUserEnteredText(userEnteredText) {
    		if (userEnteredText === undefined || userEnteredText === null) {
    			return "";
    		}

    		const textFiltered = userEnteredText.replace(/[&/\\#,+()$~%.'":*?<>{}]/g, " ").trim();
    		$$invalidate(74, filteredTextLength = textFiltered.length);

    		if (minCharactersToSearch > 1) {
    			if (filteredTextLength < minCharactersToSearch) {
    				return "";
    			}
    		}

    		const cleanUserEnteredText = textCleanFunction(textFiltered);
    		const textFilteredLowerCase = cleanUserEnteredText.toLowerCase().trim();

    		if (debug) {
    			console.log("Change user entered text '" + userEnteredText + "' into '" + textFilteredLowerCase + "'");
    		}

    		return textFilteredLowerCase;
    	}

    	async function search() {
    		let timerId;

    		if (debug) {
    			timerId = `Autocomplete search ${inputId ? `(id: ${inputId})` : ""})`;
    			console.time(timerId);
    			console.log("Searching user entered text: '" + text + "'");
    		}

    		const textFiltered = prepareUserEnteredText(text);

    		if (textFiltered === "") {
    			if (searchFunction) {
    				// we will need to rerun the search
    				$$invalidate(0, items = []);

    				if (debug) {
    					console.log("User entered text is empty clear list of items");
    				}
    			} else {
    				$$invalidate(27, filteredListItems = listItems);

    				if (debug) {
    					console.log("User entered text is empty set the list of items to all items");
    				}
    			}

    			closeIfMinCharsToSearchReached();

    			if (debug) {
    				console.timeEnd(timerId);
    			}

    			return;
    		}

    		if (!searchFunction) {
    			processListItems(textFiltered);
    		} else // external search which provides items
    		{
    			lastRequestId = lastRequestId + 1;
    			const currentRequestId = lastRequestId;
    			$$invalidate(30, loading = true);

    			// searchFunction is a generator
    			if (searchFunction.constructor.name === "AsyncGeneratorFunction") {
    				for await (const chunk of searchFunction(textFiltered)) {
    					// a chunk of an old response: throw it away
    					if (currentRequestId < lastResponseId) {
    						return false;
    					}

    					// a chunk for a new response: reset the item list
    					if (currentRequestId > lastResponseId) {
    						$$invalidate(0, items = []);
    					}

    					lastResponseId = currentRequestId;
    					$$invalidate(0, items = [...items, ...chunk]);
    					processListItems(textFiltered);
    				}

    				// there was nothing in the chunk
    				if (lastResponseId < currentRequestId) {
    					lastResponseId = currentRequestId;
    					$$invalidate(0, items = []);
    					processListItems(textFiltered);
    				}
    			} else // searchFunction is a regular function
    			{
    				let result = await searchFunction(textFiltered);

    				// If a response to a newer request has been received
    				// while responses to this request were being loaded,
    				// then we can just throw away this outdated results.
    				if (currentRequestId < lastResponseId) {
    					return false;
    				}

    				lastResponseId = currentRequestId;
    				$$invalidate(0, items = result);
    				processListItems(textFiltered);
    			}

    			$$invalidate(30, loading = false);
    		}

    		if (debug) {
    			console.timeEnd(timerId);
    			console.log("Search found " + filteredListItems.length + " items");
    		}
    	}

    	function defaultItemFilterFunction(listItem, searchWords) {
    		var matches = numberOfMatches(listItem, searchWords);

    		if (matchAllKeywords) {
    			return matches >= searchWords.length;
    		} else {
    			return matches > 0;
    		}
    	}

    	function processListItems(textFiltered) {
    		// cleans, filters, orders, and highlights the list items
    		prepareListItems();

    		const textFilteredWithoutAccents = ignoreAccents
    		? removeAccents(textFiltered)
    		: textFiltered;

    		const searchWords = textFilteredWithoutAccents.split(/\s+/g);

    		// local search
    		let tempfilteredListItems;

    		if (localFiltering) {
    			if (itemFilterFunction) {
    				tempfilteredListItems = listItems.filter(item => itemFilterFunction(item.item, searchWords));
    			} else {
    				tempfilteredListItems = listItems.filter(item => defaultItemFilterFunction(item, searchWords));
    			}

    			if (itemSortFunction) {
    				tempfilteredListItems = tempfilteredListItems.sort((item1, item2) => itemSortFunction(item1.item, item2.item, searchWords));
    			} else {
    				if (sortByMatchedKeywords) {
    					tempfilteredListItems = tempfilteredListItems.sort((item1, item2) => defaultItemSortFunction(item1, item2, searchWords));
    				}
    			}
    		} else {
    			tempfilteredListItems = listItems;
    		}

    		const hlfilter = highlightFilter(searchWords, "label");
    		const filteredListItemsHighlighted = tempfilteredListItems.map(hlfilter);
    		$$invalidate(27, filteredListItems = filteredListItemsHighlighted);
    		closeIfMinCharsToSearchReached();
    		return true;
    	}

    	// $: text, search();
    	function selectListItem(listItem) {
    		if (debug) {
    			console.log("selectListItem", listItem);
    		}

    		if ("undefined" === typeof listItem && create) {
    			// allow undefined items if create is enabled
    			const createdItem = onCreate(text);

    			if ("undefined" !== typeof createdItem) {
    				prepareListItems();
    				$$invalidate(27, filteredListItems = listItems);
    				const index = findItemIndex(createdItem, filteredListItems);

    				if (index >= 0) {
    					$$invalidate(26, highlightIndex = index);
    					listItem = filteredListItems[highlightIndex];
    				}
    			}
    		}

    		if ("undefined" === typeof listItem) {
    			if (debug) {
    				console.log(`listItem is undefined. Can not select.`);
    			}

    			return false;
    		}

    		const newSelectedItem = listItem.item;

    		if (beforeChange(selectedItem, newSelectedItem)) {
    			// simple selection
    			if (!multiple) {
    				$$invalidate(1, selectedItem = undefined); // triggers change even if the the same item is selected
    				$$invalidate(1, selectedItem = newSelectedItem);
    			} else // first selection of multiple ones
    			if (!selectedItem) {
    				$$invalidate(1, selectedItem = [newSelectedItem]);
    			} else // selecting something already selected => unselect it
    			if (selectedItem.includes(newSelectedItem)) {
    				$$invalidate(1, selectedItem = selectedItem.filter(i => i !== newSelectedItem));
    			} else // adds the element to the selection
    			{
    				$$invalidate(1, selectedItem = [...selectedItem, newSelectedItem]);
    			}
    		}

    		return true;
    	}

    	function selectItem() {
    		if (debug) {
    			console.log("selectItem", highlightIndex);
    		}

    		const listItem = filteredListItems[highlightIndex];

    		if (selectListItem(listItem)) {
    			close();

    			if (multiple) {
    				input.focus();
    			}
    		}
    	}

    	function up() {
    		if (debug) {
    			console.log("up");
    		}

    		open();

    		if (highlightIndex > 0) {
    			$$invalidate(26, highlightIndex--, highlightIndex);
    		}

    		highlight();
    	}

    	function down() {
    		if (debug) {
    			console.log("down");
    		}

    		open();

    		if (highlightIndex < filteredListItems.length - 1) {
    			$$invalidate(26, highlightIndex++, highlightIndex);
    		}

    		highlight();
    	}

    	function highlight() {
    		if (debug) {
    			console.log("highlight");
    		}

    		const query = ".selected";

    		if (debug) {
    			console.log("Seaching DOM element: " + query + " in " + list);
    		}

    		const el = list && list.querySelector(query);

    		if (el) {
    			if (typeof el.scrollIntoViewIfNeeded === "function") {
    				if (debug) {
    					console.log("Scrolling selected item into view");
    				}

    				el.scrollIntoViewIfNeeded();
    			} else {
    				if (debug) {
    					console.warn("Could not scroll selected item into view, scrollIntoViewIfNeeded not supported");
    				}
    			}
    		} else {
    			if (debug) {
    				console.warn("Selected item not found to scroll into view");
    			}
    		}
    	}

    	function onListItemClick(listItem) {
    		if (debug) {
    			console.log("onListItemClick");
    		}

    		if (selectListItem(listItem)) {
    			close();

    			if (multiple) {
    				input.focus();
    			}
    		}
    	}

    	function onDocumentClick(e) {
    		if (debug) {
    			console.log("onDocumentClick: " + JSON.stringify(e.composedPath()));
    		}

    		if (e.composedPath().some(path => path.classList && path.classList.contains(uniqueId))) {
    			if (debug) {
    				console.log("onDocumentClick inside");
    			}

    			// resetListToAllItemsAndOpen();
    			highlight();
    		} else {
    			if (debug) {
    				console.log("onDocumentClick outside");
    			}

    			close();
    		}
    	}

    	function onKeyDown(e) {
    		if (debug) {
    			console.log("onKeyDown");
    		}

    		let key = e.key;
    		if (key === "Tab" && e.shiftKey) key = "ShiftTab";

    		const fnmap = {
    			Tab: opened ? down.bind(this) : null,
    			ShiftTab: opened ? up.bind(this) : null,
    			ArrowDown: down.bind(this),
    			ArrowUp: up.bind(this),
    			Escape: onEsc.bind(this),
    			Backspace: multiple && selectedItem && selectedItem.length && !text
    			? onBackspace.bind(this)
    			: null
    		};

    		const fn = fnmap[key];

    		if (typeof fn === "function") {
    			fn(e);
    		}
    	}

    	function onKeyPress(e) {
    		if (debug) {
    			console.log("onKeyPress");
    		}

    		if (e.key === "Enter" && opened) {
    			e.preventDefault();
    			onEnter();
    		}
    	}

    	function onEnter() {
    		selectItem();
    	}

    	function onInput(e) {
    		if (debug) {
    			console.log("onInput");
    		}

    		$$invalidate(3, text = e.target.value);

    		if (inputDelayTimeout) {
    			clearTimeout(inputDelayTimeout);
    		}

    		if (delay) {
    			inputDelayTimeout = setTimeout(processInput, delay);
    		} else {
    			processInput();
    		}
    	}

    	function unselectItem(tag) {
    		if (debug) {
    			console.log("unselectItem", tag);
    		}

    		$$invalidate(1, selectedItem = selectedItem.filter(i => i !== tag));
    		input.focus();
    	}

    	function processInput() {
    		if (search()) {
    			$$invalidate(26, highlightIndex = 0);
    			open();
    		}
    	}

    	function onInputClick() {
    		if (debug) {
    			console.log("onInputClick");
    		}

    		resetListToAllItemsAndOpen();
    	}

    	function onEsc(e) {
    		if (debug) {
    			console.log("onEsc");
    		}

    		//if (text) return clear();
    		e.stopPropagation();

    		if (opened) {
    			input.focus();
    			close();
    		}
    	}

    	function onBackspace(e) {
    		if (debug) {
    			console.log("onBackspace");
    		}

    		unselectItem(selectedItem[selectedItem.length - 1]);
    	}

    	function onFocusInternal() {
    		if (debug) {
    			console.log("onFocus");
    		}

    		onFocus();
    		resetListToAllItemsAndOpen();
    	}

    	function onBlurInternal() {
    		if (debug) {
    			console.log("onBlur");
    		}

    		onBlur();
    	}

    	function resetListToAllItemsAndOpen() {
    		if (debug) {
    			console.log("resetListToAllItemsAndOpen");
    		}

    		if (!text) {
    			$$invalidate(27, filteredListItems = listItems);
    		} else // When an async component is initialized, the item list
    		// must be loaded when the input is focused.
    		if (!listItems.length && selectedItem && searchFunction) {
    			search();
    		}

    		open();

    		// find selected item
    		if (selectedItem) {
    			if (debug) {
    				console.log("Searching currently selected item: " + JSON.stringify(selectedItem));
    			}

    			const index = findItemIndex(selectedItem, filteredListItems);

    			if (index >= 0) {
    				$$invalidate(26, highlightIndex = index);
    				highlight();
    			}
    		}
    	}

    	function findItemIndex(item, items) {
    		if (debug) {
    			console.log("Finding index for item", item);
    		}

    		let index = -1;

    		for (let i = 0; i < items.length; i++) {
    			const listItem = items[i];

    			if ("undefined" === typeof listItem) {
    				if (debug) {
    					console.log(`listItem ${i} is undefined. Skipping.`);
    				}

    				continue;
    			}

    			if (debug) {
    				console.log("Item " + i + ": " + JSON.stringify(listItem));
    			}

    			if (item == listItem.item) {
    				index = i;
    				break;
    			}
    		}

    		if (debug) {
    			if (index >= 0) {
    				console.log("Found index for item: " + index);
    			} else {
    				console.warn("Not found index for item: " + item);
    			}
    		}

    		return index;
    	}

    	function open() {
    		if (debug) {
    			console.log("open");
    		}

    		// check if the search text has more than the min chars required
    		if (isMinCharsToSearchReached()) {
    			return;
    		}

    		$$invalidate(73, opened = true);
    	}

    	function close() {
    		if (debug) {
    			console.log("close");
    		}

    		$$invalidate(73, opened = false);
    		$$invalidate(30, loading = false);

    		if (!text && selectFirstIfEmpty) {
    			$$invalidate(26, highlightIndex = 0);
    			selectItem();
    		}
    	}

    	function isMinCharsToSearchReached() {
    		return minCharactersToSearch > 1 && filteredTextLength < minCharactersToSearch;
    	}

    	function closeIfMinCharsToSearchReached() {
    		if (isMinCharsToSearchReached()) {
    			close();
    		}
    	}

    	function clear() {
    		if (debug) {
    			console.log("clear");
    		}

    		$$invalidate(3, text = "");
    		$$invalidate(1, selectedItem = multiple ? [] : undefined);

    		setTimeout(() => {
    			input.focus();
    			close();
    		});
    	}

    	function highlightFilter(keywords, field) {
    		return item => {
    			let label = item[field];
    			const newItem = Object.assign({ highlighted: undefined }, item);
    			newItem.highlighted = label;
    			const labelLowercase = label.toLowerCase();

    			const labelLowercaseNoAc = ignoreAccents
    			? removeAccents(labelLowercase)
    			: labelLowercase;

    			if (keywords && keywords.length) {
    				const positions = [];

    				for (let i = 0; i < keywords.length; i++) {
    					let keyword = keywords[i];

    					if (ignoreAccents) {
    						keyword = removeAccents(keyword);
    					}

    					const keywordLen = keyword.length;
    					let pos1 = 0;

    					do {
    						pos1 = labelLowercaseNoAc.indexOf(keyword, pos1);

    						if (pos1 >= 0) {
    							let pos2 = pos1 + keywordLen;
    							positions.push([pos1, pos2]);
    							pos1 = pos2;
    						}
    					} while (pos1 !== -1);
    				}

    				if (positions.length > 0) {
    					const keywordPatterns = new Set();

    					for (let i = 0; i < positions.length; i++) {
    						const pair = positions[i];
    						const pos1 = pair[0];
    						const pos2 = pair[1];
    						const keywordPattern = labelLowercase.substring(pos1, pos2);
    						keywordPatterns.add(keywordPattern);
    					}

    					for (let keywordPattern of keywordPatterns) {
    						// FIXME pst: workarond for wrong replacement <b> tags
    						if (keywordPattern === "b") {
    							continue;
    						}

    						const reg = new RegExp("(" + keywordPattern + ")", "ig");
    						const newHighlighted = newItem.highlighted.replace(reg, "<b>$1</b>");
    						newItem.highlighted = newHighlighted;
    					}
    				}
    			}

    			return newItem;
    		};
    	}

    	function isConfirmed(listItem) {
    		if (!selectedItem) {
    			return false;
    		}

    		if (multiple) {
    			return selectedItem.includes(listItem);
    		} else {
    			return listItem == selectedItem;
    		}
    	}

    	const writable_props = [
    		'items',
    		'searchFunction',
    		'labelFieldName',
    		'keywordsFieldName',
    		'valueFieldName',
    		'labelFunction',
    		'keywordsFunction',
    		'valueFunction',
    		'keywordsCleanFunction',
    		'textCleanFunction',
    		'beforeChange',
    		'onChange',
    		'onFocus',
    		'onBlur',
    		'onCreate',
    		'selectFirstIfEmpty',
    		'minCharactersToSearch',
    		'maxItemsToShowInList',
    		'multiple',
    		'create',
    		'ignoreAccents',
    		'matchAllKeywords',
    		'sortByMatchedKeywords',
    		'itemFilterFunction',
    		'itemSortFunction',
    		'lock',
    		'delay',
    		'localFiltering',
    		'hideArrow',
    		'showClear',
    		'showLoadingIndicator',
    		'noResultsText',
    		'loadingText',
    		'createText',
    		'placeholder',
    		'className',
    		'inputClassName',
    		'inputId',
    		'name',
    		'selectName',
    		'selectId',
    		'title',
    		'html5autocomplete',
    		'readonly',
    		'dropdownClassName',
    		'disabled',
    		'debug',
    		'selectedItem',
    		'value',
    		'highlightedItem',
    		'text'
    	];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<SimpleAutocomplete> was created with unknown prop '${key}'`);
    	});

    	function input_1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			input = $$value;
    			$$invalidate(28, input);
    		});
    	}

    	function input_1_input_handler() {
    		text = this.value;
    		$$invalidate(3, text);
    	}

    	const click_handler = listItem => onListItemClick(listItem);

    	const pointerenter_handler = i => {
    		$$invalidate(26, highlightIndex = i);
    	};

    	function div1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			list = $$value;
    			$$invalidate(29, list);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('items' in $$props) $$invalidate(0, items = $$props.items);
    		if ('searchFunction' in $$props) $$invalidate(48, searchFunction = $$props.searchFunction);
    		if ('labelFieldName' in $$props) $$invalidate(49, labelFieldName = $$props.labelFieldName);
    		if ('keywordsFieldName' in $$props) $$invalidate(50, keywordsFieldName = $$props.keywordsFieldName);
    		if ('valueFieldName' in $$props) $$invalidate(51, valueFieldName = $$props.valueFieldName);
    		if ('labelFunction' in $$props) $$invalidate(52, labelFunction = $$props.labelFunction);
    		if ('keywordsFunction' in $$props) $$invalidate(53, keywordsFunction = $$props.keywordsFunction);
    		if ('valueFunction' in $$props) $$invalidate(4, valueFunction = $$props.valueFunction);
    		if ('keywordsCleanFunction' in $$props) $$invalidate(54, keywordsCleanFunction = $$props.keywordsCleanFunction);
    		if ('textCleanFunction' in $$props) $$invalidate(55, textCleanFunction = $$props.textCleanFunction);
    		if ('beforeChange' in $$props) $$invalidate(56, beforeChange = $$props.beforeChange);
    		if ('onChange' in $$props) $$invalidate(57, onChange = $$props.onChange);
    		if ('onFocus' in $$props) $$invalidate(58, onFocus = $$props.onFocus);
    		if ('onBlur' in $$props) $$invalidate(59, onBlur = $$props.onBlur);
    		if ('onCreate' in $$props) $$invalidate(60, onCreate = $$props.onCreate);
    		if ('selectFirstIfEmpty' in $$props) $$invalidate(61, selectFirstIfEmpty = $$props.selectFirstIfEmpty);
    		if ('minCharactersToSearch' in $$props) $$invalidate(62, minCharactersToSearch = $$props.minCharactersToSearch);
    		if ('maxItemsToShowInList' in $$props) $$invalidate(5, maxItemsToShowInList = $$props.maxItemsToShowInList);
    		if ('multiple' in $$props) $$invalidate(6, multiple = $$props.multiple);
    		if ('create' in $$props) $$invalidate(7, create = $$props.create);
    		if ('ignoreAccents' in $$props) $$invalidate(63, ignoreAccents = $$props.ignoreAccents);
    		if ('matchAllKeywords' in $$props) $$invalidate(64, matchAllKeywords = $$props.matchAllKeywords);
    		if ('sortByMatchedKeywords' in $$props) $$invalidate(65, sortByMatchedKeywords = $$props.sortByMatchedKeywords);
    		if ('itemFilterFunction' in $$props) $$invalidate(66, itemFilterFunction = $$props.itemFilterFunction);
    		if ('itemSortFunction' in $$props) $$invalidate(67, itemSortFunction = $$props.itemSortFunction);
    		if ('lock' in $$props) $$invalidate(8, lock = $$props.lock);
    		if ('delay' in $$props) $$invalidate(68, delay = $$props.delay);
    		if ('localFiltering' in $$props) $$invalidate(69, localFiltering = $$props.localFiltering);
    		if ('hideArrow' in $$props) $$invalidate(9, hideArrow = $$props.hideArrow);
    		if ('showClear' in $$props) $$invalidate(70, showClear = $$props.showClear);
    		if ('showLoadingIndicator' in $$props) $$invalidate(10, showLoadingIndicator = $$props.showLoadingIndicator);
    		if ('noResultsText' in $$props) $$invalidate(11, noResultsText = $$props.noResultsText);
    		if ('loadingText' in $$props) $$invalidate(12, loadingText = $$props.loadingText);
    		if ('createText' in $$props) $$invalidate(13, createText = $$props.createText);
    		if ('placeholder' in $$props) $$invalidate(14, placeholder = $$props.placeholder);
    		if ('className' in $$props) $$invalidate(15, className = $$props.className);
    		if ('inputClassName' in $$props) $$invalidate(16, inputClassName = $$props.inputClassName);
    		if ('inputId' in $$props) $$invalidate(17, inputId = $$props.inputId);
    		if ('name' in $$props) $$invalidate(18, name = $$props.name);
    		if ('selectName' in $$props) $$invalidate(19, selectName = $$props.selectName);
    		if ('selectId' in $$props) $$invalidate(20, selectId = $$props.selectId);
    		if ('title' in $$props) $$invalidate(21, title = $$props.title);
    		if ('html5autocomplete' in $$props) $$invalidate(22, html5autocomplete = $$props.html5autocomplete);
    		if ('readonly' in $$props) $$invalidate(23, readonly = $$props.readonly);
    		if ('dropdownClassName' in $$props) $$invalidate(24, dropdownClassName = $$props.dropdownClassName);
    		if ('disabled' in $$props) $$invalidate(25, disabled = $$props.disabled);
    		if ('debug' in $$props) $$invalidate(71, debug = $$props.debug);
    		if ('selectedItem' in $$props) $$invalidate(1, selectedItem = $$props.selectedItem);
    		if ('value' in $$props) $$invalidate(2, value = $$props.value);
    		if ('highlightedItem' in $$props) $$invalidate(47, highlightedItem = $$props.highlightedItem);
    		if ('text' in $$props) $$invalidate(3, text = $$props.text);
    		if ('$$scope' in $$props) $$invalidate(75, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		items,
    		searchFunction,
    		labelFieldName,
    		keywordsFieldName,
    		valueFieldName,
    		labelFunction,
    		keywordsFunction,
    		valueFunction,
    		keywordsCleanFunction,
    		textCleanFunction,
    		beforeChange,
    		onChange,
    		onFocus,
    		onBlur,
    		onCreate,
    		selectFirstIfEmpty,
    		minCharactersToSearch,
    		maxItemsToShowInList,
    		multiple,
    		create,
    		ignoreAccents,
    		matchAllKeywords,
    		sortByMatchedKeywords,
    		itemFilterFunction,
    		itemSortFunction,
    		lock,
    		delay,
    		localFiltering,
    		hideArrow,
    		showClear,
    		showLoadingIndicator,
    		noResultsText,
    		loadingText,
    		createText,
    		placeholder,
    		className,
    		inputClassName,
    		inputId,
    		name,
    		selectName,
    		selectId,
    		title,
    		html5autocomplete,
    		readonly,
    		dropdownClassName,
    		disabled,
    		debug,
    		selectedItem,
    		value,
    		highlightedItem,
    		uniqueId,
    		input,
    		list,
    		opened,
    		loading,
    		highlightIndex,
    		text,
    		filteredTextLength,
    		filteredListItems,
    		listItems,
    		lastRequestId,
    		lastResponseId,
    		inputDelayTimeout,
    		safeStringFunction,
    		safeLabelFunction,
    		safeKeywordsFunction,
    		prepareListItems,
    		getListItem,
    		onSelectedItemChanged,
    		prepareUserEnteredText,
    		numberOfMatches,
    		search,
    		defaultItemFilterFunction,
    		defaultItemSortFunction,
    		processListItems,
    		selectListItem,
    		selectItem,
    		up,
    		down,
    		highlight,
    		onListItemClick,
    		onDocumentClick,
    		onKeyDown,
    		onKeyPress,
    		onEnter,
    		onInput,
    		unselectItem,
    		processInput,
    		onInputClick,
    		onEsc,
    		onBackspace,
    		onFocusInternal,
    		onBlurInternal,
    		resetListToAllItemsAndOpen,
    		findItemIndex,
    		open,
    		close,
    		isMinCharsToSearchReached,
    		closeIfMinCharsToSearchReached,
    		clear,
    		highlightFilter,
    		removeAccents,
    		isConfirmed,
    		clearable,
    		showList
    	});

    	$$self.$inject_state = $$props => {
    		if ('items' in $$props) $$invalidate(0, items = $$props.items);
    		if ('searchFunction' in $$props) $$invalidate(48, searchFunction = $$props.searchFunction);
    		if ('labelFieldName' in $$props) $$invalidate(49, labelFieldName = $$props.labelFieldName);
    		if ('keywordsFieldName' in $$props) $$invalidate(50, keywordsFieldName = $$props.keywordsFieldName);
    		if ('valueFieldName' in $$props) $$invalidate(51, valueFieldName = $$props.valueFieldName);
    		if ('labelFunction' in $$props) $$invalidate(52, labelFunction = $$props.labelFunction);
    		if ('keywordsFunction' in $$props) $$invalidate(53, keywordsFunction = $$props.keywordsFunction);
    		if ('valueFunction' in $$props) $$invalidate(4, valueFunction = $$props.valueFunction);
    		if ('keywordsCleanFunction' in $$props) $$invalidate(54, keywordsCleanFunction = $$props.keywordsCleanFunction);
    		if ('textCleanFunction' in $$props) $$invalidate(55, textCleanFunction = $$props.textCleanFunction);
    		if ('beforeChange' in $$props) $$invalidate(56, beforeChange = $$props.beforeChange);
    		if ('onChange' in $$props) $$invalidate(57, onChange = $$props.onChange);
    		if ('onFocus' in $$props) $$invalidate(58, onFocus = $$props.onFocus);
    		if ('onBlur' in $$props) $$invalidate(59, onBlur = $$props.onBlur);
    		if ('onCreate' in $$props) $$invalidate(60, onCreate = $$props.onCreate);
    		if ('selectFirstIfEmpty' in $$props) $$invalidate(61, selectFirstIfEmpty = $$props.selectFirstIfEmpty);
    		if ('minCharactersToSearch' in $$props) $$invalidate(62, minCharactersToSearch = $$props.minCharactersToSearch);
    		if ('maxItemsToShowInList' in $$props) $$invalidate(5, maxItemsToShowInList = $$props.maxItemsToShowInList);
    		if ('multiple' in $$props) $$invalidate(6, multiple = $$props.multiple);
    		if ('create' in $$props) $$invalidate(7, create = $$props.create);
    		if ('ignoreAccents' in $$props) $$invalidate(63, ignoreAccents = $$props.ignoreAccents);
    		if ('matchAllKeywords' in $$props) $$invalidate(64, matchAllKeywords = $$props.matchAllKeywords);
    		if ('sortByMatchedKeywords' in $$props) $$invalidate(65, sortByMatchedKeywords = $$props.sortByMatchedKeywords);
    		if ('itemFilterFunction' in $$props) $$invalidate(66, itemFilterFunction = $$props.itemFilterFunction);
    		if ('itemSortFunction' in $$props) $$invalidate(67, itemSortFunction = $$props.itemSortFunction);
    		if ('lock' in $$props) $$invalidate(8, lock = $$props.lock);
    		if ('delay' in $$props) $$invalidate(68, delay = $$props.delay);
    		if ('localFiltering' in $$props) $$invalidate(69, localFiltering = $$props.localFiltering);
    		if ('hideArrow' in $$props) $$invalidate(9, hideArrow = $$props.hideArrow);
    		if ('showClear' in $$props) $$invalidate(70, showClear = $$props.showClear);
    		if ('showLoadingIndicator' in $$props) $$invalidate(10, showLoadingIndicator = $$props.showLoadingIndicator);
    		if ('noResultsText' in $$props) $$invalidate(11, noResultsText = $$props.noResultsText);
    		if ('loadingText' in $$props) $$invalidate(12, loadingText = $$props.loadingText);
    		if ('createText' in $$props) $$invalidate(13, createText = $$props.createText);
    		if ('placeholder' in $$props) $$invalidate(14, placeholder = $$props.placeholder);
    		if ('className' in $$props) $$invalidate(15, className = $$props.className);
    		if ('inputClassName' in $$props) $$invalidate(16, inputClassName = $$props.inputClassName);
    		if ('inputId' in $$props) $$invalidate(17, inputId = $$props.inputId);
    		if ('name' in $$props) $$invalidate(18, name = $$props.name);
    		if ('selectName' in $$props) $$invalidate(19, selectName = $$props.selectName);
    		if ('selectId' in $$props) $$invalidate(20, selectId = $$props.selectId);
    		if ('title' in $$props) $$invalidate(21, title = $$props.title);
    		if ('html5autocomplete' in $$props) $$invalidate(22, html5autocomplete = $$props.html5autocomplete);
    		if ('readonly' in $$props) $$invalidate(23, readonly = $$props.readonly);
    		if ('dropdownClassName' in $$props) $$invalidate(24, dropdownClassName = $$props.dropdownClassName);
    		if ('disabled' in $$props) $$invalidate(25, disabled = $$props.disabled);
    		if ('debug' in $$props) $$invalidate(71, debug = $$props.debug);
    		if ('selectedItem' in $$props) $$invalidate(1, selectedItem = $$props.selectedItem);
    		if ('value' in $$props) $$invalidate(2, value = $$props.value);
    		if ('highlightedItem' in $$props) $$invalidate(47, highlightedItem = $$props.highlightedItem);
    		if ('input' in $$props) $$invalidate(28, input = $$props.input);
    		if ('list' in $$props) $$invalidate(29, list = $$props.list);
    		if ('opened' in $$props) $$invalidate(73, opened = $$props.opened);
    		if ('loading' in $$props) $$invalidate(30, loading = $$props.loading);
    		if ('highlightIndex' in $$props) $$invalidate(26, highlightIndex = $$props.highlightIndex);
    		if ('text' in $$props) $$invalidate(3, text = $$props.text);
    		if ('filteredTextLength' in $$props) $$invalidate(74, filteredTextLength = $$props.filteredTextLength);
    		if ('filteredListItems' in $$props) $$invalidate(27, filteredListItems = $$props.filteredListItems);
    		if ('listItems' in $$props) listItems = $$props.listItems;
    		if ('lastRequestId' in $$props) lastRequestId = $$props.lastRequestId;
    		if ('lastResponseId' in $$props) lastResponseId = $$props.lastResponseId;
    		if ('inputDelayTimeout' in $$props) inputDelayTimeout = $$props.inputDelayTimeout;
    		if ('clearable' in $$props) $$invalidate(31, clearable = $$props.clearable);
    		if ('showList' in $$props) $$invalidate(32, showList = $$props.showList);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*items*/ 1) {
    			// -- Reactivity --
    			(prepareListItems());
    		}

    		if ($$self.$$.dirty[0] & /*selectedItem*/ 2) {
    			(onSelectedItemChanged());
    		}

    		if ($$self.$$.dirty[0] & /*filteredListItems, highlightIndex*/ 201326592) {
    			$$invalidate(47, highlightedItem = filteredListItems && highlightIndex && highlightIndex >= 0 && highlightIndex < filteredListItems.length
    			? filteredListItems[highlightIndex].item
    			: null);
    		}

    		if ($$self.$$.dirty[0] & /*items*/ 1 | $$self.$$.dirty[2] & /*opened, filteredTextLength*/ 6144) {
    			$$invalidate(32, showList = opened && (items && items.length > 0 || filteredTextLength > 0));
    		}

    		if ($$self.$$.dirty[0] & /*lock, multiple, selectedItem*/ 322 | $$self.$$.dirty[2] & /*showClear*/ 256) {
    			$$invalidate(31, clearable = showClear || (lock || multiple) && selectedItem);
    		}
    	};

    	return [
    		items,
    		selectedItem,
    		value,
    		text,
    		valueFunction,
    		maxItemsToShowInList,
    		multiple,
    		create,
    		lock,
    		hideArrow,
    		showLoadingIndicator,
    		noResultsText,
    		loadingText,
    		createText,
    		placeholder,
    		className,
    		inputClassName,
    		inputId,
    		name,
    		selectName,
    		selectId,
    		title,
    		html5autocomplete,
    		readonly,
    		dropdownClassName,
    		disabled,
    		highlightIndex,
    		filteredListItems,
    		input,
    		list,
    		loading,
    		clearable,
    		showList,
    		uniqueId,
    		safeLabelFunction,
    		selectItem,
    		onListItemClick,
    		onDocumentClick,
    		onKeyDown,
    		onKeyPress,
    		onInput,
    		unselectItem,
    		onInputClick,
    		onFocusInternal,
    		onBlurInternal,
    		clear,
    		isConfirmed,
    		highlightedItem,
    		searchFunction,
    		labelFieldName,
    		keywordsFieldName,
    		valueFieldName,
    		labelFunction,
    		keywordsFunction,
    		keywordsCleanFunction,
    		textCleanFunction,
    		beforeChange,
    		onChange,
    		onFocus,
    		onBlur,
    		onCreate,
    		selectFirstIfEmpty,
    		minCharactersToSearch,
    		ignoreAccents,
    		matchAllKeywords,
    		sortByMatchedKeywords,
    		itemFilterFunction,
    		itemSortFunction,
    		delay,
    		localFiltering,
    		showClear,
    		debug,
    		highlightFilter,
    		opened,
    		filteredTextLength,
    		$$scope,
    		slots,
    		input_1_binding,
    		input_1_input_handler,
    		click_handler,
    		pointerenter_handler,
    		div1_binding
    	];
    }

    class SimpleAutocomplete extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$l,
    			create_fragment$l,
    			safe_not_equal,
    			{
    				items: 0,
    				searchFunction: 48,
    				labelFieldName: 49,
    				keywordsFieldName: 50,
    				valueFieldName: 51,
    				labelFunction: 52,
    				keywordsFunction: 53,
    				valueFunction: 4,
    				keywordsCleanFunction: 54,
    				textCleanFunction: 55,
    				beforeChange: 56,
    				onChange: 57,
    				onFocus: 58,
    				onBlur: 59,
    				onCreate: 60,
    				selectFirstIfEmpty: 61,
    				minCharactersToSearch: 62,
    				maxItemsToShowInList: 5,
    				multiple: 6,
    				create: 7,
    				ignoreAccents: 63,
    				matchAllKeywords: 64,
    				sortByMatchedKeywords: 65,
    				itemFilterFunction: 66,
    				itemSortFunction: 67,
    				lock: 8,
    				delay: 68,
    				localFiltering: 69,
    				hideArrow: 9,
    				showClear: 70,
    				showLoadingIndicator: 10,
    				noResultsText: 11,
    				loadingText: 12,
    				createText: 13,
    				placeholder: 14,
    				className: 15,
    				inputClassName: 16,
    				inputId: 17,
    				name: 18,
    				selectName: 19,
    				selectId: 20,
    				title: 21,
    				html5autocomplete: 22,
    				readonly: 23,
    				dropdownClassName: 24,
    				disabled: 25,
    				debug: 71,
    				selectedItem: 1,
    				value: 2,
    				highlightedItem: 47,
    				text: 3,
    				highlightFilter: 72
    			},
    			null,
    			[-1, -1, -1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SimpleAutocomplete",
    			options,
    			id: create_fragment$l.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*text*/ ctx[3] === undefined && !('text' in props)) {
    			console_1.warn("<SimpleAutocomplete> was created without expected prop 'text'");
    		}
    	}

    	get items() {
    		throw new Error("<SimpleAutocomplete>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set items(value) {
    		throw new Error("<SimpleAutocomplete>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get searchFunction() {
    		throw new Error("<SimpleAutocomplete>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set searchFunction(value) {
    		throw new Error("<SimpleAutocomplete>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get labelFieldName() {
    		throw new Error("<SimpleAutocomplete>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set labelFieldName(value) {
    		throw new Error("<SimpleAutocomplete>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get keywordsFieldName() {
    		throw new Error("<SimpleAutocomplete>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set keywordsFieldName(value) {
    		throw new Error("<SimpleAutocomplete>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get valueFieldName() {
    		throw new Error("<SimpleAutocomplete>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set valueFieldName(value) {
    		throw new Error("<SimpleAutocomplete>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get labelFunction() {
    		throw new Error("<SimpleAutocomplete>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set labelFunction(value) {
    		throw new Error("<SimpleAutocomplete>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get keywordsFunction() {
    		throw new Error("<SimpleAutocomplete>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set keywordsFunction(value) {
    		throw new Error("<SimpleAutocomplete>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get valueFunction() {
    		throw new Error("<SimpleAutocomplete>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set valueFunction(value) {
    		throw new Error("<SimpleAutocomplete>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get keywordsCleanFunction() {
    		throw new Error("<SimpleAutocomplete>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set keywordsCleanFunction(value) {
    		throw new Error("<SimpleAutocomplete>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get textCleanFunction() {
    		throw new Error("<SimpleAutocomplete>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set textCleanFunction(value) {
    		throw new Error("<SimpleAutocomplete>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get beforeChange() {
    		throw new Error("<SimpleAutocomplete>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set beforeChange(value) {
    		throw new Error("<SimpleAutocomplete>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onChange() {
    		throw new Error("<SimpleAutocomplete>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onChange(value) {
    		throw new Error("<SimpleAutocomplete>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onFocus() {
    		throw new Error("<SimpleAutocomplete>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onFocus(value) {
    		throw new Error("<SimpleAutocomplete>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onBlur() {
    		throw new Error("<SimpleAutocomplete>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onBlur(value) {
    		throw new Error("<SimpleAutocomplete>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onCreate() {
    		throw new Error("<SimpleAutocomplete>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onCreate(value) {
    		throw new Error("<SimpleAutocomplete>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selectFirstIfEmpty() {
    		throw new Error("<SimpleAutocomplete>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selectFirstIfEmpty(value) {
    		throw new Error("<SimpleAutocomplete>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get minCharactersToSearch() {
    		throw new Error("<SimpleAutocomplete>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set minCharactersToSearch(value) {
    		throw new Error("<SimpleAutocomplete>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get maxItemsToShowInList() {
    		throw new Error("<SimpleAutocomplete>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set maxItemsToShowInList(value) {
    		throw new Error("<SimpleAutocomplete>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get multiple() {
    		throw new Error("<SimpleAutocomplete>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set multiple(value) {
    		throw new Error("<SimpleAutocomplete>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get create() {
    		throw new Error("<SimpleAutocomplete>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set create(value) {
    		throw new Error("<SimpleAutocomplete>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ignoreAccents() {
    		throw new Error("<SimpleAutocomplete>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ignoreAccents(value) {
    		throw new Error("<SimpleAutocomplete>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get matchAllKeywords() {
    		throw new Error("<SimpleAutocomplete>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set matchAllKeywords(value) {
    		throw new Error("<SimpleAutocomplete>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get sortByMatchedKeywords() {
    		throw new Error("<SimpleAutocomplete>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set sortByMatchedKeywords(value) {
    		throw new Error("<SimpleAutocomplete>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get itemFilterFunction() {
    		throw new Error("<SimpleAutocomplete>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set itemFilterFunction(value) {
    		throw new Error("<SimpleAutocomplete>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get itemSortFunction() {
    		throw new Error("<SimpleAutocomplete>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set itemSortFunction(value) {
    		throw new Error("<SimpleAutocomplete>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get lock() {
    		throw new Error("<SimpleAutocomplete>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set lock(value) {
    		throw new Error("<SimpleAutocomplete>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get delay() {
    		throw new Error("<SimpleAutocomplete>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set delay(value) {
    		throw new Error("<SimpleAutocomplete>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get localFiltering() {
    		throw new Error("<SimpleAutocomplete>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set localFiltering(value) {
    		throw new Error("<SimpleAutocomplete>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hideArrow() {
    		throw new Error("<SimpleAutocomplete>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hideArrow(value) {
    		throw new Error("<SimpleAutocomplete>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get showClear() {
    		throw new Error("<SimpleAutocomplete>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set showClear(value) {
    		throw new Error("<SimpleAutocomplete>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get showLoadingIndicator() {
    		throw new Error("<SimpleAutocomplete>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set showLoadingIndicator(value) {
    		throw new Error("<SimpleAutocomplete>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get noResultsText() {
    		throw new Error("<SimpleAutocomplete>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set noResultsText(value) {
    		throw new Error("<SimpleAutocomplete>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get loadingText() {
    		throw new Error("<SimpleAutocomplete>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set loadingText(value) {
    		throw new Error("<SimpleAutocomplete>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get createText() {
    		throw new Error("<SimpleAutocomplete>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set createText(value) {
    		throw new Error("<SimpleAutocomplete>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get placeholder() {
    		throw new Error("<SimpleAutocomplete>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set placeholder(value) {
    		throw new Error("<SimpleAutocomplete>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get className() {
    		throw new Error("<SimpleAutocomplete>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set className(value) {
    		throw new Error("<SimpleAutocomplete>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inputClassName() {
    		throw new Error("<SimpleAutocomplete>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inputClassName(value) {
    		throw new Error("<SimpleAutocomplete>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inputId() {
    		throw new Error("<SimpleAutocomplete>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inputId(value) {
    		throw new Error("<SimpleAutocomplete>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get name() {
    		throw new Error("<SimpleAutocomplete>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<SimpleAutocomplete>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selectName() {
    		throw new Error("<SimpleAutocomplete>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selectName(value) {
    		throw new Error("<SimpleAutocomplete>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selectId() {
    		throw new Error("<SimpleAutocomplete>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selectId(value) {
    		throw new Error("<SimpleAutocomplete>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<SimpleAutocomplete>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<SimpleAutocomplete>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get html5autocomplete() {
    		throw new Error("<SimpleAutocomplete>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set html5autocomplete(value) {
    		throw new Error("<SimpleAutocomplete>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get readonly() {
    		throw new Error("<SimpleAutocomplete>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set readonly(value) {
    		throw new Error("<SimpleAutocomplete>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dropdownClassName() {
    		throw new Error("<SimpleAutocomplete>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dropdownClassName(value) {
    		throw new Error("<SimpleAutocomplete>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<SimpleAutocomplete>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<SimpleAutocomplete>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get debug() {
    		throw new Error("<SimpleAutocomplete>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set debug(value) {
    		throw new Error("<SimpleAutocomplete>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selectedItem() {
    		throw new Error("<SimpleAutocomplete>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selectedItem(value) {
    		throw new Error("<SimpleAutocomplete>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<SimpleAutocomplete>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<SimpleAutocomplete>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get highlightedItem() {
    		throw new Error("<SimpleAutocomplete>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set highlightedItem(value) {
    		throw new Error("<SimpleAutocomplete>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get text() {
    		throw new Error("<SimpleAutocomplete>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set text(value) {
    		throw new Error("<SimpleAutocomplete>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get highlightFilter() {
    		return this.$$.ctx[72];
    	}

    	set highlightFilter(value) {
    		throw new Error("<SimpleAutocomplete>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }

    function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }
    function fly(node, { delay = 0, duration = 400, easing = cubicOut, x = 0, y = 0, opacity = 0 } = {}) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const transform = style.transform === 'none' ? '' : style.transform;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (t, u) => `
			transform: ${transform} translate(${(1 - t) * x}px, ${(1 - t) * y}px);
			opacity: ${target_opacity - (od * u)}`
        };
    }

    function createTags() {
    	const { subscribe, update, set } = writable([]);

    	return {
    		subscribe,
    		push: (tag) => update((tags) => [...tags, tag].filter(Boolean)),
    		remove: (tag) => update((tags) => tags.filter((it) => it !== tag)),
    		reset: () => set([])
    	};
    }

    const newTags = createTags();

    const tags = writable([]);

    // TODO: should be derived
    function createSelectedTags() {
    	const { subscribe, update, set } = writable([]);
    	return {
    		subscribe,
    		push: (tag) => update((tags) => [...tags, tag]),
    		remove: (tag) => update((tags) => tags.filter((it) => it.id !== tag.id)),
    		set,
    		update
    	};
    }

    const selectedTags = createSelectedTags();

    /* src/assets/icons/close-transparent.svelte generated by Svelte v3.46.4 */

    const file$j = "src/assets/icons/close-transparent.svelte";

    function create_fragment$k(ctx) {
    	let svg;
    	let title;
    	let t0;
    	let desc;
    	let t1;
    	let defs;
    	let g1;
    	let g0;
    	let polygon;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			title = svg_element("title");
    			t0 = text("delete_md");
    			desc = svg_element("desc");
    			t1 = text("Created with Sketch.");
    			defs = svg_element("defs");
    			g1 = svg_element("g");
    			g0 = svg_element("g");
    			polygon = svg_element("polygon");
    			add_location(title, file$j, 9, 1, 233);
    			add_location(desc, file$j, 10, 1, 259);
    			add_location(defs, file$j, 11, 1, 294);
    			attr_dev(polygon, "id", "Shape");
    			attr_dev(polygon, "points", "14 1.41 12.59 0 7 5.59 1.41 0 0 1.41 5.59 7 0 12.59 1.41 14 7 8.41 12.59 14 14 12.59 8.41 7");
    			add_location(polygon, file$j, 14, 3, 484);
    			attr_dev(g0, "id", "delete_md");
    			attr_dev(g0, "transform", "translate(3.000000, 3.000000)");
    			attr_dev(g0, "fill", "#000000");
    			attr_dev(g0, "fill-rule", "nonzero");
    			add_location(g0, file$j, 13, 2, 385);
    			attr_dev(g1, "id", "Page-1");
    			attr_dev(g1, "stroke", "none");
    			attr_dev(g1, "stroke-width", "1");
    			attr_dev(g1, "fill", "none");
    			attr_dev(g1, "fill-rule", "evenodd");
    			add_location(g1, file$j, 12, 1, 304);
    			attr_dev(svg, "width", "20px");
    			attr_dev(svg, "height", "20px");
    			attr_dev(svg, "viewBox", "0 0 20 20");
    			attr_dev(svg, "version", "1.1");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "xmlns:xlink", "http://www.w3.org/1999/xlink");
    			add_location(svg, file$j, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, title);
    			append_dev(title, t0);
    			append_dev(svg, desc);
    			append_dev(desc, t1);
    			append_dev(svg, defs);
    			append_dev(svg, g1);
    			append_dev(g1, g0);
    			append_dev(g0, polygon);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$k.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$k($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Close_transparent', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Close_transparent> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Close_transparent extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$k, create_fragment$k, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Close_transparent",
    			options,
    			id: create_fragment$k.name
    		});
    	}
    }

    /* src/assets/icons/close-round.svelte generated by Svelte v3.46.4 */

    const file$i = "src/assets/icons/close-round.svelte";

    function create_fragment$j(ctx) {
    	let svg;
    	let title;
    	let t0;
    	let desc;
    	let t1;
    	let defs;
    	let g1;
    	let g0;
    	let circle;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			title = svg_element("title");
    			t0 = text("delete_round_ios");
    			desc = svg_element("desc");
    			t1 = text("Created with Sketch.");
    			defs = svg_element("defs");
    			g1 = svg_element("g");
    			g0 = svg_element("g");
    			circle = svg_element("circle");
    			path = svg_element("path");
    			add_location(title, file$i, 3, 4, 233);
    			add_location(desc, file$i, 4, 4, 269);
    			add_location(defs, file$i, 5, 4, 307);
    			attr_dev(circle, "id", "Oval");
    			attr_dev(circle, "fill", "#000000");
    			attr_dev(circle, "cx", "14");
    			attr_dev(circle, "cy", "14");
    			attr_dev(circle, "r", "14");
    			add_location(circle, file$i, 8, 12, 514);
    			attr_dev(path, "d", "M14,11.8786797 L18.9393398,6.93933983 L21.0606602,9.06066017 L16.1213203,14 L21.0606602,18.9393398 L18.9393398,21.0606602 L14,16.1213203 L9.06066017,21.0606602 L6.93933983,18.9393398 L11.8786797,14 L6.93933983,9.06066017 L9.06066017,6.93933983 L14,11.8786797 Z");
    			attr_dev(path, "id", "Combined-Shape");
    			attr_dev(path, "fill", "#FFFFFF");
    			add_location(path, file$i, 9, 12, 592);
    			attr_dev(g0, "id", "delete_round_ios");
    			attr_dev(g0, "transform", "translate(-4.000000, -4.000000)");
    			attr_dev(g0, "fill-rule", "nonzero");
    			add_location(g0, file$i, 7, 8, 412);
    			attr_dev(g1, "id", "Page-1");
    			attr_dev(g1, "stroke", "none");
    			attr_dev(g1, "stroke-width", "1");
    			attr_dev(g1, "fill", "none");
    			attr_dev(g1, "fill-rule", "evenodd");
    			add_location(g1, file$i, 6, 4, 325);
    			attr_dev(svg, "width", "20px");
    			attr_dev(svg, "height", "20px");
    			attr_dev(svg, "viewBox", "0 0 20 20");
    			attr_dev(svg, "version", "1.1");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "xmlns:xlink", "http://www.w3.org/1999/xlink");
    			add_location(svg, file$i, 1, 0, 1);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, title);
    			append_dev(title, t0);
    			append_dev(svg, desc);
    			append_dev(desc, t1);
    			append_dev(svg, defs);
    			append_dev(svg, g1);
    			append_dev(g1, g0);
    			append_dev(g0, circle);
    			append_dev(g0, path);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$j.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$j($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Close_round', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Close_round> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Close_round extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$j, create_fragment$j, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Close_round",
    			options,
    			id: create_fragment$j.name
    		});
    	}
    }

    /* src/lib/icon.svelte generated by Svelte v3.46.4 */
    const file$h = "src/lib/icon.svelte";

    function create_fragment$i(ctx) {
    	let i;
    	let switch_instance;
    	let current;
    	var switch_value = /*icons*/ ctx[1][/*icon*/ ctx[0]];

    	function switch_props(ctx) {
    		return { $$inline: true };
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		c: function create() {
    			i = element("i");
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			attr_dev(i, "class", "icon-wrapper svelte-dzmv56");
    			add_location(i, file$h, 12, 0, 258);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);

    			if (switch_instance) {
    				mount_component(switch_instance, i, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (switch_value !== (switch_value = /*icons*/ ctx[1][/*icon*/ ctx[0]])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, i, null);
    				} else {
    					switch_instance = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    			if (switch_instance) destroy_component(switch_instance);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$i($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Icon', slots, []);

    	const icons = {
    		close: Close_round,
    		'close-transparent': Close_transparent
    	};

    	let { icon } = $$props;
    	const writable_props = ['icon'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Icon> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('icon' in $$props) $$invalidate(0, icon = $$props.icon);
    	};

    	$$self.$capture_state = () => ({
    		CloseTransparent: Close_transparent,
    		CloseRound: Close_round,
    		icons,
    		icon
    	});

    	$$self.$inject_state = $$props => {
    		if ('icon' in $$props) $$invalidate(0, icon = $$props.icon);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [icon, icons];
    }

    class Icon extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$i, create_fragment$i, safe_not_equal, { icon: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Icon",
    			options,
    			id: create_fragment$i.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*icon*/ ctx[0] === undefined && !('icon' in props)) {
    			console.warn("<Icon> was created without expected prop 'icon'");
    		}
    	}

    	get icon() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set icon(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/lib/chip.svelte generated by Svelte v3.46.4 */
    const file$g = "src/lib/chip.svelte";

    // (19:1) {#if closable}
    function create_if_block$3(ctx) {
    	let div;
    	let icon;
    	let current;
    	let mounted;
    	let dispose;

    	icon = new Icon({
    			props: { icon: "close-transparent" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(icon.$$.fragment);
    			attr_dev(div, "class", "chip-delete svelte-pknema");
    			add_location(div, file$g, 19, 2, 331);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(icon, div, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div, "click", /*handleClick*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(icon);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(19:1) {#if closable}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$h(ctx) {
    	let div1;
    	let div0;
    	let t0;
    	let t1;
    	let current;
    	let if_block = /*closable*/ ctx[1] && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			t0 = text(/*chip*/ ctx[0]);
    			t1 = space();
    			if (if_block) if_block.c();
    			attr_dev(div0, "class", "chip-label svelte-pknema");
    			add_location(div0, file$g, 15, 1, 271);
    			attr_dev(div1, "class", "chip svelte-pknema");
    			add_location(div1, file$g, 14, 0, 251);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, t0);
    			append_dev(div1, t1);
    			if (if_block) if_block.m(div1, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*chip*/ 1) set_data_dev(t0, /*chip*/ ctx[0]);

    			if (/*closable*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*closable*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$3(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div1, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Chip', slots, []);
    	const dispatch = createEventDispatcher();
    	let { chip = {} } = $$props;
    	let { closable } = $$props;

    	function handleClick() {
    		dispatch('close', chip);
    	}

    	const writable_props = ['chip', 'closable'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Chip> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('chip' in $$props) $$invalidate(0, chip = $$props.chip);
    		if ('closable' in $$props) $$invalidate(1, closable = $$props.closable);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		Icon,
    		dispatch,
    		chip,
    		closable,
    		handleClick
    	});

    	$$self.$inject_state = $$props => {
    		if ('chip' in $$props) $$invalidate(0, chip = $$props.chip);
    		if ('closable' in $$props) $$invalidate(1, closable = $$props.closable);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [chip, closable, handleClick];
    }

    class Chip extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$h, create_fragment$h, safe_not_equal, { chip: 0, closable: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Chip",
    			options,
    			id: create_fragment$h.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*closable*/ ctx[1] === undefined && !('closable' in props)) {
    			console.warn("<Chip> was created without expected prop 'closable'");
    		}
    	}

    	get chip() {
    		throw new Error("<Chip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set chip(value) {
    		throw new Error("<Chip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get closable() {
    		throw new Error("<Chip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set closable(value) {
    		throw new Error("<Chip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/lib/chips.svelte generated by Svelte v3.46.4 */
    const file$f = "src/lib/chips.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    // (17:1) {#each chips as chip}
    function create_each_block$1(ctx) {
    	let chip;
    	let current;

    	chip = new Chip({
    			props: {
    				chip: /*chip*/ ctx[4],
    				closable: /*closable*/ ctx[1]
    			},
    			$$inline: true
    		});

    	chip.$on("close", /*handleClose*/ ctx[2]);

    	const block = {
    		c: function create() {
    			create_component(chip.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(chip, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const chip_changes = {};
    			if (dirty & /*chips*/ 1) chip_changes.chip = /*chip*/ ctx[4];
    			if (dirty & /*closable*/ 2) chip_changes.closable = /*closable*/ ctx[1];
    			chip.$set(chip_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(chip.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(chip.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(chip, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(17:1) {#each chips as chip}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$g(ctx) {
    	let div;
    	let current;
    	let each_value = /*chips*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "chips svelte-spdhzl");
    			add_location(div, file$f, 15, 0, 307);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*chips, closable, handleClose*/ 7) {
    				each_value = /*chips*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Chips', slots, []);
    	const dispatch = createEventDispatcher();
    	let { chips = [] } = $$props;
    	let { closable = false } = $$props;

    	function handleClose(e) {
    		$$invalidate(0, chips = chips.filter(it => it !== e.detail));
    		dispatch('close', e);
    	}

    	const writable_props = ['chips', 'closable'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Chips> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('chips' in $$props) $$invalidate(0, chips = $$props.chips);
    		if ('closable' in $$props) $$invalidate(1, closable = $$props.closable);
    	};

    	$$self.$capture_state = () => ({
    		Chip,
    		createEventDispatcher,
    		dispatch,
    		chips,
    		closable,
    		handleClose
    	});

    	$$self.$inject_state = $$props => {
    		if ('chips' in $$props) $$invalidate(0, chips = $$props.chips);
    		if ('closable' in $$props) $$invalidate(1, closable = $$props.closable);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [chips, closable, handleClose];
    }

    class Chips extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, { chips: 0, closable: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Chips",
    			options,
    			id: create_fragment$g.name
    		});
    	}

    	get chips() {
    		throw new Error("<Chips>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set chips(value) {
    		throw new Error("<Chips>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get closable() {
    		throw new Error("<Chips>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set closable(value) {
    		throw new Error("<Chips>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/lib/search-block.svelte generated by Svelte v3.46.4 */
    const file$e = "src/lib/search-block.svelte";

    function create_fragment$f(ctx) {
    	let div1;
    	let div0;
    	let autocomplete;
    	let updating_selectedItem;
    	let div0_transition;
    	let t;
    	let chips;
    	let current;

    	function autocomplete_selectedItem_binding(value) {
    		/*autocomplete_selectedItem_binding*/ ctx[4](value);
    	}

    	let autocomplete_props = {
    		items: /*$tags*/ ctx[1],
    		labelFieldName: "name",
    		multiple: true
    	};

    	if (/*$selectedTags*/ ctx[2] !== void 0) {
    		autocomplete_props.selectedItem = /*$selectedTags*/ ctx[2];
    	}

    	autocomplete = new SimpleAutocomplete({
    			props: autocomplete_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(autocomplete, 'selectedItem', autocomplete_selectedItem_binding));

    	chips = new Chips({
    			props: {
    				chips: /*$selectedTags*/ ctx[2].map(func$1),
    				closable: true
    			},
    			$$inline: true
    		});

    	chips.$on("close", /*handleUnselectTag*/ ctx[3]);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			create_component(autocomplete.$$.fragment);
    			t = space();
    			create_component(chips.$$.fragment);
    			attr_dev(div0, "class", "wrapper svelte-1m4x6ls");
    			add_location(div0, file$e, 24, 1, 569);
    			attr_dev(div1, "class", "search-block-wrapper svelte-1m4x6ls");
    			add_location(div1, file$e, 23, 0, 533);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			mount_component(autocomplete, div0, null);
    			/*div0_binding*/ ctx[5](div0);
    			append_dev(div1, t);
    			mount_component(chips, div1, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const autocomplete_changes = {};
    			if (dirty & /*$tags*/ 2) autocomplete_changes.items = /*$tags*/ ctx[1];

    			if (!updating_selectedItem && dirty & /*$selectedTags*/ 4) {
    				updating_selectedItem = true;
    				autocomplete_changes.selectedItem = /*$selectedTags*/ ctx[2];
    				add_flush_callback(() => updating_selectedItem = false);
    			}

    			autocomplete.$set(autocomplete_changes);
    			const chips_changes = {};
    			if (dirty & /*$selectedTags*/ 4) chips_changes.chips = /*$selectedTags*/ ctx[2].map(func$1);
    			chips.$set(chips_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(autocomplete.$$.fragment, local);

    			add_render_callback(() => {
    				if (!div0_transition) div0_transition = create_bidirectional_transition(div0, fade, { duration: 1000 }, true);
    				div0_transition.run(1);
    			});

    			transition_in(chips.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(autocomplete.$$.fragment, local);
    			if (!div0_transition) div0_transition = create_bidirectional_transition(div0, fade, { duration: 1000 }, false);
    			div0_transition.run(0);
    			transition_out(chips.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(autocomplete);
    			/*div0_binding*/ ctx[5](null);
    			if (detaching && div0_transition) div0_transition.end();
    			destroy_component(chips);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const func$1 = it => it.name;

    function instance$f($$self, $$props, $$invalidate) {
    	let $tags;
    	let $selectedTags;
    	validate_store(tags, 'tags');
    	component_subscribe($$self, tags, $$value => $$invalidate(1, $tags = $$value));
    	validate_store(selectedTags, 'selectedTags');
    	component_subscribe($$self, selectedTags, $$value => $$invalidate(2, $selectedTags = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Search_block', slots, []);
    	fetch('/tags').then(res => res.json()).then(data => set_store_value(tags, $tags = data, $tags));

    	function handleUnselectTag(e) {
    		const tag = $tags.find(it => it.name === e.detail.detail);
    		selectedTags.remove(tag);
    	}

    	let ref;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Search_block> was created with unknown prop '${key}'`);
    	});

    	function autocomplete_selectedItem_binding(value) {
    		$selectedTags = value;
    		selectedTags.set($selectedTags);
    	}

    	function div0_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			ref = $$value;
    			$$invalidate(0, ref);
    		});
    	}

    	$$self.$capture_state = () => ({
    		AutoComplete: SimpleAutocomplete,
    		fade,
    		tags,
    		selectedTags,
    		Chips,
    		handleUnselectTag,
    		ref,
    		$tags,
    		$selectedTags
    	});

    	$$self.$inject_state = $$props => {
    		if ('ref' in $$props) $$invalidate(0, ref = $$props.ref);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*ref*/ 1) {
    			if (ref) {
    				ref.querySelectorAll('span.autocomplete-clear-button')[0].textContent = '';
    			}
    		}
    	};

    	return [
    		ref,
    		$tags,
    		$selectedTags,
    		handleUnselectTag,
    		autocomplete_selectedItem_binding,
    		div0_binding
    	];
    }

    class Search_block extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Search_block",
    			options,
    			id: create_fragment$f.name
    		});
    	}
    }

    const recipes = writable([]);

    /* src/lib/recipe-row.svelte generated by Svelte v3.46.4 */

    const file$d = "src/lib/recipe-row.svelte";

    function create_fragment$e(ctx) {
    	let div2;
    	let div0;
    	let h3;
    	let t0_value = /*recipe*/ ctx[0].title + "";
    	let t0;
    	let t1;
    	let chips;
    	let t2;
    	let div1;
    	let span;
    	let t3_value = /*recipe*/ ctx[0].time + "";
    	let t3;
    	let current;
    	let mounted;
    	let dispose;

    	chips = new Chips({
    			props: { chips: /*recipe*/ ctx[0].tags.map(func) },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			h3 = element("h3");
    			t0 = text(t0_value);
    			t1 = space();
    			create_component(chips.$$.fragment);
    			t2 = space();
    			div1 = element("div");
    			span = element("span");
    			t3 = text(t3_value);
    			attr_dev(h3, "class", "recipe-title svelte-o0u123");
    			add_location(h3, file$d, 15, 4, 370);
    			attr_dev(div0, "class", "recipe-left svelte-o0u123");
    			add_location(div0, file$d, 14, 2, 340);
    			attr_dev(span, "class", "recipe-time svelte-o0u123");
    			add_location(span, file$d, 19, 4, 512);
    			attr_dev(div1, "class", "recipe-right svelte-o0u123");
    			add_location(div1, file$d, 18, 2, 481);
    			attr_dev(div2, "class", "recipe-row svelte-o0u123");
    			add_location(div2, file$d, 13, 0, 289);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div0, h3);
    			append_dev(h3, t0);
    			append_dev(div0, t1);
    			mount_component(chips, div0, null);
    			append_dev(div2, t2);
    			append_dev(div2, div1);
    			append_dev(div1, span);
    			append_dev(span, t3);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div2, "click", /*handleSelect*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if ((!current || dirty & /*recipe*/ 1) && t0_value !== (t0_value = /*recipe*/ ctx[0].title + "")) set_data_dev(t0, t0_value);
    			const chips_changes = {};
    			if (dirty & /*recipe*/ 1) chips_changes.chips = /*recipe*/ ctx[0].tags.map(func);
    			chips.$set(chips_changes);
    			if ((!current || dirty & /*recipe*/ 1) && t3_value !== (t3_value = /*recipe*/ ctx[0].time + "")) set_data_dev(t3, t3_value);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(chips.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(chips.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			destroy_component(chips);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const func = it => it.name;

    function instance$e($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Recipe_row', slots, []);
    	let { recipe = {} } = $$props;

    	function handleSelect() {
    		// goto(`/recipe?id=${recipe.id}`);
    		push(`/recipe?id=${recipe.id}`);
    	}

    	const writable_props = ['recipe'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Recipe_row> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('recipe' in $$props) $$invalidate(0, recipe = $$props.recipe);
    	};

    	$$self.$capture_state = () => ({ push, Chips, recipe, handleSelect });

    	$$self.$inject_state = $$props => {
    		if ('recipe' in $$props) $$invalidate(0, recipe = $$props.recipe);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [recipe, handleSelect];
    }

    class Recipe_row extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, { recipe: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Recipe_row",
    			options,
    			id: create_fragment$e.name
    		});
    	}

    	get recipe() {
    		throw new Error("<Recipe_row>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set recipe(value) {
    		throw new Error("<Recipe_row>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/lib/intersection-observer.svelte generated by Svelte v3.46.4 */

    const get_default_slot_changes = dirty => ({
    	intersecting: dirty & /*intersecting*/ 1,
    	entry: dirty & /*entry*/ 2,
    	observer: dirty & /*observer*/ 4
    });

    const get_default_slot_context = ctx => ({
    	intersecting: /*intersecting*/ ctx[0],
    	entry: /*entry*/ ctx[1],
    	observer: /*observer*/ ctx[2]
    });

    function create_fragment$d(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], get_default_slot_context);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, intersecting, entry, observer*/ 263)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[8],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[8])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[8], dirty, get_default_slot_changes),
    						get_default_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Intersection_observer', slots, ['default']);
    	let { element = null } = $$props;
    	let { once = false } = $$props;
    	let { intersecting = false } = $$props;
    	let { root = null } = $$props;
    	let { rootMargin = '0px' } = $$props;
    	let { threshold = 0 } = $$props;
    	let { entry = null } = $$props;
    	let { observer = null } = $$props;
    	const dispatch = createEventDispatcher();
    	let prevRootMargin = null;
    	let prevElement = null;

    	const initialize = () => {
    		$$invalidate(2, observer = new IntersectionObserver(entries => {
    				entries.forEach(_entry => {
    					$$invalidate(1, entry = _entry);
    					$$invalidate(0, intersecting = _entry.isIntersecting);
    				});
    			},
    		{ root, rootMargin, threshold }));
    	};

    	onMount(() => {
    		initialize();

    		return () => {
    			if (observer) {
    				observer.disconnect();
    				$$invalidate(2, observer = null);
    			}
    		};
    	});

    	afterUpdate(async () => {
    		if (entry !== null) {
    			dispatch('observe', entry);

    			if (entry.isIntersecting) {
    				dispatch('intersect', entry);
    				if (once) observer.unobserve(element);
    			}
    		}

    		await tick();

    		if (element !== null && element !== prevElement) {
    			observer.observe(element);
    			if (prevElement !== null) observer.unobserve(prevElement);
    			prevElement = element;
    		}

    		if (prevRootMargin && rootMargin !== prevRootMargin) {
    			observer.disconnect();
    			prevElement = null;
    			initialize();
    		}

    		prevRootMargin = rootMargin;
    	});

    	const writable_props = [
    		'element',
    		'once',
    		'intersecting',
    		'root',
    		'rootMargin',
    		'threshold',
    		'entry',
    		'observer'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Intersection_observer> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('element' in $$props) $$invalidate(3, element = $$props.element);
    		if ('once' in $$props) $$invalidate(4, once = $$props.once);
    		if ('intersecting' in $$props) $$invalidate(0, intersecting = $$props.intersecting);
    		if ('root' in $$props) $$invalidate(5, root = $$props.root);
    		if ('rootMargin' in $$props) $$invalidate(6, rootMargin = $$props.rootMargin);
    		if ('threshold' in $$props) $$invalidate(7, threshold = $$props.threshold);
    		if ('entry' in $$props) $$invalidate(1, entry = $$props.entry);
    		if ('observer' in $$props) $$invalidate(2, observer = $$props.observer);
    		if ('$$scope' in $$props) $$invalidate(8, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		element,
    		once,
    		intersecting,
    		root,
    		rootMargin,
    		threshold,
    		entry,
    		observer,
    		tick,
    		createEventDispatcher,
    		afterUpdate,
    		onMount,
    		dispatch,
    		prevRootMargin,
    		prevElement,
    		initialize
    	});

    	$$self.$inject_state = $$props => {
    		if ('element' in $$props) $$invalidate(3, element = $$props.element);
    		if ('once' in $$props) $$invalidate(4, once = $$props.once);
    		if ('intersecting' in $$props) $$invalidate(0, intersecting = $$props.intersecting);
    		if ('root' in $$props) $$invalidate(5, root = $$props.root);
    		if ('rootMargin' in $$props) $$invalidate(6, rootMargin = $$props.rootMargin);
    		if ('threshold' in $$props) $$invalidate(7, threshold = $$props.threshold);
    		if ('entry' in $$props) $$invalidate(1, entry = $$props.entry);
    		if ('observer' in $$props) $$invalidate(2, observer = $$props.observer);
    		if ('prevRootMargin' in $$props) prevRootMargin = $$props.prevRootMargin;
    		if ('prevElement' in $$props) prevElement = $$props.prevElement;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		intersecting,
    		entry,
    		observer,
    		element,
    		once,
    		root,
    		rootMargin,
    		threshold,
    		$$scope,
    		slots
    	];
    }

    class Intersection_observer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {
    			element: 3,
    			once: 4,
    			intersecting: 0,
    			root: 5,
    			rootMargin: 6,
    			threshold: 7,
    			entry: 1,
    			observer: 2
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Intersection_observer",
    			options,
    			id: create_fragment$d.name
    		});
    	}

    	get element() {
    		throw new Error("<Intersection_observer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set element(value) {
    		throw new Error("<Intersection_observer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get once() {
    		throw new Error("<Intersection_observer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set once(value) {
    		throw new Error("<Intersection_observer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get intersecting() {
    		throw new Error("<Intersection_observer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set intersecting(value) {
    		throw new Error("<Intersection_observer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get root() {
    		throw new Error("<Intersection_observer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set root(value) {
    		throw new Error("<Intersection_observer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rootMargin() {
    		throw new Error("<Intersection_observer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rootMargin(value) {
    		throw new Error("<Intersection_observer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get threshold() {
    		throw new Error("<Intersection_observer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set threshold(value) {
    		throw new Error("<Intersection_observer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get entry() {
    		throw new Error("<Intersection_observer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set entry(value) {
    		throw new Error("<Intersection_observer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get observer() {
    		throw new Error("<Intersection_observer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set observer(value) {
    		throw new Error("<Intersection_observer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/lib/fade.svelte generated by Svelte v3.46.4 */
    const file$c = "src/lib/fade.svelte";

    // (12:2) {#if intersecting}
    function create_if_block$2(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "fade-in svelte-j58kyl");
    			set_style(div, "--fade-from", /*distance*/ ctx[1]);
    			add_location(div, file$c, 12, 3, 299);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 32)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[5],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[5])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[5], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(12:2) {#if intersecting}",
    		ctx
    	});

    	return block;
    }

    // (10:0) <IntersectionObserver element={node} let:intersecting rootMargin="50px">
    function create_default_slot$2(ctx) {
    	let div;
    	let current;
    	let if_block = /*intersecting*/ ctx[6] && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			add_location(div, file$c, 10, 1, 252);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    			/*div_binding*/ ctx[4](div);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*intersecting*/ ctx[6]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*intersecting*/ 64) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$2(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    			/*div_binding*/ ctx[4](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(10:0) <IntersectionObserver element={node} let:intersecting rootMargin=\\\"50px\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$c(ctx) {
    	let intersectionobserver;
    	let current;

    	intersectionobserver = new Intersection_observer({
    			props: {
    				element: /*node*/ ctx[0],
    				rootMargin: "50px",
    				$$slots: {
    					default: [
    						create_default_slot$2,
    						({ intersecting }) => ({ 6: intersecting }),
    						({ intersecting }) => intersecting ? 64 : 0
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(intersectionobserver.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(intersectionobserver, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const intersectionobserver_changes = {};
    			if (dirty & /*node*/ 1) intersectionobserver_changes.element = /*node*/ ctx[0];

    			if (dirty & /*$$scope, node, intersecting*/ 97) {
    				intersectionobserver_changes.$$scope = { dirty, ctx };
    			}

    			intersectionobserver.$set(intersectionobserver_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(intersectionobserver.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(intersectionobserver.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(intersectionobserver, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Fade', slots, ['default']);
    	let node;
    	let { fromLeft = false } = $$props;
    	const distance = fromLeft ? '-50px' : '50px';
    	const writable_props = ['fromLeft'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Fade> was created with unknown prop '${key}'`);
    	});

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			node = $$value;
    			$$invalidate(0, node);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('fromLeft' in $$props) $$invalidate(2, fromLeft = $$props.fromLeft);
    		if ('$$scope' in $$props) $$invalidate(5, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		IntersectionObserver: Intersection_observer,
    		node,
    		fromLeft,
    		distance
    	});

    	$$self.$inject_state = $$props => {
    		if ('node' in $$props) $$invalidate(0, node = $$props.node);
    		if ('fromLeft' in $$props) $$invalidate(2, fromLeft = $$props.fromLeft);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [node, distance, fromLeft, slots, div_binding, $$scope];
    }

    class Fade extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, { fromLeft: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Fade",
    			options,
    			id: create_fragment$c.name
    		});
    	}

    	get fromLeft() {
    		throw new Error("<Fade>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fromLeft(value) {
    		throw new Error("<Fade>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/lib/recipe-list.svelte generated by Svelte v3.46.4 */
    const file$b = "src/lib/recipe-list.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	child_ctx[4] = i;
    	return child_ctx;
    }

    // (16:2) <Fade fromLeft={i % 2 === 0}>
    function create_default_slot$1(ctx) {
    	let div;
    	let reciperow;
    	let t;
    	let current;

    	reciperow = new Recipe_row({
    			props: { recipe: /*recipe*/ ctx[2] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(reciperow.$$.fragment);
    			t = space();
    			attr_dev(div, "class", "recipe-row svelte-1felyyb");
    			add_location(div, file$b, 16, 3, 467);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(reciperow, div, null);
    			insert_dev(target, t, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const reciperow_changes = {};
    			if (dirty & /*$recipes*/ 1) reciperow_changes.recipe = /*recipe*/ ctx[2];
    			reciperow.$set(reciperow_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(reciperow.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(reciperow.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(reciperow);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(16:2) <Fade fromLeft={i % 2 === 0}>",
    		ctx
    	});

    	return block;
    }

    // (15:1) {#each $recipes as recipe, i}
    function create_each_block(ctx) {
    	let fade;
    	let current;

    	fade = new Fade({
    			props: {
    				fromLeft: /*i*/ ctx[4] % 2 === 0,
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(fade.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(fade, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const fade_changes = {};

    			if (dirty & /*$$scope, $recipes*/ 33) {
    				fade_changes.$$scope = { dirty, ctx };
    			}

    			fade.$set(fade_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fade.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fade.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(fade, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(15:1) {#each $recipes as recipe, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let div;
    	let current;
    	let each_value = /*$recipes*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "recipe-list svelte-1felyyb");
    			add_location(div, file$b, 13, 0, 375);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$recipes*/ 1) {
    				each_value = /*$recipes*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let $recipes;
    	let $selectedTags;
    	validate_store(recipes, 'recipes');
    	component_subscribe($$self, recipes, $$value => $$invalidate(0, $recipes = $$value));
    	validate_store(selectedTags, 'selectedTags');
    	component_subscribe($$self, selectedTags, $$value => $$invalidate(1, $selectedTags = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Recipe_list', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Recipe_list> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		recipes,
    		selectedTags,
    		RecipeRow: Recipe_row,
    		Fade,
    		$recipes,
    		$selectedTags
    	});

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$selectedTags*/ 2) {
    			if ($selectedTags.length > 0) {
    				fetch('/recipes?tags=' + $selectedTags.map(it => it.id).join(',')).then(res => res.json()).then(data => set_store_value(recipes, $recipes = data, $recipes));
    			}
    		}
    	};

    	return [$recipes, $selectedTags];
    }

    class Recipe_list extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Recipe_list",
    			options,
    			id: create_fragment$b.name
    		});
    	}
    }

    /* src/lib/Draw.svelte generated by Svelte v3.46.4 */

    const file$a = "src/lib/Draw.svelte";

    function create_fragment$a(ctx) {
    	let svg;
    	let path0;
    	let path1;
    	let path2;
    	let path3;
    	let path4;
    	let path5;
    	let path6;
    	let path7;
    	let path8;
    	let path9;
    	let path10;
    	let path11;
    	let path12;
    	let path13;
    	let path14;
    	let path15;
    	let path16;
    	let path17;
    	let path18;
    	let path19;
    	let path20;
    	let path21;
    	let path22;
    	let path23;
    	let path24;
    	let path25;
    	let path26;
    	let path27;
    	let path28;
    	let path29;
    	let path30;
    	let path31;
    	let path32;
    	let path33;
    	let path34;
    	let path35;
    	let path36;
    	let path37;
    	let path38;
    	let path39;
    	let path40;
    	let path41;
    	let path42;
    	let path43;
    	let path44;
    	let path45;
    	let path46;
    	let path47;
    	let path48;
    	let path49;
    	let path50;
    	let path51;
    	let path52;
    	let path53;
    	let path54;
    	let path55;
    	let path56;
    	let path57;
    	let path58;
    	let path59;
    	let path60;
    	let path61;
    	let path62;
    	let path63;
    	let path64;
    	let path65;
    	let path66;
    	let path67;
    	let path68;
    	let path69;
    	let path70;
    	let path71;
    	let path72;
    	let path73;
    	let path74;
    	let path75;
    	let path76;
    	let path77;
    	let path78;
    	let path79;
    	let path80;
    	let path81;
    	let path82;
    	let path83;
    	let path84;
    	let path85;
    	let path86;
    	let path87;
    	let path88;
    	let path89;
    	let path90;
    	let path91;
    	let path92;
    	let path93;
    	let path94;
    	let path95;
    	let path96;
    	let path97;
    	let path98;
    	let path99;
    	let path100;
    	let path101;
    	let path102;
    	let path103;
    	let path104;
    	let path105;
    	let path106;
    	let path107;
    	let path108;
    	let path109;
    	let path110;
    	let path111;
    	let path112;
    	let path113;
    	let path114;
    	let path115;
    	let path116;
    	let path117;
    	let path118;
    	let path119;
    	let path120;
    	let path121;
    	let path122;
    	let path123;
    	let path124;
    	let path125;
    	let path126;
    	let path127;
    	let path128;
    	let path129;
    	let path130;
    	let path131;
    	let path132;
    	let path133;
    	let path134;
    	let path135;
    	let path136;
    	let path137;
    	let path138;
    	let path139;
    	let path140;
    	let path141;
    	let path142;
    	let path143;
    	let path144;
    	let path145;
    	let path146;
    	let path147;
    	let path148;
    	let path149;
    	let path150;
    	let path151;
    	let path152;
    	let path153;
    	let path154;
    	let path155;
    	let path156;
    	let path157;
    	let path158;
    	let path159;
    	let path160;
    	let path161;
    	let path162;
    	let path163;
    	let path164;
    	let path165;
    	let path166;
    	let path167;
    	let path168;
    	let path169;
    	let path170;
    	let path171;
    	let path172;
    	let path173;
    	let path174;
    	let path175;
    	let path176;
    	let path177;
    	let path178;
    	let path179;
    	let path180;
    	let path181;
    	let path182;
    	let path183;
    	let path184;
    	let path185;
    	let path186;
    	let path187;
    	let path188;
    	let path189;
    	let path190;
    	let path191;
    	let path192;
    	let path193;
    	let path194;
    	let path195;
    	let path196;
    	let path197;
    	let path198;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			path2 = svg_element("path");
    			path3 = svg_element("path");
    			path4 = svg_element("path");
    			path5 = svg_element("path");
    			path6 = svg_element("path");
    			path7 = svg_element("path");
    			path8 = svg_element("path");
    			path9 = svg_element("path");
    			path10 = svg_element("path");
    			path11 = svg_element("path");
    			path12 = svg_element("path");
    			path13 = svg_element("path");
    			path14 = svg_element("path");
    			path15 = svg_element("path");
    			path16 = svg_element("path");
    			path17 = svg_element("path");
    			path18 = svg_element("path");
    			path19 = svg_element("path");
    			path20 = svg_element("path");
    			path21 = svg_element("path");
    			path22 = svg_element("path");
    			path23 = svg_element("path");
    			path24 = svg_element("path");
    			path25 = svg_element("path");
    			path26 = svg_element("path");
    			path27 = svg_element("path");
    			path28 = svg_element("path");
    			path29 = svg_element("path");
    			path30 = svg_element("path");
    			path31 = svg_element("path");
    			path32 = svg_element("path");
    			path33 = svg_element("path");
    			path34 = svg_element("path");
    			path35 = svg_element("path");
    			path36 = svg_element("path");
    			path37 = svg_element("path");
    			path38 = svg_element("path");
    			path39 = svg_element("path");
    			path40 = svg_element("path");
    			path41 = svg_element("path");
    			path42 = svg_element("path");
    			path43 = svg_element("path");
    			path44 = svg_element("path");
    			path45 = svg_element("path");
    			path46 = svg_element("path");
    			path47 = svg_element("path");
    			path48 = svg_element("path");
    			path49 = svg_element("path");
    			path50 = svg_element("path");
    			path51 = svg_element("path");
    			path52 = svg_element("path");
    			path53 = svg_element("path");
    			path54 = svg_element("path");
    			path55 = svg_element("path");
    			path56 = svg_element("path");
    			path57 = svg_element("path");
    			path58 = svg_element("path");
    			path59 = svg_element("path");
    			path60 = svg_element("path");
    			path61 = svg_element("path");
    			path62 = svg_element("path");
    			path63 = svg_element("path");
    			path64 = svg_element("path");
    			path65 = svg_element("path");
    			path66 = svg_element("path");
    			path67 = svg_element("path");
    			path68 = svg_element("path");
    			path69 = svg_element("path");
    			path70 = svg_element("path");
    			path71 = svg_element("path");
    			path72 = svg_element("path");
    			path73 = svg_element("path");
    			path74 = svg_element("path");
    			path75 = svg_element("path");
    			path76 = svg_element("path");
    			path77 = svg_element("path");
    			path78 = svg_element("path");
    			path79 = svg_element("path");
    			path80 = svg_element("path");
    			path81 = svg_element("path");
    			path82 = svg_element("path");
    			path83 = svg_element("path");
    			path84 = svg_element("path");
    			path85 = svg_element("path");
    			path86 = svg_element("path");
    			path87 = svg_element("path");
    			path88 = svg_element("path");
    			path89 = svg_element("path");
    			path90 = svg_element("path");
    			path91 = svg_element("path");
    			path92 = svg_element("path");
    			path93 = svg_element("path");
    			path94 = svg_element("path");
    			path95 = svg_element("path");
    			path96 = svg_element("path");
    			path97 = svg_element("path");
    			path98 = svg_element("path");
    			path99 = svg_element("path");
    			path100 = svg_element("path");
    			path101 = svg_element("path");
    			path102 = svg_element("path");
    			path103 = svg_element("path");
    			path104 = svg_element("path");
    			path105 = svg_element("path");
    			path106 = svg_element("path");
    			path107 = svg_element("path");
    			path108 = svg_element("path");
    			path109 = svg_element("path");
    			path110 = svg_element("path");
    			path111 = svg_element("path");
    			path112 = svg_element("path");
    			path113 = svg_element("path");
    			path114 = svg_element("path");
    			path115 = svg_element("path");
    			path116 = svg_element("path");
    			path117 = svg_element("path");
    			path118 = svg_element("path");
    			path119 = svg_element("path");
    			path120 = svg_element("path");
    			path121 = svg_element("path");
    			path122 = svg_element("path");
    			path123 = svg_element("path");
    			path124 = svg_element("path");
    			path125 = svg_element("path");
    			path126 = svg_element("path");
    			path127 = svg_element("path");
    			path128 = svg_element("path");
    			path129 = svg_element("path");
    			path130 = svg_element("path");
    			path131 = svg_element("path");
    			path132 = svg_element("path");
    			path133 = svg_element("path");
    			path134 = svg_element("path");
    			path135 = svg_element("path");
    			path136 = svg_element("path");
    			path137 = svg_element("path");
    			path138 = svg_element("path");
    			path139 = svg_element("path");
    			path140 = svg_element("path");
    			path141 = svg_element("path");
    			path142 = svg_element("path");
    			path143 = svg_element("path");
    			path144 = svg_element("path");
    			path145 = svg_element("path");
    			path146 = svg_element("path");
    			path147 = svg_element("path");
    			path148 = svg_element("path");
    			path149 = svg_element("path");
    			path150 = svg_element("path");
    			path151 = svg_element("path");
    			path152 = svg_element("path");
    			path153 = svg_element("path");
    			path154 = svg_element("path");
    			path155 = svg_element("path");
    			path156 = svg_element("path");
    			path157 = svg_element("path");
    			path158 = svg_element("path");
    			path159 = svg_element("path");
    			path160 = svg_element("path");
    			path161 = svg_element("path");
    			path162 = svg_element("path");
    			path163 = svg_element("path");
    			path164 = svg_element("path");
    			path165 = svg_element("path");
    			path166 = svg_element("path");
    			path167 = svg_element("path");
    			path168 = svg_element("path");
    			path169 = svg_element("path");
    			path170 = svg_element("path");
    			path171 = svg_element("path");
    			path172 = svg_element("path");
    			path173 = svg_element("path");
    			path174 = svg_element("path");
    			path175 = svg_element("path");
    			path176 = svg_element("path");
    			path177 = svg_element("path");
    			path178 = svg_element("path");
    			path179 = svg_element("path");
    			path180 = svg_element("path");
    			path181 = svg_element("path");
    			path182 = svg_element("path");
    			path183 = svg_element("path");
    			path184 = svg_element("path");
    			path185 = svg_element("path");
    			path186 = svg_element("path");
    			path187 = svg_element("path");
    			path188 = svg_element("path");
    			path189 = svg_element("path");
    			path190 = svg_element("path");
    			path191 = svg_element("path");
    			path192 = svg_element("path");
    			path193 = svg_element("path");
    			path194 = svg_element("path");
    			path195 = svg_element("path");
    			path196 = svg_element("path");
    			path197 = svg_element("path");
    			path198 = svg_element("path");
    			attr_dev(path0, "d", "M5000 0H0V3500H5000V0Z");
    			attr_dev(path0, "fill", "white");
    			add_location(path0, file$a, 8, 1, 125);
    			attr_dev(path1, "d", "M4402.13 1653.4V2709.71C4402.13 2843.41 4293.76 2951.8 4160.05 2951.8H3480.63C3363.6 2951.8 3265.97 2868.75 3243.44 2758.38C3243.11 2751.57 3242.02 2744.84 3240.2 2738.18C3221.78 2671.13 3128.52 2611.6 2989.56 2569.63C2858.77 2530.13 2687.49 2506.19 2500 2506.19C2312.51 2506.19 2141.23 2530.13 2010.44 2569.63C1871.49 2611.59 1778.24 2671.12 1759.81 2738.16C1757.98 2744.83 1756.88 2751.58 1756.56 2758.39C1734.03 2868.76 1636.4 2951.8 1519.37 2951.8H839.957C706.257 2951.8 597.868 2843.42 597.868 2709.72V1653.4C597.868 1470.62 746.052 1322.44 928.846 1322.44H1031.9C1074.8 1263.11 1130.3 1215.45 1193.37 1182.11C1260.22 1146.77 1335.58 1127.52 1413.45 1127.52H1605.96C1707.58 1019.57 1887.23 947.855 2091.9 947.855C2246.92 947.855 2387.59 988.999 2490.86 1055.85C2596.27 988.989 2739.82 947.855 2898.03 947.855C3106.9 947.855 3290.25 1019.56 3393.96 1127.51H3586.56C3664.42 1127.51 3739.79 1146.76 3806.63 1182.1C3869.71 1215.45 3925.22 1263.11 3968.11 1322.44H4071.17C4253.96 1322.44 4402.13 1470.61 4402.13 1653.4Z");
    			attr_dev(path1, "fill", "#FCD4D0");
    			add_location(path1, file$a, 9, 1, 175);
    			attr_dev(path2, "d", "M3090.31 2543.5C3058.15 2529.03 3022.05 2515.73 2983.1 2503.84C2853.67 2464.34 2684.16 2440.4 2498.63 2440.4C2313.09 2440.4 2143.59 2464.34 2014.16 2503.84C1961.74 2519.84 1914.8 2538.39 1875.76 2558.93");
    			attr_dev(path2, "stroke", "white");
    			attr_dev(path2, "stroke-width", "6");
    			attr_dev(path2, "stroke-miterlimit", "10");
    			attr_dev(path2, "stroke-linecap", "round");
    			attr_dev(path2, "stroke-linejoin", "round");
    			add_location(path2, file$a, 13, 1, 1229);
    			attr_dev(path3, "d", "M1020.24 1319.2C1098.11 1319.2 1170.69 1358.62 1213.08 1423.94");
    			attr_dev(path3, "stroke", "white");
    			attr_dev(path3, "stroke-width", "6");
    			attr_dev(path3, "stroke-miterlimit", "10");
    			attr_dev(path3, "stroke-linecap", "round");
    			attr_dev(path3, "stroke-linejoin", "round");
    			add_location(path3, file$a, 21, 1, 1561);
    			attr_dev(path4, "d", "M1565.99 1123.14C1643.86 1123.14 1716.44 1162.55 1758.83 1227.87");
    			attr_dev(path4, "stroke", "white");
    			attr_dev(path4, "stroke-width", "6");
    			attr_dev(path4, "stroke-miterlimit", "10");
    			attr_dev(path4, "stroke-linecap", "round");
    			attr_dev(path4, "stroke-linejoin", "round");
    			add_location(path4, file$a, 29, 1, 1753);
    			attr_dev(path5, "d", "M4021.42 1319.2C3943.55 1319.2 3870.98 1358.62 3828.58 1423.94");
    			attr_dev(path5, "stroke", "white");
    			attr_dev(path5, "stroke-width", "6");
    			attr_dev(path5, "stroke-miterlimit", "10");
    			attr_dev(path5, "stroke-linecap", "round");
    			attr_dev(path5, "stroke-linejoin", "round");
    			add_location(path5, file$a, 37, 1, 1947);
    			attr_dev(path6, "d", "M4147.79 2093.77H3615.32C3492.8 2093.77 3393.47 2193.1 3393.47 2315.62");
    			attr_dev(path6, "stroke", "white");
    			attr_dev(path6, "stroke-width", "6");
    			attr_dev(path6, "stroke-miterlimit", "10");
    			attr_dev(path6, "stroke-linecap", "round");
    			attr_dev(path6, "stroke-linejoin", "round");
    			add_location(path6, file$a, 45, 1, 2139);
    			attr_dev(path7, "d", "M3419.79 1123.14C3341.92 1123.14 3269.34 1162.55 3226.95 1227.87");
    			attr_dev(path7, "stroke", "white");
    			attr_dev(path7, "stroke-width", "6");
    			attr_dev(path7, "stroke-miterlimit", "10");
    			attr_dev(path7, "stroke-linecap", "round");
    			attr_dev(path7, "stroke-linejoin", "round");
    			add_location(path7, file$a, 53, 1, 2339);
    			attr_dev(path8, "d", "M828.581 2134.75H1398.8C1521.33 2134.75 1620.65 2234.08 1620.65 2356.61");
    			attr_dev(path8, "stroke", "white");
    			attr_dev(path8, "stroke-width", "6");
    			attr_dev(path8, "stroke-miterlimit", "10");
    			attr_dev(path8, "stroke-linecap", "round");
    			attr_dev(path8, "stroke-linejoin", "round");
    			add_location(path8, file$a, 61, 1, 2533);
    			attr_dev(path9, "d", "M3859.78 1215.41L3733.98 1632.55C3733.98 1632.55 3786.29 1678.94 3813 1742.14C3882.48 1906.61 3761.74 2088.69 3583.21 2088.69H3256.06C3274.67 1828.18 3155.47 1652.91 3155.47 1652.91H3342.45V1508.94L3322.5 1463.04C3299.43 1409.94 3304.6 1348.8 3336.27 1300.33L3445.85 1132.61C3455 1118.6 3470.61 1110.15 3487.35 1110.15H3775.48C3830.8 1110.15 3871.87 1161.43 3859.78 1215.41Z");
    			attr_dev(path9, "fill", "#FF6E00");
    			add_location(path9, file$a, 69, 1, 2734);
    			attr_dev(path10, "d", "M2969.85 2865L3026.33 2801.67C3026.33 2801.67 3160.88 2349.2 3179.49 2088.69C3198.1 1828.19 3079.09 1653.26 3079.09 1653.26H2965.32C2844.61 1653.26 2749.12 1755.46 2757.33 1875.9C2777.49 2172.04 2919.3 2762.02 2918.26 2798.8C2916.11 2874.67 2883.91 2907.59 2883.91 2907.59C2883.91 2907.59 2934.77 2904.33 2969.85 2865Z");
    			attr_dev(path10, "fill", "#F1B104");
    			add_location(path10, file$a, 73, 1, 3143);
    			attr_dev(path11, "d", "M2883.91 2907.59C2883.91 2907.59 2916.11 2874.67 2918.26 2798.8C2919.3 2762.02 2886.42 2172.04 2866.25 1875.9C2858.05 1755.46 2953.53 1653.26 3074.25 1653.26H3155.67C3155.67 1653.26 3274.67 1828.18 3256.06 2088.69C3237.45 2349.2 3102.91 2801.67 3102.91 2801.67L3046.42 2865C3022.25 2892.09 2987.67 2907.59 2951.37 2907.59H2883.91V2907.59Z");
    			attr_dev(path11, "fill", "#F1B104");
    			add_location(path11, file$a, 77, 1, 3496);
    			attr_dev(path12, "d", "M2913.95 2798.8C2914.99 2762.02 2886.42 2172.04 2866.25 1875.89C2858.05 1755.46 2953.53 1653.26 3074.25 1653.26");
    			attr_dev(path12, "stroke", "white");
    			attr_dev(path12, "stroke-width", "6");
    			attr_dev(path12, "stroke-miterlimit", "10");
    			attr_dev(path12, "stroke-linecap", "round");
    			attr_dev(path12, "stroke-linejoin", "round");
    			add_location(path12, file$a, 81, 1, 3869);
    			attr_dev(path13, "d", "M3051.7 2953.39L3095.27 2892.48C3099.74 2886.24 3106.94 2882.54 3114.62 2882.54C3127.75 2882.54 3138.4 2893.19 3138.4 2906.32V2953.39H3144.46V2859.53C3144.46 2833.32 3127.74 2810.04 3102.91 2801.67L3046.22 2865.23C3022.18 2892.18 2987.79 2907.59 2951.67 2907.59H2883.91L2833.85 2940.12C2829.36 2943.04 2826.65 2948.03 2826.65 2953.39H3051.7Z");
    			attr_dev(path13, "fill", "#FF6E00");
    			add_location(path13, file$a, 89, 1, 4110);
    			attr_dev(path14, "d", "M4099.44 2089.46H3856.24V1957.8H4092.58L4124.42 2054.98C4130 2071.98 4117.33 2089.46 4099.44 2089.46Z");
    			attr_dev(path14, "fill", "#F1B104");
    			add_location(path14, file$a, 93, 1, 4486);
    			attr_dev(path15, "d", "M3863.1 2089.46H3849.39C3831.5 2089.46 3818.83 2071.98 3824.4 2054.98L3856.24 1957.8L3888.09 2054.98C3893.66 2071.98 3880.99 2089.46 3863.1 2089.46Z");
    			attr_dev(path15, "fill", "#573240");
    			add_location(path15, file$a, 97, 1, 4622);
    			attr_dev(path16, "d", "M3856.24 1957.8H3976.98L3956.49 1925.62C3953.94 1921.81 3949.66 1919.52 3945.08 1919.52H3932.41");
    			attr_dev(path16, "stroke", "#573240");
    			attr_dev(path16, "stroke-width", "4");
    			attr_dev(path16, "stroke-miterlimit", "10");
    			attr_dev(path16, "stroke-linecap", "round");
    			add_location(path16, file$a, 101, 1, 4805);
    			attr_dev(path17, "d", "M3932.94 1937.84C3938 1937.84 3942.1 1933.74 3942.1 1928.68C3942.1 1923.62 3938 1919.52 3932.94 1919.52C3927.88 1919.52 3923.78 1923.62 3923.78 1928.68C3923.78 1933.74 3927.88 1937.84 3932.94 1937.84Z");
    			attr_dev(path17, "stroke", "#573240");
    			attr_dev(path17, "stroke-width", "4");
    			attr_dev(path17, "stroke-miterlimit", "10");
    			attr_dev(path17, "stroke-linecap", "round");
    			add_location(path17, file$a, 108, 1, 5006);
    			attr_dev(path18, "d", "M4092.38 1957.8H3971.64L3992.13 1925.62C3994.68 1921.81 3998.96 1919.52 4003.54 1919.52H4016.21");
    			attr_dev(path18, "stroke", "#573240");
    			attr_dev(path18, "stroke-width", "4");
    			attr_dev(path18, "stroke-miterlimit", "10");
    			attr_dev(path18, "stroke-linecap", "round");
    			add_location(path18, file$a, 115, 1, 5312);
    			attr_dev(path19, "d", "M4015.68 1937.84C4020.73 1937.84 4024.84 1933.74 4024.84 1928.68C4024.84 1923.62 4020.73 1919.52 4015.68 1919.52C4010.62 1919.52 4006.52 1923.62 4006.52 1928.68C4006.52 1933.74 4010.62 1937.84 4015.68 1937.84Z");
    			attr_dev(path19, "stroke", "#573240");
    			attr_dev(path19, "stroke-width", "4");
    			attr_dev(path19, "stroke-miterlimit", "10");
    			attr_dev(path19, "stroke-linecap", "round");
    			add_location(path19, file$a, 122, 1, 5513);
    			attr_dev(path20, "d", "M3883.52 1982.87C3886.94 1982.87 3889.71 1980.09 3889.71 1976.67C3889.71 1973.25 3886.94 1970.47 3883.52 1970.47C3880.1 1970.47 3877.32 1973.25 3877.32 1976.67C3877.32 1980.09 3880.1 1982.87 3883.52 1982.87Z");
    			attr_dev(path20, "fill", "white");
    			add_location(path20, file$a, 129, 1, 5828);
    			attr_dev(path21, "d", "M3911.1 1982.87C3914.53 1982.87 3917.3 1980.09 3917.3 1976.67C3917.3 1973.25 3914.53 1970.47 3911.1 1970.47C3907.68 1970.47 3904.91 1973.25 3904.91 1976.67C3904.91 1980.09 3907.68 1982.87 3911.1 1982.87Z");
    			attr_dev(path21, "fill", "white");
    			add_location(path21, file$a, 133, 1, 6068);
    			attr_dev(path22, "d", "M3938.69 1982.87C3942.11 1982.87 3944.89 1980.09 3944.89 1976.67C3944.89 1973.25 3942.11 1970.47 3938.69 1970.47C3935.27 1970.47 3932.5 1973.25 3932.5 1976.67C3932.5 1980.09 3935.27 1982.87 3938.69 1982.87Z");
    			attr_dev(path22, "fill", "white");
    			add_location(path22, file$a, 137, 1, 6304);
    			attr_dev(path23, "d", "M3966.28 1982.87C3969.7 1982.87 3972.48 1980.09 3972.48 1976.67C3972.48 1973.25 3969.7 1970.47 3966.28 1970.47C3962.86 1970.47 3960.08 1973.25 3960.08 1976.67C3960.08 1980.09 3962.86 1982.87 3966.28 1982.87Z");
    			attr_dev(path23, "fill", "white");
    			add_location(path23, file$a, 141, 1, 6543);
    			attr_dev(path24, "d", "M3993.87 1982.87C3997.29 1982.87 4000.06 1980.09 4000.06 1976.67C4000.06 1973.25 3997.29 1970.47 3993.87 1970.47C3990.44 1970.47 3987.67 1973.25 3987.67 1976.67C3987.67 1980.09 3990.44 1982.87 3993.87 1982.87Z");
    			attr_dev(path24, "fill", "white");
    			add_location(path24, file$a, 145, 1, 6783);
    			attr_dev(path25, "d", "M4021.45 1982.87C4024.87 1982.87 4027.65 1980.09 4027.65 1976.67C4027.65 1973.25 4024.87 1970.47 4021.45 1970.47C4018.03 1970.47 4015.26 1973.25 4015.26 1976.67C4015.26 1980.09 4018.03 1982.87 4021.45 1982.87Z");
    			attr_dev(path25, "fill", "white");
    			add_location(path25, file$a, 149, 1, 7025);
    			attr_dev(path26, "d", "M4049.04 1982.87C4052.46 1982.87 4055.24 1980.09 4055.24 1976.67C4055.24 1973.25 4052.46 1970.47 4049.04 1970.47C4045.62 1970.47 4042.84 1973.25 4042.84 1976.67C4042.84 1980.09 4045.62 1982.87 4049.04 1982.87Z");
    			attr_dev(path26, "fill", "white");
    			add_location(path26, file$a, 153, 1, 7267);
    			attr_dev(path27, "d", "M4076.63 1982.87C4080.05 1982.87 4082.82 1980.09 4082.82 1976.67C4082.82 1973.25 4080.05 1970.47 4076.63 1970.47C4073.2 1970.47 4070.43 1973.25 4070.43 1976.67C4070.43 1980.09 4073.2 1982.87 4076.63 1982.87Z");
    			attr_dev(path27, "fill", "white");
    			add_location(path27, file$a, 157, 1, 7509);
    			attr_dev(path28, "d", "M3890.61 2004.13C3894.03 2004.13 3896.8 2001.36 3896.8 1997.94C3896.8 1994.52 3894.03 1991.74 3890.61 1991.74C3887.18 1991.74 3884.41 1994.52 3884.41 1997.94C3884.41 2001.36 3887.18 2004.13 3890.61 2004.13Z");
    			attr_dev(path28, "fill", "white");
    			add_location(path28, file$a, 161, 1, 7749);
    			attr_dev(path29, "d", "M3918.19 2004.13C3921.62 2004.13 3924.39 2001.36 3924.39 1997.94C3924.39 1994.52 3921.62 1991.74 3918.19 1991.74C3914.77 1991.74 3912 1994.52 3912 1997.94C3912 2001.36 3914.77 2004.13 3918.19 2004.13Z");
    			attr_dev(path29, "fill", "white");
    			add_location(path29, file$a, 165, 1, 7988);
    			attr_dev(path30, "d", "M3945.78 2004.13C3949.2 2004.13 3951.98 2001.36 3951.98 1997.94C3951.98 1994.52 3949.2 1991.74 3945.78 1991.74C3942.36 1991.74 3939.58 1994.52 3939.58 1997.94C3939.58 2001.36 3942.36 2004.13 3945.78 2004.13Z");
    			attr_dev(path30, "fill", "white");
    			add_location(path30, file$a, 169, 1, 8221);
    			attr_dev(path31, "d", "M3973.37 2004.13C3976.79 2004.13 3979.56 2001.36 3979.56 1997.94C3979.56 1994.52 3976.79 1991.74 3973.37 1991.74C3969.94 1991.74 3967.17 1994.52 3967.17 1997.94C3967.17 2001.36 3969.94 2004.13 3973.37 2004.13Z");
    			attr_dev(path31, "fill", "white");
    			add_location(path31, file$a, 173, 1, 8461);
    			attr_dev(path32, "d", "M4000.95 2004.13C4004.38 2004.13 4007.15 2001.36 4007.15 1997.94C4007.15 1994.52 4004.38 1991.74 4000.95 1991.74C3997.53 1991.74 3994.76 1994.52 3994.76 1997.94C3994.76 2001.36 3997.53 2004.13 4000.95 2004.13Z");
    			attr_dev(path32, "fill", "white");
    			add_location(path32, file$a, 177, 1, 8703);
    			attr_dev(path33, "d", "M4028.54 2004.13C4031.96 2004.13 4034.74 2001.36 4034.74 1997.94C4034.74 1994.52 4031.96 1991.74 4028.54 1991.74C4025.12 1991.74 4022.35 1994.52 4022.35 1997.94C4022.35 2001.36 4025.12 2004.13 4028.54 2004.13Z");
    			attr_dev(path33, "fill", "white");
    			add_location(path33, file$a, 181, 1, 8945);
    			attr_dev(path34, "d", "M4056.13 2004.13C4059.55 2004.13 4062.32 2001.36 4062.32 1997.94C4062.32 1994.52 4059.55 1991.74 4056.13 1991.74C4052.71 1991.74 4049.93 1994.52 4049.93 1997.94C4049.93 2001.36 4052.71 2004.13 4056.13 2004.13Z");
    			attr_dev(path34, "fill", "white");
    			add_location(path34, file$a, 185, 1, 9187);
    			attr_dev(path35, "d", "M4083.72 2004.13C4087.14 2004.13 4089.91 2001.36 4089.91 1997.94C4089.91 1994.52 4087.14 1991.74 4083.72 1991.74C4080.29 1991.74 4077.52 1994.52 4077.52 1997.94C4077.52 2001.36 4080.29 2004.13 4083.72 2004.13Z");
    			attr_dev(path35, "fill", "white");
    			add_location(path35, file$a, 189, 1, 9429);
    			attr_dev(path36, "d", "M3898.71 2026.41C3902.13 2026.41 3904.9 2023.64 3904.9 2020.21C3904.9 2016.79 3902.13 2014.02 3898.71 2014.02C3895.29 2014.02 3892.51 2016.79 3892.51 2020.21C3892.51 2023.64 3895.29 2026.41 3898.71 2026.41Z");
    			attr_dev(path36, "fill", "white");
    			add_location(path36, file$a, 193, 1, 9671);
    			attr_dev(path37, "d", "M3926.29 2026.41C3929.72 2026.41 3932.49 2023.64 3932.49 2020.21C3932.49 2016.79 3929.72 2014.02 3926.29 2014.02C3922.87 2014.02 3920.1 2016.79 3920.1 2020.21C3920.1 2023.64 3922.87 2026.41 3926.29 2026.41Z");
    			attr_dev(path37, "fill", "white");
    			add_location(path37, file$a, 197, 1, 9910);
    			attr_dev(path38, "d", "M3953.88 2026.41C3957.3 2026.41 3960.08 2023.64 3960.08 2020.21C3960.08 2016.79 3957.3 2014.02 3953.88 2014.02C3950.46 2014.02 3947.69 2016.79 3947.69 2020.21C3947.69 2023.64 3950.46 2026.41 3953.88 2026.41Z");
    			attr_dev(path38, "fill", "white");
    			add_location(path38, file$a, 201, 1, 10149);
    			attr_dev(path39, "d", "M3981.47 2026.41C3984.89 2026.41 3987.67 2023.64 3987.67 2020.21C3987.67 2016.79 3984.89 2014.02 3981.47 2014.02C3978.05 2014.02 3975.27 2016.79 3975.27 2020.21C3975.27 2023.64 3978.05 2026.41 3981.47 2026.41Z");
    			attr_dev(path39, "fill", "white");
    			add_location(path39, file$a, 205, 1, 10389);
    			attr_dev(path40, "d", "M4009.06 2026.41C4012.48 2026.41 4015.25 2023.64 4015.25 2020.21C4015.25 2016.79 4012.48 2014.02 4009.06 2014.02C4005.63 2014.02 4002.86 2016.79 4002.86 2020.21C4002.86 2023.64 4005.63 2026.41 4009.06 2026.41Z");
    			attr_dev(path40, "fill", "white");
    			add_location(path40, file$a, 209, 1, 10631);
    			attr_dev(path41, "d", "M4036.64 2026.41C4040.07 2026.41 4042.84 2023.64 4042.84 2020.21C4042.84 2016.79 4040.07 2014.02 4036.64 2014.02C4033.22 2014.02 4030.45 2016.79 4030.45 2020.21C4030.45 2023.64 4033.22 2026.41 4036.64 2026.41Z");
    			attr_dev(path41, "fill", "white");
    			add_location(path41, file$a, 213, 1, 10873);
    			attr_dev(path42, "d", "M4064.23 2026.41C4067.65 2026.41 4070.43 2023.64 4070.43 2020.21C4070.43 2016.79 4067.65 2014.02 4064.23 2014.02C4060.81 2014.02 4058.03 2016.79 4058.03 2020.21C4058.03 2023.64 4060.81 2026.41 4064.23 2026.41Z");
    			attr_dev(path42, "fill", "white");
    			add_location(path42, file$a, 217, 1, 11115);
    			attr_dev(path43, "d", "M4091.82 2026.41C4095.24 2026.41 4098.01 2023.64 4098.01 2020.21C4098.01 2016.79 4095.24 2014.02 4091.82 2014.02C4088.39 2014.02 4085.62 2016.79 4085.62 2020.21C4085.62 2023.64 4088.39 2026.41 4091.82 2026.41Z");
    			attr_dev(path43, "fill", "white");
    			add_location(path43, file$a, 221, 1, 11357);
    			attr_dev(path44, "d", "M3904.78 2048.69C3908.2 2048.69 3910.98 2045.92 3910.98 2042.49C3910.98 2039.07 3908.2 2036.3 3904.78 2036.3C3901.36 2036.3 3898.59 2039.07 3898.59 2042.49C3898.59 2045.92 3901.36 2048.69 3904.78 2048.69Z");
    			attr_dev(path44, "fill", "white");
    			add_location(path44, file$a, 225, 1, 11599);
    			attr_dev(path45, "d", "M3932.37 2048.69C3935.79 2048.69 3938.57 2045.92 3938.57 2042.49C3938.57 2039.07 3935.79 2036.3 3932.37 2036.3C3928.95 2036.3 3926.17 2039.07 3926.17 2042.49C3926.17 2045.92 3928.95 2048.69 3932.37 2048.69Z");
    			attr_dev(path45, "fill", "white");
    			add_location(path45, file$a, 229, 1, 11836);
    			attr_dev(path46, "d", "M3959.96 2048.69C3963.38 2048.69 3966.15 2045.92 3966.15 2042.49C3966.15 2039.07 3963.38 2036.3 3959.96 2036.3C3956.54 2036.3 3953.76 2039.07 3953.76 2042.49C3953.76 2045.92 3956.54 2048.69 3959.96 2048.69Z");
    			attr_dev(path46, "fill", "white");
    			add_location(path46, file$a, 233, 1, 12075);
    			attr_dev(path47, "d", "M3987.54 2048.69C3990.97 2048.69 3993.74 2045.92 3993.74 2042.49C3993.74 2039.07 3990.97 2036.3 3987.54 2036.3C3984.12 2036.3 3981.35 2039.07 3981.35 2042.49C3981.35 2045.92 3984.12 2048.69 3987.54 2048.69Z");
    			attr_dev(path47, "fill", "white");
    			add_location(path47, file$a, 237, 1, 12314);
    			attr_dev(path48, "d", "M4015.13 2048.69C4018.55 2048.69 4021.33 2045.92 4021.33 2042.49C4021.33 2039.07 4018.55 2036.3 4015.13 2036.3C4011.71 2036.3 4008.94 2039.07 4008.94 2042.49C4008.94 2045.92 4011.71 2048.69 4015.13 2048.69Z");
    			attr_dev(path48, "fill", "white");
    			add_location(path48, file$a, 241, 1, 12553);
    			attr_dev(path49, "d", "M4042.72 2048.69C4046.14 2048.69 4048.92 2045.92 4048.92 2042.49C4048.92 2039.07 4046.14 2036.3 4042.72 2036.3C4039.3 2036.3 4036.52 2039.07 4036.52 2042.49C4036.52 2045.92 4039.3 2048.69 4042.72 2048.69Z");
    			attr_dev(path49, "fill", "white");
    			add_location(path49, file$a, 245, 1, 12792);
    			attr_dev(path50, "d", "M4070.31 2048.69C4073.73 2048.69 4076.5 2045.92 4076.5 2042.49C4076.5 2039.07 4073.73 2036.3 4070.31 2036.3C4066.88 2036.3 4064.11 2039.07 4064.11 2042.49C4064.11 2045.92 4066.88 2048.69 4070.31 2048.69Z");
    			attr_dev(path50, "fill", "white");
    			add_location(path50, file$a, 249, 1, 13029);
    			attr_dev(path51, "d", "M4097.89 2048.69C4101.32 2048.69 4104.09 2045.92 4104.09 2042.49C4104.09 2039.07 4101.32 2036.3 4097.89 2036.3C4094.47 2036.3 4091.7 2039.07 4091.7 2042.49C4091.7 2045.92 4094.47 2048.69 4097.89 2048.69Z");
    			attr_dev(path51, "fill", "white");
    			add_location(path51, file$a, 253, 1, 13265);
    			attr_dev(path52, "d", "M3907.82 2071.98C3911.24 2071.98 3914.02 2069.21 3914.02 2065.78C3914.02 2062.36 3911.24 2059.59 3907.82 2059.59C3904.4 2059.59 3901.62 2062.36 3901.62 2065.78C3901.62 2069.21 3904.4 2071.98 3907.82 2071.98Z");
    			attr_dev(path52, "fill", "white");
    			add_location(path52, file$a, 257, 1, 13501);
    			attr_dev(path53, "d", "M3935.41 2071.98C3938.83 2071.98 3941.6 2069.21 3941.6 2065.78C3941.6 2062.36 3938.83 2059.59 3935.41 2059.59C3931.99 2059.59 3929.21 2062.36 3929.21 2065.78C3929.21 2069.21 3931.99 2071.98 3935.41 2071.98Z");
    			attr_dev(path53, "fill", "white");
    			add_location(path53, file$a, 261, 1, 13741);
    			attr_dev(path54, "d", "M3963 2071.98C3966.42 2071.98 3969.19 2069.21 3969.19 2065.78C3969.19 2062.36 3966.42 2059.59 3963 2059.59C3959.57 2059.59 3956.8 2062.36 3956.8 2065.78C3956.8 2069.21 3959.57 2071.98 3963 2071.98Z");
    			attr_dev(path54, "fill", "white");
    			add_location(path54, file$a, 265, 1, 13980);
    			attr_dev(path55, "d", "M3990.58 2071.98C3994 2071.98 3996.78 2069.21 3996.78 2065.78C3996.78 2062.36 3994 2059.59 3990.58 2059.59C3987.16 2059.59 3984.39 2062.36 3984.39 2065.78C3984.39 2069.21 3987.16 2071.98 3990.58 2071.98Z");
    			attr_dev(path55, "fill", "white");
    			add_location(path55, file$a, 269, 1, 14210);
    			attr_dev(path56, "d", "M4018.17 2071.98C4021.59 2071.98 4024.36 2069.21 4024.36 2065.78C4024.36 2062.36 4021.59 2059.59 4018.17 2059.59C4014.75 2059.59 4011.97 2062.36 4011.97 2065.78C4011.97 2069.21 4014.75 2071.98 4018.17 2071.98Z");
    			attr_dev(path56, "fill", "white");
    			add_location(path56, file$a, 273, 1, 14446);
    			attr_dev(path57, "d", "M4045.76 2071.98C4049.18 2071.98 4051.95 2069.21 4051.95 2065.78C4051.95 2062.36 4049.18 2059.59 4045.76 2059.59C4042.34 2059.59 4039.56 2062.36 4039.56 2065.78C4039.56 2069.21 4042.34 2071.98 4045.76 2071.98Z");
    			attr_dev(path57, "fill", "white");
    			add_location(path57, file$a, 277, 1, 14688);
    			attr_dev(path58, "d", "M4073.34 2071.98C4076.77 2071.98 4079.54 2069.21 4079.54 2065.78C4079.54 2062.36 4076.77 2059.59 4073.34 2059.59C4069.92 2059.59 4067.15 2062.36 4067.15 2065.78C4067.15 2069.21 4069.92 2071.98 4073.34 2071.98Z");
    			attr_dev(path58, "fill", "white");
    			add_location(path58, file$a, 281, 1, 14930);
    			attr_dev(path59, "d", "M4100.93 2071.98C4104.35 2071.98 4107.13 2069.21 4107.13 2065.78C4107.13 2062.36 4104.35 2059.59 4100.93 2059.59C4097.51 2059.59 4094.74 2062.36 4094.74 2065.78C4094.74 2069.21 4097.51 2071.98 4100.93 2071.98Z");
    			attr_dev(path59, "fill", "white");
    			add_location(path59, file$a, 285, 1, 15172);
    			attr_dev(path60, "d", "M3648.97 955.058L3698.62 1110.15C3698.62 1110.15 3610.32 1264.95 3486.92 1264.95C3382.43 1264.95 3497.25 1110.15 3497.25 1110.15C3530.66 1110.15 3557.75 1083.06 3557.75 1049.64V955.057H3648.97V955.058Z");
    			attr_dev(path60, "fill", "#F1B104");
    			add_location(path60, file$a, 289, 1, 15414);
    			attr_dev(path61, "d", "M3557.75 936.68V1049.64C3557.75 1066.35 3550.98 1081.48 3540.03 1092.43C3529.08 1103.38 3513.95 1110.15 3497.24 1110.15C3497.24 1110.15 3496.97 1110.52 3496.45 1111.22C3450.28 1110.97 3412.95 1079.98 3412.95 1041.8C3412.95 1007.78 3442.58 979.48 3481.71 973.53C3486.89 949.57 3508.61 931.6 3534.61 931.6C3542.89 931.6 3550.74 933.42 3557.75 936.68Z");
    			attr_dev(path61, "fill", "#573240");
    			add_location(path61, file$a, 293, 1, 15650);
    			attr_dev(path62, "d", "M3683.27 886.25C3682.18 911.42 3663.31 920.01 3637.43 920.01C3618.11 920.01 3600.96 906.84 3593.49 889.68C3580.6 899.6 3561.96 904.12 3542.56 900.49C3510.21 894.43 3488.01 867.99 3492.99 841.43C3497.96 814.87 3528.22 798.26 3560.57 804.32C3581.76 808.29 3598.59 820.99 3606.28 836.75C3613.76 832.56 3623.99 830.74 3637.43 832C3663.21 834.42 3684.68 853.8 3683.27 886.25Z");
    			attr_dev(path62, "fill", "#573240");
    			add_location(path62, file$a, 297, 1, 16033);
    			attr_dev(path63, "d", "M3812.88 1044.38C3812.88 1084.15 3776.24 1116.39 3731.04 1116.39C3685.84 1116.39 3649.2 1084.15 3649.2 1044.38C3649.2 1028.88 3654.77 1014.53 3664.24 1002.78L3643.46 937.87C3652.37 929.13 3665.01 923.68 3679.02 923.68C3706.03 923.68 3727.93 943.95 3727.93 968.96C3727.93 970.13 3727.88 971.29 3727.79 972.44C3728.87 972.4 3729.95 972.38 3731.04 972.38C3776.24 972.38 3812.88 1004.62 3812.88 1044.38Z");
    			attr_dev(path63, "fill", "#573240");
    			add_location(path63, file$a, 301, 1, 16438);
    			attr_dev(path64, "d", "M3693.33 929.32V933.28C3693.33 947.2 3682.04 958.49 3668.12 958.49H3643.13C3640.91 973.12 3630.98 985.66 3616.85 991.01L3576.79 1006.18C3562.55 1011.57 3546.77 1003.5 3542.82 988.79L3537.04 967.32C3534.85 959.18 3533.74 950.79 3533.74 942.36V906.7C3533.74 880.64 3554.87 859.51 3580.92 859.51H3590.63C3589.88 863.14 3589.53 867.04 3589.53 871.15C3589.53 896.35 3611.54 920.01 3637.43 920.01C3639.1 920.01 3640.75 919.97 3642.36 919.89C3642.63 911.12 3649.82 904.1 3658.66 904.1H3668.12C3682.04 904.1 3693.33 915.39 3693.33 929.32Z");
    			attr_dev(path64, "fill", "#F1B104");
    			add_location(path64, file$a, 305, 1, 16872);
    			attr_dev(path65, "d", "M3653.14 932.47C3653.14 922.758 3661.01 914.885 3670.72 914.885");
    			attr_dev(path65, "stroke", "#573240");
    			attr_dev(path65, "stroke-width", "5");
    			attr_dev(path65, "stroke-miterlimit", "10");
    			attr_dev(path65, "stroke-linecap", "round");
    			add_location(path65, file$a, 309, 1, 17437);
    			attr_dev(path66, "d", "M3585.55 960.156C3585.55 960.156 3576.45 968.956 3561.46 966.334");
    			attr_dev(path66, "stroke", "#573240");
    			attr_dev(path66, "stroke-width", "5");
    			attr_dev(path66, "stroke-miterlimit", "10");
    			attr_dev(path66, "stroke-linecap", "round");
    			add_location(path66, file$a, 316, 1, 17606);
    			attr_dev(path67, "d", "M3532.86 900.626C3538.61 897.706 3545.92 897.85 3552.54 900.816C3565 906.392 3561.18 951.003 3561.18 951.003");
    			attr_dev(path67, "stroke", "#573240");
    			attr_dev(path67, "stroke-width", "5");
    			attr_dev(path67, "stroke-miterlimit", "10");
    			attr_dev(path67, "stroke-linecap", "round");
    			add_location(path67, file$a, 323, 1, 17776);
    			attr_dev(path68, "d", "M3540.66 989.872C3544.62 1004.57 3560.4 1012.65 3574.63 1007.26L3616.85 993.162C3632.95 987.063 3643.47 977.405 3643.47 960.186");
    			attr_dev(path68, "stroke", "#573240");
    			attr_dev(path68, "stroke-width", "5");
    			attr_dev(path68, "stroke-miterlimit", "10");
    			attr_dev(path68, "stroke-linecap", "round");
    			add_location(path68, file$a, 330, 1, 17990);
    			attr_dev(path69, "d", "M3543.51 931.432C3545.9 931.432 3547.83 928.347 3547.83 924.542C3547.83 920.737 3545.9 917.652 3543.51 917.652C3541.13 917.652 3539.2 920.737 3539.2 924.542C3539.2 928.347 3541.13 931.432 3543.51 931.432Z");
    			attr_dev(path69, "fill", "#573240");
    			add_location(path69, file$a, 337, 1, 18223);
    			attr_dev(path70, "d", "M3580.36 900.912C3587.45 897.097 3598.87 897.294 3606.58 902.187");
    			attr_dev(path70, "stroke", "#573240");
    			attr_dev(path70, "stroke-width", "5");
    			attr_dev(path70, "stroke-miterlimit", "10");
    			attr_dev(path70, "stroke-linecap", "round");
    			add_location(path70, file$a, 341, 1, 18462);
    			attr_dev(path71, "d", "M3591.85 931.432C3594.24 931.432 3596.17 928.347 3596.17 924.542C3596.17 920.737 3594.24 917.652 3591.85 917.652C3589.47 917.652 3587.54 920.737 3587.54 924.542C3587.54 928.347 3589.47 931.432 3591.85 931.432Z");
    			attr_dev(path71, "fill", "#573240");
    			add_location(path71, file$a, 348, 1, 18632);
    			attr_dev(path72, "d", "M2296.75 2669.28V1948.05H2506.37L2296.75 2669.28ZM2765.86 1696.74L2111.53 1598.28C1970.19 1580.75 1876.61 1706.69 1904.42 1846.37L2009.85 2786.19C2028.96 2783.72 2051.08 2782.42 2071.65 2782.42C2140.89 2782.42 2203.99 2797.22 2249.08 2821.04L2275.54 2742.25L2275.55 2742.23C2275.55 2742.23 2276.17 2759.83 2296.75 2776.9C2308.59 2786.71 2327.05 2796.36 2355.8 2802.37C2414.08 2814.56 2493.53 2773.03 2563.98 2814.13C2565.8 2815.19 2567.55 2816.29 2569.24 2817.43L2897.02 1916.76C2935.5 1818.2 2870.87 1709.77 2765.86 1696.74Z");
    			attr_dev(path72, "fill", "#573240");
    			add_location(path72, file$a, 352, 1, 18876);
    			attr_dev(path73, "d", "M1945.16 2859.32C1932.84 2871.08 1940.66 2892.83 1957.2 2892.83H2259.9C2279.12 2892.83 2295.09 2877.55 2297.46 2857.6C2258.81 2813.28 2171.64 2782.42 2071.65 2782.42C2051.02 2782.42 2028.83 2783.73 2009.68 2786.21L1945.16 2859.32Z");
    			attr_dev(path73, "fill", "#B2DDDA");
    			add_location(path73, file$a, 356, 1, 19436);
    			attr_dev(path74, "d", "M1934.88 2874.01C1935.62 2883.25 1942.55 2891.75 1952.88 2891.75H2255.59C2274.81 2891.75 2294.76 2873.46 2294.22 2851.13");
    			attr_dev(path74, "stroke", "#573240");
    			attr_dev(path74, "stroke-width", "7");
    			attr_dev(path74, "stroke-miterlimit", "10");
    			attr_dev(path74, "stroke-linecap", "round");
    			add_location(path74, file$a, 360, 1, 19701);
    			attr_dev(path75, "d", "M2615.75 2891.75H2364.35L2250.15 2817.84L2275.55 2742.23C2275.55 2742.23 2277.08 2785.91 2355.8 2802.37C2414.08 2814.56 2493.53 2773.03 2563.98 2814.12C2609.63 2840.76 2615.75 2891.75 2615.75 2891.75Z");
    			attr_dev(path75, "fill", "#B2DDDA");
    			add_location(path75, file$a, 367, 1, 19927);
    			attr_dev(path76, "d", "M2615.75 2891.75H2364.35L2251.23 2817.84");
    			attr_dev(path76, "stroke", "#573240");
    			attr_dev(path76, "stroke-width", "7");
    			attr_dev(path76, "stroke-miterlimit", "10");
    			attr_dev(path76, "stroke-linecap", "round");
    			add_location(path76, file$a, 371, 1, 20162);
    			attr_dev(path77, "d", "M2355.93 884.6L2440.42 851.62L2414.37 780.64L2280.6 788.42L2275.6 856.43L2355.93 884.6Z");
    			attr_dev(path77, "fill", "white");
    			attr_dev(path77, "stroke", "#573240");
    			attr_dev(path77, "stroke-width", "4");
    			attr_dev(path77, "stroke-miterlimit", "10");
    			attr_dev(path77, "stroke-linecap", "round");
    			add_location(path77, file$a, 378, 1, 20308);
    			attr_dev(path78, "d", "M2414.29 743.077L2410.87 714.181C2409.68 703.027 2402.1 693.586 2391.45 690.038C2352.47 677.043 2259.14 643.5 2226.29 666.7C2188.98 693.053 2252.84 736.584 2252.84 736.584C2252.84 736.584 2313.57 752.269 2329.85 750.803C2346.12 749.339 2414.29 743.077 2414.29 743.077Z");
    			attr_dev(path78, "fill", "#FF6E00");
    			add_location(path78, file$a, 386, 1, 20516);
    			attr_dev(path79, "d", "M2382.88 786.624L2379.37 810.373C2377.48 823.154 2367.09 832.976 2354.22 834.135L2283.53 840.498C2270.54 841.667 2259.07 832.086 2257.9 819.097L2251.42 747.076C2249.11 721.49 2267.99 698.882 2293.57 696.579L2321.18 694.094C2334.98 692.851 2347.95 700.896 2352.96 713.82L2360.73 733.845C2363.64 741.338 2371.15 746.002 2379.16 745.282C2378.33 736.031 2385.15 727.856 2394.4 727.023L2399.21 726.59C2415.26 725.146 2429.43 736.98 2430.88 753.022C2432.32 769.064 2420.49 783.239 2404.44 784.683L2382.88 786.624Z");
    			attr_dev(path79, "fill", "white");
    			attr_dev(path79, "stroke", "#573240");
    			attr_dev(path79, "stroke-width", "4");
    			attr_dev(path79, "stroke-miterlimit", "10");
    			attr_dev(path79, "stroke-linecap", "round");
    			add_location(path79, file$a, 390, 1, 20819);
    			attr_dev(path80, "d", "M2408.2 742.443C2400.1 743.172 2394.12 750.333 2394.85 758.435");
    			attr_dev(path80, "stroke", "#573240");
    			attr_dev(path80, "stroke-width", "5");
    			attr_dev(path80, "stroke-miterlimit", "10");
    			attr_dev(path80, "stroke-linecap", "round");
    			add_location(path80, file$a, 398, 1, 21447);
    			attr_dev(path81, "d", "M2295.85 799.748C2305.67 803.249 2316.21 798.85 2319.39 789.924");
    			attr_dev(path81, "stroke", "#573240");
    			attr_dev(path81, "stroke-width", "5");
    			attr_dev(path81, "stroke-miterlimit", "10");
    			attr_dev(path81, "stroke-linecap", "round");
    			add_location(path81, file$a, 405, 1, 21615);
    			attr_dev(path82, "d", "M2276.84 742.354L2280.35 781.254C2280.72 785.393 2284.83 788.12 2288.79 786.855L2296.93 784.617");
    			attr_dev(path82, "stroke", "#573240");
    			attr_dev(path82, "stroke-width", "5");
    			attr_dev(path82, "stroke-miterlimit", "10");
    			attr_dev(path82, "stroke-linecap", "round");
    			add_location(path82, file$a, 412, 1, 21784);
    			attr_dev(path83, "d", "M2334.16 744.522L2310.37 743.711C2307.81 743.624 2305.8 741.474 2305.89 738.91L2306.01 735.159C2306.1 732.595 2308.25 730.587 2310.82 730.675L2334.6 731.486C2337.17 731.573 2339.17 733.723 2339.09 736.287L2338.96 740.038C2338.87 742.602 2336.72 744.609 2334.16 744.522Z");
    			attr_dev(path83, "fill", "#FF6E00");
    			add_location(path83, file$a, 419, 1, 21985);
    			attr_dev(path84, "d", "M2274.2 733.838L2250.68 737.443C2248.14 737.832 2246.4 740.202 2246.79 742.738L2247.36 746.448C2247.75 748.984 2250.12 750.725 2252.66 750.336L2276.18 746.731C2278.72 746.342 2280.46 743.972 2280.07 741.436L2279.5 737.726C2279.11 735.19 2276.74 733.45 2274.2 733.838Z");
    			attr_dev(path84, "fill", "#FF6E00");
    			add_location(path84, file$a, 423, 1, 22289);
    			attr_dev(path85, "d", "M2319.93 767.427C2322.29 767.214 2323.94 764.166 2323.62 760.618C2323.3 757.071 2321.13 754.368 2318.77 754.58C2316.41 754.793 2314.75 757.841 2315.07 761.389C2315.39 764.936 2317.56 767.64 2319.93 767.427Z");
    			attr_dev(path85, "fill", "#573240");
    			add_location(path85, file$a, 427, 1, 22591);
    			attr_dev(path86, "d", "M2264.07 772.457C2266.43 772.244 2268.09 769.196 2267.77 765.649C2267.45 762.101 2265.27 759.398 2262.91 759.611C2260.55 759.823 2258.89 762.871 2259.21 766.419C2259.53 769.966 2261.71 772.67 2264.07 772.457Z");
    			attr_dev(path86, "fill", "#573240");
    			add_location(path86, file$a, 431, 1, 22832);
    			attr_dev(path87, "d", "M1868.31 1561.26C1810.19 1552.48 1772.91 1494.74 1788.84 1438.15L1886.15 1092.62C1904.4 1025.89 1955.11 972.88 2020.96 951.67L2278.6 886.85L2355.05 881.85L2453.93 886.85L2708.46 962.42C2773.01 983.21 2823.09 1034.6 2842.2 1099.67L2920.94 1353.8C2949.46 1445.84 2880.67 1539.16 2784.32 1539.16H2765.63L2765.86 1696.74L1868.31 1561.26Z");
    			attr_dev(path87, "fill", "#F1B104");
    			add_location(path87, file$a, 435, 1, 23075);
    			attr_dev(path88, "d", "M2489.4 896.63L2408.92 924.13L2356.01 886.55L2305.32 923.05L2233.67 898.18L2268.6 858.18C2271.13 854.86 2275.51 853.55 2279.44 854.96L2355.52 879.54L2437.7 849.12C2440.59 848.01 2443.87 848.77 2445.98 851.03L2489.4 896.63Z");
    			attr_dev(path88, "fill", "#B2DDDA");
    			add_location(path88, file$a, 439, 1, 23443);
    			attr_dev(path89, "d", "M2600.04 2110.5V2680.6C2600.04 2804.41 2674.57 2910.1 2779.47 2951.72");
    			attr_dev(path89, "stroke", "#F1B104");
    			attr_dev(path89, "stroke-width", "5");
    			attr_dev(path89, "stroke-miterlimit", "10");
    			add_location(path89, file$a, 443, 1, 23700);
    			attr_dev(path90, "d", "M2546.48 2110.5V2680.6C2546.48 2809.39 2465.84 2918.57 2354.24 2956.43");
    			attr_dev(path90, "stroke", "#F1B104");
    			attr_dev(path90, "stroke-width", "5");
    			attr_dev(path90, "stroke-miterlimit", "10");
    			add_location(path90, file$a, 449, 1, 23850);
    			attr_dev(path91, "d", "M2546.48 2694.5C2546.48 2679.71 2558.47 2667.72 2573.26 2667.72C2588.05 2667.72 2600.04 2679.71 2600.04 2694.5");
    			attr_dev(path91, "stroke", "#F1B104");
    			attr_dev(path91, "stroke-width", "5");
    			attr_dev(path91, "stroke-miterlimit", "10");
    			add_location(path91, file$a, 455, 1, 24001);
    			attr_dev(path92, "d", "M2550.45 2109.19C3164.39 2109.19 3662.08 1972.67 3662.08 1804.25C3662.08 1635.84 3164.39 1499.31 2550.45 1499.31C1936.52 1499.31 1438.82 1635.84 1438.82 1804.25C1438.82 1972.67 1936.52 2109.19 2550.45 2109.19Z");
    			attr_dev(path92, "fill", "white");
    			add_location(path92, file$a, 461, 1, 24192);
    			attr_dev(path93, "d", "M3385.28 1652.5H2953.63L2838.01 1264.95H3269.65L3385.28 1652.5Z");
    			attr_dev(path93, "fill", "#B2DDDA");
    			add_location(path93, file$a, 465, 1, 24434);
    			attr_dev(path94, "d", "M2838.01 1264.95L3020.01 1123.14L3063.15 1264.95H2838.01Z");
    			attr_dev(path94, "fill", "#573240");
    			add_location(path94, file$a, 466, 1, 24527);
    			attr_dev(path95, "d", "M2991.59 1400.82C3006.97 1374.82 3038.69 1356.98 3075.33 1356.98C3111.97 1356.98 3143.69 1374.82 3159.06 1400.82");
    			attr_dev(path95, "stroke", "white");
    			attr_dev(path95, "stroke-width", "6");
    			attr_dev(path95, "stroke-miterlimit", "10");
    			attr_dev(path95, "stroke-linecap", "round");
    			attr_dev(path95, "stroke-linejoin", "round");
    			add_location(path95, file$a, 467, 1, 24614);
    			attr_dev(path96, "d", "M2960.6 1423.49H3200.52");
    			attr_dev(path96, "stroke", "white");
    			attr_dev(path96, "stroke-width", "6");
    			attr_dev(path96, "stroke-miterlimit", "10");
    			attr_dev(path96, "stroke-linecap", "round");
    			attr_dev(path96, "stroke-linejoin", "round");
    			add_location(path96, file$a, 475, 1, 24856);
    			attr_dev(path97, "d", "M2968.16 1448.3H3208.06");
    			attr_dev(path97, "stroke", "white");
    			attr_dev(path97, "stroke-width", "6");
    			attr_dev(path97, "stroke-miterlimit", "10");
    			attr_dev(path97, "stroke-linecap", "round");
    			attr_dev(path97, "stroke-linejoin", "round");
    			add_location(path97, file$a, 483, 1, 25009);
    			attr_dev(path98, "d", "M3867.87 1197.64C3867.87 1234.48 3856.69 1270.45 3835.79 1300.79C3782.64 1377.97 3676.06 1532.72 3614.18 1622.57C3584.46 1665.73 3535.42 1691.49 3483.02 1691.49H3042.65C3015.67 1691.49 2988.93 1686.55 2963.74 1676.9L2905.58 1654.62C2886.03 1647.13 2873.12 1628.36 2873.12 1607.43V1495.38C2873.12 1480.96 2884.82 1469.27 2899.24 1469.27L2911.7 1511.85C2915.28 1524.09 2926.48 1532.53 2939.24 1532.6L3001.09 1532.92C3005.81 1532.95 3007.27 1526.56 3003.01 1524.53L2983.73 1515.35C2983.73 1515.35 2960.48 1501.83 2961.2 1480.37H3052.31C3059.55 1480.37 3066.55 1482.88 3072.15 1487.46L3109.91 1509.7H3421.16C3451.24 1509.7 3479.31 1494.61 3495.89 1469.51L3708.44 1147.8C3723.97 1124.29 3750.27 1110.15 3778.45 1110.15H3780.38C3828.7 1110.15 3867.87 1149.32 3867.87 1197.64Z");
    			attr_dev(path98, "fill", "#F1B104");
    			add_location(path98, file$a, 491, 1, 25162);
    			attr_dev(path99, "d", "M2945.13 1639.31L2903.45 1623.34C2883.9 1615.85 2870.99 1598.59 2873.42 1551.57");
    			attr_dev(path99, "stroke", "#573240");
    			attr_dev(path99, "stroke-width", "4");
    			attr_dev(path99, "stroke-miterlimit", "10");
    			attr_dev(path99, "stroke-linecap", "round");
    			add_location(path99, file$a, 495, 1, 25966);
    			attr_dev(path100, "d", "M2946.13 1608.03L2904.45 1592.07C2884.9 1584.58 2872.04 1563.58 2873.12 1519.13");
    			attr_dev(path100, "stroke", "#573240");
    			attr_dev(path100, "stroke-width", "4");
    			attr_dev(path100, "stroke-miterlimit", "10");
    			attr_dev(path100, "stroke-linecap", "round");
    			add_location(path100, file$a, 502, 1, 26151);
    			attr_dev(path101, "d", "M2946.84 1572.03L2903.42 1555.4C2883.88 1547.91 2873.12 1530.22 2873.12 1509.29");
    			attr_dev(path101, "stroke", "#573240");
    			attr_dev(path101, "stroke-width", "4");
    			attr_dev(path101, "stroke-miterlimit", "10");
    			attr_dev(path101, "stroke-linecap", "round");
    			add_location(path101, file$a, 509, 1, 26336);
    			attr_dev(path102, "d", "M2873.12 1564.29V1495.38C2873.12 1480.96 2884.82 1469.27 2899.24 1469.27");
    			attr_dev(path102, "stroke", "#573240");
    			attr_dev(path102, "stroke-width", "4");
    			attr_dev(path102, "stroke-miterlimit", "10");
    			attr_dev(path102, "stroke-linecap", "round");
    			add_location(path102, file$a, 516, 1, 26521);
    			attr_dev(path103, "d", "M2591.27 1765.42C2702.75 1765.42 2793.12 1712.09 2793.12 1646.3C2793.12 1580.52 2702.75 1527.19 2591.27 1527.19C2479.79 1527.19 2389.42 1580.52 2389.42 1646.3C2389.42 1712.09 2479.79 1765.42 2591.27 1765.42Z");
    			attr_dev(path103, "fill", "white");
    			attr_dev(path103, "stroke", "#B2DDDA");
    			attr_dev(path103, "stroke-width", "4");
    			attr_dev(path103, "stroke-miterlimit", "10");
    			add_location(path103, file$a, 523, 1, 26699);
    			attr_dev(path104, "d", "M2731.65 1641.5C2699.85 1679.39 2612.02 1691.05 2542.19 1680.68C2486.33 1672.38 2458.4 1648.11 2479.81 1626.46C2496.94 1609.15 2547.05 1600.49 2591.74 1607.13C2627.49 1612.44 2645.37 1627.97 2631.67 1641.82C2620.71 1652.91 2588.63 1658.45 2560.03 1654.2C2537.15 1650.8 2525.71 1640.86 2534.48 1631.99C2541.5 1624.9 2562.02 1621.35 2580.33 1624.07C2594.97 1626.25 2602.29 1632.61 2596.68 1638.28C2592.19 1642.82 2579.05 1645.09 2567.34 1643.35C2557.96 1641.96 2553.28 1637.89 2556.87 1634.26");
    			attr_dev(path104, "stroke", "#F1B104");
    			attr_dev(path104, "stroke-width", "5");
    			attr_dev(path104, "stroke-miterlimit", "10");
    			attr_dev(path104, "stroke-linecap", "round");
    			add_location(path104, file$a, 530, 1, 27002);
    			attr_dev(path105, "d", "M2471.5 1620.27C2485.61 1600.41 2533.66 1583.77 2578.84 1583.09");
    			attr_dev(path105, "stroke", "#F1B104");
    			attr_dev(path105, "stroke-width", "5");
    			attr_dev(path105, "stroke-miterlimit", "10");
    			attr_dev(path105, "stroke-linecap", "round");
    			add_location(path105, file$a, 537, 1, 27598);
    			attr_dev(path106, "d", "M2709.7 1659.84C2680.2 1697.73 2604.11 1709.38 2539.32 1699.01");
    			attr_dev(path106, "stroke", "#F1B104");
    			attr_dev(path106, "stroke-width", "5");
    			attr_dev(path106, "stroke-miterlimit", "10");
    			attr_dev(path106, "stroke-linecap", "round");
    			add_location(path106, file$a, 544, 1, 27767);
    			attr_dev(path107, "d", "M2498.46 1698.55C2520.7 1693.73 2531.81 1679.63 2523.29 1667.05C2516.47 1656.99 2496.53 1651.97 2478.74 1655.82C2464.51 1658.91 2457.39 1667.93 2462.84 1675.98C2467.21 1682.42 2479.97 1685.63 2491.36 1683.17C2500.47 1681.19 2505.02 1675.42 2501.53 1670.27");
    			attr_dev(path107, "stroke", "#F1B104");
    			attr_dev(path107, "stroke-width", "5");
    			attr_dev(path107, "stroke-miterlimit", "10");
    			attr_dev(path107, "stroke-linecap", "round");
    			add_location(path107, file$a, 551, 1, 27935);
    			attr_dev(path108, "d", "M2690.5 1668.44C2707.71 1664.17 2716.31 1651.67 2709.72 1640.52C2704.44 1631.6 2692.24 1627.14 2678.47 1630.56C2667.46 1633.29 2661.52 1640.46 2665.1 1647.35C2668.15 1653.24 2674.04 1654.84 2682.85 1652.65C2689.9 1650.9 2694.96 1642.07 2689.64 1640.13");
    			attr_dev(path108, "stroke", "#F1B104");
    			attr_dev(path108, "stroke-width", "5");
    			attr_dev(path108, "stroke-miterlimit", "10");
    			attr_dev(path108, "stroke-linecap", "round");
    			add_location(path108, file$a, 558, 1, 28296);
    			attr_dev(path109, "d", "M2583.03 1314.59L2670.15 1574.8");
    			attr_dev(path109, "stroke", "#573240");
    			attr_dev(path109, "stroke-width", "4");
    			attr_dev(path109, "stroke-miterlimit", "10");
    			attr_dev(path109, "stroke-linecap", "round");
    			add_location(path109, file$a, 565, 1, 28653);
    			attr_dev(path110, "d", "M2648.22 1581.82L2632.01 1544.13C2626.92 1532.29 2633.04 1518.63 2645.26 1514.54L2652.88 1512.34C2665.1 1508.25 2678.21 1515.47 2681.27 1527.99L2691.02 1567.85");
    			attr_dev(path110, "stroke", "#573240");
    			attr_dev(path110, "stroke-width", "4");
    			attr_dev(path110, "stroke-miterlimit", "10");
    			attr_dev(path110, "stroke-linecap", "round");
    			add_location(path110, file$a, 572, 1, 28790);
    			attr_dev(path111, "d", "M2508.53 1628.14C2521.34 1628.14 2531.72 1617.76 2531.72 1604.95C2531.72 1592.14 2521.34 1581.76 2508.53 1581.76C2495.73 1581.76 2485.35 1592.14 2485.35 1604.95C2485.35 1617.76 2495.73 1628.14 2508.53 1628.14Z");
    			attr_dev(path111, "fill", "#FF6E00");
    			add_location(path111, file$a, 579, 1, 29055);
    			attr_dev(path112, "d", "M2689.95 1540.11C2693.92 1540.11 2700.54 1543.6 2696.26 1547.62C2693.95 1549.79 2679.72 1553.35 2659.31 1553.35C2638.91 1553.35 2624.79 1547.5 2622.37 1545.47C2618.33 1542.08 2621.04 1538.01 2625.2 1538.01");
    			attr_dev(path112, "stroke", "#F1B104");
    			attr_dev(path112, "stroke-width", "5");
    			attr_dev(path112, "stroke-miterlimit", "10");
    			attr_dev(path112, "stroke-linecap", "round");
    			add_location(path112, file$a, 583, 1, 29299);
    			attr_dev(path113, "d", "M2686.07 1550.96C2691.07 1549.78 2692.4 1552.55 2691.39 1554.97C2690.17 1557.89 2684.01 1564.07 2663.23 1567.18C2642.45 1570.29 2624.29 1567.02 2623.68 1563.92C2623.07 1560.82 2625.51 1558.55 2631.75 1557.47");
    			attr_dev(path113, "stroke", "#F1B104");
    			attr_dev(path113, "stroke-width", "5");
    			attr_dev(path113, "stroke-miterlimit", "10");
    			attr_dev(path113, "stroke-linecap", "round");
    			add_location(path113, file$a, 590, 1, 29610);
    			attr_dev(path114, "d", "M2685.89 1560.38C2691.78 1558.55 2703.77 1567.43 2695.36 1574.8C2686.95 1582.17 2605.82 1569.98 2610.18 1590.9C2613.73 1607.92 2723.69 1622.72 2721.53 1596.35C2720.41 1582.61 2688.92 1581.74 2691.68 1598.16");
    			attr_dev(path114, "stroke", "#F1B104");
    			attr_dev(path114, "stroke-width", "5");
    			attr_dev(path114, "stroke-miterlimit", "10");
    			attr_dev(path114, "stroke-linecap", "round");
    			add_location(path114, file$a, 597, 1, 29923);
    			attr_dev(path115, "d", "M2618.61 1675.95C2630.44 1675.95 2640.04 1666.36 2640.04 1654.52C2640.04 1642.69 2630.44 1633.1 2618.61 1633.1C2606.78 1633.1 2597.19 1642.69 2597.19 1654.52C2597.19 1666.36 2606.78 1675.95 2618.61 1675.95Z");
    			attr_dev(path115, "fill", "#FF6E00");
    			add_location(path115, file$a, 604, 1, 30235);
    			attr_dev(path116, "d", "M2576.37 1676.54C2583.24 1676.54 2588.81 1670.97 2588.81 1664.1C2588.81 1657.23 2583.24 1651.67 2576.37 1651.67C2569.5 1651.67 2563.94 1657.23 2563.94 1664.1C2563.94 1670.97 2569.5 1676.54 2576.37 1676.54Z");
    			attr_dev(path116, "fill", "#FF6E00");
    			add_location(path116, file$a, 608, 1, 30476);
    			attr_dev(path117, "d", "M2690.03 1701.48C2702.13 1701.48 2711.94 1691.67 2711.94 1679.57C2711.94 1667.47 2702.13 1657.66 2690.03 1657.66C2677.93 1657.66 2668.12 1667.47 2668.12 1679.57C2668.12 1691.67 2677.93 1701.48 2690.03 1701.48Z");
    			attr_dev(path117, "fill", "#FF6E00");
    			add_location(path117, file$a, 612, 1, 30716);
    			attr_dev(path118, "d", "M2392.92 1333.43L2036.13 1600.95C2008.76 1621.46 1975.47 1632.56 1941.27 1632.56C1896.43 1632.56 1856.88 1614.23 1828.52 1585.34C1790.94 1547.02 1773.06 1490.14 1788.7 1432.78H1788.71C1805.75 1370.34 1852.42 1320.26 1913.51 1298.86L2268.59 1174.43C2306.87 1161.02 2323.65 1154.48 2356.88 1152.4C2353.86 1152.77 2350.86 1153.4 2347.89 1154.3C2311.17 1165.4 2293.29 1212.65 2307.95 1261.17C2320.92 1304.08 2362.43 1341.5 2392.92 1333.43Z");
    			attr_dev(path118, "fill", "#F1B104");
    			add_location(path118, file$a, 616, 1, 30960);
    			attr_dev(path119, "d", "M1913.51 1298.86L2268.59 1167.96C2313.89 1152.08 2369.46 1153 2397.55 1153.84L2409.42 1321.06L2036.13 1600.95");
    			attr_dev(path119, "stroke", "#573240");
    			attr_dev(path119, "stroke-width", "4");
    			attr_dev(path119, "stroke-miterlimit", "10");
    			attr_dev(path119, "stroke-linecap", "round");
    			add_location(path119, file$a, 620, 1, 31430);
    			attr_dev(path120, "d", "M2440.92 1220.99C2455.58 1269.51 2441.96 1298.94 2404.22 1327.86C2373.77 1351.19 2322.61 1309.69 2307.95 1261.17C2293.29 1212.65 2311.17 1165.4 2347.89 1154.3C2384.61 1143.21 2426.26 1172.47 2440.92 1220.99Z");
    			attr_dev(path120, "fill", "#573240");
    			add_location(path120, file$a, 627, 1, 31645);
    			attr_dev(path121, "d", "M2489.83 1309.9C2492.66 1309.9 2495.31 1311.48 2496.62 1314.05C2498.52 1317.73 2497.13 1322.26 2493.51 1324.25L2479.72 1331.82C2477.52 1333.02 2476.75 1335.81 2478.02 1337.97C2482.99 1346.41 2491.89 1351.11 2501.03 1351.11C2505.56 1351.11 2510.14 1349.96 2514.33 1347.54L2582.34 1313.43L2604.52 1379.83L2611.64 1375.59C2620.79 1370.13 2625.45 1359.47 2623.22 1349.05L2601.37 1246.82C2597.11 1227.77 2583.52 1212.15 2565.25 1205.28L2456.24 1164.31C2437.58 1157.13 2417.71 1153.52 2397.7 1153.67L2348.89 1154.3C2312.17 1165.4 2293.29 1212.65 2307.95 1261.17C2314.35 1282.34 2329.69 1301.18 2345.24 1314.87L2372.04 1293.66C2380.59 1304.56 2390.75 1309.52 2403.43 1310.83L2489.83 1309.9Z");
    			attr_dev(path121, "fill", "white");
    			attr_dev(path121, "stroke", "#573240");
    			attr_dev(path121, "stroke-width", "4");
    			attr_dev(path121, "stroke-miterlimit", "10");
    			attr_dev(path121, "stroke-linecap", "round");
    			add_location(path121, file$a, 631, 1, 31887);
    			attr_dev(path122, "d", "M2564.31 1247.19L2582.34 1313.43");
    			attr_dev(path122, "stroke", "#573240");
    			attr_dev(path122, "stroke-width", "4");
    			attr_dev(path122, "stroke-miterlimit", "10");
    			attr_dev(path122, "stroke-linecap", "round");
    			add_location(path122, file$a, 639, 1, 32691);
    			attr_dev(path123, "d", "M2556.46 1325.29L2538.43 1259.06");
    			attr_dev(path123, "stroke", "#573240");
    			attr_dev(path123, "stroke-width", "4");
    			attr_dev(path123, "stroke-miterlimit", "10");
    			attr_dev(path123, "stroke-linecap", "round");
    			add_location(path123, file$a, 646, 1, 32829);
    			attr_dev(path124, "d", "M2533.81 1337.15L2515.78 1270.92");
    			attr_dev(path124, "stroke", "#573240");
    			attr_dev(path124, "stroke-width", "4");
    			attr_dev(path124, "stroke-miterlimit", "10");
    			attr_dev(path124, "stroke-linecap", "round");
    			add_location(path124, file$a, 653, 1, 32967);
    			attr_dev(path125, "d", "M2873.81 2013.71C2949.5 2013.71 3010.86 1965.57 3010.86 1906.18C3010.86 1846.79 2949.5 1798.64 2873.81 1798.64C2798.12 1798.64 2736.76 1846.79 2736.76 1906.18C2736.76 1965.57 2798.12 2013.71 2873.81 2013.71Z");
    			attr_dev(path125, "fill", "#B2DDDA");
    			add_location(path125, file$a, 660, 1, 33105);
    			attr_dev(path126, "d", "M2983.25 1946.66H2784.91C2780.74 1946.66 2777.36 1943.28 2777.36 1939.11V1901.28H2983.25V1946.66Z");
    			attr_dev(path126, "fill", "white");
    			add_location(path126, file$a, 664, 1, 33347);
    			attr_dev(path127, "d", "M2983.25 1901.28H2777.36C2777.36 1901.28 2801.7 1848.92 2876.59 1834.74L2983.25 1901.28Z");
    			attr_dev(path127, "fill", "#FF6E00");
    			add_location(path127, file$a, 668, 1, 33477);
    			attr_dev(path128, "d", "M2858.73 1849.09C2863.55 1849.09 2867.46 1845.18 2867.46 1840.36C2867.46 1835.54 2863.55 1831.63 2858.73 1831.63C2853.91 1831.63 2850 1835.54 2850 1840.36C2850 1845.18 2853.91 1849.09 2858.73 1849.09Z");
    			attr_dev(path128, "fill", "#FCD4D0");
    			add_location(path128, file$a, 672, 1, 33600);
    			attr_dev(path129, "d", "M2788.65 1851.18C2797.78 1845.45 2809.99 1846.96 2817.46 1855.29C2818.63 1856.59 2819.61 1857.96 2820.41 1859.43C2811.29 1865.18 2799.08 1863.66 2791.61 1855.33C2790.44 1854.03 2789.46 1852.63 2788.65 1851.18Z");
    			attr_dev(path129, "fill", "#F1B104");
    			add_location(path129, file$a, 676, 1, 33835);
    			attr_dev(path130, "d", "M2822.78 1859.89C2831.08 1859.89 2837.8 1853.17 2837.8 1844.87C2837.8 1836.58 2831.08 1829.85 2822.78 1829.85C2814.49 1829.85 2807.76 1836.58 2807.76 1844.87C2807.76 1853.17 2814.49 1859.89 2822.78 1859.89Z");
    			attr_dev(path130, "fill", "#573240");
    			add_location(path130, file$a, 680, 1, 34079);
    			attr_dev(path131, "d", "M2853.39 1826.06C2855.09 1836.71 2848.91 1847.35 2838.32 1850.97C2836.67 1851.53 2835.03 1851.9 2833.36 1852.06C2831.64 1841.42 2837.82 1830.78 2848.41 1827.16C2850.06 1826.6 2851.73 1826.24 2853.39 1826.06Z");
    			attr_dev(path131, "fill", "#F1B104");
    			add_location(path131, file$a, 684, 1, 34320);
    			attr_dev(path132, "d", "M2798.26 1884.5C2805.52 1884.5 2811.41 1878.62 2811.41 1871.36C2811.41 1864.1 2805.52 1858.21 2798.26 1858.21C2791 1858.21 2785.11 1864.1 2785.11 1871.36C2785.11 1878.62 2791 1884.5 2798.26 1884.5Z");
    			attr_dev(path132, "fill", "#573240");
    			add_location(path132, file$a, 688, 1, 34562);
    			attr_dev(path133, "d", "M2842.05 1862.85C2847.25 1862.85 2851.47 1858.63 2851.47 1853.43C2851.47 1848.22 2847.25 1844 2842.05 1844C2836.84 1844 2832.62 1848.22 2832.62 1853.43C2832.62 1858.63 2836.84 1862.85 2842.05 1862.85Z");
    			attr_dev(path133, "fill", "#573240");
    			add_location(path133, file$a, 692, 1, 34794);
    			attr_dev(path134, "d", "M2828.38 1869.32C2833.58 1869.32 2837.8 1865.1 2837.8 1859.89C2837.8 1854.69 2833.58 1850.47 2828.38 1850.47C2823.17 1850.47 2818.95 1854.69 2818.95 1859.89C2818.95 1865.1 2823.17 1869.32 2828.38 1869.32Z");
    			attr_dev(path134, "fill", "#FCD4D0");
    			add_location(path134, file$a, 696, 1, 35029);
    			attr_dev(path135, "d", "M2820.41 1887.93C2824.59 1887.93 2827.98 1884.54 2827.98 1880.36C2827.98 1876.18 2824.59 1872.8 2820.41 1872.8C2816.23 1872.8 2812.84 1876.18 2812.84 1880.36C2812.84 1884.54 2816.23 1887.93 2820.41 1887.93Z");
    			attr_dev(path135, "fill", "#FCD4D0");
    			add_location(path135, file$a, 700, 1, 35268);
    			attr_dev(path136, "d", "M2862.97 1876.89C2867.69 1876.89 2871.51 1873.06 2871.51 1868.35C2871.51 1863.63 2867.69 1859.81 2862.97 1859.81C2858.25 1859.81 2854.43 1863.63 2854.43 1868.35C2854.43 1873.06 2858.25 1876.89 2862.97 1876.89Z");
    			attr_dev(path136, "fill", "#573240");
    			add_location(path136, file$a, 704, 1, 35509);
    			attr_dev(path137, "d", "M2285.56 1453.81C2285.56 1476.34 2267.29 1494.6 2244.76 1494.6C2222.23 1494.6 2203.98 1476.34 2203.98 1453.81C2203.98 1431.28 2222.23 1413.02 2244.76 1413.02C2267.29 1413.02 2285.56 1431.28 2285.56 1453.81Z");
    			attr_dev(path137, "stroke", "#573240");
    			attr_dev(path137, "stroke-width", "4");
    			attr_dev(path137, "stroke-miterlimit", "10");
    			attr_dev(path137, "stroke-linecap", "round");
    			add_location(path137, file$a, 708, 1, 35753);
    			attr_dev(path138, "d", "M2188.42 1650.74C2195.15 1634.97 2217.82 1623.37 2244.76 1623.37C2271.76 1623.37 2294.49 1635.02 2301.16 1650.85L2339.61 1767.23C2350.18 1799.21 2326.35 1832.17 2292.67 1832.17H2196.87C2163.19 1832.17 2139.37 1799.21 2149.94 1767.23L2188.42 1650.74Z");
    			attr_dev(path138, "fill", "#FF6E00");
    			add_location(path138, file$a, 715, 1, 36065);
    			attr_dev(path139, "d", "M2292.67 1832.17H2196.87C2163.19 1832.17 2139.36 1799.21 2149.93 1767.23L2203.98 1603.62V1453.81C2203.98 1476.34 2222.23 1494.6 2244.76 1494.6C2267.29 1494.6 2285.56 1476.34 2285.56 1453.81V1603.62L2339.61 1767.23C2350.17 1799.21 2326.35 1832.17 2292.67 1832.17Z");
    			attr_dev(path139, "stroke", "#573240");
    			attr_dev(path139, "stroke-width", "4");
    			attr_dev(path139, "stroke-miterlimit", "10");
    			attr_dev(path139, "stroke-linecap", "round");
    			add_location(path139, file$a, 719, 1, 36349);
    			attr_dev(path140, "d", "M2259.61 1782.01C2246.7 1804.61 2222.23 1806.98 2200.73 1794.7C2179.23 1782.42 2168.84 1760.13 2181.75 1737.53L2259.61 1782.01Z");
    			attr_dev(path140, "fill", "white");
    			add_location(path140, file$a, 726, 1, 36717);
    			attr_dev(path141, "d", "M2259.51 1784.15C2249.49 1802.2 2221.3 1807.87 2199.64 1795.76C2178.02 1783.68 2168.91 1757.8 2179.62 1738.59");
    			attr_dev(path141, "stroke", "#F1B104");
    			attr_dev(path141, "stroke-width", "4");
    			attr_dev(path141, "stroke-miterlimit", "10");
    			attr_dev(path141, "stroke-linecap", "round");
    			add_location(path141, file$a, 730, 1, 36877);
    			attr_dev(path142, "d", "M2214.01 1788.22C2213.79 1789.47 2212.49 1790.23 2211.37 1789.77C2209.31 1788.95 2207.26 1787.95 2205.24 1786.8C2203.22 1785.65 2201.33 1784.39 2199.57 1783.03C2198.61 1782.29 2198.6 1780.8 2199.56 1779.97L2218.38 1763.8L2214.01 1788.22Z");
    			attr_dev(path142, "fill", "#F1B104");
    			add_location(path142, file$a, 737, 1, 37092);
    			attr_dev(path143, "d", "M2251.16 1779.72C2249.29 1782.35 2247.2 1784.56 2244.92 1786.38C2244.03 1787.09 2242.77 1786.89 2242.18 1785.95L2228.57 1764.29L2250.62 1776.88C2251.6 1777.44 2251.85 1778.76 2251.16 1779.72Z");
    			attr_dev(path143, "fill", "#F1B104");
    			add_location(path143, file$a, 741, 1, 37364);
    			attr_dev(path144, "d", "M2212.74 1755.24L2187.21 1754.55C2186.11 1754.52 2185.29 1753.53 2185.45 1752.4C2185.86 1749.52 2186.7 1746.6 2188.02 1743.65C2188.5 1742.57 2189.76 1742.12 2190.73 1742.67L2212.74 1755.24Z");
    			attr_dev(path144, "fill", "#F1B104");
    			add_location(path144, file$a, 745, 1, 37590);
    			attr_dev(path145, "d", "M2236.24 1791.15C2231.28 1792.86 2225.89 1793.21 2220.42 1792.32C2219.4 1792.16 2218.72 1791.2 2218.89 1790.15L2222.99 1764.89L2237.31 1788.22C2237.96 1789.27 2237.44 1790.74 2236.24 1791.15Z");
    			attr_dev(path145, "fill", "#F1B104");
    			add_location(path145, file$a, 749, 1, 37814);
    			attr_dev(path146, "d", "M2214.36 1759.96L2194.92 1776.12C2194.09 1776.81 2192.9 1776.7 2192.25 1775.89C2188.9 1771.66 2186.61 1766.91 2185.66 1761.87C2185.43 1760.64 2186.42 1759.47 2187.65 1759.49L2214.36 1759.96Z");
    			attr_dev(path146, "fill", "#F1B104");
    			add_location(path146, file$a, 753, 1, 38040);
    			attr_dev(path147, "d", "M2248.57 1724.12C2269.71 1724.12 2286.85 1706.98 2286.85 1685.84C2286.85 1664.69 2269.71 1647.55 2248.57 1647.55C2227.42 1647.55 2210.28 1664.69 2210.28 1685.84C2210.28 1706.98 2227.42 1724.12 2248.57 1724.12Z");
    			attr_dev(path147, "fill", "white");
    			add_location(path147, file$a, 757, 1, 38265);
    			attr_dev(path148, "d", "M2248.57 1724.56C2269.95 1724.56 2287.29 1707.22 2287.29 1685.84C2287.29 1664.45 2269.95 1647.12 2248.57 1647.12C2227.18 1647.12 2209.84 1664.45 2209.84 1685.84C2209.84 1707.22 2227.18 1724.56 2248.57 1724.56Z");
    			attr_dev(path148, "stroke", "#F1B104");
    			attr_dev(path148, "stroke-width", "4");
    			attr_dev(path148, "stroke-miterlimit", "10");
    			attr_dev(path148, "stroke-linecap", "round");
    			add_location(path148, file$a, 761, 1, 38507);
    			attr_dev(path149, "d", "M2257.43 1657.88L2250.16 1679.63C2249.81 1680.68 2247.8 1680.72 2247.38 1679.68L2238.64 1658.07C2238.06 1656.83 2239.02 1655.52 2240.71 1655.14C2243 1654.62 2245.39 1654.36 2247.83 1654.36C2250.44 1654.36 2252.98 1654.66 2255.43 1655.25C2256.91 1655.6 2257.76 1656.76 2257.43 1657.88Z");
    			attr_dev(path149, "fill", "#EFAF00");
    			add_location(path149, file$a, 768, 1, 38822);
    			attr_dev(path150, "d", "M2257.43 1715.21L2250.16 1693.46C2249.81 1692.4 2247.8 1692.37 2247.38 1693.41L2238.64 1715.02C2238.06 1716.25 2239.02 1717.57 2240.71 1717.95C2243 1718.46 2245.39 1718.73 2247.83 1718.73C2250.44 1718.73 2252.98 1718.42 2255.43 1717.84C2256.91 1717.49 2257.76 1716.33 2257.43 1715.21Z");
    			attr_dev(path150, "fill", "#EFAF00");
    			add_location(path150, file$a, 772, 1, 39141);
    			attr_dev(path151, "d", "M2281.45 1686.32C2281.45 1688.29 2281.29 1690.22 2280.99 1692.1C2280.74 1693.58 2278.71 1694.51 2276.83 1693.98L2255 1687.32C2253.76 1686.94 2253.83 1685.61 2255.12 1685.31L2277.04 1680.19C2278.96 1679.65 2281.03 1680.63 2281.21 1682.14C2281.37 1683.51 2281.45 1684.9 2281.45 1686.32Z");
    			attr_dev(path151, "fill", "#EFAF00");
    			add_location(path151, file$a, 776, 1, 39460);
    			attr_dev(path152, "d", "M2276.2 1700.86C2274.4 1704.59 2271.96 1707.94 2269.03 1710.75C2267.66 1712.07 2264.88 1711.86 2263.86 1710.38L2252.16 1692.57C2251.57 1691.67 2252.82 1690.72 2254.05 1691.13L2274.45 1697.99C2275.98 1698.45 2276.75 1699.72 2276.2 1700.86Z");
    			attr_dev(path152, "fill", "#EFAF00");
    			add_location(path152, file$a, 780, 1, 39779);
    			attr_dev(path153, "d", "M2276.49 1674.42L2255.56 1681.45C2254.36 1681.85 2253.11 1680.95 2253.64 1680.05L2264.9 1660.87C2265.83 1659.35 2268.63 1659.05 2270.05 1660.34C2273.48 1663.46 2276.29 1667.28 2278.25 1671.59C2278.77 1672.73 2277.99 1673.97 2276.49 1674.42Z");
    			attr_dev(path153, "fill", "#EFAF00");
    			add_location(path153, file$a, 784, 1, 40052);
    			attr_dev(path154, "d", "M2216.97 1686.32C2216.97 1688.29 2217.13 1690.22 2217.44 1692.1C2217.68 1693.58 2219.71 1694.51 2221.59 1693.98L2243.42 1687.32C2244.67 1686.94 2244.59 1685.61 2243.3 1685.31L2221.38 1680.19C2219.46 1679.65 2217.39 1680.63 2217.21 1682.14C2217.05 1683.51 2216.97 1684.9 2216.97 1686.32Z");
    			attr_dev(path154, "fill", "#EFAF00");
    			add_location(path154, file$a, 788, 1, 40327);
    			attr_dev(path155, "d", "M2221.36 1700.86C2223.16 1704.59 2225.6 1707.94 2228.52 1710.75C2229.89 1712.07 2232.67 1711.86 2233.69 1710.38L2245.4 1692.57C2245.99 1691.67 2244.73 1690.72 2243.5 1691.13L2223.1 1697.99C2221.57 1698.45 2220.8 1699.72 2221.36 1700.86Z");
    			attr_dev(path155, "fill", "#EFAF00");
    			add_location(path155, file$a, 792, 1, 40648);
    			attr_dev(path156, "d", "M2221.94 1674.42L2242.86 1681.45C2244.06 1681.85 2245.31 1680.95 2244.78 1680.05L2233.52 1660.87C2232.59 1659.35 2229.8 1659.05 2228.37 1660.34C2224.94 1663.46 2222.13 1667.28 2220.17 1671.59C2219.65 1672.73 2220.43 1673.97 2221.94 1674.42Z");
    			attr_dev(path156, "fill", "#EFAF00");
    			add_location(path156, file$a, 796, 1, 40919);
    			attr_dev(path157, "d", "M1909.38 1841.74C1930.7 1841.74 1947.99 1824.45 1947.99 1803.13C1947.99 1781.81 1930.7 1764.53 1909.38 1764.53C1888.06 1764.53 1870.78 1781.81 1870.78 1803.13C1870.78 1824.45 1888.06 1841.74 1909.38 1841.74Z");
    			attr_dev(path157, "fill", "#B2DDDA");
    			add_location(path157, file$a, 800, 1, 41194);
    			attr_dev(path158, "d", "M1995.87 1854.76C2015.96 1854.76 2032.24 1838.48 2032.24 1818.39C2032.24 1798.3 2015.96 1782.02 1995.87 1782.02C1975.78 1782.02 1959.5 1798.3 1959.5 1818.39C1959.5 1838.48 1975.78 1854.76 1995.87 1854.76Z");
    			attr_dev(path158, "fill", "#F1B104");
    			add_location(path158, file$a, 804, 1, 41436);
    			attr_dev(path159, "d", "M2053.87 1778.81C2053.87 1805.79 2009.33 1827.68 1954.41 1827.68C1899.48 1827.68 1854.96 1805.79 1854.96 1778.81C1854.96 1778.65 1854.96 1778.5 1854.97 1778.33C1855.49 1751.57 1899.81 1729.95 1954.41 1729.95C2009.01 1729.95 2053.34 1751.57 2053.86 1778.33C2053.87 1778.5 2053.87 1778.65 2053.87 1778.81Z");
    			attr_dev(path159, "stroke", "#B2DDDA");
    			attr_dev(path159, "stroke-width", "4");
    			attr_dev(path159, "stroke-miterlimit", "10");
    			add_location(path159, file$a, 808, 1, 41675);
    			attr_dev(path160, "d", "M1997.52 1903.14C1989.93 1909.49 1973.49 1913.9 1954.41 1913.9C1935.33 1913.9 1918.88 1909.49 1911.3 1903.14L1919.91 1882.4L1920.34 1881.37C1930.97 1885.25 1942.44 1887.36 1954.41 1887.36C1966.38 1887.36 1977.85 1885.25 1988.48 1881.37L1988.91 1882.4L1997.52 1903.14Z");
    			attr_dev(path160, "fill", "white");
    			attr_dev(path160, "stroke", "#B2DDDA");
    			attr_dev(path160, "stroke-width", "4");
    			attr_dev(path160, "stroke-miterlimit", "10");
    			add_location(path160, file$a, 814, 1, 42059);
    			attr_dev(path161, "d", "M1963.42 1784.73C1983 1784.73 1998.89 1768.85 1998.89 1749.26C1998.89 1729.67 1983 1713.79 1963.42 1713.79C1943.83 1713.79 1927.94 1729.67 1927.94 1749.26C1927.94 1768.85 1943.83 1784.73 1963.42 1784.73Z");
    			attr_dev(path161, "fill", "#FCD4D0");
    			add_location(path161, file$a, 821, 1, 42422);
    			attr_dev(path162, "d", "M1872.55 1643.23C1873.93 1642.38 1875.7 1642.92 1876.39 1644.35L1942.38 1781.53C1945.62 1788.27 1951.76 1793.1 1959.02 1794.84C1966.66 1796.67 1974.04 1802.72 1978.31 1811.6C1984.99 1825.48 1981.5 1841.01 1970.54 1846.28C1959.57 1851.56 1945.27 1844.59 1938.59 1830.7C1934.32 1821.83 1934.2 1812.29 1937.54 1805.18C1940.71 1798.41 1940.77 1790.6 1937.53 1783.87L1871.6 1646.81C1870.99 1645.55 1871.35 1643.96 1872.55 1643.23Z");
    			attr_dev(path162, "fill", "#573240");
    			add_location(path162, file$a, 825, 1, 42660);
    			attr_dev(path163, "d", "M2053.87 1778.81V1787.91C2053.87 1830.87 2026.63 1867.47 1988.48 1881.37C1977.85 1885.25 1966.38 1887.36 1954.41 1887.36C1942.44 1887.36 1930.97 1885.25 1920.34 1881.37C1882.19 1867.47 1854.96 1830.87 1854.96 1787.91V1778.81C1854.96 1805.79 1899.48 1827.68 1954.41 1827.68C2009.34 1827.68 2053.87 1805.79 2053.87 1778.81Z");
    			attr_dev(path163, "fill", "white");
    			attr_dev(path163, "stroke", "#B2DDDA");
    			attr_dev(path163, "stroke-width", "4");
    			attr_dev(path163, "stroke-miterlimit", "10");
    			add_location(path163, file$a, 829, 1, 43120);
    			attr_dev(path164, "d", "M3148.01 1891C3203.18 1891 3247.9 1847.92 3247.9 1794.77C3247.9 1741.63 3203.18 1698.55 3148.01 1698.55C3092.85 1698.55 3048.12 1741.63 3048.12 1794.77C3048.12 1847.92 3092.85 1891 3148.01 1891Z");
    			attr_dev(path164, "fill", "white");
    			attr_dev(path164, "stroke", "#B2DDDA");
    			attr_dev(path164, "stroke-width", "4");
    			attr_dev(path164, "stroke-miterlimit", "10");
    			add_location(path164, file$a, 836, 1, 43537);
    			attr_dev(path165, "d", "M3095.4 1699.49V1774.04C3095.4 1800.01 3116.45 1821.06 3142.42 1821.06H3153.61C3179.58 1821.06 3200.63 1800.01 3200.63 1774.04V1699.49H3095.4Z");
    			attr_dev(path165, "fill", "white");
    			attr_dev(path165, "stroke", "#B2DDDA");
    			attr_dev(path165, "stroke-width", "4");
    			attr_dev(path165, "stroke-miterlimit", "10");
    			add_location(path165, file$a, 843, 1, 43827);
    			attr_dev(path166, "d", "M3148.01 1742.69C3177.07 1742.69 3200.63 1723.35 3200.63 1699.49C3200.63 1675.63 3177.07 1656.28 3148.01 1656.28C3118.95 1656.28 3095.4 1675.63 3095.4 1699.49C3095.4 1723.35 3118.95 1742.69 3148.01 1742.69Z");
    			attr_dev(path166, "fill", "white");
    			attr_dev(path166, "stroke", "#B2DDDA");
    			attr_dev(path166, "stroke-width", "4");
    			attr_dev(path166, "stroke-miterlimit", "10");
    			add_location(path166, file$a, 850, 1, 44065);
    			attr_dev(path167, "d", "M3219 1744.43C3229.21 1744.43 3237.49 1736.15 3237.49 1725.94C3237.49 1715.73 3229.21 1707.45 3219 1707.45C3208.79 1707.45 3200.52 1715.73 3200.52 1725.94C3200.52 1736.15 3208.79 1744.43 3219 1744.43Z");
    			attr_dev(path167, "stroke", "#B2DDDA");
    			attr_dev(path167, "stroke-width", "4");
    			attr_dev(path167, "stroke-miterlimit", "10");
    			add_location(path167, file$a, 857, 1, 44367);
    			attr_dev(path168, "d", "M3196.45 1710.55C3190.35 1727.78 3170.96 1740.38 3148.01 1740.38C3124.8 1740.38 3105.26 1727.51 3099.39 1710C3111.97 1698.12 3128.95 1690.83 3147.63 1690.83C3166.6 1690.83 3183.81 1698.34 3196.45 1710.55Z");
    			attr_dev(path168, "fill", "#573240");
    			add_location(path168, file$a, 863, 1, 44648);
    			attr_dev(path169, "d", "M3413.12 1835.24C3413.28 1836.85 3412.03 1838.22 3410.43 1838.22H3257.83C3250.34 1838.22 3243.32 1841.66 3238.58 1847.47C3233.61 1853.57 3224.94 1857.61 3215.06 1857.61C3199.62 1857.61 3187.11 1847.72 3187.11 1835.52C3187.11 1823.32 3199.62 1813.43 3215.06 1813.43C3224.94 1813.43 3233.61 1817.47 3238.58 1823.57C3243.32 1829.38 3250.34 1832.82 3257.83 1832.82H3410.29C3411.7 1832.82 3412.97 1833.84 3413.12 1835.24Z");
    			attr_dev(path169, "fill", "#F1B104");
    			add_location(path169, file$a, 867, 1, 44887);
    			attr_dev(path170, "d", "M1752.79 1867.29H1652.49L1652.5 1787.69C1652.84 1765.34 1675.16 1747.3 1702.64 1747.3C1730.12 1747.3 1752.43 1765.34 1752.78 1787.69L1752.79 1867.29Z");
    			attr_dev(path170, "fill", "#FF6E00");
    			add_location(path170, file$a, 871, 1, 45338);
    			attr_dev(path171, "d", "M1752.79 1668.5V1867.29H1652.49V1668.5C1652.49 1691.09 1674.94 1709.41 1702.64 1709.41C1730.33 1709.41 1752.79 1691.09 1752.79 1668.5Z");
    			attr_dev(path171, "stroke", "#573240");
    			attr_dev(path171, "stroke-width", "4");
    			attr_dev(path171, "stroke-miterlimit", "10");
    			attr_dev(path171, "stroke-linecap", "round");
    			add_location(path171, file$a, 875, 1, 45522);
    			attr_dev(path172, "d", "M1752.79 1668.5C1752.79 1691.09 1730.33 1709.41 1702.64 1709.41C1674.94 1709.41 1652.49 1691.09 1652.49 1668.5C1652.49 1668.33 1652.49 1668.15 1652.5 1667.97C1652.84 1645.63 1675.16 1627.58 1702.64 1627.58C1730.12 1627.58 1752.43 1645.63 1752.77 1667.97C1752.79 1668.15 1752.79 1668.33 1752.79 1668.5Z");
    			attr_dev(path172, "stroke", "#573240");
    			attr_dev(path172, "stroke-width", "4");
    			attr_dev(path172, "stroke-miterlimit", "10");
    			attr_dev(path172, "stroke-linecap", "round");
    			add_location(path172, file$a, 882, 1, 45762);
    			attr_dev(path173, "d", "M1702.64 1703.15V1585.98C1702.64 1565.62 1686.95 1548.7 1666.66 1547.15L1538.26 1537.37");
    			attr_dev(path173, "stroke", "#FF6E00");
    			attr_dev(path173, "stroke-width", "4");
    			attr_dev(path173, "stroke-miterlimit", "10");
    			attr_dev(path173, "stroke-linecap", "round");
    			add_location(path173, file$a, 889, 1, 46169);
    			attr_dev(path174, "d", "M1608.96 1573.88C1617.56 1573.88 1624.53 1566.9 1624.53 1558.3C1624.53 1549.7 1617.56 1542.73 1608.96 1542.73C1600.36 1542.73 1593.39 1549.7 1593.39 1558.3C1593.39 1566.9 1600.36 1573.88 1608.96 1573.88Z");
    			attr_dev(path174, "stroke", "#FF6E00");
    			attr_dev(path174, "stroke-width", "4");
    			attr_dev(path174, "stroke-miterlimit", "10");
    			add_location(path174, file$a, 896, 1, 46362);
    			attr_dev(path175, "d", "M1702.64 1715.41V1756.44");
    			attr_dev(path175, "stroke", "#FF6E00");
    			attr_dev(path175, "stroke-width", "4");
    			attr_dev(path175, "stroke-miterlimit", "10");
    			attr_dev(path175, "stroke-linecap", "round");
    			add_location(path175, file$a, 902, 1, 46646);
    			attr_dev(path176, "d", "M1728.87 2188.9C1659.45 2274.04 1563.81 2286.29 1558 2286.96L1478.58 2148.29C1473.47 2139.57 1464.13 2134.22 1454.03 2134.25L1375.7 2134.55L1376.48 1939.2H1503.13C1559.2 1939.2 1610.76 1969.95 1637.41 2019.29L1728.87 2188.9Z");
    			attr_dev(path176, "fill", "#B2DDDA");
    			add_location(path176, file$a, 909, 1, 46776);
    			attr_dev(path177, "d", "M1787.55 2299.17C1714.88 2353.34 1638.39 2373.53 1622.05 2377.39L1557.72 2286.99C1557.72 2286.99 1557.81 2286.98 1558 2286.96C1563.81 2286.29 1659.45 2274.04 1728.87 2188.9C1728.99 2188.75 1729.12 2188.6 1729.24 2188.45L1754.94 2237.25L1787.55 2299.17Z");
    			attr_dev(path177, "fill", "#F1B104");
    			add_location(path177, file$a, 913, 1, 47035);
    			attr_dev(path178, "d", "M1814.67 2350.67C1793.74 2360.36 1766.93 2367.8 1740.87 2372.93C1732.82 2374.52 1729.03 2363.38 1736.36 2359.69C1771.93 2341.78 1799.48 2321.83 1799.48 2321.83L1814.67 2350.67Z");
    			attr_dev(path178, "fill", "#F1B104");
    			add_location(path178, file$a, 917, 1, 47322);
    			attr_dev(path179, "d", "M1557.72 2291.31C1557.72 2291.31 1657.59 2276.7 1729.24 2188.45");
    			attr_dev(path179, "stroke", "white");
    			attr_dev(path179, "stroke-width", "5");
    			attr_dev(path179, "stroke-miterlimit", "10");
    			attr_dev(path179, "stroke-linecap", "round");
    			attr_dev(path179, "stroke-linejoin", "round");
    			add_location(path179, file$a, 921, 1, 47533);
    			attr_dev(path180, "d", "M1855.09 2409.37L1666.65 2439.43L1659.62 2429.87L1861.45 2397.61C1864.14 2397.3 1865.73 2395.02 1865.66 2392.72C1867.85 2400.21 1862.99 2408.11 1855.09 2409.37Z");
    			attr_dev(path180, "fill", "white");
    			add_location(path180, file$a, 929, 1, 47726);
    			attr_dev(path181, "d", "M1861.45 2397.61L1659.62 2429.87L1621.16 2377.6C1635.4 2374.3 1713.46 2354.4 1787.55 2299.17L1799.48 2321.83C1799.48 2321.83 1771.93 2341.78 1736.36 2359.69C1729.03 2363.38 1732.82 2374.52 1740.87 2372.93C1766.93 2367.8 1793.75 2360.36 1814.68 2350.67L1814.9 2351.1L1863.83 2389.14C1867.19 2391.75 1865.68 2397.13 1861.45 2397.61Z");
    			attr_dev(path181, "fill", "#573240");
    			add_location(path181, file$a, 933, 1, 47919);
    			attr_dev(path182, "d", "M1600.78 2137.09L1578.18 2286.99C1468.17 2315.62 1379.03 2286.99 1379.03 2286.99V2153.54C1379.03 2143.05 1370.53 2134.55 1360.05 2134.55H1209.79C1121.04 2134.55 1049.11 2062.6 1049.11 1973.86V1939.2H1430.48C1535.82 1939.2 1616.48 2032.92 1600.78 2137.09Z");
    			attr_dev(path182, "fill", "#B2DDDA");
    			add_location(path182, file$a, 937, 1, 48284);
    			attr_dev(path183, "d", "M1482.44 2429.14C1521.71 2435.79 1555.72 2436.05 1555.72 2436.05L1550.86 2468.29C1528.27 2463.69 1502.25 2453.79 1478.22 2442.48C1470.8 2438.99 1474.35 2427.77 1482.44 2429.14Z");
    			attr_dev(path183, "fill", "#F1B104");
    			add_location(path183, file$a, 941, 1, 48573);
    			attr_dev(path184, "d", "M1578.18 2286.99L1559.54 2410.73C1467.12 2411.31 1392.46 2381.08 1379.03 2375.3V2286.99C1379.03 2286.99 1468.17 2315.62 1578.18 2286.99Z");
    			attr_dev(path184, "fill", "#F1B104");
    			add_location(path184, file$a, 945, 1, 48784);
    			attr_dev(path185, "d", "M1049.11 1941.36V1973.86C1049.11 2062.6 1121.04 2134.55 1209.79 2134.55H1360.05C1370.53 2134.55 1379.03 2143.05 1379.03 2153.54V2286.99C1379.03 2286.99 1468.17 2315.61 1578.18 2286.99L1600.78 2137.09C1616.48 2032.92 1535.82 1939.2 1430.48 1939.2H1400.4");
    			attr_dev(path185, "stroke", "white");
    			attr_dev(path185, "stroke-width", "5");
    			attr_dev(path185, "stroke-miterlimit", "10");
    			attr_dev(path185, "stroke-linecap", "round");
    			attr_dev(path185, "stroke-linejoin", "round");
    			add_location(path185, file$a, 949, 1, 48955);
    			attr_dev(path186, "d", "M1567.42 2531.67L1567.4 2531.94C1566.82 2539.82 1558.38 2544.55 1551.36 2540.93L1379.03 2452.06V2440.19L1560.72 2533.82C1563.34 2535.33 1566.33 2534.02 1567.42 2531.67Z");
    			attr_dev(path186, "fill", "white");
    			add_location(path186, file$a, 957, 1, 49337);
    			attr_dev(path187, "d", "M1567.66 2528.4L1567.42 2531.67C1566.33 2534.02 1563.34 2535.33 1560.72 2533.82L1379.03 2440.19V2375.3C1392.46 2381.08 1467.12 2411.31 1559.54 2410.73L1555.72 2436.05C1555.72 2436.05 1521.71 2435.79 1482.44 2429.14C1474.35 2427.77 1470.8 2438.99 1478.22 2442.48C1502.25 2453.79 1528.27 2463.69 1550.86 2468.29L1550.79 2468.77L1567.66 2528.4Z");
    			attr_dev(path187, "fill", "#573240");
    			add_location(path187, file$a, 961, 1, 49538);
    			attr_dev(path188, "d", "M1490.06 1711.71C1506.18 1729 1590.53 1801.58 1727.82 1797.23C1727.82 1797.23 1731.38 1811.54 1721.56 1817.27C1715.54 1820.78 1687.26 1831.26 1686.41 1843.03C1685.94 1849.71 1717.9 1849.71 1730.79 1838.26C1743.67 1826.81 1745.58 1798.8 1772.92 1802.62L1761.56 1880.8C1752.87 1907.21 1713.38 1926.17 1685.73 1929.16C1611.6 1937.17 1490.03 1939.73 1392.29 1853.69L1490.06 1711.71Z");
    			attr_dev(path188, "fill", "#F1B104");
    			add_location(path188, file$a, 965, 1, 49914);
    			attr_dev(path189, "d", "M1255.09 1563.83C1244.64 1581.82 1223.84 1594.09 1199.88 1594.09C1165.43 1594.09 1137.5 1568.73 1137.5 1537.45C1137.5 1507.51 1163.1 1482.99 1195.51 1480.96C1199.44 1460.21 1217.68 1444.51 1239.58 1444.51C1251.06 1444.51 1261.54 1448.83 1269.48 1455.93V1440.82C1269.48 1406.85 1298.33 1380.04 1332.21 1382.53L1379.98 1386.09C1405.7 1388.01 1423.59 1412.49 1417.61 1437.58L1398.8 1510.56H1399.02C1425.42 1510.56 1446.82 1531.96 1446.82 1558.36C1446.82 1584.76 1425.42 1606.16 1399.02 1606.16C1390.36 1606.16 1382.25 1603.86 1375.24 1599.84L1255.09 1563.83Z");
    			attr_dev(path189, "fill", "#573240");
    			add_location(path189, file$a, 969, 1, 50327);
    			attr_dev(path190, "d", "M1374.92 1533.08V1592.16C1354.71 1572.84 1328.52 1561.09 1300.76 1558.79C1309.23 1551.4 1314.59 1540.53 1314.59 1528.4C1314.59 1520.46 1312.3 1513.07 1308.33 1506.84H1287.53C1275.82 1506.84 1266.32 1497.35 1266.32 1485.63V1482.3C1266.32 1470.59 1275.82 1461.1 1287.53 1461.1H1293.2C1301.87 1461.1 1308.9 1468.13 1308.9 1476.8V1480.29C1308.9 1470.32 1316.64 1462.14 1326.58 1461.43C1346.29 1460.03 1377.83 1452.18 1396.61 1418.73C1398.18 1415.92 1402.43 1416.78 1402.75 1419.99L1410.06 1492.04C1412.22 1513.37 1396.05 1531.97 1374.92 1533.08Z");
    			attr_dev(path190, "fill", "#F1B104");
    			add_location(path190, file$a, 973, 1, 50917);
    			attr_dev(path191, "d", "M1376.16 1535.18H1355.9C1336.48 1535.18 1316.48 1524.77 1306.84 1507.91");
    			attr_dev(path191, "stroke", "#573240");
    			attr_dev(path191, "stroke-width", "4");
    			attr_dev(path191, "stroke-miterlimit", "10");
    			attr_dev(path191, "stroke-linecap", "round");
    			add_location(path191, file$a, 977, 1, 51493);
    			attr_dev(path192, "d", "M1298.76 1485.38C1298.76 1478.22 1292.95 1472.41 1285.79 1472.41");
    			attr_dev(path192, "stroke", "#573240");
    			attr_dev(path192, "stroke-width", "4");
    			attr_dev(path192, "stroke-miterlimit", "10");
    			attr_dev(path192, "stroke-linecap", "round");
    			add_location(path192, file$a, 984, 1, 51670);
    			attr_dev(path193, "d", "M1382.43 1503.67C1375.52 1505.52 1367.33 1501.42 1365.48 1494.5L1359.9 1498.78");
    			attr_dev(path193, "stroke", "#573240");
    			attr_dev(path193, "stroke-width", "4");
    			attr_dev(path193, "stroke-miterlimit", "10");
    			attr_dev(path193, "stroke-linecap", "round");
    			attr_dev(path193, "stroke-linejoin", "round");
    			add_location(path193, file$a, 991, 1, 51840);
    			attr_dev(path194, "d", "M1408.66 1455.48C1405.51 1448.23 1398.61 1445.27 1390.49 1448.69C1385.96 1450.6 1373.96 1467.89 1382.24 1485.38");
    			attr_dev(path194, "stroke", "#573240");
    			attr_dev(path194, "stroke-width", "4");
    			attr_dev(path194, "stroke-miterlimit", "10");
    			attr_dev(path194, "stroke-linecap", "round");
    			add_location(path194, file$a, 999, 1, 52050);
    			attr_dev(path195, "d", "M1395.12 1475.68C1397.17 1475.68 1398.82 1473.01 1398.82 1469.71C1398.82 1466.42 1397.17 1463.75 1395.12 1463.75C1393.08 1463.75 1391.43 1466.42 1391.43 1469.71C1391.43 1473.01 1393.08 1475.68 1395.12 1475.68Z");
    			attr_dev(path195, "fill", "#573240");
    			add_location(path195, file$a, 1006, 1, 52267);
    			attr_dev(path196, "d", "M1357.38 1475.68C1359.42 1475.68 1361.07 1473.01 1361.07 1469.71C1361.07 1466.42 1359.42 1463.75 1357.38 1463.75C1355.33 1463.75 1353.68 1466.42 1353.68 1469.71C1353.68 1473.01 1355.33 1475.68 1357.38 1475.68Z");
    			attr_dev(path196, "fill", "#573240");
    			add_location(path196, file$a, 1010, 1, 52511);
    			attr_dev(path197, "d", "M1490.06 1711.71L1378.57 1595.79C1355.57 1571.87 1323.82 1558.36 1290.64 1558.36C1244.92 1558.36 1203.03 1583.93 1182.13 1624.6L1020.48 1942.2H1400.4L1392.29 1853.69L1490.06 1711.71Z");
    			attr_dev(path197, "fill", "#FF6E00");
    			add_location(path197, file$a, 1014, 1, 52755);
    			attr_dev(path198, "d", "M1392.29 1853.69C1372.11 1838.26 1309.61 1794.84 1282.89 1746.18");
    			attr_dev(path198, "stroke", "#573240");
    			attr_dev(path198, "stroke-width", "4");
    			attr_dev(path198, "stroke-miterlimit", "10");
    			attr_dev(path198, "stroke-linecap", "round");
    			add_location(path198, file$a, 1018, 1, 52972);
    			attr_dev(svg, "width", "5000");
    			attr_dev(svg, "height", "3500");
    			attr_dev(svg, "class", "logo svelte-1pn7q6");
    			attr_dev(svg, "viewBox", "0 0 5000 3500");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg, file$a, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path0);
    			append_dev(svg, path1);
    			append_dev(svg, path2);
    			append_dev(svg, path3);
    			append_dev(svg, path4);
    			append_dev(svg, path5);
    			append_dev(svg, path6);
    			append_dev(svg, path7);
    			append_dev(svg, path8);
    			append_dev(svg, path9);
    			append_dev(svg, path10);
    			append_dev(svg, path11);
    			append_dev(svg, path12);
    			append_dev(svg, path13);
    			append_dev(svg, path14);
    			append_dev(svg, path15);
    			append_dev(svg, path16);
    			append_dev(svg, path17);
    			append_dev(svg, path18);
    			append_dev(svg, path19);
    			append_dev(svg, path20);
    			append_dev(svg, path21);
    			append_dev(svg, path22);
    			append_dev(svg, path23);
    			append_dev(svg, path24);
    			append_dev(svg, path25);
    			append_dev(svg, path26);
    			append_dev(svg, path27);
    			append_dev(svg, path28);
    			append_dev(svg, path29);
    			append_dev(svg, path30);
    			append_dev(svg, path31);
    			append_dev(svg, path32);
    			append_dev(svg, path33);
    			append_dev(svg, path34);
    			append_dev(svg, path35);
    			append_dev(svg, path36);
    			append_dev(svg, path37);
    			append_dev(svg, path38);
    			append_dev(svg, path39);
    			append_dev(svg, path40);
    			append_dev(svg, path41);
    			append_dev(svg, path42);
    			append_dev(svg, path43);
    			append_dev(svg, path44);
    			append_dev(svg, path45);
    			append_dev(svg, path46);
    			append_dev(svg, path47);
    			append_dev(svg, path48);
    			append_dev(svg, path49);
    			append_dev(svg, path50);
    			append_dev(svg, path51);
    			append_dev(svg, path52);
    			append_dev(svg, path53);
    			append_dev(svg, path54);
    			append_dev(svg, path55);
    			append_dev(svg, path56);
    			append_dev(svg, path57);
    			append_dev(svg, path58);
    			append_dev(svg, path59);
    			append_dev(svg, path60);
    			append_dev(svg, path61);
    			append_dev(svg, path62);
    			append_dev(svg, path63);
    			append_dev(svg, path64);
    			append_dev(svg, path65);
    			append_dev(svg, path66);
    			append_dev(svg, path67);
    			append_dev(svg, path68);
    			append_dev(svg, path69);
    			append_dev(svg, path70);
    			append_dev(svg, path71);
    			append_dev(svg, path72);
    			append_dev(svg, path73);
    			append_dev(svg, path74);
    			append_dev(svg, path75);
    			append_dev(svg, path76);
    			append_dev(svg, path77);
    			append_dev(svg, path78);
    			append_dev(svg, path79);
    			append_dev(svg, path80);
    			append_dev(svg, path81);
    			append_dev(svg, path82);
    			append_dev(svg, path83);
    			append_dev(svg, path84);
    			append_dev(svg, path85);
    			append_dev(svg, path86);
    			append_dev(svg, path87);
    			append_dev(svg, path88);
    			append_dev(svg, path89);
    			append_dev(svg, path90);
    			append_dev(svg, path91);
    			append_dev(svg, path92);
    			append_dev(svg, path93);
    			append_dev(svg, path94);
    			append_dev(svg, path95);
    			append_dev(svg, path96);
    			append_dev(svg, path97);
    			append_dev(svg, path98);
    			append_dev(svg, path99);
    			append_dev(svg, path100);
    			append_dev(svg, path101);
    			append_dev(svg, path102);
    			append_dev(svg, path103);
    			append_dev(svg, path104);
    			append_dev(svg, path105);
    			append_dev(svg, path106);
    			append_dev(svg, path107);
    			append_dev(svg, path108);
    			append_dev(svg, path109);
    			append_dev(svg, path110);
    			append_dev(svg, path111);
    			append_dev(svg, path112);
    			append_dev(svg, path113);
    			append_dev(svg, path114);
    			append_dev(svg, path115);
    			append_dev(svg, path116);
    			append_dev(svg, path117);
    			append_dev(svg, path118);
    			append_dev(svg, path119);
    			append_dev(svg, path120);
    			append_dev(svg, path121);
    			append_dev(svg, path122);
    			append_dev(svg, path123);
    			append_dev(svg, path124);
    			append_dev(svg, path125);
    			append_dev(svg, path126);
    			append_dev(svg, path127);
    			append_dev(svg, path128);
    			append_dev(svg, path129);
    			append_dev(svg, path130);
    			append_dev(svg, path131);
    			append_dev(svg, path132);
    			append_dev(svg, path133);
    			append_dev(svg, path134);
    			append_dev(svg, path135);
    			append_dev(svg, path136);
    			append_dev(svg, path137);
    			append_dev(svg, path138);
    			append_dev(svg, path139);
    			append_dev(svg, path140);
    			append_dev(svg, path141);
    			append_dev(svg, path142);
    			append_dev(svg, path143);
    			append_dev(svg, path144);
    			append_dev(svg, path145);
    			append_dev(svg, path146);
    			append_dev(svg, path147);
    			append_dev(svg, path148);
    			append_dev(svg, path149);
    			append_dev(svg, path150);
    			append_dev(svg, path151);
    			append_dev(svg, path152);
    			append_dev(svg, path153);
    			append_dev(svg, path154);
    			append_dev(svg, path155);
    			append_dev(svg, path156);
    			append_dev(svg, path157);
    			append_dev(svg, path158);
    			append_dev(svg, path159);
    			append_dev(svg, path160);
    			append_dev(svg, path161);
    			append_dev(svg, path162);
    			append_dev(svg, path163);
    			append_dev(svg, path164);
    			append_dev(svg, path165);
    			append_dev(svg, path166);
    			append_dev(svg, path167);
    			append_dev(svg, path168);
    			append_dev(svg, path169);
    			append_dev(svg, path170);
    			append_dev(svg, path171);
    			append_dev(svg, path172);
    			append_dev(svg, path173);
    			append_dev(svg, path174);
    			append_dev(svg, path175);
    			append_dev(svg, path176);
    			append_dev(svg, path177);
    			append_dev(svg, path178);
    			append_dev(svg, path179);
    			append_dev(svg, path180);
    			append_dev(svg, path181);
    			append_dev(svg, path182);
    			append_dev(svg, path183);
    			append_dev(svg, path184);
    			append_dev(svg, path185);
    			append_dev(svg, path186);
    			append_dev(svg, path187);
    			append_dev(svg, path188);
    			append_dev(svg, path189);
    			append_dev(svg, path190);
    			append_dev(svg, path191);
    			append_dev(svg, path192);
    			append_dev(svg, path193);
    			append_dev(svg, path194);
    			append_dev(svg, path195);
    			append_dev(svg, path196);
    			append_dev(svg, path197);
    			append_dev(svg, path198);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Draw', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Draw> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Draw extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Draw",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    /* src/routes/index.svelte generated by Svelte v3.46.4 */
    const file$9 = "src/routes/index.svelte";

    function create_fragment$9(ctx) {
    	let h1;
    	let h1_transition;
    	let t1;
    	let draw;
    	let t2;
    	let div;
    	let searchblock;
    	let t3;
    	let recipelist;
    	let current;
    	draw = new Draw({ $$inline: true });
    	searchblock = new Search_block({ $$inline: true });
    	recipelist = new Recipe_list({ $$inline: true });

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Share Your Recipes";
    			t1 = space();
    			create_component(draw.$$.fragment);
    			t2 = space();
    			div = element("div");
    			create_component(searchblock.$$.fragment);
    			t3 = space();
    			create_component(recipelist.$$.fragment);
    			attr_dev(h1, "class", "title svelte-1ajfhjz");
    			add_location(h1, file$9, 7, 0, 210);
    			attr_dev(div, "class", "homepage-container svelte-1ajfhjz");
    			add_location(div, file$9, 9, 0, 306);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(draw, target, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div, anchor);
    			mount_component(searchblock, div, null);
    			append_dev(div, t3);
    			mount_component(recipelist, div, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!h1_transition) h1_transition = create_bidirectional_transition(h1, fly, { duration: 1000, y: -100 }, true);
    				h1_transition.run(1);
    			});

    			transition_in(draw.$$.fragment, local);
    			transition_in(searchblock.$$.fragment, local);
    			transition_in(recipelist.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (!h1_transition) h1_transition = create_bidirectional_transition(h1, fly, { duration: 1000, y: -100 }, false);
    			h1_transition.run(0);
    			transition_out(draw.$$.fragment, local);
    			transition_out(searchblock.$$.fragment, local);
    			transition_out(recipelist.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching && h1_transition) h1_transition.end();
    			if (detaching) detach_dev(t1);
    			destroy_component(draw, detaching);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div);
    			destroy_component(searchblock);
    			destroy_component(recipelist);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Routes', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Routes> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ SearchBlock: Search_block, RecipeList: Recipe_list, Draw, fly });
    	return [];
    }

    class Routes extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Routes",
    			options,
    			id: create_fragment$9.name
    		});
    	}
    }

    /* src/routes/about.svelte generated by Svelte v3.46.4 */

    const file$8 = "src/routes/about.svelte";

    function create_fragment$8(ctx) {
    	let h2;
    	let t1;
    	let h5;
    	let t3;
    	let p0;
    	let t5;
    	let p1;
    	let t7;
    	let p2;
    	let t9;
    	let p3;
    	let t11;
    	let p4;
    	let t12;
    	let a;
    	let t14;
    	let b0;
    	let t16;
    	let b1;
    	let t18;
    	let b2;
    	let t20;

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			h2.textContent = "About";
    			t1 = space();
    			h5 = element("h5");
    			h5.textContent = "Welcome to ShareYourRecipes!";
    			t3 = space();
    			p0 = element("p");
    			p0.textContent = "I'll explain how this idea was born and what problems it solves.";
    			t5 = space();
    			p1 = element("p");
    			p1.textContent = "Do you often eat unhealthy foods or spend money in with take away because you didn't plan what to cook ahead of time?";
    			t7 = space();
    			p2 = element("p");
    			p2.textContent = "Even though I love to cook, I've certainly fallen into this habit. The reason is simply. Lack of organization. Both in deciding what to cook, as in having the ingridients at home.";
    			t9 = space();
    			p3 = element("p");
    			p3.textContent = "With this app, you can store all of your favorite recipes and search for your cravings using tag-based search. Instead of categorizing your recipes by cuisine (italian, indian) or by dish (soup, starter, dessert), you can do both. Create all the tags you can think of to simplify the search.";
    			t11 = space();
    			p4 = element("p");
    			t12 = text("Example: let's say you have a delicious italian fish soup. Use the navbar to create a ");
    			a = element("a");
    			a.textContent = "New Recipe";
    			t14 = text(" and add the tags ");
    			b0 = element("b");
    			b0.textContent = "soup";
    			t16 = text(", ");
    			b1 = element("b");
    			b1.textContent = "italian";
    			t18 = text(" and ");
    			b2 = element("b");
    			b2.textContent = "fish";
    			t20 = text(". Now you can find it if you're craving italian, if you want to have a soup in your meal prep, or if you want to eat some sea food.");
    			attr_dev(h2, "class", "space-bottom");
    			add_location(h2, file$8, 0, 0, 0);
    			attr_dev(h5, "class", "space-bottom-xl primary svelte-2acqwl");
    			add_location(h5, file$8, 2, 0, 37);
    			attr_dev(p0, "class", "svelte-2acqwl");
    			add_location(p0, file$8, 3, 0, 107);
    			attr_dev(p1, "class", "svelte-2acqwl");
    			add_location(p1, file$8, 4, 0, 179);
    			attr_dev(p2, "class", "svelte-2acqwl");
    			add_location(p2, file$8, 5, 0, 304);
    			attr_dev(p3, "class", "svelte-2acqwl");
    			add_location(p3, file$8, 6, 0, 492);
    			attr_dev(a, "href", "/new-recipe");
    			add_location(a, file$8, 7, 89, 880);
    			attr_dev(b0, "class", "svelte-2acqwl");
    			add_location(b0, file$8, 7, 143, 934);
    			attr_dev(b1, "class", "svelte-2acqwl");
    			add_location(b1, file$8, 7, 156, 947);
    			attr_dev(b2, "class", "svelte-2acqwl");
    			add_location(b2, file$8, 7, 175, 966);
    			attr_dev(p4, "class", "svelte-2acqwl");
    			add_location(p4, file$8, 7, 0, 791);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, h5, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, p0, anchor);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, p1, anchor);
    			insert_dev(target, t7, anchor);
    			insert_dev(target, p2, anchor);
    			insert_dev(target, t9, anchor);
    			insert_dev(target, p3, anchor);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, p4, anchor);
    			append_dev(p4, t12);
    			append_dev(p4, a);
    			append_dev(p4, t14);
    			append_dev(p4, b0);
    			append_dev(p4, t16);
    			append_dev(p4, b1);
    			append_dev(p4, t18);
    			append_dev(p4, b2);
    			append_dev(p4, t20);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(h5);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(p0);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(p1);
    			if (detaching) detach_dev(t7);
    			if (detaching) detach_dev(p2);
    			if (detaching) detach_dev(t9);
    			if (detaching) detach_dev(p3);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(p4);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('About', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<About> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class About extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "About",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    /* src/lib/input.svelte generated by Svelte v3.46.4 */

    const file$7 = "src/lib/input.svelte";

    function create_fragment$7(ctx) {
    	let div;
    	let input;
    	let t0;
    	let label_1;
    	let t1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			input = element("input");
    			t0 = space();
    			label_1 = element("label");
    			t1 = text(/*label*/ ctx[1]);
    			attr_dev(input, "id", /*id*/ ctx[0]);
    			attr_dev(input, "type", "text");
    			attr_dev(input, "class", "input-field svelte-42ekdt");
    			add_location(input, file$7, 7, 2, 117);
    			attr_dev(label_1, "for", /*id*/ ctx[0]);
    			attr_dev(label_1, "class", "input-label svelte-42ekdt");
    			toggle_class(label_1, "selected", /*value*/ ctx[2]);
    			add_location(label_1, file$7, 8, 2, 186);
    			attr_dev(div, "class", "input-group svelte-42ekdt");
    			add_location(div, file$7, 6, 0, 89);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, input);
    			set_input_value(input, /*value*/ ctx[2]);
    			append_dev(div, t0);
    			append_dev(div, label_1);
    			append_dev(label_1, t1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler*/ ctx[4]),
    					listen_dev(input, "keyup", /*keyup_handler*/ ctx[3], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*id*/ 1) {
    				attr_dev(input, "id", /*id*/ ctx[0]);
    			}

    			if (dirty & /*value*/ 4 && input.value !== /*value*/ ctx[2]) {
    				set_input_value(input, /*value*/ ctx[2]);
    			}

    			if (dirty & /*label*/ 2) set_data_dev(t1, /*label*/ ctx[1]);

    			if (dirty & /*id*/ 1) {
    				attr_dev(label_1, "for", /*id*/ ctx[0]);
    			}

    			if (dirty & /*value*/ 4) {
    				toggle_class(label_1, "selected", /*value*/ ctx[2]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Input', slots, []);
    	let value;
    	let { id = "test" } = $$props;
    	let { label = "Label" } = $$props;
    	const writable_props = ['id', 'label'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Input> was created with unknown prop '${key}'`);
    	});

    	function keyup_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_input_handler() {
    		value = this.value;
    		$$invalidate(2, value);
    	}

    	$$self.$$set = $$props => {
    		if ('id' in $$props) $$invalidate(0, id = $$props.id);
    		if ('label' in $$props) $$invalidate(1, label = $$props.label);
    	};

    	$$self.$capture_state = () => ({ value, id, label });

    	$$self.$inject_state = $$props => {
    		if ('value' in $$props) $$invalidate(2, value = $$props.value);
    		if ('id' in $$props) $$invalidate(0, id = $$props.id);
    		if ('label' in $$props) $$invalidate(1, label = $$props.label);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [id, label, value, keyup_handler, input_input_handler];
    }

    class Input extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { id: 0, label: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Input",
    			options,
    			id: create_fragment$7.name
    		});
    	}

    	get id() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get label() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set label(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/lib/button.svelte generated by Svelte v3.46.4 */

    const file$6 = "src/lib/button.svelte";

    function create_fragment$6(ctx) {
    	let button;
    	let t;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			t = text(/*label*/ ctx[0]);
    			attr_dev(button, "class", "btn svelte-187qjpz");
    			toggle_class(button, "btn-sm", /*sm*/ ctx[1]);
    			add_location(button, file$6, 5, 0, 55);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", prevent_default(/*click_handler*/ ctx[2]), false, true, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*label*/ 1) set_data_dev(t, /*label*/ ctx[0]);

    			if (dirty & /*sm*/ 2) {
    				toggle_class(button, "btn-sm", /*sm*/ ctx[1]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Button', slots, []);
    	let { label } = $$props;
    	let { sm } = $$props;
    	const writable_props = ['label', 'sm'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Button> was created with unknown prop '${key}'`);
    	});

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('label' in $$props) $$invalidate(0, label = $$props.label);
    		if ('sm' in $$props) $$invalidate(1, sm = $$props.sm);
    	};

    	$$self.$capture_state = () => ({ label, sm });

    	$$self.$inject_state = $$props => {
    		if ('label' in $$props) $$invalidate(0, label = $$props.label);
    		if ('sm' in $$props) $$invalidate(1, sm = $$props.sm);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [label, sm, click_handler];
    }

    class Button extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { label: 0, sm: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Button",
    			options,
    			id: create_fragment$6.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*label*/ ctx[0] === undefined && !('label' in props)) {
    			console.warn("<Button> was created without expected prop 'label'");
    		}

    		if (/*sm*/ ctx[1] === undefined && !('sm' in props)) {
    			console.warn("<Button> was created without expected prop 'sm'");
    		}
    	}

    	get label() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set label(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get sm() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set sm(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/lib/tag-input.svelte generated by Svelte v3.46.4 */
    const file$5 = "src/lib/tag-input.svelte";

    function create_fragment$5(ctx) {
    	let div1;
    	let div0;
    	let input;
    	let t0;
    	let button;
    	let t1;
    	let chips;
    	let current;

    	input = new Input({
    			props: { id: "tags", name: "tags", type: "text" },
    			$$inline: true
    		});

    	input.$on("keyup", /*handleEnter*/ ctx[2]);

    	button = new Button({
    			props: { sm: true, label: "Add" },
    			$$inline: true
    		});

    	button.$on("click", /*handleNewTag*/ ctx[1]);

    	chips = new Chips({
    			props: {
    				chips: /*$newTags*/ ctx[0],
    				closable: true
    			},
    			$$inline: true
    		});

    	chips.$on("close", /*cleanTag*/ ctx[3]);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			create_component(input.$$.fragment);
    			t0 = space();
    			create_component(button.$$.fragment);
    			t1 = space();
    			create_component(chips.$$.fragment);
    			attr_dev(div0, "class", "tag-input svelte-1h48gpg");
    			add_location(div0, file$5, 26, 1, 581);
    			attr_dev(div1, "class", "tag-input-wrapper svelte-1h48gpg");
    			add_location(div1, file$5, 25, 0, 548);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			mount_component(input, div0, null);
    			append_dev(div0, t0);
    			mount_component(button, div0, null);
    			append_dev(div1, t1);
    			mount_component(chips, div1, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const chips_changes = {};
    			if (dirty & /*$newTags*/ 1) chips_changes.chips = /*$newTags*/ ctx[0];
    			chips.$set(chips_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(input.$$.fragment, local);
    			transition_in(button.$$.fragment, local);
    			transition_in(chips.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(input.$$.fragment, local);
    			transition_out(button.$$.fragment, local);
    			transition_out(chips.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(input);
    			destroy_component(button);
    			destroy_component(chips);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let $newTags;
    	validate_store(newTags, 'newTags');
    	component_subscribe($$self, newTags, $$value => $$invalidate(0, $newTags = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Tag_input', slots, []);

    	function handleNewTag(e) {
    		e.preventDefault();

    		// TODO: validate repeating tags
    		const newTag = document.getElementById('tags').value;

    		newTags.push(newTag);
    		document.getElementById('tags').value = '';
    	}

    	function handleEnter(e) {
    		if (e.keyCode === 13) {
    			handleNewTag(e);
    		}
    	}

    	function cleanTag(e) {
    		newTags.remove(e.detail.detail);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Tag_input> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		newTags,
    		Chips,
    		Input,
    		Button,
    		handleNewTag,
    		handleEnter,
    		cleanTag,
    		$newTags
    	});

    	return [$newTags, handleNewTag, handleEnter, cleanTag];
    }

    class Tag_input extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tag_input",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src/routes/new-recipe.svelte generated by Svelte v3.46.4 */
    const file$4 = "src/routes/new-recipe.svelte";

    function create_fragment$4(ctx) {
    	let form;
    	let input0;
    	let t0;
    	let input1;
    	let t1;
    	let input2;
    	let t2;
    	let taginput;
    	let t3;
    	let input3;
    	let current;
    	let mounted;
    	let dispose;

    	input0 = new Input({
    			props: { id: "title", label: "Title" },
    			$$inline: true
    		});

    	input1 = new Input({
    			props: { id: "method", label: "Method" },
    			$$inline: true
    		});

    	input2 = new Input({
    			props: { id: "time", label: "Time" },
    			$$inline: true
    		});

    	taginput = new Tag_input({ $$inline: true });

    	const block = {
    		c: function create() {
    			form = element("form");
    			create_component(input0.$$.fragment);
    			t0 = space();
    			create_component(input1.$$.fragment);
    			t1 = space();
    			create_component(input2.$$.fragment);
    			t2 = space();
    			create_component(taginput.$$.fragment);
    			t3 = space();
    			input3 = element("input");
    			attr_dev(input3, "class", "btn-submit svelte-jhz416");
    			attr_dev(input3, "type", "submit");
    			add_location(input3, file$4, 37, 1, 856);
    			attr_dev(form, "id", "recipe");
    			attr_dev(form, "class", "svelte-jhz416");
    			add_location(form, file$4, 32, 0, 689);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, form, anchor);
    			mount_component(input0, form, null);
    			append_dev(form, t0);
    			mount_component(input1, form, null);
    			append_dev(form, t1);
    			mount_component(input2, form, null);
    			append_dev(form, t2);
    			mount_component(taginput, form, null);
    			append_dev(form, t3);
    			append_dev(form, input3);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(form, "submit", /*handleSubmit*/ ctx[0], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(input0.$$.fragment, local);
    			transition_in(input1.$$.fragment, local);
    			transition_in(input2.$$.fragment, local);
    			transition_in(taginput.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(input0.$$.fragment, local);
    			transition_out(input1.$$.fragment, local);
    			transition_out(input2.$$.fragment, local);
    			transition_out(taginput.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(form);
    			destroy_component(input0);
    			destroy_component(input1);
    			destroy_component(input2);
    			destroy_component(taginput);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let $newTags;
    	validate_store(newTags, 'newTags');
    	component_subscribe($$self, newTags, $$value => $$invalidate(1, $newTags = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('New_recipe', slots, []);

    	function handleSubmit(e) {
    		e.preventDefault();
    		e.stopPropagation();

    		const newRecipe = {
    			title: e.target[0].value,
    			method: e.target[1].value,
    			time: parseInt(e.target[2].value),
    			tags: $newTags.map(it => ({ name: it }))
    		};

    		fetch('/recipes', {
    			method: 'POST',
    			mode: 'cors',
    			body: JSON.stringify(newRecipe)
    		}).then(() => {
    			newTags.reset();
    			push('/');
    		}).catch(err => {
    			
    		}); // goto('/');
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<New_recipe> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		TagInput: Tag_input,
    		Input,
    		newTags,
    		push,
    		handleSubmit,
    		$newTags
    	});

    	return [handleSubmit];
    }

    class New_recipe extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "New_recipe",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src/routes/recipe.svelte generated by Svelte v3.46.4 */
    const file$3 = "src/routes/recipe.svelte";

    // (18:1) {#if recipe}
    function create_if_block$1(ctx) {
    	let h2;
    	let t0_value = /*recipe*/ ctx[0].title + "";
    	let t0;
    	let t1;
    	let div1;
    	let chips;
    	let t2;
    	let div0;
    	let h50;
    	let b;
    	let t4;
    	let p0;
    	let t5_value = /*recipe*/ ctx[0].time + "";
    	let t5;
    	let t6;
    	let h51;
    	let t8;
    	let p1;
    	let t9_value = /*recipe*/ ctx[0].method + "";
    	let t9;
    	let current;

    	chips = new Chips({
    			props: { chips: /*tags*/ ctx[1] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			t0 = text(t0_value);
    			t1 = space();
    			div1 = element("div");
    			create_component(chips.$$.fragment);
    			t2 = space();
    			div0 = element("div");
    			h50 = element("h5");
    			b = element("b");
    			b.textContent = "Time";
    			t4 = space();
    			p0 = element("p");
    			t5 = text(t5_value);
    			t6 = space();
    			h51 = element("h5");
    			h51.textContent = "Method";
    			t8 = space();
    			p1 = element("p");
    			t9 = text(t9_value);
    			add_location(h2, file$3, 18, 2, 430);
    			add_location(b, file$3, 22, 8, 529);
    			add_location(h50, file$3, 22, 4, 525);
    			add_location(p0, file$3, 23, 4, 550);
    			attr_dev(div0, "class", "col svelte-njgm8h");
    			add_location(div0, file$3, 21, 3, 503);
    			attr_dev(div1, "class", "row svelte-njgm8h");
    			add_location(div1, file$3, 19, 2, 456);
    			add_location(h51, file$3, 26, 2, 592);
    			add_location(p1, file$3, 27, 2, 610);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    			append_dev(h2, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div1, anchor);
    			mount_component(chips, div1, null);
    			append_dev(div1, t2);
    			append_dev(div1, div0);
    			append_dev(div0, h50);
    			append_dev(h50, b);
    			append_dev(div0, t4);
    			append_dev(div0, p0);
    			append_dev(p0, t5);
    			insert_dev(target, t6, anchor);
    			insert_dev(target, h51, anchor);
    			insert_dev(target, t8, anchor);
    			insert_dev(target, p1, anchor);
    			append_dev(p1, t9);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty & /*recipe*/ 1) && t0_value !== (t0_value = /*recipe*/ ctx[0].title + "")) set_data_dev(t0, t0_value);
    			const chips_changes = {};
    			if (dirty & /*tags*/ 2) chips_changes.chips = /*tags*/ ctx[1];
    			chips.$set(chips_changes);
    			if ((!current || dirty & /*recipe*/ 1) && t5_value !== (t5_value = /*recipe*/ ctx[0].time + "")) set_data_dev(t5, t5_value);
    			if ((!current || dirty & /*recipe*/ 1) && t9_value !== (t9_value = /*recipe*/ ctx[0].method + "")) set_data_dev(t9, t9_value);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(chips.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(chips.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div1);
    			destroy_component(chips);
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(h51);
    			if (detaching) detach_dev(t8);
    			if (detaching) detach_dev(p1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(18:1) {#if recipe}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div;
    	let current;
    	let if_block = /*recipe*/ ctx[0] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			attr_dev(div, "class", "recipe-wrapper svelte-njgm8h");
    			add_location(div, file$3, 16, 0, 385);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*recipe*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*recipe*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let tags;
    	let $querystring;
    	validate_store(querystring, 'querystring');
    	component_subscribe($$self, querystring, $$value => $$invalidate(2, $querystring = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Recipe', slots, []);
    	const recipeId = $querystring.split('=')[1];
    	let recipe;
    	fetch(`/recipes/${recipeId}`).then(res => res.json()).then(data => $$invalidate(0, recipe = data));
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Recipe> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		querystring,
    		Chips,
    		recipeId,
    		recipe,
    		tags,
    		$querystring
    	});

    	$$self.$inject_state = $$props => {
    		if ('recipe' in $$props) $$invalidate(0, recipe = $$props.recipe);
    		if ('tags' in $$props) $$invalidate(1, tags = $$props.tags);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*recipe*/ 1) {
    			$$invalidate(1, tags = recipe?.tags.map(it => it.name));
    		}
    	};

    	return [recipe, tags];
    }

    class Recipe extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Recipe",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    const routes = {
      "/": Routes,
      "/about": About,
      "/new-recipe": New_recipe,
      "/recipe": Recipe,
    };

    /* src/lib/nav.svelte generated by Svelte v3.46.4 */

    const file$2 = "src/lib/nav.svelte";

    function create_fragment$2(ctx) {
    	let div;
    	let a0;
    	let t1;
    	let a1;
    	let t3;
    	let a2;

    	const block = {
    		c: function create() {
    			div = element("div");
    			a0 = element("a");
    			a0.textContent = "Home";
    			t1 = space();
    			a1 = element("a");
    			a1.textContent = "New Recipe";
    			t3 = space();
    			a2 = element("a");
    			a2.textContent = "About";
    			attr_dev(a0, "href", "#/");
    			add_location(a0, file$2, 1, 2, 20);
    			attr_dev(a1, "href", "#/new-recipe");
    			add_location(a1, file$2, 2, 2, 44);
    			attr_dev(a2, "href", "#/about");
    			add_location(a2, file$2, 3, 2, 84);
    			attr_dev(div, "class", "nav svelte-1kwx2fd");
    			add_location(div, file$2, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, a0);
    			append_dev(div, t1);
    			append_dev(div, a1);
    			append_dev(div, t3);
    			append_dev(div, a2);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Nav', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Nav> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Nav extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Nav",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src/lib/page-transition.svelte generated by Svelte v3.46.4 */
    const file$1 = "src/lib/page-transition.svelte";

    // (8:0) {:else}
    function create_else_block(ctx) {
    	let previous_key = /*refresh*/ ctx[0];
    	let key_block_anchor;
    	let current;
    	let key_block = create_key_block(ctx);

    	const block = {
    		c: function create() {
    			key_block.c();
    			key_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			key_block.m(target, anchor);
    			insert_dev(target, key_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*refresh*/ 1 && safe_not_equal(previous_key, previous_key = /*refresh*/ ctx[0])) {
    				group_outros();
    				transition_out(key_block, 1, 1, noop);
    				check_outros();
    				key_block = create_key_block(ctx);
    				key_block.c();
    				transition_in(key_block);
    				key_block.m(key_block_anchor.parentNode, key_block_anchor);
    			} else {
    				key_block.p(ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(key_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(key_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(key_block_anchor);
    			key_block.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(8:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (6:0) {#if refresh === '' || refresh === '/'}
    function create_if_block(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[2].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[1], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[1],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[1])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[1], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(6:0) {#if refresh === '' || refresh === '/'}",
    		ctx
    	});

    	return block;
    }

    // (9:1) {#key refresh}
    function create_key_block(ctx) {
    	let div;
    	let div_intro;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[2].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[1], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			add_location(div, file$1, 9, 2, 164);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[1],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[1])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[1], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);

    			if (!div_intro) {
    				add_render_callback(() => {
    					div_intro = create_in_transition(div, fly, { x: -50, duration: 250 });
    					div_intro.start();
    				});
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_key_block.name,
    		type: "key",
    		source: "(9:1) {#key refresh}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*refresh*/ ctx[0] === '' || /*refresh*/ ctx[0] === '/') return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Page_transition', slots, ['default']);
    	let { refresh = '' } = $$props;
    	const writable_props = ['refresh'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Page_transition> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('refresh' in $$props) $$invalidate(0, refresh = $$props.refresh);
    		if ('$$scope' in $$props) $$invalidate(1, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ fly, refresh });

    	$$self.$inject_state = $$props => {
    		if ('refresh' in $$props) $$invalidate(0, refresh = $$props.refresh);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [refresh, $$scope, slots];
    }

    class Page_transition extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { refresh: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Page_transition",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get refresh() {
    		throw new Error("<Page_transition>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set refresh(value) {
    		throw new Error("<Page_transition>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/App.svelte generated by Svelte v3.46.4 */
    const file = "src/App.svelte";

    // (10:2) <PageTransition refresh={$location}>
    function create_default_slot(ctx) {
    	let div1;
    	let div0;
    	let router;
    	let current;
    	router = new Router({ props: { routes }, $$inline: true });

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			create_component(router.$$.fragment);
    			attr_dev(div0, "class", "container-inner svelte-l6wt3j");
    			add_location(div0, file, 11, 6, 304);
    			attr_dev(div1, "class", "container-outer svelte-l6wt3j");
    			add_location(div1, file, 10, 4, 268);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			mount_component(router, div0, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(router);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(10:2) <PageTransition refresh={$location}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let main;
    	let nav;
    	let t;
    	let pagetransition;
    	let current;
    	nav = new Nav({ $$inline: true });

    	pagetransition = new Page_transition({
    			props: {
    				refresh: /*$location*/ ctx[0],
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(nav.$$.fragment);
    			t = space();
    			create_component(pagetransition.$$.fragment);
    			add_location(main, file, 7, 0, 208);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(nav, main, null);
    			append_dev(main, t);
    			mount_component(pagetransition, main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const pagetransition_changes = {};
    			if (dirty & /*$location*/ 1) pagetransition_changes.refresh = /*$location*/ ctx[0];

    			if (dirty & /*$$scope*/ 2) {
    				pagetransition_changes.$$scope = { dirty, ctx };
    			}

    			pagetransition.$set(pagetransition_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(nav.$$.fragment, local);
    			transition_in(pagetransition.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(nav.$$.fragment, local);
    			transition_out(pagetransition.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(nav);
    			destroy_component(pagetransition);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let $location;
    	validate_store(location, 'location');
    	component_subscribe($$self, location, $$value => $$invalidate(0, $location = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Router,
    		location,
    		routes,
    		Nav,
    		PageTransition: Page_transition,
    		$location
    	});

    	return [$location];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
      target: document.body,
      props: {
        name: "world",
      },
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
