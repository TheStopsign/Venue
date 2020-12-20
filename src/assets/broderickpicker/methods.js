export default {
  daysInCurrentMonth(selected_month, selected_year) {
    this.daysInSelectedMonth = new Date(selected_year, selected_month + 1, 0).getDate();
    return new Date(selected_year, selected_month + 1, 0).getDate();
  },
  currentYear() {
    var year = new Date();
    return year.getFullYear();
  },   
  calcMinMaxYear() {
    let year = this.currentYear;
    this.max_year = year() + 3;
    this.min_year = year() - 3;
    this.fix_const = (this.max_year - this.min_year) + 1
    console.log(this.min_year)
    console.log(this.max_year)
    console.log(this.fix_const)
  },
  windowScrollHandler() {
    var ext_scroll = false;
    var ext_scroll_timeout = null;
    window.onscroll = function() {
        ext_scroll = true;
        console.log(ext_scroll)
        if (ext_scroll_timeout != null) {
          clearTimeout(ext_scroll_timeout)  
        }        
        ext_scroll_timeout = setTimeout(function() {
          ext_scroll = false;
          console.log(ext_scroll)
        }, 66);
    }
    return ext_scroll
  },
  // Appropriate wrap around based on section
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
    console.log('wraparound was indeed called, new value is: ' + new_value);
    return new_value
  },
  buildArrayofYears(options, hov_section) {
    var values = []
    for (let option of options) {
      let style = option.getAttribute('class');
      let section = option.getAttribute('data-name')
      if (section == hov_section) {
        values.push(option.innerHTML)
        if (style == 'picker-item picker-picked') {
          var selected_value = option.innerHTML;
        }
      }
    }
    console.log('this one returns: ' + values, selected_value)
    return [values, selected_value]
  },
  calcHoveredValue(values, dir, selected_value) {
    console.log(values);
    var hovered_value;
    
    for (var i = 0; i < values.length; i++) {
      if (values[i] == selected_value) {
        try {
          hovered_value = dir ? values[i-1] : values[i+1] 
        } catch (ArrayIndexOutOfBoundsException) {
          hovered_value = dir ? values[i] - 1 : values[i] + 1
        }
      }
    }
    console.log(hovered_value);
    return hovered_value             
  },
  calcNewYearCol(options, hovered_value, selected_value, hov_section, dir) {
    let updateDays = this.correctDays.bind(this);
    let fixMonths = this.fixMonths.bind(this);
    
    let wrapAround = this.wrapAround.bind(this);
    let calcNewValue = this.calcNewValue.bind(this);        
    var old_days = []
    var months = []
    for (let option of options) {
      var section = option.getAttribute('data-name');
      if (section == hov_section) {
        console.log('hov', hov_section);
        console.log('sel', selected_value);
        var new_value = calcNewValue(section, hovered_value, selected_value, option.innerHTML)
        if (new_value % 1 != 0) {
          // Ceil for scroll up floor for scroll down
          new_value = dir ? Math.ceil(new_value) : Math.floor(new_value)
        }
        //new_value = dir ? new_value - 1 : new_value + 1

        if (hov_section == 'month') {
          months.push(new_value);
        }

        new_value = wrapAround(hov_section, new_value);
        
        if (new_value < 10 && new_value > -1) {
          new_value = '0' + String(new_value)
        }
        console.log('we are in calcnewyearcol and new_val is -> ' + new_value)
        option.innerHTML = String(new_value)
        option.setAttribute('data-value', String(new_value))
      }
      if (hov_section == 'month' && section == 'day' || (hov_section == 'year' && section == 'day') || hov_section == 'day') {
        old_days.push(option.innerHTML);
      }
    }
    if (hov_section == 'year' || hov_section == 'month') { 
      updateDays(old_days, options);
    }
    if (hov_section == 'month') {
      fixMonths(months, options);
    }
  },
  yearColScrollClickHandler(options, dir, hov_section) {
    let buildYearArray = this.buildArrayofYears.bind(this);
    let calcHovVal = this.calcHoveredValue.bind(this);
    let newYearCol = this.calcNewYearCol.bind(this);
    
    // We'll use an array so we can always get the right value
    var values = buildYearArray(options, hov_section)[0];
    var selected_value = buildYearArray(options, hov_section)[1];
    var hovered_value;
    console.log('deltaY', event.deltaY)
    hovered_value = calcHovVal(values, dir, selected_value);

    console.log('dir: ', dir)
    console.log('hov: ', hovered_value)
    console.log('sel: ', selected_value)

    newYearCol(options, hovered_value, selected_value, hov_section, dir);
  },
  initPickerClicker(picker) {

    this.max_year = null,
    this.min_year = null,
    this.fix_const = null,
    this.daysInSelectedMonth = null

    this.calcMinMaxYear();

    let today = new Date();
    let daysInSelectedMonth = this.daysInCurrentMonth(this.currentYear(), today.getMonth() + 1);
    //let initPickerClicker = this.initPickerClicker.bind(this);

    this.daysInSelectedMonth = daysInSelectedMonth;

    console.log('set days in selected month to: ' + daysInSelectedMonth)

    //let ext_scroll = this.windowScrollHandler;
    //let setAllowLiveSubmissions = this.setAllowLiveSubmissions;
    let optionClickEvent = this.optionClickEvent.bind(this);
    let yearCol = this.yearColScrollClickHandler.bind(this);

    var pickerToInit = document.getElementById(picker);    
    var options = pickerToInit.getElementsByTagName("li");
    var arrow_buttons = pickerToInit.getElementsByClassName('picker-cell__control');

    console.log('arrow buttons -> ' + arrow_buttons);

    // Custom scroll listener for year column
    for (let option of options) {
      option.onmouseover = function() {
        this.mouse = true;
        console.log('disabling scroll')
        disableScroll();
      };
      option.onmouseout = function() {
        this.mouse = false;
        console.log('re-enabling scroll')
        enableScroll();
      };
      let section = option.getAttribute('data-name');
        // Year column scroll event
      option.onwheel = function(event) {
        console.log('you are scrolling on the div')
        if (Number(event.deltaY) > 0) {
          dir = false;
        } else {
          dir = true;
        }
        yearCol(options, dir, section);
      };
      option.onclick = function() {
        optionClickEvent(options);
      };
    }
    // Down button should lead will call with false and up buttons with true
    var dir;
    for (var i = 0; i < arrow_buttons.length; i++) {
      let section = i < 2 ? 'year' : i < 4 ? 'month' : i < 6 ? 'day' : i < 8 ? 'hour' : i < 10 ? 'minute' : null 
      console.log('arrow_button section -> ' + section)
      // The top button is identical to scrolling up
      if (i == 0 || i % 2 == 0) {
        arrow_buttons[i].onclick = function() {
          yearCol(options, true, section);
        }
      } else {
        arrow_buttons[i].onclick = function() {
          yearCol(options, false, section);
        }
      }
      console.log('i is: ' + i + ' and dir is ' + dir)
      
    }
    
    // left: 37, up: 38, right: 39, down: 40,
    // spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
    var keys = {37: 1, 38: 1, 39: 1, 40: 1};

    function preventDefault(e) {
      e.preventDefault();
    }

    function preventDefaultForScrollKeys(e) {
      if (keys[e.keyCode]) {
        preventDefault(e);
        return false;
      }
    }

    // modern Chrome requires { passive: false } when adding event
    var supportsPassive = false;
    try {
      window.addEventListener("test", null, Object.defineProperty({}, 'passive', {
        get: function () { supportsPassive = true; } 
      }));
    } catch(e) {}

    var wheelOpt = supportsPassive ? { passive: false } : false;
    var wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';

    // call this to Disable
    function disableScroll() {
      console.log('disable')
      window.addEventListener('DOMMouseScroll', preventDefault, false); // older FF
      window.addEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
      window.addEventListener('touchmove', preventDefault, wheelOpt); // mobile
      window.addEventListener('keydown', preventDefaultForScrollKeys, false);
    }

    // call this to Enable
    function enableScroll() {
      console.log('enable')
      window.removeEventListener('DOMMouseScroll', preventDefault, false);
      window.removeEventListener(wheelEvent, preventDefault, wheelOpt); 
      window.removeEventListener('touchmove', preventDefault, wheelOpt);
      window.removeEventListener('keydown', preventDefaultForScrollKeys, false);
    }
    // TODO - scrolling resets values set by clicking on other columns
    // I believe this has something to do with how PickerJS refreshes as it usually resets to current date
  },
  optionClickEvent(options) {
    let calcNewValue = this.calcNewValue.bind(this);
    let updateDays = this.correctDays.bind(this);
    for (let option of options) {
      if (option.mouse) {
        var hovered_value = option.innerHTML;
        var hovered_section = option.getAttribute('data-name');
      }
    }
    for (let option of options) {
      let style = option.getAttribute('class');
      let section = option.getAttribute('data-name')
      if (section == hovered_section && style == 'picker-item picker-picked') {
        var selected_value = option.innerHTML;
      }
    }

    var old_days = []
    for (let option of options) {
      var section = option.getAttribute('data-name');
      if (section == hovered_section) {
        console.log('hov', hovered_value);
        console.log('sel', selected_value);
        var new_value = calcNewValue(section, hovered_value, selected_value, option.innerHTML)
        if (new_value < 10 && new_value > -1) {
          new_value = '0' + String(new_value)
        }
        option.innerHTML = String(new_value)
        option.setAttribute('data-value', String(new_value))
      }
      if (hovered_section == 'month' && section == 'day' || (hovered_section == 'year' && section == 'day') || hovered_section == 'day') {
        old_days.push(option.innerHTML);
      }
    }
    if (hovered_section == 'year' || hovered_section == 'month') {
      updateDays(old_days, options);
    }
  },
  fixMonths(months, options) {
    let wrapAround = this.wrapAround.bind(this);
    if (months[1] - months[0] == 0 || months[6] - months[5] == 2 || months.includes(0) || months.includes(11)) {
      for (var i = 0; i < months.length - 1; i++) {
        let diff = months[i+1] - months[i]
        console.log('diff: ' + diff)
        if (diff == 0) {
          months[i] -= 1
        }
        if (diff == 2) {
          months[i+1] -= 1
        }
        if (diff == -10) {
          months[i+1] += 11
        }
      }
      console.log(months)
      var mo_index = 0
      for (let option of options) {
        let section = option.getAttribute('data-name');
        if (section == 'month') {
          let new_value = months[mo_index]
          new_value = wrapAround('month', new_value);
          if (new_value < 10 && new_value > -1) {
          new_value = '0' + String(new_value)
          }
          option.innerHTML = String(new_value)
          option.setAttribute('data-value', String(new_value))
          mo_index += 1
        }
      }
    }
  },
  // Correct days based on selected month 
  correctDays(days, options) {
    // PARSE THRU DAYS AND UPDATE IF NEEDED
    let getSelected = this.getAllSelectedValues.bind(this);

    let all = getSelected(options);

    let selected_month = all[1];
    let selected_year = all[0];
    let selected_day = all[2];

    console.log(days)
    console.log(days.includes("08"));
    console.log('all is -> ' + all);
    console.log('month', selected_month, 'day', selected_day, 'year', selected_year);
    let daysInSelectedMonth = this.daysInCurrentMonth.bind(this);
    let daysInCurrentMonth = this.daysInSelectedMonth;
    let maxDays = daysInSelectedMonth(Number(selected_month) - 1, Number(selected_year));
    let month_offset = maxDays - daysInCurrentMonth;
    daysInCurrentMonth = maxDays;
    console.log('updated daysInCurrentMonth to ' + daysInCurrentMonth);
    console.log('mo offset: ' + month_offset);
    console.log('old days: ' + (daysInCurrentMonth - month_offset));
    // Update days based on max days in month
    if (Number(month_offset) != 0 && Math.abs(month_offset) < 5) {
      for (let option of options) {
        let section = option.getAttribute('data-name');
        if (section == 'day') {
          let old_day = Number(option.innerHTML);
          // If 8 is on the screen don't update because it'll throw off the whole col
          if (old_day >= 8 && (days.includes(String((daysInCurrentMonth - month_offset))) || Number(old_day) > maxDays)) {
            let new_day = Math.abs(old_day + month_offset);
            if (new_day < 10 && new_day > -1) {
              new_day = '0' + String(new_day)
            }
            option.innerHTML = String(new_day)
            option.setAttribute('data-value', String(new_day))
          }
        }
      }
    }
  },
  calcNewValue(section, hov, sel, val3) {
    //console.log(section)
    var val3 = Number(val3)
    var max = 0
    if (section == 'minute') {
      max = 59
    } 
    if (section == 'hour') {
      max = 23
    }  
    if (section == 'day') {
      // make this days in selected month
      var today = new Date();
      let daysInSelectedMonth = this.daysInSelectedMonth;
      if (daysInSelectedMonth != null) {
        max = daysInSelectedMonth;
        console.log('days in this month: ' + max);
      } else {
        max = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
        console.log('days in this month: ' + max);
      }
      max -= 1
    }
    if (section == 'month') {
      max = 11
    }
    if (section == 'year') {
      max = this.max_year;
      var min = this.min_year;
      //alert(max)
    }
    var new_num = 0
    // hov is the one with the cursor over if
    var offset = (Number(hov) - Number(sel)) 
    if (offset < -2) {
      offset += (max + 1)
    }
    if (offset > 2) {
      offset -= (max + 1)
    }

    // offset is -4 when selected is 2023 and picked is 2018
    console.log('offset: ' + offset)
    
    new_num = val3 + offset
    console.log('new num: ' + new_num)

    if (new_num > max && max != 0) {
      new_num = (new_num % max) - 1
    } 
    if (new_num < 0) {
      new_num += (max + 1)
    }
    // TODO - make this have a max span of 5 years
    if (section == 'year') {
      var fix = this.fix_const
      if (offset < -2 && offset > -min) {
        //alert('called' + offset)
        if (new_num < 10) {
          new_num += (min + 1)
          console.log('this')
          return new_num
        }
        new_num -= fix
      }
      if (offset < -min) {
        if (new_num < 20) {
          new_num += min - fix
          //console.log('this')
        }
        if (new_num < 1500) {
          new_num += 1000 + Math.floor(fix / 2)
          //console.log('that')
        }
        if (new_num < min) {
          new_num += fix
          //console.log('i was totally wrong')
        }
        console.log('called')
      }
      // If we've gone past max (2023) loop back around to min
      if (new_num < 10) {
        new_num += min
      }
      // If we've gone past min (2018) loop back around to max
      if (new_num < min) {
        //fix = 6
        new_num += fix
      }
      // going from 2022 to 2023 (downwards) goes back to 2021
      /*if (offset == 1) {
        alert('stuff')
      }*/
      // Correct numbers out of range
      if (new_num > max) {
        new_num -= fix
      } 
    } 
    if (section == 'month' && new_num == 0) {
      new_num = 12
    }
    if (section == 'day' && new_num == 0) {
      new_num = (max + 1)
    }
    if (section == 'year' && new_num < min) {
      new_num += fix
    }

    return new_num
  },
  getAllSelectedValues(options) {
    for (let option of options) {
      let section = option.getAttribute('data-name');
      let style = option.getAttribute('class');
      if (section == 'month' && style == 'picker-item picker-picked') {
        var selected_month = option.innerHTML
        console.log('sel month : ' + selected_month)
      }
      if (section == 'day' && style == 'picker-item picker-picked') {
        var selected_day = option.innerHTML
        console.log('sel_day: ' + selected_day)
      }
      if (section == 'year' && style == 'picker-item picker-picked') {
        var selected_year = option.innerHTML
        console.log('sel_year: ' + selected_year)
      }
      if (section == 'hour' && style == 'picker-item picker-picked') {
        var selected_hour = option.innerHTML
        console.log('sel_hour: ' + selected_hour)
      }
      if (section == 'minute' && style == 'picker-item picker-picked') {
        var selected_minute = option.innerHTML
        console.log('sel_minute: ' + selected_minute)
      }
    }
    return [selected_year, selected_month, selected_day, selected_hour, selected_minute]
  },
  returnSelectedAsDate(id) {
    let getAllSelected = this.getAllSelectedValues.bind(this);
    let picker = document.getElementById(id);
    let options = picker.getElementsByTagName("li");
    let all = getAllSelected(options);
    let selectedDate = new Date(Number(all[0]), Number(all[1] - 1), Number(all[2]), Number(all[3]), Number(all[4]))

    console.log(selectedDate)

    return selectedDate;
  }
}