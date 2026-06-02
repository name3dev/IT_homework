import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';

function App() {
  const [name, setName] = useState('');
  const [emailReg, setEmailReg] = useState('');
  const [passwordReg, setPasswordReg] = useState('');
  const [errorsReg, setErrorsReg] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!name || name.trim() === '') {
      newErrors.name = 'Name is required';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!emailReg || emailReg.trim() === '') {
      newErrors.email = 'Email is required';
    } else if (!emailReg.includes('@') || !emailReg.includes('.')) {
      newErrors.email = 'Invalid email format';
    }

    if (!passwordReg || passwordReg.trim() === '') {
      newErrors.password = 'Password is required';
    } else if (passwordReg.length <= 6) {
      newErrors.password = 'Password must be more than 6 characters';
    }

    setErrorsReg(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();

    if (validate()) {
      console.log('Submitting:', {
        name,
        email: emailReg,
        password: passwordReg
      });

      alert('Form submitted successfully!');

      setName('');
      setEmailReg('');
      setPasswordReg('');
      setErrorsReg({});
    }
  };

  const {
    register: loginRegister,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
    reset: resetLogin
  } = useForm();

  const onLoginSubmit = (data) => {
    console.log('Данные входа:', data);
    resetLogin();
  };

  const [tasks, setTasks] = useState([]);

  const {
    register: todoRegister,
    handleSubmit: handleTodoSubmit,
    reset: resetTodo,
    formState: { errors: todoErrors }
  } = useForm();

  const onTodoSubmit = (data) => {
    if (!data.task.trim()) return;

    setTasks([...tasks, data.task]);
    resetTodo();

    console.log('Текущие задачи:', [...tasks, data.task]);
  };

  const {
    register: profileRegister,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors }
  } = useForm({
    defaultValues: {
      name: 'Иван Иванов',
      age: 25,
      city: 'Ташкент'
    }
  });

  const onProfileSubmit = (data) => {
    console.log('Объект пользователя:', data);
    alert('Данные профиля: ' + JSON.stringify(data));
  };

  const {
    register: phoneRegister,
    handleSubmit: handlePhoneSubmit,
    control,
    formState: { errors: phoneErrors }
  } = useForm({
    defaultValues: {
      phones: [{ number: '' }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'phones'
  });

  const onPhoneSubmit = (data) => {
    console.log('Массив телефонов:', data.phones);
  };

  return (
    <div style={{ padding: '20px' }}>

      <h2>Регистрация</h2>

      <form onSubmit={handleRegisterSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value || '')}
            placeholder="Name"
            style={{
              width: '100%',
              padding: '10px',
              borderColor: errorsReg.name ? 'red' : 'gray',
              borderRadius: '4px'
            }}
          />

          {errorsReg.name && (
            <div style={{ color: 'red', marginTop: '5px' }}>
              {errorsReg.name}
            </div>
          )}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <input
            type="text"
            value={emailReg}
            onChange={(e) => setEmailReg(e.target.value || '')}
            placeholder="Email"
            style={{
              width: '100%',
              padding: '10px',
              borderColor: errorsReg.email ? 'red' : 'gray',
              borderRadius: '4px'
            }}
          />

          {errorsReg.email && (
            <div style={{ color: 'red', marginTop: '5px' }}>
              {errorsReg.email}
            </div>
          )}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <input
            type="password"
            value={passwordReg}
            onChange={(e) => setPasswordReg(e.target.value || '')}
            placeholder="Password"
            style={{
              width: '100%',
              padding: '10px',
              borderColor: errorsReg.password ? 'red' : 'gray',
              borderRadius: '4px'
            }}
          />

          {errorsReg.password && (
            <div style={{ color: 'red', marginTop: '5px' }}>
              {errorsReg.password}
            </div>
          )}
        </div>

        <button type="submit">Register</button>
      </form>

      <hr />

      <h3>Форма авторизации</h3>

      <form onSubmit={handleLoginSubmit(onLoginSubmit)}>
        <div>
          <label>Email: </label>

          <input
            type="email"
            {...loginRegister('email', {
              required: 'Email обязателен'
            })}
          />

          {loginErrors.email && (
            <span style={{ color: 'red' }}>
              {loginErrors.email.message}
            </span>
          )}
        </div>

        <div>
          <label>Пароль: </label>

          <input
            type="password"
            {...loginRegister('password', {
              required: 'Пароль обязателен'
            })}
          />

          {loginErrors.password && (
            <span style={{ color: 'red' }}>
              {loginErrors.password.message}
            </span>
          )}
        </div>

        <button type="submit">Войти</button>
      </form>

      <hr />

      <h3>TODO форма</h3>

      <form onSubmit={handleTodoSubmit(onTodoSubmit)}>
        <input
          {...todoRegister('task', {
            required: 'Задача не может быть пустой',
            validate: (value) =>
              value.trim() !== '' ||
              'Задача не может быть пустой строкой'
          })}
        />

        {todoErrors.task && (
          <span style={{ color: 'red' }}>
            {todoErrors.task.message}
          </span>
        )}

        <button type="submit">Добавить задачу</button>
      </form>

      {tasks.length > 0 && (
        <div style={{ marginTop: '15px' }}>
          <h4>Список задач:</h4>

          <ul>
            {tasks.map((task, index) => (
              <li key={index}>{task}</li>
            ))}
          </ul>
        </div>
      )}

      <hr />

      <h3>Форма профиля</h3>

      <form onSubmit={handleProfileSubmit(onProfileSubmit)}>
        <div>
          <label>Имя: </label>

          <input
            {...profileRegister('name', {
              required: 'Имя обязательно'
            })}
          />

          {profileErrors.name && (
            <span style={{ color: 'red' }}>
              {profileErrors.name.message}
            </span>
          )}
        </div>

        <div>
          <label>Возраст: </label>

          <input
            type="number"
            {...profileRegister('age', {
              required: 'Возраст обязателен',
              pattern: {
                value: /^[0-9]+$/,
                message: 'Возраст должен быть числом'
              }
            })}
          />

          {profileErrors.age && (
            <span style={{ color: 'red' }}>
              {profileErrors.age.message}
            </span>
          )}
        </div>

        <div>
          <label>Город: </label>

          <input
            {...profileRegister('city', {
              required: 'Город обязателен'
            })}
          />

          {profileErrors.city && (
            <span style={{ color: 'red' }}>
              {profileErrors.city.message}
            </span>
          )}
        </div>

        <button type="submit">Сохранить профиль</button>
      </form>

      <hr />

      <h3>Динамические поля (телефоны)</h3>

      <form onSubmit={handlePhoneSubmit(onPhoneSubmit)}>
        {fields.map((field, index) => (
          <div key={field.id} style={{ marginBottom: '10px' }}>
            <label>Телефон {index + 1}: </label>

            <input
              {...phoneRegister(`phones.${index}.number`, {
                required: 'Номер телефона обязателен'
              })}
            />

            {phoneErrors.phones?.[index] && (
              <span style={{ color: 'red' }}>
                {phoneErrors.phones[index].number.message}
              </span>
            )}

            {index > 0 && (
              <button
                type="button"
                onClick={() => remove(index)}
                style={{ marginLeft: '10px' }}
              >
                Удалить
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={() => append({ number: '' })}
        >
          Добавить телефон
        </button>

        <button
          type="submit"
          style={{ marginLeft: '10px' }}
        >
          Сохранить телефоны
        </button>
      </form>

    </div>
  );
}

export default App;