import { shallowMount } from '@vue/test-utils'
import RecipeList from '@/components/RecipeList.vue'

const factory = (recipes, colors) => {
  return shallowMount(RecipeList, {
    propsData: {
      recipes,
      colors
    }
  })
}

describe('HelloWorld.vue', () => {
  it('contains nothing by default', () => {
    const w = factory([])
    expect(w.find('v-card').exists()).toBe(false)
  })

  it('shows card, and list item per recipe', () => {
    const recipes = [
      {
        title: 'hello',
        time: 20
      }, 
      {
        title: 'there',
        time: 30
      }, 
      {
        title: 'and again',
        time: 40
      }
    ]
    // const w = factory(recipes)
    // expect(w.find('v-card').exists()).toBe(true)
    // expect(w.find('.recipe').exists()).toBe(true)
  })
})
