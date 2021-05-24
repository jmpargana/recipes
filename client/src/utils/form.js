const addIngridient = errors => recipe => ingridient => {
  console.log(ingridient)
  if (!ingridient.name && !ingridient.amount) {
    errors.ingridients('Each ingridient must have a name and an amount')
    return ingridient;
  }

  recipe.changeIngridient(ingridient)
  return { name: '', amount: '' };
};


const parseTime = errors => recipe => e => {
  if (!/^\d+$/.test(e.target.value)) {
    errors.time('Must give numeric value in minutes')
    return;
  }

  errors.time('')
  recipe.changeTime(e.target.value)
};


const addTag = errors => recipe => tags => e => {
  const newVal = e.target.value;

  if (e.key === 'Enter' && newVal) {
    if (tags.some((tag) => tag === newVal)) {
      errors.tags("Can't use the same tag twice")
      return
    }

    recipe.changeTag(newVal)
    errors.tags('')
    e.target.value = '';
  }
};

// Container to form validation details.
// Holds object with each error message to show in form.
// and the functions needed for each field.
// Recipe is a store with ready methods.
export function validate(errors, recipe) {
  let tags
  const recipeUnsubscriber = recipe.subscribe(r => tags = r.tags)

  // FIXME: add complete validation
  return {
    ingridient: addIngridient(errors)(recipe),
    time: parseTime(errors)(recipe),
    tag: addTag(errors)(recipe)(tags),
    recipeUnsubscriber
  }
}