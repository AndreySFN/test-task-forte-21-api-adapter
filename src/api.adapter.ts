// TODO: ts-ignores
import axios, { AxiosInstance } from 'axios';
import {ClientDto, ClientListDto} from './types';

export class ApiAdapter {
    private instance: AxiosInstance;
    private token: string | null = null;

    constructor(baseURL: string) {
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

    // Аутентификация
    // @ts-ignore
    async authenticate(username: string, password: string): Promise<string> {
        const response = await this.instance.post('/auth', { username, password });
        this.token = response.data.accessToken;
        return String(this.token);
    }

    // Получение списка клиентов
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

    // Получение клиента по ID
    // @ts-ignore
    async getClientById(id: string): Promise<ClientDto> {
        const response = await this.instance.get(`/clients/${id}`);
        return response.data;
    }

    // Получение общего количества клиентов
    // @ts-ignore
    async getTotalClients(search?: string): Promise<number> {
        const response = await this.instance.get('/clients/total', { params: { search } });
        return response.data.total;
    }

    // Создание нового клиента
    // @ts-ignore
    async createClient(client: ClientDto): Promise<ClientDto> {
        const response = await this.instance.post('/clients', client);
        return response.data;
    }

    // Обновление клиента по ID
    // @ts-ignore
    async updateClient(id: string, client: Partial<ClientDto>): Promise<ClientDto> {
        const response = await this.instance.put(`/clients/${id}`, client);
        return response.data;
    }

    // Удаление клиента по ID
    // @ts-ignore
    async deleteClient(id: string): Promise<{ message: string }> {
        const response = await this.instance.delete(`/clients/${id}`);
        return response.data;
    }
}
