'use client';
import React, { useState } from 'react';
import { SlCalender } from 'react-icons/sl';
import Calendar from 'react-calendar';

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

const Calender_ = () => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [value, onChange] = useState<Value>(new Date());
  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
  };
  return (
    <div className='mt-5'>
      <div
        className='mt-5'
        style={{ display: 'inline-block', cursor: 'pointer' }}
      >
        <SlCalender
          size={30}
          className='mt-5 drop-shadow-glow animate-flicker text-white'
          onClick={toggleCalendar}
        />
      </div>
      {showCalendar && (
        <div>
          <Calendar onChange={onChange} value={value} />
        </div>
      )}
    </div>
  );
};

export default Calender_;
