<script>
  let value
  export let id = "test"
  export let label = "Label"
</script>

<div class="input-group">
  <input {id} type="text" class="input-field" bind:value on:keyup>
  <label class:selected={value} for={id} class="input-label">{label}</label>
</div>

<style>
.input-group {
  width: 100%;
  margin-top: var(--space-md);
  padding: var(--space-xs);
  position: relative;
}

.input-field {
  width: calc(100% - 2 * var(--space-xs));
  border: none;
  border-bottom: 3px solid var(--color-text-primary);
  background: transparent;
  position: absolute;
  transition: all 0.1s ease-out;
  padding-left: var(--space-xs);
  padding-right: var(--space-xs);
}


.input-group .input-field ~ .input-label {
  font-family: var(--font-heading);
  transition: all 0.1s ease-out;
  pointer-events: none;
  position: relative;
  display: block;
  background: transparent;
  top: calc(-1 * var(--space-xs));
  padding-left: var(--space-xs);
  padding-right: var(--space-xs);
}

.input-field:hover {
  border-bottom: 3px solid var(--color-hover-secondary);
}

.input-field:focus {
  border: none;
  border-bottom: 3px solid var(--color-secondary);
  outline: none;
}

.input-group .input-field:hover ~ .input-label {
  color: var(--color-hover-secondary);
}

.input-group .input-field:focus ~ .input-label {
  transform: translate(0,calc(-1 * var(--space-md)));
  color: var(--color-secondary);
}

.selected {
  transform: translate(0,calc(-1 * var(--space-md)));
}

</style>