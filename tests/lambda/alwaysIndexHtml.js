const assert = require('assert')
const parseUri = require('../../lambda/alwaysIndexHtml/parseUri.js')

describe('alwaysIndexHtml', () => {
  describe('should add index.html', () => {
    it('trailing slash (shallow)', () => {
      const uri = parseUri('/tips/')
      assert.equal('/tips/index.html', uri)
    })
    it('no trailing slash (shallow)', () => {
      const uri = parseUri('/tips')
      assert.equal('/tips/index.html', uri)
    })
    it('trailing slash (deep)', () => {
      const uri = parseUri('/buy/large-audiences/')
      assert.equal('/buy/large-audiences/index.html', uri)
    })
    it('no trailing slash (deep)', () => {
      const uri = parseUri('/buy/large-audiences')
      assert.equal('/buy/large-audiences/index.html', uri)
    })
    it('with query params (shallow)', () => {
      const uri = parseUri('/tips/?j=b')
      assert.equal('/tips/index.html?j=b', uri)
    })
    it('no slash, with query params (shallow)', () => {
      const uri = parseUri('/tips?j=b')
      assert.equal('/tips/index.html?j=b', uri)
    })
    it('with query params (deep)', () => {
      const uri = parseUri('/free/color-palettes/?j=b')
      assert.equal('/free/color-palettes/index.html?j=b', uri)
    })
  })
})
