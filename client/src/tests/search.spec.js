import { tick } from 'svelte'
import  Search  from '../lib/Search.svelte'
import { render, fireEvent } from '@testing-library/svelte'
import { tags } from '../store/tags'

const retTags = [
  "asian",
  "soup",
  "noodles",
  "italian",
  "curry"
]

global.window = {}
global.window.fetch = jest.fn().mockResolvedValue({
  ok: true,
  json: jest.fn().mockResolvedValue(retTags)
})

describe('autocomplete', () => {
  it('list tags from backend', async () => {
    // await tags.load()
    // await new Promise(r => setTimeout(r, 100))

    // const { getAllByRole, getByRole } = render(Search)
    // const block = getByRole('textbox')
    // await fireEvent.focus(block)

    // const ul = getAllByRole("list")[0]
    // console.log(ul)
    // const input = Array.from(ul.querySelector('li'))
    // console.log(input)
    // const foundTags = input.map(i => i.innerHTML)
    // expect(foundTags).toEqual(retTags)
  })

  // xit('only show max 5 suggestions', async () => {})

  // xit('select with enter', async () => {})

  // xit('dont suggest already selected tag', async () => {})

  // xit('dont accept already selected tag on enter', async () => {})

  // xit('tab ads first suggestion by default', async () => {})

  // xit('arrow up suggestion up', async () => {})

  // xit('arrow down suggestion down', async () => {})

  // xit('mouse hover suggestion to mouse position', async () => {})

  // xit('tab ads current highlighted position', async () => {})

  // xit('display selected tags under search bar', async () => {})

  // xit('remove selected tag pressing it', async () => {})

  // xit('removed selected tag shows in suggestions', async () => {})
})

// describe('index page start animation', () => {
//   xit('only perform start animation once', async () => {})
// })
