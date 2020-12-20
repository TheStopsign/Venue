<template>
  <div>
    <h1>Courses</h1>
    <show-at breakpoint="mediumAndAbove">
      <div class="course-list">
        <div v-if="is_instructor">
          <div v-if="!data_loaded"><SquareLoader /></div>
          <div v-else-if="courses.length > 0">
            <CourseCard v-for="course in courses" :key="course._id" v-bind:course="course" v-bind:box_color="getColor(course)"/>
          </div>
          <div v-else>
            <p class="no-container" id="no-courses">No courses</p>
          </div>
        </div>
        <div v-else>
          <div v-if="!data_loaded"><SquareLoader /></div>
          <div v-else-if="sections.length > 0">
            <CourseCard v-for="section in sections" :key="section._id" v-bind:section="section" v-bind:box_color="getColor(section.course)"/>
          </div>
          <div v-else>
            <p class="no-container" id="no-courses">No courses</p>
          </div>
        </div>
      </div>
    </show-at>
    <show-at breakpoint="small">
      <div class="mobile-course-list">

        <div v-if="is_instructor">
          <div v-if="!data_loaded"><SquareLoader /></div>
          <div class="mobile-justify-div" v-else-if="courses.length > 0">
            <CourseCard v-for="course in courses"
              :key="course._id" v-bind:course="course"
              v-bind:box_color="getColor(course)"
              mobile
            />
          </div>
          <div v-else>
            <p class="no-container" id="no-courses">No courses</p>
          </div>
        </div>
        <div v-else>
          <div v-if="!data_loaded"><SquareLoader /></div>
          <div v-else-if="sections.length > 0">
            <CourseCard v-for="section in sections"
              :key="section._id"
              :section="section"
              :box_color="getColor(section.course)"
              mobile
            />
          </div>
          <div v-else>
            <p class="no-container" id="no-courses">No courses</p>
          </div>
        </div>

      </div>
    </show-at>
  </div>
</template>

<script>
  import CourseCard from '@/components/CourseCard.vue'
  import CourseAPI from '@/services/CourseAPI.js'
  import SectionAPI from '@/services/SectionAPI.js'
  import SquareLoader from '@/components/Loaders/SquareLoader.vue'
  import {showAt, hideAt} from 'vue-breakpoints'
  import Constants from '@/assets/constants.js'

  export default {
    name: 'CourseList',
    props: {
      sizeCallback: Function,
      coursesCallback: Function,
      colors: Array
    },
    components: {
      CourseCard,
      SquareLoader,
      showAt,
      hideAt
    },
    data(){
      return {
        courses: [],
        data_loaded: false,
        sections: [],
        is_instructor: Boolean,
        box_color_index: Number,
        box_colors: [
          "blue",
          "orange",
          "green",
          "red",
          "purple"
        ]
      }
    },
    computed: {
    },
    created() {
      this.current_user = this.$store.state.user.current_user
      this.is_instructor = this.current_user.is_instructor
      if(this.is_instructor)
        this.getInstructorCourses()
      else
        this.getSectionsWithCourses()
    },
    methods: {
      getColors () {
        if (this.colors) return this.colors;
        return Constants.colors
      },
      getColor (course) {
        if (course.color_index == null || course.color_index == undefined) return Constants.colors[ Math.floor(Math.random() * Constants.colors.length) ]
        return this.getColors()[course.color_index]
      },
      async getInstructorCourses() {

        CourseAPI.getInstructorCourses(this.current_user._id)
        .then(response => {
          this.data_loaded = true

          let courses = response.data
          this.assignBoxColorsToClassObjects(courses)
          this.courses = courses

          if (this.coursesCallback) this.coursesCallback(courses)

          if (this.sizeCallback) this.sizeCallback(this.courses.length)
        })
        .catch(err => {
          this.data_loaded = true
        })
      },
      async getSectionsWithCourses() {

        SectionAPI.getSectionsWithCoursesForStudent(this.current_user._id)
        .then(response => {
          this.data_loaded = true
          let sections = response.data
          this.assignBoxColorsToClassObjects(sections)
          this.sections = sections

          let courses = this.sections.map(section_ => section_.course)
          if (this.coursesCallback) this.coursesCallback(courses)

          if (this.sizeCallback) this.sizeCallback(this.sections.length)
        })
        .catch(err => {
          this.data_loaded = true
        })
      },
      assignBoxColorsToClassObjects(class_objects) {
        let box_color_index = 0
         class_objects.forEach( class_object => {
           class_object.box_color = this.box_colors[box_color_index]
          if(box_color_index == this.box_colors.length)
            box_color_index = 0
          else
            box_color_index++
        })
      }
    }
  }
</script>

<style scoped>
.course-list {
  height: 12.5rem;
  overflow-y: auto;
  width: 100%;
  padding-left: 2rem;
}

/*Medium devices (tablets and below)*/
@media (max-width: 1128px) {
  .course-list {
    margin-top: 1rem;
    height: auto;
    width: auto;
    padding-bottom: 10px;
  }
}
</style>
