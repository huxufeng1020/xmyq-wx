<!-- 外链,webview -->
<template>
	<view><web-view :src="webviewPath"></web-view></view>
</template>

<script>
export default {
	data() {
		return {
			webviewPath: ''
		};
	},
	onLoad(option) {
		this.webviewPath = option.webviewPath;
	}
};
</script>

<style></style>
