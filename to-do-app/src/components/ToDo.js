import React, {Component} from "react";
import './ToDo.css'
import Task from "./Task";

class ToDo extends Component {
    constructor(props) {
        super(props)

        this.addTask = this.addTask.bind(this)
        this.onTaskNameChanged = this.onTaskNameChanged.bind(this)
        this.updateTaskStatus = this.updateTaskStatus.bind(this)
        this.deleteTask = this.deleteTask.bind(this)
        this.updateTaskName = this.updateTaskName.bind(this)
        this.updateTaskPriority = this.updateTaskPriority.bind(this)
        this.updateDueDateTime = this.updateDueDateTime.bind(this)  // Add this
        this.updateReminderStatus = this.updateReminderStatus.bind(this) 
        this.handleLogout = this.handleLogout.bind(this)
        
        this.user = JSON?.parse(sessionStorage.getItem('user'))

        this.state = {
            task: '',
            taskList: [],
            userId: this.user.id
        }
        
        this.baseUrl = 'http://localhost:8000'
        
    }

    componentDidMount() {
        this.fetchTasks();
    }

    fetchTasks() {
        fetch(`${this.baseUrl}/taskList`)
            .then(response => response.json())
            .then(data => {
                const userTaskList = data.find(item => item.id == this.state.userId);
                this.setState({ taskList: userTaskList ? userTaskList.taskList : [] });
            })
            .catch(error => console.error('Error fetching tasks:', error));
    }

    // Updates task name
    onTaskNameChanged(event) {
        this.setState({
            task: event?.target.value
        })
    }

    // Adds new task to the tasklist for the particular user
    addTask(event) {
        const now = new Date();
        now.setHours(23, 59, 0); 
        const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
            .toISOString()
            .slice(0, 16);

        if(event.code === 'Enter' && this.state.task.trim()){            
            fetch(`${this.baseUrl}/taskList`)
                .then(response => response.json())
                .then(data => {
                    const userTaskList = data.find(item => item.id == this.state.userId);
                    const newTask = {
                        id: Math.max(...userTaskList.taskList.map(t => t.id), 0) + 1,
                        task: this.state.task,
                        completed: false,
                        dueDateTime: localDateTime,  // Add this
                        reminderEnabled: false
                    };

                    const updatedTaskList = {
                        ...userTaskList,
                        taskList: [...userTaskList.taskList, newTask]
                    };

                    return fetch(`${this.baseUrl}/taskList/${this.state.userId}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(updatedTaskList)
                    });
                })
                .then(response => response.json())
                .then(updatedData => {
                    this.setState({
                        taskList: updatedData.taskList,
                        task: ''
                    });
                })
                .catch(error => console.error('Error adding task:', error));
        }
    }

    // Calls API to update task status
    updateTaskStatus(taskId, completed) {
        fetch(`${this.baseUrl}/taskList`)
            .then(response => response.json())
            .then(data => {
                const userTaskList = data.find(item => item.id == this.state.userId);
                const updatedTaskList = {
                    ...userTaskList,
                    taskList: userTaskList.taskList.map(task => 
                        task.id === taskId ? { ...task, completed } : task
                    )
                };

                return fetch(`${this.baseUrl}/taskList/${this.state.userId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedTaskList)
                });
            })
            .then(response => response.json())
            .then(updatedData => {
                this.setState({
                    taskList: updatedData.taskList
                });
            })
            .catch(error => console.error('Error updating task:', error));
    }

