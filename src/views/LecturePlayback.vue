<template>
	<div id="lecture_playback">
		<div v-if="unrestricted && lecture_loaded">
			<UnrestrictedPlayback :lecture="lecture"/>
		</div>
		<div v-else-if="!unrestricted && !needs_decision && lecture_loaded">
			<RestrictedPlayback :lecture="lecture" :submission="submission"/>
		</div>
		<div v-else-if="needs_decision && show_decision" id="playback-opt">
			<button class="btn btn-secondary" id="opt-unrestricted" @click="handleOptIntoUnrestricted">Watch lecture without restrictions, and ignore my attendance grade</button>
			<button class="btn btn-primary" id="opt-restricted" @click="handleOptIntoRestricted">Watch lecture with restrictions, and improve my attendance grade</button>
		</div>
	</div>
</template>

<script>
import LectureAPI from "@/services/LectureAPI";
import LectureSubmissionAPI from '@/services/LectureSubmissionAPI';
import RestrictedPlayback from "@/components/RestrictedPlayback";
import UnrestrictedPlayback from "@/components/UnrestrictedPlayback";
import AuthAPI from "@/services/AuthAPI";

const query = require('querystring')
const url = require('url')

export default {
	name: 'LecturePlayback',
	components: {
		RestrictedPlayback,
		UnrestrictedPlayback
	},
	data(){
		return {
			is_instructor: false,
			is_ta: false,
			is_student: false,
			lecture: {},
			lecture_loaded: false,
			unrestricted: false,
			needs_decision: true,
			show_decision: false,
			submission: null
		}
	},
	created() {
		LectureAPI.getLectureWithSectionsAndCourse(this.$route.params.lecture_id)
			.then(res => {
				this.lecture = res.data
				this.is_instructor = this.$store.state.user.current_user.instructor_courses.includes(this.lecture.sections[0].course._id)
				let lect_sect_ids = this.lecture.sections.map(a => a._id)
				this.is_ta = this.$store.state.user.current_user.ta_sections.some( a => lect_sect_ids.includes(a) )
				this.is_student = this.$store.state.user.current_user.student_sections.some( a => lect_sect_ids.includes(a) )
				if(localStorage.getItem('last_webex')) {
					localStorage.removeItem('last_webex')
					this.convertVideoTypeToSourceType(this.lecture)
					let url_query = query.parse(url.parse(window.location.href).query)
					if(url_query.code) {
						let pieces = this.lecture.video_ref.split("/")
						AuthAPI.getWebexSrc(url_query.code,pieces[pieces.length-1]).then(res => {
							this.lecture.video_ref = res.data
							this.lecture.video_type = "video/mp4"
							window.history.replaceState({}, document.title, "/#/lecture_playback/"+this.lecture._id);
							this.lecture_loaded = true
						})
					}
				} else if(this.lecture.video_type == 'webex') {
					this.$store.dispatch('setLastWebex',this.lecture._id)
					if(process.env.NODE_ENV === 'production') {
						window.location.href="https://webexapis.com/v1/authorize?client_id=C51b03a19e18dfd8ccb12e33224fd60be29d1554641b22aeb6b3c2cccad97d04d&response_type=code&redirect_uri=https%3A%2F%2Fwww.venue-meetings.com&scope=spark%3Aall%20spark%3Akms&state=venue_state"
					} else {
						window.location.href="https://webexapis.com/v1/authorize?client_id=C51b03a19e18dfd8ccb12e33224fd60be29d1554641b22aeb6b3c2cccad97d04d&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A8080&scope=spark%3Aall%20spark%3Akms&state=venue_state"
					}
				} else {
					this.lecture_loaded = true
				}
				if(new Date() > new Date(this.lecture.playback_submission_end_time) || this.is_instructor || this.is_ta) {
					this.unrestricted = true
					this.needs_decision = false
				} else {
					LectureSubmissionAPI.getOrMake(this.lecture._id,this.$store.state.user.current_user._id)
						.then(res => {
							this.submission = res.data

							if(this.submission.live_percent && this.submission.live_percent == 1) {
								this.unrestricted = true
								this.needs_decision = false
							} else if(this.submission.video_percent && this.submission.video_percent == 1) {
								this.unrestricted = true
								this.needs_decision = false
							} else if(!this.submission.live_percent) {
								this.unrestricted = false
								this.needs_decision = false
							}
							
							if(this.needs_decision) {
								this.show_decision = true
							}
						})
				}
			})
	},
	methods: {
		handleOptIntoUnrestricted() {
			this.unrestricted = true
			this.needs_decision = false
		},
		handleOptIntoRestricted() {
			this.unrestricted = false
			this.needs_decision = false
		},
		convertVideoTypeToSourceType(lecture) {
			if(lecture.video_type == 'webex') {
				lecture.video_type = "video/mp4"
			}
		}
	}
}
</script>

<style scoped>
#lecture_playback {
	height: calc(100vh - 12rem)
}
#video_player {
	width: 100%;
	height: 100%;
}
.vjs-tech {
	position:unset;
}
.hide {
	display: none;
}
#polls {
	position: absolute;
	top: 25%;
	bottom: 25%;
	left: 25%;
	right: 25%;
	background: white;
	z-index: 999;
	padding: 20px;
}
#playback-opt {
	position: absolute;
	top: 25%;
	height: 50%;
	min-width: 25rem;
	width: 100%;
}
#opt-restricted,
#opt-unrestricted {
	display: inline-block;
	height: calc(100% - 2rem);
	width: calc(50% - 2rem);
	margin-top: 1rem;
}
#opt-unrestricted {
	margin-right: 1rem;
}
</style>