<script>
	let tags;
	let selectedTags = ['one', 'two'];
	let selectedTagIndex = 0;
	let matchingTags;
	let tag;
	let searching;

	function handleChange(e) {
		searching = true;
		matchingTags = tags.filter((t) => t.includes(tag));
	}

	function handleKey(e) {
		switch (e.key) {
			case 'Enter':
				addTag();
				break;
			case 'Tab':
				handleTab();
				break;
			case 'ArrowDown':
				if (selectedTagIndex > selectedTags.length - 2) {
					selectedTagIndex += 1;
				}
				break;
			case 'ArrowUp':
				if (selectedTagIndex > 0) {
					selectedTagIndex -= 1;
				}
				break;
		}
	}

	function add() {
		selectedTags = [...selectedTags, tag];
		matchingTags = tags.filter((t) => selectedTags.every((s) => s !== t));
		tag = '';
		searching = false;

		fetch('http://localhost:3000/api?tags=' + selectedTags.join(',')).then(async (res) => {
			const data = await res.json();
			console.log(data);
		});
	}

	function handleTab() {
		// Onblur event not allowing this
		tag = matchingTags[selectedTagIndex];
		add();
	}

	function addTag() {
		if (!selectedTags.includes(tag) && tags.includes(tag)) {
			add();
		}
	}

	fetch('http://localhost:3000/api/tags').then(async (res) => {
		try {
			const data = await res.json();
			tags = data;
			matchingTags = data;
		} catch (err) {
			console.log(err);
		}
	});
</script>

<div class="wrapper">
	<div class="search">
		<div class="input">
			<input
				type="text"
				placeholder="Search"
				on:keydown={handleKey}
				bind:value={tag}
				on:focus={() => (searching = true)}
				on:blur={() => (searching = false)}
				on:input={handleChange}
			/>

			<svg
				version="1.1"
				id="Capa_1"
				xmlns="http://www.w3.org/2000/svg"
				xmlns:xlink="http://www.w3.org/1999/xlink"
				x="0px"
				y="0px"
				viewBox="0 0 512 512"
				style="enable-background:new 0 0 512 512;"
				on:click={addTag}
				xml:space="preserve"
			>
				<g>
					<g>
						<path
							d="M225.474,0C101.151,0,0,101.151,0,225.474c0,124.33,101.151,225.474,225.474,225.474
			c124.33,0,225.474-101.144,225.474-225.474C450.948,101.151,349.804,0,225.474,0z M225.474,409.323
			c-101.373,0-183.848-82.475-183.848-183.848S124.101,41.626,225.474,41.626s183.848,82.475,183.848,183.848
			S326.847,409.323,225.474,409.323z"
						/>
					</g>
				</g>
				<g>
					<g>
						<path
							d="M505.902,476.472L386.574,357.144c-8.131-8.131-21.299-8.131-29.43,0c-8.131,8.124-8.131,21.306,0,29.43l119.328,119.328
			c4.065,4.065,9.387,6.098,14.715,6.098c5.321,0,10.649-2.033,14.715-6.098C514.033,497.778,514.033,484.596,505.902,476.472z"
						/>
					</g>
				</g></svg
			>
		</div>

		{#if tags && searching}
			<ul>
				{#each matchingTags as tag, i}
					<li
						on:click={handleTab}
						on:mousemove={() => (selectedTagIndex = i)}
						class:selected={selectedTagIndex === i}
					>
						{tag}
					</li>
				{/each}
			</ul>
		{/if}
	</div>
	{#if selectedTags}
		<ul class="tags">
			{#each selectedTags as tag}
				<li>{tag}</li>
			{/each}
		</ul>
	{/if}
</div>

<style>
	input {
		appearance: none;
		border: none;
		outline: none;
	}

	.wrapper {
		display: flex;
		flex-direction: column;
	}

	.search {
		background-color: #fff;
		z-index: 1;
		padding: 1rem;
		border-radius: 2rem;
		width: 80vw;
		box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
	}

	.input {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-left: 1rem;
		padding-right: 0.8rem;
	}

	.search ul {
		border-top: 1px solid #bdbdbd;
		padding-top: 1rem;
	}

	.search li {
		padding: 0.5rem 1rem;
	}

	svg {
		height: 24px;
		width: auto;
	}

	.tags {
		display: flex;
	}

	.tags li {
		padding: 0.3rem 1rem;
		margin: 0.2rem;
		background: #e64a19;
		border-radius: 2rem;
		color: #fff;
	}

	.selected {
		background-color: #009688;
		color: #fff;
	}

	@media only screen and (min-width: 600px) {
		.search {
			width: 500px;
		}
	}
</style>
