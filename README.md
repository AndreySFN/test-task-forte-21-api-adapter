# API Адаптер к тестовому заданию Форте 21

## Версия: 1.0.4

---

## Описание

`ApiAdapter` предоставляет интерфейс для взаимодействия с REST API сервера, реализованного в рамках тестового задания Форте 21.  
Адаптер реализован с использованием библиотеки [`axios`](https://axios-http.com/).  
Он включает методы для аутентификации, управления клиентами, а также создания, обновления и удаления данных.  
Подходит для интеграции с бэкендом, поддерживающим JSON-формат данных.

> **Важное замечание**: Все методы (кроме `getClients` и `getClientById`) требуют аутентификации. То есть, чтобы успешно вызывать методы `createClient`, `updateClient`, `deleteClient`, `getTotalClients` и т. д., вам нужно либо:
> 1. Передать уже имеющийся токен во второй параметр конструктора,
> 2. Или вызвать метод `authenticate(...)` с учётными данными.

---

## Установка

Установите пакет в ваш проект:

```bash
npm install test-task-forte-21-api-adapter
```

---

## Быстрый старт

```typescript
import { ApiAdapter } from 'test-task-forte-21-api-adapter';

// Создание экземпляра адаптера с базовым URL.
// Обратите внимание, что вы можете передать сохранённый токен вторым параметром.
const api = new ApiAdapter('https://api.example.com');

async function main() {
  // Аутентификация
  const token = await api.authenticate('username', 'password');
  console.log('Token:', token);

  // Получение списка клиентов (не требует аутентификации, но если вы уже авторизованы, токен будет использован)
  const clients = await api.getClients();
  console.log('Список клиентов:', clients);
}

main().catch(console.error);
```

---

## Пример использования с сохранением токена

Вы можете передавать сохранённый токен при создании экземпляра адаптера:

```typescript
// Допустим, вы сохранили токен где-то в локальном хранилище
const savedToken = localStorage.getItem('accessToken');

// Создание адаптера сразу с токеном
const api = new ApiAdapter('https://api.example.com', savedToken || undefined);

// Теперь при выполнении запросов авторизация будет происходить автоматически,
// без дополнительного вызова метода authenticate.
```

---

## Конструктор

### `constructor(baseURL: string, token?: string)`

Создает экземпляр адаптера API.

- **Параметры**:
    - `baseURL` (string): Базовый URL API.
    - `token` (string, опционально): Токен аутентификации (если уже получен).

---

## Методы

Ниже приведён код адаптера и описание методов.

```typescript
// TODO: ts-ignores
import axios, { AxiosInstance } from 'axios';
import { ClientDto, ClientListDto } from './types';

export class ApiAdapter {
    private readonly instance: AxiosInstance;
    private token: string | null = null;

    constructor(baseURL: string, token?: string) {
        this.token = token || null;
        this.instance = axios.create({
            baseURL,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        this.instance.interceptors.request.use((config) => {
            if (this.token) {
                config.headers.Authorization = `Bearer ${this.token}`;
            }
            return config;
        });
    }

    getInstance() {
        return this.instance;
    }

    // Аутентификация
    // @ts-ignore
    async authenticate(username: string, password: string): Promise<string> {
        const response = await this.instance.post('/auth', { username, password });
        this.token = response.data.accessToken;
        return String(this.token);
    }

    // Получение списка клиентов (не требует аутентификации)
    async getClients(query?: {
        search?: string;
        sortField?: string;
        sortOrder?: 'asc' | 'desc';
        page?: number;
        limit?: number;
        // @ts-ignore
    }): Promise<ClientListDto> {
        const response = await this.instance.get('/clients', { params: query });
        return response.data;
    }

    // Получение клиента по ID (не требует аутентификации)
    // @ts-ignore
    async getClientById(id: string): Promise<ClientDto> {
        const response = await this.instance.get(`/clients/${id}`);
        return response.data;
    }

    // Получение общего количества клиентов (требует аутентификации)
    // @ts-ignore
    async getTotalClients(search?: string): Promise<number> {
        const response = await this.instance.get('/clients/total', { params: { search } });
        return response.data.total;
    }

    // Создание нового клиента (требует аутентификации)
    // @ts-ignore
    async createClient(client: ClientDto): Promise<ClientDto> {
        const response = await this.instance.post('/clients', client);
        return response.data;
    }

    // Обновление клиента по ID (требует аутентификации)
    // @ts-ignore
    async updateClient(id: string, client: Partial<ClientDto>): Promise<ClientDto> {
        const response = await this.instance.put(`/clients/${id}`, client);
        return response.data;
    }

    // Удаление клиента по ID (требует аутентификации)
    // @ts-ignore
    async deleteClient(id: string): Promise<{ message: string }> {
        const response = await this.instance.delete(`/clients/${id}`);
        return response.data;
    }
}
```

### 1. Аутентификация

#### `async authenticate(username: string, password: string): Promise<string>`

Аутентифицирует пользователя и сохраняет токен для последующих запросов.

- **Параметры**:
    - `username` (string): Имя пользователя.
    - `password` (string): Пароль пользователя.
- **Возвращает**: Токен доступа (`string`).

### 2. Получение списка клиентов (не требует аутентификации)

#### `async getClients(query?: { search?: string; sortField?: string; sortOrder?: 'asc' | 'desc'; page?: number; limit?: number; }): Promise<ClientListDto>`

Возвращает список клиентов.

- **Параметры**:
    - `query` (опционально): Параметры фильтрации и сортировки.
        - `search` (string): Текст для поиска.
        - `sortField` (string): Поле для сортировки.
        - `sortOrder` ('asc' | 'desc'): Порядок сортировки.
        - `page` (number): Номер страницы.
        - `limit` (number): Количество записей на странице.
- **Возвращает**: Объект с данными клиентов и общим количеством (см. `ClientListDto`).

### 3. Получение клиента по ID (не требует аутентификации)

#### `async getClientById(id: string): Promise<ClientDto>`

Возвращает данные клиента по идентификатору.

- **Параметры**:
    - `id` (string): Идентификатор клиента.
- **Возвращает**: Данные клиента (`ClientDto`).

### 4. Получение общего количества клиентов (требует аутентификации)

#### `async getTotalClients(search?: string): Promise<number>`

Возвращает общее количество клиентов.

- **Параметры**:
    - `search` (string, опционально): Текст для поиска.
- **Возвращает**: Общее количество клиентов (`number`).

### 5. Создание клиента (требует аутентификации)

#### `async createClient(client: ClientDto): Promise<ClientDto>`

Создает нового клиента.

- **Параметры**:
    - `client` (`ClientDto`): Объект клиента.
- **Возвращает**: Данные созданного клиента (`ClientDto`).

### 6. Обновление клиента по ID (требует аутентификации)

#### `async updateClient(id: string, client: Partial<ClientDto>): Promise<ClientDto>`

Обновляет данные клиента.

- **Параметры**:
    - `id` (string): Идентификатор клиента.
    - `client` (Partial<ClientDto>): Обновленные данные клиента.
- **Возвращает**: Обновленные данные клиента (`ClientDto`).

### 7. Удаление клиента по ID (требует аутентификации)

#### `async deleteClient(id: string): Promise<{ message: string }>`

Удаляет клиента по идентификатору.

- **Параметры**:
    - `id` (string): Идентификатор клиента.
- **Возвращает**: Сообщение о результате удаления.

---

## Типы

### `ClientDto`

Представляет клиента.

```typescript
export interface ClientDto {
  _id?: string;
  name: string;
  company: string;
  details: ClientDetails;
}
```

### `ClientDetails`

Представляет детализированные данные клиента.

```typescript
export interface ClientDetails {
  _id?: string;
  contact: string;
  about?: string;
  phoneNumber?: string;
}
```

### `ClientListDto`

Тип для ответа, содержащего список клиентов и общее количество.

```typescript
export interface ClientListDto {
  data: ClientDto[];
  total: number;
}
```

---

## Скрипты разработки

- `start`: Запуск в режиме разработки.
- `build`: Сборка пакета.
- `test`: Запуск тестов.
- `lint`: Проверка кода.
- `prepare`: Сборка перед публикацией.
- `size`: Проверка размера бандла.
- `analyze`: Анализ размера бандла.

---

## Технические требования

- **Node.js**: `>=10`
- **TypeScript**: `^5.7.3`

---

## Структура проекта

```plaintext
src/
  types/
    index.ts      // Типы данных (ClientDto, ClientListDto и т.д.)
  index.ts        // Основной API-адаптер
```

---

## Ограничения и заметки

1. **Использование `@ts-ignore`**  
   В некоторых методах добавлены комментарии `@ts-ignore` из-за возможных особенностей проверки типов.  
   Убедитесь, что это действительно необходимо в вашей среде разработки, и удалите комментарии, если ошибки типов устранены.

2. **Отсутствие детальных тестов**  
   Рекомендуется написать тесты для критически важных методов (например, аутентификации и CRUD-операций над клиентами).

3. **Авторизация**  
   Если вы используете уже полученный токен, передавайте его вторым параметром в конструктор.  
   При каждом успешном вызове `authenticate(...)` токен будет перезаписан.

---

Разработано с использованием [TSDX](https://tsdx.io). Приятного использования!