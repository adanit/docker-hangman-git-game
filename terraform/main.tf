# 🏗️ Git Game - Infraestrutura no Azure
# 🎓 Exemplo didático de Infrastructure as Code (IaC) com Terraform

# ⚙️ CONFIGURAÇÃO DO TERRAFORM
terraform {
  required_version = ">= 1.0"
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.0"
    }
  }
  
  # 📦 BACKEND: Onde guardar o state file (configurado via backend.tf ou CLI)
  backend "azurerm" {
    resource_group_name  = "rg-terraform-backend-gitgame"
    storage_account_name = "tfstategitgame11022026"
    container_name       = "tfstate"
    key                  = "gitgame.tfstate"
  }
}

# 🔐 PROVEDOR AZURE
provider "azurerm" {
  features {}
}

# 🎲 GERADOR DE SUFIXO ÚNICO
# Evita conflitos de nome entre alunos
resource "random_string" "suffix" {
  length  = 6
  special = false
  upper   = false
}

# 📦 1. RESOURCE GROUP 
# Organiza todos os recursos do projeto em um "container lógico"
resource "azurerm_resource_group" "gitgame" {
  name     = "rg-git-game"
  location = "East US"

  tags = {
    Project     = "GitGame"
    Purpose     = "DevOps Training"
    Environment = "Demo"
  }
}

# 🐳 2. CONTAINER REGISTRY
# Repositório privado para armazenar nossas imagens Docker
resource "azurerm_container_registry" "gitgame" {
  name                = "gitgame${random_string.suffix.result}"
  resource_group_name = azurerm_resource_group.gitgame.name
  location            = azurerm_resource_group.gitgame.location
  sku                 = "Basic"        # Tier mais econômico
  admin_enabled       = true           # Habilita autenticação por usuário/senha

  tags = {
    Project     = "GitGame"
    Purpose     = "DevOps Training"
    Environment = "Demo"
  }
}

# 🏗️ 3. CONTAINER GROUP
# ⭐ CONCEITO CHAVE: Containers no mesmo grupo compartilham rede (localhost)
resource "azurerm_container_group" "gitgame" {
  name                = "gitgame-app"
  location            = azurerm_resource_group.gitgame.location
  resource_group_name = azurerm_resource_group.gitgame.name
  ip_address_type     = "Public"
  dns_name_label      = "gitgame-${random_string.suffix.result}"
  os_type             = "Linux"

  # 💾 CONTAINER 1: Banco de Dados PostgreSQL
  container {
    name   = "postgres"
    image  = "${azurerm_container_registry.gitgame.login_server}/gitgame-db:latest"
    cpu    = "1.0"
    memory = "1.5"

    # ⚠️ IMPORTANTE: Sem ports{} = não acessível externamente
    # Outros containers acessam via localhost:5432

    environment_variables = {
      POSTGRES_DB       = "gitgame"
      POSTGRES_USER     = "gitgame"
      POSTGRES_PASSWORD = "gitgame123"
    }
  }

  # ⚡ CONTAINER 2: Backend API (FastAPI/Python)
  container {
    name   = "backend"
    image  = "${azurerm_container_registry.gitgame.login_server}/gitgame-backend:latest"
    cpu    = "1.0"
    memory = "1.5"

    ports {
      port     = 8000
      protocol = "TCP"
    }

    environment_variables = {
      # 🔗 Conexão com DB via localhost (mesma rede interna)
      DATABASE_URL = "postgresql://gitgame:gitgame123@localhost:5432/gitgame"
      FRONTEND_URL = "http://gitgame-${random_string.suffix.result}.eastus.azurecontainer.io"
    }
  }

  # 🎮 CONTAINER 3: Frontend (React + Nginx)
  container {
    name   = "frontend"
    image  = "${azurerm_container_registry.gitgame.login_server}/gitgame-frontend:latest"
    cpu    = "0.5"
    memory = "1.0"

    ports {
      port     = 80
      protocol = "TCP"
    }

    # ⚠️ NOTA: API URL é configurada em build-time (Docker ARG)
    # Não precisa de environment_variables aqui
  }

  # 🔐 Credenciais para baixar as imagens do registry
  image_registry_credential {
    server   = azurerm_container_registry.gitgame.login_server
    username = azurerm_container_registry.gitgame.admin_username
    password = azurerm_container_registry.gitgame.admin_password
  }

  tags = {
    Project   = "GitGame"
    Purpose   = "DevOps Training"
    Component = "Application Stack"
  }
}

# 📤 OUTPUTS (Informações importantes que queremos ver)
output "application_url" {
  description = "URL da aplicação Git Game"
  value       = "http://${azurerm_container_group.gitgame.fqdn}"
}

output "api_url" {
  description = "URL da API"
  value       = "http://${azurerm_container_group.gitgame.fqdn}:8000"
}

output "acr_login_server" {
  description = "Endereço do Container Registry"
  value       = azurerm_container_registry.gitgame.login_server
}

output "acr_admin_username" {
  description = "Usuário do Container Registry"
  value       = azurerm_container_registry.gitgame.admin_username
}

output "acr_admin_password" {
  description = "Senha do Container Registry"
  value       = azurerm_container_registry.gitgame.admin_password
  sensitive   = true  # Não mostra no log por segurança
}

output "random_suffix" {
  description = "Sufixo aleatório usado nos nomes dos recursos"
  value       = random_string.suffix.result
}