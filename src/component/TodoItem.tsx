import { useState } from 'react';
import { TodoListType } from '../stores/useTodos';
import '../styles/todoItem.scss';

type TodoItemProps = {
    data: TodoListType;
    onUpdateTodo: (data: TodoListType) => void;
    onDeleteTodo: (id: string) => void;
};
const TodoItem = (props: TodoItemProps) => {
    const { data, onUpdateTodo, onDeleteTodo } = props;
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [isOpenOption, setIsOpenOption] = useState<boolean>(false);
    const [editValue, setEditValue] = useState<string>('');

    const selectAction = (key: string, id: string) => {
        switch (key) {
            case 'edit':
                setIsEditMode(true);
                break;
            case 'delete':
                onDeleteTodo(id);
                break;
            default:
                break;
        }
        setIsOpenOption(!isOpenOption);
    };

    const openAction = () => {
        setIsOpenOption(!isOpenOption);
    };

    const onTextChange = (value: string) => {
        setEditValue(value.trim());
    };

    const onCompleteTodo = (data: TodoListType, isComplete: boolean) => {
        let newData = { ...data, completed: isComplete };
        onUpdateTodo(newData);
    };

    const onSave = (data: TodoListType) => {
        setIsEditMode(false);
        let newData = { ...data, title: editValue };
        onUpdateTodo(newData);
    };

    window.onclick = (event) => {
        //@ts-ignore
        if (!event.target.matches('li') && !event.target.matches('#dropdown')) {
            setIsOpenOption(false);
        }
    };
    return (
        <div className='todo-item'>
            {!isEditMode ? (
                <div className='checkbox'>
                    <input
                        type='checkbox'
                        className='input'
                        defaultChecked={data.completed}
                        onChange={(e) => {
                            onCompleteTodo(data, e.target.checked);
                        }}
                    />
                </div>
            ) : (
                <></>
            )}

            <div className='todo-text'>
                <input
                    type='text'
                    defaultValue={data.title}
                    disabled={!isEditMode}
                    autoFocus={isEditMode}
                    onChange={(e) => onTextChange(e.target.value)}
                    maxLength={30}
                    className={data.completed && !isEditMode ? 'complete' : ''}
                />
            </div>
            <div className='action'>
                {isEditMode ? (
                    <button onClick={(e) => onSave(data)}>Save</button>
                ) : (
                    <>
                        <img
                            id='dropdown'
                            alt='icon_action'
                            src='icon_action.svg'
                            onClick={(e) => openAction()}
                        />
                        <div
                            id='dropdown'
                            className='dropdown-menu'
                            style={{
                                display: `${isOpenOption ? 'block' : 'none'}`,
                            }}
                        >
                            <li onClick={(e) => selectAction('edit', data.id)}>
                                Edit
                            </li>
                            <li
                                onClick={(e) => selectAction('delete', data.id)}
                                style={{ color: '#E07C7C' }}
                            >
                                Delete
                            </li>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default TodoItem;
