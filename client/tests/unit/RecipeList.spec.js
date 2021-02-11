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
    const w = factory(recipes)
    expect(w.find('v-card').exists()).toBe(true)
    expect(w.find('.recipe').exists()).toBe(true)
    expect(w.findAll('.recipe').length).toEqual(recipes.length)
  })

  it('create chips with correct colors', () => {
    const recipes = [{
      title: 'hello',
      time: 30,
      tags: ['one', 'two', 'three']
    }]
    const colors = {
      'one': 'red',
      'two': 'green',
      'three': 'blue',
      'four': 'black'
    }

    const w = factory(recipes, colors)
    expect(w.findAll('.recipe').length).toEqual(1)
    expect(w.findAll('v-chip').length).toEqual(3)

    const tags = w.findAll('v-chip')
    expect(tags.at(0).attributes('color')).toEqual('red')
    expect(tags.at(1).attributes('color')).toEqual('green')
    expect(tags.at(2).attributes('color')).toEqual('blue')
  })

  it('get one less divider than recipes', () => {
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

    const w = factory(recipes)
    expect(w.findAll('.recipe').length).toEqual(w.findAll('v-divider').length + 1)
  })
})