    // Calls API to update task name
    updateTaskName(taskId, newTaskName) {
        fetch(`${this.baseUrl}/taskList`)
            .then(response => response.json())
            .then(data => {
                const userTaskList = data.find(item => item.id == this.state.userId);
                const updatedTaskList = {
                    ...userTaskList,
                    taskList: userTaskList.taskList.map(task => 
                        task.id === taskId ? { ...task, task: newTaskName } : task
                    )
                };

                return fetch(`${this.baseUrl}/taskList/${this.state.userId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedTaskList)
                });
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(updatedData => {
                this.setState({
                    taskList: updatedData.taskList
                });
            })
            .catch(error => console.error('Error updating task name:', error));
    }

    // Calls API to update task priority
    updateTaskPriority(taskId, priority) {
        fetch(`${this.baseUrl}/taskList`)
            .then(response => response.json())
            .then(data => {
                const userTaskList = data.find(item => item.id == this.state.userId);
                const updatedTaskList = {
                    ...userTaskList,
                    taskList: userTaskList.taskList.map(task => 
                        task.id === taskId ? { ...task, priority } : task
                    )
                };

                return fetch(`${this.baseUrl}/taskList/${this.state.userId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedTaskList)
                });
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(updatedData => {
                this.setState({
                    taskList: updatedData.taskList
                });
            })
            .catch(error => console.error('Error updating task priority:', error));
    }

    // Calls API to update task due date
    updateDueDateTime(taskId, dueDateTime) {
        fetch(`${this.baseUrl}/taskList`)
            .then(response => response.json())
            .then(data => {
                const userTaskList = data.find(item => item.id == this.state.userId);
                const updatedTaskList = {
                    ...userTaskList,
                    taskList: userTaskList.taskList.map(task => 
                        task.id === taskId ? { ...task, dueDateTime } : task
                    )
                };

                return fetch(`${this.baseUrl}/taskList/${this.state.userId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedTaskList)
                });
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(updatedData => {
                this.setState({
                    taskList: updatedData.taskList
                });
            })
            .catch(error => console.error('Error updating due date time:', error));
    }

    // Calls API to update  reminder status
    updateReminderStatus(taskId, reminderEnabled) {
        fetch(`${this.baseUrl}/taskList`)
            .then(response => response.json())
            .then(data => {
                const userTaskList = data.find(item => item.id == this.state.userId);
                const updatedTaskList = {
                    ...userTaskList,
                    taskList: userTaskList.taskList.map(task => 
                        task.id === taskId ? { ...task, reminderEnabled } : task
                    )
                };

                return fetch(`${this.baseUrl}/taskList/${this.state.userId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedTaskList)
                });
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(updatedData => {
                this.setState({
                    taskList: updatedData.taskList
                });
            })
            .catch(error => console.error('Error updating reminder status:', error));
    }


    // Calls API delete task
    deleteTask(taskId) {
        fetch(`${this.baseUrl}/taskList`)
        .then(response => response.json())
        .then(data => {
            const userTaskList = data.find(item => item.id == this.state.userId);
            const updatedTaskList = {
                ...userTaskList,
                taskList: userTaskList.taskList.filter(task => task.id !== taskId)
            };

            return fetch(`http://localhost:8000/taskList/${this.state.userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedTaskList)
            });
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(updatedData => {
            this.setState({
                taskList: updatedData.taskList
            });
        })
        .catch(error => console.error('Error deleting task:', error));
    }

    handleLogout = () => {
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('isLoggedIn');
        window.location.href = '/';
    }

    render() {
        const toDotaskList = this.state.taskList.filter(task => !task.completed).map((task) => {
            return (
                <Task 
                    key={task.id} {...task} 
                    onStatusChange={this.updateTaskStatus} 
                    onDeleteTask={this.deleteTask} 
                    onTaskNameUpdate={this.updateTaskName} 
                    onPriorityChange={this.updateTaskPriority}
                    onDueDateTimeChange={this.updateDueDateTime}  
                    onReminderToggle={this.updateReminderStatus}  
                />
            )
        });
        const completedTaskList = this.state.taskList.filter(task => task.completed).map((task) => {
            return (
                <Task 
                    key={task.id} {...task} 
                    onStatusChange={this.updateTaskStatus} 
                    onDeleteTask={this.deleteTask} 
                    onTaskNameUpdate={this.updateTaskName} 
                    onPriorityChange={this.updateTaskPriority}
                    onDueDateTimeChange={this.updateDueDateTime}  
                    onReminderToggle={this.updateReminderStatus}  
                />
            )
        });


        let completedContainer
        if(completedTaskList.length > 0) 
            completedContainer = <h6>Completed</h6>

        const date = new Date();
        const formattedDate = date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });


        return (
            <div className="w-100 parent-container">
                <div className="header-container d-flex w-100 justify-content-end align-items-center p-2 gap-3 top-0">
                    <div className="d-flex flex-wrap align-items-center">
                            <div className="user-icon">
                            </div>
                            <div className="ps-2">{this.user.name}</div>
                        </div>
                    <span className="material-icons fs-5" onClick={this.handleLogout}>logout</span>
                </div>
               
                <div className="content-container text-white">
                    <div className="p-3">
                        <h5>Plan Your Day</h5>
                        <h6>{formattedDate}</h6>
                    </div>
                    <div className="tasks-container p-3">
                        {/* <Task task='Create to do project' completed={false} id='1' /> */}
                        {toDotaskList}
                        {completedContainer}
                        {completedTaskList}
                    </div>
                    <div className="position-fixed bottom-0 py-2 px-3 w-100">
                        <div className="d-flex input-container rounded-3 p-2 w-100">
                            <span className="material-icons">add</span>
                            <input 
                                type="text" 
                                className="task-name-input w-100 ps-2" 
                                value={this.state.task} 
                                placeholder="Add a Task" 
                                onChange={this.onTaskNameChanged}
                                onKeyDown={this.addTask}
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ToDo