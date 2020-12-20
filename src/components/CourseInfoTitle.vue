<template>
  <div :class="'course-info-title ' + (this.mobileMode ? 'mobile' : '')">
    <div v-if="is_instructor || is_ta" class="course-edit-settings float-right">
        <button class="btn" @click="handleCourseSettings()" v-if=" ! (is_instructor || is_ta)">
          <img src="/img/settings.7e19eab3.svg" width="30" height="30" alt="Settings Icon" aria-label="Settings Icon" class="d-inline-block align-top">
        </button>
    </div>
    <!-- Course Name -->
    <div class="course-name" v-if="course && course.hasOwnProperty('name')"><div v-if="mobileMode && (is_instructor || is_ta)" class="icon-spacer"/> {{course.name}} <button class="btn" title="Edit Course" id="edit-course" @click="handleEditCourse()" v-if="is_instructor || is_ta"><img class="svg-color" id="edit-course" src="@/assets/venue-settings.svg" alt="Edit" width="40" aria-label="Edit"></button></div>

    <div>

      <!-- Course Dept # -->
      <div class="course-dept-number inline-block" v-if="course && course.hasOwnProperty('prefix') && course.hasOwnProperty('suffix')">{{course.prefix}} {{course.suffix}}</div>

      <!-- Time Block -->
      <div v-if="is_instructor"><div v-if="mobileMode && is_instructor" class="icon-spacer"/> Section(s): {{ (section_name?section_name:'None') }} <button class="btn" title="Delete Course" id="delete-course" @click="handleDeleteCourse()" v-if="is_instructor"><img class="red-x" id="delete-course" src="@/assets/venue-delete.svg" alt="Delete" width="40" aria-label="Delete"></button></div>
      <div v-else>Section: {{ section_name }}</div>

    </div>

  </div>
</template>

<script>
  import CourseAPI from '@/services/CourseAPI.js'

  export default {
    name: 'CourseInfoTitle',
    components: {},
    props: {
      course: Object,
      mobileMode: Boolean,
      section_name: String,
      is_instructor: Boolean,
      is_ta: Boolean,
      is_student: Boolean
    },
    created () {},
    methods: {
      handleEditCourse() {
        if(this.is_instructor) {
          this.$router.push({
            name: "edit_course",
            params: { id: this.course._id }
          })
        } else if(this.is_ta) {
          this.$router.push({
            name: "edit_section",
            params: { id: this.$route.params.id }
          })
        } 
        // else if(this.is_student) {
        //   this.$router.push({
        //     name: "edit_color",
        //     params:
        //   })
        // }
      },
      handleDeleteCourse() {
        if (window.confirm("Are you sure you want to delete this course?")) {
          CourseAPI.deleteCourse(this.course._id).then(res => {
            this.$router.push({
              name: "dashboard"
            })
            location.reload()
          })
        }
      },
      handleCourseSettings() {
        if(this.is_student) {
            this.$router.push({
            name: "course_settings",
            params: {id: this.course._id}
          })
        }
      }
    }
  }

</script>

<style scoped>
:root {
  --red-x: ''
}
#edit-course,
#delete-course {
  float: right;
  padding: 0;
}
.icon-spacer {
  width: 40px;
  display: inline-block;
}
#cancel-edit-btn {
  position: absolute;
  left: 0;
  bottom: 0;
  margin: 1rem;
}
.red-x {
  filter: var(--red-x);
}
</style>
