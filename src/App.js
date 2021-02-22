import {
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isWeekend as isWeekendFn,
  addWeeks,
  eachHourOfInterval,
  startOfDay,
  endOfDay,
} from "date-fns";
import { format } from "date-fns/esm";
import { useState } from "react";

// Hello
function getWeekdays(activeWeek) {
  // This is an arbitrary day in the week as exact day doesn't matter

  const datesInWeek = eachDayOfInterval({
    start: startOfWeek(activeWeek),
    end: endOfWeek(activeWeek),
  });

  const weekDays = datesInWeek.map((date) => {
    const dayOfWeek = format(date, "iii");
    const isWeekend = isWeekendFn(date);

    const hours = eachHourOfInterval({
      start: startOfDay(date),
      end: endOfDay(date),
    });
    return { date, dayOfWeek, isWeekend, hours };
  });

  return weekDays;
}

// function getDays(activeWeek) {

// }

function useOffset(initialOffset = 0) {
  const [offset, setOffset] = useState(initialOffset);

  function resetOffset() {
    setOffset(0);
  }

  function incOffset(amount = 1) {
    setOffset((prev) => prev + amount);
  }

  function decOffset(amount = 1) {
    incOffset(-amount);
  }

  return { offset, resetOffset, incOffset, decOffset };
}

function useTimetable() {
  const now = new Date();
  const { offset, incOffset, decOffset, resetOffset } = useOffset(0);
  const activeWeek = addWeeks(now, offset);

  const weekdays = getWeekdays(activeWeek);
  // const days = getDays(activeWeek);

  return {
    weekdays,
    offset,
    addWeek: incOffset,
    subWeek: decOffset,
    resetWeek: resetOffset,
  };
}

const WeekDay = ({ isWeekend, ...props }) => (
  <div
    {...props}
    style={{
      border: "1px solid lightgray",
      background: isWeekend ? "red" : "transparent",
      textAlign: "center",
    }}
  />
);

const Hour = ({ ...props }) => (
  <div
    style={{
      padding: "0.5rem",
      borderBottom: "1px solid lightgray",
      borderLeft: "1px solid lightgray",

      height: 50,
      cursor: "pointer",
    }}
    {...props}
  />
);

// Best API I can think of right now is to return an array with all visible days
// containing all the info, such as. Name of day. All hours within day and so on
//
// Eg:
// [
//   {
//     name: "Monday",
//     hours: [...]
//   }
// ]
// Then you can do this:
//
// <div>
//   <span>{day.name}</span>
//     {day.hours.map(hour) => <div>{hour}</div>} These can simply stack
// </div>

export default function App() {
  const { weekdays, addWeek, subWeek, resetWeek } = useTimetable();
  return (
    <div className="App">
      <span>
        <div style={{ width: "100%" }}>
          <div
            style={{
              background: "lightgray",
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
            }}
          >
            {weekdays.map((weekDay) => (
              <WeekDay
                key={weekDay.date}
                isWeekend={weekDay.isWeekend}
                onClick={(e) => console.log(weekDay)}
              >
                {format(weekDay.date, "iii") + " "}
              </WeekDay>
            ))}
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              overflow: "auto",
              height: 500,
            }}
          >
            {weekdays.map((day) => (
              <div className="day">
                {day.hours.map((hour) => (
                  <Hour onClick={() => console.log(hour)}>
                    {hour.getHours()}
                  </Hour>
                ))}
              </div>
            ))}
          </div>
        </div>
        <button onClick={() => subWeek()}>{"<"}</button>
        <button onClick={() => addWeek()}>{">"}</button>

        <button onClick={() => resetWeek()}>reset</button>
        <pre>{JSON.stringify(weekdays, null, 2)}</pre>
      </span>
    </div>
  );
}
