resource "azurerm_container_registry" "acr" {
  name                = var.acr_name
  resource_group_name = azurerm_resource_group.staging.name
  location            = azurerm_resource_group.staging.location
  sku                 = "Basic"
  admin_enabled       = true
}

output "acr_name" {
  value       = azurerm_container_registry.acr.name
  description = "ACR name"
}

output "acr_login_server" {
  value       = azurerm_container_registry.acr.login_server
  description = "ACR login server (e.g., name.azurecr.io)"
}
