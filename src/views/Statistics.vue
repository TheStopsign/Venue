<template>
	<div id="stats-container">
		<div id="stats-left">
			<div id="side-panel" class="stats-panel">
				<div class="row side-panel-section justify-content-end" v-if="courses.all.length > 0">
					<div class="col selector-label">
						Course:
					</div>
					<MultiSelectDropdown id="course-selector" :options="courses.all" sortBy="name" @update="handleCourseChange" :max="1" :n="0" ref="courseSelector"/>
				</div>
				<div class="row side-panel-section justify-content-end" v-if="sections.filtered.length > 0">
					<div class="col selector-label">
						Sections:
					</div>
					<MultiSelectDropdown id="sections-selector" :options="sections.filtered" sortBy="name" @update="handleSectionsChange" :n="1" ref="sectionsSelector"/>
				</div>
				<div class="row side-panel-section justify-content-end" v-if="lectures.filtered.length > 0">
					<div class="selector-label">
						Lectures:
					</div>
					<MultiSelectDropdown id="lectures-selector" :options="lectures.filtered" sortBy="title" @update="handleLecturesChange" :n="2" ref="lecturesSelector"/>
				</div>
				<div class="row side-panel-section justify-content-end" v-if="students.filtered.length > 0">
					<div class="col selector-label">
						Students:
					</div>
					<MultiSelectDropdown id="students-selector" :options="students.filtered" sortBy="last_name" :displayAs="['last_name','first_name']" @update="handleStudentsChange" :n="3" ref="studentsSelector"/>
				</div>
			</div>
		</div>
		<div id="stats-right">
			<div id="stats-right-top">
				<div id="top-panel" class="stats-panel">
					<ToggleSwitch :class="(lectures.active.length != 1 && courses.active?'':'hidden')" label="Cumulative" :start="stacked" @toggle="handleToggleStacked"/>
					<ToggleSwitch :class="(lectures.active.length == 1 && courses.active?'':'hidden')" label="Half" :start="half" :disabled="polls" @toggle="handleToggleHalf"/>
					<ToggleSwitch :class="(lectures.active.length > 0 && courses.active?'':'hidden')" label="Polls" :start="polls" @toggle="handleTogglePolls"/>
				</div>
			</div>
			<div id="stats-right-bottom">
				<div id="stats-render">
					<div v-if="lectures.active.length > 0 && polls">
						<canvas v-for="(poll,i) in playbackPolls.displayed" :id="'pollsChart_'+i" :key="i"></canvas>
					</div>
					<div v-else-if="lectures.active.length > 0">
						<canvas id="lectureChart"></canvas>
					</div>
					<div v-else-if="sections.active.length > 0">
						<canvas v-for="section in sections.active" :id="'sectionChart_'+section.name" :key="section.name"></canvas>
					</div>
					<canvas v-else-if="courses.active" id="courseChart"></canvas>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import CourseAPI from '@/services/CourseAPI.js'
import SectionAPI from '@/services/SectionAPI.js'
import LectureAPI from '@/services/LectureAPI.js'
import UserAPI from '@/services/UserAPI.js'
import LectureSubmissionAPI from '@/services/LectureSubmissionAPI.js'
import PlaybackPollAPI from '@/services/PlaybackPollAPI.js'

import chartjs from 'chart.js'

import MultiSelectDropdown from '@/components/MultiSelectDropdown.vue'
import ToggleSwitch from '@/components/ToggleSwitch.vue'

