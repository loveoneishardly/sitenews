/*
 * This combined file was created by the DataTables downloader builder:
 *   https://datatables.net/download
 *
 * To rebuild or modify this file with the latest versions of the included
 * software please visit:
 *   https://datatables.net/download/#bs5-5.0.1/dt-1.11.5/e-2.0.7
 *
 * Included libraries:
 *   Bootstrap 5 5.0.1, DataTables 1.11.5, Editor 2.0.7
 */

/*!
  * Bootstrap v5.0.1 (https://getbootstrap.com/)
  * Copyright 2011-2021 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.bootstrap = factory());
}(this, (function () { 'use strict';

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.0.1): dom/selector-engine.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */
  const NODE_TEXT = 3;
  const SelectorEngine = {
    find(selector, element = document.documentElement) {
      return [].concat(...Element.prototype.querySelectorAll.call(element, selector));
    },

    findOne(selector, element = document.documentElement) {
      return Element.prototype.querySelector.call(element, selector);
    },

    children(element, selector) {
      return [].concat(...element.children).filter(child => child.matches(selector));
    },

    parents(element, selector) {
      const parents = [];
      let ancestor = element.parentNode;

      while (ancestor && ancestor.nodeType === Node.ELEMENT_NODE && ancestor.nodeType !== NODE_TEXT) {
        if (ancestor.matches(selector)) {
          parents.push(ancestor);
        }

        ancestor = ancestor.parentNode;
      }

      return parents;
    },

    prev(element, selector) {
      let previous = element.previousElementSibling;

      while (previous) {
        if (previous.matches(selector)) {
          return [previous];
        }

        previous = previous.previousElementSibling;
      }

      return [];
    },

    next(element, selector) {
      let next = element.nextElementSibling;

      while (next) {
        if (next.matches(selector)) {
          return [next];
        }

        next = next.nextElementSibling;
      }

      return [];
    }

  };

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.0.1): util/index.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */

  const MAX_UID = 1000000;
  const MILLISECONDS_MULTIPLIER = 1000;
  const TRANSITION_END = 'transitionend'; // Shoutout AngusCroll (https://goo.gl/pxwQGp)

  const toType = obj => {
    if (obj === null || obj === undefined) {
      return `${obj}`;
    }

    return {}.toString.call(obj).match(/\s([a-z]+)/i)[1].toLowerCase();
  };
  /**
   * --------------------------------------------------------------------------
   * Public Util Api
   * --------------------------------------------------------------------------
   */


  const getUID = prefix => {
    do {
      prefix += Math.floor(Math.random() * MAX_UID);
    } while (document.getElementById(prefix));

    return prefix;
  };

  const getSelector = element => {
    let selector = element.getAttribute('data-bs-target');

    if (!selector || selector === '#') {
      let hrefAttr = element.getAttribute('href'); // The only valid content that could double as a selector are IDs or classes,
      // so everything starting with `#` or `.`. If a "real" URL is used as the selector,
      // `document.querySelector` will rightfully complain it is invalid.
      // See https://github.com/twbs/bootstrap/issues/32273

      if (!hrefAttr || !hrefAttr.includes('#') && !hrefAttr.startsWith('.')) {
        return null;
      } // Just in case some CMS puts out a full URL with the anchor appended


      if (hrefAttr.includes('#') && !hrefAttr.startsWith('#')) {
        hrefAttr = `#${hrefAttr.split('#')[1]}`;
      }

      selector = hrefAttr && hrefAttr !== '#' ? hrefAttr.trim() : null;
    }

    return selector;
  };

  const getSelectorFromElement = element => {
    const selector = getSelector(element);

    if (selector) {
      return document.querySelector(selector) ? selector : null;
    }

    return null;
  };

  const getElementFromSelector = element => {
    const selector = getSelector(element);
    return selector ? document.querySelector(selector) : null;
  };

  const getTransitionDurationFromElement = element => {
    if (!element) {
      return 0;
    } // Get transition-duration of the element


    let {
      transitionDuration,
      transitionDelay
    } = window.getComputedStyle(element);
    const floatTransitionDuration = Number.parseFloat(transitionDuration);
    const floatTransitionDelay = Number.parseFloat(transitionDelay); // Return 0 if element or transition duration is not found

    if (!floatTransitionDuration && !floatTransitionDelay) {
      return 0;
    } // If multiple durations are defined, take the first


    transitionDuration = transitionDuration.split(',')[0];
    transitionDelay = transitionDelay.split(',')[0];
    return (Number.parseFloat(transitionDuration) + Number.parseFloat(transitionDelay)) * MILLISECONDS_MULTIPLIER;
  };

  const triggerTransitionEnd = element => {
    element.dispatchEvent(new Event(TRANSITION_END));
  };

  const isElement$1 = obj => {
    if (!obj || typeof obj !== 'object') {
      return false;
    }

    if (typeof obj.jquery !== 'undefined') {
      obj = obj[0];
    }

    return typeof obj.nodeType !== 'undefined';
  };

  const getElement = obj => {
    if (isElement$1(obj)) {
      // it's a jQuery object or a node element
      return obj.jquery ? obj[0] : obj;
    }

    if (typeof obj === 'string' && obj.length > 0) {
      return SelectorEngine.findOne(obj);
    }

    return null;
  };

  const emulateTransitionEnd = (element, duration) => {
    let called = false;
    const durationPadding = 5;
    const emulatedDuration = duration + durationPadding;

    function listener() {
      called = true;
      element.removeEventListener(TRANSITION_END, listener);
    }

    element.addEventListener(TRANSITION_END, listener);
    setTimeout(() => {
      if (!called) {
        triggerTransitionEnd(element);
      }
    }, emulatedDuration);
  };

  const typeCheckConfig = (componentName, config, configTypes) => {
    Object.keys(configTypes).forEach(property => {
      const expectedTypes = configTypes[property];
      const value = config[property];
      const valueType = value && isElement$1(value) ? 'element' : toType(value);

      if (!new RegExp(expectedTypes).test(valueType)) {
        throw new TypeError(`${componentName.toUpperCase()}: Option "${property}" provided type "${valueType}" but expected type "${expectedTypes}".`);
      }
    });
  };

  const isVisible = element => {
    if (!element) {
      return false;
    }

    if (element.style && element.parentNode && element.parentNode.style) {
      const elementStyle = getComputedStyle(element);
      const parentNodeStyle = getComputedStyle(element.parentNode);
      return elementStyle.display !== 'none' && parentNodeStyle.display !== 'none' && elementStyle.visibility !== 'hidden';
    }

    return false;
  };

  const isDisabled = element => {
    if (!element || element.nodeType !== Node.ELEMENT_NODE) {
      return true;
    }

    if (element.classList.contains('disabled')) {
      return true;
    }

    if (typeof element.disabled !== 'undefined') {
      return element.disabled;
    }

    return element.hasAttribute('disabled') && element.getAttribute('disabled') !== 'false';
  };

  const findShadowRoot = element => {
    if (!document.documentElement.attachShadow) {
      return null;
    } // Can find the shadow root otherwise it'll return the document


    if (typeof element.getRootNode === 'function') {
      const root = element.getRootNode();
      return root instanceof ShadowRoot ? root : null;
    }

    if (element instanceof ShadowRoot) {
      return element;
    } // when we don't find a shadow root


    if (!element.parentNode) {
      return null;
    }

    return findShadowRoot(element.parentNode);
  };

  const noop = () => {};

  const reflow = element => element.offsetHeight;

  const getjQuery = () => {
    const {
      jQuery
    } = window;

    if (jQuery && !document.body.hasAttribute('data-bs-no-jquery')) {
      return jQuery;
    }

    return null;
  };

  const onDOMContentLoaded = callback => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  };

  const isRTL = () => document.documentElement.dir === 'rtl';

  const defineJQueryPlugin = plugin => {
    onDOMContentLoaded(() => {
      const $ = getjQuery();
      /* istanbul ignore if */

      if ($) {
        const name = plugin.NAME;
        const JQUERY_NO_CONFLICT = $.fn[name];
        $.fn[name] = plugin.jQueryInterface;
        $.fn[name].Constructor = plugin;

        $.fn[name].noConflict = () => {
          $.fn[name] = JQUERY_NO_CONFLICT;
          return plugin.jQueryInterface;
        };
      }
    });
  };

  const execute = callback => {
    if (typeof callback === 'function') {
      callback();
    }
  };

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.0.1): dom/data.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */
  const elementMap = new Map();
  var Data = {
    set(element, key, instance) {
      if (!elementMap.has(element)) {
        elementMap.set(element, new Map());
      }

      const instanceMap = elementMap.get(element); // make it clear we only want one instance per element
      // can be removed later when multiple key/instances are fine to be used

      if (!instanceMap.has(key) && instanceMap.size !== 0) {
        // eslint-disable-next-line no-console
        console.error(`Bootstrap doesn't allow more than one instance per element. Bound instance: ${Array.from(instanceMap.keys())[0]}.`);
        return;
      }

      instanceMap.set(key, instance);
    },

    get(element, key) {
      if (elementMap.has(element)) {
        return elementMap.get(element).get(key) || null;
      }

      return null;
    },

    remove(element, key) {
      if (!elementMap.has(element)) {
        return;
      }

      const instanceMap = elementMap.get(element);
      instanceMap.delete(key); // free up element references if there are no instances left for an element

      if (instanceMap.size === 0) {
        elementMap.delete(element);
      }
    }

  };

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.0.1): dom/event-handler.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const namespaceRegex = /[^.]*(?=\..*)\.|.*/;
  const stripNameRegex = /\..*/;
  const stripUidRegex = /::\d+$/;
  const eventRegistry = {}; // Events storage

  let uidEvent = 1;
  const customEvents = {
    mouseenter: 'mouseover',
    mouseleave: 'mouseout'
  };
  const customEventsRegex = /^(mouseenter|mouseleave)/i;
  const nativeEvents = new Set(['click', 'dblclick', 'mouseup', 'mousedown', 'contextmenu', 'mousewheel', 'DOMMouseScroll', 'mouseover', 'mouseout', 'mousemove', 'selectstart', 'selectend', 'keydown', 'keypress', 'keyup', 'orientationchange', 'touchstart', 'touchmove', 'touchend', 'touchcancel', 'pointerdown', 'pointermove', 'pointerup', 'pointerleave', 'pointercancel', 'gesturestart', 'gesturechange', 'gestureend', 'focus', 'blur', 'change', 'reset', 'select', 'submit', 'focusin', 'focusout', 'load', 'unload', 'beforeunload', 'resize', 'move', 'DOMContentLoaded', 'readystatechange', 'error', 'abort', 'scroll']);
  /**
   * ------------------------------------------------------------------------
   * Private methods
   * ------------------------------------------------------------------------
   */

  function getUidEvent(element, uid) {
    return uid && `${uid}::${uidEvent++}` || element.uidEvent || uidEvent++;
  }

  function getEvent(element) {
    const uid = getUidEvent(element);
    element.uidEvent = uid;
    eventRegistry[uid] = eventRegistry[uid] || {};
    return eventRegistry[uid];
  }

  function bootstrapHandler(element, fn) {
    return function handler(event) {
      event.delegateTarget = element;

      if (handler.oneOff) {
        EventHandler.off(element, event.type, fn);
      }

      return fn.apply(element, [event]);
    };
  }

  function bootstrapDelegationHandler(element, selector, fn) {
    return function handler(event) {
      const domElements = element.querySelectorAll(selector);

      for (let {
        target
      } = event; target && target !== this; target = target.parentNode) {
        for (let i = domElements.length; i--;) {
          if (domElements[i] === target) {
            event.delegateTarget = target;

            if (handler.oneOff) {
              // eslint-disable-next-line unicorn/consistent-destructuring
              EventHandler.off(element, event.type, selector, fn);
            }

            return fn.apply(target, [event]);
          }
        }
      } // To please ESLint


      return null;
    };
  }

  function findHandler(events, handler, delegationSelector = null) {
    const uidEventList = Object.keys(events);

    for (let i = 0, len = uidEventList.length; i < len; i++) {
      const event = events[uidEventList[i]];

      if (event.originalHandler === handler && event.delegationSelector === delegationSelector) {
        return event;
      }
    }

    return null;
  }

  function normalizeParams(originalTypeEvent, handler, delegationFn) {
    const delegation = typeof handler === 'string';
    const originalHandler = delegation ? delegationFn : handler;
    let typeEvent = getTypeEvent(originalTypeEvent);
    const isNative = nativeEvents.has(typeEvent);

    if (!isNative) {
      typeEvent = originalTypeEvent;
    }

    return [delegation, originalHandler, typeEvent];
  }

  function addHandler(element, originalTypeEvent, handler, delegationFn, oneOff) {
    if (typeof originalTypeEvent !== 'string' || !element) {
      return;
    }

    if (!handler) {
      handler = delegationFn;
      delegationFn = null;
    } // in case of mouseenter or mouseleave wrap the handler within a function that checks for its DOM position
    // this prevents the handler from being dispatched the same way as mouseover or mouseout does


    if (customEventsRegex.test(originalTypeEvent)) {
      const wrapFn = fn => {
        return function (event) {
          if (!event.relatedTarget || event.relatedTarget !== event.delegateTarget && !event.delegateTarget.contains(event.relatedTarget)) {
            return fn.call(this, event);
          }
        };
      };

      if (delegationFn) {
        delegationFn = wrapFn(delegationFn);
      } else {
        handler = wrapFn(handler);
      }
    }

    const [delegation, originalHandler, typeEvent] = normalizeParams(originalTypeEvent, handler, delegationFn);
    const events = getEvent(element);
    const handlers = events[typeEvent] || (events[typeEvent] = {});
    const previousFn = findHandler(handlers, originalHandler, delegation ? handler : null);

    if (previousFn) {
      previousFn.oneOff = previousFn.oneOff && oneOff;
      return;
    }

    const uid = getUidEvent(originalHandler, originalTypeEvent.replace(namespaceRegex, ''));
    const fn = delegation ? bootstrapDelegationHandler(element, handler, delegationFn) : bootstrapHandler(element, handler);
    fn.delegationSelector = delegation ? handler : null;
    fn.originalHandler = originalHandler;
    fn.oneOff = oneOff;
    fn.uidEvent = uid;
    handlers[uid] = fn;
    element.addEventListener(typeEvent, fn, delegation);
  }

  function removeHandler(element, events, typeEvent, handler, delegationSelector) {
    const fn = findHandler(events[typeEvent], handler, delegationSelector);

    if (!fn) {
      return;
    }

    element.removeEventListener(typeEvent, fn, Boolean(delegationSelector));
    delete events[typeEvent][fn.uidEvent];
  }

  function removeNamespacedHandlers(element, events, typeEvent, namespace) {
    const storeElementEvent = events[typeEvent] || {};
    Object.keys(storeElementEvent).forEach(handlerKey => {
      if (handlerKey.includes(namespace)) {
        const event = storeElementEvent[handlerKey];
        removeHandler(element, events, typeEvent, event.originalHandler, event.delegationSelector);
      }
    });
  }

  function getTypeEvent(event) {
    // allow to get the native events from namespaced events ('click.bs.button' --> 'click')
    event = event.replace(stripNameRegex, '');
    return customEvents[event] || event;
  }

  const EventHandler = {
    on(element, event, handler, delegationFn) {
      addHandler(element, event, handler, delegationFn, false);
    },

    one(element, event, handler, delegationFn) {
      addHandler(element, event, handler, delegationFn, true);
    },

    off(element, originalTypeEvent, handler, delegationFn) {
      if (typeof originalTypeEvent !== 'string' || !element) {
        return;
      }

      const [delegation, originalHandler, typeEvent] = normalizeParams(originalTypeEvent, handler, delegationFn);
      const inNamespace = typeEvent !== originalTypeEvent;
      const events = getEvent(element);
      const isNamespace = originalTypeEvent.startsWith('.');

      if (typeof originalHandler !== 'undefined') {
        // Simplest case: handler is passed, remove that listener ONLY.
        if (!events || !events[typeEvent]) {
          return;
        }

        removeHandler(element, events, typeEvent, originalHandler, delegation ? handler : null);
        return;
      }

      if (isNamespace) {
        Object.keys(events).forEach(elementEvent => {
          removeNamespacedHandlers(element, events, elementEvent, originalTypeEvent.slice(1));
        });
      }

      const storeElementEvent = events[typeEvent] || {};
      Object.keys(storeElementEvent).forEach(keyHandlers => {
        const handlerKey = keyHandlers.replace(stripUidRegex, '');

        if (!inNamespace || originalTypeEvent.includes(handlerKey)) {
          const event = storeElementEvent[keyHandlers];
          removeHandler(element, events, typeEvent, event.originalHandler, event.delegationSelector);
        }
      });
    },

    trigger(element, event, args) {
      if (typeof event !== 'string' || !element) {
        return null;
      }

      const $ = getjQuery();
      const typeEvent = getTypeEvent(event);
      const inNamespace = event !== typeEvent;
      const isNative = nativeEvents.has(typeEvent);
      let jQueryEvent;
      let bubbles = true;
      let nativeDispatch = true;
      let defaultPrevented = false;
      let evt = null;

      if (inNamespace && $) {
        jQueryEvent = $.Event(event, args);
        $(element).trigger(jQueryEvent);
        bubbles = !jQueryEvent.isPropagationStopped();
        nativeDispatch = !jQueryEvent.isImmediatePropagationStopped();
        defaultPrevented = jQueryEvent.isDefaultPrevented();
      }

      if (isNative) {
        evt = document.createEvent('HTMLEvents');
        evt.initEvent(typeEvent, bubbles, true);
      } else {
        evt = new CustomEvent(event, {
          bubbles,
          cancelable: true
        });
      } // merge custom information in our event


      if (typeof args !== 'undefined') {
        Object.keys(args).forEach(key => {
          Object.defineProperty(evt, key, {
            get() {
              return args[key];
            }

          });
        });
      }

      if (defaultPrevented) {
        evt.preventDefault();
      }

      if (nativeDispatch) {
        element.dispatchEvent(evt);
      }

      if (evt.defaultPrevented && typeof jQueryEvent !== 'undefined') {
        jQueryEvent.preventDefault();
      }

      return evt;
    }

  };

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.0.1): base-component.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const VERSION = '5.0.1';

  class BaseComponent {
    constructor(element) {
      element = getElement(element);

      if (!element) {
        return;
      }

      this._element = element;
      Data.set(this._element, this.constructor.DATA_KEY, this);
    }

    dispose() {
      Data.remove(this._element, this.constructor.DATA_KEY);
      EventHandler.off(this._element, this.constructor.EVENT_KEY);
      Object.getOwnPropertyNames(this).forEach(propertyName => {
        this[propertyName] = null;
      });
    }

    _queueCallback(callback, element, isAnimated = true) {
      if (!isAnimated) {
        execute(callback);
        return;
      }

      const transitionDuration = getTransitionDurationFromElement(element);
      EventHandler.one(element, 'transitionend', () => execute(callback));
      emulateTransitionEnd(element, transitionDuration);
    }
    /** Static */


    static getInstance(element) {
      return Data.get(element, this.DATA_KEY);
    }

    static get VERSION() {
      return VERSION;
    }

    static get NAME() {
      throw new Error('You have to implement the static method "NAME", for each component!');
    }

    static get DATA_KEY() {
      return `bs.${this.NAME}`;
    }

    static get EVENT_KEY() {
      return `.${this.DATA_KEY}`;
    }

  }

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.0.1): alert.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME$c = 'alert';
  const DATA_KEY$b = 'bs.alert';
  const EVENT_KEY$b = `.${DATA_KEY$b}`;
  const DATA_API_KEY$8 = '.data-api';
  const SELECTOR_DISMISS = '[data-bs-dismiss="alert"]';
  const EVENT_CLOSE = `close${EVENT_KEY$b}`;
  const EVENT_CLOSED = `closed${EVENT_KEY$b}`;
  const EVENT_CLICK_DATA_API$7 = `click${EVENT_KEY$b}${DATA_API_KEY$8}`;
  const CLASS_NAME_ALERT = 'alert';
  const CLASS_NAME_FADE$6 = 'fade';
  const CLASS_NAME_SHOW$9 = 'show';
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Alert extends BaseComponent {
    // Getters
    static get NAME() {
      return NAME$c;
    } // Public


    close(element) {
      const rootElement = element ? this._getRootElement(element) : this._element;

      const customEvent = this._triggerCloseEvent(rootElement);

      if (customEvent === null || customEvent.defaultPrevented) {
        return;
      }

      this._removeElement(rootElement);
    } // Private


    _getRootElement(element) {
      return getElementFromSelector(element) || element.closest(`.${CLASS_NAME_ALERT}`);
    }

    _triggerCloseEvent(element) {
      return EventHandler.trigger(element, EVENT_CLOSE);
    }

    _removeElement(element) {
      element.classList.remove(CLASS_NAME_SHOW$9);
      const isAnimated = element.classList.contains(CLASS_NAME_FADE$6);

      this._queueCallback(() => this._destroyElement(element), element, isAnimated);
    }

    _destroyElement(element) {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }

      EventHandler.trigger(element, EVENT_CLOSED);
    } // Static


    static jQueryInterface(config) {
      return this.each(function () {
        let data = Data.get(this, DATA_KEY$b);

        if (!data) {
          data = new Alert(this);
        }

        if (config === 'close') {
          data[config](this);
        }
      });
    }

    static handleDismiss(alertInstance) {
      return function (event) {
        if (event) {
          event.preventDefault();
        }

        alertInstance.close(this);
      };
    }

  }
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  EventHandler.on(document, EVENT_CLICK_DATA_API$7, SELECTOR_DISMISS, Alert.handleDismiss(new Alert()));
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   * add .Alert to jQuery only if jQuery is present
   */

  defineJQueryPlugin(Alert);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.0.1): button.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME$b = 'button';
  const DATA_KEY$a = 'bs.button';
  const EVENT_KEY$a = `.${DATA_KEY$a}`;
  const DATA_API_KEY$7 = '.data-api';
  const CLASS_NAME_ACTIVE$3 = 'active';
  const SELECTOR_DATA_TOGGLE$5 = '[data-bs-toggle="button"]';
  const EVENT_CLICK_DATA_API$6 = `click${EVENT_KEY$a}${DATA_API_KEY$7}`;
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Button extends BaseComponent {
    // Getters
    static get NAME() {
      return NAME$b;
    } // Public


    toggle() {
      // Toggle class and sync the `aria-pressed` attribute with the return value of the `.toggle()` method
      this._element.setAttribute('aria-pressed', this._element.classList.toggle(CLASS_NAME_ACTIVE$3));
    } // Static


    static jQueryInterface(config) {
      return this.each(function () {
        let data = Data.get(this, DATA_KEY$a);

        if (!data) {
          data = new Button(this);
        }

        if (config === 'toggle') {
          data[config]();
        }
      });
    }

  }
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  EventHandler.on(document, EVENT_CLICK_DATA_API$6, SELECTOR_DATA_TOGGLE$5, event => {
    event.preventDefault();
    const button = event.target.closest(SELECTOR_DATA_TOGGLE$5);
    let data = Data.get(button, DATA_KEY$a);

    if (!data) {
      data = new Button(button);
    }

    data.toggle();
  });
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   * add .Button to jQuery only if jQuery is present
   */

  defineJQueryPlugin(Button);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.0.1): dom/manipulator.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  function normalizeData(val) {
    if (val === 'true') {
      return true;
    }

    if (val === 'false') {
      return false;
    }

    if (val === Number(val).toString()) {
      return Number(val);
    }

    if (val === '' || val === 'null') {
      return null;
    }

    return val;
  }

  function normalizeDataKey(key) {
    return key.replace(/[A-Z]/g, chr => `-${chr.toLowerCase()}`);
  }

  const Manipulator = {
    setDataAttribute(element, key, value) {
      element.setAttribute(`data-bs-${normalizeDataKey(key)}`, value);
    },

    removeDataAttribute(element, key) {
      element.removeAttribute(`data-bs-${normalizeDataKey(key)}`);
    },

    getDataAttributes(element) {
      if (!element) {
        return {};
      }

      const attributes = {};
      Object.keys(element.dataset).filter(key => key.startsWith('bs')).forEach(key => {
        let pureKey = key.replace(/^bs/, '');
        pureKey = pureKey.charAt(0).toLowerCase() + pureKey.slice(1, pureKey.length);
        attributes[pureKey] = normalizeData(element.dataset[key]);
      });
      return attributes;
    },

    getDataAttribute(element, key) {
      return normalizeData(element.getAttribute(`data-bs-${normalizeDataKey(key)}`));
    },

    offset(element) {
      const rect = element.getBoundingClientRect();
      return {
        top: rect.top + document.body.scrollTop,
        left: rect.left + document.body.scrollLeft
      };
    },

    position(element) {
      return {
        top: element.offsetTop,
        left: element.offsetLeft
      };
    }

  };

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.0.1): carousel.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME$a = 'carousel';
  const DATA_KEY$9 = 'bs.carousel';
  const EVENT_KEY$9 = `.${DATA_KEY$9}`;
  const DATA_API_KEY$6 = '.data-api';
  const ARROW_LEFT_KEY = 'ArrowLeft';
  const ARROW_RIGHT_KEY = 'ArrowRight';
  const TOUCHEVENT_COMPAT_WAIT = 500; // Time for mouse compat events to fire after touch

  const SWIPE_THRESHOLD = 40;
  const Default$9 = {
    interval: 5000,
    keyboard: true,
    slide: false,
    pause: 'hover',
    wrap: true,
    touch: true
  };
  const DefaultType$9 = {
    interval: '(number|boolean)',
    keyboard: 'boolean',
    slide: '(boolean|string)',
    pause: '(string|boolean)',
    wrap: 'boolean',
    touch: 'boolean'
  };
  const ORDER_NEXT = 'next';
  const ORDER_PREV = 'prev';
  const DIRECTION_LEFT = 'left';
  const DIRECTION_RIGHT = 'right';
  const EVENT_SLIDE = `slide${EVENT_KEY$9}`;
  const EVENT_SLID = `slid${EVENT_KEY$9}`;
  const EVENT_KEYDOWN = `keydown${EVENT_KEY$9}`;
  const EVENT_MOUSEENTER = `mouseenter${EVENT_KEY$9}`;
  const EVENT_MOUSELEAVE = `mouseleave${EVENT_KEY$9}`;
  const EVENT_TOUCHSTART = `touchstart${EVENT_KEY$9}`;
  const EVENT_TOUCHMOVE = `touchmove${EVENT_KEY$9}`;
  const EVENT_TOUCHEND = `touchend${EVENT_KEY$9}`;
  const EVENT_POINTERDOWN = `pointerdown${EVENT_KEY$9}`;
  const EVENT_POINTERUP = `pointerup${EVENT_KEY$9}`;
  const EVENT_DRAG_START = `dragstart${EVENT_KEY$9}`;
  const EVENT_LOAD_DATA_API$2 = `load${EVENT_KEY$9}${DATA_API_KEY$6}`;
  const EVENT_CLICK_DATA_API$5 = `click${EVENT_KEY$9}${DATA_API_KEY$6}`;
  const CLASS_NAME_CAROUSEL = 'carousel';
  const CLASS_NAME_ACTIVE$2 = 'active';
  const CLASS_NAME_SLIDE = 'slide';
  const CLASS_NAME_END = 'carousel-item-end';
  const CLASS_NAME_START = 'carousel-item-start';
  const CLASS_NAME_NEXT = 'carousel-item-next';
  const CLASS_NAME_PREV = 'carousel-item-prev';
  const CLASS_NAME_POINTER_EVENT = 'pointer-event';
  const SELECTOR_ACTIVE$1 = '.active';
  const SELECTOR_ACTIVE_ITEM = '.active.carousel-item';
  const SELECTOR_ITEM = '.carousel-item';
  const SELECTOR_ITEM_IMG = '.carousel-item img';
  const SELECTOR_NEXT_PREV = '.carousel-item-next, .carousel-item-prev';
  const SELECTOR_INDICATORS = '.carousel-indicators';
  const SELECTOR_INDICATOR = '[data-bs-target]';
  const SELECTOR_DATA_SLIDE = '[data-bs-slide], [data-bs-slide-to]';
  const SELECTOR_DATA_RIDE = '[data-bs-ride="carousel"]';
  const POINTER_TYPE_TOUCH = 'touch';
  const POINTER_TYPE_PEN = 'pen';
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Carousel extends BaseComponent {
    constructor(element, config) {
      super(element);
      this._items = null;
      this._interval = null;
      this._activeElement = null;
      this._isPaused = false;
      this._isSliding = false;
      this.touchTimeout = null;
      this.touchStartX = 0;
      this.touchDeltaX = 0;
      this._config = this._getConfig(config);
      this._indicatorsElement = SelectorEngine.findOne(SELECTOR_INDICATORS, this._element);
      this._touchSupported = 'ontouchstart' in document.documentElement || navigator.maxTouchPoints > 0;
      this._pointerEvent = Boolean(window.PointerEvent);

      this._addEventListeners();
    } // Getters


    static get Default() {
      return Default$9;
    }

    static get NAME() {
      return NAME$a;
    } // Public


    next() {
      if (!this._isSliding) {
        this._slide(ORDER_NEXT);
      }
    }

    nextWhenVisible() {
      // Don't call next when the page isn't visible
      // or the carousel or its parent isn't visible
      if (!document.hidden && isVisible(this._element)) {
        this.next();
      }
    }

    prev() {
      if (!this._isSliding) {
        this._slide(ORDER_PREV);
      }
    }

    pause(event) {
      if (!event) {
        this._isPaused = true;
      }

      if (SelectorEngine.findOne(SELECTOR_NEXT_PREV, this._element)) {
        triggerTransitionEnd(this._element);
        this.cycle(true);
      }

      clearInterval(this._interval);
      this._interval = null;
    }

    cycle(event) {
      if (!event) {
        this._isPaused = false;
      }

      if (this._interval) {
        clearInterval(this._interval);
        this._interval = null;
      }

      if (this._config && this._config.interval && !this._isPaused) {
        this._updateInterval();

        this._interval = setInterval((document.visibilityState ? this.nextWhenVisible : this.next).bind(this), this._config.interval);
      }
    }

    to(index) {
      this._activeElement = SelectorEngine.findOne(SELECTOR_ACTIVE_ITEM, this._element);

      const activeIndex = this._getItemIndex(this._activeElement);

      if (index > this._items.length - 1 || index < 0) {
        return;
      }

      if (this._isSliding) {
        EventHandler.one(this._element, EVENT_SLID, () => this.to(index));
        return;
      }

      if (activeIndex === index) {
        this.pause();
        this.cycle();
        return;
      }

      const order = index > activeIndex ? ORDER_NEXT : ORDER_PREV;

      this._slide(order, this._items[index]);
    } // Private


    _getConfig(config) {
      config = { ...Default$9,
        ...config
      };
      typeCheckConfig(NAME$a, config, DefaultType$9);
      return config;
    }

    _handleSwipe() {
      const absDeltax = Math.abs(this.touchDeltaX);

      if (absDeltax <= SWIPE_THRESHOLD) {
        return;
      }

      const direction = absDeltax / this.touchDeltaX;
      this.touchDeltaX = 0;

      if (!direction) {
        return;
      }

      this._slide(direction > 0 ? DIRECTION_RIGHT : DIRECTION_LEFT);
    }

    _addEventListeners() {
      if (this._config.keyboard) {
        EventHandler.on(this._element, EVENT_KEYDOWN, event => this._keydown(event));
      }

      if (this._config.pause === 'hover') {
        EventHandler.on(this._element, EVENT_MOUSEENTER, event => this.pause(event));
        EventHandler.on(this._element, EVENT_MOUSELEAVE, event => this.cycle(event));
      }

      if (this._config.touch && this._touchSupported) {
        this._addTouchEventListeners();
      }
    }

    _addTouchEventListeners() {
      const start = event => {
        if (this._pointerEvent && (event.pointerType === POINTER_TYPE_PEN || event.pointerType === POINTER_TYPE_TOUCH)) {
          this.touchStartX = event.clientX;
        } else if (!this._pointerEvent) {
          this.touchStartX = event.touches[0].clientX;
        }
      };

      const move = event => {
        // ensure swiping with one touch and not pinching
        this.touchDeltaX = event.touches && event.touches.length > 1 ? 0 : event.touches[0].clientX - this.touchStartX;
      };

      const end = event => {
        if (this._pointerEvent && (event.pointerType === POINTER_TYPE_PEN || event.pointerType === POINTER_TYPE_TOUCH)) {
          this.touchDeltaX = event.clientX - this.touchStartX;
        }

        this._handleSwipe();

        if (this._config.pause === 'hover') {
          // If it's a touch-enabled device, mouseenter/leave are fired as
          // part of the mouse compatibility events on first tap - the carousel
          // would stop cycling until user tapped out of it;
          // here, we listen for touchend, explicitly pause the carousel
          // (as if it's the second time we tap on it, mouseenter compat event
          // is NOT fired) and after a timeout (to allow for mouse compatibility
          // events to fire) we explicitly restart cycling
          this.pause();

          if (this.touchTimeout) {
            clearTimeout(this.touchTimeout);
          }

          this.touchTimeout = setTimeout(event => this.cycle(event), TOUCHEVENT_COMPAT_WAIT + this._config.interval);
        }
      };

      SelectorEngine.find(SELECTOR_ITEM_IMG, this._element).forEach(itemImg => {
        EventHandler.on(itemImg, EVENT_DRAG_START, e => e.preventDefault());
      });

      if (this._pointerEvent) {
        EventHandler.on(this._element, EVENT_POINTERDOWN, event => start(event));
        EventHandler.on(this._element, EVENT_POINTERUP, event => end(event));

        this._element.classList.add(CLASS_NAME_POINTER_EVENT);
      } else {
        EventHandler.on(this._element, EVENT_TOUCHSTART, event => start(event));
        EventHandler.on(this._element, EVENT_TOUCHMOVE, event => move(event));
        EventHandler.on(this._element, EVENT_TOUCHEND, event => end(event));
      }
    }

    _keydown(event) {
      if (/input|textarea/i.test(event.target.tagName)) {
        return;
      }

      if (event.key === ARROW_LEFT_KEY) {
        event.preventDefault();

        this._slide(DIRECTION_RIGHT);
      } else if (event.key === ARROW_RIGHT_KEY) {
        event.preventDefault();

        this._slide(DIRECTION_LEFT);
      }
    }

    _getItemIndex(element) {
      this._items = element && element.parentNode ? SelectorEngine.find(SELECTOR_ITEM, element.parentNode) : [];
      return this._items.indexOf(element);
    }

    _getItemByOrder(order, activeElement) {
      const isNext = order === ORDER_NEXT;
      const isPrev = order === ORDER_PREV;

      const activeIndex = this._getItemIndex(activeElement);

      const lastItemIndex = this._items.length - 1;
      const isGoingToWrap = isPrev && activeIndex === 0 || isNext && activeIndex === lastItemIndex;

      if (isGoingToWrap && !this._config.wrap) {
        return activeElement;
      }

      const delta = isPrev ? -1 : 1;
      const itemIndex = (activeIndex + delta) % this._items.length;
      return itemIndex === -1 ? this._items[this._items.length - 1] : this._items[itemIndex];
    }

    _triggerSlideEvent(relatedTarget, eventDirectionName) {
      const targetIndex = this._getItemIndex(relatedTarget);

      const fromIndex = this._getItemIndex(SelectorEngine.findOne(SELECTOR_ACTIVE_ITEM, this._element));

      return EventHandler.trigger(this._element, EVENT_SLIDE, {
        relatedTarget,
        direction: eventDirectionName,
        from: fromIndex,
        to: targetIndex
      });
    }

    _setActiveIndicatorElement(element) {
      if (this._indicatorsElement) {
        const activeIndicator = SelectorEngine.findOne(SELECTOR_ACTIVE$1, this._indicatorsElement);
        activeIndicator.classList.remove(CLASS_NAME_ACTIVE$2);
        activeIndicator.removeAttribute('aria-current');
        const indicators = SelectorEngine.find(SELECTOR_INDICATOR, this._indicatorsElement);

        for (let i = 0; i < indicators.length; i++) {
          if (Number.parseInt(indicators[i].getAttribute('data-bs-slide-to'), 10) === this._getItemIndex(element)) {
            indicators[i].classList.add(CLASS_NAME_ACTIVE$2);
            indicators[i].setAttribute('aria-current', 'true');
            break;
          }
        }
      }
    }

    _updateInterval() {
      const element = this._activeElement || SelectorEngine.findOne(SELECTOR_ACTIVE_ITEM, this._element);

      if (!element) {
        return;
      }

      const elementInterval = Number.parseInt(element.getAttribute('data-bs-interval'), 10);

      if (elementInterval) {
        this._config.defaultInterval = this._config.defaultInterval || this._config.interval;
        this._config.interval = elementInterval;
      } else {
        this._config.interval = this._config.defaultInterval || this._config.interval;
      }
    }

    _slide(directionOrOrder, element) {
      const order = this._directionToOrder(directionOrOrder);

      const activeElement = SelectorEngine.findOne(SELECTOR_ACTIVE_ITEM, this._element);

      const activeElementIndex = this._getItemIndex(activeElement);

      const nextElement = element || this._getItemByOrder(order, activeElement);

      const nextElementIndex = this._getItemIndex(nextElement);

      const isCycling = Boolean(this._interval);
      const isNext = order === ORDER_NEXT;
      const directionalClassName = isNext ? CLASS_NAME_START : CLASS_NAME_END;
      const orderClassName = isNext ? CLASS_NAME_NEXT : CLASS_NAME_PREV;

      const eventDirectionName = this._orderToDirection(order);

      if (nextElement && nextElement.classList.contains(CLASS_NAME_ACTIVE$2)) {
        this._isSliding = false;
        return;
      }

      const slideEvent = this._triggerSlideEvent(nextElement, eventDirectionName);

      if (slideEvent.defaultPrevented) {
        return;
      }

      if (!activeElement || !nextElement) {
        // Some weirdness is happening, so we bail
        return;
      }

      this._isSliding = true;

      if (isCycling) {
        this.pause();
      }

      this._setActiveIndicatorElement(nextElement);

      this._activeElement = nextElement;

      const triggerSlidEvent = () => {
        EventHandler.trigger(this._element, EVENT_SLID, {
          relatedTarget: nextElement,
          direction: eventDirectionName,
          from: activeElementIndex,
          to: nextElementIndex
        });
      };

      if (this._element.classList.contains(CLASS_NAME_SLIDE)) {
        nextElement.classList.add(orderClassName);
        reflow(nextElement);
        activeElement.classList.add(directionalClassName);
        nextElement.classList.add(directionalClassName);

        const completeCallBack = () => {
          nextElement.classList.remove(directionalClassName, orderClassName);
          nextElement.classList.add(CLASS_NAME_ACTIVE$2);
          activeElement.classList.remove(CLASS_NAME_ACTIVE$2, orderClassName, directionalClassName);
          this._isSliding = false;
          setTimeout(triggerSlidEvent, 0);
        };

        this._queueCallback(completeCallBack, activeElement, true);
      } else {
        activeElement.classList.remove(CLASS_NAME_ACTIVE$2);
        nextElement.classList.add(CLASS_NAME_ACTIVE$2);
        this._isSliding = false;
        triggerSlidEvent();
      }

      if (isCycling) {
        this.cycle();
      }
    }

    _directionToOrder(direction) {
      if (![DIRECTION_RIGHT, DIRECTION_LEFT].includes(direction)) {
        return direction;
      }

      if (isRTL()) {
        return direction === DIRECTION_LEFT ? ORDER_PREV : ORDER_NEXT;
      }

      return direction === DIRECTION_LEFT ? ORDER_NEXT : ORDER_PREV;
    }

    _orderToDirection(order) {
      if (![ORDER_NEXT, ORDER_PREV].includes(order)) {
        return order;
      }

      if (isRTL()) {
        return order === ORDER_PREV ? DIRECTION_LEFT : DIRECTION_RIGHT;
      }

      return order === ORDER_PREV ? DIRECTION_RIGHT : DIRECTION_LEFT;
    } // Static


    static carouselInterface(element, config) {
      let data = Data.get(element, DATA_KEY$9);
      let _config = { ...Default$9,
        ...Manipulator.getDataAttributes(element)
      };

      if (typeof config === 'object') {
        _config = { ..._config,
          ...config
        };
      }

      const action = typeof config === 'string' ? config : _config.slide;

      if (!data) {
        data = new Carousel(element, _config);
      }

      if (typeof config === 'number') {
        data.to(config);
      } else if (typeof action === 'string') {
        if (typeof data[action] === 'undefined') {
          throw new TypeError(`No method named "${action}"`);
        }

        data[action]();
      } else if (_config.interval && _config.ride) {
        data.pause();
        data.cycle();
      }
    }

    static jQueryInterface(config) {
      return this.each(function () {
        Carousel.carouselInterface(this, config);
      });
    }

    static dataApiClickHandler(event) {
      const target = getElementFromSelector(this);

      if (!target || !target.classList.contains(CLASS_NAME_CAROUSEL)) {
        return;
      }

      const config = { ...Manipulator.getDataAttributes(target),
        ...Manipulator.getDataAttributes(this)
      };
      const slideIndex = this.getAttribute('data-bs-slide-to');

      if (slideIndex) {
        config.interval = false;
      }

      Carousel.carouselInterface(target, config);

      if (slideIndex) {
        Data.get(target, DATA_KEY$9).to(slideIndex);
      }

      event.preventDefault();
    }

  }
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  EventHandler.on(document, EVENT_CLICK_DATA_API$5, SELECTOR_DATA_SLIDE, Carousel.dataApiClickHandler);
  EventHandler.on(window, EVENT_LOAD_DATA_API$2, () => {
    const carousels = SelectorEngine.find(SELECTOR_DATA_RIDE);

    for (let i = 0, len = carousels.length; i < len; i++) {
      Carousel.carouselInterface(carousels[i], Data.get(carousels[i], DATA_KEY$9));
    }
  });
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   * add .Carousel to jQuery only if jQuery is present
   */

  defineJQueryPlugin(Carousel);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.0.1): collapse.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME$9 = 'collapse';
  const DATA_KEY$8 = 'bs.collapse';
  const EVENT_KEY$8 = `.${DATA_KEY$8}`;
  const DATA_API_KEY$5 = '.data-api';
  const Default$8 = {
    toggle: true,
    parent: ''
  };
  const DefaultType$8 = {
    toggle: 'boolean',
    parent: '(string|element)'
  };
  const EVENT_SHOW$5 = `show${EVENT_KEY$8}`;
  const EVENT_SHOWN$5 = `shown${EVENT_KEY$8}`;
  const EVENT_HIDE$5 = `hide${EVENT_KEY$8}`;
  const EVENT_HIDDEN$5 = `hidden${EVENT_KEY$8}`;
  const EVENT_CLICK_DATA_API$4 = `click${EVENT_KEY$8}${DATA_API_KEY$5}`;
  const CLASS_NAME_SHOW$8 = 'show';
  const CLASS_NAME_COLLAPSE = 'collapse';
  const CLASS_NAME_COLLAPSING = 'collapsing';
  const CLASS_NAME_COLLAPSED = 'collapsed';
  const WIDTH = 'width';
  const HEIGHT = 'height';
  const SELECTOR_ACTIVES = '.show, .collapsing';
  const SELECTOR_DATA_TOGGLE$4 = '[data-bs-toggle="collapse"]';
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Collapse extends BaseComponent {
    constructor(element, config) {
      super(element);
      this._isTransitioning = false;
      this._config = this._getConfig(config);
      this._triggerArray = SelectorEngine.find(`${SELECTOR_DATA_TOGGLE$4}[href="#${this._element.id}"],` + `${SELECTOR_DATA_TOGGLE$4}[data-bs-target="#${this._element.id}"]`);
      const toggleList = SelectorEngine.find(SELECTOR_DATA_TOGGLE$4);

      for (let i = 0, len = toggleList.length; i < len; i++) {
        const elem = toggleList[i];
        const selector = getSelectorFromElement(elem);
        const filterElement = SelectorEngine.find(selector).filter(foundElem => foundElem === this._element);

        if (selector !== null && filterElement.length) {
          this._selector = selector;

          this._triggerArray.push(elem);
        }
      }

      this._parent = this._config.parent ? this._getParent() : null;

      if (!this._config.parent) {
        this._addAriaAndCollapsedClass(this._element, this._triggerArray);
      }

      if (this._config.toggle) {
        this.toggle();
      }
    } // Getters


    static get Default() {
      return Default$8;
    }

    static get NAME() {
      return NAME$9;
    } // Public


    toggle() {
      if (this._element.classList.contains(CLASS_NAME_SHOW$8)) {
        this.hide();
      } else {
        this.show();
      }
    }

    show() {
      if (this._isTransitioning || this._element.classList.contains(CLASS_NAME_SHOW$8)) {
        return;
      }

      let actives;
      let activesData;

      if (this._parent) {
        actives = SelectorEngine.find(SELECTOR_ACTIVES, this._parent).filter(elem => {
          if (typeof this._config.parent === 'string') {
            return elem.getAttribute('data-bs-parent') === this._config.parent;
          }

          return elem.classList.contains(CLASS_NAME_COLLAPSE);
        });

        if (actives.length === 0) {
          actives = null;
        }
      }

      const container = SelectorEngine.findOne(this._selector);

      if (actives) {
        const tempActiveData = actives.find(elem => container !== elem);
        activesData = tempActiveData ? Data.get(tempActiveData, DATA_KEY$8) : null;

        if (activesData && activesData._isTransitioning) {
          return;
        }
      }

      const startEvent = EventHandler.trigger(this._element, EVENT_SHOW$5);

      if (startEvent.defaultPrevented) {
        return;
      }

      if (actives) {
        actives.forEach(elemActive => {
          if (container !== elemActive) {
            Collapse.collapseInterface(elemActive, 'hide');
          }

          if (!activesData) {
            Data.set(elemActive, DATA_KEY$8, null);
          }
        });
      }

      const dimension = this._getDimension();

      this._element.classList.remove(CLASS_NAME_COLLAPSE);

      this._element.classList.add(CLASS_NAME_COLLAPSING);

      this._element.style[dimension] = 0;

      if (this._triggerArray.length) {
        this._triggerArray.forEach(element => {
          element.classList.remove(CLASS_NAME_COLLAPSED);
          element.setAttribute('aria-expanded', true);
        });
      }

      this.setTransitioning(true);

      const complete = () => {
        this._element.classList.remove(CLASS_NAME_COLLAPSING);

        this._element.classList.add(CLASS_NAME_COLLAPSE, CLASS_NAME_SHOW$8);

        this._element.style[dimension] = '';
        this.setTransitioning(false);
        EventHandler.trigger(this._element, EVENT_SHOWN$5);
      };

      const capitalizedDimension = dimension[0].toUpperCase() + dimension.slice(1);
      const scrollSize = `scroll${capitalizedDimension}`;

      this._queueCallback(complete, this._element, true);

      this._element.style[dimension] = `${this._element[scrollSize]}px`;
    }

    hide() {
      if (this._isTransitioning || !this._element.classList.contains(CLASS_NAME_SHOW$8)) {
        return;
      }

      const startEvent = EventHandler.trigger(this._element, EVENT_HIDE$5);

      if (startEvent.defaultPrevented) {
        return;
      }

      const dimension = this._getDimension();

      this._element.style[dimension] = `${this._element.getBoundingClientRect()[dimension]}px`;
      reflow(this._element);

      this._element.classList.add(CLASS_NAME_COLLAPSING);

      this._element.classList.remove(CLASS_NAME_COLLAPSE, CLASS_NAME_SHOW$8);

      const triggerArrayLength = this._triggerArray.length;

      if (triggerArrayLength > 0) {
        for (let i = 0; i < triggerArrayLength; i++) {
          const trigger = this._triggerArray[i];
          const elem = getElementFromSelector(trigger);

          if (elem && !elem.classList.contains(CLASS_NAME_SHOW$8)) {
            trigger.classList.add(CLASS_NAME_COLLAPSED);
            trigger.setAttribute('aria-expanded', false);
          }
        }
      }

      this.setTransitioning(true);

      const complete = () => {
        this.setTransitioning(false);

        this._element.classList.remove(CLASS_NAME_COLLAPSING);

        this._element.classList.add(CLASS_NAME_COLLAPSE);

        EventHandler.trigger(this._element, EVENT_HIDDEN$5);
      };

      this._element.style[dimension] = '';

      this._queueCallback(complete, this._element, true);
    }

    setTransitioning(isTransitioning) {
      this._isTransitioning = isTransitioning;
    } // Private


    _getConfig(config) {
      config = { ...Default$8,
        ...config
      };
      config.toggle = Boolean(config.toggle); // Coerce string values

      typeCheckConfig(NAME$9, config, DefaultType$8);
      return config;
    }

    _getDimension() {
      return this._element.classList.contains(WIDTH) ? WIDTH : HEIGHT;
    }

    _getParent() {
      let {
        parent
      } = this._config;
      parent = getElement(parent);
      const selector = `${SELECTOR_DATA_TOGGLE$4}[data-bs-parent="${parent}"]`;
      SelectorEngine.find(selector, parent).forEach(element => {
        const selected = getElementFromSelector(element);

        this._addAriaAndCollapsedClass(selected, [element]);
      });
      return parent;
    }

    _addAriaAndCollapsedClass(element, triggerArray) {
      if (!element || !triggerArray.length) {
        return;
      }

      const isOpen = element.classList.contains(CLASS_NAME_SHOW$8);
      triggerArray.forEach(elem => {
        if (isOpen) {
          elem.classList.remove(CLASS_NAME_COLLAPSED);
        } else {
          elem.classList.add(CLASS_NAME_COLLAPSED);
        }

        elem.setAttribute('aria-expanded', isOpen);
      });
    } // Static


    static collapseInterface(element, config) {
      let data = Data.get(element, DATA_KEY$8);
      const _config = { ...Default$8,
        ...Manipulator.getDataAttributes(element),
        ...(typeof config === 'object' && config ? config : {})
      };

      if (!data && _config.toggle && typeof config === 'string' && /show|hide/.test(config)) {
        _config.toggle = false;
      }

      if (!data) {
        data = new Collapse(element, _config);
      }

      if (typeof config === 'string') {
        if (typeof data[config] === 'undefined') {
          throw new TypeError(`No method named "${config}"`);
        }

        data[config]();
      }
    }

    static jQueryInterface(config) {
      return this.each(function () {
        Collapse.collapseInterface(this, config);
      });
    }

  }
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  EventHandler.on(document, EVENT_CLICK_DATA_API$4, SELECTOR_DATA_TOGGLE$4, function (event) {
    // preventDefault only for <a> elements (which change the URL) not inside the collapsible element
    if (event.target.tagName === 'A' || event.delegateTarget && event.delegateTarget.tagName === 'A') {
      event.preventDefault();
    }

    const triggerData = Manipulator.getDataAttributes(this);
    const selector = getSelectorFromElement(this);
    const selectorElements = SelectorEngine.find(selector);
    selectorElements.forEach(element => {
      const data = Data.get(element, DATA_KEY$8);
      let config;

      if (data) {
        // update parent attribute
        if (data._parent === null && typeof triggerData.parent === 'string') {
          data._config.parent = triggerData.parent;
          data._parent = data._getParent();
        }

        config = 'toggle';
      } else {
        config = triggerData;
      }

      Collapse.collapseInterface(element, config);
    });
  });
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   * add .Collapse to jQuery only if jQuery is present
   */

  defineJQueryPlugin(Collapse);

  var top = 'top';
  var bottom = 'bottom';
  var right = 'right';
  var left = 'left';
  var auto = 'auto';
  var basePlacements = [top, bottom, right, left];
  var start = 'start';
  var end = 'end';
  var clippingParents = 'clippingParents';
  var viewport = 'viewport';
  var popper = 'popper';
  var reference = 'reference';
  var variationPlacements = /*#__PURE__*/basePlacements.reduce(function (acc, placement) {
    return acc.concat([placement + "-" + start, placement + "-" + end]);
  }, []);
  var placements = /*#__PURE__*/[].concat(basePlacements, [auto]).reduce(function (acc, placement) {
    return acc.concat([placement, placement + "-" + start, placement + "-" + end]);
  }, []); // modifiers that need to read the DOM

  var beforeRead = 'beforeRead';
  var read = 'read';
  var afterRead = 'afterRead'; // pure-logic modifiers

  var beforeMain = 'beforeMain';
  var main = 'main';
  var afterMain = 'afterMain'; // modifier with the purpose to write to the DOM (or write into a framework state)

  var beforeWrite = 'beforeWrite';
  var write = 'write';
  var afterWrite = 'afterWrite';
  var modifierPhases = [beforeRead, read, afterRead, beforeMain, main, afterMain, beforeWrite, write, afterWrite];

  function getNodeName(element) {
    return element ? (element.nodeName || '').toLowerCase() : null;
  }

  function getWindow(node) {
    if (node == null) {
      return window;
    }

    if (node.toString() !== '[object Window]') {
      var ownerDocument = node.ownerDocument;
      return ownerDocument ? ownerDocument.defaultView || window : window;
    }

    return node;
  }

  function isElement(node) {
    var OwnElement = getWindow(node).Element;
    return node instanceof OwnElement || node instanceof Element;
  }

  function isHTMLElement(node) {
    var OwnElement = getWindow(node).HTMLElement;
    return node instanceof OwnElement || node instanceof HTMLElement;
  }

  function isShadowRoot(node) {
    // IE 11 has no ShadowRoot
    if (typeof ShadowRoot === 'undefined') {
      return false;
    }

    var OwnElement = getWindow(node).ShadowRoot;
    return node instanceof OwnElement || node instanceof ShadowRoot;
  }

  // and applies them to the HTMLElements such as popper and arrow

  function applyStyles(_ref) {
    var state = _ref.state;
    Object.keys(state.elements).forEach(function (name) {
      var style = state.styles[name] || {};
      var attributes = state.attributes[name] || {};
      var element = state.elements[name]; // arrow is optional + virtual elements

      if (!isHTMLElement(element) || !getNodeName(element)) {
        return;
      } // Flow doesn't support to extend this property, but it's the most
      // effective way to apply styles to an HTMLElement
      // $FlowFixMe[cannot-write]


      Object.assign(element.style, style);
      Object.keys(attributes).forEach(function (name) {
        var value = attributes[name];

        if (value === false) {
          element.removeAttribute(name);
        } else {
          element.setAttribute(name, value === true ? '' : value);
        }
      });
    });
  }

  function effect$2(_ref2) {
    var state = _ref2.state;
    var initialStyles = {
      popper: {
        position: state.options.strategy,
        left: '0',
        top: '0',
        margin: '0'
      },
      arrow: {
        position: 'absolute'
      },
      reference: {}
    };
    Object.assign(state.elements.popper.style, initialStyles.popper);
    state.styles = initialStyles;

    if (state.elements.arrow) {
      Object.assign(state.elements.arrow.style, initialStyles.arrow);
    }

    return function () {
      Object.keys(state.elements).forEach(function (name) {
        var element = state.elements[name];
        var attributes = state.attributes[name] || {};
        var styleProperties = Object.keys(state.styles.hasOwnProperty(name) ? state.styles[name] : initialStyles[name]); // Set all values to an empty string to unset them

        var style = styleProperties.reduce(function (style, property) {
          style[property] = '';
          return style;
        }, {}); // arrow is optional + virtual elements

        if (!isHTMLElement(element) || !getNodeName(element)) {
          return;
        }

        Object.assign(element.style, style);
        Object.keys(attributes).forEach(function (attribute) {
          element.removeAttribute(attribute);
        });
      });
    };
  } // eslint-disable-next-line import/no-unused-modules


  var applyStyles$1 = {
    name: 'applyStyles',
    enabled: true,
    phase: 'write',
    fn: applyStyles,
    effect: effect$2,
    requires: ['computeStyles']
  };

  function getBasePlacement(placement) {
    return placement.split('-')[0];
  }

  function getBoundingClientRect(element) {
    var rect = element.getBoundingClientRect();
    return {
      width: rect.width,
      height: rect.height,
      top: rect.top,
      right: rect.right,
      bottom: rect.bottom,
      left: rect.left,
      x: rect.left,
      y: rect.top
    };
  }

  // means it doesn't take into account transforms.

  function getLayoutRect(element) {
    var clientRect = getBoundingClientRect(element); // Use the clientRect sizes if it's not been transformed.
    // Fixes https://github.com/popperjs/popper-core/issues/1223

    var width = element.offsetWidth;
    var height = element.offsetHeight;

    if (Math.abs(clientRect.width - width) <= 1) {
      width = clientRect.width;
    }

    if (Math.abs(clientRect.height - height) <= 1) {
      height = clientRect.height;
    }

    return {
      x: element.offsetLeft,
      y: element.offsetTop,
      width: width,
      height: height
    };
  }

  function contains(parent, child) {
    var rootNode = child.getRootNode && child.getRootNode(); // First, attempt with faster native method

    if (parent.contains(child)) {
      return true;
    } // then fallback to custom implementation with Shadow DOM support
    else if (rootNode && isShadowRoot(rootNode)) {
        var next = child;

        do {
          if (next && parent.isSameNode(next)) {
            return true;
          } // $FlowFixMe[prop-missing]: need a better way to handle this...


          next = next.parentNode || next.host;
        } while (next);
      } // Give up, the result is false


    return false;
  }

  function getComputedStyle$1(element) {
    return getWindow(element).getComputedStyle(element);
  }

  function isTableElement(element) {
    return ['table', 'td', 'th'].indexOf(getNodeName(element)) >= 0;
  }

  function getDocumentElement(element) {
    // $FlowFixMe[incompatible-return]: assume body is always available
    return ((isElement(element) ? element.ownerDocument : // $FlowFixMe[prop-missing]
    element.document) || window.document).documentElement;
  }

  function getParentNode(element) {
    if (getNodeName(element) === 'html') {
      return element;
    }

    return (// this is a quicker (but less type safe) way to save quite some bytes from the bundle
      // $FlowFixMe[incompatible-return]
      // $FlowFixMe[prop-missing]
      element.assignedSlot || // step into the shadow DOM of the parent of a slotted node
      element.parentNode || ( // DOM Element detected
      isShadowRoot(element) ? element.host : null) || // ShadowRoot detected
      // $FlowFixMe[incompatible-call]: HTMLElement is a Node
      getDocumentElement(element) // fallback

    );
  }

  function getTrueOffsetParent(element) {
    if (!isHTMLElement(element) || // https://github.com/popperjs/popper-core/issues/837
    getComputedStyle$1(element).position === 'fixed') {
      return null;
    }

    return element.offsetParent;
  } // `.offsetParent` reports `null` for fixed elements, while absolute elements
  // return the containing block


  function getContainingBlock(element) {
    var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') !== -1;
    var isIE = navigator.userAgent.indexOf('Trident') !== -1;

    if (isIE && isHTMLElement(element)) {
      // In IE 9, 10 and 11 fixed elements containing block is always established by the viewport
      var elementCss = getComputedStyle$1(element);

      if (elementCss.position === 'fixed') {
        return null;
      }
    }

    var currentNode = getParentNode(element);

    while (isHTMLElement(currentNode) && ['html', 'body'].indexOf(getNodeName(currentNode)) < 0) {
      var css = getComputedStyle$1(currentNode); // This is non-exhaustive but covers the most common CSS properties that
      // create a containing block.
      // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block

      if (css.transform !== 'none' || css.perspective !== 'none' || css.contain === 'paint' || ['transform', 'perspective'].indexOf(css.willChange) !== -1 || isFirefox && css.willChange === 'filter' || isFirefox && css.filter && css.filter !== 'none') {
        return currentNode;
      } else {
        currentNode = currentNode.parentNode;
      }
    }

    return null;
  } // Gets the closest ancestor positioned element. Handles some edge cases,
  // such as table ancestors and cross browser bugs.


  function getOffsetParent(element) {
    var window = getWindow(element);
    var offsetParent = getTrueOffsetParent(element);

    while (offsetParent && isTableElement(offsetParent) && getComputedStyle$1(offsetParent).position === 'static') {
      offsetParent = getTrueOffsetParent(offsetParent);
    }

    if (offsetParent && (getNodeName(offsetParent) === 'html' || getNodeName(offsetParent) === 'body' && getComputedStyle$1(offsetParent).position === 'static')) {
      return window;
    }

    return offsetParent || getContainingBlock(element) || window;
  }

  function getMainAxisFromPlacement(placement) {
    return ['top', 'bottom'].indexOf(placement) >= 0 ? 'x' : 'y';
  }

  var max = Math.max;
  var min = Math.min;
  var round = Math.round;

  function within(min$1, value, max$1) {
    return max(min$1, min(value, max$1));
  }

  function getFreshSideObject() {
    return {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    };
  }

  function mergePaddingObject(paddingObject) {
    return Object.assign({}, getFreshSideObject(), paddingObject);
  }

  function expandToHashMap(value, keys) {
    return keys.reduce(function (hashMap, key) {
      hashMap[key] = value;
      return hashMap;
    }, {});
  }

  var toPaddingObject = function toPaddingObject(padding, state) {
    padding = typeof padding === 'function' ? padding(Object.assign({}, state.rects, {
      placement: state.placement
    })) : padding;
    return mergePaddingObject(typeof padding !== 'number' ? padding : expandToHashMap(padding, basePlacements));
  };

  function arrow(_ref) {
    var _state$modifiersData$;

    var state = _ref.state,
        name = _ref.name,
        options = _ref.options;
    var arrowElement = state.elements.arrow;
    var popperOffsets = state.modifiersData.popperOffsets;
    var basePlacement = getBasePlacement(state.placement);
    var axis = getMainAxisFromPlacement(basePlacement);
    var isVertical = [left, right].indexOf(basePlacement) >= 0;
    var len = isVertical ? 'height' : 'width';

    if (!arrowElement || !popperOffsets) {
      return;
    }

    var paddingObject = toPaddingObject(options.padding, state);
    var arrowRect = getLayoutRect(arrowElement);
    var minProp = axis === 'y' ? top : left;
    var maxProp = axis === 'y' ? bottom : right;
    var endDiff = state.rects.reference[len] + state.rects.reference[axis] - popperOffsets[axis] - state.rects.popper[len];
    var startDiff = popperOffsets[axis] - state.rects.reference[axis];
    var arrowOffsetParent = getOffsetParent(arrowElement);
    var clientSize = arrowOffsetParent ? axis === 'y' ? arrowOffsetParent.clientHeight || 0 : arrowOffsetParent.clientWidth || 0 : 0;
    var centerToReference = endDiff / 2 - startDiff / 2; // Make sure the arrow doesn't overflow the popper if the center point is
    // outside of the popper bounds

    var min = paddingObject[minProp];
    var max = clientSize - arrowRect[len] - paddingObject[maxProp];
    var center = clientSize / 2 - arrowRect[len] / 2 + centerToReference;
    var offset = within(min, center, max); // Prevents breaking syntax highlighting...

    var axisProp = axis;
    state.modifiersData[name] = (_state$modifiersData$ = {}, _state$modifiersData$[axisProp] = offset, _state$modifiersData$.centerOffset = offset - center, _state$modifiersData$);
  }

  function effect$1(_ref2) {
    var state = _ref2.state,
        options = _ref2.options;
    var _options$element = options.element,
        arrowElement = _options$element === void 0 ? '[data-popper-arrow]' : _options$element;

    if (arrowElement == null) {
      return;
    } // CSS selector


    if (typeof arrowElement === 'string') {
      arrowElement = state.elements.popper.querySelector(arrowElement);

      if (!arrowElement) {
        return;
      }
    }

    if (!contains(state.elements.popper, arrowElement)) {

      return;
    }

    state.elements.arrow = arrowElement;
  } // eslint-disable-next-line import/no-unused-modules


  var arrow$1 = {
    name: 'arrow',
    enabled: true,
    phase: 'main',
    fn: arrow,
    effect: effect$1,
    requires: ['popperOffsets'],
    requiresIfExists: ['preventOverflow']
  };

  var unsetSides = {
    top: 'auto',
    right: 'auto',
    bottom: 'auto',
    left: 'auto'
  }; // Round the offsets to the nearest suitable subpixel based on the DPR.
  // Zooming can change the DPR, but it seems to report a value that will
  // cleanly divide the values into the appropriate subpixels.

  function roundOffsetsByDPR(_ref) {
    var x = _ref.x,
        y = _ref.y;
    var win = window;
    var dpr = win.devicePixelRatio || 1;
    return {
      x: round(round(x * dpr) / dpr) || 0,
      y: round(round(y * dpr) / dpr) || 0
    };
  }

  function mapToStyles(_ref2) {
    var _Object$assign2;

    var popper = _ref2.popper,
        popperRect = _ref2.popperRect,
        placement = _ref2.placement,
        offsets = _ref2.offsets,
        position = _ref2.position,
        gpuAcceleration = _ref2.gpuAcceleration,
        adaptive = _ref2.adaptive,
        roundOffsets = _ref2.roundOffsets;

    var _ref3 = roundOffsets === true ? roundOffsetsByDPR(offsets) : typeof roundOffsets === 'function' ? roundOffsets(offsets) : offsets,
        _ref3$x = _ref3.x,
        x = _ref3$x === void 0 ? 0 : _ref3$x,
        _ref3$y = _ref3.y,
        y = _ref3$y === void 0 ? 0 : _ref3$y;

    var hasX = offsets.hasOwnProperty('x');
    var hasY = offsets.hasOwnProperty('y');
    var sideX = left;
    var sideY = top;
    var win = window;

    if (adaptive) {
      var offsetParent = getOffsetParent(popper);
      var heightProp = 'clientHeight';
      var widthProp = 'clientWidth';

      if (offsetParent === getWindow(popper)) {
        offsetParent = getDocumentElement(popper);

        if (getComputedStyle$1(offsetParent).position !== 'static') {
          heightProp = 'scrollHeight';
          widthProp = 'scrollWidth';
        }
      } // $FlowFixMe[incompatible-cast]: force type refinement, we compare offsetParent with window above, but Flow doesn't detect it


      offsetParent = offsetParent;

      if (placement === top) {
        sideY = bottom; // $FlowFixMe[prop-missing]

        y -= offsetParent[heightProp] - popperRect.height;
        y *= gpuAcceleration ? 1 : -1;
      }

      if (placement === left) {
        sideX = right; // $FlowFixMe[prop-missing]

        x -= offsetParent[widthProp] - popperRect.width;
        x *= gpuAcceleration ? 1 : -1;
      }
    }

    var commonStyles = Object.assign({
      position: position
    }, adaptive && unsetSides);

    if (gpuAcceleration) {
      var _Object$assign;

      return Object.assign({}, commonStyles, (_Object$assign = {}, _Object$assign[sideY] = hasY ? '0' : '', _Object$assign[sideX] = hasX ? '0' : '', _Object$assign.transform = (win.devicePixelRatio || 1) < 2 ? "translate(" + x + "px, " + y + "px)" : "translate3d(" + x + "px, " + y + "px, 0)", _Object$assign));
    }

    return Object.assign({}, commonStyles, (_Object$assign2 = {}, _Object$assign2[sideY] = hasY ? y + "px" : '', _Object$assign2[sideX] = hasX ? x + "px" : '', _Object$assign2.transform = '', _Object$assign2));
  }

  function computeStyles(_ref4) {
    var state = _ref4.state,
        options = _ref4.options;
    var _options$gpuAccelerat = options.gpuAcceleration,
        gpuAcceleration = _options$gpuAccelerat === void 0 ? true : _options$gpuAccelerat,
        _options$adaptive = options.adaptive,
        adaptive = _options$adaptive === void 0 ? true : _options$adaptive,
        _options$roundOffsets = options.roundOffsets,
        roundOffsets = _options$roundOffsets === void 0 ? true : _options$roundOffsets;

    var commonStyles = {
      placement: getBasePlacement(state.placement),
      popper: state.elements.popper,
      popperRect: state.rects.popper,
      gpuAcceleration: gpuAcceleration
    };

    if (state.modifiersData.popperOffsets != null) {
      state.styles.popper = Object.assign({}, state.styles.popper, mapToStyles(Object.assign({}, commonStyles, {
        offsets: state.modifiersData.popperOffsets,
        position: state.options.strategy,
        adaptive: adaptive,
        roundOffsets: roundOffsets
      })));
    }

    if (state.modifiersData.arrow != null) {
      state.styles.arrow = Object.assign({}, state.styles.arrow, mapToStyles(Object.assign({}, commonStyles, {
        offsets: state.modifiersData.arrow,
        position: 'absolute',
        adaptive: false,
        roundOffsets: roundOffsets
      })));
    }

    state.attributes.popper = Object.assign({}, state.attributes.popper, {
      'data-popper-placement': state.placement
    });
  } // eslint-disable-next-line import/no-unused-modules


  var computeStyles$1 = {
    name: 'computeStyles',
    enabled: true,
    phase: 'beforeWrite',
    fn: computeStyles,
    data: {}
  };

  var passive = {
    passive: true
  };

  function effect(_ref) {
    var state = _ref.state,
        instance = _ref.instance,
        options = _ref.options;
    var _options$scroll = options.scroll,
        scroll = _options$scroll === void 0 ? true : _options$scroll,
        _options$resize = options.resize,
        resize = _options$resize === void 0 ? true : _options$resize;
    var window = getWindow(state.elements.popper);
    var scrollParents = [].concat(state.scrollParents.reference, state.scrollParents.popper);

    if (scroll) {
      scrollParents.forEach(function (scrollParent) {
        scrollParent.addEventListener('scroll', instance.update, passive);
      });
    }

    if (resize) {
      window.addEventListener('resize', instance.update, passive);
    }

    return function () {
      if (scroll) {
        scrollParents.forEach(function (scrollParent) {
          scrollParent.removeEventListener('scroll', instance.update, passive);
        });
      }

      if (resize) {
        window.removeEventListener('resize', instance.update, passive);
      }
    };
  } // eslint-disable-next-line import/no-unused-modules


  var eventListeners = {
    name: 'eventListeners',
    enabled: true,
    phase: 'write',
    fn: function fn() {},
    effect: effect,
    data: {}
  };

  var hash$1 = {
    left: 'right',
    right: 'left',
    bottom: 'top',
    top: 'bottom'
  };
  function getOppositePlacement(placement) {
    return placement.replace(/left|right|bottom|top/g, function (matched) {
      return hash$1[matched];
    });
  }

  var hash = {
    start: 'end',
    end: 'start'
  };
  function getOppositeVariationPlacement(placement) {
    return placement.replace(/start|end/g, function (matched) {
      return hash[matched];
    });
  }

  function getWindowScroll(node) {
    var win = getWindow(node);
    var scrollLeft = win.pageXOffset;
    var scrollTop = win.pageYOffset;
    return {
      scrollLeft: scrollLeft,
      scrollTop: scrollTop
    };
  }

  function getWindowScrollBarX(element) {
    // If <html> has a CSS width greater than the viewport, then this will be
    // incorrect for RTL.
    // Popper 1 is broken in this case and never had a bug report so let's assume
    // it's not an issue. I don't think anyone ever specifies width on <html>
    // anyway.
    // Browsers where the left scrollbar doesn't cause an issue report `0` for
    // this (e.g. Edge 2019, IE11, Safari)
    return getBoundingClientRect(getDocumentElement(element)).left + getWindowScroll(element).scrollLeft;
  }

  function getViewportRect(element) {
    var win = getWindow(element);
    var html = getDocumentElement(element);
    var visualViewport = win.visualViewport;
    var width = html.clientWidth;
    var height = html.clientHeight;
    var x = 0;
    var y = 0; // NB: This isn't supported on iOS <= 12. If the keyboard is open, the popper
    // can be obscured underneath it.
    // Also, `html.clientHeight` adds the bottom bar height in Safari iOS, even
    // if it isn't open, so if this isn't available, the popper will be detected
    // to overflow the bottom of the screen too early.

    if (visualViewport) {
      width = visualViewport.width;
      height = visualViewport.height; // Uses Layout Viewport (like Chrome; Safari does not currently)
      // In Chrome, it returns a value very close to 0 (+/-) but contains rounding
      // errors due to floating point numbers, so we need to check precision.
      // Safari returns a number <= 0, usually < -1 when pinch-zoomed
      // Feature detection fails in mobile emulation mode in Chrome.
      // Math.abs(win.innerWidth / visualViewport.scale - visualViewport.width) <
      // 0.001
      // Fallback here: "Not Safari" userAgent

      if (!/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
        x = visualViewport.offsetLeft;
        y = visualViewport.offsetTop;
      }
    }

    return {
      width: width,
      height: height,
      x: x + getWindowScrollBarX(element),
      y: y
    };
  }

  // of the `<html>` and `<body>` rect bounds if horizontally scrollable

  function getDocumentRect(element) {
    var _element$ownerDocumen;

    var html = getDocumentElement(element);
    var winScroll = getWindowScroll(element);
    var body = (_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body;
    var width = max(html.scrollWidth, html.clientWidth, body ? body.scrollWidth : 0, body ? body.clientWidth : 0);
    var height = max(html.scrollHeight, html.clientHeight, body ? body.scrollHeight : 0, body ? body.clientHeight : 0);
    var x = -winScroll.scrollLeft + getWindowScrollBarX(element);
    var y = -winScroll.scrollTop;

    if (getComputedStyle$1(body || html).direction === 'rtl') {
      x += max(html.clientWidth, body ? body.clientWidth : 0) - width;
    }

    return {
      width: width,
      height: height,
      x: x,
      y: y
    };
  }

  function isScrollParent(element) {
    // Firefox wants us to check `-x` and `-y` variations as well
    var _getComputedStyle = getComputedStyle$1(element),
        overflow = _getComputedStyle.overflow,
        overflowX = _getComputedStyle.overflowX,
        overflowY = _getComputedStyle.overflowY;

    return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX);
  }

  function getScrollParent(node) {
    if (['html', 'body', '#document'].indexOf(getNodeName(node)) >= 0) {
      // $FlowFixMe[incompatible-return]: assume body is always available
      return node.ownerDocument.body;
    }

    if (isHTMLElement(node) && isScrollParent(node)) {
      return node;
    }

    return getScrollParent(getParentNode(node));
  }

  /*
  given a DOM element, return the list of all scroll parents, up the list of ancesors
  until we get to the top window object. This list is what we attach scroll listeners
  to, because if any of these parent elements scroll, we'll need to re-calculate the
  reference element's position.
  */

  function listScrollParents(element, list) {
    var _element$ownerDocumen;

    if (list === void 0) {
      list = [];
    }

    var scrollParent = getScrollParent(element);
    var isBody = scrollParent === ((_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body);
    var win = getWindow(scrollParent);
    var target = isBody ? [win].concat(win.visualViewport || [], isScrollParent(scrollParent) ? scrollParent : []) : scrollParent;
    var updatedList = list.concat(target);
    return isBody ? updatedList : // $FlowFixMe[incompatible-call]: isBody tells us target will be an HTMLElement here
    updatedList.concat(listScrollParents(getParentNode(target)));
  }

  function rectToClientRect(rect) {
    return Object.assign({}, rect, {
      left: rect.x,
      top: rect.y,
      right: rect.x + rect.width,
      bottom: rect.y + rect.height
    });
  }

  function getInnerBoundingClientRect(element) {
    var rect = getBoundingClientRect(element);
    rect.top = rect.top + element.clientTop;
    rect.left = rect.left + element.clientLeft;
    rect.bottom = rect.top + element.clientHeight;
    rect.right = rect.left + element.clientWidth;
    rect.width = element.clientWidth;
    rect.height = element.clientHeight;
    rect.x = rect.left;
    rect.y = rect.top;
    return rect;
  }

  function getClientRectFromMixedType(element, clippingParent) {
    return clippingParent === viewport ? rectToClientRect(getViewportRect(element)) : isHTMLElement(clippingParent) ? getInnerBoundingClientRect(clippingParent) : rectToClientRect(getDocumentRect(getDocumentElement(element)));
  } // A "clipping parent" is an overflowable container with the characteristic of
  // clipping (or hiding) overflowing elements with a position different from
  // `initial`


  function getClippingParents(element) {
    var clippingParents = listScrollParents(getParentNode(element));
    var canEscapeClipping = ['absolute', 'fixed'].indexOf(getComputedStyle$1(element).position) >= 0;
    var clipperElement = canEscapeClipping && isHTMLElement(element) ? getOffsetParent(element) : element;

    if (!isElement(clipperElement)) {
      return [];
    } // $FlowFixMe[incompatible-return]: https://github.com/facebook/flow/issues/1414


    return clippingParents.filter(function (clippingParent) {
      return isElement(clippingParent) && contains(clippingParent, clipperElement) && getNodeName(clippingParent) !== 'body';
    });
  } // Gets the maximum area that the element is visible in due to any number of
  // clipping parents


  function getClippingRect(element, boundary, rootBoundary) {
    var mainClippingParents = boundary === 'clippingParents' ? getClippingParents(element) : [].concat(boundary);
    var clippingParents = [].concat(mainClippingParents, [rootBoundary]);
    var firstClippingParent = clippingParents[0];
    var clippingRect = clippingParents.reduce(function (accRect, clippingParent) {
      var rect = getClientRectFromMixedType(element, clippingParent);
      accRect.top = max(rect.top, accRect.top);
      accRect.right = min(rect.right, accRect.right);
      accRect.bottom = min(rect.bottom, accRect.bottom);
      accRect.left = max(rect.left, accRect.left);
      return accRect;
    }, getClientRectFromMixedType(element, firstClippingParent));
    clippingRect.width = clippingRect.right - clippingRect.left;
    clippingRect.height = clippingRect.bottom - clippingRect.top;
    clippingRect.x = clippingRect.left;
    clippingRect.y = clippingRect.top;
    return clippingRect;
  }

  function getVariation(placement) {
    return placement.split('-')[1];
  }

  function computeOffsets(_ref) {
    var reference = _ref.reference,
        element = _ref.element,
        placement = _ref.placement;
    var basePlacement = placement ? getBasePlacement(placement) : null;
    var variation = placement ? getVariation(placement) : null;
    var commonX = reference.x + reference.width / 2 - element.width / 2;
    var commonY = reference.y + reference.height / 2 - element.height / 2;
    var offsets;

    switch (basePlacement) {
      case top:
        offsets = {
          x: commonX,
          y: reference.y - element.height
        };
        break;

      case bottom:
        offsets = {
          x: commonX,
          y: reference.y + reference.height
        };
        break;

      case right:
        offsets = {
          x: reference.x + reference.width,
          y: commonY
        };
        break;

      case left:
        offsets = {
          x: reference.x - element.width,
          y: commonY
        };
        break;

      default:
        offsets = {
          x: reference.x,
          y: reference.y
        };
    }

    var mainAxis = basePlacement ? getMainAxisFromPlacement(basePlacement) : null;

    if (mainAxis != null) {
      var len = mainAxis === 'y' ? 'height' : 'width';

      switch (variation) {
        case start:
          offsets[mainAxis] = offsets[mainAxis] - (reference[len] / 2 - element[len] / 2);
          break;

        case end:
          offsets[mainAxis] = offsets[mainAxis] + (reference[len] / 2 - element[len] / 2);
          break;
      }
    }

    return offsets;
  }

  function detectOverflow(state, options) {
    if (options === void 0) {
      options = {};
    }

    var _options = options,
        _options$placement = _options.placement,
        placement = _options$placement === void 0 ? state.placement : _options$placement,
        _options$boundary = _options.boundary,
        boundary = _options$boundary === void 0 ? clippingParents : _options$boundary,
        _options$rootBoundary = _options.rootBoundary,
        rootBoundary = _options$rootBoundary === void 0 ? viewport : _options$rootBoundary,
        _options$elementConte = _options.elementContext,
        elementContext = _options$elementConte === void 0 ? popper : _options$elementConte,
        _options$altBoundary = _options.altBoundary,
        altBoundary = _options$altBoundary === void 0 ? false : _options$altBoundary,
        _options$padding = _options.padding,
        padding = _options$padding === void 0 ? 0 : _options$padding;
    var paddingObject = mergePaddingObject(typeof padding !== 'number' ? padding : expandToHashMap(padding, basePlacements));
    var altContext = elementContext === popper ? reference : popper;
    var referenceElement = state.elements.reference;
    var popperRect = state.rects.popper;
    var element = state.elements[altBoundary ? altContext : elementContext];
    var clippingClientRect = getClippingRect(isElement(element) ? element : element.contextElement || getDocumentElement(state.elements.popper), boundary, rootBoundary);
    var referenceClientRect = getBoundingClientRect(referenceElement);
    var popperOffsets = computeOffsets({
      reference: referenceClientRect,
      element: popperRect,
      strategy: 'absolute',
      placement: placement
    });
    var popperClientRect = rectToClientRect(Object.assign({}, popperRect, popperOffsets));
    var elementClientRect = elementContext === popper ? popperClientRect : referenceClientRect; // positive = overflowing the clipping rect
    // 0 or negative = within the clipping rect

    var overflowOffsets = {
      top: clippingClientRect.top - elementClientRect.top + paddingObject.top,
      bottom: elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom,
      left: clippingClientRect.left - elementClientRect.left + paddingObject.left,
      right: elementClientRect.right - clippingClientRect.right + paddingObject.right
    };
    var offsetData = state.modifiersData.offset; // Offsets can be applied only to the popper element

    if (elementContext === popper && offsetData) {
      var offset = offsetData[placement];
      Object.keys(overflowOffsets).forEach(function (key) {
        var multiply = [right, bottom].indexOf(key) >= 0 ? 1 : -1;
        var axis = [top, bottom].indexOf(key) >= 0 ? 'y' : 'x';
        overflowOffsets[key] += offset[axis] * multiply;
      });
    }

    return overflowOffsets;
  }

  function computeAutoPlacement(state, options) {
    if (options === void 0) {
      options = {};
    }

    var _options = options,
        placement = _options.placement,
        boundary = _options.boundary,
        rootBoundary = _options.rootBoundary,
        padding = _options.padding,
        flipVariations = _options.flipVariations,
        _options$allowedAutoP = _options.allowedAutoPlacements,
        allowedAutoPlacements = _options$allowedAutoP === void 0 ? placements : _options$allowedAutoP;
    var variation = getVariation(placement);
    var placements$1 = variation ? flipVariations ? variationPlacements : variationPlacements.filter(function (placement) {
      return getVariation(placement) === variation;
    }) : basePlacements;
    var allowedPlacements = placements$1.filter(function (placement) {
      return allowedAutoPlacements.indexOf(placement) >= 0;
    });

    if (allowedPlacements.length === 0) {
      allowedPlacements = placements$1;
    } // $FlowFixMe[incompatible-type]: Flow seems to have problems with two array unions...


    var overflows = allowedPlacements.reduce(function (acc, placement) {
      acc[placement] = detectOverflow(state, {
        placement: placement,
        boundary: boundary,
        rootBoundary: rootBoundary,
        padding: padding
      })[getBasePlacement(placement)];
      return acc;
    }, {});
    return Object.keys(overflows).sort(function (a, b) {
      return overflows[a] - overflows[b];
    });
  }

  function getExpandedFallbackPlacements(placement) {
    if (getBasePlacement(placement) === auto) {
      return [];
    }

    var oppositePlacement = getOppositePlacement(placement);
    return [getOppositeVariationPlacement(placement), oppositePlacement, getOppositeVariationPlacement(oppositePlacement)];
  }

  function flip(_ref) {
    var state = _ref.state,
        options = _ref.options,
        name = _ref.name;

    if (state.modifiersData[name]._skip) {
      return;
    }

    var _options$mainAxis = options.mainAxis,
        checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis,
        _options$altAxis = options.altAxis,
        checkAltAxis = _options$altAxis === void 0 ? true : _options$altAxis,
        specifiedFallbackPlacements = options.fallbackPlacements,
        padding = options.padding,
        boundary = options.boundary,
        rootBoundary = options.rootBoundary,
        altBoundary = options.altBoundary,
        _options$flipVariatio = options.flipVariations,
        flipVariations = _options$flipVariatio === void 0 ? true : _options$flipVariatio,
        allowedAutoPlacements = options.allowedAutoPlacements;
    var preferredPlacement = state.options.placement;
    var basePlacement = getBasePlacement(preferredPlacement);
    var isBasePlacement = basePlacement === preferredPlacement;
    var fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipVariations ? [getOppositePlacement(preferredPlacement)] : getExpandedFallbackPlacements(preferredPlacement));
    var placements = [preferredPlacement].concat(fallbackPlacements).reduce(function (acc, placement) {
      return acc.concat(getBasePlacement(placement) === auto ? computeAutoPlacement(state, {
        placement: placement,
        boundary: boundary,
        rootBoundary: rootBoundary,
        padding: padding,
        flipVariations: flipVariations,
        allowedAutoPlacements: allowedAutoPlacements
      }) : placement);
    }, []);
    var referenceRect = state.rects.reference;
    var popperRect = state.rects.popper;
    var checksMap = new Map();
    var makeFallbackChecks = true;
    var firstFittingPlacement = placements[0];

    for (var i = 0; i < placements.length; i++) {
      var placement = placements[i];

      var _basePlacement = getBasePlacement(placement);

      var isStartVariation = getVariation(placement) === start;
      var isVertical = [top, bottom].indexOf(_basePlacement) >= 0;
      var len = isVertical ? 'width' : 'height';
      var overflow = detectOverflow(state, {
        placement: placement,
        boundary: boundary,
        rootBoundary: rootBoundary,
        altBoundary: altBoundary,
        padding: padding
      });
      var mainVariationSide = isVertical ? isStartVariation ? right : left : isStartVariation ? bottom : top;

      if (referenceRect[len] > popperRect[len]) {
        mainVariationSide = getOppositePlacement(mainVariationSide);
      }

      var altVariationSide = getOppositePlacement(mainVariationSide);
      var checks = [];

      if (checkMainAxis) {
        checks.push(overflow[_basePlacement] <= 0);
      }

      if (checkAltAxis) {
        checks.push(overflow[mainVariationSide] <= 0, overflow[altVariationSide] <= 0);
      }

      if (checks.every(function (check) {
        return check;
      })) {
        firstFittingPlacement = placement;
        makeFallbackChecks = false;
        break;
      }

      checksMap.set(placement, checks);
    }

    if (makeFallbackChecks) {
      // `2` may be desired in some cases – research later
      var numberOfChecks = flipVariations ? 3 : 1;

      var _loop = function _loop(_i) {
        var fittingPlacement = placements.find(function (placement) {
          var checks = checksMap.get(placement);

          if (checks) {
            return checks.slice(0, _i).every(function (check) {
              return check;
            });
          }
        });

        if (fittingPlacement) {
          firstFittingPlacement = fittingPlacement;
          return "break";
        }
      };

      for (var _i = numberOfChecks; _i > 0; _i--) {
        var _ret = _loop(_i);

        if (_ret === "break") break;
      }
    }

    if (state.placement !== firstFittingPlacement) {
      state.modifiersData[name]._skip = true;
      state.placement = firstFittingPlacement;
      state.reset = true;
    }
  } // eslint-disable-next-line import/no-unused-modules


  var flip$1 = {
    name: 'flip',
    enabled: true,
    phase: 'main',
    fn: flip,
    requiresIfExists: ['offset'],
    data: {
      _skip: false
    }
  };

  function getSideOffsets(overflow, rect, preventedOffsets) {
    if (preventedOffsets === void 0) {
      preventedOffsets = {
        x: 0,
        y: 0
      };
    }

    return {
      top: overflow.top - rect.height - preventedOffsets.y,
      right: overflow.right - rect.width + preventedOffsets.x,
      bottom: overflow.bottom - rect.height + preventedOffsets.y,
      left: overflow.left - rect.width - preventedOffsets.x
    };
  }

  function isAnySideFullyClipped(overflow) {
    return [top, right, bottom, left].some(function (side) {
      return overflow[side] >= 0;
    });
  }

  function hide$1(_ref) {
    var state = _ref.state,
        name = _ref.name;
    var referenceRect = state.rects.reference;
    var popperRect = state.rects.popper;
    var preventedOffsets = state.modifiersData.preventOverflow;
    var referenceOverflow = detectOverflow(state, {
      elementContext: 'reference'
    });
    var popperAltOverflow = detectOverflow(state, {
      altBoundary: true
    });
    var referenceClippingOffsets = getSideOffsets(referenceOverflow, referenceRect);
    var popperEscapeOffsets = getSideOffsets(popperAltOverflow, popperRect, preventedOffsets);
    var isReferenceHidden = isAnySideFullyClipped(referenceClippingOffsets);
    var hasPopperEscaped = isAnySideFullyClipped(popperEscapeOffsets);
    state.modifiersData[name] = {
      referenceClippingOffsets: referenceClippingOffsets,
      popperEscapeOffsets: popperEscapeOffsets,
      isReferenceHidden: isReferenceHidden,
      hasPopperEscaped: hasPopperEscaped
    };
    state.attributes.popper = Object.assign({}, state.attributes.popper, {
      'data-popper-reference-hidden': isReferenceHidden,
      'data-popper-escaped': hasPopperEscaped
    });
  } // eslint-disable-next-line import/no-unused-modules


  var hide$2 = {
    name: 'hide',
    enabled: true,
    phase: 'main',
    requiresIfExists: ['preventOverflow'],
    fn: hide$1
  };

  function distanceAndSkiddingToXY(placement, rects, offset) {
    var basePlacement = getBasePlacement(placement);
    var invertDistance = [left, top].indexOf(basePlacement) >= 0 ? -1 : 1;

    var _ref = typeof offset === 'function' ? offset(Object.assign({}, rects, {
      placement: placement
    })) : offset,
        skidding = _ref[0],
        distance = _ref[1];

    skidding = skidding || 0;
    distance = (distance || 0) * invertDistance;
    return [left, right].indexOf(basePlacement) >= 0 ? {
      x: distance,
      y: skidding
    } : {
      x: skidding,
      y: distance
    };
  }

  function offset(_ref2) {
    var state = _ref2.state,
        options = _ref2.options,
        name = _ref2.name;
    var _options$offset = options.offset,
        offset = _options$offset === void 0 ? [0, 0] : _options$offset;
    var data = placements.reduce(function (acc, placement) {
      acc[placement] = distanceAndSkiddingToXY(placement, state.rects, offset);
      return acc;
    }, {});
    var _data$state$placement = data[state.placement],
        x = _data$state$placement.x,
        y = _data$state$placement.y;

    if (state.modifiersData.popperOffsets != null) {
      state.modifiersData.popperOffsets.x += x;
      state.modifiersData.popperOffsets.y += y;
    }

    state.modifiersData[name] = data;
  } // eslint-disable-next-line import/no-unused-modules


  var offset$1 = {
    name: 'offset',
    enabled: true,
    phase: 'main',
    requires: ['popperOffsets'],
    fn: offset
  };

  function popperOffsets(_ref) {
    var state = _ref.state,
        name = _ref.name;
    // Offsets are the actual position the popper needs to have to be
    // properly positioned near its reference element
    // This is the most basic placement, and will be adjusted by
    // the modifiers in the next step
    state.modifiersData[name] = computeOffsets({
      reference: state.rects.reference,
      element: state.rects.popper,
      strategy: 'absolute',
      placement: state.placement
    });
  } // eslint-disable-next-line import/no-unused-modules


  var popperOffsets$1 = {
    name: 'popperOffsets',
    enabled: true,
    phase: 'read',
    fn: popperOffsets,
    data: {}
  };

  function getAltAxis(axis) {
    return axis === 'x' ? 'y' : 'x';
  }

  function preventOverflow(_ref) {
    var state = _ref.state,
        options = _ref.options,
        name = _ref.name;
    var _options$mainAxis = options.mainAxis,
        checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis,
        _options$altAxis = options.altAxis,
        checkAltAxis = _options$altAxis === void 0 ? false : _options$altAxis,
        boundary = options.boundary,
        rootBoundary = options.rootBoundary,
        altBoundary = options.altBoundary,
        padding = options.padding,
        _options$tether = options.tether,
        tether = _options$tether === void 0 ? true : _options$tether,
        _options$tetherOffset = options.tetherOffset,
        tetherOffset = _options$tetherOffset === void 0 ? 0 : _options$tetherOffset;
    var overflow = detectOverflow(state, {
      boundary: boundary,
      rootBoundary: rootBoundary,
      padding: padding,
      altBoundary: altBoundary
    });
    var basePlacement = getBasePlacement(state.placement);
    var variation = getVariation(state.placement);
    var isBasePlacement = !variation;
    var mainAxis = getMainAxisFromPlacement(basePlacement);
    var altAxis = getAltAxis(mainAxis);
    var popperOffsets = state.modifiersData.popperOffsets;
    var referenceRect = state.rects.reference;
    var popperRect = state.rects.popper;
    var tetherOffsetValue = typeof tetherOffset === 'function' ? tetherOffset(Object.assign({}, state.rects, {
      placement: state.placement
    })) : tetherOffset;
    var data = {
      x: 0,
      y: 0
    };

    if (!popperOffsets) {
      return;
    }

    if (checkMainAxis || checkAltAxis) {
      var mainSide = mainAxis === 'y' ? top : left;
      var altSide = mainAxis === 'y' ? bottom : right;
      var len = mainAxis === 'y' ? 'height' : 'width';
      var offset = popperOffsets[mainAxis];
      var min$1 = popperOffsets[mainAxis] + overflow[mainSide];
      var max$1 = popperOffsets[mainAxis] - overflow[altSide];
      var additive = tether ? -popperRect[len] / 2 : 0;
      var minLen = variation === start ? referenceRect[len] : popperRect[len];
      var maxLen = variation === start ? -popperRect[len] : -referenceRect[len]; // We need to include the arrow in the calculation so the arrow doesn't go
      // outside the reference bounds

      var arrowElement = state.elements.arrow;
      var arrowRect = tether && arrowElement ? getLayoutRect(arrowElement) : {
        width: 0,
        height: 0
      };
      var arrowPaddingObject = state.modifiersData['arrow#persistent'] ? state.modifiersData['arrow#persistent'].padding : getFreshSideObject();
      var arrowPaddingMin = arrowPaddingObject[mainSide];
      var arrowPaddingMax = arrowPaddingObject[altSide]; // If the reference length is smaller than the arrow length, we don't want
      // to include its full size in the calculation. If the reference is small
      // and near the edge of a boundary, the popper can overflow even if the
      // reference is not overflowing as well (e.g. virtual elements with no
      // width or height)

      var arrowLen = within(0, referenceRect[len], arrowRect[len]);
      var minOffset = isBasePlacement ? referenceRect[len] / 2 - additive - arrowLen - arrowPaddingMin - tetherOffsetValue : minLen - arrowLen - arrowPaddingMin - tetherOffsetValue;
      var maxOffset = isBasePlacement ? -referenceRect[len] / 2 + additive + arrowLen + arrowPaddingMax + tetherOffsetValue : maxLen + arrowLen + arrowPaddingMax + tetherOffsetValue;
      var arrowOffsetParent = state.elements.arrow && getOffsetParent(state.elements.arrow);
      var clientOffset = arrowOffsetParent ? mainAxis === 'y' ? arrowOffsetParent.clientTop || 0 : arrowOffsetParent.clientLeft || 0 : 0;
      var offsetModifierValue = state.modifiersData.offset ? state.modifiersData.offset[state.placement][mainAxis] : 0;
      var tetherMin = popperOffsets[mainAxis] + minOffset - offsetModifierValue - clientOffset;
      var tetherMax = popperOffsets[mainAxis] + maxOffset - offsetModifierValue;

      if (checkMainAxis) {
        var preventedOffset = within(tether ? min(min$1, tetherMin) : min$1, offset, tether ? max(max$1, tetherMax) : max$1);
        popperOffsets[mainAxis] = preventedOffset;
        data[mainAxis] = preventedOffset - offset;
      }

      if (checkAltAxis) {
        var _mainSide = mainAxis === 'x' ? top : left;

        var _altSide = mainAxis === 'x' ? bottom : right;

        var _offset = popperOffsets[altAxis];

        var _min = _offset + overflow[_mainSide];

        var _max = _offset - overflow[_altSide];

        var _preventedOffset = within(tether ? min(_min, tetherMin) : _min, _offset, tether ? max(_max, tetherMax) : _max);

        popperOffsets[altAxis] = _preventedOffset;
        data[altAxis] = _preventedOffset - _offset;
      }
    }

    state.modifiersData[name] = data;
  } // eslint-disable-next-line import/no-unused-modules


  var preventOverflow$1 = {
    name: 'preventOverflow',
    enabled: true,
    phase: 'main',
    fn: preventOverflow,
    requiresIfExists: ['offset']
  };

  function getHTMLElementScroll(element) {
    return {
      scrollLeft: element.scrollLeft,
      scrollTop: element.scrollTop
    };
  }

  function getNodeScroll(node) {
    if (node === getWindow(node) || !isHTMLElement(node)) {
      return getWindowScroll(node);
    } else {
      return getHTMLElementScroll(node);
    }
  }

  // Composite means it takes into account transforms as well as layout.

  function getCompositeRect(elementOrVirtualElement, offsetParent, isFixed) {
    if (isFixed === void 0) {
      isFixed = false;
    }

    var documentElement = getDocumentElement(offsetParent);
    var rect = getBoundingClientRect(elementOrVirtualElement);
    var isOffsetParentAnElement = isHTMLElement(offsetParent);
    var scroll = {
      scrollLeft: 0,
      scrollTop: 0
    };
    var offsets = {
      x: 0,
      y: 0
    };

    if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
      if (getNodeName(offsetParent) !== 'body' || // https://github.com/popperjs/popper-core/issues/1078
      isScrollParent(documentElement)) {
        scroll = getNodeScroll(offsetParent);
      }

      if (isHTMLElement(offsetParent)) {
        offsets = getBoundingClientRect(offsetParent);
        offsets.x += offsetParent.clientLeft;
        offsets.y += offsetParent.clientTop;
      } else if (documentElement) {
        offsets.x = getWindowScrollBarX(documentElement);
      }
    }

    return {
      x: rect.left + scroll.scrollLeft - offsets.x,
      y: rect.top + scroll.scrollTop - offsets.y,
      width: rect.width,
      height: rect.height
    };
  }

  function order(modifiers) {
    var map = new Map();
    var visited = new Set();
    var result = [];
    modifiers.forEach(function (modifier) {
      map.set(modifier.name, modifier);
    }); // On visiting object, check for its dependencies and visit them recursively

    function sort(modifier) {
      visited.add(modifier.name);
      var requires = [].concat(modifier.requires || [], modifier.requiresIfExists || []);
      requires.forEach(function (dep) {
        if (!visited.has(dep)) {
          var depModifier = map.get(dep);

          if (depModifier) {
            sort(depModifier);
          }
        }
      });
      result.push(modifier);
    }

    modifiers.forEach(function (modifier) {
      if (!visited.has(modifier.name)) {
        // check for visited object
        sort(modifier);
      }
    });
    return result;
  }

  function orderModifiers(modifiers) {
    // order based on dependencies
    var orderedModifiers = order(modifiers); // order based on phase

    return modifierPhases.reduce(function (acc, phase) {
      return acc.concat(orderedModifiers.filter(function (modifier) {
        return modifier.phase === phase;
      }));
    }, []);
  }

  function debounce(fn) {
    var pending;
    return function () {
      if (!pending) {
        pending = new Promise(function (resolve) {
          Promise.resolve().then(function () {
            pending = undefined;
            resolve(fn());
          });
        });
      }

      return pending;
    };
  }

  function mergeByName(modifiers) {
    var merged = modifiers.reduce(function (merged, current) {
      var existing = merged[current.name];
      merged[current.name] = existing ? Object.assign({}, existing, current, {
        options: Object.assign({}, existing.options, current.options),
        data: Object.assign({}, existing.data, current.data)
      }) : current;
      return merged;
    }, {}); // IE11 does not support Object.values

    return Object.keys(merged).map(function (key) {
      return merged[key];
    });
  }

  var DEFAULT_OPTIONS = {
    placement: 'bottom',
    modifiers: [],
    strategy: 'absolute'
  };

  function areValidElements() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return !args.some(function (element) {
      return !(element && typeof element.getBoundingClientRect === 'function');
    });
  }

  function popperGenerator(generatorOptions) {
    if (generatorOptions === void 0) {
      generatorOptions = {};
    }

    var _generatorOptions = generatorOptions,
        _generatorOptions$def = _generatorOptions.defaultModifiers,
        defaultModifiers = _generatorOptions$def === void 0 ? [] : _generatorOptions$def,
        _generatorOptions$def2 = _generatorOptions.defaultOptions,
        defaultOptions = _generatorOptions$def2 === void 0 ? DEFAULT_OPTIONS : _generatorOptions$def2;
    return function createPopper(reference, popper, options) {
      if (options === void 0) {
        options = defaultOptions;
      }

      var state = {
        placement: 'bottom',
        orderedModifiers: [],
        options: Object.assign({}, DEFAULT_OPTIONS, defaultOptions),
        modifiersData: {},
        elements: {
          reference: reference,
          popper: popper
        },
        attributes: {},
        styles: {}
      };
      var effectCleanupFns = [];
      var isDestroyed = false;
      var instance = {
        state: state,
        setOptions: function setOptions(options) {
          cleanupModifierEffects();
          state.options = Object.assign({}, defaultOptions, state.options, options);
          state.scrollParents = {
            reference: isElement(reference) ? listScrollParents(reference) : reference.contextElement ? listScrollParents(reference.contextElement) : [],
            popper: listScrollParents(popper)
          }; // Orders the modifiers based on their dependencies and `phase`
          // properties

          var orderedModifiers = orderModifiers(mergeByName([].concat(defaultModifiers, state.options.modifiers))); // Strip out disabled modifiers

          state.orderedModifiers = orderedModifiers.filter(function (m) {
            return m.enabled;
          }); // Validate the provided modifiers so that the consumer will get warned

          runModifierEffects();
          return instance.update();
        },
        // Sync update – it will always be executed, even if not necessary. This
        // is useful for low frequency updates where sync behavior simplifies the
        // logic.
        // For high frequency updates (e.g. `resize` and `scroll` events), always
        // prefer the async Popper#update method
        forceUpdate: function forceUpdate() {
          if (isDestroyed) {
            return;
          }

          var _state$elements = state.elements,
              reference = _state$elements.reference,
              popper = _state$elements.popper; // Don't proceed if `reference` or `popper` are not valid elements
          // anymore

          if (!areValidElements(reference, popper)) {

            return;
          } // Store the reference and popper rects to be read by modifiers


          state.rects = {
            reference: getCompositeRect(reference, getOffsetParent(popper), state.options.strategy === 'fixed'),
            popper: getLayoutRect(popper)
          }; // Modifiers have the ability to reset the current update cycle. The
          // most common use case for this is the `flip` modifier changing the
          // placement, which then needs to re-run all the modifiers, because the
          // logic was previously ran for the previous placement and is therefore
          // stale/incorrect

          state.reset = false;
          state.placement = state.options.placement; // On each update cycle, the `modifiersData` property for each modifier
          // is filled with the initial data specified by the modifier. This means
          // it doesn't persist and is fresh on each update.
          // To ensure persistent data, use `${name}#persistent`

          state.orderedModifiers.forEach(function (modifier) {
            return state.modifiersData[modifier.name] = Object.assign({}, modifier.data);
          });

          for (var index = 0; index < state.orderedModifiers.length; index++) {

            if (state.reset === true) {
              state.reset = false;
              index = -1;
              continue;
            }

            var _state$orderedModifie = state.orderedModifiers[index],
                fn = _state$orderedModifie.fn,
                _state$orderedModifie2 = _state$orderedModifie.options,
                _options = _state$orderedModifie2 === void 0 ? {} : _state$orderedModifie2,
                name = _state$orderedModifie.name;

            if (typeof fn === 'function') {
              state = fn({
                state: state,
                options: _options,
                name: name,
                instance: instance
              }) || state;
            }
          }
        },
        // Async and optimistically optimized update – it will not be executed if
        // not necessary (debounced to run at most once-per-tick)
        update: debounce(function () {
          return new Promise(function (resolve) {
            instance.forceUpdate();
            resolve(state);
          });
        }),
        destroy: function destroy() {
          cleanupModifierEffects();
          isDestroyed = true;
        }
      };

      if (!areValidElements(reference, popper)) {

        return instance;
      }

      instance.setOptions(options).then(function (state) {
        if (!isDestroyed && options.onFirstUpdate) {
          options.onFirstUpdate(state);
        }
      }); // Modifiers have the ability to execute arbitrary code before the first
      // update cycle runs. They will be executed in the same order as the update
      // cycle. This is useful when a modifier adds some persistent data that
      // other modifiers need to use, but the modifier is run after the dependent
      // one.

      function runModifierEffects() {
        state.orderedModifiers.forEach(function (_ref3) {
          var name = _ref3.name,
              _ref3$options = _ref3.options,
              options = _ref3$options === void 0 ? {} : _ref3$options,
              effect = _ref3.effect;

          if (typeof effect === 'function') {
            var cleanupFn = effect({
              state: state,
              name: name,
              instance: instance,
              options: options
            });

            var noopFn = function noopFn() {};

            effectCleanupFns.push(cleanupFn || noopFn);
          }
        });
      }

      function cleanupModifierEffects() {
        effectCleanupFns.forEach(function (fn) {
          return fn();
        });
        effectCleanupFns = [];
      }

      return instance;
    };
  }
  var createPopper$2 = /*#__PURE__*/popperGenerator(); // eslint-disable-next-line import/no-unused-modules

  var defaultModifiers$1 = [eventListeners, popperOffsets$1, computeStyles$1, applyStyles$1];
  var createPopper$1 = /*#__PURE__*/popperGenerator({
    defaultModifiers: defaultModifiers$1
  }); // eslint-disable-next-line import/no-unused-modules

  var defaultModifiers = [eventListeners, popperOffsets$1, computeStyles$1, applyStyles$1, offset$1, flip$1, preventOverflow$1, arrow$1, hide$2];
  var createPopper = /*#__PURE__*/popperGenerator({
    defaultModifiers: defaultModifiers
  }); // eslint-disable-next-line import/no-unused-modules

  var Popper = /*#__PURE__*/Object.freeze({
    __proto__: null,
    popperGenerator: popperGenerator,
    detectOverflow: detectOverflow,
    createPopperBase: createPopper$2,
    createPopper: createPopper,
    createPopperLite: createPopper$1,
    top: top,
    bottom: bottom,
    right: right,
    left: left,
    auto: auto,
    basePlacements: basePlacements,
    start: start,
    end: end,
    clippingParents: clippingParents,
    viewport: viewport,
    popper: popper,
    reference: reference,
    variationPlacements: variationPlacements,
    placements: placements,
    beforeRead: beforeRead,
    read: read,
    afterRead: afterRead,
    beforeMain: beforeMain,
    main: main,
    afterMain: afterMain,
    beforeWrite: beforeWrite,
    write: write,
    afterWrite: afterWrite,
    modifierPhases: modifierPhases,
    applyStyles: applyStyles$1,
    arrow: arrow$1,
    computeStyles: computeStyles$1,
    eventListeners: eventListeners,
    flip: flip$1,
    hide: hide$2,
    offset: offset$1,
    popperOffsets: popperOffsets$1,
    preventOverflow: preventOverflow$1
  });

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.0.1): dropdown.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME$8 = 'dropdown';
  const DATA_KEY$7 = 'bs.dropdown';
  const EVENT_KEY$7 = `.${DATA_KEY$7}`;
  const DATA_API_KEY$4 = '.data-api';
  const ESCAPE_KEY$2 = 'Escape';
  const SPACE_KEY = 'Space';
  const TAB_KEY = 'Tab';
  const ARROW_UP_KEY = 'ArrowUp';
  const ARROW_DOWN_KEY = 'ArrowDown';
  const RIGHT_MOUSE_BUTTON = 2; // MouseEvent.button value for the secondary button, usually the right button

  const REGEXP_KEYDOWN = new RegExp(`${ARROW_UP_KEY}|${ARROW_DOWN_KEY}|${ESCAPE_KEY$2}`);
  const EVENT_HIDE$4 = `hide${EVENT_KEY$7}`;
  const EVENT_HIDDEN$4 = `hidden${EVENT_KEY$7}`;
  const EVENT_SHOW$4 = `show${EVENT_KEY$7}`;
  const EVENT_SHOWN$4 = `shown${EVENT_KEY$7}`;
  const EVENT_CLICK = `click${EVENT_KEY$7}`;
  const EVENT_CLICK_DATA_API$3 = `click${EVENT_KEY$7}${DATA_API_KEY$4}`;
  const EVENT_KEYDOWN_DATA_API = `keydown${EVENT_KEY$7}${DATA_API_KEY$4}`;
  const EVENT_KEYUP_DATA_API = `keyup${EVENT_KEY$7}${DATA_API_KEY$4}`;
  const CLASS_NAME_SHOW$7 = 'show';
  const CLASS_NAME_DROPUP = 'dropup';
  const CLASS_NAME_DROPEND = 'dropend';
  const CLASS_NAME_DROPSTART = 'dropstart';
  const CLASS_NAME_NAVBAR = 'navbar';
  const SELECTOR_DATA_TOGGLE$3 = '[data-bs-toggle="dropdown"]';
  const SELECTOR_MENU = '.dropdown-menu';
  const SELECTOR_NAVBAR_NAV = '.navbar-nav';
  const SELECTOR_VISIBLE_ITEMS = '.dropdown-menu .dropdown-item:not(.disabled):not(:disabled)';
  const PLACEMENT_TOP = isRTL() ? 'top-end' : 'top-start';
  const PLACEMENT_TOPEND = isRTL() ? 'top-start' : 'top-end';
  const PLACEMENT_BOTTOM = isRTL() ? 'bottom-end' : 'bottom-start';
  const PLACEMENT_BOTTOMEND = isRTL() ? 'bottom-start' : 'bottom-end';
  const PLACEMENT_RIGHT = isRTL() ? 'left-start' : 'right-start';
  const PLACEMENT_LEFT = isRTL() ? 'right-start' : 'left-start';
  const Default$7 = {
    offset: [0, 2],
    boundary: 'clippingParents',
    reference: 'toggle',
    display: 'dynamic',
    popperConfig: null,
    autoClose: true
  };
  const DefaultType$7 = {
    offset: '(array|string|function)',
    boundary: '(string|element)',
    reference: '(string|element|object)',
    display: 'string',
    popperConfig: '(null|object|function)',
    autoClose: '(boolean|string)'
  };
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Dropdown extends BaseComponent {
    constructor(element, config) {
      super(element);
      this._popper = null;
      this._config = this._getConfig(config);
      this._menu = this._getMenuElement();
      this._inNavbar = this._detectNavbar();

      this._addEventListeners();
    } // Getters


    static get Default() {
      return Default$7;
    }

    static get DefaultType() {
      return DefaultType$7;
    }

    static get NAME() {
      return NAME$8;
    } // Public


    toggle() {
      if (isDisabled(this._element)) {
        return;
      }

      const isActive = this._element.classList.contains(CLASS_NAME_SHOW$7);

      if (isActive) {
        this.hide();
        return;
      }

      this.show();
    }

    show() {
      if (isDisabled(this._element) || this._menu.classList.contains(CLASS_NAME_SHOW$7)) {
        return;
      }

      const parent = Dropdown.getParentFromElement(this._element);
      const relatedTarget = {
        relatedTarget: this._element
      };
      const showEvent = EventHandler.trigger(this._element, EVENT_SHOW$4, relatedTarget);

      if (showEvent.defaultPrevented) {
        return;
      } // Totally disable Popper for Dropdowns in Navbar


      if (this._inNavbar) {
        Manipulator.setDataAttribute(this._menu, 'popper', 'none');
      } else {
        if (typeof Popper === 'undefined') {
          throw new TypeError('Bootstrap\'s dropdowns require Popper (https://popper.js.org)');
        }

        let referenceElement = this._element;

        if (this._config.reference === 'parent') {
          referenceElement = parent;
        } else if (isElement$1(this._config.reference)) {
          referenceElement = getElement(this._config.reference);
        } else if (typeof this._config.reference === 'object') {
          referenceElement = this._config.reference;
        }

        const popperConfig = this._getPopperConfig();

        const isDisplayStatic = popperConfig.modifiers.find(modifier => modifier.name === 'applyStyles' && modifier.enabled === false);
        this._popper = createPopper(referenceElement, this._menu, popperConfig);

        if (isDisplayStatic) {
          Manipulator.setDataAttribute(this._menu, 'popper', 'static');
        }
      } // If this is a touch-enabled device we add extra
      // empty mouseover listeners to the body's immediate children;
      // only needed because of broken event delegation on iOS
      // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html


      if ('ontouchstart' in document.documentElement && !parent.closest(SELECTOR_NAVBAR_NAV)) {
        [].concat(...document.body.children).forEach(elem => EventHandler.on(elem, 'mouseover', noop));
      }

      this._element.focus();

      this._element.setAttribute('aria-expanded', true);

      this._menu.classList.toggle(CLASS_NAME_SHOW$7);

      this._element.classList.toggle(CLASS_NAME_SHOW$7);

      EventHandler.trigger(this._element, EVENT_SHOWN$4, relatedTarget);
    }

    hide() {
      if (isDisabled(this._element) || !this._menu.classList.contains(CLASS_NAME_SHOW$7)) {
        return;
      }

      const relatedTarget = {
        relatedTarget: this._element
      };

      this._completeHide(relatedTarget);
    }

    dispose() {
      if (this._popper) {
        this._popper.destroy();
      }

      super.dispose();
    }

    update() {
      this._inNavbar = this._detectNavbar();

      if (this._popper) {
        this._popper.update();
      }
    } // Private


    _addEventListeners() {
      EventHandler.on(this._element, EVENT_CLICK, event => {
        event.preventDefault();
        this.toggle();
      });
    }

    _completeHide(relatedTarget) {
      const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE$4, relatedTarget);

      if (hideEvent.defaultPrevented) {
        return;
      } // If this is a touch-enabled device we remove the extra
      // empty mouseover listeners we added for iOS support


      if ('ontouchstart' in document.documentElement) {
        [].concat(...document.body.children).forEach(elem => EventHandler.off(elem, 'mouseover', noop));
      }

      if (this._popper) {
        this._popper.destroy();
      }

      this._menu.classList.remove(CLASS_NAME_SHOW$7);

      this._element.classList.remove(CLASS_NAME_SHOW$7);

      this._element.setAttribute('aria-expanded', 'false');

      Manipulator.removeDataAttribute(this._menu, 'popper');
      EventHandler.trigger(this._element, EVENT_HIDDEN$4, relatedTarget);
    }

    _getConfig(config) {
      config = { ...this.constructor.Default,
        ...Manipulator.getDataAttributes(this._element),
        ...config
      };
      typeCheckConfig(NAME$8, config, this.constructor.DefaultType);

      if (typeof config.reference === 'object' && !isElement$1(config.reference) && typeof config.reference.getBoundingClientRect !== 'function') {
        // Popper virtual elements require a getBoundingClientRect method
        throw new TypeError(`${NAME$8.toUpperCase()}: Option "reference" provided type "object" without a required "getBoundingClientRect" method.`);
      }

      return config;
    }

    _getMenuElement() {
      return SelectorEngine.next(this._element, SELECTOR_MENU)[0];
    }

    _getPlacement() {
      const parentDropdown = this._element.parentNode;

      if (parentDropdown.classList.contains(CLASS_NAME_DROPEND)) {
        return PLACEMENT_RIGHT;
      }

      if (parentDropdown.classList.contains(CLASS_NAME_DROPSTART)) {
        return PLACEMENT_LEFT;
      } // We need to trim the value because custom properties can also include spaces


      const isEnd = getComputedStyle(this._menu).getPropertyValue('--bs-position').trim() === 'end';

      if (parentDropdown.classList.contains(CLASS_NAME_DROPUP)) {
        return isEnd ? PLACEMENT_TOPEND : PLACEMENT_TOP;
      }

      return isEnd ? PLACEMENT_BOTTOMEND : PLACEMENT_BOTTOM;
    }

    _detectNavbar() {
      return this._element.closest(`.${CLASS_NAME_NAVBAR}`) !== null;
    }

    _getOffset() {
      const {
        offset
      } = this._config;

      if (typeof offset === 'string') {
        return offset.split(',').map(val => Number.parseInt(val, 10));
      }

      if (typeof offset === 'function') {
        return popperData => offset(popperData, this._element);
      }

      return offset;
    }

    _getPopperConfig() {
      const defaultBsPopperConfig = {
        placement: this._getPlacement(),
        modifiers: [{
          name: 'preventOverflow',
          options: {
            boundary: this._config.boundary
          }
        }, {
          name: 'offset',
          options: {
            offset: this._getOffset()
          }
        }]
      }; // Disable Popper if we have a static display

      if (this._config.display === 'static') {
        defaultBsPopperConfig.modifiers = [{
          name: 'applyStyles',
          enabled: false
        }];
      }

      return { ...defaultBsPopperConfig,
        ...(typeof this._config.popperConfig === 'function' ? this._config.popperConfig(defaultBsPopperConfig) : this._config.popperConfig)
      };
    }

    _selectMenuItem(event) {
      const items = SelectorEngine.find(SELECTOR_VISIBLE_ITEMS, this._menu).filter(isVisible);

      if (!items.length) {
        return;
      }

      let index = items.indexOf(event.target); // Up

      if (event.key === ARROW_UP_KEY && index > 0) {
        index--;
      } // Down


      if (event.key === ARROW_DOWN_KEY && index < items.length - 1) {
        index++;
      } // index is -1 if the first keydown is an ArrowUp


      index = index === -1 ? 0 : index;
      items[index].focus();
    } // Static


    static dropdownInterface(element, config) {
      let data = Data.get(element, DATA_KEY$7);

      const _config = typeof config === 'object' ? config : null;

      if (!data) {
        data = new Dropdown(element, _config);
      }

      if (typeof config === 'string') {
        if (typeof data[config] === 'undefined') {
          throw new TypeError(`No method named "${config}"`);
        }

        data[config]();
      }
    }

    static jQueryInterface(config) {
      return this.each(function () {
        Dropdown.dropdownInterface(this, config);
      });
    }

    static clearMenus(event) {
      if (event && (event.button === RIGHT_MOUSE_BUTTON || event.type === 'keyup' && event.key !== TAB_KEY)) {
        return;
      }

      const toggles = SelectorEngine.find(SELECTOR_DATA_TOGGLE$3);

      for (let i = 0, len = toggles.length; i < len; i++) {
        const context = Data.get(toggles[i], DATA_KEY$7);

        if (!context || context._config.autoClose === false) {
          continue;
        }

        if (!context._element.classList.contains(CLASS_NAME_SHOW$7)) {
          continue;
        }

        const relatedTarget = {
          relatedTarget: context._element
        };

        if (event) {
          const composedPath = event.composedPath();
          const isMenuTarget = composedPath.includes(context._menu);

          if (composedPath.includes(context._element) || context._config.autoClose === 'inside' && !isMenuTarget || context._config.autoClose === 'outside' && isMenuTarget) {
            continue;
          } // Tab navigation through the dropdown menu or events from contained inputs shouldn't close the menu


          if (context._menu.contains(event.target) && (event.type === 'keyup' && event.key === TAB_KEY || /input|select|option|textarea|form/i.test(event.target.tagName))) {
            continue;
          }

          if (event.type === 'click') {
            relatedTarget.clickEvent = event;
          }
        }

        context._completeHide(relatedTarget);
      }
    }

    static getParentFromElement(element) {
      return getElementFromSelector(element) || element.parentNode;
    }

    static dataApiKeydownHandler(event) {
      // If not input/textarea:
      //  - And not a key in REGEXP_KEYDOWN => not a dropdown command
      // If input/textarea:
      //  - If space key => not a dropdown command
      //  - If key is other than escape
      //    - If key is not up or down => not a dropdown command
      //    - If trigger inside the menu => not a dropdown command
      if (/input|textarea/i.test(event.target.tagName) ? event.key === SPACE_KEY || event.key !== ESCAPE_KEY$2 && (event.key !== ARROW_DOWN_KEY && event.key !== ARROW_UP_KEY || event.target.closest(SELECTOR_MENU)) : !REGEXP_KEYDOWN.test(event.key)) {
        return;
      }

      const isActive = this.classList.contains(CLASS_NAME_SHOW$7);

      if (!isActive && event.key === ESCAPE_KEY$2) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      if (isDisabled(this)) {
        return;
      }

      const getToggleButton = () => this.matches(SELECTOR_DATA_TOGGLE$3) ? this : SelectorEngine.prev(this, SELECTOR_DATA_TOGGLE$3)[0];

      if (event.key === ESCAPE_KEY$2) {
        getToggleButton().focus();
        Dropdown.clearMenus();
        return;
      }

      if (!isActive && (event.key === ARROW_UP_KEY || event.key === ARROW_DOWN_KEY)) {
        getToggleButton().click();
        return;
      }

      if (!isActive || event.key === SPACE_KEY) {
        Dropdown.clearMenus();
        return;
      }

      Dropdown.getInstance(getToggleButton())._selectMenuItem(event);
    }

  }
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  EventHandler.on(document, EVENT_KEYDOWN_DATA_API, SELECTOR_DATA_TOGGLE$3, Dropdown.dataApiKeydownHandler);
  EventHandler.on(document, EVENT_KEYDOWN_DATA_API, SELECTOR_MENU, Dropdown.dataApiKeydownHandler);
  EventHandler.on(document, EVENT_CLICK_DATA_API$3, Dropdown.clearMenus);
  EventHandler.on(document, EVENT_KEYUP_DATA_API, Dropdown.clearMenus);
  EventHandler.on(document, EVENT_CLICK_DATA_API$3, SELECTOR_DATA_TOGGLE$3, function (event) {
    event.preventDefault();
    Dropdown.dropdownInterface(this);
  });
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   * add .Dropdown to jQuery only if jQuery is present
   */

  defineJQueryPlugin(Dropdown);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.0.1): util/scrollBar.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  const SELECTOR_FIXED_CONTENT = '.fixed-top, .fixed-bottom, .is-fixed, .sticky-top';
  const SELECTOR_STICKY_CONTENT = '.sticky-top';

  const getWidth = () => {
    // https://developer.mozilla.org/en-US/docs/Web/API/Window/innerWidth#usage_notes
    const documentWidth = document.documentElement.clientWidth;
    return Math.abs(window.innerWidth - documentWidth);
  };

  const hide = (width = getWidth()) => {
    _disableOverFlow(); // give padding to element to balances the hidden scrollbar width


    _setElementAttributes('body', 'paddingRight', calculatedValue => calculatedValue + width); // trick: We adjust positive paddingRight and negative marginRight to sticky-top elements, to keep shown fullwidth


    _setElementAttributes(SELECTOR_FIXED_CONTENT, 'paddingRight', calculatedValue => calculatedValue + width);

    _setElementAttributes(SELECTOR_STICKY_CONTENT, 'marginRight', calculatedValue => calculatedValue - width);
  };

  const _disableOverFlow = () => {
    const actualValue = document.body.style.overflow;

    if (actualValue) {
      Manipulator.setDataAttribute(document.body, 'overflow', actualValue);
    }

    document.body.style.overflow = 'hidden';
  };

  const _setElementAttributes = (selector, styleProp, callback) => {
    const scrollbarWidth = getWidth();
    SelectorEngine.find(selector).forEach(element => {
      if (element !== document.body && window.innerWidth > element.clientWidth + scrollbarWidth) {
        return;
      }

      const actualValue = element.style[styleProp];
      const calculatedValue = window.getComputedStyle(element)[styleProp];
      Manipulator.setDataAttribute(element, styleProp, actualValue);
      element.style[styleProp] = `${callback(Number.parseFloat(calculatedValue))}px`;
    });
  };

  const reset = () => {
    _resetElementAttributes('body', 'overflow');

    _resetElementAttributes('body', 'paddingRight');

    _resetElementAttributes(SELECTOR_FIXED_CONTENT, 'paddingRight');

    _resetElementAttributes(SELECTOR_STICKY_CONTENT, 'marginRight');
  };

  const _resetElementAttributes = (selector, styleProp) => {
    SelectorEngine.find(selector).forEach(element => {
      const value = Manipulator.getDataAttribute(element, styleProp);

      if (typeof value === 'undefined') {
        element.style.removeProperty(styleProp);
      } else {
        Manipulator.removeDataAttribute(element, styleProp);
        element.style[styleProp] = value;
      }
    });
  };

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.0.1): util/backdrop.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
   * --------------------------------------------------------------------------
   */
  const Default$6 = {
    isVisible: true,
    // if false, we use the backdrop helper without adding any element to the dom
    isAnimated: false,
    rootElement: document.body,
    // give the choice to place backdrop under different elements
    clickCallback: null
  };
  const DefaultType$6 = {
    isVisible: 'boolean',
    isAnimated: 'boolean',
    rootElement: 'element',
    clickCallback: '(function|null)'
  };
  const NAME$7 = 'backdrop';
  const CLASS_NAME_BACKDROP = 'modal-backdrop';
  const CLASS_NAME_FADE$5 = 'fade';
  const CLASS_NAME_SHOW$6 = 'show';
  const EVENT_MOUSEDOWN = `mousedown.bs.${NAME$7}`;

  class Backdrop {
    constructor(config) {
      this._config = this._getConfig(config);
      this._isAppended = false;
      this._element = null;
    }

    show(callback) {
      if (!this._config.isVisible) {
        execute(callback);
        return;
      }

      this._append();

      if (this._config.isAnimated) {
        reflow(this._getElement());
      }

      this._getElement().classList.add(CLASS_NAME_SHOW$6);

      this._emulateAnimation(() => {
        execute(callback);
      });
    }

    hide(callback) {
      if (!this._config.isVisible) {
        execute(callback);
        return;
      }

      this._getElement().classList.remove(CLASS_NAME_SHOW$6);

      this._emulateAnimation(() => {
        this.dispose();
        execute(callback);
      });
    } // Private


    _getElement() {
      if (!this._element) {
        const backdrop = document.createElement('div');
        backdrop.className = CLASS_NAME_BACKDROP;

        if (this._config.isAnimated) {
          backdrop.classList.add(CLASS_NAME_FADE$5);
        }

        this._element = backdrop;
      }

      return this._element;
    }

    _getConfig(config) {
      config = { ...Default$6,
        ...(typeof config === 'object' ? config : {})
      };
      config.rootElement = config.rootElement || document.body;
      typeCheckConfig(NAME$7, config, DefaultType$6);
      return config;
    }

    _append() {
      if (this._isAppended) {
        return;
      }

      this._config.rootElement.appendChild(this._getElement());

      EventHandler.on(this._getElement(), EVENT_MOUSEDOWN, () => {
        execute(this._config.clickCallback);
      });
      this._isAppended = true;
    }

    dispose() {
      if (!this._isAppended) {
        return;
      }

      EventHandler.off(this._element, EVENT_MOUSEDOWN);

      this._getElement().parentNode.removeChild(this._element);

      this._isAppended = false;
    }

    _emulateAnimation(callback) {
      if (!this._config.isAnimated) {
        execute(callback);
        return;
      }

      const backdropTransitionDuration = getTransitionDurationFromElement(this._getElement());
      EventHandler.one(this._getElement(), 'transitionend', () => execute(callback));
      emulateTransitionEnd(this._getElement(), backdropTransitionDuration);
    }

  }

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.0.1): modal.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME$6 = 'modal';
  const DATA_KEY$6 = 'bs.modal';
  const EVENT_KEY$6 = `.${DATA_KEY$6}`;
  const DATA_API_KEY$3 = '.data-api';
  const ESCAPE_KEY$1 = 'Escape';
  const Default$5 = {
    backdrop: true,
    keyboard: true,
    focus: true
  };
  const DefaultType$5 = {
    backdrop: '(boolean|string)',
    keyboard: 'boolean',
    focus: 'boolean'
  };
  const EVENT_HIDE$3 = `hide${EVENT_KEY$6}`;
  const EVENT_HIDE_PREVENTED = `hidePrevented${EVENT_KEY$6}`;
  const EVENT_HIDDEN$3 = `hidden${EVENT_KEY$6}`;
  const EVENT_SHOW$3 = `show${EVENT_KEY$6}`;
  const EVENT_SHOWN$3 = `shown${EVENT_KEY$6}`;
  const EVENT_FOCUSIN$2 = `focusin${EVENT_KEY$6}`;
  const EVENT_RESIZE = `resize${EVENT_KEY$6}`;
  const EVENT_CLICK_DISMISS$2 = `click.dismiss${EVENT_KEY$6}`;
  const EVENT_KEYDOWN_DISMISS$1 = `keydown.dismiss${EVENT_KEY$6}`;
  const EVENT_MOUSEUP_DISMISS = `mouseup.dismiss${EVENT_KEY$6}`;
  const EVENT_MOUSEDOWN_DISMISS = `mousedown.dismiss${EVENT_KEY$6}`;
  const EVENT_CLICK_DATA_API$2 = `click${EVENT_KEY$6}${DATA_API_KEY$3}`;
  const CLASS_NAME_OPEN = 'modal-open';
  const CLASS_NAME_FADE$4 = 'fade';
  const CLASS_NAME_SHOW$5 = 'show';
  const CLASS_NAME_STATIC = 'modal-static';
  const SELECTOR_DIALOG = '.modal-dialog';
  const SELECTOR_MODAL_BODY = '.modal-body';
  const SELECTOR_DATA_TOGGLE$2 = '[data-bs-toggle="modal"]';
  const SELECTOR_DATA_DISMISS$2 = '[data-bs-dismiss="modal"]';
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Modal extends BaseComponent {
    constructor(element, config) {
      super(element);
      this._config = this._getConfig(config);
      this._dialog = SelectorEngine.findOne(SELECTOR_DIALOG, this._element);
      this._backdrop = this._initializeBackDrop();
      this._isShown = false;
      this._ignoreBackdropClick = false;
      this._isTransitioning = false;
    } // Getters


    static get Default() {
      return Default$5;
    }

    static get NAME() {
      return NAME$6;
    } // Public


    toggle(relatedTarget) {
      return this._isShown ? this.hide() : this.show(relatedTarget);
    }

    show(relatedTarget) {
      if (this._isShown || this._isTransitioning) {
        return;
      }

      if (this._isAnimated()) {
        this._isTransitioning = true;
      }

      const showEvent = EventHandler.trigger(this._element, EVENT_SHOW$3, {
        relatedTarget
      });

      if (this._isShown || showEvent.defaultPrevented) {
        return;
      }

      this._isShown = true;
      hide();
      document.body.classList.add(CLASS_NAME_OPEN);

      this._adjustDialog();

      this._setEscapeEvent();

      this._setResizeEvent();

      EventHandler.on(this._element, EVENT_CLICK_DISMISS$2, SELECTOR_DATA_DISMISS$2, event => this.hide(event));
      EventHandler.on(this._dialog, EVENT_MOUSEDOWN_DISMISS, () => {
        EventHandler.one(this._element, EVENT_MOUSEUP_DISMISS, event => {
          if (event.target === this._element) {
            this._ignoreBackdropClick = true;
          }
        });
      });

      this._showBackdrop(() => this._showElement(relatedTarget));
    }

    hide(event) {
      if (event) {
        event.preventDefault();
      }

      if (!this._isShown || this._isTransitioning) {
        return;
      }

      const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE$3);

      if (hideEvent.defaultPrevented) {
        return;
      }

      this._isShown = false;

      const isAnimated = this._isAnimated();

      if (isAnimated) {
        this._isTransitioning = true;
      }

      this._setEscapeEvent();

      this._setResizeEvent();

      EventHandler.off(document, EVENT_FOCUSIN$2);

      this._element.classList.remove(CLASS_NAME_SHOW$5);

      EventHandler.off(this._element, EVENT_CLICK_DISMISS$2);
      EventHandler.off(this._dialog, EVENT_MOUSEDOWN_DISMISS);

      this._queueCallback(() => this._hideModal(), this._element, isAnimated);
    }

    dispose() {
      [window, this._dialog].forEach(htmlElement => EventHandler.off(htmlElement, EVENT_KEY$6));

      this._backdrop.dispose();

      super.dispose();
      /**
       * `document` has 2 events `EVENT_FOCUSIN` and `EVENT_CLICK_DATA_API`
       * Do not move `document` in `htmlElements` array
       * It will remove `EVENT_CLICK_DATA_API` event that should remain
       */

      EventHandler.off(document, EVENT_FOCUSIN$2);
    }

    handleUpdate() {
      this._adjustDialog();
    } // Private


    _initializeBackDrop() {
      return new Backdrop({
        isVisible: Boolean(this._config.backdrop),
        // 'static' option will be translated to true, and booleans will keep their value
        isAnimated: this._isAnimated()
      });
    }

    _getConfig(config) {
      config = { ...Default$5,
        ...Manipulator.getDataAttributes(this._element),
        ...config
      };
      typeCheckConfig(NAME$6, config, DefaultType$5);
      return config;
    }

    _showElement(relatedTarget) {
      const isAnimated = this._isAnimated();

      const modalBody = SelectorEngine.findOne(SELECTOR_MODAL_BODY, this._dialog);

      if (!this._element.parentNode || this._element.parentNode.nodeType !== Node.ELEMENT_NODE) {
        // Don't move modal's DOM position
        document.body.appendChild(this._element);
      }

      this._element.style.display = 'block';

      this._element.removeAttribute('aria-hidden');

      this._element.setAttribute('aria-modal', true);

      this._element.setAttribute('role', 'dialog');

      this._element.scrollTop = 0;

      if (modalBody) {
        modalBody.scrollTop = 0;
      }

      if (isAnimated) {
        reflow(this._element);
      }

      this._element.classList.add(CLASS_NAME_SHOW$5);

      if (this._config.focus) {
        this._enforceFocus();
      }

      const transitionComplete = () => {
        if (this._config.focus) {
          this._element.focus();
        }

        this._isTransitioning = false;
        EventHandler.trigger(this._element, EVENT_SHOWN$3, {
          relatedTarget
        });
      };

      this._queueCallback(transitionComplete, this._dialog, isAnimated);
    }

    _enforceFocus() {
      EventHandler.off(document, EVENT_FOCUSIN$2); // guard against infinite focus loop

      EventHandler.on(document, EVENT_FOCUSIN$2, event => {
        if (document !== event.target && this._element !== event.target && !this._element.contains(event.target)) {
          this._element.focus();
        }
      });
    }

    _setEscapeEvent() {
      if (this._isShown) {
        EventHandler.on(this._element, EVENT_KEYDOWN_DISMISS$1, event => {
          if (this._config.keyboard && event.key === ESCAPE_KEY$1) {
            event.preventDefault();
            this.hide();
          } else if (!this._config.keyboard && event.key === ESCAPE_KEY$1) {
            this._triggerBackdropTransition();
          }
        });
      } else {
        EventHandler.off(this._element, EVENT_KEYDOWN_DISMISS$1);
      }
    }

    _setResizeEvent() {
      if (this._isShown) {
        EventHandler.on(window, EVENT_RESIZE, () => this._adjustDialog());
      } else {
        EventHandler.off(window, EVENT_RESIZE);
      }
    }

    _hideModal() {
      this._element.style.display = 'none';

      this._element.setAttribute('aria-hidden', true);

      this._element.removeAttribute('aria-modal');

      this._element.removeAttribute('role');

      this._isTransitioning = false;

      this._backdrop.hide(() => {
        document.body.classList.remove(CLASS_NAME_OPEN);

        this._resetAdjustments();

        reset();
        EventHandler.trigger(this._element, EVENT_HIDDEN$3);
      });
    }

    _showBackdrop(callback) {
      EventHandler.on(this._element, EVENT_CLICK_DISMISS$2, event => {
        if (this._ignoreBackdropClick) {
          this._ignoreBackdropClick = false;
          return;
        }

        if (event.target !== event.currentTarget) {
          return;
        }

        if (this._config.backdrop === true) {
          this.hide();
        } else if (this._config.backdrop === 'static') {
          this._triggerBackdropTransition();
        }
      });

      this._backdrop.show(callback);
    }

    _isAnimated() {
      return this._element.classList.contains(CLASS_NAME_FADE$4);
    }

    _triggerBackdropTransition() {
      const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE_PREVENTED);

      if (hideEvent.defaultPrevented) {
        return;
      }

      const isModalOverflowing = this._element.scrollHeight > document.documentElement.clientHeight;

      if (!isModalOverflowing) {
        this._element.style.overflowY = 'hidden';
      }

      this._element.classList.add(CLASS_NAME_STATIC);

      const modalTransitionDuration = getTransitionDurationFromElement(this._dialog);
      EventHandler.off(this._element, 'transitionend');
      EventHandler.one(this._element, 'transitionend', () => {
        this._element.classList.remove(CLASS_NAME_STATIC);

        if (!isModalOverflowing) {
          EventHandler.one(this._element, 'transitionend', () => {
            this._element.style.overflowY = '';
          });
          emulateTransitionEnd(this._element, modalTransitionDuration);
        }
      });
      emulateTransitionEnd(this._element, modalTransitionDuration);

      this._element.focus();
    } // ----------------------------------------------------------------------
    // the following methods are used to handle overflowing modals
    // ----------------------------------------------------------------------


    _adjustDialog() {
      const isModalOverflowing = this._element.scrollHeight > document.documentElement.clientHeight;
      const scrollbarWidth = getWidth();
      const isBodyOverflowing = scrollbarWidth > 0;

      if (!isBodyOverflowing && isModalOverflowing && !isRTL() || isBodyOverflowing && !isModalOverflowing && isRTL()) {
        this._element.style.paddingLeft = `${scrollbarWidth}px`;
      }

      if (isBodyOverflowing && !isModalOverflowing && !isRTL() || !isBodyOverflowing && isModalOverflowing && isRTL()) {
        this._element.style.paddingRight = `${scrollbarWidth}px`;
      }
    }

    _resetAdjustments() {
      this._element.style.paddingLeft = '';
      this._element.style.paddingRight = '';
    } // Static


    static jQueryInterface(config, relatedTarget) {
      return this.each(function () {
        const data = Modal.getInstance(this) || new Modal(this, typeof config === 'object' ? config : {});

        if (typeof config !== 'string') {
          return;
        }

        if (typeof data[config] === 'undefined') {
          throw new TypeError(`No method named "${config}"`);
        }

        data[config](relatedTarget);
      });
    }

  }
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  EventHandler.on(document, EVENT_CLICK_DATA_API$2, SELECTOR_DATA_TOGGLE$2, function (event) {
    const target = getElementFromSelector(this);

    if (['A', 'AREA'].includes(this.tagName)) {
      event.preventDefault();
    }

    EventHandler.one(target, EVENT_SHOW$3, showEvent => {
      if (showEvent.defaultPrevented) {
        // only register focus restorer if modal will actually get shown
        return;
      }

      EventHandler.one(target, EVENT_HIDDEN$3, () => {
        if (isVisible(this)) {
          this.focus();
        }
      });
    });
    const data = Modal.getInstance(target) || new Modal(target);
    data.toggle(this);
  });
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   * add .Modal to jQuery only if jQuery is present
   */

  defineJQueryPlugin(Modal);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.0.1): offcanvas.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
   * --------------------------------------------------------------------------
   */
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME$5 = 'offcanvas';
  const DATA_KEY$5 = 'bs.offcanvas';
  const EVENT_KEY$5 = `.${DATA_KEY$5}`;
  const DATA_API_KEY$2 = '.data-api';
  const EVENT_LOAD_DATA_API$1 = `load${EVENT_KEY$5}${DATA_API_KEY$2}`;
  const ESCAPE_KEY = 'Escape';
  const Default$4 = {
    backdrop: true,
    keyboard: true,
    scroll: false
  };
  const DefaultType$4 = {
    backdrop: 'boolean',
    keyboard: 'boolean',
    scroll: 'boolean'
  };
  const CLASS_NAME_SHOW$4 = 'show';
  const OPEN_SELECTOR = '.offcanvas.show';
  const EVENT_SHOW$2 = `show${EVENT_KEY$5}`;
  const EVENT_SHOWN$2 = `shown${EVENT_KEY$5}`;
  const EVENT_HIDE$2 = `hide${EVENT_KEY$5}`;
  const EVENT_HIDDEN$2 = `hidden${EVENT_KEY$5}`;
  const EVENT_FOCUSIN$1 = `focusin${EVENT_KEY$5}`;
  const EVENT_CLICK_DATA_API$1 = `click${EVENT_KEY$5}${DATA_API_KEY$2}`;
  const EVENT_CLICK_DISMISS$1 = `click.dismiss${EVENT_KEY$5}`;
  const EVENT_KEYDOWN_DISMISS = `keydown.dismiss${EVENT_KEY$5}`;
  const SELECTOR_DATA_DISMISS$1 = '[data-bs-dismiss="offcanvas"]';
  const SELECTOR_DATA_TOGGLE$1 = '[data-bs-toggle="offcanvas"]';
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Offcanvas extends BaseComponent {
    constructor(element, config) {
      super(element);
      this._config = this._getConfig(config);
      this._isShown = false;
      this._backdrop = this._initializeBackDrop();

      this._addEventListeners();
    } // Getters


    static get NAME() {
      return NAME$5;
    }

    static get Default() {
      return Default$4;
    } // Public


    toggle(relatedTarget) {
      return this._isShown ? this.hide() : this.show(relatedTarget);
    }

    show(relatedTarget) {
      if (this._isShown) {
        return;
      }

      const showEvent = EventHandler.trigger(this._element, EVENT_SHOW$2, {
        relatedTarget
      });

      if (showEvent.defaultPrevented) {
        return;
      }

      this._isShown = true;
      this._element.style.visibility = 'visible';

      this._backdrop.show();

      if (!this._config.scroll) {
        hide();

        this._enforceFocusOnElement(this._element);
      }

      this._element.removeAttribute('aria-hidden');

      this._element.setAttribute('aria-modal', true);

      this._element.setAttribute('role', 'dialog');

      this._element.classList.add(CLASS_NAME_SHOW$4);

      const completeCallBack = () => {
        EventHandler.trigger(this._element, EVENT_SHOWN$2, {
          relatedTarget
        });
      };

      this._queueCallback(completeCallBack, this._element, true);
    }

    hide() {
      if (!this._isShown) {
        return;
      }

      const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE$2);

      if (hideEvent.defaultPrevented) {
        return;
      }

      EventHandler.off(document, EVENT_FOCUSIN$1);

      this._element.blur();

      this._isShown = false;

      this._element.classList.remove(CLASS_NAME_SHOW$4);

      this._backdrop.hide();

      const completeCallback = () => {
        this._element.setAttribute('aria-hidden', true);

        this._element.removeAttribute('aria-modal');

        this._element.removeAttribute('role');

        this._element.style.visibility = 'hidden';

        if (!this._config.scroll) {
          reset();
        }

        EventHandler.trigger(this._element, EVENT_HIDDEN$2);
      };

      this._queueCallback(completeCallback, this._element, true);
    }

    dispose() {
      this._backdrop.dispose();

      super.dispose();
      EventHandler.off(document, EVENT_FOCUSIN$1);
    } // Private


    _getConfig(config) {
      config = { ...Default$4,
        ...Manipulator.getDataAttributes(this._element),
        ...(typeof config === 'object' ? config : {})
      };
      typeCheckConfig(NAME$5, config, DefaultType$4);
      return config;
    }

    _initializeBackDrop() {
      return new Backdrop({
        isVisible: this._config.backdrop,
        isAnimated: true,
        rootElement: this._element.parentNode,
        clickCallback: () => this.hide()
      });
    }

    _enforceFocusOnElement(element) {
      EventHandler.off(document, EVENT_FOCUSIN$1); // guard against infinite focus loop

      EventHandler.on(document, EVENT_FOCUSIN$1, event => {
        if (document !== event.target && element !== event.target && !element.contains(event.target)) {
          element.focus();
        }
      });
      element.focus();
    }

    _addEventListeners() {
      EventHandler.on(this._element, EVENT_CLICK_DISMISS$1, SELECTOR_DATA_DISMISS$1, () => this.hide());
      EventHandler.on(this._element, EVENT_KEYDOWN_DISMISS, event => {
        if (this._config.keyboard && event.key === ESCAPE_KEY) {
          this.hide();
        }
      });
    } // Static


    static jQueryInterface(config) {
      return this.each(function () {
        const data = Data.get(this, DATA_KEY$5) || new Offcanvas(this, typeof config === 'object' ? config : {});

        if (typeof config !== 'string') {
          return;
        }

        if (data[config] === undefined || config.startsWith('_') || config === 'constructor') {
          throw new TypeError(`No method named "${config}"`);
        }

        data[config](this);
      });
    }

  }
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  EventHandler.on(document, EVENT_CLICK_DATA_API$1, SELECTOR_DATA_TOGGLE$1, function (event) {
    const target = getElementFromSelector(this);

    if (['A', 'AREA'].includes(this.tagName)) {
      event.preventDefault();
    }

    if (isDisabled(this)) {
      return;
    }

    EventHandler.one(target, EVENT_HIDDEN$2, () => {
      // focus on trigger when it is closed
      if (isVisible(this)) {
        this.focus();
      }
    }); // avoid conflict when clicking a toggler of an offcanvas, while another is open

    const allReadyOpen = SelectorEngine.findOne(OPEN_SELECTOR);

    if (allReadyOpen && allReadyOpen !== target) {
      Offcanvas.getInstance(allReadyOpen).hide();
    }

    const data = Data.get(target, DATA_KEY$5) || new Offcanvas(target);
    data.toggle(this);
  });
  EventHandler.on(window, EVENT_LOAD_DATA_API$1, () => {
    SelectorEngine.find(OPEN_SELECTOR).forEach(el => (Data.get(el, DATA_KEY$5) || new Offcanvas(el)).show());
  });
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  defineJQueryPlugin(Offcanvas);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.0.1): util/sanitizer.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  const uriAttrs = new Set(['background', 'cite', 'href', 'itemtype', 'longdesc', 'poster', 'src', 'xlink:href']);
  const ARIA_ATTRIBUTE_PATTERN = /^aria-[\w-]*$/i;
  /**
   * A pattern that recognizes a commonly useful subset of URLs that are safe.
   *
   * Shoutout to Angular 7 https://github.com/angular/angular/blob/7.2.4/packages/core/src/sanitization/url_sanitizer.ts
   */

  const SAFE_URL_PATTERN = /^(?:(?:https?|mailto|ftp|tel|file):|[^#&/:?]*(?:[#/?]|$))/i;
  /**
   * A pattern that matches safe data URLs. Only matches image, video and audio types.
   *
   * Shoutout to Angular 7 https://github.com/angular/angular/blob/7.2.4/packages/core/src/sanitization/url_sanitizer.ts
   */

  const DATA_URL_PATTERN = /^data:(?:image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\/(?:mpeg|mp4|ogg|webm)|audio\/(?:mp3|oga|ogg|opus));base64,[\d+/a-z]+=*$/i;

  const allowedAttribute = (attr, allowedAttributeList) => {
    const attrName = attr.nodeName.toLowerCase();

    if (allowedAttributeList.includes(attrName)) {
      if (uriAttrs.has(attrName)) {
        return Boolean(SAFE_URL_PATTERN.test(attr.nodeValue) || DATA_URL_PATTERN.test(attr.nodeValue));
      }

      return true;
    }

    const regExp = allowedAttributeList.filter(attrRegex => attrRegex instanceof RegExp); // Check if a regular expression validates the attribute.

    for (let i = 0, len = regExp.length; i < len; i++) {
      if (regExp[i].test(attrName)) {
        return true;
      }
    }

    return false;
  };

  const DefaultAllowlist = {
    // Global attributes allowed on any supplied element below.
    '*': ['class', 'dir', 'id', 'lang', 'role', ARIA_ATTRIBUTE_PATTERN],
    a: ['target', 'href', 'title', 'rel'],
    area: [],
    b: [],
    br: [],
    col: [],
    code: [],
    div: [],
    em: [],
    hr: [],
    h1: [],
    h2: [],
    h3: [],
    h4: [],
    h5: [],
    h6: [],
    i: [],
    img: ['src', 'srcset', 'alt', 'title', 'width', 'height'],
    li: [],
    ol: [],
    p: [],
    pre: [],
    s: [],
    small: [],
    span: [],
    sub: [],
    sup: [],
    strong: [],
    u: [],
    ul: []
  };
  function sanitizeHtml(unsafeHtml, allowList, sanitizeFn) {
    if (!unsafeHtml.length) {
      return unsafeHtml;
    }

    if (sanitizeFn && typeof sanitizeFn === 'function') {
      return sanitizeFn(unsafeHtml);
    }

    const domParser = new window.DOMParser();
    const createdDocument = domParser.parseFromString(unsafeHtml, 'text/html');
    const allowlistKeys = Object.keys(allowList);
    const elements = [].concat(...createdDocument.body.querySelectorAll('*'));

    for (let i = 0, len = elements.length; i < len; i++) {
      const el = elements[i];
      const elName = el.nodeName.toLowerCase();

      if (!allowlistKeys.includes(elName)) {
        el.parentNode.removeChild(el);
        continue;
      }

      const attributeList = [].concat(...el.attributes);
      const allowedAttributes = [].concat(allowList['*'] || [], allowList[elName] || []);
      attributeList.forEach(attr => {
        if (!allowedAttribute(attr, allowedAttributes)) {
          el.removeAttribute(attr.nodeName);
        }
      });
    }

    return createdDocument.body.innerHTML;
  }

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.0.1): tooltip.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME$4 = 'tooltip';
  const DATA_KEY$4 = 'bs.tooltip';
  const EVENT_KEY$4 = `.${DATA_KEY$4}`;
  const CLASS_PREFIX$1 = 'bs-tooltip';
  const BSCLS_PREFIX_REGEX$1 = new RegExp(`(^|\\s)${CLASS_PREFIX$1}\\S+`, 'g');
  const DISALLOWED_ATTRIBUTES = new Set(['sanitize', 'allowList', 'sanitizeFn']);
  const DefaultType$3 = {
    animation: 'boolean',
    template: 'string',
    title: '(string|element|function)',
    trigger: 'string',
    delay: '(number|object)',
    html: 'boolean',
    selector: '(string|boolean)',
    placement: '(string|function)',
    offset: '(array|string|function)',
    container: '(string|element|boolean)',
    fallbackPlacements: 'array',
    boundary: '(string|element)',
    customClass: '(string|function)',
    sanitize: 'boolean',
    sanitizeFn: '(null|function)',
    allowList: 'object',
    popperConfig: '(null|object|function)'
  };
  const AttachmentMap = {
    AUTO: 'auto',
    TOP: 'top',
    RIGHT: isRTL() ? 'left' : 'right',
    BOTTOM: 'bottom',
    LEFT: isRTL() ? 'right' : 'left'
  };
  const Default$3 = {
    animation: true,
    template: '<div class="tooltip" role="tooltip">' + '<div class="tooltip-arrow"></div>' + '<div class="tooltip-inner"></div>' + '</div>',
    trigger: 'hover focus',
    title: '',
    delay: 0,
    html: false,
    selector: false,
    placement: 'top',
    offset: [0, 0],
    container: false,
    fallbackPlacements: ['top', 'right', 'bottom', 'left'],
    boundary: 'clippingParents',
    customClass: '',
    sanitize: true,
    sanitizeFn: null,
    allowList: DefaultAllowlist,
    popperConfig: null
  };
  const Event$2 = {
    HIDE: `hide${EVENT_KEY$4}`,
    HIDDEN: `hidden${EVENT_KEY$4}`,
    SHOW: `show${EVENT_KEY$4}`,
    SHOWN: `shown${EVENT_KEY$4}`,
    INSERTED: `inserted${EVENT_KEY$4}`,
    CLICK: `click${EVENT_KEY$4}`,
    FOCUSIN: `focusin${EVENT_KEY$4}`,
    FOCUSOUT: `focusout${EVENT_KEY$4}`,
    MOUSEENTER: `mouseenter${EVENT_KEY$4}`,
    MOUSELEAVE: `mouseleave${EVENT_KEY$4}`
  };
  const CLASS_NAME_FADE$3 = 'fade';
  const CLASS_NAME_MODAL = 'modal';
  const CLASS_NAME_SHOW$3 = 'show';
  const HOVER_STATE_SHOW = 'show';
  const HOVER_STATE_OUT = 'out';
  const SELECTOR_TOOLTIP_INNER = '.tooltip-inner';
  const TRIGGER_HOVER = 'hover';
  const TRIGGER_FOCUS = 'focus';
  const TRIGGER_CLICK = 'click';
  const TRIGGER_MANUAL = 'manual';
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Tooltip extends BaseComponent {
    constructor(element, config) {
      if (typeof Popper === 'undefined') {
        throw new TypeError('Bootstrap\'s tooltips require Popper (https://popper.js.org)');
      }

      super(element); // private

      this._isEnabled = true;
      this._timeout = 0;
      this._hoverState = '';
      this._activeTrigger = {};
      this._popper = null; // Protected

      this._config = this._getConfig(config);
      this.tip = null;

      this._setListeners();
    } // Getters


    static get Default() {
      return Default$3;
    }

    static get NAME() {
      return NAME$4;
    }

    static get Event() {
      return Event$2;
    }

    static get DefaultType() {
      return DefaultType$3;
    } // Public


    enable() {
      this._isEnabled = true;
    }

    disable() {
      this._isEnabled = false;
    }

    toggleEnabled() {
      this._isEnabled = !this._isEnabled;
    }

    toggle(event) {
      if (!this._isEnabled) {
        return;
      }

      if (event) {
        const context = this._initializeOnDelegatedTarget(event);

        context._activeTrigger.click = !context._activeTrigger.click;

        if (context._isWithActiveTrigger()) {
          context._enter(null, context);
        } else {
          context._leave(null, context);
        }
      } else {
        if (this.getTipElement().classList.contains(CLASS_NAME_SHOW$3)) {
          this._leave(null, this);

          return;
        }

        this._enter(null, this);
      }
    }

    dispose() {
      clearTimeout(this._timeout);
      EventHandler.off(this._element.closest(`.${CLASS_NAME_MODAL}`), 'hide.bs.modal', this._hideModalHandler);

      if (this.tip && this.tip.parentNode) {
        this.tip.parentNode.removeChild(this.tip);
      }

      if (this._popper) {
        this._popper.destroy();
      }

      super.dispose();
    }

    show() {
      if (this._element.style.display === 'none') {
        throw new Error('Please use show on visible elements');
      }

      if (!(this.isWithContent() && this._isEnabled)) {
        return;
      }

      const showEvent = EventHandler.trigger(this._element, this.constructor.Event.SHOW);
      const shadowRoot = findShadowRoot(this._element);
      const isInTheDom = shadowRoot === null ? this._element.ownerDocument.documentElement.contains(this._element) : shadowRoot.contains(this._element);

      if (showEvent.defaultPrevented || !isInTheDom) {
        return;
      }

      const tip = this.getTipElement();
      const tipId = getUID(this.constructor.NAME);
      tip.setAttribute('id', tipId);

      this._element.setAttribute('aria-describedby', tipId);

      this.setContent();

      if (this._config.animation) {
        tip.classList.add(CLASS_NAME_FADE$3);
      }

      const placement = typeof this._config.placement === 'function' ? this._config.placement.call(this, tip, this._element) : this._config.placement;

      const attachment = this._getAttachment(placement);

      this._addAttachmentClass(attachment);

      const {
        container
      } = this._config;
      Data.set(tip, this.constructor.DATA_KEY, this);

      if (!this._element.ownerDocument.documentElement.contains(this.tip)) {
        container.appendChild(tip);
        EventHandler.trigger(this._element, this.constructor.Event.INSERTED);
      }

      if (this._popper) {
        this._popper.update();
      } else {
        this._popper = createPopper(this._element, tip, this._getPopperConfig(attachment));
      }

      tip.classList.add(CLASS_NAME_SHOW$3);
      const customClass = typeof this._config.customClass === 'function' ? this._config.customClass() : this._config.customClass;

      if (customClass) {
        tip.classList.add(...customClass.split(' '));
      } // If this is a touch-enabled device we add extra
      // empty mouseover listeners to the body's immediate children;
      // only needed because of broken event delegation on iOS
      // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html


      if ('ontouchstart' in document.documentElement) {
        [].concat(...document.body.children).forEach(element => {
          EventHandler.on(element, 'mouseover', noop);
        });
      }

      const complete = () => {
        const prevHoverState = this._hoverState;
        this._hoverState = null;
        EventHandler.trigger(this._element, this.constructor.Event.SHOWN);

        if (prevHoverState === HOVER_STATE_OUT) {
          this._leave(null, this);
        }
      };

      const isAnimated = this.tip.classList.contains(CLASS_NAME_FADE$3);

      this._queueCallback(complete, this.tip, isAnimated);
    }

    hide() {
      if (!this._popper) {
        return;
      }

      const tip = this.getTipElement();

      const complete = () => {
        if (this._isWithActiveTrigger()) {
          return;
        }

        if (this._hoverState !== HOVER_STATE_SHOW && tip.parentNode) {
          tip.parentNode.removeChild(tip);
        }

        this._cleanTipClass();

        this._element.removeAttribute('aria-describedby');

        EventHandler.trigger(this._element, this.constructor.Event.HIDDEN);

        if (this._popper) {
          this._popper.destroy();

          this._popper = null;
        }
      };

      const hideEvent = EventHandler.trigger(this._element, this.constructor.Event.HIDE);

      if (hideEvent.defaultPrevented) {
        return;
      }

      tip.classList.remove(CLASS_NAME_SHOW$3); // If this is a touch-enabled device we remove the extra
      // empty mouseover listeners we added for iOS support

      if ('ontouchstart' in document.documentElement) {
        [].concat(...document.body.children).forEach(element => EventHandler.off(element, 'mouseover', noop));
      }

      this._activeTrigger[TRIGGER_CLICK] = false;
      this._activeTrigger[TRIGGER_FOCUS] = false;
      this._activeTrigger[TRIGGER_HOVER] = false;
      const isAnimated = this.tip.classList.contains(CLASS_NAME_FADE$3);

      this._queueCallback(complete, this.tip, isAnimated);

      this._hoverState = '';
    }

    update() {
      if (this._popper !== null) {
        this._popper.update();
      }
    } // Protected


    isWithContent() {
      return Boolean(this.getTitle());
    }

    getTipElement() {
      if (this.tip) {
        return this.tip;
      }

      const element = document.createElement('div');
      element.innerHTML = this._config.template;
      this.tip = element.children[0];
      return this.tip;
    }

    setContent() {
      const tip = this.getTipElement();
      this.setElementContent(SelectorEngine.findOne(SELECTOR_TOOLTIP_INNER, tip), this.getTitle());
      tip.classList.remove(CLASS_NAME_FADE$3, CLASS_NAME_SHOW$3);
    }

    setElementContent(element, content) {
      if (element === null) {
        return;
      }

      if (isElement$1(content)) {
        content = getElement(content); // content is a DOM node or a jQuery

        if (this._config.html) {
          if (content.parentNode !== element) {
            element.innerHTML = '';
            element.appendChild(content);
          }
        } else {
          element.textContent = content.textContent;
        }

        return;
      }

      if (this._config.html) {
        if (this._config.sanitize) {
          content = sanitizeHtml(content, this._config.allowList, this._config.sanitizeFn);
        }

        element.innerHTML = content;
      } else {
        element.textContent = content;
      }
    }

    getTitle() {
      let title = this._element.getAttribute('data-bs-original-title');

      if (!title) {
        title = typeof this._config.title === 'function' ? this._config.title.call(this._element) : this._config.title;
      }

      return title;
    }

    updateAttachment(attachment) {
      if (attachment === 'right') {
        return 'end';
      }

      if (attachment === 'left') {
        return 'start';
      }

      return attachment;
    } // Private


    _initializeOnDelegatedTarget(event, context) {
      const dataKey = this.constructor.DATA_KEY;
      context = context || Data.get(event.delegateTarget, dataKey);

      if (!context) {
        context = new this.constructor(event.delegateTarget, this._getDelegateConfig());
        Data.set(event.delegateTarget, dataKey, context);
      }

      return context;
    }

    _getOffset() {
      const {
        offset
      } = this._config;

      if (typeof offset === 'string') {
        return offset.split(',').map(val => Number.parseInt(val, 10));
      }

      if (typeof offset === 'function') {
        return popperData => offset(popperData, this._element);
      }

      return offset;
    }

    _getPopperConfig(attachment) {
      const defaultBsPopperConfig = {
        placement: attachment,
        modifiers: [{
          name: 'flip',
          options: {
            fallbackPlacements: this._config.fallbackPlacements
          }
        }, {
          name: 'offset',
          options: {
            offset: this._getOffset()
          }
        }, {
          name: 'preventOverflow',
          options: {
            boundary: this._config.boundary
          }
        }, {
          name: 'arrow',
          options: {
            element: `.${this.constructor.NAME}-arrow`
          }
        }, {
          name: 'onChange',
          enabled: true,
          phase: 'afterWrite',
          fn: data => this._handlePopperPlacementChange(data)
        }],
        onFirstUpdate: data => {
          if (data.options.placement !== data.placement) {
            this._handlePopperPlacementChange(data);
          }
        }
      };
      return { ...defaultBsPopperConfig,
        ...(typeof this._config.popperConfig === 'function' ? this._config.popperConfig(defaultBsPopperConfig) : this._config.popperConfig)
      };
    }

    _addAttachmentClass(attachment) {
      this.getTipElement().classList.add(`${CLASS_PREFIX$1}-${this.updateAttachment(attachment)}`);
    }

    _getAttachment(placement) {
      return AttachmentMap[placement.toUpperCase()];
    }

    _setListeners() {
      const triggers = this._config.trigger.split(' ');

      triggers.forEach(trigger => {
        if (trigger === 'click') {
          EventHandler.on(this._element, this.constructor.Event.CLICK, this._config.selector, event => this.toggle(event));
        } else if (trigger !== TRIGGER_MANUAL) {
          const eventIn = trigger === TRIGGER_HOVER ? this.constructor.Event.MOUSEENTER : this.constructor.Event.FOCUSIN;
          const eventOut = trigger === TRIGGER_HOVER ? this.constructor.Event.MOUSELEAVE : this.constructor.Event.FOCUSOUT;
          EventHandler.on(this._element, eventIn, this._config.selector, event => this._enter(event));
          EventHandler.on(this._element, eventOut, this._config.selector, event => this._leave(event));
        }
      });

      this._hideModalHandler = () => {
        if (this._element) {
          this.hide();
        }
      };

      EventHandler.on(this._element.closest(`.${CLASS_NAME_MODAL}`), 'hide.bs.modal', this._hideModalHandler);

      if (this._config.selector) {
        this._config = { ...this._config,
          trigger: 'manual',
          selector: ''
        };
      } else {
        this._fixTitle();
      }
    }

    _fixTitle() {
      const title = this._element.getAttribute('title');

      const originalTitleType = typeof this._element.getAttribute('data-bs-original-title');

      if (title || originalTitleType !== 'string') {
        this._element.setAttribute('data-bs-original-title', title || '');

        if (title && !this._element.getAttribute('aria-label') && !this._element.textContent) {
          this._element.setAttribute('aria-label', title);
        }

        this._element.setAttribute('title', '');
      }
    }

    _enter(event, context) {
      context = this._initializeOnDelegatedTarget(event, context);

      if (event) {
        context._activeTrigger[event.type === 'focusin' ? TRIGGER_FOCUS : TRIGGER_HOVER] = true;
      }

      if (context.getTipElement().classList.contains(CLASS_NAME_SHOW$3) || context._hoverState === HOVER_STATE_SHOW) {
        context._hoverState = HOVER_STATE_SHOW;
        return;
      }

      clearTimeout(context._timeout);
      context._hoverState = HOVER_STATE_SHOW;

      if (!context._config.delay || !context._config.delay.show) {
        context.show();
        return;
      }

      context._timeout = setTimeout(() => {
        if (context._hoverState === HOVER_STATE_SHOW) {
          context.show();
        }
      }, context._config.delay.show);
    }

    _leave(event, context) {
      context = this._initializeOnDelegatedTarget(event, context);

      if (event) {
        context._activeTrigger[event.type === 'focusout' ? TRIGGER_FOCUS : TRIGGER_HOVER] = context._element.contains(event.relatedTarget);
      }

      if (context._isWithActiveTrigger()) {
        return;
      }

      clearTimeout(context._timeout);
      context._hoverState = HOVER_STATE_OUT;

      if (!context._config.delay || !context._config.delay.hide) {
        context.hide();
        return;
      }

      context._timeout = setTimeout(() => {
        if (context._hoverState === HOVER_STATE_OUT) {
          context.hide();
        }
      }, context._config.delay.hide);
    }

    _isWithActiveTrigger() {
      for (const trigger in this._activeTrigger) {
        if (this._activeTrigger[trigger]) {
          return true;
        }
      }

      return false;
    }

    _getConfig(config) {
      const dataAttributes = Manipulator.getDataAttributes(this._element);
      Object.keys(dataAttributes).forEach(dataAttr => {
        if (DISALLOWED_ATTRIBUTES.has(dataAttr)) {
          delete dataAttributes[dataAttr];
        }
      });
      config = { ...this.constructor.Default,
        ...dataAttributes,
        ...(typeof config === 'object' && config ? config : {})
      };
      config.container = config.container === false ? document.body : getElement(config.container);

      if (typeof config.delay === 'number') {
        config.delay = {
          show: config.delay,
          hide: config.delay
        };
      }

      if (typeof config.title === 'number') {
        config.title = config.title.toString();
      }

      if (typeof config.content === 'number') {
        config.content = config.content.toString();
      }

      typeCheckConfig(NAME$4, config, this.constructor.DefaultType);

      if (config.sanitize) {
        config.template = sanitizeHtml(config.template, config.allowList, config.sanitizeFn);
      }

      return config;
    }

    _getDelegateConfig() {
      const config = {};

      if (this._config) {
        for (const key in this._config) {
          if (this.constructor.Default[key] !== this._config[key]) {
            config[key] = this._config[key];
          }
        }
      }

      return config;
    }

    _cleanTipClass() {
      const tip = this.getTipElement();
      const tabClass = tip.getAttribute('class').match(BSCLS_PREFIX_REGEX$1);

      if (tabClass !== null && tabClass.length > 0) {
        tabClass.map(token => token.trim()).forEach(tClass => tip.classList.remove(tClass));
      }
    }

    _handlePopperPlacementChange(popperData) {
      const {
        state
      } = popperData;

      if (!state) {
        return;
      }

      this.tip = state.elements.popper;

      this._cleanTipClass();

      this._addAttachmentClass(this._getAttachment(state.placement));
    } // Static


    static jQueryInterface(config) {
      return this.each(function () {
        let data = Data.get(this, DATA_KEY$4);

        const _config = typeof config === 'object' && config;

        if (!data && /dispose|hide/.test(config)) {
          return;
        }

        if (!data) {
          data = new Tooltip(this, _config);
        }

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError(`No method named "${config}"`);
          }

          data[config]();
        }
      });
    }

  }
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   * add .Tooltip to jQuery only if jQuery is present
   */


  defineJQueryPlugin(Tooltip);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.0.1): popover.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME$3 = 'popover';
  const DATA_KEY$3 = 'bs.popover';
  const EVENT_KEY$3 = `.${DATA_KEY$3}`;
  const CLASS_PREFIX = 'bs-popover';
  const BSCLS_PREFIX_REGEX = new RegExp(`(^|\\s)${CLASS_PREFIX}\\S+`, 'g');
  const Default$2 = { ...Tooltip.Default,
    placement: 'right',
    offset: [0, 8],
    trigger: 'click',
    content: '',
    template: '<div class="popover" role="tooltip">' + '<div class="popover-arrow"></div>' + '<h3 class="popover-header"></h3>' + '<div class="popover-body"></div>' + '</div>'
  };
  const DefaultType$2 = { ...Tooltip.DefaultType,
    content: '(string|element|function)'
  };
  const Event$1 = {
    HIDE: `hide${EVENT_KEY$3}`,
    HIDDEN: `hidden${EVENT_KEY$3}`,
    SHOW: `show${EVENT_KEY$3}`,
    SHOWN: `shown${EVENT_KEY$3}`,
    INSERTED: `inserted${EVENT_KEY$3}`,
    CLICK: `click${EVENT_KEY$3}`,
    FOCUSIN: `focusin${EVENT_KEY$3}`,
    FOCUSOUT: `focusout${EVENT_KEY$3}`,
    MOUSEENTER: `mouseenter${EVENT_KEY$3}`,
    MOUSELEAVE: `mouseleave${EVENT_KEY$3}`
  };
  const CLASS_NAME_FADE$2 = 'fade';
  const CLASS_NAME_SHOW$2 = 'show';
  const SELECTOR_TITLE = '.popover-header';
  const SELECTOR_CONTENT = '.popover-body';
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Popover extends Tooltip {
    // Getters
    static get Default() {
      return Default$2;
    }

    static get NAME() {
      return NAME$3;
    }

    static get Event() {
      return Event$1;
    }

    static get DefaultType() {
      return DefaultType$2;
    } // Overrides


    isWithContent() {
      return this.getTitle() || this._getContent();
    }

    setContent() {
      const tip = this.getTipElement(); // we use append for html objects to maintain js events

      this.setElementContent(SelectorEngine.findOne(SELECTOR_TITLE, tip), this.getTitle());

      let content = this._getContent();

      if (typeof content === 'function') {
        content = content.call(this._element);
      }

      this.setElementContent(SelectorEngine.findOne(SELECTOR_CONTENT, tip), content);
      tip.classList.remove(CLASS_NAME_FADE$2, CLASS_NAME_SHOW$2);
    } // Private


    _addAttachmentClass(attachment) {
      this.getTipElement().classList.add(`${CLASS_PREFIX}-${this.updateAttachment(attachment)}`);
    }

    _getContent() {
      return this._element.getAttribute('data-bs-content') || this._config.content;
    }

    _cleanTipClass() {
      const tip = this.getTipElement();
      const tabClass = tip.getAttribute('class').match(BSCLS_PREFIX_REGEX);

      if (tabClass !== null && tabClass.length > 0) {
        tabClass.map(token => token.trim()).forEach(tClass => tip.classList.remove(tClass));
      }
    } // Static


    static jQueryInterface(config) {
      return this.each(function () {
        let data = Data.get(this, DATA_KEY$3);

        const _config = typeof config === 'object' ? config : null;

        if (!data && /dispose|hide/.test(config)) {
          return;
        }

        if (!data) {
          data = new Popover(this, _config);
          Data.set(this, DATA_KEY$3, data);
        }

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError(`No method named "${config}"`);
          }

          data[config]();
        }
      });
    }

  }
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   * add .Popover to jQuery only if jQuery is present
   */


  defineJQueryPlugin(Popover);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.0.1): scrollspy.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME$2 = 'scrollspy';
  const DATA_KEY$2 = 'bs.scrollspy';
  const EVENT_KEY$2 = `.${DATA_KEY$2}`;
  const DATA_API_KEY$1 = '.data-api';
  const Default$1 = {
    offset: 10,
    method: 'auto',
    target: ''
  };
  const DefaultType$1 = {
    offset: 'number',
    method: 'string',
    target: '(string|element)'
  };
  const EVENT_ACTIVATE = `activate${EVENT_KEY$2}`;
  const EVENT_SCROLL = `scroll${EVENT_KEY$2}`;
  const EVENT_LOAD_DATA_API = `load${EVENT_KEY$2}${DATA_API_KEY$1}`;
  const CLASS_NAME_DROPDOWN_ITEM = 'dropdown-item';
  const CLASS_NAME_ACTIVE$1 = 'active';
  const SELECTOR_DATA_SPY = '[data-bs-spy="scroll"]';
  const SELECTOR_NAV_LIST_GROUP$1 = '.nav, .list-group';
  const SELECTOR_NAV_LINKS = '.nav-link';
  const SELECTOR_NAV_ITEMS = '.nav-item';
  const SELECTOR_LIST_ITEMS = '.list-group-item';
  const SELECTOR_DROPDOWN$1 = '.dropdown';
  const SELECTOR_DROPDOWN_TOGGLE$1 = '.dropdown-toggle';
  const METHOD_OFFSET = 'offset';
  const METHOD_POSITION = 'position';
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class ScrollSpy extends BaseComponent {
    constructor(element, config) {
      super(element);
      this._scrollElement = this._element.tagName === 'BODY' ? window : this._element;
      this._config = this._getConfig(config);
      this._selector = `${this._config.target} ${SELECTOR_NAV_LINKS}, ${this._config.target} ${SELECTOR_LIST_ITEMS}, ${this._config.target} .${CLASS_NAME_DROPDOWN_ITEM}`;
      this._offsets = [];
      this._targets = [];
      this._activeTarget = null;
      this._scrollHeight = 0;
      EventHandler.on(this._scrollElement, EVENT_SCROLL, () => this._process());
      this.refresh();

      this._process();
    } // Getters


    static get Default() {
      return Default$1;
    }

    static get NAME() {
      return NAME$2;
    } // Public


    refresh() {
      const autoMethod = this._scrollElement === this._scrollElement.window ? METHOD_OFFSET : METHOD_POSITION;
      const offsetMethod = this._config.method === 'auto' ? autoMethod : this._config.method;
      const offsetBase = offsetMethod === METHOD_POSITION ? this._getScrollTop() : 0;
      this._offsets = [];
      this._targets = [];
      this._scrollHeight = this._getScrollHeight();
      const targets = SelectorEngine.find(this._selector);
      targets.map(element => {
        const targetSelector = getSelectorFromElement(element);
        const target = targetSelector ? SelectorEngine.findOne(targetSelector) : null;

        if (target) {
          const targetBCR = target.getBoundingClientRect();

          if (targetBCR.width || targetBCR.height) {
            return [Manipulator[offsetMethod](target).top + offsetBase, targetSelector];
          }
        }

        return null;
      }).filter(item => item).sort((a, b) => a[0] - b[0]).forEach(item => {
        this._offsets.push(item[0]);

        this._targets.push(item[1]);
      });
    }

    dispose() {
      EventHandler.off(this._scrollElement, EVENT_KEY$2);
      super.dispose();
    } // Private


    _getConfig(config) {
      config = { ...Default$1,
        ...Manipulator.getDataAttributes(this._element),
        ...(typeof config === 'object' && config ? config : {})
      };

      if (typeof config.target !== 'string' && isElement$1(config.target)) {
        let {
          id
        } = config.target;

        if (!id) {
          id = getUID(NAME$2);
          config.target.id = id;
        }

        config.target = `#${id}`;
      }

      typeCheckConfig(NAME$2, config, DefaultType$1);
      return config;
    }

    _getScrollTop() {
      return this._scrollElement === window ? this._scrollElement.pageYOffset : this._scrollElement.scrollTop;
    }

    _getScrollHeight() {
      return this._scrollElement.scrollHeight || Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
    }

    _getOffsetHeight() {
      return this._scrollElement === window ? window.innerHeight : this._scrollElement.getBoundingClientRect().height;
    }

    _process() {
      const scrollTop = this._getScrollTop() + this._config.offset;

      const scrollHeight = this._getScrollHeight();

      const maxScroll = this._config.offset + scrollHeight - this._getOffsetHeight();

      if (this._scrollHeight !== scrollHeight) {
        this.refresh();
      }

      if (scrollTop >= maxScroll) {
        const target = this._targets[this._targets.length - 1];

        if (this._activeTarget !== target) {
          this._activate(target);
        }

        return;
      }

      if (this._activeTarget && scrollTop < this._offsets[0] && this._offsets[0] > 0) {
        this._activeTarget = null;

        this._clear();

        return;
      }

      for (let i = this._offsets.length; i--;) {
        const isActiveTarget = this._activeTarget !== this._targets[i] && scrollTop >= this._offsets[i] && (typeof this._offsets[i + 1] === 'undefined' || scrollTop < this._offsets[i + 1]);

        if (isActiveTarget) {
          this._activate(this._targets[i]);
        }
      }
    }

    _activate(target) {
      this._activeTarget = target;

      this._clear();

      const queries = this._selector.split(',').map(selector => `${selector}[data-bs-target="${target}"],${selector}[href="${target}"]`);

      const link = SelectorEngine.findOne(queries.join(','));

      if (link.classList.contains(CLASS_NAME_DROPDOWN_ITEM)) {
        SelectorEngine.findOne(SELECTOR_DROPDOWN_TOGGLE$1, link.closest(SELECTOR_DROPDOWN$1)).classList.add(CLASS_NAME_ACTIVE$1);
        link.classList.add(CLASS_NAME_ACTIVE$1);
      } else {
        // Set triggered link as active
        link.classList.add(CLASS_NAME_ACTIVE$1);
        SelectorEngine.parents(link, SELECTOR_NAV_LIST_GROUP$1).forEach(listGroup => {
          // Set triggered links parents as active
          // With both <ul> and <nav> markup a parent is the previous sibling of any nav ancestor
          SelectorEngine.prev(listGroup, `${SELECTOR_NAV_LINKS}, ${SELECTOR_LIST_ITEMS}`).forEach(item => item.classList.add(CLASS_NAME_ACTIVE$1)); // Handle special case when .nav-link is inside .nav-item

          SelectorEngine.prev(listGroup, SELECTOR_NAV_ITEMS).forEach(navItem => {
            SelectorEngine.children(navItem, SELECTOR_NAV_LINKS).forEach(item => item.classList.add(CLASS_NAME_ACTIVE$1));
          });
        });
      }

      EventHandler.trigger(this._scrollElement, EVENT_ACTIVATE, {
        relatedTarget: target
      });
    }

    _clear() {
      SelectorEngine.find(this._selector).filter(node => node.classList.contains(CLASS_NAME_ACTIVE$1)).forEach(node => node.classList.remove(CLASS_NAME_ACTIVE$1));
    } // Static


    static jQueryInterface(config) {
      return this.each(function () {
        const data = ScrollSpy.getInstance(this) || new ScrollSpy(this, typeof config === 'object' ? config : {});

        if (typeof config !== 'string') {
          return;
        }

        if (typeof data[config] === 'undefined') {
          throw new TypeError(`No method named "${config}"`);
        }

        data[config]();
      });
    }

  }
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  EventHandler.on(window, EVENT_LOAD_DATA_API, () => {
    SelectorEngine.find(SELECTOR_DATA_SPY).forEach(spy => new ScrollSpy(spy));
  });
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   * add .ScrollSpy to jQuery only if jQuery is present
   */

  defineJQueryPlugin(ScrollSpy);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.0.1): tab.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME$1 = 'tab';
  const DATA_KEY$1 = 'bs.tab';
  const EVENT_KEY$1 = `.${DATA_KEY$1}`;
  const DATA_API_KEY = '.data-api';
  const EVENT_HIDE$1 = `hide${EVENT_KEY$1}`;
  const EVENT_HIDDEN$1 = `hidden${EVENT_KEY$1}`;
  const EVENT_SHOW$1 = `show${EVENT_KEY$1}`;
  const EVENT_SHOWN$1 = `shown${EVENT_KEY$1}`;
  const EVENT_CLICK_DATA_API = `click${EVENT_KEY$1}${DATA_API_KEY}`;
  const CLASS_NAME_DROPDOWN_MENU = 'dropdown-menu';
  const CLASS_NAME_ACTIVE = 'active';
  const CLASS_NAME_FADE$1 = 'fade';
  const CLASS_NAME_SHOW$1 = 'show';
  const SELECTOR_DROPDOWN = '.dropdown';
  const SELECTOR_NAV_LIST_GROUP = '.nav, .list-group';
  const SELECTOR_ACTIVE = '.active';
  const SELECTOR_ACTIVE_UL = ':scope > li > .active';
  const SELECTOR_DATA_TOGGLE = '[data-bs-toggle="tab"], [data-bs-toggle="pill"], [data-bs-toggle="list"]';
  const SELECTOR_DROPDOWN_TOGGLE = '.dropdown-toggle';
  const SELECTOR_DROPDOWN_ACTIVE_CHILD = ':scope > .dropdown-menu .active';
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Tab extends BaseComponent {
    // Getters
    static get NAME() {
      return NAME$1;
    } // Public


    show() {
      if (this._element.parentNode && this._element.parentNode.nodeType === Node.ELEMENT_NODE && this._element.classList.contains(CLASS_NAME_ACTIVE)) {
        return;
      }

      let previous;
      const target = getElementFromSelector(this._element);

      const listElement = this._element.closest(SELECTOR_NAV_LIST_GROUP);

      if (listElement) {
        const itemSelector = listElement.nodeName === 'UL' || listElement.nodeName === 'OL' ? SELECTOR_ACTIVE_UL : SELECTOR_ACTIVE;
        previous = SelectorEngine.find(itemSelector, listElement);
        previous = previous[previous.length - 1];
      }

      const hideEvent = previous ? EventHandler.trigger(previous, EVENT_HIDE$1, {
        relatedTarget: this._element
      }) : null;
      const showEvent = EventHandler.trigger(this._element, EVENT_SHOW$1, {
        relatedTarget: previous
      });

      if (showEvent.defaultPrevented || hideEvent !== null && hideEvent.defaultPrevented) {
        return;
      }

      this._activate(this._element, listElement);

      const complete = () => {
        EventHandler.trigger(previous, EVENT_HIDDEN$1, {
          relatedTarget: this._element
        });
        EventHandler.trigger(this._element, EVENT_SHOWN$1, {
          relatedTarget: previous
        });
      };

      if (target) {
        this._activate(target, target.parentNode, complete);
      } else {
        complete();
      }
    } // Private


    _activate(element, container, callback) {
      const activeElements = container && (container.nodeName === 'UL' || container.nodeName === 'OL') ? SelectorEngine.find(SELECTOR_ACTIVE_UL, container) : SelectorEngine.children(container, SELECTOR_ACTIVE);
      const active = activeElements[0];
      const isTransitioning = callback && active && active.classList.contains(CLASS_NAME_FADE$1);

      const complete = () => this._transitionComplete(element, active, callback);

      if (active && isTransitioning) {
        active.classList.remove(CLASS_NAME_SHOW$1);

        this._queueCallback(complete, element, true);
      } else {
        complete();
      }
    }

    _transitionComplete(element, active, callback) {
      if (active) {
        active.classList.remove(CLASS_NAME_ACTIVE);
        const dropdownChild = SelectorEngine.findOne(SELECTOR_DROPDOWN_ACTIVE_CHILD, active.parentNode);

        if (dropdownChild) {
          dropdownChild.classList.remove(CLASS_NAME_ACTIVE);
        }

        if (active.getAttribute('role') === 'tab') {
          active.setAttribute('aria-selected', false);
        }
      }

      element.classList.add(CLASS_NAME_ACTIVE);

      if (element.getAttribute('role') === 'tab') {
        element.setAttribute('aria-selected', true);
      }

      reflow(element);

      if (element.classList.contains(CLASS_NAME_FADE$1)) {
        element.classList.add(CLASS_NAME_SHOW$1);
      }

      let parent = element.parentNode;

      if (parent && parent.nodeName === 'LI') {
        parent = parent.parentNode;
      }

      if (parent && parent.classList.contains(CLASS_NAME_DROPDOWN_MENU)) {
        const dropdownElement = element.closest(SELECTOR_DROPDOWN);

        if (dropdownElement) {
          SelectorEngine.find(SELECTOR_DROPDOWN_TOGGLE, dropdownElement).forEach(dropdown => dropdown.classList.add(CLASS_NAME_ACTIVE));
        }

        element.setAttribute('aria-expanded', true);
      }

      if (callback) {
        callback();
      }
    } // Static


    static jQueryInterface(config) {
      return this.each(function () {
        const data = Data.get(this, DATA_KEY$1) || new Tab(this);

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError(`No method named "${config}"`);
          }

          data[config]();
        }
      });
    }

  }
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  EventHandler.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
    if (['A', 'AREA'].includes(this.tagName)) {
      event.preventDefault();
    }

    if (isDisabled(this)) {
      return;
    }

    const data = Data.get(this, DATA_KEY$1) || new Tab(this);
    data.show();
  });
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   * add .Tab to jQuery only if jQuery is present
   */

  defineJQueryPlugin(Tab);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.0.1): toast.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME = 'toast';
  const DATA_KEY = 'bs.toast';
  const EVENT_KEY = `.${DATA_KEY}`;
  const EVENT_CLICK_DISMISS = `click.dismiss${EVENT_KEY}`;
  const EVENT_MOUSEOVER = `mouseover${EVENT_KEY}`;
  const EVENT_MOUSEOUT = `mouseout${EVENT_KEY}`;
  const EVENT_FOCUSIN = `focusin${EVENT_KEY}`;
  const EVENT_FOCUSOUT = `focusout${EVENT_KEY}`;
  const EVENT_HIDE = `hide${EVENT_KEY}`;
  const EVENT_HIDDEN = `hidden${EVENT_KEY}`;
  const EVENT_SHOW = `show${EVENT_KEY}`;
  const EVENT_SHOWN = `shown${EVENT_KEY}`;
  const CLASS_NAME_FADE = 'fade';
  const CLASS_NAME_HIDE = 'hide';
  const CLASS_NAME_SHOW = 'show';
  const CLASS_NAME_SHOWING = 'showing';
  const DefaultType = {
    animation: 'boolean',
    autohide: 'boolean',
    delay: 'number'
  };
  const Default = {
    animation: true,
    autohide: true,
    delay: 5000
  };
  const SELECTOR_DATA_DISMISS = '[data-bs-dismiss="toast"]';
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Toast extends BaseComponent {
    constructor(element, config) {
      super(element);
      this._config = this._getConfig(config);
      this._timeout = null;
      this._hasMouseInteraction = false;
      this._hasKeyboardInteraction = false;

      this._setListeners();
    } // Getters


    static get DefaultType() {
      return DefaultType;
    }

    static get Default() {
      return Default;
    }

    static get NAME() {
      return NAME;
    } // Public


    show() {
      const showEvent = EventHandler.trigger(this._element, EVENT_SHOW);

      if (showEvent.defaultPrevented) {
        return;
      }

      this._clearTimeout();

      if (this._config.animation) {
        this._element.classList.add(CLASS_NAME_FADE);
      }

      const complete = () => {
        this._element.classList.remove(CLASS_NAME_SHOWING);

        this._element.classList.add(CLASS_NAME_SHOW);

        EventHandler.trigger(this._element, EVENT_SHOWN);

        this._maybeScheduleHide();
      };

      this._element.classList.remove(CLASS_NAME_HIDE);

      reflow(this._element);

      this._element.classList.add(CLASS_NAME_SHOWING);

      this._queueCallback(complete, this._element, this._config.animation);
    }

    hide() {
      if (!this._element.classList.contains(CLASS_NAME_SHOW)) {
        return;
      }

      const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE);

      if (hideEvent.defaultPrevented) {
        return;
      }

      const complete = () => {
        this._element.classList.add(CLASS_NAME_HIDE);

        EventHandler.trigger(this._element, EVENT_HIDDEN);
      };

      this._element.classList.remove(CLASS_NAME_SHOW);

      this._queueCallback(complete, this._element, this._config.animation);
    }

    dispose() {
      this._clearTimeout();

      if (this._element.classList.contains(CLASS_NAME_SHOW)) {
        this._element.classList.remove(CLASS_NAME_SHOW);
      }

      super.dispose();
    } // Private


    _getConfig(config) {
      config = { ...Default,
        ...Manipulator.getDataAttributes(this._element),
        ...(typeof config === 'object' && config ? config : {})
      };
      typeCheckConfig(NAME, config, this.constructor.DefaultType);
      return config;
    }

    _maybeScheduleHide() {
      if (!this._config.autohide) {
        return;
      }

      if (this._hasMouseInteraction || this._hasKeyboardInteraction) {
        return;
      }

      this._timeout = setTimeout(() => {
        this.hide();
      }, this._config.delay);
    }

    _onInteraction(event, isInteracting) {
      switch (event.type) {
        case 'mouseover':
        case 'mouseout':
          this._hasMouseInteraction = isInteracting;
          break;

        case 'focusin':
        case 'focusout':
          this._hasKeyboardInteraction = isInteracting;
          break;
      }

      if (isInteracting) {
        this._clearTimeout();

        return;
      }

      const nextElement = event.relatedTarget;

      if (this._element === nextElement || this._element.contains(nextElement)) {
        return;
      }

      this._maybeScheduleHide();
    }

    _setListeners() {
      EventHandler.on(this._element, EVENT_CLICK_DISMISS, SELECTOR_DATA_DISMISS, () => this.hide());
      EventHandler.on(this._element, EVENT_MOUSEOVER, event => this._onInteraction(event, true));
      EventHandler.on(this._element, EVENT_MOUSEOUT, event => this._onInteraction(event, false));
      EventHandler.on(this._element, EVENT_FOCUSIN, event => this._onInteraction(event, true));
      EventHandler.on(this._element, EVENT_FOCUSOUT, event => this._onInteraction(event, false));
    }

    _clearTimeout() {
      clearTimeout(this._timeout);
      this._timeout = null;
    } // Static


    static jQueryInterface(config) {
      return this.each(function () {
        let data = Data.get(this, DATA_KEY);

        const _config = typeof config === 'object' && config;

        if (!data) {
          data = new Toast(this, _config);
        }

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError(`No method named "${config}"`);
          }

          data[config](this);
        }
      });
    }

  }
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   * add .Toast to jQuery only if jQuery is present
   */


  defineJQueryPlugin(Toast);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.0.1): index.umd.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  var index_umd = {
    Alert,
    Button,
    Carousel,
    Collapse,
    Dropdown,
    Modal,
    Offcanvas,
    Popover,
    ScrollSpy,
    Tab,
    Toast,
    Tooltip
  };

  return index_umd;

})));
//# sourceMappingURL=bootstrap.bundle.js.map


/*! DataTables 1.11.5
 * ©2008-2021 SpryMedia Ltd - datatables.net/license
 */

/**
 * @summary     DataTables
 * @description Paginate, search and order HTML tables
 * @version     1.11.5
 * @file        jquery.dataTables.js
 * @author      SpryMedia Ltd
 * @contact     www.datatables.net
 * @copyright   Copyright 2008-2021 SpryMedia Ltd.
 *
 * This source file is free software, available under the following license:
 *   MIT license - http://datatables.net/license
 *
 * This source file is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.
 *
 * For details please refer to: http://www.datatables.net
 */

/*jslint evil: true, undef: true, browser: true */
/*globals $,require,jQuery,define,_selector_run,_selector_opts,_selector_first,_selector_row_indexes,_ext,_Api,_api_register,_api_registerPlural,_re_new_lines,_re_html,_re_formatted_numeric,_re_escape_regex,_empty,_intVal,_numToDecimal,_isNumber,_isHtml,_htmlNumeric,_pluck,_pluck_order,_range,_stripHtml,_unique,_fnBuildAjax,_fnAjaxUpdate,_fnAjaxParameters,_fnAjaxUpdateDraw,_fnAjaxDataSrc,_fnAddColumn,_fnColumnOptions,_fnAdjustColumnSizing,_fnVisibleToColumnIndex,_fnColumnIndexToVisible,_fnVisbleColumns,_fnGetColumns,_fnColumnTypes,_fnApplyColumnDefs,_fnHungarianMap,_fnCamelToHungarian,_fnLanguageCompat,_fnBrowserDetect,_fnAddData,_fnAddTr,_fnNodeToDataIndex,_fnNodeToColumnIndex,_fnGetCellData,_fnSetCellData,_fnSplitObjNotation,_fnGetObjectDataFn,_fnSetObjectDataFn,_fnGetDataMaster,_fnClearTable,_fnDeleteIndex,_fnInvalidate,_fnGetRowElements,_fnCreateTr,_fnBuildHead,_fnDrawHead,_fnDraw,_fnReDraw,_fnAddOptionsHtml,_fnDetectHeader,_fnGetUniqueThs,_fnFeatureHtmlFilter,_fnFilterComplete,_fnFilterCustom,_fnFilterColumn,_fnFilter,_fnFilterCreateSearch,_fnEscapeRegex,_fnFilterData,_fnFeatureHtmlInfo,_fnUpdateInfo,_fnInfoMacros,_fnInitialise,_fnInitComplete,_fnLengthChange,_fnFeatureHtmlLength,_fnFeatureHtmlPaginate,_fnPageChange,_fnFeatureHtmlProcessing,_fnProcessingDisplay,_fnFeatureHtmlTable,_fnScrollDraw,_fnApplyToChildren,_fnCalculateColumnWidths,_fnThrottle,_fnConvertToWidth,_fnGetWidestNode,_fnGetMaxLenString,_fnStringToCss,_fnSortFlatten,_fnSort,_fnSortAria,_fnSortListener,_fnSortAttachListener,_fnSortingClasses,_fnSortData,_fnSaveState,_fnLoadState,_fnSettingsFromNode,_fnLog,_fnMap,_fnBindAction,_fnCallbackReg,_fnCallbackFire,_fnLengthOverflow,_fnRenderer,_fnDataSource,_fnRowAttributes*/

(function( factory ) {
	"use strict";

	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = function (root, $) {
			if ( ! root ) {
				// CommonJS environments without a window global must pass a
				// root. This will give an error otherwise
				root = window;
			}

			if ( ! $ ) {
				$ = typeof window !== 'undefined' ? // jQuery's factory checks for a global window
					require('jquery') :
					require('jquery')( root );
			}

			return factory( $, root, root.document );
		};
	}
	else {
		// Browser
		window.DataTable = factory( jQuery, window, document );
	}
}
(function( $, window, document, undefined ) {
	"use strict";

	
	var DataTable = function ( selector, options )
	{
		// When creating with `new`, create a new DataTable, returning the API instance
		if (this instanceof DataTable) {
			return $(selector).DataTable(options);
		}
		else {
			// Argument switching
			options = selector;
		}
	
		/**
		 * Perform a jQuery selector action on the table's TR elements (from the tbody) and
		 * return the resulting jQuery object.
		 *  @param {string|node|jQuery} sSelector jQuery selector or node collection to act on
		 *  @param {object} [oOpts] Optional parameters for modifying the rows to be included
		 *  @param {string} [oOpts.filter=none] Select TR elements that meet the current filter
		 *    criterion ("applied") or all TR elements (i.e. no filter).
		 *  @param {string} [oOpts.order=current] Order of the TR elements in the processed array.
		 *    Can be either 'current', whereby the current sorting of the table is used, or
		 *    'original' whereby the original order the data was read into the table is used.
		 *  @param {string} [oOpts.page=all] Limit the selection to the currently displayed page
		 *    ("current") or not ("all"). If 'current' is given, then order is assumed to be
		 *    'current' and filter is 'applied', regardless of what they might be given as.
		 *  @returns {object} jQuery object, filtered by the given selector.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Highlight every second row
		 *      oTable.$('tr:odd').css('backgroundColor', 'blue');
		 *    } );
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Filter to rows with 'Webkit' in them, add a background colour and then
		 *      // remove the filter, thus highlighting the 'Webkit' rows only.
		 *      oTable.fnFilter('Webkit');
		 *      oTable.$('tr', {"search": "applied"}).css('backgroundColor', 'blue');
		 *      oTable.fnFilter('');
		 *    } );
		 */
		this.$ = function ( sSelector, oOpts )
		{
			return this.api(true).$( sSelector, oOpts );
		};
		
		
		/**
		 * Almost identical to $ in operation, but in this case returns the data for the matched
		 * rows - as such, the jQuery selector used should match TR row nodes or TD/TH cell nodes
		 * rather than any descendants, so the data can be obtained for the row/cell. If matching
		 * rows are found, the data returned is the original data array/object that was used to
		 * create the row (or a generated array if from a DOM source).
		 *
		 * This method is often useful in-combination with $ where both functions are given the
		 * same parameters and the array indexes will match identically.
		 *  @param {string|node|jQuery} sSelector jQuery selector or node collection to act on
		 *  @param {object} [oOpts] Optional parameters for modifying the rows to be included
		 *  @param {string} [oOpts.filter=none] Select elements that meet the current filter
		 *    criterion ("applied") or all elements (i.e. no filter).
		 *  @param {string} [oOpts.order=current] Order of the data in the processed array.
		 *    Can be either 'current', whereby the current sorting of the table is used, or
		 *    'original' whereby the original order the data was read into the table is used.
		 *  @param {string} [oOpts.page=all] Limit the selection to the currently displayed page
		 *    ("current") or not ("all"). If 'current' is given, then order is assumed to be
		 *    'current' and filter is 'applied', regardless of what they might be given as.
		 *  @returns {array} Data for the matched elements. If any elements, as a result of the
		 *    selector, were not TR, TD or TH elements in the DataTable, they will have a null
		 *    entry in the array.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Get the data from the first row in the table
		 *      var data = oTable._('tr:first');
		 *
		 *      // Do something useful with the data
		 *      alert( "First cell is: "+data[0] );
		 *    } );
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Filter to 'Webkit' and get all data for
		 *      oTable.fnFilter('Webkit');
		 *      var data = oTable._('tr', {"search": "applied"});
		 *
		 *      // Do something with the data
		 *      alert( data.length+" rows matched the search" );
		 *    } );
		 */
		this._ = function ( sSelector, oOpts )
		{
			return this.api(true).rows( sSelector, oOpts ).data();
		};
		
		
		/**
		 * Create a DataTables Api instance, with the currently selected tables for
		 * the Api's context.
		 * @param {boolean} [traditional=false] Set the API instance's context to be
		 *   only the table referred to by the `DataTable.ext.iApiIndex` option, as was
		 *   used in the API presented by DataTables 1.9- (i.e. the traditional mode),
		 *   or if all tables captured in the jQuery object should be used.
		 * @return {DataTables.Api}
		 */
		this.api = function ( traditional )
		{
			return traditional ?
				new _Api(
					_fnSettingsFromNode( this[ _ext.iApiIndex ] )
				) :
				new _Api( this );
		};
		
		
		/**
		 * Add a single new row or multiple rows of data to the table. Please note
		 * that this is suitable for client-side processing only - if you are using
		 * server-side processing (i.e. "bServerSide": true), then to add data, you
		 * must add it to the data source, i.e. the server-side, through an Ajax call.
		 *  @param {array|object} data The data to be added to the table. This can be:
		 *    <ul>
		 *      <li>1D array of data - add a single row with the data provided</li>
		 *      <li>2D array of arrays - add multiple rows in a single call</li>
		 *      <li>object - data object when using <i>mData</i></li>
		 *      <li>array of objects - multiple data objects when using <i>mData</i></li>
		 *    </ul>
		 *  @param {bool} [redraw=true] redraw the table or not
		 *  @returns {array} An array of integers, representing the list of indexes in
		 *    <i>aoData</i> ({@link DataTable.models.oSettings}) that have been added to
		 *    the table.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    // Global var for counter
		 *    var giCount = 2;
		 *
		 *    $(document).ready(function() {
		 *      $('#example').dataTable();
		 *    } );
		 *
		 *    function fnClickAddRow() {
		 *      $('#example').dataTable().fnAddData( [
		 *        giCount+".1",
		 *        giCount+".2",
		 *        giCount+".3",
		 *        giCount+".4" ]
		 *      );
		 *
		 *      giCount++;
		 *    }
		 */
		this.fnAddData = function( data, redraw )
		{
			var api = this.api( true );
		
			/* Check if we want to add multiple rows or not */
			var rows = Array.isArray(data) && ( Array.isArray(data[0]) || $.isPlainObject(data[0]) ) ?
				api.rows.add( data ) :
				api.row.add( data );
		
			if ( redraw === undefined || redraw ) {
				api.draw();
			}
		
			return rows.flatten().toArray();
		};
		
		
		/**
		 * This function will make DataTables recalculate the column sizes, based on the data
		 * contained in the table and the sizes applied to the columns (in the DOM, CSS or
		 * through the sWidth parameter). This can be useful when the width of the table's
		 * parent element changes (for example a window resize).
		 *  @param {boolean} [bRedraw=true] Redraw the table or not, you will typically want to
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable( {
		 *        "sScrollY": "200px",
		 *        "bPaginate": false
		 *      } );
		 *
		 *      $(window).on('resize', function () {
		 *        oTable.fnAdjustColumnSizing();
		 *      } );
		 *    } );
		 */
		this.fnAdjustColumnSizing = function ( bRedraw )
		{
			var api = this.api( true ).columns.adjust();
			var settings = api.settings()[0];
			var scroll = settings.oScroll;
		
			if ( bRedraw === undefined || bRedraw ) {
				api.draw( false );
			}
			else if ( scroll.sX !== "" || scroll.sY !== "" ) {
				/* If not redrawing, but scrolling, we want to apply the new column sizes anyway */
				_fnScrollDraw( settings );
			}
		};
		
		
		/**
		 * Quickly and simply clear a table
		 *  @param {bool} [bRedraw=true] redraw the table or not
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Immediately 'nuke' the current rows (perhaps waiting for an Ajax callback...)
		 *      oTable.fnClearTable();
		 *    } );
		 */
		this.fnClearTable = function( bRedraw )
		{
			var api = this.api( true ).clear();
		
			if ( bRedraw === undefined || bRedraw ) {
				api.draw();
			}
		};
		
		
		/**
		 * The exact opposite of 'opening' a row, this function will close any rows which
		 * are currently 'open'.
		 *  @param {node} nTr the table row to 'close'
		 *  @returns {int} 0 on success, or 1 if failed (can't find the row)
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable;
		 *
		 *      // 'open' an information row when a row is clicked on
		 *      $('#example tbody tr').click( function () {
		 *        if ( oTable.fnIsOpen(this) ) {
		 *          oTable.fnClose( this );
		 *        } else {
		 *          oTable.fnOpen( this, "Temporary row opened", "info_row" );
		 *        }
		 *      } );
		 *
		 *      oTable = $('#example').dataTable();
		 *    } );
		 */
		this.fnClose = function( nTr )
		{
			this.api( true ).row( nTr ).child.hide();
		};
		
		
		/**
		 * Remove a row for the table
		 *  @param {mixed} target The index of the row from aoData to be deleted, or
		 *    the TR element you want to delete
		 *  @param {function|null} [callBack] Callback function
		 *  @param {bool} [redraw=true] Redraw the table or not
		 *  @returns {array} The row that was deleted
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Immediately remove the first row
		 *      oTable.fnDeleteRow( 0 );
		 *    } );
		 */
		this.fnDeleteRow = function( target, callback, redraw )
		{
			var api = this.api( true );
			var rows = api.rows( target );
			var settings = rows.settings()[0];
			var data = settings.aoData[ rows[0][0] ];
		
			rows.remove();
		
			if ( callback ) {
				callback.call( this, settings, data );
			}
		
			if ( redraw === undefined || redraw ) {
				api.draw();
			}
		
			return data;
		};
		
		
		/**
		 * Restore the table to it's original state in the DOM by removing all of DataTables
		 * enhancements, alterations to the DOM structure of the table and event listeners.
		 *  @param {boolean} [remove=false] Completely remove the table from the DOM
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      // This example is fairly pointless in reality, but shows how fnDestroy can be used
		 *      var oTable = $('#example').dataTable();
		 *      oTable.fnDestroy();
		 *    } );
		 */
		this.fnDestroy = function ( remove )
		{
			this.api( true ).destroy( remove );
		};
		
		
		/**
		 * Redraw the table
		 *  @param {bool} [complete=true] Re-filter and resort (if enabled) the table before the draw.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Re-draw the table - you wouldn't want to do it here, but it's an example :-)
		 *      oTable.fnDraw();
		 *    } );
		 */
		this.fnDraw = function( complete )
		{
			// Note that this isn't an exact match to the old call to _fnDraw - it takes
			// into account the new data, but can hold position.
			this.api( true ).draw( complete );
		};
		
		
		/**
		 * Filter the input based on data
		 *  @param {string} sInput String to filter the table on
		 *  @param {int|null} [iColumn] Column to limit filtering to
		 *  @param {bool} [bRegex=false] Treat as regular expression or not
		 *  @param {bool} [bSmart=true] Perform smart filtering or not
		 *  @param {bool} [bShowGlobal=true] Show the input global filter in it's input box(es)
		 *  @param {bool} [bCaseInsensitive=true] Do case-insensitive matching (true) or not (false)
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Sometime later - filter...
		 *      oTable.fnFilter( 'test string' );
		 *    } );
		 */
		this.fnFilter = function( sInput, iColumn, bRegex, bSmart, bShowGlobal, bCaseInsensitive )
		{
			var api = this.api( true );
		
			if ( iColumn === null || iColumn === undefined ) {
				api.search( sInput, bRegex, bSmart, bCaseInsensitive );
			}
			else {
				api.column( iColumn ).search( sInput, bRegex, bSmart, bCaseInsensitive );
			}
		
			api.draw();
		};
		
		
		/**
		 * Get the data for the whole table, an individual row or an individual cell based on the
		 * provided parameters.
		 *  @param {int|node} [src] A TR row node, TD/TH cell node or an integer. If given as
		 *    a TR node then the data source for the whole row will be returned. If given as a
		 *    TD/TH cell node then iCol will be automatically calculated and the data for the
		 *    cell returned. If given as an integer, then this is treated as the aoData internal
		 *    data index for the row (see fnGetPosition) and the data for that row used.
		 *  @param {int} [col] Optional column index that you want the data of.
		 *  @returns {array|object|string} If mRow is undefined, then the data for all rows is
		 *    returned. If mRow is defined, just data for that row, and is iCol is
		 *    defined, only data for the designated cell is returned.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    // Row data
		 *    $(document).ready(function() {
		 *      oTable = $('#example').dataTable();
		 *
		 *      oTable.$('tr').click( function () {
		 *        var data = oTable.fnGetData( this );
		 *        // ... do something with the array / object of data for the row
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Individual cell data
		 *    $(document).ready(function() {
		 *      oTable = $('#example').dataTable();
		 *
		 *      oTable.$('td').click( function () {
		 *        var sData = oTable.fnGetData( this );
		 *        alert( 'The cell clicked on had the value of '+sData );
		 *      } );
		 *    } );
		 */
		this.fnGetData = function( src, col )
		{
			var api = this.api( true );
		
			if ( src !== undefined ) {
				var type = src.nodeName ? src.nodeName.toLowerCase() : '';
		
				return col !== undefined || type == 'td' || type == 'th' ?
					api.cell( src, col ).data() :
					api.row( src ).data() || null;
			}
		
			return api.data().toArray();
		};
		
		
		/**
		 * Get an array of the TR nodes that are used in the table's body. Note that you will
		 * typically want to use the '$' API method in preference to this as it is more
		 * flexible.
		 *  @param {int} [iRow] Optional row index for the TR element you want
		 *  @returns {array|node} If iRow is undefined, returns an array of all TR elements
		 *    in the table's body, or iRow is defined, just the TR element requested.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Get the nodes from the table
		 *      var nNodes = oTable.fnGetNodes( );
		 *    } );
		 */
		this.fnGetNodes = function( iRow )
		{
			var api = this.api( true );
		
			return iRow !== undefined ?
				api.row( iRow ).node() :
				api.rows().nodes().flatten().toArray();
		};
		
		
		/**
		 * Get the array indexes of a particular cell from it's DOM element
		 * and column index including hidden columns
		 *  @param {node} node this can either be a TR, TD or TH in the table's body
		 *  @returns {int} If nNode is given as a TR, then a single index is returned, or
		 *    if given as a cell, an array of [row index, column index (visible),
		 *    column index (all)] is given.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      $('#example tbody td').click( function () {
		 *        // Get the position of the current data from the node
		 *        var aPos = oTable.fnGetPosition( this );
		 *
		 *        // Get the data array for this row
		 *        var aData = oTable.fnGetData( aPos[0] );
		 *
		 *        // Update the data array and return the value
		 *        aData[ aPos[1] ] = 'clicked';
		 *        this.innerHTML = 'clicked';
		 *      } );
		 *
		 *      // Init DataTables
		 *      oTable = $('#example').dataTable();
		 *    } );
		 */
		this.fnGetPosition = function( node )
		{
			var api = this.api( true );
			var nodeName = node.nodeName.toUpperCase();
		
			if ( nodeName == 'TR' ) {
				return api.row( node ).index();
			}
			else if ( nodeName == 'TD' || nodeName == 'TH' ) {
				var cell = api.cell( node ).index();
		
				return [
					cell.row,
					cell.columnVisible,
					cell.column
				];
			}
			return null;
		};
		
		
		/**
		 * Check to see if a row is 'open' or not.
		 *  @param {node} nTr the table row to check
		 *  @returns {boolean} true if the row is currently open, false otherwise
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable;
		 *
		 *      // 'open' an information row when a row is clicked on
		 *      $('#example tbody tr').click( function () {
		 *        if ( oTable.fnIsOpen(this) ) {
		 *          oTable.fnClose( this );
		 *        } else {
		 *          oTable.fnOpen( this, "Temporary row opened", "info_row" );
		 *        }
		 *      } );
		 *
		 *      oTable = $('#example').dataTable();
		 *    } );
		 */
		this.fnIsOpen = function( nTr )
		{
			return this.api( true ).row( nTr ).child.isShown();
		};
		
		
		/**
		 * This function will place a new row directly after a row which is currently
		 * on display on the page, with the HTML contents that is passed into the
		 * function. This can be used, for example, to ask for confirmation that a
		 * particular record should be deleted.
		 *  @param {node} nTr The table row to 'open'
		 *  @param {string|node|jQuery} mHtml The HTML to put into the row
		 *  @param {string} sClass Class to give the new TD cell
		 *  @returns {node} The row opened. Note that if the table row passed in as the
		 *    first parameter, is not found in the table, this method will silently
		 *    return.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable;
		 *
		 *      // 'open' an information row when a row is clicked on
		 *      $('#example tbody tr').click( function () {
		 *        if ( oTable.fnIsOpen(this) ) {
		 *          oTable.fnClose( this );
		 *        } else {
		 *          oTable.fnOpen( this, "Temporary row opened", "info_row" );
		 *        }
		 *      } );
		 *
		 *      oTable = $('#example').dataTable();
		 *    } );
		 */
		this.fnOpen = function( nTr, mHtml, sClass )
		{
			return this.api( true )
				.row( nTr )
				.child( mHtml, sClass )
				.show()
				.child()[0];
		};
		
		
		/**
		 * Change the pagination - provides the internal logic for pagination in a simple API
		 * function. With this function you can have a DataTables table go to the next,
		 * previous, first or last pages.
		 *  @param {string|int} mAction Paging action to take: "first", "previous", "next" or "last"
		 *    or page number to jump to (integer), note that page 0 is the first page.
		 *  @param {bool} [bRedraw=true] Redraw the table or not
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *      oTable.fnPageChange( 'next' );
		 *    } );
		 */
		this.fnPageChange = function ( mAction, bRedraw )
		{
			var api = this.api( true ).page( mAction );
		
			if ( bRedraw === undefined || bRedraw ) {
				api.draw(false);
			}
		};
		
		
		/**
		 * Show a particular column
		 *  @param {int} iCol The column whose display should be changed
		 *  @param {bool} bShow Show (true) or hide (false) the column
		 *  @param {bool} [bRedraw=true] Redraw the table or not
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Hide the second column after initialisation
		 *      oTable.fnSetColumnVis( 1, false );
		 *    } );
		 */
		this.fnSetColumnVis = function ( iCol, bShow, bRedraw )
		{
			var api = this.api( true ).column( iCol ).visible( bShow );
		
			if ( bRedraw === undefined || bRedraw ) {
				api.columns.adjust().draw();
			}
		};
		
		
		/**
		 * Get the settings for a particular table for external manipulation
		 *  @returns {object} DataTables settings object. See
		 *    {@link DataTable.models.oSettings}
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *      var oSettings = oTable.fnSettings();
		 *
		 *      // Show an example parameter from the settings
		 *      alert( oSettings._iDisplayStart );
		 *    } );
		 */
		this.fnSettings = function()
		{
			return _fnSettingsFromNode( this[_ext.iApiIndex] );
		};
		
		
		/**
		 * Sort the table by a particular column
		 *  @param {int} iCol the data index to sort on. Note that this will not match the
		 *    'display index' if you have hidden data entries
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Sort immediately with columns 0 and 1
		 *      oTable.fnSort( [ [0,'asc'], [1,'asc'] ] );
		 *    } );
		 */
		this.fnSort = function( aaSort )
		{
			this.api( true ).order( aaSort ).draw();
		};
		
		
		/**
		 * Attach a sort listener to an element for a given column
		 *  @param {node} nNode the element to attach the sort listener to
		 *  @param {int} iColumn the column that a click on this node will sort on
		 *  @param {function} [fnCallback] callback function when sort is run
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Sort on column 1, when 'sorter' is clicked on
		 *      oTable.fnSortListener( document.getElementById('sorter'), 1 );
		 *    } );
		 */
		this.fnSortListener = function( nNode, iColumn, fnCallback )
		{
			this.api( true ).order.listener( nNode, iColumn, fnCallback );
		};
		
		
		/**
		 * Update a table cell or row - this method will accept either a single value to
		 * update the cell with, an array of values with one element for each column or
		 * an object in the same format as the original data source. The function is
		 * self-referencing in order to make the multi column updates easier.
		 *  @param {object|array|string} mData Data to update the cell/row with
		 *  @param {node|int} mRow TR element you want to update or the aoData index
		 *  @param {int} [iColumn] The column to update, give as null or undefined to
		 *    update a whole row.
		 *  @param {bool} [bRedraw=true] Redraw the table or not
		 *  @param {bool} [bAction=true] Perform pre-draw actions or not
		 *  @returns {int} 0 on success, 1 on error
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *      oTable.fnUpdate( 'Example update', 0, 0 ); // Single cell
		 *      oTable.fnUpdate( ['a', 'b', 'c', 'd', 'e'], $('tbody tr')[0] ); // Row
		 *    } );
		 */
		this.fnUpdate = function( mData, mRow, iColumn, bRedraw, bAction )
		{
			var api = this.api( true );
		
			if ( iColumn === undefined || iColumn === null ) {
				api.row( mRow ).data( mData );
			}
			else {
				api.cell( mRow, iColumn ).data( mData );
			}
		
			if ( bAction === undefined || bAction ) {
				api.columns.adjust();
			}
		
			if ( bRedraw === undefined || bRedraw ) {
				api.draw();
			}
			return 0;
		};
		
		
		/**
		 * Provide a common method for plug-ins to check the version of DataTables being used, in order
		 * to ensure compatibility.
		 *  @param {string} sVersion Version string to check for, in the format "X.Y.Z". Note that the
		 *    formats "X" and "X.Y" are also acceptable.
		 *  @returns {boolean} true if this version of DataTables is greater or equal to the required
		 *    version, or false if this version of DataTales is not suitable
		 *  @method
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *      alert( oTable.fnVersionCheck( '1.9.0' ) );
		 *    } );
		 */
		this.fnVersionCheck = _ext.fnVersionCheck;
		
	
		var _that = this;
		var emptyInit = options === undefined;
		var len = this.length;
	
		if ( emptyInit ) {
			options = {};
		}
	
		this.oApi = this.internal = _ext.internal;
	
		// Extend with old style plug-in API methods
		for ( var fn in DataTable.ext.internal ) {
			if ( fn ) {
				this[fn] = _fnExternApiFunc(fn);
			}
		}
	
		this.each(function() {
			// For each initialisation we want to give it a clean initialisation
			// object that can be bashed around
			var o = {};
			var oInit = len > 1 ? // optimisation for single table case
				_fnExtend( o, options, true ) :
				options;
	
			/*global oInit,_that,emptyInit*/
			var i=0, iLen, j, jLen, k, kLen;
			var sId = this.getAttribute( 'id' );
			var bInitHandedOff = false;
			var defaults = DataTable.defaults;
			var $this = $(this);
			
			
			/* Sanity check */
			if ( this.nodeName.toLowerCase() != 'table' )
			{
				_fnLog( null, 0, 'Non-table node initialisation ('+this.nodeName+')', 2 );
				return;
			}
			
			/* Backwards compatibility for the defaults */
			_fnCompatOpts( defaults );
			_fnCompatCols( defaults.column );
			
			/* Convert the camel-case defaults to Hungarian */
			_fnCamelToHungarian( defaults, defaults, true );
			_fnCamelToHungarian( defaults.column, defaults.column, true );
			
			/* Setting up the initialisation object */
			_fnCamelToHungarian( defaults, $.extend( oInit, $this.data() ), true );
			
			
			
			/* Check to see if we are re-initialising a table */
			var allSettings = DataTable.settings;
			for ( i=0, iLen=allSettings.length ; i<iLen ; i++ )
			{
				var s = allSettings[i];
			
				/* Base check on table node */
				if (
					s.nTable == this ||
					(s.nTHead && s.nTHead.parentNode == this) ||
					(s.nTFoot && s.nTFoot.parentNode == this)
				) {
					var bRetrieve = oInit.bRetrieve !== undefined ? oInit.bRetrieve : defaults.bRetrieve;
					var bDestroy = oInit.bDestroy !== undefined ? oInit.bDestroy : defaults.bDestroy;
			
					if ( emptyInit || bRetrieve )
					{
						return s.oInstance;
					}
					else if ( bDestroy )
					{
						s.oInstance.fnDestroy();
						break;
					}
					else
					{
						_fnLog( s, 0, 'Cannot reinitialise DataTable', 3 );
						return;
					}
				}
			
				/* If the element we are initialising has the same ID as a table which was previously
				 * initialised, but the table nodes don't match (from before) then we destroy the old
				 * instance by simply deleting it. This is under the assumption that the table has been
				 * destroyed by other methods. Anyone using non-id selectors will need to do this manually
				 */
				if ( s.sTableId == this.id )
				{
					allSettings.splice( i, 1 );
					break;
				}
			}
			
			/* Ensure the table has an ID - required for accessibility */
			if ( sId === null || sId === "" )
			{
				sId = "DataTables_Table_"+(DataTable.ext._unique++);
				this.id = sId;
			}
			
			/* Create the settings object for this table and set some of the default parameters */
			var oSettings = $.extend( true, {}, DataTable.models.oSettings, {
				"sDestroyWidth": $this[0].style.width,
				"sInstance":     sId,
				"sTableId":      sId
			} );
			oSettings.nTable = this;
			oSettings.oApi   = _that.internal;
			oSettings.oInit  = oInit;
			
			allSettings.push( oSettings );
			
			// Need to add the instance after the instance after the settings object has been added
			// to the settings array, so we can self reference the table instance if more than one
			oSettings.oInstance = (_that.length===1) ? _that : $this.dataTable();
			
			// Backwards compatibility, before we apply all the defaults
			_fnCompatOpts( oInit );
			_fnLanguageCompat( oInit.oLanguage );
			
			// If the length menu is given, but the init display length is not, use the length menu
			if ( oInit.aLengthMenu && ! oInit.iDisplayLength )
			{
				oInit.iDisplayLength = Array.isArray( oInit.aLengthMenu[0] ) ?
					oInit.aLengthMenu[0][0] : oInit.aLengthMenu[0];
			}
			
			// Apply the defaults and init options to make a single init object will all
			// options defined from defaults and instance options.
			oInit = _fnExtend( $.extend( true, {}, defaults ), oInit );
			
			
			// Map the initialisation options onto the settings object
			_fnMap( oSettings.oFeatures, oInit, [
				"bPaginate",
				"bLengthChange",
				"bFilter",
				"bSort",
				"bSortMulti",
				"bInfo",
				"bProcessing",
				"bAutoWidth",
				"bSortClasses",
				"bServerSide",
				"bDeferRender"
			] );
			_fnMap( oSettings, oInit, [
				"asStripeClasses",
				"ajax",
				"fnServerData",
				"fnFormatNumber",
				"sServerMethod",
				"aaSorting",
				"aaSortingFixed",
				"aLengthMenu",
				"sPaginationType",
				"sAjaxSource",
				"sAjaxDataProp",
				"iStateDuration",
				"sDom",
				"bSortCellsTop",
				"iTabIndex",
				"fnStateLoadCallback",
				"fnStateSaveCallback",
				"renderer",
				"searchDelay",
				"rowId",
				[ "iCookieDuration", "iStateDuration" ], // backwards compat
				[ "oSearch", "oPreviousSearch" ],
				[ "aoSearchCols", "aoPreSearchCols" ],
				[ "iDisplayLength", "_iDisplayLength" ]
			] );
			_fnMap( oSettings.oScroll, oInit, [
				[ "sScrollX", "sX" ],
				[ "sScrollXInner", "sXInner" ],
				[ "sScrollY", "sY" ],
				[ "bScrollCollapse", "bCollapse" ]
			] );
			_fnMap( oSettings.oLanguage, oInit, "fnInfoCallback" );
			
			/* Callback functions which are array driven */
			_fnCallbackReg( oSettings, 'aoDrawCallback',       oInit.fnDrawCallback,      'user' );
			_fnCallbackReg( oSettings, 'aoServerParams',       oInit.fnServerParams,      'user' );
			_fnCallbackReg( oSettings, 'aoStateSaveParams',    oInit.fnStateSaveParams,   'user' );
			_fnCallbackReg( oSettings, 'aoStateLoadParams',    oInit.fnStateLoadParams,   'user' );
			_fnCallbackReg( oSettings, 'aoStateLoaded',        oInit.fnStateLoaded,       'user' );
			_fnCallbackReg( oSettings, 'aoRowCallback',        oInit.fnRowCallback,       'user' );
			_fnCallbackReg( oSettings, 'aoRowCreatedCallback', oInit.fnCreatedRow,        'user' );
			_fnCallbackReg( oSettings, 'aoHeaderCallback',     oInit.fnHeaderCallback,    'user' );
			_fnCallbackReg( oSettings, 'aoFooterCallback',     oInit.fnFooterCallback,    'user' );
			_fnCallbackReg( oSettings, 'aoInitComplete',       oInit.fnInitComplete,      'user' );
			_fnCallbackReg( oSettings, 'aoPreDrawCallback',    oInit.fnPreDrawCallback,   'user' );
			
			oSettings.rowIdFn = _fnGetObjectDataFn( oInit.rowId );
			
			/* Browser support detection */
			_fnBrowserDetect( oSettings );
			
			var oClasses = oSettings.oClasses;
			
			$.extend( oClasses, DataTable.ext.classes, oInit.oClasses );
			$this.addClass( oClasses.sTable );
			
			
			if ( oSettings.iInitDisplayStart === undefined )
			{
				/* Display start point, taking into account the save saving */
				oSettings.iInitDisplayStart = oInit.iDisplayStart;
				oSettings._iDisplayStart = oInit.iDisplayStart;
			}
			
			if ( oInit.iDeferLoading !== null )
			{
				oSettings.bDeferLoading = true;
				var tmp = Array.isArray( oInit.iDeferLoading );
				oSettings._iRecordsDisplay = tmp ? oInit.iDeferLoading[0] : oInit.iDeferLoading;
				oSettings._iRecordsTotal = tmp ? oInit.iDeferLoading[1] : oInit.iDeferLoading;
			}
			
			/* Language definitions */
			var oLanguage = oSettings.oLanguage;
			$.extend( true, oLanguage, oInit.oLanguage );
			
			if ( oLanguage.sUrl )
			{
				/* Get the language definitions from a file - because this Ajax call makes the language
				 * get async to the remainder of this function we use bInitHandedOff to indicate that
				 * _fnInitialise will be fired by the returned Ajax handler, rather than the constructor
				 */
				$.ajax( {
					dataType: 'json',
					url: oLanguage.sUrl,
					success: function ( json ) {
						_fnCamelToHungarian( defaults.oLanguage, json );
						_fnLanguageCompat( json );
						$.extend( true, oLanguage, json );
			
						_fnCallbackFire( oSettings, null, 'i18n', [oSettings]);
						_fnInitialise( oSettings );
					},
					error: function () {
						// Error occurred loading language file, continue on as best we can
						_fnInitialise( oSettings );
					}
				} );
				bInitHandedOff = true;
			}
			else {
				_fnCallbackFire( oSettings, null, 'i18n', [oSettings]);
			}
			
			/*
			 * Stripes
			 */
			if ( oInit.asStripeClasses === null )
			{
				oSettings.asStripeClasses =[
					oClasses.sStripeOdd,
					oClasses.sStripeEven
				];
			}
			
			/* Remove row stripe classes if they are already on the table row */
			var stripeClasses = oSettings.asStripeClasses;
			var rowOne = $this.children('tbody').find('tr').eq(0);
			if ( $.inArray( true, $.map( stripeClasses, function(el, i) {
				return rowOne.hasClass(el);
			} ) ) !== -1 ) {
				$('tbody tr', this).removeClass( stripeClasses.join(' ') );
				oSettings.asDestroyStripes = stripeClasses.slice();
			}
			
			/*
			 * Columns
			 * See if we should load columns automatically or use defined ones
			 */
			var anThs = [];
			var aoColumnsInit;
			var nThead = this.getElementsByTagName('thead');
			if ( nThead.length !== 0 )
			{
				_fnDetectHeader( oSettings.aoHeader, nThead[0] );
				anThs = _fnGetUniqueThs( oSettings );
			}
			
			/* If not given a column array, generate one with nulls */
			if ( oInit.aoColumns === null )
			{
				aoColumnsInit = [];
				for ( i=0, iLen=anThs.length ; i<iLen ; i++ )
				{
					aoColumnsInit.push( null );
				}
			}
			else
			{
				aoColumnsInit = oInit.aoColumns;
			}
			
			/* Add the columns */
			for ( i=0, iLen=aoColumnsInit.length ; i<iLen ; i++ )
			{
				_fnAddColumn( oSettings, anThs ? anThs[i] : null );
			}
			
			/* Apply the column definitions */
			_fnApplyColumnDefs( oSettings, oInit.aoColumnDefs, aoColumnsInit, function (iCol, oDef) {
				_fnColumnOptions( oSettings, iCol, oDef );
			} );
			
			/* HTML5 attribute detection - build an mData object automatically if the
			 * attributes are found
			 */
			if ( rowOne.length ) {
				var a = function ( cell, name ) {
					return cell.getAttribute( 'data-'+name ) !== null ? name : null;
				};
			
				$( rowOne[0] ).children('th, td').each( function (i, cell) {
					var col = oSettings.aoColumns[i];
			
					if ( col.mData === i ) {
						var sort = a( cell, 'sort' ) || a( cell, 'order' );
						var filter = a( cell, 'filter' ) || a( cell, 'search' );
			
						if ( sort !== null || filter !== null ) {
							col.mData = {
								_:      i+'.display',
								sort:   sort !== null   ? i+'.@data-'+sort   : undefined,
								type:   sort !== null   ? i+'.@data-'+sort   : undefined,
								filter: filter !== null ? i+'.@data-'+filter : undefined
							};
			
							_fnColumnOptions( oSettings, i );
						}
					}
				} );
			}
			
			var features = oSettings.oFeatures;
			var loadedInit = function () {
				/*
				 * Sorting
				 * @todo For modularisation (1.11) this needs to do into a sort start up handler
				 */
			
				// If aaSorting is not defined, then we use the first indicator in asSorting
				// in case that has been altered, so the default sort reflects that option
				if ( oInit.aaSorting === undefined ) {
					var sorting = oSettings.aaSorting;
					for ( i=0, iLen=sorting.length ; i<iLen ; i++ ) {
						sorting[i][1] = oSettings.aoColumns[ i ].asSorting[0];
					}
				}
			
				/* Do a first pass on the sorting classes (allows any size changes to be taken into
				 * account, and also will apply sorting disabled classes if disabled
				 */
				_fnSortingClasses( oSettings );
			
				if ( features.bSort ) {
					_fnCallbackReg( oSettings, 'aoDrawCallback', function () {
						if ( oSettings.bSorted ) {
							var aSort = _fnSortFlatten( oSettings );
							var sortedColumns = {};
			
							$.each( aSort, function (i, val) {
								sortedColumns[ val.src ] = val.dir;
							} );
			
							_fnCallbackFire( oSettings, null, 'order', [oSettings, aSort, sortedColumns] );
							_fnSortAria( oSettings );
						}
					} );
				}
			
				_fnCallbackReg( oSettings, 'aoDrawCallback', function () {
					if ( oSettings.bSorted || _fnDataSource( oSettings ) === 'ssp' || features.bDeferRender ) {
						_fnSortingClasses( oSettings );
					}
				}, 'sc' );
			
			
				/*
				 * Final init
				 * Cache the header, body and footer as required, creating them if needed
				 */
			
				// Work around for Webkit bug 83867 - store the caption-side before removing from doc
				var captions = $this.children('caption').each( function () {
					this._captionSide = $(this).css('caption-side');
				} );
			
				var thead = $this.children('thead');
				if ( thead.length === 0 ) {
					thead = $('<thead/>').appendTo($this);
				}
				oSettings.nTHead = thead[0];
			
				var tbody = $this.children('tbody');
				if ( tbody.length === 0 ) {
					tbody = $('<tbody/>').insertAfter(thead);
				}
				oSettings.nTBody = tbody[0];
			
				var tfoot = $this.children('tfoot');
				if ( tfoot.length === 0 && captions.length > 0 && (oSettings.oScroll.sX !== "" || oSettings.oScroll.sY !== "") ) {
					// If we are a scrolling table, and no footer has been given, then we need to create
					// a tfoot element for the caption element to be appended to
					tfoot = $('<tfoot/>').appendTo($this);
				}
			
				if ( tfoot.length === 0 || tfoot.children().length === 0 ) {
					$this.addClass( oClasses.sNoFooter );
				}
				else if ( tfoot.length > 0 ) {
					oSettings.nTFoot = tfoot[0];
					_fnDetectHeader( oSettings.aoFooter, oSettings.nTFoot );
				}
			
				/* Check if there is data passing into the constructor */
				if ( oInit.aaData ) {
					for ( i=0 ; i<oInit.aaData.length ; i++ ) {
						_fnAddData( oSettings, oInit.aaData[ i ] );
					}
				}
				else if ( oSettings.bDeferLoading || _fnDataSource( oSettings ) == 'dom' ) {
					/* Grab the data from the page - only do this when deferred loading or no Ajax
					 * source since there is no point in reading the DOM data if we are then going
					 * to replace it with Ajax data
					 */
					_fnAddTr( oSettings, $(oSettings.nTBody).children('tr') );
				}
			
				/* Copy the data index array */
				oSettings.aiDisplay = oSettings.aiDisplayMaster.slice();
			
				/* Initialisation complete - table can be drawn */
				oSettings.bInitialised = true;
			
				/* Check if we need to initialise the table (it might not have been handed off to the
				 * language processor)
				 */
				if ( bInitHandedOff === false ) {
					_fnInitialise( oSettings );
				}
			};
			
			/* Must be done after everything which can be overridden by the state saving! */
			_fnCallbackReg( oSettings, 'aoDrawCallback', _fnSaveState, 'state_save' );
			
			if ( oInit.bStateSave )
			{
				features.bStateSave = true;
				_fnLoadState( oSettings, oInit, loadedInit );
			}
			else {
				loadedInit();
			}
			
		} );
		_that = null;
		return this;
	};
	
	
	/*
	 * It is useful to have variables which are scoped locally so only the
	 * DataTables functions can access them and they don't leak into global space.
	 * At the same time these functions are often useful over multiple files in the
	 * core and API, so we list, or at least document, all variables which are used
	 * by DataTables as private variables here. This also ensures that there is no
	 * clashing of variable names and that they can easily referenced for reuse.
	 */
	
	
	// Defined else where
	//  _selector_run
	//  _selector_opts
	//  _selector_first
	//  _selector_row_indexes
	
	var _ext; // DataTable.ext
	var _Api; // DataTable.Api
	var _api_register; // DataTable.Api.register
	var _api_registerPlural; // DataTable.Api.registerPlural
	
	var _re_dic = {};
	var _re_new_lines = /[\r\n\u2028]/g;
	var _re_html = /<.*?>/g;
	
	// This is not strict ISO8601 - Date.parse() is quite lax, although
	// implementations differ between browsers.
	var _re_date = /^\d{2,4}[\.\/\-]\d{1,2}[\.\/\-]\d{1,2}([T ]{1}\d{1,2}[:\.]\d{2}([\.:]\d{2})?)?$/;
	
	// Escape regular expression special characters
	var _re_escape_regex = new RegExp( '(\\' + [ '/', '.', '*', '+', '?', '|', '(', ')', '[', ']', '{', '}', '\\', '$', '^', '-' ].join('|\\') + ')', 'g' );
	
	// http://en.wikipedia.org/wiki/Foreign_exchange_market
	// - \u20BD - Russian ruble.
	// - \u20a9 - South Korean Won
	// - \u20BA - Turkish Lira
	// - \u20B9 - Indian Rupee
	// - R - Brazil (R$) and South Africa
	// - fr - Swiss Franc
	// - kr - Swedish krona, Norwegian krone and Danish krone
	// - \u2009 is thin space and \u202F is narrow no-break space, both used in many
	// - Ƀ - Bitcoin
	// - Ξ - Ethereum
	//   standards as thousands separators.
	var _re_formatted_numeric = /['\u00A0,$£€¥%\u2009\u202F\u20BD\u20a9\u20BArfkɃΞ]/gi;
	
	
	var _empty = function ( d ) {
		return !d || d === true || d === '-' ? true : false;
	};
	
	
	var _intVal = function ( s ) {
		var integer = parseInt( s, 10 );
		return !isNaN(integer) && isFinite(s) ? integer : null;
	};
	
	// Convert from a formatted number with characters other than `.` as the
	// decimal place, to a Javascript number
	var _numToDecimal = function ( num, decimalPoint ) {
		// Cache created regular expressions for speed as this function is called often
		if ( ! _re_dic[ decimalPoint ] ) {
			_re_dic[ decimalPoint ] = new RegExp( _fnEscapeRegex( decimalPoint ), 'g' );
		}
		return typeof num === 'string' && decimalPoint !== '.' ?
			num.replace( /\./g, '' ).replace( _re_dic[ decimalPoint ], '.' ) :
			num;
	};
	
	
	var _isNumber = function ( d, decimalPoint, formatted ) {
		var strType = typeof d === 'string';
	
		// If empty return immediately so there must be a number if it is a
		// formatted string (this stops the string "k", or "kr", etc being detected
		// as a formatted number for currency
		if ( _empty( d ) ) {
			return true;
		}
	
		if ( decimalPoint && strType ) {
			d = _numToDecimal( d, decimalPoint );
		}
	
		if ( formatted && strType ) {
			d = d.replace( _re_formatted_numeric, '' );
		}
	
		return !isNaN( parseFloat(d) ) && isFinite( d );
	};
	
	
	// A string without HTML in it can be considered to be HTML still
	var _isHtml = function ( d ) {
		return _empty( d ) || typeof d === 'string';
	};
	
	
	var _htmlNumeric = function ( d, decimalPoint, formatted ) {
		if ( _empty( d ) ) {
			return true;
		}
	
		var html = _isHtml( d );
		return ! html ?
			null :
			_isNumber( _stripHtml( d ), decimalPoint, formatted ) ?
				true :
				null;
	};
	
	
	var _pluck = function ( a, prop, prop2 ) {
		var out = [];
		var i=0, ien=a.length;
	
		// Could have the test in the loop for slightly smaller code, but speed
		// is essential here
		if ( prop2 !== undefined ) {
			for ( ; i<ien ; i++ ) {
				if ( a[i] && a[i][ prop ] ) {
					out.push( a[i][ prop ][ prop2 ] );
				}
			}
		}
		else {
			for ( ; i<ien ; i++ ) {
				if ( a[i] ) {
					out.push( a[i][ prop ] );
				}
			}
		}
	
		return out;
	};
	
	
	// Basically the same as _pluck, but rather than looping over `a` we use `order`
	// as the indexes to pick from `a`
	var _pluck_order = function ( a, order, prop, prop2 )
	{
		var out = [];
		var i=0, ien=order.length;
	
		// Could have the test in the loop for slightly smaller code, but speed
		// is essential here
		if ( prop2 !== undefined ) {
			for ( ; i<ien ; i++ ) {
				if ( a[ order[i] ][ prop ] ) {
					out.push( a[ order[i] ][ prop ][ prop2 ] );
				}
			}
		}
		else {
			for ( ; i<ien ; i++ ) {
				out.push( a[ order[i] ][ prop ] );
			}
		}
	
		return out;
	};
	
	
	var _range = function ( len, start )
	{
		var out = [];
		var end;
	
		if ( start === undefined ) {
			start = 0;
			end = len;
		}
		else {
			end = start;
			start = len;
		}
	
		for ( var i=start ; i<end ; i++ ) {
			out.push( i );
		}
	
		return out;
	};
	
	
	var _removeEmpty = function ( a )
	{
		var out = [];
	
		for ( var i=0, ien=a.length ; i<ien ; i++ ) {
			if ( a[i] ) { // careful - will remove all falsy values!
				out.push( a[i] );
			}
		}
	
		return out;
	};
	
	
	var _stripHtml = function ( d ) {
		return d.replace( _re_html, '' );
	};
	
	
	/**
	 * Determine if all values in the array are unique. This means we can short
	 * cut the _unique method at the cost of a single loop. A sorted array is used
	 * to easily check the values.
	 *
	 * @param  {array} src Source array
	 * @return {boolean} true if all unique, false otherwise
	 * @ignore
	 */
	var _areAllUnique = function ( src ) {
		if ( src.length < 2 ) {
			return true;
		}
	
		var sorted = src.slice().sort();
		var last = sorted[0];
	
		for ( var i=1, ien=sorted.length ; i<ien ; i++ ) {
			if ( sorted[i] === last ) {
				return false;
			}
	
			last = sorted[i];
		}
	
		return true;
	};
	
	
	/**
	 * Find the unique elements in a source array.
	 *
	 * @param  {array} src Source array
	 * @return {array} Array of unique items
	 * @ignore
	 */
	var _unique = function ( src )
	{
		if ( _areAllUnique( src ) ) {
			return src.slice();
		}
	
		// A faster unique method is to use object keys to identify used values,
		// but this doesn't work with arrays or objects, which we must also
		// consider. See jsperf.com/compare-array-unique-versions/4 for more
		// information.
		var
			out = [],
			val,
			i, ien=src.length,
			j, k=0;
	
		again: for ( i=0 ; i<ien ; i++ ) {
			val = src[i];
	
			for ( j=0 ; j<k ; j++ ) {
				if ( out[j] === val ) {
					continue again;
				}
			}
	
			out.push( val );
			k++;
		}
	
		return out;
	};
	
	// Surprisingly this is faster than [].concat.apply
	// https://jsperf.com/flatten-an-array-loop-vs-reduce/2
	var _flatten = function (out, val) {
		if (Array.isArray(val)) {
			for (var i=0 ; i<val.length ; i++) {
				_flatten(out, val[i]);
			}
		}
		else {
			out.push(val);
		}
	  
		return out;
	}
	
	var _includes = function (search, start) {
		if (start === undefined) {
			start = 0;
		}
	
		return this.indexOf(search, start) !== -1;	
	};
	
	// Array.isArray polyfill.
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray
	if (! Array.isArray) {
	    Array.isArray = function(arg) {
	        return Object.prototype.toString.call(arg) === '[object Array]';
	    };
	}
	
	if (! Array.prototype.includes) {
		Array.prototype.includes = _includes;
	}
	
	// .trim() polyfill
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/trim
	if (!String.prototype.trim) {
	  String.prototype.trim = function () {
	    return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
	  };
	}
	
	if (! String.prototype.includes) {
		String.prototype.includes = _includes;
	}
	
	/**
	 * DataTables utility methods
	 * 
	 * This namespace provides helper methods that DataTables uses internally to
	 * create a DataTable, but which are not exclusively used only for DataTables.
	 * These methods can be used by extension authors to save the duplication of
	 * code.
	 *
	 *  @namespace
	 */
	DataTable.util = {
		/**
		 * Throttle the calls to a function. Arguments and context are maintained
		 * for the throttled function.
		 *
		 * @param {function} fn Function to be called
		 * @param {integer} freq Call frequency in mS
		 * @return {function} Wrapped function
		 */
		throttle: function ( fn, freq ) {
			var
				frequency = freq !== undefined ? freq : 200,
				last,
				timer;
	
			return function () {
				var
					that = this,
					now  = +new Date(),
					args = arguments;
	
				if ( last && now < last + frequency ) {
					clearTimeout( timer );
	
					timer = setTimeout( function () {
						last = undefined;
						fn.apply( that, args );
					}, frequency );
				}
				else {
					last = now;
					fn.apply( that, args );
				}
			};
		},
	
	
		/**
		 * Escape a string such that it can be used in a regular expression
		 *
		 *  @param {string} val string to escape
		 *  @returns {string} escaped string
		 */
		escapeRegex: function ( val ) {
			return val.replace( _re_escape_regex, '\\$1' );
		},
	
		/**
		 * Create a function that will write to a nested object or array
		 * @param {*} source JSON notation string
		 * @returns Write function
		 */
		set: function ( source ) {
			if ( $.isPlainObject( source ) ) {
				/* Unlike get, only the underscore (global) option is used for for
				 * setting data since we don't know the type here. This is why an object
				 * option is not documented for `mData` (which is read/write), but it is
				 * for `mRender` which is read only.
				 */
				return DataTable.util.set( source._ );
			}
			else if ( source === null ) {
				// Nothing to do when the data source is null
				return function () {};
			}
			else if ( typeof source === 'function' ) {
				return function (data, val, meta) {
					source( data, 'set', val, meta );
				};
			}
			else if ( typeof source === 'string' && (source.indexOf('.') !== -1 ||
					  source.indexOf('[') !== -1 || source.indexOf('(') !== -1) )
			{
				// Like the get, we need to get data from a nested object
				var setData = function (data, val, src) {
					var a = _fnSplitObjNotation( src ), b;
					var aLast = a[a.length-1];
					var arrayNotation, funcNotation, o, innerSrc;
		
					for ( var i=0, iLen=a.length-1 ; i<iLen ; i++ ) {
						// Protect against prototype pollution
						if (a[i] === '__proto__' || a[i] === 'constructor') {
							throw new Error('Cannot set prototype values');
						}
		
						// Check if we are dealing with an array notation request
						arrayNotation = a[i].match(__reArray);
						funcNotation = a[i].match(__reFn);
		
						if ( arrayNotation ) {
							a[i] = a[i].replace(__reArray, '');
							data[ a[i] ] = [];
		
							// Get the remainder of the nested object to set so we can recurse
							b = a.slice();
							b.splice( 0, i+1 );
							innerSrc = b.join('.');
		
							// Traverse each entry in the array setting the properties requested
							if ( Array.isArray( val ) ) {
								for ( var j=0, jLen=val.length ; j<jLen ; j++ ) {
									o = {};
									setData( o, val[j], innerSrc );
									data[ a[i] ].push( o );
								}
							}
							else {
								// We've been asked to save data to an array, but it
								// isn't array data to be saved. Best that can be done
								// is to just save the value.
								data[ a[i] ] = val;
							}
		
							// The inner call to setData has already traversed through the remainder
							// of the source and has set the data, thus we can exit here
							return;
						}
						else if ( funcNotation ) {
							// Function call
							a[i] = a[i].replace(__reFn, '');
							data = data[ a[i] ]( val );
						}
		
						// If the nested object doesn't currently exist - since we are
						// trying to set the value - create it
						if ( data[ a[i] ] === null || data[ a[i] ] === undefined ) {
							data[ a[i] ] = {};
						}
						data = data[ a[i] ];
					}
		
					// Last item in the input - i.e, the actual set
					if ( aLast.match(__reFn ) ) {
						// Function call
						data = data[ aLast.replace(__reFn, '') ]( val );
					}
					else {
						// If array notation is used, we just want to strip it and use the property name
						// and assign the value. If it isn't used, then we get the result we want anyway
						data[ aLast.replace(__reArray, '') ] = val;
					}
				};
		
				return function (data, val) { // meta is also passed in, but not used
					return setData( data, val, source );
				};
			}
			else {
				// Array or flat object mapping
				return function (data, val) { // meta is also passed in, but not used
					data[source] = val;
				};
			}
		},
	
		/**
		 * Create a function that will read nested objects from arrays, based on JSON notation
		 * @param {*} source JSON notation string
		 * @returns Value read
		 */
		get: function ( source ) {
			if ( $.isPlainObject( source ) ) {
				// Build an object of get functions, and wrap them in a single call
				var o = {};
				$.each( source, function (key, val) {
					if ( val ) {
						o[key] = DataTable.util.get( val );
					}
				} );
		
				return function (data, type, row, meta) {
					var t = o[type] || o._;
					return t !== undefined ?
						t(data, type, row, meta) :
						data;
				};
			}
			else if ( source === null ) {
				// Give an empty string for rendering / sorting etc
				return function (data) { // type, row and meta also passed, but not used
					return data;
				};
			}
			else if ( typeof source === 'function' ) {
				return function (data, type, row, meta) {
					return source( data, type, row, meta );
				};
			}
			else if ( typeof source === 'string' && (source.indexOf('.') !== -1 ||
					  source.indexOf('[') !== -1 || source.indexOf('(') !== -1) )
			{
				/* If there is a . in the source string then the data source is in a
				 * nested object so we loop over the data for each level to get the next
				 * level down. On each loop we test for undefined, and if found immediately
				 * return. This allows entire objects to be missing and sDefaultContent to
				 * be used if defined, rather than throwing an error
				 */
				var fetchData = function (data, type, src) {
					var arrayNotation, funcNotation, out, innerSrc;
		
					if ( src !== "" ) {
						var a = _fnSplitObjNotation( src );
		
						for ( var i=0, iLen=a.length ; i<iLen ; i++ ) {
							// Check if we are dealing with special notation
							arrayNotation = a[i].match(__reArray);
							funcNotation = a[i].match(__reFn);
		
							if ( arrayNotation ) {
								// Array notation
								a[i] = a[i].replace(__reArray, '');
		
								// Condition allows simply [] to be passed in
								if ( a[i] !== "" ) {
									data = data[ a[i] ];
								}
								out = [];
		
								// Get the remainder of the nested object to get
								a.splice( 0, i+1 );
								innerSrc = a.join('.');
		
								// Traverse each entry in the array getting the properties requested
								if ( Array.isArray( data ) ) {
									for ( var j=0, jLen=data.length ; j<jLen ; j++ ) {
										out.push( fetchData( data[j], type, innerSrc ) );
									}
								}
		
								// If a string is given in between the array notation indicators, that
								// is used to join the strings together, otherwise an array is returned
								var join = arrayNotation[0].substring(1, arrayNotation[0].length-1);
								data = (join==="") ? out : out.join(join);
		
								// The inner call to fetchData has already traversed through the remainder
								// of the source requested, so we exit from the loop
								break;
							}
							else if ( funcNotation ) {
								// Function call
								a[i] = a[i].replace(__reFn, '');
								data = data[ a[i] ]();
								continue;
							}
		
							if ( data === null || data[ a[i] ] === undefined ) {
								return undefined;
							}
	
							data = data[ a[i] ];
						}
					}
		
					return data;
				};
		
				return function (data, type) { // row and meta also passed, but not used
					return fetchData( data, type, source );
				};
			}
			else {
				// Array or flat object mapping
				return function (data, type) { // row and meta also passed, but not used
					return data[source];
				};
			}
		}
	};
	
	
	
	/**
	 * Create a mapping object that allows camel case parameters to be looked up
	 * for their Hungarian counterparts. The mapping is stored in a private
	 * parameter called `_hungarianMap` which can be accessed on the source object.
	 *  @param {object} o
	 *  @memberof DataTable#oApi
	 */
	function _fnHungarianMap ( o )
	{
		var
			hungarian = 'a aa ai ao as b fn i m o s ',
			match,
			newKey,
			map = {};
	
		$.each( o, function (key, val) {
			match = key.match(/^([^A-Z]+?)([A-Z])/);
	
			if ( match && hungarian.indexOf(match[1]+' ') !== -1 )
			{
				newKey = key.replace( match[0], match[2].toLowerCase() );
				map[ newKey ] = key;
	
				if ( match[1] === 'o' )
				{
					_fnHungarianMap( o[key] );
				}
			}
		} );
	
		o._hungarianMap = map;
	}
	
	
	/**
	 * Convert from camel case parameters to Hungarian, based on a Hungarian map
	 * created by _fnHungarianMap.
	 *  @param {object} src The model object which holds all parameters that can be
	 *    mapped.
	 *  @param {object} user The object to convert from camel case to Hungarian.
	 *  @param {boolean} force When set to `true`, properties which already have a
	 *    Hungarian value in the `user` object will be overwritten. Otherwise they
	 *    won't be.
	 *  @memberof DataTable#oApi
	 */
	function _fnCamelToHungarian ( src, user, force )
	{
		if ( ! src._hungarianMap ) {
			_fnHungarianMap( src );
		}
	
		var hungarianKey;
	
		$.each( user, function (key, val) {
			hungarianKey = src._hungarianMap[ key ];
	
			if ( hungarianKey !== undefined && (force || user[hungarianKey] === undefined) )
			{
				// For objects, we need to buzz down into the object to copy parameters
				if ( hungarianKey.charAt(0) === 'o' )
				{
					// Copy the camelCase options over to the hungarian
					if ( ! user[ hungarianKey ] ) {
						user[ hungarianKey ] = {};
					}
					$.extend( true, user[hungarianKey], user[key] );
	
					_fnCamelToHungarian( src[hungarianKey], user[hungarianKey], force );
				}
				else {
					user[hungarianKey] = user[ key ];
				}
			}
		} );
	}
	
	
	/**
	 * Language compatibility - when certain options are given, and others aren't, we
	 * need to duplicate the values over, in order to provide backwards compatibility
	 * with older language files.
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnLanguageCompat( lang )
	{
		// Note the use of the Hungarian notation for the parameters in this method as
		// this is called after the mapping of camelCase to Hungarian
		var defaults = DataTable.defaults.oLanguage;
	
		// Default mapping
		var defaultDecimal = defaults.sDecimal;
		if ( defaultDecimal ) {
			_addNumericSort( defaultDecimal );
		}
	
		if ( lang ) {
			var zeroRecords = lang.sZeroRecords;
	
			// Backwards compatibility - if there is no sEmptyTable given, then use the same as
			// sZeroRecords - assuming that is given.
			if ( ! lang.sEmptyTable && zeroRecords &&
				defaults.sEmptyTable === "No data available in table" )
			{
				_fnMap( lang, lang, 'sZeroRecords', 'sEmptyTable' );
			}
	
			// Likewise with loading records
			if ( ! lang.sLoadingRecords && zeroRecords &&
				defaults.sLoadingRecords === "Loading..." )
			{
				_fnMap( lang, lang, 'sZeroRecords', 'sLoadingRecords' );
			}
	
			// Old parameter name of the thousands separator mapped onto the new
			if ( lang.sInfoThousands ) {
				lang.sThousands = lang.sInfoThousands;
			}
	
			var decimal = lang.sDecimal;
			if ( decimal && defaultDecimal !== decimal ) {
				_addNumericSort( decimal );
			}
		}
	}
	
	
	/**
	 * Map one parameter onto another
	 *  @param {object} o Object to map
	 *  @param {*} knew The new parameter name
	 *  @param {*} old The old parameter name
	 */
	var _fnCompatMap = function ( o, knew, old ) {
		if ( o[ knew ] !== undefined ) {
			o[ old ] = o[ knew ];
		}
	};
	
	
	/**
	 * Provide backwards compatibility for the main DT options. Note that the new
	 * options are mapped onto the old parameters, so this is an external interface
	 * change only.
	 *  @param {object} init Object to map
	 */
	function _fnCompatOpts ( init )
	{
		_fnCompatMap( init, 'ordering',      'bSort' );
		_fnCompatMap( init, 'orderMulti',    'bSortMulti' );
		_fnCompatMap( init, 'orderClasses',  'bSortClasses' );
		_fnCompatMap( init, 'orderCellsTop', 'bSortCellsTop' );
		_fnCompatMap( init, 'order',         'aaSorting' );
		_fnCompatMap( init, 'orderFixed',    'aaSortingFixed' );
		_fnCompatMap( init, 'paging',        'bPaginate' );
		_fnCompatMap( init, 'pagingType',    'sPaginationType' );
		_fnCompatMap( init, 'pageLength',    'iDisplayLength' );
		_fnCompatMap( init, 'searching',     'bFilter' );
	
		// Boolean initialisation of x-scrolling
		if ( typeof init.sScrollX === 'boolean' ) {
			init.sScrollX = init.sScrollX ? '100%' : '';
		}
		if ( typeof init.scrollX === 'boolean' ) {
			init.scrollX = init.scrollX ? '100%' : '';
		}
	
		// Column search objects are in an array, so it needs to be converted
		// element by element
		var searchCols = init.aoSearchCols;
	
		if ( searchCols ) {
			for ( var i=0, ien=searchCols.length ; i<ien ; i++ ) {
				if ( searchCols[i] ) {
					_fnCamelToHungarian( DataTable.models.oSearch, searchCols[i] );
				}
			}
		}
	}
	
	
	/**
	 * Provide backwards compatibility for column options. Note that the new options
	 * are mapped onto the old parameters, so this is an external interface change
	 * only.
	 *  @param {object} init Object to map
	 */
	function _fnCompatCols ( init )
	{
		_fnCompatMap( init, 'orderable',     'bSortable' );
		_fnCompatMap( init, 'orderData',     'aDataSort' );
		_fnCompatMap( init, 'orderSequence', 'asSorting' );
		_fnCompatMap( init, 'orderDataType', 'sortDataType' );
	
		// orderData can be given as an integer
		var dataSort = init.aDataSort;
		if ( typeof dataSort === 'number' && ! Array.isArray( dataSort ) ) {
			init.aDataSort = [ dataSort ];
		}
	}
	
	
	/**
	 * Browser feature detection for capabilities, quirks
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnBrowserDetect( settings )
	{
		// We don't need to do this every time DataTables is constructed, the values
		// calculated are specific to the browser and OS configuration which we
		// don't expect to change between initialisations
		if ( ! DataTable.__browser ) {
			var browser = {};
			DataTable.__browser = browser;
	
			// Scrolling feature / quirks detection
			var n = $('<div/>')
				.css( {
					position: 'fixed',
					top: 0,
					left: $(window).scrollLeft()*-1, // allow for scrolling
					height: 1,
					width: 1,
					overflow: 'hidden'
				} )
				.append(
					$('<div/>')
						.css( {
							position: 'absolute',
							top: 1,
							left: 1,
							width: 100,
							overflow: 'scroll'
						} )
						.append(
							$('<div/>')
								.css( {
									width: '100%',
									height: 10
								} )
						)
				)
				.appendTo( 'body' );
	
			var outer = n.children();
			var inner = outer.children();
	
			// Numbers below, in order, are:
			// inner.offsetWidth, inner.clientWidth, outer.offsetWidth, outer.clientWidth
			//
			// IE6 XP:                           100 100 100  83
			// IE7 Vista:                        100 100 100  83
			// IE 8+ Windows:                     83  83 100  83
			// Evergreen Windows:                 83  83 100  83
			// Evergreen Mac with scrollbars:     85  85 100  85
			// Evergreen Mac without scrollbars: 100 100 100 100
	
			// Get scrollbar width
			browser.barWidth = outer[0].offsetWidth - outer[0].clientWidth;
	
			// IE6/7 will oversize a width 100% element inside a scrolling element, to
			// include the width of the scrollbar, while other browsers ensure the inner
			// element is contained without forcing scrolling
			browser.bScrollOversize = inner[0].offsetWidth === 100 && outer[0].clientWidth !== 100;
	
			// In rtl text layout, some browsers (most, but not all) will place the
			// scrollbar on the left, rather than the right.
			browser.bScrollbarLeft = Math.round( inner.offset().left ) !== 1;
	
			// IE8- don't provide height and width for getBoundingClientRect
			browser.bBounding = n[0].getBoundingClientRect().width ? true : false;
	
			n.remove();
		}
	
		$.extend( settings.oBrowser, DataTable.__browser );
		settings.oScroll.iBarWidth = DataTable.__browser.barWidth;
	}
	
	
	/**
	 * Array.prototype reduce[Right] method, used for browsers which don't support
	 * JS 1.6. Done this way to reduce code size, since we iterate either way
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnReduce ( that, fn, init, start, end, inc )
	{
		var
			i = start,
			value,
			isSet = false;
	
		if ( init !== undefined ) {
			value = init;
			isSet = true;
		}
	
		while ( i !== end ) {
			if ( ! that.hasOwnProperty(i) ) {
				continue;
			}
	
			value = isSet ?
				fn( value, that[i], i, that ) :
				that[i];
	
			isSet = true;
			i += inc;
		}
	
		return value;
	}
	
	/**
	 * Add a column to the list used for the table with default values
	 *  @param {object} oSettings dataTables settings object
	 *  @param {node} nTh The th element for this column
	 *  @memberof DataTable#oApi
	 */
	function _fnAddColumn( oSettings, nTh )
	{
		// Add column to aoColumns array
		var oDefaults = DataTable.defaults.column;
		var iCol = oSettings.aoColumns.length;
		var oCol = $.extend( {}, DataTable.models.oColumn, oDefaults, {
			"nTh": nTh ? nTh : document.createElement('th'),
			"sTitle":    oDefaults.sTitle    ? oDefaults.sTitle    : nTh ? nTh.innerHTML : '',
			"aDataSort": oDefaults.aDataSort ? oDefaults.aDataSort : [iCol],
			"mData": oDefaults.mData ? oDefaults.mData : iCol,
			idx: iCol
		} );
		oSettings.aoColumns.push( oCol );
	
		// Add search object for column specific search. Note that the `searchCols[ iCol ]`
		// passed into extend can be undefined. This allows the user to give a default
		// with only some of the parameters defined, and also not give a default
		var searchCols = oSettings.aoPreSearchCols;
		searchCols[ iCol ] = $.extend( {}, DataTable.models.oSearch, searchCols[ iCol ] );
	
		// Use the default column options function to initialise classes etc
		_fnColumnOptions( oSettings, iCol, $(nTh).data() );
	}
	
	
	/**
	 * Apply options for a column
	 *  @param {object} oSettings dataTables settings object
	 *  @param {int} iCol column index to consider
	 *  @param {object} oOptions object with sType, bVisible and bSearchable etc
	 *  @memberof DataTable#oApi
	 */
	function _fnColumnOptions( oSettings, iCol, oOptions )
	{
		var oCol = oSettings.aoColumns[ iCol ];
		var oClasses = oSettings.oClasses;
		var th = $(oCol.nTh);
	
		// Try to get width information from the DOM. We can't get it from CSS
		// as we'd need to parse the CSS stylesheet. `width` option can override
		if ( ! oCol.sWidthOrig ) {
			// Width attribute
			oCol.sWidthOrig = th.attr('width') || null;
	
			// Style attribute
			var t = (th.attr('style') || '').match(/width:\s*(\d+[pxem%]+)/);
			if ( t ) {
				oCol.sWidthOrig = t[1];
			}
		}
	
		/* User specified column options */
		if ( oOptions !== undefined && oOptions !== null )
		{
			// Backwards compatibility
			_fnCompatCols( oOptions );
	
			// Map camel case parameters to their Hungarian counterparts
			_fnCamelToHungarian( DataTable.defaults.column, oOptions, true );
	
			/* Backwards compatibility for mDataProp */
			if ( oOptions.mDataProp !== undefined && !oOptions.mData )
			{
				oOptions.mData = oOptions.mDataProp;
			}
	
			if ( oOptions.sType )
			{
				oCol._sManualType = oOptions.sType;
			}
	
			// `class` is a reserved word in Javascript, so we need to provide
			// the ability to use a valid name for the camel case input
			if ( oOptions.className && ! oOptions.sClass )
			{
				oOptions.sClass = oOptions.className;
			}
			if ( oOptions.sClass ) {
				th.addClass( oOptions.sClass );
			}
	
			$.extend( oCol, oOptions );
			_fnMap( oCol, oOptions, "sWidth", "sWidthOrig" );
	
			/* iDataSort to be applied (backwards compatibility), but aDataSort will take
			 * priority if defined
			 */
			if ( oOptions.iDataSort !== undefined )
			{
				oCol.aDataSort = [ oOptions.iDataSort ];
			}
			_fnMap( oCol, oOptions, "aDataSort" );
		}
	
		/* Cache the data get and set functions for speed */
		var mDataSrc = oCol.mData;
		var mData = _fnGetObjectDataFn( mDataSrc );
		var mRender = oCol.mRender ? _fnGetObjectDataFn( oCol.mRender ) : null;
	
		var attrTest = function( src ) {
			return typeof src === 'string' && src.indexOf('@') !== -1;
		};
		oCol._bAttrSrc = $.isPlainObject( mDataSrc ) && (
			attrTest(mDataSrc.sort) || attrTest(mDataSrc.type) || attrTest(mDataSrc.filter)
		);
		oCol._setter = null;
	
		oCol.fnGetData = function (rowData, type, meta) {
			var innerData = mData( rowData, type, undefined, meta );
	
			return mRender && type ?
				mRender( innerData, type, rowData, meta ) :
				innerData;
		};
		oCol.fnSetData = function ( rowData, val, meta ) {
			return _fnSetObjectDataFn( mDataSrc )( rowData, val, meta );
		};
	
		// Indicate if DataTables should read DOM data as an object or array
		// Used in _fnGetRowElements
		if ( typeof mDataSrc !== 'number' ) {
			oSettings._rowReadObject = true;
		}
	
		/* Feature sorting overrides column specific when off */
		if ( !oSettings.oFeatures.bSort )
		{
			oCol.bSortable = false;
			th.addClass( oClasses.sSortableNone ); // Have to add class here as order event isn't called
		}
	
		/* Check that the class assignment is correct for sorting */
		var bAsc = $.inArray('asc', oCol.asSorting) !== -1;
		var bDesc = $.inArray('desc', oCol.asSorting) !== -1;
		if ( !oCol.bSortable || (!bAsc && !bDesc) )
		{
			oCol.sSortingClass = oClasses.sSortableNone;
			oCol.sSortingClassJUI = "";
		}
		else if ( bAsc && !bDesc )
		{
			oCol.sSortingClass = oClasses.sSortableAsc;
			oCol.sSortingClassJUI = oClasses.sSortJUIAscAllowed;
		}
		else if ( !bAsc && bDesc )
		{
			oCol.sSortingClass = oClasses.sSortableDesc;
			oCol.sSortingClassJUI = oClasses.sSortJUIDescAllowed;
		}
		else
		{
			oCol.sSortingClass = oClasses.sSortable;
			oCol.sSortingClassJUI = oClasses.sSortJUI;
		}
	}
	
	
	/**
	 * Adjust the table column widths for new data. Note: you would probably want to
	 * do a redraw after calling this function!
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnAdjustColumnSizing ( settings )
	{
		/* Not interested in doing column width calculation if auto-width is disabled */
		if ( settings.oFeatures.bAutoWidth !== false )
		{
			var columns = settings.aoColumns;
	
			_fnCalculateColumnWidths( settings );
			for ( var i=0 , iLen=columns.length ; i<iLen ; i++ )
			{
				columns[i].nTh.style.width = columns[i].sWidth;
			}
		}
	
		var scroll = settings.oScroll;
		if ( scroll.sY !== '' || scroll.sX !== '')
		{
			_fnScrollDraw( settings );
		}
	
		_fnCallbackFire( settings, null, 'column-sizing', [settings] );
	}
	
	
	/**
	 * Convert the index of a visible column to the index in the data array (take account
	 * of hidden columns)
	 *  @param {object} oSettings dataTables settings object
	 *  @param {int} iMatch Visible column index to lookup
	 *  @returns {int} i the data index
	 *  @memberof DataTable#oApi
	 */
	function _fnVisibleToColumnIndex( oSettings, iMatch )
	{
		var aiVis = _fnGetColumns( oSettings, 'bVisible' );
	
		return typeof aiVis[iMatch] === 'number' ?
			aiVis[iMatch] :
			null;
	}
	
	
	/**
	 * Convert the index of an index in the data array and convert it to the visible
	 *   column index (take account of hidden columns)
	 *  @param {int} iMatch Column index to lookup
	 *  @param {object} oSettings dataTables settings object
	 *  @returns {int} i the data index
	 *  @memberof DataTable#oApi
	 */
	function _fnColumnIndexToVisible( oSettings, iMatch )
	{
		var aiVis = _fnGetColumns( oSettings, 'bVisible' );
		var iPos = $.inArray( iMatch, aiVis );
	
		return iPos !== -1 ? iPos : null;
	}
	
	
	/**
	 * Get the number of visible columns
	 *  @param {object} oSettings dataTables settings object
	 *  @returns {int} i the number of visible columns
	 *  @memberof DataTable#oApi
	 */
	function _fnVisbleColumns( oSettings )
	{
		var vis = 0;
	
		// No reduce in IE8, use a loop for now
		$.each( oSettings.aoColumns, function ( i, col ) {
			if ( col.bVisible && $(col.nTh).css('display') !== 'none' ) {
				vis++;
			}
		} );
	
		return vis;
	}
	
	
	/**
	 * Get an array of column indexes that match a given property
	 *  @param {object} oSettings dataTables settings object
	 *  @param {string} sParam Parameter in aoColumns to look for - typically
	 *    bVisible or bSearchable
	 *  @returns {array} Array of indexes with matched properties
	 *  @memberof DataTable#oApi
	 */
	function _fnGetColumns( oSettings, sParam )
	{
		var a = [];
	
		$.map( oSettings.aoColumns, function(val, i) {
			if ( val[sParam] ) {
				a.push( i );
			}
		} );
	
		return a;
	}
	
	
	/**
	 * Calculate the 'type' of a column
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnColumnTypes ( settings )
	{
		var columns = settings.aoColumns;
		var data = settings.aoData;
		var types = DataTable.ext.type.detect;
		var i, ien, j, jen, k, ken;
		var col, cell, detectedType, cache;
	
		// For each column, spin over the 
		for ( i=0, ien=columns.length ; i<ien ; i++ ) {
			col = columns[i];
			cache = [];
	
			if ( ! col.sType && col._sManualType ) {
				col.sType = col._sManualType;
			}
			else if ( ! col.sType ) {
				for ( j=0, jen=types.length ; j<jen ; j++ ) {
					for ( k=0, ken=data.length ; k<ken ; k++ ) {
						// Use a cache array so we only need to get the type data
						// from the formatter once (when using multiple detectors)
						if ( cache[k] === undefined ) {
							cache[k] = _fnGetCellData( settings, k, i, 'type' );
						}
	
						detectedType = types[j]( cache[k], settings );
	
						// If null, then this type can't apply to this column, so
						// rather than testing all cells, break out. There is an
						// exception for the last type which is `html`. We need to
						// scan all rows since it is possible to mix string and HTML
						// types
						if ( ! detectedType && j !== types.length-1 ) {
							break;
						}
	
						// Only a single match is needed for html type since it is
						// bottom of the pile and very similar to string - but it
						// must not be empty
						if ( detectedType === 'html' && ! _empty(cache[k]) ) {
							break;
						}
					}
	
					// Type is valid for all data points in the column - use this
					// type
					if ( detectedType ) {
						col.sType = detectedType;
						break;
					}
				}
	
				// Fall back - if no type was detected, always use string
				if ( ! col.sType ) {
					col.sType = 'string';
				}
			}
		}
	}
	
	
	/**
	 * Take the column definitions and static columns arrays and calculate how
	 * they relate to column indexes. The callback function will then apply the
	 * definition found for a column to a suitable configuration object.
	 *  @param {object} oSettings dataTables settings object
	 *  @param {array} aoColDefs The aoColumnDefs array that is to be applied
	 *  @param {array} aoCols The aoColumns array that defines columns individually
	 *  @param {function} fn Callback function - takes two parameters, the calculated
	 *    column index and the definition for that column.
	 *  @memberof DataTable#oApi
	 */
	function _fnApplyColumnDefs( oSettings, aoColDefs, aoCols, fn )
	{
		var i, iLen, j, jLen, k, kLen, def;
		var columns = oSettings.aoColumns;
	
		// Column definitions with aTargets
		if ( aoColDefs )
		{
			/* Loop over the definitions array - loop in reverse so first instance has priority */
			for ( i=aoColDefs.length-1 ; i>=0 ; i-- )
			{
				def = aoColDefs[i];
	
				/* Each definition can target multiple columns, as it is an array */
				var aTargets = def.targets !== undefined ?
					def.targets :
					def.aTargets;
	
				if ( ! Array.isArray( aTargets ) )
				{
					aTargets = [ aTargets ];
				}
	
				for ( j=0, jLen=aTargets.length ; j<jLen ; j++ )
				{
					if ( typeof aTargets[j] === 'number' && aTargets[j] >= 0 )
					{
						/* Add columns that we don't yet know about */
						while( columns.length <= aTargets[j] )
						{
							_fnAddColumn( oSettings );
						}
	
						/* Integer, basic index */
						fn( aTargets[j], def );
					}
					else if ( typeof aTargets[j] === 'number' && aTargets[j] < 0 )
					{
						/* Negative integer, right to left column counting */
						fn( columns.length+aTargets[j], def );
					}
					else if ( typeof aTargets[j] === 'string' )
					{
						/* Class name matching on TH element */
						for ( k=0, kLen=columns.length ; k<kLen ; k++ )
						{
							if ( aTargets[j] == "_all" ||
							     $(columns[k].nTh).hasClass( aTargets[j] ) )
							{
								fn( k, def );
							}
						}
					}
				}
			}
		}
	
		// Statically defined columns array
		if ( aoCols )
		{
			for ( i=0, iLen=aoCols.length ; i<iLen ; i++ )
			{
				fn( i, aoCols[i] );
			}
		}
	}
	
	/**
	 * Add a data array to the table, creating DOM node etc. This is the parallel to
	 * _fnGatherData, but for adding rows from a Javascript source, rather than a
	 * DOM source.
	 *  @param {object} oSettings dataTables settings object
	 *  @param {array} aData data array to be added
	 *  @param {node} [nTr] TR element to add to the table - optional. If not given,
	 *    DataTables will create a row automatically
	 *  @param {array} [anTds] Array of TD|TH elements for the row - must be given
	 *    if nTr is.
	 *  @returns {int} >=0 if successful (index of new aoData entry), -1 if failed
	 *  @memberof DataTable#oApi
	 */
	function _fnAddData ( oSettings, aDataIn, nTr, anTds )
	{
		/* Create the object for storing information about this new row */
		var iRow = oSettings.aoData.length;
		var oData = $.extend( true, {}, DataTable.models.oRow, {
			src: nTr ? 'dom' : 'data',
			idx: iRow
		} );
	
		oData._aData = aDataIn;
		oSettings.aoData.push( oData );
	
		/* Create the cells */
		var nTd, sThisType;
		var columns = oSettings.aoColumns;
	
		// Invalidate the column types as the new data needs to be revalidated
		for ( var i=0, iLen=columns.length ; i<iLen ; i++ )
		{
			columns[i].sType = null;
		}
	
		/* Add to the display array */
		oSettings.aiDisplayMaster.push( iRow );
	
		var id = oSettings.rowIdFn( aDataIn );
		if ( id !== undefined ) {
			oSettings.aIds[ id ] = oData;
		}
	
		/* Create the DOM information, or register it if already present */
		if ( nTr || ! oSettings.oFeatures.bDeferRender )
		{
			_fnCreateTr( oSettings, iRow, nTr, anTds );
		}
	
		return iRow;
	}
	
	
	/**
	 * Add one or more TR elements to the table. Generally we'd expect to
	 * use this for reading data from a DOM sourced table, but it could be
	 * used for an TR element. Note that if a TR is given, it is used (i.e.
	 * it is not cloned).
	 *  @param {object} settings dataTables settings object
	 *  @param {array|node|jQuery} trs The TR element(s) to add to the table
	 *  @returns {array} Array of indexes for the added rows
	 *  @memberof DataTable#oApi
	 */
	function _fnAddTr( settings, trs )
	{
		var row;
	
		// Allow an individual node to be passed in
		if ( ! (trs instanceof $) ) {
			trs = $(trs);
		}
	
		return trs.map( function (i, el) {
			row = _fnGetRowElements( settings, el );
			return _fnAddData( settings, row.data, el, row.cells );
		} );
	}
	
	
	/**
	 * Take a TR element and convert it to an index in aoData
	 *  @param {object} oSettings dataTables settings object
	 *  @param {node} n the TR element to find
	 *  @returns {int} index if the node is found, null if not
	 *  @memberof DataTable#oApi
	 */
	function _fnNodeToDataIndex( oSettings, n )
	{
		return (n._DT_RowIndex!==undefined) ? n._DT_RowIndex : null;
	}
	
	
	/**
	 * Take a TD element and convert it into a column data index (not the visible index)
	 *  @param {object} oSettings dataTables settings object
	 *  @param {int} iRow The row number the TD/TH can be found in
	 *  @param {node} n The TD/TH element to find
	 *  @returns {int} index if the node is found, -1 if not
	 *  @memberof DataTable#oApi
	 */
	function _fnNodeToColumnIndex( oSettings, iRow, n )
	{
		return $.inArray( n, oSettings.aoData[ iRow ].anCells );
	}
	
	
	/**
	 * Get the data for a given cell from the internal cache, taking into account data mapping
	 *  @param {object} settings dataTables settings object
	 *  @param {int} rowIdx aoData row id
	 *  @param {int} colIdx Column index
	 *  @param {string} type data get type ('display', 'type' 'filter|search' 'sort|order')
	 *  @returns {*} Cell data
	 *  @memberof DataTable#oApi
	 */
	function _fnGetCellData( settings, rowIdx, colIdx, type )
	{
		if (type === 'search') {
			type = 'filter';
		}
		else if (type === 'order') {
			type = 'sort';
		}
	
		var draw           = settings.iDraw;
		var col            = settings.aoColumns[colIdx];
		var rowData        = settings.aoData[rowIdx]._aData;
		var defaultContent = col.sDefaultContent;
		var cellData       = col.fnGetData( rowData, type, {
			settings: settings,
			row:      rowIdx,
			col:      colIdx
		} );
	
		if ( cellData === undefined ) {
			if ( settings.iDrawError != draw && defaultContent === null ) {
				_fnLog( settings, 0, "Requested unknown parameter "+
					(typeof col.mData=='function' ? '{function}' : "'"+col.mData+"'")+
					" for row "+rowIdx+", column "+colIdx, 4 );
				settings.iDrawError = draw;
			}
			return defaultContent;
		}
	
		// When the data source is null and a specific data type is requested (i.e.
		// not the original data), we can use default column data
		if ( (cellData === rowData || cellData === null) && defaultContent !== null && type !== undefined ) {
			cellData = defaultContent;
		}
		else if ( typeof cellData === 'function' ) {
			// If the data source is a function, then we run it and use the return,
			// executing in the scope of the data object (for instances)
			return cellData.call( rowData );
		}
	
		if ( cellData === null && type === 'display' ) {
			return '';
		}
	
		if ( type === 'filter' ) {
			var fomatters = DataTable.ext.type.search;
	
			if ( fomatters[ col.sType ] ) {
				cellData = fomatters[ col.sType ]( cellData );
			}
		}
	
		return cellData;
	}
	
	
	/**
	 * Set the value for a specific cell, into the internal data cache
	 *  @param {object} settings dataTables settings object
	 *  @param {int} rowIdx aoData row id
	 *  @param {int} colIdx Column index
	 *  @param {*} val Value to set
	 *  @memberof DataTable#oApi
	 */
	function _fnSetCellData( settings, rowIdx, colIdx, val )
	{
		var col     = settings.aoColumns[colIdx];
		var rowData = settings.aoData[rowIdx]._aData;
	
		col.fnSetData( rowData, val, {
			settings: settings,
			row:      rowIdx,
			col:      colIdx
		}  );
	}
	
	
	// Private variable that is used to match action syntax in the data property object
	var __reArray = /\[.*?\]$/;
	var __reFn = /\(\)$/;
	
	/**
	 * Split string on periods, taking into account escaped periods
	 * @param  {string} str String to split
	 * @return {array} Split string
	 */
	function _fnSplitObjNotation( str )
	{
		return $.map( str.match(/(\\.|[^\.])+/g) || [''], function ( s ) {
			return s.replace(/\\\./g, '.');
		} );
	}
	
	
	/**
	 * Return a function that can be used to get data from a source object, taking
	 * into account the ability to use nested objects as a source
	 *  @param {string|int|function} mSource The data source for the object
	 *  @returns {function} Data get function
	 *  @memberof DataTable#oApi
	 */
	var _fnGetObjectDataFn = DataTable.util.get;
	
	
	/**
	 * Return a function that can be used to set data from a source object, taking
	 * into account the ability to use nested objects as a source
	 *  @param {string|int|function} mSource The data source for the object
	 *  @returns {function} Data set function
	 *  @memberof DataTable#oApi
	 */
	var _fnSetObjectDataFn = DataTable.util.set;
	
	
	/**
	 * Return an array with the full table data
	 *  @param {object} oSettings dataTables settings object
	 *  @returns array {array} aData Master data array
	 *  @memberof DataTable#oApi
	 */
	function _fnGetDataMaster ( settings )
	{
		return _pluck( settings.aoData, '_aData' );
	}
	
	
	/**
	 * Nuke the table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnClearTable( settings )
	{
		settings.aoData.length = 0;
		settings.aiDisplayMaster.length = 0;
		settings.aiDisplay.length = 0;
		settings.aIds = {};
	}
	
	
	 /**
	 * Take an array of integers (index array) and remove a target integer (value - not
	 * the key!)
	 *  @param {array} a Index array to target
	 *  @param {int} iTarget value to find
	 *  @memberof DataTable#oApi
	 */
	function _fnDeleteIndex( a, iTarget, splice )
	{
		var iTargetIndex = -1;
	
		for ( var i=0, iLen=a.length ; i<iLen ; i++ )
		{
			if ( a[i] == iTarget )
			{
				iTargetIndex = i;
			}
			else if ( a[i] > iTarget )
			{
				a[i]--;
			}
		}
	
		if ( iTargetIndex != -1 && splice === undefined )
		{
			a.splice( iTargetIndex, 1 );
		}
	}
	
	
	/**
	 * Mark cached data as invalid such that a re-read of the data will occur when
	 * the cached data is next requested. Also update from the data source object.
	 *
	 * @param {object} settings DataTables settings object
	 * @param {int}    rowIdx   Row index to invalidate
	 * @param {string} [src]    Source to invalidate from: undefined, 'auto', 'dom'
	 *     or 'data'
	 * @param {int}    [colIdx] Column index to invalidate. If undefined the whole
	 *     row will be invalidated
	 * @memberof DataTable#oApi
	 *
	 * @todo For the modularisation of v1.11 this will need to become a callback, so
	 *   the sort and filter methods can subscribe to it. That will required
	 *   initialisation options for sorting, which is why it is not already baked in
	 */
	function _fnInvalidate( settings, rowIdx, src, colIdx )
	{
		var row = settings.aoData[ rowIdx ];
		var i, ien;
		var cellWrite = function ( cell, col ) {
			// This is very frustrating, but in IE if you just write directly
			// to innerHTML, and elements that are overwritten are GC'ed,
			// even if there is a reference to them elsewhere
			while ( cell.childNodes.length ) {
				cell.removeChild( cell.firstChild );
			}
	
			cell.innerHTML = _fnGetCellData( settings, rowIdx, col, 'display' );
		};
	
		// Are we reading last data from DOM or the data object?
		if ( src === 'dom' || ((! src || src === 'auto') && row.src === 'dom') ) {
			// Read the data from the DOM
			row._aData = _fnGetRowElements(
					settings, row, colIdx, colIdx === undefined ? undefined : row._aData
				)
				.data;
		}
		else {
			// Reading from data object, update the DOM
			var cells = row.anCells;
	
			if ( cells ) {
				if ( colIdx !== undefined ) {
					cellWrite( cells[colIdx], colIdx );
				}
				else {
					for ( i=0, ien=cells.length ; i<ien ; i++ ) {
						cellWrite( cells[i], i );
					}
				}
			}
		}
	
		// For both row and cell invalidation, the cached data for sorting and
		// filtering is nulled out
		row._aSortData = null;
		row._aFilterData = null;
	
		// Invalidate the type for a specific column (if given) or all columns since
		// the data might have changed
		var cols = settings.aoColumns;
		if ( colIdx !== undefined ) {
			cols[ colIdx ].sType = null;
		}
		else {
			for ( i=0, ien=cols.length ; i<ien ; i++ ) {
				cols[i].sType = null;
			}
	
			// Update DataTables special `DT_*` attributes for the row
			_fnRowAttributes( settings, row );
		}
	}
	
	
	/**
	 * Build a data source object from an HTML row, reading the contents of the
	 * cells that are in the row.
	 *
	 * @param {object} settings DataTables settings object
	 * @param {node|object} TR element from which to read data or existing row
	 *   object from which to re-read the data from the cells
	 * @param {int} [colIdx] Optional column index
	 * @param {array|object} [d] Data source object. If `colIdx` is given then this
	 *   parameter should also be given and will be used to write the data into.
	 *   Only the column in question will be written
	 * @returns {object} Object with two parameters: `data` the data read, in
	 *   document order, and `cells` and array of nodes (they can be useful to the
	 *   caller, so rather than needing a second traversal to get them, just return
	 *   them from here).
	 * @memberof DataTable#oApi
	 */
	function _fnGetRowElements( settings, row, colIdx, d )
	{
		var
			tds = [],
			td = row.firstChild,
			name, col, o, i=0, contents,
			columns = settings.aoColumns,
			objectRead = settings._rowReadObject;
	
		// Allow the data object to be passed in, or construct
		d = d !== undefined ?
			d :
			objectRead ?
				{} :
				[];
	
		var attr = function ( str, td  ) {
			if ( typeof str === 'string' ) {
				var idx = str.indexOf('@');
	
				if ( idx !== -1 ) {
					var attr = str.substring( idx+1 );
					var setter = _fnSetObjectDataFn( str );
					setter( d, td.getAttribute( attr ) );
				}
			}
		};
	
		// Read data from a cell and store into the data object
		var cellProcess = function ( cell ) {
			if ( colIdx === undefined || colIdx === i ) {
				col = columns[i];
				contents = (cell.innerHTML).trim();
	
				if ( col && col._bAttrSrc ) {
					var setter = _fnSetObjectDataFn( col.mData._ );
					setter( d, contents );
	
					attr( col.mData.sort, cell );
					attr( col.mData.type, cell );
					attr( col.mData.filter, cell );
				}
				else {
					// Depending on the `data` option for the columns the data can
					// be read to either an object or an array.
					if ( objectRead ) {
						if ( ! col._setter ) {
							// Cache the setter function
							col._setter = _fnSetObjectDataFn( col.mData );
						}
						col._setter( d, contents );
					}
					else {
						d[i] = contents;
					}
				}
			}
	
			i++;
		};
	
		if ( td ) {
			// `tr` element was passed in
			while ( td ) {
				name = td.nodeName.toUpperCase();
	
				if ( name == "TD" || name == "TH" ) {
					cellProcess( td );
					tds.push( td );
				}
	
				td = td.nextSibling;
			}
		}
		else {
			// Existing row object passed in
			tds = row.anCells;
	
			for ( var j=0, jen=tds.length ; j<jen ; j++ ) {
				cellProcess( tds[j] );
			}
		}
	
		// Read the ID from the DOM if present
		var rowNode = row.firstChild ? row : row.nTr;
	
		if ( rowNode ) {
			var id = rowNode.getAttribute( 'id' );
	
			if ( id ) {
				_fnSetObjectDataFn( settings.rowId )( d, id );
			}
		}
	
		return {
			data: d,
			cells: tds
		};
	}
	/**
	 * Create a new TR element (and it's TD children) for a row
	 *  @param {object} oSettings dataTables settings object
	 *  @param {int} iRow Row to consider
	 *  @param {node} [nTrIn] TR element to add to the table - optional. If not given,
	 *    DataTables will create a row automatically
	 *  @param {array} [anTds] Array of TD|TH elements for the row - must be given
	 *    if nTr is.
	 *  @memberof DataTable#oApi
	 */
	function _fnCreateTr ( oSettings, iRow, nTrIn, anTds )
	{
		var
			row = oSettings.aoData[iRow],
			rowData = row._aData,
			cells = [],
			nTr, nTd, oCol,
			i, iLen, create;
	
		if ( row.nTr === null )
		{
			nTr = nTrIn || document.createElement('tr');
	
			row.nTr = nTr;
			row.anCells = cells;
	
			/* Use a private property on the node to allow reserve mapping from the node
			 * to the aoData array for fast look up
			 */
			nTr._DT_RowIndex = iRow;
	
			/* Special parameters can be given by the data source to be used on the row */
			_fnRowAttributes( oSettings, row );
	
			/* Process each column */
			for ( i=0, iLen=oSettings.aoColumns.length ; i<iLen ; i++ )
			{
				oCol = oSettings.aoColumns[i];
				create = nTrIn ? false : true;
	
				nTd = create ? document.createElement( oCol.sCellType ) : anTds[i];
				nTd._DT_CellIndex = {
					row: iRow,
					column: i
				};
				
				cells.push( nTd );
	
				// Need to create the HTML if new, or if a rendering function is defined
				if ( create || ((oCol.mRender || oCol.mData !== i) &&
					 (!$.isPlainObject(oCol.mData) || oCol.mData._ !== i+'.display')
				)) {
					nTd.innerHTML = _fnGetCellData( oSettings, iRow, i, 'display' );
				}
	
				/* Add user defined class */
				if ( oCol.sClass )
				{
					nTd.className += ' '+oCol.sClass;
				}
	
				// Visibility - add or remove as required
				if ( oCol.bVisible && ! nTrIn )
				{
					nTr.appendChild( nTd );
				}
				else if ( ! oCol.bVisible && nTrIn )
				{
					nTd.parentNode.removeChild( nTd );
				}
	
				if ( oCol.fnCreatedCell )
				{
					oCol.fnCreatedCell.call( oSettings.oInstance,
						nTd, _fnGetCellData( oSettings, iRow, i ), rowData, iRow, i
					);
				}
			}
	
			_fnCallbackFire( oSettings, 'aoRowCreatedCallback', null, [nTr, rowData, iRow, cells] );
		}
	}
	
	
	/**
	 * Add attributes to a row based on the special `DT_*` parameters in a data
	 * source object.
	 *  @param {object} settings DataTables settings object
	 *  @param {object} DataTables row object for the row to be modified
	 *  @memberof DataTable#oApi
	 */
	function _fnRowAttributes( settings, row )
	{
		var tr = row.nTr;
		var data = row._aData;
	
		if ( tr ) {
			var id = settings.rowIdFn( data );
	
			if ( id ) {
				tr.id = id;
			}
	
			if ( data.DT_RowClass ) {
				// Remove any classes added by DT_RowClass before
				var a = data.DT_RowClass.split(' ');
				row.__rowc = row.__rowc ?
					_unique( row.__rowc.concat( a ) ) :
					a;
	
				$(tr)
					.removeClass( row.__rowc.join(' ') )
					.addClass( data.DT_RowClass );
			}
	
			if ( data.DT_RowAttr ) {
				$(tr).attr( data.DT_RowAttr );
			}
	
			if ( data.DT_RowData ) {
				$(tr).data( data.DT_RowData );
			}
		}
	}
	
	
	/**
	 * Create the HTML header for the table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnBuildHead( oSettings )
	{
		var i, ien, cell, row, column;
		var thead = oSettings.nTHead;
		var tfoot = oSettings.nTFoot;
		var createHeader = $('th, td', thead).length === 0;
		var classes = oSettings.oClasses;
		var columns = oSettings.aoColumns;
	
		if ( createHeader ) {
			row = $('<tr/>').appendTo( thead );
		}
	
		for ( i=0, ien=columns.length ; i<ien ; i++ ) {
			column = columns[i];
			cell = $( column.nTh ).addClass( column.sClass );
	
			if ( createHeader ) {
				cell.appendTo( row );
			}
	
			// 1.11 move into sorting
			if ( oSettings.oFeatures.bSort ) {
				cell.addClass( column.sSortingClass );
	
				if ( column.bSortable !== false ) {
					cell
						.attr( 'tabindex', oSettings.iTabIndex )
						.attr( 'aria-controls', oSettings.sTableId );
	
					_fnSortAttachListener( oSettings, column.nTh, i );
				}
			}
	
			if ( column.sTitle != cell[0].innerHTML ) {
				cell.html( column.sTitle );
			}
	
			_fnRenderer( oSettings, 'header' )(
				oSettings, cell, column, classes
			);
		}
	
		if ( createHeader ) {
			_fnDetectHeader( oSettings.aoHeader, thead );
		}
	
		/* Deal with the footer - add classes if required */
		$(thead).children('tr').children('th, td').addClass( classes.sHeaderTH );
		$(tfoot).children('tr').children('th, td').addClass( classes.sFooterTH );
	
		// Cache the footer cells. Note that we only take the cells from the first
		// row in the footer. If there is more than one row the user wants to
		// interact with, they need to use the table().foot() method. Note also this
		// allows cells to be used for multiple columns using colspan
		if ( tfoot !== null ) {
			var cells = oSettings.aoFooter[0];
	
			for ( i=0, ien=cells.length ; i<ien ; i++ ) {
				column = columns[i];
				column.nTf = cells[i].cell;
	
				if ( column.sClass ) {
					$(column.nTf).addClass( column.sClass );
				}
			}
		}
	}
	
	
	/**
	 * Draw the header (or footer) element based on the column visibility states. The
	 * methodology here is to use the layout array from _fnDetectHeader, modified for
	 * the instantaneous column visibility, to construct the new layout. The grid is
	 * traversed over cell at a time in a rows x columns grid fashion, although each
	 * cell insert can cover multiple elements in the grid - which is tracks using the
	 * aApplied array. Cell inserts in the grid will only occur where there isn't
	 * already a cell in that position.
	 *  @param {object} oSettings dataTables settings object
	 *  @param array {objects} aoSource Layout array from _fnDetectHeader
	 *  @param {boolean} [bIncludeHidden=false] If true then include the hidden columns in the calc,
	 *  @memberof DataTable#oApi
	 */
	function _fnDrawHead( oSettings, aoSource, bIncludeHidden )
	{
		var i, iLen, j, jLen, k, kLen, n, nLocalTr;
		var aoLocal = [];
		var aApplied = [];
		var iColumns = oSettings.aoColumns.length;
		var iRowspan, iColspan;
	
		if ( ! aoSource )
		{
			return;
		}
	
		if (  bIncludeHidden === undefined )
		{
			bIncludeHidden = false;
		}
	
		/* Make a copy of the master layout array, but without the visible columns in it */
		for ( i=0, iLen=aoSource.length ; i<iLen ; i++ )
		{
			aoLocal[i] = aoSource[i].slice();
			aoLocal[i].nTr = aoSource[i].nTr;
	
			/* Remove any columns which are currently hidden */
			for ( j=iColumns-1 ; j>=0 ; j-- )
			{
				if ( !oSettings.aoColumns[j].bVisible && !bIncludeHidden )
				{
					aoLocal[i].splice( j, 1 );
				}
			}
	
			/* Prep the applied array - it needs an element for each row */
			aApplied.push( [] );
		}
	
		for ( i=0, iLen=aoLocal.length ; i<iLen ; i++ )
		{
			nLocalTr = aoLocal[i].nTr;
	
			/* All cells are going to be replaced, so empty out the row */
			if ( nLocalTr )
			{
				while( (n = nLocalTr.firstChild) )
				{
					nLocalTr.removeChild( n );
				}
			}
	
			for ( j=0, jLen=aoLocal[i].length ; j<jLen ; j++ )
			{
				iRowspan = 1;
				iColspan = 1;
	
				/* Check to see if there is already a cell (row/colspan) covering our target
				 * insert point. If there is, then there is nothing to do.
				 */
				if ( aApplied[i][j] === undefined )
				{
					nLocalTr.appendChild( aoLocal[i][j].cell );
					aApplied[i][j] = 1;
	
					/* Expand the cell to cover as many rows as needed */
					while ( aoLocal[i+iRowspan] !== undefined &&
					        aoLocal[i][j].cell == aoLocal[i+iRowspan][j].cell )
					{
						aApplied[i+iRowspan][j] = 1;
						iRowspan++;
					}
	
					/* Expand the cell to cover as many columns as needed */
					while ( aoLocal[i][j+iColspan] !== undefined &&
					        aoLocal[i][j].cell == aoLocal[i][j+iColspan].cell )
					{
						/* Must update the applied array over the rows for the columns */
						for ( k=0 ; k<iRowspan ; k++ )
						{
							aApplied[i+k][j+iColspan] = 1;
						}
						iColspan++;
					}
	
					/* Do the actual expansion in the DOM */
					$(aoLocal[i][j].cell)
						.attr('rowspan', iRowspan)
						.attr('colspan', iColspan);
				}
			}
		}
	}
	
	
	/**
	 * Insert the required TR nodes into the table for display
	 *  @param {object} oSettings dataTables settings object
	 *  @param ajaxComplete true after ajax call to complete rendering
	 *  @memberof DataTable#oApi
	 */
	function _fnDraw( oSettings, ajaxComplete )
	{
		// Allow for state saving and a custom start position
		_fnStart( oSettings );
	
		/* Provide a pre-callback function which can be used to cancel the draw is false is returned */
		var aPreDraw = _fnCallbackFire( oSettings, 'aoPreDrawCallback', 'preDraw', [oSettings] );
		if ( $.inArray( false, aPreDraw ) !== -1 )
		{
			_fnProcessingDisplay( oSettings, false );
			return;
		}
	
		var anRows = [];
		var iRowCount = 0;
		var asStripeClasses = oSettings.asStripeClasses;
		var iStripes = asStripeClasses.length;
		var oLang = oSettings.oLanguage;
		var bServerSide = _fnDataSource( oSettings ) == 'ssp';
		var aiDisplay = oSettings.aiDisplay;
		var iDisplayStart = oSettings._iDisplayStart;
		var iDisplayEnd = oSettings.fnDisplayEnd();
	
		oSettings.bDrawing = true;
	
		/* Server-side processing draw intercept */
		if ( oSettings.bDeferLoading )
		{
			oSettings.bDeferLoading = false;
			oSettings.iDraw++;
			_fnProcessingDisplay( oSettings, false );
		}
		else if ( !bServerSide )
		{
			oSettings.iDraw++;
		}
		else if ( !oSettings.bDestroying && !ajaxComplete)
		{
			_fnAjaxUpdate( oSettings );
			return;
		}
	
		if ( aiDisplay.length !== 0 )
		{
			var iStart = bServerSide ? 0 : iDisplayStart;
			var iEnd = bServerSide ? oSettings.aoData.length : iDisplayEnd;
	
			for ( var j=iStart ; j<iEnd ; j++ )
			{
				var iDataIndex = aiDisplay[j];
				var aoData = oSettings.aoData[ iDataIndex ];
				if ( aoData.nTr === null )
				{
					_fnCreateTr( oSettings, iDataIndex );
				}
	
				var nRow = aoData.nTr;
	
				/* Remove the old striping classes and then add the new one */
				if ( iStripes !== 0 )
				{
					var sStripe = asStripeClasses[ iRowCount % iStripes ];
					if ( aoData._sRowStripe != sStripe )
					{
						$(nRow).removeClass( aoData._sRowStripe ).addClass( sStripe );
						aoData._sRowStripe = sStripe;
					}
				}
	
				// Row callback functions - might want to manipulate the row
				// iRowCount and j are not currently documented. Are they at all
				// useful?
				_fnCallbackFire( oSettings, 'aoRowCallback', null,
					[nRow, aoData._aData, iRowCount, j, iDataIndex] );
	
				anRows.push( nRow );
				iRowCount++;
			}
		}
		else
		{
			/* Table is empty - create a row with an empty message in it */
			var sZero = oLang.sZeroRecords;
			if ( oSettings.iDraw == 1 &&  _fnDataSource( oSettings ) == 'ajax' )
			{
				sZero = oLang.sLoadingRecords;
			}
			else if ( oLang.sEmptyTable && oSettings.fnRecordsTotal() === 0 )
			{
				sZero = oLang.sEmptyTable;
			}
	
			anRows[ 0 ] = $( '<tr/>', { 'class': iStripes ? asStripeClasses[0] : '' } )
				.append( $('<td />', {
					'valign':  'top',
					'colSpan': _fnVisbleColumns( oSettings ),
					'class':   oSettings.oClasses.sRowEmpty
				} ).html( sZero ) )[0];
		}
	
		/* Header and footer callbacks */
		_fnCallbackFire( oSettings, 'aoHeaderCallback', 'header', [ $(oSettings.nTHead).children('tr')[0],
			_fnGetDataMaster( oSettings ), iDisplayStart, iDisplayEnd, aiDisplay ] );
	
		_fnCallbackFire( oSettings, 'aoFooterCallback', 'footer', [ $(oSettings.nTFoot).children('tr')[0],
			_fnGetDataMaster( oSettings ), iDisplayStart, iDisplayEnd, aiDisplay ] );
	
		var body = $(oSettings.nTBody);
	
		body.children().detach();
		body.append( $(anRows) );
	
		/* Call all required callback functions for the end of a draw */
		_fnCallbackFire( oSettings, 'aoDrawCallback', 'draw', [oSettings] );
	
		/* Draw is complete, sorting and filtering must be as well */
		oSettings.bSorted = false;
		oSettings.bFiltered = false;
		oSettings.bDrawing = false;
	}
	
	
	/**
	 * Redraw the table - taking account of the various features which are enabled
	 *  @param {object} oSettings dataTables settings object
	 *  @param {boolean} [holdPosition] Keep the current paging position. By default
	 *    the paging is reset to the first page
	 *  @memberof DataTable#oApi
	 */
	function _fnReDraw( settings, holdPosition )
	{
		var
			features = settings.oFeatures,
			sort     = features.bSort,
			filter   = features.bFilter;
	
		if ( sort ) {
			_fnSort( settings );
		}
	
		if ( filter ) {
			_fnFilterComplete( settings, settings.oPreviousSearch );
		}
		else {
			// No filtering, so we want to just use the display master
			settings.aiDisplay = settings.aiDisplayMaster.slice();
		}
	
		if ( holdPosition !== true ) {
			settings._iDisplayStart = 0;
		}
	
		// Let any modules know about the draw hold position state (used by
		// scrolling internally)
		settings._drawHold = holdPosition;
	
		_fnDraw( settings );
	
		settings._drawHold = false;
	}
	
	
	/**
	 * Add the options to the page HTML for the table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnAddOptionsHtml ( oSettings )
	{
		var classes = oSettings.oClasses;
		var table = $(oSettings.nTable);
		var holding = $('<div/>').insertBefore( table ); // Holding element for speed
		var features = oSettings.oFeatures;
	
		// All DataTables are wrapped in a div
		var insert = $('<div/>', {
			id:      oSettings.sTableId+'_wrapper',
			'class': classes.sWrapper + (oSettings.nTFoot ? '' : ' '+classes.sNoFooter)
		} );
	
		oSettings.nHolding = holding[0];
		oSettings.nTableWrapper = insert[0];
		oSettings.nTableReinsertBefore = oSettings.nTable.nextSibling;
	
		/* Loop over the user set positioning and place the elements as needed */
		var aDom = oSettings.sDom.split('');
		var featureNode, cOption, nNewNode, cNext, sAttr, j;
		for ( var i=0 ; i<aDom.length ; i++ )
		{
			featureNode = null;
			cOption = aDom[i];
	
			if ( cOption == '<' )
			{
				/* New container div */
				nNewNode = $('<div/>')[0];
	
				/* Check to see if we should append an id and/or a class name to the container */
				cNext = aDom[i+1];
				if ( cNext == "'" || cNext == '"' )
				{
					sAttr = "";
					j = 2;
					while ( aDom[i+j] != cNext )
					{
						sAttr += aDom[i+j];
						j++;
					}
	
					/* Replace jQuery UI constants @todo depreciated */
					if ( sAttr == "H" )
					{
						sAttr = classes.sJUIHeader;
					}
					else if ( sAttr == "F" )
					{
						sAttr = classes.sJUIFooter;
					}
	
					/* The attribute can be in the format of "#id.class", "#id" or "class" This logic
					 * breaks the string into parts and applies them as needed
					 */
					if ( sAttr.indexOf('.') != -1 )
					{
						var aSplit = sAttr.split('.');
						nNewNode.id = aSplit[0].substr(1, aSplit[0].length-1);
						nNewNode.className = aSplit[1];
					}
					else if ( sAttr.charAt(0) == "#" )
					{
						nNewNode.id = sAttr.substr(1, sAttr.length-1);
					}
					else
					{
						nNewNode.className = sAttr;
					}
	
					i += j; /* Move along the position array */
				}
	
				insert.append( nNewNode );
				insert = $(nNewNode);
			}
			else if ( cOption == '>' )
			{
				/* End container div */
				insert = insert.parent();
			}
			// @todo Move options into their own plugins?
			else if ( cOption == 'l' && features.bPaginate && features.bLengthChange )
			{
				/* Length */
				featureNode = _fnFeatureHtmlLength( oSettings );
			}
			else if ( cOption == 'f' && features.bFilter )
			{
				/* Filter */
				featureNode = _fnFeatureHtmlFilter( oSettings );
			}
			else if ( cOption == 'r' && features.bProcessing )
			{
				/* pRocessing */
				featureNode = _fnFeatureHtmlProcessing( oSettings );
			}
			else if ( cOption == 't' )
			{
				/* Table */
				featureNode = _fnFeatureHtmlTable( oSettings );
			}
			else if ( cOption ==  'i' && features.bInfo )
			{
				/* Info */
				featureNode = _fnFeatureHtmlInfo( oSettings );
			}
			else if ( cOption == 'p' && features.bPaginate )
			{
				/* Pagination */
				featureNode = _fnFeatureHtmlPaginate( oSettings );
			}
			else if ( DataTable.ext.feature.length !== 0 )
			{
				/* Plug-in features */
				var aoFeatures = DataTable.ext.feature;
				for ( var k=0, kLen=aoFeatures.length ; k<kLen ; k++ )
				{
					if ( cOption == aoFeatures[k].cFeature )
					{
						featureNode = aoFeatures[k].fnInit( oSettings );
						break;
					}
				}
			}
	
			/* Add to the 2D features array */
			if ( featureNode )
			{
				var aanFeatures = oSettings.aanFeatures;
	
				if ( ! aanFeatures[cOption] )
				{
					aanFeatures[cOption] = [];
				}
	
				aanFeatures[cOption].push( featureNode );
				insert.append( featureNode );
			}
		}
	
		/* Built our DOM structure - replace the holding div with what we want */
		holding.replaceWith( insert );
		oSettings.nHolding = null;
	}
	
	
	/**
	 * Use the DOM source to create up an array of header cells. The idea here is to
	 * create a layout grid (array) of rows x columns, which contains a reference
	 * to the cell that that point in the grid (regardless of col/rowspan), such that
	 * any column / row could be removed and the new grid constructed
	 *  @param array {object} aLayout Array to store the calculated layout in
	 *  @param {node} nThead The header/footer element for the table
	 *  @memberof DataTable#oApi
	 */
	function _fnDetectHeader ( aLayout, nThead )
	{
		var nTrs = $(nThead).children('tr');
		var nTr, nCell;
		var i, k, l, iLen, jLen, iColShifted, iColumn, iColspan, iRowspan;
		var bUnique;
		var fnShiftCol = function ( a, i, j ) {
			var k = a[i];
	                while ( k[j] ) {
				j++;
			}
			return j;
		};
	
		aLayout.splice( 0, aLayout.length );
	
		/* We know how many rows there are in the layout - so prep it */
		for ( i=0, iLen=nTrs.length ; i<iLen ; i++ )
		{
			aLayout.push( [] );
		}
	
		/* Calculate a layout array */
		for ( i=0, iLen=nTrs.length ; i<iLen ; i++ )
		{
			nTr = nTrs[i];
			iColumn = 0;
	
			/* For every cell in the row... */
			nCell = nTr.firstChild;
			while ( nCell ) {
				if ( nCell.nodeName.toUpperCase() == "TD" ||
				     nCell.nodeName.toUpperCase() == "TH" )
				{
					/* Get the col and rowspan attributes from the DOM and sanitise them */
					iColspan = nCell.getAttribute('colspan') * 1;
					iRowspan = nCell.getAttribute('rowspan') * 1;
					iColspan = (!iColspan || iColspan===0 || iColspan===1) ? 1 : iColspan;
					iRowspan = (!iRowspan || iRowspan===0 || iRowspan===1) ? 1 : iRowspan;
	
					/* There might be colspan cells already in this row, so shift our target
					 * accordingly
					 */
					iColShifted = fnShiftCol( aLayout, i, iColumn );
	
					/* Cache calculation for unique columns */
					bUnique = iColspan === 1 ? true : false;
	
					/* If there is col / rowspan, copy the information into the layout grid */
					for ( l=0 ; l<iColspan ; l++ )
					{
						for ( k=0 ; k<iRowspan ; k++ )
						{
							aLayout[i+k][iColShifted+l] = {
								"cell": nCell,
								"unique": bUnique
							};
							aLayout[i+k].nTr = nTr;
						}
					}
				}
				nCell = nCell.nextSibling;
			}
		}
	}
	
	
	/**
	 * Get an array of unique th elements, one for each column
	 *  @param {object} oSettings dataTables settings object
	 *  @param {node} nHeader automatically detect the layout from this node - optional
	 *  @param {array} aLayout thead/tfoot layout from _fnDetectHeader - optional
	 *  @returns array {node} aReturn list of unique th's
	 *  @memberof DataTable#oApi
	 */
	function _fnGetUniqueThs ( oSettings, nHeader, aLayout )
	{
		var aReturn = [];
		if ( !aLayout )
		{
			aLayout = oSettings.aoHeader;
			if ( nHeader )
			{
				aLayout = [];
				_fnDetectHeader( aLayout, nHeader );
			}
		}
	
		for ( var i=0, iLen=aLayout.length ; i<iLen ; i++ )
		{
			for ( var j=0, jLen=aLayout[i].length ; j<jLen ; j++ )
			{
				if ( aLayout[i][j].unique &&
					 (!aReturn[j] || !oSettings.bSortCellsTop) )
				{
					aReturn[j] = aLayout[i][j].cell;
				}
			}
		}
	
		return aReturn;
	}
	
	/**
	 * Set the start position for draw
	 *  @param {object} oSettings dataTables settings object
	 */
	function _fnStart( oSettings )
	{
		var bServerSide = _fnDataSource( oSettings ) == 'ssp';
		var iInitDisplayStart = oSettings.iInitDisplayStart;
	
		// Check and see if we have an initial draw position from state saving
		if ( iInitDisplayStart !== undefined && iInitDisplayStart !== -1 )
		{
			oSettings._iDisplayStart = bServerSide ?
				iInitDisplayStart :
				iInitDisplayStart >= oSettings.fnRecordsDisplay() ?
					0 :
					iInitDisplayStart;
	
			oSettings.iInitDisplayStart = -1;
		}
	}
	
	/**
	 * Create an Ajax call based on the table's settings, taking into account that
	 * parameters can have multiple forms, and backwards compatibility.
	 *
	 * @param {object} oSettings dataTables settings object
	 * @param {array} data Data to send to the server, required by
	 *     DataTables - may be augmented by developer callbacks
	 * @param {function} fn Callback function to run when data is obtained
	 */
	function _fnBuildAjax( oSettings, data, fn )
	{
		// Compatibility with 1.9-, allow fnServerData and event to manipulate
		_fnCallbackFire( oSettings, 'aoServerParams', 'serverParams', [data] );
	
		// Convert to object based for 1.10+ if using the old array scheme which can
		// come from server-side processing or serverParams
		if ( data && Array.isArray(data) ) {
			var tmp = {};
			var rbracket = /(.*?)\[\]$/;
	
			$.each( data, function (key, val) {
				var match = val.name.match(rbracket);
	
				if ( match ) {
					// Support for arrays
					var name = match[0];
	
					if ( ! tmp[ name ] ) {
						tmp[ name ] = [];
					}
					tmp[ name ].push( val.value );
				}
				else {
					tmp[val.name] = val.value;
				}
			} );
			data = tmp;
		}
	
		var ajaxData;
		var ajax = oSettings.ajax;
		var instance = oSettings.oInstance;
		var callback = function ( json ) {
			var status = oSettings.jqXHR
				? oSettings.jqXHR.status
				: null;
	
			if ( json === null || (typeof status === 'number' && status == 204 ) ) {
				json = {};
				_fnAjaxDataSrc( oSettings, json, [] );
			}
	
			var error = json.error || json.sError;
			if ( error ) {
				_fnLog( oSettings, 0, error );
			}
	
			oSettings.json = json;
	
			_fnCallbackFire( oSettings, null, 'xhr', [oSettings, json, oSettings.jqXHR] );
			fn( json );
		};
	
		if ( $.isPlainObject( ajax ) && ajax.data )
		{
			ajaxData = ajax.data;
	
			var newData = typeof ajaxData === 'function' ?
				ajaxData( data, oSettings ) :  // fn can manipulate data or return
				ajaxData;                      // an object object or array to merge
	
			// If the function returned something, use that alone
			data = typeof ajaxData === 'function' && newData ?
				newData :
				$.extend( true, data, newData );
	
			// Remove the data property as we've resolved it already and don't want
			// jQuery to do it again (it is restored at the end of the function)
			delete ajax.data;
		}
	
		var baseAjax = {
			"data": data,
			"success": callback,
			"dataType": "json",
			"cache": false,
			"type": oSettings.sServerMethod,
			"error": function (xhr, error, thrown) {
				var ret = _fnCallbackFire( oSettings, null, 'xhr', [oSettings, null, oSettings.jqXHR] );
	
				if ( $.inArray( true, ret ) === -1 ) {
					if ( error == "parsererror" ) {
						_fnLog( oSettings, 0, 'Invalid JSON response', 1 );
					}
					else if ( xhr.readyState === 4 ) {
						_fnLog( oSettings, 0, 'Ajax error', 7 );
					}
				}
	
				_fnProcessingDisplay( oSettings, false );
			}
		};
	
		// Store the data submitted for the API
		oSettings.oAjaxData = data;
	
		// Allow plug-ins and external processes to modify the data
		_fnCallbackFire( oSettings, null, 'preXhr', [oSettings, data] );
	
		if ( oSettings.fnServerData )
		{
			// DataTables 1.9- compatibility
			oSettings.fnServerData.call( instance,
				oSettings.sAjaxSource,
				$.map( data, function (val, key) { // Need to convert back to 1.9 trad format
					return { name: key, value: val };
				} ),
				callback,
				oSettings
			);
		}
		else if ( oSettings.sAjaxSource || typeof ajax === 'string' )
		{
			// DataTables 1.9- compatibility
			oSettings.jqXHR = $.ajax( $.extend( baseAjax, {
				url: ajax || oSettings.sAjaxSource
			} ) );
		}
		else if ( typeof ajax === 'function' )
		{
			// Is a function - let the caller define what needs to be done
			oSettings.jqXHR = ajax.call( instance, data, callback, oSettings );
		}
		else
		{
			// Object to extend the base settings
			oSettings.jqXHR = $.ajax( $.extend( baseAjax, ajax ) );
	
			// Restore for next time around
			ajax.data = ajaxData;
		}
	}
	
	
	/**
	 * Update the table using an Ajax call
	 *  @param {object} settings dataTables settings object
	 *  @returns {boolean} Block the table drawing or not
	 *  @memberof DataTable#oApi
	 */
	function _fnAjaxUpdate( settings )
	{
		settings.iDraw++;
		_fnProcessingDisplay( settings, true );
	
		_fnBuildAjax(
			settings,
			_fnAjaxParameters( settings ),
			function(json) {
				_fnAjaxUpdateDraw( settings, json );
			}
		);
	}
	
	
	/**
	 * Build up the parameters in an object needed for a server-side processing
	 * request. Note that this is basically done twice, is different ways - a modern
	 * method which is used by default in DataTables 1.10 which uses objects and
	 * arrays, or the 1.9- method with is name / value pairs. 1.9 method is used if
	 * the sAjaxSource option is used in the initialisation, or the legacyAjax
	 * option is set.
	 *  @param {object} oSettings dataTables settings object
	 *  @returns {bool} block the table drawing or not
	 *  @memberof DataTable#oApi
	 */
	function _fnAjaxParameters( settings )
	{
		var
			columns = settings.aoColumns,
			columnCount = columns.length,
			features = settings.oFeatures,
			preSearch = settings.oPreviousSearch,
			preColSearch = settings.aoPreSearchCols,
			i, data = [], dataProp, column, columnSearch,
			sort = _fnSortFlatten( settings ),
			displayStart = settings._iDisplayStart,
			displayLength = features.bPaginate !== false ?
				settings._iDisplayLength :
				-1;
	
		var param = function ( name, value ) {
			data.push( { 'name': name, 'value': value } );
		};
	
		// DataTables 1.9- compatible method
		param( 'sEcho',          settings.iDraw );
		param( 'iColumns',       columnCount );
		param( 'sColumns',       _pluck( columns, 'sName' ).join(',') );
		param( 'iDisplayStart',  displayStart );
		param( 'iDisplayLength', displayLength );
	
		// DataTables 1.10+ method
		var d = {
			draw:    settings.iDraw,
			columns: [],
			order:   [],
			start:   displayStart,
			length:  displayLength,
			search:  {
				value: preSearch.sSearch,
				regex: preSearch.bRegex
			}
		};
	
		for ( i=0 ; i<columnCount ; i++ ) {
			column = columns[i];
			columnSearch = preColSearch[i];
			dataProp = typeof column.mData=="function" ? 'function' : column.mData ;
	
			d.columns.push( {
				data:       dataProp,
				name:       column.sName,
				searchable: column.bSearchable,
				orderable:  column.bSortable,
				search:     {
					value: columnSearch.sSearch,
					regex: columnSearch.bRegex
				}
			} );
	
			param( "mDataProp_"+i, dataProp );
	
			if ( features.bFilter ) {
				param( 'sSearch_'+i,     columnSearch.sSearch );
				param( 'bRegex_'+i,      columnSearch.bRegex );
				param( 'bSearchable_'+i, column.bSearchable );
			}
	
			if ( features.bSort ) {
				param( 'bSortable_'+i, column.bSortable );
			}
		}
	
		if ( features.bFilter ) {
			param( 'sSearch', preSearch.sSearch );
			param( 'bRegex', preSearch.bRegex );
		}
	
		if ( features.bSort ) {
			$.each( sort, function ( i, val ) {
				d.order.push( { column: val.col, dir: val.dir } );
	
				param( 'iSortCol_'+i, val.col );
				param( 'sSortDir_'+i, val.dir );
			} );
	
			param( 'iSortingCols', sort.length );
		}
	
		// If the legacy.ajax parameter is null, then we automatically decide which
		// form to use, based on sAjaxSource
		var legacy = DataTable.ext.legacy.ajax;
		if ( legacy === null ) {
			return settings.sAjaxSource ? data : d;
		}
	
		// Otherwise, if legacy has been specified then we use that to decide on the
		// form
		return legacy ? data : d;
	}
	
	
	/**
	 * Data the data from the server (nuking the old) and redraw the table
	 *  @param {object} oSettings dataTables settings object
	 *  @param {object} json json data return from the server.
	 *  @param {string} json.sEcho Tracking flag for DataTables to match requests
	 *  @param {int} json.iTotalRecords Number of records in the data set, not accounting for filtering
	 *  @param {int} json.iTotalDisplayRecords Number of records in the data set, accounting for filtering
	 *  @param {array} json.aaData The data to display on this page
	 *  @param {string} [json.sColumns] Column ordering (sName, comma separated)
	 *  @memberof DataTable#oApi
	 */
	function _fnAjaxUpdateDraw ( settings, json )
	{
		// v1.10 uses camelCase variables, while 1.9 uses Hungarian notation.
		// Support both
		var compat = function ( old, modern ) {
			return json[old] !== undefined ? json[old] : json[modern];
		};
	
		var data = _fnAjaxDataSrc( settings, json );
		var draw            = compat( 'sEcho',                'draw' );
		var recordsTotal    = compat( 'iTotalRecords',        'recordsTotal' );
		var recordsFiltered = compat( 'iTotalDisplayRecords', 'recordsFiltered' );
	
		if ( draw !== undefined ) {
			// Protect against out of sequence returns
			if ( draw*1 < settings.iDraw ) {
				return;
			}
			settings.iDraw = draw * 1;
		}
	
		// No data in returned object, so rather than an array, we show an empty table
		if ( ! data ) {
			data = [];
		}
	
		_fnClearTable( settings );
		settings._iRecordsTotal   = parseInt(recordsTotal, 10);
		settings._iRecordsDisplay = parseInt(recordsFiltered, 10);
	
		for ( var i=0, ien=data.length ; i<ien ; i++ ) {
			_fnAddData( settings, data[i] );
		}
		settings.aiDisplay = settings.aiDisplayMaster.slice();
	
		_fnDraw( settings, true );
	
		if ( ! settings._bInitComplete ) {
			_fnInitComplete( settings, json );
		}
	
		_fnProcessingDisplay( settings, false );
	}
	
	
	/**
	 * Get the data from the JSON data source to use for drawing a table. Using
	 * `_fnGetObjectDataFn` allows the data to be sourced from a property of the
	 * source object, or from a processing function.
	 *  @param {object} oSettings dataTables settings object
	 *  @param  {object} json Data source object / array from the server
	 *  @return {array} Array of data to use
	 */
	 function _fnAjaxDataSrc ( oSettings, json, write )
	 {
		var dataSrc = $.isPlainObject( oSettings.ajax ) && oSettings.ajax.dataSrc !== undefined ?
			oSettings.ajax.dataSrc :
			oSettings.sAjaxDataProp; // Compatibility with 1.9-.
	
		if ( ! write ) {
			if ( dataSrc === 'data' ) {
				// If the default, then we still want to support the old style, and safely ignore
				// it if possible
				return json.aaData || json[dataSrc];
			}
	
			return dataSrc !== "" ?
				_fnGetObjectDataFn( dataSrc )( json ) :
				json;
		}
	
		// set
		_fnSetObjectDataFn( dataSrc )( json, write );
	}
	
	/**
	 * Generate the node required for filtering text
	 *  @returns {node} Filter control element
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlFilter ( settings )
	{
		var classes = settings.oClasses;
		var tableId = settings.sTableId;
		var language = settings.oLanguage;
		var previousSearch = settings.oPreviousSearch;
		var features = settings.aanFeatures;
		var input = '<input type="search" class="'+classes.sFilterInput+'"/>';
	
		var str = language.sSearch;
		str = str.match(/_INPUT_/) ?
			str.replace('_INPUT_', input) :
			str+input;
	
		var filter = $('<div/>', {
				'id': ! features.f ? tableId+'_filter' : null,
				'class': classes.sFilter
			} )
			.append( $('<label/>' ).append( str ) );
	
		var searchFn = function(event) {
			/* Update all other filter input elements for the new display */
			var n = features.f;
			var val = !this.value ? "" : this.value; // mental IE8 fix :-(
			if(previousSearch.return && event.key !== "Enter") {
				return;
			}
			/* Now do the filter */
			if ( val != previousSearch.sSearch ) {
				_fnFilterComplete( settings, {
					"sSearch": val,
					"bRegex": previousSearch.bRegex,
					"bSmart": previousSearch.bSmart ,
					"bCaseInsensitive": previousSearch.bCaseInsensitive,
					"return": previousSearch.return
				} );
	
				// Need to redraw, without resorting
				settings._iDisplayStart = 0;
				_fnDraw( settings );
			}
		};
	
		var searchDelay = settings.searchDelay !== null ?
			settings.searchDelay :
			_fnDataSource( settings ) === 'ssp' ?
				400 :
				0;
	
		var jqFilter = $('input', filter)
			.val( previousSearch.sSearch )
			.attr( 'placeholder', language.sSearchPlaceholder )
			.on(
				'keyup.DT search.DT input.DT paste.DT cut.DT',
				searchDelay ?
					_fnThrottle( searchFn, searchDelay ) :
					searchFn
			)
			.on( 'mouseup', function(e) {
				// Edge fix! Edge 17 does not trigger anything other than mouse events when clicking
				// on the clear icon (Edge bug 17584515). This is safe in other browsers as `searchFn`
				// checks the value to see if it has changed. In other browsers it won't have.
				setTimeout( function () {
					searchFn.call(jqFilter[0], e);
				}, 10);
			} )
			.on( 'keypress.DT', function(e) {
				/* Prevent form submission */
				if ( e.keyCode == 13 ) {
					return false;
				}
			} )
			.attr('aria-controls', tableId);
	
		// Update the input elements whenever the table is filtered
		$(settings.nTable).on( 'search.dt.DT', function ( ev, s ) {
			if ( settings === s ) {
				// IE9 throws an 'unknown error' if document.activeElement is used
				// inside an iframe or frame...
				try {
					if ( jqFilter[0] !== document.activeElement ) {
						jqFilter.val( previousSearch.sSearch );
					}
				}
				catch ( e ) {}
			}
		} );
	
		return filter[0];
	}
	
	
	/**
	 * Filter the table using both the global filter and column based filtering
	 *  @param {object} oSettings dataTables settings object
	 *  @param {object} oSearch search information
	 *  @param {int} [iForce] force a research of the master array (1) or not (undefined or 0)
	 *  @memberof DataTable#oApi
	 */
	function _fnFilterComplete ( oSettings, oInput, iForce )
	{
		var oPrevSearch = oSettings.oPreviousSearch;
		var aoPrevSearch = oSettings.aoPreSearchCols;
		var fnSaveFilter = function ( oFilter ) {
			/* Save the filtering values */
			oPrevSearch.sSearch = oFilter.sSearch;
			oPrevSearch.bRegex = oFilter.bRegex;
			oPrevSearch.bSmart = oFilter.bSmart;
			oPrevSearch.bCaseInsensitive = oFilter.bCaseInsensitive;
			oPrevSearch.return = oFilter.return;
		};
		var fnRegex = function ( o ) {
			// Backwards compatibility with the bEscapeRegex option
			return o.bEscapeRegex !== undefined ? !o.bEscapeRegex : o.bRegex;
		};
	
		// Resolve any column types that are unknown due to addition or invalidation
		// @todo As per sort - can this be moved into an event handler?
		_fnColumnTypes( oSettings );
	
		/* In server-side processing all filtering is done by the server, so no point hanging around here */
		if ( _fnDataSource( oSettings ) != 'ssp' )
		{
			/* Global filter */
			_fnFilter( oSettings, oInput.sSearch, iForce, fnRegex(oInput), oInput.bSmart, oInput.bCaseInsensitive, oInput.return );
			fnSaveFilter( oInput );
	
			/* Now do the individual column filter */
			for ( var i=0 ; i<aoPrevSearch.length ; i++ )
			{
				_fnFilterColumn( oSettings, aoPrevSearch[i].sSearch, i, fnRegex(aoPrevSearch[i]),
					aoPrevSearch[i].bSmart, aoPrevSearch[i].bCaseInsensitive );
			}
	
			/* Custom filtering */
			_fnFilterCustom( oSettings );
		}
		else
		{
			fnSaveFilter( oInput );
		}
	
		/* Tell the draw function we have been filtering */
		oSettings.bFiltered = true;
		_fnCallbackFire( oSettings, null, 'search', [oSettings] );
	}
	
	
	/**
	 * Apply custom filtering functions
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnFilterCustom( settings )
	{
		var filters = DataTable.ext.search;
		var displayRows = settings.aiDisplay;
		var row, rowIdx;
	
		for ( var i=0, ien=filters.length ; i<ien ; i++ ) {
			var rows = [];
	
			// Loop over each row and see if it should be included
			for ( var j=0, jen=displayRows.length ; j<jen ; j++ ) {
				rowIdx = displayRows[ j ];
				row = settings.aoData[ rowIdx ];
	
				if ( filters[i]( settings, row._aFilterData, rowIdx, row._aData, j ) ) {
					rows.push( rowIdx );
				}
			}
	
			// So the array reference doesn't break set the results into the
			// existing array
			displayRows.length = 0;
			$.merge( displayRows, rows );
		}
	}
	
	
	/**
	 * Filter the table on a per-column basis
	 *  @param {object} oSettings dataTables settings object
	 *  @param {string} sInput string to filter on
	 *  @param {int} iColumn column to filter
	 *  @param {bool} bRegex treat search string as a regular expression or not
	 *  @param {bool} bSmart use smart filtering or not
	 *  @param {bool} bCaseInsensitive Do case insensitive matching or not
	 *  @memberof DataTable#oApi
	 */
	function _fnFilterColumn ( settings, searchStr, colIdx, regex, smart, caseInsensitive )
	{
		if ( searchStr === '' ) {
			return;
		}
	
		var data;
		var out = [];
		var display = settings.aiDisplay;
		var rpSearch = _fnFilterCreateSearch( searchStr, regex, smart, caseInsensitive );
	
		for ( var i=0 ; i<display.length ; i++ ) {
			data = settings.aoData[ display[i] ]._aFilterData[ colIdx ];
	
			if ( rpSearch.test( data ) ) {
				out.push( display[i] );
			}
		}
	
		settings.aiDisplay = out;
	}
	
	
	/**
	 * Filter the data table based on user input and draw the table
	 *  @param {object} settings dataTables settings object
	 *  @param {string} input string to filter on
	 *  @param {int} force optional - force a research of the master array (1) or not (undefined or 0)
	 *  @param {bool} regex treat as a regular expression or not
	 *  @param {bool} smart perform smart filtering or not
	 *  @param {bool} caseInsensitive Do case insensitive matching or not
	 *  @memberof DataTable#oApi
	 */
	function _fnFilter( settings, input, force, regex, smart, caseInsensitive )
	{
		var rpSearch = _fnFilterCreateSearch( input, regex, smart, caseInsensitive );
		var prevSearch = settings.oPreviousSearch.sSearch;
		var displayMaster = settings.aiDisplayMaster;
		var display, invalidated, i;
		var filtered = [];
	
		// Need to take account of custom filtering functions - always filter
		if ( DataTable.ext.search.length !== 0 ) {
			force = true;
		}
	
		// Check if any of the rows were invalidated
		invalidated = _fnFilterData( settings );
	
		// If the input is blank - we just want the full data set
		if ( input.length <= 0 ) {
			settings.aiDisplay = displayMaster.slice();
		}
		else {
			// New search - start from the master array
			if ( invalidated ||
				 force ||
				 regex ||
				 prevSearch.length > input.length ||
				 input.indexOf(prevSearch) !== 0 ||
				 settings.bSorted // On resort, the display master needs to be
				                  // re-filtered since indexes will have changed
			) {
				settings.aiDisplay = displayMaster.slice();
			}
	
			// Search the display array
			display = settings.aiDisplay;
	
			for ( i=0 ; i<display.length ; i++ ) {
				if ( rpSearch.test( settings.aoData[ display[i] ]._sFilterRow ) ) {
					filtered.push( display[i] );
				}
			}
	
			settings.aiDisplay = filtered;
		}
	}
	
	
	/**
	 * Build a regular expression object suitable for searching a table
	 *  @param {string} sSearch string to search for
	 *  @param {bool} bRegex treat as a regular expression or not
	 *  @param {bool} bSmart perform smart filtering or not
	 *  @param {bool} bCaseInsensitive Do case insensitive matching or not
	 *  @returns {RegExp} constructed object
	 *  @memberof DataTable#oApi
	 */
	function _fnFilterCreateSearch( search, regex, smart, caseInsensitive )
	{
		search = regex ?
			search :
			_fnEscapeRegex( search );
		
		if ( smart ) {
			/* For smart filtering we want to allow the search to work regardless of
			 * word order. We also want double quoted text to be preserved, so word
			 * order is important - a la google. So this is what we want to
			 * generate:
			 * 
			 * ^(?=.*?\bone\b)(?=.*?\btwo three\b)(?=.*?\bfour\b).*$
			 */
			var a = $.map( search.match( /"[^"]+"|[^ ]+/g ) || [''], function ( word ) {
				if ( word.charAt(0) === '"' ) {
					var m = word.match( /^"(.*)"$/ );
					word = m ? m[1] : word;
				}
	
				return word.replace('"', '');
			} );
	
			search = '^(?=.*?'+a.join( ')(?=.*?' )+').*$';
		}
	
		return new RegExp( search, caseInsensitive ? 'i' : '' );
	}
	
	
	/**
	 * Escape a string such that it can be used in a regular expression
	 *  @param {string} sVal string to escape
	 *  @returns {string} escaped string
	 *  @memberof DataTable#oApi
	 */
	var _fnEscapeRegex = DataTable.util.escapeRegex;
	
	var __filter_div = $('<div>')[0];
	var __filter_div_textContent = __filter_div.textContent !== undefined;
	
	// Update the filtering data for each row if needed (by invalidation or first run)
	function _fnFilterData ( settings )
	{
		var columns = settings.aoColumns;
		var column;
		var i, j, ien, jen, filterData, cellData, row;
		var wasInvalidated = false;
	
		for ( i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
			row = settings.aoData[i];
	
			if ( ! row._aFilterData ) {
				filterData = [];
	
				for ( j=0, jen=columns.length ; j<jen ; j++ ) {
					column = columns[j];
	
					if ( column.bSearchable ) {
						cellData = _fnGetCellData( settings, i, j, 'filter' );
	
						// Search in DataTables 1.10 is string based. In 1.11 this
						// should be altered to also allow strict type checking.
						if ( cellData === null ) {
							cellData = '';
						}
	
						if ( typeof cellData !== 'string' && cellData.toString ) {
							cellData = cellData.toString();
						}
					}
					else {
						cellData = '';
					}
	
					// If it looks like there is an HTML entity in the string,
					// attempt to decode it so sorting works as expected. Note that
					// we could use a single line of jQuery to do this, but the DOM
					// method used here is much faster http://jsperf.com/html-decode
					if ( cellData.indexOf && cellData.indexOf('&') !== -1 ) {
						__filter_div.innerHTML = cellData;
						cellData = __filter_div_textContent ?
							__filter_div.textContent :
							__filter_div.innerText;
					}
	
					if ( cellData.replace ) {
						cellData = cellData.replace(/[\r\n\u2028]/g, '');
					}
	
					filterData.push( cellData );
				}
	
				row._aFilterData = filterData;
				row._sFilterRow = filterData.join('  ');
				wasInvalidated = true;
			}
		}
	
		return wasInvalidated;
	}
	
	
	/**
	 * Convert from the internal Hungarian notation to camelCase for external
	 * interaction
	 *  @param {object} obj Object to convert
	 *  @returns {object} Inverted object
	 *  @memberof DataTable#oApi
	 */
	function _fnSearchToCamel ( obj )
	{
		return {
			search:          obj.sSearch,
			smart:           obj.bSmart,
			regex:           obj.bRegex,
			caseInsensitive: obj.bCaseInsensitive
		};
	}
	
	
	
	/**
	 * Convert from camelCase notation to the internal Hungarian. We could use the
	 * Hungarian convert function here, but this is cleaner
	 *  @param {object} obj Object to convert
	 *  @returns {object} Inverted object
	 *  @memberof DataTable#oApi
	 */
	function _fnSearchToHung ( obj )
	{
		return {
			sSearch:          obj.search,
			bSmart:           obj.smart,
			bRegex:           obj.regex,
			bCaseInsensitive: obj.caseInsensitive
		};
	}
	
	/**
	 * Generate the node required for the info display
	 *  @param {object} oSettings dataTables settings object
	 *  @returns {node} Information element
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlInfo ( settings )
	{
		var
			tid = settings.sTableId,
			nodes = settings.aanFeatures.i,
			n = $('<div/>', {
				'class': settings.oClasses.sInfo,
				'id': ! nodes ? tid+'_info' : null
			} );
	
		if ( ! nodes ) {
			// Update display on each draw
			settings.aoDrawCallback.push( {
				"fn": _fnUpdateInfo,
				"sName": "information"
			} );
	
			n
				.attr( 'role', 'status' )
				.attr( 'aria-live', 'polite' );
	
			// Table is described by our info div
			$(settings.nTable).attr( 'aria-describedby', tid+'_info' );
		}
	
		return n[0];
	}
	
	
	/**
	 * Update the information elements in the display
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnUpdateInfo ( settings )
	{
		/* Show information about the table */
		var nodes = settings.aanFeatures.i;
		if ( nodes.length === 0 ) {
			return;
		}
	
		var
			lang  = settings.oLanguage,
			start = settings._iDisplayStart+1,
			end   = settings.fnDisplayEnd(),
			max   = settings.fnRecordsTotal(),
			total = settings.fnRecordsDisplay(),
			out   = total ?
				lang.sInfo :
				lang.sInfoEmpty;
	
		if ( total !== max ) {
			/* Record set after filtering */
			out += ' ' + lang.sInfoFiltered;
		}
	
		// Convert the macros
		out += lang.sInfoPostFix;
		out = _fnInfoMacros( settings, out );
	
		var callback = lang.fnInfoCallback;
		if ( callback !== null ) {
			out = callback.call( settings.oInstance,
				settings, start, end, max, total, out
			);
		}
	
		$(nodes).html( out );
	}
	
	
	function _fnInfoMacros ( settings, str )
	{
		// When infinite scrolling, we are always starting at 1. _iDisplayStart is used only
		// internally
		var
			formatter  = settings.fnFormatNumber,
			start      = settings._iDisplayStart+1,
			len        = settings._iDisplayLength,
			vis        = settings.fnRecordsDisplay(),
			all        = len === -1;
	
		return str.
			replace(/_START_/g, formatter.call( settings, start ) ).
			replace(/_END_/g,   formatter.call( settings, settings.fnDisplayEnd() ) ).
			replace(/_MAX_/g,   formatter.call( settings, settings.fnRecordsTotal() ) ).
			replace(/_TOTAL_/g, formatter.call( settings, vis ) ).
			replace(/_PAGE_/g,  formatter.call( settings, all ? 1 : Math.ceil( start / len ) ) ).
			replace(/_PAGES_/g, formatter.call( settings, all ? 1 : Math.ceil( vis / len ) ) );
	}
	
	
	
	/**
	 * Draw the table for the first time, adding all required features
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnInitialise ( settings )
	{
		var i, iLen, iAjaxStart=settings.iInitDisplayStart;
		var columns = settings.aoColumns, column;
		var features = settings.oFeatures;
		var deferLoading = settings.bDeferLoading; // value modified by the draw
	
		/* Ensure that the table data is fully initialised */
		if ( ! settings.bInitialised ) {
			setTimeout( function(){ _fnInitialise( settings ); }, 200 );
			return;
		}
	
		/* Show the display HTML options */
		_fnAddOptionsHtml( settings );
	
		/* Build and draw the header / footer for the table */
		_fnBuildHead( settings );
		_fnDrawHead( settings, settings.aoHeader );
		_fnDrawHead( settings, settings.aoFooter );
	
		/* Okay to show that something is going on now */
		_fnProcessingDisplay( settings, true );
	
		/* Calculate sizes for columns */
		if ( features.bAutoWidth ) {
			_fnCalculateColumnWidths( settings );
		}
	
		for ( i=0, iLen=columns.length ; i<iLen ; i++ ) {
			column = columns[i];
	
			if ( column.sWidth ) {
				column.nTh.style.width = _fnStringToCss( column.sWidth );
			}
		}
	
		_fnCallbackFire( settings, null, 'preInit', [settings] );
	
		// If there is default sorting required - let's do it. The sort function
		// will do the drawing for us. Otherwise we draw the table regardless of the
		// Ajax source - this allows the table to look initialised for Ajax sourcing
		// data (show 'loading' message possibly)
		_fnReDraw( settings );
	
		// Server-side processing init complete is done by _fnAjaxUpdateDraw
		var dataSrc = _fnDataSource( settings );
		if ( dataSrc != 'ssp' || deferLoading ) {
			// if there is an ajax source load the data
			if ( dataSrc == 'ajax' ) {
				_fnBuildAjax( settings, [], function(json) {
					var aData = _fnAjaxDataSrc( settings, json );
	
					// Got the data - add it to the table
					for ( i=0 ; i<aData.length ; i++ ) {
						_fnAddData( settings, aData[i] );
					}
	
					// Reset the init display for cookie saving. We've already done
					// a filter, and therefore cleared it before. So we need to make
					// it appear 'fresh'
					settings.iInitDisplayStart = iAjaxStart;
	
					_fnReDraw( settings );
	
					_fnProcessingDisplay( settings, false );
					_fnInitComplete( settings, json );
				}, settings );
			}
			else {
				_fnProcessingDisplay( settings, false );
				_fnInitComplete( settings );
			}
		}
	}
	
	
	/**
	 * Draw the table for the first time, adding all required features
	 *  @param {object} oSettings dataTables settings object
	 *  @param {object} [json] JSON from the server that completed the table, if using Ajax source
	 *    with client-side processing (optional)
	 *  @memberof DataTable#oApi
	 */
	function _fnInitComplete ( settings, json )
	{
		settings._bInitComplete = true;
	
		// When data was added after the initialisation (data or Ajax) we need to
		// calculate the column sizing
		if ( json || settings.oInit.aaData ) {
			_fnAdjustColumnSizing( settings );
		}
	
		_fnCallbackFire( settings, null, 'plugin-init', [settings, json] );
		_fnCallbackFire( settings, 'aoInitComplete', 'init', [settings, json] );
	}
	
	
	function _fnLengthChange ( settings, val )
	{
		var len = parseInt( val, 10 );
		settings._iDisplayLength = len;
	
		_fnLengthOverflow( settings );
	
		// Fire length change event
		_fnCallbackFire( settings, null, 'length', [settings, len] );
	}
	
	
	/**
	 * Generate the node required for user display length changing
	 *  @param {object} settings dataTables settings object
	 *  @returns {node} Display length feature node
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlLength ( settings )
	{
		var
			classes  = settings.oClasses,
			tableId  = settings.sTableId,
			menu     = settings.aLengthMenu,
			d2       = Array.isArray( menu[0] ),
			lengths  = d2 ? menu[0] : menu,
			language = d2 ? menu[1] : menu;
	
		var select = $('<select/>', {
			'name':          tableId+'_length',
			'aria-controls': tableId,
			'class':         classes.sLengthSelect
		} );
	
		for ( var i=0, ien=lengths.length ; i<ien ; i++ ) {
			select[0][ i ] = new Option(
				typeof language[i] === 'number' ?
					settings.fnFormatNumber( language[i] ) :
					language[i],
				lengths[i]
			);
		}
	
		var div = $('<div><label/></div>').addClass( classes.sLength );
		if ( ! settings.aanFeatures.l ) {
			div[0].id = tableId+'_length';
		}
	
		div.children().append(
			settings.oLanguage.sLengthMenu.replace( '_MENU_', select[0].outerHTML )
		);
	
		// Can't use `select` variable as user might provide their own and the
		// reference is broken by the use of outerHTML
		$('select', div)
			.val( settings._iDisplayLength )
			.on( 'change.DT', function(e) {
				_fnLengthChange( settings, $(this).val() );
				_fnDraw( settings );
			} );
	
		// Update node value whenever anything changes the table's length
		$(settings.nTable).on( 'length.dt.DT', function (e, s, len) {
			if ( settings === s ) {
				$('select', div).val( len );
			}
		} );
	
		return div[0];
	}
	
	
	
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Note that most of the paging logic is done in
	 * DataTable.ext.pager
	 */
	
	/**
	 * Generate the node required for default pagination
	 *  @param {object} oSettings dataTables settings object
	 *  @returns {node} Pagination feature node
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlPaginate ( settings )
	{
		var
			type   = settings.sPaginationType,
			plugin = DataTable.ext.pager[ type ],
			modern = typeof plugin === 'function',
			redraw = function( settings ) {
				_fnDraw( settings );
			},
			node = $('<div/>').addClass( settings.oClasses.sPaging + type )[0],
			features = settings.aanFeatures;
	
		if ( ! modern ) {
			plugin.fnInit( settings, node, redraw );
		}
	
		/* Add a draw callback for the pagination on first instance, to update the paging display */
		if ( ! features.p )
		{
			node.id = settings.sTableId+'_paginate';
	
			settings.aoDrawCallback.push( {
				"fn": function( settings ) {
					if ( modern ) {
						var
							start      = settings._iDisplayStart,
							len        = settings._iDisplayLength,
							visRecords = settings.fnRecordsDisplay(),
							all        = len === -1,
							page = all ? 0 : Math.ceil( start / len ),
							pages = all ? 1 : Math.ceil( visRecords / len ),
							buttons = plugin(page, pages),
							i, ien;
	
						for ( i=0, ien=features.p.length ; i<ien ; i++ ) {
							_fnRenderer( settings, 'pageButton' )(
								settings, features.p[i], i, buttons, page, pages
							);
						}
					}
					else {
						plugin.fnUpdate( settings, redraw );
					}
				},
				"sName": "pagination"
			} );
		}
	
		return node;
	}
	
	
	/**
	 * Alter the display settings to change the page
	 *  @param {object} settings DataTables settings object
	 *  @param {string|int} action Paging action to take: "first", "previous",
	 *    "next" or "last" or page number to jump to (integer)
	 *  @param [bool] redraw Automatically draw the update or not
	 *  @returns {bool} true page has changed, false - no change
	 *  @memberof DataTable#oApi
	 */
	function _fnPageChange ( settings, action, redraw )
	{
		var
			start     = settings._iDisplayStart,
			len       = settings._iDisplayLength,
			records   = settings.fnRecordsDisplay();
	
		if ( records === 0 || len === -1 )
		{
			start = 0;
		}
		else if ( typeof action === "number" )
		{
			start = action * len;
	
			if ( start > records )
			{
				start = 0;
			}
		}
		else if ( action == "first" )
		{
			start = 0;
		}
		else if ( action == "previous" )
		{
			start = len >= 0 ?
				start - len :
				0;
	
			if ( start < 0 )
			{
			  start = 0;
			}
		}
		else if ( action == "next" )
		{
			if ( start + len < records )
			{
				start += len;
			}
		}
		else if ( action == "last" )
		{
			start = Math.floor( (records-1) / len) * len;
		}
		else
		{
			_fnLog( settings, 0, "Unknown paging action: "+action, 5 );
		}
	
		var changed = settings._iDisplayStart !== start;
		settings._iDisplayStart = start;
	
		if ( changed ) {
			_fnCallbackFire( settings, null, 'page', [settings] );
	
			if ( redraw ) {
				_fnDraw( settings );
			}
		}
	
		return changed;
	}
	
	
	
	/**
	 * Generate the node required for the processing node
	 *  @param {object} settings dataTables settings object
	 *  @returns {node} Processing element
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlProcessing ( settings )
	{
		return $('<div/>', {
				'id': ! settings.aanFeatures.r ? settings.sTableId+'_processing' : null,
				'class': settings.oClasses.sProcessing
			} )
			.html( settings.oLanguage.sProcessing )
			.insertBefore( settings.nTable )[0];
	}
	
	
	/**
	 * Display or hide the processing indicator
	 *  @param {object} settings dataTables settings object
	 *  @param {bool} show Show the processing indicator (true) or not (false)
	 *  @memberof DataTable#oApi
	 */
	function _fnProcessingDisplay ( settings, show )
	{
		if ( settings.oFeatures.bProcessing ) {
			$(settings.aanFeatures.r).css( 'display', show ? 'block' : 'none' );
		}
	
		_fnCallbackFire( settings, null, 'processing', [settings, show] );
	}
	
	/**
	 * Add any control elements for the table - specifically scrolling
	 *  @param {object} settings dataTables settings object
	 *  @returns {node} Node to add to the DOM
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlTable ( settings )
	{
		var table = $(settings.nTable);
	
		// Scrolling from here on in
		var scroll = settings.oScroll;
	
		if ( scroll.sX === '' && scroll.sY === '' ) {
			return settings.nTable;
		}
	
		var scrollX = scroll.sX;
		var scrollY = scroll.sY;
		var classes = settings.oClasses;
		var caption = table.children('caption');
		var captionSide = caption.length ? caption[0]._captionSide : null;
		var headerClone = $( table[0].cloneNode(false) );
		var footerClone = $( table[0].cloneNode(false) );
		var footer = table.children('tfoot');
		var _div = '<div/>';
		var size = function ( s ) {
			return !s ? null : _fnStringToCss( s );
		};
	
		if ( ! footer.length ) {
			footer = null;
		}
	
		/*
		 * The HTML structure that we want to generate in this function is:
		 *  div - scroller
		 *    div - scroll head
		 *      div - scroll head inner
		 *        table - scroll head table
		 *          thead - thead
		 *    div - scroll body
		 *      table - table (master table)
		 *        thead - thead clone for sizing
		 *        tbody - tbody
		 *    div - scroll foot
		 *      div - scroll foot inner
		 *        table - scroll foot table
		 *          tfoot - tfoot
		 */
		var scroller = $( _div, { 'class': classes.sScrollWrapper } )
			.append(
				$(_div, { 'class': classes.sScrollHead } )
					.css( {
						overflow: 'hidden',
						position: 'relative',
						border: 0,
						width: scrollX ? size(scrollX) : '100%'
					} )
					.append(
						$(_div, { 'class': classes.sScrollHeadInner } )
							.css( {
								'box-sizing': 'content-box',
								width: scroll.sXInner || '100%'
							} )
							.append(
								headerClone
									.removeAttr('id')
									.css( 'margin-left', 0 )
									.append( captionSide === 'top' ? caption : null )
									.append(
										table.children('thead')
									)
							)
					)
			)
			.append(
				$(_div, { 'class': classes.sScrollBody } )
					.css( {
						position: 'relative',
						overflow: 'auto',
						width: size( scrollX )
					} )
					.append( table )
			);
	
		if ( footer ) {
			scroller.append(
				$(_div, { 'class': classes.sScrollFoot } )
					.css( {
						overflow: 'hidden',
						border: 0,
						width: scrollX ? size(scrollX) : '100%'
					} )
					.append(
						$(_div, { 'class': classes.sScrollFootInner } )
							.append(
								footerClone
									.removeAttr('id')
									.css( 'margin-left', 0 )
									.append( captionSide === 'bottom' ? caption : null )
									.append(
										table.children('tfoot')
									)
							)
					)
			);
		}
	
		var children = scroller.children();
		var scrollHead = children[0];
		var scrollBody = children[1];
		var scrollFoot = footer ? children[2] : null;
	
		// When the body is scrolled, then we also want to scroll the headers
		if ( scrollX ) {
			$(scrollBody).on( 'scroll.DT', function (e) {
				var scrollLeft = this.scrollLeft;
	
				scrollHead.scrollLeft = scrollLeft;
	
				if ( footer ) {
					scrollFoot.scrollLeft = scrollLeft;
				}
			} );
		}
	
		$(scrollBody).css('max-height', scrollY);
		if (! scroll.bCollapse) {
			$(scrollBody).css('height', scrollY);
		}
	
		settings.nScrollHead = scrollHead;
		settings.nScrollBody = scrollBody;
		settings.nScrollFoot = scrollFoot;
	
		// On redraw - align columns
		settings.aoDrawCallback.push( {
			"fn": _fnScrollDraw,
			"sName": "scrolling"
		} );
	
		return scroller[0];
	}
	
	
	
	/**
	 * Update the header, footer and body tables for resizing - i.e. column
	 * alignment.
	 *
	 * Welcome to the most horrible function DataTables. The process that this
	 * function follows is basically:
	 *   1. Re-create the table inside the scrolling div
	 *   2. Take live measurements from the DOM
	 *   3. Apply the measurements to align the columns
	 *   4. Clean up
	 *
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnScrollDraw ( settings )
	{
		// Given that this is such a monster function, a lot of variables are use
		// to try and keep the minimised size as small as possible
		var
			scroll         = settings.oScroll,
			scrollX        = scroll.sX,
			scrollXInner   = scroll.sXInner,
			scrollY        = scroll.sY,
			barWidth       = scroll.iBarWidth,
			divHeader      = $(settings.nScrollHead),
			divHeaderStyle = divHeader[0].style,
			divHeaderInner = divHeader.children('div'),
			divHeaderInnerStyle = divHeaderInner[0].style,
			divHeaderTable = divHeaderInner.children('table'),
			divBodyEl      = settings.nScrollBody,
			divBody        = $(divBodyEl),
			divBodyStyle   = divBodyEl.style,
			divFooter      = $(settings.nScrollFoot),
			divFooterInner = divFooter.children('div'),
			divFooterTable = divFooterInner.children('table'),
			header         = $(settings.nTHead),
			table          = $(settings.nTable),
			tableEl        = table[0],
			tableStyle     = tableEl.style,
			footer         = settings.nTFoot ? $(settings.nTFoot) : null,
			browser        = settings.oBrowser,
			ie67           = browser.bScrollOversize,
			dtHeaderCells  = _pluck( settings.aoColumns, 'nTh' ),
			headerTrgEls, footerTrgEls,
			headerSrcEls, footerSrcEls,
			headerCopy, footerCopy,
			headerWidths=[], footerWidths=[],
			headerContent=[], footerContent=[],
			idx, correction, sanityWidth,
			zeroOut = function(nSizer) {
				var style = nSizer.style;
				style.paddingTop = "0";
				style.paddingBottom = "0";
				style.borderTopWidth = "0";
				style.borderBottomWidth = "0";
				style.height = 0;
			};
	
		// If the scrollbar visibility has changed from the last draw, we need to
		// adjust the column sizes as the table width will have changed to account
		// for the scrollbar
		var scrollBarVis = divBodyEl.scrollHeight > divBodyEl.clientHeight;
		
		if ( settings.scrollBarVis !== scrollBarVis && settings.scrollBarVis !== undefined ) {
			settings.scrollBarVis = scrollBarVis;
			_fnAdjustColumnSizing( settings );
			return; // adjust column sizing will call this function again
		}
		else {
			settings.scrollBarVis = scrollBarVis;
		}
	
		/*
		 * 1. Re-create the table inside the scrolling div
		 */
	
		// Remove the old minimised thead and tfoot elements in the inner table
		table.children('thead, tfoot').remove();
	
		if ( footer ) {
			footerCopy = footer.clone().prependTo( table );
			footerTrgEls = footer.find('tr'); // the original tfoot is in its own table and must be sized
			footerSrcEls = footerCopy.find('tr');
		}
	
		// Clone the current header and footer elements and then place it into the inner table
		headerCopy = header.clone().prependTo( table );
		headerTrgEls = header.find('tr'); // original header is in its own table
		headerSrcEls = headerCopy.find('tr');
		headerCopy.find('th, td').removeAttr('tabindex');
	
	
		/*
		 * 2. Take live measurements from the DOM - do not alter the DOM itself!
		 */
	
		// Remove old sizing and apply the calculated column widths
		// Get the unique column headers in the newly created (cloned) header. We want to apply the
		// calculated sizes to this header
		if ( ! scrollX )
		{
			divBodyStyle.width = '100%';
			divHeader[0].style.width = '100%';
		}
	
		$.each( _fnGetUniqueThs( settings, headerCopy ), function ( i, el ) {
			idx = _fnVisibleToColumnIndex( settings, i );
			el.style.width = settings.aoColumns[idx].sWidth;
		} );
	
		if ( footer ) {
			_fnApplyToChildren( function(n) {
				n.style.width = "";
			}, footerSrcEls );
		}
	
		// Size the table as a whole
		sanityWidth = table.outerWidth();
		if ( scrollX === "" ) {
			// No x scrolling
			tableStyle.width = "100%";
	
			// IE7 will make the width of the table when 100% include the scrollbar
			// - which is shouldn't. When there is a scrollbar we need to take this
			// into account.
			if ( ie67 && (table.find('tbody').height() > divBodyEl.offsetHeight ||
				divBody.css('overflow-y') == "scroll")
			) {
				tableStyle.width = _fnStringToCss( table.outerWidth() - barWidth);
			}
	
			// Recalculate the sanity width
			sanityWidth = table.outerWidth();
		}
		else if ( scrollXInner !== "" ) {
			// legacy x scroll inner has been given - use it
			tableStyle.width = _fnStringToCss(scrollXInner);
	
			// Recalculate the sanity width
			sanityWidth = table.outerWidth();
		}
	
		// Hidden header should have zero height, so remove padding and borders. Then
		// set the width based on the real headers
	
		// Apply all styles in one pass
		_fnApplyToChildren( zeroOut, headerSrcEls );
	
		// Read all widths in next pass
		_fnApplyToChildren( function(nSizer) {
			var style = window.getComputedStyle ?
				window.getComputedStyle(nSizer).width :
				_fnStringToCss( $(nSizer).width() );
	
			headerContent.push( nSizer.innerHTML );
			headerWidths.push( style );
		}, headerSrcEls );
	
		// Apply all widths in final pass
		_fnApplyToChildren( function(nToSize, i) {
			nToSize.style.width = headerWidths[i];
		}, headerTrgEls );
	
		$(headerSrcEls).css('height', 0);
	
		/* Same again with the footer if we have one */
		if ( footer )
		{
			_fnApplyToChildren( zeroOut, footerSrcEls );
	
			_fnApplyToChildren( function(nSizer) {
				footerContent.push( nSizer.innerHTML );
				footerWidths.push( _fnStringToCss( $(nSizer).css('width') ) );
			}, footerSrcEls );
	
			_fnApplyToChildren( function(nToSize, i) {
				nToSize.style.width = footerWidths[i];
			}, footerTrgEls );
	
			$(footerSrcEls).height(0);
		}
	
	
		/*
		 * 3. Apply the measurements
		 */
	
		// "Hide" the header and footer that we used for the sizing. We need to keep
		// the content of the cell so that the width applied to the header and body
		// both match, but we want to hide it completely. We want to also fix their
		// width to what they currently are
		_fnApplyToChildren( function(nSizer, i) {
			nSizer.innerHTML = '<div class="dataTables_sizing">'+headerContent[i]+'</div>';
			nSizer.childNodes[0].style.height = "0";
			nSizer.childNodes[0].style.overflow = "hidden";
			nSizer.style.width = headerWidths[i];
		}, headerSrcEls );
	
		if ( footer )
		{
			_fnApplyToChildren( function(nSizer, i) {
				nSizer.innerHTML = '<div class="dataTables_sizing">'+footerContent[i]+'</div>';
				nSizer.childNodes[0].style.height = "0";
				nSizer.childNodes[0].style.overflow = "hidden";
				nSizer.style.width = footerWidths[i];
			}, footerSrcEls );
		}
	
		// Sanity check that the table is of a sensible width. If not then we are going to get
		// misalignment - try to prevent this by not allowing the table to shrink below its min width
		if ( Math.round(table.outerWidth()) < Math.round(sanityWidth) )
		{
			// The min width depends upon if we have a vertical scrollbar visible or not */
			correction = ((divBodyEl.scrollHeight > divBodyEl.offsetHeight ||
				divBody.css('overflow-y') == "scroll")) ?
					sanityWidth+barWidth :
					sanityWidth;
	
			// IE6/7 are a law unto themselves...
			if ( ie67 && (divBodyEl.scrollHeight >
				divBodyEl.offsetHeight || divBody.css('overflow-y') == "scroll")
			) {
				tableStyle.width = _fnStringToCss( correction-barWidth );
			}
	
			// And give the user a warning that we've stopped the table getting too small
			if ( scrollX === "" || scrollXInner !== "" ) {
				_fnLog( settings, 1, 'Possible column misalignment', 6 );
			}
		}
		else
		{
			correction = '100%';
		}
	
		// Apply to the container elements
		divBodyStyle.width = _fnStringToCss( correction );
		divHeaderStyle.width = _fnStringToCss( correction );
	
		if ( footer ) {
			settings.nScrollFoot.style.width = _fnStringToCss( correction );
		}
	
	
		/*
		 * 4. Clean up
		 */
		if ( ! scrollY ) {
			/* IE7< puts a vertical scrollbar in place (when it shouldn't be) due to subtracting
			 * the scrollbar height from the visible display, rather than adding it on. We need to
			 * set the height in order to sort this. Don't want to do it in any other browsers.
			 */
			if ( ie67 ) {
				divBodyStyle.height = _fnStringToCss( tableEl.offsetHeight+barWidth );
			}
		}
	
		/* Finally set the width's of the header and footer tables */
		var iOuterWidth = table.outerWidth();
		divHeaderTable[0].style.width = _fnStringToCss( iOuterWidth );
		divHeaderInnerStyle.width = _fnStringToCss( iOuterWidth );
	
		// Figure out if there are scrollbar present - if so then we need a the header and footer to
		// provide a bit more space to allow "overflow" scrolling (i.e. past the scrollbar)
		var bScrolling = table.height() > divBodyEl.clientHeight || divBody.css('overflow-y') == "scroll";
		var padding = 'padding' + (browser.bScrollbarLeft ? 'Left' : 'Right' );
		divHeaderInnerStyle[ padding ] = bScrolling ? barWidth+"px" : "0px";
	
		if ( footer ) {
			divFooterTable[0].style.width = _fnStringToCss( iOuterWidth );
			divFooterInner[0].style.width = _fnStringToCss( iOuterWidth );
			divFooterInner[0].style[padding] = bScrolling ? barWidth+"px" : "0px";
		}
	
		// Correct DOM ordering for colgroup - comes before the thead
		table.children('colgroup').insertBefore( table.children('thead') );
	
		/* Adjust the position of the header in case we loose the y-scrollbar */
		divBody.trigger('scroll');
	
		// If sorting or filtering has occurred, jump the scrolling back to the top
		// only if we aren't holding the position
		if ( (settings.bSorted || settings.bFiltered) && ! settings._drawHold ) {
			divBodyEl.scrollTop = 0;
		}
	}
	
	
	
	/**
	 * Apply a given function to the display child nodes of an element array (typically
	 * TD children of TR rows
	 *  @param {function} fn Method to apply to the objects
	 *  @param array {nodes} an1 List of elements to look through for display children
	 *  @param array {nodes} an2 Another list (identical structure to the first) - optional
	 *  @memberof DataTable#oApi
	 */
	function _fnApplyToChildren( fn, an1, an2 )
	{
		var index=0, i=0, iLen=an1.length;
		var nNode1, nNode2;
	
		while ( i < iLen ) {
			nNode1 = an1[i].firstChild;
			nNode2 = an2 ? an2[i].firstChild : null;
	
			while ( nNode1 ) {
				if ( nNode1.nodeType === 1 ) {
					if ( an2 ) {
						fn( nNode1, nNode2, index );
					}
					else {
						fn( nNode1, index );
					}
	
					index++;
				}
	
				nNode1 = nNode1.nextSibling;
				nNode2 = an2 ? nNode2.nextSibling : null;
			}
	
			i++;
		}
	}
	
	
	
	var __re_html_remove = /<.*?>/g;
	
	
	/**
	 * Calculate the width of columns for the table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnCalculateColumnWidths ( oSettings )
	{
		var
			table = oSettings.nTable,
			columns = oSettings.aoColumns,
			scroll = oSettings.oScroll,
			scrollY = scroll.sY,
			scrollX = scroll.sX,
			scrollXInner = scroll.sXInner,
			columnCount = columns.length,
			visibleColumns = _fnGetColumns( oSettings, 'bVisible' ),
			headerCells = $('th', oSettings.nTHead),
			tableWidthAttr = table.getAttribute('width'), // from DOM element
			tableContainer = table.parentNode,
			userInputs = false,
			i, column, columnIdx, width, outerWidth,
			browser = oSettings.oBrowser,
			ie67 = browser.bScrollOversize;
	
		var styleWidth = table.style.width;
		if ( styleWidth && styleWidth.indexOf('%') !== -1 ) {
			tableWidthAttr = styleWidth;
		}
	
		/* Convert any user input sizes into pixel sizes */
		for ( i=0 ; i<visibleColumns.length ; i++ ) {
			column = columns[ visibleColumns[i] ];
	
			if ( column.sWidth !== null ) {
				column.sWidth = _fnConvertToWidth( column.sWidthOrig, tableContainer );
	
				userInputs = true;
			}
		}
	
		/* If the number of columns in the DOM equals the number that we have to
		 * process in DataTables, then we can use the offsets that are created by
		 * the web- browser. No custom sizes can be set in order for this to happen,
		 * nor scrolling used
		 */
		if ( ie67 || ! userInputs && ! scrollX && ! scrollY &&
		     columnCount == _fnVisbleColumns( oSettings ) &&
		     columnCount == headerCells.length
		) {
			for ( i=0 ; i<columnCount ; i++ ) {
				var colIdx = _fnVisibleToColumnIndex( oSettings, i );
	
				if ( colIdx !== null ) {
					columns[ colIdx ].sWidth = _fnStringToCss( headerCells.eq(i).width() );
				}
			}
		}
		else
		{
			// Otherwise construct a single row, worst case, table with the widest
			// node in the data, assign any user defined widths, then insert it into
			// the DOM and allow the browser to do all the hard work of calculating
			// table widths
			var tmpTable = $(table).clone() // don't use cloneNode - IE8 will remove events on the main table
				.css( 'visibility', 'hidden' )
				.removeAttr( 'id' );
	
			// Clean up the table body
			tmpTable.find('tbody tr').remove();
			var tr = $('<tr/>').appendTo( tmpTable.find('tbody') );
	
			// Clone the table header and footer - we can't use the header / footer
			// from the cloned table, since if scrolling is active, the table's
			// real header and footer are contained in different table tags
			tmpTable.find('thead, tfoot').remove();
			tmpTable
				.append( $(oSettings.nTHead).clone() )
				.append( $(oSettings.nTFoot).clone() );
	
			// Remove any assigned widths from the footer (from scrolling)
			tmpTable.find('tfoot th, tfoot td').css('width', '');
	
			// Apply custom sizing to the cloned header
			headerCells = _fnGetUniqueThs( oSettings, tmpTable.find('thead')[0] );
	
			for ( i=0 ; i<visibleColumns.length ; i++ ) {
				column = columns[ visibleColumns[i] ];
	
				headerCells[i].style.width = column.sWidthOrig !== null && column.sWidthOrig !== '' ?
					_fnStringToCss( column.sWidthOrig ) :
					'';
	
				// For scrollX we need to force the column width otherwise the
				// browser will collapse it. If this width is smaller than the
				// width the column requires, then it will have no effect
				if ( column.sWidthOrig && scrollX ) {
					$( headerCells[i] ).append( $('<div/>').css( {
						width: column.sWidthOrig,
						margin: 0,
						padding: 0,
						border: 0,
						height: 1
					} ) );
				}
			}
	
			// Find the widest cell for each column and put it into the table
			if ( oSettings.aoData.length ) {
				for ( i=0 ; i<visibleColumns.length ; i++ ) {
					columnIdx = visibleColumns[i];
					column = columns[ columnIdx ];
	
					$( _fnGetWidestNode( oSettings, columnIdx ) )
						.clone( false )
						.append( column.sContentPadding )
						.appendTo( tr );
				}
			}
	
			// Tidy the temporary table - remove name attributes so there aren't
			// duplicated in the dom (radio elements for example)
			$('[name]', tmpTable).removeAttr('name');
	
			// Table has been built, attach to the document so we can work with it.
			// A holding element is used, positioned at the top of the container
			// with minimal height, so it has no effect on if the container scrolls
			// or not. Otherwise it might trigger scrolling when it actually isn't
			// needed
			var holder = $('<div/>').css( scrollX || scrollY ?
					{
						position: 'absolute',
						top: 0,
						left: 0,
						height: 1,
						right: 0,
						overflow: 'hidden'
					} :
					{}
				)
				.append( tmpTable )
				.appendTo( tableContainer );
	
			// When scrolling (X or Y) we want to set the width of the table as 
			// appropriate. However, when not scrolling leave the table width as it
			// is. This results in slightly different, but I think correct behaviour
			if ( scrollX && scrollXInner ) {
				tmpTable.width( scrollXInner );
			}
			else if ( scrollX ) {
				tmpTable.css( 'width', 'auto' );
				tmpTable.removeAttr('width');
	
				// If there is no width attribute or style, then allow the table to
				// collapse
				if ( tmpTable.width() < tableContainer.clientWidth && tableWidthAttr ) {
					tmpTable.width( tableContainer.clientWidth );
				}
			}
			else if ( scrollY ) {
				tmpTable.width( tableContainer.clientWidth );
			}
			else if ( tableWidthAttr ) {
				tmpTable.width( tableWidthAttr );
			}
	
			// Get the width of each column in the constructed table - we need to
			// know the inner width (so it can be assigned to the other table's
			// cells) and the outer width so we can calculate the full width of the
			// table. This is safe since DataTables requires a unique cell for each
			// column, but if ever a header can span multiple columns, this will
			// need to be modified.
			var total = 0;
			for ( i=0 ; i<visibleColumns.length ; i++ ) {
				var cell = $(headerCells[i]);
				var border = cell.outerWidth() - cell.width();
	
				// Use getBounding... where possible (not IE8-) because it can give
				// sub-pixel accuracy, which we then want to round up!
				var bounding = browser.bBounding ?
					Math.ceil( headerCells[i].getBoundingClientRect().width ) :
					cell.outerWidth();
	
				// Total is tracked to remove any sub-pixel errors as the outerWidth
				// of the table might not equal the total given here (IE!).
				total += bounding;
	
				// Width for each column to use
				columns[ visibleColumns[i] ].sWidth = _fnStringToCss( bounding - border );
			}
	
			table.style.width = _fnStringToCss( total );
	
			// Finished with the table - ditch it
			holder.remove();
		}
	
		// If there is a width attr, we want to attach an event listener which
		// allows the table sizing to automatically adjust when the window is
		// resized. Use the width attr rather than CSS, since we can't know if the
		// CSS is a relative value or absolute - DOM read is always px.
		if ( tableWidthAttr ) {
			table.style.width = _fnStringToCss( tableWidthAttr );
		}
	
		if ( (tableWidthAttr || scrollX) && ! oSettings._reszEvt ) {
			var bindResize = function () {
				$(window).on('resize.DT-'+oSettings.sInstance, _fnThrottle( function () {
					_fnAdjustColumnSizing( oSettings );
				} ) );
			};
	
			// IE6/7 will crash if we bind a resize event handler on page load.
			// To be removed in 1.11 which drops IE6/7 support
			if ( ie67 ) {
				setTimeout( bindResize, 1000 );
			}
			else {
				bindResize();
			}
	
			oSettings._reszEvt = true;
		}
	}
	
	
	/**
	 * Throttle the calls to a function. Arguments and context are maintained for
	 * the throttled function
	 *  @param {function} fn Function to be called
	 *  @param {int} [freq=200] call frequency in mS
	 *  @returns {function} wrapped function
	 *  @memberof DataTable#oApi
	 */
	var _fnThrottle = DataTable.util.throttle;
	
	
	/**
	 * Convert a CSS unit width to pixels (e.g. 2em)
	 *  @param {string} width width to be converted
	 *  @param {node} parent parent to get the with for (required for relative widths) - optional
	 *  @returns {int} width in pixels
	 *  @memberof DataTable#oApi
	 */
	function _fnConvertToWidth ( width, parent )
	{
		if ( ! width ) {
			return 0;
		}
	
		var n = $('<div/>')
			.css( 'width', _fnStringToCss( width ) )
			.appendTo( parent || document.body );
	
		var val = n[0].offsetWidth;
		n.remove();
	
		return val;
	}
	
	
	/**
	 * Get the widest node
	 *  @param {object} settings dataTables settings object
	 *  @param {int} colIdx column of interest
	 *  @returns {node} widest table node
	 *  @memberof DataTable#oApi
	 */
	function _fnGetWidestNode( settings, colIdx )
	{
		var idx = _fnGetMaxLenString( settings, colIdx );
		if ( idx < 0 ) {
			return null;
		}
	
		var data = settings.aoData[ idx ];
		return ! data.nTr ? // Might not have been created when deferred rendering
			$('<td/>').html( _fnGetCellData( settings, idx, colIdx, 'display' ) )[0] :
			data.anCells[ colIdx ];
	}
	
	
	/**
	 * Get the maximum strlen for each data column
	 *  @param {object} settings dataTables settings object
	 *  @param {int} colIdx column of interest
	 *  @returns {string} max string length for each column
	 *  @memberof DataTable#oApi
	 */
	function _fnGetMaxLenString( settings, colIdx )
	{
		var s, max=-1, maxIdx = -1;
	
		for ( var i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
			s = _fnGetCellData( settings, i, colIdx, 'display' )+'';
			s = s.replace( __re_html_remove, '' );
			s = s.replace( /&nbsp;/g, ' ' );
	
			if ( s.length > max ) {
				max = s.length;
				maxIdx = i;
			}
		}
	
		return maxIdx;
	}
	
	
	/**
	 * Append a CSS unit (only if required) to a string
	 *  @param {string} value to css-ify
	 *  @returns {string} value with css unit
	 *  @memberof DataTable#oApi
	 */
	function _fnStringToCss( s )
	{
		if ( s === null ) {
			return '0px';
		}
	
		if ( typeof s == 'number' ) {
			return s < 0 ?
				'0px' :
				s+'px';
		}
	
		// Check it has a unit character already
		return s.match(/\d$/) ?
			s+'px' :
			s;
	}
	
	
	
	function _fnSortFlatten ( settings )
	{
		var
			i, iLen, k, kLen,
			aSort = [],
			aiOrig = [],
			aoColumns = settings.aoColumns,
			aDataSort, iCol, sType, srcCol,
			fixed = settings.aaSortingFixed,
			fixedObj = $.isPlainObject( fixed ),
			nestedSort = [],
			add = function ( a ) {
				if ( a.length && ! Array.isArray( a[0] ) ) {
					// 1D array
					nestedSort.push( a );
				}
				else {
					// 2D array
					$.merge( nestedSort, a );
				}
			};
	
		// Build the sort array, with pre-fix and post-fix options if they have been
		// specified
		if ( Array.isArray( fixed ) ) {
			add( fixed );
		}
	
		if ( fixedObj && fixed.pre ) {
			add( fixed.pre );
		}
	
		add( settings.aaSorting );
	
		if (fixedObj && fixed.post ) {
			add( fixed.post );
		}
	
		for ( i=0 ; i<nestedSort.length ; i++ )
		{
			srcCol = nestedSort[i][0];
			aDataSort = aoColumns[ srcCol ].aDataSort;
	
			for ( k=0, kLen=aDataSort.length ; k<kLen ; k++ )
			{
				iCol = aDataSort[k];
				sType = aoColumns[ iCol ].sType || 'string';
	
				if ( nestedSort[i]._idx === undefined ) {
					nestedSort[i]._idx = $.inArray( nestedSort[i][1], aoColumns[iCol].asSorting );
				}
	
				aSort.push( {
					src:       srcCol,
					col:       iCol,
					dir:       nestedSort[i][1],
					index:     nestedSort[i]._idx,
					type:      sType,
					formatter: DataTable.ext.type.order[ sType+"-pre" ]
				} );
			}
		}
	
		return aSort;
	}
	
	/**
	 * Change the order of the table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 *  @todo This really needs split up!
	 */
	function _fnSort ( oSettings )
	{
		var
			i, ien, iLen, j, jLen, k, kLen,
			sDataType, nTh,
			aiOrig = [],
			oExtSort = DataTable.ext.type.order,
			aoData = oSettings.aoData,
			aoColumns = oSettings.aoColumns,
			aDataSort, data, iCol, sType, oSort,
			formatters = 0,
			sortCol,
			displayMaster = oSettings.aiDisplayMaster,
			aSort;
	
		// Resolve any column types that are unknown due to addition or invalidation
		// @todo Can this be moved into a 'data-ready' handler which is called when
		//   data is going to be used in the table?
		_fnColumnTypes( oSettings );
	
		aSort = _fnSortFlatten( oSettings );
	
		for ( i=0, ien=aSort.length ; i<ien ; i++ ) {
			sortCol = aSort[i];
	
			// Track if we can use the fast sort algorithm
			if ( sortCol.formatter ) {
				formatters++;
			}
	
			// Load the data needed for the sort, for each cell
			_fnSortData( oSettings, sortCol.col );
		}
	
		/* No sorting required if server-side or no sorting array */
		if ( _fnDataSource( oSettings ) != 'ssp' && aSort.length !== 0 )
		{
			// Create a value - key array of the current row positions such that we can use their
			// current position during the sort, if values match, in order to perform stable sorting
			for ( i=0, iLen=displayMaster.length ; i<iLen ; i++ ) {
				aiOrig[ displayMaster[i] ] = i;
			}
	
			/* Do the sort - here we want multi-column sorting based on a given data source (column)
			 * and sorting function (from oSort) in a certain direction. It's reasonably complex to
			 * follow on it's own, but this is what we want (example two column sorting):
			 *  fnLocalSorting = function(a,b){
			 *    var iTest;
			 *    iTest = oSort['string-asc']('data11', 'data12');
			 *      if (iTest !== 0)
			 *        return iTest;
			 *    iTest = oSort['numeric-desc']('data21', 'data22');
			 *    if (iTest !== 0)
			 *      return iTest;
			 *    return oSort['numeric-asc']( aiOrig[a], aiOrig[b] );
			 *  }
			 * Basically we have a test for each sorting column, if the data in that column is equal,
			 * test the next column. If all columns match, then we use a numeric sort on the row
			 * positions in the original data array to provide a stable sort.
			 *
			 * Note - I know it seems excessive to have two sorting methods, but the first is around
			 * 15% faster, so the second is only maintained for backwards compatibility with sorting
			 * methods which do not have a pre-sort formatting function.
			 */
			if ( formatters === aSort.length ) {
				// All sort types have formatting functions
				displayMaster.sort( function ( a, b ) {
					var
						x, y, k, test, sort,
						len=aSort.length,
						dataA = aoData[a]._aSortData,
						dataB = aoData[b]._aSortData;
	
					for ( k=0 ; k<len ; k++ ) {
						sort = aSort[k];
	
						x = dataA[ sort.col ];
						y = dataB[ sort.col ];
	
						test = x<y ? -1 : x>y ? 1 : 0;
						if ( test !== 0 ) {
							return sort.dir === 'asc' ? test : -test;
						}
					}
	
					x = aiOrig[a];
					y = aiOrig[b];
					return x<y ? -1 : x>y ? 1 : 0;
				} );
			}
			else {
				// Depreciated - remove in 1.11 (providing a plug-in option)
				// Not all sort types have formatting methods, so we have to call their sorting
				// methods.
				displayMaster.sort( function ( a, b ) {
					var
						x, y, k, l, test, sort, fn,
						len=aSort.length,
						dataA = aoData[a]._aSortData,
						dataB = aoData[b]._aSortData;
	
					for ( k=0 ; k<len ; k++ ) {
						sort = aSort[k];
	
						x = dataA[ sort.col ];
						y = dataB[ sort.col ];
	
						fn = oExtSort[ sort.type+"-"+sort.dir ] || oExtSort[ "string-"+sort.dir ];
						test = fn( x, y );
						if ( test !== 0 ) {
							return test;
						}
					}
	
					x = aiOrig[a];
					y = aiOrig[b];
					return x<y ? -1 : x>y ? 1 : 0;
				} );
			}
		}
	
		/* Tell the draw function that we have sorted the data */
		oSettings.bSorted = true;
	}
	
	
	function _fnSortAria ( settings )
	{
		var label;
		var nextSort;
		var columns = settings.aoColumns;
		var aSort = _fnSortFlatten( settings );
		var oAria = settings.oLanguage.oAria;
	
		// ARIA attributes - need to loop all columns, to update all (removing old
		// attributes as needed)
		for ( var i=0, iLen=columns.length ; i<iLen ; i++ )
		{
			var col = columns[i];
			var asSorting = col.asSorting;
			var sTitle = col.ariaTitle || col.sTitle.replace( /<.*?>/g, "" );
			var th = col.nTh;
	
			// IE7 is throwing an error when setting these properties with jQuery's
			// attr() and removeAttr() methods...
			th.removeAttribute('aria-sort');
	
			/* In ARIA only the first sorting column can be marked as sorting - no multi-sort option */
			if ( col.bSortable ) {
				if ( aSort.length > 0 && aSort[0].col == i ) {
					th.setAttribute('aria-sort', aSort[0].dir=="asc" ? "ascending" : "descending" );
					nextSort = asSorting[ aSort[0].index+1 ] || asSorting[0];
				}
				else {
					nextSort = asSorting[0];
				}
	
				label = sTitle + ( nextSort === "asc" ?
					oAria.sSortAscending :
					oAria.sSortDescending
				);
			}
			else {
				label = sTitle;
			}
	
			th.setAttribute('aria-label', label);
		}
	}
	
	
	/**
	 * Function to run on user sort request
	 *  @param {object} settings dataTables settings object
	 *  @param {node} attachTo node to attach the handler to
	 *  @param {int} colIdx column sorting index
	 *  @param {boolean} [append=false] Append the requested sort to the existing
	 *    sort if true (i.e. multi-column sort)
	 *  @param {function} [callback] callback function
	 *  @memberof DataTable#oApi
	 */
	function _fnSortListener ( settings, colIdx, append, callback )
	{
		var col = settings.aoColumns[ colIdx ];
		var sorting = settings.aaSorting;
		var asSorting = col.asSorting;
		var nextSortIdx;
		var next = function ( a, overflow ) {
			var idx = a._idx;
			if ( idx === undefined ) {
				idx = $.inArray( a[1], asSorting );
			}
	
			return idx+1 < asSorting.length ?
				idx+1 :
				overflow ?
					null :
					0;
		};
	
		// Convert to 2D array if needed
		if ( typeof sorting[0] === 'number' ) {
			sorting = settings.aaSorting = [ sorting ];
		}
	
		// If appending the sort then we are multi-column sorting
		if ( append && settings.oFeatures.bSortMulti ) {
			// Are we already doing some kind of sort on this column?
			var sortIdx = $.inArray( colIdx, _pluck(sorting, '0') );
	
			if ( sortIdx !== -1 ) {
				// Yes, modify the sort
				nextSortIdx = next( sorting[sortIdx], true );
	
				if ( nextSortIdx === null && sorting.length === 1 ) {
					nextSortIdx = 0; // can't remove sorting completely
				}
	
				if ( nextSortIdx === null ) {
					sorting.splice( sortIdx, 1 );
				}
				else {
					sorting[sortIdx][1] = asSorting[ nextSortIdx ];
					sorting[sortIdx]._idx = nextSortIdx;
				}
			}
			else {
				// No sort on this column yet
				sorting.push( [ colIdx, asSorting[0], 0 ] );
				sorting[sorting.length-1]._idx = 0;
			}
		}
		else if ( sorting.length && sorting[0][0] == colIdx ) {
			// Single column - already sorting on this column, modify the sort
			nextSortIdx = next( sorting[0] );
	
			sorting.length = 1;
			sorting[0][1] = asSorting[ nextSortIdx ];
			sorting[0]._idx = nextSortIdx;
		}
		else {
			// Single column - sort only on this column
			sorting.length = 0;
			sorting.push( [ colIdx, asSorting[0] ] );
			sorting[0]._idx = 0;
		}
	
		// Run the sort by calling a full redraw
		_fnReDraw( settings );
	
		// callback used for async user interaction
		if ( typeof callback == 'function' ) {
			callback( settings );
		}
	}
	
	
	/**
	 * Attach a sort handler (click) to a node
	 *  @param {object} settings dataTables settings object
	 *  @param {node} attachTo node to attach the handler to
	 *  @param {int} colIdx column sorting index
	 *  @param {function} [callback] callback function
	 *  @memberof DataTable#oApi
	 */
	function _fnSortAttachListener ( settings, attachTo, colIdx, callback )
	{
		var col = settings.aoColumns[ colIdx ];
	
		_fnBindAction( attachTo, {}, function (e) {
			/* If the column is not sortable - don't to anything */
			if ( col.bSortable === false ) {
				return;
			}
	
			// If processing is enabled use a timeout to allow the processing
			// display to be shown - otherwise to it synchronously
			if ( settings.oFeatures.bProcessing ) {
				_fnProcessingDisplay( settings, true );
	
				setTimeout( function() {
					_fnSortListener( settings, colIdx, e.shiftKey, callback );
	
					// In server-side processing, the draw callback will remove the
					// processing display
					if ( _fnDataSource( settings ) !== 'ssp' ) {
						_fnProcessingDisplay( settings, false );
					}
				}, 0 );
			}
			else {
				_fnSortListener( settings, colIdx, e.shiftKey, callback );
			}
		} );
	}
	
	
	/**
	 * Set the sorting classes on table's body, Note: it is safe to call this function
	 * when bSort and bSortClasses are false
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnSortingClasses( settings )
	{
		var oldSort = settings.aLastSort;
		var sortClass = settings.oClasses.sSortColumn;
		var sort = _fnSortFlatten( settings );
		var features = settings.oFeatures;
		var i, ien, colIdx;
	
		if ( features.bSort && features.bSortClasses ) {
			// Remove old sorting classes
			for ( i=0, ien=oldSort.length ; i<ien ; i++ ) {
				colIdx = oldSort[i].src;
	
				// Remove column sorting
				$( _pluck( settings.aoData, 'anCells', colIdx ) )
					.removeClass( sortClass + (i<2 ? i+1 : 3) );
			}
	
			// Add new column sorting
			for ( i=0, ien=sort.length ; i<ien ; i++ ) {
				colIdx = sort[i].src;
	
				$( _pluck( settings.aoData, 'anCells', colIdx ) )
					.addClass( sortClass + (i<2 ? i+1 : 3) );
			}
		}
	
		settings.aLastSort = sort;
	}
	
	
	// Get the data to sort a column, be it from cache, fresh (populating the
	// cache), or from a sort formatter
	function _fnSortData( settings, idx )
	{
		// Custom sorting function - provided by the sort data type
		var column = settings.aoColumns[ idx ];
		var customSort = DataTable.ext.order[ column.sSortDataType ];
		var customData;
	
		if ( customSort ) {
			customData = customSort.call( settings.oInstance, settings, idx,
				_fnColumnIndexToVisible( settings, idx )
			);
		}
	
		// Use / populate cache
		var row, cellData;
		var formatter = DataTable.ext.type.order[ column.sType+"-pre" ];
	
		for ( var i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
			row = settings.aoData[i];
	
			if ( ! row._aSortData ) {
				row._aSortData = [];
			}
	
			if ( ! row._aSortData[idx] || customSort ) {
				cellData = customSort ?
					customData[i] : // If there was a custom sort function, use data from there
					_fnGetCellData( settings, i, idx, 'sort' );
	
				row._aSortData[ idx ] = formatter ?
					formatter( cellData ) :
					cellData;
			}
		}
	}
	
	
	
	/**
	 * Save the state of a table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnSaveState ( settings )
	{
		if (settings._bLoadingState) {
			return;
		}
	
		/* Store the interesting variables */
		var state = {
			time:    +new Date(),
			start:   settings._iDisplayStart,
			length:  settings._iDisplayLength,
			order:   $.extend( true, [], settings.aaSorting ),
			search:  _fnSearchToCamel( settings.oPreviousSearch ),
			columns: $.map( settings.aoColumns, function ( col, i ) {
				return {
					visible: col.bVisible,
					search: _fnSearchToCamel( settings.aoPreSearchCols[i] )
				};
			} )
		};
	
		settings.oSavedState = state;
		_fnCallbackFire( settings, "aoStateSaveParams", 'stateSaveParams', [settings, state] );
		
		if ( settings.oFeatures.bStateSave && !settings.bDestroying )
		{
			settings.fnStateSaveCallback.call( settings.oInstance, settings, state );
		}	
	}
	
	
	/**
	 * Attempt to load a saved table state
	 *  @param {object} oSettings dataTables settings object
	 *  @param {object} oInit DataTables init object so we can override settings
	 *  @param {function} callback Callback to execute when the state has been loaded
	 *  @memberof DataTable#oApi
	 */
	function _fnLoadState ( settings, oInit, callback )
	{
		if ( ! settings.oFeatures.bStateSave ) {
			callback();
			return;
		}
	
		var loaded = function(state) {
			_fnImplementState(settings, state, callback);
		}
	
		var state = settings.fnStateLoadCallback.call( settings.oInstance, settings, loaded );
	
		if ( state !== undefined ) {
			_fnImplementState( settings, state, callback );
		}
		// otherwise, wait for the loaded callback to be executed
	
		return true;
	}
	
	function _fnImplementState ( settings, s, callback) {
		var i, ien;
		var columns = settings.aoColumns;
		settings._bLoadingState = true;
	
		// When StateRestore was introduced the state could now be implemented at any time
		// Not just initialisation. To do this an api instance is required in some places
		var api = settings._bInitComplete ? new DataTable.Api(settings) : null;
	
		if ( ! s || ! s.time ) {
			settings._bLoadingState = false;
			callback();
			return;
		}
	
		// Allow custom and plug-in manipulation functions to alter the saved data set and
		// cancelling of loading by returning false
		var abStateLoad = _fnCallbackFire( settings, 'aoStateLoadParams', 'stateLoadParams', [settings, s] );
		if ( $.inArray( false, abStateLoad ) !== -1 ) {
			settings._bLoadingState = false;
			callback();
			return;
		}
	
		// Reject old data
		var duration = settings.iStateDuration;
		if ( duration > 0 && s.time < +new Date() - (duration*1000) ) {
			settings._bLoadingState = false;
			callback();
			return;
		}
	
		// Number of columns have changed - all bets are off, no restore of settings
		if ( s.columns && columns.length !== s.columns.length ) {
			settings._bLoadingState = false;
			callback();
			return;
		}
	
		// Store the saved state so it might be accessed at any time
		settings.oLoadedState = $.extend( true, {}, s );
	
		// Restore key features - todo - for 1.11 this needs to be done by
		// subscribed events
		if ( s.start !== undefined ) {
			if(api === null) {
				settings._iDisplayStart    = s.start;
				settings.iInitDisplayStart = s.start;
			}
			else {
				_fnPageChange(settings, s.start/s.length);
	
			}
		}
		if ( s.length !== undefined ) {
			settings._iDisplayLength   = s.length;
		}
	
		// Order
		if ( s.order !== undefined ) {
			settings.aaSorting = [];
			$.each( s.order, function ( i, col ) {
				settings.aaSorting.push( col[0] >= columns.length ?
					[ 0, col[1] ] :
					col
				);
			} );
		}
	
		// Search
		if ( s.search !== undefined ) {
			$.extend( settings.oPreviousSearch, _fnSearchToHung( s.search ) );
		}
	
		// Columns
		if ( s.columns ) {
			for ( i=0, ien=s.columns.length ; i<ien ; i++ ) {
				var col = s.columns[i];
	
				// Visibility
				if ( col.visible !== undefined ) {
					// If the api is defined, the table has been initialised so we need to use it rather than internal settings
					if (api) {
						// Don't redraw the columns on every iteration of this loop, we will do this at the end instead
						api.column(i).visible(col.visible, false);
					}
					else {
						columns[i].bVisible = col.visible;
					}
				}
	
				// Search
				if ( col.search !== undefined ) {
					$.extend( settings.aoPreSearchCols[i], _fnSearchToHung( col.search ) );
				}
			}
			
			// If the api is defined then we need to adjust the columns once the visibility has been changed
			if (api) {
				api.columns.adjust();
			}
		}
	
		settings._bLoadingState = false;
		_fnCallbackFire( settings, 'aoStateLoaded', 'stateLoaded', [settings, s] );
		callback();
	};
	
	
	/**
	 * Return the settings object for a particular table
	 *  @param {node} table table we are using as a dataTable
	 *  @returns {object} Settings object - or null if not found
	 *  @memberof DataTable#oApi
	 */
	function _fnSettingsFromNode ( table )
	{
		var settings = DataTable.settings;
		var idx = $.inArray( table, _pluck( settings, 'nTable' ) );
	
		return idx !== -1 ?
			settings[ idx ] :
			null;
	}
	
	
	/**
	 * Log an error message
	 *  @param {object} settings dataTables settings object
	 *  @param {int} level log error messages, or display them to the user
	 *  @param {string} msg error message
	 *  @param {int} tn Technical note id to get more information about the error.
	 *  @memberof DataTable#oApi
	 */
	function _fnLog( settings, level, msg, tn )
	{
		msg = 'DataTables warning: '+
			(settings ? 'table id='+settings.sTableId+' - ' : '')+msg;
	
		if ( tn ) {
			msg += '. For more information about this error, please see '+
			'http://datatables.net/tn/'+tn;
		}
	
		if ( ! level  ) {
			// Backwards compatibility pre 1.10
			var ext = DataTable.ext;
			var type = ext.sErrMode || ext.errMode;
	
			if ( settings ) {
				_fnCallbackFire( settings, null, 'error', [ settings, tn, msg ] );
			}
	
			if ( type == 'alert' ) {
				alert( msg );
			}
			else if ( type == 'throw' ) {
				throw new Error(msg);
			}
			else if ( typeof type == 'function' ) {
				type( settings, tn, msg );
			}
		}
		else if ( window.console && console.log ) {
			console.log( msg );
		}
	}
	
	
	/**
	 * See if a property is defined on one object, if so assign it to the other object
	 *  @param {object} ret target object
	 *  @param {object} src source object
	 *  @param {string} name property
	 *  @param {string} [mappedName] name to map too - optional, name used if not given
	 *  @memberof DataTable#oApi
	 */
	function _fnMap( ret, src, name, mappedName )
	{
		if ( Array.isArray( name ) ) {
			$.each( name, function (i, val) {
				if ( Array.isArray( val ) ) {
					_fnMap( ret, src, val[0], val[1] );
				}
				else {
					_fnMap( ret, src, val );
				}
			} );
	
			return;
		}
	
		if ( mappedName === undefined ) {
			mappedName = name;
		}
	
		if ( src[name] !== undefined ) {
			ret[mappedName] = src[name];
		}
	}
	
	
	/**
	 * Extend objects - very similar to jQuery.extend, but deep copy objects, and
	 * shallow copy arrays. The reason we need to do this, is that we don't want to
	 * deep copy array init values (such as aaSorting) since the dev wouldn't be
	 * able to override them, but we do want to deep copy arrays.
	 *  @param {object} out Object to extend
	 *  @param {object} extender Object from which the properties will be applied to
	 *      out
	 *  @param {boolean} breakRefs If true, then arrays will be sliced to take an
	 *      independent copy with the exception of the `data` or `aaData` parameters
	 *      if they are present. This is so you can pass in a collection to
	 *      DataTables and have that used as your data source without breaking the
	 *      references
	 *  @returns {object} out Reference, just for convenience - out === the return.
	 *  @memberof DataTable#oApi
	 *  @todo This doesn't take account of arrays inside the deep copied objects.
	 */
	function _fnExtend( out, extender, breakRefs )
	{
		var val;
	
		for ( var prop in extender ) {
			if ( extender.hasOwnProperty(prop) ) {
				val = extender[prop];
	
				if ( $.isPlainObject( val ) ) {
					if ( ! $.isPlainObject( out[prop] ) ) {
						out[prop] = {};
					}
					$.extend( true, out[prop], val );
				}
				else if ( breakRefs && prop !== 'data' && prop !== 'aaData' && Array.isArray(val) ) {
					out[prop] = val.slice();
				}
				else {
					out[prop] = val;
				}
			}
		}
	
		return out;
	}
	
	
	/**
	 * Bind an event handers to allow a click or return key to activate the callback.
	 * This is good for accessibility since a return on the keyboard will have the
	 * same effect as a click, if the element has focus.
	 *  @param {element} n Element to bind the action to
	 *  @param {object} oData Data object to pass to the triggered function
	 *  @param {function} fn Callback function for when the event is triggered
	 *  @memberof DataTable#oApi
	 */
	function _fnBindAction( n, oData, fn )
	{
		$(n)
			.on( 'click.DT', oData, function (e) {
					$(n).trigger('blur'); // Remove focus outline for mouse users
					fn(e);
				} )
			.on( 'keypress.DT', oData, function (e){
					if ( e.which === 13 ) {
						e.preventDefault();
						fn(e);
					}
				} )
			.on( 'selectstart.DT', function () {
					/* Take the brutal approach to cancelling text selection */
					return false;
				} );
	}
	
	
	/**
	 * Register a callback function. Easily allows a callback function to be added to
	 * an array store of callback functions that can then all be called together.
	 *  @param {object} oSettings dataTables settings object
	 *  @param {string} sStore Name of the array storage for the callbacks in oSettings
	 *  @param {function} fn Function to be called back
	 *  @param {string} sName Identifying name for the callback (i.e. a label)
	 *  @memberof DataTable#oApi
	 */
	function _fnCallbackReg( oSettings, sStore, fn, sName )
	{
		if ( fn )
		{
			oSettings[sStore].push( {
				"fn": fn,
				"sName": sName
			} );
		}
	}
	
	
	/**
	 * Fire callback functions and trigger events. Note that the loop over the
	 * callback array store is done backwards! Further note that you do not want to
	 * fire off triggers in time sensitive applications (for example cell creation)
	 * as its slow.
	 *  @param {object} settings dataTables settings object
	 *  @param {string} callbackArr Name of the array storage for the callbacks in
	 *      oSettings
	 *  @param {string} eventName Name of the jQuery custom event to trigger. If
	 *      null no trigger is fired
	 *  @param {array} args Array of arguments to pass to the callback function /
	 *      trigger
	 *  @memberof DataTable#oApi
	 */
	function _fnCallbackFire( settings, callbackArr, eventName, args )
	{
		var ret = [];
	
		if ( callbackArr ) {
			ret = $.map( settings[callbackArr].slice().reverse(), function (val, i) {
				return val.fn.apply( settings.oInstance, args );
			} );
		}
	
		if ( eventName !== null ) {
			var e = $.Event( eventName+'.dt' );
	
			$(settings.nTable).trigger( e, args );
	
			ret.push( e.result );
		}
	
		return ret;
	}
	
	
	function _fnLengthOverflow ( settings )
	{
		var
			start = settings._iDisplayStart,
			end = settings.fnDisplayEnd(),
			len = settings._iDisplayLength;
	
		/* If we have space to show extra rows (backing up from the end point - then do so */
		if ( start >= end )
		{
			start = end - len;
		}
	
		// Keep the start record on the current page
		start -= (start % len);
	
		if ( len === -1 || start < 0 )
		{
			start = 0;
		}
	
		settings._iDisplayStart = start;
	}
	
	
	function _fnRenderer( settings, type )
	{
		var renderer = settings.renderer;
		var host = DataTable.ext.renderer[type];
	
		if ( $.isPlainObject( renderer ) && renderer[type] ) {
			// Specific renderer for this type. If available use it, otherwise use
			// the default.
			return host[renderer[type]] || host._;
		}
		else if ( typeof renderer === 'string' ) {
			// Common renderer - if there is one available for this type use it,
			// otherwise use the default
			return host[renderer] || host._;
		}
	
		// Use the default
		return host._;
	}
	
	
	/**
	 * Detect the data source being used for the table. Used to simplify the code
	 * a little (ajax) and to make it compress a little smaller.
	 *
	 *  @param {object} settings dataTables settings object
	 *  @returns {string} Data source
	 *  @memberof DataTable#oApi
	 */
	function _fnDataSource ( settings )
	{
		if ( settings.oFeatures.bServerSide ) {
			return 'ssp';
		}
		else if ( settings.ajax || settings.sAjaxSource ) {
			return 'ajax';
		}
		return 'dom';
	}
	
	
	
	
	/**
	 * Computed structure of the DataTables API, defined by the options passed to
	 * `DataTable.Api.register()` when building the API.
	 *
	 * The structure is built in order to speed creation and extension of the Api
	 * objects since the extensions are effectively pre-parsed.
	 *
	 * The array is an array of objects with the following structure, where this
	 * base array represents the Api prototype base:
	 *
	 *     [
	 *       {
	 *         name:      'data'                -- string   - Property name
	 *         val:       function () {},       -- function - Api method (or undefined if just an object
	 *         methodExt: [ ... ],              -- array    - Array of Api object definitions to extend the method result
	 *         propExt:   [ ... ]               -- array    - Array of Api object definitions to extend the property
	 *       },
	 *       {
	 *         name:     'row'
	 *         val:       {},
	 *         methodExt: [ ... ],
	 *         propExt:   [
	 *           {
	 *             name:      'data'
	 *             val:       function () {},
	 *             methodExt: [ ... ],
	 *             propExt:   [ ... ]
	 *           },
	 *           ...
	 *         ]
	 *       }
	 *     ]
	 *
	 * @type {Array}
	 * @ignore
	 */
	var __apiStruct = [];
	
	
	/**
	 * `Array.prototype` reference.
	 *
	 * @type object
	 * @ignore
	 */
	var __arrayProto = Array.prototype;
	
	
	/**
	 * Abstraction for `context` parameter of the `Api` constructor to allow it to
	 * take several different forms for ease of use.
	 *
	 * Each of the input parameter types will be converted to a DataTables settings
	 * object where possible.
	 *
	 * @param  {string|node|jQuery|object} mixed DataTable identifier. Can be one
	 *   of:
	 *
	 *   * `string` - jQuery selector. Any DataTables' matching the given selector
	 *     with be found and used.
	 *   * `node` - `TABLE` node which has already been formed into a DataTable.
	 *   * `jQuery` - A jQuery object of `TABLE` nodes.
	 *   * `object` - DataTables settings object
	 *   * `DataTables.Api` - API instance
	 * @return {array|null} Matching DataTables settings objects. `null` or
	 *   `undefined` is returned if no matching DataTable is found.
	 * @ignore
	 */
	var _toSettings = function ( mixed )
	{
		var idx, jq;
		var settings = DataTable.settings;
		var tables = $.map( settings, function (el, i) {
			return el.nTable;
		} );
	
		if ( ! mixed ) {
			return [];
		}
		else if ( mixed.nTable && mixed.oApi ) {
			// DataTables settings object
			return [ mixed ];
		}
		else if ( mixed.nodeName && mixed.nodeName.toLowerCase() === 'table' ) {
			// Table node
			idx = $.inArray( mixed, tables );
			return idx !== -1 ? [ settings[idx] ] : null;
		}
		else if ( mixed && typeof mixed.settings === 'function' ) {
			return mixed.settings().toArray();
		}
		else if ( typeof mixed === 'string' ) {
			// jQuery selector
			jq = $(mixed);
		}
		else if ( mixed instanceof $ ) {
			// jQuery object (also DataTables instance)
			jq = mixed;
		}
	
		if ( jq ) {
			return jq.map( function(i) {
				idx = $.inArray( this, tables );
				return idx !== -1 ? settings[idx] : null;
			} ).toArray();
		}
	};
	
	
	/**
	 * DataTables API class - used to control and interface with  one or more
	 * DataTables enhanced tables.
	 *
	 * The API class is heavily based on jQuery, presenting a chainable interface
	 * that you can use to interact with tables. Each instance of the API class has
	 * a "context" - i.e. the tables that it will operate on. This could be a single
	 * table, all tables on a page or a sub-set thereof.
	 *
	 * Additionally the API is designed to allow you to easily work with the data in
	 * the tables, retrieving and manipulating it as required. This is done by
	 * presenting the API class as an array like interface. The contents of the
	 * array depend upon the actions requested by each method (for example
	 * `rows().nodes()` will return an array of nodes, while `rows().data()` will
	 * return an array of objects or arrays depending upon your table's
	 * configuration). The API object has a number of array like methods (`push`,
	 * `pop`, `reverse` etc) as well as additional helper methods (`each`, `pluck`,
	 * `unique` etc) to assist your working with the data held in a table.
	 *
	 * Most methods (those which return an Api instance) are chainable, which means
	 * the return from a method call also has all of the methods available that the
	 * top level object had. For example, these two calls are equivalent:
	 *
	 *     // Not chained
	 *     api.row.add( {...} );
	 *     api.draw();
	 *
	 *     // Chained
	 *     api.row.add( {...} ).draw();
	 *
	 * @class DataTable.Api
	 * @param {array|object|string|jQuery} context DataTable identifier. This is
	 *   used to define which DataTables enhanced tables this API will operate on.
	 *   Can be one of:
	 *
	 *   * `string` - jQuery selector. Any DataTables' matching the given selector
	 *     with be found and used.
	 *   * `node` - `TABLE` node which has already been formed into a DataTable.
	 *   * `jQuery` - A jQuery object of `TABLE` nodes.
	 *   * `object` - DataTables settings object
	 * @param {array} [data] Data to initialise the Api instance with.
	 *
	 * @example
	 *   // Direct initialisation during DataTables construction
	 *   var api = $('#example').DataTable();
	 *
	 * @example
	 *   // Initialisation using a DataTables jQuery object
	 *   var api = $('#example').dataTable().api();
	 *
	 * @example
	 *   // Initialisation as a constructor
	 *   var api = new $.fn.DataTable.Api( 'table.dataTable' );
	 */
	_Api = function ( context, data )
	{
		if ( ! (this instanceof _Api) ) {
			return new _Api( context, data );
		}
	
		var settings = [];
		var ctxSettings = function ( o ) {
			var a = _toSettings( o );
			if ( a ) {
				settings.push.apply( settings, a );
			}
		};
	
		if ( Array.isArray( context ) ) {
			for ( var i=0, ien=context.length ; i<ien ; i++ ) {
				ctxSettings( context[i] );
			}
		}
		else {
			ctxSettings( context );
		}
	
		// Remove duplicates
		this.context = _unique( settings );
	
		// Initial data
		if ( data ) {
			$.merge( this, data );
		}
	
		// selector
		this.selector = {
			rows: null,
			cols: null,
			opts: null
		};
	
		_Api.extend( this, this, __apiStruct );
	};
	
	DataTable.Api = _Api;
	
	// Don't destroy the existing prototype, just extend it. Required for jQuery 2's
	// isPlainObject.
	$.extend( _Api.prototype, {
		any: function ()
		{
			return this.count() !== 0;
		},
	
	
		concat:  __arrayProto.concat,
	
	
		context: [], // array of table settings objects
	
	
		count: function ()
		{
			return this.flatten().length;
		},
	
	
		each: function ( fn )
		{
			for ( var i=0, ien=this.length ; i<ien; i++ ) {
				fn.call( this, this[i], i, this );
			}
	
			return this;
		},
	
	
		eq: function ( idx )
		{
			var ctx = this.context;
	
			return ctx.length > idx ?
				new _Api( ctx[idx], this[idx] ) :
				null;
		},
	
	
		filter: function ( fn )
		{
			var a = [];
	
			if ( __arrayProto.filter ) {
				a = __arrayProto.filter.call( this, fn, this );
			}
			else {
				// Compatibility for browsers without EMCA-252-5 (JS 1.6)
				for ( var i=0, ien=this.length ; i<ien ; i++ ) {
					if ( fn.call( this, this[i], i, this ) ) {
						a.push( this[i] );
					}
				}
			}
	
			return new _Api( this.context, a );
		},
	
	
		flatten: function ()
		{
			var a = [];
			return new _Api( this.context, a.concat.apply( a, this.toArray() ) );
		},
	
	
		join:    __arrayProto.join,
	
	
		indexOf: __arrayProto.indexOf || function (obj, start)
		{
			for ( var i=(start || 0), ien=this.length ; i<ien ; i++ ) {
				if ( this[i] === obj ) {
					return i;
				}
			}
			return -1;
		},
	
		iterator: function ( flatten, type, fn, alwaysNew ) {
			var
				a = [], ret,
				i, ien, j, jen,
				context = this.context,
				rows, items, item,
				selector = this.selector;
	
			// Argument shifting
			if ( typeof flatten === 'string' ) {
				alwaysNew = fn;
				fn = type;
				type = flatten;
				flatten = false;
			}
	
			for ( i=0, ien=context.length ; i<ien ; i++ ) {
				var apiInst = new _Api( context[i] );
	
				if ( type === 'table' ) {
					ret = fn.call( apiInst, context[i], i );
	
					if ( ret !== undefined ) {
						a.push( ret );
					}
				}
				else if ( type === 'columns' || type === 'rows' ) {
					// this has same length as context - one entry for each table
					ret = fn.call( apiInst, context[i], this[i], i );
	
					if ( ret !== undefined ) {
						a.push( ret );
					}
				}
				else if ( type === 'column' || type === 'column-rows' || type === 'row' || type === 'cell' ) {
					// columns and rows share the same structure.
					// 'this' is an array of column indexes for each context
					items = this[i];
	
					if ( type === 'column-rows' ) {
						rows = _selector_row_indexes( context[i], selector.opts );
					}
	
					for ( j=0, jen=items.length ; j<jen ; j++ ) {
						item = items[j];
	
						if ( type === 'cell' ) {
							ret = fn.call( apiInst, context[i], item.row, item.column, i, j );
						}
						else {
							ret = fn.call( apiInst, context[i], item, i, j, rows );
						}
	
						if ( ret !== undefined ) {
							a.push( ret );
						}
					}
				}
			}
	
			if ( a.length || alwaysNew ) {
				var api = new _Api( context, flatten ? a.concat.apply( [], a ) : a );
				var apiSelector = api.selector;
				apiSelector.rows = selector.rows;
				apiSelector.cols = selector.cols;
				apiSelector.opts = selector.opts;
				return api;
			}
			return this;
		},
	
	
		lastIndexOf: __arrayProto.lastIndexOf || function (obj, start)
		{
			// Bit cheeky...
			return this.indexOf.apply( this.toArray.reverse(), arguments );
		},
	
	
		length:  0,
	
	
		map: function ( fn )
		{
			var a = [];
	
			if ( __arrayProto.map ) {
				a = __arrayProto.map.call( this, fn, this );
			}
			else {
				// Compatibility for browsers without EMCA-252-5 (JS 1.6)
				for ( var i=0, ien=this.length ; i<ien ; i++ ) {
					a.push( fn.call( this, this[i], i ) );
				}
			}
	
			return new _Api( this.context, a );
		},
	
	
		pluck: function ( prop )
		{
			return this.map( function ( el ) {
				return el[ prop ];
			} );
		},
	
		pop:     __arrayProto.pop,
	
	
		push:    __arrayProto.push,
	
	
		// Does not return an API instance
		reduce: __arrayProto.reduce || function ( fn, init )
		{
			return _fnReduce( this, fn, init, 0, this.length, 1 );
		},
	
	
		reduceRight: __arrayProto.reduceRight || function ( fn, init )
		{
			return _fnReduce( this, fn, init, this.length-1, -1, -1 );
		},
	
	
		reverse: __arrayProto.reverse,
	
	
		// Object with rows, columns and opts
		selector: null,
	
	
		shift:   __arrayProto.shift,
	
	
		slice: function () {
			return new _Api( this.context, this );
		},
	
	
		sort:    __arrayProto.sort, // ? name - order?
	
	
		splice:  __arrayProto.splice,
	
	
		toArray: function ()
		{
			return __arrayProto.slice.call( this );
		},
	
	
		to$: function ()
		{
			return $( this );
		},
	
	
		toJQuery: function ()
		{
			return $( this );
		},
	
	
		unique: function ()
		{
			return new _Api( this.context, _unique(this) );
		},
	
	
		unshift: __arrayProto.unshift
	} );
	
	
	_Api.extend = function ( scope, obj, ext )
	{
		// Only extend API instances and static properties of the API
		if ( ! ext.length || ! obj || ( ! (obj instanceof _Api) && ! obj.__dt_wrapper ) ) {
			return;
		}
	
		var
			i, ien,
			struct,
			methodScoping = function ( scope, fn, struc ) {
				return function () {
					var ret = fn.apply( scope, arguments );
	
					// Method extension
					_Api.extend( ret, ret, struc.methodExt );
					return ret;
				};
			};
	
		for ( i=0, ien=ext.length ; i<ien ; i++ ) {
			struct = ext[i];
	
			// Value
			obj[ struct.name ] = struct.type === 'function' ?
				methodScoping( scope, struct.val, struct ) :
				struct.type === 'object' ?
					{} :
					struct.val;
	
			obj[ struct.name ].__dt_wrapper = true;
	
			// Property extension
			_Api.extend( scope, obj[ struct.name ], struct.propExt );
		}
	};
	
	
	// @todo - Is there need for an augment function?
	// _Api.augment = function ( inst, name )
	// {
	// 	// Find src object in the structure from the name
	// 	var parts = name.split('.');
	
	// 	_Api.extend( inst, obj );
	// };
	
	
	//     [
	//       {
	//         name:      'data'                -- string   - Property name
	//         val:       function () {},       -- function - Api method (or undefined if just an object
	//         methodExt: [ ... ],              -- array    - Array of Api object definitions to extend the method result
	//         propExt:   [ ... ]               -- array    - Array of Api object definitions to extend the property
	//       },
	//       {
	//         name:     'row'
	//         val:       {},
	//         methodExt: [ ... ],
	//         propExt:   [
	//           {
	//             name:      'data'
	//             val:       function () {},
	//             methodExt: [ ... ],
	//             propExt:   [ ... ]
	//           },
	//           ...
	//         ]
	//       }
	//     ]
	
	_Api.register = _api_register = function ( name, val )
	{
		if ( Array.isArray( name ) ) {
			for ( var j=0, jen=name.length ; j<jen ; j++ ) {
				_Api.register( name[j], val );
			}
			return;
		}
	
		var
			i, ien,
			heir = name.split('.'),
			struct = __apiStruct,
			key, method;
	
		var find = function ( src, name ) {
			for ( var i=0, ien=src.length ; i<ien ; i++ ) {
				if ( src[i].name === name ) {
					return src[i];
				}
			}
			return null;
		};
	
		for ( i=0, ien=heir.length ; i<ien ; i++ ) {
			method = heir[i].indexOf('()') !== -1;
			key = method ?
				heir[i].replace('()', '') :
				heir[i];
	
			var src = find( struct, key );
			if ( ! src ) {
				src = {
					name:      key,
					val:       {},
					methodExt: [],
					propExt:   [],
					type:      'object'
				};
				struct.push( src );
			}
	
			if ( i === ien-1 ) {
				src.val = val;
				src.type = typeof val === 'function' ?
					'function' :
					$.isPlainObject( val ) ?
						'object' :
						'other';
			}
			else {
				struct = method ?
					src.methodExt :
					src.propExt;
			}
		}
	};
	
	_Api.registerPlural = _api_registerPlural = function ( pluralName, singularName, val ) {
		_Api.register( pluralName, val );
	
		_Api.register( singularName, function () {
			var ret = val.apply( this, arguments );
	
			if ( ret === this ) {
				// Returned item is the API instance that was passed in, return it
				return this;
			}
			else if ( ret instanceof _Api ) {
				// New API instance returned, want the value from the first item
				// in the returned array for the singular result.
				return ret.length ?
					Array.isArray( ret[0] ) ?
						new _Api( ret.context, ret[0] ) : // Array results are 'enhanced'
						ret[0] :
					undefined;
			}
	
			// Non-API return - just fire it back
			return ret;
		} );
	};
	
	
	/**
	 * Selector for HTML tables. Apply the given selector to the give array of
	 * DataTables settings objects.
	 *
	 * @param {string|integer} [selector] jQuery selector string or integer
	 * @param  {array} Array of DataTables settings objects to be filtered
	 * @return {array}
	 * @ignore
	 */
	var __table_selector = function ( selector, a )
	{
		if ( Array.isArray(selector) ) {
			return $.map( selector, function (item) {
				return __table_selector(item, a);
			} );
		}
	
		// Integer is used to pick out a table by index
		if ( typeof selector === 'number' ) {
			return [ a[ selector ] ];
		}
	
		// Perform a jQuery selector on the table nodes
		var nodes = $.map( a, function (el, i) {
			return el.nTable;
		} );
	
		return $(nodes)
			.filter( selector )
			.map( function (i) {
				// Need to translate back from the table node to the settings
				var idx = $.inArray( this, nodes );
				return a[ idx ];
			} )
			.toArray();
	};
	
	
	
	/**
	 * Context selector for the API's context (i.e. the tables the API instance
	 * refers to.
	 *
	 * @name    DataTable.Api#tables
	 * @param {string|integer} [selector] Selector to pick which tables the iterator
	 *   should operate on. If not given, all tables in the current context are
	 *   used. This can be given as a jQuery selector (for example `':gt(0)'`) to
	 *   select multiple tables or as an integer to select a single table.
	 * @returns {DataTable.Api} Returns a new API instance if a selector is given.
	 */
	_api_register( 'tables()', function ( selector ) {
		// A new instance is created if there was a selector specified
		return selector !== undefined && selector !== null ?
			new _Api( __table_selector( selector, this.context ) ) :
			this;
	} );
	
	
	_api_register( 'table()', function ( selector ) {
		var tables = this.tables( selector );
		var ctx = tables.context;
	
		// Truncate to the first matched table
		return ctx.length ?
			new _Api( ctx[0] ) :
			tables;
	} );
	
	
	_api_registerPlural( 'tables().nodes()', 'table().node()' , function () {
		return this.iterator( 'table', function ( ctx ) {
			return ctx.nTable;
		}, 1 );
	} );
	
	
	_api_registerPlural( 'tables().body()', 'table().body()' , function () {
		return this.iterator( 'table', function ( ctx ) {
			return ctx.nTBody;
		}, 1 );
	} );
	
	
	_api_registerPlural( 'tables().header()', 'table().header()' , function () {
		return this.iterator( 'table', function ( ctx ) {
			return ctx.nTHead;
		}, 1 );
	} );
	
	
	_api_registerPlural( 'tables().footer()', 'table().footer()' , function () {
		return this.iterator( 'table', function ( ctx ) {
			return ctx.nTFoot;
		}, 1 );
	} );
	
	
	_api_registerPlural( 'tables().containers()', 'table().container()' , function () {
		return this.iterator( 'table', function ( ctx ) {
			return ctx.nTableWrapper;
		}, 1 );
	} );
	
	
	
	/**
	 * Redraw the tables in the current context.
	 */
	_api_register( 'draw()', function ( paging ) {
		return this.iterator( 'table', function ( settings ) {
			if ( paging === 'page' ) {
				_fnDraw( settings );
			}
			else {
				if ( typeof paging === 'string' ) {
					paging = paging === 'full-hold' ?
						false :
						true;
				}
	
				_fnReDraw( settings, paging===false );
			}
		} );
	} );
	
	
	
	/**
	 * Get the current page index.
	 *
	 * @return {integer} Current page index (zero based)
	 *//**
	 * Set the current page.
	 *
	 * Note that if you attempt to show a page which does not exist, DataTables will
	 * not throw an error, but rather reset the paging.
	 *
	 * @param {integer|string} action The paging action to take. This can be one of:
	 *  * `integer` - The page index to jump to
	 *  * `string` - An action to take:
	 *    * `first` - Jump to first page.
	 *    * `next` - Jump to the next page
	 *    * `previous` - Jump to previous page
	 *    * `last` - Jump to the last page.
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'page()', function ( action ) {
		if ( action === undefined ) {
			return this.page.info().page; // not an expensive call
		}
	
		// else, have an action to take on all tables
		return this.iterator( 'table', function ( settings ) {
			_fnPageChange( settings, action );
		} );
	} );
	
	
	/**
	 * Paging information for the first table in the current context.
	 *
	 * If you require paging information for another table, use the `table()` method
	 * with a suitable selector.
	 *
	 * @return {object} Object with the following properties set:
	 *  * `page` - Current page index (zero based - i.e. the first page is `0`)
	 *  * `pages` - Total number of pages
	 *  * `start` - Display index for the first record shown on the current page
	 *  * `end` - Display index for the last record shown on the current page
	 *  * `length` - Display length (number of records). Note that generally `start
	 *    + length = end`, but this is not always true, for example if there are
	 *    only 2 records to show on the final page, with a length of 10.
	 *  * `recordsTotal` - Full data set length
	 *  * `recordsDisplay` - Data set length once the current filtering criterion
	 *    are applied.
	 */
	_api_register( 'page.info()', function ( action ) {
		if ( this.context.length === 0 ) {
			return undefined;
		}
	
		var
			settings   = this.context[0],
			start      = settings._iDisplayStart,
			len        = settings.oFeatures.bPaginate ? settings._iDisplayLength : -1,
			visRecords = settings.fnRecordsDisplay(),
			all        = len === -1;
	
		return {
			"page":           all ? 0 : Math.floor( start / len ),
			"pages":          all ? 1 : Math.ceil( visRecords / len ),
			"start":          start,
			"end":            settings.fnDisplayEnd(),
			"length":         len,
			"recordsTotal":   settings.fnRecordsTotal(),
			"recordsDisplay": visRecords,
			"serverSide":     _fnDataSource( settings ) === 'ssp'
		};
	} );
	
	
	/**
	 * Get the current page length.
	 *
	 * @return {integer} Current page length. Note `-1` indicates that all records
	 *   are to be shown.
	 *//**
	 * Set the current page length.
	 *
	 * @param {integer} Page length to set. Use `-1` to show all records.
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'page.len()', function ( len ) {
		// Note that we can't call this function 'length()' because `length`
		// is a Javascript property of functions which defines how many arguments
		// the function expects.
		if ( len === undefined ) {
			return this.context.length !== 0 ?
				this.context[0]._iDisplayLength :
				undefined;
		}
	
		// else, set the page length
		return this.iterator( 'table', function ( settings ) {
			_fnLengthChange( settings, len );
		} );
	} );
	
	
	
	var __reload = function ( settings, holdPosition, callback ) {
		// Use the draw event to trigger a callback
		if ( callback ) {
			var api = new _Api( settings );
	
			api.one( 'draw', function () {
				callback( api.ajax.json() );
			} );
		}
	
		if ( _fnDataSource( settings ) == 'ssp' ) {
			_fnReDraw( settings, holdPosition );
		}
		else {
			_fnProcessingDisplay( settings, true );
	
			// Cancel an existing request
			var xhr = settings.jqXHR;
			if ( xhr && xhr.readyState !== 4 ) {
				xhr.abort();
			}
	
			// Trigger xhr
			_fnBuildAjax( settings, [], function( json ) {
				_fnClearTable( settings );
	
				var data = _fnAjaxDataSrc( settings, json );
				for ( var i=0, ien=data.length ; i<ien ; i++ ) {
					_fnAddData( settings, data[i] );
				}
	
				_fnReDraw( settings, holdPosition );
				_fnProcessingDisplay( settings, false );
			} );
		}
	};
	
	
	/**
	 * Get the JSON response from the last Ajax request that DataTables made to the
	 * server. Note that this returns the JSON from the first table in the current
	 * context.
	 *
	 * @return {object} JSON received from the server.
	 */
	_api_register( 'ajax.json()', function () {
		var ctx = this.context;
	
		if ( ctx.length > 0 ) {
			return ctx[0].json;
		}
	
		// else return undefined;
	} );
	
	
	/**
	 * Get the data submitted in the last Ajax request
	 */
	_api_register( 'ajax.params()', function () {
		var ctx = this.context;
	
		if ( ctx.length > 0 ) {
			return ctx[0].oAjaxData;
		}
	
		// else return undefined;
	} );
	
	
	/**
	 * Reload tables from the Ajax data source. Note that this function will
	 * automatically re-draw the table when the remote data has been loaded.
	 *
	 * @param {boolean} [reset=true] Reset (default) or hold the current paging
	 *   position. A full re-sort and re-filter is performed when this method is
	 *   called, which is why the pagination reset is the default action.
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'ajax.reload()', function ( callback, resetPaging ) {
		return this.iterator( 'table', function (settings) {
			__reload( settings, resetPaging===false, callback );
		} );
	} );
	
	
	/**
	 * Get the current Ajax URL. Note that this returns the URL from the first
	 * table in the current context.
	 *
	 * @return {string} Current Ajax source URL
	 *//**
	 * Set the Ajax URL. Note that this will set the URL for all tables in the
	 * current context.
	 *
	 * @param {string} url URL to set.
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'ajax.url()', function ( url ) {
		var ctx = this.context;
	
		if ( url === undefined ) {
			// get
			if ( ctx.length === 0 ) {
				return undefined;
			}
			ctx = ctx[0];
	
			return ctx.ajax ?
				$.isPlainObject( ctx.ajax ) ?
					ctx.ajax.url :
					ctx.ajax :
				ctx.sAjaxSource;
		}
	
		// set
		return this.iterator( 'table', function ( settings ) {
			if ( $.isPlainObject( settings.ajax ) ) {
				settings.ajax.url = url;
			}
			else {
				settings.ajax = url;
			}
			// No need to consider sAjaxSource here since DataTables gives priority
			// to `ajax` over `sAjaxSource`. So setting `ajax` here, renders any
			// value of `sAjaxSource` redundant.
		} );
	} );
	
	
	/**
	 * Load data from the newly set Ajax URL. Note that this method is only
	 * available when `ajax.url()` is used to set a URL. Additionally, this method
	 * has the same effect as calling `ajax.reload()` but is provided for
	 * convenience when setting a new URL. Like `ajax.reload()` it will
	 * automatically redraw the table once the remote data has been loaded.
	 *
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'ajax.url().load()', function ( callback, resetPaging ) {
		// Same as a reload, but makes sense to present it for easy access after a
		// url change
		return this.iterator( 'table', function ( ctx ) {
			__reload( ctx, resetPaging===false, callback );
		} );
	} );
	
	
	
	
	var _selector_run = function ( type, selector, selectFn, settings, opts )
	{
		var
			out = [], res,
			a, i, ien, j, jen,
			selectorType = typeof selector;
	
		// Can't just check for isArray here, as an API or jQuery instance might be
		// given with their array like look
		if ( ! selector || selectorType === 'string' || selectorType === 'function' || selector.length === undefined ) {
			selector = [ selector ];
		}
	
		for ( i=0, ien=selector.length ; i<ien ; i++ ) {
			// Only split on simple strings - complex expressions will be jQuery selectors
			a = selector[i] && selector[i].split && ! selector[i].match(/[\[\(:]/) ?
				selector[i].split(',') :
				[ selector[i] ];
	
			for ( j=0, jen=a.length ; j<jen ; j++ ) {
				res = selectFn( typeof a[j] === 'string' ? (a[j]).trim() : a[j] );
	
				if ( res && res.length ) {
					out = out.concat( res );
				}
			}
		}
	
		// selector extensions
		var ext = _ext.selector[ type ];
		if ( ext.length ) {
			for ( i=0, ien=ext.length ; i<ien ; i++ ) {
				out = ext[i]( settings, opts, out );
			}
		}
	
		return _unique( out );
	};
	
	
	var _selector_opts = function ( opts )
	{
		if ( ! opts ) {
			opts = {};
		}
	
		// Backwards compatibility for 1.9- which used the terminology filter rather
		// than search
		if ( opts.filter && opts.search === undefined ) {
			opts.search = opts.filter;
		}
	
		return $.extend( {
			search: 'none',
			order: 'current',
			page: 'all'
		}, opts );
	};
	
	
	var _selector_first = function ( inst )
	{
		// Reduce the API instance to the first item found
		for ( var i=0, ien=inst.length ; i<ien ; i++ ) {
			if ( inst[i].length > 0 ) {
				// Assign the first element to the first item in the instance
				// and truncate the instance and context
				inst[0] = inst[i];
				inst[0].length = 1;
				inst.length = 1;
				inst.context = [ inst.context[i] ];
	
				return inst;
			}
		}
	
		// Not found - return an empty instance
		inst.length = 0;
		return inst;
	};
	
	
	var _selector_row_indexes = function ( settings, opts )
	{
		var
			i, ien, tmp, a=[],
			displayFiltered = settings.aiDisplay,
			displayMaster = settings.aiDisplayMaster;
	
		var
			search = opts.search,  // none, applied, removed
			order  = opts.order,   // applied, current, index (original - compatibility with 1.9)
			page   = opts.page;    // all, current
	
		if ( _fnDataSource( settings ) == 'ssp' ) {
			// In server-side processing mode, most options are irrelevant since
			// rows not shown don't exist and the index order is the applied order
			// Removed is a special case - for consistency just return an empty
			// array
			return search === 'removed' ?
				[] :
				_range( 0, displayMaster.length );
		}
		else if ( page == 'current' ) {
			// Current page implies that order=current and filter=applied, since it is
			// fairly senseless otherwise, regardless of what order and search actually
			// are
			for ( i=settings._iDisplayStart, ien=settings.fnDisplayEnd() ; i<ien ; i++ ) {
				a.push( displayFiltered[i] );
			}
		}
		else if ( order == 'current' || order == 'applied' ) {
			if ( search == 'none') {
				a = displayMaster.slice();
			}
			else if ( search == 'applied' ) {
				a = displayFiltered.slice();
			}
			else if ( search == 'removed' ) {
				// O(n+m) solution by creating a hash map
				var displayFilteredMap = {};
	
				for ( var i=0, ien=displayFiltered.length ; i<ien ; i++ ) {
					displayFilteredMap[displayFiltered[i]] = null;
				}
	
				a = $.map( displayMaster, function (el) {
					return ! displayFilteredMap.hasOwnProperty(el) ?
						el :
						null;
				} );
			}
		}
		else if ( order == 'index' || order == 'original' ) {
			for ( i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
				if ( search == 'none' ) {
					a.push( i );
				}
				else { // applied | removed
					tmp = $.inArray( i, displayFiltered );
	
					if ((tmp === -1 && search == 'removed') ||
						(tmp >= 0   && search == 'applied') )
					{
						a.push( i );
					}
				}
			}
		}
	
		return a;
	};
	
	
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Rows
	 *
	 * {}          - no selector - use all available rows
	 * {integer}   - row aoData index
	 * {node}      - TR node
	 * {string}    - jQuery selector to apply to the TR elements
	 * {array}     - jQuery array of nodes, or simply an array of TR nodes
	 *
	 */
	var __row_selector = function ( settings, selector, opts )
	{
		var rows;
		var run = function ( sel ) {
			var selInt = _intVal( sel );
			var i, ien;
			var aoData = settings.aoData;
	
			// Short cut - selector is a number and no options provided (default is
			// all records, so no need to check if the index is in there, since it
			// must be - dev error if the index doesn't exist).
			if ( selInt !== null && ! opts ) {
				return [ selInt ];
			}
	
			if ( ! rows ) {
				rows = _selector_row_indexes( settings, opts );
			}
	
			if ( selInt !== null && $.inArray( selInt, rows ) !== -1 ) {
				// Selector - integer
				return [ selInt ];
			}
			else if ( sel === null || sel === undefined || sel === '' ) {
				// Selector - none
				return rows;
			}
	
			// Selector - function
			if ( typeof sel === 'function' ) {
				return $.map( rows, function (idx) {
					var row = aoData[ idx ];
					return sel( idx, row._aData, row.nTr ) ? idx : null;
				} );
			}
	
			// Selector - node
			if ( sel.nodeName ) {
				var rowIdx = sel._DT_RowIndex;  // Property added by DT for fast lookup
				var cellIdx = sel._DT_CellIndex;
	
				if ( rowIdx !== undefined ) {
					// Make sure that the row is actually still present in the table
					return aoData[ rowIdx ] && aoData[ rowIdx ].nTr === sel ?
						[ rowIdx ] :
						[];
				}
				else if ( cellIdx ) {
					return aoData[ cellIdx.row ] && aoData[ cellIdx.row ].nTr === sel.parentNode ?
						[ cellIdx.row ] :
						[];
				}
				else {
					var host = $(sel).closest('*[data-dt-row]');
					return host.length ?
						[ host.data('dt-row') ] :
						[];
				}
			}
	
			// ID selector. Want to always be able to select rows by id, regardless
			// of if the tr element has been created or not, so can't rely upon
			// jQuery here - hence a custom implementation. This does not match
			// Sizzle's fast selector or HTML4 - in HTML5 the ID can be anything,
			// but to select it using a CSS selector engine (like Sizzle or
			// querySelect) it would need to need to be escaped for some characters.
			// DataTables simplifies this for row selectors since you can select
			// only a row. A # indicates an id any anything that follows is the id -
			// unescaped.
			if ( typeof sel === 'string' && sel.charAt(0) === '#' ) {
				// get row index from id
				var rowObj = settings.aIds[ sel.replace( /^#/, '' ) ];
				if ( rowObj !== undefined ) {
					return [ rowObj.idx ];
				}
	
				// need to fall through to jQuery in case there is DOM id that
				// matches
			}
			
			// Get nodes in the order from the `rows` array with null values removed
			var nodes = _removeEmpty(
				_pluck_order( settings.aoData, rows, 'nTr' )
			);
	
			// Selector - jQuery selector string, array of nodes or jQuery object/
			// As jQuery's .filter() allows jQuery objects to be passed in filter,
			// it also allows arrays, so this will cope with all three options
			return $(nodes)
				.filter( sel )
				.map( function () {
					return this._DT_RowIndex;
				} )
				.toArray();
		};
	
		return _selector_run( 'row', selector, run, settings, opts );
	};
	
	
	_api_register( 'rows()', function ( selector, opts ) {
		// argument shifting
		if ( selector === undefined ) {
			selector = '';
		}
		else if ( $.isPlainObject( selector ) ) {
			opts = selector;
			selector = '';
		}
	
		opts = _selector_opts( opts );
	
		var inst = this.iterator( 'table', function ( settings ) {
			return __row_selector( settings, selector, opts );
		}, 1 );
	
		// Want argument shifting here and in __row_selector?
		inst.selector.rows = selector;
		inst.selector.opts = opts;
	
		return inst;
	} );
	
	_api_register( 'rows().nodes()', function () {
		return this.iterator( 'row', function ( settings, row ) {
			return settings.aoData[ row ].nTr || undefined;
		}, 1 );
	} );
	
	_api_register( 'rows().data()', function () {
		return this.iterator( true, 'rows', function ( settings, rows ) {
			return _pluck_order( settings.aoData, rows, '_aData' );
		}, 1 );
	} );
	
	_api_registerPlural( 'rows().cache()', 'row().cache()', function ( type ) {
		return this.iterator( 'row', function ( settings, row ) {
			var r = settings.aoData[ row ];
			return type === 'search' ? r._aFilterData : r._aSortData;
		}, 1 );
	} );
	
	_api_registerPlural( 'rows().invalidate()', 'row().invalidate()', function ( src ) {
		return this.iterator( 'row', function ( settings, row ) {
			_fnInvalidate( settings, row, src );
		} );
	} );
	
	_api_registerPlural( 'rows().indexes()', 'row().index()', function () {
		return this.iterator( 'row', function ( settings, row ) {
			return row;
		}, 1 );
	} );
	
	_api_registerPlural( 'rows().ids()', 'row().id()', function ( hash ) {
		var a = [];
		var context = this.context;
	
		// `iterator` will drop undefined values, but in this case we want them
		for ( var i=0, ien=context.length ; i<ien ; i++ ) {
			for ( var j=0, jen=this[i].length ; j<jen ; j++ ) {
				var id = context[i].rowIdFn( context[i].aoData[ this[i][j] ]._aData );
				a.push( (hash === true ? '#' : '' )+ id );
			}
		}
	
		return new _Api( context, a );
	} );
	
	_api_registerPlural( 'rows().remove()', 'row().remove()', function () {
		var that = this;
	
		this.iterator( 'row', function ( settings, row, thatIdx ) {
			var data = settings.aoData;
			var rowData = data[ row ];
			var i, ien, j, jen;
			var loopRow, loopCells;
	
			data.splice( row, 1 );
	
			// Update the cached indexes
			for ( i=0, ien=data.length ; i<ien ; i++ ) {
				loopRow = data[i];
				loopCells = loopRow.anCells;
	
				// Rows
				if ( loopRow.nTr !== null ) {
					loopRow.nTr._DT_RowIndex = i;
				}
	
				// Cells
				if ( loopCells !== null ) {
					for ( j=0, jen=loopCells.length ; j<jen ; j++ ) {
						loopCells[j]._DT_CellIndex.row = i;
					}
				}
			}
	
			// Delete from the display arrays
			_fnDeleteIndex( settings.aiDisplayMaster, row );
			_fnDeleteIndex( settings.aiDisplay, row );
			_fnDeleteIndex( that[ thatIdx ], row, false ); // maintain local indexes
	
			// For server-side processing tables - subtract the deleted row from the count
			if ( settings._iRecordsDisplay > 0 ) {
				settings._iRecordsDisplay--;
			}
	
			// Check for an 'overflow' they case for displaying the table
			_fnLengthOverflow( settings );
	
			// Remove the row's ID reference if there is one
			var id = settings.rowIdFn( rowData._aData );
			if ( id !== undefined ) {
				delete settings.aIds[ id ];
			}
		} );
	
		this.iterator( 'table', function ( settings ) {
			for ( var i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
				settings.aoData[i].idx = i;
			}
		} );
	
		return this;
	} );
	
	
	_api_register( 'rows.add()', function ( rows ) {
		var newRows = this.iterator( 'table', function ( settings ) {
				var row, i, ien;
				var out = [];
	
				for ( i=0, ien=rows.length ; i<ien ; i++ ) {
					row = rows[i];
	
					if ( row.nodeName && row.nodeName.toUpperCase() === 'TR' ) {
						out.push( _fnAddTr( settings, row )[0] );
					}
					else {
						out.push( _fnAddData( settings, row ) );
					}
				}
	
				return out;
			}, 1 );
	
		// Return an Api.rows() extended instance, so rows().nodes() etc can be used
		var modRows = this.rows( -1 );
		modRows.pop();
		$.merge( modRows, newRows );
	
		return modRows;
	} );
	
	
	
	
	
	/**
	 *
	 */
	_api_register( 'row()', function ( selector, opts ) {
		return _selector_first( this.rows( selector, opts ) );
	} );
	
	
	_api_register( 'row().data()', function ( data ) {
		var ctx = this.context;
	
		if ( data === undefined ) {
			// Get
			return ctx.length && this.length ?
				ctx[0].aoData[ this[0] ]._aData :
				undefined;
		}
	
		// Set
		var row = ctx[0].aoData[ this[0] ];
		row._aData = data;
	
		// If the DOM has an id, and the data source is an array
		if ( Array.isArray( data ) && row.nTr && row.nTr.id ) {
			_fnSetObjectDataFn( ctx[0].rowId )( data, row.nTr.id );
		}
	
		// Automatically invalidate
		_fnInvalidate( ctx[0], this[0], 'data' );
	
		return this;
	} );
	
	
	_api_register( 'row().node()', function () {
		var ctx = this.context;
	
		return ctx.length && this.length ?
			ctx[0].aoData[ this[0] ].nTr || null :
			null;
	} );
	
	
	_api_register( 'row.add()', function ( row ) {
		// Allow a jQuery object to be passed in - only a single row is added from
		// it though - the first element in the set
		if ( row instanceof $ && row.length ) {
			row = row[0];
		}
	
		var rows = this.iterator( 'table', function ( settings ) {
			if ( row.nodeName && row.nodeName.toUpperCase() === 'TR' ) {
				return _fnAddTr( settings, row )[0];
			}
			return _fnAddData( settings, row );
		} );
	
		// Return an Api.rows() extended instance, with the newly added row selected
		return this.row( rows[0] );
	} );
	
	
	$(document).on('plugin-init.dt', function (e, context) {
		var api = new _Api( context );
	
		api.on( 'stateSaveParams', function ( e, settings, d ) {
			// This could be more compact with the API, but it is a lot faster as a simple
			// internal loop
			var idFn = settings.rowIdFn;
			var data = settings.aoData;
			var ids = [];
	
			for (var i=0 ; i<data.length ; i++) {
				if (data[i]._detailsShow) {
					ids.push( '#' + idFn(data[i]._aData) );
				}
			}
	
			d.childRows = ids;
		})
	
		var loaded = api.state.loaded();
	
		if ( loaded && loaded.childRows ) {
			api
				.rows( $.map(loaded.childRows, function (id){
					return id.replace(/:/g, '\\:')
				}) )
				.every( function () {
					_fnCallbackFire( context, null, 'requestChild', [ this ] )
				});
		}
	});
	
	var __details_add = function ( ctx, row, data, klass )
	{
		// Convert to array of TR elements
		var rows = [];
		var addRow = function ( r, k ) {
			// Recursion to allow for arrays of jQuery objects
			if ( Array.isArray( r ) || r instanceof $ ) {
				for ( var i=0, ien=r.length ; i<ien ; i++ ) {
					addRow( r[i], k );
				}
				return;
			}
	
			// If we get a TR element, then just add it directly - up to the dev
			// to add the correct number of columns etc
			if ( r.nodeName && r.nodeName.toLowerCase() === 'tr' ) {
				rows.push( r );
			}
			else {
				// Otherwise create a row with a wrapper
				var created = $('<tr><td></td></tr>').addClass( k );
				$('td', created)
					.addClass( k )
					.html( r )
					[0].colSpan = _fnVisbleColumns( ctx );
	
				rows.push( created[0] );
			}
		};
	
		addRow( data, klass );
	
		if ( row._details ) {
			row._details.detach();
		}
	
		row._details = $(rows);
	
		// If the children were already shown, that state should be retained
		if ( row._detailsShow ) {
			row._details.insertAfter( row.nTr );
		}
	};
	
	
	// Make state saving of child row details async to allow them to be batch processed
	var __details_state = DataTable.util.throttle(
		function (ctx) {
			_fnSaveState( ctx[0] )
		},
		500
	);
	
	
	var __details_remove = function ( api, idx )
	{
		var ctx = api.context;
	
		if ( ctx.length ) {
			var row = ctx[0].aoData[ idx !== undefined ? idx : api[0] ];
	
			if ( row && row._details ) {
				row._details.remove();
	
				row._detailsShow = undefined;
				row._details = undefined;
				$( row.nTr ).removeClass( 'dt-hasChild' );
				__details_state( ctx );
			}
		}
	};
	
	
	var __details_display = function ( api, show ) {
		var ctx = api.context;
	
		if ( ctx.length && api.length ) {
			var row = ctx[0].aoData[ api[0] ];
	
			if ( row._details ) {
				row._detailsShow = show;
	
				if ( show ) {
					row._details.insertAfter( row.nTr );
					$( row.nTr ).addClass( 'dt-hasChild' );
				}
				else {
					row._details.detach();
					$( row.nTr ).removeClass( 'dt-hasChild' );
				}
	
				_fnCallbackFire( ctx[0], null, 'childRow', [ show, api.row( api[0] ) ] )
	
				__details_events( ctx[0] );
				__details_state( ctx );
			}
		}
	};
	
	
	var __details_events = function ( settings )
	{
		var api = new _Api( settings );
		var namespace = '.dt.DT_details';
		var drawEvent = 'draw'+namespace;
		var colvisEvent = 'column-visibility'+namespace;
		var destroyEvent = 'destroy'+namespace;
		var data = settings.aoData;
	
		api.off( drawEvent +' '+ colvisEvent +' '+ destroyEvent );
	
		if ( _pluck( data, '_details' ).length > 0 ) {
			// On each draw, insert the required elements into the document
			api.on( drawEvent, function ( e, ctx ) {
				if ( settings !== ctx ) {
					return;
				}
	
				api.rows( {page:'current'} ).eq(0).each( function (idx) {
					// Internal data grab
					var row = data[ idx ];
	
					if ( row._detailsShow ) {
						row._details.insertAfter( row.nTr );
					}
				} );
			} );
	
			// Column visibility change - update the colspan
			api.on( colvisEvent, function ( e, ctx, idx, vis ) {
				if ( settings !== ctx ) {
					return;
				}
	
				// Update the colspan for the details rows (note, only if it already has
				// a colspan)
				var row, visible = _fnVisbleColumns( ctx );
	
				for ( var i=0, ien=data.length ; i<ien ; i++ ) {
					row = data[i];
	
					if ( row._details ) {
						row._details.children('td[colspan]').attr('colspan', visible );
					}
				}
			} );
	
			// Table destroyed - nuke any child rows
			api.on( destroyEvent, function ( e, ctx ) {
				if ( settings !== ctx ) {
					return;
				}
	
				for ( var i=0, ien=data.length ; i<ien ; i++ ) {
					if ( data[i]._details ) {
						__details_remove( api, i );
					}
				}
			} );
		}
	};
	
	// Strings for the method names to help minification
	var _emp = '';
	var _child_obj = _emp+'row().child';
	var _child_mth = _child_obj+'()';
	
	// data can be:
	//  tr
	//  string
	//  jQuery or array of any of the above
	_api_register( _child_mth, function ( data, klass ) {
		var ctx = this.context;
	
		if ( data === undefined ) {
			// get
			return ctx.length && this.length ?
				ctx[0].aoData[ this[0] ]._details :
				undefined;
		}
		else if ( data === true ) {
			// show
			this.child.show();
		}
		else if ( data === false ) {
			// remove
			__details_remove( this );
		}
		else if ( ctx.length && this.length ) {
			// set
			__details_add( ctx[0], ctx[0].aoData[ this[0] ], data, klass );
		}
	
		return this;
	} );
	
	
	_api_register( [
		_child_obj+'.show()',
		_child_mth+'.show()' // only when `child()` was called with parameters (without
	], function ( show ) {   // it returns an object and this method is not executed)
		__details_display( this, true );
		return this;
	} );
	
	
	_api_register( [
		_child_obj+'.hide()',
		_child_mth+'.hide()' // only when `child()` was called with parameters (without
	], function () {         // it returns an object and this method is not executed)
		__details_display( this, false );
		return this;
	} );
	
	
	_api_register( [
		_child_obj+'.remove()',
		_child_mth+'.remove()' // only when `child()` was called with parameters (without
	], function () {           // it returns an object and this method is not executed)
		__details_remove( this );
		return this;
	} );
	
	
	_api_register( _child_obj+'.isShown()', function () {
		var ctx = this.context;
	
		if ( ctx.length && this.length ) {
			// _detailsShown as false or undefined will fall through to return false
			return ctx[0].aoData[ this[0] ]._detailsShow || false;
		}
		return false;
	} );
	
	
	
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Columns
	 *
	 * {integer}           - column index (>=0 count from left, <0 count from right)
	 * "{integer}:visIdx"  - visible column index (i.e. translate to column index)  (>=0 count from left, <0 count from right)
	 * "{integer}:visible" - alias for {integer}:visIdx  (>=0 count from left, <0 count from right)
	 * "{string}:name"     - column name
	 * "{string}"          - jQuery selector on column header nodes
	 *
	 */
	
	// can be an array of these items, comma separated list, or an array of comma
	// separated lists
	
	var __re_column_selector = /^([^:]+):(name|visIdx|visible)$/;
	
	
	// r1 and r2 are redundant - but it means that the parameters match for the
	// iterator callback in columns().data()
	var __columnData = function ( settings, column, r1, r2, rows ) {
		var a = [];
		for ( var row=0, ien=rows.length ; row<ien ; row++ ) {
			a.push( _fnGetCellData( settings, rows[row], column ) );
		}
		return a;
	};
	
	
	var __column_selector = function ( settings, selector, opts )
	{
		var
			columns = settings.aoColumns,
			names = _pluck( columns, 'sName' ),
			nodes = _pluck( columns, 'nTh' );
	
		var run = function ( s ) {
			var selInt = _intVal( s );
	
			// Selector - all
			if ( s === '' ) {
				return _range( columns.length );
			}
	
			// Selector - index
			if ( selInt !== null ) {
				return [ selInt >= 0 ?
					selInt : // Count from left
					columns.length + selInt // Count from right (+ because its a negative value)
				];
			}
	
			// Selector = function
			if ( typeof s === 'function' ) {
				var rows = _selector_row_indexes( settings, opts );
	
				return $.map( columns, function (col, idx) {
					return s(
							idx,
							__columnData( settings, idx, 0, 0, rows ),
							nodes[ idx ]
						) ? idx : null;
				} );
			}
	
			// jQuery or string selector
			var match = typeof s === 'string' ?
				s.match( __re_column_selector ) :
				'';
	
			if ( match ) {
				switch( match[2] ) {
					case 'visIdx':
					case 'visible':
						var idx = parseInt( match[1], 10 );
						// Visible index given, convert to column index
						if ( idx < 0 ) {
							// Counting from the right
							var visColumns = $.map( columns, function (col,i) {
								return col.bVisible ? i : null;
							} );
							return [ visColumns[ visColumns.length + idx ] ];
						}
						// Counting from the left
						return [ _fnVisibleToColumnIndex( settings, idx ) ];
	
					case 'name':
						// match by name. `names` is column index complete and in order
						return $.map( names, function (name, i) {
							return name === match[1] ? i : null;
						} );
	
					default:
						return [];
				}
			}
	
			// Cell in the table body
			if ( s.nodeName && s._DT_CellIndex ) {
				return [ s._DT_CellIndex.column ];
			}
	
			// jQuery selector on the TH elements for the columns
			var jqResult = $( nodes )
				.filter( s )
				.map( function () {
					return $.inArray( this, nodes ); // `nodes` is column index complete and in order
				} )
				.toArray();
	
			if ( jqResult.length || ! s.nodeName ) {
				return jqResult;
			}
	
			// Otherwise a node which might have a `dt-column` data attribute, or be
			// a child or such an element
			var host = $(s).closest('*[data-dt-column]');
			return host.length ?
				[ host.data('dt-column') ] :
				[];
		};
	
		return _selector_run( 'column', selector, run, settings, opts );
	};
	
	
	var __setColumnVis = function ( settings, column, vis ) {
		var
			cols = settings.aoColumns,
			col  = cols[ column ],
			data = settings.aoData,
			row, cells, i, ien, tr;
	
		// Get
		if ( vis === undefined ) {
			return col.bVisible;
		}
	
		// Set
		// No change
		if ( col.bVisible === vis ) {
			return;
		}
	
		if ( vis ) {
			// Insert column
			// Need to decide if we should use appendChild or insertBefore
			var insertBefore = $.inArray( true, _pluck(cols, 'bVisible'), column+1 );
	
			for ( i=0, ien=data.length ; i<ien ; i++ ) {
				tr = data[i].nTr;
				cells = data[i].anCells;
	
				if ( tr ) {
					// insertBefore can act like appendChild if 2nd arg is null
					tr.insertBefore( cells[ column ], cells[ insertBefore ] || null );
				}
			}
		}
		else {
			// Remove column
			$( _pluck( settings.aoData, 'anCells', column ) ).detach();
		}
	
		// Common actions
		col.bVisible = vis;
	};
	
	
	_api_register( 'columns()', function ( selector, opts ) {
		// argument shifting
		if ( selector === undefined ) {
			selector = '';
		}
		else if ( $.isPlainObject( selector ) ) {
			opts = selector;
			selector = '';
		}
	
		opts = _selector_opts( opts );
	
		var inst = this.iterator( 'table', function ( settings ) {
			return __column_selector( settings, selector, opts );
		}, 1 );
	
		// Want argument shifting here and in _row_selector?
		inst.selector.cols = selector;
		inst.selector.opts = opts;
	
		return inst;
	} );
	
	_api_registerPlural( 'columns().header()', 'column().header()', function ( selector, opts ) {
		return this.iterator( 'column', function ( settings, column ) {
			return settings.aoColumns[column].nTh;
		}, 1 );
	} );
	
	_api_registerPlural( 'columns().footer()', 'column().footer()', function ( selector, opts ) {
		return this.iterator( 'column', function ( settings, column ) {
			return settings.aoColumns[column].nTf;
		}, 1 );
	} );
	
	_api_registerPlural( 'columns().data()', 'column().data()', function () {
		return this.iterator( 'column-rows', __columnData, 1 );
	} );
	
	_api_registerPlural( 'columns().dataSrc()', 'column().dataSrc()', function () {
		return this.iterator( 'column', function ( settings, column ) {
			return settings.aoColumns[column].mData;
		}, 1 );
	} );
	
	_api_registerPlural( 'columns().cache()', 'column().cache()', function ( type ) {
		return this.iterator( 'column-rows', function ( settings, column, i, j, rows ) {
			return _pluck_order( settings.aoData, rows,
				type === 'search' ? '_aFilterData' : '_aSortData', column
			);
		}, 1 );
	} );
	
	_api_registerPlural( 'columns().nodes()', 'column().nodes()', function () {
		return this.iterator( 'column-rows', function ( settings, column, i, j, rows ) {
			return _pluck_order( settings.aoData, rows, 'anCells', column ) ;
		}, 1 );
	} );
	
	_api_registerPlural( 'columns().visible()', 'column().visible()', function ( vis, calc ) {
		var that = this;
		var ret = this.iterator( 'column', function ( settings, column ) {
			if ( vis === undefined ) {
				return settings.aoColumns[ column ].bVisible;
			} // else
			__setColumnVis( settings, column, vis );
		} );
	
		// Group the column visibility changes
		if ( vis !== undefined ) {
			this.iterator( 'table', function ( settings ) {
				// Redraw the header after changes
				_fnDrawHead( settings, settings.aoHeader );
				_fnDrawHead( settings, settings.aoFooter );
		
				// Update colspan for no records display. Child rows and extensions will use their own
				// listeners to do this - only need to update the empty table item here
				if ( ! settings.aiDisplay.length ) {
					$(settings.nTBody).find('td[colspan]').attr('colspan', _fnVisbleColumns(settings));
				}
		
				_fnSaveState( settings );
	
				// Second loop once the first is done for events
				that.iterator( 'column', function ( settings, column ) {
					_fnCallbackFire( settings, null, 'column-visibility', [settings, column, vis, calc] );
				} );
	
				if ( calc === undefined || calc ) {
					that.columns.adjust();
				}
			});
		}
	
		return ret;
	} );
	
	_api_registerPlural( 'columns().indexes()', 'column().index()', function ( type ) {
		return this.iterator( 'column', function ( settings, column ) {
			return type === 'visible' ?
				_fnColumnIndexToVisible( settings, column ) :
				column;
		}, 1 );
	} );
	
	_api_register( 'columns.adjust()', function () {
		return this.iterator( 'table', function ( settings ) {
			_fnAdjustColumnSizing( settings );
		}, 1 );
	} );
	
	_api_register( 'column.index()', function ( type, idx ) {
		if ( this.context.length !== 0 ) {
			var ctx = this.context[0];
	
			if ( type === 'fromVisible' || type === 'toData' ) {
				return _fnVisibleToColumnIndex( ctx, idx );
			}
			else if ( type === 'fromData' || type === 'toVisible' ) {
				return _fnColumnIndexToVisible( ctx, idx );
			}
		}
	} );
	
	_api_register( 'column()', function ( selector, opts ) {
		return _selector_first( this.columns( selector, opts ) );
	} );
	
	var __cell_selector = function ( settings, selector, opts )
	{
		var data = settings.aoData;
		var rows = _selector_row_indexes( settings, opts );
		var cells = _removeEmpty( _pluck_order( data, rows, 'anCells' ) );
		var allCells = $(_flatten( [], cells ));
		var row;
		var columns = settings.aoColumns.length;
		var a, i, ien, j, o, host;
	
		var run = function ( s ) {
			var fnSelector = typeof s === 'function';
	
			if ( s === null || s === undefined || fnSelector ) {
				// All cells and function selectors
				a = [];
	
				for ( i=0, ien=rows.length ; i<ien ; i++ ) {
					row = rows[i];
	
					for ( j=0 ; j<columns ; j++ ) {
						o = {
							row: row,
							column: j
						};
	
						if ( fnSelector ) {
							// Selector - function
							host = data[ row ];
	
							if ( s( o, _fnGetCellData(settings, row, j), host.anCells ? host.anCells[j] : null ) ) {
								a.push( o );
							}
						}
						else {
							// Selector - all
							a.push( o );
						}
					}
				}
	
				return a;
			}
			
			// Selector - index
			if ( $.isPlainObject( s ) ) {
				// Valid cell index and its in the array of selectable rows
				return s.column !== undefined && s.row !== undefined && $.inArray( s.row, rows ) !== -1 ?
					[s] :
					[];
			}
	
			// Selector - jQuery filtered cells
			var jqResult = allCells
				.filter( s )
				.map( function (i, el) {
					return { // use a new object, in case someone changes the values
						row:    el._DT_CellIndex.row,
						column: el._DT_CellIndex.column
	 				};
				} )
				.toArray();
	
			if ( jqResult.length || ! s.nodeName ) {
				return jqResult;
			}
	
			// Otherwise the selector is a node, and there is one last option - the
			// element might be a child of an element which has dt-row and dt-column
			// data attributes
			host = $(s).closest('*[data-dt-row]');
			return host.length ?
				[ {
					row: host.data('dt-row'),
					column: host.data('dt-column')
				} ] :
				[];
		};
	
		return _selector_run( 'cell', selector, run, settings, opts );
	};
	
	
	
	
	_api_register( 'cells()', function ( rowSelector, columnSelector, opts ) {
		// Argument shifting
		if ( $.isPlainObject( rowSelector ) ) {
			// Indexes
			if ( rowSelector.row === undefined ) {
				// Selector options in first parameter
				opts = rowSelector;
				rowSelector = null;
			}
			else {
				// Cell index objects in first parameter
				opts = columnSelector;
				columnSelector = null;
			}
		}
		if ( $.isPlainObject( columnSelector ) ) {
			opts = columnSelector;
			columnSelector = null;
		}
	
		// Cell selector
		if ( columnSelector === null || columnSelector === undefined ) {
			return this.iterator( 'table', function ( settings ) {
				return __cell_selector( settings, rowSelector, _selector_opts( opts ) );
			} );
		}
	
		// The default built in options need to apply to row and columns
		var internalOpts = opts ? {
			page: opts.page,
			order: opts.order,
			search: opts.search
		} : {};
	
		// Row + column selector
		var columns = this.columns( columnSelector, internalOpts );
		var rows = this.rows( rowSelector, internalOpts );
		var i, ien, j, jen;
	
		var cellsNoOpts = this.iterator( 'table', function ( settings, idx ) {
			var a = [];
	
			for ( i=0, ien=rows[idx].length ; i<ien ; i++ ) {
				for ( j=0, jen=columns[idx].length ; j<jen ; j++ ) {
					a.push( {
						row:    rows[idx][i],
						column: columns[idx][j]
					} );
				}
			}
	
			return a;
		}, 1 );
	
		// There is currently only one extension which uses a cell selector extension
		// It is a _major_ performance drag to run this if it isn't needed, so this is
		// an extension specific check at the moment
		var cells = opts && opts.selected ?
			this.cells( cellsNoOpts, opts ) :
			cellsNoOpts;
	
		$.extend( cells.selector, {
			cols: columnSelector,
			rows: rowSelector,
			opts: opts
		} );
	
		return cells;
	} );
	
	
	_api_registerPlural( 'cells().nodes()', 'cell().node()', function () {
		return this.iterator( 'cell', function ( settings, row, column ) {
			var data = settings.aoData[ row ];
	
			return data && data.anCells ?
				data.anCells[ column ] :
				undefined;
		}, 1 );
	} );
	
	
	_api_register( 'cells().data()', function () {
		return this.iterator( 'cell', function ( settings, row, column ) {
			return _fnGetCellData( settings, row, column );
		}, 1 );
	} );
	
	
	_api_registerPlural( 'cells().cache()', 'cell().cache()', function ( type ) {
		type = type === 'search' ? '_aFilterData' : '_aSortData';
	
		return this.iterator( 'cell', function ( settings, row, column ) {
			return settings.aoData[ row ][ type ][ column ];
		}, 1 );
	} );
	
	
	_api_registerPlural( 'cells().render()', 'cell().render()', function ( type ) {
		return this.iterator( 'cell', function ( settings, row, column ) {
			return _fnGetCellData( settings, row, column, type );
		}, 1 );
	} );
	
	
	_api_registerPlural( 'cells().indexes()', 'cell().index()', function () {
		return this.iterator( 'cell', function ( settings, row, column ) {
			return {
				row: row,
				column: column,
				columnVisible: _fnColumnIndexToVisible( settings, column )
			};
		}, 1 );
	} );
	
	
	_api_registerPlural( 'cells().invalidate()', 'cell().invalidate()', function ( src ) {
		return this.iterator( 'cell', function ( settings, row, column ) {
			_fnInvalidate( settings, row, src, column );
		} );
	} );
	
	
	
	_api_register( 'cell()', function ( rowSelector, columnSelector, opts ) {
		return _selector_first( this.cells( rowSelector, columnSelector, opts ) );
	} );
	
	
	_api_register( 'cell().data()', function ( data ) {
		var ctx = this.context;
		var cell = this[0];
	
		if ( data === undefined ) {
			// Get
			return ctx.length && cell.length ?
				_fnGetCellData( ctx[0], cell[0].row, cell[0].column ) :
				undefined;
		}
	
		// Set
		_fnSetCellData( ctx[0], cell[0].row, cell[0].column, data );
		_fnInvalidate( ctx[0], cell[0].row, 'data', cell[0].column );
	
		return this;
	} );
	
	
	
	/**
	 * Get current ordering (sorting) that has been applied to the table.
	 *
	 * @returns {array} 2D array containing the sorting information for the first
	 *   table in the current context. Each element in the parent array represents
	 *   a column being sorted upon (i.e. multi-sorting with two columns would have
	 *   2 inner arrays). The inner arrays may have 2 or 3 elements. The first is
	 *   the column index that the sorting condition applies to, the second is the
	 *   direction of the sort (`desc` or `asc`) and, optionally, the third is the
	 *   index of the sorting order from the `column.sorting` initialisation array.
	 *//**
	 * Set the ordering for the table.
	 *
	 * @param {integer} order Column index to sort upon.
	 * @param {string} direction Direction of the sort to be applied (`asc` or `desc`)
	 * @returns {DataTables.Api} this
	 *//**
	 * Set the ordering for the table.
	 *
	 * @param {array} order 1D array of sorting information to be applied.
	 * @param {array} [...] Optional additional sorting conditions
	 * @returns {DataTables.Api} this
	 *//**
	 * Set the ordering for the table.
	 *
	 * @param {array} order 2D array of sorting information to be applied.
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'order()', function ( order, dir ) {
		var ctx = this.context;
	
		if ( order === undefined ) {
			// get
			return ctx.length !== 0 ?
				ctx[0].aaSorting :
				undefined;
		}
	
		// set
		if ( typeof order === 'number' ) {
			// Simple column / direction passed in
			order = [ [ order, dir ] ];
		}
		else if ( order.length && ! Array.isArray( order[0] ) ) {
			// Arguments passed in (list of 1D arrays)
			order = Array.prototype.slice.call( arguments );
		}
		// otherwise a 2D array was passed in
	
		return this.iterator( 'table', function ( settings ) {
			settings.aaSorting = order.slice();
		} );
	} );
	
	
	/**
	 * Attach a sort listener to an element for a given column
	 *
	 * @param {node|jQuery|string} node Identifier for the element(s) to attach the
	 *   listener to. This can take the form of a single DOM node, a jQuery
	 *   collection of nodes or a jQuery selector which will identify the node(s).
	 * @param {integer} column the column that a click on this node will sort on
	 * @param {function} [callback] callback function when sort is run
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'order.listener()', function ( node, column, callback ) {
		return this.iterator( 'table', function ( settings ) {
			_fnSortAttachListener( settings, node, column, callback );
		} );
	} );
	
	
	_api_register( 'order.fixed()', function ( set ) {
		if ( ! set ) {
			var ctx = this.context;
			var fixed = ctx.length ?
				ctx[0].aaSortingFixed :
				undefined;
	
			return Array.isArray( fixed ) ?
				{ pre: fixed } :
				fixed;
		}
	
		return this.iterator( 'table', function ( settings ) {
			settings.aaSortingFixed = $.extend( true, {}, set );
		} );
	} );
	
	
	// Order by the selected column(s)
	_api_register( [
		'columns().order()',
		'column().order()'
	], function ( dir ) {
		var that = this;
	
		return this.iterator( 'table', function ( settings, i ) {
			var sort = [];
	
			$.each( that[i], function (j, col) {
				sort.push( [ col, dir ] );
			} );
	
			settings.aaSorting = sort;
		} );
	} );
	
	
	
	_api_register( 'search()', function ( input, regex, smart, caseInsen ) {
		var ctx = this.context;
	
		if ( input === undefined ) {
			// get
			return ctx.length !== 0 ?
				ctx[0].oPreviousSearch.sSearch :
				undefined;
		}
	
		// set
		return this.iterator( 'table', function ( settings ) {
			if ( ! settings.oFeatures.bFilter ) {
				return;
			}
	
			_fnFilterComplete( settings, $.extend( {}, settings.oPreviousSearch, {
				"sSearch": input+"",
				"bRegex":  regex === null ? false : regex,
				"bSmart":  smart === null ? true  : smart,
				"bCaseInsensitive": caseInsen === null ? true : caseInsen
			} ), 1 );
		} );
	} );
	
	
	_api_registerPlural(
		'columns().search()',
		'column().search()',
		function ( input, regex, smart, caseInsen ) {
			return this.iterator( 'column', function ( settings, column ) {
				var preSearch = settings.aoPreSearchCols;
	
				if ( input === undefined ) {
					// get
					return preSearch[ column ].sSearch;
				}
	
				// set
				if ( ! settings.oFeatures.bFilter ) {
					return;
				}
	
				$.extend( preSearch[ column ], {
					"sSearch": input+"",
					"bRegex":  regex === null ? false : regex,
					"bSmart":  smart === null ? true  : smart,
					"bCaseInsensitive": caseInsen === null ? true : caseInsen
				} );
	
				_fnFilterComplete( settings, settings.oPreviousSearch, 1 );
			} );
		}
	);
	
	/*
	 * State API methods
	 */
	
	_api_register( 'state()', function () {
		return this.context.length ?
			this.context[0].oSavedState :
			null;
	} );
	
	
	_api_register( 'state.clear()', function () {
		return this.iterator( 'table', function ( settings ) {
			// Save an empty object
			settings.fnStateSaveCallback.call( settings.oInstance, settings, {} );
		} );
	} );
	
	
	_api_register( 'state.loaded()', function () {
		return this.context.length ?
			this.context[0].oLoadedState :
			null;
	} );
	
	
	_api_register( 'state.save()', function () {
		return this.iterator( 'table', function ( settings ) {
			_fnSaveState( settings );
		} );
	} );
	
	
	
	/**
	 * Provide a common method for plug-ins to check the version of DataTables being
	 * used, in order to ensure compatibility.
	 *
	 *  @param {string} version Version string to check for, in the format "X.Y.Z".
	 *    Note that the formats "X" and "X.Y" are also acceptable.
	 *  @returns {boolean} true if this version of DataTables is greater or equal to
	 *    the required version, or false if this version of DataTales is not
	 *    suitable
	 *  @static
	 *  @dtopt API-Static
	 *
	 *  @example
	 *    alert( $.fn.dataTable.versionCheck( '1.9.0' ) );
	 */
	DataTable.versionCheck = DataTable.fnVersionCheck = function( version )
	{
		var aThis = DataTable.version.split('.');
		var aThat = version.split('.');
		var iThis, iThat;
	
		for ( var i=0, iLen=aThat.length ; i<iLen ; i++ ) {
			iThis = parseInt( aThis[i], 10 ) || 0;
			iThat = parseInt( aThat[i], 10 ) || 0;
	
			// Parts are the same, keep comparing
			if (iThis === iThat) {
				continue;
			}
	
			// Parts are different, return immediately
			return iThis > iThat;
		}
	
		return true;
	};
	
	
	/**
	 * Check if a `<table>` node is a DataTable table already or not.
	 *
	 *  @param {node|jquery|string} table Table node, jQuery object or jQuery
	 *      selector for the table to test. Note that if more than more than one
	 *      table is passed on, only the first will be checked
	 *  @returns {boolean} true the table given is a DataTable, or false otherwise
	 *  @static
	 *  @dtopt API-Static
	 *
	 *  @example
	 *    if ( ! $.fn.DataTable.isDataTable( '#example' ) ) {
	 *      $('#example').dataTable();
	 *    }
	 */
	DataTable.isDataTable = DataTable.fnIsDataTable = function ( table )
	{
		var t = $(table).get(0);
		var is = false;
	
		if ( table instanceof DataTable.Api ) {
			return true;
		}
	
		$.each( DataTable.settings, function (i, o) {
			var head = o.nScrollHead ? $('table', o.nScrollHead)[0] : null;
			var foot = o.nScrollFoot ? $('table', o.nScrollFoot)[0] : null;
	
			if ( o.nTable === t || head === t || foot === t ) {
				is = true;
			}
		} );
	
		return is;
	};
	
	
	/**
	 * Get all DataTable tables that have been initialised - optionally you can
	 * select to get only currently visible tables.
	 *
	 *  @param {boolean} [visible=false] Flag to indicate if you want all (default)
	 *    or visible tables only.
	 *  @returns {array} Array of `table` nodes (not DataTable instances) which are
	 *    DataTables
	 *  @static
	 *  @dtopt API-Static
	 *
	 *  @example
	 *    $.each( $.fn.dataTable.tables(true), function () {
	 *      $(table).DataTable().columns.adjust();
	 *    } );
	 */
	DataTable.tables = DataTable.fnTables = function ( visible )
	{
		var api = false;
	
		if ( $.isPlainObject( visible ) ) {
			api = visible.api;
			visible = visible.visible;
		}
	
		var a = $.map( DataTable.settings, function (o) {
			if ( !visible || (visible && $(o.nTable).is(':visible')) ) {
				return o.nTable;
			}
		} );
	
		return api ?
			new _Api( a ) :
			a;
	};
	
	
	/**
	 * Convert from camel case parameters to Hungarian notation. This is made public
	 * for the extensions to provide the same ability as DataTables core to accept
	 * either the 1.9 style Hungarian notation, or the 1.10+ style camelCase
	 * parameters.
	 *
	 *  @param {object} src The model object which holds all parameters that can be
	 *    mapped.
	 *  @param {object} user The object to convert from camel case to Hungarian.
	 *  @param {boolean} force When set to `true`, properties which already have a
	 *    Hungarian value in the `user` object will be overwritten. Otherwise they
	 *    won't be.
	 */
	DataTable.camelToHungarian = _fnCamelToHungarian;
	
	
	
	/**
	 *
	 */
	_api_register( '$()', function ( selector, opts ) {
		var
			rows   = this.rows( opts ).nodes(), // Get all rows
			jqRows = $(rows);
	
		return $( [].concat(
			jqRows.filter( selector ).toArray(),
			jqRows.find( selector ).toArray()
		) );
	} );
	
	
	// jQuery functions to operate on the tables
	$.each( [ 'on', 'one', 'off' ], function (i, key) {
		_api_register( key+'()', function ( /* event, handler */ ) {
			var args = Array.prototype.slice.call(arguments);
	
			// Add the `dt` namespace automatically if it isn't already present
			args[0] = $.map( args[0].split( /\s/ ), function ( e ) {
				return ! e.match(/\.dt\b/) ?
					e+'.dt' :
					e;
				} ).join( ' ' );
	
			var inst = $( this.tables().nodes() );
			inst[key].apply( inst, args );
			return this;
		} );
	} );
	
	
	_api_register( 'clear()', function () {
		return this.iterator( 'table', function ( settings ) {
			_fnClearTable( settings );
		} );
	} );
	
	
	_api_register( 'settings()', function () {
		return new _Api( this.context, this.context );
	} );
	
	
	_api_register( 'init()', function () {
		var ctx = this.context;
		return ctx.length ? ctx[0].oInit : null;
	} );
	
	
	_api_register( 'data()', function () {
		return this.iterator( 'table', function ( settings ) {
			return _pluck( settings.aoData, '_aData' );
		} ).flatten();
	} );
	
	
	_api_register( 'destroy()', function ( remove ) {
		remove = remove || false;
	
		return this.iterator( 'table', function ( settings ) {
			var orig      = settings.nTableWrapper.parentNode;
			var classes   = settings.oClasses;
			var table     = settings.nTable;
			var tbody     = settings.nTBody;
			var thead     = settings.nTHead;
			var tfoot     = settings.nTFoot;
			var jqTable   = $(table);
			var jqTbody   = $(tbody);
			var jqWrapper = $(settings.nTableWrapper);
			var rows      = $.map( settings.aoData, function (r) { return r.nTr; } );
			var i, ien;
	
			// Flag to note that the table is currently being destroyed - no action
			// should be taken
			settings.bDestroying = true;
	
			// Fire off the destroy callbacks for plug-ins etc
			_fnCallbackFire( settings, "aoDestroyCallback", "destroy", [settings] );
	
			// If not being removed from the document, make all columns visible
			if ( ! remove ) {
				new _Api( settings ).columns().visible( true );
			}
	
			// Blitz all `DT` namespaced events (these are internal events, the
			// lowercase, `dt` events are user subscribed and they are responsible
			// for removing them
			jqWrapper.off('.DT').find(':not(tbody *)').off('.DT');
			$(window).off('.DT-'+settings.sInstance);
	
			// When scrolling we had to break the table up - restore it
			if ( table != thead.parentNode ) {
				jqTable.children('thead').detach();
				jqTable.append( thead );
			}
	
			if ( tfoot && table != tfoot.parentNode ) {
				jqTable.children('tfoot').detach();
				jqTable.append( tfoot );
			}
	
			settings.aaSorting = [];
			settings.aaSortingFixed = [];
			_fnSortingClasses( settings );
	
			$( rows ).removeClass( settings.asStripeClasses.join(' ') );
	
			$('th, td', thead).removeClass( classes.sSortable+' '+
				classes.sSortableAsc+' '+classes.sSortableDesc+' '+classes.sSortableNone
			);
	
			// Add the TR elements back into the table in their original order
			jqTbody.children().detach();
			jqTbody.append( rows );
	
			// Remove the DataTables generated nodes, events and classes
			var removedMethod = remove ? 'remove' : 'detach';
			jqTable[ removedMethod ]();
			jqWrapper[ removedMethod ]();
	
			// If we need to reattach the table to the document
			if ( ! remove && orig ) {
				// insertBefore acts like appendChild if !arg[1]
				orig.insertBefore( table, settings.nTableReinsertBefore );
	
				// Restore the width of the original table - was read from the style property,
				// so we can restore directly to that
				jqTable
					.css( 'width', settings.sDestroyWidth )
					.removeClass( classes.sTable );
	
				// If the were originally stripe classes - then we add them back here.
				// Note this is not fool proof (for example if not all rows had stripe
				// classes - but it's a good effort without getting carried away
				ien = settings.asDestroyStripes.length;
	
				if ( ien ) {
					jqTbody.children().each( function (i) {
						$(this).addClass( settings.asDestroyStripes[i % ien] );
					} );
				}
			}
	
			/* Remove the settings object from the settings array */
			var idx = $.inArray( settings, DataTable.settings );
			if ( idx !== -1 ) {
				DataTable.settings.splice( idx, 1 );
			}
		} );
	} );
	
	
	// Add the `every()` method for rows, columns and cells in a compact form
	$.each( [ 'column', 'row', 'cell' ], function ( i, type ) {
		_api_register( type+'s().every()', function ( fn ) {
			var opts = this.selector.opts;
			var api = this;
	
			return this.iterator( type, function ( settings, arg1, arg2, arg3, arg4 ) {
				// Rows and columns:
				//  arg1 - index
				//  arg2 - table counter
				//  arg3 - loop counter
				//  arg4 - undefined
				// Cells:
				//  arg1 - row index
				//  arg2 - column index
				//  arg3 - table counter
				//  arg4 - loop counter
				fn.call(
					api[ type ](
						arg1,
						type==='cell' ? arg2 : opts,
						type==='cell' ? opts : undefined
					),
					arg1, arg2, arg3, arg4
				);
			} );
		} );
	} );
	
	
	// i18n method for extensions to be able to use the language object from the
	// DataTable
	_api_register( 'i18n()', function ( token, def, plural ) {
		var ctx = this.context[0];
		var resolved = _fnGetObjectDataFn( token )( ctx.oLanguage );
	
		if ( resolved === undefined ) {
			resolved = def;
		}
	
		if ( plural !== undefined && $.isPlainObject( resolved ) ) {
			resolved = resolved[ plural ] !== undefined ?
				resolved[ plural ] :
				resolved._;
		}
	
		return resolved.replace( '%d', plural ); // nb: plural might be undefined,
	} );	
	/**
	 * Version string for plug-ins to check compatibility. Allowed format is
	 * `a.b.c-d` where: a:int, b:int, c:int, d:string(dev|beta|alpha). `d` is used
	 * only for non-release builds. See http://semver.org/ for more information.
	 *  @member
	 *  @type string
	 *  @default Version number
	 */
	DataTable.version = "1.11.5";
	
	/**
	 * Private data store, containing all of the settings objects that are
	 * created for the tables on a given page.
	 *
	 * Note that the `DataTable.settings` object is aliased to
	 * `jQuery.fn.dataTableExt` through which it may be accessed and
	 * manipulated, or `jQuery.fn.dataTable.settings`.
	 *  @member
	 *  @type array
	 *  @default []
	 *  @private
	 */
	DataTable.settings = [];
	
	/**
	 * Object models container, for the various models that DataTables has
	 * available to it. These models define the objects that are used to hold
	 * the active state and configuration of the table.
	 *  @namespace
	 */
	DataTable.models = {};
	
	
	
	/**
	 * Template object for the way in which DataTables holds information about
	 * search information for the global filter and individual column filters.
	 *  @namespace
	 */
	DataTable.models.oSearch = {
		/**
		 * Flag to indicate if the filtering should be case insensitive or not
		 *  @type boolean
		 *  @default true
		 */
		"bCaseInsensitive": true,
	
		/**
		 * Applied search term
		 *  @type string
		 *  @default <i>Empty string</i>
		 */
		"sSearch": "",
	
		/**
		 * Flag to indicate if the search term should be interpreted as a
		 * regular expression (true) or not (false) and therefore and special
		 * regex characters escaped.
		 *  @type boolean
		 *  @default false
		 */
		"bRegex": false,
	
		/**
		 * Flag to indicate if DataTables is to use its smart filtering or not.
		 *  @type boolean
		 *  @default true
		 */
		"bSmart": true,
	
		/**
		 * Flag to indicate if DataTables should only trigger a search when
		 * the return key is pressed.
		 *  @type boolean
		 *  @default false
		 */
		"return": false
	};
	
		
		
		
		/**
		 * Template object for the way in which DataTables holds information about
		 * each individual row. This is the object format used for the settings
		 * aoData array.
		 *  @namespace
		 */
		DataTable.models.oRow = {
			/**
			 * TR element for the row
			 *  @type node
			 *  @default null
			 */
			"nTr": null,
		
			/**
			 * Array of TD elements for each row. This is null until the row has been
			 * created.
			 *  @type array nodes
			 *  @default []
			 */
			"anCells": null,
		
			/**
			 * Data object from the original data source for the row. This is either
			 * an array if using the traditional form of DataTables, or an object if
			 * using mData options. The exact type will depend on the passed in
			 * data from the data source, or will be an array if using DOM a data
			 * source.
			 *  @type array|object
			 *  @default []
			 */
			"_aData": [],
		
			/**
			 * Sorting data cache - this array is ostensibly the same length as the
			 * number of columns (although each index is generated only as it is
			 * needed), and holds the data that is used for sorting each column in the
			 * row. We do this cache generation at the start of the sort in order that
			 * the formatting of the sort data need be done only once for each cell
			 * per sort. This array should not be read from or written to by anything
			 * other than the master sorting methods.
			 *  @type array
			 *  @default null
			 *  @private
			 */
			"_aSortData": null,
		
			/**
			 * Per cell filtering data cache. As per the sort data cache, used to
			 * increase the performance of the filtering in DataTables
			 *  @type array
			 *  @default null
			 *  @private
			 */
			"_aFilterData": null,
		
			/**
			 * Filtering data cache. This is the same as the cell filtering cache, but
			 * in this case a string rather than an array. This is easily computed with
			 * a join on `_aFilterData`, but is provided as a cache so the join isn't
			 * needed on every search (memory traded for performance)
			 *  @type array
			 *  @default null
			 *  @private
			 */
			"_sFilterRow": null,
		
			/**
			 * Cache of the class name that DataTables has applied to the row, so we
			 * can quickly look at this variable rather than needing to do a DOM check
			 * on className for the nTr property.
			 *  @type string
			 *  @default <i>Empty string</i>
			 *  @private
			 */
			"_sRowStripe": "",
		
			/**
			 * Denote if the original data source was from the DOM, or the data source
			 * object. This is used for invalidating data, so DataTables can
			 * automatically read data from the original source, unless uninstructed
			 * otherwise.
			 *  @type string
			 *  @default null
			 *  @private
			 */
			"src": null,
		
			/**
			 * Index in the aoData array. This saves an indexOf lookup when we have the
			 * object, but want to know the index
			 *  @type integer
			 *  @default -1
			 *  @private
			 */
			"idx": -1
		};
		
		
		/**
		 * Template object for the column information object in DataTables. This object
		 * is held in the settings aoColumns array and contains all the information that
		 * DataTables needs about each individual column.
		 *
		 * Note that this object is related to {@link DataTable.defaults.column}
		 * but this one is the internal data store for DataTables's cache of columns.
		 * It should NOT be manipulated outside of DataTables. Any configuration should
		 * be done through the initialisation options.
		 *  @namespace
		 */
		DataTable.models.oColumn = {
			/**
			 * Column index. This could be worked out on-the-fly with $.inArray, but it
			 * is faster to just hold it as a variable
			 *  @type integer
			 *  @default null
			 */
			"idx": null,
		
			/**
			 * A list of the columns that sorting should occur on when this column
			 * is sorted. That this property is an array allows multi-column sorting
			 * to be defined for a column (for example first name / last name columns
			 * would benefit from this). The values are integers pointing to the
			 * columns to be sorted on (typically it will be a single integer pointing
			 * at itself, but that doesn't need to be the case).
			 *  @type array
			 */
			"aDataSort": null,
		
			/**
			 * Define the sorting directions that are applied to the column, in sequence
			 * as the column is repeatedly sorted upon - i.e. the first value is used
			 * as the sorting direction when the column if first sorted (clicked on).
			 * Sort it again (click again) and it will move on to the next index.
			 * Repeat until loop.
			 *  @type array
			 */
			"asSorting": null,
		
			/**
			 * Flag to indicate if the column is searchable, and thus should be included
			 * in the filtering or not.
			 *  @type boolean
			 */
			"bSearchable": null,
		
			/**
			 * Flag to indicate if the column is sortable or not.
			 *  @type boolean
			 */
			"bSortable": null,
		
			/**
			 * Flag to indicate if the column is currently visible in the table or not
			 *  @type boolean
			 */
			"bVisible": null,
		
			/**
			 * Store for manual type assignment using the `column.type` option. This
			 * is held in store so we can manipulate the column's `sType` property.
			 *  @type string
			 *  @default null
			 *  @private
			 */
			"_sManualType": null,
		
			/**
			 * Flag to indicate if HTML5 data attributes should be used as the data
			 * source for filtering or sorting. True is either are.
			 *  @type boolean
			 *  @default false
			 *  @private
			 */
			"_bAttrSrc": false,
		
			/**
			 * Developer definable function that is called whenever a cell is created (Ajax source,
			 * etc) or processed for input (DOM source). This can be used as a compliment to mRender
			 * allowing you to modify the DOM element (add background colour for example) when the
			 * element is available.
			 *  @type function
			 *  @param {element} nTd The TD node that has been created
			 *  @param {*} sData The Data for the cell
			 *  @param {array|object} oData The data for the whole row
			 *  @param {int} iRow The row index for the aoData data store
			 *  @default null
			 */
			"fnCreatedCell": null,
		
			/**
			 * Function to get data from a cell in a column. You should <b>never</b>
			 * access data directly through _aData internally in DataTables - always use
			 * the method attached to this property. It allows mData to function as
			 * required. This function is automatically assigned by the column
			 * initialisation method
			 *  @type function
			 *  @param {array|object} oData The data array/object for the array
			 *    (i.e. aoData[]._aData)
			 *  @param {string} sSpecific The specific data type you want to get -
			 *    'display', 'type' 'filter' 'sort'
			 *  @returns {*} The data for the cell from the given row's data
			 *  @default null
			 */
			"fnGetData": null,
		
			/**
			 * Function to set data for a cell in the column. You should <b>never</b>
			 * set the data directly to _aData internally in DataTables - always use
			 * this method. It allows mData to function as required. This function
			 * is automatically assigned by the column initialisation method
			 *  @type function
			 *  @param {array|object} oData The data array/object for the array
			 *    (i.e. aoData[]._aData)
			 *  @param {*} sValue Value to set
			 *  @default null
			 */
			"fnSetData": null,
		
			/**
			 * Property to read the value for the cells in the column from the data
			 * source array / object. If null, then the default content is used, if a
			 * function is given then the return from the function is used.
			 *  @type function|int|string|null
			 *  @default null
			 */
			"mData": null,
		
			/**
			 * Partner property to mData which is used (only when defined) to get
			 * the data - i.e. it is basically the same as mData, but without the
			 * 'set' option, and also the data fed to it is the result from mData.
			 * This is the rendering method to match the data method of mData.
			 *  @type function|int|string|null
			 *  @default null
			 */
			"mRender": null,
		
			/**
			 * Unique header TH/TD element for this column - this is what the sorting
			 * listener is attached to (if sorting is enabled.)
			 *  @type node
			 *  @default null
			 */
			"nTh": null,
		
			/**
			 * Unique footer TH/TD element for this column (if there is one). Not used
			 * in DataTables as such, but can be used for plug-ins to reference the
			 * footer for each column.
			 *  @type node
			 *  @default null
			 */
			"nTf": null,
		
			/**
			 * The class to apply to all TD elements in the table's TBODY for the column
			 *  @type string
			 *  @default null
			 */
			"sClass": null,
		
			/**
			 * When DataTables calculates the column widths to assign to each column,
			 * it finds the longest string in each column and then constructs a
			 * temporary table and reads the widths from that. The problem with this
			 * is that "mmm" is much wider then "iiii", but the latter is a longer
			 * string - thus the calculation can go wrong (doing it properly and putting
			 * it into an DOM object and measuring that is horribly(!) slow). Thus as
			 * a "work around" we provide this option. It will append its value to the
			 * text that is found to be the longest string for the column - i.e. padding.
			 *  @type string
			 */
			"sContentPadding": null,
		
			/**
			 * Allows a default value to be given for a column's data, and will be used
			 * whenever a null data source is encountered (this can be because mData
			 * is set to null, or because the data source itself is null).
			 *  @type string
			 *  @default null
			 */
			"sDefaultContent": null,
		
			/**
			 * Name for the column, allowing reference to the column by name as well as
			 * by index (needs a lookup to work by name).
			 *  @type string
			 */
			"sName": null,
		
			/**
			 * Custom sorting data type - defines which of the available plug-ins in
			 * afnSortData the custom sorting will use - if any is defined.
			 *  @type string
			 *  @default std
			 */
			"sSortDataType": 'std',
		
			/**
			 * Class to be applied to the header element when sorting on this column
			 *  @type string
			 *  @default null
			 */
			"sSortingClass": null,
		
			/**
			 * Class to be applied to the header element when sorting on this column -
			 * when jQuery UI theming is used.
			 *  @type string
			 *  @default null
			 */
			"sSortingClassJUI": null,
		
			/**
			 * Title of the column - what is seen in the TH element (nTh).
			 *  @type string
			 */
			"sTitle": null,
		
			/**
			 * Column sorting and filtering type
			 *  @type string
			 *  @default null
			 */
			"sType": null,
		
			/**
			 * Width of the column
			 *  @type string
			 *  @default null
			 */
			"sWidth": null,
		
			/**
			 * Width of the column when it was first "encountered"
			 *  @type string
			 *  @default null
			 */
			"sWidthOrig": null
		};
		
		
		/*
		 * Developer note: The properties of the object below are given in Hungarian
		 * notation, that was used as the interface for DataTables prior to v1.10, however
		 * from v1.10 onwards the primary interface is camel case. In order to avoid
		 * breaking backwards compatibility utterly with this change, the Hungarian
		 * version is still, internally the primary interface, but is is not documented
		 * - hence the @name tags in each doc comment. This allows a Javascript function
		 * to create a map from Hungarian notation to camel case (going the other direction
		 * would require each property to be listed, which would add around 3K to the size
		 * of DataTables, while this method is about a 0.5K hit).
		 *
		 * Ultimately this does pave the way for Hungarian notation to be dropped
		 * completely, but that is a massive amount of work and will break current
		 * installs (therefore is on-hold until v2).
		 */
		
		/**
		 * Initialisation options that can be given to DataTables at initialisation
		 * time.
		 *  @namespace
		 */
		DataTable.defaults = {
			/**
			 * An array of data to use for the table, passed in at initialisation which
			 * will be used in preference to any data which is already in the DOM. This is
			 * particularly useful for constructing tables purely in Javascript, for
			 * example with a custom Ajax call.
			 *  @type array
			 *  @default null
			 *
			 *  @dtopt Option
			 *  @name DataTable.defaults.data
			 *
			 *  @example
			 *    // Using a 2D array data source
			 *    $(document).ready( function () {
			 *      $('#example').dataTable( {
			 *        "data": [
			 *          ['Trident', 'Internet Explorer 4.0', 'Win 95+', 4, 'X'],
			 *          ['Trident', 'Internet Explorer 5.0', 'Win 95+', 5, 'C'],
			 *        ],
			 *        "columns": [
			 *          { "title": "Engine" },
			 *          { "title": "Browser" },
			 *          { "title": "Platform" },
			 *          { "title": "Version" },
			 *          { "title": "Grade" }
			 *        ]
			 *      } );
			 *    } );
			 *
			 *  @example
			 *    // Using an array of objects as a data source (`data`)
			 *    $(document).ready( function () {
			 *      $('#example').dataTable( {
			 *        "data": [
			 *          {
			 *            "engine":   "Trident",
			 *            "browser":  "Internet Explorer 4.0",
			 *            "platform": "Win 95+",
			 *            "version":  4,
			 *            "grade":    "X"
			 *          },
			 *          {
			 *            "engine":   "Trident",
			 *            "browser":  "Internet Explorer 5.0",
			 *            "platform": "Win 95+",
			 *            "version":  5,
			 *            "grade":    "C"
			 *          }
			 *        ],
			 *        "columns": [
			 *          { "title": "Engine",   "data": "engine" },
			 *          { "title": "Browser",  "data": "browser" },
			 *          { "title": "Platform", "data": "platform" },
			 *          { "title": "Version",  "data": "version" },
			 *          { "title": "Grade",    "data": "grade" }
			 *        ]
			 *      } );
			 *    } );
			 */
			"aaData": null,
		
		
			/**
			 * If ordering is enabled, then DataTables will perform a first pass sort on
			 * initialisation. You can define which column(s) the sort is performed
			 * upon, and the sorting direction, with this variable. The `sorting` array
			 * should contain an array for each column to be sorted initially containing
			 * the column's index and a direction string ('asc' or 'desc').
			 *  @type array
			 *  @default [[0,'asc']]
			 *
			 *  @dtopt Option
			 *  @name DataTable.defaults.order
			 *
			 *  @example
			 *    // Sort by 3rd column first, and then 4th column
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "order": [[2,'asc'], [3,'desc']]
			 *      } );
			 *    } );
			 *
			 *    // No initial sorting
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "order": []
			 *      } );
			 *    } );
			 */
			"aaSorting": [[0,'asc']],
		
		
			/**
			 * This parameter is basically identical to the `sorting` parameter, but
			 * cannot be overridden by user interaction with the table. What this means
			 * is that you could have a column (visible or hidden) which the sorting
			 * will always be forced on first - any sorting after that (from the user)
			 * will then be performed as required. This can be useful for grouping rows
			 * together.
			 *  @type array
			 *  @default null
			 *
			 *  @dtopt Option
			 *  @name DataTable.defaults.orderFixed
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "orderFixed": [[0,'asc']]
			 *      } );
			 *    } )
			 */
			"aaSortingFixed": [],
		
		
			/**
			 * DataTables can be instructed to load data to display in the table from a
			 * Ajax source. This option defines how that Ajax call is made and where to.
			 *
			 * The `ajax` property has three different modes of operation, depending on
			 * how it is defined. These are:
			 *
			 * * `string` - Set the URL from where the data should be loaded from.
			 * * `object` - Define properties for `jQuery.ajax`.
			 * * `function` - Custom data get function
			 *
			 * `string`
			 * --------
			 *
			 * As a string, the `ajax` property simply defines the URL from which
			 * DataTables will load data.
			 *
			 * `object`
			 * --------
			 *
			 * As an object, the parameters in the object are passed to
			 * [jQuery.ajax](http://api.jquery.com/jQuery.ajax/) allowing fine control
			 * of the Ajax request. DataTables has a number of default parameters which
			 * you can override using this option. Please refer to the jQuery
			 * documentation for a full description of the options available, although
			 * the following parameters provide additional options in DataTables or
			 * require special consideration:
			 *
			 * * `data` - As with jQuery, `data` can be provided as an object, but it
			 *   can also be used as a function to manipulate the data DataTables sends
			 *   to the server. The function takes a single parameter, an object of
			 *   parameters with the values that DataTables has readied for sending. An
			 *   object may be returned which will be merged into the DataTables
			 *   defaults, or you can add the items to the object that was passed in and
			 *   not return anything from the function. This supersedes `fnServerParams`
			 *   from DataTables 1.9-.
			 *
			 * * `dataSrc` - By default DataTables will look for the property `data` (or
			 *   `aaData` for compatibility with DataTables 1.9-) when obtaining data
			 *   from an Ajax source or for server-side processing - this parameter
			 *   allows that property to be changed. You can use Javascript dotted
			 *   object notation to get a data source for multiple levels of nesting, or
			 *   it my be used as a function. As a function it takes a single parameter,
			 *   the JSON returned from the server, which can be manipulated as
			 *   required, with the returned value being that used by DataTables as the
			 *   data source for the table. This supersedes `sAjaxDataProp` from
			 *   DataTables 1.9-.
			 *
			 * * `success` - Should not be overridden it is used internally in
			 *   DataTables. To manipulate / transform the data returned by the server
			 *   use `ajax.dataSrc`, or use `ajax` as a function (see below).
			 *
			 * `function`
			 * ----------
			 *
			 * As a function, making the Ajax call is left up to yourself allowing
			 * complete control of the Ajax request. Indeed, if desired, a method other
			 * than Ajax could be used to obtain the required data, such as Web storage
			 * or an AIR database.
			 *
			 * The function is given four parameters and no return is required. The
			 * parameters are:
			 *
			 * 1. _object_ - Data to send to the server
			 * 2. _function_ - Callback function that must be executed when the required
			 *    data has been obtained. That data should be passed into the callback
			 *    as the only parameter
			 * 3. _object_ - DataTables settings object for the table
			 *
			 * Note that this supersedes `fnServerData` from DataTables 1.9-.
			 *
			 *  @type string|object|function
			 *  @default null
			 *
			 *  @dtopt Option
			 *  @name DataTable.defaults.ajax
			 *  @since 1.10.0
			 *
			 * @example
			 *   // Get JSON data from a file via Ajax.
			 *   // Note DataTables expects data in the form `{ data: [ ...data... ] }` by default).
			 *   $('#example').dataTable( {
			 *     "ajax": "data.json"
			 *   } );
			 *
			 * @example
			 *   // Get JSON data from a file via Ajax, using `dataSrc` to change
			 *   // `data` to `tableData` (i.e. `{ tableData: [ ...data... ] }`)
			 *   $('#example').dataTable( {
			 *     "ajax": {
			 *       "url": "data.json",
			 *       "dataSrc": "tableData"
			 *     }
			 *   } );
			 *
			 * @example
			 *   // Get JSON data from a file via Ajax, using `dataSrc` to read data
			 *   // from a plain array rather than an array in an object
			 *   $('#example').dataTable( {
			 *     "ajax": {
			 *       "url": "data.json",
			 *       "dataSrc": ""
			 *     }
			 *   } );
			 *
			 * @example
			 *   // Manipulate the data returned from the server - add a link to data
			 *   // (note this can, should, be done using `render` for the column - this
			 *   // is just a simple example of how the data can be manipulated).
			 *   $('#example').dataTable( {
			 *     "ajax": {
			 *       "url": "data.json",
			 *       "dataSrc": function ( json ) {
			 *         for ( var i=0, ien=json.length ; i<ien ; i++ ) {
			 *           json[i][0] = '<a href="/message/'+json[i][0]+'>View message</a>';
			 *         }
			 *         return json;
			 *       }
			 *     }
			 *   } );
			 *
			 * @example
			 *   // Add data to the request
			 *   $('#example').dataTable( {
			 *     "ajax": {
			 *       "url": "data.json",
			 *       "data": function ( d ) {
			 *         return {
			 *           "extra_search": $('#extra').val()
			 *         };
			 *       }
			 *     }
			 *   } );
			 *
			 * @example
			 *   // Send request as POST
			 *   $('#example').dataTable( {
			 *     "ajax": {
			 *       "url": "data.json",
			 *       "type": "POST"
			 *     }
			 *   } );
			 *
			 * @example
			 *   // Get the data from localStorage (could interface with a form for
			 *   // adding, editing and removing rows).
			 *   $('#example').dataTable( {
			 *     "ajax": function (data, callback, settings) {
			 *       callback(
			 *         JSON.parse( localStorage.getItem('dataTablesData') )
			 *       );
			 *     }
			 *   } );
			 */
			"ajax": null,
		
		
			/**
			 * This parameter allows you to readily specify the entries in the length drop
			 * down menu that DataTables shows when pagination is enabled. It can be
			 * either a 1D array of options which will be used for both the displayed
			 * option and the value, or a 2D array which will use the array in the first
			 * position as the value, and the array in the second position as the
			 * displayed options (useful for language strings such as 'All').
			 *
			 * Note that the `pageLength` property will be automatically set to the
			 * first value given in this array, unless `pageLength` is also provided.
			 *  @type array
			 *  @default [ 10, 25, 50, 100 ]
			 *
			 *  @dtopt Option
			 *  @name DataTable.defaults.lengthMenu
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]]
			 *      } );
			 *    } );
			 */
			"aLengthMenu": [ 10, 25, 50, 100 ],
		
		
			/**
			 * The `columns` option in the initialisation parameter allows you to define
			 * details about the way individual columns behave. For a full list of
			 * column options that can be set, please see
			 * {@link DataTable.defaults.column}. Note that if you use `columns` to
			 * define your columns, you must have an entry in the array for every single
			 * column that you have in your table (these can be null if you don't which
			 * to specify any options).
			 *  @member
			 *
			 *  @name DataTable.defaults.column
			 */
			"aoColumns": null,
		
			/**
			 * Very similar to `columns`, `columnDefs` allows you to target a specific
			 * column, multiple columns, or all columns, using the `targets` property of
			 * each object in the array. This allows great flexibility when creating
			 * tables, as the `columnDefs` arrays can be of any length, targeting the
			 * columns you specifically want. `columnDefs` may use any of the column
			 * options available: {@link DataTable.defaults.column}, but it _must_
			 * have `targets` defined in each object in the array. Values in the `targets`
			 * array may be:
			 *   <ul>
			 *     <li>a string - class name will be matched on the TH for the column</li>
			 *     <li>0 or a positive integer - column index counting from the left</li>
			 *     <li>a negative integer - column index counting from the right</li>
			 *     <li>the string "_all" - all columns (i.e. assign a default)</li>
			 *   </ul>
			 *  @member
			 *
			 *  @name DataTable.defaults.columnDefs
			 */
			"aoColumnDefs": null,
		
		
			/**
			 * Basically the same as `search`, this parameter defines the individual column
			 * filtering state at initialisation time. The array must be of the same size
			 * as the number of columns, and each element be an object with the parameters
			 * `search` and `escapeRegex` (the latter is optional). 'null' is also
			 * accepted and the default will be used.
			 *  @type array
			 *  @default []
			 *
			 *  @dtopt Option
			 *  @name DataTable.defaults.searchCols
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "searchCols": [
			 *          null,
			 *          { "search": "My filter" },
			 *          null,
			 *          { "search": "^[0-9]", "escapeRegex": false }
			 *        ]
			 *      } );
			 *    } )
			 */
			"aoSearchCols": [],
		
		
			/**
			 * An array of CSS classes that should be applied to displayed rows. This
			 * array may be of any length, and DataTables will apply each class
			 * sequentially, looping when required.
			 *  @type array
			 *  @default null <i>Will take the values determined by the `oClasses.stripe*`
			 *    options</i>
			 *
			 *  @dtopt Option
			 *  @name DataTable.defaults.stripeClasses
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "stripeClasses": [ 'strip1', 'strip2', 'strip3' ]
			 *      } );
			 *    } )
			 */
			"asStripeClasses": null,
		
		
			/**
			 * Enable or disable automatic column width calculation. This can be disabled
			 * as an optimisation (it takes some time to calculate the widths) if the
			 * tables widths are passed in using `columns`.
			 *  @type boolean
			 *  @default true
			 *
			 *  @dtopt Features
			 *  @name DataTable.defaults.autoWidth
			 *
			 *  @example
			 *    $(document).ready( function () {
			 *      $('#example').dataTable( {
			 *        "autoWidth": false
			 *      } );
			 *    } );
			 */
			"bAutoWidth": true,
		
		
			/**
			 * Deferred rendering can provide DataTables with a huge speed boost when you
			 * are using an Ajax or JS data source for the table. This option, when set to
			 * true, will cause DataTables to defer the creation of the table elements for
			 * each row until they are needed for a draw - saving a significant amount of
			 * time.
			 *  @type boolean
			 *  @default false
			 *
			 *  @dtopt Features
			 *  @name DataTable.defaults.deferRender
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "ajax": "sources/arrays.txt",
			 *        "deferRender": true
			 *      } );
			 *    } );
			 */
			"bDeferRender": false,
		
		
			/**
			 * Replace a DataTable which matches the given selector and replace it with
			 * one which has the properties of the new initialisation object passed. If no
			 * table matches the selector, then the new DataTable will be constructed as
			 * per normal.
			 *  @type boolean
			 *  @default false
			 *
			 *  @dtopt Options
			 *  @name DataTable.defaults.destroy
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "srollY": "200px",
			 *        "paginate": false
			 *      } );
			 *
			 *      // Some time later....
			 *      $('#example').dataTable( {
			 *        "filter": false,
			 *        "destroy": true
			 *      } );
			 *    } );
			 */
			"bDestroy": false,
		
		
			/**
			 * Enable or disable filtering of data. Filtering in DataTables is "smart" in
			 * that it allows the end user to input multiple words (space separated) and
			 * will match a row containing those words, even if not in the order that was
			 * specified (this allow matching across multiple columns). Note that if you
			 * wish to use filtering in DataTables this must remain 'true' - to remove the
			 * default filtering input box and retain filtering abilities, please use
			 * {@link DataTable.defaults.dom}.
			 *  @type boolean
			 *  @default true
			 *
			 *  @dtopt Features
			 *  @name DataTable.defaults.searching
			 *
			 *  @example
			 *    $(document).ready( function () {
			 *      $('#example').dataTable( {
			 *        "searching": false
			 *      } );
			 *    } );
			 */
			"bFilter": true,
		
		
			/**
			 * Enable or disable the table information display. This shows information
			 * about the data that is currently visible on the page, including information
			 * about filtered data if that action is being performed.
			 *  @type boolean
			 *  @default true
			 *
			 *  @dtopt Features
			 *  @name DataTable.defaults.info
			 *
			 *  @example
			 *    $(document).ready( function () {
			 *      $('#example').dataTable( {
			 *        "info": false
			 *      } );
			 *    } );
			 */
			"bInfo": true,
		
		
			/**
			 * Allows the end user to select the size of a formatted page from a select
			 * menu (sizes are 10, 25, 50 and 100). Requires pagination (`paginate`).
			 *  @type boolean
			 *  @default true
			 *
			 *  @dtopt Features
			 *  @name DataTable.defaults.lengthChange
			 *
			 *  @example
			 *    $(document).ready( function () {
			 *      $('#example').dataTable( {
			 *        "lengthChange": false
			 *      } );
			 *    } );
			 */
			"bLengthChange": true,
		
		
			/**
			 * Enable or disable pagination.
			 *  @type boolean
			 *  @default true
			 *
			 *  @dtopt Features
			 *  @name DataTable.defaults.paging
			 *
			 *  @example
			 *    $(document).ready( function () {
			 *      $('#example').dataTable( {
			 *        "paging": false
			 *      } );
			 *    } );
			 */
			"bPaginate": true,
		
		
			/**
			 * Enable or disable the display of a 'processing' indicator when the table is
			 * being processed (e.g. a sort). This is particularly useful for tables with
			 * large amounts of data where it can take a noticeable amount of time to sort
			 * the entries.
			 *  @type boolean
			 *  @default false
			 *
			 *  @dtopt Features
			 *  @name DataTable.defaults.processing
			 *
			 *  @example
			 *    $(document).ready( function () {
			 *      $('#example').dataTable( {
			 *        "processing": true
			 *      } );
			 *    } );
			 */
			"bProcessing": false,
		
		
			/**
			 * Retrieve the DataTables object for the given selector. Note that if the
			 * table has already been initialised, this parameter will cause DataTables
			 * to simply return the object that has already been set up - it will not take
			 * account of any changes you might have made to the initialisation object
			 * passed to DataTables (setting this parameter to true is an acknowledgement
			 * that you understand this). `destroy` can be used to reinitialise a table if
			 * you need.
			 *  @type boolean
			 *  @default false
			 *
			 *  @dtopt Options
			 *  @name DataTable.defaults.retrieve
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      initTable();
			 *      tableActions();
			 *    } );
			 *
			 *    function initTable ()
			 *    {
			 *      return $('#example').dataTable( {
			 *        "scrollY": "200px",
			 *        "paginate": false,
			 *        "retrieve": true
			 *      } );
			 *    }
			 *
			 *    function tableActions ()
			 *    {
			 *      var table = initTable();
			 *      // perform API operations with oTable
			 *    }
			 */
			"bRetrieve": false,
		
		
			/**
			 * When vertical (y) scrolling is enabled, DataTables will force the height of
			 * the table's viewport to the given height at all times (useful for layout).
			 * However, this can look odd when filtering data down to a small data set,
			 * and the footer is left "floating" further down. This parameter (when
			 * enabled) will cause DataTables to collapse the table's viewport down when
			 * the result set will fit within the given Y height.
			 *  @type boolean
			 *  @default false
			 *
			 *  @dtopt Options
			 *  @name DataTable.defaults.scrollCollapse
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "scrollY": "200",
			 *        "scrollCollapse": true
			 *      } );
			 *    } );
			 */
			"bScrollCollapse": false,
		
		
			/**
			 * Configure DataTables to use server-side processing. Note that the
			 * `ajax` parameter must also be given in order to give DataTables a
			 * source to obtain the required data for each draw.
			 *  @type boolean
			 *  @default false
			 *
			 *  @dtopt Features
			 *  @dtopt Server-side
			 *  @name DataTable.defaults.serverSide
			 *
			 *  @example
			 *    $(document).ready( function () {
			 *      $('#example').dataTable( {
			 *        "serverSide": true,
			 *        "ajax": "xhr.php"
			 *      } );
			 *    } );
			 */
			"bServerSide": false,
		
		
			/**
			 * Enable or disable sorting of columns. Sorting of individual columns can be
			 * disabled by the `sortable` option for each column.
			 *  @type boolean
			 *  @default true
			 *
			 *  @dtopt Features
			 *  @name DataTable.defaults.ordering
			 *
			 *  @example
			 *    $(document).ready( function () {
			 *      $('#example').dataTable( {
			 *        "ordering": false
			 *      } );
			 *    } );
			 */
			"bSort": true,
		
		
			/**
			 * Enable or display DataTables' ability to sort multiple columns at the
			 * same time (activated by shift-click by the user).
			 *  @type boolean
			 *  @default true
			 *
			 *  @dtopt Options
			 *  @name DataTable.defaults.orderMulti
			 *
			 *  @example
			 *    // Disable multiple column sorting ability
			 *    $(document).ready( function () {
			 *      $('#example').dataTable( {
			 *        "orderMulti": false
			 *      } );
			 *    } );
			 */
			"bSortMulti": true,
		
		
			/**
			 * Allows control over whether DataTables should use the top (true) unique
			 * cell that is found for a single column, or the bottom (false - default).
			 * This is useful when using complex headers.
			 *  @type boolean
			 *  @default false
			 *
			 *  @dtopt Options
			 *  @name DataTable.defaults.orderCellsTop
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "orderCellsTop": true
			 *      } );
			 *    } );
			 */
			"bSortCellsTop": false,
		
		
			/**
			 * Enable or disable the addition of the classes `sorting\_1`, `sorting\_2` and
			 * `sorting\_3` to the columns which are currently being sorted on. This is
			 * presented as a feature switch as it can increase processing time (while
			 * classes are removed and added) so for large data sets you might want to
			 * turn this off.
			 *  @type boolean
			 *  @default true
			 *
			 *  @dtopt Features
			 *  @name DataTable.defaults.orderClasses
			 *
			 *  @example
			 *    $(document).ready( function () {
			 *      $('#example').dataTable( {
			 *        "orderClasses": false
			 *      } );
			 *    } );
			 */
			"bSortClasses": true,
		
		
			/**
			 * Enable or disable state saving. When enabled HTML5 `localStorage` will be
			 * used to save table display information such as pagination information,
			 * display length, filtering and sorting. As such when the end user reloads
			 * the page the display display will match what thy had previously set up.
			 *
			 * Due to the use of `localStorage` the default state saving is not supported
			 * in IE6 or 7. If state saving is required in those browsers, use
			 * `stateSaveCallback` to provide a storage solution such as cookies.
			 *  @type boolean
			 *  @default false
			 *
			 *  @dtopt Features
			 *  @name DataTable.defaults.stateSave
			 *
			 *  @example
			 *    $(document).ready( function () {
			 *      $('#example').dataTable( {
			 *        "stateSave": true
			 *      } );
			 *    } );
			 */
			"bStateSave": false,
		
		
			/**
			 * This function is called when a TR element is created (and all TD child
			 * elements have been inserted), or registered if using a DOM source, allowing
			 * manipulation of the TR element (adding classes etc).
			 *  @type function
			 *  @param {node} row "TR" element for the current row
			 *  @param {array} data Raw data array for this row
			 *  @param {int} dataIndex The index of this row in the internal aoData array
			 *
			 *  @dtopt Callbacks
			 *  @name DataTable.defaults.createdRow
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "createdRow": function( row, data, dataIndex ) {
			 *          // Bold the grade for all 'A' grade browsers
			 *          if ( data[4] == "A" )
			 *          {
			 *            $('td:eq(4)', row).html( '<b>A</b>' );
			 *          }
			 *        }
			 *      } );
			 *    } );
			 */
			"fnCreatedRow": null,
		
		
			/**
			 * This function is called on every 'draw' event, and allows you to
			 * dynamically modify any aspect you want about the created DOM.
			 *  @type function
			 *  @param {object} settings DataTables settings object
			 *
			 *  @dtopt Callbacks
			 *  @name DataTable.defaults.drawCallback
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "drawCallback": function( settings ) {
			 *          alert( 'DataTables has redrawn the table' );
			 *        }
			 *      } );
			 *    } );
			 */
			"fnDrawCallback": null,
		
		
			/**
			 * Identical to fnHeaderCallback() but for the table footer this function
			 * allows you to modify the table footer on every 'draw' event.
			 *  @type function
			 *  @param {node} foot "TR" element for the footer
			 *  @param {array} data Full table data (as derived from the original HTML)
			 *  @param {int} start Index for the current display starting point in the
			 *    display array
			 *  @param {int} end Index for the current display ending point in the
			 *    display array
			 *  @param {array int} display Index array to translate the visual position
			 *    to the full data array
			 *
			 *  @dtopt Callbacks
			 *  @name DataTable.defaults.footerCallback
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "footerCallback": function( tfoot, data, start, end, display ) {
			 *          tfoot.getElementsByTagName('th')[0].innerHTML = "Starting index is "+start;
			 *        }
			 *      } );
			 *    } )
			 */
			"fnFooterCallback": null,
		
		
			/**
			 * When rendering large numbers in the information element for the table
			 * (i.e. "Showing 1 to 10 of 57 entries") DataTables will render large numbers
			 * to have a comma separator for the 'thousands' units (e.g. 1 million is
			 * rendered as "1,000,000") to help readability for the end user. This
			 * function will override the default method DataTables uses.
			 *  @type function
			 *  @member
			 *  @param {int} toFormat number to be formatted
			 *  @returns {string} formatted string for DataTables to show the number
			 *
			 *  @dtopt Callbacks
			 *  @name DataTable.defaults.formatNumber
			 *
			 *  @example
			 *    // Format a number using a single quote for the separator (note that
			 *    // this can also be done with the language.thousands option)
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "formatNumber": function ( toFormat ) {
			 *          return toFormat.toString().replace(
			 *            /\B(?=(\d{3})+(?!\d))/g, "'"
			 *          );
			 *        };
			 *      } );
			 *    } );
			 */
			"fnFormatNumber": function ( toFormat ) {
				return toFormat.toString().replace(
					/\B(?=(\d{3})+(?!\d))/g,
					this.oLanguage.sThousands
				);
			},
		
		
			/**
			 * This function is called on every 'draw' event, and allows you to
			 * dynamically modify the header row. This can be used to calculate and
			 * display useful information about the table.
			 *  @type function
			 *  @param {node} head "TR" element for the header
			 *  @param {array} data Full table data (as derived from the original HTML)
			 *  @param {int} start Index for the current display starting point in the
			 *    display array
			 *  @param {int} end Index for the current display ending point in the
			 *    display array
			 *  @param {array int} display Index array to translate the visual position
			 *    to the full data array
			 *
			 *  @dtopt Callbacks
			 *  @name DataTable.defaults.headerCallback
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "fheaderCallback": function( head, data, start, end, display ) {
			 *          head.getElementsByTagName('th')[0].innerHTML = "Displaying "+(end-start)+" records";
			 *        }
			 *      } );
			 *    } )
			 */
			"fnHeaderCallback": null,
		
		
			/**
			 * The information element can be used to convey information about the current
			 * state of the table. Although the internationalisation options presented by
			 * DataTables are quite capable of dealing with most customisations, there may
			 * be times where you wish to customise the string further. This callback
			 * allows you to do exactly that.
			 *  @type function
			 *  @param {object} oSettings DataTables settings object
			 *  @param {int} start Starting position in data for the draw
			 *  @param {int} end End position in data for the draw
			 *  @param {int} max Total number of rows in the table (regardless of
			 *    filtering)
			 *  @param {int} total Total number of rows in the data set, after filtering
			 *  @param {string} pre The string that DataTables has formatted using it's
			 *    own rules
			 *  @returns {string} The string to be displayed in the information element.
			 *
			 *  @dtopt Callbacks
			 *  @name DataTable.defaults.infoCallback
			 *
			 *  @example
			 *    $('#example').dataTable( {
			 *      "infoCallback": function( settings, start, end, max, total, pre ) {
			 *        return start +" to "+ end;
			 *      }
			 *    } );
			 */
			"fnInfoCallback": null,
		
		
			/**
			 * Called when the table has been initialised. Normally DataTables will
			 * initialise sequentially and there will be no need for this function,
			 * however, this does not hold true when using external language information
			 * since that is obtained using an async XHR call.
			 *  @type function
			 *  @param {object} settings DataTables settings object
			 *  @param {object} json The JSON object request from the server - only
			 *    present if client-side Ajax sourced data is used
			 *
			 *  @dtopt Callbacks
			 *  @name DataTable.defaults.initComplete
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "initComplete": function(settings, json) {
			 *          alert( 'DataTables has finished its initialisation.' );
			 *        }
			 *      } );
			 *    } )
			 */
			"fnInitComplete": null,
		
		
			/**
			 * Called at the very start of each table draw and can be used to cancel the
			 * draw by returning false, any other return (including undefined) results in
			 * the full draw occurring).
			 *  @type function
			 *  @param {object} settings DataTables settings object
			 *  @returns {boolean} False will cancel the draw, anything else (including no
			 *    return) will allow it to complete.
			 *
			 *  @dtopt Callbacks
			 *  @name DataTable.defaults.preDrawCallback
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "preDrawCallback": function( settings ) {
			 *          if ( $('#test').val() == 1 ) {
			 *            return false;
			 *          }
			 *        }
			 *      } );
			 *    } );
			 */
			"fnPreDrawCallback": null,
		
		
			/**
			 * This function allows you to 'post process' each row after it have been
			 * generated for each table draw, but before it is rendered on screen. This
			 * function might be used for setting the row class name etc.
			 *  @type function
			 *  @param {node} row "TR" element for the current row
			 *  @param {array} data Raw data array for this row
			 *  @param {int} displayIndex The display index for the current table draw
			 *  @param {int} displayIndexFull The index of the data in the full list of
			 *    rows (after filtering)
			 *
			 *  @dtopt Callbacks
			 *  @name DataTable.defaults.rowCallback
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "rowCallback": function( row, data, displayIndex, displayIndexFull ) {
			 *          // Bold the grade for all 'A' grade browsers
			 *          if ( data[4] == "A" ) {
			 *            $('td:eq(4)', row).html( '<b>A</b>' );
			 *          }
			 *        }
			 *      } );
			 *    } );
			 */
			"fnRowCallback": null,
		
		
			/**
			 * __Deprecated__ The functionality provided by this parameter has now been
			 * superseded by that provided through `ajax`, which should be used instead.
			 *
			 * This parameter allows you to override the default function which obtains
			 * the data from the server so something more suitable for your application.
			 * For example you could use POST data, or pull information from a Gears or
			 * AIR database.
			 *  @type function
			 *  @member
			 *  @param {string} source HTTP source to obtain the data from (`ajax`)
			 *  @param {array} data A key/value pair object containing the data to send
			 *    to the server
			 *  @param {function} callback to be called on completion of the data get
			 *    process that will draw the data on the page.
			 *  @param {object} settings DataTables settings object
			 *
			 *  @dtopt Callbacks
			 *  @dtopt Server-side
			 *  @name DataTable.defaults.serverData
			 *
			 *  @deprecated 1.10. Please use `ajax` for this functionality now.
			 */
			"fnServerData": null,
		
		
			/**
			 * __Deprecated__ The functionality provided by this parameter has now been
			 * superseded by that provided through `ajax`, which should be used instead.
			 *
			 *  It is often useful to send extra data to the server when making an Ajax
			 * request - for example custom filtering information, and this callback
			 * function makes it trivial to send extra information to the server. The
			 * passed in parameter is the data set that has been constructed by
			 * DataTables, and you can add to this or modify it as you require.
			 *  @type function
			 *  @param {array} data Data array (array of objects which are name/value
			 *    pairs) that has been constructed by DataTables and will be sent to the
			 *    server. In the case of Ajax sourced data with server-side processing
			 *    this will be an empty array, for server-side processing there will be a
			 *    significant number of parameters!
			 *  @returns {undefined} Ensure that you modify the data array passed in,
			 *    as this is passed by reference.
			 *
			 *  @dtopt Callbacks
			 *  @dtopt Server-side
			 *  @name DataTable.defaults.serverParams
			 *
			 *  @deprecated 1.10. Please use `ajax` for this functionality now.
			 */
			"fnServerParams": null,
		
		
			/**
			 * Load the table state. With this function you can define from where, and how, the
			 * state of a table is loaded. By default DataTables will load from `localStorage`
			 * but you might wish to use a server-side database or cookies.
			 *  @type function
			 *  @member
			 *  @param {object} settings DataTables settings object
			 *  @param {object} callback Callback that can be executed when done. It
			 *    should be passed the loaded state object.
			 *  @return {object} The DataTables state object to be loaded
			 *
			 *  @dtopt Callbacks
			 *  @name DataTable.defaults.stateLoadCallback
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "stateSave": true,
			 *        "stateLoadCallback": function (settings, callback) {
			 *          $.ajax( {
			 *            "url": "/state_load",
			 *            "dataType": "json",
			 *            "success": function (json) {
			 *              callback( json );
			 *            }
			 *          } );
			 *        }
			 *      } );
			 *    } );
			 */
			"fnStateLoadCallback": function ( settings ) {
				try {
					return JSON.parse(
						(settings.iStateDuration === -1 ? sessionStorage : localStorage).getItem(
							'DataTables_'+settings.sInstance+'_'+location.pathname
						)
					);
				} catch (e) {
					return {};
				}
			},
		
		
			/**
			 * Callback which allows modification of the saved state prior to loading that state.
			 * This callback is called when the table is loading state from the stored data, but
			 * prior to the settings object being modified by the saved state. Note that for
			 * plug-in authors, you should use the `stateLoadParams` event to load parameters for
			 * a plug-in.
			 *  @type function
			 *  @param {object} settings DataTables settings object
			 *  @param {object} data The state object that is to be loaded
			 *
			 *  @dtopt Callbacks
			 *  @name DataTable.defaults.stateLoadParams
			 *
			 *  @example
			 *    // Remove a saved filter, so filtering is never loaded
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "stateSave": true,
			 *        "stateLoadParams": function (settings, data) {
			 *          data.oSearch.sSearch = "";
			 *        }
			 *      } );
			 *    } );
			 *
			 *  @example
			 *    // Disallow state loading by returning false
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "stateSave": true,
			 *        "stateLoadParams": function (settings, data) {
			 *          return false;
			 *        }
			 *      } );
			 *    } );
			 */
			"fnStateLoadParams": null,
		
		
			/**
			 * Callback that is called when the state has been loaded from the state saving method
			 * and the DataTables settings object has been modified as a result of the loaded state.
			 *  @type function
			 *  @param {object} settings DataTables settings object
			 *  @param {object} data The state object that was loaded
			 *
			 *  @dtopt Callbacks
			 *  @name DataTable.defaults.stateLoaded
			 *
			 *  @example
			 *    // Show an alert with the filtering value that was saved
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "stateSave": true,
			 *        "stateLoaded": function (settings, data) {
			 *          alert( 'Saved filter was: '+data.oSearch.sSearch );
			 *        }
			 *      } );
			 *    } );
			 */
			"fnStateLoaded": null,
		
		
			/**
			 * Save the table state. This function allows you to define where and how the state
			 * information for the table is stored By default DataTables will use `localStorage`
			 * but you might wish to use a server-side database or cookies.
			 *  @type function
			 *  @member
			 *  @param {object} settings DataTables settings object
			 *  @param {object} data The state object to be saved
			 *
			 *  @dtopt Callbacks
			 *  @name DataTable.defaults.stateSaveCallback
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "stateSave": true,
			 *        "stateSaveCallback": function (settings, data) {
			 *          // Send an Ajax request to the server with the state object
			 *          $.ajax( {
			 *            "url": "/state_save",
			 *            "data": data,
			 *            "dataType": "json",
			 *            "method": "POST"
			 *            "success": function () {}
			 *          } );
			 *        }
			 *      } );
			 *    } );
			 */
			"fnStateSaveCallback": function ( settings, data ) {
				try {
					(settings.iStateDuration === -1 ? sessionStorage : localStorage).setItem(
						'DataTables_'+settings.sInstance+'_'+location.pathname,
						JSON.stringify( data )
					);
				} catch (e) {}
			},
		
		
			/**
			 * Callback which allows modification of the state to be saved. Called when the table
			 * has changed state a new state save is required. This method allows modification of
			 * the state saving object prior to actually doing the save, including addition or
			 * other state properties or modification. Note that for plug-in authors, you should
			 * use the `stateSaveParams` event to save parameters for a plug-in.
			 *  @type function
			 *  @param {object} settings DataTables settings object
			 *  @param {object} data The state object to be saved
			 *
			 *  @dtopt Callbacks
			 *  @name DataTable.defaults.stateSaveParams
			 *
			 *  @example
			 *    // Remove a saved filter, so filtering is never saved
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "stateSave": true,
			 *        "stateSaveParams": function (settings, data) {
			 *          data.oSearch.sSearch = "";
			 *        }
			 *      } );
			 *    } );
			 */
			"fnStateSaveParams": null,
		
		
			/**
			 * Duration for which the saved state information is considered valid. After this period
			 * has elapsed the state will be returned to the default.
			 * Value is given in seconds.
			 *  @type int
			 *  @default 7200 <i>(2 hours)</i>
			 *
			 *  @dtopt Options
			 *  @name DataTable.defaults.stateDuration
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "stateDuration": 60*60*24; // 1 day
			 *      } );
			 *    } )
			 */
			"iStateDuration": 7200,
		
		
			/**
			 * When enabled DataTables will not make a request to the server for the first
			 * page draw - rather it will use the data already on the page (no sorting etc
			 * will be applied to it), thus saving on an XHR at load time. `deferLoading`
			 * is used to indicate that deferred loading is required, but it is also used
			 * to tell DataTables how many records there are in the full table (allowing
			 * the information element and pagination to be displayed correctly). In the case
			 * where a filtering is applied to the table on initial load, this can be
			 * indicated by giving the parameter as an array, where the first element is
			 * the number of records available after filtering and the second element is the
			 * number of records without filtering (allowing the table information element
			 * to be shown correctly).
			 *  @type int | array
			 *  @default null
			 *
			 *  @dtopt Options
			 *  @name DataTable.defaults.deferLoading
			 *
			 *  @example
			 *    // 57 records available in the table, no filtering applied
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "serverSide": true,
			 *        "ajax": "scripts/server_processing.php",
			 *        "deferLoading": 57
			 *      } );
			 *    } );
			 *
			 *  @example
			 *    // 57 records after filtering, 100 without filtering (an initial filter applied)
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "serverSide": true,
			 *        "ajax": "scripts/server_processing.php",
			 *        "deferLoading": [ 57, 100 ],
			 *        "search": {
			 *          "search": "my_filter"
			 *        }
			 *      } );
			 *    } );
			 */
			"iDeferLoading": null,
		
		
			/**
			 * Number of rows to display on a single page when using pagination. If
			 * feature enabled (`lengthChange`) then the end user will be able to override
			 * this to a custom setting using a pop-up menu.
			 *  @type int
			 *  @default 10
			 *
			 *  @dtopt Options
			 *  @name DataTable.defaults.pageLength
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "pageLength": 50
			 *      } );
			 *    } )
			 */
			"iDisplayLength": 10,
		
		
			/**
			 * Define the starting point for data display when using DataTables with
			 * pagination. Note that this parameter is the number of records, rather than
			 * the page number, so if you have 10 records per page and want to start on
			 * the third page, it should be "20".
			 *  @type int
			 *  @default 0
			 *
			 *  @dtopt Options
			 *  @name DataTable.defaults.displayStart
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "displayStart": 20
			 *      } );
			 *    } )
			 */
			"iDisplayStart": 0,
		
		
			/**
			 * By default DataTables allows keyboard navigation of the table (sorting, paging,
			 * and filtering) by adding a `tabindex` attribute to the required elements. This
			 * allows you to tab through the controls and press the enter key to activate them.
			 * The tabindex is default 0, meaning that the tab follows the flow of the document.
			 * You can overrule this using this parameter if you wish. Use a value of -1 to
			 * disable built-in keyboard navigation.
			 *  @type int
			 *  @default 0
			 *
			 *  @dtopt Options
			 *  @name DataTable.defaults.tabIndex
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "tabIndex": 1
			 *      } );
			 *    } );
			 */
			"iTabIndex": 0,
		
		
			/**
			 * Classes that DataTables assigns to the various components and features
			 * that it adds to the HTML table. This allows classes to be configured
			 * during initialisation in addition to through the static
			 * {@link DataTable.ext.oStdClasses} object).
			 *  @namespace
			 *  @name DataTable.defaults.classes
			 */
			"oClasses": {},
		
		
			/**
			 * All strings that DataTables uses in the user interface that it creates
			 * are defined in this object, allowing you to modified them individually or
			 * completely replace them all as required.
			 *  @namespace
			 *  @name DataTable.defaults.language
			 */
			"oLanguage": {
				/**
				 * Strings that are used for WAI-ARIA labels and controls only (these are not
				 * actually visible on the page, but will be read by screenreaders, and thus
				 * must be internationalised as well).
				 *  @namespace
				 *  @name DataTable.defaults.language.aria
				 */
				"oAria": {
					/**
					 * ARIA label that is added to the table headers when the column may be
					 * sorted ascending by activing the column (click or return when focused).
					 * Note that the column header is prefixed to this string.
					 *  @type string
					 *  @default : activate to sort column ascending
					 *
					 *  @dtopt Language
					 *  @name DataTable.defaults.language.aria.sortAscending
					 *
					 *  @example
					 *    $(document).ready( function() {
					 *      $('#example').dataTable( {
					 *        "language": {
					 *          "aria": {
					 *            "sortAscending": " - click/return to sort ascending"
					 *          }
					 *        }
					 *      } );
					 *    } );
					 */
					"sSortAscending": ": activate to sort column ascending",
		
					/**
					 * ARIA label that is added to the table headers when the column may be
					 * sorted descending by activing the column (click or return when focused).
					 * Note that the column header is prefixed to this string.
					 *  @type string
					 *  @default : activate to sort column ascending
					 *
					 *  @dtopt Language
					 *  @name DataTable.defaults.language.aria.sortDescending
					 *
					 *  @example
					 *    $(document).ready( function() {
					 *      $('#example').dataTable( {
					 *        "language": {
					 *          "aria": {
					 *            "sortDescending": " - click/return to sort descending"
					 *          }
					 *        }
					 *      } );
					 *    } );
					 */
					"sSortDescending": ": activate to sort column descending"
				},
		
				/**
				 * Pagination string used by DataTables for the built-in pagination
				 * control types.
				 *  @namespace
				 *  @name DataTable.defaults.language.paginate
				 */
				"oPaginate": {
					/**
					 * Text to use when using the 'full_numbers' type of pagination for the
					 * button to take the user to the first page.
					 *  @type string
					 *  @default First
					 *
					 *  @dtopt Language
					 *  @name DataTable.defaults.language.paginate.first
					 *
					 *  @example
					 *    $(document).ready( function() {
					 *      $('#example').dataTable( {
					 *        "language": {
					 *          "paginate": {
					 *            "first": "First page"
					 *          }
					 *        }
					 *      } );
					 *    } );
					 */
					"sFirst": "First",
		
		
					/**
					 * Text to use when using the 'full_numbers' type of pagination for the
					 * button to take the user to the last page.
					 *  @type string
					 *  @default Last
					 *
					 *  @dtopt Language
					 *  @name DataTable.defaults.language.paginate.last
					 *
					 *  @example
					 *    $(document).ready( function() {
					 *      $('#example').dataTable( {
					 *        "language": {
					 *          "paginate": {
					 *            "last": "Last page"
					 *          }
					 *        }
					 *      } );
					 *    } );
					 */
					"sLast": "Last",
		
		
					/**
					 * Text to use for the 'next' pagination button (to take the user to the
					 * next page).
					 *  @type string
					 *  @default Next
					 *
					 *  @dtopt Language
					 *  @name DataTable.defaults.language.paginate.next
					 *
					 *  @example
					 *    $(document).ready( function() {
					 *      $('#example').dataTable( {
					 *        "language": {
					 *          "paginate": {
					 *            "next": "Next page"
					 *          }
					 *        }
					 *      } );
					 *    } );
					 */
					"sNext": "Next",
		
		
					/**
					 * Text to use for the 'previous' pagination button (to take the user to
					 * the previous page).
					 *  @type string
					 *  @default Previous
					 *
					 *  @dtopt Language
					 *  @name DataTable.defaults.language.paginate.previous
					 *
					 *  @example
					 *    $(document).ready( function() {
					 *      $('#example').dataTable( {
					 *        "language": {
					 *          "paginate": {
					 *            "previous": "Previous page"
					 *          }
					 *        }
					 *      } );
					 *    } );
					 */
					"sPrevious": "Previous"
				},
		
				/**
				 * This string is shown in preference to `zeroRecords` when the table is
				 * empty of data (regardless of filtering). Note that this is an optional
				 * parameter - if it is not given, the value of `zeroRecords` will be used
				 * instead (either the default or given value).
				 *  @type string
				 *  @default No data available in table
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.emptyTable
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "emptyTable": "No data available in table"
				 *        }
				 *      } );
				 *    } );
				 */
				"sEmptyTable": "No data available in table",
		
		
				/**
				 * This string gives information to the end user about the information
				 * that is current on display on the page. The following tokens can be
				 * used in the string and will be dynamically replaced as the table
				 * display updates. This tokens can be placed anywhere in the string, or
				 * removed as needed by the language requires:
				 *
				 * * `\_START\_` - Display index of the first record on the current page
				 * * `\_END\_` - Display index of the last record on the current page
				 * * `\_TOTAL\_` - Number of records in the table after filtering
				 * * `\_MAX\_` - Number of records in the table without filtering
				 * * `\_PAGE\_` - Current page number
				 * * `\_PAGES\_` - Total number of pages of data in the table
				 *
				 *  @type string
				 *  @default Showing _START_ to _END_ of _TOTAL_ entries
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.info
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "info": "Showing page _PAGE_ of _PAGES_"
				 *        }
				 *      } );
				 *    } );
				 */
				"sInfo": "Showing _START_ to _END_ of _TOTAL_ entries",
		
		
				/**
				 * Display information string for when the table is empty. Typically the
				 * format of this string should match `info`.
				 *  @type string
				 *  @default Showing 0 to 0 of 0 entries
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.infoEmpty
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "infoEmpty": "No entries to show"
				 *        }
				 *      } );
				 *    } );
				 */
				"sInfoEmpty": "Showing 0 to 0 of 0 entries",
		
		
				/**
				 * When a user filters the information in a table, this string is appended
				 * to the information (`info`) to give an idea of how strong the filtering
				 * is. The variable _MAX_ is dynamically updated.
				 *  @type string
				 *  @default (filtered from _MAX_ total entries)
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.infoFiltered
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "infoFiltered": " - filtering from _MAX_ records"
				 *        }
				 *      } );
				 *    } );
				 */
				"sInfoFiltered": "(filtered from _MAX_ total entries)",
		
		
				/**
				 * If can be useful to append extra information to the info string at times,
				 * and this variable does exactly that. This information will be appended to
				 * the `info` (`infoEmpty` and `infoFiltered` in whatever combination they are
				 * being used) at all times.
				 *  @type string
				 *  @default <i>Empty string</i>
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.infoPostFix
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "infoPostFix": "All records shown are derived from real information."
				 *        }
				 *      } );
				 *    } );
				 */
				"sInfoPostFix": "",
		
		
				/**
				 * This decimal place operator is a little different from the other
				 * language options since DataTables doesn't output floating point
				 * numbers, so it won't ever use this for display of a number. Rather,
				 * what this parameter does is modify the sort methods of the table so
				 * that numbers which are in a format which has a character other than
				 * a period (`.`) as a decimal place will be sorted numerically.
				 *
				 * Note that numbers with different decimal places cannot be shown in
				 * the same table and still be sortable, the table must be consistent.
				 * However, multiple different tables on the page can use different
				 * decimal place characters.
				 *  @type string
				 *  @default 
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.decimal
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "decimal": ","
				 *          "thousands": "."
				 *        }
				 *      } );
				 *    } );
				 */
				"sDecimal": "",
		
		
				/**
				 * DataTables has a build in number formatter (`formatNumber`) which is
				 * used to format large numbers that are used in the table information.
				 * By default a comma is used, but this can be trivially changed to any
				 * character you wish with this parameter.
				 *  @type string
				 *  @default ,
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.thousands
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "thousands": "'"
				 *        }
				 *      } );
				 *    } );
				 */
				"sThousands": ",",
		
		
				/**
				 * Detail the action that will be taken when the drop down menu for the
				 * pagination length option is changed. The '_MENU_' variable is replaced
				 * with a default select list of 10, 25, 50 and 100, and can be replaced
				 * with a custom select box if required.
				 *  @type string
				 *  @default Show _MENU_ entries
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.lengthMenu
				 *
				 *  @example
				 *    // Language change only
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "lengthMenu": "Display _MENU_ records"
				 *        }
				 *      } );
				 *    } );
				 *
				 *  @example
				 *    // Language and options change
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "lengthMenu": 'Display <select>'+
				 *            '<option value="10">10</option>'+
				 *            '<option value="20">20</option>'+
				 *            '<option value="30">30</option>'+
				 *            '<option value="40">40</option>'+
				 *            '<option value="50">50</option>'+
				 *            '<option value="-1">All</option>'+
				 *            '</select> records'
				 *        }
				 *      } );
				 *    } );
				 */
				"sLengthMenu": "Show _MENU_ entries",
		
		
				/**
				 * When using Ajax sourced data and during the first draw when DataTables is
				 * gathering the data, this message is shown in an empty row in the table to
				 * indicate to the end user the the data is being loaded. Note that this
				 * parameter is not used when loading data by server-side processing, just
				 * Ajax sourced data with client-side processing.
				 *  @type string
				 *  @default Loading...
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.loadingRecords
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "loadingRecords": "Please wait - loading..."
				 *        }
				 *      } );
				 *    } );
				 */
				"sLoadingRecords": "Loading...",
		
		
				/**
				 * Text which is displayed when the table is processing a user action
				 * (usually a sort command or similar).
				 *  @type string
				 *  @default Processing...
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.processing
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "processing": "DataTables is currently busy"
				 *        }
				 *      } );
				 *    } );
				 */
				"sProcessing": "Processing...",
		
		
				/**
				 * Details the actions that will be taken when the user types into the
				 * filtering input text box. The variable "_INPUT_", if used in the string,
				 * is replaced with the HTML text box for the filtering input allowing
				 * control over where it appears in the string. If "_INPUT_" is not given
				 * then the input box is appended to the string automatically.
				 *  @type string
				 *  @default Search:
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.search
				 *
				 *  @example
				 *    // Input text box will be appended at the end automatically
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "search": "Filter records:"
				 *        }
				 *      } );
				 *    } );
				 *
				 *  @example
				 *    // Specify where the filter should appear
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "search": "Apply filter _INPUT_ to table"
				 *        }
				 *      } );
				 *    } );
				 */
				"sSearch": "Search:",
		
		
				/**
				 * Assign a `placeholder` attribute to the search `input` element
				 *  @type string
				 *  @default 
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.searchPlaceholder
				 */
				"sSearchPlaceholder": "",
		
		
				/**
				 * All of the language information can be stored in a file on the
				 * server-side, which DataTables will look up if this parameter is passed.
				 * It must store the URL of the language file, which is in a JSON format,
				 * and the object has the same properties as the oLanguage object in the
				 * initialiser object (i.e. the above parameters). Please refer to one of
				 * the example language files to see how this works in action.
				 *  @type string
				 *  @default <i>Empty string - i.e. disabled</i>
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.url
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "url": "http://www.sprymedia.co.uk/dataTables/lang.txt"
				 *        }
				 *      } );
				 *    } );
				 */
				"sUrl": "",
		
		
				/**
				 * Text shown inside the table records when the is no information to be
				 * displayed after filtering. `emptyTable` is shown when there is simply no
				 * information in the table at all (regardless of filtering).
				 *  @type string
				 *  @default No matching records found
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.zeroRecords
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "zeroRecords": "No records to display"
				 *        }
				 *      } );
				 *    } );
				 */
				"sZeroRecords": "No matching records found"
			},
		
		
			/**
			 * This parameter allows you to have define the global filtering state at
			 * initialisation time. As an object the `search` parameter must be
			 * defined, but all other parameters are optional. When `regex` is true,
			 * the search string will be treated as a regular expression, when false
			 * (default) it will be treated as a straight string. When `smart`
			 * DataTables will use it's smart filtering methods (to word match at
			 * any point in the data), when false this will not be done.
			 *  @namespace
			 *  @extends DataTable.models.oSearch
			 *
			 *  @dtopt Options
			 *  @name DataTable.defaults.search
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "search": {"search": "Initial search"}
			 *      } );
			 *    } )
			 */
			"oSearch": $.extend( {}, DataTable.models.oSearch ),
		
		
			/**
			 * __Deprecated__ The functionality provided by this parameter has now been
			 * superseded by that provided through `ajax`, which should be used instead.
			 *
			 * By default DataTables will look for the property `data` (or `aaData` for
			 * compatibility with DataTables 1.9-) when obtaining data from an Ajax
			 * source or for server-side processing - this parameter allows that
			 * property to be changed. You can use Javascript dotted object notation to
			 * get a data source for multiple levels of nesting.
			 *  @type string
			 *  @default data
			 *
			 *  @dtopt Options
			 *  @dtopt Server-side
			 *  @name DataTable.defaults.ajaxDataProp
			 *
			 *  @deprecated 1.10. Please use `ajax` for this functionality now.
			 */
			"sAjaxDataProp": "data",
		
		
			/**
			 * __Deprecated__ The functionality provided by this parameter has now been
			 * superseded by that provided through `ajax`, which should be used instead.
			 *
			 * You can instruct DataTables to load data from an external
			 * source using this parameter (use aData if you want to pass data in you
			 * already have). Simply provide a url a JSON object can be obtained from.
			 *  @type string
			 *  @default null
			 *
			 *  @dtopt Options
			 *  @dtopt Server-side
			 *  @name DataTable.defaults.ajaxSource
			 *
			 *  @deprecated 1.10. Please use `ajax` for this functionality now.
			 */
			"sAjaxSource": null,
		
		
			/**
			 * This initialisation variable allows you to specify exactly where in the
			 * DOM you want DataTables to inject the various controls it adds to the page
			 * (for example you might want the pagination controls at the top of the
			 * table). DIV elements (with or without a custom class) can also be added to
			 * aid styling. The follow syntax is used:
			 *   <ul>
			 *     <li>The following options are allowed:
			 *       <ul>
			 *         <li>'l' - Length changing</li>
			 *         <li>'f' - Filtering input</li>
			 *         <li>'t' - The table!</li>
			 *         <li>'i' - Information</li>
			 *         <li>'p' - Pagination</li>
			 *         <li>'r' - pRocessing</li>
			 *       </ul>
			 *     </li>
			 *     <li>The following constants are allowed:
			 *       <ul>
			 *         <li>'H' - jQueryUI theme "header" classes ('fg-toolbar ui-widget-header ui-corner-tl ui-corner-tr ui-helper-clearfix')</li>
			 *         <li>'F' - jQueryUI theme "footer" classes ('fg-toolbar ui-widget-header ui-corner-bl ui-corner-br ui-helper-clearfix')</li>
			 *       </ul>
			 *     </li>
			 *     <li>The following syntax is expected:
			 *       <ul>
			 *         <li>'&lt;' and '&gt;' - div elements</li>
			 *         <li>'&lt;"class" and '&gt;' - div with a class</li>
			 *         <li>'&lt;"#id" and '&gt;' - div with an ID</li>
			 *       </ul>
			 *     </li>
			 *     <li>Examples:
			 *       <ul>
			 *         <li>'&lt;"wrapper"flipt&gt;'</li>
			 *         <li>'&lt;lf&lt;t&gt;ip&gt;'</li>
			 *       </ul>
			 *     </li>
			 *   </ul>
			 *  @type string
			 *  @default lfrtip <i>(when `jQueryUI` is false)</i> <b>or</b>
			 *    <"H"lfr>t<"F"ip> <i>(when `jQueryUI` is true)</i>
			 *
			 *  @dtopt Options
			 *  @name DataTable.defaults.dom
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "dom": '&lt;"top"i&gt;rt&lt;"bottom"flp&gt;&lt;"clear"&gt;'
			 *      } );
			 *    } );
			 */
			"sDom": "lfrtip",
		
		
			/**
			 * Search delay option. This will throttle full table searches that use the
			 * DataTables provided search input element (it does not effect calls to
			 * `dt-api search()`, providing a delay before the search is made.
			 *  @type integer
			 *  @default 0
			 *
			 *  @dtopt Options
			 *  @name DataTable.defaults.searchDelay
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "searchDelay": 200
			 *      } );
			 *    } )
			 */
			"searchDelay": null,
		
		
			/**
			 * DataTables features six different built-in options for the buttons to
			 * display for pagination control:
			 *
			 * * `numbers` - Page number buttons only
			 * * `simple` - 'Previous' and 'Next' buttons only
			 * * 'simple_numbers` - 'Previous' and 'Next' buttons, plus page numbers
			 * * `full` - 'First', 'Previous', 'Next' and 'Last' buttons
			 * * `full_numbers` - 'First', 'Previous', 'Next' and 'Last' buttons, plus page numbers
			 * * `first_last_numbers` - 'First' and 'Last' buttons, plus page numbers
			 *  
			 * Further methods can be added using {@link DataTable.ext.oPagination}.
			 *  @type string
			 *  @default simple_numbers
			 *
			 *  @dtopt Options
			 *  @name DataTable.defaults.pagingType
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "pagingType": "full_numbers"
			 *      } );
			 *    } )
			 */
			"sPaginationType": "simple_numbers",
		
		
			/**
			 * Enable horizontal scrolling. When a table is too wide to fit into a
			 * certain layout, or you have a large number of columns in the table, you
			 * can enable x-scrolling to show the table in a viewport, which can be
			 * scrolled. This property can be `true` which will allow the table to
			 * scroll horizontally when needed, or any CSS unit, or a number (in which
			 * case it will be treated as a pixel measurement). Setting as simply `true`
			 * is recommended.
			 *  @type boolean|string
			 *  @default <i>blank string - i.e. disabled</i>
			 *
			 *  @dtopt Features
			 *  @name DataTable.defaults.scrollX
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "scrollX": true,
			 *        "scrollCollapse": true
			 *      } );
			 *    } );
			 */
			"sScrollX": "",
		
		
			/**
			 * This property can be used to force a DataTable to use more width than it
			 * might otherwise do when x-scrolling is enabled. For example if you have a
			 * table which requires to be well spaced, this parameter is useful for
			 * "over-sizing" the table, and thus forcing scrolling. This property can by
			 * any CSS unit, or a number (in which case it will be treated as a pixel
			 * measurement).
			 *  @type string
			 *  @default <i>blank string - i.e. disabled</i>
			 *
			 *  @dtopt Options
			 *  @name DataTable.defaults.scrollXInner
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "scrollX": "100%",
			 *        "scrollXInner": "110%"
			 *      } );
			 *    } );
			 */
			"sScrollXInner": "",
		
		
			/**
			 * Enable vertical scrolling. Vertical scrolling will constrain the DataTable
			 * to the given height, and enable scrolling for any data which overflows the
			 * current viewport. This can be used as an alternative to paging to display
			 * a lot of data in a small area (although paging and scrolling can both be
			 * enabled at the same time). This property can be any CSS unit, or a number
			 * (in which case it will be treated as a pixel measurement).
			 *  @type string
			 *  @default <i>blank string - i.e. disabled</i>
			 *
			 *  @dtopt Features
			 *  @name DataTable.defaults.scrollY
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "scrollY": "200px",
			 *        "paginate": false
			 *      } );
			 *    } );
			 */
			"sScrollY": "",
		
		
			/**
			 * __Deprecated__ The functionality provided by this parameter has now been
			 * superseded by that provided through `ajax`, which should be used instead.
			 *
			 * Set the HTTP method that is used to make the Ajax call for server-side
			 * processing or Ajax sourced data.
			 *  @type string
			 *  @default GET
			 *
			 *  @dtopt Options
			 *  @dtopt Server-side
			 *  @name DataTable.defaults.serverMethod
			 *
			 *  @deprecated 1.10. Please use `ajax` for this functionality now.
			 */
			"sServerMethod": "GET",
		
		
			/**
			 * DataTables makes use of renderers when displaying HTML elements for
			 * a table. These renderers can be added or modified by plug-ins to
			 * generate suitable mark-up for a site. For example the Bootstrap
			 * integration plug-in for DataTables uses a paging button renderer to
			 * display pagination buttons in the mark-up required by Bootstrap.
			 *
			 * For further information about the renderers available see
			 * DataTable.ext.renderer
			 *  @type string|object
			 *  @default null
			 *
			 *  @name DataTable.defaults.renderer
			 *
			 */
			"renderer": null,
		
		
			/**
			 * Set the data property name that DataTables should use to get a row's id
			 * to set as the `id` property in the node.
			 *  @type string
			 *  @default DT_RowId
			 *
			 *  @name DataTable.defaults.rowId
			 */
			"rowId": "DT_RowId"
		};
		
		_fnHungarianMap( DataTable.defaults );
		
		
		
		/*
		 * Developer note - See note in model.defaults.js about the use of Hungarian
		 * notation and camel case.
		 */
		
		/**
		 * Column options that can be given to DataTables at initialisation time.
		 *  @namespace
		 */
		DataTable.defaults.column = {
			/**
			 * Define which column(s) an order will occur on for this column. This
			 * allows a column's ordering to take multiple columns into account when
			 * doing a sort or use the data from a different column. For example first
			 * name / last name columns make sense to do a multi-column sort over the
			 * two columns.
			 *  @type array|int
			 *  @default null <i>Takes the value of the column index automatically</i>
			 *
			 *  @name DataTable.defaults.column.orderData
			 *  @dtopt Columns
			 *
			 *  @example
			 *    // Using `columnDefs`
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "columnDefs": [
			 *          { "orderData": [ 0, 1 ], "targets": [ 0 ] },
			 *          { "orderData": [ 1, 0 ], "targets": [ 1 ] },
			 *          { "orderData": 2, "targets": [ 2 ] }
			 *        ]
			 *      } );
			 *    } );
			 *
			 *  @example
			 *    // Using `columns`
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "columns": [
			 *          { "orderData": [ 0, 1 ] },
			 *          { "orderData": [ 1, 0 ] },
			 *          { "orderData": 2 },
			 *          null,
			 *          null
			 *        ]
			 *      } );
			 *    } );
			 */
			"aDataSort": null,
			"iDataSort": -1,
		
		
			/**
			 * You can control the default ordering direction, and even alter the
			 * behaviour of the sort handler (i.e. only allow ascending ordering etc)
			 * using this parameter.
			 *  @type array
			 *  @default [ 'asc', 'desc' ]
			 *
			 *  @name DataTable.defaults.column.orderSequence
			 *  @dtopt Columns
			 *
			 *  @example
			 *    // Using `columnDefs`
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "columnDefs": [
			 *          { "orderSequence": [ "asc" ], "targets": [ 1 ] },
			 *          { "orderSequence": [ "desc", "asc", "asc" ], "targets": [ 2 ] },
			 *          { "orderSequence": [ "desc" ], "targets": [ 3 ] }
			 *        ]
			 *      } );
			 *    } );
			 *
			 *  @example
			 *    // Using `columns`
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "columns": [
			 *          null,
			 *          { "orderSequence": [ "asc" ] },
			 *          { "orderSequence": [ "desc", "asc", "asc" ] },
			 *          { "orderSequence": [ "desc" ] },
			 *          null
			 *        ]
			 *      } );
			 *    } );
			 */
			"asSorting": [ 'asc', 'desc' ],
		
		
			/**
			 * Enable or disable filtering on the data in this column.
			 *  @type boolean
			 *  @default true
			 *
			 *  @name DataTable.defaults.column.searchable
			 *  @dtopt Columns
			 *
			 *  @example
			 *    // Using `columnDefs`
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "columnDefs": [
			 *          { "searchable": false, "targets": [ 0 ] }
			 *        ] } );
			 *    } );
			 *
			 *  @example
			 *    // Using `columns`
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "columns": [
			 *          { "searchable": false },
			 *          null,
			 *          null,
			 *          null,
			 *          null
			 *        ] } );
			 *    } );
			 */
			"bSearchable": true,
		
		
			/**
			 * Enable or disable ordering on this column.
			 *  @type boolean
			 *  @default true
			 *
			 *  @name DataTable.defaults.column.orderable
			 *  @dtopt Columns
			 *
			 *  @example
			 *    // Using `columnDefs`
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "columnDefs": [
			 *          { "orderable": false, "targets": [ 0 ] }
			 *        ] } );
			 *    } );
			 *
			 *  @example
			 *    // Using `columns`
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "columns": [
			 *          { "orderable": false },
			 *          null,
			 *          null,
			 *          null,
			 *          null
			 *        ] } );
			 *    } );
			 */
			"bSortable": true,
		
		
			/**
			 * Enable or disable the display of this column.
			 *  @type boolean
			 *  @default true
			 *
			 *  @name DataTable.defaults.column.visible
			 *  @dtopt Columns
			 *
			 *  @example
			 *    // Using `columnDefs`
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "columnDefs": [
			 *          { "visible": false, "targets": [ 0 ] }
			 *        ] } );
			 *    } );
			 *
			 *  @example
			 *    // Using `columns`
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "columns": [
			 *          { "visible": false },
			 *          null,
			 *          null,
			 *          null,
			 *          null
			 *        ] } );
			 *    } );
			 */
			"bVisible": true,
		
		
			/**
			 * Developer definable function that is called whenever a cell is created (Ajax source,
			 * etc) or processed for input (DOM source). This can be used as a compliment to mRender
			 * allowing you to modify the DOM element (add background colour for example) when the
			 * element is available.
			 *  @type function
			 *  @param {element} td The TD node that has been created
			 *  @param {*} cellData The Data for the cell
			 *  @param {array|object} rowData The data for the whole row
			 *  @param {int} row The row index for the aoData data store
			 *  @param {int} col The column index for aoColumns
			 *
			 *  @name DataTable.defaults.column.createdCell
			 *  @dtopt Columns
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "columnDefs": [ {
			 *          "targets": [3],
			 *          "createdCell": function (td, cellData, rowData, row, col) {
			 *            if ( cellData == "1.7" ) {
			 *              $(td).css('color', 'blue')
			 *            }
			 *          }
			 *        } ]
			 *      });
			 *    } );
			 */
			"fnCreatedCell": null,
		
		
			/**
			 * This parameter has been replaced by `data` in DataTables to ensure naming
			 * consistency. `dataProp` can still be used, as there is backwards
			 * compatibility in DataTables for this option, but it is strongly
			 * recommended that you use `data` in preference to `dataProp`.
			 *  @name DataTable.defaults.column.dataProp
			 */
		
		
			/**
			 * This property can be used to read data from any data source property,
			 * including deeply nested objects / properties. `data` can be given in a
			 * number of different ways which effect its behaviour:
			 *
			 * * `integer` - treated as an array index for the data source. This is the
			 *   default that DataTables uses (incrementally increased for each column).
			 * * `string` - read an object property from the data source. There are
			 *   three 'special' options that can be used in the string to alter how
			 *   DataTables reads the data from the source object:
			 *    * `.` - Dotted Javascript notation. Just as you use a `.` in
			 *      Javascript to read from nested objects, so to can the options
			 *      specified in `data`. For example: `browser.version` or
			 *      `browser.name`. If your object parameter name contains a period, use
			 *      `\\` to escape it - i.e. `first\\.name`.
			 *    * `[]` - Array notation. DataTables can automatically combine data
			 *      from and array source, joining the data with the characters provided
			 *      between the two brackets. For example: `name[, ]` would provide a
			 *      comma-space separated list from the source array. If no characters
			 *      are provided between the brackets, the original array source is
			 *      returned.
			 *    * `()` - Function notation. Adding `()` to the end of a parameter will
			 *      execute a function of the name given. For example: `browser()` for a
			 *      simple function on the data source, `browser.version()` for a
			 *      function in a nested property or even `browser().version` to get an
			 *      object property if the function called returns an object. Note that
			 *      function notation is recommended for use in `render` rather than
			 *      `data` as it is much simpler to use as a renderer.
			 * * `null` - use the original data source for the row rather than plucking
			 *   data directly from it. This action has effects on two other
			 *   initialisation options:
			 *    * `defaultContent` - When null is given as the `data` option and
			 *      `defaultContent` is specified for the column, the value defined by
			 *      `defaultContent` will be used for the cell.
			 *    * `render` - When null is used for the `data` option and the `render`
			 *      option is specified for the column, the whole data source for the
			 *      row is used for the renderer.
			 * * `function` - the function given will be executed whenever DataTables
			 *   needs to set or get the data for a cell in the column. The function
			 *   takes three parameters:
			 *    * Parameters:
			 *      * `{array|object}` The data source for the row
			 *      * `{string}` The type call data requested - this will be 'set' when
			 *        setting data or 'filter', 'display', 'type', 'sort' or undefined
			 *        when gathering data. Note that when `undefined` is given for the
			 *        type DataTables expects to get the raw data for the object back<
			 *      * `{*}` Data to set when the second parameter is 'set'.
			 *    * Return:
			 *      * The return value from the function is not required when 'set' is
			 *        the type of call, but otherwise the return is what will be used
			 *        for the data requested.
			 *
			 * Note that `data` is a getter and setter option. If you just require
			 * formatting of data for output, you will likely want to use `render` which
			 * is simply a getter and thus simpler to use.
			 *
			 * Note that prior to DataTables 1.9.2 `data` was called `mDataProp`. The
			 * name change reflects the flexibility of this property and is consistent
			 * with the naming of mRender. If 'mDataProp' is given, then it will still
			 * be used by DataTables, as it automatically maps the old name to the new
			 * if required.
			 *
			 *  @type string|int|function|null
			 *  @default null <i>Use automatically calculated column index</i>
			 *
			 *  @name DataTable.defaults.column.data
			 *  @dtopt Columns
			 *
			 *  @example
			 *    // Read table data from objects
			 *    // JSON structure for each row:
			 *    //   {
			 *    //      "engine": {value},
			 *    //      "browser": {value},
			 *    //      "platform": {value},
			 *    //      "version": {value},
			 *    //      "grade": {value}
			 *    //   }
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "ajaxSource": "sources/objects.txt",
			 *        "columns": [
			 *          { "data": "engine" },
			 *          { "data": "browser" },
			 *          { "data": "platform" },
			 *          { "data": "version" },
			 *          { "data": "grade" }
			 *        ]
			 *      } );
			 *    } );
			 *
			 *  @example
			 *    // Read information from deeply nested objects
			 *    // JSON structure for each row:
			 *    //   {
			 *    //      "engine": {value},
			 *    //      "browser": {value},
			 *    //      "platform": {
			 *    //         "inner": {value}
			 *    //      },
			 *    //      "details": [
			 *    //         {value}, {value}
			 *    //      ]
			 *    //   }
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "ajaxSource": "sources/deep.txt",
			 *        "columns": [
			 *          { "data": "engine" },
			 *          { "data": "browser" },
			 *          { "data": "platform.inner" },
			 *          { "data": "details.0" },
			 *          { "data": "details.1" }
			 *        ]
			 *      } );
			 *    } );
			 *
			 *  @example
			 *    // Using `data` as a function to provide different information for
			 *    // sorting, filtering and display. In this case, currency (price)
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "columnDefs": [ {
			 *          "targets": [ 0 ],
			 *          "data": function ( source, type, val ) {
			 *            if (type === 'set') {
			 *              source.price = val;
			 *              // Store the computed display and filter values for efficiency
			 *              source.price_display = val=="" ? "" : "$"+numberFormat(val);
			 *              source.price_filter  = val=="" ? "" : "$"+numberFormat(val)+" "+val;
			 *              return;
			 *            }
			 *            else if (type === 'display') {
			 *              return source.price_display;
			 *            }
			 *            else if (type === 'filter') {
			 *              return source.price_filter;
			 *            }
			 *            // 'sort', 'type' and undefined all just use the integer
			 *            return source.price;
			 *          }
			 *        } ]
			 *      } );
			 *    } );
			 *
			 *  @example
			 *    // Using default content
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "columnDefs": [ {
			 *          "targets": [ 0 ],
			 *          "data": null,
			 *          "defaultContent": "Click to edit"
			 *        } ]
			 *      } );
			 *    } );
			 *
			 *  @example
			 *    // Using array notation - outputting a list from an array
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "columnDefs": [ {
			 *          "targets": [ 0 ],
			 *          "data": "name[, ]"
			 *        } ]
			 *      } );
			 *    } );
			 *
			 */
			"mData": null,
		
		
			/**
			 * This property is the rendering partner to `data` and it is suggested that
			 * when you want to manipulate data for display (including filtering,
			 * sorting etc) without altering the underlying data for the table, use this
			 * property. `render` can be considered to be the the read only companion to
			 * `data` which is read / write (then as such more complex). Like `data`
			 * this option can be given in a number of different ways to effect its
			 * behaviour:
			 *
			 * * `integer` - treated as an array index for the data source. This is the
			 *   default that DataTables uses (incrementally increased for each column).
			 * * `string` - read an object property from the data source. There are
			 *   three 'special' options that can be used in the string to alter how
			 *   DataTables reads the data from the source object:
			 *    * `.` - Dotted Javascript notation. Just as you use a `.` in
			 *      Javascript to read from nested objects, so to can the options
			 *      specified in `data`. For example: `browser.version` or
			 *      `browser.name`. If your object parameter name contains a period, use
			 *      `\\` to escape it - i.e. `first\\.name`.
			 *    * `[]` - Array notation. DataTables can automatically combine data
			 *      from and array source, joining the data with the characters provided
			 *      between the two brackets. For example: `name[, ]` would provide a
			 *      comma-space separated list from the source array. If no characters
			 *      are provided between the brackets, the original array source is
			 *      returned.
			 *    * `()` - Function notation. Adding `()` to the end of a parameter will
			 *      execute a function of the name given. For example: `browser()` for a
			 *      simple function on the data source, `browser.version()` for a
			 *      function in a nested property or even `browser().version` to get an
			 *      object property if the function called returns an object.
			 * * `object` - use different data for the different data types requested by
			 *   DataTables ('filter', 'display', 'type' or 'sort'). The property names
			 *   of the object is the data type the property refers to and the value can
			 *   defined using an integer, string or function using the same rules as
			 *   `render` normally does. Note that an `_` option _must_ be specified.
			 *   This is the default value to use if you haven't specified a value for
			 *   the data type requested by DataTables.
			 * * `function` - the function given will be executed whenever DataTables
			 *   needs to set or get the data for a cell in the column. The function
			 *   takes three parameters:
			 *    * Parameters:
			 *      * {array|object} The data source for the row (based on `data`)
			 *      * {string} The type call data requested - this will be 'filter',
			 *        'display', 'type' or 'sort'.
			 *      * {array|object} The full data source for the row (not based on
			 *        `data`)
			 *    * Return:
			 *      * The return value from the function is what will be used for the
			 *        data requested.
			 *
			 *  @type string|int|function|object|null
			 *  @default null Use the data source value.
			 *
			 *  @name DataTable.defaults.column.render
			 *  @dtopt Columns
			 *
			 *  @example
			 *    // Create a comma separated list from an array of objects
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "ajaxSource": "sources/deep.txt",
			 *        "columns": [
			 *          { "data": "engine" },
			 *          { "data": "browser" },
			 *          {
			 *            "data": "platform",
			 *            "render": "[, ].name"
			 *          }
			 *        ]
			 *      } );
			 *    } );
			 *
			 *  @example
			 *    // Execute a function to obtain data
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "columnDefs": [ {
			 *          "targets": [ 0 ],
			 *          "data": null, // Use the full data source object for the renderer's source
			 *          "render": "browserName()"
			 *        } ]
			 *      } );
			 *    } );
			 *
			 *  @example
			 *    // As an object, extracting different data for the different types
			 *    // This would be used with a data source such as:
			 *    //   { "phone": 5552368, "phone_filter": "5552368 555-2368", "phone_display": "555-2368" }
			 *    // Here the `phone` integer is used for sorting and type detection, while `phone_filter`
			 *    // (which has both forms) is used for filtering for if a user inputs either format, while
			 *    // the formatted phone number is the one that is shown in the table.
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "columnDefs": [ {
			 *          "targets": [ 0 ],
			 *          "data": null, // Use the full data source object for the renderer's source
			 *          "render": {
			 *            "_": "phone",
			 *            "filter": "phone_filter",
			 *            "display": "phone_display"
			 *          }
			 *        } ]
			 *      } );
			 *    } );
			 *
			 *  @example
			 *    // Use as a function to create a link from the data source
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "columnDefs": [ {
			 *          "targets": [ 0 ],
			 *          "data": "download_link",
			 *          "render": function ( data, type, full ) {
			 *            return '<a href="'+data+'">Download</a>';
			 *          }
			 *        } ]
			 *      } );
			 *    } );
			 */
			"mRender": null,
		
		
			/**
			 * Change the cell type created for the column - either TD cells or TH cells. This
			 * can be useful as TH cells have semantic meaning in the table body, allowing them
			 * to act as a header for a row (you may wish to add scope='row' to the TH elements).
			 *  @type string
			 *  @default td
			 *
			 *  @name DataTable.defaults.column.cellType
			 *  @dtopt Columns
			 *
			 *  @example
			 *    // Make the first column use TH cells
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "columnDefs": [ {
			 *          "targets": [ 0 ],
			 *          "cellType": "th"
			 *        } ]
			 *      } );
			 *    } );
			 */
			"sCellType": "td",
		
		
			/**
			 * Class to give to each cell in this column.
			 *  @type string
			 *  @default <i>Empty string</i>
			 *
			 *  @name DataTable.defaults.column.class
			 *  @dtopt Columns
			 *
			 *  @example
			 *    // Using `columnDefs`
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "columnDefs": [
			 *          { "class": "my_class", "targets": [ 0 ] }
			 *        ]
			 *      } );
			 *    } );
			 *
			 *  @example
			 *    // Using `columns`
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "columns": [
			 *          { "class": "my_class" },
			 *          null,
			 *          null,
			 *          null,
			 *          null
			 *        ]
			 *      } );
			 *    } );
			 */
			"sClass": "",
		
			/**
			 * When DataTables calculates the column widths to assign to each column,
			 * it finds the longest string in each column and then constructs a
			 * temporary table and reads the widths from that. The problem with this
			 * is that "mmm" is much wider then "iiii", but the latter is a longer
			 * string - thus the calculation can go wrong (doing it properly and putting
			 * it into an DOM object and measuring that is horribly(!) slow). Thus as
			 * a "work around" we provide this option. It will append its value to the
			 * text that is found to be the longest string for the column - i.e. padding.
			 * Generally you shouldn't need this!
			 *  @type string
			 *  @default <i>Empty string<i>
			 *
			 *  @name DataTable.defaults.column.contentPadding
			 *  @dtopt Columns
			 *
			 *  @example
			 *    // Using `columns`
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "columns": [
			 *          null,
			 *          null,
			 *          null,
			 *          {
			 *            "contentPadding": "mmm"
			 *          }
			 *        ]
			 *      } );
			 *    } );
			 */
			"sContentPadding": "",
		
		
			/**
			 * Allows a default value to be given for a column's data, and will be used
			 * whenever a null data source is encountered (this can be because `data`
			 * is set to null, or because the data source itself is null).
			 *  @type string
			 *  @default null
			 *
			 *  @name DataTable.defaults.column.defaultContent
			 *  @dtopt Columns
			 *
			 *  @example
			 *    // Using `columnDefs`
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "columnDefs": [
			 *          {
			 *            "data": null,
			 *            "defaultContent": "Edit",
			 *            "targets": [ -1 ]
			 *          }
			 *        ]
			 *      } );
			 *    } );
			 *
			 *  @example
			 *    // Using `columns`
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "columns": [
			 *          null,
			 *          null,
			 *          null,
			 *          {
			 *            "data": null,
			 *            "defaultContent": "Edit"
			 *          }
			 *        ]
			 *      } );
			 *    } );
			 */
			"sDefaultContent": null,
		
		
			/**
			 * This parameter is only used in DataTables' server-side processing. It can
			 * be exceptionally useful to know what columns are being displayed on the
			 * client side, and to map these to database fields. When defined, the names
			 * also allow DataTables to reorder information from the server if it comes
			 * back in an unexpected order (i.e. if you switch your columns around on the
			 * client-side, your server-side code does not also need updating).
			 *  @type string
			 *  @default <i>Empty string</i>
			 *
			 *  @name DataTable.defaults.column.name
			 *  @dtopt Columns
			 *
			 *  @example
			 *    // Using `columnDefs`
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "columnDefs": [
			 *          { "name": "engine", "targets": [ 0 ] },
			 *          { "name": "browser", "targets": [ 1 ] },
			 *          { "name": "platform", "targets": [ 2 ] },
			 *          { "name": "version", "targets": [ 3 ] },
			 *          { "name": "grade", "targets": [ 4 ] }
			 *        ]
			 *      } );
			 *    } );
			 *
			 *  @example
			 *    // Using `columns`
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "columns": [
			 *          { "name": "engine" },
			 *          { "name": "browser" },
			 *          { "name": "platform" },
			 *          { "name": "version" },
			 *          { "name": "grade" }
			 *        ]
			 *      } );
			 *    } );
			 */
			"sName": "",
		
		
			/**
			 * Defines a data source type for the ordering which can be used to read
			 * real-time information from the table (updating the internally cached
			 * version) prior to ordering. This allows ordering to occur on user
			 * editable elements such as form inputs.
			 *  @type string
			 *  @default std
			 *
			 *  @name DataTable.defaults.column.orderDataType
			 *  @dtopt Columns
			 *
			 *  @example
			 *    // Using `columnDefs`
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "columnDefs": [
			 *          { "orderDataType": "dom-text", "targets": [ 2, 3 ] },
			 *          { "type": "numeric", "targets": [ 3 ] },
			 *          { "orderDataType": "dom-select", "targets": [ 4 ] },
			 *          { "orderDataType": "dom-checkbox", "targets": [ 5 ] }
			 *        ]
			 *      } );
			 *    } );
			 *
			 *  @example
			 *    // Using `columns`
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "columns": [
			 *          null,
			 *          null,
			 *          { "orderDataType": "dom-text" },
			 *          { "orderDataType": "dom-text", "type": "numeric" },
			 *          { "orderDataType": "dom-select" },
			 *          { "orderDataType": "dom-checkbox" }
			 *        ]
			 *      } );
			 *    } );
			 */
			"sSortDataType": "std",
		
		
			/**
			 * The title of this column.
			 *  @type string
			 *  @default null <i>Derived from the 'TH' value for this column in the
			 *    original HTML table.</i>
			 *
			 *  @name DataTable.defaults.column.title
			 *  @dtopt Columns
			 *
			 *  @example
			 *    // Using `columnDefs`
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "columnDefs": [
			 *          { "title": "My column title", "targets": [ 0 ] }
			 *        ]
			 *      } );
			 *    } );
			 *
			 *  @example
			 *    // Using `columns`
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "columns": [
			 *          { "title": "My column title" },
			 *          null,
			 *          null,
			 *          null,
			 *          null
			 *        ]
			 *      } );
			 *    } );
			 */
			"sTitle": null,
		
		
			/**
			 * The type allows you to specify how the data for this column will be
			 * ordered. Four types (string, numeric, date and html (which will strip
			 * HTML tags before ordering)) are currently available. Note that only date
			 * formats understood by Javascript's Date() object will be accepted as type
			 * date. For example: "Mar 26, 2008 5:03 PM". May take the values: 'string',
			 * 'numeric', 'date' or 'html' (by default). Further types can be adding
			 * through plug-ins.
			 *  @type string
			 *  @default null <i>Auto-detected from raw data</i>
			 *
			 *  @name DataTable.defaults.column.type
			 *  @dtopt Columns
			 *
			 *  @example
			 *    // Using `columnDefs`
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "columnDefs": [
			 *          { "type": "html", "targets": [ 0 ] }
			 *        ]
			 *      } );
			 *    } );
			 *
			 *  @example
			 *    // Using `columns`
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "columns": [
			 *          { "type": "html" },
			 *          null,
			 *          null,
			 *          null,
			 *          null
			 *        ]
			 *      } );
			 *    } );
			 */
			"sType": null,
		
		
			/**
			 * Defining the width of the column, this parameter may take any CSS value
			 * (3em, 20px etc). DataTables applies 'smart' widths to columns which have not
			 * been given a specific width through this interface ensuring that the table
			 * remains readable.
			 *  @type string
			 *  @default null <i>Automatic</i>
			 *
			 *  @name DataTable.defaults.column.width
			 *  @dtopt Columns
			 *
			 *  @example
			 *    // Using `columnDefs`
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "columnDefs": [
			 *          { "width": "20%", "targets": [ 0 ] }
			 *        ]
			 *      } );
			 *    } );
			 *
			 *  @example
			 *    // Using `columns`
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "columns": [
			 *          { "width": "20%" },
			 *          null,
			 *          null,
			 *          null,
			 *          null
			 *        ]
			 *      } );
			 *    } );
			 */
			"sWidth": null
		};
		
		_fnHungarianMap( DataTable.defaults.column );
		
		
		
		/**
		 * DataTables settings object - this holds all the information needed for a
		 * given table, including configuration, data and current application of the
		 * table options. DataTables does not have a single instance for each DataTable
		 * with the settings attached to that instance, but rather instances of the
		 * DataTable "class" are created on-the-fly as needed (typically by a
		 * $().dataTable() call) and the settings object is then applied to that
		 * instance.
		 *
		 * Note that this object is related to {@link DataTable.defaults} but this
		 * one is the internal data store for DataTables's cache of columns. It should
		 * NOT be manipulated outside of DataTables. Any configuration should be done
		 * through the initialisation options.
		 *  @namespace
		 *  @todo Really should attach the settings object to individual instances so we
		 *    don't need to create new instances on each $().dataTable() call (if the
		 *    table already exists). It would also save passing oSettings around and
		 *    into every single function. However, this is a very significant
		 *    architecture change for DataTables and will almost certainly break
		 *    backwards compatibility with older installations. This is something that
		 *    will be done in 2.0.
		 */
		DataTable.models.oSettings = {
			/**
			 * Primary features of DataTables and their enablement state.
			 *  @namespace
			 */
			"oFeatures": {
		
				/**
				 * Flag to say if DataTables should automatically try to calculate the
				 * optimum table and columns widths (true) or not (false).
				 * Note that this parameter will be set by the initialisation routine. To
				 * set a default use {@link DataTable.defaults}.
				 *  @type boolean
				 */
				"bAutoWidth": null,
		
				/**
				 * Delay the creation of TR and TD elements until they are actually
				 * needed by a driven page draw. This can give a significant speed
				 * increase for Ajax source and Javascript source data, but makes no
				 * difference at all for DOM and server-side processing tables.
				 * Note that this parameter will be set by the initialisation routine. To
				 * set a default use {@link DataTable.defaults}.
				 *  @type boolean
				 */
				"bDeferRender": null,
		
				/**
				 * Enable filtering on the table or not. Note that if this is disabled
				 * then there is no filtering at all on the table, including fnFilter.
				 * To just remove the filtering input use sDom and remove the 'f' option.
				 * Note that this parameter will be set by the initialisation routine. To
				 * set a default use {@link DataTable.defaults}.
				 *  @type boolean
				 */
				"bFilter": null,
		
				/**
				 * Table information element (the 'Showing x of y records' div) enable
				 * flag.
				 * Note that this parameter will be set by the initialisation routine. To
				 * set a default use {@link DataTable.defaults}.
				 *  @type boolean
				 */
				"bInfo": null,
		
				/**
				 * Present a user control allowing the end user to change the page size
				 * when pagination is enabled.
				 * Note that this parameter will be set by the initialisation routine. To
				 * set a default use {@link DataTable.defaults}.
				 *  @type boolean
				 */
				"bLengthChange": null,
		
				/**
				 * Pagination enabled or not. Note that if this is disabled then length
				 * changing must also be disabled.
				 * Note that this parameter will be set by the initialisation routine. To
				 * set a default use {@link DataTable.defaults}.
				 *  @type boolean
				 */
				"bPaginate": null,
		
				/**
				 * Processing indicator enable flag whenever DataTables is enacting a
				 * user request - typically an Ajax request for server-side processing.
				 * Note that this parameter will be set by the initialisation routine. To
				 * set a default use {@link DataTable.defaults}.
				 *  @type boolean
				 */
				"bProcessing": null,
		
				/**
				 * Server-side processing enabled flag - when enabled DataTables will
				 * get all data from the server for every draw - there is no filtering,
				 * sorting or paging done on the client-side.
				 * Note that this parameter will be set by the initialisation routine. To
				 * set a default use {@link DataTable.defaults}.
				 *  @type boolean
				 */
				"bServerSide": null,
		
				/**
				 * Sorting enablement flag.
				 * Note that this parameter will be set by the initialisation routine. To
				 * set a default use {@link DataTable.defaults}.
				 *  @type boolean
				 */
				"bSort": null,
		
				/**
				 * Multi-column sorting
				 * Note that this parameter will be set by the initialisation routine. To
				 * set a default use {@link DataTable.defaults}.
				 *  @type boolean
				 */
				"bSortMulti": null,
		
				/**
				 * Apply a class to the columns which are being sorted to provide a
				 * visual highlight or not. This can slow things down when enabled since
				 * there is a lot of DOM interaction.
				 * Note that this parameter will be set by the initialisation routine. To
				 * set a default use {@link DataTable.defaults}.
				 *  @type boolean
				 */
				"bSortClasses": null,
		
				/**
				 * State saving enablement flag.
				 * Note that this parameter will be set by the initialisation routine. To
				 * set a default use {@link DataTable.defaults}.
				 *  @type boolean
				 */
				"bStateSave": null
			},
		
		
			/**
			 * Scrolling settings for a table.
			 *  @namespace
			 */
			"oScroll": {
				/**
				 * When the table is shorter in height than sScrollY, collapse the
				 * table container down to the height of the table (when true).
				 * Note that this parameter will be set by the initialisation routine. To
				 * set a default use {@link DataTable.defaults}.
				 *  @type boolean
				 */
				"bCollapse": null,
		
				/**
				 * Width of the scrollbar for the web-browser's platform. Calculated
				 * during table initialisation.
				 *  @type int
				 *  @default 0
				 */
				"iBarWidth": 0,
		
				/**
				 * Viewport width for horizontal scrolling. Horizontal scrolling is
				 * disabled if an empty string.
				 * Note that this parameter will be set by the initialisation routine. To
				 * set a default use {@link DataTable.defaults}.
				 *  @type string
				 */
				"sX": null,
		
				/**
				 * Width to expand the table to when using x-scrolling. Typically you
				 * should not need to use this.
				 * Note that this parameter will be set by the initialisation routine. To
				 * set a default use {@link DataTable.defaults}.
				 *  @type string
				 *  @deprecated
				 */
				"sXInner": null,
		
				/**
				 * Viewport height for vertical scrolling. Vertical scrolling is disabled
				 * if an empty string.
				 * Note that this parameter will be set by the initialisation routine. To
				 * set a default use {@link DataTable.defaults}.
				 *  @type string
				 */
				"sY": null
			},
		
			/**
			 * Language information for the table.
			 *  @namespace
			 *  @extends DataTable.defaults.oLanguage
			 */
			"oLanguage": {
				/**
				 * Information callback function. See
				 * {@link DataTable.defaults.fnInfoCallback}
				 *  @type function
				 *  @default null
				 */
				"fnInfoCallback": null
			},
		
			/**
			 * Browser support parameters
			 *  @namespace
			 */
			"oBrowser": {
				/**
				 * Indicate if the browser incorrectly calculates width:100% inside a
				 * scrolling element (IE6/7)
				 *  @type boolean
				 *  @default false
				 */
				"bScrollOversize": false,
		
				/**
				 * Determine if the vertical scrollbar is on the right or left of the
				 * scrolling container - needed for rtl language layout, although not
				 * all browsers move the scrollbar (Safari).
				 *  @type boolean
				 *  @default false
				 */
				"bScrollbarLeft": false,
		
				/**
				 * Flag for if `getBoundingClientRect` is fully supported or not
				 *  @type boolean
				 *  @default false
				 */
				"bBounding": false,
		
				/**
				 * Browser scrollbar width
				 *  @type integer
				 *  @default 0
				 */
				"barWidth": 0
			},
		
		
			"ajax": null,
		
		
			/**
			 * Array referencing the nodes which are used for the features. The
			 * parameters of this object match what is allowed by sDom - i.e.
			 *   <ul>
			 *     <li>'l' - Length changing</li>
			 *     <li>'f' - Filtering input</li>
			 *     <li>'t' - The table!</li>
			 *     <li>'i' - Information</li>
			 *     <li>'p' - Pagination</li>
			 *     <li>'r' - pRocessing</li>
			 *   </ul>
			 *  @type array
			 *  @default []
			 */
			"aanFeatures": [],
		
			/**
			 * Store data information - see {@link DataTable.models.oRow} for detailed
			 * information.
			 *  @type array
			 *  @default []
			 */
			"aoData": [],
		
			/**
			 * Array of indexes which are in the current display (after filtering etc)
			 *  @type array
			 *  @default []
			 */
			"aiDisplay": [],
		
			/**
			 * Array of indexes for display - no filtering
			 *  @type array
			 *  @default []
			 */
			"aiDisplayMaster": [],
		
			/**
			 * Map of row ids to data indexes
			 *  @type object
			 *  @default {}
			 */
			"aIds": {},
		
			/**
			 * Store information about each column that is in use
			 *  @type array
			 *  @default []
			 */
			"aoColumns": [],
		
			/**
			 * Store information about the table's header
			 *  @type array
			 *  @default []
			 */
			"aoHeader": [],
		
			/**
			 * Store information about the table's footer
			 *  @type array
			 *  @default []
			 */
			"aoFooter": [],
		
			/**
			 * Store the applied global search information in case we want to force a
			 * research or compare the old search to a new one.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @namespace
			 *  @extends DataTable.models.oSearch
			 */
			"oPreviousSearch": {},
		
			/**
			 * Store the applied search for each column - see
			 * {@link DataTable.models.oSearch} for the format that is used for the
			 * filtering information for each column.
			 *  @type array
			 *  @default []
			 */
			"aoPreSearchCols": [],
		
			/**
			 * Sorting that is applied to the table. Note that the inner arrays are
			 * used in the following manner:
			 * <ul>
			 *   <li>Index 0 - column number</li>
			 *   <li>Index 1 - current sorting direction</li>
			 * </ul>
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type array
			 *  @todo These inner arrays should really be objects
			 */
			"aaSorting": null,
		
			/**
			 * Sorting that is always applied to the table (i.e. prefixed in front of
			 * aaSorting).
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type array
			 *  @default []
			 */
			"aaSortingFixed": [],
		
			/**
			 * Classes to use for the striping of a table.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type array
			 *  @default []
			 */
			"asStripeClasses": null,
		
			/**
			 * If restoring a table - we should restore its striping classes as well
			 *  @type array
			 *  @default []
			 */
			"asDestroyStripes": [],
		
			/**
			 * If restoring a table - we should restore its width
			 *  @type int
			 *  @default 0
			 */
			"sDestroyWidth": 0,
		
			/**
			 * Callback functions array for every time a row is inserted (i.e. on a draw).
			 *  @type array
			 *  @default []
			 */
			"aoRowCallback": [],
		
			/**
			 * Callback functions for the header on each draw.
			 *  @type array
			 *  @default []
			 */
			"aoHeaderCallback": [],
		
			/**
			 * Callback function for the footer on each draw.
			 *  @type array
			 *  @default []
			 */
			"aoFooterCallback": [],
		
			/**
			 * Array of callback functions for draw callback functions
			 *  @type array
			 *  @default []
			 */
			"aoDrawCallback": [],
		
			/**
			 * Array of callback functions for row created function
			 *  @type array
			 *  @default []
			 */
			"aoRowCreatedCallback": [],
		
			/**
			 * Callback functions for just before the table is redrawn. A return of
			 * false will be used to cancel the draw.
			 *  @type array
			 *  @default []
			 */
			"aoPreDrawCallback": [],
		
			/**
			 * Callback functions for when the table has been initialised.
			 *  @type array
			 *  @default []
			 */
			"aoInitComplete": [],
		
		
			/**
			 * Callbacks for modifying the settings to be stored for state saving, prior to
			 * saving state.
			 *  @type array
			 *  @default []
			 */
			"aoStateSaveParams": [],
		
			/**
			 * Callbacks for modifying the settings that have been stored for state saving
			 * prior to using the stored values to restore the state.
			 *  @type array
			 *  @default []
			 */
			"aoStateLoadParams": [],
		
			/**
			 * Callbacks for operating on the settings object once the saved state has been
			 * loaded
			 *  @type array
			 *  @default []
			 */
			"aoStateLoaded": [],
		
			/**
			 * Cache the table ID for quick access
			 *  @type string
			 *  @default <i>Empty string</i>
			 */
			"sTableId": "",
		
			/**
			 * The TABLE node for the main table
			 *  @type node
			 *  @default null
			 */
			"nTable": null,
		
			/**
			 * Permanent ref to the thead element
			 *  @type node
			 *  @default null
			 */
			"nTHead": null,
		
			/**
			 * Permanent ref to the tfoot element - if it exists
			 *  @type node
			 *  @default null
			 */
			"nTFoot": null,
		
			/**
			 * Permanent ref to the tbody element
			 *  @type node
			 *  @default null
			 */
			"nTBody": null,
		
			/**
			 * Cache the wrapper node (contains all DataTables controlled elements)
			 *  @type node
			 *  @default null
			 */
			"nTableWrapper": null,
		
			/**
			 * Indicate if when using server-side processing the loading of data
			 * should be deferred until the second draw.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 *  @default false
			 */
			"bDeferLoading": false,
		
			/**
			 * Indicate if all required information has been read in
			 *  @type boolean
			 *  @default false
			 */
			"bInitialised": false,
		
			/**
			 * Information about open rows. Each object in the array has the parameters
			 * 'nTr' and 'nParent'
			 *  @type array
			 *  @default []
			 */
			"aoOpenRows": [],
		
			/**
			 * Dictate the positioning of DataTables' control elements - see
			 * {@link DataTable.model.oInit.sDom}.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type string
			 *  @default null
			 */
			"sDom": null,
		
			/**
			 * Search delay (in mS)
			 *  @type integer
			 *  @default null
			 */
			"searchDelay": null,
		
			/**
			 * Which type of pagination should be used.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type string
			 *  @default two_button
			 */
			"sPaginationType": "two_button",
		
			/**
			 * The state duration (for `stateSave`) in seconds.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type int
			 *  @default 0
			 */
			"iStateDuration": 0,
		
			/**
			 * Array of callback functions for state saving. Each array element is an
			 * object with the following parameters:
			 *   <ul>
			 *     <li>function:fn - function to call. Takes two parameters, oSettings
			 *       and the JSON string to save that has been thus far created. Returns
			 *       a JSON string to be inserted into a json object
			 *       (i.e. '"param": [ 0, 1, 2]')</li>
			 *     <li>string:sName - name of callback</li>
			 *   </ul>
			 *  @type array
			 *  @default []
			 */
			"aoStateSave": [],
		
			/**
			 * Array of callback functions for state loading. Each array element is an
			 * object with the following parameters:
			 *   <ul>
			 *     <li>function:fn - function to call. Takes two parameters, oSettings
			 *       and the object stored. May return false to cancel state loading</li>
			 *     <li>string:sName - name of callback</li>
			 *   </ul>
			 *  @type array
			 *  @default []
			 */
			"aoStateLoad": [],
		
			/**
			 * State that was saved. Useful for back reference
			 *  @type object
			 *  @default null
			 */
			"oSavedState": null,
		
			/**
			 * State that was loaded. Useful for back reference
			 *  @type object
			 *  @default null
			 */
			"oLoadedState": null,
		
			/**
			 * Source url for AJAX data for the table.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type string
			 *  @default null
			 */
			"sAjaxSource": null,
		
			/**
			 * Property from a given object from which to read the table data from. This
			 * can be an empty string (when not server-side processing), in which case
			 * it is  assumed an an array is given directly.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type string
			 */
			"sAjaxDataProp": null,
		
			/**
			 * The last jQuery XHR object that was used for server-side data gathering.
			 * This can be used for working with the XHR information in one of the
			 * callbacks
			 *  @type object
			 *  @default null
			 */
			"jqXHR": null,
		
			/**
			 * JSON returned from the server in the last Ajax request
			 *  @type object
			 *  @default undefined
			 */
			"json": undefined,
		
			/**
			 * Data submitted as part of the last Ajax request
			 *  @type object
			 *  @default undefined
			 */
			"oAjaxData": undefined,
		
			/**
			 * Function to get the server-side data.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type function
			 */
			"fnServerData": null,
		
			/**
			 * Functions which are called prior to sending an Ajax request so extra
			 * parameters can easily be sent to the server
			 *  @type array
			 *  @default []
			 */
			"aoServerParams": [],
		
			/**
			 * Send the XHR HTTP method - GET or POST (could be PUT or DELETE if
			 * required).
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type string
			 */
			"sServerMethod": null,
		
			/**
			 * Format numbers for display.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type function
			 */
			"fnFormatNumber": null,
		
			/**
			 * List of options that can be used for the user selectable length menu.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type array
			 *  @default []
			 */
			"aLengthMenu": null,
		
			/**
			 * Counter for the draws that the table does. Also used as a tracker for
			 * server-side processing
			 *  @type int
			 *  @default 0
			 */
			"iDraw": 0,
		
			/**
			 * Indicate if a redraw is being done - useful for Ajax
			 *  @type boolean
			 *  @default false
			 */
			"bDrawing": false,
		
			/**
			 * Draw index (iDraw) of the last error when parsing the returned data
			 *  @type int
			 *  @default -1
			 */
			"iDrawError": -1,
		
			/**
			 * Paging display length
			 *  @type int
			 *  @default 10
			 */
			"_iDisplayLength": 10,
		
			/**
			 * Paging start point - aiDisplay index
			 *  @type int
			 *  @default 0
			 */
			"_iDisplayStart": 0,
		
			/**
			 * Server-side processing - number of records in the result set
			 * (i.e. before filtering), Use fnRecordsTotal rather than
			 * this property to get the value of the number of records, regardless of
			 * the server-side processing setting.
			 *  @type int
			 *  @default 0
			 *  @private
			 */
			"_iRecordsTotal": 0,
		
			/**
			 * Server-side processing - number of records in the current display set
			 * (i.e. after filtering). Use fnRecordsDisplay rather than
			 * this property to get the value of the number of records, regardless of
			 * the server-side processing setting.
			 *  @type boolean
			 *  @default 0
			 *  @private
			 */
			"_iRecordsDisplay": 0,
		
			/**
			 * The classes to use for the table
			 *  @type object
			 *  @default {}
			 */
			"oClasses": {},
		
			/**
			 * Flag attached to the settings object so you can check in the draw
			 * callback if filtering has been done in the draw. Deprecated in favour of
			 * events.
			 *  @type boolean
			 *  @default false
			 *  @deprecated
			 */
			"bFiltered": false,
		
			/**
			 * Flag attached to the settings object so you can check in the draw
			 * callback if sorting has been done in the draw. Deprecated in favour of
			 * events.
			 *  @type boolean
			 *  @default false
			 *  @deprecated
			 */
			"bSorted": false,
		
			/**
			 * Indicate that if multiple rows are in the header and there is more than
			 * one unique cell per column, if the top one (true) or bottom one (false)
			 * should be used for sorting / title by DataTables.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bSortCellsTop": null,
		
			/**
			 * Initialisation object that is used for the table
			 *  @type object
			 *  @default null
			 */
			"oInit": null,
		
			/**
			 * Destroy callback functions - for plug-ins to attach themselves to the
			 * destroy so they can clean up markup and events.
			 *  @type array
			 *  @default []
			 */
			"aoDestroyCallback": [],
		
		
			/**
			 * Get the number of records in the current record set, before filtering
			 *  @type function
			 */
			"fnRecordsTotal": function ()
			{
				return _fnDataSource( this ) == 'ssp' ?
					this._iRecordsTotal * 1 :
					this.aiDisplayMaster.length;
			},
		
			/**
			 * Get the number of records in the current record set, after filtering
			 *  @type function
			 */
			"fnRecordsDisplay": function ()
			{
				return _fnDataSource( this ) == 'ssp' ?
					this._iRecordsDisplay * 1 :
					this.aiDisplay.length;
			},
		
			/**
			 * Get the display end point - aiDisplay index
			 *  @type function
			 */
			"fnDisplayEnd": function ()
			{
				var
					len      = this._iDisplayLength,
					start    = this._iDisplayStart,
					calc     = start + len,
					records  = this.aiDisplay.length,
					features = this.oFeatures,
					paginate = features.bPaginate;
		
				if ( features.bServerSide ) {
					return paginate === false || len === -1 ?
						start + records :
						Math.min( start+len, this._iRecordsDisplay );
				}
				else {
					return ! paginate || calc>records || len===-1 ?
						records :
						calc;
				}
			},
		
			/**
			 * The DataTables object for this table
			 *  @type object
			 *  @default null
			 */
			"oInstance": null,
		
			/**
			 * Unique identifier for each instance of the DataTables object. If there
			 * is an ID on the table node, then it takes that value, otherwise an
			 * incrementing internal counter is used.
			 *  @type string
			 *  @default null
			 */
			"sInstance": null,
		
			/**
			 * tabindex attribute value that is added to DataTables control elements, allowing
			 * keyboard navigation of the table and its controls.
			 */
			"iTabIndex": 0,
		
			/**
			 * DIV container for the footer scrolling table if scrolling
			 */
			"nScrollHead": null,
		
			/**
			 * DIV container for the footer scrolling table if scrolling
			 */
			"nScrollFoot": null,
		
			/**
			 * Last applied sort
			 *  @type array
			 *  @default []
			 */
			"aLastSort": [],
		
			/**
			 * Stored plug-in instances
			 *  @type object
			 *  @default {}
			 */
			"oPlugins": {},
		
			/**
			 * Function used to get a row's id from the row's data
			 *  @type function
			 *  @default null
			 */
			"rowIdFn": null,
		
			/**
			 * Data location where to store a row's id
			 *  @type string
			 *  @default null
			 */
			"rowId": null
		};
		
		/**
		 * Extension object for DataTables that is used to provide all extension
		 * options.
		 *
		 * Note that the `DataTable.ext` object is available through
		 * `jQuery.fn.dataTable.ext` where it may be accessed and manipulated. It is
		 * also aliased to `jQuery.fn.dataTableExt` for historic reasons.
		 *  @namespace
		 *  @extends DataTable.models.ext
		 */
		
		
		/**
		 * DataTables extensions
		 * 
		 * This namespace acts as a collection area for plug-ins that can be used to
		 * extend DataTables capabilities. Indeed many of the build in methods
		 * use this method to provide their own capabilities (sorting methods for
		 * example).
		 *
		 * Note that this namespace is aliased to `jQuery.fn.dataTableExt` for legacy
		 * reasons
		 *
		 *  @namespace
		 */
		DataTable.ext = _ext = {
			/**
			 * Buttons. For use with the Buttons extension for DataTables. This is
			 * defined here so other extensions can define buttons regardless of load
			 * order. It is _not_ used by DataTables core.
			 *
			 *  @type object
			 *  @default {}
			 */
			buttons: {},
		
		
			/**
			 * Element class names
			 *
			 *  @type object
			 *  @default {}
			 */
			classes: {},
		
		
			/**
			 * DataTables build type (expanded by the download builder)
			 *
			 *  @type string
			 */
			build:"bs5-5.0.1/dt-1.11.5/e-2.0.7",
		
		
			/**
			 * Error reporting.
			 * 
			 * How should DataTables report an error. Can take the value 'alert',
			 * 'throw', 'none' or a function.
			 *
			 *  @type string|function
			 *  @default alert
			 */
			errMode: "alert",
		
		
			/**
			 * Feature plug-ins.
			 * 
			 * This is an array of objects which describe the feature plug-ins that are
			 * available to DataTables. These feature plug-ins are then available for
			 * use through the `dom` initialisation option.
			 * 
			 * Each feature plug-in is described by an object which must have the
			 * following properties:
			 * 
			 * * `fnInit` - function that is used to initialise the plug-in,
			 * * `cFeature` - a character so the feature can be enabled by the `dom`
			 *   instillation option. This is case sensitive.
			 *
			 * The `fnInit` function has the following input parameters:
			 *
			 * 1. `{object}` DataTables settings object: see
			 *    {@link DataTable.models.oSettings}
			 *
			 * And the following return is expected:
			 * 
			 * * {node|null} The element which contains your feature. Note that the
			 *   return may also be void if your plug-in does not require to inject any
			 *   DOM elements into DataTables control (`dom`) - for example this might
			 *   be useful when developing a plug-in which allows table control via
			 *   keyboard entry
			 *
			 *  @type array
			 *
			 *  @example
			 *    $.fn.dataTable.ext.features.push( {
			 *      "fnInit": function( oSettings ) {
			 *        return new TableTools( { "oDTSettings": oSettings } );
			 *      },
			 *      "cFeature": "T"
			 *    } );
			 */
			feature: [],
		
		
			/**
			 * Row searching.
			 * 
			 * This method of searching is complimentary to the default type based
			 * searching, and a lot more comprehensive as it allows you complete control
			 * over the searching logic. Each element in this array is a function
			 * (parameters described below) that is called for every row in the table,
			 * and your logic decides if it should be included in the searching data set
			 * or not.
			 *
			 * Searching functions have the following input parameters:
			 *
			 * 1. `{object}` DataTables settings object: see
			 *    {@link DataTable.models.oSettings}
			 * 2. `{array|object}` Data for the row to be processed (same as the
			 *    original format that was passed in as the data source, or an array
			 *    from a DOM data source
			 * 3. `{int}` Row index ({@link DataTable.models.oSettings.aoData}), which
			 *    can be useful to retrieve the `TR` element if you need DOM interaction.
			 *
			 * And the following return is expected:
			 *
			 * * {boolean} Include the row in the searched result set (true) or not
			 *   (false)
			 *
			 * Note that as with the main search ability in DataTables, technically this
			 * is "filtering", since it is subtractive. However, for consistency in
			 * naming we call it searching here.
			 *
			 *  @type array
			 *  @default []
			 *
			 *  @example
			 *    // The following example shows custom search being applied to the
			 *    // fourth column (i.e. the data[3] index) based on two input values
			 *    // from the end-user, matching the data in a certain range.
			 *    $.fn.dataTable.ext.search.push(
			 *      function( settings, data, dataIndex ) {
			 *        var min = document.getElementById('min').value * 1;
			 *        var max = document.getElementById('max').value * 1;
			 *        var version = data[3] == "-" ? 0 : data[3]*1;
			 *
			 *        if ( min == "" && max == "" ) {
			 *          return true;
			 *        }
			 *        else if ( min == "" && version < max ) {
			 *          return true;
			 *        }
			 *        else if ( min < version && "" == max ) {
			 *          return true;
			 *        }
			 *        else if ( min < version && version < max ) {
			 *          return true;
			 *        }
			 *        return false;
			 *      }
			 *    );
			 */
			search: [],
		
		
			/**
			 * Selector extensions
			 *
			 * The `selector` option can be used to extend the options available for the
			 * selector modifier options (`selector-modifier` object data type) that
			 * each of the three built in selector types offer (row, column and cell +
			 * their plural counterparts). For example the Select extension uses this
			 * mechanism to provide an option to select only rows, columns and cells
			 * that have been marked as selected by the end user (`{selected: true}`),
			 * which can be used in conjunction with the existing built in selector
			 * options.
			 *
			 * Each property is an array to which functions can be pushed. The functions
			 * take three attributes:
			 *
			 * * Settings object for the host table
			 * * Options object (`selector-modifier` object type)
			 * * Array of selected item indexes
			 *
			 * The return is an array of the resulting item indexes after the custom
			 * selector has been applied.
			 *
			 *  @type object
			 */
			selector: {
				cell: [],
				column: [],
				row: []
			},
		
		
			/**
			 * Internal functions, exposed for used in plug-ins.
			 * 
			 * Please note that you should not need to use the internal methods for
			 * anything other than a plug-in (and even then, try to avoid if possible).
			 * The internal function may change between releases.
			 *
			 *  @type object
			 *  @default {}
			 */
			internal: {},
		
		
			/**
			 * Legacy configuration options. Enable and disable legacy options that
			 * are available in DataTables.
			 *
			 *  @type object
			 */
			legacy: {
				/**
				 * Enable / disable DataTables 1.9 compatible server-side processing
				 * requests
				 *
				 *  @type boolean
				 *  @default null
				 */
				ajax: null
			},
		
		
			/**
			 * Pagination plug-in methods.
			 * 
			 * Each entry in this object is a function and defines which buttons should
			 * be shown by the pagination rendering method that is used for the table:
			 * {@link DataTable.ext.renderer.pageButton}. The renderer addresses how the
			 * buttons are displayed in the document, while the functions here tell it
			 * what buttons to display. This is done by returning an array of button
			 * descriptions (what each button will do).
			 *
			 * Pagination types (the four built in options and any additional plug-in
			 * options defined here) can be used through the `paginationType`
			 * initialisation parameter.
			 *
			 * The functions defined take two parameters:
			 *
			 * 1. `{int} page` The current page index
			 * 2. `{int} pages` The number of pages in the table
			 *
			 * Each function is expected to return an array where each element of the
			 * array can be one of:
			 *
			 * * `first` - Jump to first page when activated
			 * * `last` - Jump to last page when activated
			 * * `previous` - Show previous page when activated
			 * * `next` - Show next page when activated
			 * * `{int}` - Show page of the index given
			 * * `{array}` - A nested array containing the above elements to add a
			 *   containing 'DIV' element (might be useful for styling).
			 *
			 * Note that DataTables v1.9- used this object slightly differently whereby
			 * an object with two functions would be defined for each plug-in. That
			 * ability is still supported by DataTables 1.10+ to provide backwards
			 * compatibility, but this option of use is now decremented and no longer
			 * documented in DataTables 1.10+.
			 *
			 *  @type object
			 *  @default {}
			 *
			 *  @example
			 *    // Show previous, next and current page buttons only
			 *    $.fn.dataTableExt.oPagination.current = function ( page, pages ) {
			 *      return [ 'previous', page, 'next' ];
			 *    };
			 */
			pager: {},
		
		
			renderer: {
				pageButton: {},
				header: {}
			},
		
		
			/**
			 * Ordering plug-ins - custom data source
			 * 
			 * The extension options for ordering of data available here is complimentary
			 * to the default type based ordering that DataTables typically uses. It
			 * allows much greater control over the the data that is being used to
			 * order a column, but is necessarily therefore more complex.
			 * 
			 * This type of ordering is useful if you want to do ordering based on data
			 * live from the DOM (for example the contents of an 'input' element) rather
			 * than just the static string that DataTables knows of.
			 * 
			 * The way these plug-ins work is that you create an array of the values you
			 * wish to be ordering for the column in question and then return that
			 * array. The data in the array much be in the index order of the rows in
			 * the table (not the currently ordering order!). Which order data gathering
			 * function is run here depends on the `dt-init columns.orderDataType`
			 * parameter that is used for the column (if any).
			 *
			 * The functions defined take two parameters:
			 *
			 * 1. `{object}` DataTables settings object: see
			 *    {@link DataTable.models.oSettings}
			 * 2. `{int}` Target column index
			 *
			 * Each function is expected to return an array:
			 *
			 * * `{array}` Data for the column to be ordering upon
			 *
			 *  @type array
			 *
			 *  @example
			 *    // Ordering using `input` node values
			 *    $.fn.dataTable.ext.order['dom-text'] = function  ( settings, col )
			 *    {
			 *      return this.api().column( col, {order:'index'} ).nodes().map( function ( td, i ) {
			 *        return $('input', td).val();
			 *      } );
			 *    }
			 */
			order: {},
		
		
			/**
			 * Type based plug-ins.
			 *
			 * Each column in DataTables has a type assigned to it, either by automatic
			 * detection or by direct assignment using the `type` option for the column.
			 * The type of a column will effect how it is ordering and search (plug-ins
			 * can also make use of the column type if required).
			 *
			 * @namespace
			 */
			type: {
				/**
				 * Type detection functions.
				 *
				 * The functions defined in this object are used to automatically detect
				 * a column's type, making initialisation of DataTables super easy, even
				 * when complex data is in the table.
				 *
				 * The functions defined take two parameters:
				 *
			     *  1. `{*}` Data from the column cell to be analysed
			     *  2. `{settings}` DataTables settings object. This can be used to
			     *     perform context specific type detection - for example detection
			     *     based on language settings such as using a comma for a decimal
			     *     place. Generally speaking the options from the settings will not
			     *     be required
				 *
				 * Each function is expected to return:
				 *
				 * * `{string|null}` Data type detected, or null if unknown (and thus
				 *   pass it on to the other type detection functions.
				 *
				 *  @type array
				 *
				 *  @example
				 *    // Currency type detection plug-in:
				 *    $.fn.dataTable.ext.type.detect.push(
				 *      function ( data, settings ) {
				 *        // Check the numeric part
				 *        if ( ! data.substring(1).match(/[0-9]/) ) {
				 *          return null;
				 *        }
				 *
				 *        // Check prefixed by currency
				 *        if ( data.charAt(0) == '$' || data.charAt(0) == '&pound;' ) {
				 *          return 'currency';
				 *        }
				 *        return null;
				 *      }
				 *    );
				 */
				detect: [],
		
		
				/**
				 * Type based search formatting.
				 *
				 * The type based searching functions can be used to pre-format the
				 * data to be search on. For example, it can be used to strip HTML
				 * tags or to de-format telephone numbers for numeric only searching.
				 *
				 * Note that is a search is not defined for a column of a given type,
				 * no search formatting will be performed.
				 * 
				 * Pre-processing of searching data plug-ins - When you assign the sType
				 * for a column (or have it automatically detected for you by DataTables
				 * or a type detection plug-in), you will typically be using this for
				 * custom sorting, but it can also be used to provide custom searching
				 * by allowing you to pre-processing the data and returning the data in
				 * the format that should be searched upon. This is done by adding
				 * functions this object with a parameter name which matches the sType
				 * for that target column. This is the corollary of <i>afnSortData</i>
				 * for searching data.
				 *
				 * The functions defined take a single parameter:
				 *
			     *  1. `{*}` Data from the column cell to be prepared for searching
				 *
				 * Each function is expected to return:
				 *
				 * * `{string|null}` Formatted string that will be used for the searching.
				 *
				 *  @type object
				 *  @default {}
				 *
				 *  @example
				 *    $.fn.dataTable.ext.type.search['title-numeric'] = function ( d ) {
				 *      return d.replace(/\n/g," ").replace( /<.*?>/g, "" );
				 *    }
				 */
				search: {},
		
		
				/**
				 * Type based ordering.
				 *
				 * The column type tells DataTables what ordering to apply to the table
				 * when a column is sorted upon. The order for each type that is defined,
				 * is defined by the functions available in this object.
				 *
				 * Each ordering option can be described by three properties added to
				 * this object:
				 *
				 * * `{type}-pre` - Pre-formatting function
				 * * `{type}-asc` - Ascending order function
				 * * `{type}-desc` - Descending order function
				 *
				 * All three can be used together, only `{type}-pre` or only
				 * `{type}-asc` and `{type}-desc` together. It is generally recommended
				 * that only `{type}-pre` is used, as this provides the optimal
				 * implementation in terms of speed, although the others are provided
				 * for compatibility with existing Javascript sort functions.
				 *
				 * `{type}-pre`: Functions defined take a single parameter:
				 *
			     *  1. `{*}` Data from the column cell to be prepared for ordering
				 *
				 * And return:
				 *
				 * * `{*}` Data to be sorted upon
				 *
				 * `{type}-asc` and `{type}-desc`: Functions are typical Javascript sort
				 * functions, taking two parameters:
				 *
			     *  1. `{*}` Data to compare to the second parameter
			     *  2. `{*}` Data to compare to the first parameter
				 *
				 * And returning:
				 *
				 * * `{*}` Ordering match: <0 if first parameter should be sorted lower
				 *   than the second parameter, ===0 if the two parameters are equal and
				 *   >0 if the first parameter should be sorted height than the second
				 *   parameter.
				 * 
				 *  @type object
				 *  @default {}
				 *
				 *  @example
				 *    // Numeric ordering of formatted numbers with a pre-formatter
				 *    $.extend( $.fn.dataTable.ext.type.order, {
				 *      "string-pre": function(x) {
				 *        a = (a === "-" || a === "") ? 0 : a.replace( /[^\d\-\.]/g, "" );
				 *        return parseFloat( a );
				 *      }
				 *    } );
				 *
				 *  @example
				 *    // Case-sensitive string ordering, with no pre-formatting method
				 *    $.extend( $.fn.dataTable.ext.order, {
				 *      "string-case-asc": function(x,y) {
				 *        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
				 *      },
				 *      "string-case-desc": function(x,y) {
				 *        return ((x < y) ? 1 : ((x > y) ? -1 : 0));
				 *      }
				 *    } );
				 */
				order: {}
			},
		
			/**
			 * Unique DataTables instance counter
			 *
			 * @type int
			 * @private
			 */
			_unique: 0,
		
		
			//
			// Depreciated
			// The following properties are retained for backwards compatibility only.
			// The should not be used in new projects and will be removed in a future
			// version
			//
		
			/**
			 * Version check function.
			 *  @type function
			 *  @depreciated Since 1.10
			 */
			fnVersionCheck: DataTable.fnVersionCheck,
		
		
			/**
			 * Index for what 'this' index API functions should use
			 *  @type int
			 *  @deprecated Since v1.10
			 */
			iApiIndex: 0,
		
		
			/**
			 * jQuery UI class container
			 *  @type object
			 *  @deprecated Since v1.10
			 */
			oJUIClasses: {},
		
		
			/**
			 * Software version
			 *  @type string
			 *  @deprecated Since v1.10
			 */
			sVersion: DataTable.version
		};
		
		
		//
		// Backwards compatibility. Alias to pre 1.10 Hungarian notation counter parts
		//
		$.extend( _ext, {
			afnFiltering: _ext.search,
			aTypes:       _ext.type.detect,
			ofnSearch:    _ext.type.search,
			oSort:        _ext.type.order,
			afnSortData:  _ext.order,
			aoFeatures:   _ext.feature,
			oApi:         _ext.internal,
			oStdClasses:  _ext.classes,
			oPagination:  _ext.pager
		} );
		
		
		$.extend( DataTable.ext.classes, {
			"sTable": "dataTable",
			"sNoFooter": "no-footer",
		
			/* Paging buttons */
			"sPageButton": "paginate_button",
			"sPageButtonActive": "current",
			"sPageButtonDisabled": "disabled",
		
			/* Striping classes */
			"sStripeOdd": "odd",
			"sStripeEven": "even",
		
			/* Empty row */
			"sRowEmpty": "dataTables_empty",
		
			/* Features */
			"sWrapper": "dataTables_wrapper",
			"sFilter": "dataTables_filter",
			"sInfo": "dataTables_info",
			"sPaging": "dataTables_paginate paging_", /* Note that the type is postfixed */
			"sLength": "dataTables_length",
			"sProcessing": "dataTables_processing",
		
			/* Sorting */
			"sSortAsc": "sorting_asc",
			"sSortDesc": "sorting_desc",
			"sSortable": "sorting", /* Sortable in both directions */
			"sSortableAsc": "sorting_desc_disabled",
			"sSortableDesc": "sorting_asc_disabled",
			"sSortableNone": "sorting_disabled",
			"sSortColumn": "sorting_", /* Note that an int is postfixed for the sorting order */
		
			/* Filtering */
			"sFilterInput": "",
		
			/* Page length */
			"sLengthSelect": "",
		
			/* Scrolling */
			"sScrollWrapper": "dataTables_scroll",
			"sScrollHead": "dataTables_scrollHead",
			"sScrollHeadInner": "dataTables_scrollHeadInner",
			"sScrollBody": "dataTables_scrollBody",
			"sScrollFoot": "dataTables_scrollFoot",
			"sScrollFootInner": "dataTables_scrollFootInner",
		
			/* Misc */
			"sHeaderTH": "",
			"sFooterTH": "",
		
			// Deprecated
			"sSortJUIAsc": "",
			"sSortJUIDesc": "",
			"sSortJUI": "",
			"sSortJUIAscAllowed": "",
			"sSortJUIDescAllowed": "",
			"sSortJUIWrapper": "",
			"sSortIcon": "",
			"sJUIHeader": "",
			"sJUIFooter": ""
		} );
		
		
		var extPagination = DataTable.ext.pager;
		
		function _numbers ( page, pages ) {
			var
				numbers = [],
				buttons = extPagination.numbers_length,
				half = Math.floor( buttons / 2 ),
				i = 1;
		
			if ( pages <= buttons ) {
				numbers = _range( 0, pages );
			}
			else if ( page <= half ) {
				numbers = _range( 0, buttons-2 );
				numbers.push( 'ellipsis' );
				numbers.push( pages-1 );
			}
			else if ( page >= pages - 1 - half ) {
				numbers = _range( pages-(buttons-2), pages );
				numbers.splice( 0, 0, 'ellipsis' ); // no unshift in ie6
				numbers.splice( 0, 0, 0 );
			}
			else {
				numbers = _range( page-half+2, page+half-1 );
				numbers.push( 'ellipsis' );
				numbers.push( pages-1 );
				numbers.splice( 0, 0, 'ellipsis' );
				numbers.splice( 0, 0, 0 );
			}
		
			numbers.DT_el = 'span';
			return numbers;
		}
		
		
		$.extend( extPagination, {
			simple: function ( page, pages ) {
				return [ 'previous', 'next' ];
			},
		
			full: function ( page, pages ) {
				return [  'first', 'previous', 'next', 'last' ];
			},
		
			numbers: function ( page, pages ) {
				return [ _numbers(page, pages) ];
			},
		
			simple_numbers: function ( page, pages ) {
				return [ 'previous', _numbers(page, pages), 'next' ];
			},
		
			full_numbers: function ( page, pages ) {
				return [ 'first', 'previous', _numbers(page, pages), 'next', 'last' ];
			},
			
			first_last_numbers: function (page, pages) {
		 		return ['first', _numbers(page, pages), 'last'];
		 	},
		
			// For testing and plug-ins to use
			_numbers: _numbers,
		
			// Number of number buttons (including ellipsis) to show. _Must be odd!_
			numbers_length: 7
		} );
		
		
		$.extend( true, DataTable.ext.renderer, {
			pageButton: {
				_: function ( settings, host, idx, buttons, page, pages ) {
					var classes = settings.oClasses;
					var lang = settings.oLanguage.oPaginate;
					var aria = settings.oLanguage.oAria.paginate || {};
					var btnDisplay, btnClass, counter=0;
		
					var attach = function( container, buttons ) {
						var i, ien, node, button, tabIndex;
						var disabledClass = classes.sPageButtonDisabled;
						var clickHandler = function ( e ) {
							_fnPageChange( settings, e.data.action, true );
						};
		
						for ( i=0, ien=buttons.length ; i<ien ; i++ ) {
							button = buttons[i];
		
							if ( Array.isArray( button ) ) {
								var inner = $( '<'+(button.DT_el || 'div')+'/>' )
									.appendTo( container );
								attach( inner, button );
							}
							else {
								btnDisplay = null;
								btnClass = button;
								tabIndex = settings.iTabIndex;
		
								switch ( button ) {
									case 'ellipsis':
										container.append('<span class="ellipsis">&#x2026;</span>');
										break;
		
									case 'first':
										btnDisplay = lang.sFirst;
		
										if ( page === 0 ) {
											tabIndex = -1;
											btnClass += ' ' + disabledClass;
										}
										break;
		
									case 'previous':
										btnDisplay = lang.sPrevious;
		
										if ( page === 0 ) {
											tabIndex = -1;
											btnClass += ' ' + disabledClass;
										}
										break;
		
									case 'next':
										btnDisplay = lang.sNext;
		
										if ( pages === 0 || page === pages-1 ) {
											tabIndex = -1;
											btnClass += ' ' + disabledClass;
										}
										break;
		
									case 'last':
										btnDisplay = lang.sLast;
		
										if ( pages === 0 || page === pages-1 ) {
											tabIndex = -1;
											btnClass += ' ' + disabledClass;
										}
										break;
		
									default:
										btnDisplay = settings.fnFormatNumber( button + 1 );
										btnClass = page === button ?
											classes.sPageButtonActive : '';
										break;
								}
		
								if ( btnDisplay !== null ) {
									node = $('<a>', {
											'class': classes.sPageButton+' '+btnClass,
											'aria-controls': settings.sTableId,
											'aria-label': aria[ button ],
											'data-dt-idx': counter,
											'tabindex': tabIndex,
											'id': idx === 0 && typeof button === 'string' ?
												settings.sTableId +'_'+ button :
												null
										} )
										.html( btnDisplay )
										.appendTo( container );
		
									_fnBindAction(
										node, {action: button}, clickHandler
									);
		
									counter++;
								}
							}
						}
					};
		
					// IE9 throws an 'unknown error' if document.activeElement is used
					// inside an iframe or frame. Try / catch the error. Not good for
					// accessibility, but neither are frames.
					var activeEl;
		
					try {
						// Because this approach is destroying and recreating the paging
						// elements, focus is lost on the select button which is bad for
						// accessibility. So we want to restore focus once the draw has
						// completed
						activeEl = $(host).find(document.activeElement).data('dt-idx');
					}
					catch (e) {}
		
					attach( $(host).empty(), buttons );
		
					if ( activeEl !== undefined ) {
						$(host).find( '[data-dt-idx='+activeEl+']' ).trigger('focus');
					}
				}
			}
		} );
		
		
		
		// Built in type detection. See model.ext.aTypes for information about
		// what is required from this methods.
		$.extend( DataTable.ext.type.detect, [
			// Plain numbers - first since V8 detects some plain numbers as dates
			// e.g. Date.parse('55') (but not all, e.g. Date.parse('22')...).
			function ( d, settings )
			{
				var decimal = settings.oLanguage.sDecimal;
				return _isNumber( d, decimal ) ? 'num'+decimal : null;
			},
		
			// Dates (only those recognised by the browser's Date.parse)
			function ( d, settings )
			{
				// V8 tries _very_ hard to make a string passed into `Date.parse()`
				// valid, so we need to use a regex to restrict date formats. Use a
				// plug-in for anything other than ISO8601 style strings
				if ( d && !(d instanceof Date) && ! _re_date.test(d) ) {
					return null;
				}
				var parsed = Date.parse(d);
				return (parsed !== null && !isNaN(parsed)) || _empty(d) ? 'date' : null;
			},
		
			// Formatted numbers
			function ( d, settings )
			{
				var decimal = settings.oLanguage.sDecimal;
				return _isNumber( d, decimal, true ) ? 'num-fmt'+decimal : null;
			},
		
			// HTML numeric
			function ( d, settings )
			{
				var decimal = settings.oLanguage.sDecimal;
				return _htmlNumeric( d, decimal ) ? 'html-num'+decimal : null;
			},
		
			// HTML numeric, formatted
			function ( d, settings )
			{
				var decimal = settings.oLanguage.sDecimal;
				return _htmlNumeric( d, decimal, true ) ? 'html-num-fmt'+decimal : null;
			},
		
			// HTML (this is strict checking - there must be html)
			function ( d, settings )
			{
				return _empty( d ) || (typeof d === 'string' && d.indexOf('<') !== -1) ?
					'html' : null;
			}
		] );
		
		
		
		// Filter formatting functions. See model.ext.ofnSearch for information about
		// what is required from these methods.
		// 
		// Note that additional search methods are added for the html numbers and
		// html formatted numbers by `_addNumericSort()` when we know what the decimal
		// place is
		
		
		$.extend( DataTable.ext.type.search, {
			html: function ( data ) {
				return _empty(data) ?
					data :
					typeof data === 'string' ?
						data
							.replace( _re_new_lines, " " )
							.replace( _re_html, "" ) :
						'';
			},
		
			string: function ( data ) {
				return _empty(data) ?
					data :
					typeof data === 'string' ?
						data.replace( _re_new_lines, " " ) :
						data;
			}
		} );
		
		
		
		var __numericReplace = function ( d, decimalPlace, re1, re2 ) {
			if ( d !== 0 && (!d || d === '-') ) {
				return -Infinity;
			}
		
			// If a decimal place other than `.` is used, it needs to be given to the
			// function so we can detect it and replace with a `.` which is the only
			// decimal place Javascript recognises - it is not locale aware.
			if ( decimalPlace ) {
				d = _numToDecimal( d, decimalPlace );
			}
		
			if ( d.replace ) {
				if ( re1 ) {
					d = d.replace( re1, '' );
				}
		
				if ( re2 ) {
					d = d.replace( re2, '' );
				}
			}
		
			return d * 1;
		};
		
		
		// Add the numeric 'deformatting' functions for sorting and search. This is done
		// in a function to provide an easy ability for the language options to add
		// additional methods if a non-period decimal place is used.
		function _addNumericSort ( decimalPlace ) {
			$.each(
				{
					// Plain numbers
					"num": function ( d ) {
						return __numericReplace( d, decimalPlace );
					},
		
					// Formatted numbers
					"num-fmt": function ( d ) {
						return __numericReplace( d, decimalPlace, _re_formatted_numeric );
					},
		
					// HTML numeric
					"html-num": function ( d ) {
						return __numericReplace( d, decimalPlace, _re_html );
					},
		
					// HTML numeric, formatted
					"html-num-fmt": function ( d ) {
						return __numericReplace( d, decimalPlace, _re_html, _re_formatted_numeric );
					}
				},
				function ( key, fn ) {
					// Add the ordering method
					_ext.type.order[ key+decimalPlace+'-pre' ] = fn;
		
					// For HTML types add a search formatter that will strip the HTML
					if ( key.match(/^html\-/) ) {
						_ext.type.search[ key+decimalPlace ] = _ext.type.search.html;
					}
				}
			);
		}
		
		
		// Default sort methods
		$.extend( _ext.type.order, {
			// Dates
			"date-pre": function ( d ) {
				var ts = Date.parse( d );
				return isNaN(ts) ? -Infinity : ts;
			},
		
			// html
			"html-pre": function ( a ) {
				return _empty(a) ?
					'' :
					a.replace ?
						a.replace( /<.*?>/g, "" ).toLowerCase() :
						a+'';
			},
		
			// string
			"string-pre": function ( a ) {
				// This is a little complex, but faster than always calling toString,
				// http://jsperf.com/tostring-v-check
				return _empty(a) ?
					'' :
					typeof a === 'string' ?
						a.toLowerCase() :
						! a.toString ?
							'' :
							a.toString();
			},
		
			// string-asc and -desc are retained only for compatibility with the old
			// sort methods
			"string-asc": function ( x, y ) {
				return ((x < y) ? -1 : ((x > y) ? 1 : 0));
			},
		
			"string-desc": function ( x, y ) {
				return ((x < y) ? 1 : ((x > y) ? -1 : 0));
			}
		} );
		
		
		// Numeric sorting types - order doesn't matter here
		_addNumericSort( '' );
		
		
		$.extend( true, DataTable.ext.renderer, {
			header: {
				_: function ( settings, cell, column, classes ) {
					// No additional mark-up required
					// Attach a sort listener to update on sort - note that using the
					// `DT` namespace will allow the event to be removed automatically
					// on destroy, while the `dt` namespaced event is the one we are
					// listening for
					$(settings.nTable).on( 'order.dt.DT', function ( e, ctx, sorting, columns ) {
						if ( settings !== ctx ) { // need to check this this is the host
							return;               // table, not a nested one
						}
		
						var colIdx = column.idx;
		
						cell
							.removeClass(
								classes.sSortAsc +' '+
								classes.sSortDesc
							)
							.addClass( columns[ colIdx ] == 'asc' ?
								classes.sSortAsc : columns[ colIdx ] == 'desc' ?
									classes.sSortDesc :
									column.sSortingClass
							);
					} );
				},
		
				jqueryui: function ( settings, cell, column, classes ) {
					$('<div/>')
						.addClass( classes.sSortJUIWrapper )
						.append( cell.contents() )
						.append( $('<span/>')
							.addClass( classes.sSortIcon+' '+column.sSortingClassJUI )
						)
						.appendTo( cell );
		
					// Attach a sort listener to update on sort
					$(settings.nTable).on( 'order.dt.DT', function ( e, ctx, sorting, columns ) {
						if ( settings !== ctx ) {
							return;
						}
		
						var colIdx = column.idx;
		
						cell
							.removeClass( classes.sSortAsc +" "+classes.sSortDesc )
							.addClass( columns[ colIdx ] == 'asc' ?
								classes.sSortAsc : columns[ colIdx ] == 'desc' ?
									classes.sSortDesc :
									column.sSortingClass
							);
		
						cell
							.find( 'span.'+classes.sSortIcon )
							.removeClass(
								classes.sSortJUIAsc +" "+
								classes.sSortJUIDesc +" "+
								classes.sSortJUI +" "+
								classes.sSortJUIAscAllowed +" "+
								classes.sSortJUIDescAllowed
							)
							.addClass( columns[ colIdx ] == 'asc' ?
								classes.sSortJUIAsc : columns[ colIdx ] == 'desc' ?
									classes.sSortJUIDesc :
									column.sSortingClassJUI
							);
					} );
				}
			}
		} );
		
		/*
		 * Public helper functions. These aren't used internally by DataTables, or
		 * called by any of the options passed into DataTables, but they can be used
		 * externally by developers working with DataTables. They are helper functions
		 * to make working with DataTables a little bit easier.
		 */
		
		var __htmlEscapeEntities = function ( d ) {
			if (Array.isArray(d)) {
				d = d.join(',');
			}
		
			return typeof d === 'string' ?
				d
					.replace(/&/g, '&amp;')
					.replace(/</g, '&lt;')
					.replace(/>/g, '&gt;')
					.replace(/"/g, '&quot;') :
				d;
		};
		
		/**
		 * Helpers for `columns.render`.
		 *
		 * The options defined here can be used with the `columns.render` initialisation
		 * option to provide a display renderer. The following functions are defined:
		 *
		 * * `number` - Will format numeric data (defined by `columns.data`) for
		 *   display, retaining the original unformatted data for sorting and filtering.
		 *   It takes 5 parameters:
		 *   * `string` - Thousands grouping separator
		 *   * `string` - Decimal point indicator
		 *   * `integer` - Number of decimal points to show
		 *   * `string` (optional) - Prefix.
		 *   * `string` (optional) - Postfix (/suffix).
		 * * `text` - Escape HTML to help prevent XSS attacks. It has no optional
		 *   parameters.
		 *
		 * @example
		 *   // Column definition using the number renderer
		 *   {
		 *     data: "salary",
		 *     render: $.fn.dataTable.render.number( '\'', '.', 0, '$' )
		 *   }
		 *
		 * @namespace
		 */
		DataTable.render = {
			number: function ( thousands, decimal, precision, prefix, postfix ) {
				return {
					display: function ( d ) {
						if ( typeof d !== 'number' && typeof d !== 'string' ) {
							return d;
						}
		
						var negative = d < 0 ? '-' : '';
						var flo = parseFloat( d );
		
						// If NaN then there isn't much formatting that we can do - just
						// return immediately, escaping any HTML (this was supposed to
						// be a number after all)
						if ( isNaN( flo ) ) {
							return __htmlEscapeEntities( d );
						}
		
						flo = flo.toFixed( precision );
						d = Math.abs( flo );
		
						var intPart = parseInt( d, 10 );
						var floatPart = precision ?
							decimal+(d - intPart).toFixed( precision ).substring( 2 ):
							'';
		
						// If zero, then can't have a negative prefix
						if (intPart === 0 && parseFloat(floatPart) === 0) {
							negative = '';
						}
		
						return negative + (prefix||'') +
							intPart.toString().replace(
								/\B(?=(\d{3})+(?!\d))/g, thousands
							) +
							floatPart +
							(postfix||'');
					}
				};
			},
		
			text: function () {
				return {
					display: __htmlEscapeEntities,
					filter: __htmlEscapeEntities
				};
			}
		};
		
		
		/*
		 * This is really a good bit rubbish this method of exposing the internal methods
		 * publicly... - To be fixed in 2.0 using methods on the prototype
		 */
		
		
		/**
		 * Create a wrapper function for exporting an internal functions to an external API.
		 *  @param {string} fn API function name
		 *  @returns {function} wrapped function
		 *  @memberof DataTable#internal
		 */
		function _fnExternApiFunc (fn)
		{
			return function() {
				var args = [_fnSettingsFromNode( this[DataTable.ext.iApiIndex] )].concat(
					Array.prototype.slice.call(arguments)
				);
				return DataTable.ext.internal[fn].apply( this, args );
			};
		}
		
		
		/**
		 * Reference to internal functions for use by plug-in developers. Note that
		 * these methods are references to internal functions and are considered to be
		 * private. If you use these methods, be aware that they are liable to change
		 * between versions.
		 *  @namespace
		 */
		$.extend( DataTable.ext.internal, {
			_fnExternApiFunc: _fnExternApiFunc,
			_fnBuildAjax: _fnBuildAjax,
			_fnAjaxUpdate: _fnAjaxUpdate,
			_fnAjaxParameters: _fnAjaxParameters,
			_fnAjaxUpdateDraw: _fnAjaxUpdateDraw,
			_fnAjaxDataSrc: _fnAjaxDataSrc,
			_fnAddColumn: _fnAddColumn,
			_fnColumnOptions: _fnColumnOptions,
			_fnAdjustColumnSizing: _fnAdjustColumnSizing,
			_fnVisibleToColumnIndex: _fnVisibleToColumnIndex,
			_fnColumnIndexToVisible: _fnColumnIndexToVisible,
			_fnVisbleColumns: _fnVisbleColumns,
			_fnGetColumns: _fnGetColumns,
			_fnColumnTypes: _fnColumnTypes,
			_fnApplyColumnDefs: _fnApplyColumnDefs,
			_fnHungarianMap: _fnHungarianMap,
			_fnCamelToHungarian: _fnCamelToHungarian,
			_fnLanguageCompat: _fnLanguageCompat,
			_fnBrowserDetect: _fnBrowserDetect,
			_fnAddData: _fnAddData,
			_fnAddTr: _fnAddTr,
			_fnNodeToDataIndex: _fnNodeToDataIndex,
			_fnNodeToColumnIndex: _fnNodeToColumnIndex,
			_fnGetCellData: _fnGetCellData,
			_fnSetCellData: _fnSetCellData,
			_fnSplitObjNotation: _fnSplitObjNotation,
			_fnGetObjectDataFn: _fnGetObjectDataFn,
			_fnSetObjectDataFn: _fnSetObjectDataFn,
			_fnGetDataMaster: _fnGetDataMaster,
			_fnClearTable: _fnClearTable,
			_fnDeleteIndex: _fnDeleteIndex,
			_fnInvalidate: _fnInvalidate,
			_fnGetRowElements: _fnGetRowElements,
			_fnCreateTr: _fnCreateTr,
			_fnBuildHead: _fnBuildHead,
			_fnDrawHead: _fnDrawHead,
			_fnDraw: _fnDraw,
			_fnReDraw: _fnReDraw,
			_fnAddOptionsHtml: _fnAddOptionsHtml,
			_fnDetectHeader: _fnDetectHeader,
			_fnGetUniqueThs: _fnGetUniqueThs,
			_fnFeatureHtmlFilter: _fnFeatureHtmlFilter,
			_fnFilterComplete: _fnFilterComplete,
			_fnFilterCustom: _fnFilterCustom,
			_fnFilterColumn: _fnFilterColumn,
			_fnFilter: _fnFilter,
			_fnFilterCreateSearch: _fnFilterCreateSearch,
			_fnEscapeRegex: _fnEscapeRegex,
			_fnFilterData: _fnFilterData,
			_fnFeatureHtmlInfo: _fnFeatureHtmlInfo,
			_fnUpdateInfo: _fnUpdateInfo,
			_fnInfoMacros: _fnInfoMacros,
			_fnInitialise: _fnInitialise,
			_fnInitComplete: _fnInitComplete,
			_fnLengthChange: _fnLengthChange,
			_fnFeatureHtmlLength: _fnFeatureHtmlLength,
			_fnFeatureHtmlPaginate: _fnFeatureHtmlPaginate,
			_fnPageChange: _fnPageChange,
			_fnFeatureHtmlProcessing: _fnFeatureHtmlProcessing,
			_fnProcessingDisplay: _fnProcessingDisplay,
			_fnFeatureHtmlTable: _fnFeatureHtmlTable,
			_fnScrollDraw: _fnScrollDraw,
			_fnApplyToChildren: _fnApplyToChildren,
			_fnCalculateColumnWidths: _fnCalculateColumnWidths,
			_fnThrottle: _fnThrottle,
			_fnConvertToWidth: _fnConvertToWidth,
			_fnGetWidestNode: _fnGetWidestNode,
			_fnGetMaxLenString: _fnGetMaxLenString,
			_fnStringToCss: _fnStringToCss,
			_fnSortFlatten: _fnSortFlatten,
			_fnSort: _fnSort,
			_fnSortAria: _fnSortAria,
			_fnSortListener: _fnSortListener,
			_fnSortAttachListener: _fnSortAttachListener,
			_fnSortingClasses: _fnSortingClasses,
			_fnSortData: _fnSortData,
			_fnSaveState: _fnSaveState,
			_fnLoadState: _fnLoadState,
			_fnImplementState: _fnImplementState,
			_fnSettingsFromNode: _fnSettingsFromNode,
			_fnLog: _fnLog,
			_fnMap: _fnMap,
			_fnBindAction: _fnBindAction,
			_fnCallbackReg: _fnCallbackReg,
			_fnCallbackFire: _fnCallbackFire,
			_fnLengthOverflow: _fnLengthOverflow,
			_fnRenderer: _fnRenderer,
			_fnDataSource: _fnDataSource,
			_fnRowAttributes: _fnRowAttributes,
			_fnExtend: _fnExtend,
			_fnCalculateEnd: function () {} // Used by a lot of plug-ins, but redundant
			                                // in 1.10, so this dead-end function is
			                                // added to prevent errors
		} );
		
		
		// jQuery access
		$.fn.dataTable = DataTable;
		
		// Provide access to the host jQuery object (circular reference)
		DataTable.$ = $;
		
		// Legacy aliases
		$.fn.dataTableSettings = DataTable.settings;
		$.fn.dataTableExt = DataTable.ext;
		
		// With a capital `D` we return a DataTables API instance rather than a
		// jQuery object
		$.fn.DataTable = function ( opts ) {
			return $(this).dataTable( opts ).api();
		};
		
		// All properties that are available to $.fn.dataTable should also be
		// available on $.fn.DataTable
		$.each( DataTable, function ( prop, val ) {
			$.fn.DataTable[ prop ] = val;
		} );
	
		return DataTable;
}));


/*! DataTables Bootstrap 5 integration
 * 2020 SpryMedia Ltd - datatables.net/license
 */

/**
 * DataTables integration for Bootstrap 4. This requires Bootstrap 5 and
 * DataTables 1.10 or newer.
 *
 * This file sets the defaults and adds options to DataTables to style its
 * controls using Bootstrap. See http://datatables.net/manual/styling/bootstrap
 * for further information.
 */
(function( factory ){
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery', 'datatables.net'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = function (root, $) {
			if ( ! root ) {
				root = window;
			}

			if ( ! $ || ! $.fn.dataTable ) {
				// Require DataTables, which attaches to jQuery, including
				// jQuery if needed and have a $ property so we can access the
				// jQuery object that is used
				$ = require('datatables.net')(root, $).$;
			}

			return factory( $, root, root.document );
		};
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}(function( $, window, document, undefined ) {
'use strict';
var DataTable = $.fn.dataTable;


/* Set the defaults for DataTables initialisation */
$.extend( true, DataTable.defaults, {
	dom:
		"<'row'<'col-sm-12 col-md-6'l><'col-sm-12 col-md-6'f>>" +
		"<'row'<'col-sm-12'tr>>" +
		"<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
	renderer: 'bootstrap'
} );


/* Default class modification */
$.extend( DataTable.ext.classes, {
	sWrapper:      "dataTables_wrapper dt-bootstrap5",
	sFilterInput:  "form-control form-control-sm",
	sLengthSelect: "form-select form-select-sm",
	sProcessing:   "dataTables_processing card",
	sPageButton:   "paginate_button page-item"
} );


/* Bootstrap paging button renderer */
DataTable.ext.renderer.pageButton.bootstrap = function ( settings, host, idx, buttons, page, pages ) {
	var api     = new DataTable.Api( settings );
	var classes = settings.oClasses;
	var lang    = settings.oLanguage.oPaginate;
	var aria = settings.oLanguage.oAria.paginate || {};
	var btnDisplay, btnClass, counter=0;

	var attach = function( container, buttons ) {
		var i, ien, node, button;
		var clickHandler = function ( e ) {
			e.preventDefault();
			if ( !$(e.currentTarget).hasClass('disabled') && api.page() != e.data.action ) {
				api.page( e.data.action ).draw( 'page' );
			}
		};

		for ( i=0, ien=buttons.length ; i<ien ; i++ ) {
			button = buttons[i];

			if ( Array.isArray( button ) ) {
				attach( container, button );
			}
			else {
				btnDisplay = '';
				btnClass = '';

				switch ( button ) {
					case 'ellipsis':
						btnDisplay = '&#x2026;';
						btnClass = 'disabled';
						break;

					case 'first':
						btnDisplay = lang.sFirst;
						btnClass = button + (page > 0 ?
							'' : ' disabled');
						break;

					case 'previous':
						btnDisplay = lang.sPrevious;
						btnClass = button + (page > 0 ?
							'' : ' disabled');
						break;

					case 'next':
						btnDisplay = lang.sNext;
						btnClass = button + (page < pages-1 ?
							'' : ' disabled');
						break;

					case 'last':
						btnDisplay = lang.sLast;
						btnClass = button + (page < pages-1 ?
							'' : ' disabled');
						break;

					default:
						btnDisplay = button + 1;
						btnClass = page === button ?
							'active' : '';
						break;
				}

				if ( btnDisplay ) {
					node = $('<li>', {
							'class': classes.sPageButton+' '+btnClass,
							'id': idx === 0 && typeof button === 'string' ?
								settings.sTableId +'_'+ button :
								null
						} )
						.append( $('<a>', {
								'href': '#',
								'aria-controls': settings.sTableId,
								'aria-label': aria[ button ],
								'data-dt-idx': counter,
								'tabindex': settings.iTabIndex,
								'class': 'page-link'
							} )
							.html( btnDisplay )
						)
						.appendTo( container );

					settings.oApi._fnBindAction(
						node, {action: button}, clickHandler
					);

					counter++;
				}
			}
		}
	};

	// IE9 throws an 'unknown error' if document.activeElement is used
	// inside an iframe or frame. 
	var activeEl;

	try {
		// Because this approach is destroying and recreating the paging
		// elements, focus is lost on the select button which is bad for
		// accessibility. So we want to restore focus once the draw has
		// completed
		activeEl = $(host).find(document.activeElement).data('dt-idx');
	}
	catch (e) {}

	attach(
		$(host).empty().html('<ul class="pagination"/>').children('ul'),
		buttons
	);

	if ( activeEl !== undefined ) {
		$(host).find( '[data-dt-idx='+activeEl+']' ).trigger('focus');
	}
};


return DataTable;
}));


/*!
 * File:        dataTables.editor.min.js
 * Version:     2.0.7
 * Author:      SpryMedia (www.sprymedia.co.uk)
 * Info:        http://editor.datatables.net
 * 
 * Copyright 2012-2022 SpryMedia Limited, all rights reserved.
 * License: DataTables Editor - http://editor.datatables.net/license
 */

 // Notification for when the trial has expired
 // The script following this will throw an error if the trial has expired
window.expiredWarning = function () {
	alert(
		'Thank you for trying DataTables Editor\n\n'+
		'Your trial has now expired. To purchase a license '+
		'for Editor, please see https://editor.datatables.net/purchase'
	);
};

(function(){b1NbC[551318]=(function(){var p=2;for(;p !== 9;){switch(p){case 2:p=typeof globalThis === '\u006f\x62\x6a\u0065\x63\x74'?1:5;break;case 1:return globalThis;break;case 5:var P;try{var u=2;for(;u !== 6;){switch(u){case 3:throw "";u=9;break;case 4:u=typeof T0Wmf === '\x75\u006e\u0064\u0065\x66\x69\x6e\u0065\u0064'?3:9;break;case 9:delete P['\u0054\x30\x57\x6d\u0066'];var w=Object['\x70\x72\x6f\u0074\x6f\x74\u0079\u0070\x65'];delete w['\u0044\x76\u0051\u005a\u004e'];u=6;break;case 1:P=DvQZN;P['\u0054\u0030\u0057\u006d\x66']=P;u=4;break;case 2:Object['\x64\x65\u0066\u0069\u006e\x65\x50\x72\x6f\x70\x65\u0072\u0074\u0079'](Object['\u0070\x72\x6f\x74\x6f\x74\x79\x70\x65'],'\x44\u0076\x51\x5a\x4e',{'\x67\x65\x74':function(){var E=2;for(;E !== 1;){switch(E){case 2:return this;break;}}},'\x63\x6f\x6e\x66\x69\x67\x75\x72\x61\x62\x6c\x65':true});u=1;break;}}}catch(S){P=window;}return P;break;}}})();U4m(b1NbC[551318]);function U4m(e4z){function Z9g(d6Z){var S0i=2;for(;S0i !== 5;){switch(S0i){case 2:var Q8o=[arguments];return Q8o[0][0];break;}}}function P9F(G4_){var q5N=2;for(;q5N !== 5;){switch(q5N){case 2:var L5J=[arguments];return L5J[0][0].Array;break;}}}var Q$i=2;for(;Q$i !== 98;){switch(Q$i){case 3:R3s[2]="zW";R3s[7]="";R3s[7]="s";R3s[3]="H$";R3s[1]="";Q$i=14;break;case 2:var R3s=[arguments];R3s[9]="";R3s[9]="Jc";R3s[2]="";Q$i=3;break;case 23:R3s[25]="ra";R3s[64]="";R3s[64]="__abst";R3s[42]="ct";Q$i=34;break;case 67:R3s[24]=R3s[6];R3s[24]+=R3s[1];R3s[24]+=R3s[34];R3s[33]=R3s[56];R3s[33]+=R3s[8];R3s[33]+=R3s[66];R3s[55]=R3s[5];Q$i=85;break;case 52:R3s[60]="g";R3s[40]="";R3s[40]="A";R3s[66]="D";Q$i=48;break;case 34:R3s[91]="";R3s[91]="p";R3s[79]="";R3s[79]="MV";Q$i=30;break;case 100:n7e(Z9g,R3s[11],R3s[29],R3s[14]);Q$i=99;break;case 99:n7e(z2A,"apply",R3s[36],R3s[28]);Q$i=98;break;case 48:R3s[31]="";R3s[31]="Y2D7";R3s[36]=1;R3s[29]=0;R3s[28]=R3s[31];R3s[28]+=R3s[40];Q$i=63;break;case 85:R3s[55]+=R3s[7];R3s[55]+=R3s[2];R3s[18]=R3s[3];R3s[18]+=R3s[9];R3s[18]+=R3s[87];Q$i=80;break;case 103:n7e(Z9g,R3s[24],R3s[29],R3s[78]);Q$i=102;break;case 104:n7e(z5u,"test",R3s[36],R3s[33]);Q$i=103;break;case 79:n7e(S2K,"replace",R3s[36],R3s[18]);Q$i=78;break;case 63:R3s[28]+=R3s[66];R3s[14]=R3s[60];R3s[14]+=R3s[82];R3s[14]+=R3s[16];R3s[11]=R3s[87];R3s[11]+=R3s[94];R3s[11]+=R3s[63];Q$i=56;break;case 78:n7e(P9F,"map",R3s[36],R3s[55]);Q$i=104;break;case 71:R3s[51]+=R3s[42];R3s[78]=R3s[21];R3s[78]+=R3s[34];R3s[78]+=R3s[4];Q$i=67;break;case 14:R3s[1]="dua";R3s[5]="C8";R3s[6]="";R3s[6]="";Q$i=10;break;case 27:R3s[21]="j$";R3s[34]="l";R3s[25]="";R3s[25]="";Q$i=23;break;case 30:R3s[63]="";R3s[13]="IHa";R3s[80]="T$";R3s[23]="2";Q$i=43;break;case 56:R3s[96]=R3s[80];R3s[96]+=R3s[13];R3s[96]+=R3s[23];R3s[93]=R3s[95];Q$i=75;break;case 39:R3s[16]="";R3s[16]="frq";R3s[82]="";R3s[87]="_";R3s[82]="0Y";R3s[60]="";Q$i=52;break;case 80:var n7e=function(k9Q,b3o,R3b,s0p){var r2g=2;for(;r2g !== 5;){switch(r2g){case 2:var v6u=[arguments];k_2(R3s[0][0],v6u[0][0],v6u[0][1],v6u[0][2],v6u[0][3]);r2g=5;break;}}};Q$i=79;break;case 10:R3s[6]="__resi";R3s[4]="";R3s[4]="cC";R3s[8]="O";R3s[21]="";R3s[21]="";R3s[56]="a3j";Q$i=27;break;case 43:R3s[95]="L9F";R3s[63]="e";R3s[94]="";R3s[94]="_optimiz";Q$i=39;break;case 75:R3s[93]+=R3s[79];R3s[93]+=R3s[91];R3s[51]=R3s[64];R3s[51]+=R3s[25];Q$i=71;break;case 102:n7e(Z9g,R3s[51],R3s[29],R3s[93]);Q$i=101;break;case 101:n7e(P9F,"push",R3s[36],R3s[96]);Q$i=100;break;}}function z2A(x0f){var O_4=2;for(;O_4 !== 5;){switch(O_4){case 2:var q7_=[arguments];return q7_[0][0].Function;break;}}}function S2K(m8L){var J6s=2;for(;J6s !== 5;){switch(J6s){case 2:var E2V=[arguments];return E2V[0][0].String;break;}}}function z5u(Z57){var g17=2;for(;g17 !== 5;){switch(g17){case 2:var b3b=[arguments];return b3b[0][0].RegExp;break;}}}function k_2(w2J,Z7p,F4l,D5G,R5Q){var V0s=2;for(;V0s !== 6;){switch(V0s){case 2:var G57=[arguments];G57[8]="";G57[8]="rty";G57[5]="";V0s=3;break;case 3:G57[5]="Prope";G57[9]="define";G57[7]=false;try{var U3R=2;for(;U3R !== 13;){switch(U3R){case 6:G57[4].enumerable=G57[7];try{var D_U=2;for(;D_U !== 3;){switch(D_U){case 2:G57[1]=G57[9];G57[1]+=G57[5];G57[1]+=G57[8];G57[0][0].Object[G57[1]](G57[6],G57[0][4],G57[4]);D_U=3;break;}}}catch(K_7){}U3R=13;break;case 2:G57[4]={};G57[2]=(1,G57[0][1])(G57[0][0]);G57[6]=[G57[2],G57[2].prototype][G57[0][3]];U3R=4;break;case 4:U3R=G57[6].hasOwnProperty(G57[0][4]) && G57[6][G57[0][4]] === G57[6][G57[0][2]]?3:9;break;case 3:return;break;case 9:G57[6][G57[0][4]]=G57[6][G57[0][2]];G57[4].set=function(f4j){var m3u=2;for(;m3u !== 5;){switch(m3u){case 2:var z7W=[arguments];G57[6][G57[0][2]]=z7W[0][0];m3u=5;break;}}};G57[4].get=function(){var T35=2;for(;T35 !== 12;){switch(T35){case 3:A9y[4]="n";A9y[1]="";A9y[1]="undefi";A9y[8]=A9y[1];T35=6;break;case 2:var A9y=[arguments];A9y[3]="ed";A9y[4]="";A9y[4]="";T35=3;break;case 6:A9y[8]+=A9y[4];A9y[8]+=A9y[3];return typeof G57[6][G57[0][2]] == A9y[8]?undefined:G57[6][G57[0][2]];break;}}};U3R=6;break;}}}catch(M1l){}V0s=6;break;}}}}b1NbC.h9F=function(){return typeof b1NbC[451506].y7EdDjc === 'function'?b1NbC[451506].y7EdDjc.apply(b1NbC[451506],arguments):b1NbC[451506].y7EdDjc;};b1NbC[551318].p9yy=b1NbC;b1NbC[630964]=true;b1NbC.T9=function(){return typeof b1NbC[248877].X7smerZ === 'function'?b1NbC[248877].X7smerZ.apply(b1NbC[248877],arguments):b1NbC[248877].X7smerZ;};function b1NbC(){}b1NbC[411181]=true;b1NbC[313000]=b1NbC[551318];b1NbC[490123]=794;b1NbC[556772]="Zys";b1NbC.m6=function(){return typeof b1NbC[248877].X7smerZ === 'function'?b1NbC[248877].X7smerZ.apply(b1NbC[248877],arguments):b1NbC[248877].X7smerZ;};b1NbC[451506]=(function(){var q3A=2;for(;q3A !== 9;){switch(q3A){case 2:var O5k=[arguments];O5k[5]=undefined;O5k[7]={};O5k[7].y7EdDjc=function(){var f7l=2;for(;f7l !== 145;){switch(f7l){case 25:F38[61].E8E=function(){var j6v=function(){return (![] + [])[+!+[]];};var L2h=(/\u0061/).a3jOD(j6v + []);return L2h;};F38[63]=F38[61];F38[49]={};F38[49].R9G=['x$W'];f7l=21;break;case 91:F38[7].T$IHa2(F38[5]);F38[7].T$IHa2(F38[3]);F38[7].T$IHa2(F38[45]);F38[7].T$IHa2(F38[32]);f7l=116;break;case 89:F38[83].E8E=function(){var D6U=function(){return 1024 * 1024;};var U20=(/[5-8]/).a3jOD(D6U + []);return U20;};F38[18]=F38[83];F38[92]={};F38[92].R9G=['S8I'];f7l=85;break;case 124:F38[95]=0;f7l=123;break;case 128:F38[46]=0;f7l=127;break;case 113:F38[7].T$IHa2(F38[43]);F38[7].T$IHa2(F38[63]);f7l=111;break;case 126:F38[36]=F38[7][F38[46]];try{F38[14]=F38[36][F38[57]]()?F38[15]:F38[35];}catch(n$G){F38[14]=F38[35];}f7l=124;break;case 27:F38[61]={};F38[61].R9G=['x3I','x$W'];f7l=25;break;case 39:F38[12]={};F38[12].R9G=['S8I'];F38[12].E8E=function(){var x_W=function(){if(false){console.log(1);}};var c4I=!(/\x31/).a3jOD(x_W + []);return c4I;};F38[99]=F38[12];F38[44]={};f7l=53;break;case 21:F38[49].E8E=function(){var z_O=function(){return ('aa').endsWith('a');};var j$V=(/\x74\x72\u0075\x65/).a3jOD(z_O + []);return j$V;};F38[32]=F38[49];F38[96]={};F38[96].R9G=['x3I'];f7l=32;break;case 4:F38[7]=[];F38[9]={};F38[9].R9G=['x3I'];F38[9].E8E=function(){var k8l=function(){return parseFloat(".01");};var B7I=!(/[sl]/).a3jOD(k8l + []);return B7I;};f7l=7;break;case 104:F38[40].E8E=function(){var H55=typeof g0Yfrq === 'function';return H55;};F38[98]=F38[40];F38[23]={};F38[23].R9G=['x3I'];f7l=100;break;case 116:F38[7].T$IHa2(F38[98]);F38[7].T$IHa2(F38[86]);F38[7].T$IHa2(F38[52]);f7l=113;break;case 81:F38[38].E8E=function(){function v12(z1B,T8P){return z1B + T8P;};var k$$=(/\x6f\x6e[\t\v\f\u00a0\ufeff\u2000-\u200a\u1680\u205f \r\u180e\u202f\n\u2028\u3000\u2029]{0,}\u0028/).a3jOD(v12 + []);return k$$;};F38[37]=F38[38];F38[40]={};F38[40].R9G=['X$o'];f7l=104;break;case 107:F38[7].T$IHa2(F38[79]);F38[7].T$IHa2(F38[72]);F38[7].T$IHa2(F38[37]);F38[26]=[];F38[15]='s4J';F38[35]='g4j';F38[58]='R9G';f7l=131;break;case 2:var F38=[arguments];f7l=1;break;case 47:F38[78]=F38[82];F38[69]={};F38[69].R9G=['X$o'];F38[69].E8E=function(){var Z6M=false;var m4l=[];try{for(var C_X in console){m4l.T$IHa2(C_X);}Z6M=m4l.length === 0;}catch(E1A){}var e4m=Z6M;return e4m;};F38[24]=F38[69];f7l=63;break;case 10:F38[8].R9G=['X$o'];F38[8].E8E=function(){var H4Q=typeof j$lcC === 'function';return H4Q;};F38[1]=F38[8];f7l=18;break;case 13:F38[6].E8E=function(){var D_c=function(M9B,w_V){if(M9B){return M9B;}return w_V;};var G7v=(/\x3f/).a3jOD(D_c + []);return G7v;};F38[5]=F38[6];F38[8]={};f7l=10;break;case 98:F38[7].T$IHa2(F38[24]);F38[7].T$IHa2(F38[18]);F38[7].T$IHa2(F38[1]);F38[7].T$IHa2(F38[4]);F38[7].T$IHa2(F38[78]);F38[7].T$IHa2(F38[62]);f7l=92;break;case 151:F38[95]++;f7l=123;break;case 92:F38[7].T$IHa2(F38[53]);f7l=91;break;case 60:F38[45]=F38[33];F38[73]={};F38[73].R9G=['x$W'];F38[73].E8E=function(){var K9p=function(){return ('aaaa|a').substr(0,3);};var v_K=!(/\x7c/).a3jOD(K9p + []);return v_K;};F38[43]=F38[73];f7l=55;break;case 1:f7l=O5k[5]?5:4;break;case 70:F38[75]={};F38[75].R9G=['x$W'];F38[75].E8E=function(){var W3l=function(){return ('aa').charCodeAt(1);};var s3P=(/\u0039\x37/).a3jOD(W3l + []);return s3P;};f7l=67;break;case 74:F38[48]={};F38[48].R9G=['S8I'];F38[48].E8E=function(){var s$2=function(){'use stirct';return 1;};var W_o=!(/\u0073\x74\x69\x72\x63\u0074/).a3jOD(s$2 + []);return W_o;};F38[16]=F38[48];f7l=70;break;case 149:f7l=(function(v96){var s_D=2;for(;s_D !== 22;){switch(s_D){case 14:s_D=typeof y9g[3][y9g[6][F38[50]]] === 'undefined'?13:11;break;case 13:y9g[3][y9g[6][F38[50]]]=(function(){var Y3B=2;for(;Y3B !== 9;){switch(Y3B){case 2:var M8K=[arguments];M8K[4]={};M8K[4].h=0;M8K[4].t=0;return M8K[4];break;}}}).Y2D7AD(this,arguments);s_D=12;break;case 4:y9g[3]={};y9g[2]=[];y9g[7]=0;s_D=8;break;case 16:s_D=y9g[7] < y9g[2].length?15:23;break;case 12:y9g[2].T$IHa2(y9g[6][F38[50]]);s_D=11;break;case 23:return y9g[4];break;case 24:y9g[7]++;s_D=16;break;case 20:y9g[3][y9g[6][F38[50]]].h+=true;s_D=19;break;case 10:s_D=y9g[6][F38[10]] === F38[15]?20:19;break;case 5:return;break;case 17:y9g[7]=0;s_D=16;break;case 11:y9g[3][y9g[6][F38[50]]].t+=true;s_D=10;break;case 6:y9g[6]=y9g[0][0][y9g[7]];s_D=14;break;case 1:s_D=y9g[0][0].length === 0?5:4;break;case 26:s_D=y9g[1] >= 0.5?25:24;break;case 19:y9g[7]++;s_D=7;break;case 18:y9g[4]=false;s_D=17;break;case 7:s_D=y9g[7] < y9g[0][0].length?6:18;break;case 15:y9g[5]=y9g[2][y9g[7]];y9g[1]=y9g[3][y9g[5]].h / y9g[3][y9g[5]].t;s_D=26;break;case 8:y9g[7]=0;s_D=7;break;case 25:y9g[4]=true;s_D=24;break;case 2:var y9g=[arguments];s_D=1;break;}}})(F38[26])?148:147;break;case 5:return 79;break;case 150:F38[46]++;f7l=127;break;case 67:F38[52]=F38[75];F38[83]={};F38[83].R9G=['x3I','S8I'];f7l=89;break;case 32:F38[96].E8E=function(){var E_X=function(){return [0,1,2].join('@');};var R0q=(/\u0040[3-90-2]/).a3jOD(E_X + []);return R0q;};F38[62]=F38[96];f7l=30;break;case 29:F38[70].R9G=['x3I','S8I'];F38[70].E8E=function(){var q_r=function(){return 1024 * 1024;};var H2X=(/[5-78-8]/).a3jOD(q_r + []);return H2X;};F38[72]=F38[70];f7l=43;break;case 131:F38[10]='H0X';f7l=130;break;case 147:O5k[5]=46;return 100;break;case 127:f7l=F38[46] < F38[7].length?126:149;break;case 123:f7l=F38[95] < F38[36][F38[58]].length?122:150;break;case 148:f7l=76?148:147;break;case 43:F38[88]={};F38[88].R9G=['x3I','S8I'];F38[88].E8E=function(){var w8V=function(J6O){return J6O && J6O['b'];};var I8I=(/\u002e/).a3jOD(w8V + []);return I8I;};F38[39]=F38[88];f7l=39;break;case 122:F38[25]={};F38[25][F38[50]]=F38[36][F38[58]][F38[95]];F38[25][F38[10]]=F38[14];F38[26].T$IHa2(F38[25]);f7l=151;break;case 53:F38[44].R9G=['X$o'];F38[44].E8E=function(){var Y1r=typeof L9FMVp === 'function';return Y1r;};F38[53]=F38[44];F38[82]={};F38[82].R9G=['x$W'];F38[82].E8E=function(){var Z97=function(){return decodeURIComponent('%25');};var l8W=!(/\u0032\u0035/).a3jOD(Z97 + []);return l8W;};f7l=47;break;case 55:F38[19]={};F38[19].R9G=['x$W'];F38[19].E8E=function(){var j3R=function(){return ['a','a'].join();};var H_u=!(/(\u005b|\x5d)/).a3jOD(j3R + []);return H_u;};F38[79]=F38[19];f7l=74;break;case 18:F38[2]={};F38[2].R9G=['S8I'];F38[2].E8E=function(){var a4u=function(a$e,V1g,d9U){return !!a$e?V1g:d9U;};var A1P=!(/\x21/).a3jOD(a4u + []);return A1P;};F38[4]=F38[2];f7l=27;break;case 130:F38[57]='E8E';F38[50]='Z7l';f7l=128;break;case 7:F38[3]=F38[9];F38[6]={};F38[6].R9G=['x3I'];f7l=13;break;case 111:F38[7].T$IHa2(F38[64]);F38[7].T$IHa2(F38[99]);F38[7].T$IHa2(F38[16]);F38[7].T$IHa2(F38[39]);f7l=107;break;case 100:F38[23].E8E=function(){var d0q=function(){return ("01").substring(1);};var Z9O=!(/\u0030/).a3jOD(d0q + []);return Z9O;};F38[86]=F38[23];f7l=98;break;case 85:F38[92].E8E=function(){var e$T=function(){debugger;};var s$D=!(/\u0064\u0065\u0062\x75\x67\x67\x65\x72/).a3jOD(e$T + []);return s$D;};F38[64]=F38[92];F38[38]={};F38[38].R9G=['X$o'];f7l=81;break;case 63:F38[33]={};F38[33].R9G=['x$W'];F38[33].E8E=function(){var C$Q=function(){return ('X').toLocaleLowerCase();};var K4A=(/\u0078/).a3jOD(C$Q + []);return K4A;};f7l=60;break;case 30:F38[70]={};f7l=29;break;}}};return O5k[7];break;}}})();b1NbC.g2m=function(){return typeof b1NbC[451506].y7EdDjc === 'function'?b1NbC[451506].y7EdDjc.apply(b1NbC[451506],arguments):b1NbC[451506].y7EdDjc;};b1NbC[248877]=(function(q){function B(y){var K8=2;for(;K8 !== 15;){switch(K8){case 13:x=q[7];K8=12;break;case 19:return f;break;case 6:z=A && Y(A,T);K8=14;break;case 2:var f,T,A,z,x,R,Y;K8=1;break;case 1:K8=!D--?5:4;break;case 18:K8=R >= 0?17:16;break;case 17:f=y - R > T;K8=19;break;case 9:K8=!D--?8:7;break;case 5:Y=l[q[4]];K8=4;break;case 11:R=(x || x === 0) && Y(x,T);K8=10;break;case 20:f=y - R > T && z - y > T;K8=19;break;case 4:K8=!D--?3:9;break;case 8:A=q[6];K8=7;break;case 14:K8=!D--?13:12;break;case 7:K8=!D--?6:14;break;case 10:K8=R >= 0 && z >= 0?20:18;break;case 16:f=z - y > T;K8=19;break;case 3:T=35;K8=9;break;case 12:K8=!D--?11:10;break;}}}var h$=2;for(;h$ !== 10;){switch(h$){case 5:l=b1NbC[551318];h$=4;break;case 14:q=q.C8szW(function(I){var o0=2;for(;o0 !== 13;){switch(o0){case 8:k++;o0=3;break;case 2:var Q;o0=1;break;case 5:Q='';o0=4;break;case 3:o0=k < I.length?9:7;break;case 4:var k=0;o0=3;break;case 6:return;break;case 9:Q+=l[J][b](I[k] + 94);o0=8;break;case 7:o0=!Q?6:14;break;case 14:return Q;break;case 1:o0=!D--?5:4;break;}}});h$=13;break;case 4:var b='fromCharCode',F='RegExp';h$=3;break;case 1:h$=!D--?5:4;break;case 6:h$=!D--?14:13;break;case 8:h$=!D--?7:6;break;case 13:h$=!D--?12:11;break;case 3:h$=!D--?9:8;break;case 7:J=r.H$Jc_(new l[F]("^['-|]"),'S');h$=6;break;case 2:var l,r,J,D;h$=1;break;case 9:r=typeof b;h$=8;break;case 12:var N,W=0;h$=11;break;case 11:return {X7smerZ:function(L){var C7=2;for(;C7 !== 13;){switch(C7){case 4:N=B(m);C7=3;break;case 5:C7=!D--?4:3;break;case 9:W=m + 60000;C7=8;break;case 3:C7=!D--?9:8;break;case 1:C7=m > W?5:8;break;case 2:var m=new l[q[0]]()[q[1]]();C7=1;break;case 6:(function(){var z0=2;for(;z0 !== 21;){switch(z0){case 24:return;break;case 4:var Y6="_";var Z8="1";var I0="z";var a6="Z";z0=7;break;case 22:V3[J_]=function(){};z0=21;break;case 12:J_+=a6;J_+=q0;J_+=I0;var n8=e2;z0=19;break;case 7:var J_=e2;J_+=Z8;J_+=q0;J_+=Y6;z0=12;break;case 23:try{var D9=2;for(;D9 !== 1;){switch(D9){case 2:expiredWarning();D9=1;break;}}}catch(w0){}z0=22;break;case 2:var q0="$";var e2="G";var K4=551318;z0=4;break;case 19:n8+=Z8;n8+=q0;n8+=Y6;n8+=a6;z0=15;break;case 15:n8+=q0;n8+=I0;var V3=b1NbC[K4];z0=25;break;case 25:z0=V3[n8]?24:23;break;}}})();C7=14;break;case 14:return K?N:!N;break;case 8:var K=(function(t4,X){var Y8=2;for(;Y8 !== 10;){switch(Y8){case 6:Y8=h === 0?14:12;break;case 4:X=q;Y8=3;break;case 14:w5=q3;Y8=13;break;case 2:Y8=typeof t4 === 'undefined' && typeof L !== 'undefined'?1:5;break;case 11:return w5;break;case 1:t4=L;Y8=5;break;case 9:Y8=h < t4[X[5]]?8:11;break;case 8:var N$=l[X[4]](t4[X[2]](h),16)[X[3]](2);var q3=N$[X[2]](N$[X[5]] - 1);Y8=6;break;case 3:var w5,h=0;Y8=9;break;case 13:h++;Y8=9;break;case 12:w5=w5 ^ q3;Y8=13;break;case 5:Y8=typeof X === 'undefined' && typeof q !== 'undefined'?4:3;break;}}})(undefined,undefined);C7=7;break;case 7:C7=!N?6:14;break;}}}};break;}}})([[-26,3,22,7],[9,7,22,-10,11,15,7],[5,10,3,20,-29,22],[22,17,-11,22,20,11,16,9],[18,3,20,21,7,-21,16,22],[14,7,16,9,22,10],[18,15,13,-42,-44,-39,-45,8],[16,12,-46,15,14,-38,23,18]]);b1NbC[355565]=false;b1NbC.v$=function(v0){b1NbC.g2m();if(b1NbC)return b1NbC.m6(v0);};b1NbC.k3=function(E4){b1NbC.g2m();if(b1NbC)return b1NbC.m6(E4);};b1NbC.y0=function(U2){b1NbC.h9F();if(b1NbC)return b1NbC.T9(U2);};b1NbC.m$=function(P6){b1NbC.h9F();if(b1NbC)return b1NbC.m6(P6);};b1NbC.h9F();return (function(factory){b1NbC.g2m();if(typeof define === 'function' && define.amd){define(['jquery','datatables.net'],function($){b1NbC.g2m();return factory($,window,document);});}else if(typeof exports === 'object'){module.exports=function(root,$){if(!root){root=window;}b1NbC.h9F();if(!$ || !$.fn.dataTable){$=require('datatables.net')(root,$).$;}return factory($,root,root.document);};}else {factory(jQuery,window,document);}})(function($,window,document,undefined){var g1X=b1NbC;var T06="leng";var y34="data";var W3d="bject";var J65='cell().edit()';var m2$="sh";var u4Y="tle";var C0K="empty";var Y1V="eck";var F9Q="bled";var i7J="sing";var y99='display';var n6z="cat";var u1v='div.clearValue button';var U$F="<";var t7M="fieldErrors";var U_9="r(";var x2W="editSingle";var L8k="inli";var k$v="func";var P1_="M";var m4g="conte";var j0G="tion";var s9U="outerHeight";var u6T="Fn";var N8M='disabled';var A7c="ta";var Z6q="mit";var G5_="_clos";var i7S="Pre";var M8C="fiel";var T$a="err";var F9A='inline';var k99='<div class="DTED_Envelope_Close"></div>';var t6S="lose";var H5j='December';var c9j="Labe";var W4t="x";var q33="bu";var B9g="fi";var f$O="clear";var w1$="op";var R0n="ch";var M8L="action";var N04="scrollTop";var P3U=false;var X9B="</d";var W7D="i-r";var c1C="Erro";var O$K="la";var j48="peFn";var z5O="inl";var L_o="option";var v2c="ue";var a77='create';var E3q="tab";var w3n="te";var H4k="rocessing_I";var f6v="sepa";var w$t="inpu";var I1p="tri";var s6L='rows().delete()';var o8q="isPlainObject";var J7P="e";var H2E="indexes";var M2I="filter";var D4A='July';var o_i="dataTable";var f0x="ntent";var I$d="io";var w0b="rmat";var y8H="_animate";var b68="index";var e55="row().";var R$p="apply";var F9d="to";var B9N="call";var d1m="bod";var i0H="der_Co";var N2F="cessing";var h90="ar";var u9Q="prop";var i30="label";var m6r="_crudArgs";var w0_=true;var f6r="editor";var F43='btn';var h4S="pairs";var g9P="footer";var u19='rows().edit()';var w$1='<div class="';var I_4="ve";var Q4P="<d";var e_Q="n_Edit";var a1x="inA";var N_s="drawType";var X_O="of";var E2K="setFocus";var N0d='data-editor-value';var g7q="F";var c4x="bruary";var J8K="per";var h9v="idSrc";var E$w="cl";var f4C="ose";var E8c="ass";var W4S="ro";var n8W="_displayReorder";var T2z="fie";var m3U="any";var V1c="place";var v47="trigger";var W$X="eft";var i5x="or";var Z1B="utton";var i3E="rro";var g_X='_basic';var o3$="ul";var Q3G="ateT";var Z4A="bel";var K2Z="tiple values";var X6X="ataTab";var y$H='file()';var B0B="th";var J6R='"><span></span></div>';var D7i="ct";var e0n="close";var T8c="pend";var e7E="rray";var H2f="pl";var K14="edito";var P6S='New';var X4s="is";var V_T='string';var A5l="re";var K1K="isp";var I7o="show";var Z71="g";var n4k='closed';var F76='input';var G2F="oveSingle";var T7p="w";var b30="_f";var E3b="value";var u1h="E";var W49="tons-edi";var V50='number';var S0r="Id";var A_W='September';var F97='#';var j1I="DT";var Q11="dy";var i1J="eId";var M2a="slic";var M6g="appe";var f5q="ap";var f28="_close";var I2B="unselectedValue";var q12="ngth";var y_D="i1";var m8F="pe";var e4j="_dataSource";var Y67="ow";var Q4c='none';var Z_P="editOpts";var I3y="jo";var h1z='Sun';var j2h="css";var N02="columns";var M_v="ed";var Q9I="exte";var K0i="sele";var O48="un";var t_x="removeSingle";var g$C="tor";var Q$V="formMessage";var o8z="inArray";var X47="c";var q6U="n";var e5F="_event";var x2Y="lt";var G4w="ide";var B6j="hr.d";var f5S="sel";var B_$="totype";var A1_="ditOp";var R7l="butt";var u4R="Table";var l7N="/>";var L$q="e()";var R2d="attach";var z60="move";var k9a="inp";var p59="edi";var e9o="di";var z5L="_editor_val";var N4r="ti";var U4P="fin";var i$U="uttons";var E24="multiIds";var y1n="ef";var w7E="att";var G9e="eq";var w1o="app";var v2p='">';var T$f="disp";var X0l='DT_RowId';var Y1t='DTE_Field_Type_';var u8c='submit';var L$A="ach";var M6P="hasClass";var a6m="Set";var Y38="orFie";var f5r="DTE";var S7M="up";var x6u="gt";var x8n='';var D4c="en";var F_4="_submitTable";var k7k="estroy";var z9a="_Pr";var W5p="ray";var Y0O="able";var f13='changed';var C88='title';var s_W="_s";var d5l="isM";var n0g="rep";var M$K="Undo ch";var G4C="tiInfo";var J3A="cre";var k9o=25;var z4R="E_Ac";var e7g="va";var D3L="draw";var d7k="dit";var S7m="g_Indicator";var K8D="rror";var z6e='keyless';var M3t="v>";var M2J="formInfo";var J4F="mo";var l3S="_addO";var f4b="d";var P5x='multi-info';var e1K="eac";var V5o="_a";var x0X="buttons";var r_X="sep";var f$$="sp";var S7$='Thu';var H2w="_p";var z5h="oad";var f5$="bub";var w$5="acti";var y5C="oc";var N3s='DTE_Body_Content';var G3V="nfo";var K1e="fieldTypes";var f_L="closeIcb";var j66=")";var L3O="ne_B";var q1J="register";var e0F="functi";var a1s="dat";var z8m="dataSources";var C6M="f";var l$j="appendTo";var n$L="isab";var y72="tend";var R$W="mult";var A9d="nput";var p4w='edit';var M6E="Array";var I30="addClass";var l65="nE";var m7w="lass";var s6F="push";var Q6J="add";var a$u="rapper";var v1r="ity";var j28="eOp";var c1E='DTE_Field_Message';var R0v="e you sure you wish to delete 1 row?";var C1u="ut";var V7b="Ed";var w6y="itl";var I7m="displayFields";var b$7="_fnExtend";var S8G="ab";var s9H="dom";var Z1T="opts";var M9W="optionsPair";var L$Q="elete";var u4K="]";var i6p="ac";var M0s='bubble';var l0Z="<div class=\"DTED_Envelope_Background\"><di";var t9v="ction";var F9z="lo";var T7n="aSource";var F_z="I";var S3r="iv";var Y$E="editorFields";var s1z='DTE_Header';var R1M="dr";var x4j="background";var o_z="i18";var x3d="ind";var W4U="P";var e7H="ns";var u8g='DTE_Field_InputControl';var S2N="pus";var s3m="_edit";var A$b="Min";var f3U="gth";var t0E="val";var H$Q="conf";var u9M="width";var u2O="multiple";var M22="DTE_Inl";var x2I="ai";var N$u="one";var s17='close';var v$2='<div class="DTED_Envelope_Container"></div>';var s6g="def";var n7v="button";var l4F="pre";var e7j="det";var Z3X="ne";var g4U="_";var F4V="esto";var o0X=15;var t0m="toggleClass";var p2d="form";var j99="url";var C_h="DTE_";var P_k="row";var k_9="D";var o3w="pd";var N5P='"]';var T4r="afeId";var w6A='</label>';var K$U="_d";var p$b="ajax";var H2s="est";var a0N="settings";var q7i="na";var E8g='focus.editor-focus';var u3P='blur';var E2Y="_eve";var U_m="ll";var X1k="_Form_I";var h8$="TE_Fie";var g6T="nuary";var L9Q="it()";var h9_="submi";var x9R=0;var c2r="al";var h1a="mi";var O8l="l_";var F73='Delete';var G92="1";var D9d="vem";var T$0="htm";var B4u="displayController";var P8c="unction";var d2O='files()';var m66=".D";var H86="ec";var q3u='block';var L2l="us";var s6N='The selected items contain different values for this input. To edit and set all items for this input to the same value, click or tap here, otherwise they will retain their individual values.';var F3P="error";var B3M="get";var g_I="mes";var W1Y="_e";var O0D=13;var Q_I=500;var b9u="display";var I7h="od";var S3l='resize.DTED_Lightbox';var C9j="Au";var l0f="E_L";var o6_="DTE_Bubble_Backgro";var a1W="v></div>";var E6r="modifier";var B_H="Api";var S8l="template";var q2U="DTE_Footer_Cont";var k04="ent";var n14='lightbox';var y_Q="ightbox_Content_Wrapper\">";var M11="_picker";var Y_I="ev";var a7Y='October';var T9f="splice";var d_w="children";var n_a="type";var a7D="div.DT";var a8M="wrap";var R47="efault";var a_i="y";var T8$="ividually, but";var S4m="mul";var l14='&';var Y2J="ame";var N2Q="_dat";var y1H='<div>';var G5M="ri";var p$O="dex";var N29="wireFormat";var u_K="focu";var Q5_="vent";var B2i="ecked";var m3E="ield";var w0T="ws";var r6v="cr";var K0h="html";var R_M="\"></d";var Z5E='DTE_Inline_Field';var p4m=" ";var f9x='▶';var t2w="versionCheck";var V8D=' ';var U39="Ap";var Q3l="closeCb";var C1X='Close';var L_b="select";var m_$="_da";var v9z='<div class="DTED DTED_Envelope_Wrapper">';var h26="ax";var h3O="xt";var O87="eElement";var C4S="ource";var T$M="rra";var u4G="ay";var I5o="ra";var F2v="edit";var H8W="unshift";var R1Q=".";var p9I="parents";var T7h="This in";var U_l="apper";var B2L="in";var G3s="ven";var Q$e="ble";var t3U="_Content\">";var E1K="dt";var c_v="W";var H47="cells";var m0e="_inline";var X8q='start';var U67="but";var e3T="ig";var X_E="ld_Sta";var h1s="\">";var g69="rm";var A0w="rr";var T6n="isArray";var P1G="_c";var Z9h="dd";var m0N="tio";var S7a="eI";var P40='_';var r3C="reat";var i6O="multi";var r6t='buttons-remove';var N9d="prototype";var v9n='object';var h1v="_inpu";var U$f="lengt";var N4T="lin";var Y5q="buttons-cre";var q2G="<butt";var u1z="<div class=\"DTED_Lightbox_Close\"";var W0a="am";var a_d="fier";var Q_X="safeId";var R8S="itor";var W5R='buttons-create';var P9V="set";var U3G="p";var s1U="creat";var s_E="Ta";var u9R="ass=\"DTED_Lightbox_Background\"><div></di";var Y9i='body';var W65="dataSrc";g1X.g2m();var s6r="ot";var d6U="mu";var C05=1;var M31="class";var t9J="und";var F9i='Create';var U2S="hide";var Z5Q="Editor";var Q90="ror";var H$G="_Content";var I9B="ce";var B4R="then";var n0H="ion";var b5S="ubmit";var e36="abled";var Y60="isArra";var h92="().";var l3T="ete";var Z6k='Edit entry';var y$Z="\"";var x_J="se";var f$T="ow.";var Y2l="ons";var y7X="v ";var Z1A="ine";var X5j="clas";var G2L='June';var y_9="elds";var O1$="container";var L58="Field";var m$w="options";var z2P="N";var D$5="_eventName";var Y6T="igh";var D$k="dis";var w7g="sage";var l1y='DTE_Action_Remove';var E70="play";var e_G="u";var S8r="_Body";var a8C="multi-valu";var D1E="gation";var c9$='multi-noEdit';var x4$="order";var E_b="_actionClass";var x6o="displ";var a8O="prot";var T54='<';var I00="process";var p1n="sic";var h1A='DTE_Field_Error';var D7e="</di";var M$s="TE_Bubble";var d8F="_focus";var e9b="xte";var l1J="ds";var h9P="ode";var h55="imate";var s1h="onCh";var A4a='update';var H8o="eng";var u2c="Opt";var m2l="uns";var C_s="reate";var D5Z="classes";var F7$=null;var Q2Y="om";var L_C="wra";var A7$="H";var K3A="su";var T4f="iel";var y_M="_addOptions";var l4f='March';var H18="DTE_F";var f8o='DTE_Bubble_Table';var u2Y="de";var M2v="processing";var s0O='DTE_Form';var k25="alue";var B5h="ult";var e1Z="it";var I_V="_i";var v8T="preventDefault";var W08="i";var G$h="ie";var S2m="np";var B36="ld";var j6p="DataTable";var c69='>';var m4E="no";var d66="<di";var a5w="O";var Q4J="pr";var X3g="ber";var u$p="ov";var Q7A="ten";var z9S="aTa";var g5s="ner";var i_u="pu";var d1M="ss";var N9i="_noProcessing";var W97="isa";var h3e="anim";var C6g="st";var z6i="b";var T7N="prepend";var Q4C="separator";var h9l="div class=\"DTED_L";var A5M="l";var V3r="led";var L_f="pa";var U44="os";var x0W="cli";var M9E="rows";var t$2="name";var D99="es";var z3f="xOf";var z$d="8";var Q1e="_ev";var u9C="m";var S1L="bo";var P4a="Object";var R2u="otype";var W6E="extend";var H0s="rin";var o5m="div.DTE_Body";var y7Q="displayed";var E4z="open";var x4X="destroy";var C9_="opt";var U_d="iner";var A0l="<div ";var H6a="status";var w6e="18n";var r0L="ight";var K8$="j";var G0y="field";var I9l=">";var K6W="onCom";var V6m="bl";var l1$="age";var h3C="eate";var O7K="pen";var G3Q="Nam";var I3V="keys";var P4$="slice";var m8W="Dat";var a$R='icon close';var R01="at";var a57="back";var G0G="s=\"";var G5w="i18n";var d4U="id";var r08="style";var l1p="No fi";var t0I="et";var P54="eChecked";var w9V="er";var P19='DTE_Form_Error';var z0g="editFields";var o8H="_val";var I9T="blur";var t1r="multiSet";var Z9U="end";var Y29="_fieldFromNode";var g1E="asses";var j07="ndler";var A1l='row';var M70="wrapper";var c3S='1.10.20';var B96="off";var n_V="_pr";var K6g="ad";var x_B="ca";var o_F='Are you sure you wish to delete %d rows?';var n1x="tt";var e_A="velope_Shadow\"></div>";var u3p="ub";var q8p="offs";var G9N="put can be edited ind";var k1n="event";var p5Z='postUpload';var Z9F="rowIds";var H9U="gs";var V5x=':visible';var Y5h="ea";var S$h="splay";var q9X="ord";var I0x="clo";var v3_="teError";var f7L="=\"";var p5X="multiGet";var F25="wr";var L6P="ur";var j0O='DTE_Bubble_Liner';var V4o="<div cla";var j78="ht";var z1d="2";var w6$="ss=\"DTED_Lightbox_Container\">";var r58="ime";var D2u="mess";var m1y="ttr";var G1T="ator";var E2q="der";var I1e=2;var y0h='data';var s3y="ndic";var T1I="_tidy";var h3P="each";var V3b="height";var G25='open';var U8l="au";var r09="da";var p2C="sub";var v_P="li";var V6f="header";var l$f='action';var C87="_formOptions";var o0_="cle";var O63="tons";var q7r="pri";var f9t="fo";var z6g='</div>';var q8r=20;var Y36="Ar";var f$q='submitComplete';var M3W="versi";var J$O="ditor";var a_D="TE_Action_Create";var b1k="init";var v7S="_clearDynamicInfo";var g7z="fu";var P1b="To";var d5F='1';var q2r="fieldE";var V0_="focus";var Y4i=":";var p1g="bubble";var w2v="actio";var s6V="Da";var u$U="nt";var y4k="a";var P5I="ex";var C_o="TE_Inline";var i9G="removeC";var J_p="</";var C5E="map";var F7P="ngt";var Y7z="ush";var M1N="backg";var O$u="disabled";var I3U="ate";var Y0R="input";var P3B="s=\"DTED_En";var R9i="De";var I_w="_dataSour";var r8R="ove";var Y$e="r";var W8G="mitComplete";var j57="Unk";var V8t="act";var h1x="nges";var R5e="ppe";var I6k="len";var s6o="wrapp";var S27="format";var S2u='DTE_Footer';var c$T='remove';var I6x="checked";var T5J="DTED_Lightbox_Wrapper\">";var m2r="be";var j75="isAr";var x0$="ger";var R6l=600;var J5T="put";var l7J="content";var m8C="rFields";var Z2E="tions";var i2A="tedSingle";var k42='-';var w7L="sPla";var j2Q="node";var d6b=3;var i7U="ength";var y1v="max";var z9B="_input";var g6v="S";var u6e="which";var Q8X="ge";var e3f="remove";var l8d="pt";var j1P="editCount";var I$c="Info";var O$b="title";var k9m="o";var X0N="TE";var r2J="exten";var r2S="></div>";var N_x="pper";var K9A="v";var l$2="k";var K42="lds";var G07='DTE_Field_Info';var X09="DTE D";var I09="moment";var j1d="do";var H7v="formOptions";var m4P="itle";var E3L='"></div>';var D1I="__dtFakeRow";var h_n="ocess";var X65="detach";var g9H="mode";var z5l="A";var J6u="ldTy";var w_B="fn";var o7k="table";var k6_="ect";var l2S="active";var t_V="tach";var s1L='DTE_Field';var t5J="_Triangle";var I2p="orm_Bu";var s2S='main';var S5F='May';var D77="animate";var E3G="<div clas";var l_i="dependent";var Q21="()";var z4Q='os';var c6O="Ne";var U2i="ep";var o85="files";var Q6P="_submit";var Y6r="me";var d4a="ty";var v_e='processing';var V7p="isA";var C2m="opac";var Y8k="_weakInArray";var Q7_="find";var A0H="_submitSuccess";var O7S="ani";var m7A="DTE_P";var u_U="onComplete";var H$c='readonly';var X$b="_fieldNames";var w3s='Tue';var j_R="on";var h8I="dTo";var w4t="sag";var C2Y="18";var v0_="ED_Lightbox";var p2U="length";var L3u="cted";var w4s="ields";var I2A="lue";var q8B="message";var x2T="indexOf";var h$i="mod";var z4_="ke";var f2m='function';var P41="toString";var P48="s";var c5_="attr";var R1k="pro";var h05="round";var B3f='Editor requires DataTables 1.10.20 or newer';var R$6="childNodes";var m6i='focus';var z2B="_postopen";var v7w="fun";var u2h="ions";var V3I="top";var Y1I="co";var J10=',';var k8x="append";var d3c="ght";var B1e=" not part of a group.";var y6P="odi";var n7T="ocessin";var P12="con";var R3w="eld";var J5G="ing";var J$c="multiReset";var A4R='Create new entry';var K05='DTE_Form_Content';var a07="nd";var M7M="tton";var o2S="momentLocale";var t4M="pp";var Y4l="funct";var H6A="0";var y0y="ts";var y1J="join";var K44="update";var B7n="v></div></div>";var y2a="ring";var d9S="/d";var K$2="r_v";var b_8="tr";var P8L="removeClass";var k3K="iv>";var l4b='DTE_Field_Input';var B6y="<div da";var C6x="ext";var x6J="class=\"DT";var j7e="cs";var S2e='addBack';var T2B="_enabled";var i0j="_assembleMain";var T2g=50;var m5E="ng";var M9g="ayReorder";var O9R="formError";var f98='<input id="';var X5t="defaults";var I8G='click';var X_f="mov";var t_X="ss=\"";var j1i="h";var E6e="xtend";var b_l="vio";var Z$8="target";var H4n="taTable";var c_0="el";var l31="info";var b7B="hif";var y2n="butto";var u7r="<div c";var g29="ck";var W7Q="fields";var G$W="prototy";var R3z="_in";var p9p="cla";var Y7T="lu";var t6N='</span>';var H6t='A system error has occurred (<a target="_blank" href="//datatables.net/tn/12">More information</a>).';var z7B='selectedSingle';var s3b="ass=\"DTED ";var D$b="create";var s2p="ma";var g37="gu";var G2O="<div cl";var C9Y="_processing";var q9A="replace";var Q0z='Fri';var Q61="J";var Z_2="split";var D4k="ba";var Q5d=" DTE_Bubble";var K$x="t";var q8z="_v";var w1w="key";var q_$="trig";var q4v="submit";var n3A="d_Name_";var d_X="DateTime";var F$k="_Hea";var m4s="T";var W_c="le";var x0A="rem";var f3d='Update';var B1P="inline";var K4e=F2v;K4e+=Y38;K4e+=B36;K4e+=P48;var S48=J7P;S48+=W4t;S48+=K$x;var k6W=m8W;k6W+=J7P;k6W+=m4s;k6W+=r58;var E5x=K0i;E5x+=X47;E5x+=i2A;var g5e=r2J;g5e+=f4b;var U3M=x0A;U3M+=G2F;var s6J=r2J;s6J+=f4b;var A2l=M_v;A2l+=e1Z;var D9n=Y$e;D9n+=Y67;D9n+=P48;var L9l=x_J;L9l+=W_c;L9l+=L3u;var R_n=f5S;R_n+=H86;R_n+=K$x;R_n+=M_v;var I5G=q33;I5G+=K$x;I5G+=W49;I5G+=K$x;var K53=Y5q;K53+=I3U;var T9y=J7P;T9y+=W4t;T9y+=K$x;var A1y=f4b;A1y+=X6X;A1y+=A5M;A1y+=J7P;var i$t=C6M;i$t+=q6U;var E1N=W4t;E1N+=B6j;E1N+=K$x;var P0d=H47;P0d+=h92;P0d+=F2v;P0d+=Q21;var m6V=e55;m6V+=f4b;m6V+=L$Q;m6V+=Q21;var d0N=e55;d0N+=M_v;d0N+=L9Q;var b$W=Y$e;b$W+=f$T;b$W+=s1U;b$W+=L$q;var w7m=K14;w7m+=U_9;w7m+=j66;var t8c=U39;t8c+=W08;var U7t=r09;U7t+=A7c;U7t+=s_E;U7t+=Q$e;var Q9T=C6M;Q9T+=q6U;var A$J=a1s;A$J+=z9S;A$J+=z6i;A$J+=W_c;var V_M=K$x;V_M+=C6x;var Q05=r2J;Q05+=f4b;var h6b=J7P;h6b+=e9b;h6b+=q6U;h6b+=f4b;var U8s=P5I;U8s+=K$x;U8s+=D4c;U8s+=f4b;var C1C=r2J;C1C+=f4b;var R0$=J7P;R0$+=W4t;R0$+=K$x;R0$+=Z9U;var U9F=P5I;U9F+=w3n;U9F+=q6U;U9F+=f4b;var V1$=r2J;V1$+=f4b;var o7q=C6x;o7q+=J7P;o7q+=q6U;o7q+=f4b;var r4y=a1s;r4y+=y4k;r4y+=u4R;var C6$=C6M;C6$+=q6U;var z8=y34;z8+=u4R;var O3=U$F;O3+=d9S;O3+=W08;O3+=M3t;var s_=D7e;s_+=K9A;s_+=I9l;var k0=A0l;k0+=x6J;k0+=v0_;k0+=t3U;var v2=U$F;v2+=h9l;v2+=y_Q;var j7=V4o;j7+=w6$;var R4=u7r;R4+=A5M;R4+=s3b;R4+=T5J;var S$=u1z;S$+=r2S;var h9=G2O;h9+=u9R;h9+=a1W;var v1=Y$e;v1+=k9m;v1+=T7p;var m7=E3G;m7+=P3B;m7+=e_A;var R$=l0Z;R$+=B7n;var o9=k_9;o9+=m4s;o9+=u1h;var y8=m7A;y8+=H4k;y8+=s3y;y8+=G1T;var a5=X09;a5+=C_o;var o3=M22;o3+=W08;o3+=L3O;o3+=i$U;var M8=f5r;M8+=F$k;M8+=i0H;M8+=f0x;var r7=f5r;r7+=X1k;r7+=G3V;var n7=H18;n7+=I2p;n7+=M7M;n7+=P48;var V1=q2U;V1+=k04;var M_=f5r;M_+=z9a;M_+=n7T;M_+=S7m;var F4=H18;F4+=T4f;F4+=n3A;var y1=a8C;y1+=J7P;var V6=R$W;V6+=W7D;V6+=F4V;V6+=A5l;var L2=C_h;L2+=c9j;L2+=O8l;L2+=I$c;var E$=j1I;E$+=l0f;E$+=S8G;E$+=c_0;var b$=k_9;b$+=h8$;b$+=X_E;b$+=v3_;var a$=j1I;a$+=u1h;a$+=Q5d;var n2=k_9;n2+=M$s;n2+=t5J;var C3=o6_;C3+=O48;C3+=f4b;var G$=f5r;G$+=S8r;var Q2=j1I;Q2+=z4R;Q2+=m0N;Q2+=e_Q;var j0=k_9;j0+=a_D;var z1=k9m;z1+=z5l;z1+=U3G;z1+=W08;var f0=J7P;f0+=W4t;f0+=K$x;var I$=J7P;I$+=e9b;I$+=q6U;I$+=f4b;var K1=k_9;K1+=c_0;K1+=t0I;K1+=J7P;var v8=Y36;v8+=R0v;var h4=R9i;h4+=W_c;h4+=w3n;var C6=P1_;C6+=e_G;C6+=A5M;C6+=K2Z;var T$=M$K;T$+=y4k;T$+=h1x;var O6=T7h;O6+=G9N;O6+=T8$;O6+=B1e;var d2=u1h;d2+=d7k;var d1=g6v;d1+=y4k;d1+=K$x;var X5=c_v;X5+=J7P;X5+=f4b;var H2=P1_;H2+=k9m;H2+=q6U;var k_=g6v;k_+=H86;k_+=j_R;k_+=f4b;var N7=i7S;N7+=b_l;N7+=L2l;var m0=c6O;m0+=W4t;m0+=K$x;var i0=z2P;i0+=k9m;i0+=D9d;i0+=X3g;var T8=C9j;T8+=g37;T8+=C6g;var J4=z5l;J4+=q7r;J4+=A5M;var x1=g7q;x1+=J7P;x1+=c4x;var k2=Q61;k2+=y4k;k2+=g6T;var R8=A$b;R8+=e_G;R8+=K$x;R8+=J7P;var Y9=A7$;Y9+=k9m;Y9+=L6P;var i6=U3G;i6+=u9C;var u7=y4k;u7+=u9C;var p$=J7P;p$+=W4t;p$+=Q7A;p$+=f4b;var E6=Q9I;E6+=a07;var L8=y4k;L8+=A5M;L8+=A5M;var q4=C6M;q4+=k9m;q4+=X47;q4+=L2l;var b_=I0x;b_+=x_J;var x8=z6i;x8+=A5M;x8+=e_G;x8+=Y$e;var U3=M3W;U3+=s1h;U3+=Y1V;'use strict';g1X.l3=function(c_){g1X.g2m();if(g1X && c_)return g1X.m6(c_);};g1X.K9=function(U7){if(g1X && U7)return g1X.T9(U7);};g1X.A5=function(M9){g1X.h9F();if(g1X && M9)return g1X.T9(M9);};g1X.k9=function(g1){g1X.g2m();if(g1X && g1)return g1X.T9(g1);};(function(){var Z2e="aa29";var d9q="d8";var Q7w=1000;var A$r="295b";var Q6b='s';var o$T="";var N8J=5328;var z8t="3bb5";var l9F=2832;var k6a='Thank you for trying DataTables Editor\n\n';var p8A="bf3d";var s2I="og";var o3B="4b13";var T7L="day";var v06='Editor - Trial expired';var T0X=" r";var W4j="4";var n1l=60;var b3c=1649980800;var V1H=".net/purchase";var z7k=24;var i6L="emaining";var Z9q=4754778001;var C8z="ceil";var b5G='DataTables Editor trial info - ';var N3_="for Editor, please see https://editor.datatables";var W35="7c82";var z4O="etT";var s4v="daa";var x4F="bea3";var q4c="getTime";var l3c="e563";var B_n="9f";var W8Z=7;var P08='Your trial has now expired. To purchase a license ';var V1n="6c1";var l7I="4997";var z3=Z71;z3+=z4O;z3+=W08;z3+=Y6r;var d7=z6i;d7+=V1n;var Q7=z1d;Q7+=d9q;Q7+=G92;g1X.M2=function(u5){if(g1X)return g1X.m6(u5);};g1X.t6=function(F2){if(g1X)return g1X.T9(F2);};g1X.g2m();var remaining=Math[g1X.m$(Z2e)?C8z:o$T]((new Date((g1X.t6(p8A)?Z9q:b3c) * (g1X.y0(x4F)?l9F:Q7w))[g1X.M2(Q7)?o$T:q4c]() - new Date()[g1X.k3(d7)?o$T:z3]()) / ((g1X.k9(A$r)?Q7w:N8J) * n1l * n1l * z7k));if(remaining <= x9R){var S1=N3_;S1+=V1H;var L5=s4v;L5+=W4j;g1X.N2=function(P0){if(g1X && P0)return g1X.T9(P0);};alert(k6a + P08 + (g1X.N2(L5)?S1:o$T));throw v06;}else if(remaining <= (g1X.A5(W35)?W8Z:d6b)){var r6=T0X;r6+=i6L;var v3=C6M;v3+=f4b;v3+=B_n;var w7=p4m;w7+=T7L;var V8=A5M;V8+=s2I;g1X.A6=function(G5){g1X.h9F();if(g1X)return g1X.T9(G5);};g1X.A$=function(n_){if(g1X)return g1X.m6(n_);};console[V8]((g1X.v$(z8t)?o$T:b5G) + remaining + (g1X.K9(l7I)?w7:o$T) + (remaining === (g1X.l3(o3B)?C05:d6b)?x8n:g1X.A$(l3c)?o$T:Q6b) + (g1X.A6(v3)?o$T:r6));}})();var DataTable=$[w_B][o_i];if(!DataTable || !DataTable[t2w] || !DataTable[U3](c3S)){throw new Error(B3f);}var formOptions={buttons:w0_,drawType:P3U,focus:x9R,message:w0_,nest:P3U,onBackground:x8,onBlur:s17,onComplete:b_,onEsc:s17,onFieldError:q4,onReturn:u8c,scope:A1l,submit:L8,submitHtml:f9x,submitTrigger:F7$,title:w0_};var defaults$1={actionName:l$f,ajax:F7$,display:n14,events:{},fields:[],formOptions:{bubble:$[E6]({},formOptions,{buttons:g_X,message:P3U,submit:f13,title:P3U}),inline:$[W6E]({},formOptions,{buttons:P3U,submit:f13}),main:$[p$]({},formOptions)},i18n:{close:C1X,create:{button:P6S,submit:F9i,title:A4R},datetime:{amPm:[u7,i6],hours:Y9,minutes:R8,months:[k2,x1,l4f,J4,S5F,G2L,D4A,T8,A_W,a7Y,i0,H5j],next:m0,previous:N7,seconds:k_,unknown:k42,weekdays:[h1z,H2,w3s,X5,S7$,Q0z,d1]},edit:{button:d2,submit:f3d,title:Z6k},error:{system:H6t},multi:{info:s6N,noMulti:O6,restore:T$,title:C6},remove:{button:h4,confirm:{1:v8,_:o_F},submit:F73,title:K1}},idSrc:X0l,table:F7$};var settings={action:F7$,actionName:l$f,ajax:F7$,bubbleNodes:[],closeCb:F7$,closeIcb:F7$,dataSource:F7$,displayController:F7$,displayed:P3U,editCount:x9R,editData:{},editFields:{},editOpts:{},fields:{},formOptions:{bubble:$[W6E]({},formOptions),inline:$[W6E]({},formOptions),main:$[I$]({},formOptions)},globalError:x8n,id:-C05,idSrc:F7$,includeFields:[],mode:F7$,modifier:F7$,opts:F7$,order:[],processing:P3U,setFocus:F7$,table:F7$,template:F7$,unique:x9R};var DataTable$5=$[w_B][o_i];var DtInternalApi=DataTable$5[f0][z1];function objectKeys(o){g1X.h9F();var w8x="hasOwnProperty";var out=[];for(var key in o){if(o[w8x](key)){out[s6F](key);}}return out;}function el(tag,ctx){var U99='*[data-dte-e="';if(ctx === undefined){ctx=document;}return $(U99 + tag + N5P,ctx);}function safeDomId(id,prefix){var q2a="repl";var D1=q2a;D1+=y4k;D1+=X47;D1+=J7P;var o8=P48;o8+=K$x;o8+=H0s;o8+=Z71;if(prefix === void x9R){prefix=F97;}return typeof id === o8?prefix + id[D1](/\./g,k42):prefix + id;}function safeQueryId(id,prefix){var G_o="\\";var u0$="$";var t8=G_o;t8+=u0$;t8+=G92;if(prefix === void x9R){prefix=F97;}return typeof id === V_T?prefix + id[q9A](/(:|\.|\[|\]|,)/g,t8):prefix + id;}function dataGet(src){g1X.g2m();var T16="_fnGetObjectDataFn";return DtInternalApi[T16](src);}function dataSet(src){var o1a="_fnSetObjectDataFn";return DtInternalApi[o1a](src);}var extend=DtInternalApi[b$7];function pluck(a,prop){var out=[];$[h3P](a,function(idx,elIn){g1X.h9F();out[s6F](elIn[prop]);});return out;}function deepCompare(o1,o2){var W0B="objec";var P3=W_c;P3+=m5E;P3+=B0B;var g$=A5M;g$+=D4c;g$+=x6u;g$+=j1i;var A2=W0B;g1X.h9F();A2+=K$x;if(typeof o1 !== v9n || typeof o2 !== A2){return o1 == o2;}var o1Props=objectKeys(o1);var o2Props=objectKeys(o2);if(o1Props[g$] !== o2Props[P3]){return P3U;}for(var i=x9R,ien=o1Props[p2U];i < ien;i++){var g0=k9m;g0+=W3d;var propName=o1Props[i];if(typeof o1[propName] === g0){if(!deepCompare(o1[propName],o2[propName])){return P3U;}}else if(o1[propName] != o2[propName]){return P3U;}}return w0_;}var _dtIsSsp=function(dt,editor){var D3l="oFeatures";var A_u="Serv";var q_v="erS";var u4=m4E;u4+=q6U;u4+=J7P;var r1=z6i;r1+=A_u;r1+=q_v;r1+=G4w;return dt[a0N]()[x9R][D3l][r1] && editor[P48][Z_P][N_s] !== u4;};var _dtApi=function(table){var F1=U39;F1+=W08;var u3=f4b;u3+=y4k;g1X.g2m();u3+=H4n;return table instanceof $[w_B][u3][F1]?table:$(table)[j6p]();};var _dtHighlight=function(node){node=$(node);g1X.g2m();setTimeout(function(){var E$d="hl";var M90="hig";var J0=M90;g1X.h9F();J0+=E$d;J0+=Y6T;J0+=K$x;node[I30](J0);setTimeout(function(){var i3s="ddC";var g94="highl";var L2V=550;var j1s="noHighl";var d_=g94;d_+=W08;d_+=Z71;d_+=j78;var y_=j1s;y_+=e3T;y_+=j78;var I8=y4k;I8+=i3s;I8+=O$K;I8+=d1M;node[I8](y_)[P8L](d_);setTimeout(function(){var W_7="noHig";g1X.g2m();var J7=W_7;J7+=E$d;J7+=r0L;node[P8L](J7);},L2V);},Q_I);},q8r);};var _dtRowSelector=function(out,dt,identifier,fields,idFn){var s2=J7P;s2+=i6p;s2+=j1i;var A4=Y$e;A4+=k9m;A4+=T7p;A4+=P48;dt[A4](identifier)[H2E]()[s2](function(idx){var V2o=14;var d7s='Unable to find row identifier';var I5=Y$e;I5+=k9m;I5+=T7p;var row=dt[P_k](idx);var data=row[y34]();var idSrc=idFn(data);if(idSrc === undefined){Editor[F3P](d7s,V2o);}g1X.g2m();out[idSrc]={data:data,fields:fields,idSrc:idSrc,node:row[j2Q](),type:I5};});};var _dtFieldsFromIdx=function(dt,fields,idx,ignoreUnknown){var Y4Y='Unable to automatically determine field from source. Please specify the field name.';g1X.h9F();var M5L="ject";var u6a="editF";var a_6="aoColumns";var M2L=11;var h32="isE";var D7M="mptyOb";var L4=h32;L4+=D7M;L4+=M5L;var F6=u9C;F6+=s6V;F6+=K$x;F6+=y4k;var I1=u6a;I1+=m3E;var A8=J7P;A8+=d7k;A8+=L58;var col=dt[a0N]()[x9R][a_6][idx];var dataSrc=col[A8] !== undefined?col[I1]:col[F6];var resolvedFields={};var run=function(field,dataSrcIn){var z6=q6U;g1X.g2m();z6+=Y2J;if(field[z6]() === dataSrcIn){resolvedFields[field[t$2]()]=field;}};$[h3P](fields,function(name,fieldInst){var B2=V7p;B2+=e7E;if(Array[B2](dataSrc)){var V2=A5M;V2+=J7P;V2+=q12;for(var _i=x9R,dataSrc_1=dataSrc;_i < dataSrc_1[V2];_i++){var data=dataSrc_1[_i];run(fieldInst,data);}}else {run(fieldInst,dataSrc);}});if($[L4](resolvedFields) && !ignoreUnknown){Editor[F3P](Y4Y,M2L);}return resolvedFields;};var _dtCellSelector=function(out,dt,identifier,allFields,idFn,forceFields){var R0=I9B;R0+=U_m;R0+=P48;if(forceFields === void x9R){forceFields=F7$;}var cells=dt[R0](identifier);cells[H2E]()[h3P](function(idx){var z4A="ou";var I5A="hFie";var a4z="fixedNode";var n1Q="ttachF";var b0U="attac";var k5o="xedN";var f7B="attachFi";var Y_O="nodeName";var d5X="column";var L78="ayFields";var K3=l$2;K3+=J7P;K3+=a_i;K3+=P48;var H1=X47;H1+=z4A;H1+=q6U;H1+=K$x;var N1=f4b;N1+=y4k;g1X.g2m();N1+=K$x;N1+=y4k;var t9=X47;t9+=c_0;t9+=A5M;var cell=dt[t9](idx);var row=dt[P_k](idx[P_k]);var data=row[N1]();var idSrc=idFn(data);var fields=forceFields || _dtFieldsFromIdx(dt,allFields,idx[d5X],cells[H1]() > C05);var isNode=typeof identifier === v9n && identifier[Y_O] || identifier instanceof $;var prevDisplayFields;var prevAttach;var prevAttachFields;if(Object[K3](fields)[p2U]){var Z2=x6o;Z2+=L78;var y4=B9g;y4+=k5o;y4+=I7h;y4+=J7P;var w$=S2N;w$+=j1i;var B5=y4k;B5+=K$x;B5+=K$x;B5+=L$A;var l1=y4k;l1+=K$x;l1+=K$x;l1+=L$A;var k7=l$2;k7+=J7P;k7+=a_i;k7+=P48;var J8=b0U;J8+=I5A;J8+=K42;var v6=f7B;v6+=y_9;var D4=Y$e;D4+=k9m;D4+=T7p;if(out[idSrc]){var H$=y4k;H$+=n1Q;H$+=m3E;H$+=P48;prevAttach=out[idSrc][R2d];prevAttachFields=out[idSrc][H$];prevDisplayFields=out[idSrc][I7m];}_dtRowSelector(out,dt,idx[D4],allFields,idFn);out[idSrc][v6]=prevAttachFields || [];out[idSrc][J8][s6F](Object[k7](fields));out[idSrc][l1]=prevAttach || [];out[idSrc][B5][w$](isNode?$(identifier)[B3M](x9R):cell[a4z]?cell[y4]():cell[j2Q]());out[idSrc][I7m]=prevDisplayFields || ({});$[W6E](out[idSrc][Z2],fields);}});};var _dtColumnSelector=function(out,dt,identifier,fields,idFn){g1X.g2m();var T5=b68;T5+=D99;dt[H47](F7$,identifier)[T5]()[h3P](function(idx){g1X.h9F();_dtCellSelector(out,dt,idx,fields,idFn);});};var dataSource$1={commit:function(action,identifier,data,store){var x5R="searchBuilder";var P6k="getDetails";var g8O="tures";var Q8M="Server";var J50="Si";var o5C="si";var U65="rebuild";var x_j="lc";var w$4="Type";var k$S="rebuildPane";var W2S="aw";var h28="oFea";var l9q="searchPanes";var t1S="responsive";var N2O="reb";var C8s="uild";var G7H="respo";var T7=m4E;T7+=Z3X;var l4=D3L;l4+=w$4;var G9=A5M;G9+=D4c;G9+=f3U;var q$=Y$e;q$+=Y67;q$+=F_z;q$+=l1J;var U4=z6i;U4+=Q8M;U4+=J50;U4+=u2Y;var s6=h28;s6+=g8O;var that=this;var dt=_dtApi(this[P48][o7k]);var ssp=dt[a0N]()[x9R][s6][U4];var ids=store[Z9F];if(!_dtIsSsp(dt,this) && action === p4w && store[q$][G9]){var row=void x9R;var compare=function(id){return function(rowIdx,rowData,rowNode){g1X.h9F();return id == dataSource$1[d4U][B9N](that,rowData);};};for(var i=x9R,ien=ids[p2U];i < ien;i++){var F7=y4k;F7+=q6U;F7+=a_i;try{var L7=Y$e;L7+=k9m;L7+=T7p;row=dt[L7](safeQueryId(ids[i]));}catch(e){row=dt;}if(!row[F7]()){var f1=Y$e;f1+=k9m;f1+=T7p;row=dt[f1](compare(ids[i]));}if(row[m3U]() && !ssp){row[e3f]();}}}var drawType=this[P48][Z_P][l4];if(drawType !== T7){var h1=N2O;h1+=C8s;var i5=v7w;i5+=t9v;var T6=f4b;T6+=Y$e;T6+=y4k;T6+=T7p;var q2=U$f;q2+=j1i;var dtAny=dt;if(ssp && ids && ids[q2]){var I7=R1M;I7+=W2S;dt[N$u](I7,function(){for(var i=x9R,ien=ids[p2U];i < ien;i++){var O9=W4S;O9+=T7p;var row=dt[O9](safeQueryId(ids[i]));if(row[m3U]()){_dtHighlight(row[j2Q]());}}});}dt[T6](drawType);if(dtAny[t1S]){var G7=Y$e;G7+=J7P;G7+=x_B;G7+=x_j;var Q4=G7H;Q4+=q6U;Q4+=o5C;Q4+=I_4;dtAny[Q4][G7]();}if(typeof dtAny[l9q] === i5 && !ssp){dtAny[l9q][k$S](undefined,w0_);}if(dtAny[x5R] !== undefined && typeof dtAny[x5R][h1] === f2m && !ssp){dtAny[x5R][U65](dtAny[x5R][P6k]());}}},create:function(fields,data){var dt=_dtApi(this[P48][o7k]);if(!_dtIsSsp(dt,this)){var Z_=Y$e;Z_+=k9m;Z_+=T7p;var row=dt[Z_][Q6J](data);_dtHighlight(row[j2Q]());}},edit:function(identifier,fields,data,store){var that=this;g1X.g2m();var dt=_dtApi(this[P48][o7k]);if(!_dtIsSsp(dt,this) || this[P48][Z_P][N_s] === Q4c){var W0=X47;W0+=c2r;W0+=A5M;var rowId_1=dataSource$1[d4U][W0](this,data);var row=void x9R;try{var T_=Y$e;T_+=Y67;row=dt[T_](safeQueryId(rowId_1));}catch(e){row=dt;}if(!row[m3U]()){var X6=Y$e;X6+=Y67;row=dt[X6](function(rowIdx,rowData,rowNode){var y$=X47;g1X.h9F();y$+=y4k;y$+=A5M;y$+=A5M;return rowId_1 == dataSource$1[d4U][y$](that,rowData);});}if(row[m3U]()){var p6=W4S;p6+=T7p;p6+=F_z;p6+=l1J;var T0=r09;T0+=K$x;T0+=y4k;var toSave=extend({},row[T0](),w0_);toSave=extend(toSave,data,w0_);row[y34](toSave);var idx=$[o8z](rowId_1,store[Z9F]);store[p6][T9f](idx,C05);}else {var m3=Y$e;m3+=k9m;m3+=T7p;row=dt[m3][Q6J](data);}_dtHighlight(row[j2Q]());}},fakeRow:function(insertPoint){var B2d='<tr class="dte-inlineAdd">';var R_o=".dte-cre";var Z93="ateInline";var L9g="cell";var L4L="um";var M7K="className";var v8Q=':eq(0)';var f4U='<td>';var T8r=":visibl";var L5r="ey";var Z22="ol";var a9=Y$e;a9+=k9m;a9+=T7p;var X2=T2z;X2+=A5M;X2+=f4b;X2+=P48;var F3=D3L;F3+=R_o;F3+=Z93;var N0=Y1I;N0+=O48;N0+=K$x;var r3=A7c;r3+=z6i;r3+=W_c;var dt=_dtApi(this[P48][r3]);var tr=$(B2d);var attachFields=[];var attach=[];var displayFields={};for(var i=x9R,ien=dt[N02](V5x)[N0]();i < ien;i++){var u$=q6U;u$+=k9m;u$+=f4b;u$+=J7P;var V7=T2z;V7+=A5M;V7+=l1J;var x5=T8r;x5+=J7P;var g2=X47;g2+=Z22;g2+=L4L;g2+=q6U;var visIdx=dt[g2](i + x5)[b68]();var td=$(f4U)[l$j](tr);var fields=_dtFieldsFromIdx(dt,this[P48][V7],visIdx,w0_);var cell=dt[L9g](v8Q,visIdx)[u$]();if(cell){td[I30](cell[M7K]);}if(Object[I3V](fields)[p2U]){var U$=C6x;U$+=Z9U;var w1=U3G;w1+=Y7z;var l6=l$2;l6+=L5r;l6+=P48;var U9=U3G;U9+=e_G;U9+=P48;U9+=j1i;attachFields[U9](Object[l6](fields));attach[w1](td[x9R]);$[U$](displayFields,fields);}}var append=function(){var T4_='end';var P9=z6i;P9+=k9m;P9+=f4b;P9+=a_i;var Z4=T7N;Z4+=P1b;var n3=y4k;n3+=U3G;n3+=O7K;n3+=h8I;var action=insertPoint === T4_?n3:Z4;tr[action](dt[o7k](undefined)[P9]());};this[D1I]=tr;append();dt[j_R](F3,function(){append();});g1X.h9F();return {0:{attach:attach,attachFields:attachFields,displayFields:displayFields,fields:this[P48][X2],type:a9}};},fakeRowEnd:function(){var s9h="__dtFake";var i8u="w.dte-cre";var a4P="Row";var y73="eInline";var G8u="dra";var S4=s9h;S4+=a4P;var w6=x0A;w6+=r8R;var i8=G8u;i8+=i8u;i8+=R01;i8+=y73;var dt=_dtApi(this[P48][o7k]);dt[B96](i8);this[D1I][w6]();this[S4]=F7$;},fields:function(identifier){var s4z="ells";var a3z="idSr";var m9=X47;m9+=s4z;var P8=a3z;P8+=X47;g1X.h9F();var idFn=dataGet(this[P48][P8]);var dt=_dtApi(this[P48][o7k]);var fields=this[P48][W7Q];var out={};if($[o8q](identifier) && (identifier[M9E] !== undefined || identifier[N02] !== undefined || identifier[m9] !== undefined)){if(identifier[M9E] !== undefined){_dtRowSelector(out,dt,identifier[M9E],fields,idFn);}if(identifier[N02] !== undefined){_dtColumnSelector(out,dt,identifier[N02],fields,idFn);}if(identifier[H47] !== undefined){_dtCellSelector(out,dt,identifier[H47],fields,idFn);}}else {_dtRowSelector(out,dt,identifier,fields,idFn);}return out;},id:function(data){g1X.h9F();var idFn=dataGet(this[P48][h9v]);return idFn(data);},individual:function(identifier,fieldNames){var j$T="sA";var n7V="Sr";var O2=T2z;O2+=K42;var e4=d4U;e4+=n7V;e4+=X47;var idFn=dataGet(this[P48][e4]);var dt=_dtApi(this[P48][o7k]);var fields=this[P48][O2];var out={};var forceFields;if(fieldNames){var b8=J7P;b8+=y4k;b8+=R0n;var h2=W08;h2+=j$T;h2+=e7E;if(!Array[h2](fieldNames)){fieldNames=[fieldNames];}forceFields={};$[b8](fieldNames,function(i,name){g1X.g2m();forceFields[name]=fields[name];});}_dtCellSelector(out,dt,identifier,fields,idFn,forceFields);return out;},prep:function(action,identifier,submit,json,store){var d$l="cancelled";var g0k="remov";var I$O="cance";var c5k="rowId";var I39="wI";var a6y="lled";g1X.h9F();var n$=g0k;n$+=J7P;var Z1=J7P;Z1+=e9o;Z1+=K$x;var X4=r6v;X4+=J7P;X4+=y4k;X4+=w3n;var _this=this;if(action === X4){var E3=s2p;E3+=U3G;var W5=W4S;W5+=I39;W5+=l1J;store[W5]=$[E3](json[y34],function(row){g1X.h9F();return dataSource$1[d4U][B9N](_this,row);});}if(action === Z1){var K2=c5k;K2+=P48;var cancelled_1=json[d$l] || [];store[K2]=$[C5E](submit[y34],function(val,key){var c6N="isEmptyO";var W0W="jec";var q1=r09;q1+=K$x;q1+=y4k;g1X.g2m();var R9=c6N;R9+=z6i;R9+=W0W;R9+=K$x;return !$[R9](submit[q1][key]) && $[o8z](key,cancelled_1) === -C05?key:undefined;});}else if(action === n$){var x2=I$O;x2+=a6y;store[d$l]=json[x2] || [];}},refresh:function(){var p0d="reload";var p2=K$x;p2+=S8G;p2+=A5M;p2+=J7P;var dt=_dtApi(this[P48][p2]);g1X.h9F();dt[p$b][p0d](F7$,P3U);},remove:function(identifier,fields,store){var X_c="ncelle";var Q3n="every";var W9=X47;W9+=y4k;W9+=X_c;W9+=f4b;var that=this;var dt=_dtApi(this[P48][o7k]);var cancelled=store[W9];g1X.h9F();if(cancelled[p2U] === x9R){var l_=A5l;l_+=X_f;l_+=J7P;var g_=Y$e;g_+=k9m;g_+=T7p;g_+=P48;dt[g_](identifier)[l_]();}else {var Z6=Y$e;Z6+=k9m;Z6+=T7p;Z6+=P48;var indexes_1=[];dt[Z6](identifier)[Q3n](function(){var A0X="inAr";var C5=A0X;C5+=I5o;C5+=a_i;var b5=f4b;b5+=y4k;b5+=K$x;b5+=y4k;var N5=X47;N5+=y4k;N5+=A5M;N5+=A5M;var A7=W08;A7+=f4b;var id=dataSource$1[A7][N5](that,this[b5]());if($[C5](id,cancelled) === -C05){var x9=B2L;x9+=p$O;indexes_1[s6F](this[x9]());}});dt[M9E](indexes_1)[e3f]();}}};function _htmlId(identifier){var g_l="with `data-editor-id` or `id` of: ";var I18='[data-editor-id="';var z9g=" not find an element ";var d3h="C";var t3H="ould";var g8=W_c;g8+=q6U;g8+=f3U;if(identifier === z6e){return $(document);}var specific=$(I18 + identifier + N5P);if(specific[g8] === x9R){var W8=P48;W8+=K$x;W8+=Y$e;W8+=J5G;specific=typeof identifier === W8?$(safeQueryId(identifier)):$(identifier);}if(specific[p2U] === x9R){var j9=d3h;j9+=t3H;j9+=z9g;j9+=g_l;throw new Error(j9 + identifier);}return specific;}function _htmlEl(identifier,name){var X4d='[data-editor-field="';var K$=y$Z;K$+=u4K;g1X.g2m();var context=_htmlId(identifier);return $(X4d + name + K$,context);}function _htmlEls(identifier,names){var out=$();for(var i=x9R,ien=names[p2U];i < ien;i++){out=out[Q6J](_htmlEl(identifier,names[i]));}g1X.g2m();return out;}function _htmlGet(identifier,dataSrc){var Z09="lter";var L32="[data-editor-v";var H9=W_c;g1X.h9F();H9+=F7P;H9+=j1i;var I9=L32;I9+=k25;I9+=u4K;var r_=C6M;r_+=W08;r_+=Z09;var el=_htmlEl(identifier,dataSrc);return el[r_](I9)[H9]?el[c5_](N0d):el[K0h]();}function _htmlSet(identifier,fields,data){var p4=Y5h;p4+=X47;p4+=j1i;$[p4](fields,function(name,field){var l3_='[data-editor-value]';var I_p="tm";g1X.g2m();var m04="valFromDat";var p3=m04;p3+=y4k;var val=field[p3](data);if(val !== undefined){var m8=W_c;m8+=q12;var el=_htmlEl(identifier,field[W65]());if(el[M2I](l3_)[m8]){el[c5_](N0d,val);}else {var O$=j1i;O$+=I_p;O$+=A5M;el[h3P](function(){var e8v="removeChild";var w69="firstChild";var k$Y="engt";var R2=A5M;g1X.h9F();R2+=k$Y;R2+=j1i;while(this[R$6][R2]){this[e8v](this[w69]);}})[O$](val);}}});}var dataSource={create:function(fields,data){g1X.g2m();if(data){var p5=W08;p5+=f4b;var id=dataSource[p5][B9N](this,data);try{var q7=T06;q7+=B0B;if(_htmlId(id)[q7]){_htmlSet(id,fields,data);}}catch(e){;}}},edit:function(identifier,fields,data){g1X.h9F();var id=dataSource[d4U][B9N](this,data) || z6e;_htmlSet(id,fields,data);},fields:function(identifier){var i4c="all";var Q_=C6M;Q_+=W08;Q_+=R3w;Q_+=P48;var out={};if(Array[T6n](identifier)){for(var i=x9R,ien=identifier[p2U];i < ien;i++){var f8=X47;f8+=i4c;var res=dataSource[W7Q][f8](this,identifier[i]);out[identifier[i]]=res[identifier[i]];}return out;}var data={};var fields=this[P48][Q_];if(!identifier){var A9=w1w;A9+=W_c;A9+=d1M;identifier=A9;}$[h3P](fields,function(name,field){var V4B="valToData";var C$j="dataSr";var S_=C$j;S_+=X47;g1X.h9F();var val=_htmlGet(identifier,field[S_]());field[V4B](data,val === F7$?undefined:val);});out[identifier]={data:data,fields:fields,idSrc:identifier,node:document,type:A1l};return out;},id:function(data){var idFn=dataGet(this[P48][h9v]);return idFn(data);},individual:function(identifier,fieldNames){var v9K='editor-id';var X64="[data-";var z2r="dB";var T0M="editor-id]";var y5c="data-edito";var S6A="ack";var u53="nodeN";var N1j='Cannot automatically determine field name from data source';var k_n='andSelf';var g7_="r-field";var r0=Y5h;r0+=R0n;var z7=G0y;z7+=P48;var f_=u53;f_+=Y2J;var attachEl;if(identifier instanceof $ || identifier[f_]){var N4=X64;N4+=T0M;var U0=K6g;U0+=z2r;U0+=S6A;var s8=C6M;s8+=q6U;attachEl=identifier;if(!fieldNames){var d0=y5c;d0+=g7_;fieldNames=[$(identifier)[c5_](d0)];}var back=$[s8][U0]?S2e:k_n;identifier=$(identifier)[p9I](N4)[back]()[y34](v9K);}g1X.g2m();if(!identifier){identifier=z6e;}if(fieldNames && !Array[T6n](fieldNames)){fieldNames=[fieldNames];}if(!fieldNames || fieldNames[p2U] === x9R){throw new Error(N1j);}var out=dataSource[W7Q][B9N](this,identifier);var fields=this[P48][z7];var forceFields={};$[r0](fieldNames,function(i,name){forceFields[name]=fields[name];});$[h3P](out,function(id,set){var G1K="yField";var B1k="toArray";var r2u="attachFields";var C4=T$f;C4+=O$K;C4+=G1K;C4+=P48;var Q9=C6M;Q9+=G$h;Q9+=K42;var s5=R01;s5+=t_V;var i$=I9B;g1X.h9F();i$+=A5M;i$+=A5M;set[n_a]=i$;set[r2u]=[fieldNames];set[s5]=attachEl?$(attachEl):_htmlEls(identifier,fieldNames)[B1k]();set[Q9]=fields;set[C4]=forceFields;});return out;},initField:function(cfg){var v2X="-label=\"";var b5w="[d";var v8w="ata-edito";var k4=A5M;k4+=H8o;k4+=B0B;var T3=O$K;T3+=Z4A;var W3=b5w;W3+=v8w;W3+=Y$e;W3+=v2X;var label=$(W3 + (cfg[y34] || cfg[t$2]) + N5P);if(!cfg[T3] && label[k4]){var t1=O$K;t1+=z6i;t1+=J7P;t1+=A5M;cfg[t1]=label[K0h]();}},remove:function(identifier,fields){g1X.g2m();var p8=x0A;p8+=r8R;_htmlId(identifier)[p8]();}};var classNames={actions:{create:j0,edit:Q2,remove:l1y},body:{content:N3s,wrapper:G$},bubble:{bg:C3,close:a$R,liner:j0O,pointer:n2,table:f8o,wrapper:a$},field:{'disabled':N8M,'error':b$,'input':l4b,'inputControl':u8g,'label':E$,'msg-error':h1A,'msg-info':G07,'msg-label':L2,'msg-message':c1E,'multiInfo':P5x,'multiNoEdit':c9$,'multiRestore':V6,'multiValue':y1,'namePrefix':F4,'processing':M_,'typePrefix':Y1t,'wrapper':s1L},footer:{content:V1,wrapper:S2u},form:{button:F43,buttonInternal:F43,buttons:n7,content:K05,error:P19,info:r7,tag:x8n,wrapper:s0O},header:{content:M8,wrapper:s1z},inline:{buttons:o3,liner:Z5E,wrapper:a5},processing:{active:v_e,indicator:y8},wrapper:o9};var displayed$2=P3U;var cssBackgroundOpacity=C05;var dom$1={background:$(R$)[x9R],close:$(k99)[x9R],content:F7$,wrapper:$(v9z + m7 + v$2 + z6g)[x9R]};function findAttachRow(editor,attach){var U9E="eade";var B8=r6v;B8+=h3C;g1X.g2m();var x3=w2v;x3+=q6U;var B$=j1i;B$+=Y5h;B$+=f4b;var S5=E3q;S5+=W_c;var dt=new $[w_B][o_i][B_H](editor[P48][S5]);if(attach === B$){var r4=j1i;r4+=U9E;r4+=Y$e;var R7=K$x;R7+=y4k;R7+=Q$e;return dt[R7](undefined)[r4]();;}else if(editor[P48][x3] === B8){return dt[o7k](undefined)[V6f]();}else {var h7=q6U;h7+=h9P;return dt[P_k](editor[P48][E6r])[h7]();}}function heightCalc$1(dte){var a7a="Heig";var b_7="xHe";var j5a='div.DTE_Footer';var x8o="windowPadding";var x_k="out";var V2X='div.DTE_Header';var j2=L_C;j2+=N_x;g1X.g2m();var E8=f4b;E8+=Q2Y;var I_=s2p;I_+=b_7;I_+=r0L;var e8=L_C;e8+=t4M;e8+=w9V;var t0=o5m;t0+=H$G;var W$=s6o;W$+=J7P;W$+=Y$e;var l5=x_k;l5+=w9V;l5+=a7a;l5+=j78;var header=$(V2X,dom$1[M70])[l5]();var footer=$(j5a,dom$1[W$])[s9U]();var maxHeight=$(window)[V3b]() - envelope[H$Q][x8o] * I1e - header - footer;$(t0,dom$1[e8])[j2h](I_,maxHeight);return $(dte[E8][j2])[s9U]();}function hide$2(dte,callback){g1X.g2m();var C_C="nte";var u5S="offsetHeight";var Z1w="nten";if(!callback){callback=function(){};}if(displayed$2){var I3=Y1I;I3+=C_C;I3+=u$U;var u0=h3e;u0+=y4k;u0+=K$x;u0+=J7P;var W4=Y1I;W4+=Z1w;W4+=K$x;$(dom$1[W4])[u0]({top:-(dom$1[I3][u5S] + T2g)},R6l,function(){var l7T="deO";var C9Z="nor";var P3K="fa";var C2=C9Z;C2+=u9C;C2+=y4k;C2+=A5M;var A_=P3K;A_+=l7T;A_+=C1u;var M$=T7p;g1X.h9F();M$+=I5o;M$+=t4M;M$+=w9V;$([dom$1[M$],dom$1[x4j]])[A_](C2,function(){g1X.h9F();$(this)[X65]();callback();});});displayed$2=P3U;}}function init$1(){var k$u="div.DTED_En";var k6u="rapp";var X9c="velope_Con";var c4=C2m;c4+=e1Z;c4+=a_i;g1X.h9F();var b1=T7p;b1+=k6u;b1+=w9V;var L1=k$u;L1+=X9c;L1+=A7c;L1+=U_d;dom$1[l7J]=$(L1,dom$1[b1])[x9R];cssBackgroundOpacity=$(dom$1[x4j])[j2h](c4);}function show$2(dte,callback){var U7C="ont";var c7B="ei";var e3d="lick.DTE";var Q8L='resize.DTED_Envelope';var b2c='click.DTED_Envelope';var n0k="dth";var j46="offse";var Q87="offset";var B_B="widt";var W4p="bloc";var x6A="tyl";var H0U="yl";var D2q="opacity";var L6O="ED_Envelope";var H0y="elope";var H9V='0';var Q5m="ck.DTED_Envelop";var e9H="backgrou";var K03="spl";var b72="div.DTE";var E9$="rap";var s7q="D_Envelope";var p1W=".DTED_Env";var l8w="norma";var S8x="fadeIn";var i3l="kgro";var k4U="D_Light";var S$X="box_Content_Wra";var T4z="resize";var O__="click.";var J2g='px';var W4I="marginLeft";var y6q="Wi";var f4=k9m;f4+=q6U;var b0=T4z;b0+=p1W;b0+=H0y;var c8=k9m;c8+=C6M;c8+=C6M;var X7=O__;X7+=k_9;X7+=m4s;X7+=L6O;var c7=b72;c7+=k4U;c7+=S$X;c7+=N_x;var w4=X47;w4+=e3d;w4+=s7q;var G4=X_O;G4+=C6M;var c5=D4k;c5+=X47;c5+=i3l;c5+=t9J;var H8=x0W;H8+=Q5m;H8+=J7P;var Q3=W08;Q3+=w6e;var l8=U8l;l8+=K$x;l8+=k9m;var O_=P48;O_+=x6A;O_+=J7P;if(!callback){callback=function(){};}$(Y9i)[k8x](dom$1[x4j])[k8x](dom$1[M70]);dom$1[l7J][O_][V3b]=l8;if(!displayed$2){var c0=h3e;c0+=I3U;var B3=P12;B3+=Q7A;B3+=K$x;var D6=T7p;D6+=E9$;D6+=J8K;var U5=l8w;U5+=A5M;var G3=V6m;G3+=k9m;G3+=X47;G3+=l$2;var s9=C6g;s9+=a_i;s9+=W_c;var M4=a57;M4+=Z71;M4+=h05;var F5=e9H;F5+=a07;var N3=F9d;N3+=U3G;var Y0=X47;Y0+=U7C;Y0+=D4c;Y0+=K$x;var a3=Q87;a3+=A7$;a3+=c7B;a3+=d3c;var m_=j46;m_+=K$x;var T4=L_C;T4+=U3G;T4+=m8F;T4+=Y$e;var X3=B_B;X3+=j1i;var q9=P48;q9+=K$x;q9+=H0U;q9+=J7P;var j6=T7p;j6+=a$u;var E1=k9m;E1+=U3G;E1+=i6p;E1+=v1r;var u6=e9o;u6+=K03;u6+=u4G;var H5=q8p;H5+=t0I;H5+=y6q;H5+=n0k;var b3=W4p;b3+=l$2;var style=dom$1[M70][r08];style[D2q]=H9V;style[b9u]=b3;var height=heightCalc$1(dte);var targetRow=findAttachRow(dte,envelope[H$Q][R2d]);var width=targetRow[H5];style[u6]=Q4c;style[E1]=d5F;dom$1[j6][q9][X3]=width + J2g;dom$1[T4][r08][W4I]=-(width / I1e) + J2g;dom$1[M70][r08][V3I]=$(targetRow)[m_]()[V3I] + targetRow[a3] + J2g;dom$1[Y0][r08][N3]=-C05 * height - q8r + J2g;dom$1[F5][r08][D2q]=H9V;dom$1[M4][s9][b9u]=G3;$(dom$1[x4j])[D77]({opacity:cssBackgroundOpacity},U5);$(dom$1[D6])[S8x]();$(dom$1[B3])[c0]({top:x9R},R6l,callback);}$(dom$1[e0n])[c5_](C88,dte[Q3][e0n])[B96](b2c)[j_R](H8,function(e){dte[e0n]();});$(dom$1[c5])[G4](w4)[j_R](b2c,function(e){var B9=M1N;B9+=W4S;B9+=O48;B9+=f4b;g1X.h9F();dte[B9]();});$(c7,dom$1[M70])[B96](b2c)[j_R](X7,function(e){var O6N="asCla";var s6d='DTED_Envelope_Content_Wrapper';var Y5=j1i;Y5+=O6N;g1X.g2m();Y5+=d1M;if($(e[Z$8])[Y5](s6d)){dte[x4j]();}});$(window)[c8](b0)[f4](Q8L,function(){g1X.g2m();heightCalc$1(dte);});displayed$2=w0_;}var envelope={close:function(dte,callback){g1X.h9F();hide$2(dte,callback);},conf:{attach:v1,windowPadding:T2g},destroy:function(dte){g1X.g2m();hide$2();},init:function(dte){init$1();return envelope;},node:function(dte){g1X.h9F();return dom$1[M70][x9R];},open:function(dte,append,callback){var r0y="ild";var y0$="appendCh";var n8s="conten";var C1U="appendChild";var p0o="childr";var C_=n8s;C_+=K$x;var D0=y0$;D0+=r0y;var g9=p0o;g9+=D4c;var B7=m4g;g1X.h9F();B7+=q6U;B7+=K$x;$(dom$1[B7])[g9]()[X65]();dom$1[l7J][D0](append);dom$1[C_][C1U](dom$1[e0n]);show$2(dte,callback);}};function isMobile(){var g45="tati";var q3k=576;var w5z="orien";var H0S="idt";var L$j="outer";var D4e="undefi";var s0=L$j;s0+=c_v;s0+=H0S;s0+=j1i;var O1=D4e;O1+=Z3X;O1+=f4b;var R6=w5z;R6+=g45;R6+=k9m;R6+=q6U;return typeof window[R6] !== O1 && window[s0] <= q3k?w0_:P3U;}var displayed$1=P3U;var ready=P3U;var scrollTop=x9R;var dom={background:$(h9),close:$(S$),content:F7$,wrapper:$(R4 + j7 + v2 + k0 + z6g + z6g + s_ + O3)};function heightCalc(){var n9Q="iv.DTE_Footer";var U8S='calc(100vh - ';var Z2a="E_H";var v_q="owPadding";var A64='maxHeight';var V65="heigh";var M__='div.DTE_Body_Content';var W8E="wind";var l7V="He";var O0j="ead";var v9=f4b;v9+=n9Q;var i4=a7D;i4+=Z2a;i4+=O0j;i4+=w9V;var headerFooter=$(i4,dom[M70])[s9U]() + $(v9,dom[M70])[s9U]();if(isMobile()){var y5=U3G;y5+=W4t;y5+=j66;var u2=F25;u2+=w1o;u2+=w9V;$(M__,dom[u2])[j2h](A64,U8S + headerFooter + y5);}else {var n6=y1v;n6+=l7V;n6+=e3T;n6+=j78;var r$=T7p;r$+=Y$e;r$+=U_l;var e0=o5m;e0+=H$G;var Z$=W8E;Z$+=v_q;var w2=X47;w2+=k9m;w2+=q6U;w2+=C6M;var C1=V65;C1+=K$x;var maxHeight=$(window)[C1]() - self[w2][Z$] * I1e - headerFooter;$(e0,dom[r$])[j2h](n6,maxHeight);}}function hide$1(dte,callback){var g_x="_an";var N69="_animat";var K_0="roun";var K1I="offsetAni";var M07="onf";var P2=X_O;P2+=C6M;var t3=a57;t3+=Z71;t3+=K_0;g1X.h9F();t3+=f4b;var u9=g_x;u9+=h55;var w9=X47;w9+=M07;var U1=L_C;U1+=N_x;var K0=N69;K0+=J7P;var Z7=z6i;Z7+=k9m;Z7+=Q11;if(!callback){callback=function(){};}$(Z7)[N04](scrollTop);dte[K0](dom[U1],{opacity:x9R,top:self[w9][K1I]},function(){g1X.h9F();$(this)[X65]();callback();});dte[u9](dom[t3],{opacity:x9R},function(){var e4p="deta";var b9=e4p;b9+=R0n;$(this)[b9]();});displayed$1=P3U;$(window)[P2](S3l);}function init(){var e_I="city";var B58='div.DTED_Lightbox_Content';var q5=k9m;q5+=L_f;q5+=e_I;var f6=C2m;f6+=v1r;var j4=a8M;j4+=U3G;j4+=J7P;j4+=Y$e;var J2=X47;J2+=k9m;J2+=u$U;J2+=k04;if(ready){return;}dom[J2]=$(B58,dom[j4]);dom[M70][j2h](f6,x9R);dom[x4j][j2h](q5,x9R);ready=w0_;}function show$1(dte,callback){var M_U="ightbox_Mobile";var j_1="clic";var k9G="Lig";var A3r="_anim";var r1$="htb";var X1a="htbox";var D6j='click.DTED_Lightbox';var H23="click.DTED_";var s5k="ckg";var V3c="D_Lig";var g2c="lick.DTED_Lightbox";var g3C="Lightbox";var K9g="k.DTE";var v1F="ox";var T$6="An";var X_N="appen";g1X.g2m();var f8i="DTED_L";var o44="div.DTED_Lightbox_Content_W";var C0=k9m;C0+=q6U;var p7=F25;p7+=M6g;p7+=Y$e;var x$=o44;x$+=a$u;var u_=j_1;u_+=K9g;u_+=V3c;u_+=X1a;var V_=X47;V_+=g2c;var X9=H23;X9+=k9G;X9+=r1$;X9+=v1F;var E2=H23;E2+=g3C;var Z5=K$x;Z5+=e1Z;Z5+=A5M;Z5+=J7P;var i1=R01;i1+=K$x;i1+=Y$e;var D_=X_N;D_+=f4b;if(isMobile()){var Y_=f8i;Y_+=M_U;$(Y9i)[I30](Y_);}$(Y9i)[k8x](dom[x4j])[D_](dom[M70]);heightCalc();if(!displayed$1){var p1=k9m;p1+=q6U;var B4=D4k;B4+=s5k;B4+=h05;var J9=A3r;J9+=y4k;J9+=K$x;J9+=J7P;var l2=g4U;l2+=y4k;l2+=q6U;l2+=h55;var x7=q8p;x7+=t0I;x7+=T$6;x7+=W08;var G2=P12;G2+=C6M;var p_=a8M;p_+=J8K;var T1=U8l;T1+=K$x;T1+=k9m;var Q6=j1i;Q6+=J7P;Q6+=e3T;Q6+=j78;var h5=X47;h5+=P48;h5+=P48;displayed$1=w0_;dom[l7J][h5](Q6,T1);dom[p_][j2h]({top:-self[G2][x7]});dte[l2](dom[M70],{opacity:C05,top:x9R},callback);dte[J9](dom[B4],{opacity:C05});$(window)[p1](S3l,function(){g1X.g2m();heightCalc();});scrollTop=$(Y9i)[N04]();}dom[e0n][i1](Z5,dte[G5w][e0n])[B96](E2)[j_R](X9,function(e){dte[e0n]();});dom[x4j][B96](V_)[j_R](u_,function(e){var u5y="stopImmediatePropagation";var n1=M1N;n1+=h05;e[u5y]();dte[n1]();});$(x$,dom[p7])[B96](D6j)[C0](D6j,function(e){g1X.g2m();var B5L="stopImmediat";var q3O='DTED_Lightbox_Content_Wrapper';var f3u="ePropa";var d4l="grou";if($(e[Z$8])[M6P](q3O)){var h6=a57;h6+=d4l;h6+=a07;var c$=B5L;c$+=f3u;c$+=D1E;e[c$]();dte[h6]();}});}var self={close:function(dte,callback){hide$1(dte,callback);},conf:{offsetAni:k9o,windowPadding:k9o},destroy:function(dte){g1X.g2m();if(displayed$1){hide$1(dte);}},init:function(dte){init();return self;},node:function(dte){g1X.h9F();return dom[M70][x9R];},open:function(dte,append,callback){var F4j="los";var L3=X47;L3+=F4j;L3+=J7P;var d3=f5q;g1X.h9F();d3+=U3G;d3+=J7P;d3+=a07;var s1=f4b;s1+=t0I;s1+=L$A;var V4=Y1I;V4+=q6U;V4+=Q7A;V4+=K$x;var content=dom[V4];content[d_w]()[s1]();content[d3](append)[k8x](dom[L3]);show$1(dte,callback);}};var DataTable$4=$[w_B][z8];function add(cfg,after,reorder){var W2c='initField';var i2t='Error adding field \'';var Y1H='\'. A field already exists with this name';var K_n="Fi";var Y$B='Error adding field. The field requires a `name` option';var J0d="tiReset";var r0o="reverse";var k6=h$i;k6+=J7P;var w8=C6M;w8+=W08;w8+=J7P;w8+=B36;var f3=K_n;f3+=R3w;var L9=W08;L9+=P48;L9+=Y36;L9+=W5p;if(reorder === void x9R){reorder=w0_;}if(Array[L9](cfg)){if(after !== undefined){cfg[r0o]();}for(var _i=x9R,cfg_1=cfg;_i < cfg_1[p2U];_i++){var j5=y4k;j5+=f4b;j5+=f4b;var cfgDp=cfg_1[_i];this[j5](cfgDp,after,P3U);}this[n8W](this[x4$]());return this;}var name=cfg[t$2];if(name === undefined){throw new Error(Y$B);}if(this[P48][W7Q][name]){throw new Error(i2t + name + Y1H);}this[e4j](W2c,cfg);var editorField=new Editor[f3](cfg,this[D5Z][w8],this);if(this[P48][k6]){var j1=J7P;j1+=y4k;j1+=R0n;var F$=d6U;F$+=A5M;F$+=J0d;var editFields=this[P48][z0g];editorField[F$]();$[j1](editFields,function(idSrc,editIn){var U6A="omData";var n0o="valF";var i7=f4b;g1X.h9F();i7+=J7P;i7+=C6M;var i9=a1s;i9+=y4k;var value;if(editIn[i9]){var m1=f4b;m1+=y4k;m1+=K$x;m1+=y4k;var W7=n0o;W7+=Y$e;W7+=U6A;value=editorField[W7](editIn[m1]);}editorField[t1r](idSrc,value !== undefined?value:editorField[i7]());});}this[P48][W7Q][name]=editorField;if(after === undefined){var Y7=U3G;Y7+=e_G;Y7+=P48;Y7+=j1i;var A0=k9m;A0+=Y$e;A0+=E2q;this[P48][A0][Y7](name);}else if(after === F7$){var O0=m2l;O0+=b7B;O0+=K$x;this[P48][x4$][O0](name);}else {var J5=i5x;J5+=E2q;var idx=$[o8z](after,this[P48][x4$]);this[P48][J5][T9f](idx + C05,x9R,name);}if(reorder !== P3U){var v4=k9m;v4+=Y$e;v4+=E2q;var i_=g4U;i_+=x6o;i_+=M9g;this[i_](this[v4]());}return this;}function ajax(newAjax){var e6=y4k;e6+=K8$;g1X.h9F();e6+=y4k;e6+=W4t;if(newAjax){this[P48][p$b]=newAjax;return this;}return this[P48][e6];}function background(){var m9h="kg";var L2s="rou";var L1V="onBac";var G0=h9_;G0+=K$x;var L0=e0F;L0+=k9m;L0+=q6U;var h0=L1V;h0+=m9h;h0+=L2s;h0+=a07;var K_=J7P;K_+=A1_;K_+=y0y;var onBackground=this[P48][K_][h0];if(typeof onBackground === L0){onBackground(this);}else if(onBackground === u3P){var S0=z6i;S0+=A5M;S0+=e_G;S0+=Y$e;this[S0]();}else if(onBackground === s17){this[e0n]();}else if(onBackground === G0){this[q4v]();}return this;}function blur(){var O5r="blu";var M7=g4U;M7+=O5r;M7+=Y$e;this[M7]();return this;}function bubble(cells,fieldNames,showIn,opts){var m5C="inO";var Z8G="isPlainObj";var N2S="ean";var E$9="indiv";var n1V="idu";var b7=E$9;b7+=n1V;b7+=y4k;b7+=A5M;var z9=I_w;z9+=I9B;var O4=Z8G;O4+=k6_;var Q5=S1L;Q5+=k9m;Q5+=A5M;Q5+=N2S;var X$=W08;X$+=w7L;X$+=m5C;X$+=W3d;var _this=this;var that=this;if(this[T1I](function(){that[p1g](cells,fieldNames,opts);})){return this;}if($[X$](fieldNames)){opts=fieldNames;fieldNames=undefined;showIn=w0_;}else if(typeof fieldNames === Q5){showIn=fieldNames;fieldNames=undefined;opts=undefined;}g1X.h9F();if($[O4](showIn)){opts=showIn;showIn=w0_;}if(showIn === undefined){showIn=w0_;}opts=$[W6E]({},this[P48][H7v][p1g],opts);var editFields=this[z9](b7,cells,fieldNames);this[s3m](cells,editFields,M0s,opts,function(){var m1E='resize.';var J4f="orm";var l_I="oin";var d0A="ss=";var C1w="ly";var L6E='attach';var E1v="q";var L9E="bubblePosition";var s$$='<div class="DTE_Processing_Indicator"><span></div>';var P3t="preo";var z6f="oseReg";var P1C='" title="';var w$b="_post";var J9u="prep";var w1X="lasse";var F$X="div class";var i8d="iv class=\"";var b0_='"><div></div></div>';var g5b="chil";var P7X="In";var X2b="bubb";var e$L="clos";var h1o="bubbleNodes";var D_X="liner";var x6=X2b;g1X.h9F();x6+=A5M;x6+=J7P;var F_=w$b;F_+=w1$;F_+=D4c;var t_=E$w;t_+=W08;t_+=X47;t_+=l$2;var B6=k9m;B6+=q6U;var G1=k9m;G1+=q6U;var d5=g4U;d5+=E$w;d5+=z6f;var k1=y4k;k1+=f4b;k1+=f4b;var L_=R7l;L_+=k9m;L_+=e7H;var G6=Y6r;G6+=P48;G6+=w4t;G6+=J7P;var J$=C6M;J$+=i5x;J$+=u9C;var t$=Q4J;t$+=J7P;t$+=m8F;t$+=a07;var Z0=g5b;Z0+=f4b;Z0+=Y$e;Z0+=D4c;var z_=J7P;z_+=E1v;var n0=U$F;n0+=d9S;n0+=W08;n0+=M3t;var M1=y$Z;M1+=I9l;M1+=X9B;M1+=k3K;var d9=U3G;d9+=l_I;d9+=K$x;d9+=w9V;var l$=Q4P;l$+=i8d;var a2=D7e;a2+=M3t;var u1=J_p;u1+=f4b;u1+=k3K;var G8=y$Z;G8+=r2S;var K5=X47;K5+=t6S;var E0=W08;E0+=G92;E0+=z$d;E0+=q6U;var c6=e$L;c6+=J7P;var d$=U$F;d$+=F$X;d$+=f7L;var U8=y$Z;U8+=I9l;var y7=d66;y7+=y7X;y7+=p9p;y7+=t_X;var G_=y$Z;G_+=I9l;var e3=L_C;e3+=N_x;var V$=z6i;V$+=Z71;var r5=V4o;r5+=d0A;r5+=y$Z;var t2=X47;t2+=w1X;t2+=P48;var s7=w1o;s7+=C1w;var m4=X47;m4+=k9m;m4+=q6U;m4+=n6z;var m5=g4U;m5+=P3t;m5+=O7K;var namespace=_this[C87](opts);var ret=_this[m5](M0s);if(!ret){return _this;}$(window)[j_R](m1E + namespace,function(){g1X.h9F();_this[L9E]();});var nodes=[];_this[P48][h1o]=nodes[m4][s7](nodes,pluck(editFields,L6E));var classes=_this[t2][p1g];var backgroundNode=$(r5 + classes[V$] + b0_);var container=$(w$1 + classes[e3] + v2p + w$1 + classes[D_X] + G_ + y7 + classes[o7k] + U8 + d$ + classes[c6] + P1C + _this[E0][K5] + G8 + s$$ + u1 + a2 + l$ + classes[d9] + M1 + n0);if(showIn){var A3=z6i;A3+=k9m;A3+=Q11;var x4=M6g;x4+=q6U;x4+=f4b;x4+=P1b;var h3=d1m;h3+=a_i;container[l$j](h3);backgroundNode[x4](A3);}var liner=container[d_w]()[z_](x9R);var tableNode=liner[Z0]();var closeNode=tableNode[d_w]();liner[k8x](_this[s9H][O9R]);tableNode[t$](_this[s9H][J$]);if(opts[G6]){var M5=C6M;M5+=J4f;M5+=P7X;M5+=f9t;var D2=f4b;D2+=Q2Y;var A1=Q4J;A1+=J7P;A1+=O7K;A1+=f4b;liner[A1](_this[D2][M5]);}if(opts[O$b]){var f7=J9u;f7+=Z9U;liner[f7](_this[s9H][V6f]);}if(opts[L_]){var L6=R7l;L6+=Y2l;var H6=f4b;H6+=k9m;H6+=u9C;tableNode[k8x](_this[H6][L6]);}var finish=function(){var F6v="ubbl";var f2=z6i;f2+=F6v;f2+=J7P;_this[v7S]();_this[e5F](n4k,[f2]);};var pair=$()[Q6J](container)[k1](backgroundNode);_this[d5](function(submitComplete){var T2l="_anima";var X1=T2l;X1+=w3n;_this[X1](pair,{opacity:x9R},function(){g1X.h9F();if(this === container[x9R]){pair[X65]();$(window)[B96](m1E + namespace);finish();}});});backgroundNode[G1](I8G,function(){g1X.h9F();_this[I9T]();});closeNode[B6](t_,function(){var i3=G5_;i3+=J7P;_this[i3]();});_this[L9E]();_this[F_](x6,P3U);var opened=function(){var W5V="includeFields";var m0b="ened";var u8=X2b;u8+=W_c;g1X.g2m();var z$=w1$;z$+=m0b;var z2=W1Y;z2+=I_4;z2+=q6U;z2+=K$x;_this[d8F](_this[P48][W5V],opts[V0_]);_this[z2](z$,[u8,_this[P48][M8L]]);};_this[y8H](pair,{opacity:C05},function(){if(this === container[x9R]){opened();}});});return this;}function bubblePosition(){var B0J="left";var U8Y="sse";var H3I="outerWidth";var o2a="fs";var I_M='div.DTE_Bubble_Liner';var w1S="right";var S7g="ttom";var h_x='top';var M4_="Clas";var X8X="bleNodes";var I6z='left';var z_7='div.DTE_Bubble';var f$=K$x;f$+=k9m;f$+=U3G;var t5=X_O;t5+=o2a;t5+=t0I;var w3=A5M;w3+=H8o;w3+=K$x;w3+=j1i;var w_=j7e;w_+=P48;var g4=E$w;g4+=y4k;g4+=U8Y;g4+=P48;var q_=K$x;g1X.h9F();q_+=w1$;var d4=T06;d4+=B0B;var j_=S1L;j_+=S7g;var y6=Y$e;y6+=W08;y6+=d3c;var g3=A5M;g3+=J7P;g3+=C6M;g3+=K$x;var b2=K$x;b2+=w1$;var E9=Y5h;E9+=X47;E9+=j1i;var c3=f5$;c3+=X8X;var wrapper=$(z_7);var liner=$(I_M);var nodes=this[P48][c3];var position={bottom:x9R,left:x9R,right:x9R,top:x9R};$[E9](nodes,function(i,nodeIn){var a2x="offsetWidth";var q2c="ott";var h2_="gh";var I_O="etHe";var a1=q8p;a1+=I_O;a1+=Y6T;g1X.g2m();a1+=K$x;var F0=K$x;F0+=k9m;F0+=U3G;var m2=z6i;m2+=q2c;m2+=Q2Y;var z4=A5M;z4+=J7P;z4+=C6M;z4+=K$x;var x_=Y$e;x_+=W08;x_+=h2_;x_+=K$x;var x0=A5M;x0+=J7P;x0+=C6M;x0+=K$x;var n4=Z71;n4+=t0I;var a0=X_O;a0+=o2a;a0+=t0I;var pos=$(nodeIn)[a0]();nodeIn=$(nodeIn)[n4](x9R);position[V3I]+=pos[V3I];position[B0J]+=pos[x0];position[x_]+=pos[z4] + nodeIn[a2x];position[m2]+=pos[F0] + nodeIn[a1];});position[b2]/=nodes[p2U];position[g3]/=nodes[p2U];position[y6]/=nodes[p2U];position[j_]/=nodes[d4];var top=position[q_];var left=(position[B0J] + position[w1S]) / I1e;var width=liner[H3I]();var visLeft=left - width / I1e;var visRight=visLeft + width;var docWidth=$(window)[u9M]();var padding=o0X;this[g4][p1g];wrapper[w_]({left:left,top:top});if(liner[w3] && liner[t5]()[f$] < x9R){var Y3=m2r;Y3+=A5M;Y3+=Y67;var b6=y4k;b6+=Z9h;b6+=M4_;b6+=P48;var P1=z6i;P1+=k9m;P1+=n1x;P1+=Q2Y;var S3=X47;S3+=P48;S3+=P48;wrapper[S3](h_x,position[P1])[b6](Y3);}else {var H3=z6i;H3+=c_0;H3+=k9m;H3+=T7p;wrapper[P8L](H3);}if(visRight + padding > docWidth){var diff=visRight - docWidth;liner[j2h](I6z,visLeft < padding?-(visLeft - padding):-(diff + padding));}else {var V9=A5M;V9+=W$X;var P5=X47;P5+=P48;P5+=P48;liner[P5](V9,visLeft < padding?-(visLeft - padding):x9R);}return this;}function buttons(buttonsIn){var F0L="utto";var O5=e1K;O5+=j1i;var Y4=z6i;Y4+=F0L;Y4+=e7H;var S9=f4b;S9+=k9m;S9+=u9C;var r9=g4U;r9+=D4k;r9+=p1n;var _this=this;if(buttonsIn === r9){var Q8=h9_;Q8+=K$x;buttonsIn=[{action:function(){this[q4v]();},text:this[G5w][this[P48][M8L]][Q8]}];}else if(!Array[T6n](buttonsIn)){buttonsIn=[buttonsIn];}$(this[S9][Y4])[C0K]();$[O5](buttonsIn,function(i,btn){var U5Z="</button>";var h8D='keypress';var o0K='tabindex';var w5r="abI";var X0p="tring";var G7I="classN";var g7y="lassName";var c0g="ndex";var w54="ml";var w1Q="on>";var j3=R7l;j3+=j_R;j3+=P48;var E5=f4b;E5+=k9m;E5+=u9C;var S8=f5q;S8+=U3G;S8+=D4c;S8+=h8I;var Y1=x0W;Y1+=g29;var S7=w1w;S7+=e_G;S7+=U3G;var e1=k9m;e1+=q6U;var Z9=K$x;Z9+=S8G;Z9+=F_z;Z9+=c0g;var e$=K$x;e$+=w5r;e$+=q6U;e$+=p$O;var p9=j78;p9+=w54;var d8=X47;d8+=g7y;var e_=G7I;e_+=W0a;e_+=J7P;var y9=f9t;y9+=g69;var R_=q2G;R_+=w1Q;R_+=U5Z;var g6=y4k;g1X.g2m();g6+=n1x;g6+=Y$e;var B1=C6M;B1+=q6U;var P$=i6p;P$+=m0N;P$+=q6U;var h_=w3n;h_+=h3O;var a4=P48;a4+=X0p;if(typeof btn === a4){btn={action:function(){var Y2=P48;Y2+=b5S;this[Y2]();},text:btn};}var text=btn[h_] || btn[i30];var action=btn[P$] || btn[B1];var attr=btn[g6] || ({});$(R_,{class:_this[D5Z][y9][n7v] + (btn[e_]?V8D + btn[d8]:x8n)})[p9](typeof text === f2m?text(_this):text || x8n)[c5_](o0K,btn[e$] !== undefined?btn[Z9]:x9R)[c5_](attr)[e1](S7,function(e){g1X.g2m();var m_A="hic";var v5=T7p;v5+=m_A;v5+=j1i;if(e[v5] === O0D && action){action[B9N](_this);}})[j_R](h8D,function(e){g1X.g2m();if(e[u6e] === O0D){e[v8T]();}})[j_R](Y1,function(e){var F2H="ventD";var N8=l4F;N8+=F2H;N8+=R47;e[N8]();g1X.g2m();if(action){var a8=X47;a8+=c2r;a8+=A5M;action[a8](_this,e);}})[S8](_this[E5][j3]);});return this;}function clear(fieldName){var Z_H="plice";g1X.g2m();var y5H="deFiel";var o8S="inclu";var p58="nclu";var N81="eFie";var that=this;var sFields=this[P48][W7Q];if(typeof fieldName === V_T){var y2=W08;y2+=p58;y2+=y5H;y2+=l1J;var C9=a1x;C9+=e7E;var o$=P48;o$+=Z_H;var o_=q9X;o_+=w9V;that[G0y](fieldName)[x4X]();delete sFields[fieldName];var orderIdx=$[o8z](fieldName,this[P48][x4$]);this[P48][o_][o$](orderIdx,C05);var includeIdx=$[C9](fieldName,this[P48][y2]);if(includeIdx !== -C05){var a7=f$$;a7+=v_P;a7+=X47;a7+=J7P;var Q1=o8S;Q1+=f4b;Q1+=N81;Q1+=K42;this[P48][Q1][a7](includeIdx,C05);}}else {var k5=J7P;k5+=y4k;k5+=X47;k5+=j1i;$[k5](this[X$b](fieldName),function(i,name){that[f$O](name);});}return this;}function close(){this[f28](P3U);return this;}function create(arg1,arg2,arg3,arg4){var Y7c="rudA";var h3I="ini";var R3l="_dis";var c64="nCl";var h8W="lock";var Q1G="playReord";var H6G="tCre";var F9=h3I;F9+=H6G;F9+=y4k;F9+=w3n;var o6=E2Y;o6+=u$U;var N9=e1K;N9+=j1i;var D$=R3l;D$+=Q1G;D$+=w9V;var d6=g4U;d6+=w2v;d6+=c64;d6+=E8c;var O8=z6i;O8+=h8W;var U6=e9o;U6+=S$h;var P7=f4b;g1X.h9F();P7+=k9m;P7+=u9C;var E_=u9C;E_+=y6P;E_+=a_d;var N6=X47;N6+=C_s;var y3=V8t;y3+=n0H;var q6=u9C;q6+=I7h;q6+=J7P;var c1=P1G;c1+=Y7c;c1+=Y$e;c1+=H9U;var S6=C6M;S6+=w4s;var _this=this;var that=this;var sFields=this[P48][S6];var count=C05;if(this[T1I](function(){var l2D="crea";var p0=l2D;p0+=w3n;that[p0](arg1,arg2,arg3,arg4);})){return this;}if(typeof arg1 === V50){count=arg1;arg1=arg2;arg2=arg3;}this[P48][z0g]={};for(var i=x9R;i < count;i++){var Q$=M8C;Q$+=l1J;this[P48][z0g][i]={fields:this[P48][Q$]};}var argOpts=this[c1](arg1,arg2,arg3,arg4);this[P48][q6]=s2S;this[P48][y3]=N6;this[P48][E_]=F7$;this[P7][p2d][r08][U6]=O8;this[d6]();this[D$](this[W7Q]());$[N9](sFields,function(name,fieldIn){var P6m="tiS";fieldIn[J$c]();for(var i=x9R;i < count;i++){var K7=u2Y;K7+=C6M;var V0=S4m;V0+=P6m;V0+=t0I;fieldIn[V0](i,fieldIn[K7]());}fieldIn[P9V](fieldIn[s6g]());});this[o6](F9,F7$,function(){var P5J="yb";var p__="eOpe";var E7=s2p;g1X.g2m();E7+=P5J;E7+=p__;E7+=q6U;var W6=k9m;W6+=U3G;W6+=K$x;W6+=P48;_this[i0j]();_this[C87](argOpts[W6]);argOpts[E7]();});return this;}function undependent(parent){var E9d="undependent";var J$C='.edep';var N_=k9m;N_+=C6M;N_+=C6M;var X_=Y60;X_+=a_i;if(Array[X_](parent)){for(var i=x9R,ien=parent[p2U];i < ien;i++){this[E9d](parent[i]);}return this;}$(this[G0y](parent)[j2Q]())[N_](J$C);return this;}function dependent(parent,url,opts){var H0v="ha";var w93='json';var u8w="edep";var g5=R1Q;g5+=u8w;var l0=k9m;l0+=q6U;var K6=X47;K6+=H0v;K6+=q6U;K6+=Q8X;var n9=W4U;n9+=a5w;n9+=g6v;n9+=m4s;var t7=B9g;t7+=J7P;t7+=B36;var D3=j75;D3+=Y$e;D3+=u4G;var _this=this;if(Array[D3](parent)){for(var i=x9R,ien=parent[p2U];i < ien;i++){this[l_i](parent[i],url,opts);}return this;}var that=this;var parentField=this[t7](parent);var ajaxOpts={dataType:w93,type:n9};opts=$[W6E]({data:F7$,event:K6,postUpdate:F7$,preUpdate:F7$},opts);var update=function(json){var v8G='hide';var c4i="tUpdate";var h1w='val';var r6x="rocessing";var L6p='error';var r0Y="abe";var T$U="ostU";var h1T="disa";var H_B="preUpdate";var k$J='show';var Q0=U3G;Q0+=r6x;var P4=U3G;P4+=T$U;P4+=o3w;P4+=I3U;var e7=h1T;e7+=Q$e;var f5=J7P;f5+=q6U;f5+=y4k;f5+=Q$e;var j$=Y6r;j$+=P48;j$+=w7g;var z5=A5M;z5+=r0Y;z5+=A5M;if(opts[H_B]){opts[H_B](json);}$[h3P]({errors:L6p,labels:z5,messages:j$,options:A4a,values:h1w},function(jsonProp,fieldFn){g1X.g2m();if(json[jsonProp]){var j8=J7P;j8+=y4k;j8+=X47;j8+=j1i;$[j8](json[jsonProp],function(fieldIn,valIn){g1X.h9F();that[G0y](fieldIn)[fieldFn](valIn);});}});$[h3P]([v8G,k$J,f5,e7],function(i,key){if(json[key]){that[key](json[key],json[D77]);}});if(opts[P4]){var M6=U3G;M6+=U44;M6+=c4i;opts[M6](json);}parentField[Q0](P3U);};$(parentField[j2Q]())[l0](opts[k1n] + g5,function(e){var I2I="inObj";var E$J="nct";g1X.h9F();var Z8l="xten";var p6a="obje";var K3n="values";var D5=a1s;D5+=y4k;var I4=P_k;I4+=P48;var k8=Y$e;k8+=Y67;var s$=J7P;s$+=d7k;s$+=L58;s$+=P48;var l9=Y$e;l9+=k9m;l9+=T7p;l9+=P48;var R5=q6U;R5+=k9m;R5+=f4b;R5+=J7P;if($(parentField[R5]())[Q7_](e[Z$8])[p2U] === x9R){return;}parentField[M2v](w0_);var data={};data[l9]=_this[P48][z0g]?pluck(_this[P48][s$],y0h):F7$;data[k8]=data[I4]?data[M9E][x9R]:F7$;data[K3n]=_this[t0E]();if(opts[D5]){var ret=opts[y34](data);if(ret){var X0=r09;X0+=A7c;opts[X0]=ret;}}if(typeof url === f2m){var l7=K9A;l7+=y4k;l7+=A5M;var L$=X47;L$+=y4k;L$+=U_m;var o=url[L$](_this,parentField[l7](),data,update,e);if(o){var H4=g7z;H4+=E$J;H4+=n0H;var g7=p6a;g7+=D7i;if(typeof o === g7 && typeof o[B4R] === H4){o[B4R](function(resolved){if(resolved){update(resolved);}});}else {update(o);}}}else {var h8=J7P;h8+=Z8l;h8+=f4b;var R1=W08;R1+=w7L;R1+=I2I;R1+=k6_;if($[R1](url)){$[W6E](ajaxOpts,url);}else {ajaxOpts[j99]=url;}$[p$b]($[h8](ajaxOpts,{data:data,success:update}));}});return this;}function destroy(){var C5g="uniqu";var V_A="destro";var F2e="Controller";var X$d="temp";var K4t='.dte';var o7=C5g;o7+=J7P;var J3=b9u;J3+=F2e;if(this[P48][y7Q]){this[e0n]();}this[f$O]();if(this[P48][S8l]){var M0=X$d;M0+=A5M;M0+=I3U;$(Y9i)[k8x](this[P48][M0]);}var controller=this[P48][J3];if(controller[x4X]){var f9=V_A;f9+=a_i;controller[f9](this);}$(document)[B96](K4t + this[P48][o7]);this[s9H]=F7$;this[P48]=F7$;}function disable(name){var o$S="_fieldName";var P_=o$S;g1X.h9F();P_+=P48;var that=this;$[h3P](this[P_](name),function(i,n){var T0c="sab";var Z3=e9o;Z3+=T0c;Z3+=A5M;Z3+=J7P;g1X.h9F();var i2=B9g;i2+=R3w;that[i2](n)[Z3]();});return this;}function display(showIn){var M3=X47;g1X.g2m();M3+=F9z;M3+=P48;M3+=J7P;if(showIn === undefined){return this[P48][y7Q];}return this[showIn?G25:M3]();}function displayed(){var v7=u9C;v7+=y4k;v7+=U3G;return $[v7](this[P48][W7Q],function(fieldIn,name){g1X.h9F();return fieldIn[y7Q]()?name:F7$;});}function displayNode(){return this[P48][B4u][j2Q](this);}function edit(items,arg1,arg2,arg3,arg4){var I3i="tidy";var J1=C9_;J1+=P48;g1X.h9F();var T2=C6M;T2+=G$h;T2+=B36;T2+=P48;var b4=g4U;b4+=J7P;b4+=f4b;b4+=e1Z;var v_=g4U;v_+=I3i;var _this=this;var that=this;if(this[v_](function(){g1X.g2m();that[F2v](items,arg1,arg2,arg3,arg4);})){return this;}var argOpts=this[m6r](arg1,arg2,arg3,arg4);this[b4](items,this[e4j](T2,items),s2S,argOpts[J1],function(){var W8H="_assem";var N5V="bleM";var C1I="ain";var O2o="maybeO";var c2=O2o;c2+=m8F;c2+=q6U;var Y$=w1$;Y$+=K$x;Y$+=P48;var W_=W8H;W_+=N5V;W_+=C1I;_this[W_]();_this[C87](argOpts[Y$]);argOpts[c2]();});return this;}function enable(name){var k$=J7P;k$+=y4k;k$+=X47;k$+=j1i;var that=this;$[k$](this[X$b](name),function(i,n){var c9=J7P;c9+=q7i;g1X.h9F();c9+=V6m;c9+=J7P;that[G0y](n)[c9]();});return this;}function error$1(name,msg){var e0P="rmErro";var f3s="globalErro";var w3J="_message";var C$=a8M;C$+=J8K;var wrapper=$(this[s9H][C$]);if(msg === undefined){var a_=f3s;a_+=Y$e;var o4=C6M;o4+=k9m;o4+=e0P;o4+=Y$e;this[w3J](this[s9H][o4],name,w0_,function(){var x84="inFo";var p9l="toggleCl";var e5=x84;e5+=g69;e5+=c1C;e5+=Y$e;var X8=p9l;X8+=y4k;X8+=P48;X8+=P48;wrapper[X8](e5,name !== undefined && name !== x8n);});this[P48][a_]=name;}else {var s3=J7P;s3+=Y$e;s3+=W4S;s3+=Y$e;var H7=C6M;H7+=W08;H7+=R3w;this[H7](name)[s3](msg);}return this;}function field(name){var O$J="ld name - ";var y39="nown fie";var e9=C6M;e9+=T4f;g1X.h9F();e9+=f4b;e9+=P48;var sFields=this[P48][e9];if(!sFields[name]){var H0=j57;H0+=y39;H0+=O$J;throw new Error(H0 + name);}return sFields[name];}function fields(){var I2=u9C;g1X.h9F();I2+=y4k;I2+=U3G;return $[I2](this[P48][W7Q],function(fieldIn,name){g1X.g2m();return name;});}function file(name,id){var q5M='Unknown file id ';var z33=" in ";var tableFromFile=this[o85](name);var fileFromTable=tableFromFile[id];if(!fileFromTable){var W1=z33;W1+=o7k;W1+=p4m;throw new Error(q5M + id + W1 + name);}return tableFromFile[id];}function files(name){var e_v="il";var e$F="Unknown file table";g1X.h9F();var c3l=" name: ";if(!name){var B_=C6M;B_+=e_v;B_+=D99;return Editor[B_];}var editorTable=Editor[o85][name];if(!editorTable){var W2=e$F;W2+=c3l;throw new Error(W2 + name);}return editorTable;}function get(name){var O7=Z71;O7+=J7P;O7+=K$x;var B0=M8C;B0+=f4b;var that=this;if(!name){var I6=C6M;I6+=W08;I6+=R3w;I6+=P48;name=this[I6]();}if(Array[T6n](name)){var q8=J7P;q8+=y4k;q8+=X47;q8+=j1i;var out_1={};$[q8](name,function(i,n){var J6=Z71;g1X.h9F();J6+=t0I;out_1[n]=that[G0y](n)[J6]();});return out_1;}return this[B0](name)[O7]();}function hide(names,animate){g1X.h9F();var F8=e1K;F8+=j1i;var that=this;$[F8](this[X$b](names),function(i,n){var D8=B9g;D8+=R3w;that[D8](n)[U2S](animate);});return this;}function ids(includeHash){var U_=u9C;U_+=y4k;U_+=U3G;if(includeHash === void x9R){includeHash=P3U;}return $[U_](this[P48][z0g],function(editIn,idSrc){return includeHash === w0_?F97 + idSrc:idSrc;});}function inError(inNames){var H0G="globalError";var x1D="ormE";var L0Z="Error";var S2=b30;S2+=m3E;S2+=G3Q;S2+=D99;var s4=C6M;s4+=x1D;s4+=K8D;$(this[s9H][s4]);if(this[P48][H0G]){return w0_;}var names=this[S2](inNames);for(var i=x9R,ien=names[p2U];i < ien;i++){var n5=B2L;n5+=L0Z;if(this[G0y](names[i])[n5]()){return w0_;}}return P3U;}function inline(cell,fieldName,opts){var f$e="E_Field";var q_1='Cannot edit more than one row inline at a time';var N37="idual";var F28=g4U;F28+=J7P;F28+=f4b;F28+=e1Z;var r2=g4U;r2+=N4r;r2+=Q11;var D7=a7D;D7+=f$e;var V5=T06;V5+=B0B;var R3=l$2;R3+=J7P;R3+=a_i;R3+=P48;var o5=W08;o5+=a07;o5+=S3r;o5+=N37;var C8=I_w;C8+=I9B;var _this=this;var that=this;if($[o8q](fieldName)){opts=fieldName;fieldName=undefined;}opts=$[W6E]({},this[P48][H7v][B1P],opts);var editFields=this[C8](o5,cell,fieldName);var keys=Object[R3](editFields);if(keys[V5] > C05){throw new Error(q_1);}var editRow=editFields[keys[x9R]];var hosts=[];for(var _i=x9R,_a=editRow[R2d];_i < _a[p2U];_i++){var r8=S2N;r8+=j1i;var row=_a[_i];hosts[r8](row);}if($(D7,hosts)[p2U]){return this;}if(this[r2](function(){var H_=L8k;H_+=Z3X;that[H_](cell,fieldName,opts);})){return this;}this[F28](cell,editFields,F9A,opts,function(){_this[m0e](editFields,opts);});return this;}function inlineCreate(insertPoint,opts){var A4S="initCreat";var R25="akeRow";var c_J="nObject";var i8L="isPlai";var p7V=A4S;p7V+=J7P;var c0r=g4U;c0r+=B2L;c0r+=N4T;c0r+=J7P;var S7J=C6M;S7J+=R25;var u5g=N2Q;u5g+=T7n;var E4x=u9C;E4x+=y6P;E4x+=a_d;var A2S=s2p;A2S+=B2L;var m3b=u9C;m3b+=k9m;m3b+=f4b;m3b+=J7P;var z4X=i8L;z4X+=c_J;var _this=this;if($[z4X](insertPoint)){opts=insertPoint;insertPoint=F7$;}if(this[T1I](function(){var K2C="inlineC";var M6v=K2C;M6v+=r3C;M6v+=J7P;_this[M6v](insertPoint,opts);})){return this;}$[h3P](this[P48][W7Q],function(name,fieldIn){var i_3="R";var U8b="eset";var T36=f4b;T36+=y1n;var j9c=i6O;j9c+=a6m;var I72=S4m;I72+=N4r;I72+=i_3;I72+=U8b;fieldIn[I72]();fieldIn[j9c](x9R,fieldIn[T36]());fieldIn[P9V](fieldIn[s6g]());});this[P48][m3b]=A2S;this[P48][M8L]=a77;this[P48][E4x]=F7$;this[P48][z0g]=this[u5g](S7J,insertPoint);opts=$[W6E]({},this[P48][H7v][B1P],opts);this[E_b]();this[c0r](this[P48][z0g],opts,function(){var s40="fake";var g4I="RowEnd";var z9q="taSou";var V3A=s40;V3A+=g4I;var F9S=m_$;F9S+=z9q;F9S+=Y$e;F9S+=I9B;_this[F9S](V3A);});this[e5F](p7V,F7$);return this;}function message(name,msg){if(msg === undefined){var Z0M=g4U;Z0M+=D2u;Z0M+=y4k;Z0M+=Q8X;this[Z0M](this[s9H][M2J],name);}else {var A_b=u9C;A_b+=D99;A_b+=w4t;A_b+=J7P;var u2N=C6M;u2N+=m3E;this[u2N](name)[A_b](msg);}g1X.h9F();return this;}function mode(modeIn){g1X.h9F();var J0p="ting mode";var R2Z="ot supported";var H1d="Not currently in an edi";var K9t="m c";var j79="reate mode is n";var h_C="Changing fro";var x6Q=s1U;x6Q+=J7P;if(!modeIn){return this[P48][M8L];}if(!this[P48][M8L]){var w5G=H1d;w5G+=J0p;throw new Error(w5G);}else if(this[P48][M8L] === a77 && modeIn !== x6Q){var K82=h_C;K82+=K9t;K82+=j79;K82+=R2Z;throw new Error(K82);}this[P48][M8L]=modeIn;return this;}function modifier(){return this[P48][E6r];}function multiGet(fieldNames){var Y$g="tiGet";var b8W=u9C;b8W+=o3$;b8W+=Y$g;var k9C=M8C;k9C+=f4b;var i3f=X4s;i3f+=M6E;var that=this;if(fieldNames === undefined){fieldNames=this[W7Q]();}if(Array[i3f](fieldNames)){var k55=Y5h;k55+=X47;k55+=j1i;var out_2={};$[k55](fieldNames,function(i,name){var I9r=C6M;I9r+=G$h;I9r+=B36;out_2[name]=that[I9r](name)[p5X]();});return out_2;}return this[k9C](fieldNames)[b8W]();}function multiSet(fieldNames,valIn){var L1j="Plain";var O$p=X4s;O$p+=L1j;O$p+=P4a;var that=this;if($[O$p](fieldNames) && valIn === undefined){$[h3P](fieldNames,function(name,value){var N$n="ltiSet";var T6l=d6U;T6l+=N$n;that[G0y](name)[T6l](value);});}else {var s_K=S4m;s_K+=N4r;s_K+=g6v;s_K+=t0I;var R8c=B9g;R8c+=c_0;R8c+=f4b;this[R8c](fieldNames)[s_K](valIn);}return this;}function node(name){var v8e=q6U;v8e+=k9m;g1X.g2m();v8e+=u2Y;var E6O=s2p;E6O+=U3G;var that=this;if(!name){var V73=i5x;V73+=u2Y;V73+=Y$e;name=this[V73]();}return Array[T6n](name)?$[E6O](name,function(n){var V4t=B9g;V4t+=R3w;return that[V4t](n)[j2Q]();}):this[G0y](name)[v8e]();}function off(name,fn){var r1w=k9m;r1w+=C6M;r1w+=C6M;$(this)[r1w](this[D$5](name),fn);return this;}function on(name,fn){g1X.h9F();$(this)[j_R](this[D$5](name),fn);return this;}function one(name,fn){g1X.h9F();var v9I="tName";var w6v=g4U;w6v+=J7P;w6v+=G3s;w6v+=v9I;$(this)[N$u](this[w6v](name),fn);return this;}function open(){var X9y="_preopen";var H6$="tedOpe";var j7H="eReg";var b$O="_nes";var y$N="itOpt";var J1b=q6U;J1b+=J7P;J1b+=P48;g1X.h9F();J1b+=K$x;var H_5=M_v;H_5+=y$N;H_5+=P48;var x$0=b$O;x$0+=H6$;x$0+=q6U;var V47=u9C;V47+=y4k;V47+=W08;V47+=q6U;var l$1=P1G;l$1+=F9z;l$1+=P48;l$1+=j7H;var _this=this;this[n8W]();this[l$1](function(){var S02="_nestedCl";var K2h=S02;K2h+=f4C;_this[K2h](function(){var i5W="cInfo";var o94="osed";var o0F="_clearDynam";var A49=E$w;A49+=o94;g1X.h9F();var l01=o0F;l01+=W08;l01+=i5W;_this[l01]();_this[e5F](A49,[s2S]);});});var ret=this[X9y](V47);if(!ret){return this;}this[x$0](function(){var N4k="ene";var y8W="editOpt";var F5n=u9C;F5n+=x2I;F5n+=q6U;var S_R=k9m;S_R+=U3G;S_R+=N4k;S_R+=f4b;var P$s=C6M;P$s+=y5C;P$s+=e_G;P$s+=P48;var g_$=y8W;g_$+=P48;var Q5L=u9C;Q5L+=y4k;Q5L+=U3G;_this[d8F]($[Q5L](_this[P48][x4$],function(name){var K3_=B9g;K3_+=R3w;K3_+=P48;g1X.h9F();return _this[P48][K3_][name];}),_this[P48][g_$][P$s]);_this[e5F](S_R,[F5n,_this[P48][M8L]]);},this[P48][H_5][J1b]);this[z2B](s2S,P3U);return this;}function order(setIn){var Z5b="s, mu";var n4W="Al";var f_z="rd";var N6y="l fields, and no additional field";var k3M="st be provided for ordering.";g1X.g2m();var Y5v="sor";var p_Z="sort";var f2N="isplayReord";var H$r=K$U;H$r+=f2N;H$r+=J7P;H$r+=Y$e;var B0S=Y5v;B0S+=K$x;var y21=M2a;y21+=J7P;var U50=K8$;U50+=k9m;U50+=B2L;if(!setIn){var E8f=k9m;E8f+=f_z;E8f+=J7P;E8f+=Y$e;return this[P48][E8f];}if(arguments[p2U] && !Array[T6n](setIn)){var n35=M2a;n35+=J7P;var g9c=G$W;g9c+=U3G;g9c+=J7P;setIn=Array[g9c][n35][B9N](arguments);}if(this[P48][x4$][P4$]()[p_Z]()[U50](k42) !== setIn[y21]()[B0S]()[y1J](k42)){var v_7=n4W;v_7+=N6y;v_7+=Z5b;v_7+=k3M;throw new Error(v_7);}$[W6E](this[P48][x4$],setIn);this[H$r]();return this;}function remove(items,arg1,arg2,arg3,arg4){var Y$T="ionClass";var l_l='fields';var M3N="_t";g1X.h9F();var S$2="_act";var V6R="_crud";var o6Q="Arg";var L1C='initRemove';var F34="idy";var d30=f4b;d30+=y4k;d30+=K$x;d30+=y4k;var v2e=q6U;v2e+=h9P;var m$f=S$2;m$f+=Y$T;var i2q=e9o;i2q+=P48;i2q+=E70;var z$0=P48;z$0+=d4a;z$0+=W_c;var o6D=j1d;o6D+=u9C;var p3F=w$5;p3F+=k9m;p3F+=q6U;var n6d=V6R;n6d+=o6Q;n6d+=P48;var z_r=M3N;z_r+=F34;var _this=this;var that=this;if(this[z_r](function(){that[e3f](items,arg1,arg2,arg3,arg4);})){return this;}if(items[p2U] === undefined){items=[items];}var argOpts=this[n6d](arg1,arg2,arg3,arg4);var editFields=this[e4j](l_l,items);this[P48][p3F]=c$T;this[P48][E6r]=items;this[P48][z0g]=editFields;this[o6D][p2d][z$0][i2q]=Q4c;this[m$f]();this[e5F](L1C,[pluck(editFields,v2e),pluck(editFields,d30),items],function(){var C46="initMultiRemo";var z4$=C46;z4$+=I_4;_this[e5F](z4$,[editFields,items],function(){var b$k="maybeOpen";var Q9Z="ormOpti";var N0B=C6M;N0B+=k9m;N0B+=X47;N0B+=L2l;var R4F=J7P;R4F+=d7k;R4F+=u2c;R4F+=P48;var u1W=b30;u1W+=Q9Z;u1W+=Y2l;_this[i0j]();_this[u1W](argOpts[Z1T]);argOpts[b$k]();var opts=_this[P48][R4F];if(opts[N0B] !== F7$){var W$J=U67;W$J+=O63;var y6Q=f4b;y6Q+=k9m;y6Q+=u9C;var t0W=z6i;t0W+=Z1B;$(t0W,_this[y6Q][W$J])[G9e](opts[V0_])[V0_]();}});});return this;}function set(setIn,valIn){var J5h="sPlainObjec";var O2Q=W08;O2Q+=J5h;g1X.h9F();O2Q+=K$x;var that=this;if(!$[O2Q](setIn)){var o={};o[setIn]=valIn;setIn=o;}$[h3P](setIn,function(n,v){var A_T=M8C;A_T+=f4b;that[A_T](n)[P9V](v);});return this;}function show(names,animate){var N_y="_fieldNa";var w0W=N_y;w0W+=g_I;var that=this;$[h3P](this[w0W](names),function(i,n){var H6J=P48;H6J+=j1i;H6J+=k9m;H6J+=T7p;var F1_=T2z;F1_+=B36;that[F1_](n)[H6J](animate);});return this;}function submit(successCallback,errorCallback,formatdata,hideIn){var W38="_pro";var A8w=J7P;A8w+=i6p;A8w+=j1i;var B5G=W38;B5G+=N2F;var _this=this;var sFields=this[P48][W7Q];var errorFields=[];g1X.g2m();var errorReady=x9R;var sent=P3U;if(this[P48][M2v] || !this[P48][M8L]){return this;}this[B5G](w0_);var send=function(){var A8f="nitSub";var P$G=w$5;P$G+=j_R;var d5H=W08;d5H+=A8f;d5H+=h1a;d5H+=K$x;var q0$=Q1e;q0$+=J7P;q0$+=u$U;if(errorFields[p2U] !== errorReady || sent){return;}_this[q0$](d5H,[_this[P48][P$G]],function(result){var y1W=s_W;y1W+=b5S;if(result === P3U){_this[C9Y](P3U);return;}sent=w0_;_this[y1W](successCallback,errorCallback,formatdata,hideIn);});};this[F3P]();$[A8w](sFields,function(name,fieldIn){var s7J=W08;s7J+=l65;s7J+=Y$e;s7J+=Q90;if(fieldIn[s7J]()){errorFields[s6F](name);}});$[h3P](errorFields,function(i,name){g1X.g2m();sFields[name][F3P](x8n,function(){errorReady++;send();});});send();return this;}function table(setIn){var T9a=A7c;T9a+=V6m;T9a+=J7P;if(setIn === undefined){var u7A=A7c;u7A+=z6i;u7A+=W_c;return this[P48][u7A];}this[P48][T9a]=setIn;return this;}function template(setIn){var c7C="mpl";var u28=w3n;u28+=c7C;u28+=R01;u28+=J7P;if(setIn === undefined){return this[P48][S8l];}this[P48][u28]=setIn === F7$?F7$:$(setIn);return this;}function title(titleIn){var F7A="iv.";var D2r=C6M;D2r+=P8c;g1X.g2m();var I8o=m4g;I8o+=u$U;var h4K=f4b;h4K+=F7A;var w_r=f4b;w_r+=k9m;w_r+=u9C;var header=$(this[w_r][V6f])[d_w](h4K + this[D5Z][V6f][I8o]);if(titleIn === undefined){return header[K0h]();}if(typeof titleIn === D2r){var w6R=U39;w6R+=W08;titleIn=titleIn(this,new DataTable$4[w6R](this[P48][o7k]));}header[K0h](titleIn);return this;}function val(fieldIn,value){if(value !== undefined || $[o8q](fieldIn)){var X3w=P48;X3w+=J7P;X3w+=K$x;return this[X3w](fieldIn,value);}return this[B3M](fieldIn);;}function error(msg,tn,thro){var J7Y="warn";var D5T=' For more information, please refer to https://datatables.net/tn/';if(thro === void x9R){thro=w0_;}var display=tn?msg + D5T + tn:msg;if(thro){throw display;}else {console[J7Y](display);}}function pairs(data,props,fn){var G1_="sAr";var Q00=W08;Q00+=G1_;Q00+=I5o;Q00+=a_i;var T5F=K9A;T5F+=y4k;T5F+=Y7T;T5F+=J7P;var L8C=A5M;L8C+=y4k;L8C+=m2r;L8C+=A5M;var l9K=C6x;l9K+=J7P;l9K+=a07;var i;var ien;var dataPoint;props=$[l9K]({label:L8C,value:T5F},props);if(Array[Q00](data)){var W4c=U$f;W4c+=j1i;for((i=x9R,ien=data[W4c]);i < ien;i++){dataPoint=data[i];if($[o8q](dataPoint)){var W2u=y4k;W2u+=K$x;W2u+=K$x;W2u+=Y$e;var J5y=A5M;J5y+=y4k;J5y+=Z4A;var u3E=e7g;u3E+=I2A;fn(dataPoint[props[u3E]] === undefined?dataPoint[props[i30]]:dataPoint[props[E3b]],dataPoint[props[J5y]],i,dataPoint[W2u]);}else {fn(dataPoint,dataPoint,i);}}}else {i=x9R;$[h3P](data,function(key,val){fn(val,key,i);i++;});}}function upload$1(editor,conf,files,progressCallback,completeCallback){var J0q="tL";var z_I="_limitLeft";var a4i="readAsDataURL";var s7c="adText";var U5b="ver error occurred while uploading the file";var H1h="</i>";var g0A="splic";var P$R="ading file";g1X.g2m();var C8c="_lim";var o0n="Uplo";var S2T="A ser";var P4S="<i>";var u6b="onload";var V14="Re";var K_w=C8c;K_w+=W08;K_w+=J0q;K_w+=W$X;var a8N=P4S;a8N+=o0n;a8N+=P$R;a8N+=H1h;var x27=B9g;x27+=W_c;x27+=V14;x27+=s7c;var B$7=J7P;B$7+=Y$e;B$7+=Y$e;B$7+=i5x;var reader=new FileReader();var counter=x9R;var ids=[];var generalError=S2T;generalError+=U5b;editor[B$7](conf[t$2],x8n);if(typeof conf[p$b] === f2m){conf[p$b](files,function(idsIn){var v1f=X47;v1f+=y4k;g1X.g2m();v1f+=A5M;v1f+=A5M;completeCallback[v1f](editor,idsIn);});return;}progressCallback(conf,conf[x27] || a8N);reader[u6b]=function(e){var O9s="aj";var g5j="uploa";var l92="aja";var e5Y="xData";var s1_='Upload feature cannot use `ajax.data` with an object. Please use it as a function instead.';var u8R="upload";var B6i='upload';var B3G="No Ajax option specified";var M$H='preUpload';var C8u="ajaxData";var U$g=" for upload plug-";var y2l='uploadField';var v08=r09;v08+=K$x;v08+=y4k;var R3c=Y4l;R3c+=n0H;var s4T=y4k;s4T+=K8$;s4T+=y4k;s4T+=W4t;var r1x=y4k;r1x+=K8$;r1x+=y4k;r1x+=W4t;var G5H=l92;G5H+=W4t;var a_y=f5q;a_y+=m8F;a_y+=q6U;a_y+=f4b;var T0Y=q6U;T0Y+=y4k;T0Y+=Y6r;var R_4=f5q;R_4+=U3G;R_4+=J7P;R_4+=a07;var data=new FormData();var ajax;data[k8x](l$f,B6i);data[R_4](y2l,conf[T0Y]);data[a_y](B6i,files[counter]);if(conf[C8u]){var g08=l92;g08+=e5Y;conf[g08](data,files[counter],counter);}if(conf[G5H]){ajax=conf[p$b];}else if($[o8q](editor[P48][r1x])){var I$B=g5j;I$B+=f4b;var f$8=O9s;f$8+=y4k;f$8+=W4t;var U7_=O9s;U7_+=h26;ajax=editor[P48][U7_][u8R]?editor[P48][f$8][I$B]:editor[P48][p$b];}else if(typeof editor[P48][s4T] === V_T){ajax=editor[P48][p$b];}if(!ajax){var b_Y=B3G;b_Y+=U$g;b_Y+=B2L;throw new Error(b_Y);}if(typeof ajax === V_T){ajax={url:ajax};}if(typeof ajax[y34] === R3c){var L4W=P48;L4W+=I1p;L4W+=q6U;L4W+=Z71;var d={};var ret=ajax[y34](d);if(ret !== undefined && typeof ret !== L4W){d=ret;}$[h3P](d,function(key,value){data[k8x](key,value);});}else if($[o8q](ajax[v08])){throw new Error(s1_);}editor[e5F](M$H,[conf[t$2],files[counter],data],function(preRet){var Z79="ja";var H7E="load";var J9I='post';var d8_="hr";var v49='preSubmit.DTE_Upload';g1X.g2m();var A0f=K8$;A0f+=P48;A0f+=k9m;A0f+=q6U;var y66=J7P;y66+=E6e;var s73=y4k;s73+=Z79;s73+=W4t;if(preRet === P3U){var d6p=W_c;d6p+=q12;if(counter < files[d6p] - C05){counter++;reader[a4i](files[counter]);}else {completeCallback[B9N](editor,ids);}return;}var submit=P3U;editor[j_R](v49,function(){submit=w0_;return P3U;});$[s73]($[y66]({},ajax,{contentType:P3U,data:data,dataType:A0f,error:function(xhr){var t4X="XhrError";g1X.g2m();var J1V=g5j;J1V+=f4b;J1V+=t4X;var v7N=w9V;v7N+=W4S;v7N+=Y$e;editor[v7N](conf[t$2],generalError);editor[e5F](J1V,[conf[t$2],xhr]);progressCallback(conf);},processData:P3U,success:function(json){var L0B="bmit.DTE_Up";var v8o="ors";var Z33="uploadX";var Y0A="Success";var I5B="preS";var R7B=W08;R7B+=f4b;var s3_=S7M;s3_+=H7E;var S5M=T$a;S5M+=i5x;var I74=G0y;I74+=c1C;I74+=Y$e;I74+=P48;var l6g=q6U;l6g+=y4k;l6g+=u9C;l6g+=J7P;var q7y=Z33;q7y+=d8_;q7y+=Y0A;var m1G=W1Y;m1G+=K9A;m1G+=k04;var F2J=I5B;F2J+=e_G;F2J+=L0B;F2J+=H7E;editor[B96](F2J);editor[m1G](q7y,[conf[l6g],json]);if(json[I74] && json[t7M][p2U]){var M91=q2r;M91+=Y$e;M91+=Y$e;M91+=v8o;var errors=json[M91];for(var i=x9R,ien=errors[p2U];i < ien;i++){var z29=T$a;z29+=i5x;editor[z29](errors[i][t$2],errors[i][H6a]);}}else if(json[S5M]){var V40=w9V;V40+=Y$e;V40+=k9m;V40+=Y$e;var t_9=J7P;t_9+=Y$e;t_9+=W4S;t_9+=Y$e;editor[t_9](json[V40]);}else if(!json[u8R] || !json[s3_][R7B]){var i8q=q7i;i8q+=Y6r;editor[F3P](conf[i8q],generalError);}else {var K87=I6k;K87+=f3U;var q_W=i_u;q_W+=P48;q_W+=j1i;if(json[o85]){$[h3P](json[o85],function(table,filesIn){g1X.g2m();var m4W="file";var u6Z=J7P;u6Z+=E6e;if(!Editor[o85][table]){var G_t=m4W;G_t+=P48;Editor[G_t][table]={};}$[u6Z](Editor[o85][table],filesIn);});}ids[q_W](json[u8R][d4U]);if(counter < files[K87] - C05){counter++;reader[a4i](files[counter]);}else {completeCallback[B9N](editor,ids);if(submit){var w9N=P48;w9N+=u3p;w9N+=h1a;w9N+=K$x;editor[w9N]();}}}progressCallback(conf);},type:J9I,xhr:function(){var O$2="onprogress";var x0J="ajaxSettings";var A6a="onloadend";g1X.g2m();var w1m=S7M;w1m+=H7E;var D9u=W4t;D9u+=d8_;var xhr=$[x0J][D9u]();if(xhr[w1m]){var X8O=S7M;X8O+=F9z;X8O+=y4k;X8O+=f4b;xhr[u8R][O$2]=function(){var e_O='%';var E$R=':';var Y1D=100;var w1u="mpu";var W9p="xed";var q$i="engthCo";var v8I=A5M;v8I+=q$i;v8I+=w1u;v8I+=o7k;if(e[v8I]){var e$1=W_c;e$1+=q12;var w6g=F9d;w6g+=g7q;w6g+=W08;w6g+=W9p;var U$D=K$x;U$D+=s6r;U$D+=c2r;var U5l=H7E;U5l+=J7P;U5l+=f4b;var percent=(e[U5l] / e[U$D] * Y1D)[w6g](x9R) + e_O;progressCallback(conf,files[p2U] === C05?percent:counter + E$R + files[e$1] + V8D + percent);}};xhr[X8O][A6a]=function(){var P0U='Processing';g1X.h9F();var P5B="processingText";progressCallback(conf,conf[P5B] || P0U);};}return xhr;}}));});};files=$[C5E](files,function(val){return val;});if(conf[K_w] !== undefined){var I1i=W_c;I1i+=F7P;I1i+=j1i;var K$q=g0A;K$q+=J7P;files[K$q](conf[z_I],files[I1i]);}reader[a4i](files[x9R]);}var DataTable$3=$[C6$][o_i];var _inlineCounter=x9R;function _actionClass(){var t6C="addClas";var i7x="moveClass";var W$n="actions";var B4y="ddClass";var p$i="Cl";var D0K=A5l;D0K+=z60;var H9u=J7P;H9u+=f4b;H9u+=e1Z;var I2d=r6v;I2d+=h3C;var e6L=A5l;e6L+=i7x;var R7A=j1d;g1X.h9F();R7A+=u9C;var classesActions=this[D5Z][W$n];var action=this[P48][M8L];var wrapper=$(this[R7A][M70]);wrapper[e6L]([classesActions[I2d],classesActions[F2v],classesActions[e3f]][y1J](V8D));if(action === a77){var I47=X47;I47+=r3C;I47+=J7P;var r59=K6g;r59+=f4b;r59+=p$i;r59+=E8c;wrapper[r59](classesActions[I47]);}else if(action === H9u){var K7t=y4k;K7t+=B4y;wrapper[K7t](classesActions[F2v]);}else if(action === D0K){var f_B=t6C;f_B+=P48;wrapper[f_B](classesActions[e3f]);}}function _ajax(data,success,error,submitParams){var B2I="omp";var T9I="js";var F1n="Bod";var W8y="repla";var A8b="lete";var Z0r="inObject";var f3O="eteBo";var k94="replacements";var f6o="complete";var Q6z="isPla";var S7Y='DELETE';var m8x="xO";var h6B="cements";var I57=/{id}/;var T24="lac";var C7W=/_id_/;var e$p="ata";var p_s="inde";var M0L='?';var l9y="del";var k_i="nction";var X$u="oi";var t_4=y4k;t_4+=K8$;t_4+=y4k;t_4+=W4t;var V_Q=l9y;V_Q+=f3O;V_Q+=f4b;V_Q+=a_i;var F03=u2Y;F03+=A8b;F03+=F1n;F03+=a_i;var t7Q=Y$e;t7Q+=U2i;t7Q+=T24;t7Q+=J7P;var Z8i=e_G;Z8i+=Y$e;Z8i+=A5M;var L_2=g7z;L_2+=k_i;var I7y=Q6z;I7y+=Z0r;var u6z=K8$;u6z+=X$u;u6z+=q6U;var t5d=d4U;t5d+=g6v;t5d+=Y$e;t5d+=X47;var n2W=W4U;n2W+=a5w;n2W+=g6v;n2W+=m4s;var T1v=T9I;T1v+=k9m;T1v+=q6U;var f0I=y4k;f0I+=t9v;var action=this[P48][f0I];var thrown;var opts={complete:[function(xhr,text){var l3j="onseJSON";var g0f="esponseJSON";var v1q="parse";var I3I=204;var U9j="respon";var b0F=400;var y3g="responseText";var N28="tu";var e9A="esp";var M7o="Te";var A0m=X4s;A0m+=M6E;var L5G=q6U;L5G+=e_G;L5G+=A5M;L5G+=A5M;var h0b=U9j;h0b+=x_J;h0b+=M7o;h0b+=h3O;var a_S=C6g;a_S+=y4k;a_S+=N28;a_S+=P48;var json=F7$;if(xhr[a_S] === I3I || xhr[h0b] === L5G){json={};}else {try{var Q0l=Y$e;Q0l+=e9A;Q0l+=l3j;var g7n=Y$e;g7n+=g0f;json=xhr[g7n]?xhr[Q0l]:JSON[v1q](xhr[y3g]);}catch(e){}}if($[o8q](json) || Array[A0m](json)){success(json,xhr[H6a] >= b0F,xhr);}else {error(xhr,text,thrown);}}],data:F7$,dataType:T1v,error:[function(xhr,text,err){g1X.g2m();thrown=err;}],success:[],type:n2W};var a;var ajaxSrc=this[P48][p$b];var id=action === p4w || action === c$T?pluck(this[P48][z0g],t5d)[u6z](J10):F7$;if($[I7y](ajaxSrc) && ajaxSrc[action]){ajaxSrc=ajaxSrc[action];}if(typeof ajaxSrc === L_2){ajaxSrc(F7$,F7$,data,success,error);return;}else if(typeof ajaxSrc === V_T){var G$O=p_s;G$O+=z3f;if(ajaxSrc[G$O](V8D) !== -C05){var X2l=P48;X2l+=U3G;X2l+=v_P;X2l+=K$x;a=ajaxSrc[X2l](V8D);opts[n_a]=a[x9R];opts[j99]=a[C05];}else {opts[j99]=ajaxSrc;}}else {var U0E=P5I;U0E+=y72;var P4W=w9V;P4W+=Y$e;P4W+=i5x;var f53=P5I;f53+=y72;var optsCopy=$[f53]({},ajaxSrc || ({}));if(optsCopy[f6o]){var l6l=X47;l6l+=B2I;l6l+=A8b;opts[f6o][H8W](optsCopy[l6l]);delete optsCopy[f6o];}if(optsCopy[P4W]){var b$U=J7P;b$U+=i3E;b$U+=Y$e;var l7$=m2l;l7$+=b7B;l7$+=K$x;opts[F3P][l7$](optsCopy[b$U]);delete optsCopy[F3P];}opts=$[U0E]({},opts,optsCopy);}if(opts[k94]){var R$r=W8y;R$r+=h6B;var Z2U=J7P;Z2U+=i6p;Z2U+=j1i;$[Z2U](opts[R$r],function(key,repl){var n64='{';var s0w="rl";var M7G='}';var i2_=L6P;i2_+=A5M;var Q_v=e_G;Q_v+=s0w;opts[Q_v]=opts[i2_][q9A](n64 + key + M7G,repl[B9N](this,key,id,action,data));});}opts[Z8i]=opts[j99][q9A](C7W,id)[t7Q](I57,id);if(opts[y34]){var P0K=P5I;P0K+=K$x;P0K+=Z9U;var E3o=r09;E3o+=A7c;var J6o=e0F;J6o+=j_R;var q6i=f4b;q6i+=e$p;var isFn=typeof opts[q6i] === J6o;var newData=isFn?opts[E3o](data):opts[y34];data=isFn && newData?newData:$[P0K](w0_,data,newData);}opts[y34]=data;if(opts[n_a] === S7Y && (opts[F03] === undefined || opts[V_Q] === w0_)){var m7V=f4b;m7V+=y4k;m7V+=K$x;m7V+=y4k;var x7I=x3d;x7I+=J7P;x7I+=m8x;x7I+=C6M;var O6l=e_G;O6l+=Y$e;O6l+=A5M;var x1Z=U3G;x1Z+=y4k;x1Z+=I5o;x1Z+=u9C;var params=$[x1Z](opts[y34]);opts[O6l]+=opts[j99][x7I](M0L) === -C05?M0L + params:l14 + params;delete opts[m7V];}$[t_4](opts);}function _animate(target,style,time,callback){var c3Z="mate";var j$J=C6M;j$J+=q6U;g1X.h9F();if($[j$J][D77]){var Y$H=O7S;Y$H+=c3Z;var v3M=P48;v3M+=V3I;target[v3M]()[Y$H](style,time,callback);}else {var G6r=C6M;G6r+=P8c;var V$h=X47;V$h+=P48;V$h+=P48;target[V$h](style);if(typeof time === G6r){time[B9N](target);}else if(callback){callback[B9N](target);}}}function _assembleMain(){var k07="bodyContent";var v7x=y4k;v7x+=R5e;v7x+=a07;var l2i=w1o;l2i+=D4c;l2i+=f4b;var D4H=y2n;D4H+=e7H;var B8O=M6g;B8O+=a07;var v6j=f9t;v6j+=k9m;v6j+=K$x;v6j+=w9V;var E0r=T7p;g1X.h9F();E0r+=Y$e;E0r+=U_l;var dom=this[s9H];$(dom[E0r])[T7N](dom[V6f]);$(dom[v6j])[B8O](dom[O9R])[k8x](dom[D4H]);$(dom[k07])[l2i](dom[M2J])[v7x](dom[p2d]);}function _blur(){var j4h="nB";var J6B="eB";var w_y="lur";var j4b=E$w;j4b+=k9m;j4b+=x_J;var c9B=P48;c9B+=b5S;var u5Y=Q4J;u5Y+=J6B;g1X.h9F();u5Y+=A5M;u5Y+=L6P;var o7e=g4U;o7e+=Y_I;o7e+=J7P;o7e+=u$U;var N9p=k9m;N9p+=j4h;N9p+=w_y;var opts=this[P48][Z_P];var onBlur=opts[N9p];if(this[o7e](u5Y) === P3U){return;}if(typeof onBlur === f2m){onBlur(this);}else if(onBlur === c9B){var q9c=K3A;q9c+=z6i;q9c+=u9C;q9c+=e1Z;this[q9c]();}else if(onBlur === j4b){this[f28]();}}function _clearDynamicInfo(errorsOnly){var q5T="wrappe";var q47="ag";var n2o="em";var d9m="oveClass";var h0A="v.";var i2i=Y$e;i2i+=n2o;i2i+=d9m;var m8e=q5T;m8e+=Y$e;var x2S=e9o;x2S+=h0A;var M$u=T2z;M$u+=K42;var O_q=E$w;O_q+=g1E;g1X.g2m();if(errorsOnly === void x9R){errorsOnly=P3U;}if(!this[P48]){return;}var errorClass=this[O_q][G0y][F3P];var fields=this[P48][M$u];$(x2S + errorClass,this[s9H][m8e])[i2i](errorClass);$[h3P](fields,function(name,field){var q10=w9V;q10+=Y$e;q10+=i5x;field[q10](x8n);if(!errorsOnly){var I7H=g_I;I7H+=w7g;field[I7H](x8n);}});this[F3P](x8n);if(!errorsOnly){var H_j=D2u;H_j+=q47;H_j+=J7P;this[H_j](x8n);}}function _close(submitComplete,mode){var K_3="isplayed";var r6B="oseCb";var J1J='preClose';var t0x="Ic";var P$4=f4b;P$4+=K_3;var k5A=k9m;k5A+=C6M;k5A+=C6M;var x5J=X47;x5J+=t6S;x5J+=t0x;x5J+=z6i;var closed;if(this[e5F](J1J) === P3U){return;}if(this[P48][Q3l]){var M3e=X47;M3e+=A5M;M3e+=r6B;closed=this[P48][M3e](submitComplete,mode);this[P48][Q3l]=F7$;}if(this[P48][x5J]){this[P48][f_L]();this[P48][f_L]=F7$;}$(Y9i)[k5A](E8g);this[P48][P$4]=P3U;this[e5F](s17);if(closed){var m1h=W1Y;m1h+=K9A;m1h+=J7P;m1h+=u$U;this[m1h](n4k,[closed]);}}function _closeReg(fn){this[P48][Q3l]=fn;}function _crudArgs(arg1,arg2,arg3,arg4){var i4f="ainObject";var j5J="isPl";var F5W="olean";var T3S=u9C;T3S+=y4k;T3S+=B2L;var M3i=Q9I;M3i+=a07;var y4g=S1L;y4g+=F5W;var O6m=j5J;O6m+=i4f;var that=this;var title;var buttons;var show;var opts;if($[O6m](arg1)){opts=arg1;}else if(typeof arg1 === y4g){show=arg1;opts=arg2;;}else {title=arg1;buttons=arg2;show=arg3;opts=arg4;;}if(show === undefined){show=w0_;}if(title){that[O$b](title);}if(buttons){var g$z=z6i;g$z+=i$U;that[g$z](buttons);}return {maybeOpen:function(){if(show){that[E4z]();}},opts:$[M3i]({},this[P48][H7v][T3S],opts)};}function _dataSource(name){var i_2="taSources";var M2b=r09;M2b+=i_2;var x73=f4b;x73+=y4k;x73+=H4n;var M1v=T06;M1v+=K$x;M1v+=j1i;var args=[];for(var _i=C05;_i < arguments[M1v];_i++){args[_i - C05]=arguments[_i];}var dataSource=this[P48][o7k]?Editor[z8m][x73]:Editor[M2b][K0h];var fn=dataSource[name];if(fn){return fn[R$p](this,args);}}function _displayReorder(includeFields){var J48="eta";var l70="lay";var p5J="Order";var V56="deFie";var S4X="ormCon";var E2j="ncl";var Y77="incl";var C3h="orde";var H7u="emp";var S4t="udeF";var a9x=T$f;a9x+=l70;a9x+=p5J;var H6h=u9C;H6h+=y4k;H6h+=B2L;var E3E=J7P;E3E+=y4k;E3E+=X47;E3E+=j1i;g1X.h9F();var W2Z=f4b;W2Z+=J48;W2Z+=R0n;var I$U=K$x;I$U+=H7u;I$U+=O$K;I$U+=w3n;var h1H=C3h;h1H+=Y$e;var J4S=C6M;J4S+=S4X;J4S+=Q7A;J4S+=K$x;var _this=this;var formContent=$(this[s9H][J4S]);var fields=this[P48][W7Q];var order=this[P48][h1H];var template=this[P48][I$U];var mode=this[P48][g9H] || s2S;if(includeFields){var u3W=Y77;u3W+=e_G;u3W+=V56;u3W+=K42;this[P48][u3W]=includeFields;}else {var G01=W08;G01+=E2j;G01+=S4t;G01+=w4s;includeFields=this[P48][G01];}formContent[d_w]()[W2Z]();$[E3E](order,function(i,name){var t0J="ft";var d$e='editor-field[name="';var W8z='[data-editor-template="';if(_this[Y8k](name,includeFields) !== -C05){var a2B=u9C;a2B+=x2I;a2B+=q6U;if(template && mode === a2B){var a8A=q6U;a8A+=I7h;a8A+=J7P;var p4t=f5q;p4t+=m8F;p4t+=q6U;p4t+=f4b;var n4w=B9g;n4w+=a07;var E6d=q6U;E6d+=k9m;E6d+=f4b;E6d+=J7P;var Q3$=y4k;Q3$+=t0J;Q3$+=J7P;Q3$+=Y$e;var V_Y=y$Z;V_Y+=u4K;var j50=U4P;j50+=f4b;template[j50](d$e + name + V_Y)[Q3$](fields[name][E6d]());template[n4w](W8z + name + N5P)[p4t](fields[name][a8A]());}else {var d$V=y4k;d$V+=U3G;d$V+=T8c;formContent[d$V](fields[name][j2Q]());}}});if(template && mode === H6h){template[l$j](formContent);}this[e5F](a9x,[this[P48][y7Q],this[P48][M8L],formContent]);}function _edit(items,editFields,type,formOptions,setupDone){var J14="tionCl";var l2F='node';var R_z="ispl";var D1b="editData";var B2n="difi";var D0l="Edit";var k7E=b1k;k7E+=D0l;var y64=K$U;y64+=R_z;y64+=M9g;var A74=M2a;A74+=J7P;var J2b=V5o;J2b+=X47;J2b+=J14;J2b+=E8c;var s5u=f4b;s5u+=K1K;s5u+=O$K;s5u+=a_i;var c5T=f4b;c5T+=k9m;c5T+=u9C;var Z0Z=J7P;Z0Z+=d7k;var x3P=u9C;x3P+=k9m;x3P+=B2n;x3P+=w9V;var G6C=C6M;G6C+=w4s;var _this=this;var fields=this[P48][G6C];var usedFields=[];var includeInOrder;var editData={};this[P48][z0g]=editFields;this[P48][D1b]=editData;this[P48][x3P]=items;this[P48][M8L]=Z0Z;this[c5T][p2d][r08][s5u]=q3u;this[P48][g9H]=type;this[J2b]();$[h3P](fields,function(name,field){var G9_="multiValueC";var H_K="iRese";var h_Y=g4U;h_Y+=G9_;h_Y+=j1i;h_Y+=Y1V;var s3$=S4m;s3$+=K$x;s3$+=H_K;s3$+=K$x;field[s3$]();includeInOrder=P3U;editData[name]={};$[h3P](editFields,function(idSrc,edit){var t9o="nul";var s5X="valFr";var o6z="omD";var C8C="lDefau";var h1i="cope";var b1g=G0y;b1g+=P48;if(edit[b1g][name]){var c6r=P48;c6r+=h1i;var m5j=P48;m5j+=v_P;m5j+=I9B;var a8Z=t9o;a8Z+=C8C;a8Z+=x2Y;var f5v=s5X;f5v+=o6z;f5v+=R01;f5v+=y4k;var val=field[f5v](edit[y34]);var nullDefault=field[a8Z]();editData[name][idSrc]=val === F7$?x8n:Array[T6n](val)?val[m5j]():val;if(!formOptions || formOptions[c6r] === A1l){field[t1r](idSrc,val === undefined || nullDefault && val === F7$?field[s6g]():val,P3U);if(!edit[I7m] || edit[I7m][name]){includeInOrder=w0_;}}else {if(!edit[I7m] || edit[I7m][name]){var Z69=R$W;Z69+=W08;Z69+=a6m;field[Z69](idSrc,val === undefined || nullDefault && val === F7$?field[s6g]():val,P3U);includeInOrder=w0_;}}}});field[h_Y]();if(field[E24]()[p2U] !== x9R && includeInOrder){var S1_=U3G;S1_+=e_G;S1_+=P48;S1_+=j1i;usedFields[S1_](name);}});var currOrder=this[x4$]()[A74]();for(var i=currOrder[p2U] - C05;i >= x9R;i--){if($[o8z](currOrder[i][P41](),usedFields) === -C05){currOrder[T9f](i,C05);}}this[y64](currOrder);this[e5F](k7E,[pluck(editFields,l2F)[x9R],pluck(editFields,y0h)[x9R],items,type],function(){g1X.g2m();var H4b='initMultiEdit';_this[e5F](H4b,[editFields,items,type],function(){g1X.h9F();setupDone();});});}function _event(trigger,args,promiseComplete){var R72="Han";var g2V="Event";var n_O='pre';var q$I="triggerHa";var r5E='Cancelled';var z5A="bjec";var M0I="result";var x_9="ler";var k8$="Eve";var v4z=Y60;v4z+=a_i;if(args === void x9R){args=[];}if(promiseComplete === void x9R){promiseComplete=undefined;}g1X.h9F();if(Array[v4z](trigger)){var w0V=A5M;w0V+=D4c;w0V+=x6u;w0V+=j1i;for(var i=x9R,ien=trigger[w0V];i < ien;i++){this[e5F](trigger[i],args);}}else {var h5W=v47;h5W+=R72;h5W+=f4b;h5W+=x_9;var e=$[g2V](trigger);$(this)[h5W](e,args);var result=e[M0I];if(trigger[x2T](n_O) === x9R && result === P3U){var J1j=k8$;J1j+=u$U;var a5G=q$I;a5G+=j07;$(this)[a5G]($[J1j](trigger + r5E),args);}if(promiseComplete){var q3F=k9m;q3F+=z5A;q3F+=K$x;if(result && typeof result === q3F && result[B4R]){var q88=K$x;q88+=j1i;q88+=J7P;q88+=q6U;result[q88](promiseComplete);}else {promiseComplete(result);}}return result;}}function _eventName(input){var Z$6="toLowerCase";var S7u="tc";var L3F=/^on([A-Z])/;var j7x="substring";var A4c=I3y;A4c+=W08;A4c+=q6U;var g1$=U$f;g1$+=j1i;var name;var names=input[Z_2](V8D);for(var i=x9R,ien=names[g1$];i < ien;i++){var i8H=s2p;i8H+=S7u;i8H+=j1i;name=names[i];var onStyle=name[i8H](L3F);if(onStyle){name=onStyle[C05][Z$6]() + name[j7x](d6b);}names[i]=name;}g1X.h9F();return names[A4c](V8D);}function _fieldFromNode(node){var K5i=J7P;K5i+=i6p;K5i+=j1i;var foundField=F7$;$[K5i](this[P48][W7Q],function(name,field){var L6I=U4P;L6I+=f4b;g1X.h9F();if($(field[j2Q]())[L6I](node)[p2U]){foundField=field;}});return foundField;}function _fieldNames(fieldNames){var i70=X4s;i70+=Y36;i70+=I5o;g1X.g2m();i70+=a_i;if(fieldNames === undefined){return this[W7Q]();}else if(!Array[i70](fieldNames)){return [fieldNames];}return fieldNames;}function _focus(fieldsIn,focus){var Q_p='jq:';var V5j=/^jq:/;var D8e="ctiv";var g0M='div.DTE ';var P$I=u9C;P$I+=y4k;P$I+=U3G;var s$l=A5l;s$l+=u9C;s$l+=k9m;s$l+=I_4;var k0f=i6p;k0f+=N4r;k0f+=j_R;var _this=this;if(this[P48][k0f] === s$l){return;}var field;var fields=$[P$I](fieldsIn,function(fieldOrName){var e5Q=P48;e5Q+=K$x;e5Q+=y2a;return typeof fieldOrName === e5Q?_this[P48][W7Q][fieldOrName]:fieldOrName;});if(typeof focus === V50){field=fields[focus];}else if(focus){if(focus[x2T](Q_p) === x9R){field=$(g0M + focus[q9A](V5j,x8n));}else {field=this[P48][W7Q][focus];}}else {var U5V=y4k;U5V+=D8e;U5V+=O87;document[U5V][I9T]();}this[P48][E2K]=field;if(field){var R2t=u_K;R2t+=P48;field[R2t]();}}function _formOptions(opts){var N91='keyup';var a2c="seIcb";var j0t="own";var v55="yd";var c$R="Op";var q_l="canReturnSubmit";var K3e='boolean';var t4x='.dteInline';var g$V=E$w;g$V+=k9m;g$V+=a2c;var p77=z4_;p77+=v55;p77+=j0t;var g_b=k9m;g_b+=q6U;var c_k=U67;c_k+=K$x;c_k+=k9m;c_k+=e7H;var K2y=D2u;K2y+=l1$;var F48=k$v;F48+=j0G;var R$8=p59;R$8+=K$x;R$8+=c$R;R$8+=y0y;var _this=this;var that=this;var inlineCount=_inlineCounter++;var namespace=t4x + inlineCount;this[P48][R$8]=opts;this[P48][j1P]=inlineCount;if(typeof opts[O$b] === V_T || typeof opts[O$b] === F48){var t$3=K$x;t$3+=w6y;t$3+=J7P;var g9m=K$x;g9m+=m4P;this[g9m](opts[t$3]);opts[O$b]=w0_;}if(typeof opts[q8B] === V_T || typeof opts[K2y] === f2m){var K2L=g_I;K2L+=w7g;var u6n=D2u;u6n+=y4k;u6n+=Q8X;this[u6n](opts[q8B]);opts[K2L]=w0_;}if(typeof opts[c_k] !== K3e){var v8O=U67;v8O+=K$x;v8O+=j_R;v8O+=P48;var t4h=U67;t4h+=O63;this[x0X](opts[t4h]);opts[v8O]=w0_;}$(document)[g_b](p77 + namespace,function(e){var z8E="whi";var d$g="dFromNode";g1X.g2m();var M1C="tiv";var a6l="_fiel";var u0f=z8E;u0f+=R0n;if(e[u0f] === O0D && _this[P48][y7Q]){var r6W=i6p;r6W+=M1C;r6W+=O87;var el=$(document[r6W]);if(el){var U8H=a6l;U8H+=d$g;var field=_this[U8H](el);if(field && typeof field[q_l] === f2m && field[q_l](el)){e[v8T]();}}}});$(document)[j_R](N91 + namespace,function(e){var x_i="onRetu";var M6H='button';var C9Q="iveElement";var s1f="onEsc";var y9H="nEs";var A6b="next";var d6S="rn";var t4A=37;var j9g="gger";var Y0L="bmit";var Y6Y='.DTE_Form_Buttons';var Z3_="ren";var L6s=39;var F9E="sc";var w_s="reventD";var z56="efa";var D$D="hi";var X5y=27;var W2m="onReturn";var m3v=L_f;m3v+=Z3_;m3v+=K$x;m3v+=P48;var r4r=T7p;r4r+=D$D;r4r+=X47;r4r+=j1i;var P$6=V8t;P$6+=C9Q;g1X.g2m();var el=$(document[P$6]);if(e[u6e] === O0D && _this[P48][y7Q]){var field=_this[Y29](el);if(field && typeof field[q_l] === f2m && field[q_l](el)){var K$0=g7z;K$0+=q6U;K$0+=t9v;var F$2=x_i;F$2+=d6S;var X0f=K3A;X0f+=Y0L;if(opts[W2m] === X0f){var J$_=U3G;J$_+=w_s;J$_+=z56;J$_+=B5h;e[J$_]();_this[q4v]();}else if(typeof opts[F$2] === K$0){var p5y=l4F;p5y+=Q5_;p5y+=k_9;p5y+=R47;e[p5y]();opts[W2m](_this,e);}}}else if(e[r4r] === X5y){var U3m=k9m;U3m+=l65;U3m+=F9E;var c3d=k9m;c3d+=y9H;c3d+=X47;var z11=Y4l;z11+=n0H;e[v8T]();if(typeof opts[s1f] === z11){opts[s1f](that,e);}else if(opts[c3d] === u3P){that[I9T]();}else if(opts[s1f] === s17){var I5t=E$w;I5t+=k9m;I5t+=P48;I5t+=J7P;that[I5t]();}else if(opts[U3m] === u8c){var W5Q=P48;W5Q+=u3p;W5Q+=Z6q;that[W5Q]();}}else if(el[m3v](Y6Y)[p2U]){if(e[u6e] === t4A){var s2A=C6M;s2A+=k9m;s2A+=X47;s2A+=L2l;var Z1P=I1p;Z1P+=j9g;var U4N=U3G;U4N+=Y$e;U4N+=J7P;U4N+=K9A;el[U4N](M6H)[Z1P](s2A);}else if(e[u6e] === L6s){var Z_R=q_$;Z_R+=x0$;var D6D=R7l;D6D+=j_R;el[A6b](D6D)[Z_R](m6i);}}});this[P48][g$V]=function(){var C0N="yup";var g1J="down";var L3i=z4_;L3i+=C0N;var C5n=l$2;C5n+=J7P;C5n+=a_i;C5n+=g1J;$(document)[B96](C5n + namespace);$(document)[B96](L3i + namespace);};return namespace;}function _inline(editFields,opts,closeCb){var c_1="span></div>";var A5T='tr';var M2F="child";var i59="lass=\"";var j47='px"';var f$7="idth";var q7s="or\"><span></";var Z0V='div.';var S8b="mber";var d79="<div class=\"DTE_Processing_Indicat";var i0w='.';var t6$='click.dte-submit';var T3r="from";var U3S="eopen";var k5F="_pos";var U3N="<div class=";var G5X="_closeReg";var z1v="tyle=\"width:";var J5K="topen";var D5I="userAgent";var t8H="mitHtm";var X9Q='Edge/';var W1p="contents";var G2S="submitTrigger";var Q6R="chF";var o8G=z5O;o8G+=W08;o8G+=q6U;o8G+=J7P;var H3X=k5F;H3X+=J5K;var f2I=u9C;f2I+=f5q;var q7a=A5M;q7a+=J7P;q7a+=q12;var B6_=n_V;B6_+=U3S;var g31=W_c;g31+=q12;var K9h=y4k;K9h+=n1x;K9h+=L$A;var Y$n=B2L;Y$n+=A5M;Y$n+=W08;Y$n+=Z3X;var _this=this;g1X.g2m();if(closeCb === void x9R){closeCb=F7$;}var closed=P3U;var classes=this[D5Z][Y$n];var keys=Object[I3V](editFields);var editRow=editFields[keys[x9R]];var children=F7$;var lastAttachPoint;var elements=[];for(var i=x9R;i < editRow[K9h][g31];i++){var V7o=C6M;V7o+=W08;V7o+=R3w;V7o+=P48;var d62=i_u;d62+=m2$;var S37=R01;S37+=A7c;S37+=Q6R;S37+=w4s;var name_1=editRow[S37][i][x9R];elements[d62]({field:this[P48][V7o][name_1],name:name_1,node:$(editRow[R2d][i])});}var namespace=this[C87](opts);var ret=this[B6_](F9A);if(!ret){return this;}for(var _i=x9R,elements_1=elements;_i < elements_1[q7a];_i++){var O75=q6U;O75+=h9P;var C_b=C6M;C_b+=m3E;var o54=f4b;o54+=k9m;o54+=u9C;var P27=q6U;P27+=k9m;P27+=f4b;P27+=J7P;var Z5S=A5M;Z5S+=U_d;var D8P=f4b;D8P+=W08;D8P+=K9A;D8P+=R1Q;var s5D=C6M;s5D+=x3d;var u0B=R_M;u0B+=k3K;var c_c=z6i;c_c+=i$U;var y2v=U3N;y2v+=y$Z;var y3o=d79;y3o+=q7s;y3o+=c_1;var S3t=y$Z;S3t+=p4m;var U4r=N4T;U4r+=w9V;var i13=A0l;i13+=X5j;i13+=G0G;var P_N=y$Z;P_N+=I9l;var Z$B=s6o;Z$B+=w9V;var h7s=u7r;h7s+=i59;var A11=f5q;A11+=O7K;A11+=f4b;var p8H=T7p;p8H+=f$7;var h9H=P48;h9H+=z1v;var el=elements_1[_i];var node=el[j2Q];el[d_w]=node[W1p]()[X65]();var style=navigator[D5I][x2T](X9Q) !== -C05?h9H + node[p8H]() + j47:x8n;node[A11]($(h7s + classes[Z$B] + P_N + i13 + classes[U4r] + S3t + style + c69 + y3o + z6g + y2v + classes[c_c] + u0B + z6g));node[s5D](D8P + classes[Z5S][q9A](/ /g,i0w))[k8x](el[G0y][P27]())[k8x](this[o54][O9R]);lastAttachPoint=el[C_b][O75]();if(opts[x0X]){var S20=j1d;S20+=u9C;var R9z=y4k;R9z+=t4M;R9z+=Z9U;var o2c=n7v;o2c+=P48;var C7e=C6M;C7e+=B2L;C7e+=f4b;node[C7e](Z0V + classes[o2c][q9A](/ /g,i0w))[R9z](this[S20][x0X]);}}var submitTrigger=opts[G2S];if(submitTrigger !== F7$){var b28=K3A;b28+=z6i;b28+=t8H;b28+=A5M;var f9W=k9m;f9W+=q6U;var X_1=e7j;X_1+=L$A;var K0_=q6U;K0_+=e_G;K0_+=S8b;if(typeof submitTrigger === K0_){var c3p=W_c;c3p+=F7P;c3p+=j1i;var V97=M2F;V97+=A5l;V97+=q6U;var o6s=X47;o6s+=A5M;o6s+=U44;o6s+=H2s;var kids=$(lastAttachPoint)[o6s](A5T)[V97]();submitTrigger=submitTrigger < x9R?kids[kids[c3p] + submitTrigger]:kids[submitTrigger];}children=Array[T3r]($(submitTrigger)[x9R][R$6])[P4$]();$(children)[X_1]();$(submitTrigger)[f9W](t6$,function(e){var Y90="stopImmedia";var s9o="tePropa";var Z2g=Y90;Z2g+=s9o;Z2g+=D1E;g1X.g2m();e[Z2g]();_this[q4v]();})[k8x](opts[b28]);}this[G5X](function(submitComplete,action){var z$q="arDynamicInfo";var W7_="click.dte-subm";var M_N="forEach";var g9R=g4U;g9R+=o0_;g9R+=z$q;var E9s=M_v;E9s+=W08;E9s+=K$x;closed=w0_;$(document)[B96](I8G + namespace);if(!submitComplete || action !== E9s){elements[M_N](function(el){var s0J="hildre";var A4v=X47;A4v+=s0J;A4v+=q6U;var I3w=w1o;I3w+=D4c;I3w+=f4b;el[j2Q][W1p]()[X65]();el[j2Q][I3w](el[A4v]);});}if(submitTrigger){var j_r=W7_;j_r+=e1Z;$(submitTrigger)[B96](j_r)[C0K]()[k8x](children);}_this[g9R]();if(closeCb){closeCb();}return F9A;;});setTimeout(function(){var z8D='mousedown';var n3R="dSe";var M_t="lf";var P5t="addBa";var B71=k9m;B71+=q6U;var B9V=y4k;B9V+=q6U;B9V+=n3R;B9V+=M_t;var N0E=P5t;N0E+=g29;var a7L=C6M;a7L+=q6U;if(closed){return;}var back=$[a7L][N0E]?S2e:B9V;var target;g1X.h9F();$(document)[j_R](z8D + namespace,function(e){var E80="rget";var e1j=K$x;e1j+=y4k;e1j+=E80;target=e[e1j];})[B71](I8G + namespace,function(e){var L5I="nod";var R1s='owns';var T7C=W_c;T7C+=m5E;T7C+=K$x;T7C+=j1i;var isIn=P3U;for(var _i=x9R,elements_2=elements;_i < elements_2[T7C];_i++){var f4m=L5I;f4m+=J7P;var v4f=B2L;v4f+=z5l;v4f+=A0w;v4f+=u4G;var f_d=g4U;f_d+=d4a;f_d+=j48;var X7$=T2z;X7$+=B36;var el=elements_2[_i];if(el[X7$][f_d](R1s,target) || $[v4f](el[f4m][x9R],$(target)[p9I]()[back]()) !== -C05){isIn=w0_;}}if(!isIn){_this[I9T]();}});},x9R);this[d8F]($[f2I](elements,function(el){var f2n=T2z;f2n+=A5M;f2n+=f4b;g1X.g2m();return el[f2n];}),opts[V0_]);this[H3X](o8G,w0_);}function _optionsUpdate(json){g1X.g2m();var i5h=k9m;i5h+=l8d;i5h+=W08;i5h+=Y2l;var that=this;if(json[i5h]){var w05=T2z;w05+=B36;w05+=P48;var l0h=J7P;l0h+=L$A;$[l0h](this[P48][w05],function(name,field){var w8e="date";var f8x=C9_;f8x+=I$d;f8x+=q6U;f8x+=P48;if(json[f8x][name] !== undefined){var y5v=S7M;y5v+=w8e;var fieldInst=that[G0y](name);if(fieldInst && fieldInst[y5v]){fieldInst[K44](json[m$w][name]);}}});}}function _message(el,msg,title,fn){var b_J="fade";var x8b="nc";var q31="tit";var c_e="Out";var m7O="fad";var Z3q="eAtt";var D8c="stop";var S$J=g7z;S$J+=x8b;S$J+=m0N;S$J+=q6U;var h08=O7S;h08+=s2p;h08+=w3n;var canAnimate=$[w_B][h08]?w0_:P3U;if(title === undefined){title=P3U;}if(!fn){fn=function(){};}if(typeof msg === S$J){var N8u=A7c;N8u+=Q$e;var n7c=U39;n7c+=W08;msg=msg(this,new DataTable$3[n7c](this[P48][N8u]));}el=$(el);if(canAnimate){el[D8c]();}if(!msg){if(this[P48][y7Q] && canAnimate){var v68=b_J;v68+=c_e;el[v68](function(){el[K0h](x8n);g1X.h9F();fn();});}else {var Q1w=m4E;Q1w+=Z3X;var v44=X47;v44+=P48;v44+=P48;var I$G=T$0;I$G+=A5M;el[I$G](x8n)[v44](y99,Q1w);fn();}if(title){var b$o=q31;b$o+=A5M;b$o+=J7P;var e6F=A5l;e6F+=X_f;e6F+=Z3q;e6F+=Y$e;el[e6F](b$o);}}else {fn();if(this[P48][y7Q] && canAnimate){var A$G=m7O;A$G+=S7a;A$G+=q6U;var n9a=j1i;n9a+=K$x;n9a+=u9C;n9a+=A5M;el[n9a](msg)[A$G]();}else {var f2u=z6i;f2u+=A5M;f2u+=k9m;f2u+=g29;el[K0h](msg)[j2h](y99,f2u);}if(title){el[c5_](C88,msg);}}}function _multiInfo(){var n_C="iInfoShown";var d9M="ltiValue";var e14="eFields";var G5a="includ";var f0V="ditabl";var O7V="ultiE";var g6a="isMultiValue";var Q1_=A5M;Q1_+=J7P;Q1_+=q12;var T2h=G5a;T2h+=e14;var O5y=T2z;O5y+=B36;O5y+=P48;var fields=this[P48][O5y];var include=this[P48][T2h];var show=w0_;var state;if(!include){return;}for(var i=x9R,ien=include[Q1_];i < ien;i++){var E7j=R$W;E7j+=n_C;var j19=d5l;j19+=e_G;j19+=d9M;var x3f=u9C;x3f+=O7V;x3f+=f0V;x3f+=J7P;var field=fields[include[i]];var multiEditable=field[x3f]();if(field[j19]() && multiEditable && show){state=w0_;show=P3U;}else if(field[g6a]() && !multiEditable){state=w0_;}else {state=P3U;}fields[include[i]][E7j](state);}}function _nestedClose(cb){var q6f="oller";var Q_P="playController";var D4N="po";var Z9H="dte";var T_J="callback";var m2x="splayContr";var u5P=U$f;u5P+=j1i;var J76=s_W;J76+=j1i;J76+=Y67;var disCtrl=this[P48][B4u];var show=disCtrl[J76];if(!show || !show[p2U]){if(cb){cb();}}else if(show[u5P] > C05){var O_x=e9o;O_x+=P48;O_x+=Q_P;var j17=D4N;j17+=U3G;show[j17]();var last=show[show[p2U] - C05];if(cb){cb();}this[P48][O_x][E4z](last[Z9H],last[k8x],last[T_J]);}else {var V$H=X47;V$H+=t6S;var Y5K=e9o;Y5K+=m2x;Y5K+=q6f;this[P48][Y5K][V$H](this,cb);show[p2U]=x9R;}}function _nestedOpen(cb,nest){var I4_="roller";var w6F="_show";var F$e="displayCont";var v_a=k9m;v_a+=O7K;var h2b=F$e;h2b+=I4_;var h9r=g4U;h9r+=m2$;h9r+=k9m;h9r+=T7p;var disCtrl=this[P48][B4u];if(!disCtrl[h9r]){var z9j=g4U;z9j+=I7o;disCtrl[z9j]=[];}if(!nest){var c26=I6k;c26+=f3U;disCtrl[w6F][c26]=x9R;}disCtrl[w6F][s6F]({append:this[s9H][M70],callback:cb,dte:this});this[P48][h2b][v_a](this,this[s9H][M70],cb);}function _postopen(type,immediate){var A$1="ternal";var A8P="mit.editor-internal";var E79="_multiInfo";var O50='opened';var R24="ureFocus";var k0w="submit.editor-in";var k2N=f5$;k2N+=V6m;k2N+=J7P;var d_1=k0w;g1X.h9F();d_1+=A$1;var P5P=p2C;P5P+=A8P;var P65=k9m;P65+=C6M;P65+=C6M;var v6A=f4b;v6A+=Q2Y;var s5F=x_B;s5F+=U3G;s5F+=K$x;s5F+=R24;var _this=this;var focusCapture=this[P48][B4u][s5F];if(focusCapture === undefined){focusCapture=w0_;}$(this[v6A][p2d])[P65](P5P)[j_R](d_1,function(e){var L7m="fault";var u1V="prev";var D9r="entDe";var U3U=u1V;U3U+=D9r;U3U+=L7m;e[U3U]();});if(focusCapture && (type === s2S || type === k2N)){$(Y9i)[j_R](E8g,function(){var W$I='.DTED';var j8Q="Eleme";var O9f="cus";var r9c="setFo";var X4$="activeElement";var D4T=T06;g1X.g2m();D4T+=B0B;var P_m=L_f;P_m+=Y$e;P_m+=D4c;P_m+=y0y;var Y3T=T06;Y3T+=B0B;var c2t=m66;c2t+=X0N;var v0U=l2S;v0U+=j8Q;v0U+=u$U;if($(document[v0U])[p9I](c2t)[Y3T] === x9R && $(document[X4$])[P_m](W$I)[D4T] === x9R){var D_l=r9c;D_l+=O9f;if(_this[P48][D_l]){_this[P48][E2K][V0_]();}}});}this[E79]();this[e5F](G25,[type,this[P48][M8L]]);if(immediate){var v8v=g4U;v8v+=J7P;v8v+=G3s;v8v+=K$x;this[v8v](O50,[type,this[P48][M8L]]);}return w0_;}function _preopen(type){var d5A="clearDyna";var l7Y="rDyn";var p1m="cb";var t7N="_clea";var y4C="micIn";var X0$="Open";g1X.g2m();var I1O="seI";var b93='cancelOpen';var g3d="eIcb";var F7v="amicI";var f2d=t7N;f2d+=l7Y;f2d+=F7v;f2d+=G3V;var l9s=V8t;l9s+=n0H;var c6d=l4F;c6d+=X0$;if(this[e5F](c6d,[type,this[P48][l9s]]) === P3U){var W8f=I0x;W8f+=I1O;W8f+=p1m;var F2Z=I0x;F2Z+=P48;F2Z+=g3d;var f2G=E2Y;f2G+=u$U;var N0U=g4U;N0U+=d5A;N0U+=y4C;N0U+=f9t;this[N0U]();this[f2G](b93,[type,this[P48][M8L]]);if((this[P48][g9H] === F9A || this[P48][g9H] === M0s) && this[P48][F2Z]){this[P48][f_L]();}this[P48][W8f]=F7$;return P3U;}this[f2d](w0_);this[P48][y7Q]=type;return w0_;}function _processing(processing){var Z1U="eve";var z0W=g4U;z0W+=Z1U;z0W+=q6U;z0W+=K$x;var z5v=F25;z5v+=M6g;z5v+=Y$e;var U1N=f4b;U1N+=S3r;U1N+=m66;g1X.h9F();U1N+=X0N;var m9i=I00;m9i+=W08;m9i+=m5E;var e4v=M31;e4v+=D99;var procClass=this[e4v][m9i][l2S];$([U1N,this[s9H][z5v]])[t0m](procClass,processing);this[P48][M2v]=processing;this[z0W](v_e,[processing]);}function _noProcessing(args){g1X.g2m();var y7k="processing-f";var A3M=T2z;A3M+=B36;A3M+=P48;var processing=P3U;$[h3P](this[P48][A3M],function(name,field){var I4X=Q4J;I4X+=h_n;I4X+=W08;I4X+=m5E;if(field[I4X]()){processing=w0_;}});if(processing){var y6C=y7k;y6C+=m3E;var F1j=k9m;F1j+=Z3X;this[F1j](y6C,function(){if(this[N9i](args) === w0_){this[Q6P][R$p](this,args);}});}return !processing;}function _submit(successCallback,errorCallback,formatdata,hide){var t$4="itDa";var b59="reSubm";var z$p="editFi";var I_n="Complete";var r72="let";var c4a="_noPr";var S2U='Field is still processing';var V7z=16;var M0l="bmi";var M8l='allIfChanged';var U$W=U3G;U$W+=b59;U$W+=W08;U$W+=K$x;var s5Y=g4U;s5Y+=k1n;var M0j=J7P;M0j+=E6e;var B_F=Y$e;B_F+=J7P;B_F+=X_f;B_F+=J7P;var S7b=J7P;S7b+=e9o;S7b+=K$x;var k8e=i6p;k8e+=j0G;k8e+=z2P;k8e+=Y2J;var P$k=c4a;P$k+=y5C;P$k+=D99;P$k+=i7J;var R2A=P48;R2A+=e_G;R2A+=M0l;R2A+=K$x;var G1Y=J7P;G1Y+=A1_;G1Y+=K$x;G1Y+=P48;var M0m=M_v;M0m+=t$4;g1X.g2m();M0m+=K$x;M0m+=y4k;var H9A=z$p;H9A+=y_9;var _this=this;var changed=P3U;var allData={};var changedData={};var setBuilder=dataSet;var fields=this[P48][W7Q];var editCount=this[P48][j1P];var editFields=this[P48][H9A];var editData=this[P48][M0m];var opts=this[P48][G1Y];var changedSubmit=opts[R2A];var submitParamsLocal;if(this[P$k](arguments) === P3U){Editor[F3P](S2U,V7z,P3U);return;}var action=this[P48][M8L];var submitParams={data:{}};submitParams[this[P48][k8e]]=action;if(action === a77 || action === S7b){var f3I=y4k;f3I+=A5M;f3I+=A5M;var e1L=J7P;e1L+=y4k;e1L+=R0n;$[e1L](editFields,function(idSrc,edit){var s9S="isEmptyObject";var l$w=e1K;l$w+=j1i;var allRowData={};var changedRowData={};g1X.g2m();$[l$w](fields,function(name,field){var d_h="submittable";var x0D="sArray";var k8I='-many-count';var o5G=/\[.*$/;var A4Y="com";var g33='[]';var Q7J="valFrom";var r1t=B9g;r1t+=y_9;if(edit[r1t][name] && field[d_h]()){var v4_=A4Y;v4_+=L_f;v4_+=A5l;var w23=J7P;w23+=e9o;w23+=K$x;var S94=n0g;S94+=O$K;S94+=X47;S94+=J7P;var g8k=C6g;g8k+=G5M;g8k+=m5E;var t3k=W08;t3k+=x0D;var multiGet=field[p5X]();var builder=setBuilder(name);if(multiGet[idSrc] === undefined){var B_N=Q7J;B_N+=m8W;B_N+=y4k;var originalVal=field[B_N](edit[y34]);builder(allRowData,originalVal);return;}var value=multiGet[idSrc];var manyBuilder=Array[t3k](value) && typeof name === g8k && name[x2T](g33) !== -C05?setBuilder(name[S94](o5G,x8n) + k8I):F7$;builder(allRowData,value);if(manyBuilder){manyBuilder(allRowData,value[p2U]);}if(action === w23 && (!editData[name] || !field[v4_](value,editData[name][idSrc]))){builder(changedRowData,value);changed=w0_;if(manyBuilder){var F1z=U$f;F1z+=j1i;manyBuilder(changedRowData,value[F1z]);}}}});if(!$[s9S](allRowData)){allData[idSrc]=allRowData;}if(!$[s9S](changedRowData)){changedData[idSrc]=changedRowData;}});if(action === a77 || changedSubmit === f3I || changedSubmit === M8l && changed){submitParams[y34]=allData;}else if(changedSubmit === f13 && changed){submitParams[y34]=changedData;}else {var p2Z=q4v;p2Z+=I_n;var b6f=k9m;b6f+=q6U;b6f+=I_n;this[P48][M8L]=F7$;if(opts[u_U] === s17 && (hide === undefined || hide)){var u3r=P1G;u3r+=A5M;u3r+=f4C;this[u3r](P3U);}else if(typeof opts[b6f] === f2m){var h27=K6W;h27+=U3G;h27+=r72;h27+=J7P;opts[h27](this);}if(successCallback){successCallback[B9N](this);}this[C9Y](P3U);this[e5F](p2Z);return;}}else if(action === B_F){var G8y=Y5h;G8y+=R0n;$[G8y](editFields,function(idSrc,edit){var s$r=a1s;s$r+=y4k;g1X.h9F();submitParams[y34][idSrc]=edit[s$r];});}submitParamsLocal=$[M0j](w0_,{},submitParams);if(formatdata){formatdata(submitParams);}this[s5Y](U$W,[submitParams,action],function(result){g1X.h9F();var m3l="_ajax";if(result === P3U){_this[C9Y](P3U);}else {var X4A=y4k;X4A+=K8$;X4A+=y4k;X4A+=W4t;var submitWire=_this[P48][X4A]?_this[m3l]:_this[F_4];submitWire[B9N](_this,submitParams,function(json,notGood,xhr){var h_H=w2v;h_H+=q6U;_this[A0H](json,notGood,submitParams,submitParamsLocal,_this[P48][h_H],editCount,hide,successCallback,errorCallback,xhr);},function(xhr,err,thrown){var w1M="_sub";var K2$="mitE";var j3k=y4k;j3k+=t9v;var h9t=w1M;h9t+=K2$;h9t+=K8D;_this[h9t](xhr,err,thrown,errorCallback,submitParams,_this[P48][j3k]);},submitParams);}});}function _submitTable(data,success,error,submitParams){var o21='individual';g1X.g2m();var Y69="dS";var x1r="emove";var A0z="aS";var u_Y="Src";var W$p=Y$e;W$p+=x1r;var Q2j=W08;Q2j+=f4b;Q2j+=u_Y;var b83=W08;b83+=Y69;b83+=Y$e;b83+=X47;var L3I=w2v;L3I+=q6U;var action=data[L3I];var out={data:[]};var idGet=dataGet(this[P48][b83]);var idSet=dataSet(this[P48][Q2j]);if(action !== W$p){var i4$=C6M;i4$+=G$h;i4$+=A5M;i4$+=l1J;var R2D=g4U;R2D+=a1s;R2D+=A0z;R2D+=C4S;var E05=h$i;E05+=J7P;var originalData_1=this[P48][E05] === s2S?this[R2D](i4$,this[E6r]()):this[e4j](o21,this[E6r]());$[h3P](data[y34],function(key,vals){var s0C=U3G;s0C+=Y7z;var b0g=J7P;b0g+=f4b;b0g+=e1Z;var toSave;var extender=extend;if(action === b0g){var i$i=r09;i$i+=A7c;var rowData=originalData_1[key][i$i];toSave=extender({},rowData,w0_);toSave=extender(toSave,vals,w0_);}else {toSave=extender({},vals,w0_);}var overrideId=idGet(toSave);if(action === a77 && overrideId === undefined){idSet(toSave,+new Date() + key[P41]());}else {idSet(toSave,overrideId);}out[y34][s0C](toSave);});}success(out);}function _submitSuccess(json,notGood,submitParams,submitParamsLocal,action,editCount,hide,successCallback,errorCallback,xhr){var h6J="postRe";var Z60="plete";var z51="ids";var V2D="cti";var D5x="ostS";var w_c='prep';var C6D="ifier";var o0l='preCreate';var X4C="onComp";var p6d='commit';var b$F="postCr";var m6u='submitUnsuccessful';var G1r='submitSuccess';var x9e='postEdit';var g0Z='preRemove';var A$j="_dataS";var c89='setData';var s2f=p2C;s2f+=W8G;var S_3=A5M;S_3+=J7P;S_3+=m5E;S_3+=B0B;var t8M=U3G;t8M+=D5x;t8M+=u3p;t8M+=Z6q;var Y_p=g4U;Y_p+=Y_I;Y_p+=J7P;Y_p+=u$U;var i27=J4F;i27+=f4b;i27+=C6D;var S9Z=B9g;S9Z+=y_9;var _this=this;var that=this;var setData;var fields=this[P48][S9Z];var opts=this[P48][Z_P];var modifier=this[P48][i27];this[Y_p](t8M,[json,submitParams,action,xhr]);if(!json[F3P]){var g2y=w9V;g2y+=W4S;g2y+=Y$e;json[g2y]=x8n;}if(!json[t7M]){json[t7M]=[];}if(notGood || json[F3P] || json[t7M][S_3]){var k56=U$F;k56+=z6i;k56+=Y$e;k56+=I9l;var P$x=I3y;P$x+=W08;P$x+=q6U;var n3J=J7P;n3J+=Y$e;n3J+=W4S;n3J+=Y$e;var h$Z=J7P;h$Z+=i6p;h$Z+=j1i;var globalError_1=[];if(json[F3P]){var Z76=J7P;Z76+=K8D;var P_l=U3G;P_l+=e_G;P_l+=P48;P_l+=j1i;globalError_1[P_l](json[Z76]);}$[h$Z](json[t7M],function(i,err){var W4l="ontent";var M51="Err";g1X.g2m();var I5X="osition";var N1L="Er";var i74="onFieldError";var C_y="Fiel";var T8H="atus";var i_5="onF";var A_X="cu";var v0M="bodyC";var o0j="now";var p4R="n field: ";var t96="dErro";var A5v=q6U;A5v+=y4k;A5v+=u9C;A5v+=J7P;var field=fields[err[A5v]];if(!field){var s3X=q6U;s3X+=W0a;s3X+=J7P;var I$q=j57;I$q+=o0j;I$q+=p4R;throw new Error(I$q + err[s3X]);}else if(field[y7Q]()){var J$z=N1L;J$z+=Q90;var g2D=w9V;g2D+=W4S;g2D+=Y$e;field[g2D](err[H6a] || J$z);if(i === x9R){var i5N=j_R;i5N+=C_y;i5N+=t96;i5N+=Y$e;if(opts[i74] === m6i){var F71=C6M;F71+=k9m;F71+=A_X;F71+=P48;var d5d=U3G;d5d+=I5X;var Q0j=q6U;Q0j+=k9m;Q0j+=f4b;Q0j+=J7P;var w3k=v0M;w3k+=W4l;var z1r=j1d;z1r+=u9C;var T$T=g4U;T$T+=D77;_this[T$T]($(_this[z1r][w3k]),{scrollTop:$(field[Q0j]())[d5d]()[V3I]},Q_I);field[F71]();}else if(typeof opts[i5N] === f2m){var p3C=i_5;p3C+=m3E;p3C+=M51;p3C+=i5x;opts[p3C](_this,err);}}}else {var z$m=N1L;z$m+=Y$e;z$m+=k9m;z$m+=Y$e;var q7z=C6g;q7z+=T8H;var Q2H=Y4i;Q2H+=p4m;var s$j=q6U;s$j+=y4k;s$j+=u9C;s$j+=J7P;globalError_1[s6F](field[s$j]() + Q2H + (err[q7z] || z$m));}});this[n3J](globalError_1[P$x](k56));this[e5F](m6u,[json]);if(errorCallback){var B_J=X47;B_J+=c2r;B_J+=A5M;errorCallback[B_J](that,json);}}else {var K81=W1Y;K81+=G3s;K81+=K$x;var c0T=X47;c0T+=r3C;c0T+=J7P;var store={};if(json[y34] && (action === c0T || action === p4w)){var c_6=f4b;c_6+=y4k;c_6+=A7c;var Y5f=f4b;Y5f+=y4k;Y5f+=K$x;Y5f+=y4k;var w7_=Q4J;w7_+=U2i;this[e4j](w7_,action,modifier,submitParamsLocal,json,store);for(var _i=x9R,_a=json[Y5f];_i < _a[p2U];_i++){var v5i=W08;v5i+=f4b;var f0w=m_$;f0w+=A7c;f0w+=g6v;f0w+=C4S;var data=_a[_i];setData=data;var id=this[f0w](v5i,data);this[e5F](c89,[json,data,action]);if(action === a77){var m_S=b$F;m_S+=h3C;var p2n=g4U;p2n+=J7P;p2n+=Q5_;var Y6Q=r6v;Y6Q+=h3C;var X55=W1Y;X55+=K9A;X55+=J7P;X55+=u$U;this[X55](o0l,[json,data,id]);this[e4j](Y6Q,fields,data,store);this[p2n]([a77,m_S],[json,data,id]);}else if(action === p4w){var h6$=J7P;h6$+=f4b;h6$+=e1Z;var d4x=A$j;d4x+=C4S;var X35=Q4J;X35+=J7P;X35+=V7b;X35+=e1Z;var Q9u=g4U;Q9u+=J7P;Q9u+=K9A;Q9u+=k04;this[Q9u](X35,[json,data,id]);this[d4x](p4w,modifier,fields,data,store);this[e5F]([h6$,x9e],[json,data,id]);}}this[e4j](p6d,action,modifier,json[c_6],store);}else if(action === c$T){var C6b=N2Q;C6b+=T7n;var X9G=h6J;X9G+=u9C;X9G+=r8R;var g07=W08;g07+=f4b;g07+=P48;var u9P=I_w;u9P+=I9B;this[u9P](w_c,action,modifier,submitParamsLocal,json,store);this[e5F](g0Z,[json,this[g07]()]);this[e4j](c$T,modifier,fields,store);this[e5F]([c$T,X9G],[json,this[z51]()]);this[C6b](p6d,action,modifier,json[y34],store);}if(editCount === this[P48][j1P]){var u2E=k$v;u2E+=m0N;u2E+=q6U;var G3A=K6W;G3A+=Z60;var w5K=X47;w5K+=A5M;w5K+=U44;w5K+=J7P;var x75=y4k;x75+=X47;x75+=j0G;var n9b=y4k;n9b+=V2D;n9b+=k9m;n9b+=q6U;var sAction=this[P48][n9b];this[P48][x75]=F7$;if(opts[u_U] === w5K && (hide === undefined || hide)){var K4P=G5_;K4P+=J7P;this[K4P](json[y34]?w0_:P3U,sAction);}else if(typeof opts[G3A] === u2E){var b_W=X4C;b_W+=W_c;b_W+=w3n;opts[b_W](this);}}if(successCallback){successCallback[B9N](that,json);}this[K81](G1r,[json,setData,action]);}this[C9Y](P3U);this[e5F](s2f,[json,setData,action]);}function _submitError(xhr,err,thrown,errorCallback,submitParams,action){var w9A="submitC";var D$g="ompl";var d4E="ystem";var e9_='submitError';var L3f='postSubmit';var R_s=w9A;R_s+=D$g;R_s+=l3T;var h8B=Q1e;h8B+=J7P;h8B+=u$U;var R63=P48;R63+=d4E;var V8u=J7P;V8u+=A0w;V8u+=k9m;V8u+=Y$e;var H3b=y_D;H3b+=z$d;H3b+=q6U;var P3k=w9V;P3k+=Q90;this[e5F](L3f,[F7$,submitParams,action,xhr]);this[P3k](this[H3b][V8u][R63]);this[C9Y](P3U);if(errorCallback){errorCallback[B9N](this,xhr,err,thrown);}this[h8B]([e9_,R_s],[xhr,err,thrown,submitParams]);}function _tidy(fn){var j_V="ures";var a$8="bServerS";var V4g="ngs";var Z$G="proces";var r_l="oFe";var r1c=10;var T7G="bb";var c0G="tti";var o2n=z6i;o2n+=e_G;o2n+=T7G;o2n+=W_c;var A2F=Z$G;A2F+=i7J;var _this=this;var dt=this[P48][o7k]?new $[w_B][o_i][B_H](this[P48][o7k]):F7$;var ssp=P3U;if(dt){var q9j=a$8;q9j+=G4w;var h0Q=r_l;h0Q+=R01;h0Q+=j_V;var n0_=x_J;n0_+=c0G;n0_+=V4g;ssp=dt[n0_]()[x9R][h0Q][q9j];}if(this[P48][A2F]){var c_W=p2C;c_W+=W8G;var O6X=k9m;O6X+=q6U;O6X+=J7P;this[O6X](c_W,function(){var d77='draw';g1X.g2m();if(ssp){var l8y=k9m;l8y+=q6U;l8y+=J7P;dt[l8y](d77,fn);}else {setTimeout(function(){g1X.h9F();fn();},r1c);}});return w0_;}else if(this[b9u]() === F9A || this[b9u]() === o2n){var S36=z6i;S36+=Y7T;S36+=Y$e;var j9v=k9m;j9v+=q6U;j9v+=J7P;this[j9v](s17,function(){var D8v=Q4J;D8v+=h_n;D8v+=B2L;D8v+=Z71;if(!_this[P48][D8v]){setTimeout(function(){g1X.h9F();if(_this[P48]){fn();}},r1c);}else {_this[N$u](f$q,function(e,json){g1X.g2m();if(ssp && json){var s7i=R1M;s7i+=y4k;s7i+=T7p;var t3T=k9m;t3T+=q6U;t3T+=J7P;dt[t3T](s7i,fn);}else {setTimeout(function(){g1X.g2m();if(_this[P48]){fn();}},r1c);}});}})[S36]();return w0_;}return P3U;}function _weakInArray(name,arr){var g4d=A5M;g4d+=J7P;g4d+=F7P;g4d+=j1i;for(var i=x9R,ien=arr[g4d];i < ien;i++){if(name == arr[i]){return i;}}return -C05;}var fieldType={create:function(){},disable:function(){},enable:function(){},get:function(){},set:function(){}};var DataTable$2=$[w_B][r4y];function _buttonText(conf,textIn){var o6e="Choose";var Y2a=" file...";var U3Z="uploadText";var o71="iv.upload b";var u$O=j78;u$O+=u9C;u$O+=A5M;var V3W=f4b;V3W+=o71;V3W+=Z1B;var y6K=C6M;y6K+=W08;y6K+=q6U;g1X.g2m();y6K+=f4b;var C$T=R3z;C$T+=i_u;C$T+=K$x;if(textIn === F7$ || textIn === undefined){var x3X=o6e;x3X+=Y2a;textIn=conf[U3Z] || x3X;}conf[C$T][y6K](V3W)[u$O](textIn);}function _commonUpload(editor,conf,dropCallback,multiple){var X0Q="eu_";var G23="<div class=\"cell";var A5d='<div class="drop"><span></span></div>';var t6A='"></button>';var n2L='dragleave dragexit';var n5t=" c";var l4r="Drag and drop a file here to";var j_h='id';var z6X='noDrop';var F0V="able\">";var f8a="over";var K4K="text";var R9u="ena";g1X.h9F();var B6h="></";var H$S="t>";var z6M="></but";var A_P='<div class="cell clearValue">';var p2J=" upl";var t0G="/";var i7u="[type";var v6q="v.drop";var w$W='<div class="cell limitHide">';var z78='<input type="file" ';var u45="rag";var v5C="class=\"row";var w3W="=file]";var A88="<b";var F9n="lass=\"rendered\"></div>";var l3m="oa";var B77="input[type";var O5P="</div";var s$b='input[type=file]';var T0p="<div class=\"";var g7X="ton>";var I0C="buttonInternal";var r_I='<div class="editor_upload">';var P1j="div";var Z01='div.rendered';var m3O="dragD";var c0u="s=\"cell upload limitHide\">";var V8K="ileReade";var K0a="row\">";var K76="rop";var A_t="dragDropText";var U34="on c";var t$W="ltip";var W8M="utton class=\"";var H8l=" second";var H2p='div.drop span';var H2G=W08;H2G+=q6U;H2G+=i_u;H2G+=K$x;var u2a=m3O;u2a+=K76;var Y_X=g7q;Y_X+=V8K;Y_X+=Y$e;var t5x=W08;t5x+=f4b;var e_s=g4U;e_s+=R9u;e_s+=F9Q;var l9N=U$F;l9N+=t0G;l9N+=P1j;l9N+=I9l;var P$8=U$F;P$8+=t0G;P$8+=e9o;P$8+=M3t;var R5K=d66;R5K+=K9A;R5K+=n5t;R5K+=F9n;var x8T=G23;x8T+=h1s;var c1k=A0l;c1k+=v5C;c1k+=H8l;c1k+=h1s;var X4a=O5P;X4a+=I9l;var g$b=X9B;g$b+=k3K;var s1J=y$Z;s1J+=z6M;s1J+=g7X;var W7I=q2G;W7I+=U34;W7I+=O$K;W7I+=t_X;var t0C=B6h;t0C+=k9a;t0C+=e_G;t0C+=H$S;var G3Y=d6U;G3Y+=t$W;G3Y+=A5M;G3Y+=J7P;var S4Y=A88;S4Y+=W8M;var u6B=A0l;u6B+=X5j;u6B+=c0u;var e_U=T0p;e_U+=K0a;var K9s=T0p;K9s+=X0Q;K9s+=K$x;K9s+=F0V;var H3i=C6M;H3i+=k9m;H3i+=g69;var J11=M31;J11+=J7P;J11+=P48;if(multiple === void x9R){multiple=P3U;}var btnClass=editor[J11][H3i][I0C];var container=$(r_I + K9s + e_U + u6B + S4Y + btnClass + t6A + z78 + (multiple?G3Y:x8n) + t0C + z6g + A_P + W7I + btnClass + s1J + g$b + X4a + c1k + w$W + A5d + z6g + x8T + R5K + z6g + P$8 + z6g + l9N);conf[z9B]=container;conf[e_s]=w0_;if(conf[t5x]){var L5C=W08;L5C+=f4b;var u5H=P48;u5H+=y4k;u5H+=C6M;u5H+=i1J;var O9a=w7E;O9a+=Y$e;var f7Y=w$t;f7Y+=K$x;f7Y+=i7u;f7Y+=w3W;var Y8j=B9g;Y8j+=a07;container[Y8j](f7Y)[O9a](j_h,Editor[u5H](conf[L5C]));}if(conf[c5_]){var B68=y4k;B68+=K$x;B68+=b_8;var n0v=B77;n0v+=w3W;container[Q7_](n0v)[B68](conf[c5_]);}_buttonText(conf);if(window[Y_X] && conf[u2a] !== P3U){var k$M=X47;k$M+=A5M;k$M+=f4C;var U47=w1$;U47+=D4c;var w$h=k9m;w$h+=q6U;var i1S=f4b;i1S+=u45;i1S+=f8a;var s5x=k9m;s5x+=q6U;var U4Y=f4b;U4Y+=K76;var B9U=f4b;B9U+=W08;B9U+=v6q;var S9k=C6M;S9k+=W08;S9k+=q6U;S9k+=f4b;var v5d=l4r;v5d+=p2J;v5d+=l3m;v5d+=f4b;var p1F=C6M;p1F+=W08;p1F+=q6U;p1F+=f4b;container[p1F](H2p)[K4K](conf[A_t] || v5d);var dragDrop_1=container[S9k](B9U);dragDrop_1[j_R](U4Y,function(e){var M2z="loa";var B8N="nabled";var S2A="originalEvent";var K7k="dataTransfer";var T7w='over';var K2G=W1Y;K2G+=B8N;if(conf[K2G]){var r1D=C6M;r1D+=W08;r1D+=A5M;r1D+=D99;var Q0h=e_G;Q0h+=U3G;Q0h+=M2z;Q0h+=f4b;Editor[Q0h](editor,conf,e[S2A][K7k][r1D],_buttonText,dropCallback);dragDrop_1[P8L](T7w);}return P3U;})[j_R](n2L,function(e){if(conf[T2B]){var H5M=k9m;H5M+=K9A;H5M+=w9V;var z1w=i9G;z1w+=m7w;dragDrop_1[z1w](H5M);}g1X.h9F();return P3U;})[s5x](i1S,function(e){if(conf[T2B]){var Y9w=u$p;Y9w+=J7P;Y9w+=Y$e;dragDrop_1[I30](Y9w);}return P3U;});editor[w$h](U47,function(){var w1K="op.DTE_Upload";var R5m="dragover.DTE_Uploa";var E7d="d dr";var k7J=R5m;k7J+=E7d;k7J+=w1K;var Y4y=k9m;Y4y+=q6U;var i1G=z6i;i1G+=k9m;i1G+=f4b;i1G+=a_i;$(i1G)[Y4y](k7J,function(e){return P3U;});})[j_R](k$M,function(){var u4c="Upload";var t5U="load drop.DTE_";var F_U="ff";var B2Q="er.DTE_Up";var t2E="dragov";var W_Q=t2E;g1X.g2m();W_Q+=B2Q;W_Q+=t5U;W_Q+=u4c;var r21=k9m;r21+=F_U;var s4s=d1m;s4s+=a_i;$(s4s)[r21](W_Q);});}else {container[I30](z6X);container[k8x](container[Q7_](Z01));}container[Q7_](u1v)[j_R](I8G,function(e){var W4d="enable";var c$6=g4U;c$6+=W4d;c$6+=f4b;e[v8T]();if(conf[c$6]){upload[P9V][B9N](editor,conf,x8n);}});container[Q7_](s$b)[j_R](H2G,function(){var Q0C="ile";var Q4d=C6M;Q4d+=Q0C;Q4d+=P48;var w1d=S7M;w1d+=A5M;g1X.g2m();w1d+=z5h;Editor[w1d](editor,conf,this[Q4d],_buttonText,function(ids){var D4Q="[type=file]";var u39=K9A;u39+=k25;var D_w=k9a;D_w+=e_G;D_w+=K$x;D_w+=D4Q;var H4H=U4P;H4H+=f4b;dropCallback[B9N](editor,ids);container[H4H](D_w)[x9R][u39]=x8n;});});return container;}function _triggerChange(input){setTimeout(function(){var M0v="rig";var E1J='change';var z4B=K$x;z4B+=M0v;z4B+=Z71;z4B+=w9V;g1X.g2m();input[z4B](E1J,{editor:w0_,editorSet:w0_});;},x9R);}var baseFieldType=$[W6E](w0_,{},fieldType,{canReturnSubmit:function(conf,node){return w0_;},disable:function(conf){var P3Y=U3G;P3Y+=Y$e;P3Y+=w1$;conf[z9B][P3Y](N8M,w0_);},enable:function(conf){var y1F=Q4J;g1X.g2m();y1F+=w1$;conf[z9B][y1F](N8M,P3U);},get:function(conf){var N4s=g4U;N4s+=B2L;N4s+=J5T;return conf[N4s][t0E]();},set:function(conf,val){conf[z9B][t0E](val);_triggerChange(conf[z9B]);}});var hidden={create:function(conf){var B9m=g4U;g1X.h9F();B9m+=t0E;conf[B9m]=conf[E3b];return F7$;},get:function(conf){var r$w=g4U;r$w+=K9A;g1X.h9F();r$w+=y4k;r$w+=A5M;return conf[r$w];},set:function(conf,val){conf[o8H]=val;}};var readonly=$[o7q](w0_,{},baseFieldType,{create:function(conf){var v6a="t/>";var Y1A="<inpu";var T3k=h1v;T3k+=K$x;var Y1F=K$x;Y1F+=J7P;Y1F+=W4t;Y1F+=K$x;var p8F=y4k;p8F+=m1y;var o_M=Y1A;o_M+=v6a;conf[z9B]=$(o_M)[p8F]($[W6E]({id:Editor[Q_X](conf[d4U]),readonly:H$c,type:Y1F},conf[c5_] || ({})));return conf[T3k][x9R];}});var text=$[V1$](w0_,{},baseFieldType,{create:function(conf){var D5r='text';var E0O="<input";var I3Y=g4U;I3Y+=W08;I3Y+=S2m;I3Y+=C1u;var T1y=W08;T1y+=f4b;var g_4=P48;g_4+=T4r;var m83=J7P;g1X.h9F();m83+=e9b;m83+=q6U;m83+=f4b;var s_d=E0O;s_d+=l7N;conf[z9B]=$(s_d)[c5_]($[m83]({id:Editor[g_4](conf[T1y]),type:D5r},conf[c5_] || ({})));return conf[I3Y][x9R];}});var password=$[U9F](w0_,{},baseFieldType,{create:function(conf){var q6e="<i";var J1a="nput/>";g1X.h9F();var y3$="npu";var i$f="assw";var U6k=g4U;U6k+=W08;U6k+=y3$;U6k+=K$x;var x7z=R01;x7z+=b_8;var O34=U3G;O34+=i$f;O34+=q9X;var E_h=W08;E_h+=f4b;var f8X=P5I;f8X+=K$x;f8X+=Z9U;var b1F=q6e;b1F+=J1a;var r4i=g4U;r4i+=W08;r4i+=A9d;conf[r4i]=$(b1F)[c5_]($[f8X]({id:Editor[Q_X](conf[E_h]),type:O34},conf[x7z] || ({})));return conf[U6k][x9R];}});var textarea=$[W6E](w0_,{},baseFieldType,{canReturnSubmit:function(conf,node){g1X.g2m();return P3U;},create:function(conf){var A7A="textarea></tex";var z5c="af";var p2N="tarea>";var x$B=R3z;x$B+=U3G;x$B+=C1u;var B9d=P48;B9d+=z5c;B9d+=S7a;B9d+=f4b;var t0f=P5I;t0f+=y72;var f_w=y4k;f_w+=m1y;var U55=U$F;U55+=A7A;U55+=p2N;conf[z9B]=$(U55)[f_w]($[t0f]({id:Editor[B9d](conf[d4U])},conf[c5_] || ({})));g1X.g2m();return conf[x$B][x9R];}});var select=$[R0$](w0_,{},baseFieldType,{_addOptions:function(conf,opts,append){var r8t="placeholderValue";var x_N="placeholder";var H81="lder";var i4r="laceho";var t_E="optionsPai";var l9U="placeholderDisabled";var U7X="lderDis";var Y9o="_editor_";var P06="hidden";var B8y=C9_;B8y+=u2h;if(append === void x9R){append=P3U;}var elOpts=conf[z9B][x9R][B8y];var countOffset=x9R;if(!append){var q6w=U3G;q6w+=i4r;q6w+=H81;elOpts[p2U]=x9R;if(conf[q6w] !== undefined){var y_a=Y9o;y_a+=t0E;var m52=U3G;m52+=i4r;m52+=U7X;m52+=e36;var placeholderValue=conf[r8t] !== undefined?conf[r8t]:x8n;countOffset+=C05;elOpts[x9R]=new Option(conf[x_N],placeholderValue);var disabled=conf[l9U] !== undefined?conf[m52]:w0_;elOpts[x9R][P06]=disabled;elOpts[x9R][O$u]=disabled;elOpts[x9R][y_a]=placeholderValue;}}else {var H_e=A5M;H_e+=J7P;H_e+=m5E;H_e+=B0B;countOffset=elOpts[H_e];}if(opts){var N$L=t_E;N$L+=Y$e;Editor[h4S](opts,conf[N$L],function(val,label,i,attr){var V1m="or_va";var I76=s3m;I76+=V1m;I76+=A5M;var option=new Option(label,val);g1X.h9F();option[I76]=val;if(attr){var w4U=w7E;w4U+=Y$e;$(option)[w4U](attr);}elOpts[i + countOffset]=option;});}},create:function(conf){var g5G="ipOpts";var g0Q="fe";var k8C="cha";var B5j="iple";var e09='<select></select>';var i1e="nge.dt";var m0C=I_V;m0C+=q6U;m0C+=i_u;m0C+=K$x;var L4d=L_o;L4d+=P48;var V2p=k8C;V2p+=i1e;V2p+=J7P;var p_I=k9m;p_I+=q6U;var u6L=y4k;u6L+=K$x;u6L+=b_8;var o5H=d6U;o5H+=A5M;o5H+=K$x;o5H+=B5j;var w3M=P48;w3M+=y4k;w3M+=g0Q;w3M+=S0r;var J61=J7P;J61+=W4t;J61+=Q7A;J61+=f4b;var L0R=g4U;L0R+=Y0R;g1X.g2m();conf[L0R]=$(e09)[c5_]($[J61]({id:Editor[w3M](conf[d4U]),multiple:conf[o5H] === w0_},conf[u6L] || ({})))[p_I](V2p,function(e,d){var S58="_lastS";var Y_S=K14;Y_S+=Y$e;if(!d || !d[Y_S]){var X0O=S58;X0O+=t0I;conf[X0O]=select[B3M](conf);}});select[y_M](conf,conf[L4d] || conf[g5G]);return conf[m0C][x9R];},destroy:function(conf){var E47='change.dte';var E_q=k9m;g1X.h9F();E_q+=C6M;E_q+=C6M;conf[z9B][E_q](E47);},get:function(conf){var h3k="ple";var u1F="toAr";var N0v="separat";var Z1g='option:selected';var P1X="arato";var D71=A5M;D71+=H8o;D71+=B0B;var c9N=S4m;c9N+=N4r;c9N+=h3k;var H0_=u1F;H0_+=Y$e;H0_+=u4G;var val=conf[z9B][Q7_](Z1g)[C5E](function(){return this[z5L];})[H0_]();if(conf[c9N]){var X_s=r_X;X_s+=P1X;X_s+=Y$e;var A5w=I3y;A5w+=W08;A5w+=q6U;var J9n=N0v;J9n+=i5x;return conf[J9n]?val[A5w](conf[X_s]):val;}return val[D71]?val[x9R]:F7$;},set:function(conf,val,localUpdate){var l5t="tS";var U7$="_las";var W$C="holder";var I_5='option';var z3A="selected";var A$y=V1c;A$y+=W$C;var j$K=h1v;j$K+=K$x;var l71=C6M;l71+=x3d;var N1f=j75;N1f+=Y$e;N1f+=u4G;g1X.h9F();if(!localUpdate){var j_A=U7$;j_A+=l5t;j_A+=J7P;j_A+=K$x;conf[j_A]=val;}if(conf[u2O] && conf[Q4C] && !Array[T6n](val)){var l3P=r_X;l3P+=h90;l3P+=y4k;l3P+=g$C;var u2f=C6g;u2f+=y2a;val=typeof val === u2f?val[Z_2](conf[l3P]):[];}else if(!Array[N1f](val)){val=[val];}var i;var len=val[p2U];var found;var allFound=P3U;var options=conf[z9B][l71](I_5);conf[j$K][Q7_](I_5)[h3P](function(){var b1i="dito";found=P3U;for(i=x9R;i < len;i++){var G29=W1Y;G29+=b1i;G29+=K$2;G29+=c2r;if(this[G29] == val[i]){found=w0_;allFound=w0_;break;}}g1X.g2m();this[z3A]=found;});if(conf[A$y] && !allFound && !conf[u2O] && options[p2U]){options[x9R][z3A]=w0_;}if(!localUpdate){_triggerChange(conf[z9B]);}return allFound;},update:function(conf,options,append){var K1t="_lastSet";select[y_M](conf,options,append);var lastSet=conf[K1t];if(lastSet !== undefined){var m1C=P48;m1C+=J7P;m1C+=K$x;select[m1C](conf,lastSet,w0_);}_triggerChange(conf[z9B]);}});var checkbox=$[W6E](w0_,{},baseFieldType,{_addOptions:function(conf,opts,append){var h2E="onsPai";var R6Y=I_V;R6Y+=S2m;R6Y+=e_G;R6Y+=K$x;if(append === void x9R){append=P3U;}var jqInput=conf[R6Y];var offset=x9R;if(!append){jqInput[C0K]();}else {var A9W=W08;A9W+=q6U;A9W+=U3G;A9W+=C1u;offset=$(A9W,jqInput)[p2U];}if(opts){var k5P=C9_;k5P+=W08;k5P+=h2E;k5P+=Y$e;Editor[h4S](opts,conf[k5P],function(val,label,i,attr){var j61="afe";var Q$E="bel for=\"";var z1Y='input:last';var I3j='" type="checkbox" />';var b5f="_editor_va";var P1O="ut:la";var s92="safe";var D11="<la";var R5G=b5f;g1X.g2m();R5G+=A5M;var q$0=t0E;q$0+=v2c;var v9i=B2L;v9i+=U3G;v9i+=P1O;v9i+=C6g;var x$p=s92;x$p+=S0r;var q6M=D11;q6M+=Q$E;var h8r=W08;h8r+=f4b;var K2r=P48;K2r+=j61;K2r+=F_z;K2r+=f4b;var E7V=w1o;E7V+=J7P;E7V+=q6U;E7V+=f4b;jqInput[E7V](y1H + f98 + Editor[K2r](conf[h8r]) + P40 + (i + offset) + I3j + q6M + Editor[x$p](conf[d4U]) + P40 + (i + offset) + v2p + label + w6A + z6g);$(v9i,jqInput)[c5_](q$0,val)[x9R][R5G]=val;if(attr){$(z1Y,jqInput)[c5_](attr);}});}},create:function(conf){var S$z="ip";var G67="ddOpt";var u3L="v></d";var p3m=S$z;p3m+=a5w;p3m+=l8d;p3m+=P48;var v3h=C9_;v3h+=I$d;v3h+=q6U;g1X.h9F();v3h+=P48;var p57=V5o;p57+=G67;p57+=n0H;p57+=P48;var W83=d66;W83+=u3L;W83+=k3K;var i2O=I_V;i2O+=S2m;i2O+=e_G;i2O+=K$x;conf[i2O]=$(W83);checkbox[p57](conf,conf[v3h] || conf[p3m]);return conf[z9B][x9R];},disable:function(conf){var c7V=W08;g1X.h9F();c7V+=q6U;c7V+=U3G;c7V+=C1u;var L1d=B9g;L1d+=q6U;L1d+=f4b;var a3Y=g4U;a3Y+=W08;a3Y+=A9d;conf[a3Y][L1d](c7V)[u9Q](N8M,w0_);},enable:function(conf){var o27="abl";var q9r=e9o;q9r+=P48;q9r+=o27;q9r+=M_v;var i1q=W08;i1q+=q6U;g1X.h9F();i1q+=i_u;i1q+=K$x;conf[z9B][Q7_](i1q)[u9Q](q9r,P3U);},get:function(conf){var u_D="parator";var Z8h="input:ch";var q7W="ctedValue";var Z7a=x_J;Z7a+=u_D;var t4j=K8$;t4j+=k9m;t4j+=W08;t4j+=q6U;var A0E=f6v;A0E+=Y$e;A0E+=G1T;var E1O=O48;E1O+=K0i;E1O+=q7W;var l5I=A5M;l5I+=D4c;l5I+=Z71;l5I+=B0B;var c9p=Z8h;c9p+=B2i;var t9I=C6M;t9I+=W08;t9I+=q6U;t9I+=f4b;var t2e=g4U;t2e+=W08;t2e+=q6U;t2e+=J5T;var out=[];var selected=conf[t2e][t9I](c9p);if(selected[l5I]){var e7_=J7P;e7_+=y4k;e7_+=X47;e7_+=j1i;selected[e7_](function(){var p8E="ditor_va";var A9r=g4U;A9r+=J7P;A9r+=p8E;A9r+=A5M;var m_M=U3G;g1X.g2m();m_M+=e_G;m_M+=m2$;out[m_M](this[A9r]);});}else if(conf[E1O] !== undefined){out[s6F](conf[I2B]);}return conf[Q4C] === undefined || conf[A0E] === F7$?out:out[t4j](conf[Z7a]);},set:function(conf,val){var n_i="arator";g1X.h9F();var H3u='|';var U1o=J7P;U1o+=L$A;var f3V=V7p;f3V+=Y$e;f3V+=Y$e;f3V+=u4G;var b9U=X4s;b9U+=Y36;b9U+=W5p;var i7Q=B2L;i7Q+=J5T;var u$6=U4P;u$6+=f4b;var jqInputs=conf[z9B][u$6](i7Q);if(!Array[b9U](val) && typeof val === V_T){var P1F=r_X;P1F+=n_i;var a3V=P48;a3V+=H2f;a3V+=W08;a3V+=K$x;val=val[a3V](conf[P1F] || H3u);}else if(!Array[f3V](val)){val=[val];}var i;var len=val[p2U];var found;jqInputs[U1o](function(){var G1I="cke";var j3A="che";var P0u=j3A;P0u+=G1I;P0u+=f4b;found=P3U;for(i=x9R;i < len;i++){var y2e=s3m;y2e+=k9m;y2e+=K$2;y2e+=c2r;if(this[y2e] == val[i]){found=w0_;break;}}this[P0u]=found;});_triggerChange(jqInputs);},update:function(conf,options,append){var c_j="addOp";var d9o=g4U;d9o+=c_j;d9o+=j0G;d9o+=P48;var currVal=checkbox[B3M](conf);checkbox[d9o](conf,options,append);checkbox[P9V](conf,currVal);}});var radio=$[C1C](w0_,{},baseFieldType,{_addOptions:function(conf,opts,append){var T6N=h1v;T6N+=K$x;if(append === void x9R){append=P3U;}var jqInput=conf[T6N];var offset=x9R;if(!append){var s7$=J7P;s7$+=u9C;s7$+=U3G;s7$+=d4a;jqInput[s7$]();}else {offset=$(F76,jqInput)[p2U];}if(opts){Editor[h4S](opts,conf[M9W],function(val,label,i,attr){var b4I='" />';var S4D="\" type=\"radio\" na";var E9m="ast";var i6e="input:las";var d6Q='<label for="';var a_2="ut:";var m7B="sa";var L$Y="me=\"";var e00=K9A;e00+=y4k;e00+=A5M;e00+=v2c;var I8Z=y4k;I8Z+=m1y;var D5w=k9a;D5w+=a_2;D5w+=A5M;D5w+=E9m;var U6G=U$F;U6G+=d9S;U6G+=S3r;U6G+=I9l;var z0N=P48;z0N+=T4r;var l2s=q6U;l2s+=Y2J;var X6n=S4D;X6n+=L$Y;var t86=m7B;t86+=C6M;t86+=i1J;jqInput[k8x](y1H + f98 + Editor[t86](conf[d4U]) + P40 + (i + offset) + X6n + conf[l2s] + b4I + d6Q + Editor[z0N](conf[d4U]) + P40 + (i + offset) + v2p + label + w6A + U6G);$(D5w,jqInput)[I8Z](e00,val)[x9R][z5L]=val;if(attr){var Z_w=R01;Z_w+=b_8;var Q1j=i6e;Q1j+=K$x;$(Q1j,jqInput)[Z_w](attr);}});}},create:function(conf){var T1U="Opts";var n7f=k9m;n7f+=q6U;var j6g=W08;j6g+=U3G;j6g+=T1U;var D10=l3S;D10+=l8d;D10+=W08;D10+=Y2l;var P_G=Q4P;P_G+=W08;P_G+=y7X;P_G+=l7N;var M0X=I_V;M0X+=A9d;conf[M0X]=$(P_G);radio[D10](conf,conf[m$w] || conf[j6g]);this[n7f](G25,function(){var R0O=J7P;R0O+=i6p;R0O+=j1i;g1X.g2m();var k35=W08;k35+=A9d;var t98=C6M;t98+=W08;t98+=q6U;t98+=f4b;conf[z9B][t98](k35)[R0O](function(){var x9H="check";var C_9=g4U;C_9+=U3G;C_9+=Y$e;C_9+=P54;if(this[C_9]){var N0b=x9H;N0b+=J7P;N0b+=f4b;this[N0b]=w0_;}});});return conf[z9B][x9R];},disable:function(conf){var i_R=U4P;i_R+=f4b;var r4J=R3z;r4J+=i_u;r4J+=K$x;conf[r4J][i_R](F76)[u9Q](N8M,w0_);},enable:function(conf){var Y$o=f4b;Y$o+=n$L;Y$o+=V3r;var M_g=B2L;M_g+=U3G;M_g+=e_G;M_g+=K$x;var Q2D=C6M;g1X.g2m();Q2D+=W08;Q2D+=a07;var e16=g4U;e16+=w$t;e16+=K$x;conf[e16][Q2D](M_g)[u9Q](Y$o,P3U);},get:function(conf){var i0h="ctedValu";var W_a="unsele";var g9L="ditor_";var A36=W_a;A36+=i0h;A36+=J7P;var a5V=Y0R;a5V+=Y4i;a5V+=I6x;var u3u=R3z;u3u+=U3G;u3u+=C1u;var el=conf[u3u][Q7_](a5V);if(el[p2U]){var K5q=W1Y;K5q+=g9L;K5q+=t0E;return el[x9R][K5q];}return conf[A36] !== undefined?conf[I2B]:undefined;},set:function(conf,val){var Z4f="input:c";var N7N="heck";var N3d=Z4f;N3d+=N7N;N3d+=M_v;var g6p=I_V;g6p+=S2m;g1X.g2m();g6p+=C1u;var I6_=w$t;I6_+=K$x;conf[z9B][Q7_](I6_)[h3P](function(){var j2w="ked";var h1N="_preChecked";var O8n="eCh";this[h1N]=P3U;if(this[z5L] == val){var I1z=H2w;I1z+=Y$e;I1z+=O8n;I1z+=B2i;var o7_=X47;o7_+=j1i;o7_+=H86;o7_+=j2w;this[o7_]=w0_;this[I1z]=w0_;}else {var h0B=n_V;h0B+=P54;this[I6x]=P3U;this[h0B]=P3U;}});_triggerChange(conf[g6p][Q7_](N3d));},update:function(conf,options,append){var v6k='value';var S2X='[value="';var Y84="Options";var q$z=P48;g1X.h9F();q$z+=J7P;q$z+=K$x;var N$c=B2L;N$c+=U3G;N$c+=C1u;var v2q=C6M;v2q+=x3d;var y4x=g4U;y4x+=Q6J;y4x+=Y84;var H$b=Z71;H$b+=t0I;var currVal=radio[H$b](conf);radio[y4x](conf,options,append);var inputs=conf[z9B][v2q](N$c);radio[q$z](conf,inputs[M2I](S2X + currVal + N5P)[p2U]?currVal:inputs[G9e](x9R)[c5_](v6k));}});var datetime=$[W6E](w0_,{},baseFieldType,{create:function(conf){var G_I="icke";var c90="displayForma";var R_f="wn";var j10="me library ";var N2g="DateTi";var E5m="eTim";var g7s="keyIn";var V5L="oseFn";var x63='<input />';var O2c="is required";var n3l="eyd";var Y7W="datetime";var c5d=f28;c5d+=u6T;var k_S=X47;k_S+=t6S;var G1U=g7s;G1U+=J5T;var D7U=g4U;D7U+=E$w;D7U+=V5L;var H80=k9m;H80+=U3G;H80+=y0y;var G7d=W08;G7d+=G92;G7d+=z$d;G7d+=q6U;var j4y=c90;j4y+=K$x;var E2M=J7P;E2M+=h3O;E2M+=Z9U;var O2X=R3z;O2X+=U3G;O2X+=C1u;var g3r=H2w;g3r+=G_I;g3r+=Y$e;var V9E=s6V;V9E+=K$x;V9E+=E5m;V9E+=J7P;var S1y=K$x;S1y+=J7P;S1y+=h3O;conf[z9B]=$(x63)[c5_]($[W6E](w0_,{id:Editor[Q_X](conf[d4U]),type:S1y},conf[c5_]));if(!DataTable$2[V9E]){var A_e=N2g;A_e+=j10;A_e+=O2c;Editor[F3P](A_e,o0X);}conf[g3r]=new DataTable$2[d_X](conf[O2X],$[E2M]({format:conf[j4y] || conf[S27],i18n:this[G7d][Y7W]},conf[H80]));conf[D7U]=function(){var S1p="_picke";g1X.g2m();var W75=S1p;W75+=Y$e;conf[W75][U2S]();};if(conf[G1U] === P3U){var F0q=l$2;F0q+=n3l;F0q+=k9m;F0q+=R_f;var K3E=g4U;K3E+=w$t;K3E+=K$x;conf[K3E][j_R](F0q,function(e){g1X.h9F();e[v8T]();});}this[j_R](k_S,conf[c5d]);return conf[z9B][x9R];},destroy:function(conf){g1X.g2m();var V3M="eydown";var w0$="_closeFn";var b4F=f4b;b4F+=k7k;var z4x=l$2;z4x+=V3M;var e3J=k9m;e3J+=C6M;e3J+=C6M;var s_n=X47;s_n+=A5M;s_n+=U44;s_n+=J7P;this[B96](s_n,conf[w0$]);conf[z9B][e3J](z4x);conf[M11][b4F]();},errorMessage:function(conf,msg){var A7p="orMsg";var f_9=T$a;f_9+=A7p;conf[M11][f_9](msg);},get:function(conf){var b7F="tSt";var c1j="momen";var x68=c1j;x68+=b7F;g1X.g2m();x68+=G5M;x68+=D7i;var d01=f9t;d01+=w0b;var v66=K9A;v66+=y4k;v66+=A5M;var val=conf[z9B][v66]();var inst=conf[M11][X47];var moment=window[I09];return val && conf[N29] && moment?moment(val,inst[d01],inst[o2S],inst[x68])[S27](conf[N29]):val;},maxDate:function(conf,max){var D2U="_pi";var f7T=D2U;f7T+=X47;f7T+=z4_;f7T+=Y$e;g1X.h9F();conf[f7T][y1v](max);},minDate:function(conf,min){var c07=u9C;c07+=W08;c07+=q6U;conf[M11][c07](min);},owns:function(conf,node){var P0f=k9m;P0f+=T7p;P0f+=e7H;return conf[M11][P0f](node);},set:function(conf,val){var l5P="momentStrict";var u6f='--';var y7$="wireFo";var R4i=C6M;R4i+=k9m;R4i+=g69;R4i+=R01;var x8h=y7$;x8h+=w0b;var k_N=x3d;k_N+=J7P;k_N+=z3f;var inst=conf[M11][X47];var moment=window[I09];conf[M11][t0E](typeof val === V_T && val && val[k_N](u6f) !== x9R && conf[x8h] && moment?moment(val,conf[N29],inst[o2S],inst[l5P])[R4i](inst[S27]):val);_triggerChange(conf[z9B]);}});var upload=$[U8s](w0_,{},baseFieldType,{canReturnSubmit:function(conf,node){g1X.g2m();return P3U;},create:function(conf){var editor=this;g1X.g2m();var container=_commonUpload(editor,conf,function(val){var N6D=X47;N6D+=y4k;N6D+=A5M;N6D+=A5M;upload[P9V][N6D](editor,conf,val[x9R]);editor[e5F](p5Z,[conf[t$2],val[x9R]]);});return container;},disable:function(conf){var G$R=f4b;g1X.h9F();G$R+=W97;G$R+=z6i;G$R+=V3r;var C5I=g4U;C5I+=Y0R;conf[C5I][Q7_](F76)[u9Q](G$R,w0_);conf[T2B]=P3U;},enable:function(conf){var p7Y="nab";var R$3=W1Y;R$3+=p7Y;R$3+=W_c;R$3+=f4b;var s_a=f4b;s_a+=X4s;s_a+=e36;var A6N=B2L;A6N+=U3G;A6N+=e_G;A6N+=K$x;var f3N=B9g;f3N+=a07;conf[z9B][f3N](A6N)[u9Q](s_a,P3U);conf[R$3]=w0_;},get:function(conf){g1X.g2m();return conf[o8H];},set:function(conf,val){var E1t="noCl";var t99="Class";var w5y="ndered";var J15="eC";var h2L="an";var E8t="div.r";var O$c="_inp";var Y3c="Ha";var e$q="rTex";var n38="clearText";var v5B="emov";var G2g="<sp";var r0J="noFileText";var L7D='noClear';var P$T='upload.editor';var y6u=q_$;y6u+=x0$;y6u+=Y3c;y6u+=j07;var c5A=g4U;c5A+=B2L;c5A+=J5T;var p1j=o0_;p1j+=y4k;p1j+=e$q;p1j+=K$x;var R1o=D$k;R1o+=U3G;R1o+=A5M;R1o+=u4G;var r9e=K9A;r9e+=y4k;r9e+=A5M;var A4x=O$c;A4x+=C1u;conf[o8H]=val;conf[A4x][r9e](x8n);var container=conf[z9B];if(conf[R1o]){var G21=g4U;G21+=K9A;G21+=y4k;G21+=A5M;var C51=E8t;C51+=J7P;C51+=w5y;var rendered=container[Q7_](C51);if(conf[G21]){var T4t=D$k;T4t+=E70;rendered[K0h](conf[T4t](conf[o8H]));}else {var F5q=l1p;F5q+=W_c;var v0P=G2g;v0P+=h2L;v0P+=I9l;var V7L=y4k;V7L+=U3G;V7L+=U3G;V7L+=Z9U;rendered[C0K]()[V7L](v0P + (conf[r0J] || F5q) + t6N);}}var button=container[Q7_](u1v);if(val && conf[p1j]){var q7j=Y$e;q7j+=v5B;q7j+=J15;q7j+=m7w;button[K0h](conf[n38]);container[q7j](L7D);}else {var A4z=E1t;A4z+=J7P;A4z+=h90;var a8n=y4k;a8n+=Z9h;a8n+=t99;container[a8n](A4z);}conf[c5A][Q7_](F76)[y6u](P$T,[conf[o8H]]);}});var uploadMany=$[h6b](w0_,{},baseFieldType,{_showHide:function(conf){var j_i="tai";var X1N="limi";var Y3Y="limit";var x6c="v.lim";var q5s="_con";var B5k="tLeft";var G38="_l";var N5t="itHide";var O$x="im";var b6F=I6k;b6F+=Z71;b6F+=B0B;var g8T=q8z;g8T+=y4k;g8T+=A5M;var v5N=G38;v5N+=O$x;v5N+=W08;v5N+=B5k;var Q3R=q6U;Q3R+=j_R;Q3R+=J7P;var U$C=X1N;U$C+=K$x;var w8Y=g4U;w8Y+=K9A;w8Y+=c2r;var S3u=X47;S3u+=P48;S3u+=P48;var S2q=e9o;S2q+=x6c;S2q+=N5t;var n07=q5s;n07+=j_i;n07+=g5s;var D1n=A5M;D1n+=O$x;D1n+=W08;D1n+=K$x;if(!conf[D1n]){return;}conf[n07][Q7_](S2q)[S3u](y99,conf[w8Y][p2U] >= conf[U$C]?Q3R:q3u);conf[v5N]=conf[Y3Y] - conf[g8T][b6F];},canReturnSubmit:function(conf,node){g1X.g2m();return P3U;},create:function(conf){var p9$="ontain";var a37='button.remove';var I2g=P1G;I2g+=p9$;I2g+=w9V;var O9h=x0W;O9h+=X47;O9h+=l$2;var K2Q=u9C;K2Q+=e_G;K2Q+=A5M;K2Q+=N4r;var editor=this;g1X.g2m();var container=_commonUpload(editor,conf,function(val){var U1_=q8z;U1_+=y4k;U1_+=A5M;var f7M=x_J;g1X.h9F();f7M+=K$x;var O0k=Y1I;O0k+=q6U;O0k+=n6z;var p43=q8z;p43+=y4k;p43+=A5M;conf[p43]=conf[o8H][O0k](val);uploadMany[f7M][B9N](editor,conf,conf[U1_]);editor[e5F](p5Z,[conf[t$2],conf[o8H]]);},w0_);container[I30](K2Q)[j_R](O9h,a37,function(e){var f7b='idx';var y4X="_ena";var S7G="stopPropagation";var q1V=y4X;q1V+=F9Q;e[S7G]();g1X.h9F();if(conf[q1V]){var N3v=g4U;N3v+=t0E;var x7V=P48;x7V+=J7P;x7V+=K$x;var d5v=f4b;d5v+=y4k;d5v+=K$x;d5v+=y4k;var idx=$(this)[d5v](f7b);conf[o8H][T9f](idx,C05);uploadMany[x7V][B9N](editor,conf,conf[N3v]);}});conf[I2g]=container;return container;},disable:function(conf){var m5L=W1Y;m5L+=q6U;m5L+=S8G;m5L+=V3r;var E7l=f4b;E7l+=n$L;E7l+=V3r;var W$R=U4P;W$R+=f4b;conf[z9B][W$R](F76)[u9Q](E7l,w0_);conf[m5L]=P3U;},enable:function(conf){var f19="_en";var d3R=f19;d3R+=S8G;d3R+=V3r;var a1q=Q4J;a1q+=w1$;var k0t=B9g;k0t+=a07;conf[z9B][k0t](F76)[a1q](N8M,P3U);conf[d3R]=w0_;},get:function(conf){var b__=g4U;b__+=K9A;g1X.g2m();b__+=y4k;b__+=A5M;return conf[b__];},set:function(conf,val){var q6K="ad.";var d3F="_sho";var N2J="iggerHandler";var T9r="/span>";var K$X='<ul></ul>';var Z7q="noFi";var w10='Upload collections must have an array as a value';var u$S="iv.rendered";var U2H="wHi";var a4t="uplo";var k1H='<span>';var s0E="endTo";var r1f="leTex";var r9G=g4U;r9G+=e7g;r9G+=A5M;var f_D=a4t;f_D+=q6K;f_D+=M_v;f_D+=R8S;var J4Y=K$x;J4Y+=Y$e;J4Y+=N2J;var K9Z=w$t;K9Z+=K$x;var w67=R3z;w67+=i_u;w67+=K$x;var U8p=d3F;U8p+=U2H;U8p+=u2Y;var O4o=g4U;O4o+=k9a;O4o+=C1u;var z9Y=I_V;z9Y+=S2m;z9Y+=e_G;z9Y+=K$x;if(!val){val=[];}if(!Array[T6n](val)){throw new Error(w10);}conf[o8H]=val;conf[z9Y][t0E](x8n);var that=this;var container=conf[O4o];if(conf[b9u]){var I9A=f4b;I9A+=u$S;var rendered=container[Q7_](I9A)[C0K]();if(val[p2U]){var U2P=Y5h;U2P+=X47;U2P+=j1i;var h2j=y4k;h2j+=t4M;h2j+=s0E;var list_1=$(K$X)[h2j](rendered);$[U2P](val,function(i,file){var O8p="\">&times;<";var r4x="/button>";var f_J=" <button ";var G4o="<l";var P$d=' remove" data-idx="';var K8z="</l";var m$u="i>";var J7X=K8z;J7X+=m$u;var L3o=O8p;L3o+=r4x;var Y87=q33;Y87+=n1x;g1X.g2m();Y87+=k9m;Y87+=q6U;var b42=f9t;b42+=g69;var V84=f_J;V84+=p9p;V84+=t_X;var Z2z=e9o;Z2z+=P48;Z2z+=E70;var r9w=G4o;r9w+=m$u;var s4F=y4k;s4F+=t4M;s4F+=Z9U;list_1[s4F](r9w + conf[Z2z](file,i) + V84 + that[D5Z][b42][Y87] + P$d + i + L3o + J7X);});}else {var i0M=U$F;i0M+=T9r;var I2S=l1p;I2S+=W_c;I2S+=P48;var A$N=Z7q;A$N+=r1f;A$N+=K$x;rendered[k8x](k1H + (conf[A$N] || I2S) + i0M);}}uploadMany[U8p](conf);conf[w67][Q7_](K9Z)[J4Y](f_D,[conf[r9G]]);}});var datatable=$[Q05](w0_,{},baseFieldType,{_addOptions:function(conf,options,append){if(append === void x9R){append=P3U;}var dt=conf[E1K];if(!append){dt[f$O]();}dt[M9E][Q6J](options)[D3L]();},_jumpToFirst:function(conf){var r2r='applied';var l_t="page";var C_g="flo";var w$f="nu";g1X.h9F();var F$1="mb";var T2f=f4b;T2f+=I5o;T2f+=T7p;var W30=w$f;W30+=F$1;W30+=w9V;var W_y=f4b;W_y+=K$x;var idx=conf[W_y][P_k]({order:r2r,selected:w0_})[b68]();var page=x9R;if(typeof idx === W30){var Z_g=C_g;Z_g+=i5x;var pageLen=conf[E1K][l_t][l31]()[p2U];var pos=conf[E1K][M9E]({order:r2r})[H2E]()[x2T](idx);page=pageLen > x9R?Math[Z_g](pos / pageLen):x9R;}conf[E1K][l_t](page)[T2f](P3U);},create:function(conf){var G1W='init.dt';var u9k='<table>';var h4z="ir";var g1V='fiBtp';var Y9l="sPa";var w0M="tableClass";var m2h="Pair";var i1T='Search';var Z6U='single';var i5f="ooter";var x8P="L";var n99='<tr>';var S9W="<tfoot";var e0y="user-s";var p7Z="%";var b2V="onfig";var E66='<div class="DTE_Field_Type_datatable_info">';var B4o=w1$;B4o+=Z2E;var H2D=f4b;H2D+=K$x;var Y7S=p59;Y7S+=g$C;var I_s=e0y;I_s+=J7P;I_s+=A5M;I_s+=k6_;var q89=k9m;q89+=q6U;var H4Y=X47;H4Y+=b2V;var U5G=x8P;U5G+=y4k;U5G+=Z4A;g1X.h9F();var K2D=L_o;K2D+=Y9l;K2D+=h4z;var Z7z=s6V;Z7z+=A7c;Z7z+=m4s;Z7z+=Y0O;var a5K=k9m;a5K+=q6U;var c7k=G92;c7k+=H6A;c7k+=H6A;c7k+=p7Z;var i3K=C6M;i3K+=i5f;var Y08=y4k;Y08+=U3G;Y08+=U3G;Y08+=Z9U;var Q4f=Q4P;Q4f+=W08;Q4f+=M3t;var u6q=K9A;u6q+=y4k;u6q+=A5M;u6q+=v2c;var o$M=O$K;o$M+=z6i;o$M+=J7P;o$M+=A5M;var V7J=C6x;V7J+=Z9U;var z8u=L_o;z8u+=P48;z8u+=m2h;var _this=this;conf[z8u]=$[V7J]({label:o$M,value:u6q},conf[M9W]);var table=$(u9k);var container=$(Q4f)[Y08](table);var side=$(E66);if(conf[i3K]){var m_v=k8x;m_v+=P1b;var K2d=V7p;K2d+=e7E;var x6F=y4k;x6F+=U3G;x6F+=m8F;x6F+=a07;var K8A=S9W;K8A+=I9l;$(K8A)[x6F](Array[K2d](conf[g9P])?$(n99)[k8x]($[C5E](conf[g9P],function(str){var P6Y="<th";var G_5=j1i;G_5+=K$x;G_5+=u9C;G_5+=A5M;var L9n=P6Y;L9n+=I9l;return $(L9n)[G_5](str);})):conf[g9P])[m_v](table);}var dt=table[I30](datatable[w0M])[u9M](c7k)[a5K](G1W,function(e,settings){var j0y="iv.dataTables_info";var e8C="iv.dt-b";var v_z='div.dataTables_filter';var V4a=f4b;V4a+=j0y;var i$A=C6M;i$A+=x3d;var o5q=y4k;o5q+=R5e;o5q+=a07;var d$T=f4b;d$T+=e8C;d$T+=C1u;d$T+=O63;var Z4$=C6M;Z4$+=W08;Z4$+=q6U;Z4$+=f4b;var I4I=y4k;I4I+=R5e;I4I+=q6U;I4I+=f4b;var X0L=C6M;X0L+=W08;X0L+=q6U;X0L+=f4b;var k7C=f5q;k7C+=T8c;var l8G=P48;l8G+=c_0;l8G+=J7P;l8G+=D7i;var c9n=K$x;c9n+=y4k;c9n+=V6m;c9n+=J7P;var api=new DataTable$2[B_H](settings);var containerNode=$(api[c9n](undefined)[O1$]());DataTable$2[l8G][b1k](api);side[k7C](containerNode[X0L](v_z))[I4I](containerNode[Z4$](d$T))[o5q](containerNode[i$A](V4a));})[Z7z]($[W6E]({buttons:[],columns:[{data:conf[K2D][i30],title:U5G}],deferRender:w0_,dom:g1V,language:{paginate:{next:c69,previous:T54},search:x8n,searchPlaceholder:i1T},lengthChange:P3U,select:{style:conf[u2O]?z4Q:Z6U}},conf[H4Y]));this[j_R](G25,function(){var W_k="rch";var Q_j="lum";var P39="search";var S6e="adjust";g1X.h9F();var A_$="sea";var a7Q=X47;a7Q+=k9m;a7Q+=Q_j;a7Q+=e7H;if(dt[P39]()){var W9L=f4b;W9L+=Y$e;W9L+=y4k;W9L+=T7p;var s2j=A_$;s2j+=W_k;dt[s2j](x8n)[W9L]();}dt[a7Q][S6e]();});dt[q89](I_s,function(){var b7m="tabl";var f34="aine";var C7Y=Y1I;C7Y+=u$U;C7Y+=f34;C7Y+=Y$e;var E7M=b7m;g1X.h9F();E7M+=J7P;_triggerChange($(conf[E1K][E7M]()[C7Y]()));});if(conf[Y7S]){var q2v=E3q;q2v+=A5M;q2v+=J7P;conf[f6r][q2v](dt);conf[f6r][j_R](f$q,function(e,json,data,action){var e8H="_jumpToFirst";var i1w='refresh';var c3R=x0A;c3R+=r8R;var V0f=J7P;V0f+=f4b;V0f+=e1Z;if(action === a77){var W8S=f4b;W8S+=y4k;W8S+=K$x;W8S+=y4k;var _loop_1=function(dp){var k4C="elect";var F6i=P48;F6i+=k4C;var H2Z=W4S;H2Z+=T7p;H2Z+=P48;dt[H2Z](function(idx,d){return d === dp;})[F6i]();};for(var _i=x9R,_a=json[W8S];_i < _a[p2U];_i++){var dp=_a[_i];_loop_1(dp);}}else if(action === V0f || action === c3R){_this[e4j](i1w);}datatable[e8H](conf);});}conf[H2D]=dt;datatable[y_M](conf,conf[B4o] || []);return {input:container,side:side};},disable:function(conf){var O6x=e9o;O6x+=S$h;var N0u=j7e;N0u+=P48;var H2q=y4k;H2q+=U3G;H2q+=W08;conf[E1K][L_b][r08](H2q);conf[E1K][x0X]()[O1$]()[N0u](O6x,Q4c);},dt:function(conf){g1X.g2m();return conf[E1K];},enable:function(conf){var N3t="yle";var i6A=X47;i6A+=P48;i6A+=P48;var q$y=i7J;q$y+=W_c;var m0l=C6g;m0l+=N3t;var d8M=f4b;d8M+=K$x;conf[d8M][L_b][m0l](conf[u2O]?z4Q:q$y);conf[E1K][x0X]()[O1$]()[i6A](y99,q3u);},get:function(conf){var b$n="separ";var P6M="separa";var o8c="toA";var G4c="pluck";var Z_9=P6M;Z_9+=g$C;var t51=b$n;t51+=G1T;var O47=o8c;O47+=T$M;O47+=a_i;var rows=conf[E1K][M9E]({selected:w0_})[y34]()[G4c](conf[M9W][E3b])[O47]();return conf[t51] || !conf[u2O]?rows[y1J](conf[Z_9] || J10):rows;},set:function(conf,val,localUpdate){var Y73="separato";var e39="ToFirst";var z1j="_jump";var D80="deselect";var c1s="str";var Y4o=z1j;Y4o+=e39;var M8Y=x_J;M8Y+=A5M;M8Y+=H86;M8Y+=K$x;var h8M=W4S;h8M+=w0T;var H7H=K9A;H7H+=y4k;H7H+=I2A;var o96=f6v;o96+=Y$e;o96+=G1T;if(conf[u2O] && conf[o96] && !Array[T6n](val)){var g82=Y73;g82+=Y$e;var Q1u=P48;Q1u+=U3G;Q1u+=A5M;Q1u+=e1Z;var d61=c1s;d61+=W08;d61+=q6U;d61+=Z71;val=typeof val === d61?val[Q1u](conf[g82]):[];}else if(!Array[T6n](val)){val=[val];}var valueFn=dataGet(conf[M9W][H7H]);conf[E1K][h8M]({selected:w0_})[D80]();conf[E1K][M9E](function(idx,data,node){g1X.h9F();return val[x2T](valueFn(data)) !== -C05;})[M8Y]();datatable[Y4o](conf);if(!localUpdate){var O9I=f4b;O9I+=K$x;_triggerChange($(conf[O9I][o7k]()[O1$]()));}},tableClass:x8n,update:function(conf,options,append){var u1d="_lastSe";var p3Z="pti";var S76=P12;S76+=A7c;S76+=U_d;var B$N=K$x;B$N+=y4k;B$N+=V6m;B$N+=J7P;var m1f=u1d;m1f+=K$x;var Z1F=l3S;g1X.g2m();Z1F+=p3Z;Z1F+=Y2l;datatable[Z1F](conf,options,append);var lastSet=conf[m1f];if(lastSet !== undefined){datatable[P9V](conf,lastSet,w0_);}_triggerChange($(conf[E1K][B$N]()[S76]()));}});var defaults={className:x8n,compare:F7$,data:x8n,def:x8n,entityDecode:w0_,fieldInfo:x8n,getFormatter:F7$,id:x8n,label:x8n,labelInfo:x8n,message:x8n,multiEditable:w0_,name:F7$,nullDefault:P3U,setFormatter:F7$,submit:w0_,type:V_M};var DataTable$1=$[w_B][A$J];var Field=(function(){var j5w="rot";var S8m="ssa";var W9A="inError";var T0n="iId";var W_I="nullDefaul";var j7Z="ototy";var i2f="disable";var A2c="inputControl";var c6C="ho";var K0f="multiInfo";var v9_="ype";var o1q="rototype";var v3u="isMul";var z1b="proto";var B_x="_msg";var u13="_typeFn";var U6j="ototype";var v5o="multiRestore";var A_z="multiInfoShown";var W9X="protot";var N58="rotot";var n5X="blo";var p1b="aye";var k$s="ditable";var N6W="oty";var R$D="_format";var z38="iIds";var P6q="_ty";var L3L="formatters";var V1M="tml";var K8s="multiReturn";var Y2T="ototyp";var u1q="enab";var x9J="toty";var a8P="host";var B7L="compare";var i_U="slideDown";var O9d="_errorNod";var E_U="ubmittab";var i2I="lues";var a0D="slideUp";var w8s="prototyp";var D1Y="fieldInfo";var Z_F="roto";var R2V="typ";var p9z="msg";var x2z="taine";var R7U="labelInfo";var j$u="_multiValueCheck";var F9G="multiE";var H_R="disabl";var k2R="tiV";var C8Y="defaul";var W31=C8Y;W31+=K$x;W31+=P48;var F2W=O9d;F2W+=J7P;var a_c=U3G;a_c+=o1q;var R81=g4U;R81+=n_a;R81+=u6T;var N7$=P48;N7$+=E_U;N7$+=W_c;var C6h=U3G;C6h+=N58;C6h+=a_i;C6h+=m8F;var b3N=U3G;b3N+=Z_F;b3N+=K$x;b3N+=v9_;var F05=R$W;F05+=T0n;F05+=P48;var I8c=Q4J;I8c+=k9m;I8c+=x9J;I8c+=m8F;var x6j=F9G;x6j+=k$s;var N0m=Q4J;N0m+=Y2T;N0m+=J7P;var L7l=G$W;L7l+=m8F;var P0Y=a8O;P0Y+=N6W;P0Y+=m8F;var o63=U3G;o63+=N58;o63+=a_i;o63+=m8F;var j7C=K9A;j7C+=y4k;j7C+=A5M;var U2s=Q4J;U2s+=U6j;var i5J=e_G;i5J+=o3w;i5J+=R01;i5J+=J7P;var F3J=w8s;F3J+=J7P;var w7x=P48;w7x+=j1i;w7x+=k9m;w7x+=T7p;var u1G=w8s;u1G+=J7P;var N0T=P48;N0T+=J7P;N0T+=K$x;var K98=I00;K98+=J5G;var X_2=U3G;X_2+=j5w;X_2+=s6r;X_2+=v9_;var S5Z=W_I;S5Z+=K$x;var V3H=U3G;V3H+=j5w;V3H+=k9m;V3H+=n_a;var e76=q6U;e76+=k9m;e76+=f4b;e76+=J7P;var d5B=R1k;d5B+=B_$;var U7Y=a8O;U7Y+=k9m;U7Y+=K$x;U7Y+=v9_;var f9S=Y6r;f9S+=S8m;f9S+=Q8X;var u92=z1b;u92+=K$x;u92+=v9_;var h3E=Z71;h3E+=J7P;h3E+=K$x;var L$f=R1k;L$f+=B_$;var H93=U3G;H93+=Z_F;H93+=R2V;H93+=J7P;var Q$y=a8O;Q$y+=N6W;Q$y+=m8F;var V4L=v3u;V4L+=k2R;V4L+=k25;var b$2=W9X;b$2+=v9_;var a$X=J7P;a$X+=i3E;a$X+=Y$e;var v6Y=R1k;v6Y+=B_$;var w40=D4c;w40+=Y0O;w40+=f4b;var Y8s=Q4J;Y8s+=k9m;Y8s+=x9J;Y8s+=m8F;var i7_=u1q;i7_+=A5M;i7_+=J7P;var x10=Q4J;x10+=j7Z;x10+=m8F;var E0x=T$f;E0x+=A5M;E0x+=p1b;E0x+=f4b;var L6V=H_R;L6V+=J7P;var y9_=a8O;y9_+=R2u;var n7q=f4b;n7q+=y1n;var p4e=U3G;p4e+=W4S;p4e+=x9J;p4e+=m8F;function Field(options,classes,host){var u2_="dte-e=";var q2b="<div data-";var y0C='" for="';var L6t="Data";var j6q="mData";var r_6='<div data-dte-e="msg-multi" class="';var f7X="tern";var f89="nown field type ";var b6B="Error adding field - unk";var c5M="multiValue";var G6J="-m";var X2L='<div data-dte-e="field-processing" class="';var d3I="class=\"";var l2X="or\" class=\"";var P6R="ta-dte-e=\"msg-message\" cla";var h0h="side";var V5t="\"msg-label\" class";var N1A="v data-dte-e=\"multi-value\" class=\"";var x6L='msg-label';var J9U="<span d";var J4d="ic";var Y$5='msg-message';var V9Q="<div dat";var P5s='<div data-dte-e="msg-info" class="';var u_s="essa";var q4u="trol";var X3B='msg-info';var v3o='<div data-dte-e="input-control" class="';var H3H="lI18n";var G7M='<div data-dte-e="input" class="';var z_F='msg-error';var Z9f='<label data-dte-e="label" class="';var g7G='field-processing';var O3H="lFr";var b9o="spla";var K5U="restore";var Z8N="TE_F";var M6n="ePrefi";var y2X="v class=\"";var K1n="saf";var f2M="ata-dte-e=\"multi-info\" ";var v7k="lab";var o6S="msg-i";var m8b="typePrefix";var Y4e='input-control';var d_U="roces";var B$v="a-dte-e=\"msg-err";var Q$$="ti-va";var S62="nam";var s7n="-con";var K_V='msg-multi';var W_O="ldTypes";var f7p=K$x;f7p+=a_i;f7p+=m8F;var g8R=j1d;g8R+=u9C;var O8Q=X47;O8Q+=A5M;O8Q+=J4d;O8Q+=l$2;var E0L=k9m;E0L+=q6U;var R8K=S4m;R8K+=K$x;R8K+=W08;var C6V=d6U;C6V+=A5M;C6V+=Q$$;C6V+=I2A;var d0y=v7k;d0y+=c_0;var V$J=o6S;V$J+=G3V;var Y1l=J3A;Y1l+=I3U;var u3D=g4U;u3D+=K$x;u3D+=a_i;u3D+=j48;var I9g=U3G;I9g+=d_U;I9g+=P48;I9g+=J5G;var t$j=X9B;t$j+=W08;t$j+=M3t;var l7U=u9C;l7U+=D99;l7U+=w7g;var N1t=y$Z;N1t+=I9l;var Q6O=p9z;Q6O+=G6J;Q6O+=u_s;Q6O+=Q8X;var u7v=B6y;u7v+=P6R;u7v+=t_X;var k9k=y$Z;k9k+=r2S;var b8F=V9Q;b8F+=B$v;b8F+=l2X;var V7M=J_p;V7M+=f4b;V7M+=W08;V7M+=M3t;var q1s=y$Z;q1s+=I9l;var g6k=S4m;g6k+=G4C;var o4d=J9U;o4d+=f2M;o4d+=d3I;var h2g=K$x;h2g+=m4P;var x$j=y$Z;x$j+=I9l;var t0j=d66;t0j+=N1A;var X4Q=W08;X4Q+=q6U;X4Q+=U3G;X4Q+=C1u;var A_V=y$Z;A_V+=I9l;var n1z=q2b;n1z+=u2_;n1z+=V5t;n1z+=f7L;var o08=O$K;o08+=z6i;o08+=J7P;o08+=A5M;var v$6=y$Z;v$6+=I9l;var I9N=K1n;I9N+=S7a;I9N+=f4b;var A4f=v7k;A4f+=c_0;var a7I=y$Z;a7I+=I9l;var g7E=M31;g7E+=G3Q;g7E+=J7P;var S_a=q6U;S_a+=y4k;S_a+=Y6r;var L4h=S62;L4h+=M6n;L4h+=W4t;var n5S=d66;n5S+=y2X;var L4w=K9A;L4w+=c2r;L4w+=P1b;L4w+=L6t;var B7p=e7g;B7p+=O3H;B7p+=k9m;B7p+=j6q;var d_O=a1s;d_O+=y4k;var r5x=W08;r5x+=f4b;var a2M=K$x;a2M+=v9_;var I6X=C6M;I6X+=G$h;I6X+=W_O;var X8W=q6U;X8W+=W0a;X8W+=J7P;var H1R=J7P;H1R+=h3O;H1R+=D4c;H1R+=f4b;var i2m=u9C;i2m+=o3$;i2m+=K$x;i2m+=W08;var q4R=B2L;q4R+=f7X;q4R+=y4k;q4R+=H3H;var that=this;var multiI18n=host[q4R]()[i2m];var opts=$[H1R](w0_,{},Field[X5t],options);if(!Editor[K1e][opts[n_a]]){var p0i=R2V;p0i+=J7P;var G7j=b6B;G7j+=f89;throw new Error(G7j + opts[p0i]);}this[P48]={classes:classes,host:host,multiIds:[],multiValue:P3U,multiValues:{},name:opts[X8W],opts:opts,processing:P3U,type:Editor[I6X][opts[a2M]]};if(!opts[r5x]){var N3G=k_9;N3G+=Z8N;N3G+=m3E;N3G+=g4U;var M8t=W08;M8t+=f4b;opts[M8t]=N3G + opts[t$2];}if(opts[d_O] === x8n){opts[y34]=opts[t$2];}this[B7p]=function(d){var z9N=J7P;z9N+=J$O;var U_a=f4b;U_a+=y4k;U_a+=K$x;U_a+=y4k;return dataGet(opts[U_a])(d,z9N);};this[L4w]=dataSet(opts[y34]);var template=$(n5S + classes[M70] + V8D + classes[m8b] + opts[n_a] + V8D + classes[L4h] + opts[S_a] + V8D + opts[g7E] + a7I + Z9f + classes[A4f] + y0C + Editor[I9N](opts[d4U]) + v$6 + opts[o08] + n1z + classes[x6L] + A_V + opts[R7U] + z6g + w6A + G7M + classes[X4Q] + v2p + v3o + classes[A2c] + E3L + t0j + classes[c5M] + x$j + multiI18n[h2g] + o4d + classes[g6k] + q1s + multiI18n[l31] + t6N + V7M + r_6 + classes[v5o] + v2p + multiI18n[K5U] + z6g + b8F + classes[z_F] + k9k + u7v + classes[Q6O] + N1t + opts[l7U] + z6g + P5s + classes[X3B] + v2p + opts[D1Y] + z6g + t$j + X2L + classes[I9g] + J6R + z6g);var input=this[u3D](Y1l,opts);var side=F7$;if(input && input[h0h]){side=input[h0h];input=input[Y0R];}if(input !== F7$){var p2G=W08;p2G+=A9d;p2G+=s7n;p2G+=q4u;el(p2G,template)[T7N](input);}else {var Y8E=e9o;Y8E+=b9o;Y8E+=a_i;var y2Y=X47;y2Y+=P48;y2Y+=P48;template[y2Y](Y8E,Q4c);}this[s9H]={container:template,fieldError:el(z_F,template),fieldInfo:el(V$J,template),fieldMessage:el(Y$5,template),inputControl:el(Y4e,template),label:el(d0y,template)[k8x](side),labelInfo:el(x6L,template),multi:el(C6V,template),multiInfo:el(P5x,template),multiReturn:el(K_V,template),processing:el(g7G,template)};this[s9H][R8K][E0L](O8Q,function(){var I9a="multiEditable";g1X.h9F();var U5T=d4a;U5T+=U3G;U5T+=J7P;var K5h=D$k;K5h+=y4k;K5h+=V6m;K5h+=M_v;var I5n=k9m;I5n+=l8d;I5n+=P48;if(that[P48][I5n][I9a] && !template[M6P](classes[K5h]) && opts[U5T] !== H$c){that[t0E](x8n);that[V0_]();}});this[g8R][K8s][j_R](I8G,function(){var M$z="ultiR";var E8S="estor";var i8F=u9C;i8F+=M$z;i8F+=E8S;i8F+=J7P;that[i8F]();});$[h3P](this[P48][f7p],function(name,fn){if(typeof fn === f2m && that[name] === undefined){that[name]=function(){var M2g=y4k;M2g+=U3G;M2g+=H2f;M2g+=a_i;var f79=g4U;f79+=d4a;f79+=j48;var O4g=X47;O4g+=y4k;O4g+=U_m;var L7F=U3G;L7F+=W4S;L7F+=B_$;var args=Array[L7F][P4$][O4g](arguments);args[H8W](name);var ret=that[f79][M2g](that,args);return ret === undefined?that:ret;};}});}Field[p4e][n7q]=function(set){var E6W='default';var f8Z="faul";var Z8q=f4b;Z8q+=J7P;g1X.h9F();Z8q+=C6M;var opts=this[P48][Z1T];if(set === undefined){var h_2=v7w;h_2+=X47;h_2+=K$x;h_2+=n0H;var v$a=u2Y;v$a+=C6M;var c9E=f4b;c9E+=J7P;c9E+=f8Z;c9E+=K$x;var def=opts[E6W] !== undefined?opts[c9E]:opts[v$a];return typeof def === h_2?def():def;}opts[Z8q]=set;return this;};Field[y9_][L6V]=function(){var N9X="dCla";var D2y="cont";var b$N=f4b;g1X.h9F();b$N+=W08;b$N+=P48;b$N+=Y0O;var g7u=P6q;g7u+=j48;var d0X=i2f;d0X+=f4b;var v48=M31;v48+=J7P;v48+=P48;var M9x=K6g;M9x+=N9X;M9x+=d1M;var A96=D2y;A96+=x2I;A96+=Z3X;A96+=Y$e;this[s9H][A96][M9x](this[P48][v48][d0X]);this[g7u](b$N);return this;};Field[N9d][E0x]=function(){var u8E="ents";var V$l=e9o;V$l+=f$$;V$l+=A5M;V$l+=u4G;var h6o=U$f;h6o+=j1i;var M4N=L_f;M4N+=Y$e;M4N+=u8E;var o0J=P12;o0J+=x2z;o0J+=Y$e;var container=this[s9H][o0J];return container[M4N](Y9i)[h6o] && container[j2h](V$l) !== Q4c?w0_:P3U;};Field[x10][i7_]=function(toggle){var S9Q="conta";var l5L="remo";var m4G="eFn";var x4t="veClass";var H5C="ses";var Z8E='enable';var X73=g4U;X73+=R2V;X73+=m4G;var M6F=X47;M6F+=O$K;M6F+=P48;M6F+=H5C;var k7P=l5L;k7P+=x4t;g1X.g2m();var T7r=S9Q;T7r+=Z1A;T7r+=Y$e;if(toggle === void x9R){toggle=w0_;}if(toggle === P3U){return this[i2f]();}this[s9H][T7r][k7P](this[P48][M6F][O$u]);this[X73](Z8E);return this;};Field[Y8s][w40]=function(){var I_N="asClas";var W0z="ontainer";var l6L=i2f;l6L+=f4b;var k5K=j1i;k5K+=I_N;k5K+=P48;g1X.h9F();var Z7P=X47;Z7P+=W0z;var h1c=f4b;h1c+=Q2Y;return this[h1c][Z7P][k5K](this[P48][D5Z][l6L]) === P3U;};Field[v6Y][a$X]=function(msg,fn){var V8X="containe";var Z45="ssage";var W7M="Me";var l33="erro";var d4Z="_m";var b9h="fieldError";var T$u="sg";var g4z="as";var G_k=f4b;G_k+=Q2Y;var T05=d4Z;T05+=T$u;var q$L=F3P;q$L+=W7M;q$L+=Z45;var q6A=X47;q6A+=A5M;q6A+=g1E;var classes=this[P48][q6A];if(msg){var Q4w=V8X;Q4w+=Y$e;var R0a=j1d;R0a+=u9C;this[R0a][Q4w][I30](classes[F3P]);}else {var Y7H=l33;Y7H+=Y$e;var m3f=i9G;m3f+=A5M;m3f+=g4z;m3f+=P48;this[s9H][O1$][m3f](classes[Y7H]);}this[u13](q$L,msg);return this[T05](this[G_k][b9h],msg,fn);};Field[N9d][D1Y]=function(msg){var v5K=f4b;g1X.g2m();v5K+=k9m;v5K+=u9C;return this[B_x](this[v5K][D1Y],msg);};Field[b$2][V4L]=function(){var O_A="ultiV";var U5i=S4m;U5i+=K$x;U5i+=z38;var e4a=u9C;e4a+=O_A;e4a+=c2r;e4a+=v2c;return this[P48][e4a] && this[P48][U5i][p2U] !== C05;};Field[N9d][W9A]=function(){g1X.h9F();var L9D=j1d;L9D+=u9C;return this[L9D][O1$][M6P](this[P48][D5Z][F3P]);};Field[Q$y][Y0R]=function(){g1X.h9F();var m5$='input, select, textarea';var K_G=X47;K_G+=j_R;K_G+=x2z;K_G+=Y$e;return this[P48][n_a][Y0R]?this[u13](F76):$(m5$,this[s9H][K_G]);};Field[H93][V0_]=function(){var t2o="input, ";var d3x="select, textarea";if(this[P48][n_a][V0_]){this[u13](m6i);}else {var I1$=u_K;I1$+=P48;var k4N=f4b;k4N+=k9m;k4N+=u9C;var D0d=t2o;D0d+=d3x;$(D0d,this[k4N][O1$])[I1$]();}return this;};Field[L$f][h3E]=function(){var D7$="tiValue";var W15="getFormatter";var t1b=C9_;t1b+=P48;var r11=Z71;r11+=t0I;var V5V=v3u;V5V+=D7$;if(this[V5V]()){return undefined;}return this[R$D](this[u13](r11),this[P48][t1b][W15]);};Field[u92][U2S]=function(animate){var t2R="slid";var l_N="Up";var J1C=C6M;J1C+=q6U;var w_8=j1i;w_8+=k9m;w_8+=P48;w_8+=K$x;var U3H=f4b;U3H+=k9m;U3H+=u9C;var el=this[U3H][O1$];if(animate === undefined){animate=w0_;}if(this[P48][w_8][b9u]() && animate && $[J1C][a0D]){var q7d=t2R;q7d+=J7P;q7d+=l_N;el[q7d]();}else {var X_p=e9o;X_p+=f$$;X_p+=O$K;X_p+=a_i;var q2Z=X47;q2Z+=P48;q2Z+=P48;el[q2Z](X_p,Q4c);}return this;};Field[N9d][i30]=function(str){var J74="labe";var m4q="lInfo";var l9_=y4k;l9_+=U3G;l9_+=m8F;l9_+=a07;var k65=j1i;k65+=V1M;var g__=e7j;g__+=i6p;g__+=j1i;var C7S=J74;C7S+=m4q;var D2F=f4b;D2F+=Q2Y;var C7r=A5M;C7r+=S8G;C7r+=J7P;C7r+=A5M;var label=this[s9H][C7r];var labelInfo=this[D2F][C7S][g__]();if(str === undefined){var O_X=T$0;O_X+=A5M;return label[O_X]();}label[k65](str);label[l9_](labelInfo);return this;};Field[N9d][R7U]=function(msg){var T6k="ms";var W$x="abelI";var r01=A5M;r01+=W$x;r01+=G3V;var Y31=g4U;Y31+=T6k;Y31+=Z71;g1X.h9F();return this[Y31](this[s9H][r01],msg);};Field[N9d][f9S]=function(msg,fn){g1X.g2m();var i3d="fieldMessage";var Z0N=j1d;Z0N+=u9C;var K7q=g4U;K7q+=p9z;return this[K7q](this[Z0N][i3d],msg,fn);};Field[U7Y][p5X]=function(id){var C9S="tiVa";var F$5="MultiValue";var y6A=X4s;y6A+=F$5;var X8S=R$W;X8S+=z38;var C$l=d6U;C$l+=A5M;g1X.g2m();C$l+=C9S;C$l+=i2I;var value;var multiValues=this[P48][C$l];var multiIds=this[P48][X8S];var isMultiValue=this[y6A]();if(id === undefined){var V4W=A5M;V4W+=i7U;var T93=K9A;T93+=y4k;T93+=A5M;var fieldVal=this[T93]();value={};for(var _i=x9R,multiIds_1=multiIds;_i < multiIds_1[V4W];_i++){var multiId=multiIds_1[_i];value[multiId]=isMultiValue?multiValues[multiId]:fieldVal;}}else if(isMultiValue){value=multiValues[id];}else {value=this[t0E]();}return value;};Field[N9d][v5o]=function(){var E$n="V";var r54=S4m;r54+=N4r;g1X.g2m();r54+=E$n;r54+=k25;this[P48][r54]=w0_;this[j$u]();};Field[N9d][t1r]=function(id,val,recalc){var U1d="ltiIds";var g7M="Va";g1X.h9F();var S44="iV";var m7i=R$W;m7i+=S44;m7i+=k25;var L85=d6U;L85+=U1d;var U77=R$W;U77+=W08;U77+=g7M;U77+=i2I;if(recalc === void x9R){recalc=w0_;}var that=this;var multiValues=this[P48][U77];var multiIds=this[P48][L85];if(val === undefined){val=id;id=undefined;}var set=function(idSrc,valIn){var O5x="tter";var R$u="_fo";var j81="setForm";var V4P=j81;V4P+=y4k;V4P+=O5x;var S75=R$u;S75+=w0b;var y2N=a1x;y2N+=T$M;y2N+=a_i;if($[y2N](idSrc,multiIds) === -C05){var B5A=U3G;B5A+=e_G;B5A+=P48;B5A+=j1i;multiIds[B5A](idSrc);}multiValues[idSrc]=that[S75](valIn,that[P48][Z1T][V4P]);};if($[o8q](val) && id === undefined){var a7P=Y5h;a7P+=R0n;$[a7P](val,function(idSrc,innerVal){set(idSrc,innerVal);});}else if(id === undefined){$[h3P](multiIds,function(i,idSrc){set(idSrc,val);});}else {set(id,val);}this[P48][m7i]=w0_;if(recalc){this[j$u]();}return this;};Field[d5B][t$2]=function(){var Q56=k9m;Q56+=U3G;Q56+=K$x;Q56+=P48;return this[P48][Q56][t$2];};g1X.g2m();Field[N9d][e76]=function(){g1X.g2m();var b9i=P12;b9i+=A7c;b9i+=W08;b9i+=g5s;return this[s9H][b9i][x9R];};Field[V3H][S5Z]=function(){var r8_="nullDefault";var F5t=w1$;g1X.g2m();F5t+=y0y;return this[P48][F5t][r8_];};Field[X_2][K98]=function(set){var A1J='processing-field';var X_3="internalEvent";var n6k="essi";g1X.h9F();var n4d=n5X;n4d+=g29;var m97=f4b;m97+=k9m;m97+=u9C;if(set === undefined){var A19=R1k;A19+=X47;A19+=n6k;A19+=m5E;return this[P48][A19];}this[m97][M2v][j2h](y99,set?n4d:Q4c);this[P48][M2v]=set;this[P48][a8P][X_3](A1J,[set]);return this;};Field[N9d][N0T]=function(val,multiCheck){var u$u="pts";var h6V="iVal";var h88='set';var M7s="Fo";var V0k="_typeF";var z_n="entityDecode";var k2$="rmatter";var R1O=k9m;R1O+=u$u;var t5f=d6U;t5f+=x2Y;t5f+=h6V;t5f+=v2c;if(multiCheck === void x9R){multiCheck=w0_;}var decodeFn=function(d){var O1P="plac";var X4m="eplace";g1X.h9F();var j37='£';var G1D='\n';var X0Y='\'';var W$1='"';var Y5c="lace";var t5P=n0g;t5P+=Y5c;var O2b=A5l;O2b+=V1c;var k0u=Y$e;k0u+=X4m;var R0M=A5l;R0M+=V1c;var K19=Y$e;K19+=J7P;K19+=O1P;K19+=J7P;var c74=Y$e;c74+=X4m;var o60=C6g;o60+=H0s;o60+=Z71;return typeof d !== o60?d:d[c74](/&gt;/g,c69)[K19](/&lt;/g,T54)[R0M](/&amp;/g,l14)[k0u](/&quot;/g,W$1)[O2b](/&#163;/g,j37)[q9A](/&#39;/g,X0Y)[t5P](/&#10;/g,G1D);};this[P48][t5f]=P3U;var decode=this[P48][R1O][z_n];if(decode === undefined || decode === w0_){if(Array[T6n](val)){var t4I=T06;t4I+=K$x;t4I+=j1i;for(var i=x9R,ien=val[t4I];i < ien;i++){val[i]=decodeFn(val[i]);}}else {val=decodeFn(val);}}if(multiCheck === w0_){var n43=V0k;n43+=q6U;var W02=P9V;W02+=M7s;W02+=k2$;var d4r=k9m;d4r+=l8d;d4r+=P48;var S$x=g4U;S$x+=C6M;S$x+=k9m;S$x+=w0b;val=this[S$x](val,this[P48][d4r][W02]);this[n43](h88,val);this[j$u]();}else {var h0g=P48;h0g+=J7P;h0g+=K$x;this[u13](h0g,val);}return this;};Field[u1G][w7x]=function(animate,toggle){var a2D="ontai";var O2r=C6M;O2r+=q6U;var K36=f4b;K36+=K1K;K36+=A5M;K36+=u4G;var X5b=j1i;X5b+=k9m;X5b+=C6g;var x3D=X47;x3D+=a2D;x3D+=Z3X;x3D+=Y$e;var s5M=f4b;s5M+=k9m;s5M+=u9C;if(animate === void x9R){animate=w0_;}if(toggle === void x9R){toggle=w0_;}if(toggle === P3U){return this[U2S](animate);}var el=this[s5M][x3D];g1X.g2m();if(this[P48][X5b][K36]() && animate && $[O2r][i_U]){el[i_U]();}else {el[j2h](y99,x8n);;}return this;};Field[F3J][i5J]=function(options,append){var s0c=K$x;s0c+=a_i;s0c+=U3G;s0c+=J7P;g1X.g2m();if(append === void x9R){append=P3U;}if(this[P48][s0c][K44]){this[u13](A4a,options,append);}return this;};Field[U2s][j7C]=function(val){g1X.g2m();return val === undefined?this[B3M]():this[P9V](val);};Field[o63][B7L]=function(value,original){var a2_=k9m;a2_+=U3G;g1X.g2m();a2_+=y0y;var compare=this[P48][a2_][B7L] || deepCompare;return compare(value,original);};Field[P0Y][W65]=function(){var H_x=f4b;H_x+=R01;H_x+=y4k;g1X.h9F();return this[P48][Z1T][H_x];};Field[L7l][x4X]=function(){var q9u='destroy';var h31="peF";var f4R=P6q;f4R+=h31;f4R+=q6U;var X0u=A5l;X0u+=z60;var u1g=f4b;u1g+=k9m;g1X.g2m();u1g+=u9C;this[u1g][O1$][X0u]();this[f4R](q9u);return this;};Field[N0m][x6j]=function(){var h0j="multiEdi";g1X.h9F();var D1m=h0j;D1m+=K$x;D1m+=Y0O;return this[P48][Z1T][D1m];};Field[I8c][F05]=function(){g1X.h9F();return this[P48][E24];};Field[b3N][A_z]=function(show){var X_A=f4b;X_A+=Q2Y;g1X.g2m();this[X_A][K0f][j2h]({display:show?q3u:Q4c});};Field[C6h][J$c]=function(){var T$i="multiValues";var O1w="Ids";var l$t=u9C;l$t+=B5h;l$t+=W08;l$t+=O1w;g1X.h9F();this[P48][l$t]=[];this[P48][T$i]={};};Field[N9d][N7$]=function(){var F4W="bm";var l75=K3A;l75+=F4W;l75+=e1Z;return this[P48][Z1T][l75];};Field[N9d][B_x]=function(el,msg,fn){var s3p="internalSettin";var r3h="parent";if(msg === undefined){return el[K0h]();}if(typeof msg === f2m){var f4r=A7c;f4r+=V6m;f4r+=J7P;var L9J=s3p;L9J+=H9U;var w9b=z5l;w9b+=U3G;w9b+=W08;var w6u=c6C;w6u+=C6g;var editor=this[P48][w6u];msg=msg(editor,new DataTable$1[w9b](editor[L9J]()[f4r]));}if(el[r3h]()[X4s](V5x) && $[w_B][D77]){var v4O=j1i;v4O+=V1M;el[v4O](msg);if(msg){el[i_U](fn);;}else {el[a0D](fn);}}else {var N_5=x6o;N_5+=y4k;N_5+=a_i;el[K0h](msg || x8n)[j2h](N_5,msg?q3u:Q4c);if(fn){fn();}}return this;};Field[N9d][j$u]=function(){var g3F="iVa";var d0S="internal";var L24="Values";var c9x="MultiInf";var i5a="Value";var R6t="tiE";var H0W="lti";var a96="internalI18";var y8V="Multi";var f31="ltiNoEdit";var I_K=d0S;I_K+=c9x;g1X.h9F();I_K+=k9m;var S47=d6U;S47+=f31;var v0Q=X5j;v0Q+=P48;v0Q+=J7P;v0Q+=P48;var u4J=m4E;u4J+=y8V;var e2m=u9C;e2m+=e_G;e2m+=H0W;var c5Y=a96;c5Y+=q6U;var O5d=c6C;O5d+=P48;O5d+=K$x;var W7S=q6U;W7S+=k9m;W7S+=q6U;W7S+=J7P;var F3V=X47;F3V+=P48;F3V+=P48;var N$_=f4b;N$_+=k9m;N$_+=u9C;var x1y=d5l;x1y+=B5h;x1y+=g3F;x1y+=I2A;var q7H=S4m;q7H+=R6t;q7H+=d7k;q7H+=Y0O;var o9E=w1$;o9E+=y0y;var o8p=d6U;o8p+=H0W;o8p+=i5a;var j2O=u9C;j2O+=o3$;j2O+=N4r;j2O+=L24;var last;var ids=this[P48][E24];var values=this[P48][j2O];var isMultiValue=this[P48][o8p];var isMultiEditable=this[P48][o9E][q7H];var val;var different=P3U;if(ids){for(var i=x9R;i < ids[p2U];i++){val=values[ids[i]];if(i > x9R && !deepCompare(val,last)){different=w0_;break;}last=val;}}if(different && isMultiValue || !isMultiEditable && this[x1y]()){var Z5H=n5X;Z5H+=g29;var r_x=X47;r_x+=P48;r_x+=P48;var V2s=u9C;V2s+=B5h;V2s+=W08;var c3T=X47;c3T+=d1M;this[s9H][A2c][c3T]({display:Q4c});this[s9H][V2s][r_x]({display:Z5H});}else {var m7C=X47;m7C+=P48;m7C+=P48;var j97=f4b;j97+=k9m;j97+=u9C;var k9I=V6m;k9I+=y5C;k9I+=l$2;var O06=X47;O06+=P48;O06+=P48;this[s9H][A2c][O06]({display:k9I});this[j97][i6O][m7C]({display:Q4c});if(isMultiValue && !different){var p61=x_J;p61+=K$x;this[p61](last,P3U);}}this[N$_][K8s][F3V]({display:ids && ids[p2U] > C05 && different && !isMultiValue?q3u:W7S});var i18n=this[P48][O5d][c5Y]()[e2m];this[s9H][K0f][K0h](isMultiEditable?i18n[l31]:i18n[u4J]);this[s9H][i6O][t0m](this[P48][v0Q][S47],!isMultiEditable);this[P48][a8P][I_K]();return w0_;};Field[N9d][R81]=function(name){var F8r=m2l;F8r+=b7B;F8r+=K$x;var h$h=A5M;h$h+=J7P;h$h+=q6U;h$h+=f3U;var args=[];for(var _i=C05;_i < arguments[h$h];_i++){args[_i - C05]=arguments[_i];}args[F8r](this[P48][Z1T]);var fn=this[P48][n_a][name];if(fn){return fn[R$p](this[P48][a8P],args);}};Field[a_c][F2W]=function(){g1X.g2m();var v1D=q2r;v1D+=K8D;return this[s9H][v1D];};Field[N9d][R$D]=function(val,formatter){var a6M="ers";var I3C="ift";g1X.g2m();if(formatter){var P$l=c6C;P$l+=C6g;var j_$=Y60;j_$+=a_i;if(Array[j_$](formatter)){var K6B=p2d;K6B+=y4k;K6B+=n1x;K6B+=a6M;var y4i=P48;y4i+=j1i;y4i+=I3C;var args=formatter[P4$]();var name_1=args[y4i]();formatter=Field[K6B][name_1][R$p](this,args);}return formatter[B9N](this[P48][P$l],val,this);}return val;};Field[W31]=defaults;Field[L3L]={};return Field;})();var button={action:F7$,className:F7$,tabIndex:x9R,text:F7$};var displayController={close:function(){},init:function(){},node:function(){},open:function(){}};var DataTable=$[Q9T][U7t];var apiRegister=DataTable[t8c][q1J];function _getInst(api){var s22="Init";var I5k="context";var b0x=g4U;b0x+=F2v;b0x+=i5x;var a4k=k9m;a4k+=s22;g1X.g2m();var ctx=api[I5k][x9R];return ctx[a4k][f6r] || ctx[b0x];}function _setBasic(inst,opts,type,plural){var s$X="_ba";var q64="utt";var T$d=/%d/;var q2H="nfirm";var V_k=K$x;V_k+=W08;V_k+=K$x;g1X.h9F();V_k+=W_c;var T4A=U67;T4A+=O63;if(!opts){opts={};}if(opts[T4A] === undefined){var z3P=s$X;z3P+=p1n;var Q5t=z6i;Q5t+=q64;Q5t+=j_R;Q5t+=P48;opts[Q5t]=z3P;}if(opts[V_k] === undefined){var j4t=o_z;j4t+=q6U;opts[O$b]=inst[j4t][type][O$b];}if(opts[q8B] === undefined){var Q6K=A5l;Q6K+=u9C;Q6K+=u$p;Q6K+=J7P;if(type === Q6K){var T_H=Y1I;T_H+=q2H;var D68=o_z;D68+=q6U;var confirm_1=inst[D68][type][T_H];opts[q8B]=plural !== C05?confirm_1[g4U][q9A](T$d,plural):confirm_1[d5F];}else {opts[q8B]=x8n;}}return opts;}apiRegister(w7m,function(){return _getInst(this);});apiRegister(b$W,function(opts){var inst=_getInst(this);inst[D$b](_setBasic(inst,opts,a77));return this;});apiRegister(d0N,function(opts){var d8s=M_v;d8s+=e1Z;var A71=J7P;A71+=f4b;A71+=W08;A71+=K$x;var inst=_getInst(this);inst[A71](this[x9R][x9R],_setBasic(inst,opts,d8s));return this;});apiRegister(u19,function(opts){var T4L=J7P;g1X.g2m();T4L+=d7k;var inst=_getInst(this);inst[F2v](this[x9R],_setBasic(inst,opts,T4L));return this;});apiRegister(m6V,function(opts){var inst=_getInst(this);inst[e3f](this[x9R][x9R],_setBasic(inst,opts,c$T,C05));g1X.h9F();return this;});apiRegister(s6L,function(opts){var i_$=A5M;i_$+=H8o;i_$+=B0B;var P3b=A5l;P3b+=z60;var inst=_getInst(this);inst[P3b](this[x9R],_setBasic(inst,opts,c$T,this[x9R][i_$]));return this;});apiRegister(J65,function(type,opts){var C9V="isPlain";var S$I=C9V;S$I+=P4a;if(!type){type=F9A;}else if($[S$I](type)){opts=type;type=F9A;}_getInst(this)[type](this[x9R][x9R],opts);return this;});apiRegister(P0d,function(opts){var h94="bbl";g1X.h9F();var s$_=z6i;s$_+=e_G;s$_+=h94;s$_+=J7P;_getInst(this)[s$_](this[x9R],opts);return this;});apiRegister(y$H,file);apiRegister(d2O,files);$(document)[j_R](E1N,function(e,ctx,json){var t4a='dt';var G7w="namespace";if(e[G7w] !== t4a){return;}g1X.h9F();if(json && json[o85]){var Z4q=B9g;Z4q+=W_c;Z4q+=P48;$[h3P](json[Z4q],function(name,filesIn){if(!Editor[o85][name]){Editor[o85][name]={};}$[W6E](Editor[o85][name],filesIn);});}});var _buttons=$[i$t][A1y][T9y][x0X];$[W6E](_buttons,{create:{action:function(e,dt,node,config){var J4j="Bu";var W1B="formTitl";var T3V=p2d;T3V+=u2c;T3V+=u2h;var s7e=K$x;s7e+=w6y;s7e+=J7P;var n7w=W1B;n7w+=J7P;var z5q=p2d;z5q+=J4j;z5q+=n1x;z5q+=Y2l;var n0I=Q9I;n0I+=a07;var R$n=Q4J;R$n+=j28;R$n+=D4c;var p0O=k9m;p0O+=q6U;p0O+=J7P;var u3v=J7P;u3v+=e9o;u3v+=K$x;u3v+=i5x;var that=this;var editor=config[u3v];g1X.g2m();this[M2v](w0_);editor[p0O](R$n,function(){that[M2v](P3U);})[D$b]($[n0I]({buttons:config[z5q],message:config[Q$V] || editor[G5w][D$b][q8B],nest:w0_,title:config[n7w] || editor[G5w][D$b][s7e]},config[T3V]));},className:W5R,editor:F7$,formButtons:{action:function(e){var t8i="ubm";var c1r=P48;c1r+=t8i;c1r+=W08;c1r+=K$x;g1X.g2m();this[c1r]();},text:function(editor){var G6S=W08;G6S+=G92;G6S+=z$d;G6S+=q6U;g1X.h9F();return editor[G6S][D$b][q4v];}},formMessage:F7$,formOptions:{},formTitle:F7$,text:function(dt,node,config){var B_R="ns.";var c5C="ton";var Z3h=z6i;Z3h+=C1u;Z3h+=c5C;var V5P=s1U;V5P+=J7P;var N1P=W08;N1P+=G92;N1P+=z$d;N1P+=q6U;var i1c=J7P;i1c+=e9o;i1c+=K$x;i1c+=i5x;var J7u=y2n;J7u+=B_R;J7u+=J3A;J7u+=I3U;return dt[G5w](J7u,config[i1c][N1P][V5P][Z3h]);}},createInline:{action:function(e,dt,node,config){var b19="posit";var s0D="neC";var A5s="rmOptions";var m4r=f9t;m4r+=A5s;var r81=b19;r81+=n0H;var b5Q=L8k;b5Q+=s0D;b5Q+=C_s;g1X.g2m();config[f6r][b5Q](config[r81],config[m4r]);},className:K53,editor:F7$,formButtons:{action:function(e){g1X.g2m();this[q4v]();},text:function(editor){var W3R=K3A;W3R+=z6i;W3R+=h1a;W3R+=K$x;var M8P=W08;M8P+=G92;M8P+=z$d;M8P+=q6U;return editor[M8P][D$b][W3R];}},formOptions:{},position:X8q,text:function(dt,node,config){var u18="rea";var S0D="s.creat";var e5M=q33;e5M+=K$x;e5M+=K$x;e5M+=j_R;var X3f=X47;X3f+=u18;X3f+=K$x;X3f+=J7P;var X7m=W08;X7m+=G92;X7m+=z$d;X7m+=q6U;var h_N=q33;h_N+=M7M;h_N+=S0D;g1X.h9F();h_N+=J7P;var z7u=o_z;z7u+=q6U;return dt[z7u](h_N,config[f6r][X7m][X3f][e5M]);}},edit:{action:function(e,dt,node,config){var x5V='preOpen';var E1z="lumns";var i4Y="formButtons";var Y_1="exe";var m$T="rmTitl";var L5c=p2d;L5c+=u2c;L5c+=u2h;var U_o=K$x;U_o+=W08;U_o+=u4Y;var u8W=J7P;u8W+=f4b;u8W+=W08;u8W+=K$x;var a2n=W08;a2n+=G92;a2n+=z$d;a2n+=q6U;var R5c=C6M;R5c+=k9m;R5c+=m$T;R5c+=J7P;var J2q=J7P;J2q+=f4b;J2q+=W08;J2q+=K$x;var b8G=W08;b8G+=G92;b8G+=z$d;b8G+=q6U;var R2C=r2J;g1X.g2m();R2C+=f4b;var M$O=I00;M$O+=J5G;var o2Z=A5M;o2Z+=H8o;o2Z+=B0B;var n_h=x3d;n_h+=P5I;n_h+=D99;var d56=Y1I;d56+=E1z;var Z8c=x3d;Z8c+=Y_1;Z8c+=P48;var t44=W4S;t44+=w0T;var B90=p59;B90+=g$C;var that=this;var editor=config[B90];var rows=dt[t44]({selected:w0_})[Z8c]();var columns=dt[d56]({selected:w0_})[H2E]();var cells=dt[H47]({selected:w0_})[n_h]();var items=columns[p2U] || cells[o2Z]?{cells:cells,columns:columns,rows:rows}:rows;this[M$O](w0_);editor[N$u](x5V,function(){var i$N=R1k;g1X.g2m();i$N+=N2F;that[i$N](P3U);})[F2v](items,$[R2C]({buttons:config[i4Y],message:config[Q$V] || editor[b8G][J2q][q8B],nest:w0_,title:config[R5c] || editor[a2n][u8W][U_o]},config[L5c]));},className:I5G,editor:F7$,extend:R_n,formButtons:{action:function(e){g1X.g2m();this[q4v]();},text:function(editor){var j_x=M_v;j_x+=W08;g1X.g2m();j_x+=K$x;return editor[G5w][j_x][q4v];}},formMessage:F7$,formOptions:{},formTitle:F7$,text:function(dt,node,config){var T$F="s.edit";var Q0O=W08;Q0O+=G92;Q0O+=z$d;g1X.g2m();Q0O+=q6U;var Z3k=M_v;Z3k+=W08;Z3k+=F9d;Z3k+=Y$e;var x96=n7v;x96+=T$F;var h5n=W08;h5n+=C2Y;h5n+=q6U;return dt[h5n](x96,config[Z3k][Q0O][F2v][n7v]);}},remove:{action:function(e,dt,node,config){var J0U="rmMessa";var r25="ttons";var o5k="B";var T$k=y_D;T$k+=z$d;T$k+=q6U;var u$Y=p2d;u$Y+=m4s;u$Y+=W08;u$Y+=u4Y;var m62=f9t;m62+=J0U;m62+=Q8X;var w8E=p2d;w8E+=o5k;w8E+=e_G;w8E+=r25;var q6m=J7P;q6m+=E6e;var N4u=W4S;N4u+=w0T;var W4R=U3G;W4R+=Y$e;g1X.g2m();W4R+=j28;W4R+=D4c;var u8H=j_R;u8H+=J7P;var that=this;var editor=config[f6r];this[M2v](w0_);editor[u8H](W4R,function(){that[M2v](P3U);})[e3f](dt[N4u]({selected:w0_})[H2E](),$[q6m]({buttons:config[w8E],message:config[m62],nest:w0_,title:config[u$Y] || editor[T$k][e3f][O$b]},config[H7v]));},className:r6t,editor:F7$,extend:L9l,formButtons:{action:function(e){g1X.g2m();this[q4v]();},text:function(editor){var t$l="subm";var q0V=t$l;q0V+=W08;q0V+=K$x;var q7b=Y$e;q7b+=J7P;q7b+=J4F;q7b+=I_4;g1X.h9F();return editor[G5w][q7b][q0V];}},formMessage:function(editor,dt){var b64="confirm";var B_8="ows";var D4E="firm";var n5m="confi";var b3Q="onfi";var y$B=A5M;y$B+=i7U;g1X.h9F();var I$Z=T06;I$Z+=B0B;var I45=Y1I;I45+=q6U;I45+=D4E;var t3t=A5M;t3t+=H8o;t3t+=B0B;var e3k=n5m;e3k+=g69;var V3a=X47;V3a+=b3Q;V3a+=Y$e;V3a+=u9C;var z5m=Y$e;z5m+=B_8;var rows=dt[z5m]({selected:w0_})[H2E]();var i18n=editor[G5w][e3f];var question=typeof i18n[V3a] === V_T?i18n[e3k]:i18n[b64][rows[t3t]]?i18n[I45][rows[I$Z]]:i18n[b64][g4U];return question[q9A](/%d/g,rows[y$B]);},formOptions:{},formTitle:F7$,limitTo:[D9n],text:function(dt,node,config){var a8b="buttons.remov";var H5Q=q33;H5Q+=K$x;H5Q+=F9d;H5Q+=q6U;var a4S=W08;a4S+=C2Y;a4S+=q6U;var C65=a8b;C65+=J7P;var r_z=W08;r_z+=G92;r_z+=z$d;r_z+=q6U;return dt[r_z](C65,config[f6r][a4S][e3f][H5Q]);}}});_buttons[x2W]=$[W6E]({},_buttons[A2l]);_buttons[x2W][W6E]=z7B;_buttons[t_x]=$[s6J]({},_buttons[e3f]);_buttons[U3M][g5e]=E5x;var Editor=(function(){var n1Y="rs";var e1B="pai";var N4D="rsion";var Q4v=".7";var x8d="internalI";var O_N="ternalSettings";var u8_="int";var O5Z="rototyp";var X4e="defa";var z6b="nalEvent";var f_8="lts";var A2Y="interna";var Q1A="classe";var g$M="lMultiInfo";var D8B=h$i;D8B+=J7P;D8B+=A5M;D8B+=P48;var z6A=X4e;z6A+=e_G;z6A+=f_8;var y5e=S7M;y5e+=A5M;y5e+=z5h;var W1P=e1B;W1P+=n1Y;var E5D=Q1A;E5D+=P48;var I6B=z1d;I6B+=R1Q;I6B+=H6A;I6B+=Q4v;var s9m=K9A;s9m+=J7P;s9m+=N4D;var h9q=B9g;h9q+=A5M;h9q+=J7P;h9q+=P48;var G2H=B2L;G2H+=O_N;var e1b=U3G;e1b+=O5Z;e1b+=J7P;var Q1n=A2Y;Q1n+=g$M;var u_M=a8O;u_M+=R2u;var V7v=x8d;V7v+=w6e;var Q_x=u8_;Q_x+=w9V;Q_x+=z6b;var A1R=R1k;A1R+=B_$;function Editor(init){var H$5="ata-dte-e=\"form_error\" class=\"";var y5I="_n";var l3D="ition";var O_s="form_cont";var S3k="not find d";var Z72='"><div class="';var j7u="messag";var E83="eop";var N46="<div data-dte-e=\"form_content\"";var L7Y='<div data-dte-e="form_info" class="';var u8s="_optionsUpd";var r88="\"processing\" clas";var G0s="mbleMa";var o9b="_aj";var t3M="ependen";var i4N="layController";var t5a="displayReorder";var O3x="<div data-dte-e";var q34="DataTables Editor must";var N3i="mitErro";var K4b="iInfo";var h6a='<form data-dte-e="form" class="';var N_3="closeReg";var a$4="ni";var Z_3="nts";var x8k="v d";var B5Y="hea";var n1R="onten";var I$8="for";var V_X="displayNode";var K4$='init.dt.dte';var r5v="actionN";var t6n="e-e=\"foot\" class=";var t7z="/di";var s8V="m_buttons\" class=\"";var Q7u="Can";var X7r='body_content';var M34="layed";var l2V="body";var Q30=" be initialised as";var g6t="new\' instance";var h7c="=\"head\" class=";var g1a="e=\"bod";var Y$P="ePos";var X_6="_asse";var L7G="Compl";var i_p="ndica";var N$e="_processi";var r2X="isplay controller ";var o_o="rc";var G3F="nTable";var i7b="_bl";var Q0J="ess";var o3t="unique";var c3C="que";var s9$="y_content\" class=\"";var E3B='"></div></div>';var F5k=" a \'";var P6v="<div data-dte-";var p3R='i18n.dt.dte';var y5o=" class=\"";var i5s="ls";var o$h="bubbl";var w8C="e=\"body\" class=\"";var g6e='xhr.dt.dte';var A$5="<div data-dte-e=\"fo";var p3V="displa";var A4G="nErr";var G0w="oot";var a8X='</form>';var f7C="_mess";var f_t="_nestedOpen";var d_4="ta-dt";var N_t="inlineCrea";var I$b="edClose";var Z_b="_fieldNam";var k9s="ody";var X7Q="data-dte-e=";var b_B="proc";var f5t="ormOp";var a7e="_mult";var I1S="Get";var J6n=b1k;J6n+=V7b;J6n+=R8S;var c8i=b1k;c8i+=L7G;c8i+=l3T;var p$B=g4U;p$B+=J7P;p$B+=G3s;p$B+=K$x;var O5z=B2L;O5z+=e1Z;var I1L=T$f;I1L+=i4N;var U8o=k9m;U8o+=q6U;var e$P=e_G;e$P+=a$4;e$P+=c3C;var Z4d=M8C;Z4d+=l1J;var S2n=A7c;S2n+=z6i;S2n+=A5M;S2n+=J7P;var v2i=j1d;v2i+=u9C;var P9c=J7P;P9c+=I_4;P9c+=Z_3;var T7Q=J7P;T7Q+=i6p;T7Q+=j1i;var Q4X=X47;Q4X+=n1R;Q4X+=K$x;var y2s=F25;y2s+=M6g;y2s+=Y$e;var M8D=B5Y;M8D+=u2Y;M8D+=Y$e;var u75=O3x;u75+=h7c;u75+=y$Z;var B0F=R_M;B0F+=W08;B0F+=M3t;var B0D=C6M;B0D+=k9m;B0D+=g69;var N1p=J7P;N1p+=Y$e;N1p+=W4S;N1p+=Y$e;var l24=d66;l24+=x8k;l24+=H$5;var Z_i=O_s;Z_i+=k04;var Z_s=C6M;Z_s+=G0w;var N4y=U67;N4y+=F9d;N4y+=q6U;N4y+=P48;var S07=A$5;S07+=Y$e;S07+=s8V;var J9O=S1L;J9O+=Q11;var Z9a=f4b;Z9a+=k9m;Z9a+=u9C;var R3F=Y1I;R3F+=q6U;R3F+=w3n;R3F+=u$U;var N$8=I$8;N$8+=u9C;var d3E=N46;d3E+=y5o;var p0_=K$x;p0_+=y4k;p0_+=Z71;var J1I=X9B;J1I+=W08;J1I+=K9A;J1I+=I9l;var l0d=B6y;l0d+=d_4;l0d+=t6n;l0d+=y$Z;var t15=U$F;t15+=t7z;t15+=M3t;var W4b=h1s;W4b+=D7e;W4b+=M3t;var z7v=X47;z7v+=n1R;z7v+=K$x;var C7y=P6v;C7y+=g1a;C7y+=s9$;var r6p=y$Z;r6p+=I9l;var I2y=z6i;I2y+=k9s;var G2e=P6v;G2e+=w8C;var V2M=W08;V2M+=i_p;V2M+=F9d;V2M+=Y$e;var T_M=b_B;T_M+=Q0J;T_M+=B2L;T_M+=Z71;var s27=A0l;s27+=X7Q;s27+=r88;s27+=G0G;var H1Z=y$Z;H1Z+=I9l;var m54=d66;m54+=y7X;m54+=X5j;m54+=G0G;var P_s=p9p;P_s+=d1M;P_s+=J7P;P_s+=P48;var h_c=h$i;h_c+=J7P;h_c+=i5s;var A_Z=W08;A_Z+=G92;A_Z+=z$d;A_Z+=q6U;var H_g=W08;H_g+=w6e;var q9v=f4b;q9v+=J7P;q9v+=t_V;var y$m=f4b;y$m+=k9m;y$m+=u9C;y$m+=u4R;var e35=W08;e35+=f4b;e35+=g6v;e35+=o_o;var e7Z=r5v;e7Z+=Y2J;var Q2N=g9H;Q2N+=i5s;var E0y=P5I;E0y+=K$x;E0y+=Z9U;var P0C=g4U;P0C+=N4r;P0C+=f4b;P0C+=a_i;var z76=g4U;z76+=p2C;z76+=N3i;z76+=Y$e;var m6t=N$e;m6t+=m5E;var e5f=H2w;e5f+=Y$e;e5f+=E83;e5f+=D4c;var l04=y5I;l04+=H2s;l04+=I$b;var Q6t=a7e;Q6t+=K4b;var E5A=f7C;E5A+=l1$;var t6a=u8s;t6a+=R01;t6a+=J7P;var t1j=b30;t1j+=f5t;t1j+=Z2E;var t9b=Z_b;t9b+=D99;var N_L=Q1e;N_L+=D4c;N_L+=K$x;var S8E=g4U;S8E+=J7P;S8E+=f4b;S8E+=e1Z;var E4J=g4U;E4J+=t5a;var Q2f=g4U;Q2f+=N_3;var g1D=i7b;g1D+=L6P;var Y7m=X_6;Y7m+=G0s;Y7m+=B2L;var m4_=o9b;m4_+=h26;var b1W=K$x;b1W+=e1Z;b1W+=W_c;var i8O=P48;i8O+=t0I;var P1S=k9m;P1S+=Y$e;P1S+=E2q;var r$Z=k9m;r$Z+=U3G;r$Z+=D4c;var I0I=k9m;I0I+=q6U;I0I+=J7P;var k_m=k9m;k_m+=q6U;var k1B=k9m;k1B+=C6M;k1B+=C6M;var t0K=m4E;t0K+=f4b;t0K+=J7P;var T9W=i6O;T9W+=I1S;var C9p=u9C;C9p+=h9P;var P9r=j7u;P9r+=J7P;var p1h=N_t;p1h+=w3n;var n03=z5O;n03+=Z1A;var H6P=W08;H6P+=A4G;H6P+=i5x;var B9x=d4U;B9x+=P48;var f6W=C6M;g1X.g2m();f6W+=W08;f6W+=A5M;f6W+=J7P;var p7b=C6M;p7b+=W08;p7b+=c_0;p7b+=f4b;var e_k=D4c;e_k+=y4k;e_k+=Q$e;var R9h=T$f;R9h+=M34;var V_y=p3V;V_y+=a_i;var E_4=f4b;E_4+=W97;E_4+=Q$e;var w9Q=f4b;w9Q+=k7k;var Z8J=t9J;Z8J+=t3M;Z8J+=K$x;var u8S=E$w;u8S+=U44;u8S+=J7P;var l4V=o$h;l4V+=Y$P;l4V+=l3D;var v2H=K6g;v2H+=f4b;var _this=this;this[v2H]=add;this[p$b]=ajax;this[x4j]=background;this[I9T]=blur;this[p1g]=bubble;this[l4V]=bubblePosition;this[x0X]=buttons;this[f$O]=clear;this[u8S]=close;this[D$b]=create;this[Z8J]=undependent;this[l_i]=dependent;this[w9Q]=destroy;this[E_4]=disable;this[V_y]=display;this[R9h]=displayed;this[V_X]=displayNode;this[F2v]=edit;this[e_k]=enable;this[F3P]=error$1;this[p7b]=field;this[W7Q]=fields;this[f6W]=file;this[o85]=files;this[B3M]=get;this[U2S]=hide;this[B9x]=ids;this[H6P]=inError;this[n03]=inline;this[p1h]=inlineCreate;this[P9r]=message;this[C9p]=mode;this[E6r]=modifier;this[T9W]=multiGet;this[t1r]=multiSet;this[t0K]=node;this[k1B]=off;this[k_m]=on;this[I0I]=one;this[r$Z]=open;this[P1S]=order;this[e3f]=remove;this[i8O]=set;this[I7o]=show;this[q4v]=submit;this[o7k]=table;this[S8l]=template;this[b1W]=title;this[t0E]=val;this[E_b]=_actionClass;this[m4_]=_ajax;this[y8H]=_animate;this[Y7m]=_assembleMain;this[g1D]=_blur;this[v7S]=_clearDynamicInfo;this[f28]=_close;this[Q2f]=_closeReg;this[m6r]=_crudArgs;this[e4j]=_dataSource;this[E4J]=_displayReorder;this[S8E]=_edit;this[N_L]=_event;this[D$5]=_eventName;this[Y29]=_fieldFromNode;this[t9b]=_fieldNames;this[d8F]=_focus;this[t1j]=_formOptions;this[m0e]=_inline;this[t6a]=_optionsUpdate;this[E5A]=_message;this[Q6t]=_multiInfo;this[l04]=_nestedClose;this[f_t]=_nestedOpen;this[z2B]=_postopen;this[e5f]=_preopen;this[m6t]=_processing;this[N9i]=_noProcessing;this[Q6P]=_submit;this[F_4]=_submitTable;this[A0H]=_submitSuccess;this[z76]=_submitError;this[P0C]=_tidy;this[Y8k]=_weakInArray;if(!(this instanceof Editor)){var H$x=q34;H$x+=Q30;H$x+=F5k;H$x+=g6t;alert(H$x);}init=$[E0y](w0_,{},Editor[X5t],init);this[P48]=$[W6E](w0_,{},Editor[Q2N][a0N],{actionName:init[e7Z],ajax:init[p$b],formOptions:init[H7v],idSrc:init[e35],table:init[y$m] || init[o7k],template:init[S8l]?$(init[S8l])[q9v]():F7$});this[D5Z]=$[W6E](w0_,{},Editor[D5Z]);this[H_g]=init[A_Z];Editor[h_c][a0N][o3t]++;var that=this;var classes=this[P_s];var wrapper=$(m54 + classes[M70] + H1Z + s27 + classes[T_M][V2M] + J6R + G2e + classes[I2y][M70] + r6p + C7y + classes[l2V][z7v] + W4b + t15 + l0d + classes[g9P][M70] + v2p + w$1 + classes[g9P][l7J] + E3L + J1I + z6g);var form=$(h6a + classes[p2d][p0_] + v2p + d3E + classes[N$8][R3F] + E3L + a8X);this[Z9a]={body:el(J9O,wrapper)[x9R],bodyContent:el(X7r,wrapper)[x9R],buttons:$(S07 + classes[p2d][N4y] + E3L)[x9R],footer:el(Z_s,wrapper)[x9R],form:form[x9R],formContent:el(Z_i,form)[x9R],formError:$(l24 + classes[p2d][N1p] + E3L)[x9R],formInfo:$(L7Y + classes[B0D][l31] + B0F)[x9R],header:$(u75 + classes[M8D][y2s] + Z72 + classes[V6f][Q4X] + E3B)[x9R],processing:el(v_e,wrapper)[x9R],wrapper:wrapper[x9R]};$[T7Q](init[P9c],function(evt,fn){var h_Q=k9m;h_Q+=q6U;that[h_Q](evt,function(){g1X.h9F();var b8$=W_c;b8$+=q6U;b8$+=x6u;b8$+=j1i;var argsIn=[];for(var _i=x9R;_i < arguments[b8$];_i++){argsIn[_i]=arguments[_i];}fn[R$p](that,argsIn);});});this[v2i];var table$1=this[P48][S2n];if(init[Z4d]){var W4y=T2z;W4y+=B36;W4y+=P48;this[Q6J](init[W4y]);}$(document)[j_R](K4$ + this[P48][e$P],function(e,settings,json){var a9h="_editor";if(_this[P48][o7k] && settings[G3F] === $(table$1)[x9R]){settings[a9h]=_this;}})[j_R](p3R + this[P48][o3t],function(e,settings){var Q4k="ito";var P7h="oLanguage";var y$v="oLangua";var D_r=K$x;D_r+=Y0O;if(_this[P48][D_r] && settings[G3F] === $(table$1)[x9R]){var i8a=M_v;i8a+=Q4k;i8a+=Y$e;if(settings[P7h][i8a]){var D7s=J7P;D7s+=J$O;var a5_=y$v;a5_+=Q8X;var i8b=J7P;i8b+=h3O;i8b+=J7P;i8b+=a07;$[i8b](w0_,_this[G5w],settings[a5_][D7s]);}}})[U8o](g6e + this[P48][o3t],function(e,settings,json){var y88="_optionsUpdate";var n0n=A7c;n0n+=z6i;n0n+=A5M;n0n+=J7P;if(json && _this[P48][n0n] && settings[G3F] === $(table$1)[x9R]){_this[y88](json);}});if(!Editor[b9u][init[b9u]]){var r3y=Q7u;r3y+=S3k;r3y+=r2X;throw new Error(r3y + init[b9u]);}this[P48][I1L]=Editor[b9u][init[b9u]][O5z](this);this[p$B](c8i,[]);$(document)[v47](J6n,[this]);}Editor[A1R][Q_x]=function(name,args){var N0s=E2Y;N0s+=u$U;this[N0s](name,args);};Editor[N9d][V7v]=function(){g1X.g2m();return this[G5w];};Editor[u_M][Q1n]=function(){var L$B="_mul";var B7j=L$B;B7j+=G4C;return this[B7j]();};Editor[e1b][G2H]=function(){return this[P48];};Editor[K1e]={checkbox:checkbox,datatable:datatable,datetime:datetime,hidden:hidden,password:password,radio:radio,readonly:readonly,select:select,text:text,textarea:textarea,upload:upload,uploadMany:uploadMany};Editor[h9q]={};Editor[s9m]=I6B;Editor[E5D]=classNames;Editor[L58]=Field;Editor[d_X]=F7$;Editor[F3P]=error;Editor[W1P]=pairs;Editor[y5e]=upload$1;Editor[z6A]=defaults$1;Editor[D8B]={button:button,displayController:displayController,fieldType:fieldType,formOptions:formOptions,settings:settings};Editor[z8m]={dataTable:dataSource$1,html:dataSource};Editor[b9u]={envelope:envelope,lightbox:self};Editor[Q_X]=function(id){g1X.h9F();return safeDomId(id,x8n);};return Editor;})();DataTable[Z5Q]=Editor;$[w_B][j6p][Z5Q]=Editor;if(DataTable[k6W]){var K4f=k_9;K4f+=Q3G;K4f+=W08;K4f+=Y6r;Editor[d_X]=DataTable[K4f];}if(DataTable[S48][K4e]){var x53=M_v;x53+=e1Z;x53+=k9m;x53+=m8C;var q40=J7P;q40+=W4t;q40+=K$x;var y2q=T2z;y2q+=J6u;y2q+=m8F;y2q+=P48;var b0$=P5I;b0$+=Q7A;b0$+=f4b;$[b0$](Editor[y2q],DataTable[q40][x53]);}DataTable[C6x][Y$E]=Editor[K1e];return Editor;});})();

/*! Bootstrap integration for DataTables' Editor
 * ©2015 SpryMedia Ltd - datatables.net/license
 */

(function( factory ){
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery', 'datatables.net-bs5', 'datatables.net-editor'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = function (root, $) {
			if ( ! root ) {
				root = window;
			}

			if ( ! $ || ! $.fn.dataTable ) {
				$ = require('datatables.net-bs5')(root, $).$;
			}

			if ( ! $.fn.dataTable.Editor ) {
				require('datatables.net-editor')(root, $);
			}

			return factory( $, root, root.document );
		};
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}(function( $, window, document, undefined ) {
'use strict';
var DataTable = $.fn.dataTable;


/*
 * Set the default display controller to be our bootstrap control 
 */
DataTable.Editor.defaults.display = "bootstrap";


/*
 * Alter the buttons that Editor adds to Buttons so they are suitable for bootstrap
 */
var i18nDefaults = DataTable.Editor.defaults.i18n;
i18nDefaults.create.title = '<h5 class="modal-title">'+i18nDefaults.create.title+'</h5>';
i18nDefaults.edit.title = '<h5 class="modal-title">'+i18nDefaults.edit.title+'</h5>';
i18nDefaults.remove.title = '<h5 class="modal-title">'+i18nDefaults.remove.title+'</h5>';


/*
 * Change the default classes from Editor to be classes for Bootstrap
 */
$.extend( true, $.fn.dataTable.Editor.classes, {
	"header": {
		"wrapper": "DTE_Header modal-header"
	},
	"body": {
		"wrapper": "DTE_Body modal-body"
	},
	"footer": {
		"wrapper": "DTE_Footer modal-footer"
	},
	"form": {
		"tag": "form-horizontal",
		"button": "btn",
		"buttonInternal": "btn btn-outline-secondary"
	},
	"field": {
		"wrapper": "DTE_Field form-group row",
		"label":   "col-lg-4 col-form-label",
		"input":   "col-lg-8",
		"error":   "error is-invalid",
		"msg-labelInfo": "form-text text-secondary small",
		"msg-info":      "form-text text-secondary small",
		"msg-message":   "form-text text-secondary small",
		"msg-error":     "form-text text-danger small",
		"multiValue":    "card multi-value",
		"multiInfo":     "small",
		"multiRestore":  "card multi-restore"
	}
} );

$.extend( true, DataTable.ext.buttons, {
	create: {
		formButtons: {
			className: 'btn-primary'
		}
	},
	edit: {
		formButtons: {
			className: 'btn-primary'
		}
	},
	remove: {
		formButtons: {
			className: 'btn-danger'
		}
	}
} );

DataTable.Editor.fieldTypes.datatable.tableClass = 'table';

/*
 * Bootstrap display controller - this is effectively a proxy to the Bootstrap
 * modal control.
 */
let shown = false;
let fullyShown = false;

const dom = {
	content: $(
		'<div class="modal fade DTED">'+
			'<div class="modal-dialog modal-dialog-scrollable modal-dialog-centered"></div>'+
		'</div>'
	),
	close: $('<button class="btn-close"></div>')
};
let modal;
let _bs = window.bootstrap;

DataTable.Editor.bootstrap = function (bs) {
	_bs = bs;
}

DataTable.Editor.display.bootstrap = $.extend( true, {}, DataTable.Editor.models.displayController, {
	/*
	 * API methods
	 */
	init: function ( dte ) {
		// Add `form-control` to required elements
		dte.on( 'displayOrder.dtebs', function ( e, display, action, form ) {
			$.each( dte.s.fields, function ( key, field ) {
				$('input:not([type=checkbox]):not([type=radio]), select, textarea', field.node() )
					.addClass( 'form-control' );

				$('input[type=checkbox], input[type=radio]', field.node() )
					.addClass( 'form-check-input' );

				$('select', field.node() )
					.addClass( 'form-select' );
			} );
		} );

		return DataTable.Editor.display.bootstrap;
	},

	open: function ( dte, append, callback ) {
		if (! modal) {
			modal = new _bs.Modal(dom.content[0], {
				backdrop: "static",
				keyboard: false
			});
		}

		$(append).addClass('modal-content');

		// Special class for DataTable buttons in the form
		$(append).find('div.DTE_Field_Type_datatable div.dt-buttons')
			.removeClass('btn-group')
			.addClass('btn-group-vertical');

		// Setup events on each show
		dom.close
			.attr('title', dte.i18n.close)
			.off('click.dte-bs5')
			.on('click.dte-bs5', function () {
				dte.close('icon');
			})
			.appendTo($('div.modal-header', append));

		// This is a bit horrible, but if you mousedown and then drag out of the modal container, we don't
		// want to trigger a background action.
		let allowBackgroundClick = false;
		$(document)
			.off('mousedown.dte-bs5')
			.on('mousedown.dte-bs5', 'div.modal', function (e) {
				allowBackgroundClick = $(e.target).hasClass('modal') && shown
					? true
					: false;
			} );

		$(document)
			.off('click.dte-bs5')
			.on('click.dte-bs5', 'div.modal', function (e) {
				if ( $(e.target).hasClass('modal') && allowBackgroundClick ) {
					dte.background();
				}
			} );

		var content = dom.content.find('div.modal-dialog');
		content.children().detach();
		content.append( append );

		if ( shown ) {
			if ( callback ) {
				callback();
			}
			return;
		}

		shown = true;
		fullyShown = false;

		$(dom.content)
			.one('shown.bs.modal', function () {
				// Can only give elements focus when shown
				if ( dte.s.setFocus ) {
					dte.s.setFocus.focus();
				}

				fullyShown = true;

				if ( callback ) {
					callback();
				}
			})
			.one('hidden', function () {
				shown = false;
			})
			.appendTo( 'body' );
		
		modal.show();
	},

	close: function ( dte, callback ) {
		if ( ! shown ) {
			if ( callback ) {
				callback();
			}
			return;
		}

		// Check if actually displayed or not before hiding. BS4 doesn't like `hide`
		// before it has been fully displayed
		if ( ! fullyShown ) {
			$(dom.content)
				.one('shown.bs.modal', function () {
					DataTable.Editor.display.bootstrap.close( dte, callback );
				} );

			return;
		}

		$(dom.content)
			.one( 'hidden.bs.modal', function () {
				$(this).detach();
			} );

		modal.hide();

		shown = false;
		fullyShown = false;

		if ( callback ) {
			callback();
		}
	},

	node: function ( dte ) {
		return dom.content[0];
	}
} );


return DataTable.Editor;
}));


