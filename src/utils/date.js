import moment from 'moment';

export const formatDuration = (date) => {
  const d = moment().hour(0);
  d.minute(date);

  return `${d.hour() > 0 ? `${d.hour()}h ` : ``}${d.minute()}m`;
};

export const formatReleaseDate = (date, isFullDate = false) => {
  const d = moment(date);

  const releaseDateString = isFullDate
    ? `${d.day()} ${d.format(`MMMM`)} ${d.year()}`
    : `${d.year()}`;

  return releaseDateString;
};

export const formatCommentDate = (date) => {
  const d = moment(date);
  const dayAgo = moment(new Date()).diff(d, `day`);

  const commentDateString =
    dayAgo > 1 ? d.format(`YYYY/M/D H:mm`) : d.fromNow();

  return commentDateString;
};
