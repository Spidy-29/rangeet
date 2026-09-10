export type Category = {
  id: string;
  name: string;
  meta: string;
  image: string;
};

export const CATEGORIES: Category[] = [
  { id: 'garba', name: 'ગરબા', meta: 'Festival · Navratri nights', image: '/assets/garba.jpg' },
  { id: 'dayro', name: 'ડાયરો', meta: 'Folk gathering · Lantern-lit', image: '/assets/dayro.jpg' },
  { id: 'cinema', name: 'ગુજરાતી ફિલ્મો', meta: 'Cinema · New Gujarati film songs', image: '/assets/cinema.jpg' },
  { id: 'bhajan', name: 'ભજન', meta: 'Devotional · Morning calm', image: '/assets/bhajan.jpg' },
  { id: 'folk', name: 'લોકગીત', meta: 'Folk songs · Village instruments', image: '/assets/folk.jpg' },
  { id: 'classics', name: 'જૂના ગુજરાતી ગીતો', meta: 'Classics · Vintage radio', image: '/assets/classics.jpg' }
];
