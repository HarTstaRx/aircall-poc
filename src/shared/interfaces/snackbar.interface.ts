export interface SnackbarInterface {
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  isVisible: boolean;
  message: string;
}
