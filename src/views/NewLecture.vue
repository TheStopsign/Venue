<template>
  <!-- ADDING USER -->
  <div>
    <form class="new-lecture-form" @submit.prevent="handleAttemptSubmit">
      <h1>New Lecture For {{ course.name }}</h1>
      <div class="form-group">
        <!-- Lecture Info -->
        <div class="input-wrapper">
          <label id="title_label">Lecture Title</label>
          <input
            type="text"
            class="form-control new-lecture-input"
            placeholder="e.g. Lecture 1"
            v-model="lecture.title"
            aria-labelledby="title_label"
            :tabindex="(modal_open ? '-1' : '0')"
          />
        </div>
        <!-- Section -->
        <div class="spinner-border" role="status" v-if="!course_sections_have_loaded">
          <span class="sr-only">Loading...</span>
        </div>
        <!-- <Sections v-else v-bind:sections="course_sections" v-on:select-section="addSection" :disable_tabbing="(modal_open ? true : false)"/> -->
        <div class="input-wrapper">
          <label>Section(s):</label><br>
          <!-- <input v-for="(section,i) in lecture_sections" :key="i" type="text" class="form-control new-lecture-input" v-model="section.name" readonly :tabindex="(modal_open ? '-1' : '0')"/> -->
          <MultiSelectDropdown v-if="course_sections.length > 0" :options="course_sections" sortBy="name" @update="handleSectionsChange"/>
        </div>
        <div class="input-wrapper">
          <label>Is your meeting live, or pre-recorded?</label><br>
          <input @click="setAllowLiveSubmissions" type="checkbox" name="live_submission" v-model="allow_live_submissions" aria-labelledby="live_submission_label" :tabindex="(modal_open ? '-1' : '0')"> 
          <label id="live_submission_label">Live</label><br>
          <input @click="setAllowPlaybackSubmissions" type="checkbox" name="playback_submission" v-model="allow_playback_submissions" aria-labelledby="playback_submission_label" :tabindex="(modal_open ? '-1' : '0')">
          <label id="playback_submission_label">Pre-recorded</label><br>
        </div>
        <!-- Times -->
        <div v-if="allow_live_submissions">
          <div class="input-wrapper row" >
            <div class="time-container">
              <label id="start_time_label">Start Time</label>
              <div id="lecture_start" class="js-inline-picker" aria-labelledby="start_time_label" :tabindex="(modal_open ? '-1' : '0')"></div>
            </div>
            <div class="time-container">
              <label id="end_time_label">End Time</label>
              <div id="lecture_end" class="js-inline-picker" aria-labelledby="start_time_label" :tabindex="(modal_open ? '-1' : '0')"></div>
            </div>
          </div>
          <div class="input-wrapper">
            <label>Check-in(s):</label>
            <div>
              <div v-for="(checkin,i) in checkins" class="checkin-container row" :key="i">
                <div class="checkin-number col col-1 my-auto">
                  #{{i+1}}
                </div>
                <div class="checkin-type col col-5 my-auto">
                  <MultiSelectDropdown :options="['Pre-set Time','Random Time','Manual Activation']" @update="handleUpdateCheckin" :max="1" :n="i" :ref="'checkinSelector-'+i"/>
                </div>
                <div class="checkin-poll col col-4 my-auto">
                  <div v-if="null != polls[i]">
                    <button type="button" class="btn btn-secondary" @click="add_poll_index = i" :title="'Edit '+polls[i].question">
                      <img class="svg-color" src="@/assets/venue-edit.svg" alt="Edit" width="40" aria-label="Edit">
                    </button>
                    <button type="button" class="btn btn-danger" @click="polls[i] = null" :title="'Remove ' +polls[i].question">X</button>
                  </div>
                  <button v-else type="button" class="btn btn-secondary" @click="add_poll_index = i">Add Poll</button>
                </div>
                <div id="add-poll-modal" v-if="add_poll_index >= 0">
                  <div class="modal-contents">
                    <CreatePoll :playback_only="false" :checkin="add_poll_index" @addPoll="handleAddPoll" :poll="polls[add_poll_index]" @cancel="add_poll_index = -1"/>
                  </div>
                </div>
                <div class="checkin-remove col col-2 my-auto">
                  <button type="button" class="btn btn-danger remove-checkin-btn float-right" @click="handleRemoveCheckin(i)">X</button>
                </div>
                <div class="checkin-options col my-auto" v-if="checkin.activation == 'Pre-set Time'">
                  <label>Start</label>
                  <div :id="'checkin_start_'+i" class="checkin-time js-inline-picker" :tabindex="(modal_open ? '-1' : '0')" type="datetime-local"></div>
                </div>
                <div class="checkin-options col my-auto" v-if="checkin.activation == 'Pre-set Time'">
                  <label>End</label>
                  <div :id="'checkin_end_'+i" class="checkin-time js-inline-picker" :tabindex="(modal_open ? '-1' : '0')" type="datetime-local"></div>
                </div>
                <div class="checkin-options col my-auto" v-else-if="checkin.activation == 'Random Time'">
                  <label>Minutes Long:</label>
                  <input type="number" min="1" v-model.lazy="checkin.minutes"/>
                </div>
              </div>
              <button type="button" id="add-checkin-btn" class="btn btn-secondary" @click="handleAddCheckin">Add Check-in</button>
            </div>
          </div>
        </div>
        <!-- Playback video adder -->
        <LectureUploadModal ref="uploadmodal" v-if="allow_playback_submissions" :lecture="lecture" :update_lecture="false" :shown="modal_open" @openstatus="handleModalChange"/>
        <p class="error_msg" v-if="input_error_message!=''">{{input_error_message}}</p>
        <button class="btn btn-primary create-lecture-btn" :tabindex="(modal_open ? '-1' : '0')">Create Lecture</button>
      </div>
    </form>
  </div>
