import 'react-toastify/dist/ReactToastify.css';
import { Metadata } from 'next';
import * as React from 'react';
import 'react-toastify/dist/ReactToastify.css';
import '@/styles/App.scss';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import 'tippy.js/dist/tippy.css';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';

export const metadata: Metadata = {};
import { ToastContainer } from 'react-toastify';
import NavBar from '@/components/Components/NavBar';
import Footer from '@/components/Components/Footer';
import Loading from './loading';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-WKVDH249');`,
          }}
        ></script>
        <link
          href='https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css'
          rel='stylesheet'
        />
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <title>
        Decentralized Fantasy Sports Platform on ICP, Create team, Win & Earn
        </title>
        <link rel='icon' type='image/x-icon' href='/favicon.ico' />
        <link rel='canonical' href='https://fantasyextreme.org/' />

        <meta
          property='og:title'
          content='Decentralized Fantasy Sports Platform on ICP, Create team, Win & Earn'
        />
        <meta property='og:type' content='website' />
        <meta property='og:url' content='https://fantasyextreme.org/' />
        <meta
          property='og:image'
          content='https://fantasyextreme.org/img/hero-bg.png'
        />
        <meta property='og:image:width' content='700' />
        <meta property='og:image:height' content='500' />
        <meta property='og:site_name' content='Fantasy Extreme' />
        <meta
          property='og:description'
          content="Fantasy Extreme: A Decentralized Fantasy Sports Platform build on Internet Computer Protocol - ICP. Create Your Virtual Team, Join Contest, Win & Earn"
        />
        <link
          href='https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap'
          rel='stylesheet'
        />
        <meta name=' twitter:card' content='summary_large_image' />
        <meta name='twitter:site' content='https://fantasyextreme.org/' />
        <meta
          name='twitter:title'
          content='Decentralized Fantasy Sports Platform on ICP, Create team, Win & Earn'
        />
        <meta
          name='twitter:description'
          content="Fantasy Extreme: A Decentralized Fantasy Sports Platform build on Internet Computer Protocol - ICP. Create Your Virtual Team, Join Contest, Win & Earn"
        />
        <meta
          name=' twitter:image'
          content='https://fantasyextreme.org/img/hero-bg.png'
        />
        <script
          async
          src='https://www.googletagmanager.com/gtag/js?id=G-E1QDSLC99H'
        ></script>

        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-E1QDSLC99H');
          `,
          }}
        ></script>
      </head>
      <body>
        <React.Suspense fallback={<Loading />}>
          <ToastContainer
            style={{ marginBottom: '90px' }}
            theme='light'
            autoClose={3000}
            position='bottom-center'
            bodyClassName='Toastify__toast-body'
          />
          <NavBar />
          {/* <div className='spacer-60' /> */}

          {children}
          <Footer />
          <script
            src='https://kit.fontawesome.com/3fcb35e151.js'
            crossOrigin='anonymous'
          />
        </React.Suspense>
        <noscript>
          <iframe
            src='https://www.googletagmanager.com/ns.html?id=GTM-WKVDH249'
            height='0'
            width='0'
            style={{ display: 'none', visibility: 'hidden' }}
          ></iframe>
        </noscript>
      </body>
    </html>
  );
}
