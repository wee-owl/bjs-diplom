// выход из ЛК
const logoutButton = new LogoutButton();

logoutButton.action = () => {
  const callback = (response) => {
    if (response.success) {
      location.reload();
    }
  };
  ApiConnector.logout(callback);
};


// инфо о пользователе
ApiConnector.current((response) => {
  if (response.success) {
    ProfileWidget.showProfile(response.data);
  }
});


// текущий курс валюты
const ratesBoard = new RatesBoard();

const requestRatesBoard = () => {
  ApiConnector.getStocks((response) => {
    if (response.success) {
      ratesBoard.clearTable();
      ratesBoard.fillTable(response.data);
    }
  });
};
requestRatesBoard();
setInterval(() => requestRatesBoard(), 60000);


// операции с деньгами
const moneyManager = new MoneyManager();

// пополнение баланса
moneyManager.addMoneyCallback = ({currency, amount}) => {
  const callback = (response) => {
    if (response.success) {
      ProfileWidget.showProfile(response.data);
      moneyManager.setMessage(response.success, `Счет ${currency} успешно пополнен на ${amount} ${currency}`);
    } else {
      moneyManager.setMessage(response.success, response.error);
    }
  };
  ApiConnector.addMoney({currency, amount}, callback);
};

// конвертирование валюты
moneyManager.conversionMoneyCallback = ({fromCurrency, targetCurrency, fromAmount}) => {
  const callback = (response) => {
    if (response.success) {
      ProfileWidget.showProfile(response.data);
      moneyManager.setMessage(response.success, `${fromAmount} ${fromCurrency} успешно переведен(ы) в ${targetCurrency}`);
    } else {
      moneyManager.setMessage(response.success, response.error);
    }
  };
  ApiConnector.convertMoney({fromCurrency, targetCurrency, fromAmount}, callback);
};

// перевод валюты
moneyManager.sendMoneyCallback = ({to, currency, amount}) => {
  const callback = (response) => {
    if (response.success) {
      ProfileWidget.showProfile(response.data);
      moneyManager.setMessage(response.success, `Перевод средств успешно осуществлен`);
    } else {
      moneyManager.setMessage(response.success, response.error);
    }
  };
  ApiConnector.transferMoney({to, currency, amount}, callback);
};


// работа со списком Избранное
const favoritesWidget = new FavoritesWidget();

// отображение начального списка
ApiConnector.getFavorites((response) => {
  if (response) {
    favoritesWidget.clearTable();
    favoritesWidget.fillTable(response.data);
    moneyManager.updateUsersList(response.data);
  }
});

// добавление пользователя в избранное
favoritesWidget.addUserCallback = ({id, name}) => {
  const callback = (response) => {
    if (response.success) {
      favoritesWidget.clearTable();
      favoritesWidget.fillTable(response.data);
      moneyManager.updateUsersList(response.data);
      favoritesWidget.setMessage(response.success, `Пользователь ${name} успешно добавлен`);
    } else {
      favoritesWidget.setMessage(response.success, response.error);
    }
  };
  ApiConnector.addUserToFavorites({id, name}, callback);
};

// удаление пользователя из избранного
favoritesWidget.removeUserCallback = (id) => {
  const callback = (response) => {
    if (response.success) {
      favoritesWidget.clearTable();
      favoritesWidget.fillTable(response.data);
      moneyManager.updateUsersList(response.data);
      favoritesWidget.setMessage(response.success, `Пользователь успешно удален`);
    } else {
      favoritesWidget.setMessage(response.success, response.error);
    }
  };
  ApiConnector.removeUserFromFavorites(id, callback);
};