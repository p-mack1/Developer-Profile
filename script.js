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
