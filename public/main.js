async function postData(url, data) {
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    })
    return response
}

async function register() {
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value

    const response = await postData('/api/user/register', {email, password})

    if (response.ok) {
        alert('Registration successfull!')
        window.location.href = '/login.html';
    } else {
        alert('Registration failed!');
    }
}

async function login() {
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value

    const response = await postData('/api/user/login', {email, password})

    if (response.ok) {
        const data = await response.json()
        alert('Login successfull!')
        localStorage.setItem('token', data.token)
        window.location.href = '/'
    } else {
        alert('Login failed!');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname

    if(path.includes('register.html')){
        console.log("registerissä ollaan")
        const registerForm = document.getElementById('registerForm')
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault()
            console.log("register")
            register()
        })
    }else if(path.includes('login.html')){
        const loginForm = document.getElementById('loginForm')
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault()
            console.log("login")
            login()
        })
    }
})