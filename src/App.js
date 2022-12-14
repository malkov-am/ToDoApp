import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { useEffect, useRef, useState } from 'react';
import './App.css';
import Todo from './components/Todo/Todo';
import { db } from './firebase';

function App() {
  /**
   * Переменные состояния.
   */
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [file, setFile] = useState('');
  const [deadline, setDeadline] = useState('');
  /**
   * Управление инпутом выбора файла.
   */
  const fileInputRef = useRef('');
  /**
   * Обновление перечня заданий.
   */
  const q = query(collection(db, 'todos'), orderBy('timestamp', 'desc'));
  useEffect(() => {
    onSnapshot(q, (snapshot) => {
      setTodos(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          item: doc.data(),
        })),
      );
    });
  }, [input]);
  /**
   * Функция отправки запроса на добавление задания.
   * @param {string} todo - Текст задачи.
   * @param {string} deadline - Дата дедлайна в формате "ГГГГ-ММ-ДД".
   * @param {string} file - Имя прикрепляемого файла.
   * @param {string} link - Ссылка на загрузку прикрепленного файла.
   * @param {boolean} isDone - Переменная, обозначающая выполнение задания. Для нового задания подставляется значение false.
   */
  function setTodo(todo, deadline, file = '', link = '', isDone = false) {
    addDoc(collection(db, 'todos'), {
      todo,
      timestamp: serverTimestamp(),
      file,
      link,
      deadline,
      isDone,
    });
  }
  const storage = getStorage();
  /**
   * Функция добавления задания.
   */
  function addTodo(evt) {
    evt.preventDefault();
    if (file) {
      const storageRef = ref(storage, `/files/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        function (snapshot) {},
        function (error) {
          console.error(error);
        },
        function () {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
            setTodo(input, deadline, file.name, downloadURL),
          );
        },
      );
    } else {
      setTodo(input, deadline);
    }
    setInput('');
    setDeadline('');
    setFile('');
    fileInputRef.current.value = '';
  }
  /**
   * Функция удаления задания.
   * @param {object} toDoObj - Объект, включающий объект с задачей и id.
   * Включает в себя поля:
   * id {string} - Идентификатор задачи.
   * item {object} - Объект с задачей.
   */
  function deleteTodo(toDoObj) {
    deleteDoc(doc(db, 'todos', toDoObj.id));
    if (toDoObj.item.file) {
      const storageRef = ref(storage, `/files/${toDoObj.item.file}`);
      deleteObject(storageRef).catch((error) => {
        console.error(error);
      });
    }
  }
  /**
   * Функция отметки задачи как выполненной.
   * @param {object} toDoObj - Объект, включающий объект с задачей и id.
   * Включает в себя поля:
   * id {string} - Идентификатор задачи.
   * item {object} - Объект с задачей.
   */
  function doneTodo(toDoObj) {
    const isDone = toDoObj.item.isDone;
    updateDoc(doc(db, 'todos', toDoObj.id), {
      isDone: isDone ? false : true,
    });
  }
  /**
   * Обработчик поля ввода задачи.
   */
  function handleAddTodo(evt) {
    setInput(evt.target.value);
  }
  /**
   * Обработчик поля вставки файла.
   */
  function handleAttachFile(evt) {
    setFile(evt.target.files[0]);
  }
  /**
   * Обработчик поля ввода даты.
   */
  function handleSetDate(evt) {
    setDeadline(evt.target.value);
  }

  return (
    <div className="app">
      <header className="header">
        <h1 className="header__title">ToDo App</h1>
      </header>
      <main className="main">
        <form className="main__form" onSubmit={addTodo}>
          <input
            className="main__form-input"
            type="text"
            placeholder="Что будем делать?"
            value={input}
            onChange={handleAddTodo}
            required
          />
          <label className="main__form-input-label">
            Прикрепить файл
            <input
              className="main__form-input-file"
              type="file"
              ref={fileInputRef}
              onChange={handleAttachFile}
            ></input>
          </label>
          <div className="main__form-btn-wrapper">
            <label className="main__form-input-label">
              Дедлайн:
              <input
                className="main__form-input-date"
                type="date"
                value={deadline}
                onChange={handleSetDate}
                required
              ></input>
            </label>
            <button className="main__form-attach-button" type="submit">
              Создать
            </button>
          </div>
        </form>
        <ul className="main__list">
          {todos.map((toDoObj) => (
            <Todo
              key={toDoObj.id}
              toDoObj={toDoObj}
              onTaskDelete={deleteTodo}
              onTaskDone={doneTodo}
            />
          ))}
        </ul>
      </main>
    </div>
  );
}

export default App;
