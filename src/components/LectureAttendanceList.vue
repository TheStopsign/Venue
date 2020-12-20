<template>
	<div>
    <div v-if="is_instructor">
      <div v-if="is_live">
        <div v-if="submissions_with_live.length > 0">
          <div class="namecard-edging live-color" v-for="(submission,i) in submissions_with_live" :key="i">
            <div class="namecard">
              <p>{{submission.submitter.first_name}} {{submission.submitter.last_name}}</p>
              <p>{{submission.submitter.email}}</p>
              <p>{{submission.live_percent * 100}}%</p>
            </div>
          </div>
        </div>
        <div v-else>
          None
        </div>
      </div>
      <div v-else-if="is_playback">
        <div v-if="submissions_with_playback.length > 0">
          <div class="namecard-edging playback-color" v-for="(submission,i) in submissions_with_playback" :key="i">
            <div class="namecard">
              <p>{{submission.submitter.first_name}} {{submission.submitter.last_name}}</p>
              <p>{{submission.submitter.email}}</p>
              <p>{{submission.video_percent * 100}}%</p>
            </div>
          </div>
        </div>
        <div v-else>
          None
        </div>
      </div>
      <div v-else-if="is_absent">
        <div v-if="submissions_with_nothing.length > 0">
          <div class="namecard-edging absent-color" v-for="(absentee,i) in submissions_with_nothing" :key="i">
            <div class="namecard">
              <p>{{absentee.submitter.first_name}} {{absentee.submitter.last_name}}</p>
              <p>{{absentee.submitter.email}}</p>
              <p>0%</p>
            </div>
          </div>
        </div>
        <div v-else>
          None
        </div>
      </div>
    </div>
    <!-- Student -->
    <div v-else>
      <div v-if="is_live">
        <div v-if="submissions_with_live[0] && submissions_with_live[0].live_percent">
          <div class="namecard-edging live-color">
            <div class="namecard">
              <p>Submission Time:</p>
              <p>{{getPrettyDateTimeWithMS(new Date(submissions_with_live[0].live_submission_time))}}</p>
              <p>{{ submissions_with_live[0].live_percent * 100 }}%</p>
            </div>
          </div>
        </div>
        <div v-else>
          None
        </div>
      </div>
      <div v-else-if="is_playback">
        <div v-if="submissions_with_playback[0] && submissions_with_playback[0].video_percent">
          <div class="namecard-edging playback-color">
            <div class="namecard">
              <p>Submission Time:</p>
              <p>{{getPrettyDateTimeWithMS(new Date(submissions_with_playback[0].playback_submission_time))}}</p>
              <p>{{ submissions_with_playback[0].video_percent * 100 }}%</p>
            </div>
          </div>
        </div>
        <div v-else>
          None
        </div>
      </div>
      <div v-else-if="is_absent">
        <div v-if="submissions_with_nothing[0]">
          <div class="namecard-edging absent-color">
            <div class="namecard">
              <p>Absent</p>
              <p>0%</p>
            </div>
          </div>
        </div>
        <div v-else>
          None
        </div>
      </div>
    </div>
	</div>
</template>


<script>

  export default {
    name: 'LectureAttendanceList',
    props: {
      submissions_with_live: Array,
      submissions_with_playback: Array,
      submissions_with_nothing: Array,
      lecture: Object,
      is_live: {
        type: Boolean,
        default: false
      },
      is_playback: {
        type: Boolean,
        default: false
      },
      is_absent: {
        type: Boolean,
        default: false
      },
      is_instructor: Boolean
    },
    components: {
    },
    data(){
      return {
        selected_tab: 0
      }
    },
    methods: {
      getPrettyDateTimeWithMS(datetime) {
        if("Invalid Date" == datetime) {
          return ("Not set")
        }
        let hours = datetime.getHours()
        let minutes = datetime.getMinutes()
        if(minutes < 10) {
          minutes = "0" + minutes
        }
        let ms = datetime.getMilliseconds()
        if(ms < 10) {
          ms = "0" + ms
        }
        if(hours < 12) {
          return ((datetime.getMonth()+1) + "/" + (datetime.getDate()) + "/" + (datetime.getFullYear()) + " " + (hours==0 ? "12" : hours) + ":" + minutes + ":" + ms + " AM")
        } else {
          return ((datetime.getMonth()+1) + "/" + (datetime.getDate()) + "/" + (datetime.getFullYear()) + " " + (hours==12 ? hours : hours-12) + ":" + minutes + ":" + ms + " PM")
        }
      },
    }
  }
</script>

<style scoped>
	.namecard-edging {
	  display: inline-flex;
	  border-radius: .25rem;
	  padding-left: 0.5rem;
    padding-right: 0.5rem;
    padding-top: 0.5rem;
	  height: 100%;
	  margin-right: 1rem;
	  margin-bottom: 1rem;
    box-shadow: 0px 3px 3px 0px var(--course-card-shadow);
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
    background: var(--main-background-color);
    color: var(--course-card-text);
	  text-align: center;
    border-radius: .25rem;
	  /* top: 0.5rem; */
	  /* margin-left: 0.5rem; */
    margin-bottom: -0.5rem;
    padding: 0.5rem 1rem;
	  /* width: 11rem; */
	  /* height: 4rem; */
	  box-shadow: 0px 3px 3px 0px var(--course-card-shadow);
	  padding-top: 0.5rem;
	  z-index: 100;
	}
</style>