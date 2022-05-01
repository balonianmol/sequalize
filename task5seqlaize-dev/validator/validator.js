const { check } = require('express-validator')
const validuser =[
  check('userName', 'username cant be empty').not().isEmpty(),
  check('password', "password cant be empty").not().isEmpty(),
  check('email', 'email cant be empty').not().isEmpty(),
  check('firstname', 'firstname cant be empty').not().isEmpty(),
  check('lastname', 'lastname cant be empty').not().isEmpty(),

];
const validlogin =[
  check('userName','username cannot be empty').not().isEmpty(),
  check('password','password cannot be empty').not().isEmpty(),
];
const validaddress=[
  check('address','address cannot be empty').not().isEmpty(),
  check('city','city cannot be empty').not().isEmpty(),
  check('state','state cannot be empty').not().isEmpty(),
  check('phonenumber','Phonenumber cannot be empty').not().isEmpty(),
  check('pincode','pincode cannot be empty').not().isEmpty(),
]
module.exports = {
  validuser,validlogin,validaddress
}