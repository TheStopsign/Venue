<template>
  <div id="lecture-upload-modal">
    <LoadingOverlay v-if="waiting"/>
    <button type="button" id="video-upload-btn" class="btn btn-primary" @click="handleShowModal" :tabindex="(modal_open ? '-1' : '0')" title="Upload Recording">
      <img class="svg-color" src="@/assets/venue-upload.svg" width="60" alt="QR Code" aria-label="QR Code">
    </button>
    <div id="lecture_modal_viewable" class="hiddenModal">
      <div class="row titlerow">
        <h1 id="banner_title" aria-label="New Lecture Video">New Lecture Video <button type="button" v-if="update_lecture" id="cancel_upload_btn" class="btn btn-secondary" @click="hideModal" aria-label="Cancel Video Upload">Cancel</button>
          <button type="button" v-else id="cancel_upload_btn" class="btn btn-secondary" @click="hideModal()" aria-label="Cancel Video Upload">Cancel</button>
        </h1>
      </div>
      <div class="row youtuberow">
        <label id="youtube_label">Youtube Video URL:</label>
        <input id="youtube_selector" type="text" class="form-control" role="input" tabindex="0" aria-labelledby="youtube_label"/>
        <div v-if="video_type == 'video/youtube'">
          <label id="yt_length_label" class="col-12">Length:</label>
          <input class="col col-4" type="number" id="yt_hour" min="0" max="5" value="0" aria-labelledby="yt_length_label" placeholder="0 hours"/>
          <input class="col col-4" type="number" id="yt_min" min="0" max="59" value="0" aria-labelledby="yt_length_label" placeholder="0 min"/>
          <input class="col col-4" type="number" id="yt_sec" min="0" max="59" value="0" aria-labelledby="yt_length_label" placeholder="0 sec"/>
        </div>
      </div>
      <div class="row webexrow">
        <label id="webex_label">Webex Recording URL:</label>
        <input id="webex_selector" type="text" class="form-control" role="input" tabindex="0" aria-labelledby="webex_label"/>
        <div v-if="video_type == 'webex'">
          <label id="webex_length_label" class="col-12">Length:</label>
          <input class="col col-4" type="number" id="webex_hour" min="0" max="5" value="0" aria-labelledby="webex_length_label" placeholder="0 hours"/>
          <input class="col col-4" type="number" id="webex_min" min="0" max="59" value="0" aria-labelledby="webex_length_label" placeholder="0 min"/>
          <input class="col col-4" type="number" id="webex_sec" min="0" max="59" value="0" aria-labelledby="webex_length_label" placeholder="0 sec"/>
        </div>
      </div>
      <div class="row filerow" v-if="video_type == ''">
        <input id="video_selector" name="lecturevideo" type="file" accept="video/*" class="btn" role="button" tabindex="0" aria-label="Select Video and Show Poll Creation Options"/>
      </div>
      <div class="row attachmentrow" v-if="file_type == ''">
        <input id="attachment_selector" name="lectureattachment" type="file" accept="image/*, .docx, .pptx, .doc, .ppt, .txt, .pdf" class="btn" role="button" tabindex="0" aria-label="Select File to Upload"/>
      </div>
      <div class="row" id="lecture_container" v-if="file_selected">
        <div class="col add-poll-col" v-if="!update_lecture">
          <h2>Add Poll</h2>
          <div class="poll_card">
            <div class="row questionrow">
              <label id="question_label">Question</label>
              <textarea id="question" class="col" type="text" placeholder="eg. Which of the following...?" aria-labelledby="question_label"/>
            </div>
            <div class="row">
              <div class="col col-4">
                <!-- <label for="hour">Hour:</label> -->
                  <label id="hour_label">Hour</label>
                  <input type="number" id="hour" min="0" max="5" aria-labelledby="hour_label"/>
              </div>
              <div class="col col-4">
                <!-- <label for="min">Minute:</label> -->
                  <label id="minute_label">Min</label>
                  <input type="number" id="min" min="0" max="59" aria-labelledby="minute_label"/>
              </div>
              <div class="col col-4">
                <!-- <label for="sec">Second:</label> -->
                  <label id="seconds_label">Sec</label>
                  <input type="number" id="sec" min="0" max="59" aria-labelledby="seconds_label"/>
              </div>
            </div>
            <h4>Possible Answers</h4>
            <div class="row">
              <label id="spacer1">Number</label>
              <label id="a_label">Answer</label>
              <label id="correct_label">Correct</label>
            </div>
            <ol class="row possible_answer">
              <li v-for="(current_answer,i) in current_answers" v-bind:key="i">
                <!-- <p class="answernumber">{{i + 1}}</p> -->
                <input class="answerfield" type="text" v-model.lazy="current_answers[i]" aria-labelledby="a_label"/>
                <input class="iscorrectfield" type="checkbox" v-model.lazy="current_is_correct[i]" aria-labelledby="correct_label"/>
                <button type="button" class="btn btn-danger removeanswer" @click="current_answers.splice(i,1);current_is_correct.splice(i,1)" :aria-label="'Remove Answer '+(i+1)">X</button>
              </li>
            </ol>
            <div class="row addanswerrow">
              <div class="col">
                <button type="button" id="add_answer_btn" class="btn btn-secondary" @click="current_answers.push('');current_is_correct.push(false)">Add Option</button>
              </div>
              <div class="col">
                <button type="button" id="add_poll_btn" class="btn btn-primary" @click="addPoll()">Save Poll</button>
              </div>
            </div>
          </div>
        </div>
        <div class="col" v-if="(polls && polls.length) || (need_timestamp && need_timestamp.length)">
          <h2>Current Polls</h2>
          <label v-if="polls.length" id="pq_label">Question</label>
          <ol class="row pollrow">
            <li v-for="(poll,i) in polls" :key="i" class="row">
              <p class="polltimestamp">{{secondsToHHMMSS(poll.timestamp)}}</p>
              <input class="pollquestion" :value="poll.question" readonly aria-labelledby="pq_label"/>
              <button type="button" class="removepollbtn btn btn-danger" @click="polls.splice(i,1)" :aria-label="'Remove Poll '+(i+1)">X</button>
            </li>
            <li v-for="(poll,i) in need_timestamp" :key="i" class="row needs-timestamp-li">
              <div class="col-md-3">
                <label id="hour_label">Hour</label>
                <input type="number" id="hour" min="0" max="5" v-model.lazy="poll.hour" aria-labelledby="hour_label"/>
              </div>
              <div class="col-md-3">
                <label id="minute_label">Min</label>
                <input type="number" id="min" min="0" max="59" v-model.lazy="poll.min" aria-labelledby="minute_label"/>
              </div>
              <div class="col-md-3">
                <label id="seconds_label">Sec</label>
                <input type="number" id="sec" min="0" max="59" v-model.lazy="poll.sec" aria-labelledby="seconds_label"/>
              </div>
              <div class="col-md-3">
                <button type="button" class="btn btn-primary get-time" aria-label="Set Time From Video" @click="getVideoTime(i)">Get Time</button>
              </div>
              <input class="needs-timestamp" :value="poll.question" readonly aria-labelledby="pq_label"/>
            </li>
          </ol>
        </div>
        <div class="col col-3" v-else>
        </div>
        <div :class="(update_lecture?'col-6':'col-5')">
          <video id="video_player" class="video-js vjs-big-play-centered" controls></video>
        </div>
      </div>
      <div class="row">
        <div class="col-md-5">
          <label id="playback_start_label">Video Attendance Start</label>
        </div>
        <div class="col-md-5">
          <label id="playback_end_label">Video Attendance End</label>
        </div>
        <div class="col-md-2">
        </div>
      </div>
      <div class="row" id="bottomrow">
        <div class="col-md-5">
          <div id="playback_start" aria-labelledby="playback_start_label" type="datetime-local"></div>
        </div>
        <div class="col-md-5">
          <div id="playback_end" class="" aria-labelledby="playback_end_label" type="datetime-local"></div>
        </div>
        <div class="col-md-2">
          <button type="button" v-if="update_lecture" id="video_upload_btn" class="btn btn-secondary uploadbtn" @click="updateLecture()">Upload</button>
          <button type="button" v-else id="video_upload_btn" class="btn btn-secondary uploadbtn" @click="hideModal()">Upload</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LectureAPI from "../services/LectureAPI";
