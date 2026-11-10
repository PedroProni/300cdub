import { useI18n } from "vue-i18n";
import { ApiError } from "@/api/api-error";
import { ERROR_CODE_KEYS, ERROR_KEYS, ERROR_STATUS_KEYS } from "@/composables/useApiError.constants";

export function useApiError() {
  const { t } = useI18n();
  function messageFor(error: unknown): string {
    if (!(error instanceof ApiError)) return t(ERROR_KEYS.generic);
    const byCode = error.code ? ERROR_CODE_KEYS[error.code.toLowerCase()] : undefined;
    if (byCode) return t(byCode);
    const byStatus = ERROR_STATUS_KEYS[error.status];
    return t(byStatus ?? ERROR_KEYS.generic);
  }
  return { messageFor };
}
