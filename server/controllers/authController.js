const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const usersFile = path.join(__dirname, '../users.json');

// Helper to read users
const getUsers = () => {
    if (!fs.existsSync(usersFile)) {
        return [];
    }
    const data = fs.readFileSync(usersFile);
    return JSON.parse(data);
};

// Helper to save users
const saveUsers = (users) => {
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
};

exports.register = async (req, res) => {
    const { email, password, name } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    const users = getUsers();
    if (users.find(u => u.email === email)) {
        return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 8);
    const newUser = {
        id: Date.now().toString(),
        name: name || email.split('@')[0],
        email,
        password: hashedPassword
    };

    users.push(newUser);
    saveUsers(users);

    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET || 'secret_key', {
        expiresIn: '24h'
    });

    res.status(201).json({ auth: true, token, user: { id: newUser.id, name: newUser.name, email: newUser.email } });
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    const users = getUsers();
    const user = users.find(u => u.email === email);

    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
        return res.status(401).json({ auth: false, token: null, error: 'Invalid password' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'secret_key', {
        expiresIn: '24h'
    });

    res.status(200).json({ auth: true, token, user: { id: user.id, name: user.name, email: user.email } });
};

exports.me = (req, res) => {
    const users = getUsers();
    const user = users.find(u => u.id === req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.status(200).json({ id: user.id, name: user.name, email: user.email });
};
