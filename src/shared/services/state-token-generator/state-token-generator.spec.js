import stateTokenGenerator from './state-token-generator';

describe('The state token generator service', function () {
  const byteString = '048>IYceiv{ÈÌÐàð';
  const asciiString = 'abcd+efgh==';

  let origBtoa, origCrypto;

  beforeEach(function () {
    origBtoa = global.btoa;
    global.btoa = jest.fn();
    global.btoa.mockImplementation(() => asciiString);

    origCrypto = global.crypto;
    global.crypto = {};
    global.crypto.getRandomValues = jest.fn();
    global.crypto.getRandomValues.mockImplementation((list) => {
      list[0] = 48; // 0
      list[1] = 52; // 4
      list[2] = 56; // 8
      list[3] = 62; // >
      list[4] = 73; // I
      list[5] = 89; // Y
      list[6] = 99; // c
      list[7] = 101; // e
      list[8] = 105; // i
      list[9] = 118; // v
      list[10] = 123; // {
      list[11] = 200; // È
      list[12] = 204; // Ì
      list[13] = 208; // Ð
      list[14] = 224; // à
      list[15] = 240; // ð
    });
  });

  afterEach(() => {
    global.btoa = origBtoa;
    global.crypto = origCrypto;
    global.msCrypto = undefined;
  });

  it('uses the msCrypto library when crypto is not available (IE11)', () => {
    global.msCrypto = global.crypto;
    global.crypto = undefined;
    const stateToken = stateTokenGenerator();

    expect(global.btoa).toHaveBeenCalledWith(byteString);
    expect(stateToken).toBe(asciiString);
  });

  it('returns an empty string when the crypto library is not available', () => {
    global.crypto = undefined;
    const stateToken = stateTokenGenerator();

    expect(global.btoa).not.toHaveBeenCalled();
    expect(stateToken).toBe('');
  });

  it('it generates a random string of characters and url encodes it', () => {
    const stateToken = stateTokenGenerator();
    expect(global.btoa).toHaveBeenCalledWith(byteString);
    expect(stateToken).toBe(asciiString);
  });
});