export default {
	name: 'Statistics',
	props: {
	},
	computed: {
	},
	components: {
		MultiSelectDropdown,
		ToggleSwitch
	},
	data(){
		return {
			current_user: null,
			courses: {
				all: [],
				active: null //selected from dropdown
			},
			sections: {
				all: [],
				filtered: [], //for course
				active: [] //selected from dropdown
			},
			lectures: {
				all: [],
				filtered: [], //for sections/course
				active: [] //selected from dropdown
			},
			students: {
				all: [],
				filtered: [], //for lectures/sections/course
				active: [] //selected from dropdown
			},
			lectureSubmissions: {
				all: [],
				filtered: [] //for lectures/sections/course
			},
			playbackPolls: {
				all: [],
				displayed: []
			},
			colors: {
				green: { fill: '#bfffc6', stroke: '#04dd74' },
				blue: { fill: '#92bed2', stroke: '#3282bf' },
				red: { fill: '#ff8787', stroke: '#e95454' },
				text: 'grey'
			},
			charts: [],
			stacked: true,
			half: true,
			polls: false,
			pieLabel: 0
		}
	},
	created() {
		this.current_user = this.$store.state.user.current_user;
		this.getColors();
		this.fetchData()
	},
	methods: {
		getColors() {

			var live_border = new Color();
      		var live_fill = new Color();
      		var playback_border = new Color();
      		var playback_fill = new Color();
			var absent_border = new Color(); 
			var absent_fill = new Color(); 

			var text_color = new Color();

			let root = document.documentElement;

			live_border = getComputedStyle(root).getPropertyValue('--stats-live-border');
      		live_fill = getComputedStyle(root).getPropertyValue('--stats-live-fill');
	  		playback_border = getComputedStyle(root).getPropertyValue('--stats-playback-border');
	  		playback_fill = getComputedStyle(root).getPropertyValue('--stats-playback-fill');
      		absent_border = getComputedStyle(root).getPropertyValue('--stats-absent-border');
			absent_fill = getComputedStyle(root).getPropertyValue('--stats-absent-fill');

			text_color = getComputedStyle(root).getPropertyValue('--main-text-color');
			  
			this.colors.green = { fill: live_fill, stroke: live_border },
			this.colors.blue = { fill: playback_fill, stroke: playback_border },
			this.colors.red = { fill: absent_fill, stroke: absent_border },

			this.text = text_color
			
		},
		fetchData() {
			CourseAPI.getInstructorCourses(this.current_user._id)
			.then(res => {
				this.courses.all = res.data
				let allStudents = []
				this.courses.all.forEach(course => {
					SectionAPI.getSectionsForCourse(course._id)
					.then(res2 => {
						this.sections.all = this.sections.all.concat(res2.data)
					})
					allStudents = allStudents.concat(new Promise((resolve,reject) => {
						UserAPI.getStudentsForCourse(course._id)
						.then(res2 => {
							let students = []
							res2.data.forEach(student => {
								students.push(new Promise((resolve2,reject2) => {
									resolve2(student)
								}))
							})
							Promise.all(students).then(resolved => {
								resolve(resolved)
							})
						})
					}))
				})
				Promise.all(allStudents).then(resolved => {
					this.students.all = ([].concat.apply([], resolved)).uniqueByProp("_id")
				})
			})
			LectureAPI.getLecturesForUser(this.current_user._id,'none')
			.then(res => {
				this.lectures.all = res.data
				let all_submissions = []
				let all_playbackpolls = []
				this.lectures.all.forEach(lecture => {
					all_submissions = all_submissions.concat(new Promise((resolve,reject) => {
						LectureSubmissionAPI.getLectureSubmissionsForLecture(lecture._id)
						.then(res => {
							let submissions = []
							res.data.forEach(lectSub => {
								submissions.push(new Promise((resolve2,reject2) => {
									resolve2(lectSub)
								}))
							})
							Promise.all(submissions).then(resolved => {
								resolve(resolved)
							})
						})
					}))
					all_playbackpolls = all_playbackpolls.concat(new Promise((resolve,reject) => {
						PlaybackPollAPI.getByLecture(lecture._id)
						.then(res => {
							let polls = []
							res.data.forEach(poll => {
								polls.push(new Promise((resolve2,reject2) => {
									resolve2(poll)
								}))
							})
							Promise.all(polls).then(resolved => {
								this.playbackPolls[lecture._id] = resolved
								resolve(resolved)
							})
						})
					}))
				})
				Promise.all(all_submissions).then(resolved => {
					this.lectureSubmissions.all = [].concat.apply([], resolved)
				})
				Promise.all(all_playbackpolls).then(resolved => {
					this.playbackPolls.all = [].concat.apply([], resolved)
				})
			})
		},
		setupCharts() {
			if(this.lectures.active.length > 0) {
				let currentSubmissions = {}
				let lecturesAttendance = {}
				this.lectures.active.forEach(lecture => {
					lecture.students = {}
					lecture.sections.forEach(sectID => {
						let section = this.sections.all.find(section => section._id == sectID)
						section.students.forEach(studEmail => {
							if(this.students.active.length > 0) {
								this.students.active.forEach(stud => {
									if(stud.email == studEmail) {
										lecture.students[studEmail] = {}
									}
								})
							} else {
								lecture.students[studEmail] = {}
							}
						})
					})
					let subsForLecture = this.lectureSubmissions.filtered.filter(a => a.lecture == lecture._id)
					subsForLecture.forEach(sub => {
						Object.keys(lecture.students).forEach(studEmail => {
							if(sub.submitter.email == studEmail) {
								lecture.students[studEmail] = sub
								if(undefined == currentSubmissions[studEmail]) {
									currentSubmissions[lecture._id] = []
								}
								currentSubmissions[lecture._id].push(sub)
							}
						})
					})
					if(Object.keys(lecture.students).length > 0) {
						let lectAttendance = this.getAttendanceForLecture(lecture)
						lecturesAttendance[lecture._id] = {
							obj: lecture,
							live: lectAttendance.live,
							playback: lectAttendance.playback,
							absent: lectAttendance.absent,
							date: null
						}
						if(lecture.start_time) {
							lecturesAttendance[lecture._id].date = lecture.start_time
						} else if(lecture.playback_submission_start_time) {
							lecturesAttendance[lecture._id].date = lecture.playback_submission_start_time
						}
					}
				})
				let lectIDs = Object.keys(lecturesAttendance)
				if(this.polls) {
					let data = this.processPollsData(currentSubmissions)
					Object.keys(data).forEach(lectID => {
						Object.keys(data[lectID]).forEach(subID => {
							this.playbackPolls.displayed.push(data[lectID][subID])
							this.$nextTick(function() {
								this.createHorBarsGraph({
									chartID: "pollsChart_"+data[lectID][subID].n,
									labels: data[lectID][subID].labels,
									counts: data[lectID][subID].counts,
									title: data[lectID][subID].question
								})
							})
						})
					})
				} else if(lectIDs.length == 1) {
					this.createPieGraph({
						chartID: "lectureChart",
						title: lecturesAttendance[lectIDs[0]].obj.title + " Attendance",
						live: lecturesAttendance[lectIDs[0]].live,
						playback: lecturesAttendance[lectIDs[0]].playback,
						absent: lecturesAttendance[lectIDs[0]].absent
					})
					this.pieLabel = 100 - lecturesAttendance[lectIDs[0]].absent
				} else {
					lectIDs.sort((a,b) => {
						(lecturesAttendance[a].obj.start_time > lecturesAttendance[b].obj.start_time ||
						lecturesAttendance[a].obj.playback_submission_start_time > lecturesAttendance[b].obj.playback_submission_start_time ||
						lecturesAttendance[a].obj.start_time > lecturesAttendance[b].obj.playback_submission_start_time ||
						lecturesAttendance[a].obj.playback_submission_start_time > lecturesAttendance[b].obj.start_time) ? 1 : -1}
					)
					let live = []
					let playback = []
					let absent = []
					let labels = []
					lectIDs.forEach(lectID => {
						live.push(lecturesAttendance[lectID].live)
						playback.push(lecturesAttendance[lectID].playback)
						absent.push(lecturesAttendance[lectID].absent)
						labels.push(lecturesAttendance[lectID].obj.title)
					})
					this.createBarsGraph({
						chartID: "lectureChart",
						title: "Lectures Attendance",
						live: live,
						playback: playback,
						absent: absent,
						labels: labels
					})
				}
			} else if(this.sections.active.length > 0) {
				let sections = {}
				this.sections.active.sort((a,b) => a.name > b.name ? 1 : -1)
				this.sections.active.forEach(section => {
					sections[section.name] = {
						live: [],
						playback: [],
						absent: [],
						dates: []
					}
					this.lectures.filtered.sort((a, b) => 
						(a.start_time > b.start_time || a.playback_submission_start_time > b.playback_submission_start_time ||
						a.start_time > b.playback_submission_start_time || a.playback_submission_start_time > b.start_time) ? 1 : -1
					)
					this.lectures.filtered.forEach(lecture => {
						if(lecture.sections.includes(section._id)) {
							lecture.students = {}
							lecture.sections.forEach(sectID => {
								let section = this.sections.all.find(section => section._id == sectID)
								section.students.forEach(studEmail => {
									if(this.students.active.length > 0) {
										this.students.active.forEach(stud => {
											if(stud.email == studEmail) {
												lecture.students[studEmail] = {}
											}
										})
									} else {
										lecture.students[studEmail] = {}
									}
								})
							})
							let subsForLecture = this.lectureSubmissions.filtered.filter(a => a.lecture == lecture._id)
							subsForLecture.forEach(sub => {
								Object.keys(lecture.students).forEach(studEmail => {
									if(sub.submitter.email == studEmail) {
										lecture.students[studEmail] = sub
									}
								})
							})
							if(Object.keys(lecture.students).length > 0) {
								let lectAttendance = this.getAttendanceForLecture(lecture)
								sections[section.name].live.push(lectAttendance.live)
								sections[section.name].playback.push(lectAttendance.playback)
								sections[section.name].absent.push(lectAttendance.absent)
								if(lecture.start_time) {
									sections[section.name].dates.push(lecture.start_time)
								} else if(lecture.playback_submission_start_time) {
									sections[section.name].dates.push(lecture.playback_submission_start_time)
								} else {
									sections[section.name].dates.push(null)
								}
							}
						}
					})
					this.createAreaGraph({
						chartID: "sectionChart_"+section.name,
						title: this.courses.active.name + " - Section " + section.name + " Attendance",
						live: sections[section.name].live,
						playback: sections[section.name].playback,
						absent: sections[section.name].absent,
						dates: sections[section.name].dates
					})
				})
			} else if(this.courses.active) {
				let live = []
				let playback = []
				let absent = []
				let dates = []
				this.lectures.filtered.sort((a, b) => 
					(a.start_time > b.start_time || a.playback_submission_start_time > b.playback_submission_start_time ||
					a.start_time > b.playback_submission_start_time || a.playback_submission_start_time > b.start_time) ? 1 : -1
				)
				this.lectures.filtered.forEach(lecture => {
					lecture.students = {}
					lecture.sections.forEach(sectID => {
						let section = this.sections.all.find(section => section._id == sectID)
						section.students.forEach(studEmail => {
							if(this.students.active.length > 0) {
								this.students.active.forEach(stud => {
									if(stud.email == studEmail) {
										lecture.students[studEmail] = {}
									}
								})
							} else {
								lecture.students[studEmail] = {}
							}
						})
					})
					let subsForLecture = this.lectureSubmissions.filtered.filter(a => a.lecture == lecture._id)
					subsForLecture.forEach(sub => {
						Object.keys(lecture.students).forEach(studEmail => {
							if(sub.submitter.email == studEmail) {
								lecture.students[studEmail] = sub
							}
						})
					})
					if(Object.keys(lecture.students).length > 0) {
						let lectAttendance = this.getAttendanceForLecture(lecture)
						live.push(lectAttendance.live)
						playback.push(lectAttendance.playback)
						absent.push(lectAttendance.absent)
						if(lecture.start_time) {
							dates.push(lecture.start_time)
						} else if(lecture.playback_submission_start_time) {
							dates.push(lecture.playback_submission_start_time)
						} else {
							dates.push(null)
						}
					}
				})
				this.createAreaGraph({
					chartID: "courseChart",
					title: this.courses.active.name + " Attendance",	
					live: live,
					playback: playback,
					absent: absent,
					dates: dates
				})
			}
		},
		getAttendanceForLecture(lecture) {	
			let lectureStudents = Object.keys(lecture.students)
			let lectureLive = 0
			let lecturePlayback = 0
			let lectureAbsent = 0
			lectureStudents.forEach(studEmail => {
				let studSubmission = lecture.students[studEmail]
				if(studSubmission.live_percent && studSubmission.video_percent) {
					let percentage = Math.max(studSubmission.live_percent, studSubmission.video_percent)
					if(studSubmission.live_percent  == percentage) {
						lectureLive += percentage * 100
					} else {
						lecturePlayback += percentage * 100
					}
					lectureAbsent += (1 - percentage) * 100
				} else if(studSubmission.live_percent) {
					lectureLive += studSubmission.live_percent * 100
					lectureAbsent += (1 - studSubmission.live_percent) * 100
				} else if(studSubmission.video_percent) {
					lecturePlayback += studSubmission.video_percent * 100
					lectureAbsent += (1 - studSubmission.video_percent) * 100
				} else {
					lectureAbsent += 100
				}
			})
			lectureLive /= lectureStudents.length
			lecturePlayback /= lectureStudents.length
			lectureAbsent /= lectureStudents.length
			return {
				live: lectureLive,
				playback: lecturePlayback,
				absent: lectureAbsent
			}
		},
		createPieGraph(chartInfo) {
			let ctx = document.getElementById(chartInfo.chartID).getContext('2d')
			this.charts.push(new Chart(ctx, {
				type: 'pie',
				data: {
					labels: ['Live', 'Playback', 'Absent'],
					datasets: [{
						data: [chartInfo.live,chartInfo.playback,chartInfo.absent],
						backgroundColor: [
							this.colors.green.fill,
							this.colors.blue.fill,
							this.colors.red.fill
						],
						borderColor: [
							this.colors.green.stroke,
							this.colors.blue.stroke,
							this.colors.red.stroke
						],
						borderWidth: 3
					}]
				},
				options: {
					title: {
						text: chartInfo.title,
						display: true,
						fontSize: 24,
						fontColor: this.text
					},
					legend: {
							labels: {
								fontColor: this.text
							}
					},
					cutoutPercentage: 65,
					responsive: true,
					rotation: (this.half ? 1*Math.PI : 1.5*Math.PI),
					circumference: (this.half ? 1*Math.PI : 2*Math.PI)
				}
			}))
		},
		createHorBarsGraph(chartInfo) {
			let ctx = document.getElementById(chartInfo.chartID).getContext('2d')
			this.charts.push(new Chart(ctx, {
				type: 'horizontalBar',
				data: {
					labels: chartInfo.labels,
					datasets: [{
						// label: chartInfo.question,
						data: chartInfo.counts,
						// backgroundColor: this.colors.green.fill,
						// borderColor: this.colors.green.stroke,
						borderWidth: 3
					}],
				},
				options: {
					title: {
						text: chartInfo.title,
						display: true,
						fontSize: 24,
						fontColor: this.text
					},
					tooltips: {
						displayColors: true,
						callbacks:{
							mode: 'x',
						},
					},
					legend: {
						display: false
					},
					scales: {
						xAxes: [{
							stacked: this.stacked,
							gridLines: {
								display: false,
							},
							ticks: {
								maxRotation: 90,
								minRotation: 80
							}
						}],
						yAxes: [{
							ticks: {
								beginAtZero: true
								// callback: function(value, index, values) {
								// 	return value+"%";
								// }
							}
						}]
					},
					responsive: true
				}
			}
			))
		},
		createBarsGraph(chartInfo) {
			let ctx = document.getElementById(chartInfo.chartID).getContext('2d')
			this.charts.push(new Chart(ctx, {
				type: 'bar',
				data: {
					labels: chartInfo.labels,
					datasets: [{
						label: 'Live',
						backgroundColor: this.colors.green.fill,
						borderColor: this.colors.green.stroke,
						borderWidth: 3,
						data: chartInfo.live,
					}, {
						label: 'Playback',
						backgroundColor: this.colors.blue.fill,
						borderColor: this.colors.blue.stroke,
						borderWidth: 3,
						data: chartInfo.playback,
					}, {
						label: 'Absent',
						backgroundColor: this.colors.red.fill,
						borderColor: this.colors.red.stroke,
						borderWidth: 3,
						data: chartInfo.absent,
					}],
				},
				options: {
					title: {
						text: chartInfo.title,
						display: true,
						fontSize: 24,
						fontColor: this.text
					},
					tooltips: {
						displayColors: true,
						callbacks:{
							mode: 'x',
						},
					},
					scales: {
						xAxes: [{
							stacked: this.stacked,
							gridLines: {
								display: false,
							},
							ticks: {
								fontColor: this.text
							},
							gridLines: {
								color: this.text
							}
						}],
						yAxes: [{
							stacked: this.stacked,
							ticks: {
								beginAtZero: true,
								fontColor: this.text
							},
							type: 'linear',
							ticks: {
								callback: function(value, index, values) {
									return value+"%";
								},
								fontColor: this.text
							},
							gridLines: {
								color: this.text
							}
						}],
					},
					legend: {
							labels: {
								fontColor: this.text
							}
						},
					responsive: true	
				}
			}
			))
		},
		createAreaGraph(chartInfo) {
			let self = this
			let ctx = document.getElementById(chartInfo.chartID).getContext('2d')
			this.charts.push(new Chart(ctx, {
				type: 'line',
				data: {
					labels: chartInfo.dates,
					datasets: [{
						label: "Live",
						fill: true,
						backgroundColor: this.colors.green.fill,
						pointBackgroundColor: this.colors.green.stroke,
						borderColor: this.colors.green.stroke,
						pointHighlightStroke: this.colors.green.stroke,
						borderCapStyle: 'butt',
						pointRadius: 5,
						pointHoverRadius: 10,
						data: chartInfo.live,
					}, {
						label: "Playback",
						fill: true,
						backgroundColor:this.colors.blue.fill,
						pointBackgroundColor: this.colors.blue.stroke,
						borderColor: this.colors.blue.stroke,
						pointHighlightStroke: this.colors.blue.stroke,
						borderCapStyle: 'butt',
						pointRadius: 5,
						pointHoverRadius: 10,
						data: chartInfo.playback,
					}, {
						label: "Absent",
						fill: true,
						backgroundColor: this.colors.red.fill,
						pointBackgroundColor: this.colors.red.stroke,
						borderColor: this.colors.red.stroke,
						pointHighlightStroke: this.colors.green.stroke,
						borderCapStyle: 'butt',
						pointRadius: 5,
						pointHoverRadius: 10,
						data: chartInfo.absent,
					}]
				},
				options: {
					responsive: true,
					title: {
						display: true,
						text: chartInfo.title,
						fontSize: 24,
						fontColor: this.text
					},
					scales: {
						yAxes: [{
							stacked: this.stacked,
							ticks: {
								callback: function(value, index, values) {
									return value+"%";
								},
								fontColor: this.text
							},
							gridLines: {
								color: this.text
							}							
						}],
						xAxes: [{
							ticks: {
								callback: function(value, index, values) {
									return self.getPrettyDateTime(value);
								},
								fontColor: this.text
							},
							gridLines: {
								color: this.text
							}
						}],
					},
					animation: {
						duration: 1000,
					},
					legend: {
						labels: {
							fontColor: this.text
						}
					}
				}
			}))
		},
		processPollsData(submissions) {
			let data = {}
			let n = 0
			Object.keys(submissions).forEach(lectID => { //for each lecture to be displayed
				if(undefined == data[lectID]) {
					data[lectID] = {}
				}
				this.playbackPolls[lectID].forEach((playbackPoll,i) => { //for each question per lecture
					if(undefined == data[lectID][playbackPoll._id]) {
						data[lectID][playbackPoll._id] = {
							labels: [],
							counts: [],
							question: playbackPoll.question,
							n: n
						}
						n++
					}
					submissions[lectID].forEach(submission => { //for each student
						Object.keys(submission.student_poll_answers).forEach(poll_retrieval => { //for each question answered
							if((playbackPoll.code && playbackPoll.code == poll_retrieval) || (playbackPoll.timestamp && playbackPoll.timestamp == poll_retrieval)) {
								let student_answers = []
								submission.student_poll_answers[poll_retrieval].forEach((is_marked,k) => { //for each marked option
									if(is_marked) {
										student_answers.push(playbackPoll.possible_answers[k])
									}
								})
								let stringified = student_answers.join(', ')
								let idx = data[lectID][playbackPoll._id].labels.findIndex(a => a == stringified)
								if(idx >= 0) {
									data[lectID][playbackPoll._id].counts[idx]++
								} else {
									data[lectID][playbackPoll._id].labels.push(stringified)
									data[lectID][playbackPoll._id].counts.push(1)
								}
							}
						})
					})
				})
			})
			return data
		},
		handleCourseChange(data) {
			this.clearCharts()
			this.playbackPolls.displayed = []
			this.students.active = []
			this.lectures.active = []
			this.sections.active = []
			this.courses.active = data[0]
			this.getSectionsForCourse(data[0])
			.then(sections => {
				if(undefined != this.sections.filtered && this.sections.filtered.length > 0) {
					this.$refs.sectionsSelector.repopulate(sections)
				}
				this.sections.filtered = sections
				this.execLecturesForSections(sections)
			})
		},
		handleSectionsChange(data) {
			this.clearCharts()
			this.playbackPolls.displayed = []
			this.students.active = []
			this.lectures.active = []
			this.sections.active = data
			this.execLecturesForSections(data)
		},
		handleLecturesChange(data) {
			this.clearCharts()
			this.playbackPolls.displayed = []
			this.students.active = []
			this.lectures.active = data
			this.execStudentsForLectures(data)
		},
		handleStudentsChange(data) {
			this.clearCharts()
			this.playbackPolls.displayed = []
			this.students.active = data
			this.setupCharts()
		},
		execLecturesForSections(sections) {
			this.getLecturesForSections(sections)
			.then(lectures => {
				let clean = lectures.filter(a => undefined != a)
				if(undefined != this.lectures.filtered && this.lectures.filtered.length > 0) {
					this.$refs.lecturesSelector.repopulate(clean)
				}
				this.lectures.filtered = clean
				this.execStudentsForLectures(clean)
			})
		},
		execStudentsForLectures(lectures) {
			this.getStudentsForLectures(lectures)
			.then(students => {
				let noDups = students.uniqueByProp("_id")
				if(undefined != this.students.filtered && this.students.filtered.length > 0) {
					this.$refs.studentsSelector.repopulate(noDups)
				}
				this.students.filtered =  noDups
				this.execSubmissionsForLectures(lectures,students)
			})
		},
		execSubmissionsForLectures(lectures,students) {
			this.getSubmissionsForLectures(lectures)
			.then(submissions => {
				this.lectureSubmissions.filtered = submissions
				this.setupCharts()
			})
		},
		async getSectionsForCourse(course) {
			let sectionsForCourse = []
			this.sections.all.forEach(section => {
				if(section.course == course._id) {
					sectionsForCourse.push(new Promise((resolve,reject) => {
						resolve(section)
					}))
				}
			})
			return Promise.all(sectionsForCourse)
		},
		async getLecturesForSections(sections) {
			let lecturesForSections = []
			this.lectures.all.forEach(lecture => {
				let ids
				if(sections.length == 0) {
					ids = this.sections.filtered.map(a => a._id)
				} else {
					ids = sections.map(a => a._id)
				}
				if(ids.some(v => lecture.sections.includes(v))) {
					lecturesForSections.push(
						new Promise((resolve,reject) => {
							resolve(lecture)
						})
					)
				}
			})
			return Promise.all(lecturesForSections)
		},
		async getStudentsForLectures(lectures) {
			let students = []
			let toIterate
			if(lectures.length == 0) {
				toIterate = this.lectures.all
			} else {
				toIterate = lectures
			}
			toIterate.forEach(lecture => {
				lecture.sections.forEach(sectID => {
					this.sections.filtered.forEach(section => {
						if(section._id == sectID) {
							this.students.all.forEach(student => {
								if(section.students.includes(student._id)) {
									students.push(new Promise((resolve,reject) => {
										resolve(student)
									}))
								}
							})
						}
					})
				})
			})
			return Promise.all(students)
		},
		async getSubmissionsForLectures(lectures) {
			let submissions = []
			this.lectureSubmissions.all.forEach(submission => {
				let ids
				if(lectures.length == 0) {
					ids = this.lectures.filtered.map(a => a._id)
				} else {
					ids = lectures.map(a => a._id)
				}
				if(ids.includes(submission.lecture)) {
					submissions.push(
						new Promise((resolve,reject) => {
							resolve(submission)
						})
					)
				}
			})
			return Promise.all(submissions)
		},
		getPrettyDateTime(datetime) {
			datetime = new Date(datetime)
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
		clearCharts() {
			this.charts.forEach(chart => {
				chart.destroy()
			})
			this.charts = []
		},
		handleToggleStacked(stacked) {
			this.stacked = stacked
			this.charts.forEach(chart => {
				if(chart.config.type == 'line') {
					chart.options.scales.yAxes[0].stacked = stacked
					chart.update()
				} else if(chart.config.type == 'bar') {
					chart.options.scales.xAxes[0].stacked = stacked
					chart.options.scales.yAxes[0].stacked = stacked
					chart.update()
				}
			})
		},
		handleToggleHalf(half) {
			this.half = half
			this.charts.forEach(chart => {
				if(chart.config.type == 'pie') {
					if(half) {
						chart.options.rotation = 1 * Math.PI
						chart.options.circumference = 1 * Math.PI
					} else {
						chart.options.rotation = 1.5 * Math.PI
						chart.options.circumference = 2 * Math.PI
					}
					chart.update()
				}
			})
		},
		handleTogglePolls(polls) {
			this.clearCharts()
			this.playbackPolls.displayed = []
			this.polls = polls
			this.$nextTick(function() {
				this.setupCharts()
			})
		}
	}
}
</script>

<style scoped>
:root {
	--stats-panel-background: #c4c4c4;
	--stats-panel-shadow: rgba(109, 109, 109, 0.644);

	--stats-live-border: #04dd74;
	--stats-live-fill: #bfffc6;

	--stats-playback-border: #3282bf;
	--stats-playback-fill: #92bed2;

	--stats-absent-border: #e95454;
	--stats-absent-fill: #ff8787;
}
#stats-container {
	color: var(--main-text-color);
	position: absolute;
	top: 0rem;
	bottom: 0rem;
	left: 0;
	right: 0;
}
.title {
	color: green;
}

