[![Build Status](https://travis-ci.org/ilyavf/multi-select.svg?branch=master)](https://travis-ci.org/ilyavf/multi-select)
[![npm version](https://badge.fury.io/js/multi-select.svg)](https://badge.fury.io/js/multi-select)

# A multi-select component for CanJS

[![NPM](https://nodei.co/npm/multi-select.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/multi-select/)

## Installation
```
npm install multi-select --save
```

You can use any of the builds in the dist folder to meet your project needs.

Using CanJS's built-in support for StealJS, you can now import the module directly inside your templates.  For example:
```html
<can-import from="multi-select"/>

<multi-select select-all>
  <option value="1">One</option>
  <option value="2">Two</option>
  <option value="3" selected>Three</option>
</multi-select>

<multi-select select-all="all" selected="{selectedItems}">
  {{#each items}}
    <option value="{{value}}">{{text}}</option>
  {{/each}}
</multi-select>

```

## Usage


## API

- list: a list of items to use if no <option> tags are rendered inside the component.
- selectAll: show "Select All" option. If value "default" is passed then all options will be preselected.
- selectAllText: string to be shown for "Select All" option.
- allSelectedText: string to be shown when all items are selected.
- valueProp: property name to look up for value.
- textProp: property name to look up for text.
- selectedProp: property name to look up to check if item should be preselected.


## Contributing
Pull requests are welcome.

## Author

- [Marshall Thompson](https://github.com/marshallswain)
- [Ilya Fadeev](https://github.com/ilyavf)

[![Built with StealJS](./dist/build-with-stealjs.jpg)](http://StealJS.com)

