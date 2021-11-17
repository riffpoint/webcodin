<template>
  <div class="steps-wrap">
    <div class="steps-mobile" v-if="activeStep < titlesArray.length">
      <span class="step-title">{{ $t(`${titlesArrayAddress}[${activeStep}]`) }}</span>
    </div>
    <div class="container container-md">
      <div class="columns is-mobile">
        <div
          v-for="(item, index) in titlesArray"
          :key="item"
          class="column step-title-wrap"
          :class="{ 'step-active': activeStep === index, 'step-successful': finishedSteps.includes(index) && activeStep !== index }"
        >
          <span class="step-title">{{ $t(`${titlesArrayAddress}[${index}]`) }}</span>
          <span class="step-number">{{ index + 1 }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      titlesArrayAddress: {
        type: String,
        required: true,
      },
      titlesArray: {
        type: Array,
        required: true,
      },
      finishedSteps: {
        type: Array,
        required: true,
      },
      activeStep: {
        type: Number,
        required: true,
      },
    }
  }
</script>
