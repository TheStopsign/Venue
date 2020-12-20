<template>
	<div id="lecture-attendance-table">

		<div class="tabs">

			<button v-if="all_students" id="live_btn" class="tab_btn" tabindex="0" @click="selectTab(0)" aria-label="Show Live Attendance"
				role="tab" aria-selected="true" aria-controls="live_submit">
				<div id="live-progress-bar" :style="{width: live_percent * 100 + '%'}" class="progress-bar">
					<h5>Live - {{(live_percent*100).toFixedDecimals(1)}}%</h5>
				</div>
			</button>
			<button v-else id="live_btn" class="tab_btn" @click="selectTab(0)" tabindex="0" aria-label="Show Live Attendance"
				role="tab" aria-selected="true" aria-controls="live_submit">
				<div id="live-progress-bar" :style="{width: live_percent * 100 + '%'}" class="progress-bar">
					<h5>Synchronous - {{(live_percent*100).toFixedDecimals(1)}}%</h5>
				</div>
			</button>
			<div v-if="selected_tab === 0" role="tabpanel" aria-labelledby="live_btn" id="live_submit" class="tab_section">
				<LectureAttendanceList :is_instructor="is_instructor" :lecture="lecture" :submissions_with_live="submissions_with_live" :is_live="true" />
			</div>

			<button v-if="all_students" id="playback_btn" class="tab_btn" tabindex="0" @click="selectTab(1)" aria-label="Show Playback Attendance"
				role="tab" aria-selected="false" aria-controls="playback_submit">
				<div id="playback-progress-bar" :style="{width: playback_percent * 100 + '%'}" class="progress-bar">
					<h5>Recording - {{(playback_percent*100).toFixedDecimals(1)}}%</h5>
				</div>
			</button>
			<button v-else id="playback_btn" class="tab_btn" @click="selectTab(1)" tabindex="0" aria-label="Show Playback Attendance"
				role="tab" aria-selected="false" aria-controls="playback_submit">
				<div id="playback-progress-bar" :style="{width: playback_percent * 100 + '%'}" class="progress-bar">
					<h5>Asynchronous - {{(playback_percent*100).toFixedDecimals(1)}}%</h5>
				</div>
			</button>
			<div v-if="selected_tab === 1" role="tabpanel" aria-labelledby="playback_btn" id="playback_submit" class="tab_section">
				<LectureAttendanceList :is_instructor="is_instructor" :lecture="lecture" :submissions_with_playback="submissions_with_playback" :is_playback="true" />
			</div>

			<button v-if="all_students" id="absent_btn" class="tab_btn" tabindex="0" @click="selectTab(2)" aria-label="Show Absent"
				role="tab" aria-selected="false" aria-controls="no_submit">
				<div id="absent-progress-bar" :style="{width: absent_percent * 100 + '%'}" class="progress-bar">
					<h5>Absent - {{(submissions_with_nothing.length/all_students.length*100).toFixedDecimals(1)}}%</h5>
				</div>
			</button>
			<button v-else id="absent_btn" class="tab_btn" @click="selectTab(2)" tabindex="0" aria-label="Show Absent"
				role="tab" aria-selected="false" aria-controls="no_submit">
				<div id="absent-progress-bar" :style="{width: absent_percent * 100 + '%'}" class="progress-bar">
					<h5>Absent - {{(absent_percent*100).toFixedDecimals(1)}}%</h5>
				</div>
			</button>
			<div v-if="selected_tab === 2" role="tabpanel" aria-labelledby="absent_btn" id="no_submit" class="tab_section">
				<LectureAttendanceList :is_instructor="is_instructor" :lecture="lecture" :submissions_with_nothing="submissions_with_nothing" :is_absent="true" />
			</div>

			<button v-if="all_students" id="instructors_only_btn" class="tab_btn" tabindex="0" @click="selectTab(3)" aria-label="Show Instructors Only"
				role="tab" aria-selected="false" aria-controls="instructors_only">
				<h5>Instructors Only</h5>
			</button>
			<div v-if="selected_tab === 3" role="tabpanel" aria-labelledby="instructors_only_btn" id="instructors_only" class="tab_section">
				<div class="override-container">
					<div v-if="sync_override_err_msg != ''" id="sync-override-err-msg">
						<p class="err-msg">{{sync_override_err_msg}}</p>
					</div>
					<div class="input-group">
						<label for="sync-rcs-ids" id="sync-override-label">Synchronous override:</label>
						<input id="sync-rcs-ids" type="text" v-model.lazy="sync_overrides" class="form-control" placeholder="eg: 'whitte3,mbizin'" aria-label="RCS IDs to override"/>
						<div class="input-group-append">
							<button style="border-radius: 0.5rem;" class="btn btn-primary" aria-label="Synchronous Submit Override" @click="handleSyncOverride">Override</button>
						</div>
					</div>
				</div>
				<div class="override-container">
					<div v-if="async_override_err_msg != ''" id="async-override-err-msg">
						<p class="err-msg">{{async_override_err_msg}}</p>
					</div>
					<div class="input-group">
						<label for="async-rcs-ids" id="async-override-label">Asynchronous override:</label>
						<input id="async-rcs-ids" type="text" v-model.lazy="async_overrides" class="form-control" placeholder="eg: 'whitte3,mbizin'" aria-label="RCS IDs to override"/>
						<div class="input-group-append">
							<button style="border-radius: 0.5rem;" class="btn btn-primary" aria-label="Asynchronous Submit Override" @click="handleAsyncOverride">Override</button>
						</div>
					</div>
				</div>
				<div class="row justify-content-center">
					<div id="table-container" v-if="lecture.checkins.length > 0">
						<label id="checkin-table-label">Check-in Windows</label>
						<table id="checkins-container" aria-labelledby="checkin-table-label">
							<thead>
								<tr>
									<th>Start Time</th>
									<th>End Time</th>
									<th>Timestamp</th>
									<th>Poll</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="(checkin,i) in lecture.checkins" :key="i">
									<td v-if="checkin.start_time">{{ getPrettyDateTime(new Date(checkin.start_time)) }}</td>
									<td v-else>Manual</td>
									<td v-if="checkin.end_time">{{ getPrettyDateTime(new Date(checkin.end_time)) }}</td>
									<td v-else>Manual</td>
									<td v-if="polls[i] && polls[i].timestamp">{{ polls[i].timestamp }}</td>
									<td v-else>X</td>
									<td v-if="polls[i]">
										<div id="edit-poll-modal-container" v-if="edit_poll_index != -1 && edit_poll_index == i">
											<div id="edit-poll-modal-contents">
												<CreatePoll :playback_only="false" :checkin="i" :poll="polls[i]" @cancel="handleCancelEditPoll" @addPoll="handleEditPoll"/>
											</div>
										</div>
										{{polls[i].question}}
										<button type="button" v-if="!checkin.start_time || (checkin.start_time && Date.parse(checkin.start_time) > Date.now())" class="btn btn-secondary" @click="edit_poll_index = i" :title="'Edit '+polls[i].question">
											<img class="svg-color" src="@/assets/venue-edit.svg" alt="Edit" width="40" aria-label="Edit">
										</button>
									</td>
									<td v-else>X</td>
								</tr>
							</tbody>
						</table>
					</div>
					<div id="table-container" v-else-if="polls.length > 0">
						<label id="checkin-table-label">Video Polls</label>
						<table id="checkins-container" aria-labelledby="checkin-table-label">
							<thead>
								<tr>
									<th>Seconds In</th>
									<th>Poll</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="(poll,i) in polls" :key="i">
									<td>{{poll.timestamp}}</td>
									<td>
										<div id="edit-poll-modal-container" v-if="edit_poll_index != -1 && edit_poll_index == i">
											<div id="edit-poll-modal-contents">
												<CreatePoll :playback_only="false" :checkin="i" :poll="polls[i]" @cancel="handleCancelEditPoll" @addPoll="handleEditPoll"/>
											</div>
										</div>
										{{polls[i].question}}
										<button type="button" v-if="Date.parse(lecture.playback_submission_start_time) > Date.now()" class="btn btn-secondary" @click="edit_poll_index = i" :title="'Edit '+polls[i].question">
											<img class="svg-color" src="@/assets/venue-edit.svg" alt="Edit" width="40" aria-label="Edit">
										</button>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>


