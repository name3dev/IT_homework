import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

function RegisterForm() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [msg, setMsg] = useState({ txt: '', isErr: false });
  const [loading, setLoading] = useState(false);

  const password = watch('password');

  const sendData = async (data) => {
    setLoading(true);
    setMsg({ txt: '', isErr: false });
    
    try {
      const { confirmPassword, ...payload } = data;
      await axios.post('https://jsonplaceholder.typicode.com/users', payload);
      setMsg({ txt: 'Пользователь успешно зарегистрирован', isErr: false });
    } catch (e) {
      setMsg({ txt: 'Ошибка при регистрации', isErr: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Регистрация</h3>
      <form onSubmit={handleSubmit(sendData)}>
        <div>
          <label>Имя:</label><br />
          <input {...register('name', { required: 'Поле обязательно для заполнения' })} />
          {errors.name && <div style={{ color: 'red' }}>{errors.name.message}</div>}
        </div>

        <div>
          <label>Email:</label><br />
          <input 
            type="email" 
            {...register('email', { 
              required: 'Поле обязательно для заполнения',
              pattern: { value: /^\S+@\S+$/i, message: 'Некорректный формат email' }
            })} 
          />
          {errors.email && <div style={{ color: 'red' }}>{errors.email.message}</div>}
        </div>

        <div>
          <label>Пароль:</label><br />
          <input 
            type="password" 
            {...register('password', { 
              required: 'Поле обязательно для заполнения',
              minLength: { value: 8, message: 'Минимальная длина пароля — 8 символов' }
            })} 
          />
          {errors.password && <div style={{ color: 'red' }}>{errors.password.message}</div>}
        </div>

        <div>
          <label>Подтверждение пароля:</label><br />
          <input 
            type="password" 
            {...register('confirmPassword', { 
              required: 'Поле обязательно для заполнения',
              validate: v => v === password || 'Пароли не совпадают'
            })} 
          />
          {errors.confirmPassword && <div style={{ color: 'red' }}>{errors.confirmPassword.message}</div>}
        </div>
        <br />
        <button type="submit" disabled={loading}>
          {loading ? 'Отправка...' : 'Зарегистрироваться'}
        </button>
      </form>

      {msg.txt && <p style={{ color: msg.isErr ? 'red' : 'green' }}>{msg.txt}</p>}
    </div>
  );
}

function CreatePost() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [users, setUsers] = useState([]);
  const [info, setInfo] = useState({ txt: '', isErr: false });

  useEffect(() => {
    axios.get('https://jsonplaceholder.typicode.com/users')
      .then(res => setUsers(res.data))
      .catch(() => console.error('Ошибка загрузки пользователей'));
  }, []);

  const handlePost = async (data) => {
    try {
      await axios.post('https://jsonplaceholder.typicode.com/posts', data);
      setInfo({ txt: 'Пост успешно создан', isErr: false });
      reset();
    } catch (e) {
      setInfo({ txt: 'Ошибка при создании поста', isErr: true });
    }
  };

  return (
    <div>
      <h3>Создание нового поста</h3>
      <form onSubmit={handleSubmit(handlePost)}>
        <div>
          <label>Автор:</label><br />
          <select {...register('userId', { required: 'Выберите автора из списка' })}>
            <option value="">-- Выберите автора --</option>
            {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
          {errors.userId && <div style={{ color: 'red' }}>{errors.userId.message}</div>}
        </div>

        <div>
          <label>Заголовок:</label><br />
          <input {...register('title', { required: 'Поле обязательно для заполнения' })} />
          {errors.title && <div style={{ color: 'red' }}>{errors.title.message}</div>}
        </div>

        <div>
          <label>Текст поста:</label><br />
          <textarea {...register('body', { required: 'Поле обязательно для заполнения' })} />
          {errors.body && <div style={{ color: 'red' }}>{errors.body.message}</div>}
        </div>
        <br />
        <button type="submit">Создать</button>
      </form>

      {info.txt && <p style={{ color: info.isErr ? 'red' : 'green' }}>{info.txt}</p>}
    </div>
  );
}

function EditProfile() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ text: '', err: false });

  useEffect(() => {
    axios.get('https://jsonplaceholder.typicode.com/users/1')
      .then(res => {
        reset({
          name: res.data.name,
          email: res.data.email,
          phone: res.data.phone,
          website: res.data.website
        });
        setLoading(false);
      })
      .catch(() => {
        setStatus({ text: 'Ошибка при загрузке данных профиля', err: true });
        setLoading(false);
      });
  }, [reset]);

  const saveProfile = async (data) => {
    setSaving(true);
    setStatus({ text: '', err: false });
    try {
      await axios.put('https://jsonplaceholder.typicode.com/users/1', data);
      setStatus({ text: 'Изменения успешно сохранены', err: false });
    } catch (e) {
      setStatus({ text: 'Ошибка при сохранении изменений', err: true });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Загрузка данных профиля...</div>;

  return (
    <div>
      <h3>Редактирование профиля</h3>
      <form onSubmit={handleSubmit(saveProfile)}>
        <div>
          <label>Имя:</label><br />
          <input {...register('name', { required: 'Поле обязательно для заполнения' })} />
          {errors.name && <div style={{ color: 'red' }}>{errors.name.message}</div>}
        </div>

        <div>
          <label>Email:</label><br />
          <input 
            type="email"
            {...register('email', { 
              required: 'Поле обязательно для заполнения',
              pattern: { value: /^\S+@\S+$/i, message: 'Некорректный формат email' }
            })} 
          />
          {errors.email && <div style={{ color: 'red' }}>{errors.email.message}</div>}
        </div>

        <div>
          <label>Телефон:</label><br />
          <input {...register('phone', { required: 'Поле обязательно для заполнения' })} />
          {errors.phone && <div style={{ color: 'red' }}>{errors.phone.message}</div>}
        </div>

        <div>
          <label>Веб-сайт:</label><br />
          <input {...register('website', { required: 'Поле обязательно для заполнения' })} />
          {errors.website && <div style={{ color: 'red' }}>{errors.website.message}</div>}
        </div>
        <br />
        <button type="submit" disabled={saving}>
          {saving ? 'Сохранение...' : 'Сохранить'}
        </button>
      </form>

      {status.text && <p style={{ color: status.err ? 'red' : 'green' }}>{status.text}</p>}
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState('reg');

  return (
    <div>
      <div>
        <button onClick={() => setTab('reg')}>Домашнее задание 1</button>
        <button onClick={() => setTab('post')}>Домашнее задание 2</button>
        <button onClick={() => setTab('profile')}>Домашнее задание 3</button>
      </div>
      <hr />
      <div>
        {tab === 'reg' && <RegisterForm />}
        {tab === 'post' && <CreatePost />}
        {tab === 'profile' && <EditProfile />}
      </div>
    </div>
  );
}