.row {
	width: 100%;
	margin: 0;
	padding: 0;
}
.col {
	margin: 0;
	padding: 0;
}

#stats-left,
#stats-right {
	position: absolute;
	display: inline-block;
	height: 100%;
}
#stats-left {
	left: 0;
	width: 22rem;
}
#stats-right {
	left: 22rem;
	right: 0;
}
#stats-right-top,
#stats-right-bottom {
	position: absolute;
	width: 100%;
}
#stats-right-top {
	top: 0;
	height: 5rem;
}
#stats-right-bottom {
	top: 5rem;
	bottom: 0;
	padding: 0rem 1rem;
	padding-bottom: 1rem;
	overflow-y: auto; 
	/*overflow-y: visible; */
}
#stats-render {
	padding: 0rem 10%;
}
canvas:only-of-type {
	margin-top: 5%;
}
canvas:not(:first-of-type) {
	margin-top: 1rem;
}
canvas:last-of-type {
	margin-bottom: 2rem;
}

.stats-panel {
	position: absolute;
	top: 1rem;
	left: 1rem;
	bottom: 1rem;
	right: 1rem;
	overflow-y: auto;
	background: var(--stats-panel-background);
	border-radius: 1rem;
	box-shadow: 0px 3px 3px 0px var(--stats-panel-shadow);
}
#side-panel {
	right: 0;
}
#top-panel {
	text-align: left;
}

.side-panel-section {
	margin: 0rem 2rem;
	width: 17rem;
	padding: 2rem 0rem;
	min-height: 2.75rem;
	text-align: center;
}
.side-panel-section:not(:first-of-type) {
	border-top: 1px solid var(--main-text-color);
}

#course-selector {
	position: relative;
	top: 0;
}

.selector-label {
	text-align: right;
	margin-right: 0.5rem;
	padding-top: 0.5rem;
}

.hidden {
	display: none;
}
</style>