<template>
  <div class="test-page">
    <div class="collapse-toggler" @click="showCollapse = !showCollapse">Toggle</div>
    <collapse>
      <p v-show="showCollapse">Lorem ipsum, dolor sit amet consectetur adipisicing elit. At dolores animi nam obcaecati nihil odit officia reprehenderit, recusandae numquam minus sequi perspiciatis ad natus? Laudantium illo beatae modi excepturi fugit. Lorem ipsum, dolor sit amet consectetur adipisicing elit. At dolores animi nam obcaecati nihil odit officia reprehenderit, recusandae numquam minus sequi perspiciatis ad natus? Laudantium illo beatae modi excepturi fugit.</p>
    </collapse>

    <div class="input-wrap">
      <client-only>
        <b-datepicker
          :unselectable-dates="unselectableDates"
        />
      </client-only>
    </div>
  </div>
</template>

<script>
import Collapse from '~/components/ui/Collapse'
export default {
  components: {
    Collapse
  },
  data () {
    return {
      showCollapse: false,
      rentingFrom: ''
    }
  },
  computed: {
    unselectableDates() {
      return [new Date(2021, 4, 5), new Date(2021, 4, 6), new Date(2021, 4, 7)]
    }
  }
}
</script>

<style scoped lang="scss">
.test-page {
  padding: 50px;
}
.collapse-toggler {
  padding: 20px;
  border: 1px solid #ccc;
  font-size: 18px;
}
</style>
