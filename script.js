const navigationLinks = Array.from(
	document.querySelectorAll('.main-navigation a[href^="#"]')
);
const sections = navigationLinks
	.map(link => document.querySelector(link.getAttribute('href')))
	.filter(section => section !== null);

if ('IntersectionObserver' in window && sections.length > 0) {
	const linksBySection = new Map(
		navigationLinks.map(link => [
			document.querySelector(link.getAttribute('href')),
			link
		])
	);

	const observer = new IntersectionObserver(entries => {
		const visibleEntries = entries.filter(entry => entry.isIntersecting);

		if (visibleEntries.length === 0) {
			return;
		}

		const currentEntry = visibleEntries.reduce((closest, entry) => {
			const distance = Math.abs(
				entry.boundingClientRect.top - window.innerHeight * 0.3
			);
			const closestDistance = Math.abs(
				closest.boundingClientRect.top - window.innerHeight * 0.3
			);

			return distance < closestDistance ? entry : closest;
		});
		const currentLink = linksBySection.get(currentEntry.target);

		navigationLinks.forEach(link => link.removeAttribute('aria-current'));
		currentLink?.setAttribute('aria-current', 'location');
	}, {
		rootMargin: '-20% 0px -65% 0px',
		threshold: 0
	});

	sections.forEach(section => observer.observe(section));
}

const gmailLink = document.querySelector('[data-gmail-app-url]');
const isMobileDevice = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
	|| (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

if (gmailLink && isMobileDevice) {
	gmailLink.addEventListener('click', event => {
		if (
			event.button !== 0
			|| event.metaKey
			|| event.ctrlKey
			|| event.shiftKey
			|| event.altKey
		) {
			return;
		}

		event.preventDefault();
		const clearFallback = () => window.clearTimeout(fallbackTimer);
		const fallbackTimer = window.setTimeout(() => {
			window.location.href = gmailLink.href;
		}, 1200);

		document.addEventListener('visibilitychange', () => {
			if (document.hidden) {
				clearFallback();
			}
		}, { once: true });
		window.addEventListener('pagehide', clearFallback, { once: true });
		window.location.href = gmailLink.dataset.gmailAppUrl;
	});
}
