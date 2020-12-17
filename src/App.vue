<template>
  <div>
    <div id="app">
      <NavBar class="main_navbar" v-if="this.$route.name != 'landing_page' && this.$route.name != 'set_permanent_password' && current_user"></NavBar>
      <main id="main-content">
        <router-view :key="$route.fullPath" />
      </main>
    </div>
    <Footer/>
  </div>
</template>

<script>

import NavBar from "./components/NavBar.vue";
import Footer from "./components/Footer.vue";
import LectureAPI from './services/LectureAPI';
import {getLiveLectures,getUpcomingLectures,getPastLectures} from './services/GlobalFunctions.js'
import '@/assets/css/venue.css';
import UserAPI from '@/services/UserAPI.js';
import PaletteAPI from '@/services/PaletteAPI.js'

export default {
  watch: {
    '$route' (to, from) {
      document.title = to.meta.title || 'Venue'
      if(this.$store.state.user) {
        UserAPI.getUser(this.$store.state.user.current_user._id).then(res => {
          this.$store.dispatch('updateCurrentUser',{token: this.$store.state.user.token, current_user: res.data})
        })
      }
    }
  },
  components: {
    NavBar,
    Footer
  },
  data() {
    return {
      current_user: null
    }
  },
  created() {
    let self = this
    var waitForUser = setInterval(function(){
      if (self.$store.state.user && self.$store.state.user.current_user) {
        self.current_user = self.$store.state.user.current_user
        self.afterUser()
        clearInterval(waitForUser);
      }
    }, 100);
  },
  methods: {
    afterUser() {
      UserAPI.getUser(this.$store.state.user.current_user._id).then(res => {
        this.current_user = res.data
        if(this.current_user) {
          this.setPalette()
          this.$store.dispatch('updateCurrentUser',{token: this.$store.state.user.token, current_user: res.data})
          if((this.current_user.instructor_courses && this.current_user.instructor_courses.length) || (this.current_user.ta_sections && this.current_user.ta_sections.length)) {
            LectureAPI.getLecturesForUser(this.current_user._id, "with_sections_and_course")
            .then(res => {
              let inst_lects = res.data.filter(lect => this.current_user.instructor_courses.includes(lect.sections[0].course._id)
                || lect.sections.some(sect => this.current_user.ta_sections.includes(sect._id)))
              let liveAndUpcoming = getLiveLectures(inst_lects).concat(getUpcomingLectures(inst_lects))
              if (!("Notification" in window)) {
                alert("This browser does not support desktop notification");
              } else if (Notification.permission === "granted") {
                this.processNotifications(liveAndUpcoming)
              } else if (Notification.permission !== "denied") {
                Notification.requestPermission().then(function (permission) {
                  if (permission === "granted") {
                    this.processNotifications(liveAndUpcoming)
                  }
                });
              }
              this.processInstructorEmails(getPastLectures(inst_lects))
            })
          }
        } else {
          this.$store.dispatch('logout')
        }
      })
    },
    processNotifications(lectures) {
      for(let i=0;i<lectures.length;i++) {
        for(let j=0;j<lectures[i].checkins.length;j++) {
          let timeuntil = Date.parse(lectures[i].checkins[j].start_time) - Date.now()
          if(timeuntil > -1000) { //If the page loads within one second of checkin-time
            let self = this
            setTimeout(function() {
              self.attendanceNotification(lectures[i]._id)
            },timeuntil)
          }
        }
      }
    },
    attendanceNotification(lectureid) {
      var notification = new Notification("Time to take attendance!");
      notification.onclick = function(event) {
        event.preventDefault(); // prevent the browser from focusing the Notification's tab
        if(process.env.NODE_ENV === "production") {
          window.open('https://www.venue-meetings.com/#/lecture_info/'+lectureid, '_blank');
        } else {
          window.open('http://localhost:8080/#/lecture_info/'+lectureid, '_blank');
        }
      }
    },
    processInstructorEmails(lectures) {
      // LectureAPI.processEmailsForLectures(lectures,this.current_user.email)
    },
    setPalette() {
		  PaletteAPI.setPalette(document.documentElement, this.current_user.dark_mode)
    }
  }
  //initially displayNav is false because the first page loaded is the homepage
}
</script>

<style lang="scss">
#app {
  font-family: "Comfortaa", "Exo", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  min-height: calc(100vh - 2rem);
  // min-height: 100%;
}

main {
  position: relative;
  top: 0;
  width: 100%;
  overflow-y: auto;
  min-height: calc(100vh - 9.5rem);
}
</style>
