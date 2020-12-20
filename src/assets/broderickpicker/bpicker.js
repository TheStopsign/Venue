import methods from './methods';

// TODO - make this so after rows you can pass in a date to start at
// so when you destroy a picker (checkin) the data gets transfered the right way

class BroderickPicker {
    // This method gets called upon the new Picker() request
    constructor(id, options) {

      var broderickpicker = document.createElement('BroderickPicker');
      this.id = id;
      this.options = {};
      if (options != null) {
        this.options.rows = options.rows;
        this.options.date = options.date;
      }

      //console.log(this.options.date);
      
      if (this.id == null) {
        throw new Error('A picker must be instatiated with an ID')
      }
      if (this.options.rows == null) {
        this.options.rows = 5
      }
      var pickerdiv = document.querySelector(this.id);
      var bpickers = pickerdiv.getElementsByTagName('broderickpicker');
      if (bpickers.length >= 1) {
        if (this.options.date != null) {
          this.setDate(this.options.date);
        }
        return null
      }
  
      var innerdiv = document.createElement('div');
      innerdiv.setAttribute('class', 'picker picker-open picker-opened');
      innerdiv.setAttribute('data-picker-action', 'hide');
      innerdiv.setAttribute('touch-action', 'none');
      innerdiv.setAttribute('tab-index', -1);
      innerdiv.setAttribute('role', 'dialog');
  
      var innerStyleDiv = document.createElement('div');
      innerStyleDiv.setAttribute('class', 'picker-dialog');
      innerStyleDiv.setAttribute('role', 'document');
  
      var innerNumbersDiv = document.createElement('div');
      innerNumbersDiv.setAttribute('class', 'picker-body');
  
      var headersDiv = document.createElement('div');
      headersDiv.setAttribute('class', 'picker-grid picker-multiple picker-controls picker-headers');
      
      var yearCol = this.generateCol('year');
      headersDiv.appendChild(yearCol);
      var monthCol = this.generateCol('month');
      headersDiv.appendChild(monthCol);
      var dayCol = this.generateCol('day');
      headersDiv.appendChild(dayCol);
      var hrCol = this.generateCol('hour');
      headersDiv.appendChild(hrCol);
      var minCol = this.generateCol('minute');
      headersDiv.appendChild(minCol);
  
      innerNumbersDiv.appendChild(headersDiv);
      innerStyleDiv.appendChild(innerNumbersDiv);
      innerdiv.appendChild(innerStyleDiv);

      broderickpicker.appendChild(innerdiv)
  
      pickerdiv.appendChild(broderickpicker);

      this.init();


      //console.log(this.id.slice(1));
      //this.initPickerClicker(this.id.slice(1));

      return this;

    }

    init() {
      methods.initPickerClicker(this.id.slice(1));
    }

    pick = function() {
      console.log('this will get called upon broderickpicker.pick()')
      let date = methods.returnSelectedAsDate(this.id.slice(1));
      console.log('the return value is ' + date);

      return date;
    }

    destroy = function() {
      console.log(this.id);
      var pickerdiv = document.querySelector(this.id);
      if (pickerdiv != null) {
        var bpickers = pickerdiv.getElementsByTagName('broderickpicker');
        bpickers.forEach(bpicker => {
          bpicker.remove();
        })
        console.log(bpickers);
      }
    }

    setDate = function(date) {
      this.destroy();
      if (date != null) {
        this.options.date = date;
      }
      this.constructor(this.id, this.options);      
    }

    // needs to have a pick() function that returns the selected date
  
    wrapAround(hov_section, new_value) {
        let fix_const = this.fix_const;
        let min_val = this.min_year;
        let max_val = this.max_year;
        let maxDays = this.daysInSelectedMonth;
        if (hov_section == 'year') {
          new_value = new_value > max_val ? new_value - fix_const : new_value < min_val ? new_value + fix_const : new_value;
        }
        if (hov_section == 'month') {
          //console.log('this is called and the value is: ' + new_value)
          new_value = new_value == 0 ? 12 : new_value
          new_value = new_value == 13 ? 1 : new_value
        }
        if (hov_section == 'day') {
          new_value = new_value == 0 ? maxDays : new_value
        }
        if (hov_section == 'hour' || hov_section == 'minute') {
          new_value = new_value == -1 && hov_section == 'minute' ? 59 : new_value == -1 && hov_section == 'hour' ? 23 : new_value 
          new_value = new_value == 60 && hov_section == 'minute' ? 0 : new_value == 24 && hov_section == 'hour' ? 0 : new_value 
        }
        return new_value
    }
  
    generateCol(type) {
      var Col = document.createElement('div');
      Col.setAttribute('data-type', type);
      let token = type == 'year' ? 'YYYY' : type == 'month' ? 'MM' : type == 'day' ? 'DD' : type == 'hour' ? 'HH' : 'mm'
      Col.setAttribute('data-token', token);
      Col.setAttribute('class', 'picker-cell picker-' + type + 's');
  
      var colHeader = document.createElement('div');
      colHeader.setAttribute('class', 'picker-cell__header');
      colHeader.innerHTML = type.charAt(0).toUpperCase() + type.slice(1);
  
      var upBtn = document.createElement('div');
      upBtn.setAttribute('class', 'picker-cell__control picker-cell__control--prev');
      upBtn.setAttribute('data-picker-action', 'prev');
  
      var dwnBtn = document.createElement('div');
      dwnBtn.setAttribute('class', 'picker-cell__control picker-cell__control--next');
      dwnBtn.setAttribute('data-picker-action', 'next');
  
      Col.appendChild(colHeader);
      Col.appendChild(upBtn);
      Col.appendChild(this.generateList(type));
      Col.appendChild(dwnBtn);
  
      return Col;
    }
  
    generateList(col) {
      var today;
      if (this.options.date == null) {
        today = this.getToday(new Date());
      } else {
        today = this.getToday(this.options.date);
      }
      console.log('initializing a picker with a date of ' + today)
      var listdiv = document.createElement('div');
      listdiv.setAttribute('class', 'picker-cell__body');
  
      var startval = col == 'year' ? today[0] : col == 'month' ? today[1] : col == 'day' ? today[2] : col == 'hour' ? today[3] : col == 'minute' ? today[4] : 0
  
      var list = document.createElement('ul');
      list.setAttribute('class', 'picker-list');
      list.setAttribute('style', 'top: 0px;');
  
      var mid = Math.ceil(this.options.rows / 2);
      
      for (var i = 0; i < this.options.rows + 2; i++) {
        let li = document.createElement('li')
        li.setAttribute('data-name', col);
        let style = (i - mid) == 0 ? 'picker-item picker-picked' : 'picker-item'
        li.setAttribute('class', style);
        let val = this.wrapAround(col, startval + (i - mid));
        console.log('1st : ' + val)
        val = this.stringify(val);
        console.log(val)
        li.setAttribute('data-value', val);
        li.innerHTML = val;
        list.appendChild(li);
      }
  
      listdiv.appendChild(list);
  
      return listdiv;
  
    }
  
    stringify(number) {
      return number < 10 ? '0' + String(number) : String(number);
    }
  
    getToday(today) {
      return [today.getFullYear(), today.getMonth() + 1, today.getDate(), today.getHours(), today.getMinutes()]
    }
}
export default BroderickPicker;