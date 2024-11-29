import Image from 'next/image';
import React from 'react';
import { E8S } from '@/constant/fantasticonst';
import infinite from '../../assets/images/infinte.png';
import ckbtc from '../../assets/images/icons/ckbtc.png';
import Link from 'next/link';
import { CONTESTS_ROUTE } from '@/constant/routes';
import {
  ContestPayment,
  PaymentTypes,
  QueryParamType,
} from '@/constant/variables';

export default function UserTransactionTableRow({ trans }: { trans: any }) {
  return (
    <tr>
      <td className='text-capitalize'>{trans?.title}</td>
      <td>
        <div className='d-flex'>
          <Image
            className='mx-1 mxw-50'
            src={trans?.paymentMethod == PaymentTypes.CKBTC ? ckbtc : infinite}
            alt='Infinite'
          />{' '}
          {trans?.amount / E8S}
        </div>
      </td>
      <td className={`color ${trans?.transaction_type}`}>
        {trans?.transaction_type == 'send' && 'Paid'}
        {trans?.transaction_type == 'receive' && 'Received'}
      </td>
      <td>{trans?.date}</td>
      <td>{trans?.time}</td>
      <td className='underlined'>
        {' '}
        <Link
          className='color'
          href={`${CONTESTS_ROUTE}?contestId=${trans.contestId}&type=${QueryParamType.simple}`}
        >
          {trans?.contestName}
        </Link>
      </td>
    </tr>
  );
}
