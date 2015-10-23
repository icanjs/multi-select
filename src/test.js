import QUnit from 'steal-qunit';
import * as MultiSelect from './multi-select';
import $ from 'jquery';

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

  assert.deepEqual(item, {value: 'one', text: 'One', isSelected: false}, 'Should create item from OPTION');
});

QUnit.test('getItems', function(assert) {
  var nodeList = $('<div><option value="1">One</option><option value="2" selected>Two</option>123<span>456</span></div>')[0].children,
    items = MultiSelect.getItems(nodeList);

  assert.deepEqual(items, [{value: '1', text: 'One', isSelected: false},{value: '2', text: 'Two', isSelected: true}], 'Should create items from a node list');
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
    {label: 'First', id: 1, checked: false},
    {label: 'Second', id: 2, checked: false},
    {label: 'Third', id: 3, checked: true}
  ];
  var mapped = MultiSelect.mapItems(data, 'id', 'label', 'checked');
  var expected = [
    {isSelected: false, text: 'First', value: 1},
    {isSelected: false, text: 'Second', value: 2},
    {isSelected: true, text: 'Third', value: 3},
  ];
  assert.deepEqual(mapped, expected, 'Properties were mapped correctly.');
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
