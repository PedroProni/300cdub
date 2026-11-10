export interface ConfirmRequest {
  title: string;
  message: string;
  confirmLabel: string;
}

export interface ConfirmState extends ConfirmRequest {
  open: boolean;
  resolver: ((result: boolean) => void) | null;
}
