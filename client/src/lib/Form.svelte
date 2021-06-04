<script>
	import SvelteMarkdown from 'svelte-markdown';
	import { schema, ingridientSchema } from '../utils/form';

	let edit = true;
	let errors = {};
	let iErrs = {};
	let recipe = { title: '', time: null, method: '', ingridients: [], tags: [] };
	let ingridient = { name: '', amount: '' };

	function deleteTag(tag) {
		recipe = { ...recipe, tags: recipe.tags.filter((t) => t !== tag) };
	}

	async function handleTag(e) {
		const newVal = e.target.value;

		if (e.key === 'Enter' && newVal) {
			if (recipe.tags.some((tag) => tag === newVal)) {
				errors = { ...errors, tags: "Can't use the same tag twice" };
				return;
			}

			recipe = { ...recipe, tags: [...recipe.tags, newVal] };
			e.target.value = '';
		}
	}

	async function handleValidation() {
		try {
			await schema.validate(recipe, { abortEarly: false });
			return true;
		} catch (err) {
			errors = err.inner.reduce((acc, err) => ({ ...acc, [err.path]: err.message }), {});
			return false;
		}
	}

	async function handleSubmit() {
		const isValid = await handleValidation();
		if (!isValid) return;
		try {
			const res = await fetch('/api', {
				method: 'POST',
				body: JSON.stringify(recipe)
			});
			// FIXME: open card with result
			console.log(res);
		} catch (err) {
			// FIXME: Deal with fetch error
			console.error(err);
		}
	}

	async function handleIngridient() {
		try {
			await ingridientSchema.validate(ingridient, { abortEarly: false });
			recipe = { ...recipe, ingridients: [...recipe.ingridients, ingridient] };
			ingridient = { name: '', amount: '' };
		} catch (err) {
			iErrs = err.inner.reduce((acc, err) => ({ ...acc, [err.path]: err.message }), {});
		}
	}
</script>

<form on:change|preventDefault={handleValidation}>
	<div class="grid-container">
		<div class="grid span2">
			<input class="input" type="text" id="title" bind:value={recipe.title} />
			<label class="label" for="title">Title</label>
			{#if errors.title}
				<span class="err">{errors.title}</span>
			{/if}
		</div>
		<div class="grid">
			<input type="text" bind:value={recipe.time} />
			<label for="">Time</label>
			{#if errors.time}
				<span class="err">{errors.time}</span>
			{/if}
		</div>
		<div class="grid span3">
			<input type="text" id="tag" on:keyup|preventDefault={handleTag} />
			<label for="tag">Tags</label>
			{#if errors.tags}
				<span class="err">{errors.tags}</span>
			{/if}
		</div>
		<div class="span3 flex">
			{#each recipe.tags as tag}
				<div class="tag" on:click={deleteTag(tag)}>{tag}</div>
			{/each}
		</div>
		<div class="grid">
			<input type="text" bind:value={ingridient.name} />
			<label for="">Ingridient</label>
			{#if iErrs.name}
				<span class="err">{iErrs.name}</span>
			{/if}
		</div>
		<div class="grid">
			<input type="text" bind:value={ingridient.amount} />
			<label for="">Amount</label>
			{#if iErrs.amount}
				<span class="err">{iErrs.amount}</span>
			{/if}
		</div>
		<div class="grid">
			<button class="btn" on:click|preventDefault={handleIngridient}>Add Ingridient</button>
		</div>

		<div class="grid span3">
			<span class="method">Method</span>
			<div class="flex">
				<div class="tab" on:click={() => (edit = true)}>Edit</div>
				<div class="tab" on:click={() => (edit = false)}>Preview</div>
			</div>

			{#if edit}
				<div id="edit" class="panel">
					<textarea bind:value={recipe.method} name="method" id="method" />
				</div>
			{:else}
				<div id="preview" class="panel">
					<SvelteMarkdown bind:source={recipe.method} />
				</div>
			{/if}
			{#if errors.method}
				<span class="err">{errors.method}</span>
			{/if}
		</div>
	</div>
	<div class="ingridients-container">
		<span class="label ingridients">Ingridients</span>
		{#if errors.ingridients}
			<span class="err">{errors.ingridients}</span>
		{/if}
		<ul class="grid">
			{#each recipe.ingridients as i}
				<li class="ingridient">{i.name}: {i.amount}</li>
			{/each}
		</ul>
	</div>
	<div class="submit">
		<input class="btn" type="submit" on:click|preventDefault={handleSubmit} placeholder="Submit" />
	</div>
</form>

<style>
	form {
		max-width: 1000px;
		display: grid;
		gap: 2rem;
		grid-template-columns: 3fr 1fr;
	}

	.grid-container {
		display: grid;
		gap: 1rem;
		grid-template-columns: 2fr 2fr 1fr;
	}

	.submit {
		grid-column: span 2;
		display: grid;
		place-items: center;
	}

	.tag {
		padding: 0.4rem 0.8rem;
		background: orange;
		border-radius: 20px;
	}

	textarea {
		border: none;
		overflow: auto;
		background-color: transparent;
		outline: none;
		box-shadow: none;
		resize: none;
		width: 100%;
		height: 100%;
	}

	.panel {
		height: 200px;
		border: 1px solid black;
	}

	.method {
		margin-top: 2rem;
		margin-bottom: 1rem;
		font-size: 1.1rem;
	}

	.submit > .btn {
		min-width: 180px;
		min-height: 50px;
		text-transform: uppercase;
	}

	.ingridients-container {
		margin-left: 2rem;
	}
	.ingridients-container .label {
		font-size: 1.8rem;
	}

	.ingridients-container .ingridient {
		margin-top: 1rem;
		background: var(--color-link);
		justify-self: start;
		padding: 0.4rem 0.8rem;
		border-radius: 20px;
	}

	.err {
		font-size: 0.7rem;
		color: red;
		position: relative;
	}
</style>
