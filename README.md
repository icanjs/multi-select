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
  <option value="3">Three</option>
</multi-select>

<multi-select select-all selected="{selectedItems}" are-all-selected="{areAllSelected}">
  {{#each items}}
    <option value="{{value}}">{{text}}</option>
  {{/each}}
</multi-select>

```

## Usage


## API


## Contributing
Pull requests are welcome.

## Author

- [Marshall Thompson](https://github.com/marshallswain)
- [Ilya Fadeev](https://github.com/ilyavf)

[![Built with StealJS](./dist/build-with-stealjs.jpg)](http://StealJS.com)

