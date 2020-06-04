const gm = require('gm').subClass({imageMagick: true})
const state = require('./state.js')
const spawn = require('child_process').spawn
const path = require('path')
const os = require('os');
const rootPath = path.resolve(__dirname, '..')

const fromRoot = relPath => path.resolve(rootPath, relPath)

async function robot() {
  console.log('> [presentation-robot] Starting...')
  const content = state.load()

  //await convertAllImages(content)
  await createPresentation(content)

  //state.save(content)

  async function convertAllImages(content) {
    for (let sentenceIndex = 0; sentenceIndex < content.sentences.length; sentenceIndex++) {
      await convertImage(sentenceIndex)
    }
  }

  async function convertImage(sentenceIndex) {
    return new Promise((resolve, reject) => {
      const inputFile = fromRoot(`./content/${sentenceIndex}-original.png[0]`)
      const outputFile = fromRoot(`./content/${sentenceIndex}-converted.png`)
      const width = 1920
      const height = 1080

      gm()
        .in(inputFile)
        .out('(')
          .out('-clone')
          .out('0')
          .out('-background', 'white')
          .out('-blur', '0x9')
          .out('-resize', `${width}x${height}^`)
        .out(')')
        .out('(')
          .out('-clone')
          .out('0')
          .out('-background', 'white')
          .out('-resize', `${width}x${height}`)
        .out(')')
        .out('-delete', '0')
        .out('-gravity', 'center')
        .out('-compose', 'over')
        .out('-composite')
        .out('-extent', `${width}x${height}`)
        .write(outputFile, (error) => {
          if (error) {
            return reject(error)
          }

          console.log(`> [presentation-robot] Image converted: ${outputFile}`)
          resolve()
        })

    })
  }

  async function createPresentation(content) {
    const presentationTitle = `${content.prefix} ${content.searchTerm}`
    console.log(`> [presentation-robot] Presentation Title: ${presentationTitle}`)
    
    for (let sentenceIndex = 0; sentenceIndex < content.sentences.length; sentenceIndex++) {
      await createSlide(sentenceIndex, content.sentences[sentenceIndex].text)
    }
  }

  async function createSlide(sentenceIndex, sentenceText) {
    return new Promise((resolve, reject) => {
        console.log(`> [presentation-robot] SlideTitle: ${content.sentences[sentenceIndex].googleSearchQuery}`)
        console.log(`> [presentation-robot] SlideImageFile: ./content/${sentenceIndex}-converted.png`)
        console.log(`> [presentation-robot] SlideImageUrl: ${content.downloadedImages[sentenceIndex]}`)
        console.log(`> [presentation-robot] SlideInfo:  ${sentenceText}`)

        
    
        resolve()
    })
  }

}

module.exports = robot
