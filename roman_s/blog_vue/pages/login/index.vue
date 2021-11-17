<template>
  <div class="login-wrap">
    <div class="login-form-wrap bordered pa-2">
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
            @keyup.enter="submitForm"
            name="email"
            id="email"
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
            <nuxt-link :to="localePath({ name: 'login-recoverPassword' })" class="text-btn color-primary">{{ $t('pages.login.recoverTitle') }}</nuxt-link>
          </span>
          <span class="iconic-input-wrap icon-right">
            <input
              :type="passwordVisible ? 'text' : 'password'"
              class="form-item-input text-input bordered-input"
              v-model.trim="password"
              :placeholder="$t('forms.passwordPlaceholder')"
              id="password"
              name="password"
              @input="wrongPassword = false; formError = false"
              @keyup.enter="submitForm"
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
    </div>
    <div v-if="$route.name.split('___')[0] === 'login'" class="is-hidden-desktop login-footer-mobile bordered radiused pa-2 pb-20 text-center">
      <button class="btn btn-with-icon facebook-button mb-20">
        <span class="btn-icon">
          <!-- <fa size="lg" :icon="['fab', 'facebook-f']"  /> -->
          <i class="lab la-facebook-f"></i>
        </span>
        <span class="btn-text">{{ $t('buttons.registerFacebook') }}</span>
      </button>
      <p class="mb-1 divider-text">-<span>{{ $t('vocabulary.or') }}</span>-</p>
      <p class=""><span class="space-after">{{ $t('pages.login.footer1') }}</span><nuxt-link :to="localePath('registration')">{{ $t('pages.registration.pageTitle') }}</nuxt-link><span class="space-before">{{ $t('pages.login.footer2') }}</span></p>
    </div>
  </div>
</template>

<script>
import { required, email } from 'vuelidate/lib/validators'
export default {
  name: 'Login',
  head () {
    return {
      title: this.$t('pages.login.title')
    }
  }, 
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
  transition: {
    name: 'slide-fade',
    mode: 'out-in'
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
      } else {
        this.login()
      }
    },
    login () {
      this.$store.dispatch('auth-custom/login', { email: this.email, password: this.password })
        .then(() => {
          this.$router.push('/')
        })
        .catch(err => {
          if (err?.code?.toString().includes('user-not-found')) {
            this.wrongEmail = true
          }
          if (err.code?.toString().includes('wrong-password')) {
            this.wrongPassword = true
          }
        })
    }
  }
}
</script>
