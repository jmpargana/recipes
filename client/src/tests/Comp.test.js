import '@testing-library/jest-dom/extend-expect';

import { render, fireEvent } from '@testing-library/svelte';

import Comp from './Comp';

test('shows proper heading when rendered', () => {
	const { getByText } = render(Comp, { name: 'World' });

	expect(getByText('Hello World!')).toBeInTheDocument();
});

test('changes button text on click', async () => {
	const { getByText } = render(Comp, { name: 'World' });
	const button = getByText('Button');

	await fireEvent.click(button);

	expect(button).toHaveTextContent('Button Clicked');
});
