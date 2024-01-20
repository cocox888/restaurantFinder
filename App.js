import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button,StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as SQLite from 'expo-sqlite';


export default function App() {
  const [db, setDb] = useState(SQLite.openDatabase('example.db'));
  const [isLoading, setIsLoading] = useState(true);
  const [names, setNames] = useState([]);
  const [currentName, setCurrentName] = useState(undefined);

  useEffect(() => {
    initializeDatabase();
  }, []);

  const initializeDatabase = () => {
    db.transaction(tx => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS names (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)');
      tx.executeSql('SELECT * FROM names', null,
        (_, resultSet) => setNames(resultSet.rows._array),
        (_, error) => console.log(error)
      );
    });
    setIsLoading(false);
  };

  const addName = () => {
    db.transaction(tx => {
      tx.executeSql('INSERT INTO names (name) values (?)', [currentName],
        (_, resultSet) => {
          const updatedNames = [...names, { id: resultSet.insertId, name: currentName }];
          setNames(updatedNames);
          setCurrentName(undefined);
        },
        (_, error) => console.log(error)
      );
    });
  };

  const deleteName = (id) => {
    db.transaction(tx => {
      tx.executeSql('DELETE FROM names WHERE id = ?', [id],
        (_, resultSet) => {
          if (resultSet.rowsAffected > 0) {
            const updatedNames = names.filter(name => name.id !== id);
            setNames(updatedNames);
          }
        },
        (_, error) => console.log(error)
      );
    });
  };

  const updateName = (id) => {
    db.transaction(tx => {
      tx.executeSql('UPDATE names SET name = ? WHERE id = ?', [currentName, id],
        (_, resultSet) => {
          if (resultSet.rowsAffected > 0) {
            const updatedNames = names.map(name => (name.id === id ? { ...name, name: currentName } : name));
            setNames(updatedNames);
            setCurrentName(undefined);
          }
        },
        (_, error) => console.log(error)
      );
    });
  };

  const renderNames = () => {
    return names.map((name) => (
      <View key={name.id} style={styles.tableRow}>
        <Text style={styles.tableColumn}>{name.name}</Text>
        <View style={styles.tableColumn}>
          <Button title="Delete" onPress={() => deleteName(name.id)} color="red" />
        </View>
        <View style={styles.tableColumn}>
          <Button title="Update" onPress={() => updateName(name.id)} color="green" />
        </View>
      </View>
    ));
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading names...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
    <Text style={styles.text} >My to do App</Text>
      <TextInput
        style={styles.input}
        value={currentName}
        placeholder='Enter task in your to do list'
        onChangeText={setCurrentName}
      />
      <Button title="Add Task" onPress={addName} />
      {renderNames()}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  tableColumn: {
    flex: 1,
    marginHorizontal: 8,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
    alignSelf: 'stretch',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  text:{
    fontSize: 20,
    padding: 20,
    fontWeight: '600',
  }
});
