import moment from 'moment';

export const DATE_RFC2822 = "ddd, DD MMM YYYY HH:mm:ss ZZ";

export function timeAgo(date: String) {
  return moment(date, DATE_RFC2822).fromNow()
}
