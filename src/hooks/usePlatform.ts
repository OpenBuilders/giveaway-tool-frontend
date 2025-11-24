import { useMemo } from 'react';

export type PlatformName =
	| 'android'
	| 'ios'
	| 'macos'
	| 'tdesktop'
	| 'weba'
	| 'webk'
	| 'windows'
	| 'linux'
	| 'web'
	| 'unknown';

function readWebAppPlatform(): string | undefined {
	// Access Telegram WebApp platform if available
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const tgPlatform = (typeof window !== 'undefined' && (window as any)?.Telegram?.WebApp?.platform) as
		| string
		| undefined;
	return tgPlatform;
}

function detectPlatform(): PlatformName {
	const tgPlatform = readWebAppPlatform();
	if (tgPlatform && typeof tgPlatform === 'string') {
		const normalized = tgPlatform.toLowerCase();
		switch (normalized) {
			case 'android':
			case 'ios':
			case 'macos':
			case 'tdesktop':
			case 'weba':
			case 'webk':
			case 'windows':
			case 'linux':
			case 'web':
				return normalized;
			default:
				// Unknown value from WebApp, return as unknown to avoid misleading consumers
				return 'unknown';
		}
	}

	// Fallback: basic user agent sniffing when WebApp.platform is unavailable
	if (typeof navigator !== 'undefined') {
		const ua = navigator.userAgent.toLowerCase();
		if (ua.includes('android')) return 'android';
		if (ua.includes('iphone') || ua.includes('ipad') || ua.includes('ipod')) return 'ios';
		if (ua.includes('mac os x')) return 'macos';
		if (ua.includes('windows')) return 'windows';
		if (ua.includes('linux')) return 'linux';
		if (ua.includes('mobile')) return 'weba';
	}

	return 'unknown';
}

function detectIsMobile(platform: PlatformName): boolean {
	if (platform === 'android' || platform === 'ios') {
		return true;
	}
	// If platform unknown or desktop-ish, try UA as a weak heuristic
	if (typeof navigator !== 'undefined') {
		return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
	}
	return false;
}

export function usePlatform(): { platform: PlatformName; isMobile: boolean } {
	const platform = useMemo<PlatformName>(() => detectPlatform(), []);
	const isMobile = useMemo<boolean>(() => detectIsMobile(platform), [platform]);

	return { platform, isMobile };
}


