<template>
  <div>
    <show-at breakpoint="large">
      <div class="venue-body-container">

        <!-- Title -->
        <div class="title">
          <router-link :to="{name: 'new_lecture', params: { course_id: $route.params.id }}" tabindex="-1">
            <div class="big-button" :style="{float: 'right'}" tabindex="0">Create New Lecture for {{ course.prefix }} {{ course.suffix }}</div>
          </router-link>
        </div>
        <div class="copy-button-box">
          <button class="inline-block big-button" tabindex="0" @click="copyURL">Copy Link to Join {{ course.prefix }} {{ course.suffix }}</button>
          <div class="copy-message" :style="{opacity: show_copymsg ? 1 : 0}">Success!</div>
        </div>
        <CourseInfoTitle :course="course" :section_name="sorted_sections.map(a => a.name).join(', ')" class="inline-block" :is_instructor="true"/>
        <!-- Attendance History -->
        <div>
          <div class="section-select-container float-right">
            <label id="section_select_label">Section(s):</label>
            <div>
              <MultiSelectDropdown :options="sorted_sections" :preselected="sorted_sections" v-if="sorted_sections.length > 0" sort-by="name" @update="onSectionChange"/>
            </div>
          </div>
          <div class="courseinfo-legend">Legend:</div>
          <div class="courseinfo-legend live-border-display-only">Synchronous</div>
          <div class="courseinfo-legend playback-border-display-only">Asynchronous</div>
        </div>
        <InstructorAttendanceHistory
          v-if="selected_lectures && selected_timeline" :students="course_students"
          :lectures="selected_lectures" :timeline="selected_timeline" :scores_loaded="scores_loaded"/>
        <div v-else-if="!lectures_loaded" :style='{textAlign: "center"}'>
          <SquareLoader />
        </div>
        <div v-else>
          None
        </div>
      </div>
    </show-at>
    <hide-at breakpoint="large">
      <div>
        <!-- Mobile View -->
        <CourseInfoTitle :course="course" :section_name="sorted_sections.map(a => a.name).join(', ')" class="inline-block" :is_instructor="true" mobileMode/>        
        <router-link :to="{name: 'new_lecture', params: { course_id: $route.params.id }}" tabindex="-1">
          <div class="inline-block big-button mobile" tabindex="0">Create New Lecture for {{ course.prefix }} {{ course.suffix }}</div>
        </router-link>
        <div class="copy-button-box">
          <button class="inline-block big-button mobile" tabindex="0" @click="copyURL">Copy Link to Join {{ course.prefix }} {{ course.suffix }}</button>
          <div class="copy-message" :style="{opacity: show_copymsg ? 1 : 0}">Success!</div>
        </div>
        <div class="courseinfo-attendance-listing">
          <div class="section-select-container mobile float-right">
            <label id="section_select_label">Section(s):</label>
            <div>
              <MultiSelectDropdown :options="sorted_sections" :preselected="sorted_sections" v-if="sorted_sections.length > 0" sort-by="name" @update="onSectionChange"/>
            </div>
          </div>
          <div class="courseinfo-legend">Legend:</div>
          <div class="courseinfo-legend live-border-display-only">Synchronous</div>
          <div class="courseinfo-legend playback-border-display-only">Asynchronous</div>
          <InstructorAttendanceHistory :style='{textAlign: "center"}'
                  v-if="selected_lectures && selected_timeline" :students="course_students"
                  :lectures="selected_lectures" :timeline="selected_timeline" :scores_loaded="scores_loaded" mobileMode/>
          <div v-else-if="!lectures_loaded" :style='{textAlign: "center"}'>
            <SquareLoader />
          </div>
          <div v-else>
            None
          </div>
        </div>
      </div>
    </hide-at>

  </div>
</template>

