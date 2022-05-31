import { useEffect, useState } from 'react';
import useTodosStore from '../stores/useTodos';
import '../styles/progress.scss';
const Progress = () => {
    const todosStore = useTodosStore();
    const [completeTodo, setCompleteTodo] = useState<number>(0);
    const [percent, setPercent] = useState<string>('0%');

    const calCompleteTodoList = () => {
        let total = todosStore.todoList.length;

        setCompleteTodo(
            todosStore.todoList.filter((item) => item.completed === true).length
        );

        let value = Math.round((completeTodo / total) * 100)
            ? `${Math.round((completeTodo / total) * 100)}%`
            : '0%';

        setPercent(value);

        const progress = document.querySelector(
            '.progress-fill'
        ) as HTMLElement | null;

        if (progress != null) {
            progress.style.width = percent;
        }
    };

    useEffect(() => {
        calCompleteTodoList();
    });
    return (
        <div className='progress-container'>
            <h2>Progress</h2>
            <div className='progress-bar' id='progress'>
                <div className='progress-fill' />
                <span className='progress-text'>{percent}</span>
            </div>
            <p>{completeTodo} completed</p>
        </div>
    );
};

export default Progress;
