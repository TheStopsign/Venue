<template>
  <div>
    <nav id="venue-nav">
      <!-- Logo -->
      
      <!-- Nav Links -->
      <div id="venue-nav-links">
        <router-link id="nav-logo" :to="{name: 'dashboard'}" role="link" aria-label="Dashboard">
          <img src="@/assets/venue-logo.svg" width="30" height="30" class="d-inline-block align-top logo-color" alt="Venue Logo" aria-label="Venue Logo">
        </router-link>
        <!-- Dashboard Link -->
        <div class="venue-nav-link-container">
          <router-link class="venue-nav-link" :class="{'active-link':is_dashboard()}" :to="{name: 'dashboard'}">
            Dashboard
          </router-link>
          <div :class="'active-link-underline ' + (is_dashboard()?'active':'')"></div>
        </div>
        <div class="venue-nav-link-container">
          <router-link class="venue-nav-link" :class="{'active-link':is_calendar()}" :to="{name: 'calendar'}">
            Calendar
          </router-link>
          <div :class="'active-link-underline ' + (is_calendar()?'active':'')"></div>
        </div>
        <!-- Courses Link -->
        <div class="venue-nav-link-container" id="instructor-course-dropdown" v-if="instructor_courses.length">
          <a data-toggle="collapse" href="#instructor-collapse" class="venue-nav-link" :class="{'active-link':is_instructor_course_info()}" style="cursor:pointer;">
            Instructor Courses <img class="svg-color" src="@/assets/venue-dropdown_icon.svg" width="10" height="10" alt="Down Icon" aria-label="Down Icon">
          </a>
          <hide-at breakpoint="mediumAndBelow">
            <div class="dropdown-content">
              <router-link v-for="course in instructor_courses" :key="course._id" :to="{name: 'instructor_course_info', params: { id: course._id }}">
                {{ course.name }}
              </router-link>
            </div>
          </hide-at>
          <div :class="'active-link-underline ' + (is_instructor_course_info()?'active':'')"></div>
        </div>
        <div class="venue-nav-link-container" v-if="instructor_courses.length">
          <router-link class="venue-nav-link" :class="{'active-link':is_statistics()}" :to="{name: 'statistics'}">
            Statistics
          </router-link>
          <div :class="'active-link-underline ' + (is_statistics()?'active':'')"></div>
        </div>
        <div class="venue-nav-link-container" id="ta-section-dropdown" v-if="ta_sections.length">
          <a data-toggle="collapse" href="#ta-collapse" class="venue-nav-link" :class="{'active-link':is_ta_section_info()}" style="cursor:pointer;">
            TA Sections <img class="svg-color" src="@/assets/venue-dropdown_icon.svg" width="10" height="10" alt="Down Icon" aria-label="Down Icon">
          </a>
          <hide-at breakpoint="mediumAndBelow">
            <div class="dropdown-content">
              <router-link v-for="section in ta_sections" :key="section._id" :to="{name: 'ta_section_info', params: { id: section._id }}">
                {{ section.course.name }} {{section.name}}
              </router-link>
            </div>
          </hide-at>
          <div :class="'active-link-underline ' + (is_ta_section_info()?'active':'')"></div>
        </div>
        <div class="venue-nav-link-container" id="student-section-dropdown" v-if="student_sections.length">
          <a data-toggle="collapse" href="#student-collapse" class="venue-nav-link" :class="{'active-link':is_student_section_info()}" style="cursor:pointer;">
            Student Sections <img class="svg-color" src="@/assets/venue-dropdown_icon.svg" width="10" height="10" alt="Down Icon" aria-label="Down Icon">
          </a>
          <hide-at breakpoint="mediumAndBelow">
            <div class="dropdown-content">
              <router-link v-for="section in student_sections" :key="section._id" :to="{name: 'student_section_info', params: { id: section._id }}">
                {{ section.course.name }} {{ section.name }}
              </router-link>
            </div>
          </hide-at>
          <div :class="'active-link-underline ' + (is_student_section_info()?'active':'')"></div>
        </div>
        <!-- ADMIN -->
        <div class="venue-nav-link-container" id="admin-dropdown" v-if="current_user.is_admin">
          <a data-toggle="collapse" href="#admin-collapse" class="venue-nav-link" style="cursor:pointer;">
            🔑 <img class="svg-color" src="@/assets/venue-dropdown_icon.svg" width="10" height="10" alt="Down Icon" aria-label="Down Icon">
          </a>
          <hide-at breakpoint="mediumAndBelow">
            <div class="dropdown-content">
              <router-link :to="{name: 'new_user'}">
                New User
              </router-link>
              <router-link :to="{name: 'admin_sections'}">
                Sections
              </router-link>
              <router-link :to="{name: 'courses'}">
                Courses
              </router-link>
              <router-link :to="{name: 'users'}">
                Users
              </router-link>         
            </div>
          </hide-at>
        </div>
        <!-- Settings -->
        <div class="venue-nav-link-container">
          <router-link class="venue-nav-link" :class="{'active-link':is_settings()}" :to="{name: 'settings'}">
            <show-at breakpoint="large">
              <p aria-label="User Name">{{ current_user.first_name }} {{ current_user.last_name }} <img src="@/assets/venue-settings.svg" width="20" height="20" class="d-inline-block align-top settings svg-color" alt="Settings Icon" aria-label="Settings Icon"></p>
            </show-at>
            <show-at breakpoint="medium">
              <p aria-label="User Name">{{ current_user.first_name }} <img src="@/assets/venue-settings.svg" width="20" height="20" class="d-inline-block align-top settings svg-color" alt="Settings Icon" aria-label="Settings Icon"></p>
            </show-at>
            <show-at breakpoint="small">
              <img src="@/assets/venue-settings.svg" width="20" height="20" :style="{marginRight: '6rem'}" class="d-inline-block align-top settings svg-color" alt="Settings Icon" aria-label="Settings Icon">
            </show-at>
          </router-link>
          <div :class="'active-link-underline ' + (is_settings()?'active':'')"></div>
        </div>
      </div>
    </nav>
    <!-- Mobile Course Dropdown -->
    <show-at breakpoint="mediumAndBelow">
      <div id="all-collapse">
        <div class="collapse" id="instructor-collapse" data-parent="#all-collapse">
          <ul class="mobile-course-list">
            <li class="mobile-course-link" href="#instructor-collapse" data-toggle="collapse" v-for="course in instructor_courses" :key="course._id">
              <router-link :to="{name: 'instructor_course_info', params: { id: course._id }}">
                <p class="mobile-course-link-name">{{ course.name }}</p>
              </router-link>
            </li>
          </ul>
        </div>
        <div class="collapse" id="ta-collapse" data-parent="#all-collapse">
          <ul class="mobile-course-list">
            <li class="mobile-course-link" href="#ta-collapse" data-toggle="collapse" v-for="section in ta_sections" :key="section._id">
              <router-link :to="{name: 'ta_section_info', params: { id: section._id }}">
                <p class="mobile-course-link-name">{{ section.course.name }} {{ section.name }}</p>
              </router-link>
            </li>
          </ul>
        </div>
        <div class="collapse" id="student-collapse" data-parent="#all-collapse">
          <ul class="mobile-course-list">
            <li class="mobile-course-link" href="#student-collapse" data-toggle="collapse" v-for="section in student_sections" :key="section._id">
              <router-link :to="{name: 'student_section_info', params: { id: section._id }}">
                <p class="mobile-course-link-name">{{ section.course.name }} {{ section.name }}</p>
              </router-link>
            </li>
          </ul>
        </div>
        <div class="collapse" id="admin-collapse" data-parent="#all-collapse">
          <ul class="mobile-course-list">
            <li class="mobile-course-link" href="#admin-collapse" data-toggle="collapse">
              <router-link :to="{name: 'new_user'}">
                <p class="mobile-course-link-name">New User</p>
              </router-link>
            </li>
            <li class="mobile-course-link" href="#admin-collapse" data-toggle="collapse">
              <router-link :to="{name: 'admin_sections'}">
                <p class="mobile-course-link-name">Sections</p>
              </router-link>
            </li>
            <li class="mobile-course-link" href="#admin-collapse" data-toggle="collapse">
              <router-link :to="{name: 'courses'}">
                <p class="mobile-course-link-name">Courses</p>
              </router-link>
            </li>
            <li class="mobile-course-link" href="#admin-collapse" data-toggle="collapse">
              <router-link :to="{name: 'users'}">
                <p class="mobile-course-link-name">Users</p>
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </show-at>
    <!-- TODO Breadcrumbs --> 
    <div id="breadcrumb-container" v-if="showBreadcrumb()">
      <router-link :to="{name: 'dashboard'}">
        Venue
      </router-link>
      <div v-if="current_ta_section" class="crumb">
        <img class="rotate-arrow" src="@/assets/venue-dropdown_icon.svg" width="10" height="10" alt="Down Icon" aria-label="Down Icon">
        <router-link :to="{name: 'ta_section_info', params: { id: current_ta_section._id }}">
          {{current_ta_section.course.name}}
        </router-link>
      </div>
      <div v-else-if="current_student_section" class="crumb">
        <img class="rotate-arrow" src="@/assets/venue-dropdown_icon.svg" width="10" height="10" alt="Down Icon" aria-label="Down Icon">
        <router-link :to="{name: 'student_section_info', params: { id: current_student_section._id }}">
          {{current_student_section.course.name}}
        </router-link>
      </div>
      <div v-else-if="current_course" class="crumb">
        <img class="rotate-arrow" src="@/assets/venue-dropdown_icon.svg" width="10" height="10" alt="Down Icon" aria-label="Down Icon">
        <router-link :to="{name: 'instructor_course_info', params: { id: current_course._id }}">
          {{current_course.name}}
        </router-link>
      </div>
      <div v-if="current_lecture" class="crumb">
        <img class="rotate-arrow" src="@/assets/venue-dropdown_icon.svg" width="10" height="10" alt="Down Icon" aria-label="Down Icon">
        <router-link :to="{name: 'lecture_info', params: { lecture_id: current_lecture._id }}">
          {{current_lecture.title}}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
  import {showAt, hideAt} from 'vue-breakpoints'

  import UserAPI from '@/services/UserAPI.js'
  import CourseAPI from '@/services/CourseAPI.js'
  import SectionAPI from '@/services/SectionAPI.js'
  import LectureAPI from '@/services/LectureAPI.js'

  export default {
    name: 'NavBar',
    computed: {
    },
    watch: {
      $route (to, from){
        this.current_course = null,
        this.current_section = null,
        this.current_lecture = null,
        this.loadData()
      }
    },
    components: {
      hideAt,
      showAt
    },
    data(){
      return {
        current_user: {},
        instructor_courses: [],
        ta_sections: [],
        student_sections: [],
        user_lectures: [],
        current_course: null,
        current_section: null,
        current_ta_section: null,
        current_student_section: null,
        current_lecture: null
      }
    },
    created() {
      this.loadData()
    },
    methods: {
      showBreadcrumb() {
        return !(['dashboard','settings','statistics','calendar'].includes(this.$route.name))
      },
      async loadData() {
        this.current_user = this.$store.state.user.current_user

        const response1 = await CourseAPI.getInstructorCourses()
        this.instructor_courses = response1.data

        const response2 = await SectionAPI.getTASections()
        this.ta_sections = response2.data

        const response3 = await SectionAPI.getStudentSections()
        this.student_sections = response3.data

        const response4 = await LectureAPI.getLecturesForUser(this.current_user._id,'with_sections_and_course')
        this.user_lectures = response4.data
        
        this.loadBreadcrumb()
      },
      loadBreadcrumb() {
        this.current_lecture = this.user_lectures.find(a=>this.$route.params.lecture_id && a && a._id == this.$route.params.lecture_id)
        let sections = this.ta_sections.concat(this.student_sections)

        if(this.$route.name == 'new_lecture' || this.$route.name == 'new_lecture') {
          this.current_course = this.instructor_courses.find(a=>this.$route.params.course_id && a._id == this.$route.params.course_id)
        } else if(this.current_lecture) {
          this.current_ta_section = this.current_lecture.sections.find(section => this.ta_sections.map(a => a._id).includes(section._id))
          this.current_student_section = this.current_lecture.sections.find(section => this.student_sections.map(a => a._id).includes(section._id))
          if(!this.current_section) {
            this.current_course = this.current_lecture.sections[0].course
          }
        } else {
          this.current_ta_section = this.ta_sections.find(section => section._id == this.$route.params.id)
          this.current_student_section = this.student_sections.find(section => section._id == this.$route.params.id)
          if(!this.current_section) {
            this.current_course = this.instructor_courses.find(course => course._id == this.$route.params.id)
          }
        }
        
      },
      is_dashboard() {
        return this.$route.name === 'dashboard'
      },
      is_instructor_course_info() {
        return this.$route.name === 'instructor_course_info' && this.instructor_courses.some(a => a._id == this.$route.params.id)
      },
      is_ta_section_info() {
        return this.$route.name === 'ta_section_info' && this.ta_sections.some(a => a._id == this.$route.params.id)
      },
      is_student_section_info() {
        return this.$route.name === 'student_section_info' && this.student_sections.some(a => a._id == this.$route.params.id)
      },
      is_lecture_info() {
        return this.$route.name === 'lecture_info'
      },
      is_statistics() {
        return this.$route.name === 'statistics'
      },
      is_settings() {
        return this.$route.name === 'settings'
      },
      is_calendar() {
        return this.$route.name === 'calendar'
      }
    }
  }