import PlaybackPollAPI from "../services/PlaybackPollAPI";
import videojs from 'video.js';
import LoadingOverlay from '@/components/LoadingOverlay.vue';
import Picker from 'pickerjs';
import '../../node_modules/pickerjs/src/index.css';
require('videojs-youtube')
const validator = require('youtube-url')
import axios from 'axios';
// DatePicker themes options:
// "material_blue","material_green","material_red","material_orange",
// "dark","airbnb","confetti"

export default {
  name: "LectureUploadModal",
  props: {
    lecture: Object,
    update_lecture: Boolean,
    need_timestamp: Array
  },
  computed: {},
  components: {
    LoadingOverlay
  },
  data() {
    return {
      file_selected: false,
      current_answers: [],
      current_is_correct: [],
      polls: [],
      video_ref: "",
      video_type: "",
      vjs: null,
      play_sub_start_picker: null,
      play_sub_end_picker: null,
      modal_open: false,
      waiting: false
    };
  },
  created() {
  },
  beforeDestroy() {
    if(this.vjs) {
      this.vjs.dispose()
    }
  },
  methods: {
    async updateLecture() {
      if(this.isComplete()) {
        this.waiting = true;
        let lecture_video
        if(this.video_type == 'video/youtube') {
          this.lecture.video_ref = this.video_ref
          let ythour = parseInt(document.getElementById('yt_hour').value)
          let ytmin = parseInt(document.getElementById('yt_min').value)
          let ytsec = parseInt(document.getElementById('yt_sec').value)
          this.lecture.video_length = (ythour*60*60) + (ytmin*60) + ytsec
        } else if(this.video_type == 'webex') {
          this.lecture.video_ref = this.video_ref
          let webexhour = parseInt(document.getElementById('webex_hour').value)
          let webexmin = parseInt(document.getElementById('webex_min').value)
          let webexsec = parseInt(document.getElementById('webex_sec').value)
          this.lecture.video_length = (webexhour*60*60) + (webexmin*60) + webexsec
        } else {
          lecture_video = document.getElementById("video_selector").files[0]
          this.lecture.video_length = this.vjs.duration()
        }
        this.lecture.video_type = this.video_type
        if(!this.lecture.video_type) {
          let response = await this.uploadMediaToS3(this.lecture)
          this.lecture.video_ref = response.split("?")[0]
        }
        await LectureAPI.updateToPlayback(this.lecture)
        let n_saved = 0
        if(this.need_timestamp.length == 0) {
          this.waiting = false;
          this.hideModal()
          location.reload()
        } else {
          for(let i=0;i<this.need_timestamp.length;i++) {
            this.need_timestamp[i].lecture = this.lecture._id
            this.updateTimestamp(i)
            PlaybackPollAPI.update(this.need_timestamp[i])
            .then(res => {
              n_saved++
              if(n_saved == this.need_timestamp.length) {
                this.need_timestamp = []
                this.waiting = false;
                this.hideModal()
                location.reload()
              } else {
                for(let i=0;i<this.need_timestamp.length;i++) {
                  this.need_timestamp[i].lecture = this.lecture._id
                  this.updateTimestamp(i)
                  PlaybackPollAPI.update(this.need_timestamp[i])
                  .then(res => {
                    n_saved++
                    if(n_saved == this.need_timestamp.length) {
                      this.need_timestamp = []
                      this.waiting = false;
                      this.hideModal()
                      location.reload()
                    }
                  })
                }
              }
            
            }).catch(err => {
              console.log("Error:",err)
            })
          }
        }
      }
    },
    async updateLectureFromParent(lect,course_id) {
      this.waiting = true
      let lecture_video
      if(this.video_type == 'video/youtube') {
        lect.video_ref = this.video_ref
        let ythour = parseInt(document.getElementById('yt_hour').value)
        let ytmin = parseInt(document.getElementById('yt_min').value)
        let ytsec = parseInt(document.getElementById('yt_sec').value)
        lect.video_length = (ythour*60*60) + (ytmin*60) + ytsec
      } else if(this.video_type == 'webex') {
        lect.video_ref = this.video_ref
        let webexhour = parseInt(document.getElementById('webex_hour').value)
        let webexmin = parseInt(document.getElementById('webex_min').value)
        let webexsec = parseInt(document.getElementById('webex_sec').value)
        lect.video_length = (webexhour*60*60) + (webexmin*60) + webexsec
      } else {
        lecture_video = document.getElementById("video_selector").files[0]
        lect.video_length = this.vjs.duration()
      }
      lect.video_type = this.video_type
      if(!lect.video_type) {
        let response = await this.uploadMediaToS3(lect)
        lect.video_ref = response.split("?")[0]
      }
      await LectureAPI.updateToPlayback(lect)
      let n_saved = 0
      if(this.polls.length == 0) {
        this.hideModal()
        this.waiting = false
        this.$router.push({
          name: "lecture_info",
          params: { lecture_id: lect._id }
        })
      } else {
        for(let i=0;i<this.polls.length;i++) {
          this.polls[i].lecture = lect._id
          PlaybackPollAPI.addPoll(this.polls[i])
          .then(res => {
            n_saved++
            if(n_saved == this.polls.length) {
              this.polls = []
              this.hideModal()
              this.waiting = false
              this.$router.push({
                name: "lecture_info",
                params: { lecture_id: lect._id }
              })
            } else {
              for(let i=0;i<this.polls.length;i++) {
                this.polls[i].lecture = lect._id
                PlaybackPollAPI.addPoll(this.polls[i])
                .then(res => {
                  n_saved++
                  if(n_saved == this.polls.length) {
                    this.polls = []
                    this.hideModal()
                    this.waiting = false
                    this.$router.push({
                      name: "lecture_info",
                      params: { lecture_id: lect._id }
                    })
                  }
                })
              }
            }
          }).catch(err => {
            console.log("Error")
          })
        }
      }
    },
    getSignedRecordingURL(filename) {
      return new Promise((resolve, reject) => {
        LectureAPI.getSignedRecordingUrl(filename)
          .then(data => {
            resolve(data);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    uploadVideoToS3(lect) {
      return new Promise((resolve,reject) => {
        this.getSignedRecordingURL(lect._id + '-' + document.getElementById("video_selector").files[0].name).then(data => {
          fetch(data.data, {
            method: 'PUT',
            body: document.getElementById("video_selector").files[0]
          }).then(res => {
            resolve(data.data)
          })
        }).catch(err => {
          reject(err)
        });
      })
    },
    getSignedFileURL(filename) {
      return new Promise((resolve, reject) => {
        LectureAPI.getSignedFileUrl(filename)
          .then(data => {
            resolve(data);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    uploadFileToS3(lect) {
      return new Promise((resolve,reject) => {
        this.getSignedFileURL(lect._id + '-' + document.getElementById("file_selector").files[0].name).then(data => {
          fetch(data.data, {
            method: 'PUT',
            body: document.getElementById("file_selector").files[0]
          }).then(res => {
            resolve(data.data)
          })
        }).catch(err => {
          reject(err)
        });
      })
    },
    setLectureSubmissionVariables() {
      this.lecture.allow_live_submissions = false
      this.lecture.allow_playback_submissions = true
    },
    handleShowModal() {
      this.showModal()
      this.$nextTick(() => {
        let youtube_selector = document.getElementById("youtube_selector");
        let webex_selector = document.getElementById("webex_selector");
        let vid_selector = document.getElementById("video_selector");
        let vid_upload_btn = document.getElementById("video_upload_btn");
        let self = this;
        const handleVidSelection = (url,vjs_type) => {
          if (vid_selector.files.length == 0 && !url) {
            vid_upload_btn.setAttribute("disabled","true");
            self.file_selected = false;
          } else {
            vid_upload_btn.removeAttribute("disabled");
            self.polls = [];
            self.file_selected = true;
            //videojs player implementation
            self.$nextTick(() => {
              if(self.vjs == null) {
                videojs("video_player", {}, function() {
                  self.vjs = this
                  self.vjs.src({ type: (vjs_type?vjs_type:vid_selector.files[0].type), src: (url?url:URL.createObjectURL(vid_selector.files[0])) })
                  self.vjs.load()
                })
              } else {
                self.vjs.src({ type: (vjs_type?vjs_type:vid_selector.files[0].type), src: (url?url:URL.createObjectURL(vid_selector.files[0])) })
                self.vjs.load()
              }
              if(self.play_sub_start_picker == null) {
                self.play_sub_start_picker = new Picker(document.querySelector("#playback_start"), {
                  inline: true,
                  rows: 1,
                  headers: true,
                  controls: true
                });
                self.play_sub_end_picker = new Picker(document.querySelector("#playback_end"), {
                  inline: true,
                  rows: 1,
                  headers: true,
                  controls: true
                });
              }
            })
          }
        }
        vid_selector.addEventListener("change", function(e) {
          e.preventDefault()
          handleVidSelection()
        });
        youtube_selector.addEventListener("input", function(e) {
          e.preventDefault()
          if(validator.valid(e.target.value)) {
            self.video_ref = e.target.value
            self.video_type = 'video/youtube'
            handleVidSelection(self.video_ref,self.video_type)
          }
        });
        webex_selector.addEventListener("input", function(e) {
          e.preventDefault()
          self.video_ref = e.target.value
          self.video_type = 'webex'
          handleVidSelection(self.video_ref,'video/mp4')
        });
      })
    },
    hideModal() {
      this.modal_open = false 
      this.$emit('openstatus', false)
      document.getElementById('lecture_modal_viewable').classList.add('hiddenModal')
    },
    showModal() {
      this.modal_open = true
      this.$emit('openstatus', true)
      document.getElementById('lecture_modal_viewable').classList.remove('hiddenModal')
    },
    addPoll() {
      let question = document.getElementById("question")
      let hour = document.getElementById("hour")
      let min = document.getElementById("min")
      let sec = document.getElementById("sec")
      let answers = document.getElementsByClassName("answerfield")
      let iscorrect = document.getElementsByClassName("iscorrectfield")
      let a = []
      let c = []
      let found_empty = false
      for(let i=0;i<answers.length;i++) {
        if(answers[i].value == "") {
          found_empty = true
        } else {
          a.push(answers[i].value)
        }
      }
      let secs = 0;
      if(hour.value) {
        secs += (parseInt(hour.value)*3600)
      }
      if(min.value) {
        secs += (parseInt(min.value)*60)
      }
      if(sec.value) {
        secs += (parseInt(sec.value))
      }
      if(!found_empty && question.value != "" && secs > 0) {
        for(let i=0;i<iscorrect.length;i++) {
          if(iscorrect[i].checked) {
            c.push(answers[i].value)
          }
        }
        this.polls.push({
          lecture: this.lecture._id,
          question: question.value,
          possible_answers: a,
          correct_answers: c,
          timestamp: secs
        })
        this.polls.sort((a, b) => (a.timestamp > b.timestamp) ? 1 : -1)

        this.current_answers = []
        this.current_is_correct = []
        question.value = ""
        hour.value = ""
        min.value = ""
        sec.value = ""
      }
    },
    smhToTimestamp(poll) {
      return (parseInt(poll.sec) + (parseInt(poll.min)*60) + (parseInt(poll.hour)*60*60))
    },
    isComplete() {
      this.lecture.playback_submission_start_time = this.play_sub_start_picker.pick().date
      this.lecture.playback_submission_end_time = this.play_sub_end_picker.pick().date
      if(this.video_type == 'video/youtube') {
        let ythour = parseInt(document.getElementById('yt_hour').value)
        let ytmin = parseInt(document.getElementById('yt_hour').value)
        let ytsec = parseInt(document.getElementById('yt_min').value)
        if( !(ythour||ytmin||ytsec) ) {
          return false
        }
      }
      if(this.lecture.playback_submission_start_time > this.lecture.playback_submission_end_time) {
        return false
      }
      if(this.need_timestamp) {
        return this.need_timestamp.every(poll => undefined != poll.sec && undefined != poll.min && undefined != poll.hour)
      } else {
        return true
      }
    },
    secondsToHHMMSS(seconds) {
      return (new Date(seconds * 1000).toISOString().substr(11, 8))
    },
    updateTimestamp(i) {
      this.need_timestamp[i].timestamp = (parseInt(this.need_timestamp[i].hour) * 3600) + (parseInt(this.need_timestamp[i].min) * 60) + parseInt(this.need_timestamp[i].sec)
    },
    getVideoTime(i) {
      let seconds = Math.floor(this.vjs.currentTime())
      this.need_timestamp[i].hour = Math.floor(seconds / 3600);
      this.need_timestamp[i].min = Math.floor(seconds % 3600 / 60);
      this.need_timestamp[i].sec = Math.floor(seconds % 3600 % 60);
      this.need_timestamp[i].timestamp = seconds
      this.$forceUpdate()
    }
  }
};
</script>

<style scoped>
#lecture-upload-modal {
  display: inline-flex;
  margin-right: 0.75rem;
}
#video-upload-btn {
  min-height: calc(60px + .75rem);
  padding: 0.375rem 0.375rem;
  border-radius: 0.25rem;
}
.row {
  padding: 0;
  width: 100%;
  margin: 0;
}
#banner_title {
  text-align: center;
  position: relative;
  width: 100%;
  margin: 0;
}
.titlerow {
  padding-top: 2rem;
}
.filerow {
  height: 5rem;
}
h2 {
  text-align: center;
}
#cancel_upload_btn {
  position: relative;
}
#lecture_modal_viewable {
  position: fixed;
  background: var(--modal-background);
  top: 7rem;
  left: 2rem;
  right: 2rem;
  bottom: 2rem;
  border: 1px solid var(--modal-lecture-border);
  overflow-y: auto;
  z-index: 1001;
  padding: 1rem;
  border-radius: 1rem;
}
#close_lecture_modal {
  position: absolute;
  width: 2rem;
  height: 2rem;
  left: 0;
  margin: 0;
  padding: 0;
}
#lecture_container {
  position: relative;
  padding: 2rem 0rem;
  width: 100%;
}
#video_selector {
  position: relative;
  top: 2rem;
  height: 3rem;
  margin: 0 auto;
}
#video_player {
  width: 100%;
  height: 100%;
}
#bottomrow {
  padding: 0rem 0rem 2rem 0rem;
  margin: 0rem;
  width: 100%;
}
#playback_start {
  /* height: 4rem; */
  width: 100%;
  font-size: 1.5rem;
}
#playback_end {
  height: 4rem;
  width: 100%;
  font-size: 1.5rem;
}
#playback_start_label {
  height: 4rem;
  width: 100%;
  font-size: 1.5rem;
  text-align: center;
}
#playback_end_label {
  height: 4rem;
  width: 100%;
  font-size: 1.5rem;
  text-align: center;
}
#video_upload_btn {
  height: 100%;
  width: 100%;
}
li {
  width: 100%;
}
#pq_label {
  width: 100%;
  text-align: center;
}
.possible_answer {
  margin-bottom: 1rem;
}
input {
  width: 100%;
  margin: 0;
}
#spacer1 {
  width: 15%;
}
.answernumber {
  width: 15%;
  text-align: center;
}
#a_label {
  width: 65%;
  text-align: center;
}
.answerfield {
  position: relative;
  width: 80%;
  font-size: 1rem;
}
#correct_label {
  width: 10%;
}
.iscorrectfield {
  /* margin-left: 2rem; */
  margin-top: 0.5rem;
  width: 10%;
  height: 1rem;
}
.removeanswer {
  width: 10%;
  padding: 0;
}
#add_answer_btn {
  /* position: absolute; */
  /* left: 0; */
  width: 100%;
  /* margin: 0; */
}
#add_poll_btn {
  /* position: absolute; */
  /* right: 0; */
  /* margin: 0; */
  width: 100%;
}
.addanswerrow {
  height: 2.5rem;
  margin-bottom: 1rem;
}
.addanswerrow .col {
  padding: 0rem 0.5rem;
}
#question,
#hour,
#min,
#sec {
  font-size: 1rem;
}

