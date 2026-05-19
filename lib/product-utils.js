// Like One Product Utils — helpers for querying the product catalog

import { products } from './products.js';

/** Fields every product entry must define. */
export const REQUIRED_FIELDS = ['id', 'name', 'price', 'slug', 'type'];

/**
 * Returns the full product catalog array.
 * @returns {Array} products
 */
export function listProducts() {
  return products;
}
