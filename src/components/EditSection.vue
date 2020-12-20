<template>
  <div id="edit-section">
    <h2>Edit Section</h2>
    <form @submit.prevent="updateSection">
      <div class="row">
        <div class="col-md-6">
          <div class="form-group">
            <label>course:</label>
          </div>
        </div>
        <div class="col-md-6">
          <div class="form-group">
            <input type="text" class="form-control" v-model="course.name" readonly>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
          <div class="form-group">
            <label>instructors:</label> 
          </div>
        </div>
        <div class="col-md-6">
          <div class="form-group">
            <input v-for="(instructor,i) in instructors" :key="i" class="form-control" :value="instructor.first_name + ' ' + instructor.last_name" readonly/>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
          <div class="form-group">
            <label>section's name:</label>
          </div>
        </div>
        <div class="col-md-6">
          <div class="form-group">
            <input type="text" class="form-control" v-model="section.name">
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
          <div class="form-group">
           <label>Is Publicly Joinable</label>
          </div>
        </div>
        <div class="col-md-6">
          <div class="form-group">
           <input type="checkbox" class="form-control" v-model="section.is_public"/>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-12">
          <div class="form-group">
           <button id="update-btn" class="btn btn-primary">Update</button>
          </div>
        </div>
      </div>
    </form>

    <h4>Section Students</h4>
    <table class="table table-hover">
        <thead>
        <tr>
          <th>First Name</th>
          <th>Last Name</th>
          <th>User ID</th>
        </tr>
        </thead>
        <tbody>
            <tr v-for="student in students" :key="student._id">
              <td>{{ student.first_name }}</td>
              <td>{{ student.last_name }}</td>
              <td>{{ student.user_id }}</td>
              <td><button class="btn btn-primary" type="button" @click="addTaToSection(student.email)">Make TA</button></td>
            </tr>
        </tbody>
    </table>

    <h4>Section TAs</h4>
    <table class="table table-hover">
        <thead>
        <tr>
          <th>First Name</th>
          <th>Last Name</th>
          <th>User ID</th>
        </tr>
        </thead>
        <tbody>
            <tr v-for="ta in tas" :key="ta._id">
              <td>{{ ta.first_name }}</td>
              <td>{{ ta.last_name }}</td>
              <td>{{ ta.user_id }}</td>
              <td><button class="btn btn-primary" type="button" @click="addStudentToSection(ta.email)">Make Student</button></td>
            </tr>
        </tbody>
    </table>

    <div class="row">
      <div class="col-md-6">
        <div class="form-group">
          <label>Add students by email</label>
        </div>
      </div>
      <div class="col-md-6">
        <div class="form-group">
          <input type="text" v-model="students_to_add"/>
          <button type="button" @click="addStudentsToSection()">Update</button>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-6">
        <div class="form-group">
          <label>Add ta's by email</label>
        </div>
      </div>
      <div class="col-md-6">
        <div class="form-group">
          <input type="text" v-model="tas_to_add"/>
          <button type="button" @click="addTasToSection()">Update</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import SectionAPI from '@/services/SectionAPI.js';
  import Courses from '@/components/admin/Course/Courses';
  import Instructors from '@/components/admin/User/Instructors';
  import Students from '@/components/admin/User/Students';

  export default {
    name: 'EditSection',
    components: {
      Courses,
      Instructors,
      Students
    },
    data(){
      return {
        section: {},
        course: {},
        instructors: [],
        students: [],
        tas: [],
        students_to_add: [],
        tas_to_add: []
      }
    },
    created() {
      this.getCurrentSection()
    },
    methods: {
      async getCurrentSection(){
        let section_id = this.$route.params.id
        const response = await SectionAPI.getSection(section_id)
        this.section = response.data
        this.getCurrentSectionInstructor()
        this.getCurrentSectionCourse()
        this.getCurrentSectionStudents()
        this.getCurrentSectionTAs()
      },
      async getCurrentSectionInstructor(){
        const response = await SectionAPI.getInstructors(this.section._id)
        this.instructors = response.data
      },
      async getCurrentSectionCourse(){
        const response = await SectionAPI.getCourse(this.section._id)
        this.course = response.data
      },
      async getCurrentSectionStudents(){
        const response = await SectionAPI.getStudents(this.section._id)
        this.students = response.data
      },
      async getCurrentSectionTAs(){
        const response = await SectionAPI.getTeachingAssistants(this.section._id)
        this.tas = response.data
      },
      async updateSection() {
        const response = await SectionAPI.updateSection(this.$route.params.id, this.section)
        location.reload()
      },
      addStudentsToSection() {
        let studs = this.students_to_add.split(',')
        SectionAPI.addStudents(this.section._id,studs).then(res => {
          location.reload()
        })
      },
      addStudentToSection(email) {
        SectionAPI.addStudents(this.section._id,[email]).then(res => {
          location.reload()
        })
      },
      addTasToSection() {
        let tas = this.tas_to_add.split(',')
        SectionAPI.addTAs(this.section._id,tas).then(res => {
          location.reload()
        })
      },
      addTaToSection(email) {
        SectionAPI.addTAs(this.section._id,[email]).then(res => {
          location.reload()
        })
      }
    }
  }
</script>

<style scoped>
#edit-section {
  padding: 2rem;
}
label {
  float: right;
}
#update-btn {
  margin: 2rem;
}

.row {
  margin: 1rem;
}
</style>