<template>
  <div class="notification" :class="`${type}-notification-message`">
    <button class="close-btn" @click="$emit('closeNotification')">Close</button>
    {{ message }}
  </div>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
  },
}
</script>
