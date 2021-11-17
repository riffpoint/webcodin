<template>
  <div class="popup-overlay">
    <div class="popup-content transition-element">
      <div class="popup-content-inner">
        <button class="popup-close" @click="$emit('close-popup')">Close</button>
        <slot name="popup-title"></slot>
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    
  }
</script>
