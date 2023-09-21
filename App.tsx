import React, {useState} from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
  Pressable,
  Switch,
  Modal
} from 'react-native';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query'

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import Icon from 'react-native-vector-icons/Feather';
//import Dropdown from 'react-native-dropdown-picker';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

type ToDoViewProps = {
  todo: ToDo
}
const ToDoView = ({ todo }: ToDoViewProps) => {
  

  return (
    <View style={{padding: 5, borderRadius: 5, backgroundColor: "white", shadowOpacity: 0.3, shadowColor: "black", shadowRadius: 20, flex: 1, flexDirection: "column", elevation:5}}>
      <Text style={{color: "black", fontWeight: "600"}}>{todo.title}</Text>
      <View style={{flexDirection: "row", justifyContent:"space-between", paddingTop: 5}}>
        <View style={{flexDirection: "row", alignItems:"center"}}>
          <Icon style={{color: "black", paddingEnd: 5}} name="user"/>
          <Text style={{color: "black", fontStyle: "italic"}}>{userIdMap[todo.userId]}</Text>
        </View>
        <View style={{flexDirection: "row", alignItems:"center"}}>
          <Icon style={{color: "black", paddingEnd: 5}} name={todo.completed? "check-circle":"x"}/>
          
          <Text style={{color: "black", fontStyle: "italic"}}>{ todo.completed? "Complete":"Uncomplete"}</Text>
        </View>
      </View>
    </View>
  );
}

type ToDo = {
  id: number;
  userId: number;
  title: String;
  completed: Boolean
}

/*type User = {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}*/

// Zunächst wollte ich des gesamten User speichern, da aber eigentlich nur die Id und der Username benötigt wird, spare ich mir hier ein wenig platz
type UserTest = {
  id: number;
  username: string;
}

const userIdMap: Record<number,string> = {};

const Users = () =>{
  const { error, data } = useQuery({
    queryKey: ['users'],
    queryFn: (): Promise<UserTest[]> =>
      fetch('https://jsonplaceholder.typicode.com/users').then(
        (res) => res.json(),
      ),
  })
  if (error) return <Text>An error has occurred ${error.message}</Text>

  if (!data) return <Text>Data was undefined :(</Text>

  data.forEach(user => {
    userIdMap[user.id] = user.username
  });

 

  return(
    <View/>
  );
}

const ToDos = (props) => {
  const { isLoading, error, data } = useQuery({
    queryKey: ['todos'],
    queryFn: (): Promise<ToDo[]> =>
      fetch('https://jsonplaceholder.typicode.com/todos').then(
        (res) => res.json(),
      ),
  })

  if (isLoading) return <Text>Loading...</Text>

  if (error) return <Text>An error has occurred ${error.message}</Text>

  if (!data) return <Text>Data was undefined :(</Text>

  console.log(props.filter)

  const filteredData = props.filter === null
    ? data
    : data.filter((item) => item.completed === props.filter);

  return (
    <View style={{flexDirection: "column",  flex: 1, gap: 10 }}>
      {filteredData.map((todo: ToDo) => (<ToDoView todo={todo} />))}
    </View>
  );
}


const queryClient = new QueryClient()

function App(): JSX.Element {
  const [filterVisibility, setFilterVisibility] = useState(false);
  const [filterStatus, setFilterStatus] = useState<boolean | null>(null);
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  /*const statusFilter = [{
    value: "All",
  },{
    value: "Completed",
  },{
    value: "Uncompleted"
  }]*/

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaView style={backgroundStyle}>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={backgroundStyle.backgroundColor}
        />
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={backgroundStyle}>
          <View
            style={{
              backgroundColor: isDarkMode ? Colors.black : Colors.white,
            }}>
            <Section title="ToDos">
              <View style={{flexDirection:"column"}}>
              {/*<Icon.Button name="filter" style={{backgroundColor: isDarkMode ? Colors.light : Colors.black}} color={isDarkMode ? Colors.black : Colors.white} onPress={() => {
                    setFilterVisibility(!filterVisibility)
                    console.log(filterVisibility)
                  }}>
                    Filter
                  </Icon.Button>
                  <Modal
                    animationType="slide"
                    transparent={true}
                    visible={filterVisibility}
                    onRequestClose={() => {
                      setFilterVisibility(!filterVisibility);
                    }}
                  >
                    <View style={styles.centeredView}>
                      <View style={styles.modalView}>
                        <Text style={{color: "black"}}>Filter</Text>
                        <View style={{flexDirection: "row"}}>
                          <Text style={{color: "black"}}>Completion status</Text>
                          <Dropdown value={} items={statusFilter}/>
                        </View>
                        <Pressable onPress={() => setFilterVisibility(!filterVisibility)}>
                          <Text style={{color: "black"}}>Close</Text>
                        </Pressable>
                      </View>
                    </View>
                  </Modal>*/}
                <View style={{flexDirection: "row", paddingBottom:10}}>
                  <Icon.Button name="filter" style={{backgroundColor: isDarkMode ? Colors.light : Colors.black}} color={isDarkMode ? Colors.black : Colors.white} onPress={() => {
                    setFilterVisibility(!filterVisibility)
                    console.log(filterVisibility)
                  }}>
                    Filter
                  </Icon.Button>
                  {filterVisibility && <View style={{flexDirection:"row", paddingStart:10}}>
                    <Pressable style={[styles.filterButton, {backgroundColor: filterStatus === null ? Colors.dark:"black"}]} onPress={() => setFilterStatus(null)}>
                      <Text>
                        All
                      </Text>
                    </Pressable>
                    <Pressable  style={[styles.filterButton, {backgroundColor: filterStatus === true ? Colors.dark:"black"}]} onPress={() => setFilterStatus(true)}>
                      <Text>
                        Complete
                      </Text>
                    </Pressable>
                    <Pressable  style={[styles.filterButton, {backgroundColor: filterStatus === false ? Colors.dark:"black"}]} onPress={() => setFilterStatus(false)}>
                      <Text>
                        Uncomplete
                      </Text>
                    </Pressable>
                </View>}
                </View>
                <ToDos filter={filterStatus}/>
                <Users />
              </View>
              
            </Section>
          </View>
        </ScrollView>
      </SafeAreaView>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "black",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  filterButton: {
    padding: 5,
    margin: 5,
    alignItems: "center",
    shadowColor: "black",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderColor: "white",
    borderRadius: 5
  },
  filterText:{

  }
});

export default App;
