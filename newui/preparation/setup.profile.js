
const DomainPage = require('../pages/protection.domains')
const defaultProfile = require('../data/profile').defaultProfile
const profileUtil = require('../specUtils/profile')

describe('Setup default profile ', () => {
  let page = new DomainPage()

  beforeAll(() => { 
    profileUtil.deleteAllProfiles()
  })

  it('add default profile', () => {
    profileUtil.setupProfile(false)
    page.open()
    let isExist = page.isProfileExistByName(defaultProfile.name)
    expect(isExist).toBe(true)
  })

})