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
  
  // nach langem testen und recherchieren habe ich keine lösung gefunden, um den Text in der Bildschirm-breite zu halten, ausser den Text per maxWidth zu beschränken, was aber bad practice ist.
  return (
    <View style={{padding: 5, borderRadius: 5, backgroundColor: "white", shadowOpacity: 0.3, shadowColor: "black", shadowRadius: 20, elevation:5, width: "100%"}}>
      <Text style={{color: "black", fontWeight: "600", maxWidth: 300}}>{todo.title}</Text>
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
    null
  );
}

const ToDos = (props: { filter: Boolean | null; }) => {
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

  // bool und null, um status complete, uncomplete und beide auswählen zu können.
  const [filterStatus, setFilterStatus] = useState<boolean | null>(null);
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

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
                <View style={{flexDirection: "row", paddingBottom:10}}>
                  <Pressable style={{backgroundColor: isDarkMode ? Colors.light : Colors.black, borderRadius: 10}} onPress={() => {
                    setFilterVisibility(!filterVisibility)
                    console.log(filterVisibility)
                  }}>
                    <View style={{flexDirection:"row", alignContent:"center", justifyContent:"center", alignItems: "center", height: 40, padding: 5}}>
                      <Icon style={{color: isDarkMode ? Colors.black : Colors.white, paddingEnd: 5}} name={"filter"}/>
                      <Text style={{color: isDarkMode ? Colors.black : Colors.white}}>Filter</Text>
                    </View>
                  </Pressable>
                  {filterVisibility && <View style={{flexDirection:"row", paddingStart:10}}>
                    <Pressable style={[styles.filterButton, {backgroundColor: filterStatus === null ? Colors.dark:"black"}]} onPress={() => setFilterStatus(null)}>
                      <Text style={{color: "white"}}>
                        All
                      </Text>
                    </Pressable>
                    <Pressable  style={[styles.filterButton, {backgroundColor: filterStatus === true ? Colors.dark:"black"}]} onPress={() => setFilterStatus(true)}>
                      <Text style={{color: "white"}}>
                        Complete
                      </Text>
                    </Pressable>
                    <Pressable  style={[styles.filterButton, {backgroundColor: filterStatus === false ? Colors.dark:"black"}]} onPress={() => setFilterStatus(false)}>
                      <Text style={{color: "white"}}>
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
  }
});

export default App;
