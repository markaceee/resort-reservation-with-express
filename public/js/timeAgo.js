// create a new Date object with the registration date
const registrationDate = new Date('March 11, 2023');

// calculate the difference between the registration date and the current date
const timeDifference = new Date() - registrationDate;

// calculate the number of milliseconds, seconds, minutes, hours, days, months, and years between the dates
const millisecondsAgo = Math.abs(timeDifference);
const secondsAgo = Math.floor(millisecondsAgo / 1000);
const minutesAgo = Math.floor(secondsAgo / 60);
const hoursAgo = Math.floor(minutesAgo / 60);
const daysAgo = Math.floor(hoursAgo / 24);
const monthsAgo = Math.floor(daysAgo / 30);
const yearsAgo = Math.floor(monthsAgo / 12);

// determine which unit of time to display
let timeAgo;
if (yearsAgo > 0) {
  timeAgo = yearsAgo + ' year' + (yearsAgo > 1 ? 's' : '') + ' ago';
} else if (monthsAgo > 0) {
  timeAgo = monthsAgo + ' month' + (monthsAgo > 1 ? 's' : '') + ' ago';
} else if (daysAgo > 0) {
  timeAgo = daysAgo + ' day' + (daysAgo > 1 ? 's' : '') + ' ago';
} else if (hoursAgo > 0) {
  timeAgo = hoursAgo + ' hour' + (hoursAgo > 1 ? 's' : '') + ' ago';
} else if (minutesAgo > 0) {
  timeAgo = minutesAgo + ' minute' + (minutesAgo > 1 ? 's' : '') + ' ago';
} else {
  timeAgo = secondsAgo + ' second' + (secondsAgo > 1 ? 's' : '') + ' ago';
}

console.log(timeAgo); // output: "0 years ago" (assuming the current date is March 11, 2023)
