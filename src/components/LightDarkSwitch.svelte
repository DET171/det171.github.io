<script lang="ts">
import { AUTO_MODE, DARK_MODE, LIGHT_MODE } from '@constants/constants.ts';
import I18nKey from '@i18n/i18nKey';
import { i18n } from '@i18n/translation';
import Icon from '@iconify/svelte';
import {
	applyThemeToDocument,
	getStoredTheme,
	setTheme,
} from '@utils/setting-utils.ts';
import { onMount } from 'svelte';
import type { LIGHT_DARK_MODE } from '@/types/config.ts';

const seq: LIGHT_DARK_MODE[] = [LIGHT_MODE, DARK_MODE, AUTO_MODE];
let mode: LIGHT_DARK_MODE = $state(AUTO_MODE);

onMount(() => {
	mode = getStoredTheme();
	const darkModePreference = window.matchMedia('(prefers-color-scheme: dark)');
	const changeThemeWhenSchemeChanged: Parameters<
		typeof darkModePreference.addEventListener<'change'>
	>[1] = () => {
		applyThemeToDocument(mode);
	};
	darkModePreference.addEventListener('change', changeThemeWhenSchemeChanged);
	return () => {
		darkModePreference.removeEventListener(
			'change',
			changeThemeWhenSchemeChanged,
		);
	};
});

function switchScheme(newMode: LIGHT_DARK_MODE) {
	mode = newMode;
	setTheme(newMode);
}

function toggleScheme() {
	let i = 0;
	for (; i < seq.length; i++) {
		if (seq[i] === mode) {
			break;
		}
	}
	switchScheme(seq[(i + 1) % seq.length]);
}

function showPanel() {
	const panel = document.querySelector('#light-dark-panel');
	panel?.classList.remove('float-panel-closed');
}

function hidePanel() {
	const panel = document.querySelector('#light-dark-panel');
	panel?.classList.add('float-panel-closed');
}
</script>

<!-- z-50 make the panel higher than other float panels -->
<div class="relative z-50" role="menu" tabindex="-1" onmouseleave={hidePanel}>
	<button
		aria-label="Light/Dark Mode"
		role="menuitem"
		class="btn-plain scale-animation relative h-11 w-11 rounded-lg active:scale-90"
		id="scheme-switch"
		onclick={toggleScheme}
		onmouseenter={showPanel}
	>
		<div class="absolute" class:opacity-0={mode !== LIGHT_MODE}>
			<Icon
				icon="material-symbols:wb-sunny-outline-rounded"
				class="text-[1.25rem]"
			></Icon>
		</div>
		<div class="absolute" class:opacity-0={mode !== DARK_MODE}>
			<Icon
				icon="material-symbols:dark-mode-outline-rounded"
				class="text-[1.25rem]"
			></Icon>
		</div>
		<div class="absolute" class:opacity-0={mode !== AUTO_MODE}>
			<Icon
				icon="material-symbols:radio-button-partial-outline"
				class="text-[1.25rem]"
			></Icon>
		</div>
	</button>

	<div
		id="light-dark-panel"
		class="float-panel-closed absolute -right-2 top-11 hidden pt-5 transition lg:block"
	>
		<div class="card-base float-panel p-2">
			<button
				class="btn-plain scale-animation mb-0.5 flex h-9 w-full items-center !justify-start whitespace-nowrap rounded-lg px-3 font-medium transition active:scale-95"
				class:current-theme-btn={mode === LIGHT_MODE}
				onclick={() => switchScheme(LIGHT_MODE)}
			>
				<Icon
					icon="material-symbols:wb-sunny-outline-rounded"
					class="mr-3 text-[1.25rem]"
				></Icon>
				{i18n(I18nKey.lightMode)}
			</button>
			<button
				class="btn-plain scale-animation mb-0.5 flex h-9 w-full items-center !justify-start whitespace-nowrap rounded-lg px-3 font-medium transition active:scale-95"
				class:current-theme-btn={mode === DARK_MODE}
				onclick={() => switchScheme(DARK_MODE)}
			>
				<Icon
					icon="material-symbols:dark-mode-outline-rounded"
					class="mr-3 text-[1.25rem]"
				></Icon>
				{i18n(I18nKey.darkMode)}
			</button>
			<button
				class="btn-plain scale-animation flex h-9 w-full items-center !justify-start whitespace-nowrap rounded-lg px-3 font-medium transition active:scale-95"
				class:current-theme-btn={mode === AUTO_MODE}
				onclick={() => switchScheme(AUTO_MODE)}
			>
				<Icon
					icon="material-symbols:radio-button-partial-outline"
					class="mr-3 text-[1.25rem]"
				></Icon>
				{i18n(I18nKey.systemMode)}
			</button>
		</div>
	</div>
</div>
