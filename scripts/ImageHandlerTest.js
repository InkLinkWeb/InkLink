  export async function handleFormSubmission(file, caption, style) {
    if (!file) throw new Error('Please select an image to upload.');
    if (!caption || caption.trim() === '') throw new Error('Please enter a caption.');
    if (caption.length > 200) throw new Error('Caption is too long. Please keep it under 200 characters.');
    if (!style || style.trim() === '') throw new Error('Please enter a tattoo style.');
    if (style.length > 50) throw new Error('Tattoo style is too long. Please keep it under 50 characters.');
    
    await uploadImage(file, caption.trim(), style.trim());
}

// Function to upload an image
export async function uploadImage(file, caption, style) {
    const validTypes = ['image/png', 'image/jpg', 'image/jpeg'];
    const maxSize = 5 * 1024 * 1024;
    if (!validTypes.includes(file.type)) {
        throw new Error('Invalid file type.');
    }
    if (file.size > maxSize) {
        throw new Error('File size exceeds 5MB.');
    }
    if (caption.trim() === '') {
        throw new Error('Please enter a caption.');
    }
    if (style.trim() === '') {
        throw new Error('Please enter a tattoo style.');
    }
    if (!file) {
        throw new Error('Please select an image to upload.');
    }
}
  
describe('ImageHandler', function () {
    describe('Uploading an Image', function () {
        describe('Form Handler', function () {
            const validFile = new File(["dummy content"], "test.png", { type: "image/png" });
            it('should succeed with valid file, caption, and style', async function () {
                const result = await handleFormSubmission(validFile, 'Test Caption', 'Traditional');
            });
            it('should throw an error if file is missing', async function () {
                try {
                    await handleFormSubmission(null, 'Test Caption', 'Traditional');
                    throw new Error('Expected error not thrown');
                } catch (e) {
                    e.message.should.equal('Please select an image to upload.');
                }
            });
            it('should throw an error if caption is empty', async function () {
                try {
                    await handleFormSubmission(validFile, '', 'Traditional');
                    throw new Error('Expected error not thrown');
                } catch (e) {
                    e.message.should.equal('Please enter a caption.');
                }
            });
            it('should throw an error if caption is whitespace', async function () {
                try {
                    await handleFormSubmission(validFile, '   ', 'Traditional');
                    throw new Error('Expected error not thrown');
                } catch (e) {
                    e.message.should.equal('Please enter a caption.');
                }
            });
            it('should throw an error if caption is too long', async function () {
                const longCaption = 'a'.repeat(256);
                try {
                    await handleFormSubmission(validFile, longCaption, 'Traditional');
                    throw new Error('Expected error not thrown');
                } catch (e) {
                    e.message.should.equal('Caption is too long. Please keep it under 200 characters.');
                }
            });
            it('should throw an error if style is empty', async function () {
                try {
                    await handleFormSubmission(validFile, 'A cool caption', '');
                    throw new Error('Expected error not thrown');
                } catch (e) {
                    e.message.should.equal('Please enter a tattoo style.');
                }
            });
            it('should throw an error if style is whitespace', async function () {
                try {
                    await handleFormSubmission(validFile, 'A cool caption', '   ');
                    throw new Error('Expected error not thrown');
                } catch (e) {
                    e.message.should.equal('Please enter a tattoo style.');
                }
            });
            it('should throw an error if style is too long', async function () {
                const longStyle = 'a'.repeat(256);
                try {
                    await handleFormSubmission(validFile, 'A cool caption', longStyle);
                    throw new Error('Expected error not thrown');
                } catch (e) {
                    e.message.should.equal('Tattoo style is too long. Please keep it under 50 characters.');
                }
            });
        describe('Image Upload Handler', function () {
            it('should reject invalid file types', async function () {
                const invalidFile = new File(["dummy"], "test.gif", { type: "image/gif" });
                try {
                    await handleFormSubmission(invalidFile, 'Valid caption', 'Traditional');
                    throw new Error('Expected error not thrown');
                } catch (e) {
                    e.message.should.equal('Invalid file type.');
                }
            });
            it('should reject oversized files', async function () {
                const bigBlob = new Blob([new Uint8Array(6 * 1024 * 1024)], { type: 'image/png' });
                const bigFile = new File([bigBlob], "big.png", { type: "image/png" });
                try {
                    await handleFormSubmission(bigFile, 'Valid caption', 'Traditional');
                    throw new Error('Expected error not thrown');
                } catch (e) {
                    e.message.should.equal('File size exceeds 5MB.');
                }
            });
        });
        });
    });
});