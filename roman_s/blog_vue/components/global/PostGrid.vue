<template>
  <div class="post-grid">
    <div class="post-list columns is-multiline">
      <div class="column" :class="columnClass" v-for="i in onCurrentPage" :key="i">
        <post-card
          :post="objects[itemsPerPage*(current-1)+i-1]"
          :deletable="deletable"
          :editable="editable"
          @deletePost="deletePost"
          @updateGrid="$emit('updateGrid')"
        />
      </div>
    </div>
    <b-pagination
      v-if="showPagination"
      :total="total"
      :current.sync="current"
      range-before="1"
      range-after="1"
      order="is-centered"
      :simple="false"
      :rounded="false"
      :per-page="itemsPerPage"
      icon-prev="angle-left"
      icon-next="angle-right"
      aria-next-label="Next page"
      aria-previous-label="Previous page"
      aria-page-label="Page"
      aria-current-label="Current page"
      @change="changePage"
    >
      <template #previous="props">
        <b-pagination-button
          :page="props.page"
          tag="button">
          <span class="icon-angle-left"></span>
        </b-pagination-button>
      </template>
      <template #next="props">
        <b-pagination-button
          :page="props.page"
          tag="button">
          <span class="icon-angle-right"></span>
        </b-pagination-button>
      </template>
    </b-pagination>
  </div>
</template>

<script>
import PostCard from '@/components/global/PostCard'

export default {
  props: {
    objects: {
      type: Array,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    perPage: {
      type: Number,
      required: false,
    },
    perRow: {
      type: Number,
      required: false,
    },
    deletable: {
      type: Boolean,
      required: true
    },
    editable: {
      type: Boolean,
      required: true
    },
  },
  components: {
    PostCard
  },
  data () {
    return {
      current: 1,
    }
  },
  computed: {
    itemsPerPage () {
      return this.perPage || 12
    },
    columnClass () {
      switch (this.perRow) {
        case 2:
          return 'is-half'
        case 3:
          return 'is-one-third'
        case 4:
          return 'is-one-quarter'
        case 5:
          return 'is-one-fifth'
        default:
          return null
      }
    },
    onCurrentPage () {
      let count
      if (this.perPage) {
        count = this.objects.length - ((this.current - 1) * this.perPage)
        return count < this.perPage ? count : this.perPage
      } else {
        count = this.objects.length - ((this.current - 1) * 12)
        if (count < 0) {
          return this.objects.length
        }
        return count < 12 ? count : 12
      }
    },
    showPagination () {
      return this.total > this.itemsPerPage
    }
  },
  methods: {
    changePage (page) {
      this.current = page
    },
    deletePost (id) {
      this.$emit('deleteItem', id)
    }
  }
}
</script>
