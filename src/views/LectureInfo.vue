<template>
  <div>
    <!-- mobile -->
    <show-at breakpoint="small">
      <div class="lecture-info-container mobile">
        <SquareLoader role="status" v-if="!lecture_has_loaded"/>
        <div v-else>
          <InstructorLectureInfo v-if="is_instructor || is_ta" :lecture="lecture" :is_instructor="is_instructor || is_ta" />
          <StudentLectureInfo v-else-if="is_student && polls_loaded" :lecture="lecture" :is_instructor="is_instructor || is_ta" :polls="polls" />
        </div>
      </div>
    </show-at>
    <!-- tablet and up -->
    <show-at breakpoint="mediumAndAbove">
      <div class="lecture-info-container">
        <SquareLoader role="status" v-if="!lecture_has_loaded"/>
        <div v-else>
          <InstructorLectureInfo v-if="is_instructor || is_ta" :lecture="lecture" :is_instructor="is_instructor || is_ta" />
          <StudentLectureInfo v-else-if="is_student && polls_loaded" :lecture="lecture" :is_instructor="is_instructor || is_ta" :polls="polls" />
        </div>
      </div>
    </show-at>
  </div>
</template>

<script>
  import LectureAPI from '@/services/LectureAPI.js';
  import PlaybackPollAPI from '@/services/PlaybackPollAPI.js'

  import InstructorLectureInfo from '@/components/InstructorLectureInfo.vue';
  import StudentLectureInfo from '@/components/StudentLectureInfo.vue';
  import SquareLoader from '@/components/Loaders/SquareLoader.vue'

  import {showAt, hideAt} from 'vue-breakpoints';

  export default {
    name: 'LectureInfo',
    components: {
      InstructorLectureInfo,
      StudentLectureInfo,
      SquareLoader,
      showAt
    },
    data(){
      return {
        current_user: null,
        is_instructor: false,
        is_ta: false,
        is_student: false,
        lecture: {},
        lecture_has_loaded: false,
        polls_loaded: false,
        polls: []
      }
    },
    async created() {
      this.lecture_id = this.$route.params.lecture_id
      this.current_user = this.$store.state.user.current_user
      await this.getLecture()
    },
    methods: {
      async getLecture() {
        const response = await LectureAPI.getLectureWithSectionsAndCourse(this.lecture_id)
        this.lecture = response.data
        this.lecture.meeting_link = this.lecture.meeting_link || this.lecture.sections[0].course.meetingURL
        this.lecture_has_loaded = true
        this.is_instructor = this.current_user.instructor_courses.some(a => a == this.lecture.sections[0].course._id)
        this.is_ta = this.current_user.ta_sections.some(a => this.lecture.sections.map(b=>b._id).includes(a))
        this.is_student = this.current_user.student_sections.some(a => this.lecture.sections.map(b=>b._id).includes(a))
        PlaybackPollAPI.getByLecture(this.lecture_id)
        .then(res => {
          this.polls = res.data
          this.polls_loaded = true
        })
      }
    }
  }
</script>

<style scoped>
  #lecture-info-container-root {
    padding: 0 2rem;
  }

  .lecture-info-container {
    margin: 0rem 8rem;
  }

  .lecture-info-container.mobile {
    margin: 2rem;
  }
</style>