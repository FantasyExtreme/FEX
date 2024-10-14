'use client';
import React, { use, useEffect, useImperativeHandle, useRef, useState } from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { Container, Row, Col } from 'react-bootstrap';
import logger from '@/lib/logger';
import useSearchParamsHook from '@/components/utils/searchParamsHook';
import { QURIES } from '@/constant/variables';
export default function CarouselSlider({
  getSelectedDate,
  myuseRef
}: {
  getSelectedDate: any;
  myuseRef : any;
}) {
  interface DateInfo {
    dates: string;
    month: string;
    dateInMiliseconds: number;
  }
  const [activeIndex, setActiveIndex] = useState(0);
  const [currentDate, setCurrentDate] = useState<string>('');
  const [currentMonth, setCurrentMonth] = useState<string>('');
  const [slides, setSlides] = useState<null | DateInfo[]>(null);
  const carouselRef = useRef<any>(null);
  const urlparama = useSearchParamsHook();
  const searchParams = new URLSearchParams(urlparama);
  let tempTab = searchParams.get(QURIES.matchTab);
  const [tempTabId, setTempTabId] = useState<any>('');
  let tornumant = searchParams.get(QURIES.tournamentId);
  const [tornumanId, setTornumanId] = useState<any>('');

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
      slidesToSlide: 1,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 3,
      slidesToSlide: 1,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 3,
      slidesToSlide: 1,
    },
  };
  /**
   * generateDatesForYear use to get dates of one year past and one year next
   * @returns DateInfo[]
   * @param null
   */
  const generateDatesForYear = (): DateInfo[] => {
    const currentDate = new Date();

    // Calculate one year previous and one year next dates
    const startDate = new Date(currentDate);
    startDate.setFullYear(currentDate.getFullYear() - 1);

    const endDate = new Date(currentDate);
    endDate.setFullYear(currentDate.getFullYear() + 1);

    const dates: DateInfo[] = [];
    // let tempDate = new Date(previousYearDate);

    while (startDate < currentDate) {
      dates.push(formatDate(new Date(startDate)));
      startDate.setDate(startDate.getDate() + 1);
    }
    // Generate dates from the current date to one year after
    let isCurrentDateSelected = false;
    while (currentDate < endDate) {
      if (!isCurrentDateSelected) {
        setActiveIndex(dates.length);

        isCurrentDateSelected = true;
      }
      dates.push(formatDate(new Date(currentDate)));

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  };
  /**
   * formatDate  use to get miliseconds, date, month from date
   * @param date
   * @returns DateInfo
   */
  function formatDate(date: Date): DateInfo {
    const dateString = `${date.getDate()} ${date.toLocaleDateString('en-US', { month: 'short' })}`;
    const dayOfWeek = date.toLocaleDateString('en-US', {
      weekday: 'short',
    });
    let timeInMiliseconds=date.setHours(0, 0, 0, 0);
    return {
      dates: dateString,
      month: dayOfWeek,
      dateInMiliseconds:timeInMiliseconds,
    };
  }
  function updateActiveIndex() {
    const currentDefaultDate = new Date().setHours(0, 0, 0, 0);
    if (slides && slides.length > 0) {
      const defaultIndex = slides.findIndex(
        (slide) => slide.dateInMiliseconds === currentDefaultDate
      );
      if (defaultIndex !== -1) {
        carouselRef?.current.goToSlide(defaultIndex + 5);
        if (defaultIndex !== activeIndex) {
          getSelectedDate(slides[defaultIndex].dateInMiliseconds);
        }
      }
    }
  }
  useImperativeHandle(myuseRef, () => ({   // Expose the childMethod to parent
    updateActiveIndex,
  }));
  useEffect(() => {
    let timeoutId = setTimeout(() => {
      if (carouselRef?.current) {
        carouselRef?.current.goToSlide(activeIndex + 5);
      }
    }, 2000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [activeIndex]);
  useEffect(() => {
    let tempslides = generateDatesForYear();
    setSlides(tempslides);
  }, []);

  // useEffect(() => {
  //   setTornumanId(tornumant);
  // }, [tornumant]);
  useEffect(() => {
    if (carouselRef?.current) {
      carouselRef?.current.goToSlide(activeIndex + 5);
      // setActiveIndex(0);
    }
  }, []);

  return (
    <div className='main_slider'>
      {slides && (
        <Carousel
          ref={carouselRef}
          swipeable={false}
          draggable={false}
          responsive={responsive}
          ssr={true}
          infinite={true}
          autoPlaySpeed={1000}
          keyBoardControl={true}
          customTransition='all .5'
          containerClass='carousel-container'
          removeArrowOnDeviceType={['tablet', 'mobile']}
          // centerMode={true}

          afterChange={(previousSlide, { currentSlide }) => {
            getSelectedDate(slides[currentSlide - 5].dateInMiliseconds);
            setCurrentDate(slides[currentSlide - 5].dates);
            setCurrentMonth(slides[currentSlide - 5].month);
          }}
        >
          {slides.map((dateObj, index) => (
            <div key={index} className='slide-item'>
              <div className='dayOfWeek'>{dateObj.month}</div>
              <div className='date'>{dateObj.dates}</div>
            </div>
          ))}
        </Carousel>
      )}
    </div>
  );
}
