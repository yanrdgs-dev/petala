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
```
---
### **Erros Comuns**
#### **1. E-mail já cadastrado**
- **Código**: `400 Bad Request`
- **Body**:
  ```json
  {
    "message": "E-mail já cadastrado."
  }
  ```
#### **2. Dados Inválidos**
- **Código**: `400 Bad Request`
- **Body**:
  ```json
  {
    "errors": [
      { "field": "email", "message": "Forneça um e-mail válido." },
      { "field": "password", "message": "A senha deve ter ao menos 8 caracteres." },
      { "field": "password", "message": "A senha deve conter pelo menos um número."},
      { "field": "password", "message": "A senha deve conter pelo menos uma letra." },
    ]
  }
  ```
  #### **3. Erro interno do Servidor**
  - **Código**: `500 Internal Server Error`
  - **Body**:
    ```json
    {
      "message": "Erro ao cadastrar usuário."
    }
    ```
## **Notas**
- Certifique de que o servidor está rodando antes de testar os endpoints.
- Use o Postman (ferramenta de API) para testar a API.
- A validação de senha garante: 8 caracteres, uma letra, um número.
# **Como Testar**
- Instale as dependências do projeto: `npm install`
- Inicie o servidor: `node app.js`
- Teste os endpoints usando o Postman.
