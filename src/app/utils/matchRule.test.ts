import matchRule from './matchRule'

describe('matchRule util', () => {
  it('should match the following rules', () => {
    expect(matchRule('bird123', 'bird*')).toBe(true)
    expect(matchRule('123bird', '*bird')).toBe(true)
    expect(matchRule('123bird123', '*bird*')).toBe(true)
    expect(matchRule('bird123bird', 'bird*bird')).toBe(true)
    expect(matchRule('123bird123bird123', '*bird*bird*')).toBe(true)
    expect(matchRule('s[pe]c 3 re$ex 6 cha^rs', 's[pe]c*re$ex*cha^rs')).toBe(true)
    expect(matchRule('/url/exact', '/url/exact')).toBe(true)
  })

  it('should not match the following rules', () => {
    expect(matchRule('should not match', 'should noo*oot match')).toBe(false)
    expect(matchRule('/url/not/exact', '/url/not/exacts')).toBe(false)
    expect(matchRule('/url/not/exacts', '/url/not/exact')).toBe(false)
  })
})
