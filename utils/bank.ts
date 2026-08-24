export const getBankLogoPath = (shortName: string | undefined): string => {
	if (!shortName) return ''

	const availableBanks = ['CIMB', 'MSB', 'VCB']
	const normalizedName = shortName.toUpperCase()

	if (availableBanks.includes(normalizedName)) {
		return `/assets/images/banks/${normalizedName}.svg`
	}

	return `https://placehold.co/40x40?text=${shortName || 'Bank'}`
}
