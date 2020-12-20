<template>
  <div class="container" style="padding:2rem;">
    <a :href="cas_url" tabindex="-1">
      <button @click="$emit('button-clicked')" v-bind:class="{hidden:fade_out, visible:fade_in}" type="button" class="btn button shadow venue-btn" tabindex="0">
        <!-- <div v-if="show_login_text">Login</div> -->
        <!-- <div v-else>Get Started</div> -->
        <div>{{ btn_text }}</div>
      </button>
    </a>
  </div>
</template>

<script>
  export default {
    name: 'Button',
    props: {
      // btn_str: String
      cas_url: String,
      btn_text: String
    },
    data() {
      return {
        show_login_text: false,
        fade_out: false,
        fade_in: false
      }
    },
    created() {
    },
    methods: {
      toggleBtnText() {
        this.show_login_text = !this.show_login_text
      },
      fadeOut() {
        this.fade_out = true
      },
      fadeIn() {
        this.fade_in = true
      }
    }
  }
</script>

<style scoped>
  .button {
    background-color: var(--main-background-color); 
    font-size: 1.5rem;
    width: 12rem;
    /*margin-top: 1rem;*/
    border: #0078c2 solid;
    color: #0078c2;
    border-radius: 5px;
  }

  .venue-btn:hover,
  .venue-btn:focus {
    background-color: #0078c2; 
    color: white; 
  }

  .hidden {
    visibility: hidden;
    opacity: 0;
    transition: visibility 0.2s linear, opacity 0.2s linear;
  }

  .visible {
    visibility: visible;
    opacity: 1;
    transition: visibility 0.2s linear, opacity 0.2s linear;
  }
</style>