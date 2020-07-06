const keys = require('../keys')

module.exports = function(email, token) {
    return {
        to: email,
        from: keys.EMAIL_FROM,
        subject: 'Создание пароля доступа',
        html: `
            <h1>Вас добавили в систему</h1>
            <p>Если нет, то проигнорируйте данное письмо</p>
            <p>Иначе перейдите по ссылке</p>
            <p><a href="${keys.BASE_URL}/users/adduser/${token}">Создание пароля</a></p>
            <hr/>
            <a href="${keys.BASE_URL}">Форма</a>
        `
        
    }
}