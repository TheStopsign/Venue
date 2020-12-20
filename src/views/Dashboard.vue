<template>
  <div id="dashboard-container">
    <SquareLoader role="status" v-if="!live_lectures_loaded && !playback_lectures_loaded && !recent_lectures_loaded && !upcoming_lectures_loaded"/>
    <div v-else>
      <div class="dashboard-component" :style="{visibility: this.main === 'None' || this.main === 'Live' ? 'visible': 'hidden'}">
        <DashboardSection lecture_type="Live" :lecture_list="live_lectures" @hide_all="main='Live'" @reveal_all="main='None'"/>
      </div>
      <div class="dashboard-component" :style="{visibility: this.main === 'None' || this.main === 'Playback' ? 'visible': 'hidden'}">
        <DashboardSection lecture_type="Playback" :lecture_list="playback_lectures" @hide_all="main='Playback'" @reveal_all="main='None'"/>
      </div>
      <div class="dashboard-component" :style="{visibility: this.main === 'None' || this.main === 'Recent' ? 'visible': 'hidden'}">
        <DashboardSection lecture_type="Recent" :lecture_list="recent_lectures" @hide_all="main='Recent'" @reveal_all="main='None'"/>
      </div>
      <div class="dashboard-component" :style="{visibility: this.main === 'None' || this.main === 'Upcoming' ? 'visible': 'hidden'}">
        <DashboardSection lecture_type="Upcoming" :lecture_list="upcoming_lectures" @hide_all="main='Upcoming'" @reveal_all="main='None'"/>
      </div>
    </div>
  </div>
</template>

