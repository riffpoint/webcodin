<template>
  <div class="registration-step-wrap">
    <h2 class="step-title color-primary">{{ stepTitle }}</h2>
    <div class="columns is-multiline">
      <div class="column is-12">
        <div
          class="form-item-wrap"
          :class="{ 'form-item-error': $v.mood.$error }"
        >
          <label class="form-label-top input-with-counter">
            {{ $t('forms.moodTitle') }}
            <input type="text" class="form-item-input text-input bordered-input" v-model.trim="mood" maxlength="200">
            <span class="input-counter">{{ moodCount }}</span>
          </label>
          <p class="form-notification">{{ $t('forms.moodDescription') }}</p>
        </div>
      </div>
      <div class="column is-12 pb-0">
        <div class="form-item-wrap">
          <label class="form-label-top">
            {{ $t('forms.userInfoTitle') }}
          </label>
          <p class="form-notification">{{ $t('forms.userInfoDescription') }}</p>
          <div class="">
            <editor
              class="mt-6p"
              v-model="userInfo"
              :controls="['bold', 'italic', 'bullet-list']"
              :emitLength="true"
            />
          </div>
        </div>
      </div>
      <div class="column is-6 is-flex-grow-1 pt-0">
        
      </div>
    </div>
    <p class="form-notification form-notification-bottom">{{ $t('forms.requiredNotification1') }}<span class="color-red required-mark">*</span>{{ $t('forms.requiredNotification2') }}</p>
    <div class="registration-actions">
      <nuxt-link
        :to="localePath('/')"
        class="btn btn-ghost-grey cancel-button"
      >
        <span class="is-hidden-mobile">{{ $t('forms.cancel') }}</span>
        <span class="is-hidden-tablet cross-icon"></span>
      </nuxt-link>
      <button
          class="btn btn-primary next-btn"
          @click="goForward(true)"
        >
          <span class="is-hidden-mobile">{{ $t('forms.nextStep') }}</span>
          <span class="is-hidden-tablet">{{ $t('vocabulary.continue') }}</span>
      </button>
    </div>
  </div>
</template>

<script>
  import Editor from '@/components/ui/Editor'
  export default {
    props: {
      stepTitle: {
        type: String,
        required: true
      },
      stepData: {
        type: Object
      }
    },
    components: {
      Editor
    },
    validations () {
      return {
        mood: { maxLength: v => v ? v < 201 : true }
      }
    },
    data () {
      return {
        mood: '',
        userInfo: '',
      }
    },
    created () {
      if (this.stepData && this.stepData.phone) {
        this.phone = this.stepData.phone
        this.phoneReadonly = true
      }
    },
    computed: {
      moodCount () {
        return 200 - this.mood.length
      },
    },
    methods: {
      goForward () {
        const data = {}
        if (this.mood) data.mood = this.mood
        if (this.userInfo) data.userInfo = this.userInfo
        this.$emit('changeStep', { forward: true, data })
      }
    }
  }
</script>
