import { useState, useEffect } from "react";
import { useFirebase } from "../../hooks/firebase.hook";
import { FcPlus } from "react-icons/fc";
import {nanoid} from 'nanoid';
import Task from "../task/Task";
import './tasks-list.scss'

const generateId = () => {
    const id = nanoid(8);
    return id;
}

const TasksList = () => {
const [Tasks, setTasks] = useState([]);

const {getData, deleteTaskData, writeTaskData, deleteFileStorage} = useFirebase();

const requestData = async () => {
    const data = await getData();
    return data;
}

useEffect(() => {
    requestData().then(data => {
        if(data) {
            for (let key in data) {
                setTasks(Tasks => [...Tasks, data[key].id])
            }
        }
    });
},[])

const createTask = () => {
    const id = generateId();
    setTasks([...Tasks, id]);
    writeTaskData({id, description:'', header:'', isDone: false, date:'', attachment:false})
}

const deleteTask = (id) => {
    setTasks(Tasks => Tasks.filter(task => task !== id));
    deleteTaskData(id);
    deleteFileStorage(id);
}

const content = Tasks ? Tasks.map(id => <Task id={id} key={id} deleteTask={deleteTask}/>) : null;

    return(
        <div className='tasks_container'>
                {content}
                <FcPlus 
                style={{ fontSize: 50, borderRadius: 100, backgroundColor: '#4daf51', marginLeft:80}} 
                className='btn btn-success'
                onClick={createTask}
                />
        </div>
    )
}

export default TasksList;