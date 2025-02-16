import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import './Login.css';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            error: '',
            isLoggedIn: false
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        const { name, value } = event.target;
        this.setState({ [name]: value, error: '' });
    }

    handleSubmit(event) {
        event.preventDefault();
        const { email, password } = this.state;

        if (!email || !password) {
            this.setState({ error: 'Please fill in all fields' });
            return;
        }

        // Call the API to check credentials
        fetch('http://localhost:8000/users')
            .then(response => response.json())
            .then(users => {
                const user = users.find(u => u.email === email && u.password === password);
                if (user) {
                    sessionStorage.setItem('user', JSON.stringify(user));
                    sessionStorage.setItem('isLoggedIn', 'true');
                    this.setState({ isLoggedIn: true });
                } else {
                    this.setState({ error: 'Invalid email or password' });
                }
            })
            .catch(error => {
                console.error('Error:', error);
                this.setState({ error: 'An error occurred. Please try again.' });
            });
    }

    render() {
        if (this.state.isLoggedIn) {
            return <Navigate to="/todo" replace />;
        }

        return (
            <div className="login-container d-flex align-items-center justify-content-center">
                <div className="login-box">
                    <h2>Login</h2>
                    <form onSubmit={this.handleSubmit}>
                        {this.state.error && (
                            <div className="alert alert-danger">{this.state.error}</div>
                        )}
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                name="email"
                                value={this.state.email}
                                onChange={this.handleChange}
                                placeholder="Enter email"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                name="password"
                                value={this.state.password}
                                onChange={this.handleChange}
                                placeholder="Password"
                            />
                        </div>
                        <button type="submit" className="btn text-white w-100">
                            Login
                        </button>
                    </form>
                </div>
            </div>
        );
    }
}

export default Login;