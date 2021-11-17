<template>
  <form action="#" @submit.prevent="submitForm" @keyup.enter="submitForm" class="login-form-wrap bordered pa-2">
    <p class="login-title color-primary">{{ $t('vocabulary.login') }}</p>
    <div
      class="form-item-wrap mb-20"
      :class="{ 'form-item-error': $v.email.$error }"
    >
      <label class="form-label-top">
        {{ $t('forms.email') }}
        <span class="color-red required-mark">*</span>
        <input
          type="text"
          class="form-item-input text-input bordered-input"
          v-model.trim="email"
          :placeholder="$t('forms.emailPlaceholder')"
          @input="wrongEmail = false; formError = false"
        >
      </label>
      <div class="error-container" v-if="$v.email.$error || wrongEmail">
        <p class="error-message" v-if="!$v.email.required">{{ $t('forms.requiredError') }}</p>
        <p class="error-message" v-if="!$v.email.email">{{ $t('forms.emailError') }}</p>
        <p class="error-message" v-if="wrongEmail">{{ $t('forms.emailNotFound') }}</p>
      </div>
    </div>
    <div
      class="form-item-wrap mb-2"
      :class="{ 'form-item-error': $v.password.$error }"
    >
      <div class="form-label-top">
        <span class="form-label-text-wrap is-flex justify-between">
          <label for="mail" class="form-label-text">
            {{ $t('forms.password') }}
            <span class="color-red required-mark">*</span>
          </label>
          <button @click="$emit('forgotPassword')" class="text-btn color-primary">{{ $t('pages.login.recoverTitle') }}</button>
        </span>
        <span class="iconic-input-wrap icon-right">
          <input
            :type="passwordVisible ? 'text' : 'password'"
            class="form-item-input text-input bordered-input"
            v-model.trim="password"
            :placeholder="$t('forms.passwordPlaceholder')"
            id="mail"
            @input="wrongPassword = false; formError = false"
          >
          <span
            class="input-icon-wrap color-primary input-icon-right"
            :class="{ 'is-disabled': !password }"
            @click="passwordVisible = !passwordVisible"
          >
            <!-- <fa v-if="passwordVisible" :icon="['far', 'eye-slash']" />
            <fa v-else :icon="['far', 'eye']" /> -->
            <i v-if="passwordVisible" class="las la-eye-slash"></i>
            <i v-else class="las la-eye"></i>
          </span>
        </span>
      </div>
      <div class="error-container" v-if="$v.password.$error || wrongPassword">
        <p class="error-message" v-if="!$v.password.required">{{ $t('forms.requiredError') }}</p>
        <p class="error-message" v-if="wrongPassword">{{ $t('forms.incorrectPassword') }}</p>
      </div>
      <p class="error-message" v-if="formError">Something went wrong. Please try again</p>
    </div>
    <p class="form-notification form-notification-bottom mb-20">{{ $t('forms.requiredNotification1') }}<span class="color-red required-mark">*</span>{{ $t('forms.requiredNotification2') }}</p>
    <div class="is-flex justify-between">
      <button class="btn btn-ghost-grey" @click="$router.go(-1)">{{ $t('vocabulary.back') }}</button>
      <button class="btn btn-primary" @click="submitForm">{{ $t('vocabulary.login') }}</button>
    </div>
  </form>
</template>

<script>
import { required, email } from 'vuelidate/lib/validators'
export default {
  data () {
    return {
      email: '',
      password: '',
      passwordVisible: false,
      wrongPassword: false,
      wrongEmail: false,
      formError: false
    }
  },
  validations () {
    return {
      email: { required, email },
      password: { required }
    }
  },
  methods: {
    submitForm () {
      this.$v.$touch()
      if (this.$v.$invalid) {
        return;
      }
      this.login()
    },
    async login () {
      try {
        await this.$auth.loginWith('local', { data: { login: this.email, password: this.password } })
      } catch ({response}) {
        if (response.data.message.toLowerCase().includes('invalid email')) {
          this.wrongEmail = true
        } else if (response.data.message.toLowerCase().includes('invalid password')) {
          this.wrongPassword = true
        } else {
          this.formError = true
        }
      }
    }
  }
}
</script>
