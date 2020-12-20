<template>
  <div>
  <h1>Course Settings</h1>
  <div class="settings-container">
    <div class="name-area">
      <div>{{course.name}}</div>
    </div>
    <div class="setting-option-section">
    <h4>Instructors</h4>
    

    </div>
  </div>
  </div>
</template>


<script>
  import CourseAPI from '@/services/CourseAPI.js';
  import SectionAPI from '@/services/SectionAPI.js';
  import UserAPI from '@/services/UserAPI.js';
  import Instructors from '@/components/admin/User/Instructors'

  export default {
    name: 'CourseSettings',
    components: {
      Instructors
    },
    data() {
      return {
        course: {},
        instructors: [],
        sections: [],
        instructors_to_add: ""
      }
    },
    created() {
      this.getCurrentCourse()
    },
    methods: {
      async getCurrentCourse() {
        let course_id = this.$route.params.id
        const response = await CourseAPI.getCourse(course_id)
        this.course = response.data
        this.getCurrentCourseInstructor()
        this.getCurrentCourseSections()
      },
      async getCurrentCourseInstructor(){
        const response = await UserAPI.getInstructorsForCourse(this.course._id)
        if(response.data)
          this.instructors = response.data
      },
      async getCurrentCourseSections(){
        const response = await SectionAPI.getSectionsForCourse(this.course._id)
        if(response.data)
          this.sections = response.data
      },
      async updateCourse() {
        let course_id = this.$route.params.id
        this.course.instructors = this.instructors.map(a=>a._id)
        const response = await CourseAPI.updateCourse(course_id, this.course)
        location.reload()
      },
      addInstructorsToCourse() {
        let insts = this.instructors_to_add.split(',')
        if(insts.length) {
          CourseAPI.addInstructors(this.course._id,insts).then(res => {
            location.reload()
          })
        }
      }
    }
  }
</script>

<style>
    .settings-container {
        margin: 80px 6rem 0px 6rem;
        text-align: left;
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
        color: #517B94;
        margin-bottom: 5px;
        width: 80%;
        height: 30px;
        line-height: 30px;
        text-align: right;
        box-sizing: border-box;
        padding-right: 10px;
        border-radius: 5px;
        cursor: pointer;
    }

    .settings-links ul li.active {
        background-color: #517B94;
        color: white;
    }

    .name-area {
        font-size: 2rem;
        /* margin-bottom: 40px; */
    }

    .name-area .name-div {
        width: 75%;
        min-width: 300px;
    }

    .name-area .logout-div {
      text-align: right;
      width: 24%;
    }

    .name-area .logout-div .logout-button {
        font-size: 0.9rem;
        width: 150px;
        text-align: center;
        height: 35px;
        line-height: 30px;
        border: 3px solid rgb(207,39,41);
        border-radius: 4px;
        box-shadow: 0px 3px 5px rgba(252, 111, 113, 0.3);
        background-color: white;
        transition: background 0.25s, color 0.25s;
        font-weight: bold;
        color: rgb(207,39,41);
        /* background-color: #FC6F71; */
        cursor: pointer;
    }

    .name-area .logout-div .logout-button:hover,
    .name-area .logout-div .logout-button:focus {
      background-color: rgb(207,39,41);
      color: white;
    }

    .name-area .name-div, .name-area .logout-div {
        display: inline-block;
        vertical-align: top;
    }

    .setting-option-section {
        padding: 30px 15px;
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
        text-align: right;
    }

    .small-div {
        font-size: 0.9rem;
        color: rgba(0, 0, 0, 0.64);
        padding-left: 10px;
    }

    .change-button {
        background-color: white;
        border: 3px solid rgba(44, 62, 80, 1);
        color: rgb(44, 62, 80);
        font-weight: bold;
        display: inline-block;
        width: 100px;
        text-align: center;
        height: 40px;
        line-height: 37px;
        border-radius: 3px;
        cursor: pointer;
        transition: background-color 0.25s, color 0.25s, box-shadow 0.25s, border 0.25s;
        box-shadow: 0px 2px 5px rgba(44, 62, 80, 0.1);
    }

    .change-button:hover {
        background-color: rgb(207, 39, 41);
        color: white;
        box-shadow: 0px 0px 10px 5px rgba(252, 111, 113, 0.2);
        border: 3px solid rgb(207,39,41);
    }

</style>
