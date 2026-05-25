export const FETCH_PRODUCTS_REQUEST = 'products/fetchProductsRequest' as const;
export const FETCH_PRODUCT_BY_ID_REQUEST = 'products/fetchProductByIdRequest' as const;

export interface FetchProductsPayload {
  category?: string;
  search?: string;
}

export interface FetchProductsRequestAction {
  type: typeof FETCH_PRODUCTS_REQUEST;
  payload?: FetchProductsPayload;
}

export interface FetchProductByIdRequestAction {
  type: typeof FETCH_PRODUCT_BY_ID_REQUEST;
  payload: string;
}

export const fetchProductsRequest = (payload?: FetchProductsPayload): FetchProductsRequestAction => ({
  type: FETCH_PRODUCTS_REQUEST,
  payload,
});

export const fetchProductByIdRequest = (id: string): FetchProductByIdRequestAction => ({
  type: FETCH_PRODUCT_BY_ID_REQUEST,
  payload: id,
});
