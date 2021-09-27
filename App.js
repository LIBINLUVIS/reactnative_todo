import React, {useState,useEffect} from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, View, Alert,TextInput, TouchableOpacity, Keyboard, ScrollView } from 'react-native';
import Task from './components/Task';
import Spinner from 'react-native-loading-spinner-overlay';
import Icon from 'react-native-vector-icons/FontAwesome'
import axios from "axios";
export default function App() {
  const [task, setTask] = useState();
  const [taskItems, setTaskItems] = useState([]);
  const [count,setCount]=useState(0);
  const [spiner,setSpiner]= useState(true);


   useEffect(()=>{
    const config = {
      headers: {
        "Accept":"application/json",
        "Content-Type": "application/json",
      },
    };
     const get="https://reactnativeapis.herokuapp.com/api/task-list/";
    axios.get(get,config).then((res)=>{
      
       setTaskItems(res.data)
       setSpiner(false)
       
     }).catch((err)=>{
       Alert.alert("Please Check Your Connection")
     })


   },[])

  useEffect(()=>{
     taskupdate();
   },[task])

  const taskupdate=()=>{
    const config = {
      headers: {
        "Accept":"application/json",
        "Content-Type": "application/json",
      },
    };
     const get="https://reactnativeapis.herokuapp.com/api/task-list/";
    axios.get(get,config).then((res)=>{
      
       setTaskItems(res.data)
     })

   }
   
  const handleAddTask = () => {
    const config = {
      headers: {
        "Accept":"application/json",
        "Content-Type": "application/json",
      },
    };
    const body = JSON.stringify({ title : task });

    const api="https://reactnativeapis.herokuapp.com/api/task-create/";
    axios.post(api,body,config).then((res)=>{
      Keyboard.dismiss();
      setTask(null);
    
    }).catch((err)=>{
      console.log(err,"error");
    })
  }


  const completeTask = (index) => {
    setCount(count+1); 
                  
    if(count>=3){
      const config = {
        headers: {
          "Accept":"application/json",
          "Content-Type": "application/json",
        },
      };
      const api=`https://reactnativeapis.herokuapp.com/api/task-delete/${index}/`;
      axios.post(api,config).then((res)=>{
        setCount(0);
        if(res.status==200){
          const config = {
            headers: {
              "Accept":"application/json",
              "Content-Type": "application/json",
            },
          };
           const get="https://reactnativeapis.herokuapp.com/api/task-list/";
          axios.get(get,config).then((res)=>{
            
             setTaskItems(res.data)
             Alert.alert("Password Deleted");
           })
        }
      
      }).catch((err)=>{
        console.log(err,"error");
        setCount(0)
      })
    }

  }

  return (
    <View style={styles.container}>
      {/* Added this scroll view to enable scrolling when list gets longer than the page */}
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1
        }}
        keyboardShouldPersistTaps='handled'
      >

      {/* Today's Tasks */}
      <View style={styles.tasksWrapper}>
      <Spinner
        visible={spiner}
        textContent={'Loading...'}
        textStyle={styles.spinnerTextStyle}
      />
        <Text style={styles.sectionTitle}>Passwords</Text>

        {taskItems ? <View style={styles.items}>
          {
            taskItems.map((item, index) => {
              return (
                <TouchableOpacity key={index}  onPress={() => completeTask(item.id)}>
                  <Task text={item.title} /> 
                </TouchableOpacity>
              )
            })
          }
        </View>
        : 
       null}
      </View>
        
      </ScrollView>

      {/* Write a task */}
      {/* Uses a keyboard avoiding view which ensures the keyboard does not cover the items on screen */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.writeTaskWrapper}
      >
        <TextInput style={styles.input} placeholder={'Write your password'} value={task} onChangeText={text => setTask(text)} />
        <TouchableOpacity onPress={() => handleAddTask()}>
          <View style={styles.addWrapper}>
            <Text style={styles.addText}><Icon name="plus" size={30} color="#55BCF6" /></Text>
          </View>
        </TouchableOpacity>
      </KeyboardAvoidingView>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8EAED',
  },
  spinnerTextStyle: {
    color: '#bfbfff'
  },
  tasksWrapper: {
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  items: {
    marginTop: 30,
  },
  writeTaskWrapper: {
    position: 'absolute',
    bottom: 60,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  input: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: '#FFF',
    borderRadius: 60,
    borderColor: '#C0C0C0',
    borderWidth: 1,
    width: 250,
  },
  addWrapper: {
    width: 60,
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#C0C0C0',
    borderWidth: 1,
  },
  addText: {},
});
