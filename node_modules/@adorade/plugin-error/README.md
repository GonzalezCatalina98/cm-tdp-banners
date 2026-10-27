# Plugin Error

[![NPM version](https://img.shields.io/npm/v/@adorade/plugin-error?logo=npm)](https://www.npmjs.org/package/@adorade/plugin-error)
[![GitHub package.json version](https://img.shields.io/github/package-json/v/adorade/plugin-error?color=green&logo=github)](https://github.com/adorade/plugin-error/blob/main/package.json)
[![license](https://img.shields.io/github/license/adorade/plugin-error)](https://mit-license.org)
[![Depfu Status](https://img.shields.io/depfu/dependencies/github/adorade/plugin-error)](https://depfu.com/repos/github/adorade/plugin-error)
[![GitHub Actions](https://github.com/adorade/plugin-error/workflows/Node%20CI/badge.svg)](https://github.com/adorade/plugin-error/actions)
[![Renovate enabled](https://img.shields.io/badge/renovate-enabled-brightgreen)](https://renovatebot.com/)

> Error handling for Gulp plugins with ESM support.  

This package is pure ESM. Please [read this](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c).

## Installation

```bash
npm install @adorade/plugin-error --save-dev
# Or with yarn:
yarn add @adorade/plugin-error --dev
```

## Usage

```js
import PluginError from '@adorade/plugin-error';

const err = new PluginError('test', {
  message: 'something broke',
});

const err = new PluginError({
  plugin: 'test',
  message: 'something broke',
});

const err = new PluginError('test', 'something broke');

const err = new PluginError('test', 'something broke', {
    showStack: true,      // false (default) | true
    showProperties: false // true (default) | false
});

const existingError = new Error('OMG');
const err = new PluginError('test', existingError, { showStack: true });
```

## API

`new PluginError(plugin, message[, options])`

Error constructor that takes:

- `plugin` - a `String` that should be the module name of your plugin
- `message` - a `String` message or an existing `Error` object
- `options` - an `Object` of your options

**Behavior:**

- By default the stack will not be shown. Set `options.showStack` to true if you think the stack is important for your error.
- If you pass an error object as the message the stack will be pulled from that, otherwise one will be created.
- If you pass in a custom stack string you need to include the message along with that.
- Error properties will be included in `err.toString()`, but may be omitted by including `{ showProperties: false }` in the options.

## License

See the [MIT LICENSE](LICENSE) file for license rights and limitations.
