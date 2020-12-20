<template>
  <div id="calendar-container">
    <FullCalendar v-if="calendarOptions.initialEvents" ref="calendar" :options="calendarOptions" :events="[
      { title: 'event 1', date: '2020-11-14' },
      { title: 'event 2', date: '2019-11-14' }
    ]"/>
  </div>
</template>

<script scoped>
import FullCalendar from '@fullcalendar/vue'
import timeGridPlugin from '@fullcalendar/timegrid'
import moment from 'moment'

import LectureAPI from '@/services/LectureAPI'

export default {
  name: "Calendar",
  components: {
    FullCalendar
  },
  data() {
    return {
      calendarOptions: {
        plugins: [ timeGridPlugin ],
        initialView: 'timeGridWeek',
        slotMinTime: "07:00:00",
        slotMaxTime: "22:00:00",
        nowIndicator: true,
        scrollTime: moment().format("HH") + ":00:00",
        initialEvents: null,
        eventClick: this.goToLecture
      }
    }
  },
  created() {
    LectureAPI.getLecturesForUser(this.$store.state.user.current_user._id,"with_sections_and_course")
    .then(res => {
      let events = []
      res.data.forEach(lecture => {
        if(lecture.start_time) {
          events.push({
            id: lecture._id,
            title: lecture.title,
            start: lecture.start_time,
            end: lecture.end_time,
          })
        }
      })
      this.calendarOptions.initialEvents = events
    })
  },
  methods: {
    goToLecture(e) {
      this.$router.push({name: "lecture_info", params: {lecture_id: e.event._def.publicId}})
    }
  }
}
</script>

<style scoped>
#calendar-container {
  width: 100%;
  height: 100%;
  padding: 0.25rem 2rem;
}
.fc {
  height: calc(100vh - 7rem);
}
</style>