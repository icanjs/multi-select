import can from 'can';
import './styles.less!';
import template from './template.stache!';
import VM from './view-model';

can.Component.extend({
  tag: 'multi-select',
  template: template,
  viewModel: VM,
  helpers:{
    isSelected(pos){
      pos = typeof pos === 'function' ? pos() : pos;
      return this.isItemSelected(pos) ? 'checked' : '';
    }
  }
});