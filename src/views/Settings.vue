<template>
  <div>
    <h1>Settings</h1>
    <div class="settings-container">
          <div class="name-area">
            <div class="name-div" v-if="editing_name">
              <input v-model="edited_first_name" :placeholder="current_user.first_name"/>
              <input v-model="edited_last_name" :placeholder="current_user.last_name"/>
              <button v-if="waiting" class="btn btn-primary" disabled><SquareLoader/></button>
              <div v-else>
                <button class="btn btn-secondary" @click="editing_name = false">Cancel</button>
              </div>
            </div>
            <div class="name-div" v-else>{{ current_user.first_name }} {{ current_user.last_name }} <button class="btn" title="Edit Course" id="edit-course" @click="editing_name = true"><img class="svg-color" id="edit-course" src="@/assets/venue-edit.svg" alt="Edit" width="40" aria-label="Edit"/></button></div>
            <div class="logout-div"><div class="logout-button" v-on:click="logoutUser" tabindex="0" role="button">Logout</div></div>
          </div>

          <div v-if="mode == 'setting_options'">

            <div class="setting-option-section">
                <div class="left">
                    <div>Current Email: <span class="value-area">{{ current_user.email }}</span></div>
                    <div class="small-div">The email is used to login to Venue.</div>
                </div>
                <div class="right">
                    <!-- <div class="change-button">Change</div> -->
                </div>
            </div>

            
            <div class="setting-option-section">
              <div class="left">
                <div>
                  Dark mode
                </div>
              </div>

              <div class="right">
                <label class="dark-mode-switch">
                  <div v-if="this.edited_dark_mode">
                    <input type="checkbox" v-on:click="toggleDarkMode()" checked>
                    <span class="dark-mode-slider"></span>
                  </div>
                  <div v-else>
                    <input type="checkbox" v-on:click="toggleDarkMode()">
                    <span class="dark-mode-slider"></span>
                  </div>
                </label>
              </div>
            </div> 
            
            
          
            <div style="position:relative" class="setting-option-section">
                <div class="left"></div>
                <div class="right">
                  <button class="btn btn-primary" @click="saveName()">Save Changes</button>
                </div>
            </div>

            <div style="position:relative" class="setting-option-section">
                <div class="left">
                    <router-link :to="{name: 'teach_new_course'}"><button class="btn btn-primary">Teach New Course</button></router-link>
                </div>
                <div class="right">
                    <!-- <div class="change-button">Change</div> -->
                </div>
            </div>

            <!-- <div class="setting-option-section">
                <div class="left">
                    <div>Current Password: <span class="value-area">*********</span></div>
                    <div class="small-div">The password is the key to your Venue account.</div>
                </div>
                <div class="right">
                    <div class="change-button" v-on:click="mode = 'change_password'">Change</div>
                </div>
            </div> --> 
          
          </div>

          <!-- Setting Actions -->
          <div v-else>
            <ChangePassword v-if="mode == 'change_password'" :current_user="current_user" :complete="actionComplete" />
          </div>
          
    </div>

  </div>
</template>

<script>
  import UserAPI from '@/services/UserAPI.js';
  import { authComputed } from '../vuex/helpers.js'
  import {showAt, hideAt} from 'vue-breakpoints'
  import ChangePassword from '@/components/ChangePassword.vue'
  import AuthAPI from '../services/AuthAPI';

  import SquareLoader from '@/components/Loaders/SquareLoader.vue';

  import LectureSubmissionAPI from '@/services/LectureSubmissionAPI.js'

  export default {
    name: 'Dashboard',
    computed: {
      ...authComputed
    },
    components: {
      hideAt,
      showAt,
      ChangePassword,
      SquareLoader
    },
    data(){
      return {
        current_user: {},
        mode: String,
        editing_name: false,
        edited_first_name: '',
        edited_last_name: '',
        edited_dark_mode: false,
        waiting: false
      }
    },
    created() {
      this.mode = "setting_options"
      this.getCurrentUser()
    },
    methods: {
      getCurrentUser() {
        this.current_user = this.$store.state.user.current_user
        this.edited_dark_mode = this.$store.state.user.current_user.dark_mode
        this.edited_first_name = this.$store.state.user.current_user.first_name
        this.edited_last_name = this.$store.state.user.current_user.last_name
      },
      actionComplete () {
        this.mode = "setting_options";
      },
      logoutUser() {
        AuthAPI.logoutCAS().then(res => {
          this.$store.dispatch('logout')
        })
      },
      handleUpdateSubmissions() {
        LectureSubmissionAPI.updateAllToNewModel()
        .then(res => {
          location.reload()
        })
      },
      toggleDarkMode() {
        this.edited_dark_mode = !this.edited_dark_mode;
      },
      async saveName() {
        this.waiting = true
        this.current_user.first_name = this.edited_first_name
        this.current_user.last_name = this.edited_last_name
        this.current_user.dark_mode = this.edited_dark_mode
        await UserAPI.updateUser(this.current_user._id,this.current_user).then(res => {
          this.$store.dispatch('updateCurrentUser',{token: this.$store.state.user.token, current_user: this.current_user})
          this.edited_dark_mode = this.$store.state.user.current_user.dark_mode
          this.edited_first_name = this.$store.state.user.current_user.first_name
          this.edited_last_name = this.$store.state.user.current_user.last_name
          this.waiting = false
          this.editing_name = false
        })
        location.reload()
      }
    }
  }
