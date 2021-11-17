<template>
  <div class="pagination">
    <button
      type="button"
      class="pagination__item pagination__item--prev"
      :class="{ 'pagination__item--disabled': currentPage === 1 }"
      @click="setPage(1)"
    >
      <i class="las la-angle-double-left"></i>
    </button>
    <button
      type="button"
      class="pagination__item pagination__item--prev"
      :class="{ 'pagination__item--disabled': currentPage === 1 }"
      @click="setPrevPage(currentPage - 1)"
    >
      <i class="las la-angle-left"></i>
    </button>

    <template v-for="(item, index) in list" :key="index">
      <button
        type="button"
        class="pagination__item"
        :class="{ 'pagination__item--active': currentPage === item }"
        v-if="item !== '...'"
        @click="setPage(item)"
      >
        {{ item }}
      </button>

      <button
        type="button"
        class="pagination__item"
        :class="{ 'pagination__item--active': currentPage === item }"
        v-if="item === '...' && index < 2"
        @click="setPrevPage(currentPage - 2)"
      >
        {{ item }}
      </button>

      <button
        type="button"
        class="pagination__item"
        :class="{ 'pagination__item--active': currentPage === item }"
        v-if="item === '...' && index > 2"
        @click="setNextPage(currentPage + 2)"
      >
        {{ item }}
      </button>
    </template>

    <button
      type="button"
      class="pagination__item pagination__item--next"
      :class="{ 'pagination__item--disabled': currentPage >= pages }"
      @click="setNextPage(currentPage + 1)"
    >
      <i class="las la-angle-right"></i>
    </button>
    <button
      type="button"
      class="pagination__item pagination__item--next"
      :class="{ 'pagination__item--disabled': currentPage >= pages }"
      @click="setPage(pages)"
    >
      <i class="las la-angle-double-right"></i>
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";

export default defineComponent({
  props: {
    pages: {
      type: Number,
      required: true,
    },
    currentPage: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    return {
      list: computed(() => {
        let newList = [];

        for (const [i] of new Array(props.pages).entries()) {
          if ((i < 5 && props.currentPage - 5 < 0) || props.pages <= 7) {
            newList.push(i + 1);
          }

          if (
            (i + 1 === props.currentPage - 1 ||
              i + 1 === props.currentPage ||
              i + 1 === props.currentPage + 1 ||
              (props.currentPage + 3 >= props.pages &&
                i + 1 + 3 >= props.pages)) &&
            props.currentPage > 4 &&
            props.pages > 7
          ) {
            newList.push(i + 1);
          }
        }

        if (props.pages > 7 && props.currentPage >= 5) {
          newList.unshift("...");
          newList.unshift(1);
        }

        if (
          props.pages > 7 &&
          props.pages !== 7 &&
          props.currentPage + 3 !== props.pages &&
          props.currentPage + 3 < props.pages
        ) {
          newList.push("...");
          newList.push(props.pages);
        }

        return newList;
      }),
    };
  },
  emits: ["update:currentPage"],
  methods: {
    setPage(page: number): void {
      this.$emit("update:currentPage", page);
    },
    setNextPage(page: number): void {
      if (this.currentPage < this.pages) {
        this.$emit("update:currentPage", page);
      }
    },
    setPrevPage(page: number): void {
      if (this.currentPage > 1) {
        this.$emit("update:currentPage", page);
      }
    },
  },
});
</script>
