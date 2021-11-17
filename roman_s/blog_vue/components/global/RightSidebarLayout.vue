<template>
  <div class="page-content-wrap" :class="pageClass" >
    <slot name="top-content" />
    <div class="with-sidebar with-right-sidebar">
      <div class="container container-md">
        <div class="columns is-desktop sidebar-layout-columns">
          <div class="column main-content" :class="contentClass">
            <slot name="main-content" />
          </div>
          <div class="sidebar sidebar-right column is-one-third-desktop" :class="sidebarClass">
            <slot name="sidebar-content" />
          </div>
        </div>
      </div>
    </div>
    <slot name="bottom-content" :class="bottomClass" />
  </div>
</template>

<script>
  export default {
    props: {
      pageClass: {
        type: String
      },
      sidebarClass: {
        type: String
      },
      contentClass: {
        type: String
      },
      bottomClass: {
        type: String
      }
    }
  }
</script>
