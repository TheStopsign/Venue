<template>
  <div :class="is_main?'dashboard-section-main':'dashboard-section'">
    <div class="dashboard-section-title-container" v-on:click="onNameClick()">
      <h4 v-if="lecture_type === 'Live'" class="dashboard-section-title"> Synchronous</h4>
      <h4 v-else-if="lecture_type === 'Playback'" class="dashboard-section-title">Asynchronous</h4>
      <h4 v-else class="dashboard-section-title">{{ lecture_type }}</h4>
    </div>
    <div :class="is_main?'dashboard-section-body-container-main':'dashboard-section-body-container'">
      <LectureList :lecture_type="lecture_type" :lecture_list="lecture_list" :two_lists="is_main"/>
    </div>
  </div>
</template>

<script>
  import LectureList from '@/components/LectureList'

  export default {
    name: 'DashboardSection',
    props: {
      lecture_type: String,
      lecture_list: Array,
      on_click: {
        type: Function,
        default: (x) => {}
      },
    },
    created() {
      this.is_main = false;
    },
    computed: {
    },
    components: {
      LectureList
    },
    data(){
      return {
        is_main: false
      }
    },
    methods: {
      onNameClick(){
        this.is_main = !this.is_main;
        if (this.is_main){
          this.$emit("hide_all")
        } else {
          this.$emit("reveal_all")
        }
        this.$forceUpdate();
      }
    }
  }
</script>

<style scoped>
:root {
  --dashboard-background-color: #f5f5f5;
  --dashboard-text-color: #2c3e50;
}

.dashboard-section {
  width: 100%;
  display: inline-block;
  vertical-align: top;
  margin-top: 1rem;
  background: var(--main-background-color);
  color: var(--main-text-color);
  transition: left 0.5s, top 0.5s;
}

.dashboard-section-main {
  position: absolute;
  width: 85%;
  left: 7.5%;
  top: 0;
  vertical-align: top;
  margin-top: 1rem;
  margin-right: 7.5%;
  background: var(--main-background-color);
  color: var(--main-text-color);
  transition: left 0.5s, top 0.5s;
}

.dashboard-section-title-container {
  height: 4rem;
  text-align: left;
  padding-left: 2rem;
  padding-top: 1rem;
  cursor: pointer;
}

.dashboard-section-title {
  color: var(--dashboard-text-color);
  font-weight: bold;
}

.dashboard-section-body-container {
  min-height: 10rem;
  max-height: 13rem;
  overflow-y: auto;
  overflow-x: hidden;
}

.dashboard-section-body-container-main {
  height: 100%;
}

/*Ipad & below*/
@media only screen and (max-width: 800px) {

  .dashboard-section-title-container {
    text-align: center;
    padding: 0;
  }

  .dashboard-section-body-container {
    min-height: 4rem;
  }
}
</style>
