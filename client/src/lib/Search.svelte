<script>
	import { onMount } from 'svelte';
	import { tags, matchingTags, tag, availableTags, selectedTags } from '../store/tags';

	let searching;
	let selectedTagIndex = 0;

	onMount(tags.load);

	// TODO: add effect when append fails.
	function handleAdd(t) {
		if (!$availableTags.includes(t)) return;
		selectedTags.append(t);
		searching = false;
	}

	function handleKey(e) {
		switch (e.key) {
			case 'Enter':
				handleAdd($tag);
				break;
			case 'Tab':
				handleAdd($availableTags[selectedTagIndex]);
				break;
			case 'ArrowDown':
				if (selectedTagIndex > $selectedTags.length - 2) {
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
</script>

<div class="wrapper">
	<div class="search">
		<div class="input">
			<input
				type="text"
				placeholder="Search"
				bind:value={$tag}
				on:keydown={handleKey}
				on:focus={() => (searching = true)}
				on:blur={() => (searching = false)}
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
				on:click={() => handleAdd(tag)}
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

		{#if searching}
			<ul class="matching-tags-wrapper">
				{#each $matchingTags as t, i}
					<li
						class="matching-tag"
						on:mousedown={handleAdd(t)}
						on:mousemove={() => (selectedTagIndex = i)}
						class:selected={selectedTagIndex === i}
					>
						{t}
					</li>
				{/each}
			</ul>
		{/if}
	</div>
	{#if $selectedTags}
		<ul class="tags">
			{#each $selectedTags as tag}
				<li on:click={selectedTags.remove(tag)}>{tag}</li>
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
