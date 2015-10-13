import QUnit from 'steal-qunit';
import VM from './view-model';

var vm = new VM({
  list: ['Testing 123']
});

QUnit.module('Initialize multi-select');

QUnit.test('Test Description', function(assert) {
  ok(vm.attr('amount'), 1, 'The amounts match');
});