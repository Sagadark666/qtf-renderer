import React, { ReactNode, useState } from 'react';
import Grid from './Grid';
import { useQuery } from '@apollo/client';
import { getTableMetadata } from '../apollo/metadataQuery';
import { getTableData } from '../apollo/dataQuery';
import WithApolloProvider from '../config/apollo';
import ShadowDomComponent from './ShadowDomComponent';
import Form from "./Form";

interface TrayContainerProps {
  tableName: string;
  exceptions?: string[];
  customForm?: ReactNode | string;
}

export const TrayContainer: React.FC<TrayContainerProps> = ({ tableName, exceptions = [], customForm }) => {
  const [showForm, setShowForm] = useState(false);
  const toggleForm = () => setShowForm(!showForm);

  const { data: metadata, loading: metaLoading, error: metaError } = useQuery(getTableMetadata(), {
    variables: { tableName },
  });

  const { data: rowDataResponse, error: dataError, refetch } = useQuery(getTableData(), {
    variables: { tableName },
  });

  const handleFormSubmit = (response: Record<string, any>) => {
    alert(`Form submitted! The new record was created successfully with id: ${response}`);
    setShowForm(false); // Hide form and show grid
    refetch(); // Re-query the data to update the grid
  };

  if (metaLoading || !metadata || !rowDataResponse) return <p>Loading...</p>;
  if (metaError) return <p>Error: {metaError.message}</p>;
  if (dataError) return <p>Error: {dataError.message}</p>;

  const formattedMetadata = metadata.tableMetadata.map((field: any) => ({
    id: field.column_name,
    field: field.column_name,
    maxLength: field.character_maximum_length,
    dataType: field.data_type,
    isNullable: field.is_nullable,
    default: field.column_default,
    isReference: field.is_reference,
    referenceTable: field.reference_table,
    referenceColumn: field.reference_column,
  }));
  

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    paddingTop: '20px',
  };

  const buttonStyle: React.CSSProperties = {
    padding: '10px 15px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  };

  const newButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: '#405189',
    color: 'white',
  };

  const newButtonHoverStyle: React.CSSProperties = {
    backgroundColor: '#323b6a',
  };

  const cancelButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: '#343a40',
    color: 'white',
  };

  const cancelButtonHoverStyle: React.CSSProperties = {
    backgroundColor: '#23272b',
  };

  const cardStyle: React.CSSProperties = {
    marginBottom: '20px',
    padding: '10px',
    backgroundColor: '#f8f9fa',
    border: '1px solid #ddd',
    borderRadius: '5px',
    boxShadow: '2px 2px 10px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const textStyle: React.CSSProperties = {
    color: '#405189',
    fontWeight: 'bold',
    fontSize: '16px',
  };

  const iconStyle: React.CSSProperties = {
    marginRight: '10px',
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        {showForm ? (
          <span style={textStyle}>Agregar Nuevo</span>
        ) : (
          <button
            onClick={toggleForm}
            style={newButtonStyle}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = newButtonHoverStyle.backgroundColor!)}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = newButtonStyle.backgroundColor!)}
          >
            <i className="ri-file-add-line" style={iconStyle}></i>
            Agregar Nuevo
          </button>
        )}
        {showForm && (
          <button
            onClick={() => setShowForm(false)}
            style={cancelButtonStyle}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = cancelButtonHoverStyle.backgroundColor!)}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = cancelButtonStyle.backgroundColor!)}
          >
            <i className="ri-close-circle-line label-icon align-middle fs-16 me-2"></i>
            Cancelar
          </button>
        )}
      </div>
      <div style={{ width: '100%' }}>
        {showForm ? (
          customForm ? (
            typeof customForm === 'string' ? (
              <ShadowDomComponent htmlContent={customForm} onSubmit={handleFormSubmit} />
            ) : (
              customForm
            )
          ) : (
            <Form tableName={tableName} fields={formattedMetadata} onFormSubmit={handleFormSubmit} />
          )
        ) : (
          <Grid metadata={metadata} rowDataResponse={rowDataResponse} exceptions={exceptions} />
        )}
      </div>
    </div>
  );
};

// Wrap TrayContainer with the Apollo provider
const TrayContainerWithProvider: React.FC<TrayContainerProps> = (props) => {
  return (
    <WithApolloProvider>
      <TrayContainer {...props} />
    </WithApolloProvider>
  );
};

export default TrayContainerWithProvider;
