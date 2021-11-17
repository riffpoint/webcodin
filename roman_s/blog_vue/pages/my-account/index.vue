<template>
  <div class="edit-account-page">
    <div class="banner" style="background-image: url(/images/registration-banner.jpg)">
      <div class="container container-md">
        <div class="banner-left banner-content">
          <p class="banner-title banner-title-small">{{ $t('pages.myAccount.bannerTitle') }}</p>
          <p class="banner-subtitle-small">{{ $t('pages.myAccount.bannerSubtitle') }}</p>
        </div>
      </div>
    </div>
    <div class="page-content" v-if="user">
      <div class="container container-md">
        <div class="columns is-desktop">
          <div class="account-sidebar is-one-quarter-desktop column">
            <div class="sidebar-user-info primary-bg pa-2">
              <div class="avatar-wrap">
                <img :src="user.avatar || '/images/no-avatar.png'" :alt="`${user.firstname} ${user.lastname}`">
              </div>
              <p class="username">{{ `${user.firstname} ${user.lastname}` }}</p>
              <stars-rating
                active-color="#202326"
                inactive-color="#fff"
                :increment="0.1"
                :read-only="true"
                :rating="user.rating || 0" :show-rating="false"
                :star-points="[47.399903125,19.6044921875, 31.5063484375,17.926025, 25,3.3325203125, 18.493653125,17.926025, 2.6000984375,19.6044921875, 14.4714359375,30.3039546875, 11.1572265625,45.935059375, 25,37.9516609375, 38.8427734375,45.935059375, 35.5285640625,30.3039546875]"
              />
            </div>
            <div class="account-sidebar-body">
              <p class="account-sidebar-title">Sharing</p>
              <table class="table-invisible sidebar-table">
                <tbody>
                  <tr>
                    <td class="table-title"><nuxt-link class="router-link" :to="localePath('/')">{{ $t('vocabulary.leaseRequests') }}</nuxt-link></td>
                    <td><span class="badge badge-wide badge-grey">{{ user.leaseRequests || 12 }}</span></td>
                  </tr>
                  <tr>
                    <td class="table-title"><nuxt-link class="router-link" :to="localePath('/')">{{ $t('vocabulary.rentRequests') }}</nuxt-link></td>
                    <td><span class="badge badge-wide badge-grey">{{ user.rentRequests || 12 }}</span></td>
                  </tr>
                  <tr>
                    <td class="table-title"><nuxt-link class="router-link" :to="localePath('/')">{{ $t('vocabulary.messages') }}</nuxt-link></td>
                    <td><span class="badge badge-wide badge-primary">{{ user.messages || 50 }}</span></td>
                  </tr>
                  <tr>
                    <td class="table-title"><nuxt-link class="router-link" :to="localePath('myObjects')">{{ $t('vocabulary.myObjects') }}</nuxt-link></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td class="table-title"><nuxt-link class="router-link" :to="localePath('newObject')">{{ $t('vocabulary.uploadNewObject') }}</nuxt-link></td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
              <p class="account-sidebar-title mt-1">{{ $t('pages.myAccount.bannerTitle') }}</p>
              <ul class="sidebar-menu">
                <li class="sidebar-menu-item">
                  <nuxt-link :to="localePath('/')" class="router-link">{{ $t('userMenu.menu3.items.dashboard') }}</nuxt-link>
                </li>
                <li class="sidebar-menu-item">
                  <nuxt-link :to="localePath('/')" class="active router-link">{{ $t('userMenu.menu3.items.myAccount') }}</nuxt-link>
                </li>
                <li class="sidebar-menu-item">
                  <nuxt-link :to="localePath('/')" class="router-link">{{ $t('userMenu.menu3.items.reviews') }}</nuxt-link>
                </li>
              </ul>
              <div class="bordered-top mt-2 pt-2 is-flex justify-end">
                <button class="btn btn-ghost-primary btn-sm" @click="logout">LOGOUT</button>
              </div>
            </div>
          </div>
          <div class="column">
            <p class="page-title">{{ $t('userMenu.menu3.items.myAccount') }}</p>
            <b-tabs class="account-tabs" v-model="activeTab" v-if="!accountDeleted">

              <!-- Personal Info Tab -->
              <b-tab-item :label="$t('pages.myAccount.personalInfo')">
                <div class="columns">
                  <div class="column is-one-quarter limited-width">
                    <div
                      class="form-item-wrap"
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
                    </div>
                  </div>
                  <div class="column">
                    <div
                      class="form-item-wrap"
                      :class="{ 'form-item-error': $v.firstname.$error }"
                    >
                      <label class="form-label-top">
                        {{ $t('forms.firstName') }}
                        <span class="color-red required-mark">*</span>
                        <input type="text" class="form-item-input text-input bordered-input" v-model.trim="firstname" :placeholder="$t('forms.firstNamePlaceholder')">
                      </label>
                      <p class="error-message" v-if="$v.firstname.$error">{{ $t('forms.requiredError') }}</p>
                    </div>
                  </div>
                  <div class="column">
                    <div
                      class="form-item-wrap"
                      :class="{ 'form-item-error': $v.lastname.$error }"
                    >
                      <label class="form-label-top">
                        {{ $t('forms.lastName') }}
                        <span class="color-red required-mark">*</span>
                        <input type="text" class="form-item-input text-input bordered-input" v-model.trim="lastname" :placeholder="$t('forms.lastNamePlaceholder')">
                      </label>
                      <p class="error-message" v-if="$v.lastname.$error">{{ $t('forms.requiredError') }}</p>
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
                      <input type="text" class="form-item-input text-input bordered-input" v-model.trim="username" :placeholder="$t('vocabulary.username')">
                    </label>
                  </div>
                </div>
                <div class="form-actions">
                  <nuxt-link
                    :to="localePath('/')"
                    class="btn btn-ghost-grey cancel-button"
                  >
                    <span class="is-hidden-mobile">{{ $t('forms.cancel') }}</span>
                    <span class="is-hidden-tablet cross-icon"></span>
                  </nuxt-link>
                  <button
                    class="btn btn-primary save-btn"
                    @click="submitData"
                  >
                    <span>{{ $t('buttons.save') }}</span>
                  </button>
                </div>
              </b-tab-item>

              <!-- Access Data Tab -->
              <b-tab-item :label="$t('pages.myAccount.contact')">
                <div class="columns">
                  <div class="column">
                    <div
                      class="form-item-wrap"
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
                        >
                      </label>
                      <div class="error-container" v-if="$v.email.$error">
                        <p class="error-message" v-if="!$v.email.required">{{ $t('forms.requiredError') }}</p>
                        <p class="error-message" v-if="!$v.email.email">{{ $t('forms.emailError') }}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="columns">
                  <div class="column">
                    <div
                      class="form-item-wrap"
                    >
                      <label class="form-label-top">
                        {{ $t('forms.currentPassword') }}
                        <span class="color-red required-mark">*</span>
                        <span class="iconic-input-wrap icon-right">
                          <input
                            :type="oldPasswordVisible ? 'text' : 'password'"
                            class="form-item-input text-input bordered-input"
                            v-model.trim="oldPassword"
                            :placeholder="$t('forms.passwordPlaceholder')"
                            @input="passwordError = false"
                          >
                          <span
                            class="input-icon-wrap input-icon-right color-primary"
                            :class="{ 'is-disabled': !oldPassword }"
                            @click="oldPasswordVisible = !oldPasswordVisible"
                          >
                            <i v-if="oldPasswordVisible" class="las la-eye-slash"></i>
                            <i v-else class="las la-eye"></i>
                          </span>
                        </span>
                      </label>
                      <div v-if="passwordError" class="error-container">
                        <p class="error-message" v-if="passwordError">{{ passwordErrorMessage }}</p>
                      </div>
                    </div>
                  </div>
                  <div class="column">
                    <div
                      class="form-item-wrap"
                      :class="{ 'form-item-error': $v.newPassword.$error }"
                    >
                      <label class="form-label-top">
                        {{ $t('forms.newPassword') }}
                        <span class="color-red required-mark">*</span>
                        <span class="iconic-input-wrap icon-right">
                          <input
                            :type="newPasswordVisible ? 'text' : 'password'"
                            class="form-item-input text-input bordered-input"
                            v-model.trim="newPassword"
                            :placeholder="$t('forms.passwordPlaceholder')"
                          >
                          <span
                            class="input-icon-wrap input-icon-right color-primary"
                            :class="{ 'is-disabled': !newPassword }"
                            @click="newPasswordVisible = !newPasswordVisible"
                          >
                            <i v-if="newPasswordVisible" class="las la-eye-slash"></i>
                            <i v-else class="las la-eye"></i>
                          </span>
                        </span>
                      </label>
                      <div class="error-container" v-if="$v.newPassword.$error">
                        <p class="error-message" v-if="!$v.newPassword.passwordRules">{{ $t('forms.passwordRequirementError') }}</p>
                        <p class="error-message" v-if="!$v.newPassword.notOld">New password should not be the same as old one</p>
                      </div>
                    </div>
                  </div>
                  <div class="column">
                    <div
                      class="form-item-wrap"
                      :class="{ 'form-item-error': $v.newPasswordConfirm.$error }"
                    >
                      <label class="form-label-top">
                        {{ $t('forms.newPasswordConfirm') }}
                        <span class="color-red required-mark">*</span>
                        <span class="iconic-input-wrap icon-right">
                          <input
                            :type="newPasswordConfirmVisible ? 'text' : 'password'"
                            class="form-item-input text-input bordered-input"
                            v-model.trim="newPasswordConfirm"
                            :placeholder="$t('forms.passwordConfirmPlaceholder')"
                          >
                          <span
                            class="input-icon-wrap input-icon-right color-primary"
                            :class="{ 'is-disabled': !newPasswordConfirm }"
                            @click="newPasswordConfirmVisible = !newPasswordConfirmVisible"
                          >
                            <!-- <fa v-if="newPasswordConfirmVisible" :icon="['far', 'eye-slash']" />
                            <fa v-else :icon="['far', 'eye']" /> -->
                            <i v-if="newPasswordConfirmVisible" class="las la-eye-slash"></i>
                            <i v-else class="las la-eye"></i>
                          </span>
                        </span>
                      </label>
                      <div class="error-container" v-if="$v.newPasswordConfirm.$error">
                        <p class="error-message" v-if="!$v.newPasswordConfirm.sameAsPassword">{{ $t('forms.passwordConfirmError') }}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="columns">
                  <div class="column is-12">
                    <div
                      class="form-item-wrap"
                      :class="{ 'form-item-error': $v.phone.$error }"
                    >
                      <label class="form-label-top">
                        {{ $t('forms.phoneNumber') }}
                        <span class="color-red required-mark">*</span>
                        <span class="iconic-input-wrap icon-lg icon-left icon-right">
                          <input
                            type="tel"
                            v-mask="phoneParams.mask"
                            class="form-item-input text-input bordered-input"
                            v-model.trim="phone"
                            :placeholder="$t('forms.phoneNumberPlaceholder')"
                            :readonly="!editPhone"
                          >
                          <span class="input-icon-wrap input-icon-wrap-lg input-icon-left">
                            <span class="phone-flag" :class="phoneParams ? `country-${phoneParams.country}` : null"></span>
                          </span>
                          <button @click="editPhone = !editPhone" class="input-icon-wrap input-icon-right" :class="`color-${editPhone ? 'primary' : 'grey-01'}`">
                            <!-- <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M 24.6875 4.03125 C 23.851563 4.03125 23.039063 4.367188 22.40625 5 L 22.3125 5.09375 L 21.6875 4.5 L 5.1875 21 L 5.125 21.3125 L 4.03125 26.8125 L 3.71875 28.28125 L 5.1875 27.96875 L 10.6875 26.875 L 11 26.8125 L 27.5 10.3125 L 26.90625 9.71875 L 26.96875 9.65625 L 27 9.59375 C 28.265625 8.328125 28.265625 6.265625 27 5 C 26.367188 4.367188 25.523438 4.03125 24.6875 4.03125 Z M 24.6875 6 C 25 6 25.328125 6.140625 25.59375 6.40625 C 26.128906 6.941406 26.128906 7.652344 25.59375 8.1875 L 25.5 8.28125 L 23.71875 6.5 L 23.8125 6.40625 C 24.078125 6.140625 24.375 6 24.6875 6 Z M 21.71875 7.3125 L 24.6875 10.28125 L 23.25 11.75 L 20.25 8.75 Z M 18.875 10.1875 L 21.8125 13.125 L 11.375 23.59375 L 10.96875 21.78125 L 10.84375 21.15625 L 10.21875 21.03125 L 8.40625 20.625 Z M 6.96875 22.34375 L 9.15625 22.84375 L 9.65625 25.03125 L 7.625 25.4375 L 6.5625 24.375 Z"/></svg> -->
                            <i class="las la-pencil-alt"></i>
                          </button>
                        </span>
                      </label>
                      <p class="error-message" v-if="$v.phone.$error">{{ $t('forms.requiredError') }}</p>
                      <p class="form-notification">{{ $t('forms.phoneNumberDescription') }}<b>07X XXX XX XX</b><span class="text-lowercase">{{ $t('vocabulary.or') }}</span><b>41 7X XXX XX XX</b><span>{{ $t('vocabulary.forThe') }}</span><b>{{ $t('vocabulary.swiss') }}</b><span>{{ $t('vocabulary.and') }}</span><b>423 XXX XX XX</b><span>{{ $t('vocabulary.for') }}</span><b>Liechtenstein</b>.</p>
                    </div>
                  </div>
                </div>
                <p class="form-notification form-notification-bottom">{{ $t('forms.requiredNotification1') }}<span class="color-red required-mark">*</span>{{ $t('forms.requiredNotification2') }}</p>
                <div class="form-actions">
                  <nuxt-link
                    :to="localePath('/')"
                    class="btn btn-ghost-grey cancel-button"
                  >
                    <span class="is-hidden-mobile">{{ $t('forms.cancel') }}</span>
                    <span class="is-hidden-tablet cross-icon"></span>
                  </nuxt-link>
                  <button
                    class="btn btn-primary save-btn"
                    @click="submitData"
                  >
                    <span>{{ $t('buttons.save') }}</span>
                  </button>
                </div>
              </b-tab-item>

              <!-- Contact Info Tab -->
              <b-tab-item :label="$t('pages.myAccount.userInfo')">
                <div class="columns is-multiline">
                  <div class="column is-12 mb-2">
                    <div
                      class="form-item-wrap"
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
                </div>
                <p class="form-notification form-notification-bottom">{{ $t('forms.requiredNotification1') }}<span class="color-red required-mark">*</span>{{ $t('forms.requiredNotification2') }}</p>
                <div class="form-actions">
                  <nuxt-link
                    :to="localePath('/')"
                    class="btn btn-ghost-grey cancel-button"
                  >
                    <span class="is-hidden-mobile">{{ $t('forms.cancel') }}</span>
                    <span class="is-hidden-tablet cross-icon"></span>
                  </nuxt-link>
                  <button
                    class="btn btn-primary save-btn"
                    @click="submitData"
                  >
                    <span>{{ $t('buttons.save') }}</span>
                  </button>
                </div>
              </b-tab-item>

              <!-- Payment Tab -->
              <!-- <b-tab-item :label="$t('pages.myAccount.paymentDetails')">
                <div class="columns">
                  <div class="column is-12 pb-0">
                    <div class="form-label-top">
                      {{ $t('forms.vatSubject') }}
                      <span class="color-red required-mark">*</span>
                    </div>
                  </div>
                </div>
                <div class="columns is-mobile is-multiline">
                  <div class="column is-one-quarter-desktop is-full-mobile">
                    <div class="radio-buttons-row">
                      <label class="radio-input-wrap">
                        <input type="radio" class="radio-input" name="vat-subject" :value="false" v-model="vatSubject">
                        <span class="radio-input-label">{{ $t('vocabulary.no') }}</span>
                      </label>
                      <label class="radio-input-wrap">
                        <input type="radio" class="radio-input" name="vat-subject" :value="true" v-model="vatSubject">
                        <span class="radio-input-label">{{ $t('vocabulary.yes') }}</span>
                      </label>
                    </div>
                  </div>
                  <div class="column is-one-quarter-desktop is-one-third-mobile pr-0-mobile" v-if="vatSubject">
                    <input
                      type="text"
                      class="form-item-input text-input bordered-input"
                      v-model.trim="vatPrefix"
                      placeholder="CHE"
                    >
                    <p class="error-message" v-if="!$v.vatPrefix.required">{{ $t('forms.requiredError') }}</p>
                  </div>
                  <div class="column" v-if="vatSubject">
                    <input
                      type="text"
                      class="form-item-input text-input bordered-input"
                      v-model.trim="vatNumber"
                      placeholder="123.456.789"
                    >
                    <p class="error-message" v-if="!$v.vatNumber.required">{{ $t('forms.requiredError') }}</p>
                  </div>
                </div>
                <div class="columns">
                  <div class="column is-12 pb-0">
                    <p class="form-notification mv-0">{{ $t('forms.vatSubjectDescription') }}</p>
                  </div>
                </div>
                <p class="account-subsection-title color-primary">{{ $t('forms.payment') }}</p>
                <div class="columns">
                  <div class="column is-12">
                    <div
                      class="form-item-wrap"
                      :class="{ 'form-item-error': $v.iban.$error }"
                    >
                      <label class="form-label-top">
                        IBAN
                        <input type="text" v-mask="'AA#####################'" class="form-item-input text-input bordered-input" v-model.trim="iban" :placeholder="$t('forms.firstnamePlaceholder')">
                      </label>
                      <p class="form-notification">{{ $t('forms.paymentNotification') }}</p>
                      <p class="error-message" v-if="$v.iban.$error">{{ $t('forms.ibanError') }}</p>
                    </div>
                  </div>
                </div>
                <p class="form-notification form-notification-bottom mt-2">{{ $t('forms.requiredNotification1') }}<span class="color-red required-mark">*</span>{{ $t('forms.requiredNotification2') }}</p>
                <div class="form-actions">
                  <nuxt-link
                    :to="localePath('/')"
                    class="btn btn-ghost-grey cancel-button"
                  >
                    <span class="is-hidden-mobile">{{ $t('forms.cancel') }}</span>
                    <span class="is-hidden-tablet cross-icon"></span>
                  </nuxt-link>
                  <button
                    class="btn btn-primary save-btn"
                    @click="submitData"
                  >
                    <span>{{ $t('buttons.save') }}</span>
                  </button>
                </div>
              </b-tab-item> -->

              <!-- Delete Account Tab -->
              <b-tab-item :label="$t('pages.myAccount.deleteAccount')">
                <div class="short-info icon-left">
                  <div class="short-info-icon">
                    <div class="icon-wrap color-red">
                      <!-- <fa :icon="['fas', 'info']" size="sm" /> -->
                      <i class="las la-info-circle"></i>
                    </div>
                  </div>
                  <span class="short-info-text">{{ $t('forms.deleteNotification') }}</span>
                </div>
                <div class="form-actions bordered-top pt-2">
                  <nuxt-link
                    :to="localePath('/')"
                    class="btn btn-ghost-grey cancel-button"
                  >
                    <span class="is-hidden-mobile">{{ $t('forms.cancel') }}</span>
                    <span class="is-hidden-tablet cross-icon"></span>
                  </nuxt-link>
                  <button
                    class="btn btn-error delete-btn"
                    @click="deleteAccount"
                  >
                    <span>{{ $t('buttons.deleteAccount') }}</span>
                  </button>
                </div>
              </b-tab-item>
            </b-tabs>
            
            <div class="error-message-block"
              role="alert"
              v-if="accountDeleted">
              <button class="close-btn" @click="accountDeleted = false"></button>
              Account successfully deleted
            </div>
            <!-- <transition name="grow"> -->
              <notification v-show="notificationShown" @closeNotification="notificationShown = false" :type="notificationType" :message="notificationMessage" />
            <!-- </transition> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import vSelect from 'vue-select'
