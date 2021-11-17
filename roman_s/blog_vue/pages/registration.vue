<template>
  <left-sidebar-layout pageClass="registration-page" sidebarClass="is-hidden-mobile">
    <template #top-content>
      <div class="banner" style="background-image: url(/images/registration-banner.jpg)">
        <div class="container container-md">
          <div class="banner-left banner-content">
            <p class="banner-title banner-title-small">{{ $t('pages.registration.pageTitle') }}</p>
            <p class="banner-subtitle-small">{{ $t('pages.registration.pageSubtitle') }}</p>
          </div>
        </div>
      </div>
      <steps :activeStep="activeStep" :finishedSteps="finishedSteps" :titlesArray="$i18n.messages[$i18n.locale].pages.registration.stepTitles" titlesArrayAddress="pages.registration.stepTitles" />
    </template>
    <template #sidebar-content>
      <div class="registration-form-text">
        <p
          class="registration-form-title" 
          v-html="$t('pages.registration.formTitle', { name: `<span class='color-primary'>CompanyName</span>` })"
        ></p>
        <div class="registration-form-subtitle">
          <p>{{ $t('pages.registration.formSubtitle1') }}</p>
          <p v-if="activeStep === 0">{{ $t('pages.registration.formSubtitle2') }}</p>
        </div>
        <p v-if="activeStep === 0" class="title-text">-<span>{{ $t('vocabulary.or') }}</span>-</p>
        <button v-if="activeStep === 0" class="btn btn-with-icon facebook-button">
          <span class="btn-icon">
            <!-- <fa size="lg" :icon="['fab', 'facebook-f']"  /> -->
            <i class="lab la-facebook-f"></i>
          </span>
          <span class="btn-text">{{ $t('buttons.registerFacebook') }}</span>
        </button>
      </div>
      
    </template>
    <template #main-content>
      <div class="registration-form-column">
        <keep-alive>
          <nuxt-child
            :stepTitle="$t(`pages.registration.stepTitles[${activeStep}]`)"
            :stepData="regData[activeStep]"
            :nuxt-child-key="activeStep.toString()"
            @changeStep="changeStep"
          />
        </keep-alive>
        <div class="error-message-block"
          type="is-danger"
          role="alert"
          v-if="regErrorShown">
          <button class="close-btn" @click="regErrorShown = false"></button>
          {{ regErrorMessage }}
        </div>
      </div>
    </template>
  </left-sidebar-layout>
</template>

<script>
  import LeftSidebarLayout from '@/components/global/LeftSidebarLayout'
  import Steps from '@/components/global/Steps'
  import { createUserWithEmailAndPassword } from "firebase/auth"
  import { auth, db } from "@/plugins/firebase"
  import { doc, setDoc, updateDoc, collection, query, where, getDocs } from "firebase/firestore"
  export default {
    name: 'Registration',
    head () {
      return {
        title: this.$t('pages.registration.title')
      }
    },
    components: {
      LeftSidebarLayout,
      Steps
    },
    middleware: ['not-authenticated', 'steps-guard'],
    data () {
      return {
        activeStep: 0,
        finishedSteps: [],
        regData: [{}, {}, {}, {}],
        regErrorMessage: '',
        regErrorShown: false,
        userId: null
      }
    },
    created () {
      switch (this.$route.name.split('___')[0]) {
        case 'registration-StepTwo':
          this.activeStep = 1
          break
        case 'registration-StepThree':
          this.activeStep = 2
          break
        case 'registration-StepFour':
          this.activeStep = 3
          break
        default:
          break
      }
    },
    methods: {
      async changeStep (data) {
        this.regErrorMessage = ''
        this.regErrorShown = false
        this.regData[this.activeStep] = data.data
        switch (this.activeStep) {
          case 0:
            break
          case 1:
            this.regData[2].phone = this.regData[1].phone

            if (data.forward) {
              const userData = {
                phone: this.regData[1].phone.replaceAll(' ', ''),
                email: this.regData[1].email,
                formOfAddress: this.regData[0].formOfAddress,
                firstname: this.regData[0].firstName,
                lastname: this.regData[0].lastName,
                subscribeEmail: this.regData[1].newsletterSubscribe ? 1 : 0,
                agreement: this.regData[1].terms,
                username: this.regData[0].username
              }
              this.regData[0].avatar ? userData.avatar = this.regData[0].avatar : null
              let phoneCheck = 0
              let phones = await getDocs(query(collection(db, 'users'), where('phone', '==', userData.phone)))
              phones.forEach(() => {
                phoneCheck = true
              })
              if (phoneCheck) {
                this.regErrorMessage = 'User with this phone number already exists'
                this.regErrorShown = true
                return
              }
              try {
                const res = await createUserWithEmailAndPassword(auth, this.regData[1].email, this.regData[1].password)
                this.userId = res.user.uid
                await setDoc(doc(db, "users", res.user.uid), userData)
              } catch (response) {
                if (response.message.toLowerCase().includes('email-already-in-use')) {
                  this.regErrorMessage = 'User with this email already exists'
                }
                this.regErrorShown = true
              }
              if (this.regErrorShown) {
                return
              }
              this.regErrorMessage = ''
              this.regErrorShown = false
            }
            break
          case 2:
            if (data.forward && data.data) {
              try {
                updateDoc(doc(db, "users", this.userId), data.data)
              } catch (err) {
                console.log(err.message)
              }
            }
            this.regData[3].firstName = this.regData[0].firstName
            this.regData[3].lastName = this.regData[0].lastName
            break
          case 3:
            try {
              this.$store.dispatch('auth-custom/login', { email: this.regData[1].email, password: this.regData[1].password })
            } catch (response) {
              console.log(response.message)
            }
            this.$router.push(this.localePath('/'))
            break
          default:
            break
        }
        if (this.regErrorShown) {
          return
        }
        if (data.forward) {
          this.finishedSteps.push(this.activeStep)
          this.activeStep++
          switch (this.activeStep) {
            case 1:
              this.$router.push(this.localePath({ name: 'registration-StepTwo' }))
              break
            case 2:
              this.$router.push(this.localePath({ name: 'registration-StepThree'}))
              break
            case 3:
              this.$router.push(this.localePath({ name: 'registration-StepFour'}))
              break
          }
        } else {
          this.activeStep--
          switch (this.activeStep) {
            case 0:
              this.$router.push(this.localePath({ name: 'registration'}))
              break
            case 1:
              this.$router.push(this.localePath({ name: 'registration-StepTwo' }))
              break
          }
        }
      }
    }
  }
</script>

