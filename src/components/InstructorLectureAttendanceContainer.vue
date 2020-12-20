<template>
	<div>
		<div v-if="current_checkin" id="qr_modal">
			<qrcode id="qr_canvas" v-bind:value="current_checkin.code" :options="{ width: 400 }"></qrcode>
			<video id="qr_video" class="video-js vjs-big-play-centered" controls>
				<source v-bind:src="stream" type="">
			</video>
		  <button class="btn btn-secondary" id="close_qr_btn" @click="hideQR" aria-label="Hide QR">Hide</button>
		</div>
		<div id="container-header">
			<!-- Pre-set/Random Checkins -->
			<button v-if="lecture && lecture.meeting_link" @click="joinMeeting()" class="header-btn btn btn-primary" title="Join Meeting">
				Join Meeting
			</button>
			<div v-for="(checkin,i) in lecture.checkins" :key="i" class="inline-block">
				<button v-if="checkin.activation != 'Manual Activation' && checkinIsOpen(checkin)" type="button" class="header-btn btn btn-secondary" @click="showQR(i)">
					<img class="svg-color" src="@/assets/venue-qr-code.svg" width="60" alt="QR Code" aria-label="QR Code">
				</button>
			</div>
			<button class="header-btn btn btn-primary" v-if="!lectureIsOver()" @click="handleEndEarly">End Now</button>
			<LectureUploadModal v-if="lectureIsOver() && !lecture.allow_playback_submissions && polls_loaded" :lecture="lecture" :need_timestamp="polls" :update_lecture="true" />
			<router-link class="header-btn btn btn-secondary" v-else-if="lecture.allow_playback_submissions" title="Watch Recording" :to="{name: 'lecture_playback', params: { lecture_id: lecture._id }}" aria-label="Watch Recording">
				<img class="svg-color" src="@/assets/venue-video-icon.svg" width="60" alt="Video" aria-label="Video">
			</router-link>
			<button class="header-btn btn btn-primary" @click="download_submitty_csv" id="submitty_export" title="CSV Export">
				<img class="svg-color" src="@/assets/venue-database-export.svg" width="60" alt="QR Code" aria-label="QR Code">
			</button>
			<!-- Manual Checkins -->
			<div class="float-right" v-for="(checkin,i) in lecture.checkins" :key="'Live'+i">
				<button v-if="checkin.activation == 'Manual Activation'" class="btn btn-secondary manualbtn" @click="showQR(i)">Open Check-in {{i+1}}</button>
			</div>
	  	</div>
	  	<LectureAttendanceTable v-if="polls_loaded" :is_instructor="true" :lecture="lecture" :submissions="submissions" :all_students="all_students" :polls="polls"/>
	</div>
</template>


<script>
import LectureUploadModal from "@/components/LectureUploadModal";
import LectureAttendanceTable from "@/components/LectureAttendanceTable.vue";
import LectureAPI from '@/services/LectureAPI.js';
import LectureSubmissionAPI from "@/services/LectureSubmissionAPI.js"
import SectionAPI from '@/services/SectionAPI.js'
import PlaybackPollAPI from '@/services/PlaybackPollAPI';

import qrcode from '@chenfengyuan/vue-qrcode';

