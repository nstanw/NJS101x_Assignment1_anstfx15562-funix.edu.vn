export const getHouseBetweenTwoDate = (
  startedDate: number,
  endDate: number
): number => {
  const diffInMilliseconds = Math.abs(
    endDate - startedDate
  );
  const diffInHours = diffInMilliseconds / 1000 / 60 / 60;

  return Math.round(diffInHours * 10) / 10;
};
