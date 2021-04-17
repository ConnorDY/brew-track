export function formatDate(date: Date) {
  const [month, day, year] = date.toString().split(' ').slice(1, 4);
  return `${month} ${day}, ${year}`;
}
