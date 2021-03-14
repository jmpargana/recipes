import {shallowMount} from '@vue/test-utils'
import SearchBar from '../../src/components/SearchBar.vue'
import store from '../../src/store'

const factory = () => shallowMount(SearchBar, {
  global: {
    plugins: [store]
  }
})

describe('SearchBar', () => {
  it('sanity test', () => {})

  it('adds available tag with enter and cleans input field', async () => {
    const wrapper = factory()
    expect(wrapper.exists()).toBe(true)
    expect(store.state.tags.length).toEqual(2)

    const textInput = wrapper.find('input[type="text"]')
    await textInput.setValue('asian')
    await textInput.trigger('keyup.enter')

    expect(textInput.element.value).toEqual('')
    expect(store.state.tags.length).toEqual(3)
    expect(store.state.tags[2]).toEqual('asian')
  })

  it('opens suggestions when available', async () => {
    const wrapper = factory()
    expect(wrapper.find('ul').isVisible()).toBe(false)

    const textInput = wrapper.find('input')
    await textInput.setValue('a')
    expect(wrapper.find('ul').isVisible()).toBe(true)
  })

  it('adds available tag with tab', async () => {
    const wrapper = factory()

    const textInput = wrapper.find('input')
    await textInput.setValue('portuguese')
    await textInput.trigger('keydown.tab')
    expect(textInput.element.value).toEqual('')
    expect(store.state.tags.length).toEqual(4)
    expect(store.state.tags[3]).toEqual('portuguese')
  })

  it('does not add non available tag', async () => {
    const wrapper = factory()

    const textInput = wrapper.find('input')
    await textInput.setValue('lkajhfd')
    await textInput.trigger('keydown.tab')

    expect(textInput.element.value).toEqual('lkajhfd')
    expect(store.state.tags.length).toEqual(4)
    expect(store.state.tags[3]).toEqual('portuguese')
  })

  it('adds completion (first suggestion) with tab', async () => {
    const wrapper = factory()

    const textInput = wrapper.find('input')
    await textInput.setValue('so')

    const suggestions = wrapper.findAll('li')
    expect(suggestions[0].classes()).toContain('bg-indigo-100')

    await textInput.trigger('keydown.tab')
    expect(textInput.element.value).toEqual('')
    expect(store.state.tags.length).toEqual(5)
    expect(store.state.tags[4]).toEqual('soup')
  })

  it('changes hightlight on hover', async () => {
    const wrapper = factory()

    const textInput = wrapper.find('input')
    await textInput.setValue('e')

    const suggestions = wrapper.findAll('li')

    await suggestions[3].trigger('mouseover')
    expect(suggestions[3].classes()).toContain('bg-indigo-100')
    expect(suggestions[0].classes()).not.toContain('bg-indigo-100')

    await suggestions[0].trigger('mouseover')
    expect(suggestions[0].classes()).toContain('bg-indigo-100')
    expect(suggestions[3].classes()).not.toContain('bg-indigo-100')
  })

  it('changes hightlight with ctrl-n/p', async () => {
    const wrapper = factory()

    const textInput = wrapper.find('input')
    await textInput.setValue('p')

    const suggestions = wrapper.findAll('li')

    expect(suggestions[0].classes()).toContain('bg-indigo-100')
    expect(suggestions[1].classes()).not.toContain('bg-indigo-100')

    await textInput.trigger('keyup.down')

    expect(suggestions[0].classes()).not.toContain('bg-indigo-100')
    expect(suggestions[1].classes()).toContain('bg-indigo-100')

    await textInput.trigger('keyup.up')
    expect(suggestions[0].classes()).toContain('bg-indigo-100')
    expect(suggestions[1].classes()).not.toContain('bg-indigo-100')
  })

  it('shows no highlight for no combination', async () => {
    const wrapper = factory()

    const textInput = wrapper.find('input')
    await textInput.setValue('lajdshfa')

    expect(wrapper.find('ul').exists()).toBe(true)
    expect(wrapper.findAll('li').length).toEqual(0)
  })
})