<script>

  import CourseAPI from '@/services/CourseAPI.js';
  import UserAPI from '@/services/UserAPI.js';
  import SectionAPI from '@/services/SectionAPI.js';
  import LectureAPI from '@/services/LectureAPI.js';
  import LectureSubmissionAPI from '@/services/LectureSubmissionAPI.js'
  import {getLiveLectures,getRecentLectures,getUpcomingLectures,getActivePlaybackLectures,getPastLectures} from '@/services/GlobalFunctions.js'

  import {showAt, hideAt} from 'vue-breakpoints';
  import CourseInfoTitle from '@/components/CourseInfoTitle.vue'
  import EventHistoryList from '@/components/EventHistoryList.vue';
  import InstructorAttendanceHistory from '@/components/InstructorAttendanceHistory.vue'
  import StudentAttendanceHistory from '@/components/StudentAttendanceHistory.vue'
  import LecturePillList from '@/components/LecturePillList.vue'
  import UpcomingLecturesList from '@/components/UpcomingLecturesList.vue'
  import SquareLoader from '@/components/Loaders/SquareLoader.vue'
  import MultiSelectDropdown from "../../components/MultiSelectDropdown";

  import '@/assets/css/venue-core.css'
  import '@/assets/icon-font.css'

export default {
  name: 'InstructorCourseInfo',
  props: {
  },
  computed: {
  },
  components: {
    MultiSelectDropdown,
    EventHistoryList,
    showAt,
    hideAt,
    CourseInfoTitle,
    StudentAttendanceHistory,
    InstructorAttendanceHistory,
    LecturePillList,
    UpcomingLecturesList,
    SquareLoader,
  },
  data(){
    return {
      course: {},
      section: {},
      all_lectures: [],
      upcoming_lectures: [],
      live_lectures: [],
      past_lectures: [],
      playback_lectures: [],
      course_students: [],
      subview_section_id: 0,
      sections: Object,
      sorted_sections: [],
      selected_section: "all",
      sorted_lectures: {},
      lectures_loaded: false,
      scores_loaded: false,
      is_instructor: false,
      is_ta: false,
      is_student: false,
      selected_lectures: [],
      selected_timeline: {},
      show_copymsg: false,
    }
  },
  created() {
    // when the component is created/loaded
    this.getCurrentUser();
    this.course_id = this.$route.params.id;
    this.getAllSections();
    this.getStudentsForCourse();
    this.getCourse();
  },
  methods: {
    copyURL() {
      var link = (process.env.NODE_ENV === 'production'?'https://www.venue-meetings.com':'http://localhost:8080')+"/#/join_course/"+this.course._id;

      navigator.permissions.query({name: "clipboard-write"}).then(result => {
        if (result.state === "granted" || result.state === "prompt") {
          navigator.clipboard.writeText(link);
          this.copyMsg();
        } else {
          window.alert("Copy failed, the course link is: " + link + ".")
        }
      }).catch(err => {
        navigator.clipboard.writeText((process.env.NODE_ENV === 'production'?'https://www.venue-meetings.com':'http://localhost:8080')+"/#/join_course/"+this.course._id)
        this.copyMsg();
      });
    },
    async getAllSections () {
      SectionAPI.getSectionsForCourse(this.course_id)
      .catch(err => { console.log(`Problem getting sections for course ${this.course_id}`); console.log(err);})
      .then(response => {
        response.data.forEach(section_ => {
          this.sections[section_._id] = section_
          this.sorted_sections.push(section_)
        })
        this.sorted_sections.sort((a, b) => (a.name > b.name) ? 1 : -1)
        this.getAllLecturesForCourse()
      })
    },
    async getStudentsForCourse() {
      const response = await UserAPI.getStudentsForCourse(this.course_id)
      this.course_students = response.data
    },
    getCurrentUser() {
      this.current_user = this.$store.state.user.current_user
    },
    parseActivePlaybackLectures(all_lectures) {
      this.playback_lectures = getActivePlaybackLectures(all_lectures)
    },
    parsePastLectures(all_lectures) {
      this.past_lectures = getPastLectures(all_lectures)
    },
    parseLiveLectures(all_lectures) {
      this.live_lectures = getLiveLectures(all_lectures)
    },
    parseUpcomingLectures(all_lectures) {
      this.upcoming_lectures = getUpcomingLectures(all_lectures)
    },
    async getAllLecturesForCourse() {
      LectureAPI.getLecturesForCourse(this.course_id)
      .then(response => {
        this.all_lectures = response.data
        this.all_lectures.sort((a, b) => 
          (a.start_time > b.start_time || a.playback_submission_start_time > b.playback_submission_start_time ||
          a.start_time > b.playback_submission_start_time || a.playback_submission_start_time > b.start_time) ? 1 : -1
        )
        this.parseUpcomingLectures(this.all_lectures)
        this.parseLiveLectures(this.all_lectures)
        this.parsePastLectures(this.all_lectures)
        this.parseActivePlaybackLectures(this.all_lectures)
        this.sortLecturesBySectionAndBuildTimeLine({instructor: true})
      })
    },
    getCourse () {
      CourseAPI.getCourse(this.course_id)
      .then(response => {
        this.course = response.data
      })
      .catch(err => {
        console.log(`Error getting course from course_id`)
      })
    },
    sortLecturesBySectionAndBuildTimeLine(options) {
      let sorted = {}
      sorted["all"] = {}
      sorted["all"].lectures = []
      this.all_lectures.forEach(lect => {
        sorted["all"].lectures.push(lect)
        lect.sections.forEach(sectID => {
          if(undefined != this.sections[sectID]) {
            if(undefined == lect.students) {
              lect.students = [...this.sections[sectID].students]
            } else {
              for(let i=0;i<this.sections[sectID].students.length;i++) {
                if(!lect.students.includes(this.sections[sectID].students[i])) {
                  lect.students.push(this.sections[sectID].students[i])
                }
              }
            }
          }
          if(undefined == sorted[sectID]) {
            sorted[sectID] = {}
            sorted[sectID].lectures = []
          }
          sorted[sectID].lectures.push(lect)
        })
      })
      Object.keys(sorted).forEach(sectID => {
        sorted[sectID].timeline = {}
        sorted[sectID].lectures.sort((a, b) => (a.start_time > b.start_time) ? 1 : -1)
        for(let i=0;i<sorted[sectID].lectures.length;i++) {
          let lect = sorted[sectID].lectures[i]
          if(undefined == lect.start_time || "Invalid Date" == lect.start_time || null == lect.start_time) {
            lect.start_time = new Date(lect.playback_submission_start_time)
          } else {
            lect.start_time = new Date(lect.start_time)
          }
          let year = lect.start_time.getFullYear()
          let month = lect.start_time.getMonth()
          if(!sorted[sectID].timeline[year]) {
            sorted[sectID].timeline[year] = {}
          }
          if(!sorted[sectID].timeline[year][month]) {
            sorted[sectID].timeline[year][month] = []
          }
          sorted[sectID].timeline[year][month].push(i)
        }
      })
      this.sorted_lectures = sorted
      this.lectures_loaded = true

      this.selected_lectures = sorted["all"].lectures
      this.selected_timeline = sorted["all"].timeline

      this.calculateInstructorAttendances()
    },
    perc2color(pct) {
      let root = document.documentElement;
      //const style = getComputedStyle(root);
      var bad_attendance = new Color();
      var medium_attendance = new Color();
      var good_attendance = new Color();

      var rainbow_blue = new Color();
      var rainbow_purple = new Color();
      var rainbow_red = new Color();
      var rainbow_yellow = new Color();
      var rainbow_green = new Color(); 

      bad_attendance = getComputedStyle(root).getPropertyValue('--red-pill');
      medium_attendance = getComputedStyle(root).getPropertyValue('--yellow-pill');
      good_attendance = getComputedStyle(root).getPropertyValue('--green-pill');

      // The rainbow is made up of these 5 pieces
      rainbow_blue = getComputedStyle(root).getPropertyValue('--course-attendance-rainbow-blue');
      rainbow_purple = getComputedStyle(root).getPropertyValue('--course-attendance-rainbow-purple');
      rainbow_red = getComputedStyle(root).getPropertyValue('--course-attendance-rainbow-red');
      rainbow_yellow = getComputedStyle(root).getPropertyValue('--course-attendance-rainbow-yellow');
      rainbow_green = getComputedStyle(root).getPropertyValue('--course-attendance-rainbow-green');

      var percentColors = [
        //{ pct: 0.0, color: { r: 0xd1, g: 0x3e, b: 0x34 } },
        { pct: 0.0, color: { r: "0x" + bad_attendance[1] + bad_attendance[2], g: "0x" + bad_attendance[3] + bad_attendance[4], b: "0x" + bad_attendance[5] + bad_attendance[6] } },
        { pct: 0.6, color: { r: "0x" + bad_attendance[1] + bad_attendance[2], g: "0x" + bad_attendance[3] + bad_attendance[4], b: "0x" + bad_attendance[5] + bad_attendance[6] } },
        { pct: 0.8, color: { r: "0x" + medium_attendance[1] + medium_attendance[2], g: "0x" + medium_attendance[3] + medium_attendance[4], b: "0x" + medium_attendance[5] + medium_attendance[6] } },
        // { pct: 0.85, color: { r: 0x82, g: 0x90, b: 0x25 } },
        { pct: 1.0, color: { r: "0x" + good_attendance[1] + good_attendance[2], g: "0x" + good_attendance[3] + good_attendance[4], b: "0x" + good_attendance[5] + good_attendance[6] } } 
      ];
      for (var i = 1; i < percentColors.length - 1; i++) {
        if (pct < percentColors[i].pct) {
          break;
        }
      }
      var lower = percentColors[i - 1];
      var upper = percentColors[i];
      var range = upper.pct - lower.pct;
      var rangePct = (pct - lower.pct) / range;
      var pctLower = 1 - rangePct;
      var pctUpper = rangePct;
      var color = {
        r: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper),
        g: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper),
        b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper) 
      };
      if (pct == 1.0) {
          return "linear-gradient(90deg, " + rainbow_blue + " 0%, " + rainbow_purple + " 20%, " + rainbow_red + " 40%, " + rainbow_yellow + " 70%, " + rainbow_green + " 100%)";
      }
        return "rgb(" + [color.r, color.g, color.b].join(",") + ")";
    },
    calculateInstructorAttendances() {
      LectureSubmissionAPI.getLectureSubmissionsForLectures(this.all_lectures.map(a=>a._id))
      .catch(err => { console.log('error retrieving lecture submissions for lecture ' + lecture_._id); console.log(err); })
      .then(response => {
        let promise_tracker = []
        this.all_lectures.forEach(lecture_ => {
          promise_tracker.push( new Promise((resolve,reject) => {
            let submissions = response.data == undefined ? [] : response.data.filter(a=>a.lecture == lecture_._id)
            let students = lecture_.students
            let running_total = 0
            students.forEach(stud => {
              submissions.forEach(submission => {
                if(submission.submitter.email == stud) {
                  if(submission.live_percent) {
                    if(submission.video_percent) {
                      running_total += Math.max(
                        submission.live_percent * 100,
                        submission.video_percent * 100
                      )
                    } else {
                      running_total += submission.live_percent * 100
                    }
                  } else if(submission.video_percent) {
                    running_total += submission.video_percent * 100
                  }
                }
              })
            })
            lecture_.percentage = running_total / students.length
            lecture_.color = this.perc2color(lecture_.percentage / 100)
            resolve(true)
          }))
        })
        Promise.all(promise_tracker)
        .then(res => {
          this.scores_loaded = true
        })
      })
    },
    onSectionChange(data) {
      var lectures = [];
      for (let sec of data) {
        if (this.sorted_lectures.hasOwnProperty(sec._id)) {
          let sl = this.sorted_lectures[sec._id].lectures;
          for (let lect of sl) {
            if (!lectures.find(x => x._id === lect._id)) {
              lectures.push(lect);
            }
          }
        }
      }
      this.selected_lectures = lectures;
      let timeline = {};
      for (let [i,lect] of lectures.entries()) {
        if(undefined === lect.start_time || "Invalid Date" === lect.start_time || null === lect.start_time) {
          lect.start_time = new Date(lect.playback_submission_start_time);
        } else {
          lect.start_time = new Date(lect.start_time);
        }
        let year = lect.start_time.getFullYear();
        let month = lect.start_time.getMonth();
        if(!timeline[year]) {
          timeline[year] = {};
        }
        if(!timeline[year][month]) {
          timeline[year][month] = [];
        }
        timeline[year][month].push(i);
      }
      this.selected_timeline = timeline;
      this.$forceUpdate();
    },
    copyMsg(){
      this.show_copymsg = 1;
      setTimeout(() => {
        this.show_copymsg = 0;
      }, 1000);
    }
  }
}
</script>

