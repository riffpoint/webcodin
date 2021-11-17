<template>
  <div class="request-card" v-if="request">
    <div class="object-image-wrap is-hidden-desktop">
      <img :src="request.product.media || '/images/image-placeholder.jpg'" alt="">
    </div>
    <div class="request-card-head" :class="{'no-timer': !(request.status === 1 && timer)}">
      <div class="request-head-left">
        <span class="request-object-title color-primary">{{ request.product.title }}</span>
        <button @click="mobileTopShown = !mobileTopShown" class="mobile-collapse-toggler" :class="{'is-active': mobileTopShown}">
          <i class="las la-angle-down"></i>
        </button>
      </div>
      <div class="request-head-right">
        <div class="timer" v-if="request.status === 1 && timer">
          <span>{{ $t('messages.stillValid') }}:</span>
          <i class="las la-stopwatch" :class="timer < 3600000 ? 'color-red' : 'color-primary'"></i>
          <span :class="timer < 3600000 ? 'color-red' : 'color-primary'">{{ timerString }}</span>
        </div>
        <span v-if="status.name" class="btn-pill request-status-indicator" :class="`bg-${status.color}`">{{ status.name }}</span>
      </div>
    </div>
    <div class="request-card-body">
      <div class="object-image-wrap is-hidden-touch">
        <img :src="request.product.media || '/images/image-placeholder.jpg'" alt="">
      </div>
      <div class="request-body-info">
        <collapse>
          <div v-show="mobileTopShown" class="request-info-top">
            <span class="request-id"><span class="color-grey-01 space-after">{{ `${$t('vocabulary.rentalNumber')}:` }}</span><span>{{ request.showId.replace('_', '-') }}</span></span>
            <div class="object-rating">
              <span class="color-grey-01">{{ $t('vocabulary.objectRating') }}</span>
              <stars-rating
                :increment="0.1"
                :rating="request.product.rating.ratingAvg"
                :read-only="true"
                :show-rating="false"
                active-color="#ff9b42"
                inactive-color="#9699a2"
                :star-points="[47.399903125,19.6044921875, 31.5063484375,17.926025, 25,3.3325203125, 18.493653125,17.926025, 2.6000984375,19.6044921875, 14.4714359375,30.3039546875, 11.1572265625,45.935059375, 25,37.9516609375, 38.8427734375,45.935059375, 35.5285640625,30.3039546875]"
              />
            </div>
          </div>
        </collapse>
        <div class="request-info-middle">
          <div class="request-middle-box">
            <span class="request-middle-box-title">{{ $t('forms.dateFromPlaceholder') }}</span>
            <span class="request-middle-box-content">{{ formatVisibleDate(new Date(request.dateFrom), '.') }}</span>
          </div>
          <div class="request-middle-box">
            <span class="request-middle-box-title">{{ $t('forms.dateToPlaceholder') }}</span>
            <span class="request-middle-box-content">{{ formatVisibleDate(new Date(request.dateTo), '.') }}</span>
          </div>
          <div v-if="type === 'leaser'" class="request-middle-box">
            <span class="request-middle-box-title">{{ $t('vocabulary.leaserFee') }}</span>
            <span class="request-middle-box-content">{{ `${request.rentingFee} CHF` }}</span>
          </div>
          <div v-else class="request-middle-box">
            <span class="request-middle-box-title">{{ $t('vocabulary.renterFee') }}</span>
            <span class="request-middle-box-content">{{ `${request.rentingFeeNet} CHF` }}</span>
          </div>
          <div class="request-middle-box">
            <span class="request-middle-box-title">{{ $t('vocabulary.duration') }}</span>
            <span class="request-middle-box-content">{{ `10 ${$tc('vocabulary.day', 10)}` }}</span>
          </div>
        </div>
        <div class="request-info-actions">
          <div class="actions-left">
            <button class="btn btn-ghost-primary request-action-btn" v-if="request.status === 2 || request.status === 9">{{ $t('buttons.downloadInfoPdf') }}</button>
          </div>
          <div class="actions-right">
            <button class="btn btn-error request-action-btn" v-if="request.status === 2">{{ $t('buttons.cancel') }}</button>
            <button class="btn btn-ghost-error request-action-btn" v-if="type === 'leaser' && request.status === 1">{{ $t('vocabulary.delete') }}</button>
            <button class="btn btn-ghost-error request-action-btn" v-if="type === 'renter' && request.status === 1">{{ $t('buttons.decline') }}</button>
            <button class="btn btn-primary request-action-btn" v-if="type === 'renter' && request.status === 1">{{ $t('buttons.accept') }}</button>
            <button class="btn btn-primary request-action-btn" v-if="type === 'leaser' && (request.status === 2 || request.status === 1)">{{ $t('buttons.change') }}</button>
            <button class="btn btn-ghost-primary request-action-btn" v-if="type === 'leaser' && (request.status !== 2 && request.status !== 1)">{{ $t('buttons.borrowAgain') }}</button>
          </div>
        </div>
      </div>
    </div>
    <div class="request-card-footer">
      <div class="user-short-info">
        <div class="short-info-wrap">
          <div class="avatar-wrap">
            <img :src="userInfo ? userInfo.avatar : '/images/no-avatar.png'" alt="">
          </div>
          <div class="info-wrap">
            <span class="user-name">{{ userInfo ? userInfo.firstname : '' }}</span>
            <stars-rating
              :increment="0.1"
              :rating="userInfo ? userInfo.rating.ratingAvg : 0"
              :read-only="true"
              :show-rating="false"
              active-color="#6ab8a6"
              inactive-color="#9699a2"
              :star-points="[47.399903125,19.6044921875, 31.5063484375,17.926025, 25,3.3325203125, 18.493653125,17.926025, 2.6000984375,19.6044921875, 14.4714359375,30.3039546875, 11.1572265625,45.935059375, 25,37.9516609375, 38.8427734375,45.935059375, 35.5285640625,30.3039546875]"
            />
          </div>
        </div>
        <button v-if="request.status === 2 || request.status === 9" @click="mobileContactsShown = !mobileContactsShown" class="mobile-collapse-toggler" :class="{'is-active': mobileContactsShown}">
          <i class="las la-angle-down"></i>
        </button>
      </div>
      <div class="user-full-info">
        <collapse v-if="request.status === 2 || request.status === 9">
          <div v-show="mobileContactsShown" class="user-full-info-inner">
            <div v-if="type === 'leaser'" class="collapse-wrap">
              <button class="collapse-toggler" :class="{'open': showContacts}" @click="showContacts = !showContacts">{{ $t('pages.borrowing.contactData') }}</button>
              <collapse>
                <div v-show="showContacts" class="collapse-inner">
                  <p class="user-info-name"><b>{{ `${userInfo.firstname} ${userInfo.lastname}` }}</b></p>
                  <p><a :href="`tel:${userInfo.phone}`" class="color-primary">{{ userInfo.phone }}</a></p>
                  <p><a :href="`mailto:${userInfo.email}`" class="color-primary">{{ userInfo.email }}</a></p>
                </div>
              </collapse>
            </div>
            <div v-else class="collapse-wrap">
              <button class="collapse-toggler open" disabled>{{ $t('pages.borrowing.contactData') }}</button>
              <div class="collapse-inner">
                <p class="user-info-name"><b>{{ `${userInfo.firstname} ${userInfo.lastname}` }}</b></p>
                <p><a :href="`tel:${userInfo.phone}`" class="color-primary">{{ userInfo.phone }}</a></p>
                <p><a :href="`mailto:${userInfo.email}`" class="color-primary">{{ userInfo.email }}</a></p>
              </div>
            </div>
            <div v-if="type === 'leaser'" class="collapse-wrap">
              <button class="collapse-toggler" :class="{'open': showAddress}" @click="showAddress = !showAddress">{{ $t('pages.borrowing.pickAddress') }}</button>
              <collapse>
                <div v-show="showAddress" class="collapse-inner">
                  Under development
                </div>
              </collapse>
            </div>
            <div v-if="type === 'leaser'" class="collapse-wrap">
              <button class="collapse-toggler" :class="{'open': showPayment}" @click="showPayment = !showPayment">{{ $t('pages.borrowing.paymentDetails') }}</button>
              <collapse>
                <div v-show="showPayment" class="collapse-inner">
                  Under development
                </div>
              </collapse>
            </div>
          </div>
        </collapse>
      </div>
      <div class="user-actions">
        <button class="btn btn-ghost-primary request-action-btn">{{ $t('buttons.writeMessage') }}</button>
      </div>
    </div>
  </div>
