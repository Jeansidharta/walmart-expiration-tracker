export function calculateUPCChecksum(upc: string) {
	if (!/^\d{11}$/.test(upc)) {
		throw new Error("UPC must be an 11-digit number.");
	}

	let evenSum = 0;
	let oddSum = 0;

	for (let i = 0; i < 11; i++) {
		const digit = parseInt(upc[i]);
		if ((i + 1) % 2 === 0) {
			evenSum += digit;
		} else {
			oddSum += digit;
		}
	}

	const totalSum = oddSum * 3 + evenSum;
	const checksum = (10 - (totalSum % 10)) % 10;

	return checksum;
}

export function appendUpcCheksum(upc: string) {
	return `${upc}${calculateUPCChecksum(upc)}`;
}
