import { Metadata } from 'next';
import * as React from 'react';
import 'react-toastify/dist/ReactToastify.css';
import '@/styles/App.scss';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import 'tippy.js/dist/tippy.css';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';

import { ToastContainer } from 'react-toastify';
import NavBar from '@/components/Components/NavBar';
import Footer from '@/components/Components/Footer';
export default function RootLayout({
  children,
  hide,
}: {
  children: React.ReactNode;
  hide?: boolean;
}) {
  return (
    <html>
      {/* <Head> */}
      <head>
        <link
          href='https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css'
          rel='stylesheet'
        />
        <title>Fantasy Sports</title>
      </head>
      {/* </Head> */}
      <body>
        <ToastContainer theme='light' autoClose={3000} />
        <NavBar />
        {children}
        <Footer />

        <script
          src='https://kit.fontawesome.com/3fcb35e151.js'
          crossOrigin='anonymous'
        />
      </body>
    </html>
  );
}
