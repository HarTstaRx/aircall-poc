import { partialCall } from '../../shared/utils';

export const isSomeDay = (gapDays: number, someDate: Date) => {
  const today = new Date();
  return (
    someDate.getDate() === today.getDate() - gapDays &&
    someDate.getMonth() === today.getMonth() &&
    someDate.getFullYear() === today.getFullYear()
  );
};

export const isLastWeek = (someDate: Date) => {
  const today = new Date();
  return (
    someDate.getDate() >= today.getDate() - 6 &&
    someDate.getMonth() === today.getMonth() &&
    someDate.getFullYear() === today.getFullYear()
  );
};

export const isToday = partialCall(isSomeDay, 0);
export const isYesterday = partialCall(isSomeDay, 1);

export const getDayName = (someDate: Date): string => {
  return someDate.toLocaleDateString('en-US', { weekday: 'long' });
};

export const getShortDateString = (someDate: Date): string => {
  return someDate.toLocaleDateString('en-US', { dateStyle: 'short' });
};

const getDoubleDigit = (n: number): string => (n < 10 ? `0${n}` : `${n}`);

export const getShortTimeString = (someDate: Date): string => {
  const hours = someDate.getHours();
  const minutes = someDate.getMinutes();
  return `${getDoubleDigit(hours)}:${getDoubleDigit(minutes)}`;
};
