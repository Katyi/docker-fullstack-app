export const formatPrice = (price: number) => {
  // return new Intl.NumberFormat('en-US', {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    // currency: 'USD',
    currency: 'RUB',
  }).format(price);
};

export const formatDay = (date: string | null) => {
  if (date) {
    return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(new Date(date));
  } else {
    return '';
  }
};

// export const formatDay = (date: string) => {
//   return new Intl.DateTimeFormat('ru-RU', {
//     day: '2-digit',
//     month: 'long',
//     year: 'numeric',
//   }).format(new Date(date));
// };
