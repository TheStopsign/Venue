/* Useful resources for testing / changing palette
http://web-accessibility.carnegiemuseums.org/design/color/ (508 compliance guidelines)
https://wave.webaim.org/ (tests accessibility of website; also a helpful Google Chrome extension)
https://imagecolorpicker.com/en/ (Select colors from pictures - provides HEX and RGB code of selected color)
https://coolors.co/ (Color palette generator)
*/

// *NOTE: if settling on using faint blue bg instead of white, change original blue (#2f7cae) in venue color notes @ bottom to #2C76B5
// #2f7cae does not work for text with #f2f8ff as the background; already changed main applications of #2f7cae to #f2f8ff, 
// but left some that does not have #f2f8ff as the background

// DELETE THIS NOTE LATER

export default {
  /* 
      --background-color: #ffffff;
      --button-color: #0078c2;
      --text-color: #ffffff;
      --red-button: rgb(207,39,41);
      --settings-links: #517B94
      --box-shadow: rgba(44, 62, 80, 1)
      --red-button-text: rgb(207,39,41);
  */
  setPalette(root, dark_mode) {

      // Scrollbar
      root.style.setProperty('--scrollbar-thumb-color', '#87a7c7');

      if (!dark_mode) {

          // Default palette - main (general)
          root.style.setProperty('--main-text-color', '#1d2324');
          root.style.setProperty('--main-background-color', '#f2f8ff');  //#ffffff
          root.style.setProperty('--input-background', '#f7f7f7');
          root.style.setProperty('--input-border', 'grey');
          root.style.setProperty('--input-text', 'black');
          root.style.setProperty('--input-shadow', '#9ecaed');

          // Errors 
          root.style.setProperty('--error', '#c40000');
          root.style.setProperty('--error-brighter', 'red');

          // Links - venue.css
          root.style.setProperty('--link', '#5597EE');
          root.style.setProperty('--link-hover', '#2c70c9');

          // In this example, the widget is set to #000 and #fff, but this can be any color,
          // Check out some examples in Settings.vue and become friends with this website:
          // https://codepen.io/sosuke/pen/Pjoqqp
          root.style.setProperty('--widgets-color', 'brightness(0) invert(0)');
          root.style.setProperty('--clock-color', 'invert(20%) sepia(43%) saturate(454%) hue-rotate(168deg) brightness(93%) contrast(89%)');
          root.style.setProperty('--logo-color', '');
          root.style.setProperty('--red-x', '');

          root.style.setProperty('--loader-square-even', '#4CC9FF');
          root.style.setProperty('--loader-square-odd', '#FC6E71');
          root.style.setProperty('--loader-square-shadow', 'rgba(128, 128, 128, 0.5)');
          
          // Course cards 
          root.style.setProperty('--course-card-background', '#f2f8ff'); //#ffffff ->#fafcff
          root.style.setProperty('--course-card-shadow', 'rgba(127, 151, 179, 0.644)'); //179, 179, 179     187, 171, 196   104, 127, 148
          root.style.setProperty('--course-card-text', '#000000');
          root.style.setProperty('--course-number-background', 'rgba(0, 0, 0, 0.86)');
          root.style.setProperty('--course-number-text', '#C1EDFF');

          // Settings Palette
          root.style.setProperty('--settings-logout-button', 'rgb(207,39,41);');
          root.style.setProperty('--settings-logout-button-shadow', 'rgba(144, 62, 80, 0.8)');
          root.style.setProperty('--settings-small-div', 'rgba(0, 0, 0, 0.64)');
          root.style.setProperty('--settings-logout-hover-text', 'white');
          root.style.setProperty('--settings-text', '#045c91');                            // original: #517B94
          root.style.setProperty('--settings-switch-on', '#04852F');
          root.style.setProperty('--settings-switch-off', '#f55442');
          root.style.setProperty('--settings-switch-ball', 'white');

          // ChangePassword.vue
          root.style.setProperty('--change-password-error', '#FC6F71');
          root.style.setProperty('--change-password-success', '#34c759');
          root.style.setProperty('--change-password-success-border', '#158f34');

          // Buttons Palette - lives in venue.core.css
          // .btn-btn-danger has a separate instance of hover & friends in MultiSelectDropdown.vue 
          //  to prevent unfit shadows on the X buttons 
          root.style.setProperty('--button-primary-blue', '#1072b0');                        // original: #0078c2
          root.style.setProperty('--button-hover-blue', '#005183');
          root.style.setProperty('--button-secondary-grey', '#727272');
          root.style.setProperty('--button-hover-grey', '#444444');
          root.style.setProperty('--button-danger', '#dc3545');
          root.style.setProperty('--button-danger-shadow', 'rgba(110, 26, 34, 0.74)');
          root.style.setProperty('--button-danger-hover', 'rgba(110, 26, 34, 0.74)');
          root.style.setProperty('--button-tab', '#0078c2');
          root.style.setProperty('--button-tab-text', 'grey');
          root.style.setProperty('--big-button', 'white');
          root.style.setProperty('--big-button-text', 'rgba(44, 62, 80, 1)');
          root.style.setProperty('--big-button-border', 'rgba(44, 62, 80, 0.7)');
          root.style.setProperty('--big-button-shadow', 'rgba(44, 62, 80, 0.2)');
          root.style.setProperty('--button-blue-shadow', 'rgba(67, 65, 120, 0.844)');        //67, 65, 120
          root.style.setProperty('--button-grey-shadow', 'rgba(109, 109, 109, 0.644)');
          root.style.setProperty('--button-text-color', 'white');
          root.style.setProperty('--button-text-hover', 'white');

          // Nav bar Palette
          // These are also used in MultiSelectDropdown.vue
          root.style.setProperty('--nav-bar-text', '#2C3E50');
          root.style.setProperty('--nav-bar-background', '#fafcff'); //#f7f7f7 --> #fafcff
          root.style.setProperty('--nav-bar-separator', 'rgba(0, 0, 0, 0.15)');
          root.style.setProperty('--nav-bar-selected-text', '#2C76B5');                     // prev: #2f7cae(w/ white bg)   original: #466D85
          root.style.setProperty('--nav-bar-box-shadow', 'rgba(109, 109, 109, 0.744)');
          root.style.setProperty('--nav-bar-link-text', '#575757');
          root.style.setProperty('--nav-bar-hover-background', '#2f7cae');                  // original: #466D85
          root.style.setProperty('--nav-bar-hover-text', 'white');
          root.style.setProperty('--nav-bar-hover-top-shadow', 'rgba(85, 85, 85, 0.644)');
          root.style.setProperty('--nav-bar-hover-bottom-shadow', 'rgba(179, 179, 179, 0.644)');  

           // Legend green and purple
           root.style.setProperty('--sync-border', '#04852f');
           root.style.setProperty('--async-border', '#683eca');
           root.style.setProperty('--recording-namecard', '#8f3eca');

          // Course and Lecture 'pills'
          root.style.setProperty('--red-pill', '#D14454');                                  // original: #d13e34
          root.style.setProperty('--red-pill-shadow', 'rgba(249, 82, 71, 0.3)');
          root.style.setProperty('--yellow-pill', '#b95726');
          root.style.setProperty('--yellow-pill-shadow', 'rgba(244, 159, 50, 0.4)');
          root.style.setProperty('--blue-pill', '#0078c2');
          root.style.setProperty('--blue-pill-shadow', 'rgba(79, 109, 234, 0.3)');
          root.style.setProperty('--green-pill', '#04852f');
          root.style.setProperty('--green-pill-shadow', 'rgba(78, 205, 76, 0.3)');
          root.style.setProperty('--upcoming-pill', '#0078c2');
          root.style.setProperty('--upcoming-pill-shadow', 'rgba(109, 109, 109, 0.644)');
          root.style.setProperty('--foreground-pill', '#f2f8ff'); //#f5f5f5
          root.style.setProperty('--foreground-pill-shadow', 'rgba(109, 109, 109, 0.644)');
          root.style.setProperty('--date-and-percent', 'white');
          root.style.setProperty('--course-pill-shadow', 'rgba(111, 134, 173, 0.644)');   //109, 109, 109
          root.style.setProperty('--course-pill-hover', 'rgba(143, 162, 194, 0.644)');    //160, 160, 160

          // Lecture pills con't - these live in LectureCard.vue
          root.style.setProperty('--lecture-live', '#04852F');
          root.style.setProperty('--lecture-live-closed', '#f29f33');
          root.style.setProperty('--lecture-playback', '#683eca');
          root.style.setProperty('--lecture-recent', '#858585');
          root.style.setProperty('--lecture-upcoming', '#0076a8');
          root.style.setProperty('--lecture-pill-shadow', 'rgba(107, 133, 156, 0.644)');  //109, 109, 109
          root.style.setProperty('--lecture-info-background', '#f2f8ff');                 //white
          root.style.setProperty('--lecture-course-number-text', '#0979AF');              //#097bac (changed slightly for 4.5 contrast)
          root.style.setProperty('--lecture-course-name-text', '#2C76B5');                // #2f7cae(w/ white bg)   original: #466D85
          root.style.setProperty('--lecture-name-text', '#2C3E50');
          root.style.setProperty('--lecture-closed-text', '#A9600C');                     //#a7640d (changed slightly for 4.5 contrast)

          // Lecture attendance (Sync, Async, Absent) 
          // The actual sections with the %'s use the same colors as green-pill, lecture-playback, red-pill
          root.style.setProperty('--lecture-attendance-button-text', '#636363');
          root.style.setProperty('--lecture-attendance-grey-pill', 'rgb(110, 110, 110)');
          root.style.setProperty('--lecture-attendance-grey-shadow', 'rgba(109, 109, 109, 0.644)');
          root.style.setProperty('--lecture-attendance-text', 'white');
          root.style.setProperty('--lecture-attendance-live-glow', 'rgba(65, 162, 91, 0.33)');
          root.style.setProperty('--lecture-attendance-async-glow', 'rgba(214, 71, 233, 0.36)');
          root.style.setProperty('--lecture-attendance-absent-glow', 'rgba(219, 66, 83, 0.36)');   //original: 255, 99, 88

          // In CourseInfo.vue there is a pill that gets calculated by attendance %, it uses these:
          // It also uses (--red-pill) (--yellow-pill) and (--green-pill) for the non-100% attendances
          root.style.setProperty('--course-attendance-rainbow-blue', 'rgba(62,73,202,1)');
          root.style.setProperty('--course-attendance-rainbow-purple', 'rgba(143,62,202,1)');     
          root.style.setProperty('--course-attendance-rainbow-red', 'rgba(209,62,52,1)');
          root.style.setProperty('--course-attendance-rainbow-yellow', 'rgba(176,95,22,1)');
          root.style.setProperty('--course-attendance-rainbow-green', 'rgba(4,133,47,1)');

          // root.style.setProperty('--course-attendance-rainbow-blue', '#7E4BDE');
          // root.style.setProperty('--course-attendance-rainbow-purple', '#465acf');     
          // root.style.setProperty('--course-attendance-rainbow-red', '#55a2e6');
          // root.style.setProperty('--course-attendance-rainbow-yellow', '#1D8293');  // #6CE3C2
          // root.style.setProperty('--course-attendance-rainbow-green', '#178935');   // #21847E

          // potential additional attendance rainbow palette: purple -> blue -> green
          // purple: #7E4BDE
          // blue: #465acf
          // light blue: #55a2e6
          // dark blue-green: #1D8293
          // green: #178935

          // Lives in dashboardSection.vue -> also main heading color
          root.style.setProperty('--dashboard-text-color', '#2C3E50');
          root.style.setProperty('--dashboard-background-color', '#636363');

          // Modal
          root.style.setProperty('--modal-background', '#f2f8ff');  //#ffffff
          root.style.setProperty('--modal-course-name', '#53788E');
          root.style.setProperty('--modal-course-number', '#2398C8');
          root.style.setProperty('--modal-border', 'grey');
          root.style.setProperty('--modal-container-background', 'rgba(255, 255, 255, 0.65)');
          root.style.setProperty('--modal-lecture-border', 'rgba(120,120,120,1)');

          root.style.setProperty('--poll-background', 'lightskyblue');

          // Cards 
          root.style.setProperty('--card-background', 'DarkGray');
          root.style.setProperty('--card-shadow1', 'rgba(0,0,0,0.25)');
          root.style.setProperty('--card-shadow2', 'rgba(0,0,0,0.22)');
          root.style.setProperty('--card-title-light', 'white');
          root.style.setProperty('--card-title-dark', 'black');

          // Info container
          root.style.setProperty('--info-container-percentage-text', '#828282');
          root.style.setProperty('--info-container-border', 'rgba(0, 0, 0, 0.3)');
          root.style.setProperty('--info-container-border-hover', 'rgba(0, 0, 0, 0.6)');
          root.style.setProperty('--info-container-text', '#b54545');

          // Event pills
          root.style.setProperty('--event-pill-green', '#04852f');
          root.style.setProperty('--event-pill-shadow', 'rgba(0, 0, 0, 0.065)');
          root.style.setProperty('--event-pill-date', 'rgba(0, 0, 0, 0.6)');
          root.style.setProperty('--event-pill-name', 'rgba(0, 0, 0, 1)');
          root.style.setProperty('--event-pill-location', 'rgba(0, 0, 0, 0.5)');

          root.style.setProperty('--event-pill-border', 'rgba(35, 217, 96, 0.5)');
          root.style.setProperty('--event-pill-text', 'black');

          root.style.setProperty('--event-active-link', '#2c3e50');
          root.style.setProperty('--event-list-background', '#F5F5F5');
          root.style.setProperty('--event-pending', '#E0932F');
          root.style.setProperty('--event-ongoing', '#4bcc69');
          root.style.setProperty('--event-static', '#2a8dc7');
          root.style.setProperty('--event-ending', '#919191');

          root.style.setProperty('--event-course-name', '#466D85');
          root.style.setProperty('--event-course-title', '#146c91');

          root.style.setProperty('--event-active-background', '#f2f8ff'); //white
          root.style.setProperty('--event-active-shadow', 'rgba(0, 0, 0, 0.1)');

          root.style.setProperty('--event-location', '#524e0a');

          // TodaysEventCard.vue
          root.style.setProperty('--event-ending-container', '#516ded');
          root.style.setProperty('--event-today-container', '#f29f33');
          root.style.setProperty('--event-hover-background', '#e8e8e8');
          root.style.setProperty('--event-hover-shadow', 'rgba(0, 0, 0, 0.3)');
          root.style.setProperty('--event-today-title', '#1591C5');

          // TodaysEventList.vue
          root.style.setProperty('--event-today-time', '#757575');
          root.style.setProperty('--event-timeline-background', '#f0f0f0');

          // Calendar colors for creating lectures
          root.style.setProperty('--calendar-background', 'white');
          root.style.setProperty('--calendar-border', 'rgba(100,100,100,1)');
          root.style.setProperty('--checkins-border', 'gray');
          root.style.setProperty('--calendar-selected', 'rgba(20,75,250,1)');
          
          // Statistics 
          // Divider bars, gridlines and labels use (--main-text-color)
          root.style.setProperty('--stats-panel-background', '#c4c4c4');
          root.style.setProperty('--stats-live-border', '#04dd74');
          root.style.setProperty('--stats-live-fill', '#bfffc6');
          root.style.setProperty('--stats-playback-border', '#3282bf');
          root.style.setProperty('--stats-playback-fill', '#92bed2');
          root.style.setProperty('--stats-absent-border', '#e95454');
          root.style.setProperty('--stats-absent-fill', '#ff8787');
          root.style.setProperty('--stats-panel-shadow', 'rgba(109, 109, 109, 0.644)');

          // ToggleSwitch.vue
          root.style.setProperty('--toggle-switch-on-background', '#04dd74');
          root.style.setProperty('--toggle-switch-on-ball', '#04852F');
          root.style.setProperty('--toggle-switch-off-background', '#ff8787');
          root.style.setProperty('--toggle-switch-off-ball', '#e95454');
          root.style.setProperty('--toggle-switch-disabled-background', '#7E7E7E');
          root.style.setProperty('--toggle-switch-disabled-ball', '#4F4F4F');

        } else {

          // Dark mode palette - main (general)
          root.style.setProperty('--main-text-color', '#87a7c7');
          root.style.setProperty('--main-background-color', '#1d2324');
          root.style.setProperty('--input-background', '#000000');
          root.style.setProperty('--input-border', '#0e83cc');         //lime
          root.style.setProperty('--input-text', '#6cb6e6');           //green
          root.style.setProperty('--input-shadow', '#9fdfed');         //#ff00ff

          // Scrollbar
          root.style.setProperty('--scrollbar-thumb-color', '#87a7c7');

          // Errors 
          root.style.setProperty('--error', '#b52d2d');               //#00ff00
          root.style.setProperty('--error-brighter', 'red');          //lime

          // Links - venue.css
          root.style.setProperty('--link', 'red');                    //#00ff00
          root.style.setProperty('--link-hover', 'red');              //#00ff00

          root.style.setProperty('--widgets-color', 'brightness(0) invert(1)');
          root.style.setProperty('--clock-color', 'invert(20%) sepia(43%) saturate(454%) hue-rotate(168deg) brightness(93%) contrast(89%)');
          root.style.setProperty('--logo-color', '');
          root.style.setProperty('--red-x', 'brightness(0.75) saturate(0.75)');

          root.style.setProperty('--loader-square-even', '#4CC9FF');
          root.style.setProperty('--loader-square-odd', '#FC6E71');
          root.style.setProperty('--loader-square-shadow', 'rgba(128, 128, 128, 0.5)');
          
          // Course cards
          root.style.setProperty('--course-card-background', '#3c586e');                  //#272727
          root.style.setProperty('--course-card-shadow', 'rgba(159, 195, 212, 0.644)');   //179, 179, 179
          root.style.setProperty('--course-card-text', '#87a7c7');
          root.style.setProperty('--course-number-background', '#C1EDFF');
          root.style.setProperty('--course-number-text', 'rgba(0, 0, 0, 0.86)');

          // Dark mode palette - settings
          root.style.setProperty('--settings-logout-button', 'rgba(110, 148, 186, 1)');   
          root.style.setProperty('--settings-logout-button-shadow', 'rgba(69, 122, 176, 0.8)');
          root.style.setProperty('--settings-small-div', 'rgba(216, 216, 216, 0.64)');
          root.style.setProperty('--settings-logout-hover-text', '#001324');              //#272727
          root.style.setProperty('--settings-text', '#2991C3');                           //#cccccc
          root.style.setProperty('--settings-switch-on', '#04852F');
          root.style.setProperty('--settings-switch-off', '#f55442');
          root.style.setProperty('--settings-switch-ball', 'white');

          // ChangePassword.vue
          root.style.setProperty('--change-password-error', '#FC6F71');
          root.style.setProperty('--change-password-success', '#34c759');
          root.style.setProperty('--change-password-success-border', '#158f34');

          // Buttons Palette - lives in venue.core.css
          root.style.setProperty('--button-primary-blue', '#115d8f');                   //#082d45
          root.style.setProperty('--button-hover-blue', '#005183');                     // -- unsure if compliant
          root.style.setProperty('--button-secondary-grey', '#727272');
          root.style.setProperty('--button-hover-grey', '#444444');
          root.style.setProperty('--button-danger', '#b52d2d');                         // lime
          root.style.setProperty('--button-danger-shadow', 'rgba(110, 26, 34, 0.74)');
          root.style.setProperty('--button-danger-hover', 'rgba(110, 26, 34, 0.74)');
          root.style.setProperty('--button-tab', '#0078c2');
          root.style.setProperty('--button-tab-text', 'grey');
          root.style.setProperty('--big-button', 'white');
          root.style.setProperty('--big-button-text', 'rgba(44, 62, 80, 1)');
          root.style.setProperty('--big-button-border', 'rgba(44, 62, 80, 0.7)');
          root.style.setProperty('--big-button-shadow', 'rgba(44, 62, 80, 0.2)');
          root.style.setProperty('--button-blue-shadow', 'rgba(67, 65, 120, 0.844)');
          root.style.setProperty('--button-grey-shadow', 'rgba(109, 109, 109, 0.644)');
          root.style.setProperty('--button-text-color', 'white');
          root.style.setProperty('--button-text-hover', 'white');

          // Dark mode Palette - Nav bar 
          root.style.setProperty('--nav-bar-text', '#034066');                              //#5e2f2f
          root.style.setProperty('--nav-bar-background', '#92AABA');                        //#a16262
          root.style.setProperty('--nav-bar-separator', 'rgba(80, 88, 100, 0.50)');           //7, 58, 89, 0.35
          root.style.setProperty('--nav-bar-selected-text', '#308CDE');                     //#a12725
          root.style.setProperty('--nav-bar-box-shadow', 'rgba(78, 120, 148, 0.744)');
          root.style.setProperty('--nav-bar-link-text', '#9fbed4');                         //#c9abab
          root.style.setProperty('--nav-bar-hover-background', '#314f63');                  //#6e3b3a
          root.style.setProperty('--nav-bar-hover-text', '#a1cbe6');                        //#eba8a7
          root.style.setProperty('--nav-bar-hover-top-shadow', 'rgba(0, 25, 43, 0.644)');             //rgba(138, 54, 54, 0.644)
          root.style.setProperty('--nav-bar-hover-bottom-shadow', 'rgba(115, 197, 255, 0.644)');      //rgba(219, 173, 173, 0.644)

          // Legend green and purple + sections dropdown border
          root.style.setProperty('--sync-border', '#0ac448');
          root.style.setProperty('--async-border', '#9576db');
          root.style.setProperty('--recording-namecard', '#8f3eca');

          // Course and Lecture 'pills'
          root.style.setProperty('--red-pill', '#d14454');                                  // original: #d13e34
          root.style.setProperty('--red-pill-shadow', 'rgba(249, 82, 71, 0.3)');
          root.style.setProperty('--yellow-pill', '#b95726');
          root.style.setProperty('--yellow-pill-shadow', 'rgba(244, 159, 50, 0.4)');
          root.style.setProperty('--blue-pill', '#0078c2');
          root.style.setProperty('--blue-pill-shadow', 'rgba(79, 109, 234, 0.3)');
          root.style.setProperty('--green-pill', '#04852f');
          root.style.setProperty('--green-pill-shadow', 'rgba(78, 205, 76, 0.3)');
          root.style.setProperty('--upcoming-pill', '#0078c2');
          root.style.setProperty('--upcoming-pill-shadow', 'rgba(109, 109, 109, 0.644)');
          root.style.setProperty('--foreground-pill', '#87a7c7'); //#f5f5f5
          root.style.setProperty('--foreground-pill-text', '#87a7c7'); //#f5f5f5
          root.style.setProperty('--foreground-pill-shadow', 'rgba(109, 109, 109, 0.644)');
          root.style.setProperty('--date-and-percent', 'white');
          root.style.setProperty('--course-pill-shadow', 'rgba(109, 109, 109, 0.644)');  //109, 109, 109
          root.style.setProperty('--course-pill-hover', 'rgba(109, 109, 109, 0.644)');  //160, 160, 160

          // Lecture pills con't - these live in LectureCard.vue
          root.style.setProperty('--lecture-live', '#04852F');
          root.style.setProperty('--lecture-live-closed', '#f29f33');
          root.style.setProperty('--lecture-playback', '#683eca');
          root.style.setProperty('--lecture-recent', '#858585');
          root.style.setProperty('--lecture-upcoming', '#0076a8');
          root.style.setProperty('--lecture-pill-shadow', 'rgba(29, 109, 179, 0.644)');   //109, 109, 109   21, 90, 150
          root.style.setProperty('--lecture-info-background', '#f2f8ff');                 //white
          root.style.setProperty('--lecture-course-number-text', '#097bac');
          root.style.setProperty('--lecture-course-name-text', '#466D85');
          root.style.setProperty('--lecture-name-text', '#2C3E50');
          root.style.setProperty('--lecture-closed-text', '#52514f');       //#a7640d -- changed from an orange to grey for darkmode only

          // Dark mode palette - lecture attendance
          root.style.setProperty('--lecture-attendance-button-text', '#636363');
          root.style.setProperty('--lecture-attendance-grey-pill', 'rgb(110, 110, 110)');
          root.style.setProperty('--lecture-attendance-grey-shadow', 'rgba(109, 109, 109, 0.644)');
          root.style.setProperty('--lecture-attendance-text', 'white');
          root.style.setProperty('--lecture-attendance-live-glow', 'rgba(65, 162, 91, 0.33)');
          root.style.setProperty('--lecture-attendance-async-glow', 'rgba(214, 71, 233, 0.36)');
          root.style.setProperty('--lecture-attendance-absent-glow', 'rgba(219, 66, 83, 0.36)');    //original: 255, 99, 88,

          // In CourseInfo.vue there is a pill that gets calculated by attendance %, it uses these:
          // It also uses (--red-pill) (--yellow-pill) and (--green-pill) for the non-100% attendances
          root.style.setProperty('--course-attendance-rainbow-blue', 'rgba(62,73,202,1)');
          root.style.setProperty('--course-attendance-rainbow-purple', 'rgba(143,62,202,1)');     
          root.style.setProperty('--course-attendance-rainbow-red', 'rgba(209,62,52,1)');
          root.style.setProperty('--course-attendance-rainbow-yellow', 'rgba(176,95,22,1)');
          root.style.setProperty('--course-attendance-rainbow-green', 'rgba(4,133,47,1)');

          // Lives in dashboardSection.vue -> also main heading color
          root.style.setProperty('--dashboard-text-color', '#87a7c7');
          root.style.setProperty('--dashboard-background-color', '#636363');

          // Modal
          root.style.setProperty('--modal-background', '#272727');
          root.style.setProperty('--modal-course-name', '#53788E');
          root.style.setProperty('--modal-course-number', '#2398C8');
          root.style.setProperty('--modal-border', 'grey');
          root.style.setProperty('--modal-container-background', 'rgba(63, 63, 63, 0.65)');
          root.style.setProperty('--modal-lecture-border', 'rgba(120,120,120,1)');

          root.style.setProperty('--poll-background', 'lightskyblue');

          // Cards 
          root.style.setProperty('--card-background', 'DarkGray');
          root.style.setProperty('--card-shadow1', 'rgba(0,0,0,0.25)');
          root.style.setProperty('--card-shadow2', 'rgba(0,0,0,0.22)');
          root.style.setProperty('--card-title-light', 'white');
          root.style.setProperty('--card-title-dark', 'black');

          // Info container
          root.style.setProperty('--info-container-percentage-text', '#828282');
          root.style.setProperty('--info-container-border', 'rgba(0, 0, 0, 0.3)');
          root.style.setProperty('--info-container-border-hover', 'rgba(0, 0, 0, 0.6)');
          root.style.setProperty('--info-container-text', '#b54545');

          // Event pills
          root.style.setProperty('--event-pill-green', '#04852f');
          root.style.setProperty('--event-pill-shadow', 'rgba(0, 0, 0, 0.065)');
          root.style.setProperty('--event-pill-date', 'rgba(0, 0, 0, 0.6)');
          root.style.setProperty('--event-pill-name', 'rgba(0, 0, 0, 1)');
          root.style.setProperty('--event-pill-location', 'rgba(0, 0, 0, 0.5)');

          root.style.setProperty('--event-pill-border', 'rgba(35, 217, 96, 0.5)');
          root.style.setProperty('--event-pill-text', 'black');

          root.style.setProperty('--event-active-link', '#2c3e50');
          root.style.setProperty('--event-list-background', '#F5F5F5');
          root.style.setProperty('--event-pending', '#E0932F');
          root.style.setProperty('--event-ongoing', '#4bcc69');
          root.style.setProperty('--event-static', '#2a8dc7');
          root.style.setProperty('--event-ending', '#919191');

          root.style.setProperty('--event-course-name', '#466D85');
          root.style.setProperty('--event-course-title', '#146c91');

          root.style.setProperty('--event-active-background', 'white');
          root.style.setProperty('--event-active-shadow', 'rgba(0, 0, 0, 0.1)');

          root.style.setProperty('--event-location', '#524e0a');

          // TodaysEventCard.vue
          root.style.setProperty('--event-ending-container', '#516ded');
          root.style.setProperty('--event-today-container', '#f29f33');
          root.style.setProperty('--event-hover-background', '#e8e8e8');
          root.style.setProperty('--event-hover-shadow', 'rgba(0, 0, 0, 0.3)');
          root.style.setProperty('--event-today-title', '#1591C5');

          // TodaysEventList.vue
          root.style.setProperty('--event-today-time', '#757575');
          root.style.setProperty('--event-timeline-background', '#f0f0f0');

          // Calendar colors for creating lectures
          root.style.setProperty('--calendar-background', 'pink');
          root.style.setProperty('--calendar-border', 'rgba(0,0,0,1)');
          root.style.setProperty('--checkins-border', 'gray');
          root.style.setProperty('--calendar-selected', 'rgba(200,40,120,1)');
          
          // Statistics but dark
          root.style.setProperty('--stats-panel-background', '#4c4c4c');
          root.style.setProperty('--stats-live-border', '#04dd74');
          root.style.setProperty('--stats-live-fill', '#bfffc6');
          root.style.setProperty('--stats-playback-border', '#3282bf');
          root.style.setProperty('--stats-playback-fill', '#92bed2');
          root.style.setProperty('--stats-absent-border', '#e95454');
          root.style.setProperty('--stats-absent-fill', '#ff8787');
          root.style.setProperty('--stats-panel-shadow', 'rgba(109, 109, 109, 0.644)');

          // ToggleSwitch.vue
          root.style.setProperty('--toggle-switch-on-background', '#04dd74');
          root.style.setProperty('--toggle-switch-on-ball', '#04852F');
          root.style.setProperty('--toggle-switch-off-background', '#ff8787');
          root.style.setProperty('--toggle-switch-off-ball', '#e95454');
          root.style.setProperty('--toggle-switch-disabled-background', '#7E7E7E');
          root.style.setProperty('--toggle-switch-disabled-ball', '#4F4F4F');
        }
  }
}

