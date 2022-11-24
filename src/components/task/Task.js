import { Button, Form } from 'react-bootstrap';
import { BsCheckCircle } from "react-icons/bs";
import { useState, useEffect } from 'react';
import * as dayjs from 'dayjs';
import { useFirebase } from "../../hooks/firebase.hook";
import './Task.scss';
import { FcOpenedFolder } from "react-icons/fc";

const Task = (props) => {

const {writeTaskData, getData, uploadFile, getFileFromFirebase} = useFirebase();

const {deleteTask, id} = props;

const [data, setData] = useState('');

const [file, setFile] = useState();

const requestData = async () => {
    const data = await getData();
    return data;
}

useEffect(() => {
    requestData().then(data => {
        for (let key in data) {
            if(key === id) {
                setData(data[key])
            }
        }
    })
},[]);

useEffect(() => {
    if(data.attachment) {
        getFileFromFirebase(data.id)
        .then(link => setFile(link));
    }
},[data])

const handleSubmit = (e) => {
    e.preventDefault();
    setData({...data, header: e.target[0].value, 
             description: e.target[1].value,
             date: e.target[3].value.toString(),
             attachment:false
            });
    if (e.target[2].files[0]) {
        uploadFile(e.target[2].files[0], data.id);
        setData(data => ({...data, attachment:true}));
    }
    writeTaskData(data);
}

const toggleDisabled = (done=true, notDone=null) => {
    if(data.isDone) {
        writeTaskData(data);
        return done
    } else {
        writeTaskData(data);
        return notDone;
    }
}

const toggleTaskDone = () => {
    setData({...data, isDone: !data.isDone});
}

const toggleStyleDate = () => {
 const date = dayjs();
if (date.format('YYYY-MM-DD') > dayjs(data.date).format('YYYY-MM-DD')) {
    return 'task_form_date_old'
} else if(date.format('YYYY-MM-DD') === dayjs(data.date).format('YYYY-MM-DD')) {
    return 'task_form_date_equal'
} else if(!data.date) {
    return null;
} else {
    return 'task_form_date_ok'
}
}

const content = !data ? null : (
    <div className={toggleDisabled("task_container_done","task_container")}>
                <Form className="task_form" onSubmit={
                    handleSubmit}>
                <Form.Control type="text" className='task_form_header' name="header" 
                placeholder='Заголовок' disabled={toggleDisabled()} defaultValue={data.header}/>
                <Form.Control name="description" className='task_form_description' placeholder='Описание задачи'
                disabled={toggleDisabled()} defaultValue={data.description}></Form.Control>
                <Form.Control type='file' disabled={toggleDisabled()}/>
                {file ? <div className='task_form_file'><a href={file} target="_blank">
                <FcOpenedFolder style={{ fontSize: 35}} /></a> Посмотреть файл</div> : null}
                    <label htmlFor="date">Дедлайн:</label>
                    <Form.Control type="date" name='date' className={`task_form_date ${toggleStyleDate()}`}
                        disabled={toggleDisabled()} defaultValue={dayjs(data.date).format('YYYY-MM-DD')}/>
                    <div className="task_form_btn_container">
                        <Button disabled={toggleDisabled()} variant='warning' type='submit'>Submit</Button>
                        <Button variant='danger'><i className="fas fa-trash" onClick={() => deleteTask(id)}></i></Button>
                        <Button variant='success' onClick={toggleTaskDone}>{<BsCheckCircle/>} Выполнено</Button>
                    </div>
                </Form>
    </div>
)
    return (
        content
    )
}

export default Task;