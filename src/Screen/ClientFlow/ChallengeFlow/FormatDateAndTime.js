// src/utils/dateFormatter.js

export const FormatDateAndTime = dateString => {
  const date = new Date(dateString);

  const optionsDate = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  };

  const optionsTime = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  };

  const formattedDate = new Intl.DateTimeFormat('en-GB', optionsDate).format(
    date,
  );
  const formattedTime = new Intl.DateTimeFormat('en-US', optionsTime).format(
    date,
  );

  return {formattedDate, formattedTime};
};
