import QUnit from 'steal-qunit';
import * as MultiSelect from './multi-select';
import $ from 'jquery';

var vm = new MultiSelect.VM({
  list: ['Testing 123']
});

QUnit.module('Initialize multi-select');

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