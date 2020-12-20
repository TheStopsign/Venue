<template>
  <div>
    <div id="qr-scanning-container" v-if="camera_scanning_window_open">
      <button @click="camera_scanning_window_open = false" id="exit_preview_btn" tabindex="0" aria-label="Close QR Scanner">X</button>
      <qrcode-stream id="video_preview" @decode="checkForQRMatch"></qrcode-stream>
    </div>
    <div id="table-header">
      <button v-if="lecture && lecture.meeting_link" @click="joinMeeting()" class="header-btn btn btn-primary" title="Join Meeting">
        Join Meeting
      </button>
			<button v-if="screen_scanning" @click="handleStopScreenScan()" class="header-btn btn btn-primary" title="Stop Scanning" :style="{fontSize: '2rem', height: '72.75px', width: '72.75px'}">
        🛑
      </button>
      <button v-else-if="lectureIsOngoing()" @click="handleStartScreenScan()" class="header-btn btn btn-primary" title="Scan QR">
        <img class="svg-color" src="@/assets/venue-qr-code.svg" width="60" alt="QR Code" aria-label="QR Code">
      </button>
      <router-link class="header-btn btn btn-secondary" v-else-if="canWatchRecording()" :to="{name: 'lecture_playback', params: { lecture_id: lecture._id }}">
        <img class="svg-color" src="@/assets/venue-video-icon.svg" width="60" alt="Video" aria-label="Video" title="Watch Recording">
      </router-link>
    </div>
    <LectureAttendanceTable :is_instructor="false" :lecture="lecture" :submissions="[submission]" />
    <AnswerPoll v-if="answering_poll" :poll="current_poll" @answer="handleAnswerPoll" @cancel="handleCancelPoll"/>
		<video v-if="screen_stream" id="captured-screen" autoplay :style="{display: 'none'}"></video>
  </div>
</template>


<script>
  import LectureSubmissionAPI from '@/services/LectureSubmissionAPI.js';

  import { QrcodeStream } from 'vue-qrcode-reader';
  import LectureAttendanceTable from "@/components/LectureAttendanceTable.vue";
  import AnswerPoll from '@/components/AnswerPoll.vue';

	import QrCode from 'qrcode-reader'

  export default {
    name: 'StudentLectureAttendanceContainer',
    props: {
      lecture: Object,
      submission: Object,
      polls: Array
    },
    components: {
      QrcodeStream,
      LectureAttendanceTable,
      AnswerPoll
    },
    data(){
      return {
        camera_scanning_window_open: false,
        student_can_submit_live: false,
        student_can_watch_playback: false,
        answering_poll: false,
        current_poll: null,
        current_code: "",
				screen_stream: null,
				screen_scanner: null,
				screen_scanning: false,
				canvas: null
      }
    },
    created() {
      this.lectureIsOngoing()
    },
    methods: {
      lectureIsOngoing() {
        let now = Date.now()
        return (this.lecture.start_time && Date.parse(this.lecture.start_time) <= now && Date.parse(this.lecture.end_time) >= now)
      },
      canWatchRecording() {
        return (this.lecture.playback_submission_start_time && Date.parse(this.lecture.playback_submission_start_time) < Date.now())
      },
      lectureIsOver() {
        let now = Date.now()
				return (!this.lecture.end_time || Date.parse(this.lecture.end_time) < now)
			},
      getPollForCheckin(code) {
        return this.polls.find(a => a.code === code)
      },
      getValidUrl(url="") {
        let newUrl = window.decodeURIComponent(url);
        newUrl = newUrl.trim().replace(/\s/g, "");
        if(/^(:\/\/)/.test(newUrl)){
            return `http${newUrl}`;
        }
        if(!/^(f|ht)tps?:\/\//i.test(newUrl)){
            return `http://${newUrl}`;
        }
        return newUrl;
      },
      joinMeeting() {
        window.open(this.getValidUrl(this.lecture.meeting_link),'_blank');
      },
      checkForQRMatch(scanned_str) {
        this.camera_scanning_window_open = false
        this.lecture.checkins.forEach(checkin => {
          if(checkin.code === scanned_str) {
            if(!this.studentSubmittedToCheckin(checkin)) {
              this.current_code = scanned_str
              this.current_poll = this.getPollForCheckin(scanned_str)
              if(this.current_poll) {
                this.answering_poll = true
              } else {
                this.createLiveSubmission()
              }
            } else {
              alert("Already submitted for this check-in")
							this.handleStopScreenScan()
            }
          }
        })
      },
      handleStartScreenScan() {
				let self = this
				if(navigator && navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
					navigator.mediaDevices.getDisplayMedia({video: true}).then(res => {
						if(res) {
							this.screen_scanning = true
							this.screen_stream = res
							this.canvas = document.createElement('canvas')
							this.$nextTick(function() {
								let video = document.getElementById('captured-screen')
								video.srcObject = self.screen_stream
								self.screen_scanner = setInterval(function(){ //check for qrcode ...
									if(self.screen_stream) {
										const videoTrack = video.srcObject.getVideoTracks()[0];
										const { height, width } = videoTrack.getSettings();
										self.canvas.width = width
										self.canvas.height = height
										self.canvas.getContext('2d').drawImage(video, 0, 0, width, height);

										var qr = new QrCode();
										qr.callback = function(err, value) {
											if (!err) {
												self.checkForQRMatch(value.result)
											}
										};
										qr.decode(self.canvas.getContext('2d').getImageData(0, 0, width, height));
									} else {
										self.handleStopScreenScan()
									}
								},1000) //... every second
							})
						} else {
							this.camera_scanning_window_open = true
						}
					}).catch(err => { this.camera_scanning_window_open = true })
				} else {
					this.camera_scanning_window_open = true
				}
      },
			handleStopScreenScan() {
				this.screen_scanning = false
				clearInterval(this.screen_scanner)
				this.screen_stream.getTracks()
  				.forEach(track => track.stop())
				this.screen_stream = null
				this.screen_scanner = null
				this.canvas = null
			},
			async createLiveSubmission() {
        if(!this.submission.live_progress) {
          this.submission.live_progress = 0
        }
        this.submission.live_progress++
        this.submission.live_percent = this.submission.live_progress / this.lecture.checkins.length
        this.submission.live_submission_time = new Date()
        this.submission.codes.push(this.current_code)
        this.current_code = ""
        const response = await LectureSubmissionAPI.update(this.submission)
        alert("Live Submission Recorded")
        location.reload();
      },
      studentSubmittedToCheckin(checkin) {
        if(this.submission.codes) {
          return this.submission.codes.includes(checkin.code)
        } else {
          return false
        }
      },
      handleAnswerPoll(student_answers,code) {
        if(!this.submission.student_poll_answers) {
          this.submission.student_poll_answers = {}
        }
        this.submission.student_poll_answers[code] = student_answers
        this.current_poll = null
        this.answering_poll = false
        this.createLiveSubmission()
      },
      handleCancelPoll() {
        this.current_poll = null
        this.answering_poll = false
      }
    }
  }
