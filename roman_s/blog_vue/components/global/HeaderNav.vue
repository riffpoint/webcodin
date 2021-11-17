<template>
  <div class="header-main">
    <div class="container">
      <div class="logo-wrapper">
        <nuxt-link :to="localePath('/')" class="logo-link">
          <img src="/images/placeholder-logo-1.jpg" class="header-logo" :alt="$t('header.logoAlt')">
        </nuxt-link>
      </div>
      <div class="header-actions">
        <div v-if="!user || !user.uid" class="header-action-buttons">
          <nuxt-link :to="localePath('registration')" class="btn btn-primary header-action-btn">{{ $t('buttons.registerButton') }}</nuxt-link>
          <nuxt-link :to="localePath('login')" class="btn btn-ghost-primary login-btn header-action-btn">{{ $t('buttons.loginButton') }}</nuxt-link>
        </div>
        <ul v-else class="user-menu is-hidden-mobile">
          <li class="user-menu-item">
            <span class="user-menu-text">Menu</span>
            <ul class="user-submenu">
              <li class="user-submenu-item">
                <nuxt-link :class="{'active': false}" :to="localePath('myPosts')" class="user-submenu-link">{{ $t('vocabulary.myPosts') }}</nuxt-link>
              </li>
              <li class="user-submenu-item">
                <nuxt-link :class="{'active': false}" :to="localePath('/')" class="user-submenu-link">{{ $t('vocabulary.favorites') }}</nuxt-link>
              </li>
              <li class="user-submenu-item">
                <nuxt-link :class="{'active': false}" :to="localePath('/')" class="user-submenu-link">{{ $t('vocabulary.mySubscriptions') }}</nuxt-link>
              </li>
              <li class="user-submenu-item">
                <nuxt-link :class="{'active': false}" :to="localePath('/')" class="user-submenu-link">{{ $t('vocabulary.myFriends') }}</nuxt-link>
              </li>
            </ul>
          </li>
          <li class="user-menu-item">
            <span class="user-menu-text">{{ $tc('vocabulary.my', user.messages || 50) }}<b class="space-before">{{ $t('vocabulary.messages') }}</b></span>
            <span class="badge badge-primary intext-badge">{{ user.messages || 50 }}</span>
          </li>
          <li class="user-menu-item">
            <nuxt-link :to="localePath({ name: 'newPost' })" class="user-menu-text user-menu-btn"><i class="las la-plus-circle"></i> {{ $t('buttons.createNewPost') }}</nuxt-link>
          </li>
        </ul>
        <div v-if="user && user.uid" class="user-info-toggler">
          <button @click="showUserMenu = !showUserMenu" class="user-info-avatar-wrap">
            <img class="user-info-avatar" :src="user.avatar || '/images/no-avatar.png'" alt="">
          </button>
        </div>
        <div v-if="user && user.uid" class="user-menu-wrap" :class="{'open': showUserMenu}" v-click-outside="closeMenu">
          <div class="user-menu-header">
            <div class="user-menu-actions is-hidden-tablet">
              <button class="btn btn-ghost-white-primary" @click="logout">LOGOUT</button>
              <button class="close-btn color-white" @click="showUserMenu = false">Close</button>
            </div>
            <div class="user-menu-data">
              <div class="user-menu-avatar-wrap">
                <img :src="user.avatar || '/images/no-avatar.png'" alt="" class="user-menu-avatar">
              </div>
              <span class="user-menu-name">{{ user ? `${user.firstname} ${user.lastname}` : 'UserName' }}</span>
            </div>
          </div>
          <div class="user-menu-body">
            <p class="mobile-menu-title is-hidden-tablet"><nuxt-link class="user-menu-text user-menu-btn" :to="localePath('/')"><i class="las la-plus-circle"></i> {{ $t('buttons.createNewPost') }}</nuxt-link></p>
            <p class="mobile-menu-title is-hidden-tablet">Menu</p>
            <ul class="mobile-menu-list is-hidden-tablet">
              <li class="mobile-menu-item"><nuxt-link :to="localePath('myPosts')" class="mobile-menu-link">{{ $t('vocabulary.myPosts') }}</nuxt-link></li>
              <li class="mobile-menu-item"><nuxt-link :to="localePath('/')" class="mobile-menu-link">{{ $t('vocabulary.favorites') }}</nuxt-link></li>
              <li class="mobile-menu-item"><nuxt-link :to="localePath('/')" class="mobile-menu-link">{{ $t('vocabulary.mySubscriptions') }}</nuxt-link></li>
              <li class="mobile-menu-item"><nuxt-link :to="localePath('/')" class="mobile-menu-link">{{ $t('vocabulary.myFriends') }}</nuxt-link></li>
            </ul>
            <p class="mobile-menu-title">{{ $t('userMenu.menu3.title') }}</p>
            <ul class="mobile-menu-list">
              <li class="mobile-menu-item"><nuxt-link :to="localePath('/')" class="mobile-menu-link">{{ $t('userMenu.menu3.items.dashboard') }}</nuxt-link></li>
              <li class="mobile-menu-item"><nuxt-link :to="localePath({ name: 'my-account' })" class="mobile-menu-link">{{ $t('userMenu.menu3.items.myAccount') }}</nuxt-link></li>
            </ul>
            <div class="is-hidden-mobile bordered-top pt-2 is-flex justify-end">
              <button class="btn btn-ghost-primary btn-sm" @click="logout">LOGOUT</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ClickOutside from 'vue-click-outside'
import { mapState } from 'vuex'
export default {
  directives: {
    ClickOutside
  },
  data () {
    return {
      showUserMenu: false,
    }
  },
  computed: {
    ...mapState({
      user: state => state['auth-custom'].user
    })
  },
  methods: {
    disableScroll (disable) {
      if (window.innerWidth < 767) {
        const html = document.querySelector('html')
        if (disable) {
          html.classList.add('scroll-disabled', 'user-menu-active')
        } else {
          html.classList.remove('scroll-disabled')
        }
      }
    },
    logout () {
      this.$store.dispatch('auth-custom/logout')
      this.showUserMenu = false
    },
    closeMenu (data) {
      if (!data.target.classList.contains('user-info-avatar')) {
        this.showUserMenu = false
      }
    }
  },
  watch: {
    showUserMenu (newVal) {
      this.disableScroll(newVal)
    },
    $route () {
      this.showUserMenu = false
    }
  }
}
</script>
