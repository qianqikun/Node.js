const crypt = require('./utils/crypt');
let data =
    "oAarUwXEJdCl0%2FBKtgE2JrYTMRBq3wNHDry3Dt2TkZM9%2FkUbSH766ETO%2FsCf8gycFkp1%2FuC%2B%2BBF15qYE71M7GZ%2BBTHerhHwxuCXgi%2B48IESWBzfLJB73nHztSsq6rrGeY7mRhrn%2F061bw3vqHzJRYa2LTUSm%2FQfYcW0CtVQyThtUxmUtyEuA1dNKoOrM7DeLtgi17F7oJwbfDhd9ygMCTWrHarYPs1ilB875gDjhuTvxqKh%2FxQjllYzixqI9g19B1e1QwStX4L%2BRWvAYw2SQGgkxRbmPQeiwQjUmvlXHzCA%3D"
data = decodeURIComponent(data);
data = crypt.decrypt(data);
console.log(data);


// 6f0ca4139c9937fafe11a67cef47bc25b5a77ae9
// 6f0ca4139c9937fafe11a67cef47bc25b5a77ae9
// 6f0ca4139c9937fafe11a67cef47bc25b5a77ae9