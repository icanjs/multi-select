import can from 'can';
import './styles.less!';
import template from './template.stache!';
import VM from './view-model';

can.Component.extend({
  tag: 'multi-select',
  template: template,
  viewModel: VM,
  events: {
    inserted(el, ev){
      console.log('inserted', el);
      this.viewModel.initList(el.find('option').map(function(i, el){
        var $el = $(el);
        return {value: $el.val(), text: $el.text()};
      }));
      // TODO: https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
    }
  }
});