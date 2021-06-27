import React, { Component } from 'react';
import auth from "../../handlers/SQLiteAuthHandler"
import "./index.scss";


export default class Login extends Component {

  validate = type => {
    const input = document.getElementById(`input${type}`);
    const feedback = document.getElementById(`feedback${type}`);

    const reg = type === "Name"
      ? input.value.match(/^[А-Я][а-я]{1,20}\s[А-Я][а-я]{1,20}\s[А-Я][а-я]{1,20}$/)
      : input.value.match(/.+/);


    if (reg === null) {
      input.classList.remove("is-valid");
      input.classList.add("is-invalid");
      feedback.innerText = type === "Name"
        ? "Введите Ваше имя корректно - 3 слова с больших букв"
        : "Вы не ввели пароль";
      feedback.classList.remove("valid-feedback");
      feedback.classList.add("invalid-feedback");
    }
    else {
      input.classList.remove("is-invalid");
      input.classList.add("is-valid");
      feedback.innerText = type === "Name" ? "Имя корректно" : "Пароль введен";
      feedback.classList.remove("invalid-feedback");
      feedback.classList.add("valid-feedback");
    }
  }



  render = () =>
    <div className="auth-layout">
      <div className="auth-title">Вход на сайт</div>
      <form>
        <div className="auth-section">
          <div>
            <label htmlFor="inputName" className="auth-section-label">Ф.И.О.</label>
            <div className="auth-section-input">
              <input type="text" className="form-control" id="inputName" onBlur={() => this.validate("Name")} />
              <div id="feedbackName"></div>
            </div>
          </div>
          <div>
            <label htmlFor="inputPassword" className="auth-section-label">Пароль</label>
            <div className="auth-section-input">
              <input type="password" className="form-control" id="inputPassword" onBlur={() => this.validate("Password")} />
              <div id="feedbackPassword"></div>
            </div>
          </div>
        </div>
        <div className="auth-section">
          <hr />
          <div className="auth-footer">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={() => this.props.login(document.getElementById("inputName").value, document.getElementById("inputPassword").value)}
            >Войти</button>
            <span className="a-like">Зарегистрироваться</span>
          </div>
        </div>
      </form>
    </div>
}