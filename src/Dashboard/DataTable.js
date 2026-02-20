// DataTable.js
import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const DataTable = ({ data }) => {
  const columns = [
    { headerName: 'Label', field: 'label' },
    { headerName: 'Value', field: 'value' },
  ];

  return (
    <div className='mb-2 mt-1'>
    <div className="ag-theme-alpine" style={{ height: 500, width: '100%' }}>
      <AgGridReact
        columnDefs={columns}
        rowData={data}
        pagination={true}
        paginationPageSize={5}
      />
    </div></div>
  );
};

export default DataTable;
