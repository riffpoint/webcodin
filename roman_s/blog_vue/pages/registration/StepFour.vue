<template>
  <div class="registration-step-wrap">
    <h2 class="step-title color-primary">{{ $t('pages.registration.step4title') }}</h2>
    <p class="text-paragraph"><b>{{ `${stepData.firstName} ${stepData.lastName}, ` }}</b>{{ `${$t('messages.welcomeTo')}` }}<b class="space-before">CompanyName</b></p>
    <p class="text-paragraph">{{ $t('messages.welcomeMessage') }}</p>
    <p class="text-paragraph">{{ $t('messages.welcomeMessage2') }}</p>
    <p class="form-notification form-notification-bottom pv-0 mt-2"></p>
    <div class="registration-actions justify-end form-end-padding">
      <button
        class="btn btn-primary next-btn btn-finish"
        @click="$emit('changeStep', {})"
      >
        {{ $t('vocabulary.finish') }}
      </button>
    </div>
  </div>
</template>

<script>
  export default {
    head () {
      return {
        title: this.$t('pages.registration.title')
      }
    },
    transition: {
      name: 'slide-fade',
      mode: 'out-in'
    },
    props: {
      stepTitle: {
        type: String,
        required: true
      },
      stepData: {
        type: Object
      }
    }
  }
</script>
