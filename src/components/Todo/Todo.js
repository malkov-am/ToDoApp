import clsx from 'clsx';
import React from 'react';
import './Todo.css';

const Todo = ({ toDoObj, onTaskDelete, onTaskDone }) => {
  const { todo, deadline, file, link, isDone } = toDoObj.item;
  // Текущая дата
  const currentDate = new Date(new Date().toISOString().split('T')[0]).getTime();
  // Проверка, просрочена ли задача
  const isExpired = (() => {
    const toDoDeadline = new Date(deadline).getTime();
    return currentDate > toDoDeadline ? true : false;
  })();

  return (
    <li className={clsx('main__list-item', isDone && 'main__list-item_done')}>
      {isExpired && <p className="main__list-item-expired">Срок истек</p>}
      <div className="main__list-item-wrapper">
        <h2 className="main__list-item-title">{todo}</h2>
        <p className="main__list-item-deadline">Дедлайн: {deadline}</p>
        {file && (
          <>
            <p className="main__list-item-subtitle">Прикрепленный файл: </p>
            <a href={link}>{file}</a>
          </>
        )}
      </div>
      <div className="main__list-item-btn-wrapper">
        <button
          className={clsx(
            'main__list-item-btn-done',
            !isDone && 'main__list-item-btn-done-disabled',
          )}
          onClick={() => onTaskDone(toDoObj)}
        ></button>
        <button className="main__list-item-btn-del" onClick={() => onTaskDelete(toDoObj)}></button>
      </div>
    </li>
  );
};

export default Todo;
