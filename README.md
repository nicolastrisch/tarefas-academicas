# Tarefas Acadêmicas

Sistema web para organizar as tarefas acadêmicas do semestre (provas, trabalhos, leituras e fóruns) por disciplina, com painel de prazos, calendário mensal e histórico das tarefas concluídas.

Desenvolvido como Projeto Final do curso de Análise e Desenvolvimento de Sistemas da Unisinos.

## Tecnologias

- Back-end: C# com ASP.NET Core Web API (.NET 10), Entity Framework Core e autenticação JWT
- Banco de dados: PostgreSQL
- Front-end: Angular 21 com Angular Material

## Como rodar

### Banco de dados

Instale o PostgreSQL e crie o arquivo `backend/TarefasAcademicas.Api/appsettings.Development.json` a partir do `appsettings.Development.example.json`, preenchendo a senha do banco e uma chave para o JWT (pelo menos 32 caracteres).

### API

```
cd backend
dotnet tool install --global dotnet-ef
dotnet ef database update --project TarefasAcademicas.Api
dotnet run --project TarefasAcademicas.Api --launch-profile https
```

A API fica em `https://localhost:7170` e a documentação (Swagger) em `https://localhost:7170/swagger`.

### Front-end

```
cd frontend
npm install
npm start
```

Acesse `http://localhost:4200`.

## Estrutura

```
backend/
  TarefasAcademicas.Api/     API (Controllers, Services, Repositories, Models, DTOs, Data)
frontend/
  src/app/pages/             telas
  src/app/services/          comunicação com a API
  src/app/models/            interfaces dos dados
```
