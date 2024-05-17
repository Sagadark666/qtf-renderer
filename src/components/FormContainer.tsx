import React from 'react';
import { Tabs, Tab } from '@mui/material';
import Form from './Form'; // Your existing form component

interface FormContainerProps {
    mainTableName: string;
    relationships: { tableName: string, columnName: string, referenced_table: string, referencedColumn: string }[];
}

const FormContainer: React.FC<FormContainerProps> = ({ mainTableName, relationships }) => {
    console.log(relationships)
    const [selectedTab, setSelectedTab] = React.useState(0);

    const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setSelectedTab(newValue);
    };

    return (
        <div>
            <Tabs value={selectedTab} onChange={handleTabChange}>
                <Tab label={mainTableName} />
                {relationships.map((rel, index) => (
                    <Tab key={index} label={`${rel.referenced_table}`} />
                ))}
            </Tabs>
            <div>
                {selectedTab === 0 && <Form  />}
                {relationships.map((rel, index) => (
                    selectedTab === index + 1 && <Form key={index} />
                ))}
            </div>
        </div>
    );
};

export default FormContainer;