import can from 'can';
import 'can/map/define/';

let VM = can.Map.extend({
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
  }
});

export default VM;