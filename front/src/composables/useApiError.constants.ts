export const ERROR_KEYS = {
  generic: "errors.generic",
  network: "errors.network",
  unauthorized: "errors.unauthorized",
  validation: "errors.validation",
  notFound: "errors.notFound",
  tooManyRequests: "errors.tooManyRequests",
} as const;

export const ERROR_CODE_KEYS: Record<string, string> = {
  network_error: "errors.network",
  invalid_credentials: "errors.invalidCredentials",
  wrong_current_password: "errors.wrongPassword",
  same_password: "errors.samePassword",
  image_invalid_type: "errors.fileType",
  image_too_large: "errors.fileTooLarge",
  image_corrupt: "errors.imageCorrupt",
  image_limit_reached: "errors.imageLimit",
  too_many_requests: "errors.tooManyRequests",
  unauthorized: "errors.unauthorized",
};

export const ERROR_STATUS_KEYS: Record<number, string> = {
  0: "errors.network",
  400: "errors.validation",
  401: "errors.unauthorized",
  404: "errors.notFound",
  413: "errors.fileTooLarge",
  415: "errors.fileType",
  422: "errors.validation",
  429: "errors.tooManyRequests",
};
