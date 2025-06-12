import React, { FC } from "react";

interface Props {
  dayOfMonth: number;
  date?: Date | undefined;
}

const DatePickerCustomDay: FC<Props> = ({ dayOfMonth, date }) => {
  return <span className="react-datepicker__day_span !text-[16px] font-poppins">{dayOfMonth}</span>;
};

export default DatePickerCustomDay;
