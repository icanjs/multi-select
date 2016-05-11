import QUnit from 'steal-qunit';
import * as MultiSelect from './multi-select';
import 'can/map/define/';
import $ from 'jquery';
import _ from 'ramda';

var vm;

QUnit.module('multi-select', {
  beforeEach: function(){
    vm = new MultiSelect.VM({
      list: [
        {label: 'First', id: 1, checked: false},
        {label: 'Second', id: 2, checked: false},
        {label: 'Third', id: 3, checked: true}
      ]
    });
  }
});

QUnit.test('getItemFromOption', function(assert) {
  var option = $('<option value="one">One</option>'),
    item = MultiSelect.getItemFromOption(option[0]);

  assert.deepEqual(item, {value: 'one', text: 'One', isSelected: false, isDisabled: false}, 'Should create item from OPTION');
});

QUnit.test('getItems', function(assert) {
  var nodeList = $('<div><option value="1" disabled>One</option><option value="2" selected>Two</option>123<span>456</span></div>')[0].children,
    items = MultiSelect.getItems(nodeList);

  assert.deepEqual(
    items,
    [{value: '1', text: 'One', isSelected: false, isDisabled: true},{value: '2', text: 'Two', isSelected: true, isDisabled: false}],
    'Should create items from a node list');
});

QUnit.test('getItemByValue', function(assert) {
  var list = new can.List([{value: 1, text: 'One'}, {value:2, text: 'Two'}]),
    item = MultiSelect.getItemByValue(list, 2);

  assert.equal(item.attr('text'), 'Two', 'Should return item with text Two');
});

QUnit.test('makeArr', function(assert) {
  assert.ok(true, 'The amounts match');
  var arrayLike = {
    0: 0,
    1: 1,
    length: 2
  };
  var array = MultiSelect.makeArr(arrayLike);
  assert.ok(array instanceof Array, 'Should return type array');
  assert.deepEqual(array, [0,1], 'Should have correct data');
});

QUnit.test('mapItems', function(assert){
  var empty = MultiSelect.mapItems();
  assert.deepEqual([], empty, 'Got en empty array when passing no items.');

  var data = [
    {label: 'First', id: 1, checked: false, isDisabled: true},
    {label: 'Second', id: 2, checked: false, isDisabled: false},
    {label: 'Third', id: 3, checked: true, isDisabled: false}
  ];
  var mapped = MultiSelect.mapItems(data, 'id', 'label', 'checked', 'isDisabled');
  var expected = [
    {isSelected: false, text: 'First', value: 1, isDisabled: true},
    {isSelected: false, text: 'Second', value: 2, isDisabled: false},
    {isSelected: true, text: 'Third', value: 3, isDisabled: false}
  ];
  assert.deepEqual(
    _.map(_.pick(['value', 'text', 'isSelected', 'isDisabled']))(mapped),
    expected,
    'Properties should be mapped correctly.');
});


QUnit.test('Has the correct default values when providing an array on the list attribute.', function(assert){
  assert.equal(vm.attr('valueProp'), 'value', 'Default valueProp is "value".');
  assert.equal(vm.attr('textProp'), 'text', 'Default textProp is "text".');
  assert.equal(vm.attr('selectedProp'), 'isSelected', 'Default selectedProp is "isSelected".');
  assert.equal(vm.attr('selectAll'), false, 'Select all is turned off by default.');
  assert.equal(vm.attr('selectAllText'), 'Select All', 'The default selectAllText is "Select All".');
  assert.equal(vm.attr('allSelectedText'), 'All Selected', 'The default allSelectedText is "All Selected".');
});

QUnit.test('Select all functionality works.', function(assert){
  vm.attr('selectedProp', 'isSelected');
  vm.attr('selectAll', 'default');
  vm.attr('valueProp', 'id');
  vm.initList();
  assert.deepEqual(vm.attr('selectedValues'), [1, 2, 3], 'All items were selected when using the select-all="default" attribute.');
  vm.attr('areAllSelected', false);
  assert.equal(vm.attr('selectedValues').length, 0, 'All items were deselected.');
  vm.attr('areAllSelected', true);
  assert.equal(vm.attr('selectedValues').length, 3, 'All items were selected.');
});

