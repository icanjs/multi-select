import can from 'can';
import 'can/map/define/';
import './styles.less!';
import template from './template.stache!';

export const VM = can.Map.extend({
  define: {
    // API:
    /**
     * Option to turn on "Select All" checkbox.
     */
    selectAll: {
      value: false,
      set(val){
        if (val === '' || val === 'true' || val === true){
          return true;
        }
        return false;
      }
    },
    /**
     * Option to provide a text of "Select All" checkbox.
     */
    selectAllText: {
      value: 'Select All'
    },
    /**
     * Option to provide a text for label when all items are selected.
     */
    allSelectedText: {
      value: 'All Selected'
    },
    /**
     * Option to provide a property name where value should be retrieved from.
     */
    valueProp: {
      value: 'value'
    },
    /**
     * Option to provide a property name where text should be retrieved from.
     */
    textProp: {
      value: 'text'
    },


    areAllSelected: {
      value: false,
      get(){
        return this.attr('_list.length') === this.attr('selected.length');
      },
      set(val){
        if (!this.attr('_list.length')){
          return val;
        }
        can.batch.start();
        this.attr('_list').each(item => {
          item.attr('isSelected', val);
        });
        can.batch.stop();
        return val;
      }
    },


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
  close(){
    this.attr('isOpened', false);
  },
  initList(items){
    if (items && items.length){
      this.attr('_list').replace(items);
    } else if (this.attr('list.length')) {
      [].push.apply(this.attr('_list'), mapItems(this.attr('list'), this.attr('valueProp'), this.attr('textProp')));
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

    /**
     * Destroy the Mutation Observer when this component is torn down.
     */
    removed(){
      //stop observing
      this.viewModel.attr('observer').disconnect();
    },

    '{document} click': function(el, ev){
      if($(this.element).has(ev.target).length === 0){
        this.viewModel.close();
      }

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
export function mapItems(list, valProp, textProp){
  return [].map.call(list, function(item){
    return new can.Map({
      value: item[valProp],
      text: item[textProp]
    });
  });
}