<template>
  <!-- ADDING USER -->
  <div>
    <h2>Create An Event For {{ course.name }}</h2>
    <form class="new-event-form" @submit.prevent="addEvent">
      <div class="form-group">
        <!-- Event Info -->
        <div class="input-wrapper">
          <label>Title</label>
          <input
            type="text"
            class="form-control new-event-input"
            placeholder="e.g. Event 1"
            v-model="event.title"
          />
        </div>
        <div class="input-wrapper">
          <label>Location</label>
          <input
            type="text"
            class="form-control new-event-input"
            placeholder="e.g. DCC 308"
            v-model="event.location"
          />
          <a>Note: the most recently drawn polygon will be used</a>
          <GoogleMap :selected_geofence.sync="selected_geofence" />
        </div>
        <!-- Times -->
        <div class="input-wrapper">
          <label>Start Time</label>
          <!-- <datetime
            class="time-picker"
            type="datetime"
            use12-hour
            value-zone="local"
            title="Event Start"
            v-model="event.start_time"
          ></datetime> -->
          <label>End Time</label>
          <!-- <datetime
            class="time-picker"
            type="datetime"
            use12-hour
            value-zone="local"
            title="Event End"
            v-model="event.end_time"
          ></datetime> -->
        </div>
        <div class="input-wrapper" id="submission-time-wrapper">
          <label>Submission Start Time</label>
          <!-- <datetime
            class="time-picker"
            type="datetime"
            use12-hour
            value-zone="local"
            title="Submission Start"
            v-model="event.submission_start_time"
          ></datetime> -->
          <label>Submission End Time</label>
          <!-- <datetime
            class="time-picker"
            type="datetime"
            use12-hour
            value-zone="local"
            title="Submission End"
            v-model="event.submission_end_time"
          ></datetime> -->
        </div>
        <!-- Section -->
        <div class="input-wrapper">
          <label>Section</label>
          <input type="text" class="form-control new-event-input" v-model="section.name" readonly />
        </div>
      </div>
      <div class="spinner-border" role="status" v-if="!sections_have_loaded">
        <span class="sr-only">Loading...</span>
      </div>
      <Sections v-else v-bind:sections="sections" v-on:select-section="selectSection" />
      <!-- QR Code -->
      <div id="qr-section">
        <div>
          <button
            @click.prevent="generateAttendanceCode()"
            class="btn btn-secondary"
          >Generate QR Code</button>
        </div>
        <canvas id="qr_render_area"></canvas>
      </div>
      <button class="btn btn-primary create-event-btn">Create Event</button>
    </form>
  </div>
</template>

<script>
import CourseAPI from "@/services/CourseAPI.js";
import SectionAPI from "@/services/SectionAPI.js";
import Sections from "@/components/Sections";
import QRCode from "qrcode";
import GoogleMap from "@/components/GoogleMap";

export default {
  name: "NewEvent",
  components: {
    Sections,
    GoogleMap
  },
  data() {
    return {
      course: {},
      event: {},
      section: {},
      sections: [],
      sections_have_loaded: false,
      selected_geofence: []
    };
  },
  created() {
    this.course_id = this.$route.params.course_id;
    this.getCourse();
    this.getSectionsForCourse();
  },
  methods: {
    async getCourse() {
      const response = await CourseAPI.getCourse(this.course_id);
      this.course = response.data;
    },
    selectSection(section) {
      this.section = section;
    },
    async addEvent(evt) {
      evt.preventDefault();
      this.event.section = this.section;
      this.event.geofence = this.selected_geofence;
      const response = await EventAPI.addEvent(this.event);
      this.$router.push({
        name: "course_info",
        params: { id: this.course_id }
      });
    },
    async getSectionsForCourse() {
      const response = await SectionAPI.getSectionsForCourse(this.course_id);
      this.sections = response.data;
      this.sections_have_loaded = true;
    },
    generateAttendanceCode() {
      const alnums =
        "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
      let result = "";
      for (let i = 50; i > 0; --i) {
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
};
</script>

<style>
.new-event-form {
  /*border: black solid;*/
}

.input-wrapper {
  width: 50%;
  margin: auto;
  margin-top: 3rem;
  /*border: blue solid;*/
}

#submission-time-wrapper {
  width: 80%;
}

.time-picker {
  /*border: black solid;*/
  display: inline-block;
  margin-left: 1rem;
  margin-right: 1rem;
}

.create-event-btn {
  margin-top: 2rem;
}

#qr-section {
  margin-top: 2rem;
}
</style>