<style scoped>
:root {
  --course-attendance-rainbow-blue: rgba(62,73,202,1);
  --course-attendance-rainbow-purple: rgba(143,62,202,1);
  --course-attendance-rainbow-red: rgba(209,62,52,1);
  --course-attendance-rainbow-yellow: rgba(176,95,22,1);
  --course-attendance-rainbow-green: rgba(4,133,47,1);
}

  .course-event-container {
    /*border: green solid;*/
    overflow: hidden;
    padding-left: 6rem;
  }

  .info-section {
    /* display: inline-block; */
    margin-top: 2rem;
    float: left;
  }

  .course-title {
    border: black solid;
    display: inline-block;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
    margin-top: 0.5rem;
  }

  #event-info {
    width: 62%;
  }

  .new-event-btn {
    background-color: white;
    border: #007bff solid;
    color: black;
    border-radius: 5px;
  }

  .active-events-container {
    margin-top: 3rem;
    overflow: hidden;
  }

  .active-event-pill {
    display: inline-block;
    border: green solid;
    width: 18rem;
    border-radius: 3px;
    padding-left: 1rem;
    padding-right: 1rem;
    margin-left: 2rem;
    cursor: pointer;
  }

  .active-event-card-section {
    display: inline-block;
    color: black;
  }

  #active-event-name {
    float: left;
  }

  #active-event-time-remaining {
    float: right;
  }

  .attendance-history-container {
    /*border: blue solid;*/
    /*padding-left: 6rem;*/
    overflow: hidden;
    margin: auto;
    margin-top: 3rem;
    width: 86%;
  }

  .attendance-history-header {
    /*border: red solid;*/
    text-align: left;
  }

  .attendance-history-header-text {
    display: inline-block;
    /*border: purple solid;*/
  }

  .section-selector {
    /*border: orange solid;*/
    display: inline-block;
    margin-left: 1rem;
    text-decoration: underline;
    cursor: pointer;
  }

  .lecture-container {
    border: blue solid;
    width: 10rem;
    height: 3rem;
    border-radius: 5px;
    margin-left: 3rem;
    margin-top: 2rem;
    /* display: inline-block; */
    float: left;
    cursor: pointer;
  }

  .panel {
    height: 100%;
  }

  .section-select-container {
    display: inline-block;
  }

  .section-select-container.mobile {
    margin-top: 1rem;
  }

  .big-button {
    margin: 1rem 2rem;
    margin-right: 0rem;
    margin-bottom: 0rem;
  }

  .big-button.mobile {
    margin: 1rem 2rem;
    margin-bottom: 0rem;
  }

  .copy-button-box {
    float: right;
  }

  .copy-message{
    position: absolute;
    margin: 1rem 2.5rem;
    opacity: 0;
    transition: opacity 1s;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

</style>