import Editor from '@/components/ui/Editor'
import Notification from '@/components/ui/Notification'
import { required, requiredIf, email, minLength, sameAs, not } from 'vuelidate/lib/validators'
import { auth, db } from "@/plugins/firebase"
import { updateEmail, updatePassword } from "firebase/auth"
import { doc, updateDoc } from "firebase/firestore"
import { mapState } from 'vuex'
const passwordRules = (value) => /(?=.*[A-Z])(?=.*[0-9])/.test(value)
export default {
  name: 'myAccount',
  head () {
    return {
      title: this.$t('pages.myAccount.title')
    }
  },
  components: {
    vSelect,
    Notification,
    Editor
  },
  middleware: ['check-user'],
  transition: {
    name: 'slide-fade',
    mode: 'out-in'
  },
  data () {
    return {
      activeTab: 0,

      formOfAddress: '',
      firstname: '',
      lastname: '',
      avatar: '',
      username: '',
      email: '',
      phone: '',
      mood: '',
      moodCount: 0,
      userInfo: '',
      
      oldPassword: '',
      newPassword: '',
      newPasswordConfirm: '',
      OpenIndicator: {
        render: createElement => createElement('span', {class: {'select-caret': true}}),
      },
      oldPasswordVisible: false,
      newPasswordVisible: false,
      newPasswordConfirmVisible: false,
      editPhone: false,
      successMessage: 'Data saved successfully',
      accountDeleted: false,
      passwordError: false,
      passwordErrorMessage: 'Invalid password',
      notificationShown: false,
      notificationType: '',
      notificationMessage: '',
    }
  },
  validations () {
    const validators = {
      formOfAddress: { required },
      firstname: { required },
      lastname: { required },
      email: { required, email },
      phone: { required, minLength: minLength(this.phoneParams.mask.length) },
      newPassword: {},
      newPasswordConfirm: {},
    }
    if (this.newPassword.length) {
      validators.newPassword = { minLength:  minLength(6), passwordRules, notOld: not(sameAs('oldPassword')) }
      validators.newPasswordConfirm = { required: requiredIf(function(){return this.newPassword}), sameAsPassword: sameAs('newPassword') }
    }
    return validators
  },
  computed: {
    phoneParams () {
      if (!this.phone) return {mask: '#', country: 'default'}
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
    },
    ...mapState({
      user: state => state['auth-custom'].user
    })
  },
  methods: {
    async submitData () {
      this.$v.$touch()
      if (this.$v.$invalid) {
        if (this.$v.formOfAddress.$error || this.$v.firstname.$error || this.$v.lastname.$error) {
          this.activeTab = 0
        } else if (this.$v.email.$error || this.$v.newPassword.$error || this.$v.newPasswordConfirm.$error) {
          this.activeTab = 1
        } 
        return;
      }
      if (this.newPassword) {
        updatePassword(auth.currentUser, this.newPassword)
          .then(res => {
            console.log('password reset response', res)
          })
          .catch(err => {
            console.log('password reset error', err)
          })
      }
      if (this.email !== this.user.email) {
        updateEmail(auth.currentUser, this.email)
          .then(res => {
            console.log('email reset response', res)
          })
          .catch(err => {
            console.log('email reset error', err)
          })
      }
      try {
        const userData = {
          phone: this.phone.replaceAll(' ', ''),
          formOfAddress: this.formOfAddress,
          email: this.email,
          firstname: this.firstname,
          lastname: this.lastname,
          mood: this.mood,
          userInfo: this.userInfo,
          agreement: this.user.agreement || true
        }
        this.avatar ? userData.avatar = this.avatar : null
        this.username ? userData.username = this.username : `${this.firstname} ${this.lastname}`

        updateDoc(doc(db, 'users', auth.currentUser.uid), userData)
          .then(res => {
            console.log('update user data response', res)
          })
          .catch(err => {
            console.log('update user data error', err)
          })

      } catch (res) {
        console.log(res)
        this.notificationShown = true
        this.notificationType = 'error'
        this.notificationMessage = res.data
        return
      }
      this.notificationShown = true
      this.notificationType = 'success'
      this.notificationMessage = this.successMessage
      console.log('data submitted')
    },
    async deleteAccount () {
      try {
        await this.$axios.delete('/user/me')
      } catch ({ response }) {
        console.log(response.data)
        return
      }
      this.accountDeleted = true
      setTimeout(() => {
        this.logout()
      }, 2000)
    },
    logout () {
      this.$store.dispatch('auth-custom/logout')
    }
  },
  watch: {
    user: {
      immediate: true,
      handler (newVal) {
        if (newVal) {
          this.formOfAddress = newVal.formOfAddress || ''
          this.firstname = newVal.firstname
          this.lastname = newVal.lastname
          this.avatar = newVal.avatar || ''
          this.username = newVal.username || ''
          this.email = newVal.email
          this.phone = newVal.phone
          this.mood = newVal.mood || ''
          this.moodCount = newVal.mood?.length || 0
          this.userInfo = newVal.userInfo || ''
        }
      }
    }
  }
}
</script>
