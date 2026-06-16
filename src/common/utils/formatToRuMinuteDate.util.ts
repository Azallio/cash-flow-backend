export function toRuMinuteDate(input?: string | Date) {
  const date = input ? new Date(input) : new Date();

  // получаем текущее время в UTC
  const utc = date.getTime();

  // смещение Moscow (UTC+3)
  const MSK_OFFSET = 3 * 60 * 60 * 1000;

  // переводим в "московское время"
  const mskTime = new Date(utc + MSK_OFFSET);

  // округляем до минуты (в МСК)
  mskTime.setSeconds(0, 0);

  // возвращаем обратно в UTC-таймлайн
  const backToUtc = new Date(mskTime.getTime() - MSK_OFFSET);

  return backToUtc;
}
