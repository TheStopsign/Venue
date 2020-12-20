<template>
  <div id="edit-lecture">
    <h1>Edit Lecture</h1>
    <SquareLoader v-if="!lecture"/>
    <form v-else @submit.prevent="updateLecture">
      <div class="row">
        <div class="col-md-6">
          <h2><strong>Settings</strong></h2>
        </div>
        <div class="col-md-6">
          <h2>Current</h2>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
          <h3>General</h3>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
          <label>title</label>
        </div>
        <div class="col-md-6">
          <input v-model="lecture.title"/>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
          <label>section(s)</label>
        </div>
        <div class="col-md-6">
          <MultiSelectDropdown v-if="all_sections" ref="sectionsSelector" :options="all_sections" :preselected="lecture.sections" sortBy="name" @update="handleSectionsUpdate"/>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
          <h3>Check-ins</h3>
        </div>
        <div class="col-md-6">
          <p v-if="lecture.checkins && lecture.checkins.length"></p>
          <p v-else>None</p>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
          <h3>Synchronous Attendance</h3>
        </div>
        <div class="col-md-6">
          
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
          <label>start time</label>
        </div>
        <div class="col-md-6">
          <input v-model="lecture.start_time"/>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
          <label>end time</label>
        </div>
        <div class="col-md-6">
          <input v-model="lecture.end_time"/>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
          <label>meeting link</label>
        </div>
        <div class="col-md-6">
          <input v-model="lecture.meeting_link"/>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
          <h3>Asynchronous Attendance</h3>
        </div>
        <div class="col-md-6">
          
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
          <label>start time</label>
        </div>
        <div class="col-md-6">
          <input v-if="lecture.allow_playback_submissions" v-model="lecture.playback_submission_start_time"/>
          <p v-else>Upload a recording first</p>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
          <label>end time</label>
        </div>
        <div class="col-md-6">
          <input v-if="lecture.allow_playback_submissions" v-model="lecture.playback_submission_end_time"/>
        </div>
      </div>
      <div class="row">
      
      <!-- </div>
      <div class="row">
        <h1>Finds</h1>
  <div class="row">
  <h1>Add Links</h1>
  <div v-for="(link, index) in lecture.class_links" :key="index">
    <input v-model="lecture.class_links[index]">
  </div>
  <button type="button" @click="addLink">
    New Link
  </button>
</div> -->
        <div class="col-md-12">
          <button v-if="waiting" class="btn btn-primary" disabled><SquareLoader/></button>
          <button v-else class="btn btn-primary">Save</button>
          <button type="button" class="btn btn-danger float-right" @click="handleDeleteLecture">Remove</button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import SectionAPI from "@/services/SectionAPI.js";
import CourseAPI from "@/services/CourseAPI.js";
import LectureSubmissionAPI from "@/services/LectureSubmissionAPI.js";
import LectureAPI from '@/services/LectureAPI.js';
import UserAPI from "@/services/UserAPI.js";
import SquareLoader from "@/components/Loaders/SquareLoader.vue";
import MultiSelectDropdown from "@/components/MultiSelectDropdown.vue";
export default {
  name: "EditLecture",
  components: {
    SquareLoader,
    MultiSelectDropdown
  },
  data() {
    return {
      lecture: null,
      waiting: false,
      all_sections: null
    }
  },
  created() {
    this.getLecture();

  },
  methods: {
    getLecture() {
      LectureAPI.getLectureWithSectionsAndCourse(this.$route.params.id).then(res => {
        this.lecture = res.data
        this.getAllSections()
      })
    },
    getAllSections() {
      if(this.lecture.sections && this.lecture.sections.length) {
        let self = this
        SectionAPI.getSectionsForCourse(this.lecture.sections[0].course._id).then(res => {
          this.all_sections = res.data;
          this.$nextTick(function() {
            self.$refs['sectionsSelector'].setSelected(this.lecture.sections)
          })
        })
      }
    },
    updateLecture() {
      if(confirm("All values in \"Updates\" column will be applied. Are you sure?")) {
        this.waiting = true
        this.lecture.class_links.filter(link => link != "")
        LectureAPI.update(this.lecture).then(res => {
          this.waiting = false
          location.reload()
        })
      }
    },
    handleSectionsUpdate(selected,n) {
      this.lecture.sections = selected.map(a=>a._id)
    },
    handleDeleteLecture() {
      let del = confirm('Are you sure? This cannot be undone.')
      if(del) {
        LectureAPI.deleteLecture(this.lecture._id).then(res => {
          this.$router.push({name: "dashboard"})
        })
      }
    },
    addLink() {
      this.lecture.class_links.push("");
    }
  }
};
</script>

<style scoped>
#edit-lecture {
  padding: 2rem;
}

.row {
  margin: 0.75rem 0rem;
  padding: 0;
}

#lect-label-settings > *,
#lect-current-settings > *,
#lect-updated-settings > * {
  display: block;
  width: 100%;
  min-height: 3rem;
  margin-bottom: 0.5rem;
}

#lect-label-settings > *:not(:first-child) {
  text-align: right;
}

.gap1 {
  margin-top: 3.75rem;
}

.gap2 {
  margin-top: 7.25rem;
}

h3 {
  font-style: italic;
}

label {
  width: 100%;
  text-align: right;
}

.col-md-6:nth-child(2) > input, p {
  text-align: left;
  width: 80%;
}
</style>