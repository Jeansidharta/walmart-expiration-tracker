import { BASE_URL } from "../constants";

export function productImageURL (barcode: string) {

	return `${BASE_URL}/product/${barcode}/image`
}
