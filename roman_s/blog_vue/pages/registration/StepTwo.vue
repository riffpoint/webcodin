<template>
  <div class="registration-step-wrap">
    <h2 class="step-title color-primary">{{ stepTitle }}</h2>
    <div class="columns is-multiline">
      <div class="column is-12">
        <div
          class="form-item-wrap"
          :class="{ 'form-item-error': $v.email.$error }"
        >
          <label class="form-label-top">
            {{ $t('forms.email') }}
            <span class="color-red required-mark">*</span>
            <input type="text" class="form-item-input text-input bordered-input" v-model.trim="email" :placeholder="$t('forms.emailPlaceholder')">
          </label>
          <div class="error-container" v-if="$v.email.$error">
            <p class="error-message" v-if="!$v.email.required">{{ $t('forms.requiredError') }}</p>
            <p class="error-message" v-if="!$v.email.email">{{ $t('forms.emailError') }}</p>
          </div>
        </div>
      </div>
      <div class="column">
        <div
          class="form-item-wrap"
          :class="{ 'form-item-error': $v.password.$error }"
        >
          <label class="form-label-top">
            {{ $t('forms.password') }}
            <span class="color-red required-mark">*</span>
            <span class="iconic-input-wrap icon-right">
              <input
                :type="passwordVisible ? 'text' : 'password'"
                class="form-item-input text-input bordered-input"
                v-model.trim="password"
                :placeholder="$t('forms.passwordPlaceholder')"
              >
              <span
                class="input-icon-wrap input-icon-right color-primary"
                :class="{ 'is-disabled': !password }"
                @click="passwordVisible = !passwordVisible"
              >
                <!-- <fa v-if="passwordVisible" :icon="['far', 'eye-slash']" />
                <fa v-else :icon="['far', 'eye']" /> -->
                <i v-if="passwordVisible" class="las la-eye-slash"></i>
                <i v-else class="las la-eye"></i>
              </span>
            </span>
          </label>
          <div class="error-container" v-if="$v.password.$error">
            <p class="error-message" v-if="!$v.password.required">{{ $t('forms.requiredError') }}</p>
            <p class="error-message" v-else>{{ $t('forms.passwordRequirementError') }}</p>
          </div>
        </div>
      </div>
      <div class="column">
        <div
          class="form-item-wrap"
          :class="{ 'form-item-error': $v.passwordConfirm.$error }"
        >
          <label class="form-label-top">
            {{ $t('forms.passwordConfirm') }}
            <span class="color-red required-mark">*</span>
            <span class="iconic-input-wrap icon-right">
              <input
                :type="passwordConfirmVisible ? 'text' : 'password'"
                class="form-item-input text-input bordered-input"
                v-model.trim="passwordConfirm"
                :placeholder="$t('forms.passwordConfirmPlaceholder')"
              >
              <span
                class="input-icon-wrap input-icon-right color-primary"
                :class="{ 'is-disabled': !passwordConfirm }"
                @click="passwordConfirmVisible = !passwordConfirmVisible">
                <!-- <fa v-if="passwordConfirmVisible" :icon="['far', 'eye-slash']" />
                <fa v-else :icon="['far', 'eye']" /> -->
                <i v-if="passwordConfirmVisible" class="las la-eye-slash"></i>
                <i v-else class="las la-eye"></i>
              </span>
            </span>
          </label>
          <div class="error-container" v-if="$v.passwordConfirm.$error">
            <p class="error-message" v-if="!$v.passwordConfirm.required">{{ $t('forms.requiredError') }}</p>
            <p class="error-message" v-if="!$v.passwordConfirm.sameAsPassword">{{ $t('forms.passwordConfirmError') }}</p>
          </div>
        </div>
      </div>
      <div class="column is-12">
        <div
          class="form-item-wrap"
          :class="{ 'form-item-error': $v.phone.$error }"
        >
          <label class="form-label-top">
            {{ $t('forms.phoneNumber') }}
            <span class="color-red required-mark">*</span>
            <span class="iconic-input-wrap icon-lg icon-left">
              <input
                type="tel"
                v-mask="phoneParams.mask"
                class="form-item-input text-input bordered-input"
                v-model.trim="phone"
                :placeholder="$t('forms.phoneNumberPlaceholder')"
              >
              <span class="input-icon-wrap input-icon-left input-icon-wrap-lg">
                <span class="phone-flag" :class="phoneParams ? `country-${phoneParams.country}` : null"></span>
              </span>
            </span>
          </label>
          <p class="error-message" v-if="$v.phone.$error">{{ $t('forms.requiredError') }}</p>
          <p class="form-notification">{{ $t('forms.phoneNumberDescription') }}<b>07X XXX XX XX</b><span class="text-lowercase">{{ $t('vocabulary.or') }}</span><b>41 7X XXX XX XX</b><span>{{ $t('vocabulary.forThe') }}</span><b>{{ $t('vocabulary.swiss') }}</b><span>{{ $t('vocabulary.and') }}</span><b>423 XXX XX XX</b><span>{{ $t('vocabulary.for') }}</span><b>Liechtenstein</b>.</p>
        </div>
      </div>
    </div>
    <div class="columns">
      <div class="column is-12">
        <div class="form-item-wrap">
          <div class="form-label-top">
            {{ $t('vocabulary.pleaseChoose') }}
          </div>
          <div class="checkbox-list">
            <label class="checkbox-item-wrap">
              <input type="checkbox" class="checkbox-input" v-model="newsletterSubscribe">
              <span class="checkbox-input-label"><span class="checkbox-label-text">{{ $t('forms.newsletterSubscribe') }}</span></span>
            </label>
            <label class="checkbox-item-wrap">
              <input type="checkbox" class="checkbox-input" v-model="terms">
              <span class="checkbox-input-label">
                <span class="checkbox-label-text">
                  <span class="space-after">{{ $t('forms.termsDescription1') }}</span>
                  <a href="#" target="_blank">{{ $t('vocabulary.terms') }}</a>
                  <span class="space-before space-after">{{ $t('forms.termsDescription2') }}</span>
                  <a href="#" target="_blank">{{ $t('vocabulary.privacyPolicy') }}</a>
                  <span class="space-before">{{ $t('forms.termsDescription3') }}</span>
                  <span class="color-red required-mark">*</span>
                </span>
              </span>
            </label>
          </div>
          <p class="error-message" v-if="$v.terms.$anyDirty && !$v.terms.checked">Please acccept Terms and Conditions</p>
        </div>
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
      <div class="step-actions">
        <button
          class="btn btn-ghost-primary btn-borderless back-btn"
          @click="goForward(false)"
        >
          {{ $t('vocabulary.back') }}
        </button>
        <button
          class="btn btn-primary next-btn"
          @click="goForward(true)"
        >
          <span class="is-hidden-mobile">{{ $t('forms.nextStep') }}</span>
          <span class="is-hidden-tablet">{{ $t('vocabulary.continue') }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
  import { required, requiredIf, email, minLength, sameAs } from 'vuelidate/lib/validators'
  const passwordRules = (value) => /(?=.*[A-Z])(?=.*[0-9])/.test(value)

  export default {
    head () {
      return {
        title: this.$t('pages.registration.title')
      }
    },
    props: {
      stepTitle: {
        type: String,
        required: true
      },
      stepData: {
        type: Object
      }
    },
    transition: {
      name: 'slide-fade',
      mode: 'out-in'
    },
    data () {
      return {
        email: '',
        phone: '',
        password: '',
        passwordConfirm: '',
        newsletterSubscribe: false,
        terms: false,
        passwordVisible: false,
        passwordConfirmVisible: false,
      }
    },
    validations () {
      return  {
        email: { required, email },
        phone: { required, minLength: minLength(this.phoneParams.mask.length) },
        password: { required, minLength: minLength(6), passwordRules },
        passwordConfirm: { required, sameAsPassword: sameAs('password') },
        terms: { checked: sameAs(() => true) },
        vatPrefix: { required: requiredIf(function(){return this.vatSubject}) },
        vatNumber: { required: requiredIf(function(){return this.vatSubject}) }
      }
    },
    computed: {
      phoneParams () {
        if (this.phone[0] === '0') {
          if (!this.phone[1] || this.phone[1] === '7') {
            return {
              country: 'swiss',
              mask: '### ### ## ##'
            }
          } else {
            this.phone = '0'
            return {
              country: 'swiss',
              mask: '0'
            }
          }
          
        } else if (this.phone[0] === '4') {
          if (this.phone[1] === '2') {
            if (!this.phone[2] || this.phone[2] === '3') {
              return {
                country: 'liechtenstein',
                mask: '### ### ## ##'
              }
            } else {
              this.phone = '42'
              return {
                country: 'liechtenstein',
                mask: '42'
              }
            }
          } else if (this.phone[1] === '1') {
            if (!this.phone[2] || (this.phone[2] === '7' || (this.phone[2] === ' ' && this.phone[3] === '7'))) {
              return {
                country: 'swiss',
                mask: '## ## ### ## ##'
              }
            } else {
              this.phone = '41 '
              return {
                country: 'swiss',
                mask: '41 #'
              }
            }
          } else if (!this.phone[1]) {
            return {
              mask: '### ### ## ##',
              country: 'default'
            }
          } else {
            this.phone = '4'
            return {
              mask: '4',
              country: 'default'
            }
          }
        } else {
          this.phone = ''
          return {
            mask: '#',
            country: 'default'
          }
        }
      }
    },
    methods: {
      goForward (forward) {
        console.log('forward', forward)
        if (forward) {
          this.$v.$touch();
          if (this.$v.$invalid) {
            return;
          }
        }
        const data = {
          forward,
          data: {
            email: this.email,
            phone: this.phone,
            password: this.password,
            vatSubject: this.vatSubject,
            newsletterSubscribe: this.newsletterSubscribe,
            terms: this.terms,
            vatPrefix: this.vatPrefix,
            vatNumber: this.vatNumber
          }
        }
        this.$emit('changeStep', data)
      }
    }
  }
</script>
