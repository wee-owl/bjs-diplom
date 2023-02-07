'use strict'

const userForm = new UserForm();


// авторизация
userForm.loginFormCallback = ({login, password}) => {
  const callback = (response) => {
    if (response.success) {
      location.reload();
    } else {
      userForm.setLoginErrorMessage(response.error);
    }
  };
  ApiConnector.login({login, password}, callback);
};


// регистрация
userForm.registerFormCallback = ({login, password}) => {
  const callback = (response) => {
    if (response.success) {
      location.reload();
    } else {
      userForm.setRegisterErrorMessage(response.error);
    }
  };
  ApiConnector.register({login, password}, callback);
};