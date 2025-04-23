describe('Array', function () {
    describe('#indexOf()', function () {
      it('should return -1 when the value is not present', function () {
        [1, 2, 3].indexOf(5).should.equal(-1);
        [1, 2, 3].indexOf(0).should.equal(-1);
      });
    });
  });
  
describe('ImageHandler', function () {
    describe('#uploadImage()', function () {
        it('should assert that the image has a valid file type', function () {
            const filetypes = ['png', 'jpg', 'jpeg'];
            // Check if the file type matches the allowed types
            var filepng = 'file.png'.split('.').pop();
            var filejpg = 'file.jpg'.split('.').pop();
            var filegif = 'file.gif'.split('.').pop();
            filepng.should.equalOneOf(filetypes);
            filejpg.should.equalOneOf(filetypes);
            filegif.should.not.equalOneOf(filetypes);
        });
        it('should assert that the image has a valid size', function () {
            const maxSize = 5 * 1024 * 1024;
            const file = new Blob([], { type: 'image/png' });
        });
});
});