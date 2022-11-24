import TasksList from '../tasks-list/TasksList';
import Header from '../header/Header';
import './App.css';
import {useFirebase} from '../../hooks/firebase.hook'




function App() {
  
  return (
    <>
      <Header/>
      <TasksList/>
    </>    
  );
}

export default App;
