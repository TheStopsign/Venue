<template>
  <div v-if="course" id="new-lecture-time">
    <h2>Add Lecture Time</h2>
    <form @submit.prevent="addTime">
      <div class="row">
        <div class="col-md-6">
          <div class="form-group">
            <label>Course Name</label>
          </div>
        </div>
        <div class="col-md-6">
          <div class="form-group">
            <input type="text" class="form-control" v-model="course.name" readonly rows="5">
          </div>
        </div>
      </div><br />
      <div class="row">
        <div class="col-md-6">
          <div class="form-group">
            <label>Day</label>
          </div>
        </div>
        <div class="col-md-6">
          <div class="form-group">
             <select v-model="new_day" class="form-control" aria-labelledby="section_select_label">
              <option v-for="(day,i) in ['Monday','Tuesday','Wednesday','Thursday','Friday', 'Saturday','Sunday']" :key="i" :value="day">{{day}}</option>
            </select>
            <!-- <MultiSelectDropdown :options="['Monday','Tuesday','Wednesday','Thursday','Friday', 'Saturday','Sunday']" @update="handleCourseChange" :max="1" :n="0"/> -->
          </div>
        </div>
      </div><br />
      <div class="row">
        <div class="col-md-6">
          <div class="form-group">
            <label>Start Time</label>
          </div>
        </div>
        <div class="col-md-6">
          <div class="form-group">
            <input type="time" class="form-control" v-model="new_start">
          </div>
        </div>
      </div><br />
      <div class="row">
        <div class="col-md-6">
          <div class="form-group">
            <label>End Time</label>
          </div>
        </div>
        <div class="col-md-6">
          <div class="form-group">
            <input type="time" class="form-control" v-model="new_end">
          </div>
        </div>
      </div><br />
    
      <div class="row">
          <div class="form-group col-md-5 float-right">
            <button class="btn btn-primary" style="position:absolute">Add Time</button>
          </div>
      </div>
    </form>

  </div>
</template>

<script>
  import UserAPI from '@/services/UserAPI.js';
  import CourseAPI from '@/services/CourseAPI.js';
  import MultiSelectDropdown from "@/components/MultiSelectDropdown.vue";

  export default {
    name: 'NewLectureTime',
    components:{
      MultiSelectDropdown
    },
    props: {
    },
    data(){
      return {
        course: null,
        course_times: {},
        new_day: "Monday",
        new_start: "",
        new_end: ""
      }
    },
    created() {
			CourseAPI.getCourse(this.$route.params.id).then(res => {
				this.course = res.data
			})
    },
    methods: {
      async addTime(evt){
        evt.preventDefault() // prevents the form's default action from redirecting the page
        let course_times = {
          day: this.new_day,
          start_time: this.new_start,
          end_time: this.new_end
        }
        const response = await CourseAPI.addTime(this.course._id, course_times)
        this.$router.push({name: 'edit_course',params: {id: this.course._id}})
				location.reload()
      }
    }
  }
</script>

<style scoped>
#new-lecture-time {
	padding: 2rem;
}
.form-group {
	margin-top: 1rem;
}
</style>