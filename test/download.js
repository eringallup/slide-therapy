const skus = require('../skus.json');
const download = require('slidetherapy/download');
const chai = require('chai');

describe('Download', () => {
  describe('Signed URL', () => {
    it('should get signed url', () => {
      let url = download.getSignedUrl(skus[1]);
      // console.log(url);
      chai.expect(url).to.be.a('string');
    });
  });
});
