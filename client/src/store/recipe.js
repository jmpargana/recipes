import { derived } from 'svelte/store';
import { selectedTags } from './tags';


// Base should be global
const BASE_URL = 'http://localhost:3000/api'

const mockData = [
  {
    title: "Lentil Soup",
    time: 30,
    tags: [
      {
        text: 'vegan',
        color: 'orange'
      },
      {
        text: 'lentils',
        color: 'green',
        dark: true
      },
      {
        text: 'arab',
        color: 'yellow',
      },
    ]
  },
  {
    title: "Hummus",
    time: 5,
    tags: [
      {
        text: 'vegan',
        color: 'orange'
      },
      {
        text: 'arab',
        color: 'yellow',
      },
    ]
  },
  {
    title: "Moroccan Feast",
    time: 40,
    tags: [
      {
        text: 'vegan',
        color: 'orange'
      },
      {
        text: 'aubergine',
        color: 'blue',
        dark: true
      },
      {
        text: 'arab',
        color: 'yellow',
      },
    ]
  },
  {
    title: "Lentil Soup",
    time: 30,
    tags: [
      {
        text: 'vegan',
        color: 'orange'
      },
      {
        text: 'lentils',
        color: 'green',
        dark: true
      },
      {
        text: 'arab',
        color: 'yellow',
      },
    ]
  },

]

// Complete recipes loaded from backend.
// Depends on the selectedTags and will trigger a call
// everytime a tag is added or removed.
export const recipes = derived(selectedTags, async ($selectedTags) => {
	try {
    const url = new URL(BASE_URL).searchParams
        .append('tags', $selectedTags.join(','))
        // TODO: add pagination
        // .append('page', page)
		const res = await fetch(url);
		const recipes = await res.json();
		return recipes || [];
	} catch (err) {
		console.error('Failed fetching recipes from server with: ', err);
		return mockData;
	}
});
