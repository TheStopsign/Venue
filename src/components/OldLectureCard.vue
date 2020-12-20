<template>
  <div class="active-event-card-container" v-bind:class="{
  'pending-container':status == 'pending',
  'ongoing-container':status == 'ongoing',
  'ended-container':status == 'ended',
  'static-container': status == 'static'}" >
    <router-link class="lecture_card_link" :to="{name: 'lecture_info', params: { lecture_id: lecture._id }}" :aria-label="'Lecture Info - '+courseName+' - '+lecture.title">
      <div class="active-event-card-background"></div>
      <div class="active-event-card">
        <div  class="event-card-section" id="course-section">
          <div class="course-name">{{ courseName }}</div>
          <div class="course-title">{{ courseDept }} {{ courseNumber }}</div>
        </div>
        <div v-if="eventSublabel != undefined && eventSublabel != ''" class="event-card-section event-section">
          <div class="event-name">{{ eventLabel }}</div>
          <div class="event-location">{{ eventSublabel }}</div>
        </div>
        <div v-else class="event-card-section event-section">
          <div class="event-name solo">{{ eventLabel }}</div>
        </div>
        <div class="event-card-section" id="time-section">
          <div>
            <img src="@/assets/venue-clock.svg" class="clock" aria-label="Time Icon">
            <div class="time-remaining">
              <span v-if="status == 'pending'" class="pending-text">pending</span>
              <div v-else-if="status == 'ongoing' || status == 'static'">
                {{ getTimeString( timeFromNow ) }}
              </div>
              <span v-else class="ended-text">ended</span>
            </div>
          </div>
        </div>
      </div>
    </router-link>
  </div>
</template>

<script>
import SectionAPI from "@/services/SectionAPI.js";

export default {
  name: "LectureCard",
  props: {
    lecture: Object,
    courseName: String,
    courseDept: String,
    courseNumber: Number,
    eventLabel: String,
    eventSublabel: String,
    status: String,
    timeFromNow: String
  },
  computed: {},
  components: {},
  data() {
    return {
      section: {},
      course: {},
      remaining_days: Number,
      remaining_hours: Number,
      remaining_mins: Number,
      is_instructor: Boolean
    }
  },
  created() {
    this.is_instructor = this.$store.state.user.current_user.is_instructor
  },
  methods: {
    getTimeString (time_string) {
      if (time_string == '' || time_string == undefined || time_string == null) return ''
      let date_ = new Date(time_string)
      let now = new Date ()

      let timeDiff = Math.abs(date_.getTime() - now.getTime())

      let diffDays = timeDiff / (1000 * 3600 * 24)
      if (diffDays < 0.5) {
        // show the hh mm ss
        let hrs = Math.floor(this.fmod(timeDiff / (1000 * 60 * 60), 12));
        let mins = Math.floor(this.fmod(timeDiff / (1000 * 60), 60));
        let secs = Math.floor(this.fmod(timeDiff / (1000), 60));
        return `${hrs}h ${mins}m ${secs}s`
      }
      else {
        // show the days
        return `${Math.ceil(diffDays)}d`
      }


      return "123"
    },
    fmod (value, mod_op) {
      if (value < mod_op) return value;

      while (value > mod_op) {
        value -= Math.abs(mod_op)
      }
      return value
    }
  }
};
</script>

<style scoped>
.active-event-card-container .active-event-card-background {
  position: absolute;
  z-index: 1;
  width: 104%;
  left: -2%;
  height: 100%;
  top: -15%;
  border-radius: 5px;
  transition: width 0.25s, left 0.25s, top 0.25s;
}

.active-event-card-container:hover .active-event-card-background,
.lecture_card_link:focus .active-event-card-background {
  width: 110%;
  left: -5%;
  top: -25%;
}

.lecture_card_link:focus {
  outline: none;
}

.active-event-card-container {
  position: relative;
  width: 75%;
  height: 3.5rem;
  margin-left: 2rem;
  margin-top: 2rem;
  cursor: pointer;
}

.pending-container .active-event-card-background {
  background-color: var(--event-pending);
}

.ongoing-container .active-event-card-background {
  background-color: var(--event-ongoing);
}

.static-container .active-event-card-background {
  background-color: var(--event-static);
}

.ended-container .active-event-card-background {
  background-color: var(--event-ending);
}

.active-event-card {
  position: absolute;
  background-color: var(--event-active-background);
  width: 100%;
  border-radius: 5px;
  padding: 0.8rem 0.4rem 0.7rem 0.4rem;
  box-shadow: 0px 3px 10px 5px var(--event-active-shadow);
  transition: background-color, box-shadow 0.25s;
  z-index: 4;
}

.event-card-section {
  display: inline-block;
  vertical-align: top;
  height: 100%;
}

#course-section {
  width: 30%;
  margin-left: 0.5rem;
  /*text-align: center;*/
}

.course-name {
  /*font-size: 0.8rem;*/
  font-size: 0.8rem;
  color: var(--event-course-name);
  font-weight: bold;
}

.course-title {
  font-size: 0.75rem;
  color: var(--event-course-title);
}

.event-section {
  width: 40%;
  text-align: center;
  margin: auto;
}

.event-name {
  font-size: 0.9rem;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-height: 1.6rem;
}

.event-name.solo {
  position: relative;
  top: 5px;
  font-size: 1.1rem;
}

.event-location {
  font-size: 0.75rem;
  color: var(--event-location);
}

#time-section {
  width: 26%;
  text-align: center;
  padding-top: 0.25rem;
}

.clock {
  display: inline-block;
  height: 1rem;
}

.time-remaining {
  display: inline-block;
  padding-top: 0.25rem;
  margin-left: 0.5rem;
  font-size: 0.7rem;
  font-weight: bold;
}

.pending-text {
  color: var(--event-pending);
}

.time-remaining-text {
  color: var(--event-ongoing);
}

.ended-text {
  color: var(--event-ending);
}

/*Large devices (Laptops and above)*/
@media (max-width: 1128px) {
  .active-event-card-container {
    margin: auto;
    margin-top: 2rem;
    width: 50%;
  }
  #course-section {
    width: 23%;
  }
}

/*Small devices (phones and below)*/
@media (max-width: 575.98px) {
  .active-event-card-container {
    width: 80%;
  }
  .active-event-card {
    padding-left: 0;
  }
  #course-section {
    width: 30%;
  }
}
</style>
