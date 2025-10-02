resource "azurerm_storage_account" "staging" {
  name                            = var.storage_account_name
  resource_group_name             = azurerm_resource_group.staging.name
  location                        = azurerm_resource_group.staging.location
  account_tier                    = "Standard"
  account_replication_type        = "LRS"
  allow_nested_items_to_be_public = false
}

resource "azurerm_storage_container" "product_images" {
  name                  = "product-images"
  storage_account_name  = azurerm_storage_account.staging.name
  container_access_type = "private"
}

output "storage_account_name" {
  value       = azurerm_storage_account.staging.name
  description = "Storage Account for staging"
}

output "storage_account_key" {
  value       = azurerm_storage_account.staging.primary_access_key
  description = "Primary access key"
  sensitive   = true
}

output "product_images_container" {
  value       = azurerm_storage_container.product_images.name
  description = "Blob container name"
}