<script>
  import UserAPI from '@/services/UserAPI.js';
  import LectureAPI from '@/services/LectureAPI.js';
  import CourseAPI from '@/services/CourseAPI.js';
  import SectionAPI from '@/services/SectionAPI.js';
  import { authComputed } from '../vuex/helpers.js'
  import {showAt, hideAt} from 'vue-breakpoints'
  import PaletteAPI from '../services/PaletteAPI';
  import {getLiveLectures,getRecentLectures,getUpcomingLectures,getActivePlaybackLectures} from '@/services/GlobalFunctions.js'

  import LiveLectureList from '@/components/LiveLectureList.vue'
  import PlaybackLectures from '@/components/PlaybackLectures.vue'
  import RecentLectures from '@/components/RecentLectures.vue'
  import UpcomingLectures from '@/components/UpcomingLectures.vue'
  import CourseList from '@/components/CourseList.vue'
  import moment from 'moment'
  import DashboardSection from '@/components/DashboardSection.vue'

  import SquareLoader from '@/components/Loaders/SquareLoader.vue'

  export default {
    name: 'Dashboard',
    props: {
    },
    computed: {
      ...authComputed
    },
    components: {
      DashboardSection,
      hideAt,
      showAt,
      LiveLectureList,
      PlaybackLectures,
      RecentLectures,
      UpcomingLectures,
      CourseList,
      SquareLoader
    },
    data(){
      return {
        current_user: {},
        all_lectures: [],
        live_lectures: [],
        live_lectures_exist: Boolean,
        playback_lectures: [],
        playback_lectures_exist: Boolean,
        recent_lectures: [],
        recent_lectures_exist: Boolean,
        upcoming_lectures: [],
        upcoming_lectures_exist: Boolean,
        courses_loaded: Number,
        courses: Object,
        STATIC_COURSE_COLORS: Array,
        live_lectures_loaded: false,
        upcoming_lectures_loaded: Boolean,
        recent_lectures_loaded: Boolean,
        playback_lectures_loaded: Boolean,
        section_1: String,
        section_2: String,
        main: String,
      }
    },
    created() {
      this.main = "None";
      this.STATIC_COURSE_COLORS = ['Aquamarine', 'Tomato', 'LightSalmon', 'Cyan', 'MediumTurquoise', 'PaleGreen', 'pink', 'violet', ]
      this.courses_loaded = 0

      this.live_lectures_loaded = false
      this.upcoming_lectures_loaded = false
      this.recent_lectures_loaded = false
      this.playback_lectures_loaded = false

      this.getCurrentUser()
      this.getAllLecturesForUser()
      this.setPalette()
    },
    methods: {
      getColor (course_info) {
        if (course_info == null || course_info._id == null) return 'grey'
        if (this.courses[ course_info._id ] == null || this.courses[ course_info._id ] == undefined) {
          // add the course and
          let next_color_index = 0;
          Object.keys(this.courses).forEach(course_ => {
            if (this.courses[course_].hasOwnProperty('color_index')) next_color_index = Math.max(next_color_index, this.courses[course_].color_index)
          })

          this.courses[course_info._id] = {
            color_index: next_color_index
          }
          return this.STATIC_COURSE_COLORS[next_color_index]

        }
        if (!this.courses[ course_info._id ].hasOwnProperty('color_index')) return 'grey'
        let color_index = this.courses[ course_info._id ].color_index
        if (color_index != null && color_index != undefined && color_index >= 0 && color_index < this.STATIC_COURSE_COLORS.length) {
          return this.STATIC_COURSE_COLORS[color_index]
        }
        return 'grey'
      },
      setCourses (courses_data) {
        let course_dict = {}
        courses_data.forEach((course_, i) => {
          if (course_ != null && course_.hasOwnProperty('_id')) {
            course_dict[course_._id] = course_
            course_dict[course_._id]["color_index"] = i
          }
        })
        this.courses = course_dict

      },
      getCurrentUser() {
        this.current_user = this.$store.state.user.current_user
      },
      logOut() {
        this.$store.dispatch('logout')
      },
      setCourseSize (_size_) {
        this.courses_loaded = _size_
      },
      async getAllLecturesForUser() {
        const response = await LectureAPI.getLecturesForUser(this.current_user._id, "with_sections_and_course")
        this.parseLiveLectures(response.data)
        this.parsePlaybackLectures(response.data)
        this.parseRecentLectures(response.data)
        this.parseUpcomingLectures(response.data)
        this.chooseLecturesToDisplay()
      },
      parseLiveLectures(all_lectures) {
        this.live_lectures = getLiveLectures(all_lectures)
        this.setcheckinWindowStatusesForLiveLectures()
        this.sortLiveLecturesByCheckinWindowStatus()
        this.live_lectures_loaded = true
        this.live_lectures_exist = this.live_lectures.length > 0
      },
      parsePlaybackLectures(all_lectures) {
        this.playback_lectures = getActivePlaybackLectures(all_lectures)
        this.playback_lectures_loaded = true
        this.playback_lectures_exist = this.playback_lectures.length > 0
      },
      parseRecentLectures(all_lectures) {
        this.recent_lectures = getRecentLectures(all_lectures)
        this.recent_lectures_loaded = true
        this.recent_lectures_exist = this.recent_lectures.length > 0
      },
      parseUpcomingLectures(all_lectures) {
        this.upcoming_lectures = getUpcomingLectures(all_lectures)
        this.upcoming_lectures_loaded = true
        this.upcoming_lectures_exist = this.upcoming_lectures.length > 0
      },
      setcheckinWindowStatusesForLiveLectures() {
        this.live_lectures.forEach(lecture => {
          this.setCheckinWindowStatus(lecture)
        })
      },
      setCheckinWindowStatus(lecture) {
        let current_time = new Date()
        let found_open_checkin_window = false
        for(let i = 0; i < lecture.checkins.length; i++) {
          let current_checkin = lecture.checkins[i]
          let current_checkin_start_time = new Date(current_checkin.start_time)
          let current_checkin_end_time = new Date(current_checkin.end_time)
          if(current_time >= current_checkin_start_time && current_time <= current_checkin_end_time){
            lecture.checkin_window_status = "open"
            lecture.checkin_index = i
            lecture.current_checkin = current_checkin
            found_open_checkin_window = true
            break
          }
        }
        if(!found_open_checkin_window)
          lecture.checkin_window_status = "closed"
      },
      sortLiveLecturesByCheckinWindowStatus() {
        let temp_list = []
        this.live_lectures.forEach(lecture => {
          if(lecture.checkin_window_status === "open")
            temp_list.unshift(lecture)
          else
            temp_list.push(lecture)
        })
        this.live_lectures = temp_list
      },
      chooseLecturesToDisplay() {
        let lecture_existence_pairs = [["live", this.live_lectures_exist], ["playback", this.playback_lectures_exist],
          ["recent", this.recent_lectures_exist], ["upcoming", this.upcoming_lectures_exist]]
        let found_first_type = false
        for(let i = 0; i < lecture_existence_pairs.length; i++) {
          let pair = lecture_existence_pairs[i]
          let lecture_type = pair[0]
          let lecture_existence_status = pair[1]
          if(lecture_existence_status) {
            if(!found_first_type) {
              this.section_1 = lecture_type
              found_first_type = true
            } else if(found_first_type) {
              this.section_2 = lecture_type
              break
            }
          }
        }
      },
      setPalette() {
        let root = document.documentElement;
        PaletteAPI.setPalette(root, this.current_user.dark_mode)
      }
    }
  }
</script>

<style scoped>
  #dashboard-container {
    width: 85%;
    margin: auto;
  }
  .dashboard-component {
    width: 50%;
    display: inline-block;
  }

  @media only screen and (max-width: 800px) {
    .dashboard-component {
      width: 100%;
      display: inline-block;
    }
  }
</style>
