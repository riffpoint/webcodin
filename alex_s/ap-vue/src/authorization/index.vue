<template>
  <div class="auth">
    <div class="container-fluid">
      <div class="row">
        <div class="col-lg-5 sidebar">
          <div class="sidebar__inner">
            <div class="sidebar__top-line">Welcome to</div>
            <div class="sidebar__title">VueJS-based Administration Panel</div>
            <div class="sidebar__description">
              Developed by WebCoding Development Team - sub-division of Riff
              Point LLC.<br />
              Tech list: VueJS, Bootstrap 4, HTML 5, SAAS
            </div>
          </div>
          <div class="sidebar__copyright">
            &copy; 2021. Riff Point. All rights reserved.
          </div>
        </div>
        <div class="col-lg-7 content">
          <div class="content__inner">
            <router-view />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "authorization",
};
</script>