</template>

<script>
import LectureAPI from "@/services/LectureAPI.js";
import CourseAPI from "@/services/CourseAPI.js";
import SectionAPI from "@/services/SectionAPI.js";
import PlaybackPollAPI from "@/services/PlaybackPollAPI.js";
import Sections from "@/components/Sections";
import QRCode from "qrcode";
import GoogleMap from "@/components/GoogleMap";
import LectureUploadModal from "@/components/LectureUploadModal";
import MultiSelectDropdown from "@/components/MultiSelectDropdown";
//import Picker from 'pickerjs';
import BroderickPicker from "@/assets/broderickpicker/bpicker";
import CreatePoll from '@/components/CreatePoll';
import '../../node_modules/pickerjs/src/index.css';
// DatePicker themes options:
// "material_blue","material_green","material_red","material_orange",
// "dark","airbnb","confetti"

export default {
  name: "NewLecture",
  components: {
    Sections,
    GoogleMap,
    LectureUploadModal,
    MultiSelectDropdown,
    CreatePoll
  },
  data() {
    return {
      course: {},
      lecture: {},
      lecture_sections: [],
      course_sections: [],
      course_sections_have_loaded: false,
      selected_geofence: [],
      allow_live_submissions: false,
      allow_playback_submissions: false,
      checkins: [],
      pickers: [],
      input_error_message: "",
      modal_open: false,
      add_poll_index: -1,
      polls: [],
      start_time_picker: null,
      end_time_picker: null,
      max_year: null,
      min_year: null,
      fix_const: null,
      daysInSelectedMonth: null
    };
  },
  created() {
    if(this.$store.state.user.current_user.ta_sections.includes(this.$route.params.course_id)) {
      SectionAPI.getCourse(this.$route.params.course_id).then(res => {
        this.course_id = res.data._id
        this.course = res.data
        this.getSectionsForCourse();
      })
    } else {
      this.course_id = this.$route.params.course_id
      this.getCourse();
      this.getSectionsForCourse();
    }
  },
  methods: {
    async getCourse() {
      const response = await CourseAPI.getCourse(this.course_id);
      this.course = response.data;
    },
    setErrorMessage(error) {
      this.input_error_message = "ERROR: "+error
      let self = this
      setTimeout(function() {
        self.input_error_message = ""
      },(7*1000))
    },
    handleAttemptSubmit(evt) {
      evt.preventDefault();
      let allGood = true
      let hasTitle = this.lecture.title && this.lecture.title != ""
      let hasSections = this.lecture_sections.length > 0
      let hasType = this.allow_live_submissions || this.allow_playback_submissions
      if(hasTitle && hasSections && hasType) {
        if(this.allow_live_submissions) {
          this.lecture.start_time = this.start_time_picker.pick()
          this.lecture.end_time = this.end_time_picker.pick()
          console.log('new lecture start => ' + this.lecture.start_time);
          console.log('new lecture end => ' + this.lecture.end_time);
          let validRange = this.start_time_picker.pick() <= this.end_time_picker.pick()
          this.pickers.forEach((picker,i) => {
            if(picker) {
              this.checkins[i].start_time = picker.start.pick()
              this.checkins[i].end_time = picker.end.pick()
            }
          })
          if(validRange) {
            let presets = this.getPresetCheckins()
            let randoms = this.getRandomCheckins()
            let manuals = this.getManualCheckins()
            if(this.checkins.map(a=>a.activation).includes(null)) {
              this.setErrorMessage("One or more checkins missing an activation type")
              allGood = false
            } else if(presets.map(a => a.start_time).includes(null)) {
              this.setErrorMessage("One or more pre-set check-ins is missing a start time")
              allGood = false
            } else if(presets.map(a => a.end_time).includes(null)) {
              this.setErrorMessage("One or more pre-set check-ins is missing an end time")
              allGood = false
            } else if(randoms.map(a => a.minutes).includes(null)) {
              this.setErrorMessage("One or more random check-ins is missing a duration")
              allGood = false
            } else if(this.hasOverlaps(presets)) {
              this.setErrorMessage("One or more pre-set check-ins are overlapping")
              allGood = false
            } else if(presets.filter(a => a.start_time < this.lecture.start_time).length > 0) {
              this.setErrorMessage("One or more pre-set check-ins starts before the lecture does")
              allGood = false
            } else if(presets.filter(a => a.end_time > this.lecture.end_time).length > 0) {
              this.setErrorMessage("One or more pre-set check-ins ends after the lecture does")
              allGood = false
            }
          } else if(!validRange) {
            this.setErrorMessage("Invalid lecture time range")
            allGood = false
          }
        } else if(this.$refs["uploadmodal"].isComplete()) {
          allGood = true
        } else {
          this.setErrorMessage("Video upload section is not complete")
          allGood = false
        }
      } else if(!hasTitle) {
        this.setErrorMessage("Missing title")
        allGood = false
      } else if(!hasSections) {
        this.setErrorMessage("Missing section(s)")
        allGood = false
      } else if(!hasType) {
        this.setErrorMessage("Missing lecture type")
        allGood = false
      }
      if(allGood) {
        this.addLecture()
      }
    },
    async addLecture() {
      this.lecture.sections = this.lecture_sections;
      this.lecture.allow_live_submissions = this.allow_live_submissions
      this.lecture.allow_playback_submissions = this.allow_playback_submissions
      this.lecture.checkins = this.checkins
      // generate attendance codes for live lectures
      if(this.lecture.allow_live_submissions) {
        this.generateRandomCheckinTimes()
        this.generateAttendanceCodes()
        this.lecture.checkins = this.lecture.checkins.filter(a => !(a.start_time==null && a.activation=='Random Time'))
        let response = await LectureAPI.addLecture(this.lecture);
        this.lecture = response.data
        
        let poll_promises = []
        this.polls.forEach(poll => {
          if(poll) {
            poll.lecture = this.lecture._id
            poll_promises.push(
              new Promise((resolve,reject) => {
                PlaybackPollAPI.addPoll(poll)
                .then(res => {
                  resolve(res.data)
                })
              })
            )
          }
        })

        Promise.all(poll_promises).then(resolved => {
          this.$router.push({
            name: "lecture_info",
            params: { lecture_id: this.lecture._id }
          })
        })
      }
      else if(this.lecture.allow_playback_submissions) {
        let response = await LectureAPI.addLecture(this.lecture);
        this.lecture = response.data
        this.$refs["uploadmodal"].updateLectureFromParent(this.lecture,this.course_id)
      }
    },
    async getSectionsForCourse() {
      const response = await SectionAPI.getSectionsForCourse(this.course_id);
      this.course_sections = response.data;
      if(!this.$store.state.user.current_user.instructor_courses.includes(this.$route.params.course_id)) {
        this.course_sections = this.course_sections.filter(section => this.$store.state.user.current_user.ta_sections.includes(section._id))
      }
      this.course_sections_have_loaded = true;
    },
    hasOverlaps(checkins) {
      checkins = checkins.concat([]).sort(function(a,b){return a.start_time-b.start_time})
      if(checkins.length < 2) {
        return false
      } else {
        for(let i=1;i<checkins.length;i++) {
          if(checkins[i].start_time < checkins[i-1].end_time) {
            return true
          }
        }
      }
    },
    generateRandomCheckinTimes() {
      function randomNumber(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }
      let randoms = this.getRandomCheckins()
      let done = this.getPresetCheckins()
      randoms.forEach(random => {
        let max_attempts = 30
        for(let i=0;i<max_attempts;i++) {
          let attempt_start = randomNumber(this.lecture.start_time,this.lecture.end_time)
          let attempt_end = attempt_start + (random.minutes * 60 * 1000)
          let joined = done.concat([{start_time:attempt_start,end_time:attempt_end}])
          if(!this.hasOverlaps(joined)) {
            random.start_time = attempt_start
            random.end_time = attempt_end
            done.push(random)
            break
          }
        }
      })
    },
    generateAttendanceCodes() {
      for(let i=0;i<this.lecture.checkins.length;i++) {
        const alnums = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let result = "";
        for (let j = 50; j > 0; --j) {
          result += alnums[Math.floor(Math.random() * alnums.length)];
        }
        this.lecture.checkins[i].code = result;
        if(this.polls[i]) {
          this.polls[i].code = result
        }
      }
    },
    setAllowLiveSubmissions() {
      this.allow_live_submissions = true
      this.allow_playback_submissions = false
      this.lecture.start_time = new Date()
      this.lecture.end_time = new Date()
      this.$nextTick(() => {
        let self = this
        /*this.start_time_picker = new Picker(document.querySelector('#lecture_start'), {
          inline: true,
          controls: true,
          headers: true
        });*/
        this.start_time_picker = new BroderickPicker('#lecture_start', 5);
        this.end_time_picker = new BroderickPicker('#lecture_end', 5);
        /*this.end_time_picker = new Picker(document.querySelector('#lecture_end'), {
          inline: true,
          controls: true,
          headers: true
        });*/
      })
    },
    setAllowPlaybackSubmissions() {
      this.allow_playback_submissions = true
      this.allow_live_submissions = false
    },
    handleSectionsChange(data) {
      this.lecture_sections = data.map(a=>a._id)
    },
    handleAddCheckin() {
      this.pickers.forEach((picker,i) => {
        if(picker) {
          this.checkins[i].start_time = picker.start.pick()
          this.checkins[i].end_time = picker.end.pick()
          console.log('START TIME WAS ADDED @: ' + this.checkins[i].start_time)
          console.log('END TIME WAS ADDED @: ' + this.checkins[i].end_time)
        }
      })
      this.checkins.push({
        start_time: new Date(),
        end_time: new Date(),
        manually_activated: null,
        code: null,
        activation: null,
        minutes: null
      })
      this.polls.push(null)
      this.updatePickers
    },
    updatePickers() {
      this.pickers.forEach(picker => {
        if(picker) {
          picker.start.destroy()
          picker.end.destroy()
        }
      })
      this.pickers = []
      this.checkins.forEach((checkin,i) => {
        if(checkin.activation == 'Pre-set Time') {
          let self = this
          let pickers = {
            start: null,
            end: null
          }
          let startdate = null
          let enddate = null
          if(checkin.start_time) {
            startdate = checkin.start_time
          }
          if(checkin.end_time) {
            enddate = checkin.end_time
          }
          console.log('when you destroy a picker the startdate and enddate are: ' + startdate, enddate)
          /*pickers.start = new Picker(document.querySelector("#checkin_start_"+i), {
            inline: true,
            rows: 1,
            headers: true,
            date: startdate,
            controls: true
          });
          pickers.end = new Picker(document.querySelector("#checkin_end_"+i), {
            inline: true,
            rows: 1,
            headers: true,
            date: enddate,
            controls: true
          });*/
          pickers.start = new BroderickPicker('#checkin_start_'+i, {
            rows: 1,
            date: startdate
          }) 
          pickers.end = new BroderickPicker('#checkin_end_'+i, {
            rows: 1,
            date: enddate
          })
          //this.checkins[i].start_time = pickers.start.pick()
          //this.checkins[i].end_time = pickers.start.pick()
          //console.log('the update pickers function happened and => ' + this.checkins)
          this.pickers.push(pickers)
        } else {
          this.pickers.push(null)
        }
      })
    },
    handleUpdateCheckin(data,i) {
      this.checkins[i].activation = data[0]
      this.checkins[i].start_time = null
      this.checkins[i].end_time = null
      this.checkins[i].minutes = null
      this.$nextTick(function() {
        this.updatePickers()
      })
    },
    handleRemoveCheckin(i) {
      this.pickers.forEach((picker,i) => {
        if(picker) {
          this.checkins[i].start_time = picker.start.pick()
          this.checkins[i].end_time = picker.end.pick()
        }
      })
      this.checkins.splice(i,1)
      this.polls.splice(i,1)
      let self = this
      this.$nextTick(function() {
        this.updatePickers()
        self.checkins.forEach((checkin,i) => {
          let selected = []
          if(checkin.activation) {
            selected.push(checkin.activation)
          }
          self.$refs['checkinSelector-'+i][0].setSelected(selected)
        })
      })
    },
    getPresetCheckins() {
      return this.checkins.filter(a => a.activation == 'Pre-set Time')
    },
    getRandomCheckins() {
      return this.checkins.filter(a => a.activation == 'Random Time')
    },
    getManualCheckins() {
      return this.checkins.filter(a => a.activation == 'Manual Activation')
    },
    handleAddPoll(poll) {
      this.add_poll_index = -1
      this.polls[poll.checkin] = poll
    },
    handleModalChange(isOpen) {
      this.modal_open = isOpen
    }
  }
};
</script>

