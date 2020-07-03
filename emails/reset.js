const keys = require('../keys')

module.exports = function(email, token) {
    return {
        to: email,
        from: keys.EMAIL_FROM,
        subject: 'Восстановление пароля доступа',
        html: `
            <h1>Вы забыли свой пароль?</h1>
            <p>Если нет, то проигнорируйте данное письмо</p>
            <p>Иначе перейдите по ссвлке</p>
            <p><a href="${keys.BASE_URL}/auth/password/${token}">Восстановление пароля</a></p>
            <hr/>
            <a href="${keys.BASE_URL}">Форма</a>
        `
        
    }
}