<script lang="ts">
import I18nKey from '@i18n/i18nKey';
import { i18n } from '@i18n/translation';
import Icon from '@iconify/svelte';
import { getDefaultHue, getHue, setHue } from '@utils/setting-utils';

let hue = getHue();
const defaultHue = getDefaultHue();

function resetHue() {
	hue = getDefaultHue();
}

$: if (hue || hue === 0) {
	setHue(hue);
}
</script>

<div
	id="display-setting"
	class="float-panel float-panel-closed absolute right-4 w-80 px-4 py-4 transition-all"
>
	<div class="mb-3 flex flex-row items-center justify-between gap-2">
		<div
			class="relative ml-3 flex gap-2 text-lg font-bold text-neutral-900 transition before:absolute
						before:-left-3 before:top-[0.33rem] before:h-4 before:w-1
						before:rounded-md before:bg-[var(--primary)] dark:text-neutral-100"
		>
			{i18n(I18nKey.themeColor)}
			<button
				aria-label="Reset to Default"
				class="btn-regular h-7 w-7 rounded-md active:scale-90"
				class:opacity-0={hue === defaultHue}
				class:pointer-events-none={hue === defaultHue}
				on:click={resetHue}
			>
				<div class="text-[var(--btn-content)]">
					<Icon icon="fa6-solid:arrow-rotate-left" class="text-[0.875rem]"
					></Icon>
				</div>
			</button>
		</div>
		<div class="flex gap-1">
			<div
				id="hueValue"
				class="flex h-7 w-10 items-center justify-center rounded-md bg-[var(--btn-regular-bg)]
						text-sm font-bold text-[var(--btn-content)] transition"
			>
				{hue}
			</div>
		</div>
	</div>
	<div
		class="h-6 w-full select-none rounded bg-[oklch(0.80_0.10_0)] px-1 dark:bg-[oklch(0.70_0.10_0)]"
	>
		<input
			aria-label={i18n(I18nKey.themeColor)}
			type="range"
			min="0"
			max="360"
			bind:value={hue}
			class="slider"
			id="colorSlider"
			step="5"
			style="width: 100%"
		/>
	</div>
</div>

<style lang="stylus">
		#display-setting
			input[type="range"]
				-webkit-appearance none
				height 1.5rem
				background-image var(--color-selection-bar)
				transition background-image 0.15s ease-in-out

				/* Input Thumb */
				&::-webkit-slider-thumb
					-webkit-appearance none
					height 1rem
					width 0.5rem
					border-radius 0.125rem
					background rgba(255, 255, 255, 0.7)
					box-shadow none
					&:hover
						background rgba(255, 255, 255, 0.8)
					&:active
						background rgba(255, 255, 255, 0.6)

				&::-moz-range-thumb
					-webkit-appearance none
					height 1rem
					width 0.5rem
					border-radius 0.125rem
					border-width 0
					background rgba(255, 255, 255, 0.7)
					box-shadow none
					&:hover
						background rgba(255, 255, 255, 0.8)
					&:active
						background rgba(255, 255, 255, 0.6)

				&::-ms-thumb
					-webkit-appearance none
					height 1rem
					width 0.5rem
					border-radius 0.125rem
					background rgba(255, 255, 255, 0.7)
					box-shadow none
					&:hover
						background rgba(255, 255, 255, 0.8)
					&:active
						background rgba(255, 255, 255, 0.6)

</style>