<style>
h1 {
  text-align: center;
}

.col {
  padding: 1rem;
  padding-top: 0rem;
  display: inline-block;
}

.remove-checkin-btn {
  width: 3rem;
  max-width: 100%;
}

.new-lecture-form {
  width: 60rem;
  margin: auto;
  padding: 0rem 2rem;
  max-width: 100%;
}

.input-wrapper {
  width: 100%;
  max-width: 100%;
  margin: auto;
  margin-top: 3rem;
  padding: 0;
  text-align: center;
  /*border: blue solid;*/
}

.form-group {
  margin: 0;
}

.random_input {
  width: 5rem;
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

.create-lecture-btn {
  margin-top: 2rem;
}

#qr-section {
  margin-top: 2rem;
}

.error_msg {
  color: var(--error-brighter);
}

.checkin-container {
  border: 1px solid var(--checkins-border);
  margin: 0.25rem 0rem;
  border-radius: 0.5rem;
  padding-top: 1rem;
}

.vertically-centered {
  margin: auto;
}

.checkin-time {
  width: 100%;
}

#add-checkin-btn {
  height: 5rem;
  width: 100%;
  border-radius: 0.5rem;
}

#add-poll-modal {
  z-index: 1000;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--modal-container-background);
}

.modal-contents {
  position: absolute;
  top: 25%;
  left: 25%;
  right: 25%;
  bottom: 25%;
  background: var(--modal-background);
  border: 1px solid var(--modal-border);
  border-radius: 0.5rem;
  padding: 1rem;
  text-align: left;
  overflow: auto;
}

.time-container {
  min-width: 50%;
  max-width: 25rem;
  margin: auto;
  display: inline-block;
}

.picker {
  width: 100%;
  padding: 0.5rem;
  background: none;
}

.picker-dialog {
  width: 100%;
  border-radius: 0.5rem;
  background: var(--calendar-background); 
  border: 1px solid var(--calendar-border);
}

.picker-item {
  color: var(--calendar-border);
  background: var(--calendar-background);
}
.picker-cell__control,
.picker-cell__control::before,
.picker-cell__header {
  /* background-color: var(--calendar-background); */
  color: var(--calendar-border);
  text-align: center;
}

.picker-picked {
  color: var(--calendar-selected);
  font-weight: 900;
}

.picker-cell__control--prev::before {
  content: '⏶';
  /*content: '🠹'*/
}

.picker-cell__control--next::before {
  content: '⏷';
  /*content: '🠻'*/
}

.picker-cell__header {
  border-bottom: 1px solid;
}
</style>