const parseTime = (timeStr) => {
  const [hourStr, modifier] = timeStr.split(" ");
  let [hour, minute] = hourStr.split(":").map(Number);

  if (modifier === "PM" && hour !== 12) {
    hour += 12;
  }
  if (modifier === "AM" && hour === 12) {
    hour = 0;
  }

  return new Date().setHours(hour, minute, 0, 0);
};

export const isTimeSlotPast = (timeSlot, date) => {
  const today = new Date();

  const todayDateOnly = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  const [year, month, dates] = date.split("-");
  const dateOnly = new Date(year, month - 1, dates);

  if (dateOnly < todayDateOnly) {
    return true;
  }
  if (dateOnly > todayDateOnly) {
    return false;
  }

  let slotTime = parseTime(timeSlot);

  slotTime += 60 * 60 * 1000;

  const now = today.getTime();

  return slotTime < now;
};

export const isTimeSlotBooked = (timeSlot, roomId, bookedArray) => {
  // console.log("IsBooked?", bookedArray);
  return bookedArray?.some(
    (booking) => booking.time === timeSlot && booking.room.id === roomId
  );
};

export const getBookedby = (date, time, bookedArray, setBookedby) => {
  console.log(bookedArray);
  bookedArray.forEach((book) => {
    if (book.date === date && book.time === time) {
      console.log(book.bookingTeam);
      setBookedby(book.bookingTeam);
    }
  });
};
