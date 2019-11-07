import server from './server'
import twitterCore from './services/twitter-core'

const Services = async () => {
  // await TwitterCore.start()
  // await TwitterMessage.getUserInfo('228951320')
  await twitterCore.mountServices()
  // await TwitterCore.sendMessage('228951320', 'Direct message Working very well! Nice Twice')
  twitterCore.start()
}

Services()

server.listen(process.env.PORT || 3000, () => {
  console.log(`Listening on ${process.env.PORT || 3000}`)
})
