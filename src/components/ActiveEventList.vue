<template>
  <div class="active-event-list">
    <div v-if="active_events.length > 0">
      <router-link class="active-event-link" v-for="event in active_events" :key="event._id" :to="{name: 'event_info', params: { event_id: event._id }}">
        <ActiveEventCard v-bind:event="event" />
      </router-link>
    </div>
    <p v-else class="no-container" id="no-active">No active events</p>
  </div>
</template>

<script>
  import ActiveEventCard from '@/components/ActiveEventCard.vue'
  export default {
    name: 'ActiveEventList',
    components: {
      ActiveEventCard
    },
    data(){
      return {
        active_events: []
      }
    },
    created() {
      this.current_user = this.$store.state.user.current_user
      this.getActiveEvents()
    },
    methods: {
      async getActiveEvents() {
        
        let events = response.data
        this.updateSubmissionWindowStatuses(events)
        this.active_events = this.sortEventsbySubmissionWindowStatus(events)
      },
      updateSubmissionWindowStatuses(events) {
        let current_time = new Date()
        events.forEach(event => {
          let submission_start_time = new Date(event.submission_start_time)
          let submission_end_time = new Date(event.submission_end_time)
          if(current_time < submission_start_time)
            event.submission_window_status.is_pending = true
          else if(current_time >= submission_start_time && current_time <= submission_end_time){
            event.submission_window_status.is_ongoing = true
          }
          else
            event.submission_window_status.is_ended = true
        })
      },
      sortEventsbySubmissionWindowStatus(events) {
        let ongoing_events = []
        let pending_events = []
        let ended_events = []
        events.forEach(event => {
          if(event.submission_window_status.is_ongoing)
            ongoing_events.push(event)
          else if(event.submission_window_status.is_pending)
            pending_events.push(event)
          else
            ended_events.push(event)
        })
        events = ongoing_events.concat(pending_events)
        events = events.concat(ended_events)
        return events
      }
    }
  }
</script>

<style scoped>
:root { 
  --event-active-link: #2c3e50; 
  --event-list-background: #F5F5F5; 
}
.active-event-list {
  height: 12.5rem;
  overflow-y: auto;
}
.active-event-link {
  color: var(--event-active-link);
}
</style>