export default function (context) {
  const routeOrigin = context.route.name.split('___')[0].split('-').slice(0, -1).join('-')
  const routeVariable = context.route.name.split('___')[0].split('-').slice(-1)[0]
  const prevVariable = context.from ? context.from.name.split('___')[0].split('-').slice(-1)[0] : null
  const prevOrigin = context.from ? context.from.name.split('___')[0].split('-').slice(0, -1).join('-') : null

  if (routeVariable === 'StepTwo') {
    if (prevVariable !== routeOrigin && prevVariable !== 'StepThree') {
      return context.redirect(context.app.localePath({ name: routeOrigin }))
    }
  } else if (routeVariable === 'StepThree') {
    if (prevVariable !== 'StepTwo' && prevVariable !== 'StepFour') {
      return context.redirect(context.app.localePath({ name: routeOrigin }))
    }
  } else if (routeVariable === 'StepFour') {
    if (prevVariable !== 'StepThree') {
      return context.redirect(context.app.localePath({ name: routeOrigin }))
    }
  }
}