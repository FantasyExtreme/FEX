// pages/api/days.ts

import { NextApiRequest, NextApiResponse } from 'next';

function getDaysWithNames(year: number) {
  const daysOfWeek: string[] = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  const months: { name: string; days: number }[] = [
    { name: 'January', days: 31 },
    { name: 'February', days: year % 4 === 0 ? 29 : 28 }, // Leap year calculation
    { name: 'March', days: 31 },
    { name: 'April', days: 30 },
    { name: 'May', days: 31 },
    { name: 'June', days: 30 },
    { name: 'July', days: 31 },
    { name: 'August', days: 31 },
    { name: 'September', days: 30 },
    { name: 'October', days: 31 },
    { name: 'November', days: 30 },
    { name: 'December', days: 31 },
  ];

  const daysInYear: {
    year: number;
    month: string;
    day: number;
    dayOfWeek: string;
  }[] = [];

  months.forEach((month, monthIndex) => {
    for (let day = 1; day <= month.days; day++) {
      const date = new Date(year, monthIndex, day);
      const dayOfWeek = daysOfWeek[date.getDay()];
      daysInYear.push({
        year,
        month: month.name,
        day,
        dayOfWeek,
      });
    }
  });

  return daysInYear;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { year } = req.query;

  if (!year || Array.isArray(year) || isNaN(parseInt(year))) {
    return res.status(400).json({ error: 'Invalid year provided' });
  }

  const daysWithNames = getDaysWithNames(parseInt(year as string));

  res.status(200).json(daysWithNames);
}
