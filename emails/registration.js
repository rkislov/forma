const key = require('../keys')
const keys = require('../keys')
const { helpers } = require('handlebars')
module.exports = function(email) {
    return {
        to: email,
        from: keys.EMAIL_FROM,
        subject: 'Аккаунт создан',
        html: `
            <h1>Добро пожаловать</h1>
            <p>Вы успешно создали аккаут с email - ${email} </p>
            <hr/>
            <a href="${keys.BASE_URL}">Форма</a>
        `
        
    }
}