//brightness(0.75) saturate(0.75)

/**********************************************************************************
 **********************************************************************************
 **********************************************************************************
 ***                                                                            ***
 ***  ___        ___  ╭────────╮  ╭─╮╭───────╮   ╭───╮    ╭───╮  ╭────────╮     ***
 ***  \  \      /  /  |   ╭───╮|  | ╰╯╭───╮  |   |   |    |   |  |   ╭───╮|     ***
 ***   \  \    /  /   |  ╭╰───╯╯  |   |   |  |   |   |    |   |  |  ╭╰───╯╯     ***
 ***    \  \__/  /    |  ╰────╮   |   |   |  |   |   ╰────╯ ╭╮|  |  ╰────╮      ***
 **      \______/     ╰───────╯   ╰───╯   ╰──╯   ╰──────────╯╰╯  ╰───────╯      ***
 ***                                                                            ***
 ***                          🎨 Palette Variables 🎨                          ***
 ***                                                                            ***
 ***                                 Defaults,                                  ***
 ***                                  Descriptions &                            ***
 ***                                    Locations                               ***    
 ***                                                                            ***
 ***                                  GENERAL                                   ***
 ***                                                                            ***
 ***                             --main-text-color                              ***
 ***                            DEFAULT: #1d2324 (DARK GREY)                    ***
 ***                                                                            ***
 ***             DESCRIPTION: Controls majority of text on the site,            ***
 ***                  used for all text without another explicit style.         ***
 ***           Worth noting - used for axes on stats graphs and table borders   ***
 ***                                                                            ***                              
 ***    DECLARED IN: assets/css/venue-core.css, components/Footer.vue           ***
 ***                                                                            ***
 ***    LOCATIONS: assets/css/venue-core.css, components/DashboardSection.vue,  ***
 ***       components/Footer.vue, views/Settings.vue, views/Statistics.vue      ***
 ***                                                                            ***
 ***                          --main-background-color                           ***
 ***                          DEFAULT: #ffffff (WHITE)                          ***
 ***                                                                            ***
 ***            DESCRIPTION: Background of everything except course cards,      ***
 ***               lecture cards, input boxes, the calendar, course pills,      ***
 ***             - Pretty much --main-text-color but for backgrounds.           ***
 ***                                                                            ***
 ***   DECLARED IN: assets/css/venue-core.css, components/Footer.vue            ***
 ***                                                                            ***
 ***   LOCATIONS: assets/css/venue-core.css, components/ChangePassword.vue,     ***
 *** components/DashboardSection.vue, components/Footer.vue, views/Settings.vue ***
 ***                                                                            ***
 ***      --input-background, --input-text, --input-border, --input-shadow      ***
 ***     DEFAULTS: #f7f7f7 (WHITE), black, grey, #9ecaed (LIGHT BLUE)           ***
 ***                                                                            ***
 ***             DESCRIPTION: Styles for all input boxes                        ***
 ***                                                                            ***
 ***             DECLARED IN: assets/css/venue-core.css                         ***
 ***                                                                            ***
 ***   LOCATIONS: assets/css/venue-core.css, components/CreatePoll.vue          ***
 ***                                                                            ***
 ***                    --error, --error-brighter                               ***
 ***               DEFAULTS: #c40000 (RED), red                                 ***
 ***                                                                            ***
 ***        DESCRIPTION: Text colors off error messages                         ***
 ***   X in sections dropdown: --error-brighter, danger-button-hover on hover   ***
 ***                                                                            ***
 ***             DECLARED IN: assets/css/venue-core.css                         ***
 ***                                                                            ***
 ***  LOCATIONS: assets/css/venue-core.css, components/MultiSelectDropdown.vue, ***  
 ***   components/LectureAttendanceTable.vue, views/NewLecture.vue              ***
 ***                                                                            ***
 ***                        --link, --link-text                                 ***
 ***           DEFAULTS: #5597EE (LIGHT BLUE), #2c70c9 (BLUE)                   ***
 ***                                                                            ***
 *** DESCRIPTION: --link: link's regular color --link-text: link's hover color  ***
 ***                                                                            ***
 ***        DECLARED IN & LOCATION: assets/css/venue.css                        ***
 ***                                                                            ***
 ***    --widgets-color, --clock-color, --logo-color, --red-x                   ***
 ***   DEFAULTS: brightness(0) invert(0) (BLACK), '', '' (NONE),                ***
 ***       invert(20%) sepia(43%) saturate(454%)                                ***
 ***    hue-rotate(168deg) brightness(93%) contrast(89%)  (RED)                 ***
 ***                                                                            ***
 *** DESCRIPTION: All of these get passed into a filter() css method. --red-x's ***
 ***  essentially passes the image through a red filter, and the blanks pass no ***
 ***  filter. brightness(0) invert(0) is the equivalent of black.               ***
 ***  venue-edit, settings and all buttons icons will use --widgets-color,     ***
 ***  venue-delete will use --red-x, venue-clock.svg will use --clock-color and       ***
 ***  venue-logo.svg will use --logo-color                                      ***
 ***                                                                            ***
 ***                DECLARED IN: assets/css/venue-core.css,                     ***
 ***            --widgets-color also in components/Footer.vue                   ***
 ***                                                                            ***
 *** LOCATIONS: assets/css/venue-core.css, components/NavBar.vue,               ***
 *** components/Footer.vue, components/CourseInfoTitle.vue, LectureCard.vue     ***
 ***                                                                            ***
 ***     --loader-square-even, --loader-square-odd, --loader-square-shadow      ***
 ***    DEFAULTS: #4CC9FF (AQUA), #FC6E71 (PINK), (128, 128, 128) (GREY)        ***
 ***                                                                            ***
 ***  DESCRIPTION: When venue loads a user's courses/ lectures the SquareLoader ***
 ***                 will appear. (3x3 animated grid)                           ***
 ***                                                                            ***
 ***  DECLARED IN & USED IN: components/loaders/SquareLoader.vue                ***
 ***                                                                            ***
 ***                                                                            ***
 ***                             COURSE CARDS                                   ***
 ***                                                                            *** 
 ***  --course-card-background, --course-card-shadow, --course-card-text        ***
 *** DEFAULTS: #ffffff (WHITE), (179, 179, 179, 0.644) (GREY), #000000 (BLACK)  ***
 ***         --course-number-background, --course-number-text                   ***
 ***     DEFAULTS: rgba(0, 0, 0, 0.86) (BLACK), #C1EDFF (LIGHT BLUE)            ***
 ***                                                                            ***
 ***         DESCRIPTION: Styles for Course and Lecture cards.                  ***
 ***                                                                            ***
 ***                 DECLARED IN: assets/css/venue-core.css                     ***
 ***                                                                            ***
 *** LOCATIONS: assets/css/venue-core.css, components/LectureAttendanceList.vue ***
 *** components/InstructorLectureAttendanceContainer.vue,                       ***
 *** components/LectureInfoHeader.vue, views/CourseInfo.vue,                    ***
 *** components/StudentLectureAttendanceContainer.vue, views/OldLectureInfo.vue ***
 ***                                                                            ***
 ***                                                                            ***
 ***                                SETTINGS                                    ***
 ***                                                                            ***
 *** --settings-logout-button, --settings-logout-button-shadow, --settings-text ***
 *** DEFAULTS: (207,39,41) (RED), (144, 62, 80) (DARK RED), #045c91 (NAVY)      ***
 ***        --settings-small-div, --settings-logout-hover-text                  ***
 *** DEFAULTS: (0, 0, 0, 0.64) (GREY), white                                    ***
 *** --settings-switch-on, --settings-switch-off, --settings-switch-ball        ***
 *** DEFAULTS: #42f593 (LIGHT GREEN), #f55442 (LIGHT RED), white                ***
 ***                                                                            ***
 *** DESC, DECLARED, LOCATED: Styles that are unique to views/Settings.vue      ***
 ***                                                                            ***
 *** --change-password- / error / success / success-border                      *** 
 *** DEFAULTS: #FC6F71 (PINK), #34c759 (LIGHT GREEN), #158f34 (DARK GREEN)      ***
 ***                                                                            ***
 *** DESC, DECLARED, LOCATED: Unique styles in components/ChangePassword.vue    ***
 ***                                                                            ***
 ***                                                                            ***
 ***                                BUTTONS                                     ***
 ***                                                                            ***
 *** --button-primary-blue, --button-hover-blue, --button-blue-shadow           ***
 *** DEFAULTS: #1072b0 (BLUE), #005183 (NAVY BLUE), (67, 65, 120) (DARK PURPLE) ***
 *** --button-secondary-grey, --button-hover-grey, --button-grey-shadow         ***
 *** DEFAULTS: #727272 (GREY), #444444 (DARK GREY), (109, 109, 109) (GREY)      ***
 *** --button-danger, --button-danger-hover, --button-danger-shadow             ***
 *** DEFAULTS: #dc3545 (RED), (110, 26, 34, 0.74) (DARK RED) --hover/shadow     ***
 *** --button-tab, --button-tab-text, --big-button, --big-button-text           ***
 *** DEFAULTS: #0078c2 (BLUE), grey, white, (44, 62, 80) (NAVY BLUE)            ***
 *** --big-button-border, --big-button-shadow,                                  *** 
 *** DEFAULTS: (44, 62, 80, 0.7) (NAVY BLUE), (44, 62, 80, 0.2) (NAVY BLUE)     ***
 *** --button-text-color, --button-text-hover                                   ***
 *** DEFAULTS: white, white                                                     ***
 ***                                                                            ***
 *** DESCRIPTION: Styles for all buttons except login buttons. Buttons with img ***
 ***  will use filter: var(--widgets-color) invert(1); on hover, making the img ***
 ***  the exact opposite of whatever --widgets-color is set to.                 ***
 ***                                                                            ***
 *** DECLARED IN: assets/css/venue-core.css                                     ***
 ***                                                                            ***
 *** LOCATIONS: assets/css/venue-core.css,                                      ***
 *** components/StudentLectureAttendanceContainer.vue                           ***
 *** components/InstructorLectureAttendanceContainer.vue                        *** 
 ***                                                                            ***
 ***                                                                            ***
 ***                                                                            ***
 ***                         NAV BAR/DROPDOWN                                   ***
 ***                                                                            ***
 ***                                                                            ***
 ***                                                                            ***
 ***  --nav-bar-text, --nav-bar-background, --nav-bar-separator                 ***
 *** DEFAULTS: #2C3E50 (NAVY), #f7f7f7 (WHITE), (0, 0, 0, 0.15) (BLACK)         ***
 *** --nav-bar-selected-text, --nav-bar-box-shadow, --nav-bar-link-text         ***
 *** DEFAULTS: #2f7cae (BLUE), (109, 109, 109, 0.744) (GREY), #575757 (GREY)    ***
 *** --nav-bar-hover-background, --nav-bar-hover-text                           ***
 *** DEFAULTS: #2f7cae (BLUE), white,                                           ***
 *** --nav-bar-hover-top-shadow, --nav-bar-hover-bottom-shadow                  *** 
 *** DEFAULTS: (85, 85, 85, 0.644) (DARK), (179, 179, 179, 0.644) (LIGHT)       ***
 ***                                                                            ***
 *** DESC/DELARED IN/LOCATION: The nav bar set of variables live in both        ***
 ***    components/MultiSelectDropdown.vue and components/NavBar.vue. They are  ***
 ***    declared in NavBar.vue and control all colors of these two .vue's.      ***
 ***                                                                            ***
 ***         --sync-border, --async-border, --recording-namecard                ***
 *** DEFAULTS: #04852f (GREEN), #683eca (PURPLE), #8f3eca (PURPLE)              ***
 ***                                                                            ***
 *** DESCRIPTION: The sync/async border will get displayed around lecture pills ***
 ***  that can be attending via video or live. The namecard color corresponds   ***
 ***  to the color displayed behind the names when you click 'Asynchronomous'   ***
 ***  in a Lecture's info page.                                                 ***
 ***                                                                            ***
 *** DECLARED IN: assets/css/venue-core.css                                     ***
 ***                                                                            ***
 *** LOCATIONS: assets/css/venue-core.css, components/LectureAttendanceList.vue ***
 *** components/StudentLectureAttendanceContainer.vue,                          ***
 *** components/InstructorLectureAttendanceContainer.vue                        ***
 ***                                                                            ***
 ***                                                                            ***
 ***                                                                            ***
 ***                      LECTURES/PILLS/ATTENDANCE                             ***
 ***                                                                            ***
 ***                                                                            *** 
 *** --red-pill, --red-pill-shadow, --yellow-pill, --yellow-pill-shadow         *** 
 *** DEFAULTS: #D14454, (249, 82, 71, 0.3), #b95726, (244, 159, 50, 0.4)        ***
 *** --blue-pill, --blue-pill-shadow, --green-pill, --green-pill-shadow         ***
 *** DEFAULTS: #0078c2, (79, 109, 234, 0.3), #04852f, (78, 205, 76, 0.3)        ***
 *** --upcoming-pill, --upcoming-pill-shadow                                    ***
 *** DEFAULTS: #0078c2 (BLUE), (109, 109, 109, 0.644) (GREY)                    ***
 *** --foreground-pill, --foreground-pill-shadow, --date-and-percent            ***   
 *** DEFAULTS: #f5f5f5 (WHITE), (109, 109, 109, 0.644) (GREY), white            ***
 *** --course-pill-shadow, --course-pill-hover                                  ***
 *** DEFAULTS: (109, 109, 109, 0.644) (GREY), (160, 160, 160, 0.644) (LIGHTER)  ***
 ***                                                                            ***
 *** DESCRIPTION: These control the inner and outer colors of lecture pills     ***
 ***            when you navigate to a course page (via dropdown on dashboard). ***
 ***            It's important that --red-pill, --green-pill and --yellow-pill  ***
 ***            remain hexadecimals, as they are used in a script in            ***
 ***       views/CourseInfo.vue that blends them via the user's lecture %       ***
 ***                                                                            *** 
 *** DECLARED IN: assets/css/venue-core.css                                     ***
 ***                                                                            *** 
 *** LOCATIONS: assets/css/venue-core.css, views/CourseInfo.vue,                ***
 *** components/StudentLectureAttendanceContainer.vue,                          ***
 *** components/InstructorLectureAttendanceContainer.vue,                       ***
 *** components/LectureAttendanceTable.vue, LectureAttendanceList.vue           *** 
 ***                                                                            *** 
 *** --lecture-live, --lecture-live-closed, --lecture-playback                  ***
 *** DEFAULTS: #04852F (GREEN), #f29f33 (LIGHT ORANGE), #683eca (PURPLE)        ***
 *** --lecture-recent, --lecture-upcoming, --lecture-pill-shadow                ***
 *** DEFAULTS: #858585 (GREY), #0076a8 (CYAN), (109, 109, 109, 0.644) (GREY)    ***
 *** --lecture-info-background, --lecture-course-number-text                    ***
 *** DEFAULTS: white, #097bac (CYAN)                                            ***
 *** --lecture-course-name-text, --lecture-name-text, --lecture-closed-text     ***
 *** DEFAULTS: #2f7cae (BLUE), #2C3E50 (NAVY), #a7640d (GOLD)                   ***
 ***                                                                            ***
 *** DESCRIPTION: The lecture cards live in the Dashboard page of venue.        ***
 ***                                                                            *** 
 *** DECLARED IN AND LOCATION: components/LectureCard.vue                       ***
 ***                                                                            ***
 *** --lecture-attendance-button-text, --lecture-attendance-grey-pill           ***
 *** DEFAULTS: # (GREY), (110, 110, 110)                                        *** 
 *** --lecture-attendance-grey-shadow, --lecture-attendance-text                ***
 *** DEFAULTS: (109, 109, 109, 0.644), white                                    *** 
 *** --lecture-attendance-live-glow, --lecture-attendance-async-glow            ***
 *** DEFAULTS: (65, 162, 91, 0.33) (GREEN), (214, 71, 233, 0.36) (PURPLE)       ***
 *** --lecture-attendance-absent-glow                                           ***
 *** DEFAULT: (219, 66, 83, 0.36) (RED)                                         ***
 ***                                                                            ***
 *** DESCRIPTION: These variables control the 3 big buttons that read           ***
 *** --green-pill                    [ Sychronous    - % ]                      ***
 *** --lecture-playback              [ Asynchronous - %  ]                      ***
 *** --red-pill                      [ Absent -       %  ]                      ***
 ***  (--green-pill, --lecture-playback and --red-pill) are background colors   ***
 ***  --lecture-attendance-text is the text color.                              ***
 ***                                                                            ***
 *** DECLARED IN AND LOCATION: components/LectureAttendanceTable.vue            ***
 ***                                                                            ***
 *** --course-attendance-rainbow-blue / purple / red / yellow / green           ***
 *** DEFAULTS: rgba(62,73,202,1), rgba(143,62,202,1), rgba(209,62,52,1),        ***
 ***                              rgba(176,95,22,1), rgba(4,133,47,1)           ***
 ***                                                                            ***
 *** DESCRIPTION: Similar to --red-pill, --yellow-pill and --green-pill, these  ***
 ***              variables are used in a script in CourseInfo.vue. It is       ***
 ***              recommended to keep these as an rgba with an alpha of 1,      ***
 ***     as changing that may impede the scripts ability to generate a gradient ***                                                               
 ***                                                                            ***
 *** DECLARED IN AND LOCATION: views/CourseInfo.vue                             ***
 ***                                                                            ***
 ***                                                                            ***
 ***                        DASHBOARD/HEADINGS                                  ***
 ***                                                                            ***
 *** --dashboard-text-color, --dashboard-background-color                       ***
 *** DEFAULTS: #2C3E50 (NAVY), #636363 (GREY)                                   ***
 ***                                                                            ***
 *** DESCRIPTION: --dashboard-text-color controls all headings of size 1, 2 and ***
 ***              4. This is pretty much every heading except course/ lecture   ***
 ***              card titles. --dashboard-background color sets the background ***
 ***              of the 4 sections in dashboard.                               ***
 ***                                                                            *** 
 *** DECLARED IN: components/DashboardSection.vue                               *** 
 ***                                                                            ***
 *** LOCATIONS: components/DashboardSection.vue, components/LectureList.vue,    ***
 ***            assets/css/venue.css, assets/css/venue-core.css                 ***
 ***                                                                            ***
 ***                                                                            ***
 ***                                                                            ***
 ***                                  MODALS                                    ***
 ***                                                                            ***
 ***                                                                            ***
 *** --modal-background, --modal-course-name, --modal-course-number             ***
 *** DEFAULTS: #ffffff (WHITE), #53788E (FADED BLUE), #2398C8 (CYAN)            ***
 *** --modal-border, --modal-container-background, --modal-lecture-border       ***
 *** DEFAULTS: grey, (255, 255, 255, 0.65) (WHITE), (120,120,120,1) (GREY)      ***
 *** --poll-background                                                          ***
 *** DEFAULT: lightskyblue                                                      ***
 ***                                                                            *** 
 *** DESCRIPTION: A modal can be decribed as anything that pops out of the page ***
 ***              stats-modal is one, qr-modal, basically anything that has to  ***
 ***              be put into a little box and treated as a separate entity.    ***
 ***                                                                            *** 
 *** DECLARED IN: assets/css/venue-core.css                                     ***
 ***                                                                            ***     
 *** LOCATIONS: assets/css/venue-core.css, views/NewLecture.vue                 ***
 ***     components/LectureUploadModal.vue, components/LectureInfoHeader.vue,   ***
 ***     components/LectureAttendanceTable.vue, components/CreatePoll.vue,      ***
 ***     components/AnswerPoll.vue, components/RestrictedPlayback.vue           ***
 ***                                                                            ***
 *** --card-background, --card-shadow1, --card-shadow2, --card-title-light/dark ***
 *** DEFAULTS: DarkGray, (0,0,0,0.25) (BLACK), (0,0,0,0.22) (BLACK),white/black ***
 ***                                                                            ***
 *** DESCRIPTION: (To be filled in)
 ***                                                                            ***
 *** DECLARED IN: components/RecentCard.vue                                     ***
 ***                                                                            ***   
 *** LOCATIONS: components/RecentCard.vue, components/EventCard.vue             ***
 ***                                                                            ***
 *** --info-container-percentage-text, --info-container-border / border-hover   ***                
 *** DEFAULTS: #828282 (GREY), (0, 0, 0, 0.3) (BLACK), (0, 0, 0, 0.6) (BLACK)   ***
 *** --info-container-text                                                      ***
 *** DEFAULT: #b54545 (FADED RED)                                               ***  
 ***                                                                            ***
 *** DESC/DECLARED IN/ LOCATION: Unique colors of components/InfoContainer.vue  ***
 ***                                                                            ***
 ***                                                                            ***
 ***                                  EVENTS                                    ***
 ***                                                                            ***
 ***                                                                            ***
 *** --event-pill-green, --event-pill-shadow, --event-pill-date                 ***
 *** DEFAULTS: #04852f, (0, 0, 0, 0.065) (BLACK), (0, 0, 0, 0.6) (BLACK)        *** 
 *** --event-pill-name, --event-pill-location                                   ***
 *** DEFAULTS: (0, 0, 0, 1) (BLACK), (0, 0, 0, 0.5) (BLACK)                     ***
 *** --event-pill-border, --event-pill-text, --event-active-link                ***
 *** DEFAULTS: (35, 217, 96, 0.5) (GREEN), black, #2c3e50 (NAVY)                ***
 *** --event-list-background, --event-pending, --event-ongoing, --event-static  ***
 *** #F5F5F5 (WHITE), #E0932F (ORANGE), #4bcc69 (GREEN), #2a8dc7 (BLUE)         ***
 *** --event-ending, --event-course-name, --event-course-title                  *** 
 *** DEFAULTS: #919191 (GREY), #466D85 (FADED BLUE), #146c91 (CYAN)             ***
 *** --event-active-background, --event-active-shadow, --event-location         ***
 *** DEFAULTS: white, (0, 0, 0, 0.1) (BLACK), #524e0a (OLIVE)                   ***
 *** --event-ending-container, --event-today-container                          ***
 *** DEFAULTS: #516ded (RICH BLUE), #f29f33 (ORANGE)                            ***
 *** --event-hover-background, --event-hover-shadow, --event-today-title        ***   
 *** #e8e8e8 (WHITE), (0, 0, 0, 0.3) (BLACK), #1591C5 (CYAN)                    ***
 *** --event-today-time, --event-timeline-background                            ***
 *** DEFAULTS: #757575 (GREY), #f0f0f0 (WHITE)                                  ***
 ***                                                                            *** 
 *** DESCRIPTION: Event variables are similar to lecture pills and dashboard    ***
 ***              in the way that they emphasize things that are marked with    ***
 ***              "today" and recent, but are not as commonly used as           ***
 ***              dashboard + pills. (To be filled in more)                     ***
 ***                                                                            *** 
 *** DECLARED IN: components/EventHistoryList.vue (pill-green - pill-text),     ***
 ***         components/ActiveEventList.vue (active-link & list-background),    ***
 ***              components/ActiveEventCard.vue (pending - location),          ***
 ***          components/TodaysEventCard.vue (ending-container - today-title),  ***
 ***         components/TodaysEventList.vue (today-time, timeline-background)   ***
 ***                                                                            ***     
 ***                                                                            ***
 *** LOCATIONS: components/ActiveEventCard.vue, components/ActiveEventList.vue, ***
 ***            components/EventHistoryList.vue, components/OldLectureCard.vue, ***
 ***            components/TodaysEventCard.vue, components/TodaysEventList.vue, ***
 ***                                                                            ***
 ***                                                                            ***
 ***                                  CALENDAR                                  ***
 ***                                                                            ***
 ***                                                                            *** 
 *** --calendar-background, --calendar-border                                   ***
 *** DEFAULTS: white, (100,100,100,1) (GREY)                                    *** 
 *** --checkins-border, --calendar-selected                                     ***
 *** DEFAULTS: gray, (20,75,250,1) (RICH BLUE)                                  ***   
 ***                                                                            *** 
 *** DESC/ DECLARED IN/ LOCATIONS: Colors for the calendar that the instructor  ***
 *** uses to set times for lectures/polls. Can be found in views/NewLecture.css ***
 *** and assets/css/venue-core.css. Declared in assets/css/venue-core.css.      ***
 ***                                                                            ***
 ***                                                                            ***
 ***                                                                            ***
 ***                                  STATISTICS                                ***
 ***                                                                            ***
 ***                                                                            ***
 ***                                                                            *** 
 *** --stats-panel-background, --stats-live-border, --stats-live-fill           ***
 *** DEFAULTS: #c4c4c4 (LIGHT GREY), #04dd74 (GREEN), #bfffc6 (LIGHT GREEN)     ***
 *** --stats-playback-border, --stats-playback-fill, --stats-absent-border      ***
 *** DEFAULTS: #3282bf (PURPLE), #92bed2 (LIGHT PURPLE), #e95454 (RED)          ***
 *** --stats-absent-fill, --stats-panel-shadow                                  ***
 *** DEFAULTS: #ff8787 (LIGHT RED), (109, 109, 109, 0.644) (GREY)               ***          
 ***                                                                            *** 
 *** DESCRIPTION/ DECLARED IN/ LOCATION: Colors in views/Statistics.vue         ***
 ***                            Axes and Graph labels use --main-text-color.    ***                 
 ***                                                                            *** 
 ***                                                                            ***
 ***                                                                            ***
 ***                                  TOGGLE SWITCH                             ***
 ***                                                                            ***
 ***                                                                            ***
 *** --toggle-switch-on-background, --toggle-switch-on-ball                     ***
 *** DEFAULTS: #bfffc6 (LIGHT GREEN), #04dd74 (DARK GREEN)                      ***
 *** --toggle-switch-off-background, --toggle-switch-off-ball                   ***
 *** DEFAULTS: #ff8787 (LIGHT RED), #e95454 (DARK RED)                          ***                               
 *** --toggle-switch-disabled-background, --toggle-switch-disabled-ball         ***
 *** DEFAULTS: #7E7E7E (GREY), #4F4F4F (DARK GREY)                              ***
 ***                                                                            ***  
 ***                                                                            ***  
 **********************************************************************************
 **********************************************************************************      

 */
