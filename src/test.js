import QUnit from 'steal-qunit';
import * as MultiSelect from './multi-select';

var vm = new MultiSelect.VM({
  list: ['Testing 123']
});

QUnit.module('Initialize multi-select');

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