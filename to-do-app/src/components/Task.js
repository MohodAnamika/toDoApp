import React, {Component} from "react";
import './Task.css'

class Task extends Component {
    constructor(props) {
        super(props)

        const now = new Date();
        const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
            .toISOString()
            .slice(0, 16);
            
        this.state = {
            completed: this.props.completed ?? false,
            editTask: false,
            taskName: props.task ?? '',
            dueDateTime: props.dueDateTime || localDateTime,
            priority: props.priority || 'Low',
            reminderEnabled: props.reminderEnabled || false,
            showReminderPopup: false
        }

        this.changeTaskState = this.changeTaskState.bind(this)
        this.deleteTask = this.deleteTask.bind(this)
        this.editTask = this.editTask.bind(this)
        this.editTaskName = this.editTaskName.bind(this)
        this.onTaskNameChanged = this.onTaskNameChanged.bind(this)
        this.handleBlur = this.handleBlur.bind(this)
        this.cyclePriority = this.cyclePriority.bind(this)
        this.handleDueDateTimeChange = this.handleDueDateTimeChange.bind(this)
        this.toggleReminder = this.toggleReminder.bind(this)
        this.checkDueDateTime = this.checkDueDateTime.bind(this)
    }

    componentDidMount() {
        const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]')
        tooltips.forEach(tooltip => {
            new window.bootstrap.Tooltip(tooltip)
        })

        // Start checking for due tasks
        this.checkInterval = setInterval(this.checkDueDateTime, 60000); // Check every minute
    }

    componentWillUnmount() {
        const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]')
        tooltips.forEach(tooltip => {
            const instance = window.bootstrap.Tooltip.getInstance(tooltip)
            if (instance) {
                instance.dispose()
            }
        })

        if (this.checkInterval) {
            clearInterval(this.checkInterval);
        }
    }

    changeTaskState() {
        const newCompleted = !this.state.completed;
        this.setState({ completed: newCompleted }, () => {
            // Call the parent's updateTaskStatus method
            if (this.props.onStatusChange) {
                this.props.onStatusChange(this.props.id, newCompleted);
            }
        });
        
    }

    deleteTask() {
        if(this.props.onDeleteTask)
            // Call the parent's onDeleteTask method
            this.props.onDeleteTask(this.props.id)
    }

    // Enable input for taking task input on edit
    editTask() {
        this.setState((prevState) =>({
            editTask: !prevState.editTask
        }))
    }

    // Updateds task name
    onTaskNameChanged(event) {
        this.setState({
            taskName: event.target.value
        })
    }

    // Changes priority of task
    cyclePriority() {
        const priorities = ['Low', 'Medium', 'High'];
        const currentIndex = priorities.indexOf(this.state.priority);
        const nextPriority = priorities[(currentIndex + 1) % priorities.length];
        
        this.setState({ priority: nextPriority }, () => {
            if (this.props.onPriorityChange) {
                this.props.onPriorityChange(this.props.id, nextPriority);
            }
        });
    }
    
    // Calls API to update task name
    editTaskName(event) {
        if(event.code === 'Enter'){    
            this.setState((prevState) =>({
                editTask: !prevState.editTask
            }))

            if(this.props.onTaskNameUpdate) {
                // Call the parent's onTaskNameUpdate method
                this.props.onTaskNameUpdate(this.props.id, this.state.taskName);
            }
        }
    }

    handleBlur() {
        this.setState({
            taskName: this.props.task
        })
    }

    // Calls API to update due date time
    handleDueDateTimeChange(event) {
        const newDateTime = event.target.value;
        this.setState({ dueDateTime: newDateTime }, () => {
            if (this.props.onDueDateTimeChange) {
                this.props.onDueDateTimeChange(this.props.id, newDateTime);
            }
        });
    }

    // Calls API to update remainder enable status
    toggleReminder() {
        this.setState(prevState => ({ 
            reminderEnabled: !prevState.reminderEnabled 
        }), () => {
            if (this.props.onReminderToggle) {
                this.props.onReminderToggle(this.props.id, this.state.reminderEnabled);
            }

            // Request notification permission when enabling reminders
            if (this.state.reminderEnabled && Notification.permission !== "granted") {
                Notification.requestPermission();
            }
        });
    }

    checkDueDateTime() {
        if (this.state.reminderEnabled && !this.state.completed) {
            const now = new Date();
            const dueTime = new Date(this.state.dueDateTime);
            
            if (now >= dueTime) {
                // Show notification if browser supports it
                if (Notification.permission === "granted") {
                    new Notification("Task Due", {
                        body: `Task "${this.state.taskName}" is now due!`,
                        icon: "/favicon.ico"
                    });
                }
                
                this.setState({ showReminderPopup: true });
            }
        }
    }
    
    render() {
        let taskName 
        if(this.state.editTask) {
            taskName = <input type="text" className="task-name-input ps-2" value={this.state.taskName} placeholder="Add a Task" 
            onChange={this.onTaskNameChanged}
            onKeyDown={this.editTaskName} onBlur={this.handleBlur} autoFocus />
        }
        else 
            taskName = <label className="form-check-label ps-2" htmlFor={this.props.id}>{this.props.task}</label>
        return (
            <div className="task-container rounded-3 p-2 my-2 d-block d-lg-flex justify-content-between align-items-center">
                <div>
                    <input className="form-check-input" type="checkbox" id={this.props.id} checked={this.state.completed} 
                    onChange={this.changeTaskState} />
                    {taskName}
                </div>

                <div className="d-flex flex-wrap gap-1">
                    <input 
                        type="datetime-local" 
                        className="bg-transparent border-0 outline-none text-white"
                        value={this.state.dueDateTime}
                        onChange={this.handleDueDateTimeChange}
                        min={new Date().toISOString().slice(0, 16)}
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        title="Due date and time"
                    />

                    <span 
                        className={`material-icons ${this.state.reminderEnabled ? 'active' : ''}`}
                        onClick={this.toggleReminder}
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        title={this.state.reminderEnabled ? "Disable reminder" : "Enable reminder"}
                    >
                        {this.state.reminderEnabled ? 'notifications_active' : 'notifications_none'}
                    </span>

                    <span 
                        className="material-icons" 
                        onClick={this.editTask}
                        data-bs-toggle="tooltip" 
                        data-bs-title="Edit" 
                        data-bs-placement="bottom" 
                        data-trigger="hover"
                    >
                        edit
                    </span>

                    <span 
                        className="material-icons" 
                        onClick={this.deleteTask}
                        data-bs-toggle="tooltip" 
                        data-bs-placement="bottom" 
                        data-bs-title="Delete" 
                        data-trigger="hover"
                    >
                        delete
                    </span>
            
                    <span 
                        className="material-icons" 
                        data-bs-toggle="tooltip" 
                        data-bs-placement="bottom" 
                        data-bs-title={'Priority ' + this.state.priority}
                        data-trigger="hover" 
                        onClick={this.cyclePriority}
                    >
                        {this.state.priority === 'High' ? 'priority_high' : 
                         this.state.priority === 'Medium' ? 'pending' : 'low_priority'}
                    </span>

                    {/* Reminder Alert Popup */}
                    {this.state.showReminderPopup && (
                        <span 
                            className="material-icons text-danger"
                            onClick={() => this.setState({ showReminderPopup: false })}
                            data-bs-toggle="tooltip" 
                            data-bs-title="Task Due!" 
                            data-bs-placement="bottom" 
                            data-trigger="hover"
                        >
                            hourglass_empty
                        </span>
                    )}
                </div>
            </div>
        )
    }
    
}

export default Task