import { mount } from '@vue/test-utils'
import Home from '@/views/Home.vue'

const factory = () => mount(Home)

describe('Home', () => {
  it('mounts home', () => {
    const w = factory()
    expect(w.find('v-container').exists()).toEqual(true)
  })

  it('mounts home with button and hidden recipelist', () => {
    const w = factory()
    expect(w.find('v-autocomplete').exists()).toEqual(true)
    expect(w.find('RecipeList').exists()).toEqual(false)
  })
})
