# **Documentação da API - Pétala**

## **Sumário**
- [Cadastro de Usuário](#cadastro-de-usuário)

---

## **Cadastro de Usuário**

### **Endpoint**
- **URL**: `/api/users/register`
- **Método HTTP**: `POST`
- **Descrição**: Registra um novo usuário no sistema.

---

### **Headers**
| Key             | Value                |
|------------------|----------------------|
| Content-Type     | application/json    |

---

### **Body (JSON)**
| Campo     | Tipo    | Obrigatório | Descrição                                 | Exemplo             |
|-----------|---------|-------------|-------------------------------------------|---------------------|
| `name`    | string  | Sim         | Nome do usuário                          | "João da Silva"     |
| `email`   | string  | Sim         | Email único do usuário                   | "joao@example.com"  |
| `password`| string  | Sim         | Senha com no mínimo 8 caracteres, contendo pelo menos uma letra e um número. | "SenhaSegura123"    |

#### **Exemplo de Requisição**
```json
{
  "name": "João da Silva",
  "email": "joao@example.com",
  "password": "SenhaSegura123"
}
