<template>
  <div>
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

  import '@/assets/css/venue-core.css'
  import '@/assets/icon-font.css'

export default {
  name: 'CourseInfo',
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
      is_student: false
    }
  },
  created() {
    // when the component is created/loaded
    this.getCurrentUser()
  },
  methods: {
    getCurrentUser() {
      this.current_user = this.$store.state.user.current_user
      this.is_instructor = this.current_user.instructor_courses.includes(this.$route.params.id)
      this.is_ta = this.current_user.ta_sections.includes(this.$route.params.id)
      this.is_student = this.current_user.student_sections.includes(this.$route.params.id)
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
  .course-info-container {
    /*border: blue solid;*/
  }

  .course-event-container {
    /*border: green solid;*/
    overflow: hidden;
    padding-left: 6rem;
  }

  .info-section {
    display: inline-block;
    margin-top: 2rem;
    float: left;
  }

  #course-info {
    /*border: black solid;*/
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
    display: inline-block;
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
</style>
