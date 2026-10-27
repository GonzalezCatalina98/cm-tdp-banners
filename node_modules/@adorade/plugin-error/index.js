/*!
 * Plugin Error (v1.0.0): index.js
 *
 * Copyright (c) 2024 Adorade (https://adorade.ro)
 * Licensed under MIT
 * ========================================================================== */

/**
 * @typedef {import('ansi-colors')} Colors
 * @typedef {import('ansi-colors').Style} Style
 */
import colors from 'ansi-colors';
const { cyan, red } = colors;

/**
 * List of properties that should not be enumerated.
 * @type {Set<string>}
 */
const nonEnum = new Set(['message', 'name', 'stack']);

/**
 * Set of properties to be ignored.
 * @type {Set<string>}
 */
const ignored = new Set([
  ...nonEnum,
  '__safety',
  '_stack',
  'plugin',
  'showProperties',
  'showStack',
  'domain',
  'domainEmitter',
  'domainThrown'
]);

/**
 * List of properties to be considered.
 * @type {string[]}
 */
const props = [
  'fileName',
  'lineNumber',
  'message',
  'name',
  'plugin',
  'showProperties',
  'showStack',
  'stack'
];

/**
 * PluginError class representing an error in a plugin.
 */
export default class PluginError extends Error {
  /**
   * Creates an instance of PluginError.
   * @param {string|object} plugin - The name of the plugin or an object representing the error.
   * @param {string|Error} message - The error message or an instance of Error.
   * @param {object} [options={}] - Additional options for configuring the error.
   * @returns {PluginError} - An instance of the PluginError class.
   */
  constructor(plugin, message, options) {
    super();

    // Check if the constructor was called without the 'new' keyword.
    if (!(this instanceof PluginError)) {
      // Create and return a new instance of PluginError.
      return new PluginError(plugin, message, options);
    }

    /**
     * Set default options and merge with provided options.
     * @type {object}
     */
    const opts = setDefaults(plugin, message, options);

    // Handle error options.
    this.handleError(opts);

    // Merge options with specific properties.
    this.mergeOptions(props, opts);

    // Validate properties to ensure required ones are present.
    validateProperties(this);

    // Add stack trace to the error.
    this.addStackTrace(this);
  }

  /**
   * Handle error options and copy specified properties from the error object.
   * @param {object} opts - Options object.
   */
  handleError(opts) {
    // Check if 'error' property in options is not an object.
    if (typeof opts.error !== 'object') return;

    /**
     * Create a set of keys from the error object and non-enumerable properties.
     * @type {Set<string>}
     */
    const keys = new Set([...Object.keys(opts.error || {}), ...nonEnum]);

    // Copy specified properties from the error options to the current object.
    keys.forEach(key => {
      this[key] = opts.error[key];
    });
  }

  /**
   * Merge specified properties from options into the current object.
   * @param {string[]} props - List of properties to merge.
   * @param {object} opts - Options object.
   */
  mergeOptions(props, opts) {
    // Iterate over key-value pairs in the options object.
    Object.entries(opts).forEach(([prop, value]) => {
      // Check if the property is included in the specified list.
      if (props.includes(prop)) {
        // Assign the value to the corresponding property.
        this[prop] = value;
      }
    });
  }

  /**
   * Add stack trace to the error if not already present.
   * @param {object} error - The error object to which the stack trace is added.
   * @returns {object} - The modified error object.
   */
  addStackTrace(error) {
    // Check if the error object already has a stack trace.
    if (error.stack) return;

    /**
     * Create a safety object to capture the stack trace.
     * @type {object}
     */
    const safety = {
      /**
       * Generate a string representation of the error and stack trace.
       * @returns {string} - String representation.
       */
      toString: () => `${this.getErrorMessage()}\nStack:`
    };

    // Capture the stack trace using the safety object.
    Error.captureStackTrace(safety, error.constructor);

    // Assign the safety object to the '__safety' property in the error.
    return error.__safety = safety;
  }

  /**
   * Get formatted error message including details if available.
   * @returns {string} - Formatted error message.
   */
  getErrorMessage() {
    /**
     * Initialize the error message with the main message.
     * @type {string}
     */
    let message = `Message:\n    ${this.message}`;

    /**
     * Get formatted error details.
     * @type {string}
     */
    const details = this.getErrorDetails();

    // Append error details if available.
    if (details) {
      message += `\n${details}`;
    }

    return message;
  }

  /**
   * Get formatted error details if 'showProperties' is enabled.
   * @returns {string} - Formatted error details.
   */
  getErrorDetails() {
    // Check if 'showProperties' is disabled.
    if (!this.showProperties) {
      return '';
    }

    /**
     * Filter out ignored properties and format the rest.
     * @type {string[]}
     */
    const properties = Object.keys(this).filter((key) => {
      return !ignored.has(key);
    });

    // Check if there are no properties to display.
    if (properties.length === 0) {
      return '';
    }

    /**
     * Format the error details.
     * @type {string}
     */
    const res = properties.map(prop => `    ${prop}: ${this[prop]}`).join('\n');

    return `Details:\n${res}`;
  }

  /**
   * Convert the error to a string representation.
   * @returns {string} - String representation of the error.
   */
  toString() {
    /**
     * Helper function to get the stack trace.
     * @returns {string} - Stack trace.
     */
    const getStack = () => {
      if (this.__safety) return this.__safety.stack;
      return this._stack || this.stack;
    };

    /**
     * Helper function to append stack details to the message.
     * @param {string} stack - Stack trace.
     * @returns {string} - Message with stack details.
     */
    const detailsWithStack = stack => {
      return `${this.getErrorMessage()}\nStack:\n    ${stack}`;
    };

    // Determine whether to include stack details.
    const stack = this.showStack ? detailsWithStack(getStack()) : '';
    const msg = stack || this.getErrorMessage();

    // Format the final error message.
    return formatMessage(msg, this);
  }
}

/**
 * Format the error message with styling.
 * @param {string} msg - Error message.
 * @param {object} { name, plugin } - Additional information about the error.
 * @returns {string} - Formatted error message.
 */
function formatMessage(msg, { name, plugin }) {
  const sig = `${red(name)} in plugin "${cyan(plugin)}"\n${msg}`;
  return sig;
}

/**
 * Set default options and merge with provided options.
 * @param {string|object} plugin - The name of the plugin or an object representing the error.
 * @param {string|Error} message - The error message or an instance of Error.
 * @param {object} [opts={}] - Additional options for configuring the error.
 * @returns {object} - Merged options object.
 */
function setDefaults(plugin, message, opts = {}) {
  // Default options.
  const mergedOpts = {
    showStack: false,
    showProperties: true,
    ...opts
  };

  if (typeof plugin === 'object') {
    // If the plugin is an object, return a shallow merge with default options.
    return { ...mergedOpts, ...plugin };
  }

  if (message instanceof Error) {
    // If the message is an instance of Error, set it as the 'error' property in options.
    mergedOpts.error = message;
  } else if (typeof message === 'object') {
    // If the message is an object, merge it with the options.
    Object.assign(mergedOpts, message);
  } else {
    // If the message is a string, set it as the 'message' property in options.
    mergedOpts.message = message;
  }

  // Set the 'plugin' property in options.
  mergedOpts.plugin = plugin;
  return mergedOpts;
}

/**
 * Validate required properties to ensure they are present.
 * @param {object} error - The error object to validate.
 * @throws {Error} - Throws an error if required properties are missing.
 */
function validateProperties(error) {
  if (!error.plugin) {
    throw new Error('Missing plugin name');
  }
  if (!error.message) {
    throw new Error('Missing error message');
  }
}
