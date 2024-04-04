import { BlobSanitizerPipe } from './blob-sanitizer.pipe';

describe('BlobSanitizerPipe', () => {
  it('create an instance', () => {
    const pipe = new BlobSanitizerPipe();
    expect(pipe).toBeTruthy();
  });
});
