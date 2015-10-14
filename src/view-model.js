import can from 'can';
import 'can/map/define/';

let VM = can.Map.extend({
  define: {
    /**
     * List of items for select options
     */
    list: {
      value: []
    },
    /**
     * List contains selected items of this.list
     */
    selected: {
      value: []
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
    var pos = this.selected.indexOf(item);
    if (pos === -1){
      this.selected.push(item);
    } else {
      this.selected.splice(pos, 1);
    }
  },
  toggle(){
    this.attr('isOpened', !this.attr('isOpened'));
  },
  isItemSelected(pos){
    pos = typeof pos === 'function' ? pos() : pos;
    var item = this.list[pos];
    return this.attr('selected').indexOf(item) !== -1;
  }
});

export default VM;