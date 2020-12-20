<template>
  <div class="todays-events-list">
    <div v-if="todays_events.length > 0">
      <!-- Desktop and tablet -->
      <hide-at breakpoint="small">
        <div class="todays-events-section" id="horizontal-section">
          <div class="horizontal-timeline"></div>
          <div v-for="(event, index) in todays_events" class="todays-event-container desktop-event-container" v-bind:class="{'mleft-one':index===0, 'mleft-four':index!==0}">
            <div v-if="event.started_today" class="todays-event-time desktop-event-time">{{ convertToHourMinuteFormat(new Date(event.start_time)) }}</div>
            <div v-else class="todays-event-time desktop-event-time">{{ convertToMonthDayFormat(new Date(event.start_time)) }} {{ convertToHourMinuteFormat(new Date(event.start_time)) }}</div>
            <router-link class="active-event-link" :to="{name: 'event_info', params: { event_id: event._id }}">
              <TodaysEventCard v-bind:event="event" />
            </router-link>
          </div>
        </div>
      </hide-at>
      <!-- Phone -->
      <show-at breakpoint="small">
        <div class="todays-events-section" id="vertical-section">
          <div class="vertical-timeline"></div>
          <div v-for="(event, index) in todays_events" class="todays-event-container mobile-event-container">
            <div v-if="event.started_today" class="todays-event-time mobile-event-time">{{ convertToHourMinuteFormat(new Date(event.start_time)) }}</div>
            <div v-else class="todays-event-time mobile-event-time">{{ convertToMonthDayFormat(new Date(event.start_time)) }} {{ convertToHourMinuteFormat(new Date(event.start_time)) }}</div>
            <div class="todays-event-card-wrapper">
              <router-link class="active-event-link" :to="{name: 'event_info', params: { event_id: event._id }}">
                <TodaysEventCard v-bind:event="event" />
              </router-link>
            </div>
          </div>
        </div>
      </show-at>
    </div>
    <div v-else>
      <p class="no-container" id="no-today">No events today</p>
    </div>
  </div>
</template>

<script>
  import TodaysEventCard from '@/components/TodaysEventCard.vue'
  import {showAt, hideAt} from 'vue-breakpoints'
  export default {
    name: 'TodaysEventsList',
    components: {
      TodaysEventCard,
      hideAt,
      showAt
    },
    data(){
      return {
        todays_events: []
      }
    },
    created() {
      this.current_user = this.$store.state.user.current_user
      this.getTodaysEvents()
    },
    methods: {
      async getTodaysEvents() {
        EventAPI.getActiveOrTodaysEventsForUser(this.current_user._id, false)
        .then(response => {
          this.data_loaded = true
          this.todays_events = response.data
          //order events by start time
          this.sortTodaysEventsByStartTime()
          this.setEventsStartedStoday()
        })
        .catch(err => {
          console.log(err)
          this.data_loaded = true
        })
      },
      convertToHourMinuteFormat(time) {
        let time_string = time.toLocaleTimeString('en-US')
        //remove all ':00's from the string
        time_string = time_string.replace(/:00/g,"")
        return time_string
      },
      convertToMonthDayFormat(time) {
        let month = time.getMonth() + 1; //months from 1-12
        let day = time.getDate();
        return month + "/" + day
      },
      sortTodaysEventsByStartTime() {
        this.todays_events.sort(function(a,b){
          return new Date(a.start_time) - new Date(b.start_time);
        });
      },
      setEventsStartedStoday() {
        this.todays_events.forEach(event => {
          if(this.isToday(new Date(event.start_time)))
            event.started_today = true
        })
      },
      isToday(time) {
        let current_time = new Date()
        return current_time.getFullYear() === time.getFullYear() &&
          current_time.getMonth() === time.getMonth() &&
          current_time.getDate() === time.getDate()
      }
    }
  }
</script>

<style scoped>
:root {
  --event-today-time: #757575;
  --event-timeline-background: #f0f0f0;
}
.todays-events-section {
  /*border: blue solid;*/
  white-space: nowrap;
  padding-right: 2rem;
}
#horizontal-section {
  height: 9.5rem;
  overflow-x: auto;
  overflow-y: hidden;
}
#vertical-section {
  /*border: blue solid;*/
  height: 20rem;
  overflow-y: auto;
}
.mleft-one {
  margin-left: 1rem;
}
.mleft-four {
  margin-left: 4rem;
}
.horizontal-timeline {
  border: var(--event-timeline-background) solid 2px;
  background-color: var(--event-timeline-background);
  position: absolute;
  width: 30rem;
  margin-top: 1.75rem;
}
.vertical-timeline {
  border: var(--event-timeline-background) solid 2px;
  background-color: var(--event-timeline-background);
  position: absolute;
  width: 2px;
  margin-left: 7rem;
  height: 20rem;
  z-index: 0;
}
.todays-event-container {
  /*border: red solid;*/
  height: 5rem;
}
.desktop-event-container {
  display: inline-block;
  vertical-align: top;
  width: 10rem;
}
.mobile-event-container {
  width: 100%;
  /*margin-left: 2.5rem;*/
  margin-top: 2rem;
}
.todays-event-time {
  /*border: blue solid;*/
  text-align: center;
  font-size: 0.75rem;
  margin-top: 0.5rem;
  color: var(--event-today-time);
}
.desktop-event-time {
}
.mobile-event-time {
  display: inline-block;
  margin-top: 1.5rem;
  float: left;
  /*border: red solid;*/
  width: 5.5rem;
  /*width: 2rem;*/
}
.todays-event-card-wrapper {
  display: inline-block;
  /*width: 21rem;*/
  width: 18rem;
  float: left;
  /*margin-left: 0.5rem;*/
  height: 100%;
  /*border: green solid;*/
}
.active-event-link {
  color: var(--event-active-link);
}
/*Small devices*/
/* @media (max-width: 575.98px) {
  .todays-events-section {
    padding-right: 0;
  }
} */
</style>