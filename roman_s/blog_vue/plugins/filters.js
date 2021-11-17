import Vue from 'vue'

Vue.filter('formatDate', date => {
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().length > 1 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`}-${(date.getDate() + 1).toString().length > 1 ? date.getDate() : `0${date.getDate()}` }`
})
Vue.filter('formatPrice', val => {
  const price = Number(val),
  int = parseInt(price),
  decimal = price.toFixed(2) - int
  if (decimal) {
    return price.toFixed(2)
  }
  return `${int}.-`
})

