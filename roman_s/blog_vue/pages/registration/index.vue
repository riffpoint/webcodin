<template>
  <div class="registration-step-wrap">
    <h2 class="step-title color-primary">{{ stepTitle }}</h2>
    <div class="registration-step-subtitle is-hidden-tablet">
      <button class="btn btn-with-icon facebook-button">
        <span class="btn-icon">
          <!-- <fa size="lg" :icon="['fab', 'facebook-f']"  /> -->
          <i class="lab la-facebook-f"></i>
        </span>
        <span class="btn-text">{{ $t('buttons.registerFacebook') }}</span>
      </button>
      <span>{{ $t('vocabulary.or') }}</span>
    </div>
    <div class="columns">
      <div class="column is-one-quarter">
        <div
          class="form-item-wrap"
          :class="{ 'form-item-error': $v.formOfAddress.$error }"
        >
          <label class="form-label-top">
            {{ $t('forms.formOfAddress') }}
            <span class="color-red required-mark">*</span></label>
          <div class="select-wrap form-item-input">
            <v-select
              :options="$i18n.messages[$i18n.locale].forms.formOfAddressOptions"
              v-model="formOfAddress"
              :placeholder="$i18n.messages[$i18n.locale].forms.selectPlaceholder"
              :components="{OpenIndicator}"
              :searchable="false"
              id="form-of-address"
            />
          </div>
          <p class="error-message" v-if="$v.formOfAddress.$error">{{ $t('forms.requiredError') }}</p>
        </div>
      </div>
      <div class="column">
        <div
          class="form-item-wrap"
          :class="{ 'form-item-error': $v.firstName.$error }"
        >
          <label class="form-label-top">
            {{ $t('forms.firstName') }}
            <span class="color-red required-mark">*</span>
            <input type="text" class="form-item-input text-input bordered-input" v-model.trim="firstName" :placeholder="$t('forms.firstNamePlaceholder')">
          </label>
          <p class="error-message" v-if="$v.firstName.$error">{{ $t('forms.requiredError') }}</p>
        </div>
      </div>
      <div class="column">
        <div
          class="form-item-wrap"
          :class="{ 'form-item-error': $v.lastName.$error }"
        >
          <label class="form-label-top">
            {{ $t('forms.lastName') }}
            <span class="color-red required-mark">*</span>
            <input type="text" class="form-item-input text-input bordered-input" v-model.trim="lastName" :placeholder="$t('forms.lastNamePlaceholder')">
          </label>
          <p class="error-message" v-if="$v.lastName.$error">{{ $t('forms.requiredError') }}</p>
        </div>
      </div>
    </div>
    <div class="add-file-block add-file-with-preview">
      <div class="profile-photo-wrap">
        <img class="profile-photo-image" :src="avatar || '/images/no-image-placeholder.png'" alt="">
      </div>
      <div class="form-item-wrap">
        <p class="form-label-top">
          {{ $t('forms.avatar') }}
        </p>
        <button class="btn btn-ghost-primary">{{ $t('forms.loadPicture') }}</button>
        <p class="form-notification">{{ $t('forms.maxImageSize') }}<span class="color-red">10 MB</span></p>
      </div>
    </div>
    <div class="columns">
      <div class="column is-12 form-item-wrap">
        <label class="form-label-top">
          {{ $t('vocabulary.username') }}
          <input type="text" class="form-item-input text-input bordered-input" v-model.trim="username">
        </label>
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
  import vSelect from 'vue-select'
  import { required } from 'vuelidate/lib/validators'
  
  export default {
    head () {
      return {
        title: this.$t('pages.registration.title')
      }
    },
    props: {
      stepTitle: {
        type: String,
        // required: true
      },
      stepData: {
        type: Object
      }
    },
    components: {
      vSelect
    },
    transition: {
      name: 'slide-fade',
      mode: 'out-in'
    },
    data () {
      return {
        formOfAddress: '',
        firstName: '',
        lastName: '',
        username: '',
        OpenIndicator: {
          render: createElement => createElement('span', {class: {'select-caret': true}}),
        },
        avatar: null,
        stepNumber: 0
      }
    },
    validations: {
      formOfAddress: { required },
      firstName: { required },
      lastName: { required },
    },
    created () {
      if (this.stepData) {
        this.stepData.formOfAddress ? this.formOfAddress = this.stepData.formOfAddress : null
        this.stepData.firstName ? this.firstName = this.stepData.firstName : null
        this.stepData.lastName ? this.lastName = this.stepData.lastName : null
        this.stepData.username ? this.username = this.stepData.username : null
      }
    },
    methods: {
      goForward (forward) {
        this.$v.$touch()
        if (this.$v.$invalid) {
          return;
        }
        const data = {
          forward,
          data: {
            formOfAddress: this.formOfAddress,
            firstName: this.firstName,
            lastName: this.lastName,
            username: this.username || `${this.firstName} ${this.lastName}`,
          }
        }
        this.$emit('changeStep', data)
      }
    },
    watch: {
      '$i18n.locale': function(newVal, oldVal) {
        if (this.formOfAddress) {
          const oldFOAIndex = this.$i18n.messages[oldVal].forms.formOfAddressOptions.findIndex(el => el === this.formOfAddress)
          this.formOfAddress = this.$i18n.messages[newVal].forms.formOfAddressOptions[oldFOAIndex]
        }
      }
    }
  }
</script>