</script>

<style scoped>

  :root {
    --nav-bar-text: #2C3E50;
    --nav-bar-background: #f7f7f7;
    --nav-bar-separator: rgba(0, 0, 0, 0.15);
    --nav-bar-selected-text: #466D85;
    --nav-bar-box-shadow:  rgba(109, 109, 109, 0.644);
    --nav-bar-link-text: #575757;

    --nav-bar-hover-background: #466D85;
    --nav-bar-hover-text: white;
    --nav-bar-hover-top-shadow: rgba(85, 85, 85, 0.644);
    --nav-bar-hover-bottom-shadow: rgba(179, 179, 179, 0.644);
  }

  .logo-color {
    filter: var(--logo-color);
  }

  #venue-nav {
    height: 4rem;
    padding: 1rem 0rem;
    position: relative;
    top: 0;
    left: 0;
  }

  #venue-nav-links {
    display: flex;
    overflow-x: auto;
    white-space: nowrap;
  }

  #breadcrumb-container {
    position: relative;
    margin: 1rem 0rem;
    width: 100%;
    text-align: left;
    padding-left: 4rem;
    font-size: 0.9rem;
  }

  .crumb {
    display: inline-block;
    margin-right: 0.5rem;
  }

  #nav-logo {
    margin-left: 1.5rem;
    display: inline-block;
  }

  .venue-nav-link-container {
    margin-left: 1.5rem;
    display: inline-block;
    border-radius: 0.3rem;
    /* height: 2rem; */
    margin-top: 0.5rem;
    margin-bottom: 0;
    border-bottom: none;
    border-radius: 5px;
    transition: border-bottom 0.25s 0s cubic-bezier(0.19, 1, 0.22, 1);
  }

  .venue-nav-link-container.active {
    border-bottom: 0.2rem solid var(--nav-bar-selected-text);
    transition: border-bottom 0.25s 0s cubic-bezier(0.19, 1, 0.22, 1);
  }

  .dropdown-content {
    margin-left: -1rem;
    margin-top: 0.2rem;
    position: absolute;
    visibility: hidden;
    /* background-color: #f7f7f7; */
    
    z-index: 9999;
    border-radius: 0.5rem;

    /* transition: all 0.25s cubic-bezier(0.19, 1, 0.22, 1); */
  }

  .dropdown-content a {
    visibility: hidden;
    color: var(--main-text-color);
    background-color: var(--main-background-color);
    font-weight: bold;
    font-size: 0rem;
    text-decoration: none;  
    display: block;
    max-height: 0px;
    width: 15rem;
    margin: 0px;
    padding: 0px;
    box-shadow: 0px 3px 3px 0px var(--nav-bar-box-shadow);
    transition: all 0.25s cubic-bezier(0.19, 1, 0.22, 1);
  }

  .dropdown-content a:first-of-type {
    border-radius: 0.5rem 0.5rem 0rem 0rem;
  }

  .dropdown-content a:last-of-type {
    border-radius: 0rem 0rem 0.5rem 0.5rem;
  }

  .dropdown-content a:not(:first-of-type) {
    border-top: 0.1rem solid var(--nav-bar-separator);
  }

  .dropdown-content a:last-of-type {
    border-radius: 0rem 0rem 0.5rem 0.5rem;
  }

  .dropdown-content a:only-of-type {
    border-radius: 0.5rem;
  }

  .venue-nav-link-container:hover > .dropdown-content,
  .venue-nav-link-container:focus-within > .dropdown-content {
    visibility: visible;
  }

  .venue-nav-link-container:hover > .dropdown-content a,
  .venue-nav-link-container:focus-within > .dropdown-content a {
    visibility: visible;
    font-size: 1rem;
    max-height: 3rem;
    width: 20rem;
    padding: 12px 16px;
    transform: rotateY(0deg);
    transition: font-size 0.25s 0s cubic-bezier(0.19, 1, 0.22, 1), max-height 0.25s 0s cubic-bezier(0.19, 1, 0.22, 1), padding 0.25s 0s cubic-bezier(0.19, 1, 0.22, 1), transform 0.05s 0s cubic-bezier(0.19, 1, 0.22, 1);
  }

  /* .venue-nav-link-container:hover > .dropdown-content a:nth-of-type(2),
  .venue-nav-link-container:focus-within > .dropdown-content a:nth-of-type(2) {
    visibility: visible;
    font-size: 1rem;
    max-height: 3rem;
    width: 15rem;
    padding: 12px 16px;
    transform: rotateY(0deg);
    transition: font-size 0.25s 0.05s cubic-bezier(0.19, 1, 0.22, 1), max-height 0.25s 0.05s cubic-bezier(0.19, 1, 0.22, 1), padding 0.25s 0.05s cubic-bezier(0.19, 1, 0.22, 1), transform 0.05s 0.05s cubic-bezier(0.19, 1, 0.22, 1);
  }

  .venue-nav-link-container:hover > .dropdown-content a:nth-of-type(3),
  .venue-nav-link-container:focus-within > .dropdown-content a:nth-of-type(3) {
    visibility: visible;
    font-size: 1rem;
    max-height: 3rem;
    width: 15rem;
    padding: 12px 16px;
    transform: rotateY(0deg);
    transition: font-size 0.25s 0.1s cubic-bezier(0.19, 1, 0.22, 1), max-height 0.25s 0.1s cubic-bezier(0.19, 1, 0.22, 1), padding 0.25s 0.1s cubic-bezier(0.19, 1, 0.22, 1), transform 0.05s 0.1s cubic-bezier(0.19, 1, 0.22, 1);
  }

  .venue-nav-link-container:hover > .dropdown-content a:nth-of-type(4),
  .venue-nav-link-container:focus-within > .dropdown-content a:nth-of-type(4) {
    visibility: visible;
    font-size: 1rem;
    max-height: 3rem;
    width: 15rem;
    padding: 12px 16px;
    transform: rotateY(0deg);
    transition: font-size 0.25s 0.15s cubic-bezier(0.19, 1, 0.22, 1), max-height 0.25s 0.15s cubic-bezier(0.19, 1, 0.22, 1), padding 0.25s 0.15s cubic-bezier(0.19, 1, 0.22, 1), transform 0.05s 0.15s cubic-bezier(0.19, 1, 0.22, 1);
  }

  .venue-nav-link-container:hover > .dropdown-content a:nth-of-type(5),
  .venue-nav-link-container:focus-within > .dropdown-content a:nth-of-type(5) {
    visibility: visible;
    font-size: 1rem;
    max-height: 3rem;
    width: 15rem;
    padding: 12px 16px;
    transform: rotateY(0deg);
    transition: font-size 0.25s 0.2s cubic-bezier(0.19, 1, 0.22, 1), max-height 0.25s 0.2s cubic-bezier(0.19, 1, 0.22, 1), padding 0.25s 0.2s cubic-bezier(0.19, 1, 0.22, 1), transform 0.05s 0.2s cubic-bezier(0.19, 1, 0.22, 1);
  }

  .venue-nav-link-container:hover > .dropdown-content a:nth-of-type(6),
  .venue-nav-link-container:focus-within > .dropdown-content a:nth-of-type(6) {
    visibility: visible;
    font-size: 1rem;
    max-height: 3rem;
    width: 15rem;
    padding: 12px 16px;
    transform: rotateY(0deg);
    transition: font-size 0.25s 0.25s cubic-bezier(0.19, 1, 0.22, 1), max-height 0.25s 0.25s cubic-bezier(0.19, 1, 0.22, 1), padding 0.25s 0.25s cubic-bezier(0.19, 1, 0.22, 1), transform 0.25s 0.25s cubic-bezier(0.19, 1, 0.22, 1);
  } */

  .dropdown-content a:hover,
  .dropdown-content a:focus {
    background-color: var(--nav-bar-hover-background);
    color: var(--nav-bar-hover-text);
    outline: none;
    box-shadow: 0px 3px 3px 0px var(--nav-bar-hover-top-shadow) inset, 0px -3px 3px 0px var(--nav-bar-hover-bottom-shadow) inset;
    /* -webkit-transition: background-color 0.25s cubic-bezier(0.19, 1, 0.22, 1);
    -ms-transition: background-color 0.25s cubic-bezier(0.19, 1, 0.22, 1);
    transition: background-color 0.25s cubic-bezier(0.19, 1, 0.22, 1); */
  }

  .mobile-course-list {
    display: block;
    list-style-type: none;
    padding: 0;
  }

  .mobile-course-link {
    height: 2rem;
    width: 100%;
    display: inline-block;
  }

  .mobile-course-link-name {
    text-decoration: none;

  }

  .venue-nav-link {
    text-decoration: none;
    color: var(--nav-bar-link-text);
    font-weight: 100;
    margin: 0;
    padding: 0;
    height: 2rem;
  }

  .active-link {
    color: var(--nav-bar-selected-text);
  }

  .active-link:hover,
  .active-link:focus {
    color: var(--nav-bar-link-text);
  }

  .active-link-underline {
    height: 0rem;
    width: 0rem;
    background-color: var(--nav-bar-selected-text);
    margin: auto;
    transition: all 0.25s cubic-bezier(0.19, 1, 0.22, 1);
  }

  .active-link-underline.active {
    height: 0.15rem;
    width: 80%;
    transition: all 0.25s 0s cubic-bezier(0.19, 1, 0.22, 1);
  }

  .user-name {
    /* margin-top: 5px; */
    /* font-weight: 100; */
  }

  .settings {
    cursor: pointer;
    margin-top: 0.1rem;
    margin-left: 0.25rem;
    margin-right: 0;
    filter: var(--widgets-color);
  }

  .venue-nav-link:focus,
  .settings_link:focus {
    outline: none;
  }

  .venue-nav-link:hover,
  .settings_link:hover .mr-2,
  .venue-nav-link:focus,
  .settings_link:focus .mr-2,
  .venue-nav-link:focus p,
  .venue-nav-link:hover p {
    color: var(--nav-bar-selected-text);
  }

  .rotate-arrow {
    transform: rotateZ(-90deg);
    margin-bottom: 0.1rem;
    filter: var(--widgets-color);
  }

  img {
    display: inline-block;
  }
</style>