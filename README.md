[![Build Status](https://travis-ci.org/ilyavf/multi-select.svg?branch=master)](https://travis-ci.org/ilyavf/multi-select)
[![npm version](https://badge.fury.io/js/multi-select.svg)](https://badge.fury.io/js/multi-select)

# A multi-select component for CanJS

[![NPM](https://nodei.co/npm/multi-select.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/multi-select/)

## Demo

Here is a [JSBin] (http://jsbin.com/fevoje/edit?js,output) demo.

![Multi Select Demo](./dist/demo.png)

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

<multi-select select-all="all" selected-values="{selectedValues}">
  {{#each items}}
    <option value="{{value}}">{{text}}</option>
  {{/each}}
</multi-select>

<multi-select list="{items}" selected-items="{selectedItems}"></multi-select>

<multi-select list="{items}"
              value-prop="id"
              text-prop="name"
              selected-prop="isChecked"
              selected-items="{selectedItems}"
              select-all></multi-select>

```

## Usage


## API

- list: a list of items to use if no <option> tags are rendered inside the component.
- selected: an array of _selected items_ as objects with _value and text_ properties.
- selected-values: an array of _selected values_.
- selected-items: an array of selected items if items are passed as _list_.


### Options:

- select-all: show "Select All" option. If value "default" is passed then all options will be preselected.
- select-all-text: string to be shown for "Select All" option.
- all-selected-text: string to be shown when all items are selected.
- value-prop: property name to look up for value.
- text-prop: property name to look up for text.
- selected-prop: property name to look up to check if item should be preselected.


## Contributing
Pull requests are welcome.

## Authors

- [Marshall Thompson](https://github.com/marshallswain)
- [Ilya Fadeev](https://github.com/ilyavf)

[![Built with StealJS](./dist/build-with-stealjs.jpg)](http://StealJS.com)

