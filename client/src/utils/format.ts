export const formatTime = (isoString: string): string => {
  const date = new Date(isoString);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  };
  return new Intl.DateTimeFormat('ja-JP', options).format(date);
};

export const formatContent = (content: string): string => {
  const maxLength = 17;
  let formattedContent = '';
  for (let i = 0; i < content.length; i += maxLength) {
    const line = content.substring(i, i + maxLength);
    formattedContent += line + (i + maxLength < content.length ? '\n' : '');
  }
  return formattedContent;
};
