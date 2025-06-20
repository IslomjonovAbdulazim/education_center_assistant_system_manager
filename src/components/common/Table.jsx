import React from 'react';
import Button from './Button';

const Table = ({ columns, data, onEdit, onDelete, onView, loading = false }) => {
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <div className="loading-spinner"></div>
        <div style={{ marginTop: '16px', color: '#718096' }}>Loading data...</div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#718096' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
        <div>No data available</div>
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} style={{ minWidth: column.width || 'auto' }}>
                {column.title}
              </th>
            ))}
            <th style={{ width: '120px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={item.id || index}>
              {columns.map((column) => (
                <td key={column.key}>
                  {column.render 
                    ? column.render(item[column.key], item, index) 
                    : item[column.key] || '-'
                  }
                </td>
              ))}
              <td>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {onView && (
                    <Button
                      size="small"
                      variant="secondary"
                      onClick={() => onView(item)}
                      icon="👁️"
                    />
                  )}
                  {onEdit && (
                    <Button
                      size="small"
                      variant="secondary"
                      onClick={() => onEdit(item)}
                      icon="✏️"
                    />
                  )}
                  {onDelete && (
                    <Button
                      size="small"
                      variant="danger"
                      onClick={() => onDelete(item.id)}
                      icon="🗑️"
                    />
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;