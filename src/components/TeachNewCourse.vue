<template>
  <div>
    <h2>Teach New Course</h2>
    <br/>
    <form @submit.prevent="addCourse">
      <div class="form-group">
        <label class="label">Name:</label>
        <input type="text" class="form-control" v-model="course.name">
      </div>
      <br/>
      <div class="form-group">
        <label class="label">Prefix / Dept:</label>
        <input class="form-control" v-model="course.prefix">
      </div>
      <br/>
      <div class="form-group">
        <label class="label">Suffix / Number:</label>
        <input type="number" class="form-control" v-model="course.suffix">
      </div>
      <br/>
      <div class="form-group">
        <button class="btn btn-primary">Create</button>
      </div>
    </form>

  <!-- Showing Instructors -->

  </div>
</template>

<script>
  import CourseAPI from '@/services/CourseAPI.js';
  import UserAPI from '@/services/UserAPI.js';

  export default {
    name: 'TeachNewCourse',
    components: {
    },
    data(){
      return {
        course: {}
      }
    },
    created() {
    },
    methods: {
      addCourse(evt){
        evt.preventDefault();
        CourseAPI.addCourse(this.course).then(res => {
          CourseAPI.addInstructors(res.data._id,[this.$store.state.user.current_user.email]).then(res2 => {
            this.$router.push({name: 'dashboard'});
            location.reload()
          })
        });
      }
    }
  }
</script>

<style scoped>
  .form-group{
    max-width: 500px;
    width: 80%;
    margin: 0 auto;
  }
  .form-control {
    margin: 0 auto;
    width: 100%;
  }
  .label{
    width: 100%;
    text-align: left;
    margin-left: 1rem;
  }
</style>
