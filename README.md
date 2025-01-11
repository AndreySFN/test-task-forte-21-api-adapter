# API Адаптер к тестовому заданию Форте 21

## Версия: 1.0.0

---

## Описание

`ApiAdapter` предоставляет интерфейс для взаимодействия с REST API сервера, реализованного в рамках тестового задания Форте 21. Адаптер реализованный с использованием библиотеки `axios`. Адаптер включает методы для аутентификации, управления клиентами, создания, обновления и удаления данных. Подходит для интеграции с бэкендом, поддерживающим JSON-формат данных.

---

## Установка

Установите пакет в ваш проект:

```bash
npm install test-task-forte-21-api-adapter
```

---

## Использование

```typescript
import { ApiAdapter } from 'test-task-forte-21-api-adapter';

// Создание экземпляра адаптера
const api = new ApiAdapter('https://api.example.com');

// Пример использования
async function main() {
    await api.authenticate('username', 'password'); // Аутентификация
    const clients = await api.getClients(); // Получение списка клиентов
    console.log(clients);
}
```

---

## Конструктор

### `constructor(baseURL: string)`

Создает экземпляр адаптера API.

- **Параметры**:
    - `baseURL` (string): Базовый URL API.

---

## Методы

### 1. Аутентификация

#### `async authenticate(username: string, password: string): Promise<string>`

Аутентифицирует пользователя и сохраняет токен для последующих запросов.

- **Параметры**:
    - `username` (string): Имя пользователя.
    - `password` (string): Пароль пользователя.
- **Возвращает**: Токен доступа (`string`).

---

### 2. Получение списка клиентов

#### `async getClients(query?: { search?: string; sortField?: string; sortOrder?: 'asc' | 'desc'; page?: number; limit?: number; }): Promise<{ data: ClientDto[]; total: number }>`

Возвращает список клиентов.

- **Параметры**:
    - `query` (опционально): Параметры фильтрации и сортировки.
        - `search` (string): Текст для поиска.
        - `sortField` (string): Поле для сортировки.
        - `sortOrder` ('asc' | 'desc'): Порядок сортировки.
        - `page` (number): Номер страницы.
        - `limit` (number): Количество записей на странице.
- **Возвращает**: Объект с данными клиентов и общим количеством.

---

### 3. Получение клиента по ID

#### `async getClientById(id: string): Promise<ClientDto>`

Возвращает данные клиента по идентификатору.

- **Параметры**:
    - `id` (string): Идентификатор клиента.
- **Возвращает**: Данные клиента (`ClientDto`).

---

### 4. Получение общего количества клиентов

#### `async getTotalClients(search?: string): Promise<number>`

Возвращает общее количество клиентов.

- **Параметры**:
    - `search` (string, опционально): Текст для поиска.
- **Возвращает**: Общее количество клиентов (`number`).

---

### 5. Создание клиента

#### `async createClient(client: ClientDto): Promise<ClientDto>`

Создает нового клиента.

- **Параметры**:
    - `client` (`ClientDto`): Объект клиента.
- **Возвращает**: Данные созданного клиента (`ClientDto`).

---

### 6. Обновление клиента по ID

#### `async updateClient(id: string, client: Partial<ClientDto>): Promise<ClientDto>`

Обновляет данные клиента.

- **Параметры**:
    - `id` (string): Идентификатор клиента.
    - `client` (Partial<ClientDto>): Обновленные данные клиента.
- **Возвращает**: Обновленные данные клиента (`ClientDto`).

---

### 7. Удаление клиента по ID

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
export interface ClientDto extends WithId {
    name: string;
    company: string;
    details: ClientDetailsDto;
}
```

### `ClientDetailsDto`

Представляет детализированные данные клиента.

```typescript
export interface ClientDetailsDto extends WithId {
    contact: string;
    about?: string;
    phoneNumber?: string;
}
```

### `WithId`

Базовый интерфейс для объектов с идентификатором.

```typescript
export interface WithId {
    _id?: string;
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

- Node.js: `>=10`
- TypeScript: `^5.7.3`

---

## Структура проекта

```plaintext
src/
  types/
    index.ts      // Типы данных (ClientDto, UserDto, WithId)
  utils/
    index.ts      // Утилиты
  index.ts        // Основной API-адаптер
```

---

## Ограничения

1. **Использование `@ts-ignore`**: В некоторых методах добавлены комментарии `@ts-ignore` из-за особенностей проверки типов. Убедитесь, что это необходимо, и удалите, если возможно.
2. **Отсутствие тестов**: Рекомендуется написать тесты для критически важных методов.

---

Разработано с использованием `TSDX`. 