<script>
import LectureSubmissionAPI from '@/services/LectureSubmissionAPI.js'
import PlaybackPollAPI from '@/services/PlaybackPollAPI'

import LectureAttendanceList from '@/components/LectureAttendanceList.vue'
import CreatePoll from '@/components/CreatePoll.vue'

export default {
	name: 'LectureAttendanceTable',
	props: {
	lecture: Object,
		submissions: Array,
		all_students: Array,
		is_instructor: Boolean,
		polls: Array
	},
	components: {
		LectureAttendanceList,
		CreatePoll
	},
	data(){
		return {
			selected_tab: -1,
			sync_overrides: "",
			sync_override_err_msg: "",
			async_overrides: "",
			async_override_err_msg: "",
			submissions_with_live: [],
			submissions_with_playback: [],
			submissions_with_nothing: [],
			live_percent: 0,
			playback_percent: 0,
			absent_percent: 0,
			edit_poll_index: -1
		}
	},
	created() {
		this.parseSubmissions()
	},
	methods: {
		parseSubmissions() {
			let livesum = 0
			let playsum = 0
			this.submissions.forEach(submission => {
				let hasAttendance = false
				if(submission.live_percent) {
					this.submissions_with_live.push(submission)
					hasAttendance = true
					livesum += submission.live_percent
				}
				if(submission.video_percent) {
					this.submissions_with_playback.push(submission)
					hasAttendance = true
					playsum += submission.video_percent
				}
				if(!hasAttendance) {
					this.submissions_with_nothing.push(submission)
				}
			})
			if(this.all_students && this.all_students.length) {
				this.live_percent = livesum / this.all_students.length
				this.playback_percent = playsum / this.all_students.length
				let submitted_student_ids = this.submissions.map(a=>a.submitter._id)
				this.all_students.forEach(stud => {
					if(!submitted_student_ids.includes(stud._id)) {
						this.submissions_with_nothing.push({
							lecture: this.lecture._id,
							submitter: stud
						})
					}
				})
				this.absent_percent = this.submissions_with_nothing.length / this.all_students.length
			} else {
				this.live_percent = livesum
				this.playback_percent = playsum
				this.absent_percent = 1 - Math.max(livesum,playsum)
			}
		},
		selectTab(i) {
			let btns = [
				document.getElementById("live_btn"),
				document.getElementById("playback_btn"),
				document.getElementById("absent_btn")
			]
			if(this.all_students) {
				btns.push(document.getElementById("instructors_only_btn"))
			}
			for(let j=0;j<btns.length;j++) {
				if(j==i) {
					if(i == this.selected_tab) {
						btns[j].classList.remove("selected_tab")
						btns[j].setAttribute("aria-selected","false")
						i = -1
						break
					} else {
						btns[j].classList.add("selected_tab")
						btns[j].setAttribute("aria-selected","true")
					}
				} else {
					btns[j].classList.remove("selected_tab")
					btns[j].setAttribute("aria-selected","false")
				}
			}
			this.selected_tab = i
		},
		handleSyncOverride() {
			let rcs_list = this.sync_overrides.replace(/\s/g,'').split(",")
			if(rcs_list.length == 1 && rcs_list[0]=="") {
				this.sync_overrides = ""
				this.sync_override_err_msg = "Empty"
			} else {
				LectureSubmissionAPI.addLiveSubmissionByRCS(rcs_list,this.lecture._id)
				.then(res => {
					if(res.data.length == 0) {
						this.sync_overrides = ""
						this.sync_override_err_msg = ""
					} else {
						this.sync_overrides = res.data.join(",")
						this.sync_override_err_msg = "Remaining are invalid"
					}
				})
			}
		},
		handleAsyncOverride() {
			let rcs_list = this.async_overrides.replace(/\s/g,'').split(",")
			if(rcs_list.length == 1 && rcs_list[0]=="") {
				this.async_overrides = ""
				this.async_override_err_msg = "Empty"
			} else {
				LectureSubmissionAPI.addPlaybackSubmissionByRCS(rcs_list,this.lecture._id)
				.then(res => {
					if(res.data.length == 0) {
						this.async_overrides = ""
						this.async_override_err_msg = ""
					} else {
						this.async_overrides = res.data.join(",")
						this.async_override_err_msg = "Remaining are invalid"
					}
				})
			}
		},
		getPrettyDateTime(datetime) {
			if("Invalid Date" == datetime) {
				return ("Not set")
			}
			let hours = datetime.getHours()
			let minutes = datetime.getMinutes()
			if(minutes < 10) {
				minutes = "0" + minutes
			}
			if(hours < 12) {
				return ((datetime.getMonth()+1) + "/" + (datetime.getDate()) + "/" + (datetime.getFullYear()) + " " + (hours==0 ? "12" : hours) + ":" + minutes + " AM")
			} else {
				return ((datetime.getMonth()+1) + "/" + (datetime.getDate()) + "/" + (datetime.getFullYear()) + " " + (hours==12 ? hours : hours-12) + ":" + minutes + " PM")
			}
		},
		handleCancelEditPoll() {
			this.edit_poll_index = -1
		},
		handleEditPoll(poll) {
			PlaybackPollAPI.update(poll).then(res => {location.reload()})
		}
	}
}
</script>

