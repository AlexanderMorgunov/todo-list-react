import {getDatabase, ref, set, child, get } from 'firebase/database';
import * as firebase from 'firebase/app';
import {getStorage, ref as refStorage, uploadBytes, getDownloadURL, deleteObject} from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyCgVh8gAdpGhGcYjybA7Zj2DYCDqQOXqYc",
  authDomain: "to-do-list-75731.firebaseapp.com",
  databaseURL: "https://to-do-list-75731-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "to-do-list-75731",
  storageBucket: "to-do-list-75731.appspot.com",
  messagingSenderId: "962146366310",
  appId: "1:962146366310:web:41527cdde417f0882b0ea7"
};

firebase.initializeApp(firebaseConfig);

const db = getDatabase();

export const useFirebase = () => {

    function writeTaskData({id, header, description, date, isDone, attachment}) {
    set(ref(db, 'tasks/' + id), {
      id,
      header,
      description,
      date,
      isDone,
      attachment
    });
  }

  const deleteTaskData = (id) => {
    set(ref(db, 'tasks/' + id), null)
  }
  
  const getData = () => {
    const dbRef = ref(getDatabase());
      const data = get(child(dbRef, `/tasks`)).then((snapshot) => {
      if (snapshot.exists()) {
        return snapshot.val();
      } else {
        return false
      }
    }).catch((error) => {
      return error;
    });
    return data;
}

// storage
const storage = getStorage();

const uploadFile = (file, id) => {
  const mountainFilesRef = refStorage(storage, `Files/${id}`);
  uploadBytes(mountainFilesRef, file)
}

const getFileFromFirebase = async (id) => {
  const starsRef = refStorage(storage, `Files/${id}`);

let result = await getDownloadURL(starsRef)
  .then((url) => {
    return url;
  })
  .catch((error) => {
    switch (error.code) {
      case 'storage/object-not-found':
        break;
      case 'storage/unauthorized':
        break;
      case 'storage/canceled':
        break;
      case 'storage/unknown':
        break;
    }
  });
  return result;
}

const deleteFileStorage = (id) => {
  const desertRef = refStorage(storage, `Files/${id}`);
  deleteObject(desertRef).then(() => {
  return true
}).catch((error) => {
  console.log(error);
});
}
  
  return {writeTaskData, getData, deleteTaskData, uploadFile, getFileFromFirebase, deleteFileStorage};
  

}
  