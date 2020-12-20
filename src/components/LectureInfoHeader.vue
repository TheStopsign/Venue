<template>
  <div id="lecture-info-section">
    <show-at breakpoint="mediumAndBelow">
      <!-- Mobile -->
      <div id="lecture-data-mobile">
        <div id="main-info-mobile">
          <h3 class="lecture-title">
            {{lecture.title}}
            <router-link v-if="is_instructor" :to="{name: 'edit_lecture',params:{id: lecture._id}}" role="link" aria-label="Edit Lecture">
              <img src="@/assets/venue-edit.svg" width="30" height="30" class="d-inline-block align-top svg-color" alt="Settings" aria-label="Settings">
            </router-link>
          </h3>
          <div>{{lecture.sections[0].course.name}}<p class="dept-and-number">{{lecture.sections[0].course.prefix}} {{lecture.sections[0].course.suffix}}</p></div>
          <p class="sections">Sections: {{lecture.sections.map(a => a.name).join(', ')}}</p>
        </div>
        <div class="row">
          <div v-if="lecture.start_time" class="col">
            <h5>Live Lecture Window</h5>
            <p>{{getPrettyDateTime(new Date(lecture.start_time))}}</p>
            <p>-</p>
            <p>{{getPrettyDateTime(new Date(lecture.end_time))}}</p>
          </div>
          <div v-if="lecture.playback_submission_start_time" class="col">
            <h5>Video Attendance Window</h5>
            <p>{{getPrettyDateTime(new Date(lecture.playback_submission_start_time))}}</p>
            <p>-</p>
            <p>{{getPrettyDateTime(new Date(lecture.playback_submission_end_time))}}</p>
          </div>
        </div>
      </div>
    </show-at>
    <!-- Tablet & Up -->
    <show-at breakpoint="large">
      <div id="lecture-data" class="row">
        <div class="col-6">
          <div id="main-info">
            <h3 class="lecture-title">
              {{lecture.title}}
              <router-link v-if="is_instructor" :to="{name: 'edit_lecture',params:{id: lecture._id}}" role="link" aria-label="Edit Lecture">
                <img src="@/assets/venue-settings.svg" width="30" height="30" class="d-inline-block align-top svg-color" alt="Settings" aria-label="Settings">
              </router-link>
            </h3>
            <div>{{lecture.sections[0].course.name}}<p class="dept-and-number">{{lecture.sections[0].course.prefix}} {{lecture.sections[0].course.suffix}}</p></div>
            <p class="sections">Sections: {{lecture.sections.map(a => a.name).join(', ')}}</p>
          </div>
        </div>
        <div v-if="lecture.start_time" class="col time-window my-auto">
          <h5>Live Lecture Window</h5>
          <p>{{getPrettyDateTime(new Date(lecture.start_time))}} - {{getPrettyDateTime(new Date(lecture.end_time))}}</p>
        </div>
        <div v-if="lecture.playback_submission_start_time" class="col time-window my-auto">
          <h5>Video Attendance Window</h5>
          <p>{{getPrettyDateTime(new Date(lecture.playback_submission_start_time))}} - {{getPrettyDateTime(new Date(lecture.playback_submission_end_time))}}</p>
        </div>
      </div>
    </show-at>
  </div>
</template>

<script>
  import {showAt, hideAt} from 'vue-breakpoints';

  export default {
    name: 'LectureInfoHeader',
    components: {
      showAt,
      hideAt
    },
    props: {
      lecture: Object,
      is_instructor: Boolean
    },
    data(){
      return {
      }
    },
    created() {
    },
    methods: {
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
      }
    }
  }
</script>

<style scoped>
  #lecture-title {
    position: absolute;
    bottom: 0;
    text-align: left;
    margin-left: 1rem;
    display: inline-block;
  }

  p {
    max-width: 100%;
  }

  #lecture-title-mobile {
    width: 100%;
  }

  #lecture-info-section {
    position: relative;
  }

  #lecture-data {
    position: relative;
    margin-top: 2rem;
    text-align: left;
  }

  #lecture-data-mobile {
    margin-top: 2rem;
  }

  .col {
    margin: 0;
  }

  .row {
    margin-top: 2rem;
  }

  .row-half {
    width: 50%;
  }

  .lecture-title {
    font-size: 2rem;
  }

  #main-info {
    display: inline-block;
    border-radius: .25rem;
    padding: 2rem;
    margin: 0;
    text-align: left;
    background-color: var(--main-background-color);
    color: var(--course-card-text);
    box-shadow: 0px 3px 3px 0px var(--course-card-shadow);
    width: 100%;
  }

  #main-info-mobile {
    display: inline-block;
    border-radius: .25rem;
    padding: 2rem 3rem;
    width: 100%;
    margin: 0;
    text-align: center;
    background-color: var(--main-background-color);
    color: var(--course-card-text);
    box-shadow: 0px 3px 3px 0px var(--course-card-shadow);
  }

  .row-half h5,
  .col h5 {
    font-weight: 900;
  }

  .dept-and-number {
    display: inline-block;
    background: var(--course-number-background);
    color: var(--course-number-text);
    font-size: 0.8rem;
    padding: 0.1rem 0.5rem;
    margin-left: 0.5rem;
    border-radius: 2px;
  }

  p {
    margin: 0;
  }

  .sections {
    margin-top: 0.5rem;
  }

  #checkins-container {
    width: 100%;
    border: var(--modal-border) solid;
  }

  .time-container {
    display: inline-block;
    text-align: center;
    width:50%;
    border: var(--modal-border) solid thin;
  }

  .time-window {
    text-align: center;
  }

</style>