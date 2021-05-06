<script>
	import InputBlock from '$lib/InputBlock.svelte';
	import Markdown from '$lib/Markdown.svelte';

	let errMsg = {
		tags: '',
		title: '',
		time: '',
		method: '',
		ingridients: ''
	};

	let recipe = {
		title: '',
		time: ''
	};

	let title = '';
	let tags = [];
	let ingridients = [];
	let ingridient = { name: '', amount: '' };

	async function handleSubmit() {
		// Validate everything else
		const res = await fetch('http://localhost:3000/api', {
			method: 'POST',
			body: JSON.stringify({
				...recipe,
				ingridients,
				tags,
				method
			})
		});
		console.log(res);
	}

	const addIngridient = () => {
		if (!ingridient.name && !ingridient.amount) {
			errMsg = {
				...errMsg,
				ingridients: 'Each ingridient must have a name and an amount'
			};
			return;
		}

		ingridients = [...ingridients, ingridient];
		ingridient = { name: '', amount: '' };
	};

	let parseTime = (e) => {
		if (!/^\d+$/.test(e.target.value)) {
			errMsg = {
				...errMsg,
				time: 'Must give numeric value in minutes'
			};
			return;
		}
		errMsg = {
			...errMsg,
			time: ''
		};
		recipe.time = e.target.value;
	};

	let addTag = (e) => {
		const newVal = e.target.value;
		if (e.key === 'Enter' && newVal) {
			if (tags.some((tag) => tag === newVal)) {
				errMsg = {
					...errMsg,
					tags: "Can't use the same tag twice"
				};
				return;
			}
			tags = [...tags, newVal];
			errMsg = {
				...errMsg,
				tags: ''
			};
			e.target.value = '';
		}
	};
</script>

<h1>Upload Section</h1>

<div class="form-container">
	<div class="grid-container">
		<InputBlock value={title} label={'Title'} />
		<InputBlock customEvent={parseTime} err={errMsg.time} label={'Time'} />
		<InputBlock err={errMsg.tags} customEvent={addTag} span={2} label={'Tags'} />
		<div class="tags">
			{#each tags as tag}
				<div class="tag">{tag}</div>
			{/each}
		</div>
		<div class="block">
			<label for="">Ingridient</label>
			<input type="text" bind:value={ingridient.name} />
		</div>
		<div class="block">
			<label for="">Amount</label>
			<input type="text" bind:value={ingridient.amount} />
		</div>

		<Markdown />
	</div>
	<div class="ingridients-container">
		<button on:click={addIngridient}>Add Ingridient</button>
		<span>Ingridients</span>

		<ul>
			{#each ingridients as i}
				<li>{i.name} {i.amount}</li>
			{/each}
		</ul>
	</div>
	<div class="submit">
		<button on:click={handleSubmit}>Submit</button>
	</div>
</div>

<style>
	.submit {
		grid-column: span 2;
		display: grid;
		place-items: center;
	}

	.form-container {
		display: grid;
		grid-template-columns: repeat(4, 1f);
		padding: 8rem;
		gap: 1rem;
	}

	.grid-container {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 0.5rem;
	}

	.tags {
		grid-column: span 2;
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.tag {
		padding: 0.4rem 0.8rem;
		background: orange;
		border-radius: 20px;
	}

	.block {
		display: grid;
	}
</style>
