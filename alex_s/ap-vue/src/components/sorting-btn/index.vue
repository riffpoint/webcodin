<template>
  <div class="sorting-btn">
    <i
      class="fa fa-long-arrow-down sort-btn__item"
      :class="{ 'sorting-btn__item--active': sortedBy === false }"
      aria-hidden="true"
    ></i>
    <i
      class="fa fa-long-arrow-up table__header__item__sort-btn__item"
      :class="{ 'sorting-btn__item--active': sortedBy === true }"
      aria-hidden="true"
    ></i>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    sortedBy: Boolean,
  },
});
</script>
