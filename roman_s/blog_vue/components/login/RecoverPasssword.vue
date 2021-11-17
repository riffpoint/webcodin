<template>
  <div class="login-form-wrap password-recovery-form bordered pa-2">
    <p class="login-title color-primary mb-2">{{ $t('pages.login.recoverTitle') }}</p>
    <div class="short-info icon-left mb-20">
      <div class="short-info-icon mr-2">
        <div class="icon-wrap icon-wrap-round color-primary">
          <!-- <fa :icon="['fas', 'info']" size="sm" /> -->
          <i class="las la-info-circle"></i>
        </div>
      </div>
      <div class="short-info-text">
        <p>{{ $t('pages.login.recoverInfo1') }}</p>
        <p>{{ $t('pages.login.recoverInfo2') }}</p>
        <p>{{ $t('pages.login.recoverInfo3') }}</p>
      </div>
    </div>
    <div
      class="form-item-wrap mb-2"
      :class="{ 'form-item-error': $v.email.$error }"
    >
      <label class="form-label-top">
        {{ $t('forms.email') }}
        <span class="color-red required-mark">*</span>
        <input type="text" class="form-item-input text-input bordered-input" v-model.trim="email" :placeholder="$t('forms.emailPlaceholder')">
      </label>
      <div class="error-container" v-if="$v.email.$error || wrongEmail">
        <p class="error-message" v-if="!$v.email.required">{{ $t('forms.requiredError') }}</p>
        <p class="error-message" v-if="!$v.email.email">{{ $t('forms.emailError') }}</p>
        <p class="error-message" v-if="wrongEmail">{{ $t('forms.emailNotFound') }}</p>
      </div>
    </div>
    <p class="form-notification form-notification-bottom mb-2">{{ $t('forms.requiredNotification1') }}<span class="color-red required-mark">*</span>{{ $t('forms.requiredNotification2') }}</p>
    <div class="form-actions is-flex justify-between">
      <button class="btn btn-ghost-grey" @click="$emit('toLogin')"><span class="is-hidden-mobile">{{ $t('buttons.backToLogin') }}</span><span class="is-hidden-tablet">{{ $t('vocabulary.back') }}</span></button>
      <button class="btn btn-primary">{{ $t('buttons.sendMail') }}</button>
    </div>
  </div>
</template>

<script>
import { required, email } from 'vuelidate/lib/validators'
export default {
  data () {
    return {
      email: '',
      wrongEmail: false
    }
  },
  validations: {
    email: { required, email },
  },
  methods: {
    sendMail () {
      this.$v.$touch()
      if (this.$v.$invalid) {
        return;
      }
      console.log(`mail ${this.email} sent`)
    }
  }
}
</script>
