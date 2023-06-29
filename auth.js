 const mysql = require("mysql");
 const jwt = require('jsonwebtoken');
 const bcrypt = require('bcryptjs');

 const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if( !email || !password){
            return res.status(400).render(login, {
                message: 'Missing Email or Password'
            })
        }

        db.query('SELECT * FROM users WHERE email = ?',
         [email], async (error, results) => {
            if( !results || !(await bcrypt.compare(password, results[0].password))) {
            res.status(401).render('login', {
                message: 'Email or Password Incorrect'
            })
          } else {
            const idusers = results[0].idusers;

            const token = jwt.sign({ idusers }, process.env.JWT_SECRET,
                {expiresIn: process.env.JWT_EXPIRES_IN});

                console.log('Token is: ' + token);

                const cookieOptions = {
                    expires: new Date(Date.now() 
                    + process.env.JWT_COOKIE_EXPIRES  * 24 * 60 * 60 * 1000
                    ), httpOnly: true
                }

                res.cookie('jwt', token, cookieOptions );
                res.status(200).redirect('homepage');
          }

        })

    } catch (error){
        console.log(error)
    }
};

exports.signup = (req, res) => {
    console.log(req.body);

const { username, email, password } = req.body;

db.query('SELECT user_email FROM users WHERE user_email = ?',
 [email], async (error, results) => {
    if(error) {
        console.log(error);
    }
    if (results.length > 0 ){
        return res.render('signup', {
            message: 'Email is already taken'
        })
    }

let encryptPass = await bcrypt.hash(password, 6);
    console.log(encryptPass);

db.query('INSERT INTO users SET ?', 
    {user_name: username, user_email: email, pass_word: encryptPass}), 
    (error, results) => {
        if(error){
            console.log(error);
        } else {
            console.log(results);
            return res.render('login');
        }
    }

    });
}
