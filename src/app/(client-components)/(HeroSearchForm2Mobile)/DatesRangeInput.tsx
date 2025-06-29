"use client";

import DatePicker from "react-datepicker";
import React, { FC, Fragment, useEffect, useState } from "react";
import DatePickerCustomHeaderTwoMonth from "@/components/DatePickerCustomHeaderTwoMonth";
import DatePickerCustomDay from "@/components/DatePickerCustomDay";

export interface StayDatesRangeInputProps {
  className?: string;
  onChange?: (dates: [Date | null, Date | null]) => void;
  value?: [Date | null, Date | null];
}

const StayDatesRangeInput: FC<StayDatesRangeInputProps> = ({
  className = "",
  onChange,
  value,
}) => {
  const [startDate, setStartDate] = useState<Date | null>(value?.[0] ?? null);
  const [endDate, setEndDate] = useState<Date | null>(value?.[1] ?? null);

  useEffect(() => {
    setStartDate(value?.[0] ?? null);
    setEndDate(value?.[1] ?? null);
  }, [value?.[0], value?.[1]]);

  const onChangeDate = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    if (onChange && start && end) {
      onChange([start, end]);
    }
  };

  return (
    <div>
      <div className="p-5">
        <span className="block font-semibold text-xl sm:text-2xl">
          {` When's your trip?`}
        </span>
      </div>
      <div
        className={`relative flex-shrink-0 flex justify-center z-10 py-5 ${className} `}
      >
        <DatePicker
          selected={startDate}
          onChange={onChangeDate}
          startDate={startDate}
          endDate={endDate}
          selectsRange
          monthsShown={2}
          showPopperArrow={false}
          inline
          renderCustomHeader={(p) => <DatePickerCustomHeaderTwoMonth {...p} />}
          renderDayContents={(day, date) => (
            <DatePickerCustomDay dayOfMonth={day} date={date} />
          )}
        />
      </div>
    </div>
  );
};

export default StayDatesRangeInput;
