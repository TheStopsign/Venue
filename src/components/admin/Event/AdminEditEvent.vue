<template>
  <div>
    <h2>Edit Event</h2>
    <div class="row">
      <div class="col-md-6">
        <form @submit.prevent="updateEvent">
          <div class="row">
            <div class="col-md-6">
              <div class="form-group">
                <label>title:</label>
                <input type="text" class="form-control" v-model="event.title" />
              </div>
            </div>
          </div>
          <div class="spinner-border" role="status" v-if="!section_has_loaded">
            <span class="sr-only">Loading...</span>
          </div>
          <div class="row" v-else>
            <div class="col-md-6">
              <div class="form-group">
                <label>Section:</label>
                <input class="form-control" v-model="event.section.course.name" readonly />
                <input class="form-control" v-model="event.section.name" readonly />
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6">
              <div class="form-group">
                <label>Attendance Code:</label>
                <div v-if="event.code">
                  <input id="event_attend_code" class="form-control" v-model="event.code" readonly />
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <button
                type="button"
                class="btn btn-primary"
                v-on:click="generateAttendanceCode()"
              >Generate New Attendance Code</button>
            </div>
          </div>
          <div class="form-group">
            <button class="btn btn-primary" v-on:click="updateEvent()">Update</button>
          </div>
        </form>
      </div>
      <div class="col-md-6">
        <!-- <div v-if="event.code"> -->
        <canvas id="qr_render_area"></canvas>
        <!-- </div> -->
      </div>
    </div>

    <table class="table table-hover">
      <thead>
        <tr>
          <th>submitter</th>
        </tr>
      </thead>
      <div class="spinner-border" role="status" v-if="!event_submissions_have_loaded">
        <span class="sr-only">Loading...</span>
      </div>
      <tbody v-else>
        <tr v-for="submission in event_submissions" :key="submission._id">
          <td>{{ submission.submitter.first_name }} {{ submission.submitter.last_name }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  import SectionAPI from "@/services/SectionAPI.js";
  import CourseAPI from "@/services/CourseAPI.js";
  import UserAPI from "@/services/UserAPI.js";
  let QRCode = require("qrcode");

  export default {
    name: 'AdminEditEvent',
    data(){
      return {
        event: {},
        event_submissions: [],
        section_has_loaded: false,
        event_submissions_have_loaded: false
      }
    },
    created() {
      this.getEvent();
      this.getSubmissionsForEvent();
    },
    methods: {
      async getEvent(){
        let event_id = this.$route.params.id
        const response = await EventAPI.getEvent(event_id)
        this.event = response.data
        this.getSectionForEvent()
      },
      async getSectionForEvent(){
        let response = await SectionAPI.getSection(this.event.section)
        this.event.section = response.data
        response = await CourseAPI.getCourse(this.event.section.course)
        this.event.section.course = response.data
        this.section_has_loaded = true
      },
      async updateEvent() {
        let event_id = this.$route.params.id
        const response = await EventAPI.updateEvent(event_id, this.event)
        this.$router.push({name: 'admin_events'})
      },
      async getSubmissionsForEvent() {
        let event_id = this.$route.params.id
        const response = await SubmissionAPI.getSubmissionsForEvent(event_id)
        this.event_submissions = response.data
        this.getUserForSubmissions()
      },
      async getUserForSubmissions(){
        let counter = 0
        this.event_submissions.forEach(async (submission) => {
          counter++
          const response = await UserAPI.getUser(submission.submitter)
          submission.submitter = response.data
          if(counter == this.event_submissions.length)
            this.event_submissions_have_loaded = true
        })
      },
      generateAttendanceCode() {
        const alnums =
          "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        var result = "";
        for (var i = 50; i > 0; --i) {
          result += alnums[Math.floor(Math.random() * alnums.length)];
        }
        this.event.code = result;
        this.showQR(this.event.code);
      },
      showQR(qr_data) {
        let canvas = document.getElementById("qr_render_area");
        if (qr_data) {
          QRCode.toCanvas(canvas, qr_data, function(error) {
            if (error) console.error(error);
          });
        }
      }
    }
  }

</script>