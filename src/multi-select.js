import can from 'can';
import 'can/map/define/';
import 'can-control-processor-capture';
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
        if (val === 'default'){
          return 'default';
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
    * Option to provide a text for label when all items are selected. By default,
    * if only a single value is available in the list, when it's checked it will
    * show that value in the multi-select's main container.  If you pass a value
    * in the , it will show that value.
    */
    allSelectedText: {
     get(lastSetVal){
       let list = this.attr('_list');
       if (list && list.attr('length') === 1 && !lastSetVal) {
         return this.attr('_list.0.text');
       }
       return lastSetVal || 'All Selected';
     }
    },
    /**
     * Option to provide a value for _selectedValues_ when _areAllSelected_ is true.
     * In this case the option with this value will be filtered out from the _list_,
     * and this value wrapped in an array will be returned.
     * ```
     *    <multi-select select-all all-selected-value="-1" {items}="items" {^selected-values}="selectedValues"></multi-select>
     *
     *    vm.attr('selectedValues') will return [-1] in case all options are selected.
     * ```
     */
    allSelectedValue: {
      value: null
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
    /**
     * Option to provide a property name where isSelected should be defined off.
     */
    selectedProp: {
      value: 'isSelected'
    },
    /**
     * Option to provide a property name where isDisabled should be defined off.
     */
    disabledProp: {
      value: 'isDisabled'
    },
    /**
     * Option to provide item click event name. This will be fired on the viewModel or for can-2.2 on both viewModel and element.
     */
    clickEventName: {
      value: 'itemclick'
    },

    areAllSelected: {
      get(){
        return this.attr('_list.length') === this.attr('selected.length');
      },
      set(val){
        if (!this.attr('_list.length')){
          return val;
        }
        can.batch.start();
        this.attr('_list').each(item => {
          if (!item.attr('isDisabled')){
            item.attr('isSelected', val);
          }
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
     * @return {can.List} List of selected items.
     */
    selected: {
      get(){
        return this.attr('_list').filter(item => item.attr('isSelected'));
      }
    },
    /**
     * Will return [<allSelectedValue>] if _all-selected-value_ is specified.
     * @return {array} Array of selected values.
     */
    selectedValues: {
      get: function(){
        var prevValues = this.prevValues;
        var selectedValues = [].map.call(this.attr('selected'), item => item.attr('value'));
        if (this.attr('areAllSelected') && this.attr('allSelectedValue') !== null){
          selectedValues = [this.attr('allSelectedValue')];
        }
        if (prevValues && deepEqual(prevValues, selectedValues)) {
          return prevValues;
        }
        this.prevValues = selectedValues;
        return selectedValues;
      }
    },
    /**
     * @return {array} Array of selected items (original from list if passed, or the same as _selected_.
     */
    selectedItems: {
      get(){
        return [].map.call(this.attr('selected'), item => {
          return item.attr('_item') || item;
        });
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
    var data = [{
      value: item.attr('value'),
      isSelected: item.attr('isSelected'),
      selectedValues: this.attr('selectedValues')
    }];
    var eventName = this.attr('clickEventName');
    if (this.dispatch){
      // for can-2.3 and newer:
      this.dispatch(eventName, data);
    } else {
      // for older can versions:
      // trigger on the viewModel:
      can.event.dispatch.call(this, eventName, data);
      // trigger DOM event on the element to be captured on the parent component with "events: {'multi-select itemclick': function(){} }":
      this.el.trigger(eventName, data);
    }
  },
  toggle(){
    this.attr('isOpened', !this.attr('isOpened'));
  },
  close(){
    this.attr('isOpened', false);
  },
  /**
   * Main init function for internal _list.
   * @param {can.List} items
   */
  initList(items){
    var mappedItems;

    // filter out allSelectedValue:
    if (this.attr('allSelectedValue') !== null){
      var allSelectedValue = this.attr('allSelectedValue');
      items = items.filter(item => item.value !== allSelectedValue);
    }

    // If no template content with <option> tags then get items from list:
    if (!items || !items.length){
      items = mapItems(this.attr('list'), this.attr('valueProp'), this.attr('textProp'), this.attr('selectedProp'), this.attr('disabledProp'));
    }
    // Preselect all:
    if (this.attr('selectAll') === 'default'){
      mappedItems = items.map(item => { return item.isSelected = true, item; });
    } else {
      mappedItems = items;
    }
    this.attr('_list').replace(mappedItems);
  },
  addItem(item){
    this.attr('_list').push(item);
  },
  removeItem(item){
    var pos = [].reduce.call(this.attr('_list'), function(acc, _item, i){
      return _item.value === item.value ? i : acc;
    }, -1);
    this.attr('_list').splice(pos, 1);
  },
  moreThanOneItem(){
    let list = this.attr('_list');
    return list && list.length > 1;
  }
});



export default can.Component.extend({
  tag: 'multi-select',
  template: template,
  viewModel: VM,
  events: {
    inserted(el, ev){
      var self = this;
      this.viewModel.el = el;
      this.viewModel.initList(getItems(el.find('option')));

      var target = el.find('.orig-options')[0];

      // Observe changes of the DOM option list:
      var observer = new MutationObserver(function(mutations) {
        //console.log('MutationObserver! mutations: ', mutations);
        mutations.forEach(function(mutation) {
          switch(mutation.type){
            case 'childList':
              getItems(mutation.addedNodes).forEach(option => self.viewModel.addItem(option));
              getItems(mutation.removedNodes).forEach(option => self.viewModel.removeItem(option));
              break;

            case 'attributes':
              var attrToProp = {
                selected: 'isSelected',
                disabled: 'isDisabled'
              };
              var itemValue = mutation.target.value,
                attrName = mutation.attributeName,
                propName = attrToProp[attrName],
                attrValue = mutation.target.getAttribute(attrName);

              if (propName){
                var item = getItemByValue(self.viewModel.attr('_list'), itemValue);
                item.attr(propName, (attrValue === null ? false : true));
                //console.log('- attribute for the item %s: %s=%s %s', itemValue, attrName, attrValue, item.attr(propName));
              }
              break;
          }
        });
      });

      // configuration of the observer:
      var config = {
        childList: true,
        attributes: true,
        subtree: true
      };

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

    '{document} click capture': function(el, ev){
      if($(this.element).has(ev.target).length === 0){
        this.viewModel.close();
      }

    }
  }
});

/**
 * Turns a nodeList list of OPTION elements into an array of data.
 * @param  {[type]} nodeList The node list containing the options.
 * @return {[type]}          An array representing the original OPTION elements.
 */
export function getItems(nodeList){
  return makeArr(nodeList)
    .filter(node => node.nodeName === "OPTION")
    .map(option => getItemFromOption(option));
}

/**
 * Makes an object for internal list out of OPTION DOM element.
 * @param {DOMNode} el
 * @returns {{value: *, text: *, isSelected: *}}
 */
export function getItemFromOption(el){
  var $el = $(el);
  return {
    value: $el.val(),
    text: $el.text(),
    isSelected: $el.is(':selected'),
    isDisabled: $el.is(':disabled')
  };
}

/**
 * Makes array from array-like structure and returns it.
 * @param arrayLike
 * @returns {Array.<T>}
 */
export function makeArr(arrayLike){
  return [].slice.call(arrayLike);
}

/**
 * Maps value, text, and isSelected to attributes that exist on the provided list of data.
 * @param  {[type]} list         The multi-select list.
 * @param  {[type]} valProp      The property where the value resides in each list item.
 * @param  {[type]} textProp     The property where the text / label resides in each list item.
 * @param  {[type]} selectedProp The property where the isChecked/Boolean resides in each list item.
 * @return {[type]}              An array of objects that contain value, text, and isSelected from
 *                               the original list.
 */
export function mapItems(list, valProp, textProp, selectedProp, disabledProp){
  if (!list || !list.length){
    return [];
  }
  return [].map.call(list, function(item, n){
    if (item[valProp] === undefined || item[valProp] === null){
      console.warn('A ' + valProp + ' property is undefined/null at index ' + n + '.');
    }
    return {
      value: item[valProp],
      text: item[textProp],
      isSelected: !!item[selectedProp],
      isDisabled: !!item[disabledProp],
      _item: item
    };
  });
}

export function deepEqual(listA, listB){
  return listA.length === listB.length && listA.reduce(function(acc, a){
      return acc && listB.indexOf(a) !== -1;
    }, true);
}

export function getItemByValue(list, value){
  return Array.prototype.reduce.call(list, function(acc, item){
    return acc || item.attr('value') === value && item;
  }, false);
}