</template>

<script>
import Collapse from '~/components/ui/Collapse'
export default {
  props: {
    request: {
      type: Object,
      required: true
    },
    type: {
      type: String,
      required: true
    }
  },
  components: {
    Collapse
  },
  data () {
    return {
      timer: 0,
      showContacts: false,
      showAddress: false,
      showPayment: false,
      mobileTopShown: false,
      mobileContactsShown: false
    }
  },
  created () {
    if (this.request.status = 1) {
      const now = new Date(),
      expires = new Date(this.request.expiredAt),
      remains = expires.getTime() - now.getTime()
      if (remains > 0) {
        this.timer = remains
        this.updateTimer()
      }
    }
  },
  computed: {
    timerString () {
      const minutesLeft = this.timer / 60000,
      hours = Math.floor(minutesLeft / 60),
      minutes = Math.floor(minutesLeft % 60)
      return `${hours.toString().length > 1 ? hours : `0${hours}`}:${minutes.toString().length > 1 ? minutes : `0${minutes}`}`
    },
    status () {
      let color, name
      if (new Date().getTime() > new Date(this.request.expiredAt).getTime() || this.timer < 1) {
        return { color: 'grey', name: this.$t('vocabulary.expired') }
      }
      switch (this.request.status) {
        case 0:
          color = 'black'
          name = this.$t('vocabulary.canceled')
          break;
        case 1:
          color = 'secondary'
          name = this.$t('vocabulary.opened')
          break;
        case 2:
          color = 'primary'
          name = this.$t('vocabulary.approved')
          break;
        case 5:
          color = 'red'
          name = this.$t('vocabulary.rejected')
          break;
        case 9:
          color = 'grey-01'
          name = this.$t('vocabulary.completed')
          break;
        case 6:
          color = 'black'
          name = this.$t('vocabulary.canceled')
          break;
        case 7:
          color = 'black'
          name = this.$t('vocabulary.canceled')
          break;
        case 8:
          color = 'grey'
          name = this.$t('vocabulary.expired')
          break;
        case 10:
          color = 'red'
          name = this.$t('vocabulary.rejected')
        default:
          color = false
          name = false
      }
      return { color, name }
    },
    userInfo () {
      if (this.type === 'leaser') {
        return this.request.product.user
      } else if (this.type === 'renter') {
        return this.request.leaser
      }
      return false
    }
  },
  methods: {
    updateTimer () {
      const interval = setInterval(() => {
        const now = new Date(),
        expires = new Date(this.request.expiredAt),
        remains = expires.getTime() - now.getTime()
        if (remains > 0) {
          this.timer = remains
        } else {
          this.timer = 0
          clearInterval(interval)
        }
      }, 60000)
    },
    formatVisibleDate (date, divider) {
      return `${date.getDate().toString().length > 1 ? date.getDate() : `0${date.getDate()}` }${divider || '-'}${date.getMonth().toString().length > 1 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`}${divider || '-'}${date.getFullYear()}`
    },
  }
}
</script>