QUnit.test('MutationObserver should listen to dynamically rendered OPTION elements', function(assert){
  var done = assert.async();

  var vm = new (can.Map.extend({
    items: [
      {id: 1, text: 'One'},
      {id: 2, text: 'Two'},
      {id: 3, text: 'Three'}
    ],
    selectedValues: []
  }))();

  var frag = can.stache('<multi-select select-all selected-values="{selectedValues}">{{#each items}}<option value="{{id}}" selected>{{text}}</option>{{/each}}</multi-select>')(vm);
  $('#qunit-fixture').append(frag);
  assert.equal(vm.attr('selectedValues.length'), 3, 'There should be three items selected');

  // Dynamically add a new item:
  vm.attr('items').push({id: 4, text: 'Four'});

  setTimeout(function(){
    assert.equal(vm.attr('selectedValues.length'), 4, 'There should be four items selected');
    done();
  }, 0);
});

QUnit.test('MutationObserver should listen to attribute updates', function(assert){
  var done = assert.async();

  var vm = new (can.Map.extend({
    items: [
      {id: 1, text: 'One', isSelected: false},
      {id: 2, text: 'Two', isSelected: true},
      {id: 3, text: 'Three', isSelected: false}
    ]
  }))();

  var frag = can.stache('<multi-select select-all   ' +
    '   {^selected-values}="selectedValues">        ' +
    '       {{#each items}}<option value="{{id}}" {{#if isSelected}}selected{{/if}}>{{text}}</option>{{/each}}' +
    '</multi-select>')(vm);

  $('#qunit-fixture').append(frag);

  assert.equal(vm.attr('selectedValues.length'), 1, 'There should be one item selected');

  vm.attr('items.0.isSelected', true);

  setTimeout(function(){
    assert.equal(vm.attr('selectedValues.length'), 2, 'There should be two items selected');
    done();
  },0);
});

QUnit.test('Test allSelectedValue', function(assert){
  var vm = new (can.Map.extend({
    items: [
      {id: -1, text: 'All'},
      {id: 1, text: 'One'},
      {id: 2, text: 'Two'},
      {id: 3, text: 'Three'}
    ],
    selectedValues: [],
    selectedItems: []
  }))();

  var frag = can.stache('<multi-select select-all                 ' +
                        '   all-selected-value="-1"               ' +
                        '   {^selected-values}="selectedValues"   ' +
                        '   {^selected-items}="selectedItems">    ' +
                        '       {{#each items}}<option value="{{id}}" selected>{{text}}</option>{{/each}}' +
                        '</multi-select>')(vm);

  $('#qunit-fixture').append(frag);

  assert.deepEqual(vm.attr('selectedValues').attr(), ['-1'], 'Select All should return [-1]');
  assert.deepEqual(vm.attr('selectedItems').attr(),
    [
      {value: "1", text: 'One', isSelected: true, isDisabled: false},
      {value: "2", text: 'Two', isSelected: true, isDisabled: false},
      {value: "3", text: 'Three', isSelected: true, isDisabled: false}
    ], 'Selected Items should exclude the All option');
});


QUnit.test('Test selectedValues to fire a change only for different values', function(assert){
  var vm = new (can.Map.extend({
    items: [
      {id: -1, text: 'All'},
      {id: 1, text: 'One'},
      {id: 2, text: 'Two'},
      {id: 3, text: 'Three'}
    ],
    selectedValues: [],
    selectedItems: []
  }))();

  var frag = can.stache('<multi-select select-all ' +
    '   all-selected-value="-1"               ' +
    '   {^selected-values}="selectedValues"   ' +
    '   {^selected-items}="selectedItems">    ' +
    '       {{#each items}}<option value="{{id}}" selected>{{text}}</option>{{/each}}' +
    '</multi-select>')(vm);

  $('#qunit-fixture').append(frag);

  assert.deepEqual(vm.attr('selectedValues').attr(), ['-1'], 'Initially selectedValues should be [-1]');

  var counter = 0;
  vm.bind('selectedValues', function(val){
    counter++;
  });

  $('multi-select:last').viewModel().attr('_list.0.isSelected', false);

  assert.equal(vm.attr('selectedValues.length'), 2, 'selectedValues.length should be changed to 2');
  assert.equal(counter, 1, 'binding should be called once (counter should be 1)');

});


QUnit.test('Select All is not visible with only one item in the list.', function(assert){
  vm = new MultiSelect.VM({
    list: [
      {label: 'First', id: 1, checked: false},
    ]
  });
  assert.equal(vm.moreThanOneItem(), false);
});

QUnit.test('When there is only one item, only the first item shows in the label.', function(assert){
  vm = new MultiSelect.VM({
    _list: [
      {text: 'First', id: 1, checked: true},
    ]
  });
  assert.equal(vm.attr('allSelectedText'), 'First');
});
