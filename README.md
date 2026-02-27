# projeto-boda

## Como executar o projeto

O projeto possui duas partes: backend (ASP.NET Core) e frontend (Angular). Veja abaixo as instruções para executar cada uma:

### Backend (.NET)

1. Instale o .NET SDK 9.0 ou superior.
2. No terminal, navegue até a pasta `backend`.
3. Execute o comando:
   ```
   dotnet run
   ```
4. A API estará disponível em `https://localhost:5001` ou `http://localhost:5000`.

### Frontend (Angular)

1. Instale o Node.js (recomendado versão 18 ou superior).
2. No terminal, navegue até a pasta `frontend`.
3. Instale as dependências:
   ```
   npm install
   ```
4. Execute o projeto Angular:
   ```
   npm start
   ```
5. O frontend estará disponível em `http://localhost:4200`.

### Observações

- Certifique-se de que o backend esteja rodando antes de acessar o frontend.
- As configurações de conexão e variáveis podem ser ajustadas nos arquivos `appsettings.json` (backend) e nos arquivos de ambiente do Angular (frontend).
