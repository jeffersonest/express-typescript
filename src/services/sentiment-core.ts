// import path from 'path'
class SentimentCore {
  async checkSentiment (): Promise<Record<string, any>> {
    return { data: true }
  }
}
export default new SentimentCore()
