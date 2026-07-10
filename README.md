# 🛒 Sistema de Ponto de Venda (POS)

Sistema fullstack de gestão de ponto de venda desenvolvido com Java Spring Boot e React. A aplicação cobre o ciclo completo de operação de uma rede de lojas: desde o registro de vendas no caixa até a supervisão gerencial e administrativa multi-filial.

---

## 💡 Sobre o Desenvolvimento

Este projeto nasceu da vontade de aplicar, em um único sistema, os conceitos que venho estudando em backend com Java e frontend com React — indo além de CRUDs simples.

Algumas decisões técnicas que tomei durante o desenvolvimento:

- **RBAC com Spring Security**: optei por controle de acesso baseado em papéis (CAIXA, GERENTE, ADMIN) usando JWT, porque o sistema precisava de três painéis com permissões distintas e rotas protegidas por perfil.
- **Redux com 16 reducers**: o estado global do frontend ficou complexo rapidamente — carrinho, autenticação, estoque em tempo real, filiais. Separar em reducers específicos foi necessário para manter a previsibilidade do estado.
- **Integração com Stripe e Razorpay**: implementei os dois gateways para praticar integração com APIs de pagamento externas, tratando webhooks e confirmações assíncronas de pagamento.
- **Arquitetura multi-filial**: cada loja opera de forma isolada no estoque e nas vendas, mas o painel administrativo consolida os dados de todas as unidades. Isso exigiu um cuidado extra no design das queries e nos relacionamentos entre entidades.

---

## 🏗️ Arquitetura

```
Frontend (React + Redux)
        │
        ▼
    API REST
        │
        ▼
   Spring Boot
  (Controller → Service → Repository)
        │
        ▼
      MySQL
```

---

## 💻 Tecnologias

**Backend**
- Java 21
- Spring Boot 3
- Spring Security + JWT
- Spring Data JPA / Hibernate
- MySQL
- Maven

**Frontend**
- React
- Redux (16 reducers)
- shadcn/ui
- Axios

**Integrações**
- Stripe
- Razorpay

---

## 📱 Painéis da Aplicação

### 💰 Terminal do Caixa
Painel voltado ao operador para registro de vendas:
- Busca e adição de produtos ao carrinho
- Aplicação de descontos por item ou total
- Seleção de meio de pagamento (cartão, dinheiro, PIX, carteira digital)
- Emissão de recibo

### 📊 Dashboard do Gerente de Filial
Painel de supervisão da unidade:
- Acompanhamento de vendas em tempo real
- Controle de estoque com alertas de baixa
- Relatórios por turno e por dia
- Métricas de desempenho da loja

### 🏢 Painel Administrativo da Rede
Painel para o administrador geral:
- Gestão de múltiplas filiais
- Cadastro de produtos, categorias e funcionários
- Controle de permissões por perfil
- Visão consolidada das operações

---

## 🌐 Endpoints da API

### Autenticação
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/auth/login` | Autenticação e geração de token JWT |
| POST | `/auth/logout` | Invalidação do token |

### Lojas e Filiais
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/lojas` | Lista todas as filiais |
| POST | `/lojas` | Cadastra nova filial |
| PUT | `/lojas/{id}` | Atualiza dados da filial |
| DELETE | `/lojas/{id}` | Remove filial |

### Produtos e Estoque
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/produtos` | Lista produtos |
| POST | `/produtos` | Cadastra produto |
| PUT | `/produtos/{id}` | Atualiza produto |
| DELETE | `/produtos/{id}` | Remove produto |
| GET | `/estoque/alertas` | Lista produtos com estoque abaixo do mínimo |
| PATCH | `/estoque/{id}` | Atualiza quantidade em estoque |

### Pedidos
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/pedidos` | Lista todos os pedidos |
| GET | `/pedidos/{id}` | Busca pedido por ID |
| POST | `/pedidos` | Registra novo pedido |
| PATCH | `/pedidos/{id}/status` | Atualiza status do pedido |

### Pagamentos
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/pagamentos/stripe` | Processa pagamento via Stripe |
| POST | `/pagamentos/razorpay` | Processa pagamento via Razorpay |
| POST | `/pagamentos/webhook` | Recebe confirmações assíncronas dos gateways |

### Reembolsos
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/reembolsos` | Solicita reembolso de um pedido |
| GET | `/reembolsos/{id}` | Consulta status do reembolso |

### Relatórios
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/relatorios/vendas` | Resumo de vendas por período |
| GET | `/relatorios/filial/{id}` | Métricas por filial |
| GET | `/relatorios/turno` | Relatório de turno do operador |

### Clientes e Funcionários
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/clientes` | Lista clientes |
| POST | `/clientes` | Cadastra cliente |
| GET | `/funcionarios` | Lista funcionários |
| POST | `/funcionarios` | Cadastra funcionário |
| PUT | `/funcionarios/{id}` | Atualiza funcionário |

---

## 🚀 Como Executar

### Pré-requisitos
- Java 21
- Node.js 18+
- MySQL 8+
- Maven

### Backend

```bash
git clone https://github.com/SEU-USUARIO/pos-system.git
cd pos-system/backend
```

Crie o banco de dados:

```sql
CREATE DATABASE pos_system;
```

Configure `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/pos_system
spring.datasource.username=SEU_USUARIO
spring.datasource.password=SUA_SENHA

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

jwt.secret=SEU_SECRET
jwt.expiration=86400000

stripe.secret-key=SEU_SECRET_KEY
razorpay.key-id=SEU_KEY_ID
razorpay.key-secret=SEU_KEY_SECRET
```

Execute:

```bash
mvn spring-boot:run
```

API disponível em `http://localhost:8080`

### Frontend

```bash
cd pos-system/frontend
npm install
npm run dev
```

Frontend disponível em `http://localhost:5173`

---

## 🔒 Segurança

O arquivo `application.properties` não está no repositório. Crie-o localmente com suas próprias credenciais antes de executar.

Autenticação via JWT — o token deve ser enviado no header `Authorization: Bearer {token}` em todas as rotas protegidas.

---

## 🚀 Melhorias Futuras

- Testes automatizados (JUnit + Mockito)
- Documentação com Swagger/OpenAPI
- Deploy com Docker
- Sistema de pontos e fidelidade do cliente
- Notificações em tempo real com WebSocket

---

## 👨‍💻 Autor

Renato de Paiva Belarmino