</script>

<style scoped>
  #table-header {
    position: relative;
    top: 1.5rem;
    bottom: 0;
    text-align: left;
    /* padding-left: 5rem;
    padding-right: 5rem; */
  }

  #table-header h2 {
    display: inline-block;
  }

  .header-btn {
    display: inline-block;
    margin-right: 0.75rem;
    min-height: calc(60px + .75rem);
    padding: .375rem .375rem;
		border-radius: 0.25rem;
  }

  .show-qr-btn {
    margin-left: 2rem;
  }

  .tab_btn h5 {
    color: var(--button-tab-text);
  }

  .tab_btn.selected_tab {
    color: var(--button-tab);
    border-bottom: .2rem solid var(--button-tab);
  }

  .tab_btn.selected_tab h5 {
    color: var(--button-tab);
  }

  .tab_section {
    margin-top: 3rem;
    overflow-y: auto;
    height: 17rem;
    padding-bottom: 3rem;
  }

  .namecard-edging {
    display: inline-block;
    border-radius: .25rem;
    width: 12rem;
    height: 4rem;
    margin-right: 1rem;
    margin-bottom: 1rem;
  }

  .namecard-edging.live-color {
    background: var(--green-pill);
  }

  .namecard-edging.playback-color {
    background: var(--recording-namecard);
  }

  .namecard-edging.absent-color {
    background: var(--red-pill);
  }

  .namecard {
    position: relative;
    background: var(--course-card-background);
    text-align: center;
    border-radius: .25rem;
    top: 0.5rem;
    margin-left: 0.5rem;
    width: 11rem;
    height: 4rem;
    box-shadow: 0px 3px 3px 0px var(--course-card-shadow);
    padding-top: 0.5rem;
    z-index: 100;
  }

  .hidden {
    display: none;
  }

  #qr-scanning-container {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 999;
    background-color: white;
  }
</style>