export default {
	name: 'InstructorLectureAttendanceContainer',
	props: {
		lecture: Object,
		submissions: Array,
		all_students: Array,
	},
	components: {
		LectureUploadModal,
		LectureAttendanceTable,
		qrcode
	},
	data(){
		return {
			modal_open: false,
			lecture_has_checkin: false,
			manual_checkins: [],
			current_checkin: null,
			polls: [],
			polls_loaded: false,
			vjs: null,
			stream: null
		}
	},
	created() {
		this.manual_checkins = this.getManualCheckins()
		PlaybackPollAPI.getByLecture(this.lecture._id)
		.then(res => {
			this.polls = res.data
			this.polls_loaded = true
		})
	},
	methods: {
		showQR(i) {
			this.current_checkin = this.lecture.checkins[i]
			this.$nextTick(function() {
				let canvas = document.getElementById('qr_canvas')
				let video = document.getElementById('qr_video')
				video.hidden = true

				if(document.pictureInPictureEnabled && !video.disablePictureInPicture && !document.pictureInPictureElement) {
					let self = this
					this.stream = canvas.captureStream()
					this.$nextTick(function() {
						video.srcObject = self.stream
						video.play()
						video.addEventListener('loadedmetadata',function() {
							if(document.pictureInPictureEnabled && !video.disablePictureInPicture && !document.pictureInPictureElement) {
								video.requestPictureInPicture()
								if(self.lecture.checkins[i].end_time && (Date.parse(self.lecture.checkins[i].end_time) - Date.now()) > 0) {
									setTimeout(function() {
										if(document.pictureInPictureEnabled && !video.disablePictureInPicture && document.pictureInPictureElement) {
											document.exitPictureInPicture();
										}
										location.reload()
									},(Date.parse(self.lecture.checkins[i].end_time) - Date.now()))
								}
							}
						})
					})
				} else if (video.webkitSupportsPresentationMode && typeof video.webkitSetPresentationMode === "function") {
					video.webkitSetPresentationMode(video.webkitPresentationMode === "picture-in-picture" ? "inline" : "picture-in-picture");
				}
			})
		},
		hideQR() {
			this.current_checkin = null
		},
		checkinIsOpen(checkin) {
			let now = new Date()
			return (Date.parse(checkin.start_time) <= now && Date.parse(checkin.end_time) >= now)
		},
		lectureIsOver() {
			return (!this.lecture.end_time || Date.parse(this.lecture.end_time) < Date.now())
		},
		getManualCheckins() {
			return this.lecture.checkins.filter(a => a.activation == 'Manual Activation')
		},
		manuallyOpenCheckin(i) {
			this.lecture.manual_checkin = this.lecture.checkins[i]
		},
		download_submitty_csv() {
			let data = []

			SectionAPI.getSectionsForCourse(this.lecture.sections[0].course._id)
			.then(res => {
				let course_sections = res.data
				let self = this
				let lecture_sections = this.lecture.sections.map(a=>a._id)
				this.all_students.forEach(function(student) {
					course_sections.filter(a=>lecture_sections.includes(a._id)).forEach(function(section) {
						if(section.students.includes(student.email)) {
							let stud_data = []

							let submission = self.submissions.find(a => a.submitter._id == student._id)

							let percent = 0;
							if(submission && submission.live_percent && submission.video_percent) {
								percent = Math.max(submission.live_percent,submission.video_percent)
							} else if(submission && submission.live_percent) {
								percent = submission.live_percent
							} else if(submission && submission.video_percent) {
								percent = submission.video_percent
							}

							if(submission && percent == submission.live_percent) {
								stud_data.push(submission.live_submission_time)
								stud_data.push(student.user_id)
								stud_data.push(student.first_name)
								stud_data.push(student.last_name)
								stud_data.push(section.name)
								stud_data.push("Live")
								stud_data.push(percent)
							} else if(submission && percent == submission.video_percent) {
								stud_data.push(submission.playback_submission_time)
								stud_data.push(student.user_id)
								stud_data.push(student.first_name)
								stud_data.push(student.last_name)
								stud_data.push(section.name)
								stud_data.push("Recording")
								stud_data.push(percent)
							} else {
								stud_data.push(null)
								stud_data.push(student.user_id)
								stud_data.push(student.first_name)
								stud_data.push(student.last_name)
								stud_data.push(section.name)
								stud_data.push(null)
								stud_data.push(0)
							}

							if(submission && submission.student_poll_answers) {
								let pollsum = 0
								stud_data.push(Object.keys(submission.student_poll_answers).length / self.polls.length)
								self.polls.forEach( poll => {
									if(poll.code && submission.student_poll_answers[poll.code]) {
										console.log('here')
										let answers = submission.student_poll_answers[poll.code]
										if(answers.every(a => poll.correct_answers.includes(a)) && answers.length == poll.correct_answers.length) {
											pollsum+=1
										}
									} else if(poll.timestamp && submission.student_poll_answers[poll.timestamp]) {
										console.log('here')
										let answers = submission.student_poll_answers[poll.timestamp]
										if(answers.every(a => poll.correct_answers.includes(a)) && answers.length == poll.correct_answers.length) {
											pollsum+=1
										}
									}
								})
								stud_data.push(pollsum / self.polls.length)

							} else {
								stud_data.push(0)
								stud_data.push(0)
							}
							
							data.push(stud_data)
						}
					})
				})

				let csv = 'Submission Timestamp,User ID,First Name,Last Name,Registration Section,Submission Type,Grade,Percent Questions Answered,Percent Questions Answered Correctly\n';
				data.forEach(function(row) {
					csv += row.join(',');
					csv += "\n";
				});

				let downloadname = this.lecture.sections[0].course.name + '_' + this.lecture.title + '_attendance.csv'

				var hiddenElement = document.createElement('a');
				hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
				hiddenElement.target = '_blank';
				hiddenElement.download = downloadname;
				hiddenElement.click();
			})
		},
		handleEndEarly() {
			LectureAPI.endEarly(this.lecture._id)
			.then(res => {
				location.reload()
			})
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
		}
	}
}
</script>

<style scoped>
	#qr_modal {
		position: fixed;
		top: 4rem;
		left: 0;
		right: 0;
		bottom: 2rem;
		z-index: 115;
		background-color: white;
	}

	.inline-block {
		display:inline-block;
	}

	#container-header {
	  position: relative;
	  top: 1.5rem;
	  bottom: 0;
	  text-align: left;
	}

	.row {
		margin: 0;
		width: 100%;
	}

	#container-header h2 {
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

	.tabs {
	  margin-top: 3rem;
	}

	.tab_btn {
	  background: none;
	  outline: none;
	  border: none;
	  color: var(--button-tab-text);
	  margin-right: 3rem;
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
	  color: var(--course-card-text);
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

	.manualbtn {
		height: calc(60px + .75rem);
		border-radius: 0.25rem;
	}

</style>