import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

function RegisterForm() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [msg, setMsg] = useState({ txt: '', isErr: false });
  const [loading, setLoading] = useState(false);

  const passVal = watch('password');

  const sendData = async (data) => {
    setLoading(true);
    setMsg({ txt: '', isErr: false });
    
    try {
      const { confirmPassword, ...payload } = data;
      await axios.post('https://typicode.com', payload);
      setMsg({ txt: 'Успешно зарегался!', isErr: false });
    } catch (e) {
      setMsg({ txt: 'Какая-то лажа при регистрации...', isErr: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '15px', border: '1px solid #ccc', borderRadius: '5px' }}>
      <h3>Форма реги</h3>
      <form onSubmit={handleSubmit(sendData)} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div>
          <input placeholder="Имя" {...register('name', { required: 'Забыл имя ввести' })} />
          {errors.name && <div style={{ color: 'red', fontSize: '12px' }}>{errors.name.message}</div>}
        </div>

        <div>
          <input 
            placeholder="Email" 
            {...register('email', { 
              required: 'Email обязателен',
              pattern: { value: /^\S+@\S+$/i, message: 'Email кривой' }
            })} 
          />
          {errors.email && <div style={{ color: 'red', fontSize: '12px' }}>{errors.email.message}</div>}
        </div>

        <div>
          <input 
            type="password" 
            placeholder="Пароль" 
            {...register('password', { 
              required: 'Придумай пароль',
              minLength: { value: 8, message: 'Надо хотя бы 8 знаков' }
            })} 
          />
          {errors.password && <div style={{ color: 'red', fontSize: '12px' }}>{errors.password.message}</div>}
        </div>

        <div>
          <input 
            type="password" 
            placeholder="Повтори пароль" 
            {...register('confirmPassword', { 
              required: 'Повтори пароль обязательно',
              validate: v => v === passVal || 'Пароли не совпали'
            })} 
          />
          {errors.confirmPassword && <div style={{ color: 'red', fontSize: '12px' }}>{errors.confirmPassword.message}</div>}
        </div>

        <button type="submit" disabled={loading} style={{ width: 'fit-content' }}>
          {loading ? 'Отправляем...' : 'Ткни для реги'}
        </button>
      </form>

      {msg.txt && <p style={{ color: msg.isErr ? 'red' : 'green' }}>{msg.txt}</p>}
    </div>
  );
}

function CreatePost() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [users, setUsers] = useState([]);
  const [info, setInfo] = useState('');

  useEffect(() => {
    axios.get('https://typicode.com')
      .then(res => setUsers(res.data))
      .catch(err => console.log('Юзеры не прилетели:', err));
  }, []);

  const handlePost = async (data) => {
    try {
      await axios.post('https://typicode.com', data);
      setInfo('Пост улетел на сервак!');
      reset();
    } catch (e) {
      setInfo('Пост не создался, косяк.');
    }
  };

  return (
    <div style={{ padding: '15px', border: '1px solid #ccc', borderRadius: '5px' }}>
      <h3>Новый пост</h3>
      <form onSubmit={handleSubmit(handlePost)} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div>
          <select {...register('userId', { required: 'Выбери автора, ну' })}>
            <option value="">Кто автор?</option>
            {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
          {errors.userId && <div style={{ color: 'red', fontSize: '12px' }}>{errors.userId.message}</div>}
        </div>

        <div>
          <input placeholder="Заголовок" {...register('title', { required: 'Заголовок пустой' })} />
          {errors.title && <div style={{ color: 'red', fontSize: '12px' }}>{errors.title.message}</div>}
        </div>

        <div>
          <textarea placeholder="Текст..." {...register('body', { required: 'А писать кто будет?' })} />
          {errors.body && <div style={{ color: 'red', fontSize: '12px' }}>{errors.body.message}</div>}
        </div>

        <button type="submit" style={{ width: 'fit-content' }}>Создать пост</button>
      </form>

      {info && <p style={{ color: 'blue' }}>{info}</p>}
    </div>
  );
}

function EditProfile() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ text: '', err: false });

  useEffect(() => {
    axios.get('https://typicode.com/1')
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
        setStatus({ text: 'Не смогли стянуть данные профиля', err: true });
        setLoading(false);
      });
  }, [reset]);

  const saveProfile = async (data) => {
    setSaving(true);
    setStatus({ text: '', err: false });
    try {
      await axios.put('https://typicode.com/1', data);
      setStatus({ text: 'Профиль обновили!', err: false });
    } catch (e) {
      setStatus({ text: 'Не сохранилось нифига', err: true });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Секунду, грузим инфу...</div>;

  return (
    <div style={{ padding: '15px', border: '1px solid #ccc', borderRadius: '5px' }}>
      <h3>Редактировать профиль</h3>
      <form onSubmit={handleSubmit(saveProfile)} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div>
          <label>Имя: </label>
          <input {...register('name', { required: 'Поле пустое' })} />
          {errors.name && <span style={{ color: 'red', marginLeft: '10px' }}>{errors.name.message}</span>}
        </div>

        <div>
          <label>Email: </label>
          <input {...register('email', { required: 'Email нужен' })} />
          {errors.email && <span style={{ color: 'red', marginLeft: '10px' }}>{errors.email.message}</span>}
        </div>

        <div>
          <label>Телефон: </label>
          <input {...register('phone', { required: 'Без мобилы никак' })} />
          {errors.phone && <span style={{ color: 'red', marginLeft: '10px' }}>{errors.phone.message}</span>}
        </div>

        <div>
          <label>Сайт: </label>
          <input {...register('website', { required: 'Сайт укажи' })} />
          {errors.website && <span style={{ color: 'red', marginLeft: '10px' }}>{errors.website.message}</span>}
        </div>

        <button type="submit" disabled={saving} style={{ width: 'fit-content' }}>
          {saving ? 'Сохраняем...' : 'Сохранить изменения'}
        </button>
      </form>

      {status.text && <p style={{ color: status.err ? 'red' : 'green' }}>{status.text}</p>}
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState('reg');

  return (
    <div style={{ maxWidth: '600px', margin: '30px auto', fontFamily: 'sans-serif' }}>
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <button onClick={() => setTab('reg')} style={{ fontWeight: tab === 'reg' ? 'bold' : 'normal' }}>ДЗ 1: Рега</button>
        <button onClick={() => setTab('post')} style={{ fontWeight: tab === 'post' ? 'bold' : 'normal' }}>ДЗ 2: Пост</button>
        <button onClick={() => setTab('profile')} style={{ fontWeight: tab === 'profile' ? 'bold' : 'normal' }}>ДЗ 3: Профиль</button>
      </div>

      <div>
        {tab === 'reg' && <RegisterForm />}
        {tab === 'post' && <CreatePost />}
        {tab === 'profile' && <EditProfile />}
      </div>
    </div>
  );
}
