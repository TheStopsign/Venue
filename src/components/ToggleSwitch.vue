<template>
	<div class='toggle-container'>
		<span class='toggle-label'>
			{{label}}
			</span>
			<div v-if="disabled" :class="'toggle-background disabled '+(state?'right':'left')">
				<div :class="'toggle-switch disabled '+(state?'right':'left')"></div>
			</div>
			<div v-else :class="'toggle-background '+(state?'right':'left')" @click="toggle">
				<div :class="'toggle-switch '+(state?'right':'left')"></div>
			</div>
	</div>
</template>

<script>
import CourseAPI from '@/services/CourseAPI.js';

export default {
	name: 'ToggleSwitch',
	props: {
		label: String,
		start: Boolean,
		disabled: {type: Boolean, default: false}
	},
	components: {},
	data(){
		return {
			state: false
		}
	},
	mounted() {
		this.state = this.start
	},
	methods: {
		toggle() {
			this.state = !this.state
			this.$emit('toggle',this.state)
		}
	}
}
</script>

<style scoped>
:root {
	/* --toggle-switch-on-background:  #04dd74;
	--toggle-switch-on-ball: #04852F; */

	--toggle-switch-off-background: #ff8787;
	--toggle-switch-off-ball: #e95454;
	
	--toggle-switch-disabled-background: #7E7E7E;
	--toggle-switch-disabled-ball: #4F4F4F;
}
.toggle-container {
	display: inline-flex;
	margin-left: 2rem;
	margin-top: 0.5rem;
}
.toggle-label {
	display: table-cell;
    vertical-align: middle;
	font-size: 1.25rem;
}
.toggle-background {
	display: inline-block;
	border-radius: 1rem;
	width: 5rem;
	height: 2rem;
	margin-left: 1rem;
	cursor: pointer;
}
.toggle-background.left {
	background: var(--toggle-switch-off-background);
}
.toggle-background.right {
	background: var(--toggle-switch-on-background);
}
.toggle-switch {
	border-radius: 0.75rem;
	height: 1.5rem;
	width: 1.5rem;
	margin-top: 0.25rem;
}
.toggle-switch.left {
	background:var(--toggle-switch-off-ball);
	margin-left: 0.3rem;
}
.toggle-switch.right {
	background: var(--toggle-switch-on-ball);
	margin-left: 3.25rem;
}
.toggle-background.disabled {
	background: var(--toggle-switch-disabled-background);
}
.toggle-switch.disabled {
	background: var(--toggle-switch-disabled-ball);
}
</style>