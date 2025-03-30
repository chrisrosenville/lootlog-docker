export function createDateFromNow(ms: string) {
  const expiration = new Date();
  expiration.setMilliseconds(expiration.getTime() + parseInt(ms));

  return expiration;
}
