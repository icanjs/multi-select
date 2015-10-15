import can from 'can';
import 'can/map/define/';
import './styles.less!';
import template from './template.stache!';

export const VM = can.Map.extend({
  define: {
    /**
     * Source list of items for select options passed from parent context.
     */
    list: {
      value: []
    },
    /**
     * Internal list of items for select options
     */
    _list: {
      value: []
    },
    /**
     * List contains selected items of this._list
     */
    selected: {
      get(){
        return this.attr('_list').filter(item => item.attr('isSelected'));
      }
    },
    selectedValues: {
      get(){
        return [].map.call(this.attr('selected'), function(item){ return item.value});
      }
    },
    /**
     * Flag to show/hide list of items
     */
    isOpened: {
      type: 'boolean',
      value: false
    },
    /**
     * MutationObserver to updated _list on new items rendered in content.
     */
    observer: {
      type: '*'
    }
  },
  select(item){
    item.attr('isSelected', !item.attr('isSelected'));
  },
  toggle(){
    this.attr('isOpened', !this.attr('isOpened'));
  },
  initList(items){
    if (items){
      this.attr('_list').replace(items);
    } else if (this.attr('list.length')) {
      [].push.apply(this.attr('_list'), this.attr('list'));
    }
  },
  addItem(item){
    this.attr('_list').push(item);
  },
  removeItem(item){
    var pos = [].reduce.call(this.attr('_list'), function(acc, _item, i){
      return _item.value === item.value ? i : acc;
    }, -1);
    this.attr('_list').splice(pos, 1);
  }
});

export default can.Component.extend({
  tag: 'multi-select',
  template: template,
  viewModel: VM,
  events: {
    inserted(el, ev){
      var self = this;
      this.viewModel.initList(getItems(el.find('option')));

      var target = el.find('.orig-options')[0];

      // Observe changes of the DOM option list:
      var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          getItems(mutation.addedNodes).forEach(option => self.viewModel.addItem(option));
          getItems(mutation.removedNodes).forEach(option => self.viewModel.removeItem(option));
        });
      });

      // configuration of the observer:
      var config = { childList: true };

      // pass in the target node, as well as the observer options
      observer.observe(target, config);

      this.viewModel.attr('observer', observer);
    },
    removed(){
      //stop observing
      this.viewModel.attr('observer').disconnect();
    }
  }
});

export function getItems(nodeList){
  return makeArr(nodeList)
    .filter(node => node.nodeName === "OPTION")
    .map(option => getItemFromOption(option));
}
export function getItemFromOption(el){
  var $el = $(el);
  return {value: $el.val(), text: $el.text()};
}
export function makeArr(arrayLike){
  return [].slice.call(arrayLike);
}