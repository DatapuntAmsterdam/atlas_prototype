/* eslint-disable no-console,@typescript-eslint/no-var-requires */
const fs = require('fs')
const path = require('path')
const buildXML = require('./buildXML')

const src = path.join(__dirname, '../public/static')

buildXML()
  .then((result) => {
    fs.writeFile(path.join(src, 'sitemap.xml'), result, (err) => {
      if (err) {
        return console.log(err)
      }

      return console.log('The file was saved!')
    })
  })
  .catch((e) => {
    console.log(e)
  })
