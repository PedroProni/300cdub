interface EarlyProduct {
  slug: string;
  promise: Promise<Response | null>;
}

interface Window {
  __earlyProduct?: EarlyProduct;
}