#question {
  height: 3rem;
  resize: none;
}

h4 {
  padding-top: 1rem;
  margin-bottom: 0.5rem;
  width: 100%;
}

p {
  position: relative;
  margin: 0;
  height: 1rem;
  font-size: 1rem;
  top: 0.45rem;
}
.pollrow {
  list-style-type: none;
  margin-left: 0rem;
  margin-bottom: 1rem;
  font-size: 1rem;
}
.polltimestamp {
  position: relative;
  width: 15%;
  margin: 0 auto;
  font-size: 0.75rem;
  text-align: center;
}
.pollquestion {
  position: relative;
  width: 70%;
  margin: 0;
}
.needs-timestamp-li {
  text-align: center;
  padding-top: 1rem;
  margin-top: 1rem;
}
.needs-timestamp-li:not(:first-of-type) {
  border-top: 1px solid gray;
}
.needs-timestamp {
  position: relative;
  width: 100%;
  margin-top: 1rem;
}
.get-time {
  position: absolute;
  bottom: 0;
  left: 15%;
  width: 70%;
}
.removepollbtn {
  position: relative;
  margin: 0 auto;
  padding: 0.25rem;
  height: 2rem;
}
.hiddenModal {
  display: none;
}
.vjs-tech {
	position:unset;
}
</style>