<style scoped>

	:root {

		--lecture-attendance-button-text: #636363;

		--lecture-attendance-grey-pill: rgb(110, 110, 110);
		--lecture-attendance-grey-shadow: rgba(109, 109, 109, 0.644);
		--lecture-attendance-text: white;

		--lecture-attendance-live-glow: rgba(65, 162, 91, 0.33);
		--lecture-attendance-async-glow:  rgba(214, 71, 233, 0.36);
		--lecture-attendace-absent-glow: rgba(255, 99, 88, 0.36);
	}

	.input-group {
		width: auto;
		top: 0px;
		padding-right: 10px;
	} 

	#lecture-attendance-table {
		margin-top: 3rem;
		text-align: start;
	}

	#edit-poll-modal-container {
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background: var(--modal-container-background);
	}

	#edit-poll-modal-contents {
		position: fixed;
		top: 25%;
		bottom: 25%;
		left: 25%;
		right: 25%;
		background: var(--modal-background);
		border: 1px solid var(--modal-border);
		padding: 1rem;
		border-radius: 1rem;
	}

	.tabs {
	}

	.tab_btn {
	  background: none;
	  outline: none;
	  border: none;
	  color: var(--lecture-attendance-button-text);
	  /* margin-right: 3rem; */
	  width: 100%;
	  padding: 0;
	  background: var(--lecture-attendance-grey-pill); 
	  margin: 0.5rem 0rem;
	  border-radius: 0.25rem;
	  box-shadow: 0px 3px 3px 0px var(--lecture-attendance-grey-shadow); 
	}

	.progress-bar {
		background: none;
		width: 0%;
		text-align: left;
		overflow: visible;
		border-radius: 0.25rem;
	}

	#live-progress-bar {
		background: var(--green-pill);
		transition: width 0s linear;
	}

	#playback-progress-bar {
		background: var(--lecture-playback);
		transition: width 0s linear;
	}

	#absent-progress-bar {
		background: var(--red-pill);
		transition: width 0s linear;
	}

	.tab_btn h5 {
	  margin: 0;
	  font-size: 1.5rem;
	  margin: 0.5rem 1rem;
	  color: var(--lecture-attendance-text);
	}

	#live_btn:hover,
	#live_btn:focus,
	#live_btn.selected_tab {
		box-shadow: 0px 0px 10px 7px var(--lecture-attendance-live-glow);
	}

	#playback_btn:hover,
	#playback_btn:focus,
	#playback_btn.selected_tab {
		box-shadow: 0px 0px 10px 7px var(--lecture-attendance-async-glow);
	}

	#absent_btn:hover,
	#absent_btn:focus
	#absent_btn.selected_tab {
		box-shadow: 0px 0px 10px 7px var(--lecture-attendance-absent-glow);
	}
	

	.tab_btn.selected_tab:hover,
	.tab_btn.selected_tab:focus {
	}

	.tab_btn.selected_tab:hover h5,
	.tab_btn.selected_tab:focus h5 {
	}

	#stats_btn {

	}

	.tab_section {
		text-align: center;
	  margin-top: 3rem;
	  overflow-y: auto;
	  padding-bottom: 3rem;
	}

	.row,
	.col {
		margin: 0;
		padding: 0;
		margin-top: 2rem;
	}

	#rcs-ids {
		height: 100%;
	}

	#sync-override-label {
		margin: auto 1rem;
		font-size: 1.2rem;
	}
	#async-override-label {
		margin: auto 1rem;
		font-size: 1.2rem;
	}

	.override-row {
		height: 2rem;
	}

	.override-container {
		position: relative;
		padding-top: 10px;
		bottom: 10px;
		display: flex;
		height: auto;
	}

	#sync-override-err-msg {
		color: var(--error);
		padding: 0.5rem;
	}
	#async-override-err-msg {
		color: var(--error);
		padding: 0.5rem;
	}

	#checkins-section {
		display: inline-block;
	}

	table, th, td {
		border: 1px solid var(--main-text-color);
		padding: 0.5rem;
	}

	th {
		font-weight: 900;
	}

	#instructors_only {
		/* max-width: 70%; */
		margin: 0 auto;
		margin-top: 2rem;
	}

	#stats {
		margin: 0;
		padding: 0;
	}
</style>