</script>

<style>
   :root {
      --settings-logout-button: rgb(207,39,41);
      --settings-logout-button-shadow: rgba(144, 62, 80, 1);
      --settings-logout-hover-text: white;

      --settings-text: #517B94;
      --settings-small-div: rgba(0, 0, 0, 0.64);

      /* --settings-switch-on: #04852F; */
      --settings-switch-off: #f55442;
      --settings-switch-ball: white;
    }

    .settings-container {
      background-color: var(--main-background-color);
      padding: 2rem;
      margin: 80px auto;
      text-align: left;
      background: var(--main-background-color);
      max-width: 50rem;
    }

    .settings-links {
        width: 15%;
    }

    .settings-links, .settings-body {
        display: inline-block;
        vertical-align: top;
    }

    .settings-links ul li {
        list-style: none;
        color: var(--settings-text);
        margin-bottom: 5px;
        width: 80%;
        height: 30px;
        line-height: 30px;
        text-align: right;
        box-sizing: border-box;
        margin-right: 10px;
        border-radius: 5px;
        cursor: pointer;
    }

    .settings-links ul li.active {
        background-color: var(--settings-text);
        color: var(--main-text-color);
    }

    .name-area {
        font-size: 2rem;
    }

    .name-area .name-div {
        width: 75%;
        min-width: 300px;
    }

    .name-area .logout-div {
      float: right;
    }

    .name-area .logout-div .logout-button {
        font-size: 0.9rem;
        padding: 0.5rem 2rem;
        text-align: center;
        font-size: 1rem;
        border: 3px solid var(--settings-logout-button); 
        border-radius: 0.5rem;
        box-shadow: 0px 3px 5px var(--settings-logout-button-shadow);
        background-color: var(--main-background-color);
        transition: background 0.25s, color 0.25s;
        font-weight: bold;
        color: var(--settings-logout-button);
        font-family: "Exo";
        cursor: pointer;
    }

    .name-area .logout-div .logout-button:hover,
    .name-area .logout-div .logout-button:focus {
      background-color: var(--settings-logout-button);
      color: var(--settings-logout-hover-text);
      outline: none;
    }

    .name-area .name-div, .name-area .logout-div {
        display: inline-block;
        vertical-align: top;
    }

    .setting-option-section {
        margin: 30px 15px;
        /* background-color: var(--main-background-color); */
        color: var(--main-text-color);
        /* background: var(--main-background-color); */
    }

    .value-area {
        font-weight: italic;
    }

    .setting-option-section .left, .setting-option-section .right {
        display: inline-block;
        vertical-align: top;
    }

    .setting-option-section .left {
        width: 70%;
        min-width: 300px;
    }
    .setting-option-section .right {
        width: 25%;
        float: right;
    }

    .small-div {
        font-size: 0.9rem;
        color: var(--settings-small-div);
        margin-left: 10px;
    }

    .change-button {
        background-color: var(--main-background-color);
        border: 3px solid var(--settings-logout-button-shadow);
        color: var(--settings-logout-button-shadow);
        font-weight: bold;
        display: inline-block;
        width: 100px;
        text-align: center;
        height: 40px;
        line-height: 37px;
        border-radius: 3px;
        cursor: pointer;
        transition: background-color 0.25s, color 0.25s, box-shadow 0.25s, border 0.25s;
        box-shadow: 0px 2px 5px var(--settings-logout-button-shadow);
    }

    .change-button:hover {
        background-color: var(--settings-logout-button);
        color: var(--main-text-color);
        box-shadow: 0px 0px 10px 5px var(--settings-logout-button-shadow);
        border: 3px solid var(--settings-logout-button);
    }

    .dark-mode-switch {
      position: relative;
      display: inline-block;
      width: 60px;
      height: 34px;
    }

    .dark-mode-switch input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    .dark-mode-slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: var(--settings-switch-off); 
      -webkit-transition: .4s;
      transition: .4s;
      border-radius: 34px;
    }

    .dark-mode-slider:before {
      content: "";
      position: absolute;
      height: 26px;
      width: 26px;
      left: 4px;
      bottom: 4px;
      background-color: var(--settings-switch-ball);
      -webkit-transition: .4s;
      transition: .4s;
      border-radius: 50%;
      content: "off";
      font-size: 12px;
      text-align: center;
      color: var(--settings-switch-off);
      font-weight: bold;
      line-height: 26px;
    }


    input:checked + .dark-mode-slider {
      background-color: var(--settings-switch-on);
    }

    input:focus + .dark-mode-slider {
      box-shadow: 0 0 1px var(--settings-switch-on);
    }

    input:checked + .dark-mode-slider:before {
      -webkit-transform: translateX(26px);
      -ms-transform: translateX(26px);
      transform: translateX(26px);
      content: "on";
      color: var(--settings-switch-on);
    }

</style>