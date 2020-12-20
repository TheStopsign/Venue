<template>
  <div class="instructor-attendance">
    <div v-for="year in getStringsAscending(Object.keys(timeline))" :key="year">
      <div v-for="month in getStringsAscending(Object.keys(timeline[year]))" :key="month">
        <div class="month-area">
          {{ STATIC_MONTHS[month] }} {{year}}
        </div>
        <div class="event-pills-area">
          <router-link v-for="i in timeline[year][month]" :key="lectures[i]._id" :to="{name: 'lecture_info', params: { lecture_id: lectures[i]._id }}" tabindex="-1">
            <div :class="'attendance-history-pill-background '+ (isLive(lectures[i])?'live-border':'') + (isPlayback(lectures[i])?'playback-border':'')">
              <div :class="'inline-block instructor-attendance-history-pill ' + lectures[i].color" :style="{background: lectures[i].color}" :title="lectures[i].title" tabindex="0" :aria-label="'Lecture Info - '+lectures[i].title">
                <div class="inline-block date-area my-auto">
                  <div class="day-of-week">{{ getDayOfWeek(lectures[i]) }}</div>
                  <div class="day-of-month">{{ getDayOfMonth(lectures[i]) }}</div>
                </div>
                <div class="inline-block name-area">
                  <div class="event-name">{{ lectures[i].title }}</div>
                  <div v-if="lectures[i].start_time" class="event-location">{{getPrettyTime(lectures[i].start_time)}} - {{getPrettyTime(lectures[i].end_time)}}</div>
                  <div v-else class="event-location">{{getPrettyTime(lectures[i].playback_submission_start_time) + ' - ' + getPrettyTime(lectures[i].playback_submission_end_time)}}</div>
                </div>
                <div class="inline-block percentage-area">
                  <div v-if="scores_loaded">{{lectures[i].percentage == undefined ? 0 : lectures[i].percentage.toFixedDecimals(0)}}%</div>
                  <SquareLoader v-else/>
                </div>
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

  import SquareLoader from '@/components/Loaders/SquareLoader.vue'

  export default {
    name: 'TAAttendanceHistory',
    components: {SquareLoader},
    props: {
      mobileMode: Boolean,
      lectures: Array,
      timeline: Object,
      students: Array,
      scores_loaded: Boolean
    },
    data () {
      return {
        STATIC_MONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        STATIC_DAY_OF_WEEK: ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat']
      }
    },
    methods: {
      perc2color(perc) {
        var r, g, b = 0;
        if(perc < 50) {
          r = 255;
          g = Math.round(5.1 * perc);
        }
        else {
          g = 255;
          r = Math.round(510 - 5.10 * perc);
        }
        var h = r * 0x10000 + g * 0x100 + b * 0x1;
        return '#' + ('000000' + h.toString(16)).slice(-6);
      },
      shortenString (string, max_length) {
        if (string.length < max_length) {
          return string
        }
        return string.substring(0, max_length - 3) + "..."
      },
      getDayOfWeek (event) {
        let _date = new Date(event.start_time == undefined ? event.playback_submission_start_time : event.start_time)
        return this.STATIC_DAY_OF_WEEK[ _date.getDay() ]
      },
      getDayOfMonth (event) {
        let _date = new Date(event.start_time == undefined ? event.playback_submission_start_time : event.start_time)
        return _date.getDate ()
      },
      getStringsAscending(arr) {
        return arr.concat().sort((a,b) => parseInt(a) > parseInt(b) ? 1 : -1)
      },
      isLive(lecture) {
        let now = Date.now()
        return (lecture.start_time && Date.parse(lecture.start_time) <= now && Date.parse(lecture.end_time) >= now)
      },
      isPlayback(lecture) {
        let now = Date.now()
        return (lecture.playback_submission_start_time && Date.parse(lecture.playback_submission_start_time) <= now && Date.parse(lecture.playback_submission_end_time) >= now)
      },
      getPrettyTime(datetime) {
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
					return ((hours==0 ? "12" : hours) + ":" + minutes + " AM")
				} else {
					return ((hours==12 ? hours : hours-12) + ":" + minutes + " PM")
				}
			}
    }
  }

</script>