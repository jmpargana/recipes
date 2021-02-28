import { mount } from '@vue/test-utils'
import SearchBar from '../components/SearchBar.vue'

describe('SearchBar', () => {
  it('mounts', () => {
    const wrapper = mount(SearchBar)
    expect(wrapper.toExist()).toEqual(true)
  })
})
