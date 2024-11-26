import React from 'react';
import { Spinner, Table } from 'react-bootstrap';

const TableLoader = () => {
  return (
    <div className='table-container'>
      <div className='table-inner-container'>
        <Table className='team-table'>
          <tbody className=''>
            <tr>
              <td colSpan={12}>
                <div className='d-flex justify-content-center'>
                  <Spinner animation='border' />
                </div>
              </td>
            </tr>
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default TableLoader;
