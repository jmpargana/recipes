import * as yup from 'yup'

export const ingridientSchema = yup.object().shape({
		name: yup.string().required('Each ingridient must have a name.'),
		amount: yup.string().required('Each ingridient must have an amount.')
	});

export const schema = yup.object().shape({
		title: yup.string().required('Please provide a title.'),
		time: yup
			.number()
			.typeError('Time must be a number in minutes.')
			.max(600, 'Are you sure this recipe will take that long?')
			.required('Please provide the time in minutes.'),
		method: yup.string().required('Cannot create a recipe without a method.'),
		ingridients: yup
			.array()
			.of(ingridientSchema)
			.min(1, 'Cannot create a recipe without ingridients.'),
		tags: yup
			.array()
			.of(yup.string().required())
			.min(1, 'No tags means this recipe cannot be found.')
	});