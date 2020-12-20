<template>
	<div id="unrestricted_playback">
		<video id="video_player" class="video-js vjs-big-play-centered" controls>
			<source v-if="isProduction" v-bind:src="lecture.video_ref + (lecture.video_type=='video/youtube'?'?showinfo=0&enablejsapi=1&origin=https://www.venue-meetings.com':'')" :type="lecture.video_type"/>
			<source v-else v-bind:src="lecture.video_ref + (lecture.video_type=='video/youtube'?'?showinfo=0&enablejsapi=1&origin=http://localhost:8080':'')" :type="lecture.video_type"/>
		</video>
	</div>
</template>

<script>
import videojs from "video.js"
import axios from 'axios'
require('videojs-youtube')

export default {
	name: 'UnrestrictedPlayback',
	props: {
		lecture: Object
	},
	computed: {
		isProduction(){ process.env.NODE_ENV === 'production' }
	},
	data() {
		return {
			vjs: null
		}
	},
	mounted() {
		let self = this
		videojs("video_player", {}, function() {
			self.vjs = this
		})
	},
	beforeDestroy() {
		if(this.vjs) {
			this.vjs.dispose()
		}
	}
}
</script>

<style scoped>
#unrestricted_playback {
	position: fixed;
	left: 2rem;
	right: 2rem;
	top: 8rem;
	bottom: 2rem;
}
#video_player {
	width: 100%;
	height: 100%;
}
.vjs-tech {
	position:unset;
}
</style>